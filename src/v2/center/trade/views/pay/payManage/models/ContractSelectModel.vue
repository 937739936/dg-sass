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
				v-model="contractType"
				@change="contractTypeTabChange"
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
					:rowKey="record => rowKey(record)"
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
						<NumberFormatView :value="record.followTheMarket == '1' ? '随行就市' : text" :isShowMoneyTip="true"/>
					</template>
					<template
						slot-scope="text, record"
						slot="basePrice"
					>
						<NumberFormatView :value="text || record.basePriceDesc" :isShowMoneyTip="true"/>
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
import { API_getOnLineContractList, API_getOffLineContractList, API_getTransportContractList } from '@/v2/center/trade/api/pay';
import { contractSearchList } from './ContractSearchList';
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
			contractType: 'ONLINE',
			defaultParams: {
				contractType: 'ONLINE'
			},
			selectedRowKeys: [],
			selectedRows: [],
			url: {
				list: API_getOnLineContractList
			},
			selfLoad: true
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
					key: 'ONLINE',
					tab: '电子采购合同'
				},
				{
					key: 'OFFLINE',
					tab: '线下采购合同'
				},
				{
					key: 'TRANSPORT',
					tab: '运输合同'
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
			let list = contractSearchList(this.contractType);
			return list;
		},
		columns() {
			return contractColumns(this.contractType);
		}
	},
	methods: {
		rowKey(record) {
			let key = '';
			switch (this.contractType) {
				case 'ONLINE':
					key = record.orderId;
					break;
				case 'OFFLINE':
					key = record.contractId;
					break;
				case 'TRANSPORT':
					key = record.contractId;
					break;
			}
			return key;
		},
		// 切换合同类型
		contractTypeTabChange() {
			this.dataSource = [];
			this.resetSearchQuery();
			this.defaultParams.contractType = this.contractType;
			switch (this.contractType) {
				case 'ONLINE':
					this.url.list = API_getOnLineContractList;
					break;
				case 'OFFLINE':
					this.url.list = API_getOffLineContractList;
					break;
				case 'TRANSPORT':
					this.url.list = API_getTransportContractList;
					break;
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
			let contractType = '';
			if (this.contractTabList.length > 0) {
				contractType = this.contractTabList[0].key;
			}
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.defaultParams = {
				contractType: contractType
			};
			this.contractType = contractType;
			this.contractTypeTabChange();
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
			let serialNo = '';
			switch (this.contractType) {
				case 'ONLINE':
					serialNo = selectContract.orderNo;
					break;
				case 'OFFLINE':
					serialNo = selectContract.contractNo;
					break;
				case 'TRANSPORT':
					serialNo = selectContract.contractNo;
					break;
				default:
					break;
			}
			this.$emit('secondStepOfContractPayCheck', { serialNo, contractType: this.contractType });
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
		}
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
