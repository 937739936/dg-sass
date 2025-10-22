<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="20"
		>
			<a-col span="24">
				<div id="payment">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">付款信息</div>
						</a-col>
					</a-row>

					<div class="num-box">
						<a-row type="flex">
							<a-col>
								<p>已付款/元</p>
								<span>{{ detail.paidAmount | formatMoney(2) }}元</span>
							</a-col>
						</a-row>
					</div>
					<div class="table-box">
						<a-table
							:columns="payColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.payList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="payAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="statusDesc"
								slot-scope="text"
							>
								<span class="status">{{ text }}</span>
							</template>
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a @click="viewDetail(items)">详情</a>
							</template>
						</a-table>
					</div>
				</div>
				<div id="refund">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">退款信息</div>
						</a-col>
						<a-col class="mt32">
							<span class="label">退款金额：</span>
							<span>{{ refundNum | formatMoney(2) }}元</span>
						</a-col>
					</a-row>
					<div class="table-box">
						<a-table
							:columns="refundColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="refundList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="refundAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a @click="viewRefundDetail(items)">详情</a>
							</template>
						</a-table>
					</div>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
const payColumns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '付款日期', dataIndex: 'planPayDate' },
	{ title: '付款类型', dataIndex: 'typeDesc' },
	{ title: '资金来源', dataIndex: 'payTypeName' },
	{ title: '付款金额（元）', dataIndex: 'payAmount', scopedSlots: { customRender: 'payAmount' } },
	{ title: '付款状态', dataIndex: 'statusDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 80, fixed: 'right' }
];
const refundColumns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '退款日期', dataIndex: 'refundDate' },
	{ title: '退款金额（元）', dataIndex: 'refundAmount', scopedSlots: { customRender: 'refundAmount' } },
	{ title: '资金来源', dataIndex: 'fundsSourceDesc' },
	{ title: '退款状态', dataIndex: 'statusDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 80, fixed: 'right' }
];

import { API_RefundBaseList } from '@/v2/center/trade/api/downcontract';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			payColumns,
			refundColumns,
			anchor: '#payment',
			refundList: [],
			refundNum: 0
		};
	},
	props: {
		detail: {
			default: () => {
				return {};
			}
		},
		contractData: {
			default: () => {
				return {};
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		init() {
			API_RefundBaseList({ contractNo: this.contractData.contractNo }).then(res => {
				if (res.success) {
					this.refundList = res.data || [];
					if (this.refundList.length) {
						this.refundList.forEach(item => {
							this.refundNum += item.refundAmount;
						});
					}
				}
			});
		},
		viewDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/fund/pay/record/detail',
				query: {
					id: items.id,
					orderId: items.terminalContractId,
					type: 'overview',
					isAdditionalPaymentCreat: items.additional == 0 ? '' : 'isAdditionalPaymentCreat',
					additionalPaymentEdit: items.additional == 0 ? '' : 'additionalPaymentEdit',
					orderType: this.contractData.contractType,
					// CYFlag: ['STEAM_COAL_013', 'COKING_COAL_005', 'COKING_008'].includes(this.data.contractTemplateName) ? 1 : 0,
					status: items.status
				}
			});
			window.open(routerData.href, '_blank');
		},
		viewRefundDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/fund/refund/detail',
				query: {
					id: items.id
				}
			});
			window.open(routerData.href, '_blank');
		},
		goAnchor(selector) {
			/*参数selector是id选择器（#anchor14）*/
			this.anchor = selector;
			this.$nextTick(() => {
				setTimeout(() => {
					document.querySelector(selector).scrollIntoView({
						behavior: 'smooth'
					});
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 30px;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.mt32 {
	margin-top: 32px;
}
.num-box {
	margin-top: 20px;
	.ant-row-flex {
		// justify-content: space-between;
		.ant-col {
			height: 100px;
			width: 24%;
			background: #f0f8ff;
			border-radius: 6px;
			padding: 20px;
			margin-right: 20px;
			span {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 20px;
				line-height: 28px;
				color: rgba(0, 0, 0, 0.8);
			}
			p {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 14px;
				line-height: 20px;
				color: rgba(0, 0, 0, 0.4);
				margin-bottom: 11px;
			}
		}
		.ant-col:nth-child(2),
		.ant-col:nth-child(4) {
			background: #fff9e9;
		}
		.ant-col:nth-child(4) {
			margin-right: 0px;
		}
	}
}
.status {
	background: #c5ecdd;
	color: #3eb384;
	padding: 2px 5px;
	border-radius: 5px;
}
/deep/ .ant-table-thead {
	background: #f3f5f6;
}
</style>
