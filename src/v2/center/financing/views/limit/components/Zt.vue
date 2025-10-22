<template>
	<div>
		<div class="sub-title">在途额度</div>
		<ul
			class="grid-wrap"
			style="padding: 0; margin-bottom: 30px"
		>
			<li v-if="VUEX_ST_COMPANYSUER.companyUscc == data.coreCompanyUscc && data.creditType == 'FINANCING_COMPANY_QUOTA'">
				<span class="label">项目在途比例（%）</span>
				<span>
					{{ data.transitQuotaPercentage || '-' }}
				</span>
			</li>
			<li>
				<span class="label">在途总额度（元）</span>
				<span>
					{{ displayAmountText(data.transitTotalAmount) }}
				</span>
			</li>
			<li>
				<span class="label">在途可用额度（元）</span>
				<span>
					{{ displayAmountText(data.transitAvailableAmount) }}
				</span>
			</li>
			<li>
				<span class="label">在途冻结额度（元）</span>
				<span>
					{{ displayAmountText(data.transitFrozenAmount) }}
				</span>
			</li>
			<li>
				<span class="label">在途已用额度（元）</span>
				<span>
					{{ displayAmountText(data.transitUsedAmount) }}
				</span>
			</li>
			<li>
				<span class="label"></span>
				<span></span>
			</li>
			<li
				v-if="
					(VUEX_ST_COMPANYSUER.companyUscc != data.coreCompanyUscc && data.creditType != 'FINANCING_COMPANY_QUOTA') ||
					(VUEX_ST_COMPANYSUER.companyUscc == data.companyUscc && data.creditType == 'FINANCING_COMPANY_QUOTA')
				"
			>
				<span class="label"></span>
				<span></span>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	props: ['data'],
	data() {
		return {};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		// 展示金额文字
		displayAmountText(amount) {
			if (amount == null) {
				return '';
			}
			return amount.toLocaleString();
		}
	}
};
</script>
<style lang="less" scoped>
.grid-wrap {
	margin-top: 10px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}

.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;
	margin-bottom: 20px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
</style>
