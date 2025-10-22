<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>货押融资管理</span
				>
				<a-space style="text-align: right">
					<a-button
						type="primary"
						@click="goApply"
					>
						融资申请
					</a-button>
				</a-space>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-row
				type="flex"
				justify="end"
				style="margin: 10px 0"
			>
				<!-- 应收才有同步 -->
				<div
					class="export-box"
					@click="pushAndSyncLoan"
				>
					<RefreshIcon />
					<span class="export-text">数据同步</span>
				</div>
			</a-row>
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
						slot="finAmount"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ convertCurrency(text) }} </template>
							{{ formatMoney(text) }}
						</a-tooltip>
					</div>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="$router.push('financingPledgeDetail?id=' + record.id + '')"
						>
							详情
						</a>
					</div>
					<div
						slot="status"
						slot-scope="text, record"
					>
						<FinancingTipInfo :item="record" />
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
import { API_FinancingLogpledge, API_FinancingSync } from '@/v2/center/financing/api/index.js';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@/v2/utils/factory.js';
import { filterCodeByKey } from'@sub/utils/globalCode.js';
import { RefreshIcon } from '@sub/components/svg';
const columns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName' },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{ title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' } },
	{ title: '融资利率（%）', dataIndex: 'rate', key: 'rate', align: 'center' },
	{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
	{ title: '货押资产编号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{ title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity' },
	{ title: '质押货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
	{ title: '融资状态', fixed: 'right', key: 'statusText', dataIndex: 'statusText', scopedSlots: { customRender: 'status' } },
	{ title: '操作', fixed: 'right', key: 'action', scopedSlots: { customRender: 'action' } }
];

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '融资编号',
		type: 'input',
		placeholder: '请输入融资编号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '出资机构',
		type: 'input',
		placeholder: '请输入出资机构'
	},
	{
		decorator: ['receivableSerialNo'],
		addonBeforeTitle: '货押资产编号',
		type: 'input',
		placeholder: '请输入货押资产编号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '融资状态',
		type: 'select',
		placeholder: '请选择融资状态',
		options: filterCodeByKey('financingStatusDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['beginDate'],
		addonBeforeTitle: '融资起息日',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '融资到期日',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			formatMoney,
			convertCurrency,
			searchList,
			params: {
				pageSize: 10,
				pageNo: 1
			},
			listDataSource: []
		};
	},
	components: {
		FinancingTipInfo,
		RefreshIcon
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
			API_FinancingLogpledge({
				...this.params,
				...this.searchParams
			}).then(res => {
				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		pushAndSyncLoan() {
			this.$confirm({
				centered: true,
				title: '确定同步吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_FinancingSync().then(res => {
						if (res.data) {
							this.$message.success('同步成功');
							this.getList();
						}
					});
				},
				onCancel() {}
			});
		},
		goApply() {
			this.$router.push('/center/financing/financingPledgeList');
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
.export-box {
	display: flex;
	align-items: center;
	color: @primary-color;
	cursor: pointer;
	.export-text {
		margin-left: 6px;
	}
}
</style>
