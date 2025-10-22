<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择应收账款"
			placement="right"
			:visible="orderRelationModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="onSearch"
				@resetFunc="resetFunc"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
			></SlFormNew>
			<!-- 表格 -->
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:customRow="onClickRow"
					:rowSelection="rowSelection"
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.serialNo"
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
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						:disabled="!selectedRowKeys.length"
						type="primary"
						@click="handleSubmit"
					>
						{{ type == 'list' ? '下一步' : '确定' }}</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';

import {
	// 融资申请列表
	API_FinancingApplyreceivableList
} from '@/v2/center/financing/api/index.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { formatMoney } from '@sub/filters';

const searchListOn = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入合同编号、应收账款流水号'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称'
	}
];

const relationOrderListColumns = [
	{ title: '应收账款流水号', dataIndex: 'serialNo', fixed: 'left' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '电厂名称', dataIndex: 'terminalName' },
	{ title: '出资机构', dataIndex: 'bankName' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '应收账款金额（元）', dataIndex: 'amount', customRender: t => formatMoney(t) },
	{ title: '应收账款起始日期', dataIndex: 'beginDate' },
	{ title: '应收账款到期日期', dataIndex: 'endDate' },
	{ title: '拟融资金额（元）', dataIndex: 'planFinancingAmount', customRender: t => formatMoney(t) },
	{ title: '应收账款申请日期', dataIndex: 'requestTime' }
];

export default {
	name: 'RelationContract',
	props: ['relateOrderNo', 'type', 'isShangHai'],
	data() {
		return {
			getPopupContainer,
			relationOrderListColumns,
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			searchListOn,
			searchList: [],
			loading: false,
			selectedRowKeys: [],
			currentRecord: {}
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {
		this.searchList = this.searchListOn;
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.serialNo];
					t.currentRecord = record; // eslint-disable-line
				}
			};
		}
	},
	methods: {
		formatMoney,
		resetFunc() {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
		},
		onSearch(data) {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList(data);
		},
		async getRelationOrderList(data) {
			let API = API_FinancingApplyreceivableList;
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation
			};
			delete params.showTotal;
			try {
				const res = await API(params);
				let result = res.result || res.data;
				const list = result.records || [];
				this.relationOrderList = list;
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
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		//外部引用方法打开弹框
		showRelationOrderList() {
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			};
			this.getRelationOrderList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = this.paginationRelation.pageSize) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.serialNo];
						this.currentRecord = record;
					}
				}
			};
		},
		selectContract(item) {
			this.orderRelationModal = false;
			// if(this.contractType == 'buy') {
			//    this.$store.commit('businessLine/updateBuyContract', item)
			// } else {
			//   this.$store.commit('businessLine/updateSellContract', item)
			// }
		},
		onClose() {
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.body.style.height = '';
			document.removeEventListener('touchmove', m, { passive: true });
			this.orderRelationModal = false;
		},
		handleSubmit() {
			this.$store.commit('financing/updateReceivable', this.currentRecord);
			this.orderRelationModal = false;

			if (this.type == 'list') {
				if (this.isShangHai) {
					this.$router.push('/center/financing/financingApplySH');
				} else {
					this.$router.push('/center/financing/financingApply');
				}
			}
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
.relation-contract-modal-btn[disabled] {
	border: 0;
}
</style>
