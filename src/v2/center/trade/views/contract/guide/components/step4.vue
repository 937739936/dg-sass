<template>
	<div class="wrap-step3">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">业务有新进展？<br />鼠标移入“更多”进行相应操作。</p>
			<div class="btn-wrap-step2">
				<span class="page">{{ page }}</span>
				<a-button
					type=""
					class="btn"
					@click="next"
					>我知道啦</a-button
				>
			</div>
		</div>
		<div class="white-wrap"></div>
	</div>
</template>

<script>
import reportCode from '@/v2/config/reportCode';

export default {
	props: {
		page: {
			type: String,
			default: ''
		}
	},
	methods: {
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['guideList'].step4Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		next() {
			this.$emit('step', -1);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap-step3 {
	position: absolute;
	top: 43vh;
	right: 4vw;
	display: flex;
	.white-wrap {
		width: 266px;
		height: 308px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/step4.png');
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
		top: 28px;
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
			color: #4089f8;
			border: none;
		}
		.btn-prev {
			margin-left: 59px;
		}
	}
}
</style>
