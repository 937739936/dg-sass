<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				货押融资申请
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
					:rowSelection="rowSelection"
				>
				</a-table>
				<i-pagination
					:pagination="pagination"
					v-show="params.pageSize < pagination.total"
					@change="getList"
				/>
			</div>
			<div style="text-align: center; margin-top: 20px">
				<a-button
					type="primary"
					@click="next"
					>下一步</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_FinancingApplypledge, API_FinancingApplyreceivableListPledge } from '@/v2/center/financing/api/index.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';

const columns = [
	{ title: '货押资产编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{ title: '货主名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '仓储企业', dataIndex: 'warehouseCompanyName', key: 'warehouseCompanyName' },
	{ title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity' },
	{ title: '质押货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '拟融资金额（元）', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount' },
	{ title: '货押资产申请日期', dataIndex: 'requestTime', key: 'requestTime' }
];

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '货押资产编号',
		type: 'input',
		placeholder: '请输入货押资产编号'
	},
	{
		decorator: ['warehouseCompanyName'],
		addonBeforeTitle: '仓储企业',
		type: 'input',
		placeholder: '请输入仓储企业'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '货押资产申请日',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
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
			listDataSource: [],
			selectedRowKeys: []
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
				}
			};
		}
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
			API_FinancingApplyreceivableListPledge({
				...this.params,
				...this.searchParams
			}).then(res => {
				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		next() {
			if (this.selectedRowKeys.length == 0) {
				this.$message.error('请选择资产');
				return;
			}
			let assetId = this.selectedRowKeys[0];

			API_FinancingApplypledge({ assetId }).then(res => {
				if (res.success) {
					this.$router.push({
						path: '/center/financing/financingPledgeApply?id=' + assetId
					});
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
		margin-bottom: 2px;
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
