<template>
	<div id="goodsTransferApplyList">
		<div class="s-title">
			<span>新增放货通知单</span>
			<a-button
				type="primary"
				@click="$router.back()"
				><div>返回</div></a-button
			>
		</div>
		<div class="steps-wrap">
			<a-steps :current="0">
				<a-step title="选择销售合同" />
				<a-step title="填写货物信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<a-form
			layout="inline"
			class="search-wrap"
		>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="买方名称"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.buyCompanyName"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="放货数量"
						class="order-wrap"
						:colon="false"
					>
						<a-input-number
							:min="0"
							v-model="params.quantityLower"
							placeholder="请输入"
						></a-input-number>
						-
						<a-input-number
							:min="0"
							v-model="params.quantityUpper"
							placeholder="请输入"
						></a-input-number>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同编号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同日期"
						class="order-wrap"
						:colon="false"
					>
						<a-range-picker
							:placeholder="['开始日期', '结束日期']"
							valueFormat="YYYY-MM-DD"
							v-model="deliverDate"
							format="YYYY-MM-DD"
							@change="deliverDateGetTime"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label=" "
						class="order-wrap"
						:colon="false"
					>
						<a-button
							type="primary"
							html-type="submit"
							class="search-btn"
							@click="searchSubmit"
						>
							查询
						</a-button>
						<a-button
							html-type="reset"
							@click="resetValues"
						>
							重置
						</a-button>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
			>
			</a-table>
		</div>
		<div class="test">
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>

		<div class="goodsTrans-btn-wrap">
			<a-button
				type="primary"
				class="next-btn"
				@click="next()"
				:disabled="dataSource.length == 0"
				>下一步</a-button
			>
		</div>
	</div>
</template>

<script>
import { getSupplementGoodsTransferRelease, checkContractQuantity } from '@/v2/center/steels/api/goodsTransfer.js';

import iPagination from "@sub/components/iPagination";
export default {
	name: 'goodsTransApplyList',
	data() {
		return {
			params: {
				effectiveStartDate: '',
				effectiveEndDate: ''
			},
			deliverDate: [],
			selectedRowKeys: [],
			columns: [
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 135
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName',
					width: 150
				},
				{
					title: '合同数量(吨)',
					dataIndex: 'quantity',
					width: 130,
					customRender: (text, row) => {
						return text || '-';
					}
				},
				{
					title: '已放货数量（吨）',
					dataIndex: 'releaseQuantity',
					width: 150
				},
				{
					title: '已开具货转数量(吨)',
					dataIndex: 'transferQuantity',
					width: 150
				},
				{
					title: '合同日期',
					dataIndex: 'date',
					customRender: (text, row) => {
						return `${row.effectiveStartDate || ''}-${row.effectiveEndDate || ''}`;
					},
					width: 150
				}
			],
			dataSource: [],
			id: this.$route.query.id, // 当前选中行合同编号
			currentRow: {}, // 当前选中行
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		iPagination
	},
	mounted() {
		// 返回选中上一次所选的
		if (this.id) {
			this.selectedRowKeys = [this.$route.query.id];
		}
		this.getList();
	},
	methods: {
		deliverDateGetTime(value, dateString) {
			this.params.effectiveStartStartDate = dateString[0];
			this.params.effectiveEndEndDate = dateString[1];
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			const res = await getSupplementGoodsTransferRelease(this.params);
			this.dataSource = (res.data && res.data.records) || [];
			this.pagination.total = res.data.total || 0;
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
						this.selectedRowKeys = [record.id];
						this.id = record.id;
						this.currentRow = record;
					}
				}
			};
		},
		async next() {
			if (!this.id) {
				this.$message.error('请选择需要销售合同');
			} else {
				const params = {
					contractId: this.currentRow.id
				};
				await checkContractQuantity(params);
				this.$router.push({
					path: '/center/steels/goodsTransfer/letterNotice/add',
					query: {
						contractNo: this.currentRow.contractNo,
						contractTemplate: this.currentRow.contractTemplate,
						contractId: this.currentRow.id,
						generateWay: this.currentRow.generateWay
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
					t.selectedRowKeys = [record.id];
					t.id = record.id;
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
