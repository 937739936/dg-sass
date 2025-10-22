<template>
	<div class="otherForm">
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
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>物资名称</span
				>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('materialName', record, record.errorShow['materialName']).validStatus">
						<a-select
							placeholder="请输入物资名称"
							v-model="record.materialName"
							show-search
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							:key="record.id"
							:options="cascadeList"
							@change="changeCascade(record)"
							@blur="itemChange('materialName', record)"
						>
						</a-select>
					</a-form-item>
				</template>
				<!-- 规格-->
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>规格</span
				>
				<template
					slot="specs"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('specs', record, record.errorShow['specs']).validStatus">
						<a-select
							placeholder="请输入规格"
							v-model="record.specs"
							show-search
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							:key="record.id"
							:options="cascadeListSpecs"
							@change="changeCascadeMaterialSpec(record)"
							@blur="itemChange('specs', record)"
						>
						</a-select>
					</a-form-item>
				</template>
				<!-- 材质-->
				<span slot="customTitles3"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>材质</span
				>
				<template
					slot="materialTexture"
					slot-scope="text, record"
				>
					<a-form-item
						:validate-status="getFieldStatus('materialTexture', record, record.errorShow['materialTexture']).validStatus"
					>
						<a-select
							class="special"
							placeholder="请输入材质"
							v-model="record.materialTexture"
							show-search
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							:options="cascadeListMaterial"
							:key="record.id"
							@change="changeCascadeMaterialTexture(record)"
							@blur="itemChange('materialTexture', record)"
						>
						</a-select>
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
					<a-form-item
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
							:key="record.id"
							@blur="itemChange('qualityStandard', record)"
						>
							<a-select-option
								v-for="item in steelQualityStandardList"
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
					<a-form-item :validate-status="getFieldStatus('quantity', record, record.errorShow['quantity']).validStatus">
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
					<a-form-item
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
					v-if="editable"
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
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GetSteelsCondition, getMaterialCategory } from '@/v2/center/steels/api/contract.js';
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ key: 'materialName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'materialName' } },
	{ key: 'materialTexture', slots: { title: 'customTitles3' }, scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' } },
	{ key: 'qualityStandard', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'qualityStandard' } },
	{ key: 'quantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'quantity' } },
	{ key: 'presetUnitPrice', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'presetUnitPrice' } },
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
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
			selected: this.selectedData,
			sameFlag: false, // 判断是否有相同材质的
			cascadeList: [],
			cascadeListMaterial: [],
			cascadeListSpecs: [],
			cascadeListPlace: [],
			steelQualityStandardList: []
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
		appointSpec: {
			default: ''
		},
		agreementDetail: {
			default: () => {}
		}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			}
		},
		agreementDetail: {
			handler(val) {
				this.getMaterialCategory(val.steelType);
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标准
		this.getSteelsCondition();
		this.updateData(this.selected);
	},
	methods: {
		getSteelsCondition() {
			API_GetSteelsCondition({
				type: 'steel_quality_standard'
			}).then(res => {
				if (res.success) {
					this.steelQualityStandardList = res.result;
				}
			});
		},
		// 获取质量标准
		changeCascadeMaterialSpec(item) {
			this.cascadeListPlace = this.cascadeListSpecs.filter(texture => texture.value === item.specs)[0].children;
		},
		// 获取规格
		changeCascadeMaterialTexture(item) {
			this.cascadeListSpecs = this.cascadeListMaterial.filter(texture => texture.value === item.materialTexture)[0].children;
			item.specs = '';
		},
		// 获取材质
		changeCascade(item) {
			this.cascadeListMaterial = this.cascadeList.filter(material => material.value === item.materialName)[0].children;
			item.specs = '';
			item.materialTexture = '';
			item.qualityStandard = '';
		},
		async getMaterialCategory(steelType) {
			if (!steelType) return;
			const params = {
				steelType: Array.isArray(steelType) ? steelType?.join(',') : steelType
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
			if (this.selectedData.length) {
				this.cascadeListMaterial = this.cascadeList.filter(
					material => material.value === this.selectedData[0].materialName[0]
				)[0].children;
				this.cascadeListSpecs = this.cascadeListMaterial.filter(
					texture => texture.value === this.selectedData[0].materialTexture
				)[0].children;
			}
		},
		updateData(data) {
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
				return;
			}
			this.selected = data;
			this.selected.forEach((item, index) => {
				item.id = index;
				item.errorShow = {
					materialName: false,
					specs: false,
					materialTexture: false,
					qualityStandard: false,
					quantity: false,
					presetUnitPrice: false
				};
			});
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
		//修改表单项脏值
		itemChange(name, record) {
			this.sameFlag = false;
			//失去焦点后---同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
			if (this.selected.length > 1) {
				for (let i = 0; i < this.selected.length; i++) {
					let first = this.selected[i];
					for (let j = i + 1; j < this.selected.length; j++) {
						let obj = this.selected[j];
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
			this.selected.forEach(item => {
				item.materialName = Array.isArray(item.materialName) ? item.materialName : [item.materialName];
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
			//失去焦点后---同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
			this.sameFlag = false;
			if (this.selected.length > 1) {
				for (let i = 0; i < this.selected.length; i++) {
					let first = this.selected[i];
					for (let j = i + 1; j < this.selected.length; j++) {
						let obj = this.selected[j];
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
.otherForm {
	margin: 20px 0;
}
</style>
