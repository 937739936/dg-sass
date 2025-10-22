<template>
	<div class="wrap-step2">
		<div class="white-wrap"></div>
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">这里可以随时预览合同效果，点击“<span class="full-screen"></span>”全屏预览。</p>
			<div class="btn-wrap-step2">
				<span class="page">2/5</span>
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
	</div>
</template>

<script>
import reportCode from '@/v2/config/reportCode';

export default {
	methods: {
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['createList'].step2Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		prev() {
			this.$emit('step', 5);
		},
		next() {
			this.$emit('step', 7);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap-step2 {
	position: absolute;
	top: 12vh;
	right: 14vw;
	.white-wrap {
		width: 70vw;
		height: 232px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/contract2.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.step-tip {
		position: absolute;
		width: 322px;
		height: 146px;
		background: #4089f8;
		border-radius: 6px;
		top: 262px;
		left: 26vw;
	}
	.left-arrow {
		position: absolute;
		width: 16px;
		height: 16px;
		top: -8px;
		right: 145px;
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
		margin-top: 36px;
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
	.full-screen {
		width: 14px;
		height: 14px;
		display: inline-block;
		background-image: url('~@/v2/assets/imgs/guide/fullscreen.png');
		background-size: 14px 14px;
		margin: 0 2px;
		position: relative;
		top: 2px;
	}
}
</style>
