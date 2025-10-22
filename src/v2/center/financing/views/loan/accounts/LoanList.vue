<template>
	<div class="s-card">
		<div class="s-card-title">放还款管理</div>
		<!--供应商-->
		<div class="divider"></div>
		<div
			class="s-card-content"
			style="margin-top: 14px"
		>
			<a-form layout="inline">
				<a-row>
					<a-col span="8">
						<a-form-item
							label="融资编号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入融资编号"
								v-model="params.financingApplySerialNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="出资机构"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								v-model="params.bankName"
								placeholder="请输入出资机构"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="核心企业"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入核心企业"
								v-model="params.buyerName"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="合同编号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入合同编号"
								v-model="params.contractNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="应收账款流水号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入应收账款流水号"
								v-model="params.receivableSerialNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="融资金额"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入"
								v-model="params.amountBegin"
								style="width: 100px"
							></a-input>
							<span> ~ </span>
							<a-input
								placeholder="请输入"
								v-model="params.amountEnd"
								style="width: 100px"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="融资状态"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-select
								v-model="params.status"
								:getPopupContainer="getPopupContainer"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in statusData"
									:key="index"
									:value="items.value"
								>
									{{ items.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="融资放款日期"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-range-picker
								v-model="params.time1"
								:getCalendarContainer="getPopupContainer"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTime"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="融资到期日期"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-range-picker
								v-model="params.time2"
								:getCalendarContainer="getPopupContainer"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTimeEnd"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="行业"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-select
								placeholder="请选择行业"
								v-model="params.industryType"
							>
								<a-select-option
									key="COAL"
									value="COAL"
									>煤炭</a-select-option
								>
								<a-select-option
									key="STEEL"
									value="STEEL"
									>钢材</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item style="text-align: center">
							<a-button
								type="primary"
								@click="searchSubmit"
								class="search-btn"
								style="margin-right: 16px"
							>
								查询
							</a-button>
							<a-button
								type="primary"
								@click="resetValues"
								:ghost="true"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="top-nav">
				<div
					:class="{ active: item.status == status, 'nav-item': true }"
					@click="changeTab(item)"
					v-for="(item, index) in tabList"
					:key="index"
				>
					{{ item.name }} {{ item.count }}
				</div>
			</div>
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="accountReceivableList"
				:scroll="{ x: true }"
				rowKey="id"
				style="margin-top: 22px"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space v-if="status">
						<a
							v-auth="'finance:repayS:view'"
							href="javascript:;"
							@click="$router.push('loanDetail?id=' + record.loanId + '')"
							>查看</a
						>
						<a
							v-auth="'finance:repayS:confirm'"
							v-if="status"
							href="javascript:;"
							@click="$router.push('loanReceipt?id=' + record.applyId + '')"
							>收款确认</a
						>
						<a
							v-auth="'finance:repayS:record'"
							v-if="record.status != 'INVALID'"
							href="javascript:;"
							@click="$router.push('loanDetail?id=' + record.loanId + '&tab=2')"
							>还款记录({{ record.countRepayApply || 0 }})</a
						>
					</a-space>
					<a-space v-if="!status">
						<a
							v-auth="'finance:repayS:view'"
							href="javascript:;"
							@click="$router.push('loanDetail?id=' + record.id + '')"
							>查看</a
						>
						<a
							v-auth="'finance:repayS:record'"
							v-if="record.status != 'INVALID'"
							href="javascript:;"
							@click="$router.push('loanDetail?id=' + record.id + '&tab=2')"
							>还款记录({{ record.countRepayApply || 0 }})</a
						>
					</a-space>
				</div>
				<div
					slot="status"
					slot-scope="text, record"
				>
					<FinancingTipInfo :item="record" />
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getLoanList"
			/>
		</div>
	</div>
</template>
<script>
const columns = [
	{ title: '融资编号', fixed: 'left', dataIndex: 'financingApplySerialNo', key: 'financingApplySerialNo' },
	// { title: '融资方', dataIndex: 'sellerName', key: 'sellerName'},
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '融资金额（元）', dataIndex: 'amount', key: 'amount', align: 'right' },
	{ title: '放款金额（元）', dataIndex: 'finAmount', key: 'finAmount', align: 'right' },
	{ title: '融资放款日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '最近还款日期', dataIndex: 'repayDate', key: 'repayDate' },
	{ title: '已还本金', dataIndex: 'repayPrincipal', key: 'repayPrincipal' },
	{ title: '已还利息', dataIndex: 'repayInterest', key: 'repayInterest' },
	{
		title: '未还本金',
		dataIndex: 'repayPrincipal1',
		key: 'repayPrincipal1',
		customRender: (v, r) => (r.finAmount - r.repayPrincipal).toFixed(2)
	},
	{ title: '应收账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	// { title: '应收账款金额（元）', dataIndex: 'receivableAmount', key: 'receivableAmount',align:'right'},
	{ title: '融资类型', dataIndex: 'financingTypeText', key: 'financingTypeText' },
	{ title: '付款流水号', dataIndex: 'paymentSerialNo', key: 'paymentSerialNo' },
	{ title: '状态', fixed: 'right', dataIndex: 'statusText', key: 'statusText', scopedSlots: { customRender: 'status' } },
	{ title: '行业', dataIndex: 'industryTypeDesc', fixed: 'right', key: 'industryTypeDesc' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const columnsShou = [
	{ title: '融资编号', fixed: 'left', dataIndex: 'financingApplySerialNo', key: 'financingApplySerialNo' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '买方企业', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '本次还款金额（元）', dataIndex: 'repayPrincipal', key: 'repayPrincipal' },
	{ title: '还款日期', dataIndex: 'repayDate', key: 'repayDate' },
	{ title: '还款申请时间', dataIndex: 'createDate', key: 'createDate' },
	{ title: '还款申请编号', dataIndex: 'repayApplySerialNo', key: 'repayApplySerialNo' },
	{ title: '还款申请状态', fixed: 'right', dataIndex: 'statusText', key: 'statusText' },
	{ title: '行业', dataIndex: 'industryTypeDesc', fixed: 'right', key: 'industryTypeDesc' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
import {
	API_GetLoanList,
	API_GetLoanListConfirm,
	API_FinancingbankList,
	API_GetLoanListAdvanceMAINCOUNT
} from '@/v2/center/financing/api/index.js';
import iPagination from "@sub/components/iPagination";
import { filterCodeByValueName, filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer, delKeep } from '@/untils/factory.js';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';

export default {
	data() {
		return {
			getPopupContainer,
			statusData: filterCodeByKey('loanStatusDict'),
			chuziData: [],
			params: {
				pageSize: 10,
				pageNo: 1
			},
			pagination: {
				type: 'loanlist',
				total: 0, // 总条数
				pageNo: 1
			},
			columns,
			status: '',
			tabList: [
				{
					name: '全部',
					status: '',
					count: ''
				},
				{
					name: '待收款确认',
					status: 'WAITING_AUDIT',
					count: ''
				}
			],
			accountReceivableList: []
		};
	},
	components: {
		iPagination,
		FinancingTipInfo
	},
	computed: {},
	mounted: function () {
		this.getLoanList();
		API_FinancingbankList().then(res => {
			var list = res.data || [];
			list.forEach(item => {
				this.chuziData.push({
					text: item.name,
					value: item.bizLicenseNo
				});
			});
		});
	},
	beforeRouteLeave(to, from, next) {
		//如果是前往关联页面，保留当前页面数据，否则清空keepalive缓存
		if (to.path === '/center/loan/loanDetail' || to.path === '/center/loan/loanReceipt') {
			from.meta.keepAlive = true;
		} else {
			delKeep(this);
		}
		next();
	},
	methods: {
		getLoanList(pageNo = this.pagination.pageNo, pageSize = 10) {
			// 获取待办任务列表

			let func = this.status ? API_GetLoanListConfirm : API_GetLoanList;
			this.columns = this.status ? columnsShou : columns;
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.getStatusCount();
			func({
				...this.params,
				time2: null,
				time1: null
			}).then(res => {
				if (!res.success) {
					return;
				}
				this.accountReceivableList = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		// 获取应付账款申请日期
		getTime(value, dateString) {
			this.params.beginDateStart = dateString[0];
			this.params.beginDateEnd = dateString[1];
		},

		getStatusCount() {
			API_GetLoanListAdvanceMAINCOUNT({ ...this.params, assetType: 'ACCOUNTS_RECEIVABLE', time2: null, time1: null }).then(
				res => {
					this.tabList[1].count = res.data.countReceiveConfirm;
				}
			);
		},
		getTimeEnd(value, dateString) {
			this.params.endDateStart = dateString[0];
			this.params.endDateEnd = dateString[1];
		},
		changeTab(item) {
			this.status = item.status;
			this.getLoanList();
		},
		searchSubmit() {
			// 查询按钮
			this.pagination.pageNo = 1;
			delete this.params.pageNo;
			this.getLoanList();
		},
		resetValues() {
			// 重置
			this.params = {
				pageSize: 10,
				pageNo: 1
			};
			this.pagination.pageNo = 1;
			this.getLoanList();
		},

		goToDetail(item, index) {
			if (item.id) {
				this.$router.push('/center/assets/payable/manage/detail?id=' + item.id);
			}
		}
	}
};
</script>
<style lang="less" scoped>
.top-nav {
	width: 100%;
	display: flex;
	background-color: #fff;
	height: 50px;
	justify-content: flex-start;
	margin-bottom: -22px;
	font-size: 14px;
}

.nav-item {
	min-width: 100px;
	padding-left: 15px;
	padding-right: 15px;
	text-align: center;
	line-height: 50px;
	position: relative;
	cursor: pointer;
	&.active {
		color: #0053db;
	}
	&.active:after {
		content: '';
		width: 100%;
		height: 2px;
		position: absolute;
		background-color: #0053db;
		bottom: 0;
		left: 0;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.s-card-title {
	margin-top: 10px;
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
</style>
