<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				预付融资审核
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
						<a-space>
							<a
								href="javascript:;"
								v-auth="'finance:audit:pre:audit'"
								v-if="record.status == 'TRADER_AUDIT'"
								@click="$router.push('financingAdvanceDetailAudit?id=' + record.id + '&type=mai')"
								>审核</a
							>
							<a
								href="javascript:;"
								v-auth="'finance:audit:pre:audit'"
								v-if="record.status == 'CORE_COMPANY_AUDIT'"
								@click="$router.push('financingAdvanceDetailAudit?id=' + record.id + '&type=main')"
								>审核</a
							>

							<a
								href="javascript:;"
								v-auth="'finance:audit:pre:seal'"
								v-if="record.status == 'TRADER_TO_BE_SIGNED'"
								@click="gotoSign(record, 'mai')"
								>盖章</a
							>
							<a
								href="javascript:;"
								v-auth="'finance:audit:pre:seal'"
								v-if="record.status == 'CORE_COMPANY_TO_BE_SIGNED'"
								@click="gotoSign(record, 'main')"
								>盖章</a
							>
							<a
								href="javascript:;"
								v-auth="'finance:audit:pre:view'"
								@click="$router.push('financingAdvanceDetail?id=' + record.id + '')"
								>查看</a
							>
						</a-space>
					</div>
					<div
						slot="status"
						slot-scope="text, record"
					>
						<FinancingTipInfo
							:item="record"
							:pre="true"
						/>
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
import { API_FinancingAdvanceList } from '@/v2/center/financing/api/index.js';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';

const columns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '融资金额（元）', dataIndex: 'amount', key: 'amount', align: 'right' },
	{ title: '融资利率（%）', dataIndex: 'rate', key: 'rate', align: 'center' },
	{ title: '融资申请日', dataIndex: 'applyDate', key: 'applyDate' },
	{ title: '预付账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{ title: '预付账款金额（元）', dataIndex: 'receivableAmount', key: 'receivableAmount', align: 'right' },
	{ title: '融资状态', fixed: 'right', dataIndex: 'statusText', key: 'statusText', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
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
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['applyDate'],
		addonBeforeTitle: '融资申请日',
		type: 'rangePicker',
		realKey: ['applyDateStart', 'applyDateEnd']
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
	components: {
		FinancingTipInfo
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
			API_FinancingAdvanceList({
				...this.params,
				...this.searchParams
			}).then(res => {
				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		gotoSign(record, type) {
			this.$router.push({
				name: 'financingAdvanceAuditSign',
				params: {
					auditOpinion: '通过',
					type: type,
					id: record.id
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
