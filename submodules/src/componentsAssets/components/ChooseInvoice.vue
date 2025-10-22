<template>
	<a-drawer
		class="slDrawer"
		placement="right"
		:visible="visible"
		@ok="okInc"
		@close="onClose"
		:footer="null"
		destroyOnClose
	>
		<template slot="title">
			<a-space :size="20">
				<span>关联发票</span>
				<!-- 来源是 新增应收账款 发票 -->
				<span
					@click="addInvo"
					class="titleAddInvoice"
				>
					<a-space :size="4"> <a-icon type="plus-circle" />新增贸易发票 </a-space>
				</span>
			</a-space>
		</template>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="changeFormSearch"
			:isShowIcon="false"
			:isShowSearchBox="true"
			:colSpan="8"
		></SlFormNew>
		<Tab
			:statusData="[
				{ value: '0', label: '未使用发票' },
				{ value: '1', label: '已关联融资发票' }
			]"
			:currentStatus="defaultParams.used"
			@callback="e => (defaultParams.used = e)"
		></Tab>
		<!-- 表格 -->
		<div class="table-box">
			<a-table
				class="new-table"
				:bordered="false"
				:scroll="{ x: true }"
				rowKey="id"
				:customRow="onClickRow"
				:rowSelection="rowSelection"
				:dataSource="dataSource"
				:columns="invoiceColumns"
				:pagination="false"
				:loading="loading"
			>
				<template
					slot="assetNos"
					slot-scope="assetNos"
				>
					<a-tooltip>
						<template slot="title">
							{{ assetNos }}
						</template>
						<span class="assetNos">{{ assetNos }}</span>
					</a-tooltip>
				</template>
				<span
					slot="amount"
					slot-scope="amount"
					v-mainTip="convertCurrency(amount)"
				>
					{{ formatMoney(amount) }}
				</span>
			</a-table>
			<a-row
				type="flex"
				class="select"
			>
				<a-col flex="auto">
					发票总数：<span class="selectAll">{{ selectedRowKeys.length }}张</span>
				</a-col>
				<a-col flex="none">
					<a-space :size="20">
						<div>
							<a-space :size="10">
								价税合计<span
									class="number"
									v-mainTip="convertCurrency(invoiceCount.totalAmount)"
									>¥{{ formatMoney(invoiceCount.totalAmount) }}</span
								>
							</a-space>
						</div>
						<div>
							<a-space :size="10">
								归属价税合计<span
									class="number"
									v-mainTip="convertCurrency(invoiceCount.splitAmount)"
									>¥{{ formatMoney(invoiceCount.splitAmount) }}</span
								>
							</a-space>
						</div>
					</a-space>
				</a-col>
			</a-row>
		</div>
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
					@click="okInc"
					>确定</a-button
				>
			</a-space>
		</div>
	</a-drawer>
</template>
<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/factory';
import Tab from './Tab.vue';
const searchList = [
	{
		decorator: ['code'],
		addonBeforeTitle: '发票代码',
		type: 'input',
		placeholder: '请输入发票代码'
	},
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
		realKey: ['issuedDateBegin', 'issuedDateEnd']
	}
];
const defaultInvoiceColumns = [
	{ title: '发票代码', dataIndex: 'code', key: 'code' },
	{ title: '发票号码', dataIndex: 'no', key: 'no' },
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		key: 'issuedDate'
	},
	{
		title: '不含税金额(元)',
		dataIndex: 'taxExcludedAmount',
		scopedSlots: { customRender: 'amount' }
	},
	{
		title: '税额(元)',
		dataIndex: 'taxAmount',
		scopedSlots: { customRender: 'amount' }
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		scopedSlots: { customRender: 'amount' }
	},
	{
		title: '归属价税合计(元)',
		dataIndex: 'splitAmount',
		scopedSlots: { customRender: 'amount' }
	}
];
export default {
	name: 'ChooseInvoice',
	components: { SlFormNew, Tab },
	props: {
		selectFinancedInvoice: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	inject: {
		getInvoiceListParent: { form: 'getInvoiceListParent', default: null },
		orderNoParent: { form: 'orderNoParent', default: null },
		detailDataReceivalVO: { form: 'detailDataReceivalVO', default: null },
		getBankProductItemParnet: { form: 'getBankProductItemParnet', default: null }
	},
	data() {
		return {
			visible: false,
			formatMoney,
			convertCurrency,
			searchList,
			searchParams: {}, //查询参数
			loading: false,
			defaultParams: {
				used: '0'
			},
			contractId: '',
			orderNo: '',
			contractType: '',
			selectedRowKeys: [],
			selectedRowKeysOne: [],
			selectedRowKeysTwo: [],
			dataSource: [], //表格数据
			selectFinanced: false // 是否可以选择已融资
		};
	},
	computed: {
		// 表头
		invoiceColumns() {
			// 暂时处理成一样的，有不同的字段下次区分
			if (this.defaultParams.used === '0') {
				return defaultInvoiceColumns;
			} else {
				return [
					{ title: '资产编号', dataIndex: 'assetNos', scopedSlots: { customRender: 'assetNos' } },
					{ title: '融资编号', dataIndex: 'financingNos', scopedSlots: { customRender: 'assetNos' } },
					...defaultInvoiceColumns
				];
			}
		},
		// 选中项
		rowSelection() {
			const t = this;
			// 如果是为选中或是可以选中已关联融资
			if (this.defaultParams.used === '0' || this.selectFinanced) {
				return {
					type: 'checkbox',
					selectedRowKeys: t.selectedRowKeys.map(item => item.id),
					onChange(selectedRowKeys, selectedRows) {
						if (t.defaultParams.used === '0') {
							t.selectedRowKeysOne = selectedRows;
						} else {
							t.selectedRowKeysTwo = selectedRows;
						}
						t.selectedRowKeys = [...t.selectedRowKeysOne, ...t.selectedRowKeysTwo];
					}
				};
			} else {
				return null;
			}
		},
		// 选中发票信息统计
		invoiceCount() {
			let totalAmount = 0;
			let splitAmount = 0;
			this.selectedRowKeys.forEach(item => {
				totalAmount += item.totalAmount || 0;
				splitAmount += item.splitAmount || 0;
			});
			let invoiceCount = { totalAmount, splitAmount };
			return invoiceCount;
		}
	},
	watch: {
		defaultParams: {
			deep: true,
			handler() {
				this.getList();
			}
		},
		dataSource: {
			deep: true,
			immediate: true,
			handler(data) {
				// 如果有数据，并且有选中，进行选中区分
				if (this.defaultParams.used === '0') {
					this.selectedRowKeysOne = this.selectedRowKeys.filter(item => data.some(items => items.id === item.id));
					this.selectedRowKeysTwo = this.selectedRowKeys.filter(item => !data.some(items => items.id === item.id));
				} else {
					this.selectedRowKeysOne = this.selectedRowKeys.filter(item => !data.some(items => items.id === item.id));
					this.selectedRowKeysTwo = this.selectedRowKeys.filter(item => data.some(items => items.id === item.id));
				}
			}
		},
		selectFinancedInvoice: {
			deep: true,
			immediate: true,
			handler(data) {
				this.selectFinanced = data;
			}
		}
	},
	methods: {
		onClickRow(record, index) {
			return {
				on: {
					click: () => {
						if (this.defaultParams.used === '0' || this.selectFinanced) {
							let key = record.id;
							if (this.selectedRowKeys.some(item => item.id === key)) {
								this.selectedRowKeys = this.selectedRowKeys.filter(item => item.id !== key);
							} else {
								this.selectedRowKeys.push(record);
							}
						}
					}
				}
			};
		},
		// 确认选择
		changeFormSearch(data) {
			this.changeSearch(data);
		},
		//表单数据发生变化
		changeSearch(data) {
			this.searchParams = data;
			this.getList();
		},
		async getList() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			if (this.contractId) {
				params.contractId = this.contractId;
			}
			if (this.contractType) {
				params.contractType = this.contractType;
			}
			this.loading = true;
			try {
				this.dataSource = await this.getInvoiceListParent(params);
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		async resetValues() {
			this.dataSource = [];
			await this.getList();
		},
		addInvo() {
			this.visible = false;
			const { href } = this.$router.resolve({
				path: `/center/invoice/buy/add`,
				query: {
					type: 'buy',
					orderNo: this.orderNo || this.orderNoParent ? this.orderNoParent() : ''
				}
			});
			window.open(href, '_new');
		},
		async show(params) {
			this.visible = true;
			if (params?.selectedRowKeys) {
				this.selectedRowKeys = params?.selectedRowKeys;
			}
			if (params?.contractId) {
				this.contractId = params?.contractId;
			}
			if (params?.contractType) {
				this.contractType = params?.contractType;
			}
			if (params?.orderNo) {
				this.orderNo = params?.orderNo;
			}
			// 获取资金获取最新的配置
			let paymentType = this.detailDataReceivalVO?.paymentType;
			if (this.getBankProductItemParnet && paymentType) {
				let res = await this.getBankProductItemParnet({ source: paymentType });
				if (res.success) {
					this.selectFinanced = Boolean(res.data.selectFinancedInvoice);
				}
			}
			this.resetValues();
		},
		okInc() {
			this.$emit('chooseFinInvo', this.selectedRowKeys);
			this.onClose();
		},
		onClose() {
			this.visible = false;
			this.selectedRowKeys = [];
			this.searchParams = {};
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.slDrawer {
	/deep/ .table-box .new-table .ant-table-thead > tr > th:first-child {
		padding: 12px;
	}
	/deep/ .table-box .new-table .ant-table-tbody > tr > td:first-child {
		padding: 12px !important;
	}
	.titleAddInvoice {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 14px;
		color: @primary-color;
		cursor: pointer;
	}
	.assetNos {
		display: inline-block;
		max-width: 130px;
		white-space: nowrap;
		overflow: hidden; //文本超出隐藏
		text-overflow: ellipsis; //文本超出省略号替代
	}
	.select {
		margin: 20px 0;
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: #77889d;
		.selectAll {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			color: #000000;
		}
		.number {
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;

			font-size: 18px;
			color: #f46332;
		}
	}
}
</style>
