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
				<!-- 收货件数-->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>收货件数</span
				>
				<template
					slot="receivePieceQuantity"
					slot-scope="text, record"
					class="special"
				>
					<a-form-item
						:validate-status="
							getFieldStatus('receivePieceQuantity', record, record.errorShow['receivePieceQuantity']).validStatus
						"
					>
						<a-input
							:key="record.id"
							placeholder="请输入收货件数"
							v-model.trim="record.receivePieceQuantity"
							:disabled="!editable"
							@blur="itemChange('receivePieceQuantity', record)"
						></a-input>
					</a-form-item>
				</template>
				<!-- 收货数量（吨）-->
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>收货数量(吨)</span
				>
				<template
					slot="receiveQuantity"
					slot-scope="text, record"
					class="special"
				>
					<a-form-item
						:validate-status="getFieldStatus('receiveQuantity', record, record.errorShow['receiveQuantity']).validStatus"
					>
						<a-input
							:key="record.id"
							placeholder="请输入收货数量（吨)"
							v-model.trim="record.receiveQuantity"
							:disabled="!editable"
							@blur="itemChange('receiveQuantity', record)"
						></a-input>
					</a-form-item>
				</template>
			</a-table>
		</a-form>
	</div>
</template>

<script>
import { API_GetSteelsCondition } from '@/v2/center/steels/api/contract.js';
const columns = [
	{
		title: '序号',
		fixed: 'left',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '物资名称', dataIndex: 'materialName', key: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ title: '规格', dataIndex: 'specs', key: 'specs', scopedSlots: { customRender: 'specs' } },
	{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ title: '发货件数', dataIndex: 'pieceQuantity', key: 'pieceQuantity', scopedSlots: { customRender: 'pieceQuantity' } },
	{ title: '发货数量（吨）', dataIndex: 'quantity', key: 'quantity', scopedSlots: { customRender: 'quantity' } },
	{ title: '收货地址', dataIndex: 'deliveryAddress', key: 'deliveryAddress', scopedSlots: { customRender: 'deliveryAddress' } },
	{ key: 'receivePieceQuantity', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'receivePieceQuantity' } },
	{ key: 'receiveQuantity', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'receiveQuantity' } }
];
export default {
	name: 'OtherForm',
	data() {
		return {
			columns,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				materialName: [],
				specs: [],
				materialTexture: [],
				receiveQuantity: [],
				receivePieceQuantity: []
			},
			fetching: false,
			errorShow: {
				materialName: false,
				specs: false,
				materialTexture: false,
				quantity: false,
				deliveryAddress: false,
				receiveQuantity: false,
				receivePieceQuantity: false
			}, // 展示错误信息
			saveData: [],
			selected: this.selectedData
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
		steelType: {
			type: String,
			default: ''
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
						receiveQuantity: '',
						receivePieceQuantity: '',
						dirty: {
							//验证项是否验证标记（脏值）
							materialName: 1, //物资名称
							specs: 1, //规格
							materialTexture: 1, //材质
							quantity: 1, //数量
							deliveryAddress: 1, //预设含税单价（元/吨）
							receiveQuantity: 1,
							receivePieceQuantity: 1
						},
						errorShow: {
							materialName: false,
							specs: false,
							materialTexture: false,
							quantity: false,
							deliveryAddress: false,
							receiveQuantity: false,
							receivePieceQuantity: false
						} // 展示错误信息
					}
				];
				return;
			}
			this.selected = data;
			this.selected.forEach(item => {
				(item.receiveQuantity = item.receiveQuantity || ''),
					(item.receivePieceQuantity = item.receivePieceQuantity || item.pieceQuantity);
				item.errorShow = {
					materialName: false,
					specs: false,
					materialTexture: false,
					quantity: false,
					deliveryAddress: false,
					receiveQuantity: false,
					receivePieceQuantity: false
				};
				item.dirty = {
					//验证项是否验证标记（脏值）
					materialName: 1, //物资名称
					specs: 1, //规格
					materialTexture: 1, //材质
					quantity: 1, //数量
					deliveryAddress: 1, //预设含税单价（元/吨）
					receiveQuantity: 1,
					receivePieceQuantity: 1
				};
			});
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
			if (record.hasOwnProperty('dirty')) {
				record.dirty[name] = 0;
			}
			if (name === 'receiveQuantity') {
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
						this.getFieldStatus(name, record, record.errorShow[name]);
						this.$message.error('不超过1000万，最多四位小数');
						record.errorShow[name] = true;
					} else if (record.receiveQuantity > record.quantity) {
						this.getFieldStatus(name, record, record.errorShow[name]);
						this.$message.error('收货数量不能大于发货数量');
						record.errorShow[name] = true;
					} else {
						record.errorShow[name] = false;
					}
				} else {
					this.getFieldStatus(name, record, record.errorShow[name]);
				}
			}
			if (name === 'receivePieceQuantity') {
				if (record[name]) {
					if (record.receivePieceQuantity > record.pieceQuantity) {
						this.getFieldStatus(name, record, record.errorShow[name]);
						this.$message.error('收货件数不能大于发货件数');
						record.errorShow[name] = true;
					} else {
						record.errorShow[name] = false;
					}
				} else {
					this.getFieldStatus(name, record, record.errorShow[name]);
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
					deliveryAddress: 0, //预设含税单价（元/吨）
					receiveQuantity: 0,
					receivePieceQuantity: 0
				};
				this.saveData.push(item);
			});
			//服务项表单验证
			// let isPass = true
			let errorKeys = [];
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
						// isPass = false
						errorKeys = [...errorKeys, pro];
						break;
					}
				}
			}
			if (errorKeys.length <= 0) {
				return this.saveData;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.detailsTable {
	.ant-input {
		width: 200px;
	}
	.ant-form-item {
		margin-bottom: 0;
	}
}
</style>
