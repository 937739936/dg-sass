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
					slot="statusDesc"
					slot-scope="text, record"
				>
					<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
				</template>
			</a-table>
		</div>
		<TableStatisticalInfo :statisticsList="statisticsList" />
	</div>
</template>

<script>
import TableStatisticalInfo from './TableStatisticalInfo.vue';
import NumberFormatView from '../NumberFormatView';

export default {
	name: 'GoodsBatchTable',
	components: {
		TableStatisticalInfo,
		NumberFormatView
	},
	props: {
		title: {
			type: String
		},
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			columns: columns,
			loading: false
		};
	},
	mounted() {},
	computed: {
		statisticsList() {
			// 统计信息
			let count = this.dataSource.length;
			let totalDeliverQuantity = 0;
			let totalReceiveQuantity = 0;
			let totalCar = 0;
			this.dataSource.forEach(item => {
				totalDeliverQuantity += item.deliverQuantity || 0;
				totalReceiveQuantity += item.receiveQuantity || 0;
				totalCar += item.trainNum || 0;
			});
			let list = [
				{
					title: '发货批次数',
					value: count
				},
				{
					title: '票重',
					value: totalDeliverQuantity,
					unit: '吨'
				},
				{
					title: '衡重',
					value: totalReceiveQuantity,
					unit: '吨'
				}
			];
			if (totalCar) {
				list.push({
					title: '车数',
					value: totalCar
				});
			}
			return list;
		}
	},
	methods: {
		openDetail(record) {
			this.$emit('openNewTabPage', 'GOODS_SEND_DETAIL', record);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '发货批次号',
		dataIndex: 'batchNo',
		scopedSlots: {
			customRender: 'LINK'
		}
	},
	{
		title: '运输方式',
		dataIndex: 'despatchTypeDesc',
		customRender
	},
	{
		title: '发货数量(吨)',
		dataIndex: 'deliverQuantity',
		scopedSlots: { customRender: 'QUANTITY' }
	},
	{
		title: '收货数量(吨)',
		dataIndex: 'receiveQuantity',
		scopedSlots: { customRender: 'QUANTITY' }
	},
	{
		title: '发货日期',
		dataIndex: 'deliverDate',
		customRender
	},
	{
		title: '最后收货日期',
		dataIndex: 'lastReceiveDate',
		customRender
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: {
			customRender: 'statusDesc'
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
		&.status-1 {
			background: #c9daff;
			color: #596fa0;
		}
		&.status-2 {
			background: #ffdbc8;
			color: #ff7937;
		}
		&.status-3 {
			background: #f8dde8;
			color: #db81a5;
		}
		&.status-4 {
			background: #c5ecdd;
			color: #3eb384;
		}
		&.status-5 {
			background: #e0e0e0;
			color: #a8a8a8;
		}
	}
}
</style>