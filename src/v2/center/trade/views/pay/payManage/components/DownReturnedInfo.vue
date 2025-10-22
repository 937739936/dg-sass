<template>
	<div v-if="returnedInfo">
		<div class="slTitleAssis">业务线下游回款信息</div>
		<div v-if="showDown">
			<a-table
				class="new-table"
				:columns="returnedColumns"
				:dataSource="returnedInfo.collectionInfoList || []"
				
				:pagination="false"
				:rowKey="record => record.id"
			>
				<template
					slot="receiveSerialNo"
					slot-scope="text, record"
				>
					<a @click="
						jumpPage(
							'/center/fund/returned/detail',
							{
								receiveSerialNo: text,
							}
						)
					">{{ text }}</a>
				</template>
				<template
					slot="claimedAmount"
					slot-scope="text, record"
				>
					<span> {{ record.claimedAmount | formatMoney(2) }}</span>
				</template>
			</a-table>
			<a-space :size="20" class="totalRow">
				<span>累计回款金额<em>{{ returnedInfo.accumulateClaimedAmount | formatMoney(2) }}</em></span>
				<span>累计认领保证金回款金额<em>{{ returnedInfo.accumulateClaimedMarginAmount | formatMoney(2) }}</em></span>
				<span>累计认领货款回款金额<em>{{ returnedInfo.accumulateClaimedGoodsAmount | formatMoney(2) }}</em></span>
			</a-space>
		</div>
		<div v-else>
			<a-table
				class="new-table"
				:columns="returnedOnlineColumns"
				:dataSource="returnedInfo.paymentRecordList || []"
				:pagination="false"
				:rowKey="record => record.id"
			>
				<template
					slot="serialNo"
					slot-scope="text, record"
				>
					<a @click="
						jumpPage(
							record.paymentType === 'REFUND' ? '/center/fund/refund/detail' : '/center/fund/pay/record/detail',
							{
								id: record.id,
								orderId: record.orderId,
							}
						)
					">{{ record.serialNo }}</a>
				</template>
				<template
					slot="claimedAmount"
					slot-scope="text, record"
				>
					<span> {{ record.claimedAmount | formatMoney(2) }}</span>
				</template>
			</a-table>
			<a-space :size="20" class="totalRow">
				<span>已付款金额<em>{{ returnedInfo.paymentAmountTotal | formatMoney(2) }}</em></span>
			</a-space>
		</div>
	</div>
</template>
<script>
const returnedColumns = [
	{ dataIndex: 'receiveSerialNo', title: '回款编号', scopedSlots: { customRender: 'receiveSerialNo' } },
	{
		dataIndex: 'receiveDate',
		title: '回款日期',
		customRender: text => {
			return text ? text.substring(0, 10) : '';
		}
	},
	{
		dataIndex: 'paymentTypeDesc',
		title: '收款类型',
		customRender: text => {
			return text || '-';
		}
	},
	{ dataIndex: 'claimedAmount', title: '已认领金额(元)', scopedSlots: { customRender: 'claimedAmount' } }
];
const returnedOnlineColumns = [
	{ dataIndex: 'serialNo', title: '资金流水号', scopedSlots: { customRender: 'serialNo' } },
	{
		dataIndex: 'payDate',
		title: '付款日期',
		customRender: text => {
			return text ? text.substring(0, 10) : '';
		}
	},
	{
		dataIndex: 'paymentTypeDesc',
		title: '付款类型',
		customRender: text => {
			return text || '-';
		}
	},
	{ dataIndex: 'payAmount', title: '付款金额(元)', scopedSlots: { customRender: 'payAmount' } }
];
import {
    API_PaymentCreateDownStreamCollection,
    API_PaymentCreateDownStreamPayment,
} from '@/v2/center/trade/api/pay';
export default {
	data() {
		return {
			returnedColumns,
			returnedOnlineColumns,
			returnedInfo: null,
			contractType: this.$route.query.contractType,
			businessLineType: '',
		};
	},
	computed: {
		showDown() {
			return ['OFFLINE', 'DOWN'].includes(this.businessLineType)
		}
	},
	methods: {
		// 展示下游合同回款信息
		async getInfo(data) {
			this.businessLineType = data?.businessLineType
			const API = ['OFFLINE', 'DOWN'].includes(data?.businessLineType) ? API_PaymentCreateDownStreamCollection : API_PaymentCreateDownStreamPayment
			const res = await API({
				businessLineNo: data.businessLineNo,
			})
			if (!res.success) return
			this.returnedInfo = res.data || null
		},
		jumpPage(path, query) {
			let routeUrl = this.$router.resolve({
				path,
				query
			});
			window.open(routeUrl.href, '_blank');
		},
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
  margin-top: 50px;
  margin-bottom: 20px;
}
.totalRow {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
	span {
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: rgba(119, 136, 157, 1);
		display: inline-block;
		em {
			display: inline-block;
			margin-left: 10px;
			font-style: normal;
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;
			line-height: 26px;
			text-align: left;
			color: rgba(244, 99, 50, 1);
		}
	}
}
</style>
