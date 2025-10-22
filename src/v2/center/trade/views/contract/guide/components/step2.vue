<template>
	<div class="wrap-step2">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">有新的合同，来这里创建“电子合同”或上传“线下合同”吧。</p>
			<div class="btn-wrap-step2">
				<span class="page">{{ page }}</span>
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
				const code = reportCode.contract['guideList'].step2Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		prev() {
			this.$emit('step', 1);
		},
		next() {
			this.$emit('step', 3);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap-step2 {
	position: absolute;
	top: 150px;
	right: 2vw;
	display: flex;
	.white-wrap {
		width: 297px;
		height: 226px;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/step2.png');
		background-size: 297px 226px;
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
}
</style>
