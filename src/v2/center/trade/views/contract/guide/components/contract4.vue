<template>
	<div class="wrap-step4">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">常用的内容和格式可以“收藏”为模板，下次通过“选择已有模板”就能直接调用啦！</p>
			<div class="btn-wrap-step2">
				<span class="page">4/5</span>
				<a-button
					type=""
					ghost
					class="btn btn-prev"
					@click="prev"
					>上一步</a-button
				>
				<a-button
					type=""
					class="btn btn-next"
					@click="next"
					>下一步</a-button
				>
			</div>
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
				const code = reportCode.contract['createList'].step4Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		prev() {
			this.$emit('step', 7);
		},
		next() {
			this.$emit('step', 9);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap-step4 {
	position: absolute;
	top: 20vh;
	right: 14vw;
	.white-wrap {
		width: 70vw;
		height: 340px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/contract4.png');
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
		margin-bottom: 30px;
		left: 25vw;
		padding-top: 30px;
		box-sizing: border-box;
	}
	.left-arrow {
		position: absolute;
		width: 16px;
		height: 16px;
		bottom: -8px;
		left: 145px;
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
		width: 275px;
		line-height: 20px;
		word-wrap: break-word;
		font-size: 14px;
		color: #ffffff;
		margin-left: 20px;
	}
	.page {
		color: #ffffff;
		opacity: 0.6;
		display: inline-block;
	}
	.btn-wrap-step2 {
		width: 100%;
		height: 32px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 17px;
		padding: 0 20px;
		.btn {
			width: 88px;
			height: 32px;
		}
		.btn-prev {
			margin-left: 59px;
		}
		.btn-next {
			border: none;
			color: #4089f8;
		}
	}
}
</style>
