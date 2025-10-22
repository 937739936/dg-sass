<template>
	<div id="goodsTransferApplyList">
		<div class="s-title">
			<span>新增放货通知单</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="0">
				<a-step title="选择待开具提货的订单信息" />
				<a-step title="填写提货信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<a-form
			layout="inline"
			class="search-wrap"
		>
			<a-row>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="合同编号"
						class="order-wrap"
					>
						<a-input
							v-model.trim="params.contractNo"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="订单编号"
						class="order-wrap"
					>
						<a-input
							v-model.trim="params.orderNo"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="卖方企业名称"
						class="order-wrap"
					>
						<a-input
							v-model.trim="params.sellerName"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-space size="large">
						<a-button
							type="primary"
							@click="searchSubmit"
							>查询</a-button
						>
						<a-button @click="reset">重置</a-button>
					</a-space>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				:rowKey="record => record.contractId"
				:scroll="{ x: 1500, y: 400 }"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:loading="loading"
			>
			</a-table>
		</div>
		<div
			class="test"
			v-show="params.pageSize < pagination.total"
		>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>

		<div class="goodsTrans-btn-wrap">
			<a-space size="large">
				<a-button
					type=""
					@click="$router.back()"
					>返回</a-button
				>
				<a-button
					type="primary"
					class="next-btn"
					@click="next()"
					:disabled="dataSource.length == 0"
					>下一步</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import { API_getLadingBillContractList } from '@/v2/center/trade/api/lading';
import iPagination from "@sub/components/iPagination";

export default {
	data() {
		return {
			params: {
				pageSize: 10
			},
			deliverDate: [],
			selectedRowKeys: [],
			columns: [
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 300
				},
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					width: 300
				},
				{
					title: '卖方企业名称',
					dataIndex: 'sellerName',
					width: 300
				},
				{
					title: '收货人名称',
					dataIndex: 'consigneeCompanyName',
					width: 200
				},
				{
					title: '订单数量(吨)',
					dataIndex: 'quantity',
					width: 300
				},
				{
					title: '可开具提货单数量(吨)',
					dataIndex: 'leaveQuantity',
					width: 300
				},
				{
					title: '交货期限',
					dataIndex: 'date',
					width: 300,
					customRender: (text, row) => {
						return `${row.startDate || ''}~${row.endDate || ''}`;
					}
				}
			],
			dataSource: [],
			contractId: this.$route.query.id, // 当前选中行合同编号
			currentRow: {}, // 当前选中行
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false
		};
	},
	components: {
		iPagination
	},
	mounted() {
		this.getList();
	},
	methods: {
		reset() {
			this.params = {
				pageSize: 10
			};
			this.searchSubmit();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loading = true;
			const res = await API_getLadingBillContractList(this.params);
			this.dataSource = (res.result && res.result.records) || [];
			this.pagination.total = res.result.total || 0;
			this.loading = false;
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.params = {
				effectiveStartStartDate: '',
				effectiveEndEndDate: ''
			};
			this.deliverDate = [];
			this.pagination.pageNo = 1;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.contractId];
						this.contractId = record.contractId;
						this.currentRow = record;
					}
				}
			};
		},
		async next() {
			if (!this.contractId) {
				this.$message.error('请选择订单');
			} else {
				const params = {
					contractId: this.currentRow.contractId
				};
				this.$router.push({
					path: '/center/ladingbill/lading/add',
					query: {
						contractType: this.currentRow.contractType,
						contractId: this.currentRow.contractId
					}
				});
			}
		}
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.contractId];
					t.contractId = record.contractId;
					t.currentRow = record;
				}
			};
		}
	}
};
</script>

<style lang="less">
#goodsTransferApplyList {
	.goodsTrans-btn-wrap {
		text-align: center;
		padding: 30px 0;
	}
}
</style>
