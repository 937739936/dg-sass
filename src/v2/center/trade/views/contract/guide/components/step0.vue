<template>
	<div class="step1-wrap">
		<p class="title">合同管理升级啦</p>
		<p class="desc">全新界面，更好体验，为您的交易保驾护航</p>
		<a-button
			type="primary"
			class="btn"
			@click="begin"
			>立即体验</a-button
		>
	</div>
</template>

<script>
import reportCode from '@/v2/config/reportCode';

export default {
	methods: {
		begin() {
			this.$emit('step', 1);
			try {
				const code = reportCode.contract['guideList'].experience;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.step1-wrap {
	width: 700px;
	height: 496px;
	background: #fff;
	margin: 0 auto;
	margin-top: 10%;
	border-radius: 10px;
	background-image: url('~@/v2/assets/imgs/guide/step0.png');
	background-size: 700px 400px;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 25px;
	box-sizing: border-box;
	position: relative;
	.title {
		width: 280px;
		height: 56px;
		text-shadow: 0px 0px 10px rgba(21, 46, 95, 0.3);
		color: #ffffff;
		font-size: 40px;
	}
	.desc {
		width: 342px;
		height: 25px;
		font-size: 18px;
		color: #ffffff;
		margin-top: 8px;
	}
	.btn {
		width: 186px;
		height: 38px;
		font-weight: 600;
		position: absolute;
		bottom: 27px;
		box-shadow: none;
	}
}
</style>
