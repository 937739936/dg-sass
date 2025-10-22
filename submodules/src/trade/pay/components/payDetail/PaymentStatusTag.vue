<template>
	<div :class="`status-tag status-${status}`">
		<a-tooltip
			placement="top"
			trigger="hover"
			:destroyTooltipOnHide="true"
		>
			<template slot="title">
				<a-spin v-if="!statusTip">
					<a-icon
						slot="indicator"
						type="sync"
						style="font-size: 16px; color: #fff"
						spin
					/>
				</a-spin>
				<span v-else>{{ statusTip }}</span>
			</template>
			<span>{{ statusDes || '-' }}</span>
		</a-tooltip>
	</div>
</template>

<script>
export default {
	name: 'PaymentStatusTag',
	props: {
		paymentNo: {
			type: String
		},
		statusDes: {
			type: String,
			default: '-'
		},
		status: {
			type: String
		},
		statusTip: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
.status-tag {
	display: inline-block;
	padding: 0 6px;
	height: 20px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 20px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	&.status-NEW,
	&.status-PAYED {
		// 待提交 已付款
		background: #c1d7ff;
		color: #4682f3;
	}
	&.status-AUDITING,
	&.status-PLATFORM_AUDITING,
	&.status-RISK_CONTROL_AUDITING {
		// OA审批中，平台运营审批中，平台风控审批中
		background: #ffdbc8;
		color: #ff7937;
	}
	&.status-FIN_FINANCING,
	&.status-ASSET_ARRANGING {
		// 融资中 资产整理中
		background: #f8dde8;
		color: #db81a5;
	}
	&.status-REJECT,
	&.status-PLATFORM_AUDITING_REJECT,
	&.status-RISK_CONTROL_REJECT {
		// OA驳回 平台运营驳回 平台风控驳回
		background: #f2d0d0;
		color: #dd4444;
	}
	&.status-CANCEL,
	&.status-DELETE {
		// 作废 删除
		background: #e0e0e0;
		color: #00000040;
	}
	&.status-CUSTOM_REJECT {
		// 客户退回
		background: #c2e6ff;
		color: #649dc7;
	}
	&.status-WAIT_PAY_CONFIRM,
	&.status-WAIT_REPAY_CONFIRM {
		// 待付款确认 待收款确认
		background: #c9d9ff;
		color: #596fa0;
	}
}
</style>