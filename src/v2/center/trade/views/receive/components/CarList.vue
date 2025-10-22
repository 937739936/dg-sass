<template>
	<a-modal
		width="900px"
		destroyOnClose
		@ok="handleOk"
		centered
		v-model="visible"
	>
		<div class="title">请选择车辆信息</div>
		<a-form
			:form="form"
			v-bind="formLayout"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="发货时间">
						<a-range-picker
							v-model="params2.deliverDate"
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							@change="deliverDateChange"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="到站时间">
						<a-range-picker
							v-model="params2.arriveDate"
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							@change="arriveDateChange"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item>
						<a-space>
							<a-button
								@click="search"
								type="primary"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="reset"
							>
								重置
							</a-button>
						</a-space>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				class="new-table"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
			</a-table>
		</div>
		<i-pagination
			style="padding: 0 20px; margin-bottom: 20px"
			:pagination="pagination"
			@change="getList"
		/>
	</a-modal>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { dispatchList } from '@/v2/center/trade/api/receive';
import { formLayout } from '@/v2/config/layoutConfig';

const columns = [
	{
		title: '车牌号',
		dataIndex: 'plateNumber'
	},
	{
		title: '发车时间',
		dataIndex: 'deliverDate'
	},
	{
		title: '到站时间',
		dataIndex: 'arriveDate'
	},
	{
		title: '发货量(吨)',
		dataIndex: 'deliverQuantity'
	}
];

export default {
	name: 'CarList',
	components: {
		iPagination
	},
	data() {
		return {
			columns,
			formLayout,
			form: this.$form.createForm(this),
			visible: false,
			dataSource: [],
			selectedRowData: [],
			params: {},
			params2: {},
			loading: false,
			selectedRowKeys: [],
			lineData: {},
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			}
		};
	},
	computed: {
		rowSelection() {
			const itSelf = this;
			const { selectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					if (itSelf.selectedRowKeys.includes(record.id)) {
						itSelf.selectedRowKeys.splice(
							itSelf.selectedRowKeys.findIndex(item => item === record.id),
							1
						);
						itSelf.selectedRowData.splice(
							itSelf.selectedRowKeys.findIndex(item => item === record.id),
							1
						);
					} else {
						itSelf.selectedRowKeys = [...itSelf.selectedRowKeys, record.id];
						itSelf.selectedRowData = [...itSelf.selectedRowData, record];
					}
				},
				onSelectAll: (selected, selectedRows, changeRows) => {
					if (selected) {
						const tempArr = selectedRows.map(item => {
							return item.id;
						});
						itSelf.selectedRowKeys = [...new Set([...tempArr, ...itSelf.selectedRowKeys])];
						itSelf.selectedRowData = [...new Set([...selectedRows, ...itSelf.selectedRowData])];
					} else {
						// 待剔除
						const tempArr = changeRows.map(item => {
							return item.id;
						});
						const selectedRowKeysCopy = [...itSelf.selectedRowKeys];

						itSelf.selectedRowKeys.forEach(item => {
							if (tempArr.includes(item)) {
								selectedRowKeysCopy.splice(
									selectedRowKeysCopy.findIndex(i => item === i),
									1
								);
								itSelf.selectedRowData.splice(
									selectedRowKeysCopy.findIndex(i => item === i),
									1
								);
							}
						});
						itSelf.selectedRowKeys = selectedRowKeysCopy;
					}
				}
			};
		}
	},
	methods: {
		showModal(orderNoList, orderSerialNo, batchNo) {
			this.orderSerialNo = orderSerialNo;
			this.batchNo = batchNo;
			this.visible = true;
			this.pagination.pageNo = 1;
			this.selectedRowKeys = orderNoList;
			this.selectedRowData = [];
			this.getList();
		},

		handleOk() {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.error('请至少选择一条行数据');
			} else {
				this.visible = false;
				this.$emit('getCarList', this.selectedRowKeys, this.selectedRowData);
			}
		},

		deliverDateChange(value, dateString) {
			this.params.deliverDateStart = dateString[0] + ' 00:00:00';
			this.params.deliverDateEnd = dateString[1] + ' 23:59:59';
		},
		arriveDateChange(value, dateString) {
			this.params.arriveDateStart = dateString[0] + ' 00:00:00';
			this.params.arriveDateEnd = dateString[1] + ' 23:59:59';
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loading = true;
			this.params.orderSerialNo = this.orderSerialNo;
			this.params.batchNo = this.batchNo;
			dispatchList(this.params)
				.then(res => {
					if (res.success) {
						this.dataSource = res.data.records;
						this.pagination.total = res.data.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.params = {};
			this.params2 = {};
			this.pagination.pageNo = 1;
			this.deliverDate = null;
			this.getList();
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 20px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
	margin-bottom: 20px;
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}
.table-wrap {
	padding: 20px;
}
</style>
