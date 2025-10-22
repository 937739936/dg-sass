<template>
	<div class="sub-table-container">
		<div
			v-if="title"
			class="slTitleAssis"
		>
			{{ title }}
		</div>
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template
					slot="LINK"
					slot-scope="text, record"
				>
					<a @click="openDetail(record)">{{ text }}</a>
				</template>
				<template
					slot="MONEY"
					slot-scope="text"
				>
					<NumberFormatView
						:value="text"
						:isShowMoneyTip="true"
					/>
				</template>
			</a-table>
			<TableStatisticalInfo
				v-if="dataSource.length > 0"
				:statisticsList="statisticsList"
			/>
			<div
				v-else
				class="statistical-empty"
			></div>
		</div>
	</div>
</template>

<script>
import TableStatisticalInfo from './TableStatisticalInfo.vue';
import NumberFormatView from '../NumberFormatView.vue';

export default {
	//  付款对应业务线下游为电子合同时使用
	name: 'OnLineBusinessLineDownCollectTable',
	components: {
		TableStatisticalInfo,
		NumberFormatView
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		paymentVO: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	computed: {
		paymentVONotEmpty() {
			return this.paymentVO || {};
		},
		dataSource() {
			return this.paymentVONotEmpty.paymentRecordList ?? [];
		},
		statisticsList() {
			let paymentVO = this.paymentVONotEmpty ?? {};
			return [
				{
					title: '已付款金额',
					value: paymentVO.paymentAmountTotal || 0,
					isMonetary: true // 是否是货币单位
				}
			];
		}
	},
	methods: {
		openDetail(record) {
			if (record.paymentType === 'REFUND') {
				// 付款类型为退款时，打开退款详情页
				this.$emit('openNewTabPage', 'REFUND_DETAIL', record);
			} else {
				// 其他付款类型，打开付款详情页
				this.$emit('openNewTabPage', 'PAY_DETAIL', record);
			}
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '资金流水号',
		dataIndex: 'serialNo',
		scopedSlots: {
			customRender: 'LINK'
		}
	},
	{
		title: '付款日期',
		dataIndex: 'payDate',
		customRender
	},
	{
		title: '付款类型',
		dataIndex: 'paymentTypeDesc',
		customRender
	},
	{
		title: '付款金额(元)',
		dataIndex: 'payAmount',
		scopedSlots: {
			customRender: 'MONEY'
		}
	}
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	.statistical-empty {
		height: 50px;
	}
	/deep/ .ant-table {
    td,
    th {
      white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
    }
  }
}
</style>