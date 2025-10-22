<template>
	<div id="goodsTransferApplyList">
		<div class="s-title">
			<span>收货证明开具</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="0">
				<a-step title="选择待开具收货证明的订单" />
				<a-step title="填写收货证明信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<a-form
			class="mt16"
			v-bind="formLayout"
			labelAlign="left"
		>
			<a-row>
				<a-col :span="colSpan">
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
				<a-col :span="colSpan">
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
				<a-col :span="colSpan">
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
				<a-col :span="colSpan">
					<a-form-item
						label=""
						class="order-wrap"
					>
						<a-space size="large">
							<a-button
								type="primary"
								@click="searchSubmit"
								>查询</a-button
							>
							<a-button
								type=""
								@click="reset"
								>重置</a-button
							>
						</a-space>
					</a-form-item>
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
		<div class="test">
			<i-pagination
				:pagination="pagination"
				v-show="params.pageSize < pagination.total"
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
import { API_getReceiptListContract } from '@/v2/center/trade/api/lading';
import iPagination from "@sub/components/iPagination";
import { colSpan } from '@/v2/config/layoutConfig';

export default {
	data() {
		return {
			colSpan,
			formLayout: {
				labelCol: {
					span: 5
				},
				wrapperCol: {
					span: 16
				}
			},
			params: {
				pageSize: 10
			},
			deliverDate: [],
			selectedRowKeys: [],
			columns: [
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 220
				},
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					width: 220
				},
				{
					title: '卖方企业名称',
					dataIndex: 'sellerName',
					width: 200
				},
				{
					title: '提货数量(吨)',
					dataIndex: 'ladingQuantity'
				},
				{
					title: '已开具收货证明数量(吨)',
					dataIndex: 'receiptQuantity'
				},
				{
					title: '可开具收货证明数量(吨)',
					dataIndex: 'leaveReceiptQuantity'
				},
				{
					title: '运输方式',
					dataIndex: 'transportModeDesc'
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
			const res = await API_getReceiptListContract(this.params);
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
					path: '/center/ladingbill/receipt/add',
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
