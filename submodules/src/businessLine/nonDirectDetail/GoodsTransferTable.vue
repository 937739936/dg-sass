<template>
	<div class="sub-table-container">
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
					slot="STATUSDESC"
					slot-scope="text, record"
				>
					<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
					<a
						v-if="platformType === 'ADMIN'"
						href="javascript:;"
						@click="openDetail(items)"
						>详情</a
					>
					<a
						href="javascript:;"
						@click="downloadGoodsTransferFile(items)"
						>下载</a
					>
					</a-space>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
export default {
	name: 'GoodsTransferTable',
	inject: ['platformType'],
	components: {},
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
	computed: {},
	methods: {
		formatMoney,
		openDetail(record) {
			let path = `/biz/goodsTransfer/detail?goodsTransferNo=${record.goodsTransferNo}`
      window.open(path)
		},
		downloadGoodsTransferFile(record) {
			this.$emit('downloadGoodsTransferFile', record.goodsTransferNo);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{ title: '货转编号', dataIndex: 'goodsTransferNo', customRender },
	{ title: '货转开具日期', dataIndex: 'signDate', customRender },
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', customRender, customRender: t => formatMoney(t) },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '运输方式', dataIndex: 'transTypeDesc', customRender },
	{
		title: '状态',
		dataIndex: 'statusName',
		scopedSlots: {
			customRender: 'STATUSDESC'
		}
	},
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' },  fixed: 'right' }
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