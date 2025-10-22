<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
	<div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
			style="padding-bottom: 0"
			v-if="!disabled"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="运输方式">
						<a-select
							placeholder="请选择运输方式"
							:getPopupContainer="getPopupContainer"
							:disabled="transTypeData.length < 2"
							@change="changeTransType"
							v-decorator="[
								'transType',
								{
									rules: [
										{
											required: true,
											message: '运输方式必填',
											whitespace: true
										}
									],
									initialValue: transTypeData.length === 1 ? transTypeData[0].value : undefined
								}
							]"
						>
							<a-select-option
								:value="item.value"
								:disabled="item.disabled"
								v-for="item in transTypeData"
								:key="item.value"
								>{{ item.name }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="发运类型">
						<a-select
							disabled
							placeholder="请选择运发运类型"
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								'deliveryDespatchType',
								{
									rules: [
										{
											required: true,
											message: '发运类型必填',
											whitespace: true
										}
									]
								}
							]"
						>
							<a-select-option
								:value="item.value"
								v-for="item in deliveryDespatchTypeList"
								:key="item.value"
								>{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('deliveryDespatchType') === 'TRANSFER_DELIVERY'"
				>
					<a-form-item label="中转仓库">
						<a-select
							placeholder="请选择中转仓库"
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								'warehouseId',
								{
									rules: [
										{
											required: true,
											message: '中转仓库必填',
											whitespace: true
										}
									]
								}
							]"
							@change="getInOutHistoryList"
						>
							<a-select-option
								:value="item.id"
								v-for="item in warehouseList"
								:key="item.id"
								>{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="品名">
							<a-select
								placeholder="请选择品名"
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'goodsName',
									{
										rules: [
											{
												required: true,
												message: '品名必填',
												whitespace: true
											}
										]
									}
								]"
							>
								<a-select-option
									:value="item.value"
									v-for="item in goodsNameList"
									:key="item.value"
									>{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<template v-if="form.getFieldValue('deliveryDespatchType') === 'TERMINAL_DELIVERY'">
					<a-col :span="8">
						<a-form-item label="发货地">
							<a-select
								placeholder="请选择发货地"
								:getPopupContainer="getPopupContainer"
								@change="getInOutHistoryList"
								v-decorator="[
									'originWarehouseId',
									{
										rules: [{ required: this.$route.query.deliveryDespatchType === 'TERMINAL_DELIVERY', message: '品名必填' }]
									}
								]"
							>
								<a-select-option
									:value="item.id"
									v-for="item in warehouseList"
									:key="item.id"
									>{{ item.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="终端企业">
							<a-input
								placeholder="请输入终端企业"
								autocomplete="off"
								v-decorator="[
									'terminalCompanyName',
									{
										rules: [
											{
												required: true,
												message: '终端企业必填',
												whitespace: true
											}
										],
										initialValue: contractVo.buyerName
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</template>
				<a-col :span="8">
					<a-form-item label="考核热值(kcal/kg)">
						<a-input-number
							placeholder="请输入1000-7500之间整数"
							autocomplete="off"
							v-decorator="[
								'checkCalorificValue',
								{
									rules: [
										{
											required: false,
											message: '请输入1000-7500之间整数',
											validator: validNumber({ float: 0, min: 1000, max: 7500, containMin: true })
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div
			style="margin-top: 20px; margin-bottom: 20px"
			v-else
		>
			<a-table
				style="margin-bottom: 10px"
				v-if="deliverRadioList && deliverRadioList.length"
				:row-selection="isDetail ? null : rowSelectionRadio"
				:expandIconAsCell="false"
				:expandRowByClick="true"
				:customRow="RowClick"
				:expandedRowKeys="expandedRowKeys"
				:expandIconColumnIndex="isDetail ? 4 : 5"
				class="new-table"
				:expandIcon="expandIcon"
				:dataSource="deliverRadioList"
				:columns="deliverColumns"
				:scroll="{ x: true }"
				:bordered="false"
				:pagination="false"
				rowKey="deliverId"
			>
				<template
					slot="deliveryDespatchType"
					slot-scope="text, record"
				>
					{{ deliveryDespatchTypeSelect(record.transInfo.deliverDynamicsFields.deliveryDespatchType) }}
				</template>
				<div
					slot="expandedRowRender"
					slot-scope="record"
				>
					<a-row>
						<!-- 中转发运 -->
						<template v-if="record.transInfo.deliverDynamicsFields.deliveryDespatchType == 'TRANSFER_DELIVERY'">
							<a-col :span="6">
								<span class="label">中转仓库：</span>
								<a-tooltip>
									<template slot="title">
										{{ warehouseSelect(record.transInfo.deliverDynamicsFields.warehouseId) }}
									</template>
									<span class="value">{{ warehouseSelect(record.transInfo.deliverDynamicsFields.warehouseId) }}</span>
								</a-tooltip>
							</a-col>
						</template>
						<!-- 终端发运 -->
						<template v-if="record.transInfo.deliverDynamicsFields.deliveryDespatchType == 'TERMINAL_DELIVERY'">
							<a-col :span="6">
								<span class="label">发货地：</span>
								<a-tooltip>
									<template slot="title">
										{{ warehouseSelect(record.transInfo.deliverDynamicsFields.originWarehouseId) }}
									</template>
									<span class="value">{{ warehouseSelect(record.transInfo.deliverDynamicsFields.originWarehouseId) }}</span>
								</a-tooltip>
							</a-col>
							<a-col :span="6">
								<span class="label">终端企业：</span>
								<a-tooltip>
									<template
										slot="title"
										v-if="record.transInfo.deliverDynamicsFields.terminalCompanyName"
									>
										{{ record.transInfo.deliverDynamicsFields.terminalCompanyName || '-' }}
									</template>
									<span class="value">{{ record.transInfo.deliverDynamicsFields.terminalCompanyName || '-' }}</span>
								</a-tooltip>
							</a-col>
						</template>
						<a-col :span="6">
							<span class="label">品名：</span>
							<span class="value">{{ record.transInfo.deliverDynamicsFields.goodsName || '-' }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">考核热值(kcal/kg)：</span>
							<span class="value">{{ record.transInfo.deliverDynamicsFields.checkCalorificValue || '-' }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">发货数量(吨)：</span>
							<span class="value">{{ record.transInfo.deliverQuantity || '-' }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">发货日期：</span>
							<span class="value">{{ record.transInfo.deliverDate }}</span>
						</a-col>
						<template v-if="record.transInfo.transType == 1">
							<a-col :span="6">
								<span class="label">托运人：</span>
								<span class="value">{{ record.transInfo.shipperName }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">运单号：</span>
								<span class="value">{{ record.transInfo.serialNo }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">车数：</span>
								<span class="value">{{ record.transInfo.trainNum }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">发站：</span>
								<span class="value">{{ record.transInfo.deliveryStation }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">到站：</span>
								<span class="value">{{ record.transInfo.arriveStation }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">铁路计划号：</span>
								<span class="value">{{ record.transInfo.railwayPlanNo }}</span>
							</a-col>
						</template>
						<template v-if="record.transInfo.transType == 3">
							<a-col :span="6">
								<span class="label">提单号：</span>
								<span class="value">{{ record.transInfo.ladingNo || '-' }}</span>
							</a-col>
							<a-col :span="6">
								<span class="label">提单日期：</span>
								<span class="value">{{ record.transInfo.ladingDate || '-' }}</span>
							</a-col>
						</template>
					</a-row>
					<ShipInfo
						class="inner-table"
						:deliverId="record.deliverId"
						:received="record.status != 2 && record.status != 3"
						ref="shipInfo"
						:disabled="true"
						v-if="record.transInfo.transType == 3"
						:dataSource="record.transInfo.shipDetailDtoList"
					/>
					<TrainInfo
						class="inner-table"
						:deliverInfo="record"
						ref="trainInfo"
						:disabled="true"
						v-if="record.transInfo.transType == 1"
						:data-source="record.transInfo.fireDetailDtoList"
					/>
					<FileTable
						style="margin-top: -10px"
						class="inner-table sub-title-small"
						:fileData="record.attachVOS"
						:disabled="true"
					/>
				</div>
			</a-table>
			<a-table
				style="margin-top: 10px"
				v-if="deliverCheckList && deliverCheckList.length"
				:row-selection="isDetail ? null : rowSelectionCheck"
				:expandIconAsCell="false"
				:expandRowByClick="true"
				:customRow="RowClick"
				:expandedRowKeys="expandedRowKeys"
				:expandIconColumnIndex="isDetail ? 4 : 5"
				class="new-table"
				:bordered="false"
				:scroll="{ x: true }"
				:expandIcon="expandIcon"
				:dataSource="deliverCheckList"
				:columns="deliverColumns"
				:pagination="false"
				rowKey="deliverId"
			>
				<div
					slot="expandedRowRender"
					slot-scope="record"
				>
					<a-row>
						<a-col :span="6">
							<span class="label">发货数量(吨)：</span>
							<span class="value">{{ record.transInfo.deliverQuantity }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">发货日期：</span>
							<span class="value">{{ record.transInfo.deliverDate }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">发货地址：</span>
							<span class="value">{{ record.transInfo.deliverAddr }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">收货地址：</span>
							<span class="value">{{ record.transInfo.receiveAddr }}</span>
						</a-col>
						<a-col :span="6">
							<span class="label">车数：</span>
							<span class="value">{{ record.transInfo.trainNum }}</span>
						</a-col>
						<a-col
							:span="6"
							v-if="record.transInfo.coalPlanSerialNo"
						>
							<span class="label">上煤计划编号：</span>
							<a
								v-if="authFlag"
								href="javascript:;"
								@click="jumpDetail(record.transInfo)"
								>{{ record.transInfo.coalPlanSerialNo }}</a
							>
							<span v-else>{{ record.transInfo.coalPlanSerialNo }}</span>
						</a-col>
					</a-row>
					<FileTable
						:fileData="record.attachVOS"
						:disabled="true"
					/>
				</div>
			</a-table>
		</div>
	</div>
</template>

<script>
import { validNumber } from '@/v2/utils/validForm';
import FileTable from '@/v2/center/logisticSupervise/views/receive/components/FileTable';
import ShipInfo from '@/v2/center/logisticSupervise/views/receive/components/ShipInfo';
import TrainInfo from '@/v2/center/logisticSupervise/views/receive/components/TrainInfo';
import { deliverColumns } from '@/v2/center/logisticSupervise/views/receive/columns/columns';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import { getTransferWarehouseList } from '@/v2/center/logisticSupervise/api/settle';
import { getWarehouseRecord, getPortNameRecord } from '../../../api/inout.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
const transTypeData = [
	{
		name: '火运',
		value: 'TRAIN'
	},
	{
		name: '汽运',
		disabled: true,
		value: 'AUTOMOBILE'
	},
	{
		name: '船运',
		value: 'SHIP'
	}
];
const deliveryDespatchTypeList = [
	{
		name: '中转发运',
		value: 'TRANSFER_DELIVERY'
	},
	{
		name: '终端发运',
		value: 'TERMINAL_DELIVERY'
	}
];
export default {
	props: {
		deliverId: {
			type: String,
			default: () => {
				return '';
			}
		},
		contractVo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		deliverList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		isDetail: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},

	watch: {
		deliverList(e) {
			this.deliverCheckList = [];
			this.deliverRadioList = [];
			e.map(item => {
				if (item.transInfo.transType == 2) {
					this.deliverCheckList.push(item);
				} else {
					this.deliverRadioList.push(item);
				}
			});
			// 默认选中已有批次号,并回显发货数量
			if (this.$route.query.deliverId) {
				let selectedObj = null
				if (this.deliverCheckList.length) {
					selectedObj = this.deliverCheckList.filter(task => task.deliverId === this.$route.query.deliverId);
				} else {
					selectedObj = this.deliverRadioList.filter(task => task.deliverId === this.$route.query.deliverId);
				}
				if (selectedObj) {
					this.$emit('selectDeliver', selectedObj);
				}
			}
		},
		transTypeData(data) {
			// 如果只有一种方式，则为默认设置选中
			if (data.length === 1) {
				this.$emit('changeTransType', data[0].value);
			}
		}
	},
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this, { name: 'deliverInfo' }),
			deliveryDespatchTypeList,
			deliverColumns,
			validNumber,
			expandedRowKeys: [this.deliverId], //展开行
			warehouseList: [],
			deliverCheckList: [], // 汽运支持多选
			deliverRadioList: [], // 火运和船运只能单选
			selectedRowKeysRaido: [],
			selectedRowKeysCheckBox: [],
			historyGoodList: [],
			goodsNameList: filterCodeByKey('SHANMEI_GOODSNAME')
		};
	},
	components: {
		FileTable,
		TrainInfo,
		ShipInfo
	},
	mounted() {
		this.getWarehouseList();
		this.form.setFieldsValue({
			deliveryDespatchType: this.$route.query.deliveryDespatchType || ''
		});
	},
	computed: {
		rowSelectionCheck() {
			let that = this;
			let checklist = this.deliverCheckList.filter(item => !(item.status != 2 && item.status != 3));
			return {
				selectedRowKeys: that.selectedRowKeysCheckBox,
				onChange: (selectedRowKeys, selectedRows) => {
					if (selectedRowKeys.length == checklist.length && checklist.length != 1) {
						if (that.selectedRowKeysCheckBox.lenght + 1 == selectedRowKeys.length) {
							that.expandedRowKeys = selectedRowKeys;
						}
					} else {
						that.expandedRowKeys = selectedRowKeys;
					}
					that.selectedRowKeysRaido = [];
					that.selectedRowKeysCheckBox = selectedRowKeys;
					that.$emit('selectDeliver', selectedRows);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.status != 2 && record.status != 3,
						defaultChecked: record.deliverId === this.$route.query.deliverId,
					}
				})
			};
		},
		rowSelectionRadio() {
			let that = this;
			return {
				type: 'radio',
				selectedRowKeys: that.selectedRowKeysRaido,
				onChange: (selectedRowKeys, selectedRows) => {
					that.expandedRowKeys = selectedRowKeys;
					that.selectedRowKeysCheckBox = [];
					that.selectedRowKeysRaido = selectedRowKeys;
					that.$emit('selectDeliver', selectedRows);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.status != 2 && record.status != 3,
						defaultChecked: record.deliverId === this.$route.query.deliverId,
					}
				})
			};
		},
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		transTypeData() {
			// 根据运输方式决定展示
			let transTypeDataFilter = transTypeData.filter(item => this.contractVo?.transportMode?.includes(item.value));
			return transTypeDataFilter;
		}
	},
	methods: {
		async checkLength(rule, value, callback) {
			if (value && value.length > 200) {
				callback('长度需在 1-200 字之间');
			} else {
				callback();
			}
		},
		async getInOutHistoryList(stationId) {
			let warehousePromise = getWarehouseRecord({ warehouseId: stationId });
			let portNamePromise = getPortNameRecord({stationId: stationId});
			let resList = await Promise.all([warehousePromise, portNamePromise]);
			this.historyGoodList = resList[0].result || [];
			let portNameHistoryInfo = resList[1].result || {};
			this.$emit('portNameHistoryListChange', portNameHistoryInfo);
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		// 发运类型适配
		deliveryDespatchTypeSelect(deliveryDespatchType) {
			let desc = '-';
			if (deliveryDespatchType) {
				let find = deliveryDespatchTypeList.find(item => item.value === deliveryDespatchType);
				if (find) {
					desc = find.name;
				}
			}
			return desc;
		},
		// 仓库适配
		warehouseSelect(warehouseId) {
			let desc = '-';
			if (warehouseId) {
				let find = this.warehouseList.find(item => item.id === warehouseId);
				if (find) {
					desc = find.name;
				}
			}
			return desc;
		},
		getWarehouseList() {
			getTransferWarehouseList().then(res => {
				if (res.success) {
					this.warehouseList = res.data;
				}
			});
		},
		RowClick(record, index) {
			return {
				on: {
					click: () => {
						let key = record.deliverId;
						let set = new Set(this.expandedRowKeys);
						if (set.has(key)) {
							set.delete(key);
						} else {
							set.add(key);
						}
						this.expandedRowKeys = Array.from(set);
					}
				}
			};
		},
		changeTransType(e) {
			this.$emit('changeTransType', e);
		},
		expandIcon(props) {
			const { onExpand, expanded } = props;

			if (expanded) {
				return (
					<div
						class="inner-table-icon expand-open"
						onClick={onExpand}
					/>
				);
			} else {
				return (
					<div
						class="inner-table-icon expand-close"
						onClick={onExpand}
					/>
				);
			}
		},
		submitReleaseForm() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						resolve(values);
					}
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}

/deep/ .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
	background: #e4ebf4;
}
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
		.ant-col {
			min-height: 82px;
		}
	}
}
.label {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 14px;
	color: #77889d;
}

.value {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 14px;
	color: rgba(0, 0, 0, 0.8);
}

/deep/ .new-table .ant-table-expanded-row {
	background: none !important;
}
.new-table {
	.ant-col {
		margin-bottom: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.alert-warning {
	background: rgba(244, 131, 13, 0.1);
	border: 1px solid #ffd5b0;
	border-radius: 4px;
	line-height: 44px;
	margin-top: 20px;
	padding-left: 14px;
	color: rgba(0, 0, 0, 0.8);

	img {
		margin-right: 12px;
		height: 16px;
		vertical-align: sub;
	}
}

.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
/deep/ .inner-table .ant-table-thead > tr > th,
/deep/ .inner-table .ant-table-thead > tr > th {
	background: #ffffff !important;
	border-bottom: 1px solid #e5e6eb;
}

//覆盖组件内部的样式
/deep/ .sub-title-small {
	.sub-title {
		font-size: 14px;
		padding-left: 0;
		margin-bottom: -10px;
		&:before {
			display: none;
		}
	}
}
.inner-table-icon {
	width: 16px;
	height: 16px;
	float: right;
	cursor: pointer;
}
.expand-close {
	background: url('~@/v2/assets/imgs/receive/inner-table-close.png');
	background-size: cover;
	&:hover {
		background: url('~@/v2/assets/imgs/receive/inner-table-enter.png');
		background-size: cover;
	}
}
.expand-open {
	background: url('~@/v2/assets/imgs/receive/inner-table-open.png');
	background-size: cover;
}
</style>
