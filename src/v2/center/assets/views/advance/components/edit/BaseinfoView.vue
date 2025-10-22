<template>
	<div>
		<div class="slTitleAssis">基本信息</div>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="合同编号">
				<div
					@mouseenter="contractNoCopy = true"
					@mouseleave="contractNoCopy = false"
				>
					<a
						@click="goContract"
						href="javascript:;"
						>{{ detailData.receivalVO.contractNo || '-' }}</a
					>
					<Copy
						v-if="detailData.receivalVO.contractNo"
						class="cur"
						v-show="!contractNoCopy"
					></Copy>
					<span
						v-if="detailData.receivalVO.contractNo"
						v-show="contractNoCopy"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="detailData.receivalVO.contractNo"
					>
						<CopyNow class="cur"></CopyNow>
					</span>
				</div>
			</a-descriptions-item>
			<a-descriptions-item label="卖方企业">{{ detailData.receivalVO.sellerName || '-' }} </a-descriptions-item>
			<a-descriptions-item label="买方名称">{{ detailData.receivalVO.buyerName || '-' }} </a-descriptions-item>
			<a-descriptions-item label="金融机构">{{ detailData.receivalVO.bankName || '-' }} </a-descriptions-item>
			<a-descriptions-item label="资金类型">{{ detailData.receivalVO.paymentTypeName || '-' }} </a-descriptions-item>
			<a-descriptions-item label="付款流水号">
				<div
					@mouseenter="SerialNoCopy = true"
					@mouseleave="SerialNoCopy = false"
				>
					<a
						@click="goPaymentDetail"
						href="javascript:;"
						>{{ detailData.receivalVO.paymentNo || '-' }}</a
					>
					<Copy
						v-if="detailData.receivalVO.paymentNo"
						class="cur"
						v-show="!SerialNoCopy"
					></Copy>
					<span
						v-if="detailData.receivalVO.paymentNo"
						v-show="SerialNoCopy"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="detailData.receivalVO.paymentNo"
					>
						<CopyNow class="cur"></CopyNow>
					</span>
				</div>
			</a-descriptions-item>
			<a-descriptions-item label="应付账款流水号">{{ detailData.receivalVO.serialNo || '-' }} </a-descriptions-item>
			<a-descriptions-item label="行业">{{ detailData.receivalVO.industryTypeDesc || '-' }} </a-descriptions-item>
			<a-descriptions-item label="应付账款申请日期">{{ detailData.receivalVO.requestTime || '-' }} </a-descriptions-item>
		</a-descriptions>
	</div>
</template>
<script>
import { Copy, CopyNow } from '@sub/components/svg/index';

export default {
	props: {
		detailData: {
			type: Object,
			default: undefined
		}
	},
	data() {
		return { contractNoCopy: false, SerialNoCopy: false };
	},
	methods: {
		onCopy(e) {
			this.$message.success('复制成功');
		},
		onError(e) {
			this.$message.error('复制失败');
		},
		goContract() {
			const type = 'BUY';
			let { contractType, orderId } = this.detailData.receivalVO;
			let path = `/center/contract/${type.toLowerCase()}/${contractType.toLowerCase()}/detail?id=${orderId}&type=${type}`;
			const routeData = this.$router.resolve({
				path
			});
			window.open(routeData.href, '_blank');
		},
		goPaymentDetail() {
			let { paymentId } = this.detailData.receivalVO;
			let path = `/center/fund/pay/record/detail?id=${paymentId}`;
			const routeData = this.$router.resolve({
				path
			});
			window.open(routeData.href, '_blank');
		}
	},
	components: {
		Copy,
		CopyNow
	}
};
</script>
<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding: 0 !important;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: inherit;
		// width: 22%;
	}
}

.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
.slTitleAssis {
	margin-bottom: 20px;
}
</style>
