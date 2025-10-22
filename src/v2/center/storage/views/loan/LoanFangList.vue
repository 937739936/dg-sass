<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>放款登记</span
				>
			</div>
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
								label="卖方企业"
								:colon="false"
								:label-col="{ span: 8 }"
								:wrapper-col="{ span: 15 }"
							>
								<a-input
									placeholder="请输入卖方企业"
									v-model="params.sellerName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col span="8">
							<a-form-item
								label="买方企业"
								:colon="false"
								:label-col="{ span: 8 }"
								:wrapper-col="{ span: 15 }"
							>
								<a-input
									placeholder="请输入买方企业"
									v-model="params.buyerName"
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
					<div
						slot="contractStartDate"
						slot-scope="text, record"
					>
						{{ text }}-{{ record.contractEndDate }}
					</div>
				</a-table>
				<div style="text-align: center; margin-top: 30px">
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
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
		</a-card>
	</div>
</template>
<script>
import { API_GrainFinancingOrderList } from '@/v2/center/storage/api';

const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		fixed: 'left'
	},
	{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '买方企业', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '商品', dataIndex: 'productName', key: 'productName' },
	{
		title: '合同期限',
		dataIndex: 'contractStartDate',
		key: 'contractStartDate',
		scopedSlots: { customRender: 'contractStartDate' }
	},
	{ title: '合同签订日期', dataIndex: 'signTime', key: 'signTime' }
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
					title: '选择合同'
				},
				{
					title: '填写放款信息'
				},
				{
					title: '完成放款登记'
				}
			]
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
			API_GrainFinancingOrderList({
				...this.params,
				status: 'EXECUTING',
				pageSize: 5
			}).then(res => {
				this.dataSource = res.data.list || [];
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
				this.$router.push('/center/storageCenter/loan/loanFang?id=' + key);
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
