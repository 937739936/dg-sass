<template>
	<div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<a-row class="produce-row-item">
				<a-col :span="8">
					<a-form-item
						label="出煤品名"
						:colon="false"
					>
						<a-select
							placeholder="请选择出煤品名"
							:allowClear="true"
							v-decorator="[
								`coalType`,
								{
									rules: [
										{ required: true, message: `请选择出煤品名` },
										{
											validator: (rule, value, callback) => {
												validateCoalType(rule, value, callback);
											},
											trigger: ['change', 'blur']
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="item in coalTypeAllList"
								:key="item.id"
								:value="item.name"
							>
								{{ item.name }}
							</a-select-option>
						</a-select>
						<a
							class="add-coalType"
							@click="onClickAddCoalType"
							>增加</a
						>
					</a-form-item>
				</a-col>
				<a-col :span="8" v-if="!isManager">
					<a-form-item
						label="出煤单价(元/吨)"
						:colon="false"
					>
						<a-input-number
							placeholder="请输入"
							:max="99999999.99"
							:min="0.00"
							:precision="2"
							v-decorator="[
								`price`,
								{
									rules: [{ required: true, message: `出煤单价必填` }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						label="出煤总量(吨)"
						:colon="false"
					>
						<a-input-number
							placeholder="请输入"
							:disabled="true"
							v-decorator="[
								`coalQuantity`,
								{
									rules: [{ required: true, message: `出煤总量必填` }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						label="仓房&货位"
						:colon="false"
					>
						<a-cascader
							:options="houseAndGoodsAllocationTreeData"
							:fieldNames="{
								children: 'goodsAllocations',
								label: 'name',
								key: 'id',
								value: 'id'
							}"
							placeholder="请选择仓房&货位"
							v-decorator="[
								`houseAndGoodsAllocation`,
								{
									rules: [
										{ required: true, message: `仓房&货位必填` },
										{
											validator: (rule, value, callback) => {
												validateHouseAndGoodsAllocation(rule, value, callback);
											},
											trigger: ['change', 'blur']
										}
									]
								}
							]"
						>
							<template #displayRender="{ labels }">
								{{ labels.join('&') }}
							</template>
						</a-cascader>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'BlendingCoalProduceForm',
	props: {
		coalTypeAllList: {
			type: Array,
			default: () => []
		},
		houseAndGoodsAllocationTreeData: {
			type: Array,
			default: () => []
		},
		initialFormValues: {
			type: Object,
			default: () => {}
		},
		isManager: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: this.$form.createForm(this),
			produceCoalInfo: {} // 出煤信息
		};
	},
	watch: {
		initialFormValues: {
			handler(newVal) {
				if (newVal) {
					let { coalTotalQuantity, produceCoalList } = newVal;
					let produceCoalInfo = {};
					if (produceCoalList.length > 0) {
						produceCoalInfo = produceCoalList[0];
					}
					produceCoalInfo.coalQuantity = coalTotalQuantity;
					this.produceCoalInfo = produceCoalInfo;
					this.$nextTick(() => {
						this.form.setFieldsValue({ ...produceCoalInfo });
						// this.form.validateFields();
					});
				}
			},
			immediate: true
		}
	},
	methods: {
		onClickAddCoalType() {
			this.$emit('onClickAddCoalType');
		},
		validateProduceCoalInfo() {
			return new Promise((resolve, reject) => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (err) {
						reject('');
						return;
					}
					let { coalType, coalQuantity, houseAndGoodsAllocation, price } = values;
					let selecthouseAndGoodsAllocation = this.findHouseAndGoodsAllocationItem(houseAndGoodsAllocation);
					if (!selecthouseAndGoodsAllocation) {
						reject('当前仓房&货位不存在，请重新选择');
						return;
					}
					let item = {
						...selecthouseAndGoodsAllocation,
						coalType,
						coalQuantity,
						price
					};
					let produceCoalInfo = {
						...this.initialFormValues,
						produceCoalList: [item]
					};
					resolve(produceCoalInfo);
				});
			});
		},
		validateCoalType(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			let selectItem = this.findCoalTypeItem(value);
			if (selectItem) {
				callback();
			} else {
				callback('当前煤种信息不存在，请重新选择');
			}
		},
		// 验证仓房&货位信息
		validateHouseAndGoodsAllocation(rule, value, callback) {
			let selectItem = this.findHouseAndGoodsAllocationItem(value);
			if (selectItem) {
				callback();
			} else {
				callback('当前仓房&货位不存在，请重新选择');
			}
		},
		// 根据名称查找煤种信息
		findCoalTypeItem(name) {
			let list = this.coalTypeAllList || [];
			let item = _.find(list, item => {
				return item.name === name;
			});
			return item;
		},
		// 根据仓房&货位id查找仓房&货位信息
		findHouseAndGoodsAllocationItem(values) {
			let [houseId, goodsAllocationId] = values;
			let list = this.houseAndGoodsAllocationTreeData || [];
			let houseItem = _.find(list, item => {
				return item.id === houseId;
			});
			if (houseItem) {
				let goodsAllocation = _.find(houseItem.goodsAllocations, allocation => {
					return allocation.id === goodsAllocationId;
				});
				if (goodsAllocation) {
					return goodsAllocation.houseAndGoodsAllocation;
				}
				return null;
			}
			return null;
		}
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	.ant-row {
		.ant-col-8:nth-child(3n + 1) {
			display: flex;
			justify-content: left;
		}
		.ant-col-8:nth-child(3n + 2) {
			display: flex;
			justify-content: center;
		}
		.ant-col-8:nth-child(3n) {
			display: flex;
			justify-content: right;
		}
	}
	.ant-form-item {
		max-width: 364px;
		min-width: 230px;
	}
	.ant-input-number {
		width: 100%;
	}
	/deep/ .ant-cascader-picker {
		.ant-cascader-picker-arrow {
			// display: none;
			svg {
				display: none;
			}
		}
	}
	.produce-row-item {
		position: relative;
		.add-coalType {
			position: absolute;
			right: 0;
			top: -36px;
			cursor: pointer;
		}
	}
}
</style>