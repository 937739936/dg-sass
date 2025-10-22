<template>
	<div>
		<a-drawer
			class="slDrawer"
			placement="right"
			:forceRender="true"
			:destroyOnClose="true"
			:title="drawerTitle"
			:visible="isShowModal"
			:footer="null"
			@close="onClose"
		>
			<a-tabs
				:animated="false"
				v-model="productCode"
				@change="productCodeTabChange"
			>
				<a-tab-pane
					v-for="item in contractTabList"
					:key="item.key"
					:tab="item.tab"
				>
				</a-tab-pane>
			</a-tabs>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handleSearchChange"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<div class="table-box">
				<a-table
					class="new-table"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.contractId"
					:loading="loading"
					:customRow="onClickRow"
				>
					<template
						slot-scope="text"
						slot="money"
					>
						<NumberFormatView
							:value="text"
							:isShowMoneyTip="true"
						/>
					</template>
					<template
						slot-scope="text"
						slot="quantity"
					>
						<NumberFormatView :value="text" />
					</template>
					<template
						slot-scope="text, record"
						slot="contractPrice"
					>
						<NumberFormatView
							:value="record.followTheMarket == '1' ? '随行就市' : text"
							:isShowMoneyTip="true"
						/>
					</template>
					<template
						slot-scope="text, record"
						slot="basePrice"
					>
						<NumberFormatView
							:value="text || record.basePriceDesc"
							:isShowMoneyTip="true"
						/>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<div class="footer">
				<a-space :size="20">
					<a-button
						class="footer-btn cancel-btn"
						@click="onClose"
					>
						取消
					</a-button>
					<a-button
						class="footer-btn"
						type="primary"
						:disabled="!(selectedRowKeys && selectedRowKeys.length)"
						@click="handleSubmit"
					>
						下一步
					</a-button>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_getTransportContractList
} from '@/v2/center/trade/api/pay';
import {
	getTransferWarehouseList
} from '@/v2/center/logisticSupervise/api/settle';
import { contractSearchList } from './contractSearchList';
import { contractColumns } from './ContractColumns';
import NumberFormatView from '@sub/trade/pay/components/NumberFormatView';

export default {
	name: 'ContractSelectModal',
	mixins: [ListMixin],
	components: {
		NumberFormatView
	},
	data() {
		return {
			drawerTitle: '选择合同',
			isShowModal: false,
			productCode: 'LOGIC_DELIVER',
			defaultParams: {
				productCode: 'LOGIC_DELIVER'
			},
			selectedRowKeys: [],
			selectedRows: [],
			url: {
				list: API_getTransportContractList
			},
			selfLoad: true,
			// 仓库列表
			warehouseList: []
		};
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRowKeys = [];
			this.sel = [];
		}
	},
	computed: {
		// 合同类型选项
		contractTabList() {
			return [
				{
					key: 'LOGIC_DELIVER',
					tab: '运输合同'
				},
				{
					key: 'WAREHOUSE_RENT',
					tab: '仓储合同'
				}
			];
		},

		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					t.selectedRowKeys = selectedRowKeys;
					t.selectedRows = selectedRows;
				}
			};
		},
		searchList() {
			let list = contractSearchList(this.productCode);
			if (this.productCode == 'WAREHOUSE_RENT') {
				const arr = this.warehouseList.map(el => {
					return {
						value: el.id,
						...el
					};
				});
				list[2].options = this.warehouseList.map(el => {
					return {
						value: el.id,
						label: el.name,
						...el,
						value: el.id,
					};
				});
			}
			return list;
		},
		columns() {
			return contractColumns(this.productCode);
		}
	},
	mounted() {
		this.getWarehouseList();
	},
	methods: {
		// 切换合同类型
		productCodeTabChange() {
			this.dataSource = [];
			this.resetSearchQuery();
			this.defaultParams.productCode = this.productCode;
		},
		// 获取数据列表
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			let params = {
				...this.isorter,
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			if (params.warehouseId) {
				params = {
					...params,
					contractDynamicsFields: {
						warehouseId: params.warehouseId
					}
				}
				delete params.warehouseId
			}
			if (this.url?.list) {
				this.loading = true;
				try {
					let res = await this.url.list(params);
					this.dataSource = res.data ? res.data.records || res.data.list : res.result.records;
					console.log('dataSource', this.dataSource)
					this.pagination.total = res.data ? res.data.total : res.result.total;
					this.loading = false;
				} catch (error) {
					this.loading = false;
				}
			}
			//判断是否有加载数量统计
			if (this.url?.count) {
				try {
					let res = await this.url.count(params);
					this.dataCountSource = res.data || res.result;
				} catch (error) {
					console.error(error);
				}
			}
		},
		handleSearchChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		resetSearchQuery() {
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
		},
		onInitConfig() {
			let productCode = '';
			if (this.contractTabList.length > 0) {
				productCode = this.contractTabList[0].key;
			}
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.defaultParams = {
				productCode: productCode
			};
			this.productCode = productCode;
			this.productCodeTabChange();
			// this.resetSearchQuery();
		},
		onClose() {
			this.isShowModal = false;
			this.onInitConfig();
		},
		showModal() {
			this.isShowModal = true;
			this.getList();
		},
		handleSubmit() {
			if (this.selectedRows.length == 0) {
				return;
			}
			let selectContract = this.selectedRows[0];
			let serialNo = selectContract.contractNo
			this.$router.push({
				path: '/center/logisticSupervise/paymentManage/add',
				query: {
					type: 'add',
					serialNo,
					contractId: this.selectedRows[0].contractId,
					productCode: this.productCode,
					contractType: 'TRANSPORT'
				}
			});
			this.onClose();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [this.rowKey(record)];
						this.selectedRows = [record];
						this.$forceUpdate();
					}
				}
			};
		},
		async getWarehouseList() {
      const res = await getTransferWarehouseList()
			if (res.success) {
				this.warehouseList = res.data
			}
    },
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slDrawer {
	.table-box {
		margin-top: 50px;
	}
	.footer {
		.footer-btn {
			height: 32px;
			width: 90px;
			line-height: 32px;
			padding: 0 !important;
		}
		.cancel-btn {
			border-color: #c3c3c3;
		}
		.cancel-btn:hover {
			color: @primary-color;
			border-color: @primary-color;
		}
	}
}
</style>
