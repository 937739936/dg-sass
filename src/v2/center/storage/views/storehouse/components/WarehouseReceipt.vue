<template>
	<div>
		<a-table
			class="new-table"
			:columns="columns"
			:rowKey="record => record.id"
			:dataSource="dataSource"
			:pagination="false"
			:loading="loading"
			:scroll="{ x: true }"
		>
			<template
				slot="statusDesc"
				slot-scope="text, record"
			>
				<span :class="setStyle(record.status)">{{ text }}</span>
			</template>
			<template
				slot="action"
				slot-scope="action, record"
			>
				<a
					style="margin-right: 10px"
					@click="jumpPage('/center/storageCenter/out/receipt/detail', record)"
					>详情</a
				>
			</template>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
	</div>
</template>

<script>
import { API_OutWarehouseReceiptPage } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { mapMutations } from 'vuex';

const columns = [
	{
		title: '出仓单编号',
		fixed: 'left',
		dataIndex: 'deliveryNum'
	},
	{
		title: '开具日期',
		dataIndex: 'createDate'
	},
	{
		title: '提货人',
		dataIndex: 'consignee'
	},
	{
		title: '粮食品种',
		dataIndex: 'grainName'
	},
	{
		title: '出仓单数量(吨)',
		dataIndex: 'deliveryAmount'
	},
	{
		title: '累计出库数量(吨)',
		dataIndex: 'cumulativeDeliveryAmount'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: { customRender: 'statusDesc' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 100,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'EarlyWarningData',
	props: ['batchId'],
	components: {
		iPagination
	},

	data() {
		return {
			columns,
			earlyWarningDate: [],
			earlyWarningType: [],
			dataSource: [],
			params: {},
			loading: false,
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	computed: {},

	mounted() {
		this.getList();
	},

	methods: {
		...mapMutations({
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		setStyle(v) {
			return {
				DONE_ISSUED: 'g',
				ARCHIVED: 'r'
			}[v];
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.params.batchId = this.batchId;
			let params = { ...this.params };
			API_OutWarehouseReceiptPage(params).then(res => {
				if (res.success) {
					this.dataSource = res.data.list;
					this.pagination.total = res.data.total;
				}
			});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.earlyWarningDate = [];
			this.params = {};
			this.pagination.pageNo = 1;
			this.getList();
		},

		jumpPage(path, data) {
			this.$router.push({
				path,
				query: {
					id: data.id
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
::v-deep {
	.ant-card-body {
		padding-top: 0px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-form-item {
		display: block;
		margin-bottom: 14px;
	}
	.ant-form-item-label {
		padding-right: 5px;
	}
	.ant-calendar-picker {
		width: 100%;
	}
}
.search-btn {
	margin-right: 16px;
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
</style>
