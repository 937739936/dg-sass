<template>
	<div>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				:rowKey="(record, index) => index.toString()"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template slot="availableAmountTitle">
					<span>剩余额度(元) </span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>剩余额度=授信额度-已用额度</span>
						</template>
						<img
							class="tip-icon"
							src="@/v2/assets/imgs/common/column_title_tip.png"
							alt=""
						/>
					</a-tooltip>
				</template>
				<template
					slot="indexNumber"
					slot-scope="text, record, index"
				>
					<span>{{ (pagination.pageNo - 1) * pagination.pageSize + Number(index) + 1 }}</span>
				</template>
				<template
					slot="moneyRender"
					slot-scope="text"
				>
					<a-tooltip placement="top">
						<template
							v-if="getFormatMoneyTip(text).tip"
							slot="title"
						>
							<span>{{ getFormatMoneyTip(text).tip }}</span>
						</template>
						<span>{{ getFormatMoneyTip(text).money }}</span>
					</a-tooltip>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
// import { API_getReceiptList } from '@/v2/center/trade/api/newLading';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/globalCode.js';
import { API_LedgerDebtorCreditLineList } from '@/v2/center/financing/api/index';

export default {
	name: 'DebtorQuotaDataList',
	mixins: [ListMixin],
	props: {
		// 更新日期
		date: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			columns: columns,
			loading: false,
			url: {
				list: API_LedgerDebtorCreditLineList
			},
			defaultParams: {
				date: this.date
			}
		};
	},
	watch: {
		date: {
			handler(val) {
				this.defaultParams.date = val;
			},
			deep: true
		}
	},
	methods: {
		formatMoney,
		convertCurrency,
		getFormatMoneyTip(text) {
			let money = '';
			let tip = '';
			if (text !== null && text !== undefined && text !== '') {
				money = formatMoney(text);
				tip = convertCurrency(text);
				if (money == '0' || money == 0) {
					tip = '零元整';
				}
			} else {
				money = '-';
				tip = '';
			}
			return {
				money,
				tip
			};
		}
	}
};

const customRender = text => text || '-';

const columns = [
	{
		title: '序号',
		dataIndex: 'indexNumber',
		scopedSlots: { customRender: 'indexNumber' }
		// fixed: 'left'
	},
	{
		title: '保理债务人名单',
		dataIndex: 'company',
		customRender
	},
	{
		title: '控制额度(元)',
		dataIndex: 'creditLineAmount',
		scopedSlots: { customRender: 'moneyRender' }
	},
	{
		title: '已确权额度(元)',
		dataIndex: 'usedAmount',
		scopedSlots: { customRender: 'moneyRender' }
	},
	{
		//   title: "剩余额度(元)",
		dataIndex: 'availableAmount',
		slots: { title: 'availableAmountTitle' },
		scopedSlots: { customRender: 'moneyRender' }
	}
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.tip-icon {
	width: 12px;
	height: 12px;
	margin-bottom: 4px;
	// line-height: 21px;
}
</style>