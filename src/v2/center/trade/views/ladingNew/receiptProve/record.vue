<template>
	<div>
		<a-drawer
			class="slDrawer"
			title="出库记录"
			placement="right"
			:visible="isShowModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
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
					ref="recordTable"
					class="new-table"
					:key="tableKey"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
					:customRow="onClickRow"
				>
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
						:disabled="!(selectedRows && selectedRows.length)"
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
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_getStorageRecordOutList } from '@/v2/center/trade/api/newLading';
import { isEqual } from 'lodash';
export default {
	name: 'SelectRecordModal',
	mixins: [ListMixin],
	data() {
		return {
			isShowModal: false,
			searchList: searchList,
			columns: columns,
			selectedRowKeys: [],
			selectedRows: [],
			tableKey: 1,
			url: {
				list: API_getStorageRecordOutList
			},
			selfLoad: true,
			defaultParams: {
				type: 'OUT'
			}
		};
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRowKeys = [];
			this.selectedRows = [];
		}
	},
	computed: {
		rowSelection() {
			let selectedRowKeys = this.selectedRowKeys;
			const t = this;
			return {
				type: 'checkbox',
				selectedRowKeys: selectedRowKeys,
				columnTitle: '  ',
				hideDefaultSelections: true,
				getCheckboxProps: record => {
					let selectedRow;
					let isSameContract = false;
					if (this.selectedRows && this.selectedRows.length > 0) {
						selectedRow = this.selectedRows[0];
						isSameContract = record.contractId == selectedRow.contractId && record.contractType == selectedRow.contractType;
					}
					let disabled = true;
					if (!selectedRow || isSameContract) {
						disabled = false;
					}
					return {
						props: {
							disabled: disabled
						}
					};
				},
				onChange: (selectedRowKeys, selectedRows) => {
					t.selectedRowKeys = [...selectedRowKeys];
					t.selectedRows = [...selectedRows];
					t.tableKey += 1;
				}
			};
		}
	},
	methods: {
		resetFunc() {},
		handleSearchChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		onClose() {
			this.isShowModal = false;
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
			this.selectedRowKeys = [];
			this.selectedRows = [];
		},
		showModal() {
			this.isShowModal = true;
			this.getList();
		},
		handleSubmit() {
			this.$emit('confirmSelectRecordOutList', this.selectedRows);
			this.onClose();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						// let isSameContract = false;
						// if (this.selectedRows && this.selectedRows.length > 0) {
						//   selectedRow = this.selectedRows[0];
						//   isSameContract =
						//     record.contractId == selectedRow.contractId &&
						//     record.contractType == selectedRow.contractType;
						// }
						// let disabled = true;
						// if (!selectedRow || isSameContract) {
						//   disabled = false;
						// }
						// return {
						//   props: {
						//     disabled: disabled,
						//   },
						// };
						let selectedRows = this.selectedRows;
						let selectedRowKeys = this.selectedRowKeys;
						for (let index = 0; index < selectedRows.length; index++) {
							const element = this.selectedRows[index];
							if (element.id == record.id) {
								// 选中的包含则去除
								selectedRows.splice(index, 1);
								selectedRowKeys.splice(index, 1);
								this.selectedRows = selectedRows;
								this.selectedRowKeys = selectedRowKeys;
								this.tableKey += 1;
								return;
							}
						}
						if (selectedRows && selectedRows.length > 0) {
							let selectedRow = selectedRows[0];
							let isSameContract = record.contractId == selectedRow.contractId && record.contractType == selectedRow.contractType;
							if (isSameContract) {
								selectedRows.push(record);
								selectedRowKeys.push(record.id);
								this.selectedRows = selectedRows;
								this.selectedRowKeys = selectedRowKeys;
							}
						} else {
							selectedRows.push(record);
							selectedRowKeys.push(record.id);
							this.selectedRows = selectedRows;
							this.selectedRowKeys = selectedRowKeys;
						}
						this.tableKey += 1;
					}
				}
			};
		}
	}
};

const TransportModeList = [
	{ label: '汽运', value: 'AUTOMOBILE' },
	{ label: '火运', value: 'TRAIN' },
	{ label: '船运', value: 'SHIP' }
];

const searchList = [
	{
		decorator: ['no'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入合同编号、下煤计划编号或出库编号'
	},
	{
		decorator: ['receivingCompanyName'],
		addonBeforeTitle: '收货单位',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['storageDate'],
		addonBeforeTitle: '出库日期',
		type: 'datePicker',
		placeholder: '  请选择出库日期'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: TransportModeList
	},
	{
		decorator: ['goodsName'],
		addonBeforeTitle: '品名',
		type: 'input',
		placeholder: '请输入品名'
	}
];
const customRender = text => text || '-';
// 选择电子合同弹窗
export const columns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', customRender },
	{ title: '下煤计划编号', dataIndex: 'coalPlanNo', customRender },
	{
		title: '出库编号',
		dataIndex: 'serialNo',
		customRender
	},
	{
		title: '出库数量(吨)',
		dataIndex: 'weight',
		customRender
	},
	{
		title: '收货单位',
		dataIndex: 'receivingCompanyName',
		customRender
	},
	{ title: '出库日期', dataIndex: 'storageDate', customRender },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{ title: '车数', dataIndex: 'carsNumber', customRender }
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
