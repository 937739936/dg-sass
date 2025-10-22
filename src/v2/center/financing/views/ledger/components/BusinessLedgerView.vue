<template>
	<div class="business-ledger-view">
		<div>
			<a-row
				type="flex"
				:gutter="[20, 20]"
				style="margin-bottom: 10px"
			>
				<a-col>
					<a-tooltip placement="top">
						<template
							v-if="summaryValue('loanAmount').tip"
							slot="title"
						>
							<span>{{ summaryValue('loanAmount').tip }}</span>
						</template>
						<div
							class="count-item"
							:style="{ backgroundColor: '#F0F8FF' }"
						>
							<div class="count-title">放款金额(元)</div>
							<div class="money-text">{{ summaryValue('loanAmount').money }}</div>
						</div>
					</a-tooltip>
				</a-col>
				<a-col>
					<a-tooltip placement="top">
						<template
							v-if="summaryValue('repayAmount').tip"
							slot="title"
						>
							<span>{{ summaryValue('repayAmount').tip }}</span>
						</template>
						<div
							class="count-item"
							:style="{ backgroundColor: '#EBFAEF' }"
						>
							<div class="count-title">还款金额(元)</div>
							<div class="money-text">{{ summaryValue('repayAmount').money }}</div>
						</div>
					</a-tooltip>
				</a-col>
				<a-col>
					<a-tooltip placement="top">
						<template
							v-if="summaryValue('totalInterest').tip"
							slot="title"
						>
							<span>{{ summaryValue('totalInterest').tip }}</span>
						</template>
						<div
							class="count-item"
							:style="{ backgroundColor: '#FFF9F0' }"
						>
							<div class="count-title">利息总额(元)</div>
							<div class="money-text">{{ summaryValue('totalInterest').money }}</div>
						</div>
					</a-tooltip>
				</a-col>
			</a-row>
		</div>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				:dataSource="mergeCellDataSource"
				:rowKey="(record, index) => record.id + index.toString()"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template slot="totalInterestTitle">
					<span>利息总额(元) </span>
					<a-tooltip placement="top">
						<template slot="title">
							<span> 已放款状态数据计算逻辑：放款金额*融资利率*【（当前系统日期-融资开始日）/360】 </span>
							<br />
							<span>
								部分还款和已结清状态数据计算逻辑：已还本金对应的利息+未还本金*融资利率*【（当前系统日期-融资开始日）/360】
							</span>
						</template>
						<img
							class="tip-icon"
							src="@/v2/assets/imgs/common/column_title_tip.png"
							alt=""
						/>
					</a-tooltip>
				</template>
				<template slot="totalAmountTitle">
					<span>利息+手续费合计(元) </span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>计算逻辑：利息总额+保理融资手续费（实时数据）</span>
						</template>
						<img
							class="tip-icon"
							src="@/v2/assets/imgs/common/column_title_tip.png"
							alt=""
						/>
					</a-tooltip>
				</template>
				<template slot="actualTermTitle">
					<span>实际期限(天) </span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>已结清数据计算逻辑：最后一笔的实际还款日期-放款日期 </span>
							<br />
							<span> 部分还款和已放款数据计算逻辑：当前日期-放款日期 </span>
						</template>
						<img
							class="tip-icon"
							src="@/v2/assets/imgs/common/column_title_tip.png"
							alt=""
						/>
					</a-tooltip>
				</template>
				<template
					slot="indexNumber"
					slot-scope="text, record, index"
				>
					<span>{{ (pagination.pageNo - 1) * pagination.pageSize + Number(index) + 1 }}</span>
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
// import { API_getReceiptList } from '@/v2/center/trade/api/newLading';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/globalCode.js';
import { API_LedgerBusinessList } from '@/v2/center/financing/api/index';

export default {
	name: 'BusinessLedgerView',
	mixins: [ListMixin],
	props: {
		// 更新日期
		date: {
			type: String,
			required: true
		},
		summaryData: {
			type: Object,
			default: () => ({
				loanAmount: 0, // 放款金额
				totalInterest: 0, // 利息总额
				repayAmount: 0 // 还款金额
			})
		}
	},
	data() {
		return {
			columns: [],
			loading: false,
			url: {
				list: API_LedgerBusinessList
			},
			defaultParams: {
				date: this.date
			}
		};
	},
	mounted() {
		this.configColumns();
	},
	watch: {
		date: {
			handler(val) {
				this.defaultParams.date = val;
				// this.getData();
			},
			deep: true
		}
	},
	computed: {
		// 合并单元格数据列表
		mergeCellDataSource() {
			let dataSource = this.dataSource ?? [];
			let mergeCellList = [];
			dataSource.forEach((item, index) => {
				// 还款列表
				let oneContractRepayList = [];
				// 拟转让应收账款金额列表
				let planAmountList = item.planAmountList ?? [];
				if (planAmountList.length == 0) {
					let mergeCell = {
						...item,
						contractRowSpan: 1, // 合同信息合并单元格
						planAmountRowSpan: 1, // 拟转让应收账款金额合并单元格
						loanRowSpan: 1, // 放款信息合并单元格
						contractRepayIndex: oneContractRepayList.length
					};
					oneContractRepayList.push(mergeCell);
					mergeCellList.push(...oneContractRepayList);
					return;
				}
				delete item.planAmountList;

				planAmountList.forEach(planAmountItem => {
					// 放款列表
					let loanLedgerList = planAmountItem.loanLedgerList ?? [];
					if (loanLedgerList.length == 0) {
						let mergeCell = {
							...item,
							...planAmountItem,
							contractRowSpan: 0,
							planAmountRowSpan: 1,
							loanRowSpan: 1,
							contractRepayIndex: oneContractRepayList.length
						};
						oneContractRepayList.push(mergeCell);
						return;
					}
					delete planAmountItem.loanLedgerList;
					// 一个对应的列表
					let onePlanAmountList = [];
					loanLedgerList.forEach(loanItem => {
						let repayLedgerList = loanItem.repayLedgerList ?? [];
						if (repayLedgerList.length == 0) {
							let mergeCell = {
								...item,
								...planAmountItem,
								...loanItem,
								contractRowSpan: 0,
								planAmountRowSpan: 0,
								loanRowSpan: 1,
								contractRepayIndex: oneContractRepayList.length
							};
							onePlanAmountList.push(mergeCell);
							return;
						}
						delete loanItem.repayLedgerList;
						// 一个放款款对应的列表
						let oneLoanList = [];
						// 还款列表遍历
						repayLedgerList.forEach(repayItem => {
							let mergeCell = {
								...item,
								...planAmountItem,
								...loanItem,
								...repayItem,
								contractRowSpan: 0,
								planAmountRowSpan: 0,
								loanRowSpan: 0,
								contractRepayIndex: oneContractRepayList.length
							};
							oneLoanList.push(mergeCell);
						});
						// 确定当前放款信息合并单元格的rowSpan
						let firstRepayItem = oneLoanList[0];
						firstRepayItem.loanRowSpan = oneLoanList.length;
						oneLoanList[0] = firstRepayItem;
						onePlanAmountList.push(...oneLoanList);
					});
					// 确定当前拟转让应收账款金额合并单元格的rowSpan
					let firstRepayItem = onePlanAmountList[0];
					firstRepayItem.planAmountRowSpan = onePlanAmountList.length;
					onePlanAmountList[0] = firstRepayItem;
					oneContractRepayList.push(...onePlanAmountList);
				});
				// 确定当前合同信息合并单元格的rowSpan
				let firstRepayItem = oneContractRepayList[0];
				firstRepayItem.indexNumber = (this.pagination.pageNo - 1) * this.pagination.pageSize + Number(index) + 1;
				firstRepayItem.contractRowSpan = oneContractRepayList.length;
				oneContractRepayList[0] = firstRepayItem;
				mergeCellList.push(...oneContractRepayList);
			});
			return mergeCellList;
		}
	},
	methods: {
		formatMoney,
		convertCurrency,
		summaryValue(value) {
			let money = '-';
			let tip = '';
			if (this.summaryData) {
				let val = this.summaryData[value];
				if (val !== null && val !== undefined && val !== '') {
					money = formatMoney(val);
					tip = convertCurrency(val);
					if (money == '0' || money == 0) {
						money = '0';
						tip = '零元整';
					}
				}
			}
			return {
				money,
				tip
			};
		},
		refreshData() {
			this.$nextTick(() => {
				this.getList();
			});
		},
		configColumns() {
			const columns = [
				{
					title: '序号',
					dataIndex: 'indexNumber',
					// scopedSlots: { customRender: 'indexNumber' },
					// fixed: 'left',
					customRender: customRenderContractInfo
				},
				{
					title: '合同信息',
					children: [
						{
							title: '保理合同编号',
							dataIndex: 'contractNo',
							customRender: customRenderContractInfo
						},
						{
							title: '合同签订日',
							dataIndex: 'contractSignDate',
							customRender: customRenderContractInfo
						},
						{
							title: '合同到期日',
							dataIndex: 'contractExpireDate',
							customRender: customRenderContractInfo
						},
						{
							title: '应收账款债权人(转让)',
							dataIndex: 'creditor',
							customRender: customRenderContractInfo
						},
						{
							title: '应收账款债务人(确权)',
							dataIndex: 'debtor',
							customRender: customRenderContractInfo
						},
						{
							title: '拟转让应收账款金额(元)',
							dataIndex: 'planFinancingAmount',
							// scopedSlots: { customRender: 'moneyRender' }
							customRender: this.customRenderPlanAmountMoney
						},
						{
							title: '保理融资金额(元)',
							dataIndex: 'financingAmount',
							customRender: this.customRenderLoanInfoMoney
						},
						{
							title: '期限(个月)',
							dataIndex: 'term',
							customRender: customRenderLoanInfo
						},
						{
							title: '利率(%)',
							dataIndex: 'rate',
							customRender: customRenderLoanInfo
						},
						{
							title: '手续费率(%)',
							dataIndex: 'serviceChargeRate',
							customRender: customRenderLoanInfo
						}
					]
				},
				{
					title: '资金和收益情况',
					children: [
						{
							title: '融资到期日',
							dataIndex: 'endDate',
							customRender: customRenderLoanInfo
						},
						{
							title: '放款日期',
							dataIndex: 'loanDate',
							customRender: customRenderLoanInfo
						},
						{
							title: '放款金额(元)',
							dataIndex: 'loanAmount',
							customRender: this.customRenderLoanInfoMoney
						},
						{
							// title: '利息总额(元)',
							dataIndex: 'totalInterest',
							slots: { title: 'totalInterestTitle' },
							customRender: this.customRenderLoanInfoMoney
						},
						{
							title: '保理融资手续费(元)',
							dataIndex: 'serviceCharge',
							customRender: this.customRenderLoanInfoMoney
						},
						{
							// title: '利息+手续费合计(元)',
							dataIndex: 'totalAmount',
							slots: { title: 'totalAmountTitle' },
							customRender: this.customRenderLoanInfoMoney
						}
					]
				},
				{
					title: '款项回收情况',
					children: [
						{
							title: '本金还款日',
							dataIndex: 'principalRepayDate',
							customRender: customRenderRepayInfo
						},
						{
							title: '还款金额(元)',
							dataIndex: 'repayAmount',
							customRender: this.customRenderRepayInfoMoney
						},
						{
							// title: '实际期限(天)',
							dataIndex: 'actualTerm',
							slots: { title: 'actualTermTitle' },
							customRender: customRenderLoanInfo
						},
						{
							title: '利息+手续费合计(元)',
							dataIndex: 'totalAmountAfterRepay',
							customRender: this.customRenderRepayInfoMoney
						}
					]
				}
			];
			this.columns = columns;
		},
		moneyColumn(text) {
			let children = text;
			if (text !== null && text !== undefined && text !== '') {
				let money = formatMoney(text);
				let tip = convertCurrency(text);
				if (money == '0' || money == 0) {
					tip = '零元整';
				}
				children = (
					<a-tooltip placement="top">
						<template slot="title">
							<span>{tip}</span>
						</template>
						<span>{money}</span>
					</a-tooltip>
				);
			} else {
				children = '-';
			}
			return children;
		},
		// 放款条目
		customRenderPlanAmountMoney(text, record) {
			let children = this.moneyColumn(text);
			const obj = {
				children: children,
				attrs: {
					rowSpan: record.planAmountRowSpan
				}
			};
			return obj;
		},
		// 放款 金钱相关条目
		customRenderLoanInfoMoney(text, record) {
			let children = this.moneyColumn(text);
			const obj = {
				children: children,
				attrs: {
					rowSpan: record.loanRowSpan
				}
			};
			return obj;
		},
		// 还款 金钱相关条目
		customRenderRepayInfoMoney(text) {
			let children = this.moneyColumn(text);
			return children;
		}
	}
};

const customRenderContractInfo = (text, record) => {
	let children = text;
	if (children == 0) {
		children = '0';
	} else {
		children = text || '-';
	}
	const obj = {
		children: children,
		attrs: {
			rowSpan: record.contractRowSpan
		}
	};
	return obj;
};

// 放款条目
const customRenderLoanInfo = (text, record) => {
	let children = text;
	if (children == 0) {
		children = '0';
	} else {
		children = text || '-';
	}
	const obj = {
		children: children,
		attrs: {
			rowSpan: record.loanRowSpan
		}
	};
	return obj;
};
// 还款条目
const customRenderRepayInfo = text => {
	let children = text;
	if (children == 0) {
		children = '0';
	} else {
		children = text || '-';
	}
	return children;
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.business-ledger-view {
	.new-table,
	.new-table-file {
		// /deep/ .ant-table-fixed {
		// 	.ant-table-thead > tr > th {
		// 		margin-top: 1px;
		// 	}
		// }
		/deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
			background-color: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover > td {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover > td {
			background: #fff !important;
		}
		/deep/ .ant-table-thead > tr > th {
			// border: 1px solid #e5e6eb;
			border-top: none;
			border-top: 1px solid #e5e6eb;
			// border-left: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-thead > tr > th:last-child {
			border-right: none;
		}
		/deep/ .ant-table-thead > tr > th:first-child {
			border-radius: 0;
		}
		/deep/ .ant-table-thead > tr > th:last-child {
			border-radius: 0;
		}
		/deep/ .ant-table-thead > tr:first-child {
			th {
				border-top: 1px solid #e5e6eb;
			}
			th:first-child {
				border-radius: 4px 0 0 0;
			}
			th:last-child {
				border-radius: 0 4px 0 0;
			}
		}
		/deep/ .ant-table-tbody > tr:nth-child(2n) {
			background: none;
		}
		/deep/ .ant-table-tbody > tr > td {
			border-bottom: 1px solid #e5e6eb;
			// border-left: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-tbody > tr > td:last-child {
			border-right: none;
		}
		/deep/ .ant-table-tbody > tr:last-child {
			td:first-child {
				border-radius: 0;
			}
			td:last-child {
				border-radius: none;
			}
		}
	}
	.new-table {
		/deep/ .ant-table {
			td,
			th {
				white-space: nowrap;
			}
		}
		::v-deep {
			.ant-table-fixed-left {
				.ant-table-tbody > tr > td {
					border-left: none;
				}
				// .ant-table-thead > tr {
				// 	// border-top: 1px solid #e5e6eb;
				// 	height: 84px !important;
				// }
			}
		}
	}
}
</style>
<style lang="less" scoped>
.business-ledger-view {
	padding: 20px 0;
	width: 100%;
	height: 100%;
	.count-item {
		border-radius: 6px;
		min-height: 88px;
		width: 306px;
		padding: 14px 12px;
		.count-title {
			font-size: 14px;
			color: #00000066;
		}
		.money-text {
			font-size: 20px;
			font-weight: 500;
			color: #000000cc;
			margin-top: 12px;
		}
	}
	.tip-icon {
		width: 12px;
		height: 12px;
		margin-bottom: 4px;
		// line-height: 21px;
	}
}
</style>