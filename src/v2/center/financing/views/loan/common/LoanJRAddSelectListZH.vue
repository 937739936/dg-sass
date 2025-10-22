<template>
	<div>
		<a-drawer
			class="slDrawer"
			title="选择融资记录"
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
					<div
						slot="status"
						slot-scope="text, record"
					>
						<FinancingTipInfo :item="record" />
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
import { API_FinancingListHn } from '@/v2/center/financing/api/index.js';
import { convertCurrency, getPopupContainer } from '@/v2/utils/factory.js';
import { formatMoney } from '@sub/filters';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入融资编号/应收账款流水号/合同编号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '核心企业',
		type: 'input',
		placeholder: '请输入核心企业'
	}
];
const customRender = text => text || '-'; //空数据用-代替
const columns = [
	{
		title: '融资编号',
		dataIndex: 'serialNo',
		key: 'serialNo',
		fixed: 'left',
		customRender
	},
	{ title: '融资方', dataIndex: 'financier', key: 'financier', customRender },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName', customRender },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{ title: '融资利率(%)', dataIndex: 'rate', key: 'rate', customRender },
	{
		title: '融资起息日',
		dataIndex: 'beginDate',
		key: 'beginDate',
		customRender
	},
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate', customRender },
	{
		title: '应收账款流水号',
		dataIndex: 'receivableSerialNo',
		key: 'receivableSerialNo',
		customRender
	},
	{
		title: '应收账款金额(元)',
		dataIndex: 'receivableAmount',
		key: 'receivableAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		key: 'statusText',
		scopedSlots: { customRender: 'status' }
	}
];

export default {
	name: 'LoanJRAddSelectListZH',
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
				list: API_FinancingListHn
			}
		};
	},
	components: { FinancingTipInfo },
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
				this.$router.push('/center/loan/loanFangZH?id=' + key);
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
</style>
