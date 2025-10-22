<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="20"
		>
			<a-col span="21">
				<div id="payment">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">付款信息</div>
						</a-col>
						<a-col class="mt32">
							<span class="label">已付款：</span>
							<span>{{ detail.paidAmount | formatMoney(2) }}元</span>
						</a-col>
					</a-row>
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
							<span>{{ detail.refundAmount | formatMoney(2) }}元</span>
						</a-col>
					</a-row>
					<div class="table-box">
						<a-table
							:columns="refundColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.refundList"
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
			<a-col span="3">
				<div class="anchorPointBox">
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#payment'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#payment' ? 'blue' : ''"
							@click="goAnchor('#payment')"
						>
							<em class="dot"></em>
							付款信息
						</p>
					</div>
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#refund'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#refund' ? 'blue' : ''"
							@click="goAnchor('#refund')"
						>
							<em class="dot"></em>
							退款信息
						</p>
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
import { API_getOrderPaymentResp } from '@/v2/center/trade/api/contract';
import { mapGetters } from 'vuex';
import { AnchorIcon } from '@sub/components/svg';
export default {
	data() {
		return {
			payColumns,
			refundColumns,
			detail: {},
			anchor: '#payment'
		};
	},
	props: ['data'],
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		AnchorIcon
	},
	methods: {
		init() {
			API_getOrderPaymentResp({ orderId: this.data.contract.id }).then(res => {
				if (res.success) {
					this.detail = res.data;
				}
			});
		},
		viewDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/fund/pay/record/detail',
				query: {
					id: items.id,
					orderId: items.orderId,
					type: 'overview',
					isAdditionalPaymentCreat: items.additional == 0 ? '' : 'isAdditionalPaymentCreat',
					additionalPaymentEdit: items.additional == 0 ? '' : 'additionalPaymentEdit',
					orderType: 'ONLINE',
					CYFlag: ['STEAM_COAL_013', 'COKING_COAL_005', 'COKING_008'].includes(this.data.contract.contractTemplateName) ? 1 : 0,
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
.anchorPointBox {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #77889d;
	line-height: 20px;
	margin: 27px 0;
	border-left: 1px solid #e9effc;
	cursor: pointer;
	.anchorPointItem {
		height: 48px;
		padding-left: 20px;
		position: relative;
		line-height: 20px;
		.anchorPointIcon {
			width: 8px;
			height: 12px;
			position: absolute;
			left: 0;
			top: 4px;
		}
	}
	.blue {
		color: @primary-color;
		.dot {
			background-color: @primary-color;
		}
	}
	.dot {
		display: inline-block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #77889d;
		margin-right: 3px;
		position: relative;
		top: -2px;
	}
}
.mt32 {
	margin-top: 32px;
}
</style>
