<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择下游合同"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<a-tabs
				v-model="contractType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="OFFLINE"
					tab="下游补录合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="ONLINE"
					tab="下游电子合同"
				>
				</a-tab-pane>
			</a-tabs>
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
					:pagination="false"
					:rowKey="record => record.id"
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
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { getTerminalContractList } from '@/v2/center/trade/api/pay';

import { getPopupContainer } from '@/v2/utils/factory.js';
import iPagination from "@sub/components/iPagination";
import { formatMoney } from '@sub/filters';
const searchListOn = [
	{
		decorator: ['terminalContractNo'],
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
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择煤种',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
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
	}
];
const searchListOff = [
	{
		decorator: ['terminalContractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('despatchTypeDict')
			.filter(item => item.value != 'TRAIN_ONESELF')
			.map(item => {
				return { value: item.value, label: item.text };
			})
	},
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
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	}
];
export default {
	name: 'RelationContract',
	props: {
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
					t.selectedRowKeys = [record.id];
					t.$forceUpdate();
					t.selectedInfo = record;
				}
			};
		},
		columns() {
			return [
				{ title: '合同编号', dataIndex: 'paperContractNo', fixed: 'left' },
				{ title: '买方企业名称', dataIndex: 'buyerName' },
				{ title: '收货人', dataIndex: 'consigneeCompanyName' },
				{
					title: '交货期限',
					dataIndex: 'execDateStart',
					customRender: (text, record) => (record.execDateStart ? `${record.execDateStart} - ${record.execDateEnd}` : '')
				},
				{ title: '签订日期', dataIndex: 'contractSignTime' },
				{ title: '运输方式', dataIndex: 'transTypeStr' },
				{ title: '合同数量(吨)', dataIndex: 'contractQuantity' },
				{ title: '合同价格(元/吨)', dataIndex: 'contractPrice', customRender: text => formatMoney(text, 2) },
				{ title: '品名', dataIndex: 'goodsName' }
			];
		}
	},
	data() {
		return {
			getPopupContainer,
			searchList: [],
			searchListOff,
			searchListOn,
			selectedRowKeys: [],
			selectedInfo: {},
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			tab: 'contract', //合同类型，电子ONLINE,线下OFFLINE
			loading: false,
			contractType: 'OFFLINE',
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
						t.selectedRowKeys = [record.id];
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
				pageNo: this.paginationRelation.pageNo || 1,
				pageSize: this.paginationRelation.pageSize || 10,
				contractType: this.contractType
			};
			if (this.paymentInfo) {
				params.paymentCompanyName = this.paymentInfo.terminalName;
			}
			getTerminalContractList(params)
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
							this.selectedRowKeys = [this.selectedInfo.id];
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showDrawer(record) {
			this.contractType = record ? record?.info?.contractType : 'OFFLINE';
			this.orderRelationModal = true;
			this.selectedRowKeys = [];
			this.selectedInfo = record ? record.info : {};
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.selectedRowKeys = [];
			this.selectedInfo = {};
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
			this.searchList = this.contractType === 'ONLINE' ? this.searchListOn : this.searchListOff;
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
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
