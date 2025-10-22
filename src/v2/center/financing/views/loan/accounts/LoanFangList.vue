<template>
	<div class="s-card">
		<div class="s-card-title">放款登记</div>
		<div class="divider"></div>
		<div
			class="s-card-content"
			style="margin-top: 14px"
		>
			<div style="margin: 30px auto; width: 80%">
				<a-steps
					:current="0"
					class="steps-tool"
				>
					<a-step
						v-for="item in steps"
						:key="item.title"
						:title="item.title"
					/>
				</a-steps>
			</div>
			<a-form layout="inline">
				<a-row>
					<a-col span="8">
						<a-form-item
							label="应收账款流水号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="应收账款流水号"
								v-model="params.serialNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="卖方名称"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="卖方名称"
								v-model="params.sellerName"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="买方名称"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="买方名称"
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
								placeholder="合同编号"
								v-model="params.contractNo"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="应收账款类型"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-select
								v-model="params.type"
								:getPopupContainer="getPopupContainer"
								placeholder="请选择"
							>
								<a-select-option
									key="PROOF"
									value="PROOF"
									>凭证结算</a-select-option
								>
								<a-select-option
									key="INVOICE"
									value="INVOICE"
									>发票结算</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item
							label="应收账款申请日期"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-range-picker
								v-model="params.applyTime1"
								:getCalendarContainer="getPopupContainer"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTime"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row style="display: flex; justify-content: flex-end">
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

			<a-table
				:pagination="pagination"
				@change="handleTableChange"
				:rowSelection="rowSelection"
				:customRow="onClickRow"
				:columns="columns"
				:data-source="accountReceivableList"
				:scroll="{ x: 2200 }"
				rowKey="id"
				style="margin-top: 22px"
			>
			</a-table>
			<div style="text-align: center; margin-top: 30px">
				<a-button
					type="primary"
					ghost
					@click="$router.push('/center/loan/loanListJR')"
					style="margin-right: 30px"
					>返回</a-button
				>
				<a-button
					type="primary"
					@click="sumbitApply"
					>下一步</a-button
				>
			</div>
		</div>
	</div>
</template>
<script>
const columns = [
	{ title: '应收账款流水号', dataIndex: 'serialNo', key: 'serialNo', fixed: 'left' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应收账款类型', dataIndex: 'typeText', key: 'typeText' },
	{ title: '应收账款金额', dataIndex: 'amount', key: 'amount' },
	{ title: '应收账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应收账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '拟融资金额', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount' },
	{ title: '应收账款申请日期', dataIndex: 'requestTime', key: 'requestTime' }
];
import { API_GetLoanListJRFang, API_FinancingJRSync } from '@/v2/center/financing/api/index.js';
import iPagination from "@sub/components/iPagination";
import { filterCodeByValueName, filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	data() {
		return {
			getPopupContainer,
			statusData: filterCodeByKey('loanStatusDict'),
			params: {
				pageSize: 5,
				pageNo: 1
			},

			pagination: {},
			columns,
			selectedRowKeys: [],
			steps: [
				{
					title: '选择应收账款记录',
					content: 'First-content'
				},
				{
					title: '填写放款信息',
					content: 'Second-content'
				},
				{
					title: '完成放款登记',
					content: 'Last-content'
				}
			],
			accountReceivableList: []
		};
	},
	components: {
		iPagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];

					this.currentRecord = record;
				}
			};
		}
	},
	mounted: function () {
		this.getLoanList();
	},
	methods: {
		getLoanList() {
			// 获取待办任务列表

			API_GetLoanListJRFang({
				...this.params,
				applyTime1: null,
				applyTime2: null
			}).then(res => {
				if (!res.success) {
					return;
				}
				this.accountReceivableList = res.data.records;
				const pagination = {
					total: res.data.total,
					pageSize: res.data.size,
					current: res.data.current,
					showTotal: function (total) {
						return `共${total}条记录 第${res.data.current}页 `;
					}
				};

				this.pagination = pagination;
			});
		},

		// 获取应付账款申请日期
		getTime(value, dateString) {
			this.params.requestDateBegin = dateString[0];
			this.params.requestDateEnd = dateString[1];
		},
		searchSubmit() {
			// 查询按钮
			this.params.pageNo = 1;
			this.getLoanList();
		},
		sumbitApply() {
			let key = this.selectedRowKeys[0];
			if (key) {
				this.$router.push('/center/loan/loanFang?id=' + key);
			}
		},
		resetValues() {
			// 重置
			this.params = {
				pageSize: 5,
				pageNo: 1
			};

			this.getLoanList();
		},
		handleTableChange(pagination) {
			this.params.pageNo = pagination.current;
			this.getLoanList(pagination);
		},

		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
					}
				}
			};
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
	padding-right: 30px;
}
</style>
