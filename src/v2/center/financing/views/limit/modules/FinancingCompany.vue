<template>
	<div style="width: 100%; height: 100%">
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			:isShowIcon="false"
			:isShowSearchBox="true"
		></SlFormNew>
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
			<template #tabBarExtraContent>
				<a-button
					class="export-box"
					ghost
					type="primary"
					:loading="exportLoading"
					@click="exportExcel()"
				>
					<ExportIcon v-if="!exportLoading" class="export-icon"></ExportIcon>
					数据导出
				</a-button>
			</template>
		</a-tabs>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				class="new-table"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="false"
				:scroll="{ x: true }"
			>
				<template
					slot="statusText"
					slot-scope="text, record"
				>
					<span :class="`status status-${record.status}`">{{ text }}</span>
				</template>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a @click="pushToDetailView(record)">查看</a>
				</template>
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
	// API_CoreCompanyExport,
	API_CreditLineExport,
	API_TraderCreditLinelList
} from '@/v2/center/financing/api/index';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { ExportIcon } from '@sub/components/svg'
export default {
	name: 'FinancingCompanyLimit',
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			columns,
			defaultParams: {
				status: 'EFFECTIVE', // 启用-EFFECTIVE，停用-INVALID
				companyType: 'FINANCING_COMPANY'
			},
			exportLoading: false, // 导出loading
			eFFECTIVETotal: 0, // 启用个数
			iNVALIDTotal: 0, // 停用个数
			url: {
				list: API_TraderCreditLinelList
			}
		};
	},
	mounted() {
		this.getTabNum();
	},
	methods: {
		//修改查询类型
		async tabChange() {
			await this.getList();
			this.getTabNum();
		},
		// 筛选条件发生变化
		async handleChange(data) {
			await this.changeSearch(data);
			this.getTabNum();
		},
		// 获取tab启用、停用的个数
		getTabNum() {
			API_CreditLineCount({
				pageNo: 1,
				pageSize: 1,
				companyType: 'FINANCING_COMPANY',
				...this.searchParams
			}).then(res => {
				this.eFFECTIVETotal = res.data.enableCount;
				this.iNVALIDTotal = res.data.disableCount;
				// this.$emit('setMyCount',this.eFFECTIVETotal+this.iNVALIDTotal)
			});
		},
		// 数据导出
		exportExcel() {
			// 下载报告
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.exportLoading = true;
			API_CreditLineExport(params)
				.then(res => {
					let fileName = '额度记录-' + moment().format('YYYYMMDD') + '.xls';
					comDownload(res, undefined, fileName);
				})
				.finally(() => {
					this.exportLoading = false;
				});
		},
		// 跳转到详情页面
		pushToDetailView(record) {
			this.$router.push({
				path: '/center/financing/limit/detail',
				query: {
					id: record.id
				}
			});
		}
	},
	components: {
		ExportIcon
	}
};

const searchList = [
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
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
const customRender = text => text.toLocaleString();
const columns = [
	{ title: '企业名称', dataIndex: 'companyName', customRender },
	{ title: '资金类型', dataIndex: 'bankProductName', customRender },
	{ title: '授信额度（元）', dataIndex: 'totalAmount', customRender },
	{
		title: '冻结额度（元）',
		dataIndex: 'frozenAmount',
		customRender
	},
	{ title: '已用额度（元）', dataIndex: 'usedAmount', customRender },
	{ title: '剩余额度（元）', dataIndex: 'availableAmount', customRender },
	{ title: '起始日期', dataIndex: 'beginDate', customRender },
	{ title: '到期日期', dataIndex: 'endDate', customRender },
	{
		title: '额度状态',
		dataIndex: 'statusText',
		scopedSlots: { customRender: 'statusText' }
	},
	{
		title: '操作',
		fixed: 'right',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>

<style lang="less" scoped>
.table-box {
	width: 100%;
}

.export-box {
	//   text-align: right;
	//   cursor: pointer;
	border: none;
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

.status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #ffdbdb;
	color: #dd4444;
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
