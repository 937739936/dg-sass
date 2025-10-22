<template>
	<div
		class="coal-blending-info"
		ref="coalBlendingInfo"
	>
		<a-form-model
			ref="baseInfoForm"
			:model="formModel"
			class="slFormDetail"
		>
			<a-row class="row">
				<a-col :span="8">
					<a-form-model-item
						label="配煤类型"
						prop="type"
					>
						<a-radio-group
							v-model="formModel.type"
							@change="onTypeChange"
						>
							<a-radio value="BLENDING_COAL">掺配</a-radio>
							<a-radio value="WASH_COAL">洗煤</a-radio>
						</a-radio-group>
					</a-form-model-item>
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						label="配煤日期"
						prop="blendingDate"
						:rules="coalTypeFormRules.blendingDate"
					>
						<a-date-picker
							v-model="formModel.blendingDate"
							placeholder="请选择配煤日期"
							valueFormat="YYYY-MM-DD"
							format="YYYY-MM-DD"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>
		<div class="step-wrapper">
			<div class="step-title">
				<div class="step-line"></div>
				<a-icon type="check-circle" theme="filled" style="font-size: 20px;color: var(--primary-color)"/>
				<span class="complete-text">选择煤种</span>
			</div>
			<a-form-model
				ref="coalTypeForm"
				:model="formModel"
				:rules="coalTypeFormRules"
				class="slFormDetail"
			>
				<div class="coal-type-table-wrapper">
					<div
						class="action-box"
						v-if="isShowCoalTypeActions"
					>
						<a-space :size="20">
							<a-button
								class="action-btn"
								type="primary"
								:disabled="coalTypeTableEdit"
								ghost
								@click="editCoalTypeTable"
							>
								修改
							</a-button>
							<a-button
								class="footer-btn"
								type="primary"
								:disabled="!coalTypeTableEdit"
								@click="saveCoalTypeTable"
							>
								保存
							</a-button>
						</a-space>
					</div>
					<div
						class="add-newCoalType-btn"
						v-if="formModel.dataSource.length == 0"
					>
						<a-button
							type="primary"
							ghost
							@click="addNewCoalType"
						>
							<a-icon type="plus" style="color: var(--primary-color);font-size: 16px;"/>
							新增信息</a-button
						>
					</div>
					<a-table
						class="new-table"
						:dataSource="formModel.dataSource"
						:columns="blendingCoalColumns"
						:pagination="false"
						:scroll="{ x: true }"
						:coalTypeTableEdit="coalTypeTableEdit"
						rowKey="uuid"
					>
						<template slot="columnsTipTitle">
							<span>占总配煤比例</span>
							<a-tooltip placement="top">
								<template slot="title">
									<span>掺配占比=当前品种煤掺入数量除以总掺入煤数量*100%</span>
								</template>
								<img
									class="tip-icon"
									src="@/v2/assets/imgs/common/column_title_tip.png"
									alt=""
								/>
							</a-tooltip>
						</template>
						<template
							slot="coalTypeInventoryKey"
							slot-scope="text, record, index"
						>
							<a-form-model-item
								v-if="coalTypeTableEdit"
								:prop="'dataSource.' + index + '.coalTypeInventoryKey'"
								:rules="coalTypeFormRules.coalTypeInventoryKey"
							>
								<a-select
									style="width: 100%"
									v-model="record.coalTypeInventoryKey"
									:getPopupContainer="
										triggerNode => {
											return $refs.coalBlendingInfo;
										}
									"
									:allowClear="true"
									placeholder="请选择配煤库存信息"
									@change="e=>onCoalTypeInventoryChange(e, record,index)"
								>
									<a-select-option
										v-for="item in coalTypeInventoryFilterList"
										:key="item.coalTypeInventoryKey"
										:value="item.coalTypeInventoryKey"
										:item="item"
										style="padding: 0 8px"
									>
										<div class="coal-type-select-option">
											<div class="coalTypeName">
												<TextOverflowTooltip :tipText="item.coalType">
													<span>{{ item.coalType }}</span>
												</TextOverflowTooltip>
											</div>
											<div class="houseName">
												<TextOverflowTooltip :tipText="item.houseName + '&' + item.goodsAllocationName">
													<span>{{ item.houseName + '&' + item.goodsAllocationName }}</span>
												</TextOverflowTooltip>
											</div>
											<div class="inventoryQuantity">
												<TextOverflowTooltip :tipText="item.inventoryQuantity">
													<span>{{ item.inventoryQuantity }}</span>
												</TextOverflowTooltip>
											</div>
										</div>
									</a-select-option>
								</a-select>
							</a-form-model-item>
							<span v-else>{{ text }}</span>
						</template>
						<template
							slot="price"
							slot-scope="text, record, index"
						>
							<a-form-model-item
								v-if="coalTypeTableEdit"
								:prop="'dataSource.' + index + '.price'"
								:rules="coalTypeFormRules.price"
							>
								<a-input-number
									style="width: 100%"
									placeholder="请输入煤种单价"
									v-model="record.price"
									:max="99999999.99"
									:min="0.00"
									:precision="2"
								/>
							</a-form-model-item>
							<span v-else>{{  text ? text.toFixed(2) : '-' }}</span>
						</template>
						<template
							slot="quantity"
							slot-scope="text, record, index"
						>
							<a-form-model-item
								v-if="coalTypeTableEdit"
								:prop="'dataSource.' + index + '.quantity'"
								:rules="coalTypeFormRules.quantity"
							>
								<a-input-number
									style="width: 100%"
									placeholder="请输入配煤数量"
									v-model="record.quantity"
									:max="99999999"
									:min="0.01"
									:precision="2"
									@blur="onQuantityBlur"
								/>
							</a-form-model-item>
							<span v-else>{{ text ? text.toFixed(2) : '-' }}</span>
						</template>
						<template
							slot="ratio"
							slot-scope="text"
						>
							<!-- <a-form-model-item
								v-if="coalTypeTableEdit"
								:prop="'dataSource.' + index + '.ratio'"
								:rules="coalTypeFormRules.ratio"
							>
								<a-input-number
									style="width: 100%"
									placeholder="请输入占总配煤比例  "
									v-model="record.ratio"
									:max="100"
									:min="0.01"
									:precision="2"
									:formatter="value => (value ? `${value}%` : '')"
									:parser="value => value.replace('%', '')"
								/>
							</a-form-model-item> -->
							<span>{{ text ? `${text}%` : '' }}</span>
						</template>
						<template
							slot="action"
							slot-scope="action, record, index"
						>
							<a-space :size="24">
								<a
									v-if="coalTypeTableEdit && index + 1 == formModel.dataSource.length"
									@click="addNewCoalType()"
									>新增</a
								>
								<a-popconfirm
									v-if="coalTypeTableEdit"
									title="确认删除该条信息？"
									placement="topRight"
									@confirm="deleteCoalTypeItem(index)"
								>
									<a>删除</a>
								</a-popconfirm>
								<a
									v-else
									class="actionDisabled"
									>删除</a
								>
							</a-space>
						</template>
					</a-table>
					<!-- <div
						class="produce-coal-box"
						v-if="isShowCoalTotalQuantity"
					>
						<span>出煤总量</span>
						<a-form-model-item
							:prop="'coalTotalQuantity'"
							:rules="coalTypeFormRules.coalTotalQuantity"
						>
							<a-input-number
								style="width: 110px; text-align: center"
								placeholder="请输入"
								v-model="formModel.coalTotalQuantity"
								:disabled="!coalTypeTableEdit"
								:max="99999999"
								:min="0.01"
								:precision="2"
							/>
						</a-form-model-item>
						<span>吨</span>
					</div> -->
				</div>
			</a-form-model>
		</div>
		<div class="step-wrapper">
			<div class="step-title">
				<a-icon type="check-circle" theme="filled" style="font-size: 20px;color: var(--primary-color)"/>
				<span class="text">出煤信息</span>
			</div>
			<div class="produce-coal-table-wrapper">
				<a-table
					class="new-table"
					style="margin-top: 20px"
					:dataSource="formModel.produceCoalList"
					:columns="produceCoalListColumns"
					:pagination="false"
					:scroll="{ x: true }"
					:rowKey="(r, index) => index"
				>
					<template
						slot="action"
						slot-scope="action, record, index"
					>
						<a-space
							:size="24"
							v-if="index === 0"
						>
							<a @click="saveCoalTypeTable()">修改</a>
						</a-space>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { cloneDeep, find, get } from 'lodash';
import TextOverflowTooltip from '@sub/components/base/TextOverflowTooltip';
import {
	// getCoalTypeInventory,
	getCoalTypeLastPrice
} from '@/v2/center/logisticsPlatform/api/coalBlending';

export default {
	name: 'CoalBlendingInfoEdit',
	components: {
		TextOverflowTooltip
	},
	props: {
		// 配煤原始信息
		coalBlendingOriginInfo: {
			type: Object,
			default: () => {}
		},
		coalTypeInventoryList: {
			type: Array,
			default: () => []
		},
		// 当前货主
		ownerCompanyUscc: {
			type: String,
			default: undefined
		},
		// 业务线号
		businessLineNo: {
			type: String,
			default: undefined
		},
		// 是否是站台管理服务
		isManager: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			getPopupContainer,
			formModel: {
				type: 'BLENDING_COAL', // 配煤类型
				blendingDate: undefined, // 配煤日期
				coalTotalQuantity: undefined, // 出煤总量
				coalRecovery: undefined, // 洗煤回收率
				dataSource: [], // 煤种信息
				produceCoalList: [] // 出煤信息
			},
			// columns: columns, // 选择煤种信息表头
			coalTypeTableEdit: false, // 配煤煤种信息编辑状态
			coalTypeFormRules: {
				type: [{ required: true, message: '配煤类型必填' }],
				blendingDate: [{ required: true, message: '请选择配煤日期', trigger: 'change' }],
				coalTypeInventoryKey: [
					{ required: true, message: '请选择配煤库存信息' },
					{
						validator: (rule, value, callback) => {
							this.validateCoalTypeInventoryKey(rule, value, callback);
						},
						trigger: ['change', 'blur']
					}
				],
				price: [
					{ required: true, message: '请输入煤种单价', trigger: ['change', 'blur'] },
				],
				quantity: [
					{ required: true, message: '请输入配煤数量' },
					{
						validator: (rule, value, callback) => {
							this.validateQuantity(rule, value, callback);
						},
						trigger: ['change', 'blur']
					}
				],
				ratio: [{ required: true, message: '请输入占总配煤比例' }],
				coalTotalQuantity: [{ required: true, message: '请输入出煤总量', trigger: ['change', 'blur'] }]
			}
		};
	},
	computed: {
		// 选择煤种信息表头
		blendingCoalColumns() {
			let list = [...columns];
			if (this.isManager) {
				list.splice(1, 1);
			}
			return [...list]
		},
		// 出煤信息表头
		produceCoalListColumns() {
			let list = [];
			if (this.isWashCoal) {
				list = [...washProduceCoalColumns(this)];
			} else {
				list = [...blendingProduceCoalColumns];
			}
			if (this.isManager) {
				list.splice(2, 1);
			}
			return [...list];
		},
		// 配煤库存信息列表
		coalTypeInventoryListNotEmpty() {
			let list = this.coalTypeInventoryList || [];
			list = list.map(item => {
				// 配煤库存信息key
				item.coalTypeInventoryKey = assembleCoalTypeInventory(item);
				return item;
			});
			return list;
		},
		coalTypeInventoryFilterList() {
			let list = this.coalTypeInventoryListNotEmpty.filter(item => {
				let isSelected = false;
				this.formModel.dataSource.map(record => {
					if (record.coalTypeInventoryKey === item.coalTypeInventoryKey) {
						isSelected = true;
					}
				});
				if (!isSelected) {
					return item;
				}
			});
			return [...list];
		},
		type() {
			return this.formModel.type;
		},
		// 是否是掺配煤
		isCoalBlending() {
			return this.formModel.type === 'BLENDING_COAL';
		},
		// 是否是洗煤
		isWashCoal() {
			return this.formModel.type === 'WASH_COAL';
		},
		// 是否显示出煤总量
		isShowCoalTotalQuantity() {
			let isShow = this.coalTypeTableEdit || this.formModel.coalTotalQuantity;
			return isShow;
		},
		// 是否显示煤种选择操作按钮
		isShowCoalTypeActions() {
			let isShow = this.coalTypeTableEdit || this.formModel.dataSource.length > 0;
			return isShow;
		},
		// 出煤步骤的标题图标
		produceStepTitleIcon() {
			if (this.formModel.produceCoalList.length > 0) {
				return require('@sub/assets/imgs/common/finish_status_completed.png');
			}
			return require('@sub/assets/imgs/common/finish_status_undone.png');
		}
	},
	watch: {
		coalBlendingOriginInfo: {
			deep: true,
			handler(newVal, ) {
				this.configInitEditInfo(newVal);
			}
		}
	},
	mounted() {
		this.configInitEditInfo(this.coalBlendingOriginInfo);
	},
	methods: {
		// 初始化编辑信息
		configInitEditInfo(newVal) {
			let info = cloneDeep(newVal);
			let detailList = info.detailList || [];
			detailList = detailList.map(item => {
				item.coalTypeInventoryKey = assembleCoalTypeInventory(item);
				item.uuid = uuidv4();
				return item;
			});
			let extractionList = info.extractionList || [];
			extractionList = extractionList.map(item => {
				item.coalTotalQuantity = Math.round(info.coalTotalQuantity * 100) / 100;
				return item;
			});
			this.formModel = {
				type: info.type || 'BLENDING_COAL',
				blendingDate: info.blendingDate,
				coalTotalQuantity: info.coalTotalQuantity,
				coalRecovery: info.coalRecovery,
				dataSource: [...detailList],
				produceCoalList: [...extractionList]
			};
		},
		// 新增配煤煤种信息
		addNewCoalType() {
			this.coalTypeTableEdit = true;
			let oldList = this.formModel.dataSource || [];
			let newItem = {
				uuid: uuidv4(),
				coalTypeInventoryKey: undefined,
				quantity: undefined,
				ratio: undefined
			};
			oldList.push(newItem);
			this.$set(this.formModel, 'dataSource', [...oldList]);
		},
		// 删除配煤煤种信息
		deleteCoalTypeItem(index) {
			let dataSource = this.formModel.dataSource;
			dataSource.splice(index, 1);
			if (dataSource.length === 0) {
				this.resetCoalBlendingInfo();
				return;
			}
			this.$set(this.formModel, 'dataSource', [...dataSource]);
			this.$nextTick(() => {
				this.onQuantityBlur();
			});
		},
		onTypeChange() {
			// 切换配煤类型时，清空出煤信息
			this.formModel.produceCoalList = [];
		},
		// 重置配煤信息
		resetCoalBlendingInfo() {
			this.coalTypeTableEdit = false;
			let { type, blendingDate } = this.formModel;
			this.configInitEditInfo({ type, blendingDate });
		},
		// 根据key获取配煤库存信息
		findCoalTypeInventoryItem(key) {
			let list = this.coalTypeInventoryListNotEmpty;
			let item = find(list, item => {
				return item.coalTypeInventoryKey === key;
			});
			return item;
		},
		// 选择配煤库存信息发生变化
		async onCoalTypeInventoryChange(e, record, index) {
			let selectedInventoryItem = this.findCoalTypeInventoryItem(e);
			// if (record.price) {
			// 	return;
			// }
			// 获取当前库存品名的上一次单价
			const res = await getCoalTypeLastPrice({ coalType: selectedInventoryItem.coalType, ownerCompanyUscc: this.ownerCompanyUscc, businessLineNo: this.businessLineNo })
			this.$set(this.formModel.dataSource[index], 'price', res.data || undefined);
			if (res.success && res.data) {
				this.$refs.coalTypeForm.validateField(`dataSource.${index}.price`,()=>{});
			}
		},
		// 校验配煤库存信息
		validateCoalTypeInventoryKey(rule, value, callback) {
			let quantitypath = rule.fullField.replace('coalTypeInventoryKey', 'quantity');
			let quantity = get(this.formModel, quantitypath);
			if (quantity) {
				this.$refs.coalTypeForm.validateField(quantitypath);
			}
			if (!value) {
				callback('请选择配煤库存信息');
				return;
			}
			let selectedInventoryItem = this.findCoalTypeInventoryItem(value);
			if (selectedInventoryItem) {
				let { inventoryQuantity } = selectedInventoryItem;
				if (inventoryQuantity <= 0) {
					callback('库存不足');
				} else {
					callback();
				}
			} else {
				callback('配煤库存信息与当前库存不符，请重新选择');
			}
		},
		// 校验配煤数量
		validateQuantity(rule, value, callback) {
			let quantity = value;
			let coalTypeInventoryKeypath = rule.fullField.replace('quantity', 'coalTypeInventoryKey');
			let coalTypeInventoryKey = get(this.formModel, coalTypeInventoryKeypath);
			if (coalTypeInventoryKey && quantity) {
				let selectedInventoryItem = this.findCoalTypeInventoryItem(coalTypeInventoryKey);
				if (selectedInventoryItem) {
					let { inventoryQuantity } = selectedInventoryItem;
					if (quantity > inventoryQuantity) {
						callback('配煤数量不能大于库存数量');
					} else {
						callback();
					}
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		// 配煤数量变化时，计算占总配煤比例
		onQuantityBlur() {
			let { dataSource, } = this.formModel;
			// 计算所有填写的配煤总量
			let blendCoalTotalQuantity = 0;
			dataSource.map((item, ) => {
				let { quantity } = item;
				if (quantity) {
					blendCoalTotalQuantity += quantity;
				}
			});
			blendCoalTotalQuantity = Math.round(blendCoalTotalQuantity * 100) / 100;
			dataSource.map((item, ) => {
				let { quantity } = item;
				if (quantity) {
					let ratio = (quantity / blendCoalTotalQuantity) * 100;
					ratio = Math.round(ratio * 100) / 100;
					item.ratio = ratio;
				}
			});
		},
		// 编辑配煤煤种信息
		editCoalTypeTable() {
			this.coalTypeTableEdit = true;

			this.$nextTick(() => {
				this.$refs.coalTypeForm.validate(() => {});
			});
		},
		// 保存配煤煤种信息
		saveCoalTypeTable() {
			this.onQuantityBlur();
			this.$refs.coalTypeForm.validate((valid, ) => {
				if (!valid) {
					return;
				}
				let { dataSource, coalTotalQuantity, produceCoalList, type, coalRecovery } = this.formModel;
				// 计算所有填写的配煤总量
				// let blendCoalTotalQuantity = 0;
				// coalTotalQuantity = Math.round(coalTotalQuantity * 100) / 100;
				// dataSource.map((item,) => {
				// 	let { quantity, } = item;
				// 	blendCoalTotalQuantity += quantity;
				// });
				// blendCoalTotalQuantity = Math.round(blendCoalTotalQuantity * 100) / 100;

				this.$emit('onBlendedCoalConfirm', {
					type: type,
					coalBlendingList: dataSource,
					coalTotalQuantity: coalTotalQuantity,
					coalRecovery: coalRecovery,
					produceCoalList: produceCoalList
				});
			});
		},
		// 更新配煤出煤信息
		updateCoalBlendingProduceCoalInfo(data) {
			this.coalTypeTableEdit = false;
			let { coalRecovery, coalTotalQuantity, produceCoalList } = data;
			let list = produceCoalList.map(item => {
				item.coalTotalQuantity = coalTotalQuantity;
				return item;
			});
			this.formModel = {
				...this.formModel,
				coalTotalQuantity: coalTotalQuantity,
				produceCoalList: [...list],
				coalRecovery: coalRecovery
			};
		},
		// 校验配煤信息并在成功后返回
		onValidateCoalBlendingInfo() {
			this.onQuantityBlur();
			return new Promise(async (resolve, reject) => {
				if (this.coalTypeTableEdit) {
					reject('配煤信息处于编辑状态，保存后提交');
					return;
				}

				let baseInfoPromise = this.$refs.baseInfoForm.validate();
				let coalTypePromise = this.$refs.coalTypeForm.validate();
				try {
					await Promise.all([baseInfoPromise, coalTypePromise]);
					let { type, blendingDate, dataSource, produceCoalList, coalTotalQuantity, coalRecovery } = this.formModel;
					if (dataSource.length === 0 || produceCoalList.length === 0) {
						reject('配煤信息不能为空');
						return;
					}
					dataSource = dataSource.map((item, ) => {
						let { coalTypeInventoryKey, } = item;
						let selectedInventoryItem = this.findCoalTypeInventoryItem(coalTypeInventoryKey);
						if (selectedInventoryItem) {
							item = {
								...item,
								...selectedInventoryItem
							};
						}
						return item;
					});
					let info = {
						type,
						blendingDate,
						coalTotalQuantity: coalTotalQuantity,
						coalRecovery: coalRecovery,
						detailList: dataSource, // 选择的煤种
						extractionList: produceCoalList // 出煤信息
					};
					resolve(info);
				} catch (error) {
					reject('信息填写存在异常，请检查');
				}
			});
		}
	}
};

// 组装配煤库存信息
const assembleCoalTypeInventory = item => {
	let { coalType, houseName, goodsAllocationName, inventoryQuantity } = item;
	let symbol = inventoryQuantity;
	if (inventoryQuantity < 0) {
		symbol = `负${-inventoryQuantity}`;
	}
	return `${coalType}-${houseName}&${goodsAllocationName}-${symbol}`;
};

// 拆解配煤库存信息
// const disassembleCoalTypeInventory = key => {
// 	let [coalType, houseName, goodsAllocationName, inventoryQuantity] = key.split('-');
// 	return {
// 		coalType,
// 		houseName,
// 		goodsAllocationName,
// 		inventoryQuantity
// 	};
// };

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '配煤库存信息 ',
		dataIndex: 'coalTypeInventoryKey',
		scopedSlots: { customRender: 'coalTypeInventoryKey' } // 自定义序号列内容渲染// 固定左侧列
	},
	{
		title: '煤种单价(元/吨) ',
		dataIndex: 'price',
		scopedSlots: { customRender: 'price' }
	},
	{
		title: '配煤数量(吨) ',
		dataIndex: 'quantity',
		scopedSlots: { customRender: 'quantity' } // 自定义序号列内容渲染
	},
	{
		// title: '提示列',
		dataIndex: 'ratio',
		slots: { title: 'columnsTipTitle' }, // 自定义提示列title内容渲染
		scopedSlots: { customRender: 'ratio' } // 自定义序号列内容渲染
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: { customRender: 'action' }, // 自定义操作列内容渲染
		fixed: 'right'
	}
];

// 掺配出煤信息表头
const blendingProduceCoalColumns = [
	{
		title: '出煤品名',
		dataIndex: 'coalType',
		customRender
	},
	{
		title: '出煤总量(吨) ',
		dataIndex: 'coalQuantity',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '出煤单价(元/吨) ',
		dataIndex: 'price',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '仓房&货位',
		dataIndex: 'houseName',
		customRender: (text, record) => {
			return record.houseName + '&' + record.goodsAllocationName;
		}
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: { customRender: 'action' }, // 自定义操作列内容渲染
		fixed: 'right'
	}
];

// 洗煤出煤信息表头
const washProduceCoalColumns = that => {
	return [
		{
			title: '出煤品名',
			dataIndex: 'coalType',
			customRender
		},
		{
			title: '出煤量(吨) ',
			dataIndex: 'coalQuantity',
			customRender: text => {
				if (text) {
					return text.toFixed(2);
				}
				return '-';
			}
		},
		{
			title: '出煤单价(元/吨) ',
			dataIndex: 'price',
			customRender: text => {
				if (text) {
					return text.toFixed(2);
				}
				return '-';
			}
		},
		{
			title: '仓房&货位',
			dataIndex: 'houseName',
			customRender: (text, record) => {
				return record.houseName + '&' + record.goodsAllocationName;
			}
		},
		{
			title: '洗煤回收率',
			dataIndex: 'coalRecovery',
			customRender: (text, row, index) => {
				return {
					children: `${that.formModel.coalRecovery}%`,
					attrs: {
						rowSpan: index == 0 ? that.formModel.produceCoalList.length : 0
					}
				};
			}
		},
		{
			title: '出煤总量(吨) ',
			dataIndex: 'coalTotalQuantity',
			customRender: (text, row, index) => {
				return {
					children: `${text || '-'}`,
					attrs: {
						rowSpan: index == 0 ? that.formModel.produceCoalList.length : 0
					}
				};
			}
		},
		{
			key: 'action',
			title: '操作',
			scopedSlots: { customRender: 'action' }, // 自定义操作列内容渲染
			width: 70,
			customCell: (record, index) => {
				return {
					attrs: {
						rowSpan: index == 0 ? that.formModel.produceCoalList.length : 0
					}
				};
			},
			fixed: 'right'
		}
	];
};

</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.new-table {
	margin-left: 32px;
	.tip-icon {
		width: 12px;
		height: 12px;
		margin-left: 4px;
		margin-bottom: 2px;
	}
}

.new-table {
	margin-top: 0;
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-fixed-right .ant-table-tbody > tr > td:nth-last-child(1) {
		border-left: 1px solid #e5e6eb;
	}
	/deep/ .ant-empty-normal {
		margin: 0;
	}
}

/deep/ .ant-form-explain {
	position: absolute;
	line-height: 14px;
	min-height: unset;
	bottom: -14px;
}
/deep/ .ant-form-item-control {
	line-height: 32px;
}

.coal-type-table-wrapper {
	.new-table {
		margin-top: 0;
		/deep/ .ant-table-tbody > tr > td {
			border-bottom: 1px solid #e5e6eb;
			padding: 14px 20px;
		}
		.ant-form-item {
			width: 280px;
		}
		/deep/ .ant-empty-normal {
			visibility: hidden;
		}
	}
	.add-newCoalType-btn {
		z-index: 900;
		height: 100px;
		position: absolute;
		bottom: 27px;
		left: 32px;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.produce-coal-table-wrapper {
	.new-table {
		/deep/ .ant-table-tbody > tr > td {
			border-bottom: none;
			padding: 13px 20px;
		}
		/deep/ .ant-table-tbody > tr:last-child td {
			border-bottom: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-tbody > tr:first-child td:nth-last-child(3),
		/deep/ .ant-table-tbody > tr:first-child td:nth-last-child(2),
		/deep/ .ant-table-tbody > tr:first-child td:nth-last-child(1) {
			border-bottom: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-fixed-right {
			.ant-table-tbody > tr:first-child td:nth-child(1) {
				border-bottom: 1px solid #e5e6eb;
				border-bottom-right-radius: 4px;
			}
		}

		/deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
			background-color: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover > td {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover > td {
			background: #fff !important;
		}

		/deep/ .ant-table-tbody > tr > td[rowSpan='0'] {
			display: none;
		}
	}
}
</style>
<style lang="less" scoped>
.slFormDetail {
	padding: 0 0;
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
		width: 364px;
	}
}
.coal-blending-info {
	.step-wrapper {
		position: relative;
		padding: 13px 0 0;
		.step-title {
			line-height: 1;
			vertical-align: middle;
			.anticon {
				position: relative;
				top: 2px;
				z-index: 2;
				margin-right: 12px;
				vertical-align: middle;
				line-height: 20px;
			}
			span {
				font-size: 14px;
				font-family: 'PingFang SC';
				color: #00000066;
				font-weight: 400;
				vertical-align: middle;
			}
			.complete-text {
				line-height: 1;
				color: #000000cc;
				font-weight: 500;
				vertical-align: middle;
			}
		}
	}
	.step-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 9px;
		height: 46px;
		background: #e5e6eb;
		width: 1px;
		z-index: 0;
	}
	.add-icon {
		width: 12px;
		height: 12px;
		margin-right: 2px;
		margin-bottom: 2px;
	}
	.coal-type-table-wrapper {
		padding-bottom: 27px;
		margin-top: 20px;
		position: relative;
		.action-box {
			position: absolute;
			top: -47px;
			right: 0;
			display: flex;
			.action-btn {
				height: 32px;
				min-width: 62px;
				line-height: 32px;
				padding: 0 17px !important;
			}
		}
		.produce-coal-box {
			position: absolute;
			bottom: -25px;
			// top: 20px;
			right: 0;
			z-index: 1;
			// margin-top: 20px;
			display: flex;
			justify-content: end;
			align-items: center;
			font-size: 14px;
			color: #77889d;
			.tip-icon {
				width: 12px;
				height: 12px;
				margin-left: 4px;
			}
			/deep/ .ant-form-item {
				width: 120px;
				margin-bottom: 0;
				margin-left: 14px;
			}
			/deep/ .ant-form-item-control {
				input,
				textarea {
					text-align: center;
				}
			}
		}
	}
	.coal-type-table-wrapper:before {
		content: '';
		position: absolute;
		top: -20px;
		left: 9px;
		bottom: 0;
		background: #e5e6eb;
		width: 1px;
		z-index: 0;
	}
	/deep/ .ant-select-dropdown-menu {
		padding: 0;
	}
	/deep/ .ant-select-dropdown-menu-item {
		padding: 0;
	}
	.coalTypeName {
		width: 72px;
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.coal-type-select-option {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 5px 8px;
		.coalTypeName {
			width: 72px;
			flex-shrink: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.houseName {
			flex: 1;
			padding: 0 5px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.inventoryQuantity {
			width: 52px;
			flex-shrink: 0;
			text-align: right;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.actionDisabled {
		color: gray; /* 设置为灰色 */
		pointer-events: none; /* 阻止鼠标事件，但不影响样式 */
		cursor: default; /* 改变鼠标悬停时的光标样式，表明不可点击 */
	}
}
</style>

