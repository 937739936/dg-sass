<template>
	<div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div class="settle-status-wrap">
			<div class="icon-wrap">
				<a-icon type="check" />
			</div>
			<p class="notice">操作完成</p>
			<div class="btn-wrap">
				<a-button
					type="primary"
					class="mr30"
					@click="apply"
					>再次确认</a-button
				>
				<a-button @click="gotoRecordList">查看结算单记录</a-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SettleSuccess',
	data() {
		return {
			currentStep: 2,
			steps: [
				{
					title: '选择待确认的结算单'
				},
				{
					title: '进行结算单确认'
				},
				{
					title: '完成'
				}
			]
		};
	},
	methods: {
		gotoRecordList() {
			this.$router.push('mySettleList');
		},
		apply() {
			this.$router.push('settleConfirmList');
		}
	}
};
</script>

<style lang="less">
.settle-status-wrap {
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

		.mr30 {
			margin-right: 30px;
		}
	}
}
</style>
