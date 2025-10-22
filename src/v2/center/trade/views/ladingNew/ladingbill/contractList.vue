<template>
	<div>
		<a-drawer
			class="slDrawer"
			title="关联采购合同"
			placement="right"
			:visible="isShowModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<a-tabs
				v-model="defaultParams.contractType"
				@change="contractTypeTabChange"
			>
				<a-tab-pane
					key="ONLINE"
					tab="电子采购合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="OFFLINE"
					tab="线下采购合同"
				>
				</a-tab-pane>
			</a-tabs>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="changeSearch"
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
					:rowKey="record => record.orderContractId"
					:loading="loading"
					:customRow="onClickRow"
				>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				:pageSize="pageSize"
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
						确定
					</a-button>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_getLadingBillContractList } from '@/v2/center/trade/api/newLading';
export default {
	name: 'SelectContractModal',
	mixins: [ListMixin],
	data() {
		return {
			isShowModal: false,
			defaultParams: {
				contractType: 'ONLINE'
			},
			columns: columns,
			selectedRowKeys: [],
			selectedRows: [],
			url: {
				list: API_getLadingBillContractList
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
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
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
			let list = commonSearchList;
			if (this.defaultParams.contractType == 'ONLINE') {
				list = list.concat(onlintOlnySearchList);
			} else {
				list = list.concat(offlintOlnySearchList);
			}
			return list;
		}
	},
	methods: {
		contractTypeTabChange() {
			// 切换合同类型
			this.resetSearchQuery();
			// this.defaultParams.contractType = this.contractType;
			// this.getList();
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
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.defaultParams = {
				contractType: 'ONLINE'
			};
			this.resetSearchQuery();
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
			this.$emit('confirmSelectContract', selectContract);
			this.onClose();
		},

		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.orderContractId];
						this.selectedRows = [record];
						this.$forceUpdate();
					}
				}
			};
		}
	}
};
const commonSearchList = [
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
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: [
			{ label: '火运', value: 'TRAIN' },
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '汽运和火运', value: 'AUTOMOBILE_AND_TRAIN' },
			{ label: '船运', value: 'SHIP' },
			{ label: '不涉及运输', value: 'NONE' }
		]
	}
];

let onlintOlnySearchList = [
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		allowClear: true,
		placeholder: '请选择煤种',
		// 动力煤、焦煤、焦炭、兰炭、无烟煤、喷吹煤”
		options: [
			{ value: 'STEAM_COAL', label: '动力煤' },
			{ value: 'COKING_COAL', label: '焦煤' },
			{ value: 'COKE', label: '焦炭' },
			{ value: 'SEMI_COKE', label: '兰炭' },
			{ value: 'SMOKELESS_COAL', label: '无烟煤' },
			{ value: 'INJECTION_COAL', label: '喷吹煤' }
		]
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signDateStart', 'signDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '合同状态',
		type: 'select',
		allowClear: true,
		placeholder: '请选择合同状态',
		options: [
			{ value: 'DRAFT', label: '草稿' },
			{ value: 'AUDITING', label: '发起方审批中' },
			{ value: 'WAIT_CONFIRM', label: '待接收方确认' },
			{ value: 'AUDITING_RECEIVE', label: '接收方审批中' },
			{ value: 'CONFIRM_WAIT_SIGN_SEAL', label: '待接收方盖章' },
			{ value: 'WAIT_SIGN_SEAL', label: '待发起方盖章' },
			{ value: 'EXECUTING', label: '执行中' }
		]
	}
];

let offlintOlnySearchList = [
	{
		decorator: ['goodsName'],
		addonBeforeTitle: '品名',
		type: 'input',
		placeholder: '请输入品名'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signDateStart', 'signDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '合同状态',
		type: 'select',
		allowClear: true,
		placeholder: '请选择合同状态',
		options: [
			{ value: 'WAIT_CONFIRM', label: '待确认' },
			{ value: 'SINGLE_SIGN', label: '已单签' },
			{ value: 'EXECUTING', label: '执行中' },
			{ value: 'DOUBLE_SIGN_AUDITING', label: '双签审批中' },
			{ value: 'COMPLETED_AUDITING', label: '完结审批中' }
		]
	}
];

const customRender = text => text || '-';
// 选择电子合同弹窗
export const columns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', customRender },
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'consigneeCompanyName', customRender },
	{
		title: '交货期限',
		dataIndex: 'startDate',
		customRender: (text, row) => {
			return `${row.startDate || ''}~${row.endDate || ''}`;
		}
	},
	{ title: '签订日期', dataIndex: 'signDate', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{
		title: '数量(吨)',
		dataIndex: 'quantity',
		scopedSlots: { customRender: 'Quantity' }
	},
	{
		title: '基准价格(元/吨)',
		dataIndex: 'basePrice',
		customRender
	},
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '煤种', dataIndex: 'coalTypeDesc', customRender }
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.footer-btn {
	height: 32px;
	width: 90px;
	line-height: 32px;
}
.cancel-btn {
	border-color: #c3c3c3;
}
.cancel-btn:hover {
	color: @primary-color;
	border-color:@primary-color;
}
</style>
