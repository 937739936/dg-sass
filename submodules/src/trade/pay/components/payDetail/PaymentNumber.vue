<template>
	<div class="payment-num-info">
		<em
			v-if="pageType == 'PAY'"
			class="payTypeSymbol"
			>付</em
		>
		<em
			v-if="pageType == 'COLLECT' || pageType =='COLLECT_CONFIRM'"
			class="payTypeSymbol"
			>收</em
		>
		<div
			@mouseenter="onMouseOverContractNo()"
			@mouseleave="onMouseOutContractNo()">
			<span class="payment-num">付款流水号：{{ paymentNo }}</span>
			<span
				v-show="!copyContractNoVisible"
				class="copy-icon"
				>
				<Copy></Copy>
			</span>
			<span
				v-show="copyContractNoVisible"
				v-clipboard:success="onCopy" 
				v-clipboard:error="onError"  
				v-clipboard:copy="paymentNo"
				class="copy-icon"
				>
				<CopyNow></CopyNow>
			</span>
		</div>
		<slot name="statusTag">
			<PaymentStatusTag :statusDes="paymentStatusDesc" />
		</slot>
	</div>
</template>

<script>
import PaymentStatusTag from './PaymentStatusTag.vue';
import {Copy, CopyNow } from '@sub/components/svg'
export default {
	name: 'PaymentNumber',
	components: {
		PaymentStatusTag,
		Copy,
		CopyNow,
	},
	data() {
		return {
			copyContractNoVisible: false
		}
	},
	props: {
		// 类型：付款'PAY' / 收款'COLLECT' / 收款确认'COLLECT_CONFIRM'
		pageType: {
			type: String // 'PAY' or 'COLLECT'
		},
		// 付款编号
		paymentNo: {
			type: String,
			default: ''
		},
		// 付款状态描述
		paymentStatusDesc: {
			type: String,
			default: ''
		},
		// 付款状态
		paymentStatus: {
			type: String,
			default: ''
		}
	},
	methods: {
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		onCopy() {
			this.$message.success('复制成功');
		},
		onError() {
			this.$message.error('复制失败');
		}
	}
};
</script>

<style lang="less" scoped>
.payment-num-info {
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	.symbol-icon {
		width: 18px;
		height: 18px;
	}
	.payment-num {
		margin-left: 12px;
		font-size: 16px;
		font-weight: 500;
		font-family: PingFang SC;
		color: #000000cc;
	}
	.copy-icon {
		margin-left: 12px;
		margin-right: 20px;
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
	.payTypeSymbol {
		display: inline-block;
		width: 18px;
		height: 18px;
		background:@primary-color;
		color: #fff;
		text-align: center;
		line-height: 18px;
		border-radius: 4px;
		font-style: normal;
		font-size: 14px;
	}
}
</style>