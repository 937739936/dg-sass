<template>
	<div>
		<div class="slTitleAssis">
			{{fromType!== 'detail' ? '选择发票' : '发票'}}
			<a-button
				v-if="fromType!== 'detail'"
				class="relBtn"
				@click="relationInvoice"
				type="primary"
				ghost
				>关联发票</a-button
			>
		</div>
		<a-table
			:pagination="false"
			:columns="transColumns"
			:data-source="transInvoiceListSelect"
			rowKey="id"
			:scroll="{ x: true }"
			class="new-table"
		>
			<template
				slot="state"
				slot-scope="text, record"
			>
				<p :class="'invoice-status ' + record.state">
					<span class="text">{{ record.stateDesc }}</span>
				</p>
			</template>
			<div
				slot="action"
				slot-scope="action, record, index"
			>
				<a-space :size="24">
					<a
						href="javascript:;"
						@click="invoiceDetail(record)"
						>查看</a
					>
					<a
						v-if="fromType!== 'detail'"
						href="javascript:;"
						@click="deleteInvoice(record, index, 'trans')"
						>删除</a
					>
				</a-space>
			</div>
		</a-table>
		<TableStatisticalInfo
			v-if="statisticsList.length > 0"
			:statisticsList="statisticsList"
		/>

		<a-drawer
			class="slDrawer"
			placement="right"
			destroyOnClose
			:visible="isShowModal"
			:footer="null"
			@close="onClose"
		>
			<div slot="title">
				<span>选择发票</span>
				<a
					class="addBtn"
					@click="addInvoice"
				>
					<a-icon
						type="plus-circle"
						style="font-size: 14px; color: var(--primary-color); display: inline-block; margin-right: 4px"
					/>新增{{$route.query.productCode === 'WAREHOUSE_RENT' ? '仓储' : '运费'}}发票</a
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getList"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
			></SlFormNew>
			<div class="table-box">
				<a-table
					class="new-table"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="invoiceList"
					:columns="columns2"
					:pagination="false"
					rowKey="id"
					:loading="loading"
				>
					<template
						slot="state"
						slot-scope="text, record"
					>
						<p :class="'invoice-status ' + record.state">
							<span class="text">{{ record.stateDesc }}</span>
						</p>
					</template>
					<span slot="customTitle2">
						开具金额(元)
						<a-tooltip>
							<template slot="title"> 不含税 </template>
							<i
								class="iconfont icon-liebiaobiaotou-shuoming"
								style="font-size: 12px"
							></i>
						</a-tooltip>
					</span>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<p class="remindTips">注：红冲、作废状态的发票不可被选择，系统将自动过滤</p>
			<div
				class="totalRowBox"
				v-if="invoiceTotal.total"
			>
				<span>已选：{{ invoiceTotal.total }}张发票</span>
				<a-space
					:size="20"
					class="totalRow"
				>
					<span
						>价税合计<em>{{ invoiceTotal.totalAmountTotal | formatMoney(2) }}</em></span
					>
					<span
						>归属价税合计<em>{{ invoiceTotal.currentContractSplitedAmountTotal | formatMoney(2) }}</em></span
					>
				</a-space>
			</div>
			<div class="footer">
				<a-space :size="20">
					<a-button
						class="footer-btn cancel-btn"
						@click="onClose"
					>
						取消
					</a-button>
					<a-button
						class="footer-btn"
						type="primary"
						:disabled="!(selectedRows && selectedRows.length)"
						@click="confirmCheck"
					>
						确定
					</a-button>
				</a-space>
			</div>
		</a-drawer>

		<ErrorModal
			ref="errorModal2"
			tip="提示"
		>
			<div class="error-msg">
				<p
					v-for="(item, index) in errorInfoList"
					:key="index"
				>
					{{ item }}
				</p>
				<p>无法关联付款,请核实发票状态</p>
			</div>
		</ErrorModal>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>

<script>
import _ from 'lodash';
import { formatMoney } from '@sub/filters';
import { API_PaymentCreateInvoice, payCheckInvoice } from '@/v2/center/trade/api/pay';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from '@sub/components/iPagination';
import ErrorModal from '@/v2/center/trade/views/pay/modules/errorModal.vue';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import TableStatisticalInfo from '@sub/trade/pay/components/payDetail/TableStatisticalInfo';

const transColumns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额(元)', dataIndex: 'taxExcludedAmount', customRender: text => text && text.toLocaleString() },
	{ title: '税额(元)', dataIndex: 'taxAmount', align: 'center', customRender: text => text && text.toLocaleString() },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', customRender: text => text && text.toLocaleString() },
	{ title: '是否包含印花税', dataIndex: 'stampTaxFlag', align: 'center', customRender: text => ['否', '是'][text - 1] },
	{
		title: '印花税税额(元)',
		dataIndex: 'stampTaxFlagAmount',
		align: 'center',
		customRender: text => text && text.toLocaleString()
	},
	{
		title: '含印花税合计(元)',
		align: 'center',
		dataIndex: 'stampTaxFlagTotalAmount',
		customRender: text => text && text.toLocaleString()
	},
	{
		title: '拆分到本合同金额(元)',
		dataIndex: 'currentContractSplitedAmount',
		align: 'center',
		customRender: text => text && text.toLocaleString()
	},
	{ title: '发票状态', dataIndex: 'state', scopedSlots: { customRender: 'state' }, width: 120 },
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const transColumnsDrawer = [
	{ title: '发票代码', dataIndex: 'code', width: 120 },
	{ title: '发票号码', dataIndex: 'no', width: 120 },
	{ title: '开票日期', dataIndex: 'issuedDate', width: 120 },
	{
		dataIndex: 'taxExcludedAmount',
		slots: { title: 'customTitle2' },
		customRender: text => text && text.toLocaleString(),
		width: 150
	},
	{ title: '价税合计(元)', dataIndex: 'totalAmount', customRender: text => text && text.toLocaleString(), width: 130 },
	{
		title: '是否包含印花税',
		dataIndex: 'stampTaxFlag',
		align: 'center',
		customRender: text => ['否', '是'][text - 1],
		width: 180
	},
	{
		title: '印花税税额(元)',
		dataIndex: 'stampTaxFlagAmount',
		align: 'center',
		customRender: text => text && text.toLocaleString(),
		width: 180
	},
	{
		title: '含印花税合计(元)',
		align: 'center',
		dataIndex: 'stampTaxFlagTotalAmount',
		customRender: text => text && text.toLocaleString(),
		width: 180
	},
	{
		title: '拆分到本合同金额(元)',
		dataIndex: 'currentContractSplitedAmount',
		align: 'center',
		customRender: text => text && text.toLocaleString(),
		width: 200
	},
	{ title: '发票状态', dataIndex: 'state', scopedSlots: { customRender: 'state' }, width: 100 },
	{ title: '是否有附件', dataIndex: 'whetherHasAttachment', width: 120 }
];
const searchList = [
	{
		decorator: ['no'],
		addonBeforeTitle: '发票号码',
		type: 'input',
		placeholder: '请输入发票号码'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '开票日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['issuedDateStart', 'issuedDateEnd']
	},
	{
		decorator: ['whetherHasAttachment'],
		addonBeforeTitle: '是否有附件',
		type: 'select',
		placeholder: '请选择',
		options: [
			{ label: '是', value: true },
			{ label: '否', value: false }
		]
	}
];

export default {
	data() {
		return {
			transColumns,
			transColumnsDrawer,
			transInvoiceList: [],
			transInvoiceListSelect: [],
			isShowModal: false,
			searchList,
			invoiceList: [],
			params: {
				pageSize: 10,
				pageNo: 1
			},
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			selectedRowKeys: [],
			selectedRows: [],
			selected: null,
			loading: false,
			errorInfoList: [],
			invoiceSelectedIds: '',
			invoiceTotal: {
				total: 0,
				totalAmountTotal: 0,
				currentContractSplitedAmountTotal: 0
			},
			allTotal: {
				taxExcludedAmountTotal: 0,
				totalAmountTotal: 0,
				currentContractSplitedAmountTotal: 0
			}, // 选中的总统计数据
			currentIndex: '', // 当前操作发票的index
			currentInvoiceType: '' // 当前操作发票的类型
		};
	},
	props: {
		orderNo: {
			type: String,
			default: () => {
				return '';
			}
		},
		fromType: {
			type: String,
			default: () => {
				return 'add';
			}
		},
	},
	watch: {
		selectedRows: function (data) {
			this.computedTotal();
		}
	},
	computed: {
		columns() {
			return this.transColumns;
		},
		columns2() {
			return this.transColumnsDrawer;
		},
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'checkbox',
				selectedRowKeys: this.selectedRows.map(i => i.id),
				getCheckboxProps: record => ({
					props: {
						disabled: ['INVALID', 'RED_DASHED'].includes(record.state),
						defaultChecked: this.invoiceSelectedIds?.split(',').includes(record.id)
					}
				}),
				onSelect: (record, selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						this.selectedRows = this.selectedRows.filter(o => o.id != record.id);
					}
				},
				onSelectAll: (selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						this.selectedRows = [];
					}
				}
			};
		},
		statisticsList() {
			if (this.transInvoiceListSelect.length === 0) {
				// 无发票
				return [];
			}
			// 统计信息
			// 发票数量
			let totalCount = this.transInvoiceListSelect.length;
			// 不含税金额合计
			let totalTaxExcludedAmount = 0;
			// 价税合计
			let totalAmount = 0;
			// 拆分至本合同金额
			let totalCurrentContractSplitedAmount = 0;
			this.transInvoiceListSelect.forEach(item => {
				totalTaxExcludedAmount += Number(item.taxExcludedAmount || 0);
				totalAmount += Number(item.totalAmount || 0);
				totalCurrentContractSplitedAmount += Number(item.currentContractSplitedAmount || 0);
			});
			return [
				{
					title: '发票数量',
					value: totalCount,
					unit: '张' // 单位
				},
				{
					title: '发票金额合计',
					value: totalTaxExcludedAmount,
					tip: '不含税', // 说明
					isMonetary: true // 是否是货币单位
				},
				{
					title: '价税合计',
					value: totalAmount,
					isMonetary: true // 是否是货币单位
				},
				{
					title: '拆分至本合同金额',
					value: totalCurrentContractSplitedAmount,
					tip: '含税', // 说明
					isMonetary: true // 是否是货币单位
				}
			];
		},
	},
	mounted() {},
	components: {
		SlFormNew,
		iPagination,
		ErrorModal,
		ConfirmModal,
		TableStatisticalInfo
	},
	methods: {
		edit(data) {
			this.transInvoiceListSelect = data;
			const selectIds = [];
			this.transInvoiceListSelect.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');
		},
		jumpPage(path, query) {
			let routeUrl = this.$router.resolve({
				path,
				query
			});
			window.open(routeUrl.href, '_blank');
		},
		deleteInvoice(record, index, type) {
			this.currentInvoiceType = type;
			this.currentIndex = index;
			const modalObj = {
				modalTitle: '确认删除',
				modalText: '本次付款确定不使用该发票吗？',
				modalTextNext: '注：本操作不会删除发票，仅在本次付款时不展示发票'
			};
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			this.transInvoiceListSelect.splice(this.currentIndex, 1);
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			this.params.pageNo = this.pagination.pageNo;
			this.params.pageSize = this.pagination.pageSize;
			this.getList(this.params);
		},
		async getList(data) {
			this.loading = true;
			this.selectedRowKeys = [];
			this.selected = {};
			this.params = {
				...data,
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType
			};
			this.pagination.pageNo = data?.pageNo || 1;
			const res = await API_PaymentCreateInvoice({
				...this.params
			}).finally(() => {
				this.loading = false;
			});
			if (!res.success) return;
			this.loading = false;
			this.transInvoiceList = this.$route.query.productCode === 'WAREHOUSE_RENT' ? (res.data?.storeInvoiceRecordVOList || []) : (res.data?.transInvoiceList || []);
			this.pagination.total = res.data.total;
			this.invoiceList = this.transInvoiceList;
		},
		relationInvoice() {
			this.isShowModal = true;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.params = {};
			this.signTime = null;
			this.pagination = {
				current: 1
			};
			this.selectedRows = [];
			this.selectedRowKeys = [];
			this.getList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		onClose() {
			this.isShowModal = false;
		},
		handleSubmit() {
			this.onClose();
		},
		async confirmCheck() {
			if (!this.selectedRows.length) {
				return;
			}
			const invoiceIdList = this.selectedRows.map(el => el.id);
			const params = {
				invoiceIdList: invoiceIdList
			};
			const errRes = await payCheckInvoice(params);
			if (errRes.data && errRes.data.length) {
				this.errorInfoList = errRes.data;
				this.$refs.errorModal2.open();
			} else {
				const target = this.transInvoiceListSelect;
				const result = target.find(item => item.name === 'John');
				this.selectedRows.forEach(item => {
					const result = target.find(pro => pro.id === item.id);
					if (!result) {
						target.push(item);
					}
				});
				this.modalInvoiceFormSubmit();
			}
		},
		modalInvoiceFormSubmit() {
			// 插入发票选中数据
			this.isShowModal = false;
			this.getInvoiceIds();
		},
		async getInvoiceIds() {
			const selectIds = [];
			this.transInvoiceListSelect.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');
		},

		save() {
			if (!this.invoiceSelectedIds.length) {
				this.$message.error('请选择发票');
				return false;
			} else {
				return this.invoiceSelectedIds;
			}
		},
		addInvoice() {
			const path = this.$route.query.productCode === 'WAREHOUSE_RENT' ? '/center/logisticSupervise/invoice/buy/add' : '/center/logisticSupervise/invoice/freight/add';
			const query = {
				type: this.$route.query.productCode === 'WAREHOUSE_RENT' ? 'buy' : 'freight',
			};
			this.jumpPage(path, query);
		},
		invoiceDetail(record) {
			const path = this.$route.query.productCode === 'WAREHOUSE_RENT' ?  '/center/logisticSupervise/invoice/buy/detail' : '/center/logisticSupervise/invoice/freight/detail';
			const query = {
				id: record.id,
				no: record.no,
				type: 'detail',
				invoiceType: this.$route.query.productCode === 'WAREHOUSE_RENT' ? 'buy' : 'freight',
				industryType: 'COAL'
			};
			this.jumpPage(path, query);
		},
		computedTotal() {
			this.invoiceTotal.total = this.selectedRows.length;
			if (!this.selectedRows.length) return;
			this.invoiceTotal.totalAmountTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.totalAmount) || 0);
			}, 0);
			this.invoiceTotal.currentContractSplitedAmountTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.currentContractSplitedAmount) || 0);
			}, 0);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 50px;
	margin-bottom: 20px;
}
.new-table {
	margin-top: 20px;
	::v-deep.ant-table-selection-column {
		width: 30px !important;
		.ant-table-header-column {
			width: 30px !important;
		}
	}
}
.totalRowBox {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}
.totalRow {
	display: flex;
	justify-content: flex-end;
	span {
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: rgba(119, 136, 157, 1);
		display: inline-block;
		em {
			display: inline-block;
			margin-left: 10px;
			font-style: normal;
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;
			line-height: 26px;
			text-align: left;
			color: rgba(244, 99, 50, 1);
		}
	}
}
.remindTips {
	color: rgba(255, 128, 15, 1);
	font-size: 14px;
	zoom: 0.85;
	line-height: 24px;
	margin-top: 5px;
}
.relBtn {
	margin-left: 30px;
}
.addBtn {
	margin-left: 20px;
	font-size: 14px;
	line-height: 26px;
}
.invoice-status {
	display: inline-block;
	border-radius: 4px;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	text-align: center;
	.text {
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -1px;
	}
}
.RED_DASHED {
	background: #ffdbdb;
	color: #dd4444;
}
.NORMAL {
	background: #c5ecdd;
	color: #3eb384;
}
.INVALID {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
</style>
