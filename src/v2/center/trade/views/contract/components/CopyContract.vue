<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			:title="type === 'SELL' ? '选择要复制的销售合同' : '选择要复制的采购合同'"
			placement="right"
			:visible="orderSearchModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getList"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="historyOrderList"
					:columns="historyOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
				>
					<template
						slot="basicPrice"
						slot-scope="text, items"
					>
						{{ items.basicPrice || items.basicPriceDesc || '-' }}
					</template>
					<template
						slot="companyName"
						slot-scope="text, items"
					>
						<p>{{ type === 'SELL' ? items.buyerName : items.sellerName }}</p>
					</template>
					<template
						slot="deliveryStartDate"
						slot-scope="text, items"
					>
						<p v-if="items.deliveryStartDate">{{ items.deliveryStartDate }}至{{ items.deliveryEndDate }}</p>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="20">
					<a-button
						class="copy-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="copy-contract-modal-btn"
						type="primary"
						@click="handleSubmit"
						>确定</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { API_pageCopyList } from '@/v2/center/trade/api/contract';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';

const searchList = [
	{
		decorator: ['orderContractSerialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		allowClear: true,
		placeholder: '请选择煤种',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeBeginStr', 'signTimeEndStr']
	}
];
const historyOrderListColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left' },
	{ title: '卖方企业名称', dataIndex: 'companyName', scopedSlots: { customRender: 'companyName' } },
	{ title: '收货人', dataIndex: 'consigneeCompanyName' },
	{ title: '交货期限', dataIndex: 'deliveryStartDate', scopedSlots: { customRender: 'deliveryStartDate' } },
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '运输方式', dataIndex: 'transTypeDesc' },
	{ title: '数量(吨)', dataIndex: 'quantity', align: 'center' },
	{ title: '基准价格(元/吨)', dataIndex: 'basicPrice', align: 'center', scopedSlots: { customRender: 'basicPrice' } },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '订单编号', dataIndex: 'serialNo' }
];
export default {
	name: 'CopyContract',
	props: ['contractNo'],
	data() {
		return {
			orderSearchModal: false,
			searchModalParams: {},
			historyOrderListColumns,
			historyOrderList: [],
			selectedRowKeys: [],
			pagination: {},
			loading: false,
			searchList,
			selectItem: {},
			url: {
				list: API_pageCopyList
			}
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	watch: {},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
				}
			};
		},
		type() {
			return this.$route.query.type;
		},
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		})
	},
	created() {
		this.historyOrderListColumns.forEach(item => {
			if (item.dataIndex === 'companyName') {
				item.title = this.type?.toUpperCase() === 'SELL' ? '买方企业名称' : '卖方企业名称';
			}
		});
	},
	methods: {
		handleSubmit() {
			if (!this.selectedRowKeys.length) {
				this.$message.warn('请选择要复制的合同');
				return;
			}
			this.$emit('rowSelect', this.selectedRowKeys[0]);
			this.orderSearchModal = false;
		},
		showModal() {
			this.orderSearchModal = true;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selectItem = record;
					}
				}
			};
		},
		resetValues() {
			this.searchModalParams = {};
			this.pagination = {
				current: 1
			};
			this.getList();
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			this.pagination.current = pageNo;
			this.searchModalParams.pageNo = this.pagination.current;
			this.searchModalParams.pageSize = this.pagination.pageSize;
			this.getList(this.searchModalParams);
		},
		getList(params) {
			this.loading = true;
			this.selectItem = {};
			this.selectedRowKeys = [];
			this.searchModalParams = {
				...this.searchModalParams,
				...params
			};
			API_pageCopyList({
				...params,
				orderType: this.type?.toUpperCase(),
				excludeContractNo: this.contractNo
			})
				.then(res => {
					if (res.success) {
						this.historyOrderList = res.data.records;
						const pagination = {
							total: res.data.total,
							pageSize: res.data.size,
							current: res.data.current,
							pageNo: res.data.current,
							showTotal: function (total) {
								return `共${total}条记录 第${res.data.current}页 `;
							}
						};
						this.pagination = pagination;
						if (this.contractNo) {
							const resultIds = res.data.records.filter(
								item => item.contractNo == this.VUEX_GET_CONTRACT_DATA?.contract?.contractNo
							)[0]?.id;
							this.selectedRowKeys = [resultIds];
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		onClose() {
			this.orderSearchModal = false;
			this.selectItem = {};
			this.selectedRowKeys = [];
			this.historyOrderList = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
/deep/.ant-drawer-title {
	line-height: 26px;
	font-weight: 600;
}
.copy-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
</style>
