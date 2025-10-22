<template>
	<div>
		<a-modal
			id="orderModal"
			title="合同查询"
			width="1200"
			v-model="orderSearchModal"
			@ok="submit"
		>
			<a-form
				layout="inline"
				class="search-wrap"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 16 }"
			>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="合同编号"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.contractNo"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
						v-if="type == 'BUY'"
					>
						<a-form-item
							label="卖方"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.sellCompanyName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
						v-if="type == 'SELL'"
					>
						<a-form-item
							label="买方"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.buyCompanyName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item style="text-align: center; width: 100%">
							<a-button
								type="primary"
								@click="searchSubmit"
								class="search-btn"
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
			<a-table
				:rowSelection="rowSelection"
				:dataSource="historyContractList"
				:columns="historyContractListColumns"
				:pagination="false"
				:rowKey="record => record.id"
				:customRow="onClickRow"
				@change="handleTableChange"
				:scroll="{ x: true }"
			>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-modal>
	</div>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { API_SteelsBuyContractList, API_SteelsSellContractList, getContractList } from '@/v2/center/steels/api/contract.js';
export default {
	props: {
		type: {}
	},
	data() {
		return {
			orderSearchModal: false,
			// 查询条件
			searchModalParams: {},
			historyContractList: [],
			historyContractListColumns: [
				{ title: '合同编号', dataIndex: 'contractNo', width: 200 },
				{ title: '钢材种类', dataIndex: 'steelTypeDesc' },
				{ title: '业务类型', dataIndex: 'businessTypeDesc' },
				{ title: '合同模板', dataIndex: 'contractTemplateDesc' },
				{ title: '卖家名称', dataIndex: 'sellCompanyName' },
				{ title: '买家名称', dataIndex: 'buyCompanyName' },
				{ title: '合同数量（吨）', dataIndex: 'quantity', align: 'center', customRender: text => text || '-' },
				{ title: '生成方式', dataIndex: 'generateWayDesc' },
				{ title: '创建时间', dataIndex: 'createdDate', fixed: 'right' }
			],
			// 选择的合同
			selectedRowKeys: [],
			selectedRows: {},
			// 分页
			pagination: {
				type: 'stellsBuyContractCopy',
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			}
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
					t.selectedRows = record;
				}
			};
		}
	},
	methods: {
		submit() {
			// 选中复制的合同
			if (this.selectedRowKeys && this.selectedRowKeys.length === 0) {
				this.$message.error('请选择要复制的合同！');
				return;
			}
			// this.form.setFieldsValue({
			//   originOrderId: this.selectedRows.contractNo,
			// });
			// this.getEditBuyContractDetail(this.selectedRows.id, "copy");
			this.$emit('send', this.selectedRows);
			this.orderSearchModal = false;
		},
		// 选择的合同
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selectedRows = record;
					}
				}
			};
		},
		// 查询
		searchSubmit() {
			this.pagination.pageNo = 1;
			delete this.searchModalParams.pageNo;
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.searchModalParams = {
				contractNo: '',
				sellCompanyName: '',
				pageNo: 1,
				pageSize: 10
			};
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 获取复制的合同列表
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.searchModalParams.pageNo = pageNo;
			this.searchModalParams.pageSize = pageSize;
			const params = {
				...this.searchModalParams,
				generateWay: 'SYSTEM_COLLECTION',
				isInitiator: true,
				contractType: this.type
			};
			const res = await getContractList(params);
			this.historyContractList = res.data.records;
			this.pagination.total = res.data.total;
		},
		handleTableChange(pagination) {
			this.searchModalParams.pageNo = pagination.pageNo;
			this.getList(this.searchModalParams);
		},
		open() {
			this.orderSearchModal = true;
			this.getList();
		}
	},
	components: {
		iPagination
	}
};
</script>

<style scoped lang="less">
#orderModal {
	::v-deep.ant-modal {
		width: 80% !important;
		min-width: 800px;
		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
	}
	::v-deep.ant-table td {
		white-space: nowrap;
	}
}
</style>
