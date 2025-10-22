<template>
	<div class="wrap">
		<div class="white-wrap"></div>
		<div class="step-tip">
			<span class="left-arrow"></span>
			<span
				class="close-icon"
				@click="close"
			></span>
			<p class="desc">原“我的订单”与“我的合同”都统一到这里啦！</p>
			<span class="page">{{ page }}</span>
			<a-button
				type=""
				class="btn"
				@click="next"
				>下一步</a-button
			>
		</div>
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
		next() {
			if (this.isCoreCompany) {
				this.$emit('step', 2);
			} else {
				this.$emit('step', 3);
			}
		},
		close() {
			this.$emit('step', -1);
			try {
				const code = reportCode.contract['guideList'].step1Closed;
				window.reportUtil.reportEvent(code);
			} catch (error) {
				console.info(error);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.wrap {
	position: relative;
	top: 73px;
	left: 0;
	display: flex;
	.white-wrap {
		width: 208px;
		height: 180px;
		background: #fff;
		border-radius: 10px;
		background-image: url('~@/v2/assets/imgs/guide/step1.png');
		background-size: 208px 180px;
		background-repeat: no-repeat;
		background-position: center;
	}
	.step-tip {
		position: relative;
		width: 322px;
		height: 146px;
		background: #4089f8;
		border-radius: 6px;
		margin-left: 30px;
		margin-top: 10px;
	}
	.left-arrow {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 20px;
		left: -8px;
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
		margin: 44px 0 0 20px;
	}
	.btn {
		width: 88px;
		height: 32px;
		position: absolute;
		top: 94px;
		right: 20px;
		border: none;
		color: #4089f8;
	}
}
</style>
