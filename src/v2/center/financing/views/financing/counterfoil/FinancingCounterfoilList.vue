<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				票据融资申请
			</span>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="listDataSource"
					:scroll="{ x: true }"
					rowKey="id"
				>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a
							v-auth="'finance:finance:bill:save'"
							href="javascript:;"
							@click="$router.push('financingCounterfoilApply?id=' + record.id + '')"
							>发起融资</a
						>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					v-show="params.pageSize < pagination.total"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_FinancingCounterfoilList } from '@/v2/center/financing/api/index.js';

import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';

const columns = [
	{ title: '云票编号', dataIndex: 'billNo', key: 'billNo' },
	{ title: '云票金额（元）', dataIndex: 'billAmount', key: 'billAmount' },
	{ title: '开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{ title: '转让方', dataIndex: 'transferName', key: 'transferName' },
	{ title: '接收方', dataIndex: 'receiverName', key: 'receiverName' },
	{ title: '开立日期', dataIndex: 'issueDate', key: 'issueDate', align: 'center' },
	{ title: '承诺付款日', dataIndex: 'acceptanceDate', key: 'acceptanceDate' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

const searchList = [
	{
		decorator: ['billNo'],
		addonBeforeTitle: '云票编号',
		type: 'input',
		placeholder: '请输入云票编号'
	},
	{
		decorator: ['issuerName'],
		addonBeforeTitle: '开立方',
		type: 'input',
		placeholder: '请输入开立方'
	},
	{
		decorator: ['transferName'],
		addonBeforeTitle: '转让方',
		type: 'input',
		placeholder: '请输入转让方'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['issueDate'],
		addonBeforeTitle: '承诺付款日',
		type: 'rangePicker',
		realKey: ['issueDateStart', 'issueDateEnd']
	},
	{
		decorator: ['acceptanceDate'],
		addonBeforeTitle: '开立日期',
		type: 'rangePicker',
		realKey: ['acceptanceDateStart', 'acceptanceDateEnd']
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchList,
			params: {
				pageSize: 10,
				pageNo: 1
			},
			listDataSource: []
		};
	},
	methods: {
		resetFunc() {},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_FinancingCounterfoilList({
				...this.params,
				...this.searchParams
			}).then(res => {
				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;

	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 10px;
	}
}

.tabs-box {
	position: relative;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
}

.table-box.fixedBottom {
	.new-table {
		margin-bottom: 12px;
	}

	.slPagination {
		margin-top: 10px;
		width: calc(100% - 254px);
		min-width: 1186px;
		background: #fff;
		padding: 10px 30px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		left: 228px;
	}
}
</style>
