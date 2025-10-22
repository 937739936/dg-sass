<template>
	<a-row
		type="flex"
		class="overview-info-box"
	>
		<OverviewItemView
			v-for="(item, index) in overviewItems"
			:key="index"
			:itemInfo="item"
		>
			<div v-if="item.key === 'deliver'">
				<p v-if="contractData.deliveryQuantity > 0">
					{{ dispatchValue }}
					<a-tooltip
						placement="bottom"
						overlayClassName="progress-bar-tooltips"
						:getPopupContainer="getPopupContainer"
					>
						<template slot="title">
							<a-progress
								:percent="dispatchRate"
								:show-info="false"
							/>
							<em class="percent-bg">
								<PercentBgIcon></PercentBgIcon>
								<span class="text">{{ dispatchRate }}%</span>
							</em>
							<div
								class="over-percent"
								v-if="dispatchRate > 100"
							>
								<em></em>
								<i></i>
							</div>
						</template>
						<span class="progress-icon">
							<DeliverProgressIcon></DeliverProgressIcon>
						</span>
					</a-tooltip>
				</p>
			</div>
		</OverviewItemView>
	</a-row>
</template>

<script>
import OverviewItemView from './OverviewItemView.vue';
import { formatMoney } from '@sub/filters';
import { getPopupContainer } from '@sub/utils/factory.js';
import { PercentBgIcon, DeliverProgressIcon } from '@sub/components/svg';
export default {
	name: 'OverviewInfoView',
	components: {
		OverviewItemView,
		PercentBgIcon,
		DeliverProgressIcon
	},
	props: {
		contractInfo: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			// contractData: {}
		};
	},
	watch: {
		// contractInfo: {
		// 	deep: true,
		// 	handler(newVal, oldVal) {
		// 		this.contractData = newVal || {};
		// 	}
		// }
	},
	computed: {
		contractData() {
			return this.contractInfo || {};
		},
		// 是否双签
		isDoubleSign() {
			return this.contractData.doubleSign || false;
		},
		// 发运进度
		dispatchRate() {
			let rate = 0;
			// 合同量
			let contractQuantity = this.contractData.contractQuantity || 0;
			// 发运数量
			let deliveryQuantity = this.contractData.deliveryQuantity || 0;
			rate = (deliveryQuantity / contractQuantity) * 100;
			return parseFloat(rate.toFixed(0));
		},
		dispatchValue() {
			if (this.contractData.deliveryQuantity) {
				return `${formatMoney(this.contractData.deliveryQuantity, 2)}吨`;
			}
			return '';
		},
		// 付款信息
		payAmountValue() {
			if (this.contractData.payAmount) {
				return `${formatMoney(this.contractData.payAmount)}元`;
			}
			return '';
		},
		// 回款信息
		receivedAmountValue() {
			if (this.contractData.receivedAmount) {
				return `${formatMoney(this.contractData.receivedAmount)}元`;
			}
			return '';
		},
		// 结算信息
		settleValue() {
			let value = '';
			if (this.contractData.settleQuantity || this.contractData.settleAmount) {
				value = `${formatMoney(this.contractData.settleQuantity || 0)}吨 | ${formatMoney(this.contractData.settleAmount || 0)}元`;
			}
			return value;
		},
		// 发票信息
		invoiceAmountValue() {
			if (this.contractData.invoiceAmount) {
				return `${formatMoney(this.contractData.invoiceAmount || 0)}元`;
			}
			return '';
		},
		overviewItems() {
			let list = [];
			list.push({
				label: '合同',
				activeIcon: require('@sub/assets/imgs/trade/contract_icon.png'),
				inactiveIcon: require('@sub/assets/imgs/trade/contract_no_icon.png'),
				value: this.isDoubleSign ? '合同已双签' : '',
				emptyValue: '合同未双签'
			});
			if (this.contractData.orderType === 'ONLINE') {
				list.push({
					label: '发运',
					key: 'deliver',
					activeIcon: require('@sub/assets/imgs/trade/deliver_icon.png'),
					inactiveIcon: require('@sub/assets/imgs/trade/deliver_no_icon.png'),
					value: this.dispatchValue,
					emptyValue: '未发运'
				});
				list.push({
					label: '付款',
					activeIcon: require('@sub/assets/imgs/trade/payment_icon.png'),
					inactiveIcon: require('@sub/assets/imgs/trade/payment_no_icon.png'),
					value: this.payAmountValue,
					emptyValue: '未付款'
				});
			} else {
				let contractType = this.contractData.contractType;
				if (contractType === 'UP') {
					list.push({
						label: '付款',
						activeIcon: require('@sub/assets/imgs/trade/payment_icon.png'),
						inactiveIcon: require('@sub/assets/imgs/trade/payment_no_icon.png'),
						value: this.payAmountValue,
						emptyValue: '未付款'
					});
				} else if (contractType === 'DOWN') {
					list.push({
						label: '回款',
						activeIcon: require('@sub/assets/imgs/trade/payment_icon.png'),
						inactiveIcon: require('@sub/assets/imgs/trade/payment_no_icon.png'),
						value: this.receivedAmountValue,
						emptyValue: '未回款'
					});
				}
			}

			list.push({
				label: '结算',
				activeIcon: require('@sub/assets/imgs/trade/settlement_icon.png'),
				inactiveIcon: require('@sub/assets/imgs/trade/settlement_no_icon.png'),
				value: this.settleValue,
				emptyValue: '未结算'
			});
			list.push({
				label: '发票',
				activeIcon: require('@sub/assets/imgs/trade/invoice_icon.png'),
				inactiveIcon: require('@sub/assets/imgs/trade/invoice_no_icon.png'),
				value: this.invoiceAmountValue,
				emptyValue: '未开票'
			});
			return list;
		}
	},
	methods: {
		formatMoney,
		getPopupContainer
	}
};
</script>

<style lang="less" scoped>
.overview-info-box {
	background: #fff;
	min-height: 140px;
	border-radius: 4px;
	z-index: 2;
	.progress-icon {
		width: 14px;
		height: 14px;
		cursor: pointer;
		top: 1px;
	}
	.progress-bar-tooltips {
		.ant-progress-status-success .ant-progress-bg {
			background-color: @primary-color !important;
		}
		.ant-progress-bg {
			background-color: @primary-color!important;
		}
		.ant-tooltip-inner {
			position: relative;
			.ant-progress {
				padding-right: 40px;
			}
			.ant-progress-inner {
				width: 100px;
			}
			.percent-bg {
				padding-left: 3px;
				position: absolute;
				right: 2px;
				top: 8px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: #ffffff;
				line-height: 29px;
				display: inline-block;
				width: 40px;
				height: 16px;
				text-align: center;
				font-style: normal;
				svg {
					position: absolute;
					top: 0;
					left: 0;
				}
				.text {
					display: inline-block;
					overflow: hidden;
					position: absolute;
					top: 0;
					left: 3px;
					z-index: 10;
					font-size: 14px;
					zoom: 0.86;
					width: 47px;
					height: 19px;
					line-height: 19px;
					text-align: center;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
			.over-percent {
				position: absolute;
				right: 47px;
				top: 8px;
				em {
					display: inline-block;
					width: 4px;
					height: 12px;
					background: @primary-color;
					border-radius: 2px;
				}
				i {
					display: inline-block;
					width: 10px;
					height: 8px;
					background: #f46332;
					border-radius: 0 4px 4px 0;
					position: relative;
					top: -2px;
				}
			}
		}
	}
}
</style>