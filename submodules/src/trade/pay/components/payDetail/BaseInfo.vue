<template>
	<div class="pay-base-info-container">
		<PaymentNumber
			:pageType="pageType"
			:paymentNo="paymentNo"
			:paymentStatus="basicInfo.paymentStatus"
			:paymentStatusDesc="basicInfo.paymentStatusDesc"
		>
			<template slot="statusTag">
				<slot name="statusTag"></slot>
			</template>
		</PaymentNumber>
		<div class="base-info">
			<BaseInfoDescriptions
				:dataSource="displayItems"
				:columnsCountOneRow="4"
			>
				<template slot="auditChainAndOperator">
					<div class="operator-info">
						<div
							v-for="(operatorInfo, index) in auditChainOperators"
							:key="index"
							class="operator-info-item"
						>
							<span>{{ operatorInfo.systemName }}({{ operatorInfo.operatorName }})</span>
							<a-tooltip placement="top">
								<template
									v-if="operatorInfo.operatorMobile"
									slot="title"
								>
									<div style="white-space: pre-wrap">{{ operatorInfo.operatorMobile }}</div>
								</template>
								<span class="operator-phone-icon">
									<Phone></Phone>
								</span>
							</a-tooltip>
						</div>
					</div>
				</template>
			</BaseInfoDescriptions>
		</div>
		<PaymentSteps
			v-if="processChains.length > 0"
			:style="{marginTop: '30px'}"
			:paymentNo="paymentNo"
			:processChains="processChains"
			:statusTipInfo="statusTipInfo"
			@getStepStatusTip="getStepStatusTip"
		/>
	</div>
</template>

<script>
import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';
import PaymentNumber from './PaymentNumber';
import PaymentSteps from './PaymentSteps';
import { Phone } from '@sub/components/svg'

export default {
	name: 'BaseInfo',
	components: {
		PaymentNumber,
		BaseInfoDescriptions,
		PaymentSteps,
		Phone
	},
	props: {
		// 类型：付款'PAY' / 收款'COLLECT' / 收款确认'COLLECT_CONFIRM'
		pageType: {
			type: String // 'PAY' or 'COLLECT'
		},
		// 合同信息
		detailInfo: {
			type: Object,
			default: () => ({})
		},
		statusTipInfo: {
			type: Object,

			default: () => ({})
		}
	},
	inject: ['pageType'],
	data() {
		return {};
	},
	computed: {
		// 非空详情信息
		detailInfoNonEmpty() {
			return this.detailInfo || {};
		},
		// 是否是付款详情
		isPaymentDetail() {
			return this.pageType === 'PAY';
		},
		// 付款单号
		paymentNo() {
			return this.detailInfoNonEmpty.paymentNo || '';
		},
		// 基本信息
		basicInfo() {
			return this.detailInfoNonEmpty.basicInfo || {};
		},
		// 合同信息
		contractVO() {
			return this.detailInfoNonEmpty.contractVO || {};
		},
		// 业务线信息
		businessLineVO() {
			return this.detailInfoNonEmpty.businessLineVO || {};
		},
		// 流程发起人信息
		auditChainAndOperator() {
			return this.detailInfoNonEmpty.auditChainAndOperator || {};
		},
		// 流程发起人信息列表
		auditChainOperators() {
			return this.auditChainAndOperator.operatorInfo || [];
		},
		// 付款流程链
		processChains() {
			return this.detailInfoNonEmpty.processChains || [];
		},
		// 计算属性，返回当前显示的项
		displayItems() {
			let contractVO = this.contractVO;
			let businessLineVO = this.businessLineVO;
			let basicInfo = this.basicInfo;
			let auditChainAndOperator = this.auditChainAndOperator;
			let items = [
				{
					label: '所属合同编号',
					value: contractVO.contractNo,
					click: () => {
						this.$emit('openNewTabPage', 'CONTRACT_DETAIL', contractVO);
					},
					isNeedCopy: true
				}
			];
			if (this.isPaymentDetail && businessLineVO.businessLineNo) {
				items.push({
					label: '业务线号',
					value: businessLineVO.businessLineNo,
					click: () => {
						this.$emit('openNewTabPage', 'BUSINESSLINE_DETAIL', businessLineVO);
					},
					isNeedCopy: true
				});
			}
			if (this.isPaymentDetail && basicInfo.receivableSerialNo) {
				items.push({
					label: '资产编号',
					value: basicInfo.receivableSerialNo,
					click: () => {
						this.$emit('openNewTabPage', 'ASSET_DETAIL', {
							assetType: this.basicInfo.assetType,
							receivableId: this.basicInfo.receivableId
						});
					},
					isNeedCopy: true
				});
			}
			items.push({
				label: '付款单位',
				value: contractVO.buyerName || '-'
			});
			items.push({
				label: '收款单位',
				value: contractVO.sellerName || '-'
			});
			items.push({
				label: '创建时间',
				value: basicInfo.createTime || '-'
			});
			if (this.isPaymentDetail && auditChainAndOperator.needPushOA) {
				// 需要推送OA，则显示流程发起人信息
				items.push({
					label: '流程发起人',
					value: '',
					scopedSlots: {
						customRender: 'auditChainAndOperator'
					}
				});
			}
			return items;
		}
	},
	methods: {
		getStepStatusTip(v, s) {
			this.$emit('getStepStatusTip', v, s);
		}
	}
};
</script>

<style lang="less" scoped>
.pay-base-info-container {
	.base-info {
		margin-top: 20px;
		.operator-info {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			flex-wrap: wrap;
			.operator-info-item {
				margin-right: 14px;
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 14px;
				.operator-phone-icon {
					margin: 0 14px 0 6px;
					cursor: pointer;
					svg {
						position: relative;
						top: 2px;
					}
				}
			}
		}
	}
}
</style>