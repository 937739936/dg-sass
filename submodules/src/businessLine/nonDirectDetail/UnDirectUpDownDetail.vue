<template>
	<div class="detail-container">
		<OverviewInfoView :contractInfo="contractInfoNotEmpty" />
		<div class="line"></div>
		<SegmentDetail
			:segmentType="segmentType"
			:segmentItems="segmentItems"
			:contentLoading="segmentContentLoading"
			@segmentTypeChange="segmentTypeChange"
		>
			<ContractInfoView
				v-if="segmentType === 'contract'"
				:orderType="orderType"
				:contract="contractSignInfo"
				@downloadAllContractFile="downloadAllContractFile"
				@downloadAttachmentFile="downloadAttachmentFile"
				@handlePreview="handlePreview"
			/>
			<FreightTransportView
				v-if="segmentType === 'goods'"
				:contract="contractInfoNotEmpty"
				:deliverBatchList="deliverBatchList"
				:goodsTransList="goodsTransList"
				:API_GetShipTrackFlag="apiInfo.API_GetShipTrackFlag"
				:API_getRouteInfo="apiInfo.API_getRouteInfo"
				@downloadGoodsTransferFile="downloadGoodsTransferFile"
			/>
			<FundTable
				v-if="segmentType === 'fund'"
				:contract="contractInfoNotEmpty"
				:dataSource="paymentList"
			/>
			<SettleTable
				v-if="segmentType === 'settle'"
				:contract="contractInfoNotEmpty"
				:dataSource="statementList"
				@downloadSettleFile="downloadSettleFile"
				@handlePreview="handlePreview"
			/>
			<InvoiceInfo
				ref="invoiceInfo"
				v-if="segmentType === 'invoice'"
				:contract="contractInfoNotEmpty"
				:tradeInvoiceList="tradeInvoiceList"
				:freightInvoiceList="freightInvoiceList"
				@onInvoiceSearchParamsChange="onInvoiceSearchParamsChange"
				@handlePreview="handlePreview"
			/>
			<TradingTable
				v-if="segmentType == 'trading'"
				:list="tradingList"
			></TradingTable>
		</SegmentDetail>
	</div>
</template>

<script>
import OverviewInfoView from '@sub/businessLine/nonDirectDetail/OverviewInfoView.vue';
import SegmentDetail from '@sub/businessLine/nonDirectDetail/SegmentDetail.vue';

import ContractInfoView from '@sub/businessLine/nonDirectDetail/ContractInfoView.vue';
import FreightTransportView from '@sub/businessLine/nonDirectDetail/FreightTransportView.vue';
import FundTable from '@sub/businessLine/nonDirectDetail/FundTable.vue';
import SettleTable from '@sub/businessLine/nonDirectDetail/SettleTable.vue';
import InvoiceInfo from '@sub/businessLine/nonDirectDetail/InvoiceInfo.vue';
import TradingTable from './TradingTable.vue';
// import TradingInfo from '@sub/businessLine/TradingInfo.vue';

export default {
	name: 'UnDirectUpDownDetail',
	components: {
		OverviewInfoView,
		SegmentDetail,
		ContractInfoView,
		FreightTransportView,
		FundTable,
		SettleTable,
		InvoiceInfo,
		TradingTable
	},
	props: {
		platform: {
			type: String,
			default: 'REST'
		},
		fullBusinessLineId: {
			type: String,
			required: true,
			default: ''
		},
		businessLineNo: {
			type: String,
			required: true,
			default: ''
		},
		contractInfo: {
			type: Object,
			required: true,
			default: () => {}
		},
		api: {
			type: Object,
			default: () => {}
		}
	},
	provide() {
		return {
			// 电子：ONLINE；线下：OFFLINE
			orderType: this.orderType,
			platformType: this.platformType // 平台类型：REST、ADMIN
		};
	},
	data() {
		return {
			segmentType: 'contract', // 当前选择的segment类型
			segmentContentLoading: false, // 用于控制segment内容的loading状态
			contractSignInfo: {}, // 合同签订信息
			deliverBatchList: [], // 货运信息
			goodsTransList: [], // 货物转信息
			paymentList: [], // 付款信息
			statementList: [], // 结算单信息
			tradeInvoiceList: [], // 贸易发票信息
			freightInvoiceList: [], // 运费发票信息
			tradingList: [] // 融资信息
		};
	},
	mounted() {
		this.segmentTypeChange('contract');
	},
	watch: {
		// 监听合同信息变化（切换上下游企业时）
		contractInfo: {
			deep: true,
			handler() {
				this.segmentTypeChange('contract');
			}
		}
	},
	computed: {
		platformType() {
			return this.platform || 'REST';
		},
		contractInfoNotEmpty() {
			return this.contractInfo || {};
		},
		orderType() {
			return this.contractInfoNotEmpty.orderType || 'ONLINE';
		},
		apiInfo() {
			return this.api || {};
		}, // 接口信息
		commonParams() {
			return {
				businessLineNo: this.businessLineNo,
				businessLineFullId: this.fullBusinessLineId,
				orderType: this.contractInfoNotEmpty.orderType,
				orderNo: this.contractInfoNotEmpty.orderNo
			};
		},
		segmentItems() {
			let list = [
				{
					label: '合同签订',
					value: 'contract'
				}
			];
			if (this.orderType === 'ONLINE') {
				list.push({
					label: '资金流水',
					value: 'fund'
				});
				list.push({
					label: '货物运输',
					value: 'goods'
				});
			} else {
				// 线下合同
				// 不要资金流水要回款（回款没做不显示）
			}
			list.push({
				label: '结算单',
				value: 'settle'
			});
			list.push({
				label: '发票',
				value: 'invoice'
			});
			if (this.platformType === 'ADMIN') {
				list.push({
					label: '融资',
					value: 'trading'
				});
			}
			return list;
		}
	},
	methods: {
		segmentTypeChange(type) {
			this.segmentType = type;
			this.$nextTick(() => {
				switch (this.segmentType) {
					case 'contract':
						// 合同签订信息
						this.getContractSignInfo();
						break;
					case 'goods':
						// 货运信息
						this.getDeliveryInfoList();
						// 货物转信息
						this.getGoodsTransferList();
						break;
					case 'fund':
						// 付款信息
						this.getPaymentInfoList();
						break;
					case 'settle':
						// 结算单信息
						this.getStatementList();
						break;
					case 'invoice':
						// 发票信息
						this.onInvoiceSearchParamsChange();
						break;
					case 'trading':
						// 融资信息
						this.onGetTradingList();
						break;
					default:
						break;
				}
			});
		},
		// 获取合同信息
		getContractSignInfo() {
			let getUnDirectStreamContractDetail = this.apiInfo.getUnDirectStreamContractDetail;
			if (!getUnDirectStreamContractDetail) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamContractDetail(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.contractSignInfo = res.data || {};
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		// 获取发运信息
		getDeliveryInfoList() {
			let getUnDirectStreamDeliverBatchList = this.apiInfo.getUnDirectStreamDeliverBatchList;
			if (!getUnDirectStreamDeliverBatchList) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamDeliverBatchList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.deliverBatchList = res.data || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		// 获取货转信息
		getGoodsTransferList() {
			let getUnDirectStreamGoodsTransferList = this.apiInfo.getUnDirectStreamGoodsTransferList;
			if (!getUnDirectStreamGoodsTransferList) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamGoodsTransferList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.goodsTransList = res.data || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		// 获取付款信息
		getPaymentInfoList() {
			let getUnDirectStreamPaymentList = this.apiInfo.getUnDirectStreamPaymentList;
			if (!getUnDirectStreamPaymentList) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamPaymentList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.paymentList = res.data || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		getStatementList() {
			let getUnDirectStreamStatementList = this.apiInfo.getUnDirectStreamStatementList;
			if (!getUnDirectStreamStatementList) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamStatementList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.statementList = res.data || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		getTradeInvoiceList() {
			let getUnDirectStreamTradeInvoiceList = this.apiInfo.getUnDirectStreamTradeInvoiceList;
			if (!getUnDirectStreamTradeInvoiceList) {
				return;
			}
			this.segmentContentLoading = true;
			let searchParams = this.$refs.invoiceInfo.searchParams;
			let params = {
				...this.commonParams,
				...searchParams
			};
			getUnDirectStreamTradeInvoiceList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.tradeInvoiceList = res.data.records || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		getFreightInvoiceList() {
			let getUnDirectStreamTransInvoiceList = this.apiInfo.getUnDirectStreamTransInvoiceList;
			if (!getUnDirectStreamTransInvoiceList) {
				return;
			}
			this.segmentContentLoading = true;
			let searchParams = this.$refs.invoiceInfo.searchParams;
			let params = {
				...this.commonParams,
				...searchParams
			};
			getUnDirectStreamTransInvoiceList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.freightInvoiceList = res.data.records || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		onInvoiceSearchParamsChange() {
			this.getTradeInvoiceList();
			this.getFreightInvoiceList();
		},
		onGetTradingList() {
			let getUnDirectStreamFinanceList = this.apiInfo.getUnDirectStreamFinanceList;
			if (!getUnDirectStreamFinanceList) {
				return;
			}
			this.segmentContentLoading = true;
			let params = {
				...this.commonParams
			};
			getUnDirectStreamFinanceList(params)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.tradingList = res.data || [];
				})
				.catch(() => {})
				.finally(() => {
					this.segmentContentLoading = false;
				});
		},
		// 下载附件
		downloadAttachmentFile(item, contract) {
			this.$emit('downloadSingleContractFile', item, contract);
		},
		// 预览附件
		handlePreview(url) {
			this.$emit('handlePreview', url);
		},
		// 下载所有合同文件
		downloadAllContractFile(contract) {
			this.$emit('downloadAllContractFile', contract);
		},
		// 下载货物转文件
		downloadGoodsTransferFile(record) {
			this.$emit('downloadGoodsTransferFile', record);
		},
		// 下载结算文件
		downloadSettleFile(item) {
			this.$emit('downloadSettleFile', item);
		}
	}
};
</script>

<style lang="less" scoped>
.detail-container {
	background: #f3f5f6;
	.line {
		background: #f3f5f6;
		height: 16px;
		// margin-top: -4px;
		// // margin-bottom: -4px;
		// z-index: -1;
	}
}
</style>