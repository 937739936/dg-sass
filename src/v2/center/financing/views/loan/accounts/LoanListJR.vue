<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">应收类放还款管理</span>
				<a-button
					type="primary"
					@click="goFang"
					v-auth="'finance:repayB:loan'"
					v-if="financeCompanyUscc.includes(VUEX_ST_COMPANYSUER.companyUscc)"
				>
					放款登记
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
			></SlFormNew>
			<div :class="'record-list table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					style="margin-top: 22px"
				>
					<div
						slot="finAmount"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ convertCurrency(text) }} </template>
							{{ formatMoney(text) }}
						</a-tooltip>
					</div>
					<template
						slot="remainDay"
						slot-scope="text, record"
					>
						<span
							v-if="record.status === 'CLEARED'"
							class="remainDay3"
						>
							-
						</span>
						<span v-else-if="text >= 10">{{ text }}天</span>
						<span
							v-else-if="text >= 0"
							class="remainDay1"
							>{{ text }}天</span
						>
						<span
							v-else-if="text < 0"
							class="remainDay2"
						>
							超期{{ Math.abs(text) }}天
						</span>
						<span
							v-else
							class="remainDay3"
							>-</span
						>
					</template>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a
								v-auth="'finance:repayB:view'"
								href="javascript:;"
								@click="goToDetail(record)"
							>
								详情
							</a>

							<template v-if="!showHuan(record)">
								<a
									v-if="record.status != 'CLEARED' && record.financingType != 'LIQUIDITY_LOANS'"
									href="javascript:;"
									@click="syncRepay(record)"
								>
									还款查询
								</a>
							</template>
							<a
								v-if="showHuan(record)"
								href="javascript:;"
								v-auth="'finance:repayB:repay'"
								@click="goHuan(record)"
							>
								还款登记
							</a>
							<a
								v-if="showZf(record)"
								v-auth="'finance:repayB:cancel'"
								href="javascript:;"
								@click="zuofei(record)"
							>
								作废
							</a>
						</a-space>
					</div>
					<div
						slot="status"
						slot-scope="text, record"
					>
						<FinancingTipInfo :item="record" />
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<LoanJRAddSelectList ref="LoanJRAddSelectList" />
		<LoanJRAddSelectListZH ref="LoanJRAddSelectListZH" />
	</div>
</template>
<script>
const customRender = text => text || '-'; //空数据用-代替
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		customRender
	},
	{ title: '融资方', dataIndex: 'financier', key: 'financier', customRender },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName', customRender },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '放款金额(元)',
		dataIndex: 'finAmount',
		key: 'finAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '融资放款日期',
		dataIndex: 'beginDate',
		key: 'beginDate',
		customRender
	},
	{ title: '融资到期日期', dataIndex: 'endDate', key: 'endDate', customRender },
	{
		title: '保理手续费(元)',
		dataIndex: 'factoringFee',
		key: 'factoringFee',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '最近还款日期',
		dataIndex: 'repayDate',
		key: 'repayDate',
		customRender
	},
	{
		title: '还款本金(元)',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '还款利息(元)',
		dataIndex: 'repayInterest',
		key: 'repayInterest',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '本期应还利息(元)',
		dataIndex: 'currentUnpaidInterest',
		key: 'currentUnpaidInterest',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '应收账款流水号',
		dataIndex: 'receivableSerialNo',
		key: 'receivableSerialNo',
		customRender
	},
	{
		title: '应收账款金额(元)',
		dataIndex: 'receivableAmount',
		key: 'receivableAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '融资类型',
		dataIndex: 'financingTypeText',
		key: 'financingTypeText',
		customRender
	},
	{
		title: '付款流水号',
		dataIndex: 'paymentSerialNo',
		key: 'paymentSerialNo',
		customRender
	},

	{
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo',
		customRender
	},
	{
		title: '行业',
		dataIndex: 'industryTypeDesc',
		key: 'industryTypeDesc',
		customRender
	},
	{
		title: '距离还款日剩余',
		dataIndex: 'remainDay',
		fixed: 'right',
		scopedSlots: { customRender: 'remainDay' }
	},
	{
		title: '状态',
		fixed: 'right',
		dataIndex: 'statusText',
		key: 'statusText',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		fixed: 'right',
		key: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
import {
	API_GetLoanListJR,
	API_FinancingJRSync,
	API_LoanZuofei,
	API_FinancingLoanInvalidLoanByApply
} from '@/v2/center/financing/api/index.js';
import { formatMoney } from '@sub/filters';
import { mapGetters } from 'vuex';
import { convertCurrency, getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import constants from '@sub/utils/constants.js';
import { financeCompanyUscc } from './common.js';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import LoanJRAddSelectList from '../common/LoanJRAddSelectList.vue';
import LoanJRAddSelectListZH from '../common/LoanJRAddSelectListZH.vue';
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入融资编号/应收账款流水号/合同编号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '核心企业',
		type: 'input',
		placeholder: '请输入核心企业'
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业',
		type: 'select',
		placeholder: '请选择',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' }
		]
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '融资放款日',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '融资到期日',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		// 不要已作废
		options: filterCodeByKey('loanStatusDict').filter(item => item.value !== 'INVALID')
	},
	{
		decorator: ['remainDay'],
		addonBeforeTitle: '距离还款日期剩余',
		type: 'select',
		placeholder: '请选择剩余天数',
		options: [
			{ value: 'LE10', label: '0-10天' },
			{ value: 'GT10', label: '10天以上' },
			{ value: 'EXPIRED', label: '已超期' },
			{ value: 'CLEARED', label: '已结清' }
		]
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			convertCurrency,
			formatMoney,
			financeCompanyUscc,
			// 选择融资进行放还款
			financeFangUscc: [constants.zhzlUscc, constants.ghblUscc, constants.jhblUscc, constants.wwylUscc],
			assetsFangUscc: [],
			searchList,
			columns,
			url: {
				list: API_GetLoanListJR
			},
			finFlag: null,
			accountReceivableList: []
		};
	},
	components: {
		FinancingTipInfo,
		LoanJRAddSelectList,
		LoanJRAddSelectListZH
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted: function () {
		this.finFlag = this.financeFangUscc.includes(this.VUEX_ST_COMPANYSUER.companyUscc);
	},
	methods: {
		showHuan(record) {
			if (record.repayFlag == 'DATA_LINK_REGISTER') {
				//<!--状态为部分还款/已放款状态的记录后，出现“还款登记-->
				return record.status == 'LOANED' || record.status == 'PART_REPAY';
			}
			return false;
		},
		showZf(record) {
			if (record.loanFlag == 'REGISTER_BY_ASSET' || record.loanFlag == 'REGISTER_BY_APPLY') {
				return record.status == 'LOANED';
			}
			return false;
		},
		syncRepay(record) {
			this.$confirm({
				centered: true,
				title: '确定还款查询吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_FinancingJRSync({ loanId: record.id }).then(res => {
						if (res.data) {
							this.$message.success('操作成功');
						}
					});
				},
				onCancel() {}
			});
		},
		goToDetail(record) {
			// if (item.id) {
			//   this.$router.push("/center/loan/loanJiejuDetail?id=" + item.id);
			// }
			const { href } = this.$router.resolve({
				path: '/center/financing/financingDetail',
				query: {
					id: record.financingApplyId,
					bankUscc: record.bankUscc,
					handleType: 'detail'
				}
			});
			window.open(href, '_blank');
		},
		goHuan(record) {
			const path = '/center/loan/loanReceivableHuan';
			this.$router.push(`${path}?id=` + record.id);
		},
		goFang() {
			//   let path = "/center/loan/loanFangList"; // 选资产放款
			if (this.finFlag) {
				// path = "/center/loan/loanFangListZH"; // 选融资放款的
				this.$refs.LoanJRAddSelectListZH.showRelationList();
				return;
			}
			this.$refs.LoanJRAddSelectList.showRelationList();

			//   this.$router.push(path);
		},
		zuofei(record) {
			this.$confirm({
				centered: true,
				title: '是否确认作废该笔放款记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					if (record.loanFlag == 'REGISTER_BY_APPLY') {
						API_FinancingLoanInvalidLoanByApply(record.id).then(res => {
							if (res.data) {
								this.$message.success('作废成功');
								this.getList(1);
							}
						});
						return;
					}
					API_LoanZuofei({ loanId: record.id }).then(res => {
						if (res.data) {
							this.$message.success('作废成功');
							this.getList(1);
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	.remainDay1 {
		color: rgba(70, 130, 243, 1);
	}
	.remainDay2 {
		color: rgba(221, 68, 68, 1);
	}
	.remainDay3 {
		color: rgba(0, 0, 0, 0.25);
	}
}
</style>
