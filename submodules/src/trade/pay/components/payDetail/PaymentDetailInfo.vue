<template>
	<div class="detail-container">
		<div class="basic-info-card">
			<div class="page-title">{{ pageTitle }}</div>
			<BaseInfo
				:pageType="pageType"
				:detailInfo="detailInfo"
				:statusTipInfo="statusTipInfo"
				@openNewTabPage="openNewTabPage"
				@getStepStatusTip="getStepStatusTip"
			>
				<template slot="statusTag">
					<slot name="statusTag"></slot>
				</template>
			</BaseInfo>
		</div>
		<div class="content-card">
			<a-tabs :animated="true">
				<a-tab-pane
					key="PAYMENT_INFO"
					tab="付款信息"
				>
					<PaymentInfoList
						:detailInfo="detailInfo"
						@openNewTabPage="openNewTabPage"
						@downloadAttachment="downloadAttachment"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="OPERATION_RECORD"
					tab="操作记录"
				>
					<OperationRecordTable :dataSource="paymentOperateLogList"></OperationRecordTable>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>

<script>
import BaseInfo from './BaseInfo';
import OperationRecordTable from './OperationRecordTable';
import PaymentInfoList from './PaymentInfoList';
export default {
	name: 'PaymentDetailInfo',
	components: {
		BaseInfo,
		PaymentInfoList,
		OperationRecordTable
	},
	props: {
		/**
		 * 类型：
		 * 付款'PAY'
		 * 收款'COLLECT'
		 * 收款确认'COLLECT_CONFIRM'
		 * */
		pageType: {
			type: String
		},
		// 合同信息
		detailInfo: {
			type: Object,
			default: () => ({})
		},
		statusTipInfo: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		// 付款类型
		pageTitle() {
			let title = '详情';
			switch (this.pageType) {
				case 'PAY':
					title = '付款详情';
					break;
				case 'COLLECT':
					title = '收款详情';
					break;
				case 'COLLECT_CONFIRM':
					title = '收款确认';
					break;
			}
			return title;
		},
		// 操作记录列表
		paymentOperateLogList() {
			return this.detailInfo.paymentOperateLogList || [];
		}
	},
	methods: {
		// 下载附件
		downloadAttachment(attachType) {
			this.$emit('downloadAttachment', attachType);
		},
		// 打开新标签页
		openNewTabPage(businessPageType, record) {
			this.$emit('openNewTabPage', businessPageType, record);
		},
		getStepStatusTip(v, s) {
			this.$emit('getStepStatusTip', v, s);
		}
	}
};
</script>

<style lang="less" scoped>
.detail-container {
	min-height: 100%;
	display: flex;
	flex-direction: column;
	.basic-info-card {
		margin-bottom: 20px;
		padding: 20px 30px;
		background: #fff;
		border-radius: 4px;
	}
	.content-card {
		// flex: 1;
		flex-grow: 1;
		margin-bottom: -4px;
		padding: 15px 30px 20px;
		background: #fff;
		border-radius: 4px;
	}
	.page-title {
		font-size: 24px;
		font-weight: 500;
		font-family: PingFang SC;
		color: #000000cc;
	}
}
</style>