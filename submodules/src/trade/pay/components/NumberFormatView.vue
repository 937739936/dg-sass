<template>
	<a-tooltip placement="top">
		<template
			v-if="moneyFormatInfo().tip"
			slot="title"
		>
			<span>{{ moneyFormatInfo().tip }}</span>
		</template>
		<span v-if="isShowMoneyIcon" class="payAmount-icon">¥ </span>
		<span :style="textStyle">{{ moneyFormatInfo().money }}</span>
	</a-tooltip>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/globalCode.js';

export default {
	name: 'NumberFormatView',
	props: {
		value: {
			type: [String, Number]
		},
		isShowMoneyTip: {
			type: Boolean,
			default: false
		},
		textStyle: {
			type: Object,
			default: () => {}
		},
		isShowMoneyIcon: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	methods: {
		formatMoney,
		convertCurrency,
		moneyFormatInfo() {
			let money = '-';
			let tip = '';
			let value = this.value;
			if(isNaN(Number(value))) {
				return{
					money: value || '-',
					tip
				}
			}
			if (value !== null && value !== undefined && value !== '') {
				money = formatMoney(value);
				if (this.isShowMoneyTip) {
					tip = convertCurrency(value);
					if (money == '0' || money == 0) {
						money = '0';
						tip = '零元整';
					}
				}
			}
			return {
				money,
				tip
			};
		}
	}
};
</script>

<style lang="less" scoped>
.payAmount-icon {
	font-family: PingFangSC-Regular, PingFang SC;
}
</style>