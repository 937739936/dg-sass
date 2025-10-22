<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					><span>服务费流水明细</span></span
				>
			</div>
			<div class="tips-box">
				<a-icon
					type="info-circle"
					style="color: var(--primary-color)"
				/>
				<div>
					<p>服务费流水明细是融资还款或下游回款后系统生成，单笔服务费金额根据资金占用时间、服务费率而定。</p>
					<p>待结算：系统已生成的服务费流水明细，未开具服务费结算单的数据</p>
					<p>已结算：平台出具服务费结算单后，对应的服务费流水的状态将变为已结算，已结算只代表该笔服务费流水已出具服务费结算单</p>
				</div>
			</div>
			<div class="tabs-box">
				<div
					class="export-box"
					@click="exportFiles"
				>
					<ExportIcon class="export-icon"></ExportIcon>
					<span class="export-text">数据导出</span>
				</div>
				<a-tabs
					default-active-key="UNSETTLED"
					@change="callback"
				>
					<a-tab-pane
						key="UNSETTLED"
						tab="待结算"
					>
						<template v-if="status === 'UNSETTLED'">
							<SlFormNew
								:list="unsettled_searchList"
								layout="inline"
								@change="handleChange"
								ref="SlFormNew"
							></SlFormNew>
							<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
								<a-table
									class="new-table"
									:pagination="false"
									:columns="columns"
									:data-source="dataSource"
									:scroll="{ x: true }"
									rowKey="id"
									:loading="loading"
								>
									<template
										slot="orderNo"
										slot-scope="orderNo, item"
									>
										<a @click="openOrder(item)">{{ orderNo }}</a>
									</template>
									<!-- 金额格式转化 1000=1,000.00 -->
									<template
										slot="serviceFeeAmount"
										slot-scope="serviceFeeAmount"
									>
										<span v-if="serviceFeeAmount">{{ serviceFeeAmount | formatMoney(2) }}</span>
										<span v-else>{{ serviceFeeAmount }}</span>
									</template>
									<template
										slot="receiveAmount"
										slot-scope="receiveAmount"
									>
										<span v-if="receiveAmount">{{ receiveAmount | formatMoney(2) }}</span>
										<span v-else>{{ receiveAmount }}</span>
									</template>
									<template
										slot="finAmount"
										slot-scope="finAmount"
									>
										<span v-if="finAmount">{{ finAmount | formatMoney(2) }}</span>
										<span v-else>{{ finAmount }}</span>
									</template>
									<template
										slot="repayAmount"
										slot-scope="repayAmount"
									>
										<span v-if="repayAmount">{{ repayAmount | formatMoney(2) }}</span>
										<span v-else>{{ repayAmount }}</span>
									</template>
									<template
										slot="repayPrincipal"
										slot-scope="repayPrincipal"
									>
										<span v-if="repayPrincipal">{{ repayPrincipal | formatMoney(2) }}</span>
										<span v-else>{{ repayPrincipal }}</span>
									</template>
									<template
										slot="repayInterest"
										slot-scope="repayInterest"
									>
										<span v-if="repayInterest">{{ repayInterest | formatMoney(2) }}</span>
										<span v-else>{{ repayInterest }}</span>
									</template>
									<span
										slot="status"
										slot-scope="status"
										>{{ status == 'UNSETTLED' ? '待结算' : '已结算' }}</span
									>
								</a-table>
								<i-pagination
									:pagination="pagination"
									@change="getList"
								/>
							</div>
						</template>
					</a-tab-pane>
					<a-tab-pane
						key="SETTLED"
						tab="已结算"
						force-render
					>
						<template v-if="status === 'SETTLED'">
							<SlFormNew
								:list="settled_searchList"
								layout="inline"
								@change="handleChange"
								ref="SlFormNew"
							></SlFormNew>
							<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
								<a-table
									class="new-table"
									:pagination="false"
									:columns="columnsAll"
									:data-source="dataSource"
									:scroll="{ x: true }"
									rowKey="id"
									:loading="loading"
								>
									<template
										slot="orderNo"
										slot-scope="orderNo, item"
									>
										<a @click="openOrder(item)">{{ orderNo }}</a>
									</template>
									<!-- 金额格式转化 1000=1,000.00 -->
									<template
										slot="serviceFeeAmount"
										slot-scope="serviceFeeAmount"
									>
										<span v-if="serviceFeeAmount">{{ serviceFeeAmount | formatMoney(2) }}</span>
										<span v-else>{{ serviceFeeAmount }}</span>
									</template>
									<template
										slot="receiveAmount"
										slot-scope="receiveAmount"
									>
										<span v-if="receiveAmount">{{ receiveAmount | formatMoney(2) }}</span>
										<span v-else>{{ receiveAmount }}</span>
									</template>
									<template
										slot="finAmount"
										slot-scope="finAmount"
									>
										<span v-if="finAmount">{{ finAmount | formatMoney(2) }}</span>
										<span v-else>{{ finAmount }}</span>
									</template>
									<template
										slot="repayAmount"
										slot-scope="repayAmount"
									>
										<span v-if="repayAmount">{{ repayAmount | formatMoney(2) }}</span>
										<span v-else>{{ repayAmount }}</span>
									</template>
									<template
										slot="repayPrincipal"
										slot-scope="repayPrincipal"
									>
										<span v-if="repayPrincipal">{{ repayPrincipal | formatMoney(2) }}</span>
										<span v-else>{{ repayPrincipal }}</span>
									</template>
									<template
										slot="repayInterest"
										slot-scope="repayInterest"
									>
										<span v-if="repayInterest">{{ repayInterest | formatMoney(2) }}</span>
										<span v-else>{{ repayInterest }}</span>
									</template>
									<span
										slot="status"
										slot-scope="status"
									>
										{{ status == 'UNSETTLED' ? '待结算' : '已结算' }}
									</span>
								</a-table>
								<i-pagination
									:pagination="pagination"
									@change="getList"
								/>
							</div>
						</template>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_ServiceFeeFlowList, API_ServiceFeeExportXls, getSettlementList } from '@/v2/center/financeCenter/api/index';
import comDownload from '@sub/utils/comDownload.js';
const concatColumuns = [
	{ title: '融资起息日', dataIndex: 'beginDate', width: 120 },
	{ title: '融资到期日', dataIndex: 'endDate', width: 120 },
	{ title: '融资金额', dataIndex: 'finAmount', scopedSlots: { customRender: 'finAmount' }, width: 150 },
	{ title: '还款日期', dataIndex: 'repayDate', width: 120 },
	{ title: '还款总额', dataIndex: 'repayAmount', scopedSlots: { customRender: 'repayAmount' }, width: 150 },
	{ title: '还款本金', dataIndex: 'repayPrincipal', scopedSlots: { customRender: 'repayPrincipal' }, width: 150 },
	{ title: '还款利息', dataIndex: 'repayInterest', width: 150 }
];
const unsettled_searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '服务费流水编号',
		type: 'input',
		placeholder: '请输入服务费流水编号'
	},
	{
		decorator: ['orderNo'],
		addonBeforeTitle: '订单编号',
		type: 'input',
		placeholder: '请输入订单编号',
		isShow: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['receivableNo'],
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['prePaymentAssetNo'],
		addonBeforeTitle: '预付流水号',
		type: 'input',
		placeholder: '请输入预付流水号'
	},
	{
		decorator: ['assetBillNo'],
		addonBeforeTitle: '票据号',
		type: 'input',
		placeholder: '请输入票据号'
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业类型',
		type: 'select',
		placeholder: '请选择',
		options: [
			{
				value: 'COAL',
				label: '煤炭'
			},
			{
				value: 'STEEL',
				label: '钢材'
			},
			{
				value: 'GRAIN',
				label: '粮食'
			},
			{
				value: 'ORE',
				label: '铁矿石'
			},

			{ label: '油品', value: 'OIL' },
			{ label: '有色金属', value: 'NON_FERROUS_METAL' }
		]
	},
	{
		decorator: ['settlementCompanyUscc'],
		addonBeforeTitle: '结算单位',
		type: 'select',
		placeholder: '请选择',
		options: []
	}
];
const settled_searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '服务费流水编号',
		type: 'input',
		placeholder: '请输入服务费流水编号'
	},
	{
		decorator: ['orderNo'],
		addonBeforeTitle: '订单编号',
		type: 'input',
		placeholder: '请输入订单编号',
		isShow: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['receivableNo'],
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['serviceFeeStatementNo'],
		addonBeforeTitle: '服务费结算单号',
		type: 'input',
		placeholder: '请输入服务费结算单号'
	},
	{
		decorator: ['payerName'],
		addonBeforeTitle: '付款方',
		type: 'input',
		placeholder: '请输入付款方'
	},
	{
		decorator: ['date'],
		addonBeforeTitle: '生成日期',
		type: 'rangePicker',
		realKey: ['beginDate', 'endDate'],
		placeholder: '请选择'
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业类型',
		type: 'select',
		placeholder: '请选择',
		options: [
			{
				value: 'COAL',
				label: '煤炭'
			},
			{
				value: 'STEEL',
				label: '钢材'
			},
			{
				value: 'GRAIN',
				label: '粮食'
			},
			{
				value: 'ORE',
				label: '铁矿石'
			}
		]
	},
	{
		decorator: ['prePaymentAssetNo'],
		addonBeforeTitle: '预付流水号',
		type: 'input',
		placeholder: '请输入预付流水号'
	},
	{
		decorator: ['assetBillNo'],
		addonBeforeTitle: '票据号',
		type: 'input',
		placeholder: '请输入票据号'
	},
	{
		decorator: ['settlementCompanyUscc'],
		addonBeforeTitle: '结算单位',
		type: 'select',
		placeholder: '请选择',
		options: []
	}
];

import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { ExportIcon } from '@sub/components/svg'
export default {
	mixins: [ListMixin],
	name: 'MyServiceFee',
	data() {
		return {
			columns: [],
			columnsAll: [],
			settlementCompanyUsccList: [],
			endTime: null,
			currentDate: '', //当前日期 如20210706
			tempColumns: [
				{ title: '服务费流水编号', dataIndex: 'serialNo', width: 150 },
				{ title: '生成时间', dataIndex: 'createTime', width: 150 },
				{ title: '服务费金额', dataIndex: 'serviceFeeAmount', scopedSlots: { customRender: 'serviceFeeAmount' }, width: 150 },
				{ title: '服务费付款金额', dataIndex: 'receiveAmount', scopedSlots: { customRender: 'receiveAmount' }, width: 150 },
				{ title: '付款方', dataIndex: 'payerName', width: 150 },
				{ title: '结算单位', dataIndex: 'settlementCompanyName', width: 150 },
				{ title: '金融机构', dataIndex: 'bankName', width: 150 },
				{ title: '行业类型', dataIndex: 'industryTypeDesc', width: 150 },
				{ title: '服务费率', dataIndex: 'serviceFeeRate', key: 'serviceFeeRate', width: 120 },
				{ title: '业务经理', dataIndex: 'assetTraderName', width: 120 },
				{ title: '资金流水号', dataIndex: 'paymentNo', width: 120 },
				{ title: '合同编号', dataIndex: 'contractNo', width: 180 },
				{ title: '服务费协议编号', dataIndex: 'serviceFeeAgreementNo', width: 180 },
				{ title: '应收账款流水号', dataIndex: 'receivableNo', width: 180 },
				{ title: '预付流水号', dataIndex: 'prePaymentAssetNo', key: 'prePaymentAssetNo', width: 180 },
				{ title: '票据号', dataIndex: 'assetBillNo', key: 'assetBillNo', width: 180 }
			],
			tempColumnsLogistucs: [
				{ title: '服务费流水编号', dataIndex: 'serialNo', width: 150 },
				{ title: '生成时间', dataIndex: 'createTime', width: 150 },
				{ title: '服务费金额', dataIndex: 'serviceFeeAmount', scopedSlots: { customRender: 'serviceFeeAmount' }, width: 150 },
				{ title: '服务费付款金额', dataIndex: 'receiveAmount', scopedSlots: { customRender: 'receiveAmount' }, width: 150 },
				{ title: '付款方', dataIndex: 'payerName', width: 150 },
				{ title: '结算单位', dataIndex: 'settlementCompanyName', width: 150 },
				{ title: '金融机构', dataIndex: 'bankName', width: 150 },
				{ title: '下游结算数量', dataIndex: 'downStatementQuantity', key: 'downStatementQuantity', width: 150 },
				{ title: '每吨费用', dataIndex: 'cost', key: 'cost', width: 150 },
				{ title: '行业类型', dataIndex: 'industryTypeDesc', width: 150 },
				{ title: '服务费率', dataIndex: 'serviceFeeRate', key: 'serviceFeeRate', width: 120 },
				{ title: '业务经理', dataIndex: 'assetTraderName', width: 120 },
				{ title: '资金流水号', dataIndex: 'paymentNo', width: 120 },
				{ title: '合同编号', dataIndex: 'contractNo', width: 180 },
				{ title: '服务费协议编号', dataIndex: 'serviceFeeAgreementNo', width: 180 },
				{ title: '应收账款流水号', dataIndex: 'receivableNo', width: 180 },
				{ title: '预付流水号', dataIndex: 'prePaymentAssetNo', key: 'prePaymentAssetNo', width: 180 },
				{ title: '票据号', dataIndex: 'assetBillNo', key: 'assetBillNo', width: 180 }
			],
			unsettled_searchList,
			settled_searchList,
			defaultParams: {
				status: 'UNSETTLED'
			},
			status: 'UNSETTLED',
			loading: false,
			selfLoad: true,
			url: {
				list: API_ServiceFeeFlowList
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isLogisticsCompany() {
			return this.VUEX_ST_COMPANYSUER.company.companyType == 'LOGISTICS';
		}
	},
	mounted() {
		this.initData();
	},
	methods: {
		handleChange(data) {
			this.unsettled_searchList.forEach(item => {
				if (item.decorator[0] === 'orderNo') {
					item.isShow = data.industryType !== 'STEEL';
				}
			});
			this.settled_searchList.forEach(item => {
				if (item.decorator[0] === 'orderNo') {
					item.isShow = data.industryType !== 'STEEL';
				}
			});
			this.changeSearch(data);
		},
		initData() {
			return new Promise(async resolve => {
				await this.getSettlementList();
				await this.getNowFormatDate();
				this.columns = [
					// 未结算
					...this.tempColumns,
					{ title: '状态', dataIndex: 'status', width: 100, scopedSlots: { customRender: 'status' } }
				].concat(concatColumuns);
				this.columnsAll = [
					// 已结算
					...this.tempColumns,
					{ title: '服务费结算单号', dataIndex: 'serviceFeeStatementNo', width: 180 },
					{ title: '状态', dataIndex: 'status', width: 100, scopedSlots: { customRender: 'status' } }
				].concat(concatColumuns);
				if (this.isLogisticsCompany) {
					this.tempColumns = this.tempColumnsLogistucs;
				}
				if (this.searchParams.industryType === 'COAL') {
					this.tempColumns.splice(14, 0, {
						title: '订单编号',
						dataIndex: 'orderNo',
						scopedSlots: { customRender: 'orderNo' },
						width: 180
					});
				}
				this.getList();
				resolve(true);
			});
		},
		getSettlementList() {
			getSettlementList().then(resList => {
				this.settlementCompanyUsccList = resList.result;
				this.unsettled_searchList.forEach(item => {
					if (item.decorator[0] === 'settlementCompanyUscc') {
						item.options = this.settlementCompanyUsccList.map(item => {
							return { value: item.value, label: item.text };
						});
					}
				});
				this.settled_searchList.forEach(item => {
					if (item.decorator[0] === 'settlementCompanyUscc') {
						item.options = this.settlementCompanyUsccList.map(item => {
							return { value: item.value, label: item.text };
						});
					}
				});
			});
		},
		// 打开合同详情页
		openOrder(item) {
			let routerData = this.$router.resolve({
				path: '/center/contract/' + item.orderType + '/online/detail',
				query: {
					id: item.orderId,
					type: item.orderType.toUpperCase()
				}
			});
			window.open(routerData.href, '_blank');
		},
		callback(key) {
			// tabs切换
			this.searchParams = {};
			this.defaultParams.status = key;
			this.status = key;
			this.searchArr = [];
		},
		exportFiles() {
			// 导出服务费流水明细
			let params = {
				...this.defaultParams,
				...this.searchParams
			};
			API_ServiceFeeExportXls(params).then(res => {
				comDownload(
					res,
					undefined,
					'服务费流水明细-' + (this.status == 'UNSETTLED' ? '待结算' : '已结算') + '-' + this.currentDate + '.xls'
				);
			});
		},
		getNowFormatDate() {
			// 获取当前日期  如20210706
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = '0' + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate;
			}
			this.currentDate = year.toString() + month.toString() + strDate.toString();
		}
	},
	components: {
		ExportIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.modal-pdf {
	.ant-modal-title,
	.ant-modal-footer {
		text-align: center;
	}
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
.search-btn {
	margin-right: 20px;
}
.tips-box {
	background: rgba(39, 143, 255, 0.1);
	border: 1px solid @primary-color;
	color: rgba(0, 0, 0, 0.65);
	border-radius: 2px;
	padding: 10px 14px;
	display: flex;
	flex-direction: row;
	margin: 20px 0;
	i {
		display: inline-block;
		margin-right: 8px;
		margin-top: 3px;
	}
}
::v-deep.ant-tabs-tabpane {
	display: block !important;
}
::v-deep.ant-table td {
	white-space: nowrap;
}
::v-deep.ant-calendar-picker {
	width: 100%;
}
.tabs-box {
	position: relative;
	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
	.export-box {
		position: absolute;
		right: 0;
		top: 16px;
		text-align: right;
		cursor: pointer;
		z-index: 10;
		.export-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: 1px;
		}
		.export-text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 20px;
		}
	}
	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
	}
}
</style>
