<template>
	<div>
		<a-drawer
			class="slDrawer"
			title="选择应收账款记录"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
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
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="relation-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						:class="{ disabled: !selectedRowKeys.length }"
						:disabled="!selectedRowKeys.length"
						type="primary"
						@click="handleSubmit"
						>下一步</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { API_GetLoanListJRFang } from '@/v2/center/financing/api/index.js';
import { convertCurrency, getPopupContainer } from '@/v2/utils/factory.js';
import { formatMoney } from '@sub/filters';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入应收账款流水号/合同编号'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称'
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
		decorator: ['applyTime1'],
		addonBeforeTitle: '应收账款申请日期',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
	}
];
const customRender = text => text || '-'; //空数据用-代替
const columns = [
	{
		title: '卖方名称',
		dataIndex: 'sellerName',
		key: 'sellerName',
		customRender
	},
	{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName', customRender },
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		customRender
	},
	{
		title: '应收账款类型',
		dataIndex: 'typeText',
		key: 'typeText',
		customRender
	},
	{
		title: '应收账款金额(元)',
		dataIndex: 'amount',
		key: 'amount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '应收账款起始日期',
		dataIndex: 'beginDate',
		key: 'beginDate',
		customRender
	},
	{
		title: '应收账款到期日期',
		dataIndex: 'endDate',
		key: 'endDate',
		customRender
	},
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName', customRender },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '应收账款申请日期',
		dataIndex: 'requestTime',
		key: 'requestTime',
		customRender
	}
];

export default {
	name: 'LoanJRAddSelectList',
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			convertCurrency,
			formatMoney,
			columns,
			selectedRowKeys: [],
			orderRelationModal: false,
			paginationRelation: {},
			searchList,
			selfLoad: true,
			url: {
				list: API_GetLoanListJRFang
			}
		};
	},
	components: {},
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
				}
			};
		}
	},
	methods: {
		//外部引用方法打开弹框
		showRelationList() {
			this.orderRelationModal = true;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.$forceUpdate();
					}
				}
			};
		},
		async handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warn('请选择融资记录');
				return;
			}
			let key = this.selectedRowKeys[0];
			if (key) {
				this.$router.push('/center/loan/loanFang?id=' + key);
			}
		},
		onClose() {
			this.orderRelationModal = false;
			this.selectedRowKeys = [];
			this.searchParams = {};
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
.tip-modal {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	p:last-child {
		margin-top: 20px;
	}
}
.ant-btn-primary.disabled {
	background: #e5e6eb;
	border: 0;
}
</style>
