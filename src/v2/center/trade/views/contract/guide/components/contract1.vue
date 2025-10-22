<template>
	<div class="wrap">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">各项信息的填写情况都在这里啦，快去完善吧，加油！</p>
			<span class="page">1/5</span>
			<a-button
				type=""
				class="btn"
				@click="next"
				>下一步</a-button
			>
		</div>
		<div class="white-wrap"></div>
	</div>
</template>

<script>
import reportCode from '@/v2/config/reportCode';

export default {
	methods: {
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['createList'].step1Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		next() {
			this.$emit('step', 6);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap {
	position: absolute;
	right: 1vw;
	top: 10vh;
	display: flex;
	.white-wrap {
		width: 268px;
		height: 634px;
		background: #d9d9d9;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/contract1.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.step-tip {
		position: relative;
		width: 322px;
		height: 146px;
		background: #4089f8;
		border-radius: 6px;
		margin-right: 30px;
		margin-top: 10px;
	}
	.left-arrow {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 20px;
		right: -8px;
		background: #4089f8;
		transform: rotate(45deg);
	}
	.close-icon {
		width: 12px;
		height: 12px;
		display: inline-block;
		background-image: url('~@/v2/assets/imgs/guide/close.png');
		background-size: 12px 12px;
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
	}
	.desc {
		font-size: 14px;
		color: #ffffff;
		margin-left: 20px;
		margin-top: 36px;
	}
	.page {
		color: #ffffff;
		opacity: 0.6;
		display: inline-block;
		margin: 23px 0 0 20px;
	}
	.btn {
		width: 88px;
		height: 32px;
		position: absolute;
		top: 94px;
		right: 20px;
		color: #4089f8;
		border: none;
	}
}
</style>
