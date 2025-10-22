<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="查看未生成结清协议的融资"
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
			<Tab
				:list="statusData"
				@change="changeTab"
				:tabNum="tabNum"
			></Tab>
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
				>
					<div
						slot="status"
						slot-scope="text, record"
					>
						<!-- <FinancingTipInfo
							:item="record"
						/> -->
						<span class="status" :class="record.status">{{record.statusText}}</span>
					</div>
					<div
						slot="repayInterest"
						slot-scope="text"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="text"
								>{{ convertCurrency(text) }}
							</template>

							<span v-if="text">￥</span> {{ formatMoney(text) }}
						</a-tooltip>
					</div>
					<div
						slot="finAmount"
						slot-scope="text"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="text"
								>{{ convertCurrency(text) }}
							</template>
							<span v-if="text">￥</span> {{ formatMoney(text) }}
						</a-tooltip>
					</div>
					<div
						slot="repayPrincipal"
						slot-scope="text"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="text"
								>{{ convertCurrency(text) }}
							</template>
							<span v-if="text">￥</span> {{ formatMoney(text) }}
						</a-tooltip>
					</div>

					<template
						slot="action"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							@click="goDetail(items)"
							>详情</a
						>
						<a
							href="javascript:;"
							style="margin-left: 20px"
							v-auth="'finance:afterLoan:settleAgree:ckNotGenerate:generate'"
							v-if="items.status == 'CLEARED' && items.generateSettlementAgreementBoo && type == 'rest'"
							@click="createArg(items)"
							>生成结清协议</a
						>
						<a
							href="javascript:;"
							style="margin-left: 20px"
							v-auth="'dataStatistics:paymentManage:settleAgree:ckNotGenerate:generate'"
							v-if="items.status == 'CLEARED' && items.generateSettlementAgreementBoo  && type == 'admin'"
							@click="createArg(items)"
							>生成结清协议</a
						>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<!-- <div class="footer">
        <a-space :size="30">
          <a-button class="relation-contract-modal-btn" style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button class="relation-contract-modal-btn" type="primary" @click="handleSubmit">确定</a-button>
        </a-space>
      </div> -->
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from '@sub/components/iPagination';
import { formatMoney } from '@sub/filters';
import Tab from '@sub/financing/loanClose/Tab.vue';
import FinancingTipInfo from '@sub/financing/FinancingTipInfo.vue';
const searchListOn = [
	{
		decorator: ['integrationNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入融资编号、合同编号、应收账款编号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '融资状态',
		type: 'select',
		placeholder: '请选择融资状态',
		options: [
			{ value: 'LOANED', label: '已放款' },
			{ value: 'PART_REPAY', label: '部分还款' },
			{ value: 'CLEARED', label: '已结清' }
		]
	}
];
const customRender = t => t || '-';
const relationOrderListColumns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '保理合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' } },
	{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate', customRender },
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate', customRender },
	{ title: '已还本金(元)', dataIndex: 'repayPrincipal', key: 'repayPrincipal', scopedSlots: { customRender: 'repayPrincipal' } },
	{ title: '已还利息(元)', dataIndex: 'repayInterest', key: 'repayInterest', scopedSlots: { customRender: 'repayInterest' } },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{ title: '资金类型', dataIndex: 'paymentTypeName', key: 'paymentTypeName' },
	{ title: '应收账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{ title: '状态', key: 'statusText', dataIndex: 'statusText', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'RelationContract',
	props: {
		listApi: {},
		getUnClearStatic: {},
		settlementAgreement: {},
		type: {
			default:'rest'
		},
	}, // type=buy是关联采购合同，type=sell是关联销售合同
	data() {
		return {
			getPopupContainer,
			relationOrderListColumns,
			signTime: null,
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
			statusData: [
				{ value: '', label: '全部' },
				{ value: 'CLEARED', label: '待生成结清协议' }
			],
			statusTab: '',
			tabNum: {}
		};
	},
	components: {
		SlFormNew,
		iPagination,
		Tab,
		FinancingTipInfo
	},
	created() {
		this.searchList = this.searchListOn;
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		otherParams() {
			if(this.type == 'admin') {
				return {}
			}
			if(this.isBank) {
				return {
					pageSettlementAgreementQueryType: 'PAGE_REST_BANK'
				}
			}
			return {
				pageSettlementAgreementQueryType: 'PAGE_REST_RZ'
			};
		}
	},
	methods: {
		formatMoney,
		convertCurrency,
		resetFunc() {
			this.statusTab = '';
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.getStatic();
		},
		onSearch(data) {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList(data);
			this.getStatic();
		},
		async getRelationOrderList(data) {
			let API = this.listApi;
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation,
				statusTab: this.statusTab,
				...this.otherParams
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
		async getStatic() {
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation,
				statusTab: 'CLEARED',
				...this.otherParams
			};
			const res = await this.getUnClearStatic(params);
			this.tabNum = {
				CLEARED: res.data || 0
			};
		},
		//外部引用方法打开弹框
		show() {
			this.orderRelationModal = true;
			this.statusTab = '';
			this.resetValuesRelation();
		},
		changeTab(val) {
			this.statusTab = val;
			this.getRelationOrderList(this.searchModalParamsRelation);
			this.getStatic();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				pageNo: 1,
				pageSize: 10,
				total: 0
			};
			this.getStatic();
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
		selectContract(item) {
			this.orderRelationModal = false;
		},
		// 终止合同
		goDetail(item) {
			if(this.type == 'admin') {
				window.open(`/financing/financingDetail?id=${item.id}`)
			} else {
				window.open(`/center/financing/financingDetail?id=${item.id}&handleType=detail`)
			}
			
		},
		async createArg(item) {
			const params = {
				financingApplyId: item.id
			};
			const res = await this.settlementAgreement(params);
			this.$message.success('已成功生成结清协议');
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.orderRelationModal = false;
			this.getRelationOrderList();
			this.getStatic();
			this.$emit('success');
		},
		onClose() {
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.body.style.height = '';
			document.removeEventListener('touchmove', m, { passive: true });
			this.orderRelationModal = false;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
@import url('~@sub/style/style.less');

</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
.slDrawer {
	/deep/ .ant-drawer-header {
		width: 1136px !important;
	}
}
  .status {
    display: inline-block;
    padding: 1px 6px;
    align-items: flex-start;
    gap: 10px;
    text-align: center;
    border-radius: 4px;
    font-family: PingFang SC;
    font-size: 12px;
    margin-left: 4px;
    background: #C9DAFF;
    color: #596FA0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
  }
  .LOANED {
    background: #C5ECDD;
    color: #3EB384;
  }
  .INVALID {
    background: #E0E0E0;
    color: #A8A8A8;
  }
  .BANK_TO_BE_SIGNED,.TO_BE_SIGNED,.TRADER_TO_BE_SIGNED,.CORE_COMPANY_TO_BE_SIGNED  {
  background:#FFDAC8;
  color: #FF7937;
}
.OA_REJECT,.CORE_COMPANY_REJECT,.BANK_REJECT {
    background: #F2D0D0;
    color: #DD4444;
}
</style>
