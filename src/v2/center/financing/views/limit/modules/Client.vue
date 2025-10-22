<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			:isShowIcon="false"
			:isShowSearchBox="true"
		></SlFormNew>
		<div class="tabs-box">
			<a-tabs
				v-model="defaultParams.status"
				@change="tabChange"
				:animated="false"
			>
				<a-tab-pane key="EFFECTIVE">
					<div slot="tab">启用（{{ eFFECTIVETotal }}）</div>
				</a-tab-pane>
				<a-tab-pane key="INVALID">
					<div slot="tab">停用（{{ iNVALIDTotal }}）</div>
				</a-tab-pane>
			</a-tabs>
			<div
				class="export-box"
				@click="exportFile('客户额度明细.xls')"
			>
				<ExportIcon class="export-icon"></ExportIcon>
				<span
					v-auth=""
					class="export-text"
					>数据导出</span
				>
			</div>
		</div>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
			<a-table
				:columns="columns"
				class="new-table"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<span
					slot="statusText"
					slot-scope="text, record"
				>
					<span :class="`status status-${record.status}`">{{ text }}</span>
				</span>
				<span
					slot="action"
					slot-scope="action, record"
				>
					<a @click="view(record)">查看</a>
				</span>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_CreditLineCount,
	API_CreditLineExport,
	API_CreditLinelList,
	API_GetBankProductList
} from '@/v2/center/financing/api/index';
import { ExportIcon } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['bankProductIdList'],
		addonBeforeTitle: '资金类型',
		type: 'select',
		placeholder: '请输入资金类型',
		options: []
	},
	{
		decorator: ['begin'],
		addonBeforeTitle: '起始日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['beginStartDate', 'beginEndDate']
	},
	{
		decorator: ['end'],
		addonBeforeTitle: '到期日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['endStartDate', 'endEndDate']
	}
];
const statusData = [
	{
		text: '启用',
		value: 'EFFECTIVE'
	},
	{
		text: '停用',
		value: 'INVALID'
	}
];
const customRender = text => text.toLocaleString();
const columns = [
	{ title: '企业名称', dataIndex: 'companyName', customRender },
	{ title: '金融机构', dataIndex: 'bankName', customRender },
	{ title: '资金类型', dataIndex: 'bankProductName', customRender },
	{ title: '授信额度（元）', dataIndex: 'totalAmount', customRender },
	{ title: '冻结额度（元）', dataIndex: 'frozenAmount', scopedSlots: { customRender: 'Amount' } },
	{ title: '已用额度（元）', dataIndex: 'usedAmount', customRender },
	{ title: '在途可用额度（元）', dataIndex: 'transitAvailableAmount', customRender },
	{ title: '剩余额度（元）', dataIndex: 'availableAmount', customRender },
	{ title: '起始日期', dataIndex: 'beginDate', customRender },
	{ title: '到期日期', dataIndex: 'endDate', customRender },
	{ title: '额度状态', dataIndex: 'statusText', scopedSlots: { customRender: 'statusText' } },
	{ title: '操作', fixed: 'right', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchList,
			statusData,
			defaultParams: {
				status: 'EFFECTIVE',
				companyType: 'FINANCING_COMPANY'
			},
			url: {
				list: API_CreditLinelList,
				export: API_CreditLineExport
			},
			eFFECTIVETotal: 0,
			iNVALIDTotal: 0
		};
	},
	created() {
		this.getTabNum();
		this.getBankList();
	},
	methods: {
		async tabChange() {
			await this.getList();
			this.getTabNum();
		},
		view(record) {
			this.$router.push({
				path: '/center/financing/limit/detail',
				query: {
					id: record.id,
					parentId: record.parentId,
					flag: 'view'
				}
			});
		},
		async handleChange(data) {
			await this.changeSearch(data);
			this.getTabNum();
		},
		getTabNum() {
			API_CreditLineCount({ pageNo: 1, pageSize: 1, ...this.searchParams, ...this.defaultParams }).then(res => {
				this.eFFECTIVETotal = res.data.enableCount;
				this.iNVALIDTotal = res.data.disableCount;
				// this.$emit('setClientCount',this.eFFECTIVETotal+this.iNVALIDTotal)
			});
		},
		getBankList() {
			API_GetBankProductList().then(res => {
				if (res.success) {
					res.data.map(i => {
						i.label = i.name;
						i.value = i.id;
					});
					this.searchList[2].options = res.data;
				}
			});
		}
	},
	components: {
		ExportIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}

.tabs-box {
	position: relative;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}

	.export-box {
		position: absolute;
		right: 0;
		top: 16px;
		text-align: right;
		cursor: pointer;

		.export-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: 1px;
		}

		.export-text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 20px;
		}
	}

	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
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
.status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}

.status-EFFECTIVE,
.status-1 {
	background: #c5ecdd;
	color: #3eb384;
}

.status-INVALID,
.status-0 {
	background: #ffdbdb;
	color: #dd4444;
}
</style>
