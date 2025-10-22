<template>
	<div>
		<PaymentStep :currentStep="2" />
		<div class="receive-status-wrap">
			<div class="icon-wrap">
				<a-icon type="check" />
			</div>
			<p class="notice">操作完成</p>
			<div class="btn-wrap">
				<a-button
					type="primary"
					@click="gotoRecordList()"
					>查看付款记录</a-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import PaymentStep from './components/PaymentStep.vue';

export default {
	name: 'PayAdditionalPaymentThreeStep',

	components: {
		PaymentStep
	},
	data() {
		return {
			currentStep: 2,
			steps: [
				{
					title: '选择采购订单'
				},
				{
					title: '填写付款信息'
				},
				{
					title: '完成'
				}
			]
		};
	},
	methods: {
		gotoRecordList() {
			this.$router.push('/center/fund/pay/record/list');
		}
	}
};
</script>

<style lang="less">
.receive-status-wrap {
	text-align: center;
	padding-bottom: 60px;
	.icon-wrap {
		width: 68px;
		height: 68px;
		background: #92ea66;
		line-height: 78px;
		margin: 20px auto;
		color: #fff;
		font-size: 40px;
		border-radius: 50%;
	}
	.notice {
		font-size: 30px;
		margin-bottom: 60px;
		margin-top: 40px;
		color: #333;
	}
	.btn-wrap {
		margin-top: 30px;
		.ant-btn {
			width: 165px;
			height: 46px;
			font-size: 20px;
		}
	}
}
</style>
