<template>
	<div class="otherForm">
		<a-row>
			<h3 style="margin: 30px 0">采购明细表</h3>
		</a-row>
		<a-form :form="form">
			<a-table
				:columns="columns"
				:scroll="{ x: true }"
				:dataSource="selected"
				:pagination="false"
				rowKey="id"
				:class="editable ? '' : 'disabled'"
				class="detailsTable"
			>
				<!-- 物资名称-->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>物资名称/材质/规格</span
				>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else :validate-status="getFieldStatus('materialName', record, record.errorShow['materialName']).validStatus">
						<a-cascader
							:options="cascadeList"
							placeholder="请选择"
							@change="changeCascade(record)"
							v-model="record.calendar"
						/>
					</a-form-item>
				</template>
				<!-- 质量标准-->
				<span slot="customTitles4"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>质量标准</span
				>
				<template
					slot="qualityStandard"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item
						v-else
						:validate-status="getFieldStatus('qualityStandard', record, record.errorShow['qualityStandard']).validStatus"
					>
						<a-select
							class="special"
							placeholder="请输入质量标准"
							v-model="record.qualityStandard"
							show-search
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							@search="handleSearchQualityStandard"
							@blur="itemChange('qualityStandard', record)"
							:key="record.id"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in selectList['qualityStandard']"
								:key="item.text"
								:title="item.text"
								>{{ item.text }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</template>

				<!-- 数量-->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>数量（吨）</span
				>
				<template
					slot="quantity"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'">{{ record.quantity }}</div>
					<a-form-item v-else :validate-status="getFieldStatus('quantity', record, record.errorShow['quantity']).validStatus">
						<a-input
							placeholder="请输入数量"
							v-model.trim="record.quantity"
							:disabled="!editable"
							@blur="itemChange('quantity', record)"
							:key="record.id"
						></a-input>
					</a-form-item>
				</template>

				<!-- 预设含税单价（元/吨）-->
				<span slot="customTitles6"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>预设含税单价（元/吨）</span
				>
				<template
					slot="presetUnitPrice"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item
						v-else
						:validate-status="getFieldStatus('presetUnitPrice', record, record.errorShow['presetUnitPrice']).validStatus"
					>
						<a-input
							placeholder="请输入预设含税单价"
							v-model.trim="record.presetUnitPrice"
							:disabled="!editable"
							:key="record.id"
							@blur="itemChange('presetUnitPrice', record)"
						></a-input>
					</a-form-item>
				</template>

				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="editable && index != selected.length - 1"
				>
					<span @click="addRow(index)">
						<a-icon
							type="plus-circle"
							style="color: var(--primary-color); font-size: 20px; margin-right: 15px; cursor: pointer"
					/></span>
					<span
						v-if="index > 0"
						@click="removeRow(index)"
						><a-icon
							type="minus-circle"
							style="color: red; font-size: 20px; cursor: pointer"
					/></span>
				</template>
			</a-table>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory';
// import {
// 	API_GetSteelsCondition,
//     getMaterialCategory
// } from "api/steels";
import { API_GetSteelsCondition, getMaterialCategory } from '@/v2/center/steels/api/contract.js';
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		}
	},
	{ key: 'materialName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'materialName' } },
	{ key: 'qualityStandard', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'qualityStandard' } },
	{ key: 'quantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'quantity' } },
	{ key: 'presetUnitPrice', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'presetUnitPrice' } },
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
import { cloneDeep } from 'lodash';
export default {
	name: 'OtherForm',
	data() {
		return {
			columns,
			getPopupContainer,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				materialName: [],
				specs: [],
				materialTexture: [],
				qualityStandard: []
			},
			fetching: false,
			errorShow: {
				materialName: false,
				specs: false,
				materialTexture: false,
				qualityStandard: false,
				quantity: false,
				presetUnitPrice: false
			}, // 展示错误信息
			conditionTypeKey: [
				{
					type: 'steel_material_name',
					key: 'materialName'
				},
				{
					type: 'steel_spec',
					key: 'specs'
				},
				{
					type: 'steel_material_texture',
					key: 'materialTexture'
				},
				{
					type: 'steel_quality_standard',
					key: 'qualityStandard'
				}
			],
			saveData: [],
			selected: [],
			sameFlag: false, // 判断是否有相同材质的
			// 级联
			cascadeList: []
		};
	},
	props: {
		selectedData: {
			// 被选中的指标
			type: Array,
			required: false,
			default: function () {
				return [];
			}
		},
		editable: {
			// 是否可编辑
			type: Boolean
		},
		// 钢材种类
		steelType: {},
		// 是否指定规格
		appointSpec: {}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			}
		},
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标
		this.getMaterialCategory();
		this.updateData(this.selectedData);
		this.handleSearchQualityStandard('');
	},
	methods: {
		updateData(newData) {
			let data = cloneDeep(newData)
			// 时刻更新选中数据
			if (data && data.length === 0) {
				this.selected = [
					{
						id: new Date().getTime(),
						materialName: undefined, //物资名称
						specs: undefined, //规格
						materialTexture: undefined, //材质
						qualityStandard: undefined, //质量标准
						quantity: '', //数量
						calendar: [],
						presetUnitPrice: '', //预设含税单价（元/吨）
						dirty: {
							//验证项是否验证标记（脏值）
							materialName: 1, //物资名称
							specs: 1, //规格
							materialTexture: 1, //材质
							qualityStandard: 1, //质量标准
							quantity: 1, //数量
							presetUnitPrice: 1 //预设含税单价（元/吨）
						},
						errorShow: {
							materialName: false,
							specs: false,
							materialTexture: false,
							qualityStandard: false,
							quantity: false,
							presetUnitPrice: false
						}
					}
				];
				this.selected.push({ 
					transferQuantity: '总计',
					quantity: '', //数量
				});
				// 计算总计
				this.computedTotal();
				this.$forceUpdate();
				return;
			}
			this.selected = data;
			this.selected.forEach(item => {
				item.materialName = Array.isArray(item.materialName) ? item.materialName.join(',') : item.materialName;
				item.calendar = [item.materialName, item.materialTexture, item.specs];
				item.errorShow = {
					materialName: false,
					specs: false,
					materialTexture: false,
					qualityStandard: false,
					quantity: false,
					presetUnitPrice: false
				};
			});
			this.selected.push({ 
				transferQuantity: '总计',
				quantity: '', //数量
			});
			// 计算总计
			this.computedTotal();
			this.$forceUpdate();
		},
		computedTotal() {
			const lastItem = this.selected[this.selected.length - 1];
			let quantity = 0
			this.selected.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					quantity += +(el.quantity || 0);
				}
			});
			lastItem.quantity = quantity.toFixed(4);
			this.$forceUpdate();
		},
		//删除行
		removeRow(index) {
			let that = this;
			that.$confirm({
				centered: true,
				title: '确定要删除该物资记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					that.selected.splice(index, 1);
				},
				onCancel() {}
			});
		},
		//添加行
		addRow(index = 0) {
			let emptyRow = {
				id: new Date().getTime(),
				materialName: undefined, //物资名称
				specs: undefined, //规格
				materialTexture: undefined, //材质
				qualityStandard: undefined, //质量标准
				quantity: '', //数量
				presetUnitPrice: '', //预设含税单价（元/吨）
				dirty: {
					//验证项是否验证标记（脏值）
					materialName: 1, //物资名称
					specs: 1, //规格
					materialTexture: 1, //材质
					qualityStandard: 1, //质量标准
					quantity: 1, //数量
					presetUnitPrice: 1 //预设含税单价（元/吨）
				},
				errorShow: {
					materialName: false,
					specs: false,
					materialTexture: false,
					qualityStandard: false,
					quantity: false,
					presetUnitPrice: false
				}
			};
			this.selected.splice(index + 1, 0, emptyRow);
		},
		changeCascade(item) {
			const arr = item.calendar;
			item.materialName = arr[0];
			item.materialTexture = arr[1];
			item.specs = arr[2];
			this.$forceUpdate();
		},
		getSteelsCondition(obj, type) {
			API_GetSteelsCondition(obj).then(res => {
				if (res.success) {
					this.fetching = false;
					this.selectList[type] = res.result || [];
				}
			});
		},

		handleSearchQualityStandard(name) {
			//质量标准
			let obj = {
				type: 'steel_quality_standard',
				condition: name
			};
			this.fetching = true;
			this.getSteelsCondition(obj, 'qualityStandard');
		},

		//修改表单项脏值
		itemChange(name, record) {
			// 校验特殊要求字段--数量不超过10000000吨，最多两位小数  单价不超过10000000元/吨，最多两位小数
			if (record.hasOwnProperty('dirty')) {
				record.dirty[name] = 0;
			}
			if (name === 'quantity') {
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
						record.errorShow[name] = true;
						if (name === 'quantity') {
							this.$message.error('数量不超过10000000吨，最多四位小数');
							this.getFieldStatus('quantity', record, record.errorShow[name]);
						}
					} else {
						record.errorShow[name] = false;
					}
					this.computedTotal();
					this.$forceUpdate();
				}
			}
			if (name === 'presetUnitPrice') {
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
						record.errorShow[name] = true;
						if (name === 'presetUnitPrice') {
							this.$message.error('单价不超过10000000元/吨，最多两位小数');
							this.getFieldStatus('presetUnitPrice', record, record.errorShow[name]);
						}
					} else {
						record.errorShow[name] = false;
					}
				}
			}
			this.$forceUpdate();
		},
		getFieldStatus(name, record, errorShow) {
			// 校验表格字段
			if (record.dirty && record.dirty[name] !== 0) {
				return {
					validStatus: 'success'
				};
			} else {
				return {
					validStatus: record[name] ? (errorShow ? 'error' : 'success') : 'error'
				};
			}
		},
		save() {
			// 外部父组件保存调用 errorShow-false不展示错误，true展示校验错误
			this.saveData = [];
			let newSelectedArr = this.selected.slice(0, this.selected.length - 1);
			newSelectedArr.forEach(item => {
				item.dirty = {
					//验证项是否验证标记（脏值）
					materialName: 0, //物资名称
					specs: 0, //规格
					materialTexture: 0, //材质
					qualityStandard: 0, //质量标准
					quantity: 0, //数量
					presetUnitPrice: 0 //预设含税单价（元/吨）
				};
				this.saveData.push(item);
			});
			//服务项表单验证
			let isPass = true;
			for (let project of this.saveData) {
				for (let pro in project) {
					if (this.getFieldStatus(pro, project, project.errorShow[pro]).validStatus !== 'success') {
						if (project.errorShow[pro]) {
							this.$message.error(
								pro === 'quantity' ? '数量不超过10000000吨，最多四位小数' : '单价不超过10000000元/吨，最多两位小数'
							);
						} else {
							this.$message.error('采购明细表内选项必填');
						}
						isPass = isPass && false;
						break;
					} else {
						isPass = isPass && true;
					}
				}
			}
			this.sameFlag = false;
			//失去焦点后---同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
			if (newSelectedArr.length > 1) {
				for (let i = 0; i < newSelectedArr.length; i++) {
					let first = newSelectedArr[i];
					for (let j = i + 1; j < newSelectedArr.length; j++) {
						let obj = newSelectedArr[j];
						if (
							first.materialName &&
							first.specs &&
							first.materialTexture &&
							first.materialName === obj.materialName &&
							first.specs === obj.specs &&
							first.materialTexture === obj.materialTexture
						) {
							this.$message.error('同一个物资，不允许新增多条同属性记录');
							this.sameFlag = this.sameFlag || true;
							break;
						} else {
							this.sameFlag = this.sameFlag || false;
						}
					}
				}
			}
			//同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
			if (this.sameFlag) {
				this.$message.error('同一个物资，不允许新增多条同属性记录');
				return;
			}

			if (isPass) {
				return this.saveData;
			}
		},
		// 获取品名级联数据
		async getMaterialCategory(materialName) {
			const params = {
				steelType: Array.isArray(this.steelType) ? this.steelType?.join(',') : this.steelType
			};
			const res = await getMaterialCategory(params);
			const materialNameList = res.data[0].materialNameList || [];
			materialNameList.forEach(el => {
				el.value = el.materialName;
				el.label = el.materialName;
				el.materialTextureList.forEach(el2 => {
					el2.value = el2.materialTexture;
					el2.label = el2.materialTexture;
					el2.specsList.forEach(el3 => {
						el3.value = el3.specs;
						el3.label = el3.specs;
					});
					el2.children = el2.specsList;
				});
				el.children = el.materialTextureList;
			});
			this.cascadeList = materialNameList;
		}
	}
};
</script>

<style lang="less" scoped>
.detailsTable {
	.ant-input {
		width: 120px;
	}
	.ant-select {
		width: 150px;
	}
	.ant-select.special {
		width: 260px;
	}
	.ant-form-item {
		margin-bottom: 0;
	}
}
</style>
