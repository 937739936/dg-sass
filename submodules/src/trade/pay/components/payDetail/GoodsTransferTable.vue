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
				v-if="dataSource.length > 0"
				:statisticsList="statisticsList"
			/>
		</div>
	</div>
</template>

<script>
import TableStatisticalInfo from './TableStatisticalInfo.vue';
import NumberFormatView from '../NumberFormatView';

export default {
	name: 'GoodsTransferTable',
	components: {
		NumberFormatView,
		TableStatisticalInfo
	},
	props: {
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
		statisticsList() {
			let totalQuantity = 0;
			let totalCount = 0;
			this.dataSource.forEach(item => {
				totalQuantity += item.goodsTransferQuantity;
				totalCount++;
			});
			return [
				{
					title: '货转笔数',
					value: totalCount
				},
				{
					title: '货转数量',
					value: totalQuantity,
					unit: '吨'
				}
			];
		}
	},
	methods: {
		openDetail(record) {
			this.$emit('openNewTabPage', 'GOODS_TRANSFER_DETAIL', record);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '货转编号',
		dataIndex: 'goodsTransferNo',
		scopedSlots: {
			customRender: 'LINK'
		}
	},
	{
		title: '运输方式',
		dataIndex: 'transTypeDesc',
		customRender
	},
	{
		title: '货转数量(吨)',
		dataIndex: 'goodsTransferQuantity',
		scopedSlots: {
			customRender: 'QUANTITY'
		}
	},
	{
		title: '货转日期',
		dataIndex: 'signDate',
		customRender
	},
	{
		title: '收货人',
		dataIndex: 'receiverName',
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
		&.status-WAIT_CONFIRM {
			background: #c9daff;
			color: #596fa0;
		}
		//审批中
		&.status-AUDITING {
			background: #ffdbc8;
			color: #ff7937;
		}
		//待签约
		&.status-UNSEAL {
			background: #f8dde8;
			color: #db81a5;
		}
		//已签约
		&.status-SEALED {
			background: #c5ecdd;
			color: #3eb384;
		}
		//已作废
		&.status-INVALID {
			background: #e0e0e0;
			color: #a8a8a8;
		}
		//退回
		&.status-APPROVAL_FAIL {
			background: #d2dfea;
			color: #7590b9;
		}
		//驳回
		&.status-REJECT {
			background: #f2d0d0;
			color: #dd4444;
		}
	}
}
</style>