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
				<template
					slot="QUANTITY"
					slot-scope="text"
				>
					<NumberFormatView :value="text" />
				</template>
				<template
					slot="STATUSDESC"
					slot-scope="text, record"
				>
					<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
				</template>
			</a-table>
			<TableStatisticalInfo
				v-if="dataSourcesNotEmpty.length > 0"
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
	name: 'UpSettleTable',
	components: {
		TableStatisticalInfo,
		NumberFormatView
	},
	props: {
		settleType: { // up上游, down下游
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
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
		dataSourcesNotEmpty() {
			return this.dataSource || [];
		},
		statisticsList() {
			let count = this.dataSourcesNotEmpty.length;
			let settleAmount = 0;
			let settleQuantity = 0;
			this.dataSource.forEach(item => {
				settleAmount += item.settleAmount;
				settleQuantity += item.settleQuantity;
			});
			return [
				{
					title: '结算单数量',
					value: count
				},
				{
					title: '已结算数量',
					value: settleQuantity,
					unit: '吨'
				},
				{
					title: '已结算金额',
					value: settleAmount,
					isMonetary: true // 是否是货币单位
				}
			];
		}
	},
	methods: {
		openDetail(record) {
			if (record.dataType === 'ONLINE') {
				this.$emit('openNewTabPage', this.settleType === 'up' ? 'SETTLEMENT_ONLINE_DETAIL' : 'SETTLEMENT_ONLINE_DETAIL_SELL', record);
			} else if (record.dataType === 'OFFLINE') {
				this.$emit('openNewTabPage', this.settleType === 'up' ? 'SETTLEMENT_OFFLINE_DETAIL' : 'SETTLEMENT_OFFLINE_DETAIL_SELL', record);
			}
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '结算单编号',
		dataIndex: 'serialNo',
		scopedSlots: {
			customRender: 'LINK'
		}
	},
	{
		title: '结算金额(元)',
		dataIndex: 'settleAmount',
		scopedSlots: {
			customRender: 'MONEY'
		}
	},
	{
		title: '结算数量(吨)',
		dataIndex: 'settleQuantity',
		scopedSlots: {
			customRender: 'QUANTITY'
		}
	},
	{
		title: '结算单价(元/吨)',
		dataIndex: 'settleUnitPrice',
		scopedSlots: {
			customRender: 'MONEY'
		}
	},
	{
		title: '结算日期',
		dataIndex: 'confirmTime',
		customRender
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: {
			customRender: 'STATUSDESC'
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
	.status-tag {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 20px;
		background: #c1d7ff;
		color: #4682f3;
		// cursor: pointer;
		//待确认
		&.status-RECEIVER_CONFIRM {
			background: #c9daff;
			color: #596fa0;
		}
		//审批中
		&.status-WAIT_ORIGINATOR_INNER_AUDITING {
			background: #ffdbc8;
			color: #ff7937;
		}
		//待签约
		&.status-NEW {
			background: #f8dde8;
			color: #db81a5;
		}
		//已签约
		&.status-EFFECTIVE {
			background: #c5ecdd;
			color: #3eb384;
		}
		//已作废
		&.status-INVALID,
		&.status-ORIGINATOR_CANCEL,
		&.status-RECEIVER_CANCEL {
			background: #e0e0e0;
			color: #a8a8a8;
		}
		//退回
		&.status-FREEZING {
			background: #d2dfea;
			color: #7590b9;
		}
		//驳回
		&.status-ORIGINATOR_INNER_REJECT {
			background: #f2d0d0;
			color: #dd4444;
		}
		//待确认-线下
		&.status-WAI_CONFIRM {
			background: #c9daff;
			color: #596fa0;
		}
		//驳回-线下
		&.status-REJECT {
			background: #f2d0d0;
			color: #dd4444;
		}
	}
}
</style>