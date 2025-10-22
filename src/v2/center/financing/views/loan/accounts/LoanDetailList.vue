<template>
	<div class="s-card">
		<div class="s-card-title">放款明细表</div>
		<div class="divider"></div>
		<div
			class="s-card-content"
			style="margin-top: 14px"
		>
			<a-form layout="inline">
				<a-row>
					<a-col span="8">
						<a-form-item
							label="应收账款编号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入应收账款编号"
								v-model="params.receivableSerialNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="融资方"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入融资方"
								v-model="params.financier"
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
							label="授信金额"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入"
								v-model="params.creditAmountBegin"
								style="width: 100px"
							></a-input>
							<span> ~ </span>
							<a-input
								placeholder="请输入"
								v-model="params.creditAmountEnd"
								style="width: 100px"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="放款金额"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入"
								v-model="params.finAmountBegin"
								style="width: 100px"
							></a-input>
							<span> ~ </span>
							<a-input
								placeholder="请输入"
								v-model="params.finAmountEnd"
								style="width: 100px"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="敞口金额"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入"
								v-model="params.ckAmountBegin"
								style="width: 100px"
							></a-input>
							<span> ~ </span>
							<a-input
								placeholder="请输入"
								v-model="params.ckAmountEnd"
								style="width: 100px"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="提款日期"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-range-picker
								v-model="params.applyTime1"
								:getCalendarContainer="getPopupContainer"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTime1"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="实际结清日期"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-range-picker
								v-model="params.applyTime2"
								:getCalendarContainer="getPopupContainer"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTime2"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="下游企业"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入下游企业"
								v-model="params.terminalName"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="是否单签合同放款"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-select
								:getPopupContainer="getPopupContainer"
								:showArrow="true"
								style="width: 100%"
								placeholder="请选择"
								v-model="params.loanFlag"
							>
								<a-select-option value="1">是</a-select-option>
								<a-select-option value="0">否</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="双签合同在途天数"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="请输入"
								v-model="params.ztDaysBegin"
								style="width: 100px"
							></a-input>
							<span> ~ </span>
							<a-input
								placeholder="请输入"
								v-model="params.ztDaysEnd"
								style="width: 100px"
							></a-input>
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
			<div style="text-align: right">
				<a-button
					@click="exportData"
					type="primary"
					>导出</a-button
				>
			</div>
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="accountReceivableList"
				:scroll="{ x: true }"
				rowKey="id"
				style="margin-top: 22px"
			>
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
	{ title: '应收账款流水号', fixed: 'left', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '上游合同编号', dataIndex: 'upContractNo', key: 'upContractNo' },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '授信金额（元）', dataIndex: 'creditAmount', key: 'creditAmount', align: 'right' },
	{ title: '放款金额（元）', dataIndex: 'finAmount', key: 'finAmount', align: 'right' },
	{ title: '敞口余额（元）', dataIndex: 'ckAmount', key: 'ckAmount', align: 'right' },
	{ title: '转让应收账款金额（元）', dataIndex: 'receivableAmount', key: 'receivableAmount', align: 'right' },
	{ title: '提款日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
	{ title: '实际结清日期', dataIndex: 'payoffDate', key: 'payoffDate' },
	{ title: '实际用款天数', dataIndex: 'loanDays', key: 'loanDays' },
	{ title: '下游企业', dataIndex: 'terminalName', key: 'terminalName' },
	{ title: '下游贸易合同编号', dataIndex: 'terminalContractNo', key: 'terminalContractNo' },
	{ title: '是否单签合同放款', dataIndex: 'loanFlag', key: 'loanFlag' },
	{ title: '双签版合同获得日期', dataIndex: 'doubleSignGetDate', key: 'doubleSignGetDate' },
	{ title: '双签版合同取得天数', dataIndex: 'doubleSignGetDays', key: 'doubleSignGetDays' },
	{ title: '双签版合同在途天数', dataIndex: 'doubleSignZtDays', key: 'doubleSignZtDays' }
];
import { API_GetLoanDetailListJR, API_ExportLoanDetailListJR } from '@/v2/center/financing/api/index.js';
import { GetCurrentDate } from '@/v2/utils/factory.js';
import iPagination from '@sub/components/iPagination';
import comDownload from '@sub/utils/comDownload.js';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this),
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
			accountReceivableList: []
		};
	},
	components: {
		iPagination
	},
	computed: {},
	mounted: function () {
		this.getLoanList();
	},
	methods: {
		getLoanList(pageNo = this.pagination.pageNo, pageSize = 10) {
			// 获取待办任务列表
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_GetLoanDetailListJR({
				...this.params,
				applyTime1: null,
				applyTime2: null
			}).then(res => {
				if (!res.success) {
					return;
				}
				this.accountReceivableList = res.data?.records;
				this.pagination.total = res.data.total;
			});
		},
		// 获取提款日期
		getTime1(value, dateString) {
			this.params.beginDateStart = dateString[0];
			this.params.beginDateEnd = dateString[1];
		},
		// 获取结清日期
		getTime2(value, dateString) {
			this.params.payoffDateStart = dateString[0];
			this.params.payoffDateEnd = dateString[1];
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
		},
		exportData() {
			API_ExportLoanDetailListJR({
				...this.params,
				applyTime1: null,
				applyTime2: null
			}).then(res => {
				comDownload(res, undefined, `放还款明细-${GetCurrentDate()}.xls`);
			});
		}
	}
};
</script>
<style lang="less" scoped>
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
	text-align: left;
}
</style>
