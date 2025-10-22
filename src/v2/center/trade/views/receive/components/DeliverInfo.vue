<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
	<div>
		<div
			class="alert-warning"
			v-if="deliverInfo.status == '已驳回'"
		>
			<img
				src="~@/v2/assets/imgs/receive/alert-warning.png"
				alt=""
			/>
			驳回原因：{{ deliverInfo.auditRefuseReason }}
		</div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
			v-if="!disabled"
			style="padding-bottom: 0"
		>
			<a-row>
				<a-col
					:span="8"
					style="margin-bottom: 0"
				>
					<a-row>
						<a-form-item
							label="运输方式"
							required
							:style="{ marginBottom: $route.query.orderId || form.getFieldValue('transType') ? '0' : '150px' }"
						>
							<a-select
								placeholder="请选择运输方式"
								:getPopupContainer="getPopupContainer"
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
										]
									}
								]"
							>
								<a-select-option
									:value="item.value"
									v-for="item in transTypeData"
									:key="item.value"
									>{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					style="margin-bottom: 0"
					v-if="form.getFieldValue('transType') == 'AUTOMOBILE'"
				>
					<a-form-item
						label="发货批次"
						:colon="false"
					>
						<a-radio-group 
							@change="changeBatchType" 
							v-decorator="[
									'batchType',
									{
										rules: [{ required: true, message: '请选择发货批次',}],
										initialValue: 'SingleBatch',
									},
								]"
						>
							<a-radio value="SingleBatch">单批次发货</a-radio>
							<a-radio value="MultipleBatch">多批次发货</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<!-- <span v-if="transInfo.transType == 1">火运</span>
        <span v-if="transInfo.transType == 2">汽运</span>
        <span v-if="transInfo.transType == 3">船运</span> -->
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
				<div
					slot="expandedRowRender"
					slot-scope="record"
				>
					<a-row>
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
					<!-- 判断当前是应收业务 并且是汽运 -->
					<CarInfo
						:contractVo="contractVo"
						:received="record.status != 2 && record.status != 3"
						type="receive"
						ref="carInfo"
						:disabled="true"
						v-if="record.transInfo.transType == 2 && contractVo.businessType != 'ACCOUNT_RECEIVABLE'"
						:datas="record.transInfo.automobileDetailDtoList"
						:inCoalPlanSerialNoList="record.transInfo.inCoalPlanSerialNoList"
						:transInfo="record.transInfo"
					/>
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
import { deliverColumns } from '@/v2/center/trade/views/receive/columns/columns';
import FileTable from '@/v2/center/trade/views/receive/components/FileTable';
import CarInfo from '@/v2/center/trade/views/receive/components/CarInfo';
import TrainInfo from '@/v2/center/trade/views/receive/components/TrainInfo';
import ShipInfo from '@/v2/center/trade/views/receive/components/ShipInfo';
import innerTableOpen from '@/v2/assets/imgs/receive/inner-table-open.png';
import innerTableClose from '@/v2/assets/imgs/receive/inner-table-close.png';
import innerTableEnter from '@/v2/assets/imgs/receive/inner-table-enter.png';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import { subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
const transTypeData = [
	{
		name: '火运',
		value: 'TRAIN'
	},
	{
		name: '汽运',
		value: 'AUTOMOBILE'
	},
	{
		name: '船运',
		value: 'SHIP'
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
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		deliverList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		deliverInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		isDetail: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		contractVo: {
			type: Object,
			default: () => {
				return {};
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
		}
	},
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this, { name: 'deliverInfo' }),
			isReceive: this.$route.query.from === 'receive',
			dataSource: [],
			deliverColumns,
			transTypeData,
			deliverCheckList: [], // 汽运支持多选
			deliverRadioList: [], // 火运和船运只能单选
			selectedRowKeysRaido: [],
			selectedRowKeysCheckBox: [],
			innerTableOpen,
			innerTableClose,
			innerTableEnter,
			expandedRowKeys: [this.deliverId], //展开行
			contractNo: ''
		};
	},
	components: {
		FileTable,
		CarInfo,
		TrainInfo,
		ShipInfo
	},
	mounted() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		authFlag() {
			return (
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage:inCoalPlan')
			);
		},
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
		}
	},
	methods: {
		setContractNo(val) {
			this.contractNo = val;
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
		changeBatchType(e) {
			this.$emit('changeBatchType', e.target.value);
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
		jumpDetail(transInfo) {
			const { stationId, stationCompanyUscc } = transInfo;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/coalplan/IN/detail',
				query: {
					contractType: 'ONLINE',
					id: transInfo.coalPlanId
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
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
}
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

.ant-col {
	margin-bottom: 20px;
}

.ant-form-item {
	width: 364px;
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
