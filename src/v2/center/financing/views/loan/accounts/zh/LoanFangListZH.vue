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
							label="融资编号"
							:colon="false"
							:label-col="{ span: 8 }"
							:wrapper-col="{ span: 15 }"
						>
							<a-input
								placeholder="融资编号"
								v-model="params.serialNo"
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
								placeholder="融资方"
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
								placeholder="核心企业"
								v-model="params.buyerName"
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
								placeholder="应收账款流水号"
								v-model="params.receivableSerialNo"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row style="display: flex; justify-content: flex-end">
					<a-col span="8">
						<a-form-item style="text-align: center">
							<a-button
								type="primary"
								@click="search"
								class="search-btn"
								style="margin-right: 16px"
								>查询</a-button
							>
							<a-button
								type="primary"
								@click="reset"
								:ghost="true"
								>重置</a-button
							>
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
				:data-source="dataSource"
				:scroll="{ x: true }"
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
					@click="next"
					>下一步</a-button
				>
			</div>
		</div>
	</div>
</template>
<script>
import {
	API_FinancingListHn

	// API_GetLoanListJRFang,
	// API_FinancingJRSync
} from '@/v2/center/financing/api/index.js';
// import { filterCodeByValueName, filterCodeByKey } from '@sub/utils/globalCode.js'

const columns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo', fixed: 'left' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '融资金额(元)', dataIndex: 'amount', key: 'amount' },
	{ title: '融资利率(%)', dataIndex: 'rate', key: 'rate' },
	{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
	{ title: '应收账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{ title: '应收账款金额(元)', dataIndex: 'receivableAmount', key: 'receivableAmount' },
	{ title: '状态', dataIndex: 'statusText', key: 'statusText', fixed: 'right' }
];

export default {
	data() {
		return {
			pagination: {
				total: 0,
				pageNo: 1
			},
			params: {},
			dataSource: [],
			columns,
			selectedRowKeys: [],
			steps: [
				{
					title: '选择融资记录'
				},
				{
					title: '填写放款信息'
				},
				{
					title: '完成放款登记'
				}
			]

			// statusData: filterCodeByKey("loanStatusDict"),
			// accountReceivableList: []
		};
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

					// this.currentRecord = record
				}
			};
		}
	},
	mounted() {
		this.getFinancingList();
	},
	methods: {
		// 获取融资纪录
		getFinancingList() {
			this.params.pageNo = this.pagination.pageNo;
			API_FinancingListHn({
				...this.params,
				pageSize: 5
			}).then(res => {
				this.dataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		search() {
			// 查询按钮
			this.params.pageNo = 1;
			this.getFinancingList();
		},
		reset() {
			// 重置
			this.params = {};
			this.pagination.pageNo = 1;
			this.getFinancingList();
		},
		handleTableChange(pagination) {
			this.pagination.pageNo = pagination.current;
			this.getFinancingList();
		},
		next() {
			let key = this.selectedRowKeys[0];
			if (key) {
				this.$router.push('/center/loan/loanFangZH?id=' + key);
			}
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
