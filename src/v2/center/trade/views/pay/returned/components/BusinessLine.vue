<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择业务线"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
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
					:dataSource="relationOrderList"
					:columns="columns"
					:customRow="onClickRow"
					rowKey="lineNo"
					:pagination="false"
					:loading="loading"
				>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="relation-contract-modal-btn"
						style="margin-right: 10px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						style="width: 118px"
						type="primary"
						@click="handleSubmit"
						:disabled="!selectedRowKeys.length"
						>确认</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { getBusinessLineListByCollection } from '@/v2/center/trade/api/pay';

import { getPopupContainer } from '@/v2/utils/factory.js';
import iPagination from "@sub/components/iPagination";

const columns = [
	{ title: '业务线号', dataIndex: 'lineNo', fixed: 'left' },
	{ title: '业务线名称', dataIndex: 'lineName' },
	{ title: '采购合同编号', dataIndex: 'upContractNo' },
	{ title: '采购合同签订日期', dataIndex: 'upstreamContractSignDate' },
	{ title: '销售合同编号', dataIndex: 'downContractNo' },
	{ title: '销售合同签订日期', dataIndex: 'downstreamContractSignDate' }
];
const searchList = [
	{
		decorator: ['keyNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入业务线号、订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	}
];
export default {
	name: 'RelationContract',
	props: {
		currentRow: {
			default: () => {
				return {};
			}
		},
		paymentInfo: {}
	},
	computed: {
		//电子合同，线下合同表头不同
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.lineNo];
					t.$forceUpdate();
					t.selectedInfo = record;
				}
			};
		}
	},
	data() {
		return {
			getPopupContainer,
			searchList,
			selectedRowKeys: [],
			selectedInfo: {},
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			selected: {}, // 关联合同被选中的数据
			tab: 'contract', //合同类型，电子on,线下off
			loading: false,
			columns,
			info: {}
		};
	},
	components: {
		iPagination,
		SlFormNew
	},
	methods: {
		onClickRow(record) {
			let t = this;
			return {
				on: {
					click: () => {
						t.selectedRowKeys = [record.lineNo];
						t.$forceUpdate();
						t.selectedInfo = record;
					}
				}
			};
		},
		changeSearch(data) {
			this.paginationRelation.pageNo = 1;
			this.paginationRelation.current = 1;
			this.searchModalParamsRelation = data || {};

			this.getRelationOrderList(data);
		},
		getRelationOrderList(data) {
			this.searchModalParamsRelation = data || {};
			this.loading = true;

			const params = {
				...this.searchModalParamsRelation,
				orderNo: this.currentRow.orderNo,
				pageNo: this.paginationRelation.pageNo || 1,
				pageSize: this.paginationRelation.pageSize || 10
			};
			if (this.paymentInfo) {
				params.paymentCompanyName = this.paymentInfo.terminalName;
			}

			getBusinessLineListByCollection(params)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.relationOrderList = result.records;
						const paginationRelation = {
							total: result.total,
							pageSize: result.size,
							current: result.current,
							pageNo: result.current,
							showTotal: function (total) {
								return `共${total}条记录 第${result.current}页 `;
							}
						};
						this.paginationRelation = paginationRelation;
						if (JSON.stringify(this.selectedInfo) !== '{}') {
							this.selectedRowKeys = [this.selectedInfo.lineNo];
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showDrawer(record) {
			this.orderRelationModal = true;
			this.selectedRowKeys = [];
			this.selectedInfo = record ? record.info : {};
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = this.paginationRelation.pageSize) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		handleSubmit() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择数据');
				return;
			}
			this.orderRelationModal = false;
			this.$emit('select', this.selectedInfo);
		},
		onClose() {
			this.orderRelationModal = false;
			this.selectedRowKeys = [];
			this.selectedInfo = {};
			this.$emit('noSelect');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
.slDrawer {
	/deep/ .table-box .new-table .ant-table-thead > tr > th:first-child {
		padding: 12px;
	}
	/deep/ .table-box .new-table .ant-table-tbody > tr > td:first-child {
		padding: 12px !important;
	}
}
.tabs-box {
	position: relative;
}
.export-box {
	position: absolute;
	right: 0;
	top: 16px;
	text-align: right;
	cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: -2px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: #4682f3;
		line-height: 20px;
	}
}
.tips-box {
	border-radius: 4px;
	background: #f3f6fb;
	padding: 14px;
	color: #77889d;
	font-size: 14px;
	margin-top: 20px;
	margin-bottom: 30px;
	p:first-child {
		color: rgba(0, 0, 0, 0.8);
		font-family: PingFang SC;
		font-size: 16px;
		margin-bottom: 14px;
		font-weight: 600;
	}
}
</style>
