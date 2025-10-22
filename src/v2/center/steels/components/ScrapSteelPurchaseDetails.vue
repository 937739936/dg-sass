<template>
	<div class="otherForm">
		<a-row v-if="!isNeedDeliveryAddress">
			<h3 style="margin: 30px 0">采购明细表</h3>
			<!-- {{ selected }} -->
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
				<span slot="customTitles1">
					<i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>品种
				</span>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else :validate-status="getFieldStatus('materialName', record, record.errorShow['materialName']).validStatus">
						<a-input
							placeholder="请输入品种"
							v-model.trim="record.materialName"
							:disabled="!editable"
							@blur="itemChange('materialName', record)"
							:key="record.id"
						></a-input>
						<!-- <a-select
                            placeholder="请输入品种"
                            v-model="record.materialName"
                            show-search
                            :default-active-first-option="false"
                            :filter-option="false"
                            :not-found-content="fetching ? undefined : null"
                            @search="handleSearchMaterialName"
                            @blur="itemChange('materialName',record)"
                            :key="record.id">
                            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                            <a-select-option
                                v-for="(item) in selectList['materialName']"
                                :key="item.text"
                                :title="item.text">{{item.text}}</a-select-option>
                        </a-select> -->
					</a-form-item>
				</template>

				<!-- 数量-->
				<span slot="customTitles5">
					<i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>
					数量（吨）
				</span>
				<template
					slot="quantity"
					slot-scope="text, record, index"
				>
					<div v-if="record.transferQuantity == '总计' && ((selected[index] && !selected[index].acceptancePrevail) || !isNeedAcceptancePrevail)">{{record.quantity}}</div>
					<template v-else>
						<a-col
							span="16"
							v-if="isNeedAcceptancePrevail"
						>
							<a-form-item>
								<a-radio-group
									v-model.trim="record.acceptancePrevail"
									:disabled="!editable"
									:key="record.id"
									@change="(e)=>{handleChangeQuantity(e,record)}"
								>
									<a-radio :value="false">自定义数值</a-radio>
									<a-radio :value="true">以验收数量为准</a-radio>
								</a-radio-group>
							</a-form-item>
						</a-col>

						<a-form-item
							v-if="(selected[index] && !selected[index].acceptancePrevail) || !isNeedAcceptancePrevail"
							:validate-status="getFieldStatus('quantity', record, record.errorShow['quantity']).validStatus"
						>
							<a-input
								placeholder="请输入数量"
								v-model.trim="record.quantity"
								:disabled="!editable"
								@blur="itemChange('quantity', record)"
								:key="record.id"
							></a-input>
						</a-form-item>
					</template>
				</template>

				<!-- 预设含税单价（元/吨）-->
				<span slot="customTitles6">
					<i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>预设含税单价（元/吨）
				</span>
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

				<!-- 收货地址-->
				<span slot="customTitles7"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>收货地址</span
				>
				<template
					slot="deliveryAddress"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item
						v-else
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
import { API_GetSteelsCondition } from '@/v2/center/steels/api';
import { cloneDeep } from 'lodash';

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
	// { key: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' }},
	// { key: 'materialTexture', slots: { title: 'customTitles3' }, scopedSlots: { customRender: 'materialTexture' }},
	// { key: 'qualityStandard', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'qualityStandard' }},
	{ key: 'quantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'quantity' } }
	// { title: '操作', dataIndex: 'action', key: 'action',fixed: 'right', scopedSlots:{customRender:'action'}, width: 100 }
];
export default {
	name: 'ScrapSteelPurchaseDetails',
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
				presetUnitPrice: false,
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
				},
				{
					type: 'steel_quality_standard',
					key: 'qualityStandard'
				}
			],
			saveData: [],
			selected: [],
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
		isNeedDeliveryAddress: {
			type: Boolean,
			default: false
		},
		isNeedAcceptancePrevail: {
			type: Boolean,
			default: true
		},
		isNeedPresetUnitPrice: {
			type: Boolean,
			default: true
		},
		type: {
			default: '' // sellSupplement来自销售补录
		},
	},
	watch: {
		selectedData: {
			handler(v) {
				console.log('v', v);
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
		this.updateData(this.selectedData);
		if (this.isNeedPresetUnitPrice) {
			this.columns = [
				...this.columns,
				{ key: 'presetUnitPrice', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'presetUnitPrice' } }
			];
		}
		if (this.isNeedDeliveryAddress) {
			this.columns = [
				...this.columns,
				{ key: 'deliveryAddress', slots: { title: 'customTitles7' }, scopedSlots: { customRender: 'deliveryAddress' } }
			];
		}
		this.columns = [
			...this.columns,
			{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
		];
	},
	methods: {
		handleChangeQuantity(e,record) {
			if (e?.target.value) {
				this.$set(record, 'quantity', 0);
				this.computedTotal();
				this.$forceUpdate();
			}
		},
		updateData(newData) {
			let data = cloneDeep(newData)
			// 时刻更新选中数据
			if (data && data.length === 0) {
				this.selected = [
					{
						id: new Date().getTime(),
						acceptancePrevail: false,
						materialName: undefined, //物资名称
						deliveryAddress: '', // 收货地址
						presetUnitPrice: '', //预设含税单价（元/吨）
						quantity: '', //数量

						dirty: {
							//验证项是否验证标记（脏值）
							acceptancePrevail: 1,
							materialName: 1, //物资名称
							deliveryAddress: 1, // 收货地址
							quantity: 1, //数量
							presetUnitPrice: 1 //预设含税单价（元/吨）
						},
						errorShow: {
							acceptancePrevail: false,
							materialName: false,
							deliveryAddress: false, // 收货地址
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
				item.errorShow = {
					materialName: false,
					specs: false,
					deliveryAddress: false, // 收货地址
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
				acceptancePrevail: false,
				materialName: undefined, //物资名称
				deliveryAddress: '', // 收货地址
				quantity: '', //数量
				presetUnitPrice: '', //预设含税单价（元/吨）
				dirty: {
					//验证项是否验证标记（脏值）
					acceptancePrevail: 1,
					materialName: 1, //物资名称
					deliveryAddress: 1, // 收货地址
					quantity: 1, //数量
					presetUnitPrice: 1 //预设含税单价（元/吨）
				},
				errorShow: {
					acceptancePrevail: false,
					materialName: false,
					deliveryAddress: false, // 收货地址
					quantity: false,
					presetUnitPrice: false
				}
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
			this.sameFlag = false;
			//失去焦点后---同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
			if (this.selected.length > 1) {
				for (let i = 0; i < this.selected.length; i++) {
					let first = this.selected[i];
					for (let j = i + 1; j < this.selected.length; j++) {
						let obj = this.selected[j];
						if (first.materialName && first.materialName === obj.materialName) {
							// 销售补录合同允许新增多条
							if (this.type !== 'sellSupplement') {
								this.$message.error('同一个物资，不允许新增多条同属性记录');
							}
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
			newSelectedArr.forEach(i => {
				const item = cloneDeep(i);
				delete item?.specs;
				delete item?.materialTexture;
				if (!this.isNeedDeliveryAddress) {
					delete item.deliveryAddress;
				}
				if (item.acceptancePrevail && this.isNeedAcceptancePrevail) {
					delete item.quantity;
				}
				if (!this.isNeedPresetUnitPrice) {
					delete item.presetUnitPrice;
				}
				item.dirty = {
					//验证项是否验证标记（脏值）
					materialName: 0, //物资名称
					// acceptancePrevail: 1,
					deliveryAddress: 0, // 收货地址
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
								pro === 'quantity' ? '数量不超过10000000吨，最多两位小数' : '单价不超过10000000元/吨，最多两位小数'
							);
						} else {
							if (this.isNeedDeliveryAddress) {
								this.$message.error('发货明细表内选项必填');
							} else {
								this.$message.error('采购明细表内选项必填');
							}
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
						if (first.materialName && first.materialName === obj.materialName) {
							// 销售补录合同允许新增多条
							if (this.type !== 'sellSupplement') {
								this.$message.error('同一个物资，不允许新增多条同属性记录');
							}
							this.sameFlag = this.sameFlag || true;
							break;
						} else {
							this.sameFlag = this.sameFlag || false;
						}
					}
				}
				// 销售补录合同允许新增多条
				if (this.type !== 'sellSupplement') {
					//同物资名称、规格、材质下，不允许插入多条记录，插入数据失去焦点时，前端报错提醒“同一个物资，不允许新增多条同属性记录”。
					if (this.sameFlag) {
						this.$message.error('同一个物资，不允许新增多条同属性记录');
						return;
					}
				}
			}

			if (isPass) {
				const saveData = cloneDeep(this.saveData);
				(saveData || []).forEach(item => {
					if (item.acceptancePrevail && this.isNeedAcceptancePrevail) {
						delete item.quantity;
					}
				});
				return saveData;
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
