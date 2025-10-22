<template>
	<div class="wrap-step5">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">
				合同”保存“为草稿后，可以随时回来编辑。
				合同内容无误”提交“后，就可以在OA中跟进合同审批进度啦。如果没有对接OA，需要另行发起审批哦。
			</p>
			<div class="btn-wrap-step2">
				<span class="page">5/5</span>
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
	methods: {
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['createList'].step5Closed;
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
.wrap-step5 {
	position: absolute;
	bottom: 0;
	.white-wrap {
		width: 70vw;
		height: 66px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/contract5.png');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		position: absolute;
		bottom: 0;
		left: 278px;
	}
	.step-tip {
		position: relative;
		width: 322px;
		height: 174px;
		background: #4089f8;
		left: 41vw;
		border-radius: 6px;
		padding-top: 30px;
		box-sizing: border-box;
		position: absolute;
		bottom: 96px;
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
			border: none;
			color: #4089f8;
		}
		.btn-prev {
			margin-left: 59px;
		}
	}
}
</style>
