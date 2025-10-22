<template>
	<div class="payment-info-list">
		<PaymentBaseInfo
			title="付款信息"
			:basicInfo="basicInfo"
		/>
		<template v-if="isShowGoods">
			<GoodsBatchTable
				v-if="deliverRecordList.length > 0"
				title="货物批次"
				:dataSource="deliverRecordList"
				@openNewTabPage="openNewTabPage"
			/>
			<GoodsTransferTable
				v-else-if="goodsTransferRecordList.length > 0"
				title="货转批次"
				:dataSource="goodsTransferRecordList"
				@openNewTabPage="openNewTabPage"
			/>
		</template>
		<template v-if="isShowBusinessLineDownCollect">
			<OffLineBusinessLineDownCollectTable
				v-if="businessLineDownIsOffLine"
				title="业务线下游回款"
				:collectionVO="collectionVO"
				@openNewTabPage="openNewTabPage"
			/>
			<OnLineBusinessLineDownCollectTable
				v-if="businessLineDownIsOnLine"
				title="业务线下游回款"
				:paymentVO="paymentVO"
				@openNewTabPage="openNewTabPage"
			/>
		</template>
		<UpSettleTable
			v-if="isShowUpSettle"
			title="上游结算单"
			settleType="up"
			:dataSource="statementVOList"
			@openNewTabPage="openNewTabPage"
		/>
		<UpSettleTable
			v-if="isShowDownSettle"
			settleType="down"
			title="下游结算单"
			:dataSource="downStreamStatementVOList"
			@openNewTabPage="openNewTabPage"
		/>
		<template v-if="isShowInvoice">
			<InvoiceInfo
				v-if="isShowUpInvoice"
				title="上游发票"
				:invoiceVO="detailInfo.upStreamInvoiceVO"
				:isUpLine="true"
				@openNewTabPage="openNewTabPage"
			/>
			<InvoiceInfo
				v-if="isShowDownInvoice"
				title="下游发票"
				:isUpLine="false"
				:invoiceVO="detailInfo.downStreamInvoiceVO"
				@openNewTabPage="openNewTabPage"
			/>
		</template>
		<TaxInfoTable
			v-if="isShowTaxInfo"
			title="税务信息"
			:dataSource="taxVOList"
		/>
		<AttachmentTable
			v-if="isShowAttachment"
			title="附件"
			:dataSource="fileInfoList"
			@downloadAttachment="downloadAttachment"
		/>
	</div>
</template>
 
<script>
import PaymentBaseInfo from './PaymentBaseInfo';
import GoodsBatchTable from './GoodsBatchTable';
import GoodsTransferTable from './GoodsTransferTable';
import OffLineBusinessLineDownCollectTable from './OffLineBusinessLineDownCollectTable';
import OnLineBusinessLineDownCollectTable from './OnLineBusinessLineDownCollectTable';
import UpSettleTable from './UpSettleTable';
import TaxInfoTable from './TaxInfoTable';
import InvoiceInfo from './InvoiceInfo';
import AttachmentTable from './AttachmentTable.vue';

export default {
	name: 'PaymentInfoList',
	components: {
		PaymentBaseInfo,
		GoodsBatchTable,
		GoodsTransferTable,
		OffLineBusinessLineDownCollectTable,
		OnLineBusinessLineDownCollectTable,
		UpSettleTable,
		TaxInfoTable,
		InvoiceInfo,
		AttachmentTable
	},
	props: {
		detailInfo: {
			type: Object,
			default: () => {}
		}
	},
	inject: ['pageType'],
	data() {
		return {};
	},
	computed: {
		// 是否是付款详情
		isPaymentDetail() {
			return this.pageType === 'PAY';
		},
		// 付款基本信息
		basicInfo() {
			return this.detailInfo.basicInfo ?? {};
		},
		// 合同信息
		contractVO() {
			return this.detailInfo.contractVO ?? {};
		},
		// 业务线
		businessLineVO() {
			return this.detailInfo.businessLineVO ?? {};
		},
		// 货物批次/货转批次
		deliverGoodsTransVO() {
			return this.detailInfo.deliverGoodsTransVO ?? {};
		},
		// 有效发运批次
		deliverRecordList() {
			return this.deliverGoodsTransVO.deliverRecordList ?? [];
		},
		// 有效货转批次
		goodsTransferRecordList() {
			return this.deliverGoodsTransVO.goodsTransferRecordList ?? [];
		},
		// 下游回款信息（业务线下游为线下时展示）
		collectionVO() {
			return this.detailInfo.collectionVO ?? {};
		},
		// 下游付款信息（业务线下游为电子时展示）
		paymentVO() {
			return this.detailInfo.paymentVO ?? {};
		},
		// 上游结算单信息
		statementVOList() {
			return this.detailInfo.statementVOList ?? [];
		},
		// 下游结算单信息
		downStreamStatementVOList() {
			return this.detailInfo.downStreamStatementVOList ?? [];
		},
		// 税务信息
		taxVOList() {
			return this.detailInfo.taxVOList ?? [];
		},
		// 附件信息
		fileInfoList() {
			return this.detailInfo.fileInfoList ?? [];
		},
		// 后台admin配置信息
		bankProductItemVO() {
			return this.detailInfo.bankProductItemVO ?? {};
		},
		// 是否显示货物批次/货转批次
		isShowGoods() {
			// 付款类型： 预结算付款
			return this.basicInfo.paymentType === 'PRE_SETTLEMENT';
		},
		// 是否显示业务线下游回款
		isShowBusinessLineDownCollect() {
			if (!this.isPaymentDetail) {
				// 非付款详情页不显示业务线下游回款
				return false;
			}
			// 业务类型为标准仓押
			return this.contractVO.businessType === 'WAREHOUSE_RECEIPTS_PLEDGE';
		},
		// 业务线下游是否为线下合同
		businessLineDownIsOffLine() {
			let isCanShow = this.businessLineVO.businessLineType === 'DOWN' || this.businessLineVO.businessLineType === 'OFFLINE';
			let collectionInfoList = this.collectionVO.collectionInfoList || [];
			return isCanShow && collectionInfoList.length > 0;
		},
		// 业务线下游是否为线上合同
		businessLineDownIsOnLine() {
			let isCanShow = this.businessLineVO.businessLineType === 'UP' || this.businessLineVO.businessLineType === 'ONLINE';
			let paymentRecordList = this.paymentVO.paymentRecordList || [];
			return isCanShow && paymentRecordList.length > 0;
		},
		// 是否显示上游结算单
		isShowUpSettle() {
			// 付款类型： 结算付款
			let isCanShow = this.basicInfo.paymentType === 'SETTLEMENT';
			return isCanShow && this.statementVOList.length > 0;
		},
		// 是否显示下游结算单
		isShowDownSettle() {
			// 付款类型： 结算付款
			let isCanShow = this.basicInfo.paymentType === 'SETTLEMENT';
			return isCanShow && this.downStreamStatementVOList.length > 0;
		},
		// 是否显示发票信息
		isShowInvoice() {
			// 有票付款
			return this.basicInfo.hasInvoice === 'INVOICE';
		},
		isShowUpInvoice() {
			// 上游发票
			let upStreamInvoiceVO = this.detailInfo.upStreamInvoiceVO || {};
			return (
				(upStreamInvoiceVO.tradeInvoiceList && upStreamInvoiceVO.tradeInvoiceList.length > 0) ||
				(upStreamInvoiceVO.transInvoiceList && upStreamInvoiceVO.transInvoiceList.length > 0)
			);
		},
		isShowDownInvoice() {
			if (!this.isPaymentDetail) {
				// 非付款详情页不显示下游发票
				return false;
			}
			// 下游发票
			let downStreamInvoiceVO = this.detailInfo.downStreamInvoiceVO || {};
			return (
				(downStreamInvoiceVO.tradeInvoiceList && downStreamInvoiceVO.tradeInvoiceList.length > 0) ||
				(downStreamInvoiceVO.transInvoiceList && downStreamInvoiceVO.transInvoiceList.length > 0)
			);
		},
		// 是否显示税务信息
		isShowTaxInfo() {
			// 是否显示税务信息根据admin配置上游完税证明配置 or 上游纳税申报表
			let isCanShow = this.bankProductItemVO.taxPaymentUpConfig === true || this.bankProductItemVO.taxReturnUpConfig === true;
			return isCanShow && this.taxVOList.length > 0;
		},
		// 是否显示附件信息
		isShowAttachment() {
			return this.fileInfoList.length > 0;
		}
	},
	mounted() {},
	methods: {
		// 下载附件
		downloadAttachment(attachType) {
			this.$emit('downloadAttachment', attachType);
		},
		// 打开新标签页
		openNewTabPage(businessType, record) {
			this.$emit('openNewTabPage', businessType, record);
		}
	}
};
</script>

<style lang="less" scoped>
.payment-info-list {
	width: 100%;
}
</style>