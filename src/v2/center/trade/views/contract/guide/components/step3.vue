<template>
	<div class="wrap-step3">
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">合同数据一目了然，帮您把握执行进度。</p>
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
import { mapGetters } from 'vuex';
import reportCode from '@/v2/config/reportCode';

export default {
	props: {
		page: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		}
	},
	methods: {
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['guideList'].step3Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		},
		prev() {
			if (this.isCoreCompany) {
				this.$emit('step', 2);
			} else {
				this.$emit('step', 1);
			}
		},
		next() {
			this.$emit('step', 4);
		}
	}
};
</script>

<style lang="less" scoped>
.wrap-step3 {
	position: absolute;
	top: 25vh;
	left: 42vw;
	.white-wrap {
		width: 876px;
		height: 220px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/step3.png');
		background-size: contain;
		background-repeat: no-repeat;
		position: absolute;
		top: 176px;
		left: -15vw;
	}
	.step-tip {
		position: relative;
		width: 322px;
		height: 146px;
		background: #4089f8;
		border-radius: 6px;
		padding-top: 36px;
		box-sizing: border-box;
	}
	.left-arrow {
		position: absolute;
		width: 16px;
		height: 16px;
		bottom: -8px;
		left: 49px;
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
		padding-top: 30px;
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
