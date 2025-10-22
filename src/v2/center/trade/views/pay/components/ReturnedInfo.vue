<template>
	<div v-if="returnedInfo && returnedInfo.collectionInfoList && returnedInfo.collectionInfoList.length">
		<strong style="line-height: 40px; margin-top: 20px; display: inline-block">业务线下游回款信息：</strong>
		<div class="money-box">
			<div class="money-box-item">
				<p>累计认领回款金额(元)</p>
				<p>{{ returnedInfo.accumulateClaimedAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #fff9f0"
			>
				<p>累计认领保证金回款金额(元)</p>
				<p>{{ returnedInfo.accumulateClaimedMarginAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #ebfaef"
			>
				<p>累计认领货款回款金额(元)</p>
				<p>{{ returnedInfo.accumulateClaimedGoodsAmount | formatMoney(2) }}</p>
			</div>
		</div>
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
				<a :href="'/center/fund/returned/detail?receiveSerialNo=' + text">{{ record.receiveSerialNo }}</a>
			</template>
			<template
				slot="claimedAmount"
				slot-scope="text, record"
			>
				<span> {{ record.claimedAmount | formatMoney(2) }}</span>
			</template>
		</a-table>
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
import { API_GetReturnedInfo } from '@/v2/center/trade/api/pay';
export default {
	data() {
		return {
			returnedColumns,
			returnedInfo: ''
		};
	},
	props: {
		orderNo: {
			type: String,
			default: () => {
				return '';
			}
		}
	},
	methods: {
		// 展示下游合同回款信息
		initInfo(data) {
			console.log('this.returnedInfo', data);
			this.returnedInfo = data;
		},
		getInfo(data) {
			API_GetReturnedInfo({
				orderNo: this.orderNo,
				fullBizLineId: data
			}).then(res => {
				if (res.success) {
					this.returnedInfo = res.result;
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.money-box {
	display: flex;
	margin-bottom: 30px;
	&-item {
		width: 250px;
		height: 88px;
		flex-shrink: 0;
		border-radius: 6px;
		background: #f0f8ff;
		margin-right: 30px;
		padding: 14px 0;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		p:last-child {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
</style>
