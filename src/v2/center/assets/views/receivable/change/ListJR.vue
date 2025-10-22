<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收账款变更管理</span
				>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					style="margin-top: 22px"
				>
					<div
						slot="action"
						slot-scope="action, items"
					>
						<a-space>
							<router-link :to="{ path: '/center/assets/receivable/change/detailJR', query: { id: items.id, activeIndex: 2 } }"
								>查看</router-link
							>
							<router-link
								v-if="items.status == 'BANK_AUDIT'"
								:to="{
									path: '/center/assets/receivable/change/detailJR',
									query: { isAudit: 1, id: items.id, activeIndex: 2, view: 'edit' }
								}"
								>审核</router-link
							>
						</a-space>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>
<script>
const columns = [
	{ title: '变更记录编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应收账款流水号', dataIndex: 'originalSerialNo', key: 'originalSerialNo' },
	{ title: '原应收账款金额(元)', dataIndex: 'originalAmount', key: 'originalAmount', align: 'right' },
	{ title: '应收账款变更后金额(元)', dataIndex: 'amount', key: 'amount', align: 'right' },
	{ title: '拟融资金额(元)', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount', align: 'right' },
	{ title: '资金流水号', dataIndex: 'paymentNo', key: 'paymentNo' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '变更申请日期', dataIndex: 'requestTime', key: 'requestTime' },
	{ title: '状态', fixed: 'right', dataIndex: 'statusText', key: 'statusText' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '变更记录编号',
		type: 'input',
		placeholder: '请输入变更记录编号'
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
		options: filterCodeByKey('receivableStatusDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['originalSerialNo'],
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '变更日期',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
	}
];
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_GetAccountsPayableChangeBankList } from '@/v2/center/assets/api/index.js';
import iPagination from "@sub/components/iPagination";
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			url: {
				list: API_GetAccountsPayableChangeBankList
			},
			searchList
		};
	},
	components: {
		iPagination
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
