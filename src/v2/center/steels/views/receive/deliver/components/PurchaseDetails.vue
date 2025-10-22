<template>
	<div class="otherForm">
		<a-form :form="form">
			<a-table
				:columns="['RECEIVABLE_STEEL_BUY_002'].includes(contractTemplate) ? columnsBuy002 : columns"
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
							@search="handleSearchMaterialName"
							@blur="itemChange('materialName', record)"
							:key="record.id"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in selectList['materialName']"
								:key="item.text"
								:title="item.text"
								>{{ item.text }}</a-select-option
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
							@search="handleSearchSpecs"
							@blur="itemChange('specs', record)"
							:key="record.id"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in selectList['specs']"
								:key="item.text"
								:title="item.text"
								>{{ item.text }}</a-select-option
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
							@search="handleSearchMaterialTexture"
							@blur="itemChange('materialTexture', record)"
							:key="record.id"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in selectList['materialTexture']"
								:key="item.text"
								:title="item.text"
								>{{ item.text }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</template>
				<!-- 件数-->
				<span slot="customTitles6"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>件数</span
				>
				<template
					slot="pieceQuantity"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('pieceQuantity', record, record.errorShow['pieceQuantity']).validStatus">
						<a-input
							:key="record.id"
							placeholder="请输入件数"
							v-model.trim="record.pieceQuantity"
							:disabled="!editable"
							@blur="itemChange('pieceQuantity', record)"
						></a-input>
					</a-form-item>
				</template>

				<!-- 数量-->
				<span slot="customTitles4"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>数量（吨）</span
				>
				<template
					slot="quantity"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('quantity', record, record.errorShow['quantity']).validStatus">
						<a-input
							:key="record.id"
							placeholder="请输入数量"
							v-model.trim="record.quantity"
							:disabled="!editable"
							@blur="itemChange('quantity', record)"
						></a-input>
					</a-form-item>
				</template>

				<!-- 收货地址-->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>收货地址</span
				>
				<template
					slot="deliveryAddress"
					slot-scope="text, record"
				>
					<a-form-item
						:validate-status="getFieldStatus('deliveryAddress', record, record.errorShow['deliveryAddress']).validStatus"
					>
						<a-input
							:key="record.id"
							placeholder="请输入收货地址"
							v-model.trim="record.deliveryAddress"
							:disabled="!editable"
							@blur="itemChange('deliveryAddress', record)"
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
							style="color: var(--primary-color);font-size: 20px; margin-right: 15px; cursor: pointer"
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
import { API_GetSteelsCondition } from '@/v2/center/steels/api/contract.js';
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
	{ key: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' } },
	{ key: 'materialTexture', slots: { title: 'customTitles3' }, scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'quantity', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'quantity' } },
	{ key: 'deliveryAddress', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'deliveryAddress' } },
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
const columnsBuy002 = [
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
	{ key: 'pieceQuantity', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'pieceQuantity' } },
	{ key: 'quantity', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'quantity' } },
	{ key: 'deliveryAddress', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'deliveryAddress' } },
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
export default {
	name: 'OtherForm',
	data() {
		return {
			columns,
			columnsBuy002,
			getPopupContainer,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				materialName: [],
				specs: [],
				materialTexture: []
			},
			fetching: false,
			errorShow: {
				materialName: false,
				specs: false,
				materialTexture: false,
				quantity: false,
				deliveryAddress: false
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
				}
			],
			saveData: [],
			selected: this.selectedData,
			sameFlag: false // 判断是否有相同材质的
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
		contractTemplate: {
			// 合同模板
			type: String
		}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			}
		}
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标准
		this.conditionTypeKey.forEach(item => {
			let obj = {};
			obj.type = item.type;
			this.getSteelsCondition(obj, item.key);
		});
		this.updateData(this.selected);
	},
	methods: {
		updateData(data) {
			// 时刻更新选中数据
			if (data && data.length === 0) {
				this.selected = [
					{
						id: new Date().getTime(),
						materialName: undefined, //物资名称
						specs: undefined, //规格
						materialTexture: undefined, //材质
						quantity: '', //数量
						deliveryAddress: '', //预设含税单价（元/吨）
						dirty: {
							//验证项是否验证标记（脏值）
							materialName: 1, //物资名称
							specs: 1, //规格
							materialTexture: 1, //材质
							quantity: 1, //数量
							deliveryAddress: 1 //预设含税单价（元/吨）
						},
						errorShow: {
							materialName: false,
							specs: false,
							materialTexture: false,
							quantity: false,
							deliveryAddress: false
						} // 展示错误信息
					}
				];
				return;
			}
			this.selected = data;
			this.selected.forEach(item => {
				item.deliveryAddress = item.deliveryAddress || '';
				item.errorShow = {
					materialName: false,
					specs: false,
					materialTexture: false,
					quantity: false,
					deliveryAddress: false
				};
				item.dirty = {
					//验证项是否验证标记（脏值）
					materialName: 1, //物资名称
					specs: 1, //规格
					materialTexture: 1, //材质
					quantity: 1, //数量
					deliveryAddress: 1 //预设含税单价（元/吨）
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
				quantity: '', //数量
				deliveryAddress: '', //预设含税单价（元/吨）
				dirty: {
					//验证项是否验证标记（脏值）
					materialName: 1, //物资名称
					specs: 1, //规格
					materialTexture: 1, //材质
					quantity: 1, //数量
					deliveryAddress: 1 //预设含税单价（元/吨）
				},
				errorShow: {
					materialName: false,
					specs: false,
					materialTexture: false,
					quantity: false,
					deliveryAddress: false
				} // 展示错误信息
			};
			this.selected.splice(index + 1, 0, emptyRow);
		},
		getSteelsCondition(obj, type) {
			API_GetSteelsCondition(obj).then(res => {
				if (res.success) {
					this.fetching = false;
					this.selectList[type] = res.result || [];
				}
			});
		},
		handleSearchMaterialName(name) {
			//获取物资名称
			let obj = {
				type: 'steel_material_name',
				condition: name
			};
			this.fetching = true;
			this.getSteelsCondition(obj, 'materialName');
		},
		handleSearchSpecs(name) {
			//规格
			let obj = {
				type: 'steel_spec',
				condition: name
			};
			this.fetching = true;
			this.getSteelsCondition(obj, 'specs');
		},
		handleSearchMaterialTexture(name) {
			//材质
			let obj = {
				type: 'steel_material_texture',
				condition: name
			};
			this.fetching = true;
			this.getSteelsCondition(obj, 'materialTexture');
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
						this.$message.error('数量不超过10000000吨，最多四位小数');
						this.getFieldStatus('quantity', record, record.errorShow[name]);
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
				item.dirty = {
					//验证项是否验证标记（脏值）
					materialName: 0, //物资名称
					specs: 0, //规格
					materialTexture: 0, //材质
					quantity: 0, //数量
					deliveryAddress: 0 //预设含税单价（元/吨）
				};
				this.saveData.push(item);
			});
			//服务项表单验证
			let isPass = true;
			for (let project of this.saveData) {
				for (let pro in project) {
					if (this.getFieldStatus(pro, project, project.errorShow[pro]).validStatus !== 'success') {
						this.itemChange(pro, project);
						if (project.errorShow[pro]) {
							this.$message.error(
								pro === 'quantity' ? '数量不超过10000000吨，最多四位小数' : '单价不超过10000000元/吨，最多两位小数'
							);
						} else {
							this.$message.error('采购明细表内选项必填');
						}
						isPass = false;
						break;
					} else {
						isPass = true;
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
</style>
