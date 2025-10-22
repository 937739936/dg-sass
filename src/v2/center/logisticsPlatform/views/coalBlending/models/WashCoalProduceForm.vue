<template>
	<div>
		<a-form-model
			ref="form"
			:model="formModel"
			:colon="false"
			:rules="formRules"
			class="slFormDetail"
		>
			<a-row class="produce-row-item">
				<a-col :span="8">
					<a-form-model-item
						label="洗煤回收率"
						:prop="'coalRecovery'"
						:rules="formRules.coalRecovery"
					>
						<a-input-number
							placeholder="请输入洗煤回收率"
							v-model="formModel.coalRecovery"
							:max="100"
							:min="0.01"
							:precision="2"
							:formatter="value => (value ? `${value}%` : '')"
							@blur="handleCoalRecoveryChange"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						label="出煤总量(吨) "
						:prop="'coalTotalQuantity'"
						:rules="formRules.coalTotalQuantity"
					>
						<a-input-number
							placeholder="请输入出煤总量"
							v-model="formModel.coalTotalQuantity"
							:max="blendCoalTotalQuantity"
							:min="0.01"
							:precision="2"
							:disabled="true"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
			<div class="produce-row-wrap">
				<a-row
					class="produce-row-item"
					v-for="(record, index) in formModel.produceCoalList"
					:key="index"
				>
					<a-col :span="8">
						<a-form-model-item
							label="出煤品名"
							:prop="'produceCoalList.' + index + '.coalType'"
							:rules="formRules.coalType"
						>
							<a-select
								placeholder="请选择出煤品名"
								v-model="record.coalType"
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
						</a-form-model-item>
					</a-col>
					<a-col :span="8"  v-if="!isManager">
						<a-form-model-item
							label="出煤单价(元/吨)"
							:prop="'produceCoalList.' + index + '.price'"
							:rules="formRules.price"
						>
							<a-input-number
								placeholder="请输入"
								v-model="record.price"
								:max="99999999.99"
								:min="0.00"
								:precision="2"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="8">
						<a-form-model-item
							label="出煤量(吨)"
							:prop="'produceCoalList.' + index + '.coalQuantity'"
							:rules="formRules.coalQuantity"
						>
							<a-input-number
								placeholder="请输入"
								v-model="record.coalQuantity"
								:max="99999999"
								:min="0.01"
								:precision="2"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="8">
						<a-form-model-item
							label="仓房&货位"
							:prop="'produceCoalList.' + index + '.houseAndGoodsAllocation'"
							:rules="formRules.houseAndGoodsAllocation"
						>
							<a-cascader
								:options="houseAndGoodsAllocationTreeData"
								v-model="record.houseAndGoodsAllocation"
								:fieldNames="{
									children: 'goodsAllocations',
									label: 'name',
									key: 'id',
									value: 'id'
								}"
								placeholder="请选择仓房&货位"
								@change="(value, selectedOptions) => handleHouseAndGoodsAllocationChange(value, selectedOptions, index)"
							>
								<template #displayRender="{ labels }">
									{{ labels.join('&') }}
								</template>
							</a-cascader>
						</a-form-model-item>
					</a-col>
					
					<div
						v-if="index === formModel.produceCoalList.length - 1"
						class="item-action-btn"
						@click="addNewProduceCoal()"
					>
						<img src="@/v2/assets/imgs/common/add_item_icon.png" />
					</div>
					<div
						v-else
						class="item-action-btn"
						@click="removeProduceCoal(index)"
					>
						<img src="@/v2/assets/imgs/common/remove_item_icon.png" />
					</div>
				</a-row>
			</div>
		</a-form-model>
	</div>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'WashCoalProduceForm',
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
		// 配煤出煤总量
		blendCoalTotalQuantity: {
			type: Number,
			default: 0
		},
		isManager: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			formModel: {
				coalRecovery: undefined, // 洗煤回收率
				coalTotalQuantity: undefined, // 出煤总量
				produceCoalList: [] // 出煤列表
			},
			formRules: {
				coalRecovery: [
					{ required: true, message: '洗煤回收率必填' },
					{ pattern: /^(60|6[1-9]|[7-9]\d|100)(\.\d{1,2})?$/, message: '洗煤回收率不符合标准范围，请检查', trigger: 'blur' }
				],
				coalTotalQuantity: [{ required: true, message: '出煤总量必填' }],
				coalQuantity: [{ required: true, message: `出煤量必填` }],
				price: [{ required: true, message: `出煤单价必填` }],
				coalType: [
					{ required: true, message: `出煤品名必填` },
					{
						validator: (rule, value, callback) => {
							this.validateCoalType(rule, value, callback);
						},
						trigger: ['change', 'blur']
					}
				],
				houseAndGoodsAllocation: [
					{ required: true, message: `仓房&货位必填` },
					{
						validator: (rule, value, callback) => {
							this.validateHouseAndGoodsAllocation(rule, value, callback);
						},
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	watch: {
		initialFormValues: {
			handler(newVal) {
				if (newVal) {
					let { coalRecovery, coalTotalQuantity, produceCoalList } = newVal;
					this.formModel = {
						coalRecovery,
						coalTotalQuantity,
						produceCoalList: produceCoalList.slice().reverse()
					};
					if (produceCoalList.length == 0) {
						this.addNewProduceCoal();
					} else {
						this.handleCoalRecoveryChange();
					}
				}
			},
			immediate: true
		}
	},
	methods: {
		onClickAddCoalType() {
			this.$emit('onClickAddCoalType');
		},
		// 添加新的出煤信息
		addNewProduceCoal() {
			let oldList = this.formModel.produceCoalList || [];
			let newItem = {
				coalType: undefined,
				coalQuantity: undefined,
				houseAndGoodsAllocation: undefined
			};
			oldList.push(newItem);
			this.formModel.produceCoalList = [...oldList];
		},
		// 删除指定索引的出煤信息
		removeProduceCoal(index) {
			let oldList = this.formModel.produceCoalList || [];
			oldList.splice(index, 1);
			this.formModel.produceCoalList = [...oldList];
		},
		handleHouseAndGoodsAllocationChange(value, selectedOptions, index) {
			let oldList = this.formModel.produceCoalList || [];
			let item = oldList[index];
			if (selectedOptions instanceof Array && selectedOptions.length > 0) {
				let houseAndGoodsAllocation = selectedOptions[selectedOptions.length - 1].houseAndGoodsAllocation;
				item = { ...item, ...houseAndGoodsAllocation };
				oldList[index] = item;
				this.formModel.produceCoalList = [...oldList];
			}
		},
		handleCoalRecoveryChange() {
			let coalRecovery = this.formModel.coalRecovery;
			if (!coalRecovery) {
				return;
			}
			let coalTotalQuantity = this.blendCoalTotalQuantity * (coalRecovery / 100);
			coalTotalQuantity = Math.round(coalTotalQuantity * 100) / 100;
			this.formModel.coalTotalQuantity = coalTotalQuantity;
		},
		validateProduceCoalInfo() {
			return new Promise((resolve, reject) => {
				this.$refs.form.validate(valid => {
					if (!valid) {
						reject('');
						return;
					}
					let { coalRecovery, coalTotalQuantity, produceCoalList } = this.formModel;

					if (coalRecovery < 0 || coalRecovery > 100) {
						reject('洗煤回收率必须在0-100之间');
						return;
					}
					if (coalTotalQuantity < 0) {
						reject('出煤总量必须大于等于0');
						return;
					}
					if (produceCoalList.length == 0) {
						reject('出煤列表不能为空');
						return;
					}
					let inputTotalQuantity = 0;
					produceCoalList.forEach(item => {
						inputTotalQuantity += item.coalQuantity;
					});
					inputTotalQuantity = Math.round(inputTotalQuantity * 100) / 100;
					if (inputTotalQuantity != coalTotalQuantity) {
						// 总出煤量不等于出煤量之和
						reject('各品种出煤量与出煤总量不符，请检查');
						return;
					}
					if (coalTotalQuantity > this.blendCoalTotalQuantity) {
						// 出煤量>配煤数量之和
						reject('出煤总量超过洗煤回收率正常范围，请检查');
						return;
					}
					if (coalTotalQuantity < this.blendCoalTotalQuantity * 0.6) {
						reject('出煤总量低于洗煤回收率正常范围，请检查');
						return;
					}
					resolve({
						coalRecovery,
						coalTotalQuantity,
						produceCoalList: produceCoalList.slice().reverse()
					});
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
}
.produce-row-wrap {
	display: flex;
	flex-direction: column-reverse;
}
.produce-row-item {
	position: relative;
	margin-right: 36px;
	.item-action-btn {
		position: absolute;
		right: -36px;
		top: 33px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.add-coalType {
		position: absolute;
		right: 0;
		top: -36px;
		cursor: pointer;
	}
}
</style>