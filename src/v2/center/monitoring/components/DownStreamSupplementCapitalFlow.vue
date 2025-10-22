<template>
	<div>
		<a-tabs :default-active-key="cashTabIndex">
			<div
				slot="tabBarExtraContent"
				v-if="cashTabIndex == 0 && contractType != 2"
			>
				<a-button
					type="primary"
					@click="jumpPage()"
					v-auth="'dgChain:recPay:collectionFlow:xz'"
				>
					新增回款
				</a-button>
			</div>
			<a-tab-pane
				key="0"
				tab="回款流水"
			>
				<div style="width: 100%">
					<a-table
						v-if="cashData"
						:pagination="false"
						:columns="columns"
						:data-source="cashData.records"
						:rowKey="record => record.serialNo"
						:scroll="{ x: true }"
						style="width: 100%"
					>
						<span
							slot="payAmount"
							slot-scope="text"
						>
							{{ text | formatMoney(2) }}</span
						>
						<span
							slot="claimedAmount"
							slot-scope="text"
						>
							{{ text | formatMoney(2) }}</span
						>
						<span
							slot="currentContractClaimedAmount"
							slot-scope="text"
						>
							{{ text }}</span
						>
						<span
							slot="canClaimAmount"
							slot-scope="text"
						>
							{{ text | formatMoney(2) }}</span
						>
						<div
							slot="action"
							slot-scope="action, item"
						>
							<!-- 银行同步的跳转银行流水跳详情 -->
							<template v-if="item.dataSource == 3">
								<a
									@click="detail(item.bankCollectionId, item.collectionType)"
									v-auth="'dgChain:recPay:collectionFlow:ck'"
								>
									查看
								</a>
							</template>
							<template v-else>
								<a
									@click="
										jumpPage({
											collectionNo: item.serialNo,
											type: 'detail'
										})
									"
									v-auth="'dgChain:recPay:collectionFlow:ck'"
								>
									查看
								</a>
							</template>
							<!-- 手工录入可认领/修改/作废 -->
							<template v-if="item.dataSource == 2">
								<!-- 未完成认领的都可认领 -->
								<a
									v-auth="'dgChain:recPay:collectionFlow:rl'"
									@click="
										jumpPage({
											collectionNo: item.serialNo,
											type: 'claim'
										})
									"
									v-if="item.claimResult != 'CLAIMED'"
								>
									认领
								</a>
								<a
									v-auth="'dgChain:recPay:collectionFlow:xg'"
									@click="
										jumpPage({
											collectionNo: item.serialNo,
											type: 'edit',
											id: item.id
										})
									"
								>
									修改
								</a>
								<a
									v-auth="'dgChain:recPay:collectionFlow:zf'"
									@click="deleteConfirm(item.serialNo)"
								>
									作废
								</a>
							</template>
						</div>
					</a-table>
					<i-pagination
						:pagination="pagination"
						@change="getCashList"
					/>
					<p>
						当前合同关联{{ categoryDetail.currentContractRepayCount || 0 }}条回款数据，流水总金额:
						{{ (categoryDetail.currentContractRelRepayTotalAmount || 0) | formatMoney(2) }}元，本合同回款总金额：
						{{ (categoryDetail.currentContractClaimedTotalAmount || 0) | formatMoney(2) }}元
					</p>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="认领明细"
			>
				<div style="width: 100%">
					<p style="margin-bottom: 10px">
						本合同累计回款金额：{{ (categoryDetail.currentContractRelRepayTotalAmount || 0) | formatMoney(2) }}元，
						认领至当前业务线金额：{{ (categoryDetail.currentBusinessLineClaimedTotalAmount || 0) | formatMoney(2) }}元，
						认领至其他业务线金额：{{ (categoryDetail.otherBusinessLineClaimedTotalAmount || 0) | formatMoney(2) }}元，
						未上线数链业务回款金额：{{ (categoryDetail.offLineRepayTotalAmount || 0) | formatMoney(2) }}元
					</p>
					<div style="margin-bottom: 10px">
						展示数据范围：
						<a-checkbox-group
							@change="changeType"
							v-model="type"
						>
							<a-checkbox value="1"> 认领至当前业务线明细 </a-checkbox>
							<a-checkbox value="2"> 认领至其他业务线明细 </a-checkbox>
							<a-checkbox value="4"> 未上线数链业务线明细 </a-checkbox>
						</a-checkbox-group>
					</div>
					<a-table
						:pagination="false"
						:columns="financingColumns"
						:data-source="claimRecordData"
						:rowKey="
							(record, index) => {
								return String(index);
							}
						"
						:scroll="{ x: true }"
						style="width: 100%"
					>
						<div
							slot="repayAmount"
							slot-scope="repayAmount"
						>
							{{ repayAmount | formatMoney(2) }}元
						</div>
						<div
							slot="action"
							slot-scope="record"
							@click="onPageState"
							v-if="record.businessLineNo"
						>
							<a @click="goToDetail('yes', record)">查看</a>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import {
	API_GetClaimRecordList,
	API_GetClaimRecordCategory,
	API_BusinessMonitoringDownstreamPaymentList,
	checkBusinessLineEnd,
	invalidCollectionFlow
} from '@/v2/center/monitoring/api';
import { getBusinessLineListByCollection } from '@/v2/center/trade/api/collectionFlow';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapMutations, mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";
const columns = [
	{
		title: '收款编号',
		dataIndex: 'serialNo',
		align: 'center'
	},
	{
		title: '收款账号',
		dataIndex: 'receiveAccount',
		align: 'center'
	},
	{
		title: '对方户名',
		dataIndex: 'paymentName',
		align: 'center'
	},
	{
		title: '回款时间',
		dataIndex: 'payDate',
		customRender: text => {
			return text || '-';
		}
	},
	{
		title: '回款方式',
		dataIndex: 'receiveCategory',
		align: 'center'
	},
	{
		title: '回款金额',
		dataIndex: 'payAmount',
		align: 'center',
		scopedSlots: { customRender: 'payAmount' }
	},
	{
		title: '认领至本合同金额',
		dataIndex: 'currentContractClaimedAmount',
		align: 'center',
		scopedSlots: { customRender: 'currentContractClaimedAmount' }
	},
	{
		title: '认领状态',
		dataIndex: 'claimStatus',
		align: 'center'
	},
	{
		title: '可认领余额',
		dataIndex: 'canClaimAmount',
		scopedSlots: { customRender: 'canClaimAmount' },
		align: 'center'
	},
	{
		title: '数据来源',
		dataIndex: 'dataSourceStr',
		align: 'center'
	},
	{
		key: 'action',
		title: '操作',
		width: 160,
		align: 'center',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const financingColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		customRender(t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '认领金额',
		dataIndex: 'repayAmount',
		scopedSlots: { customRender: 'repayAmount' }
	},
	{ title: '业务线号', dataIndex: 'businessLineNo' },
	{
		title: '上游企业名称',
		dataIndex: 'upstreamSellerCompany'
	},
	{
		title: '认领人',
		dataIndex: 'createName'
	},
	{
		title: '认领时间',
		dataIndex: 'createDate'
	},
	{
		title: '回款认领类型',
		dataIndex: 'typeName'
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		slots: { title: 'customTitle' },
		scopedSlots: { customRender: 'action' }
	}
];
const noFinancingColumns = [
	{
		title: '非线上业务回款',
		dataIndex: 'unFinanceTotalAmount',
		key: 'unFinanceTotalAmount',
		scopedSlots: { customRender: 'unFinanceTotalAmount' }
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		slots: { title: 'customTitle' },
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'DownStreamCapitalFlow',
	filters: {
		filterCodeByValueName
	},
	data() {
		return {
			columns,
			financingColumns,
			noFinancingColumns,
			financeTotalAmount: '', // 线上业务回款金额
			noFinancingData: [],
			cashData: '',
			claimRecordData: null,
			businessLineType: '',
			pagination: {
				type: 'contractCash',
				total: 0, // 总条数
				pageNo: 1
			},
			type: [],
			cashTabIndex: this.$route.query.cashTabIndex, // 手动模式下回款认领tabIndex
			categoryDetail: {}
		};
	},
	props: [
		'orderNo',
		'contractId',
		'upOrderNo',
		'dynamicMonitoringDetail',
		'downOrderNo',
		'downOrderId',
		'contractType',
		'businessLineNo'
	],
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		}),
		repayTotalAmount() {
			let repayTotalAmount = 0;
			if (this.cashData.records && this.cashData.records[0] && this.cashData.records[0].repayTotalAmount) {
				repayTotalAmount = this.cashData.records[0].repayTotalAmount;
			}
			return repayTotalAmount;
		},
		currentContractCollectionAmount() {
			let currentContractCollectionAmount = 0;
			if (this.cashData.records && this.cashData.records[0] && this.cashData.records[0].currentContractCollectionAmount) {
				currentContractCollectionAmount = this.cashData.records[0].currentContractCollectionAmount;
			}
			return currentContractCollectionAmount;
		}
	},
	watch: {
		dynamicMonitoringDetail() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getTerminalModel();
		},
		orderNo() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getTerminalModel();
		}
	},
	async created() {
		this.businessLineType = this.$route.query.businessLineType;
		await this.getTerminalModel();
	},
	methods: {
		...mapMutations({
			VUEX_initListParmas: 'pagination/VUEX_initListParmas',
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		async jumpPage(data = {}, item = {}) {
			//判断是否可修改
			if (data.type == 'edit') {
				let res = await checkBusinessLineEnd({
					collectionNo: data.collectionNo
				});
				if (res.success) {
					if (res.result || res.data) {
						this.$message.error('该流水关联有已完结的业务线，不允许修改！');
						return;
					}
				} else {
					return;
				}
			}
			let downOrderId, downCompany;
			if (!data.type) {
				// 如果是新增，则将下游合同,企业传输过去默认选中
				downOrderId = this.downOrderId;
				downCompany = this.dynamicMonitoringDetail.downstreamBuyerCompany;
			}
			let path = '/center/collection/stream/add';
			if (data.type == 'detail') {
				path = '/center/fund/returned/detail';
			}
			if (!data.type) {
				const params = {
					pageSize: 10,
					pageNo: 1,
					downContractId: this.downOrderId
				};
				const res = await getBusinessLineListByCollection(params);
				const list = res.data.records || [];
				if (!list.length) {
					this.$message.error('当前业务线不支持新增回款');
					return;
				}
			}
			this.$router.push({
				path,
				query: {
					type: data.type,
					collectionNo: data.collectionNo,
					receiveSerialNo: data.collectionNo,
					source: 'business',
					downOrderId,
					downUscc: this.dynamicMonitoringDetail.downstreamBuyerCompanyUscc,
					id: data.id,
					businessLineNo: this.$route.query.businessLineNo,
					downCompany
				}
			});
		},
		//跳转银行流水详情
		detail(id, type) {
			if (id && type) {
				this.$router.push({
					path: '/center/collection/stream/detail',
					query: {
						id,
						type
					}
				});
			} else {
				this.$message.info('银行流水信息不完善，请确认！');
			}
		},
		deleteConfirm(collectionNo) {
			this.$confirm({
				title: '确认要作废流水吗？',
				onOk: () => {
					this.deleteFlow(collectionNo);
				}
			});
		},
		//作废
		deleteFlow(collectionNo) {
			invalidCollectionFlow({ receiveSerialNo: collectionNo }).then(res => {
				if (res.success) {
					this.$message.success('作废成功');
					this.getList();
				}
			});
		},
		getTerminalModel() {
			const { listParmas } = this;
			if (listParmas.type == this.pagination.type) {
				this.getCashList(listParmas.current);
				this.VUEX_initListParmas();
			} else {
				this.getCashList();
			}
			this.getClaimRecordList();
		},
		// 获取回款列表
		async getCashList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			const params = {
				pageNo,
				pageSize,
				orderSerialNo: this.upOrderNo,
				downOrderNo: this.downOrderNo || this.orderNo,
				businessLineType: this.businessLineType,
				t: new Date().getTime()
			};
			const res = await API_BusinessMonitoringDownstreamPaymentList(params);
			if (res.success) {
				this.cashData = res.data;
				this.pagination.total = res.data.total;
			}
		},
		onPageState() {
			// 点击操作中的按钮，保存分页状态
			this.VUEX_setListPamars(this.pagination);
		},
		goToDetail(flag, data) {
			// 查看认领回款明细
			let temp = {};
			if (flag == 'yes') {
				// yes表示平台业务，no表示非平台业务
				temp = {
					path: '/center/monitoring/dynamicMonitoring/downStream/claimDetail',
					query: {
						financing: flag,
						businessLineNo: data.businessLineNo
					}
				};
			} else {
				temp = {
					path: '/center/monitoring/dynamicMonitoring/downStream/claimDetail',
					query: {
						financing: flag,
						terminalContractId: this.downOrderId
					}
				};
			}
			this.$router.push(temp);
		},
		async getClaimRecordList() {
			const getAmountsAPI = API_GetClaimRecordCategory;
			const getClaimRecordListAPI = API_GetClaimRecordList;
			getAmountsAPI({
				terminalContractId: this.downOrderId,
				businessLineNo: this.businessLineNo || this.$route.query.businessLineNo
			}).then(res => {
				// 获取平台业务和非平台业务业务认领金额
				if (res.success) {
					this.financeTotalAmount = res.data ? res.data.financeTotalAmount : '';
					this.noFinancingData = [];
					if (res.data && res.data.offlineCollectUnClaimedAmount) {
						this.noFinancingData.push({
							unFinanceTotalAmount: res.data.offlineCollectUnClaimedAmount
						});
					}
					this.categoryDetail = res.data;
					for (const resKey in this.categoryDetail) {
						this.categoryDetail[resKey] = this.categoryDetail[resKey] ? this.categoryDetail[resKey] : 0;
					}
				}
			});
			const res = await getClaimRecordListAPI({
				terminalContractId: this.downOrderId,
				businessLineNo: this.businessLineNo || this.$route.query.businessLineNo,
				type: this.type.join(',')
			});
			if (res.success) {
				this.claimRecordData = res.data;
			}
		},
		async changeType() {
			const res = await API_GetClaimRecordList({
				terminalContractId: this.downOrderId,
				businessLineNo: this.businessLineNo || this.$route.query.businessLineNo,
				type: this.type.join(',')
			});
			if (res.success) {
				this.claimRecordData = res.data;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
::v-deep.unFinanceTable .ant-table-thead > tr:first-child > th:first-child {
	font-weight: bold;
	color: rgba(0, 0, 0, 0.65);
}
</style>
