<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收账款管理</span
				>
			</div>
			<AssetsManagementList
				:searchList="searchList"
				:defaultStatusData="tabList"
				tabTypeName="bankAssetTabTypeEnum"
				:columns="columns"
				:listApi="API_GetAccountsReceivableListJR"
				:statisticsApi="API_GetAccountsReceivableCountAssetTabState"
				:statusTipApi="API_GetAssetsStatusTip"
			>
				<template
					slot="customAction"
					slot-scope="{ record }"
				>
					<a-space>
						<router-link
							v-auth="'asset:recvB:view'"
							:to="{ path: '/center/assets/receivable/JR/detail', query: { id: record.id, activeIndex: 0 } }"
							>详情</router-link
						>
						<!--仅“资方审核”状态后有审核操作 且assetAuditFlag为DATA_LINK_AUDIT-->
						<router-link
							v-auth="'asset:recvB:audit'"
							v-if="record.status == 'BANK_AUDIT' && record.assetAuditFlag == 'DATA_LINK_AUDIT'"
							:to="{ path: '/center/assets/receivable/JR/audit', query: { id: record.id } }"
							>审核</router-link
						>
						<a
							@click="download(record.auditFile)"
							v-if="record.auditFile"
							>下载审核报告</a
						>
					</a-space>
				</template>
			</AssetsManagementList>
		</a-card>
	</div>
</template>
<script>
const columns = [
	{ title: '应收账款流水号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应收账款类型', dataIndex: 'typeText' },
	{ title: '应收账款金额(元)', dataIndex: 'amount', key: 'amount', scopedSlots: { customRender: 'amount' }, align: 'right' },
	{ title: '应收账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应收账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'planFinancingAmount' },
		align: 'right'
	},
	{ title: '应收账款申请日期', dataIndex: 'requestTime', key: 'requestTime' },
	{ title: '状态', dataIndex: 'status', key: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '应收账款类型',
		type: 'select',
		placeholder: '请选择应收账款类型',
		options: [
			{ value: 'PROOF', label: '凭证结算' },
			{ value: 'INVOICE', label: '发票结算' }
		]
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '申请日期',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: filterCodeByKey('receivableStatusDict')
			.slice(4)
			.map(item => {
				return { value: item.value, label: item.text };
			})
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业类型',
		type: 'select',
		placeholder: '请选择行业类型',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' }
		]
	}
];
import ENV from '@/v2/config/env';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_GetAccountsReceivableListJR,
	API_GetAssetsStatusTip,
	API_GetAccountsReceivableCountAssetTabState,
	API_DOWNLPREVIEWTE
} from '@/v2/center/assets/api/index.js';
import AssetsManagementList from '@sub/componentsAssets/AssetsList.vue';
import comDownload from '@sub/utils/comDownload.js';

export default {
	data() {
		return {
			columns,
			searchList,
			tabList: [
				{ label: '全部', value: 'TAB_ALL' },
				{ label: '待我方审核', value: 'TAB_WAIT_BANK_AUDIT', num: 0 }
			]
		};
	},
	components: { AssetsManagementList },
	computed: {},
	methods: {
		API_GetAccountsReceivableListJR,
		API_GetAccountsReceivableCountAssetTabState,
		API_GetAssetsStatusTip,
		download(v) {
			// v = 'trade-files/confirm/6a432ea9f09e4e4ca640f8bb553507c2/water-mark/应付账款确认函.pdf'
			API_DOWNLPREVIEWTE(ENV.BASE_NET + v).then(res => {
				comDownload(res, v);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
