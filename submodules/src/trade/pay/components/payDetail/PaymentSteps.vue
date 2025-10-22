<template>
	<div class="payment-steps">
		<div class="step-icons-wrapper">
			<div
				v-for="(item, index) in stepItems"
				:key="index"
				class="step-icon-item"
			>
				<div
					v-show="index !== 0"
					:class="`step-line status-line-${item.status}`"
				></div>
				<a-tooltip
					placement="top"
					trigger="hover"
					:destroyTooltipOnHide="true"
					:getPopupContainer="getPopupContainer"
					@visibleChange="e => visibleChange(e, item)"
				>
					<template
						v-if="currentStepIsNeedTip(item)"
						slot="title"
					>
						<a-spin v-if="statusTipInfoNotEmpty.isTipLoading">
							<a-icon
								slot="indicator"
								type="sync"
								style="font-size: 16px; color: #fff"
								spin
							/>
						</a-spin>
						<span
							v-else-if="statusTipInfoNotEmpty.statusTip"
							style="white-space: pre-wrap"
							>{{ statusTipInfoNotEmpty.statusTip }}</span
						>
						<span v-else>-</span>
					</template>
					<img
						class="step-status-icon"
						:src="getStepStatusIcon(item)"
						:style="currentStepIsNeedTip(item) ? { cursor: 'pointer' } : {}"
						alt=""
					/>
				</a-tooltip>
			</div>
		</div>
		<div class="step-des-container">
			<div
				class="step-item"
				v-for="(item, index) in stepItems"
				:key="index"
			>
				<div :class="`step-des-line`"></div>
				<div class="step-des-item">
					<span :class="item.status === 'WAIT' ? 'step-wait-text' : ''">{{ item.name }}</span>
					<span class="step-time">{{ item.time }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//WAIT,FAIL,RUNNING,SUCCESS,HALF_FAIL
/*
{
    "remark": null,
    "status": "SUCCESS",
    "name": "河南荣厚实业有限公司提交付款申请",
    "groupCode": "SUBMIT",
    "businessStatus": "ASSET_ARRANGING",
    "businessOperation": "SUBMIT",
    "time": "2024-05-24 14:44:34"
}
*/
export default {
	name: 'PaymentSteps',
	props: {
		paymentNo: {
			type: String,
			default: ''
		},
		processChains: {
			type: Array,
			default: () => []
		},
		statusTipInfo: {
			type: Object,
			default: () => {}
		}
	},
	inject: ['pageType'],
	computed: {
		// 是否是付款详情
		isPaymentDetail() {
			return this.pageType === 'PAY';
		},
		stepItems() {
			return this.processChains ?? [];
		},
		statusTipInfoNotEmpty() {
			return (
				this.statusTipInfo || {
					status: '', // 状态
					isTipLoading: false, // 是否正在获取状态提示
					statusTip: '' // 状态提示
				}
			);
		},
		stepNeedTipStatus() {
			return [
				'PLATFORM_AUDITING_REJECT', // 平台运营驳回
				'RISK_CONTROL_REJECT', // 平台风控驳回
				'REJECT', // OA驳回
				'CUSTOM_REJECT', // 客户退回
				'ASSET_ARRANGING', // 资产整理中
				'FIN_FINANCING' // 融资放款中
			];
		},
		stepNeedTipOperations() {
			return [
				'PLATFORM_AUDITING_REJECT', // 平台运营驳回
				'RISK_CONTROL_REJECT', // 平台风控驳回
				'OA_REJECT', // OA驳回
				'REPAY_CONFIRM_REJECT', // 收款确认驳回(收款方客户退回)
				'ASSET_CANCEL', // 资产作废
				'ASSET_ARRANGED', // 资产整理完成
				'FIN_FINANCED' // 融资放款完成
			];
		}
	},
	methods: {
		getPopupContainer(trigger) {
      return trigger.parentElement || document.body;
    },
		getStepStatusIcon(item) {
			let icon = require('@sub/assets/imgs/trade/pay/setp_wait_icon.png');
			switch (item.status) {
				case 'SUCCESS':
					icon = require('@sub/assets/imgs/trade/pay/setp_success_icon.png');
					break;
				case 'RUNNING':
					icon = require('@sub/assets/imgs/trade/pay/setp_running_icon.png');
					break;
				case 'WAIT':
					icon = require('@sub/assets/imgs/trade/pay/setp_wait_icon.png');
					break;
				case 'HALF_FAIL':
					icon = require('@sub/assets/imgs/trade/pay/setp_fail_icon.png');
					break;
				case 'FAIL':
					icon = require('@sub/assets/imgs/trade/pay/step_end_icon.png');
					break;
				default:
					break;
			}
			return icon;
		},
		// 是否需要显示提示信息
		currentStepIsNeedTip(item) {
			if (item.status === 'WAIT') {
				return false;
			}
			let { businessStatus, businessOperation, time } = item;
			if (!this.isPaymentDetail) {
				// 非付款详情 只在客户退回时显示提示信息
				if (time && time.length > 0 && ['REPAY_CONFIRM_REJECT'].includes(businessOperation)) {
					return true;
				}
				if (!time && ['CUSTOM_REJECT'].includes(businessStatus)) {
					return true;
				}
				return false;
			}
			if (time && time.length > 0 && this.stepNeedTipOperations.includes(businessOperation)) {
				return true;
			}
			if (!time && this.stepNeedTipStatus.includes(businessStatus)) {
				return true;
			}
			return false;
		},
		visibleChange(visible, item) {
			let stepInfo = {
				paymentNo: this.paymentNo,
				isSteps: true
			};
			if (item.time && item.time.length > 0) {
				stepInfo.businessOperation = item.businessOperation;
			} else {
				stepInfo.paymentStatus = item.businessStatus;
			}
			this.$emit('getStepStatusTip', visible, stepInfo);
		}
	}
};
</script>

<style lang="less" scoped>
.payment-steps {
	// background-color: #f5f5f5;
	// border-radius: 5px;
	.step-icons-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 47.5px;
		.step-icon-item {
			display: flex;
			align-items: center;
			.step-status-icon {
				width: 30px;
				height: 30px;
				margin: 0 7.5px;
			}
		}
		.step-icon-item:not(:first-child) {
			flex: 1;
		}
	}
	.step-des-container {
		margin-top: 12px;
		display: flex;
		justify-content: center;
		// justify-content: space-between;
		// align-items: center;
		.step-item {
			display: flex;
			align-items: flex-start;
			flex-direction: row;
			.step-des-item {
				width: 140px;
				font-size: 14px;
				font-family: PingFang SC;
				font-weight: 500;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				text-align: center;
			}
			.step-wait-text {
				color: #00000040;
			}
			.step-time {
				font-size: 12px;
				color: #00000066;
			}
			.step-des-line {
				flex: 1;
			}
		}
		.step-item:not(:first-child) {
			flex: 1;
		}
	}

	.step-line {
		flex: 1;
		height: 2px;
		&.status-line-SUCCESS {
			// 成功
			background-image: linear-gradient(to right, #4682f3, #4682f3, #4682f3);
			background-size: 8px 2px; /* 设置虚线的宽度为8px，高度为2px，间隔为8px的一半（因为50%是实线，50%是透明） */
			background-repeat: repeat-x;
		}
		&.status-line-RUNNING {
			// 运行中
			background-image: linear-gradient(to right, #4682f3, #4682f3 50%, transparent 50%);
			background-size: 8px 2px; /* 设置虚线的宽度为8px，高度为2px，间隔为8px的一半（因为50%是实线，50%是透明） */
			background-repeat: repeat-x;
		}
		&.status-line-WAIT {
			// 等待中
			opacity: 0.3;
			background-image: linear-gradient(to right, #4682f3, #4682f3 50%, transparent 50%);
			background-size: 8px 2px; /* 设置虚线的宽度为8px，高度为2px，间隔为8px的一半（因为50%是实线，50%是透明） */
			background-repeat: repeat-x;
		}
		&.status-line-FAIL {
			// 失败
			background-image: linear-gradient(to right, #4682f3, #4682f3, #4682f3);
			background-size: 8px 2px; /* 设置虚线的宽度为8px，高度为2px，间隔为8px的一半（因为50%是实线，50%是透明） */
			background-repeat: repeat-x;
		}
		&.status-line-HALF_FAIL {
			// 半失败
			background-image: linear-gradient(to right, #4682f3, #4682f3, #4682f3);
			background-size: 8px 2px; /* 设置虚线的宽度为8px，高度为2px，间隔为8px的一半（因为50%是实线，50%是透明） */
			background-repeat: repeat-x;
		}
	}
}
</style>