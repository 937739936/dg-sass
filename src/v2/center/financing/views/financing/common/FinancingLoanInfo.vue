<template>
	<span>
		<a-col
			:span="8"
			class="row"
		>
			<a-form-item
				label="融资方"
				v-if="jr"
			>
				{{ fangkuanData.financier }}
			</a-form-item>
			<a-form-item
				label="出资机构"
				v-else
			>
				{{ fangkuanData.bankName }}
			</a-form-item>
			<a-form-item label="融资申请日期">
				{{ fangkuanData.applyDate }}
			</a-form-item>
			<a-form-item
				label="利息收取方式"
				v-if="fangkuanData.forwardCharge == 1"
			>
				{{ fangkuanData.interestTypeDesc }}
			</a-form-item>
		</a-col>
		<a-col
			:span="8"
			class="row"
		>
			<a-form-item label="融资金额">
				{{ fangkuanData.applyAmount }}
			</a-form-item>
			<a-form-item label="放款金额">
				{{ fangkuanData.finAmount }}
			</a-form-item>
			<a-form-item
				label="利息"
				v-if="fangkuanData.forwardCharge == 1"
			>
				{{ fangkuanData.loanInterest }}
			</a-form-item>
		</a-col>
		<a-col
			:span="8"
			class="row"
		>
			<a-form-item label="融资起息日">
				{{ fangkuanData.beginDate }}
			</a-form-item>
			<a-form-item label="融资到期日期">
				{{ fangkuanData.endDate }}
			</a-form-item>
		</a-col>
	</span>
</template>

<script>
export default {
	name: 'FinancingLoanInfo',
	props: {
		fangkuanData: {
			type: Object,
			default: () => {}
		},
		jr: {
			type: Boolean,
			default: false
		}
	}
};
</script>
