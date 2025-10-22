<template>
	<div>
		<a-tabs v-model="type">
			<a-tab-pane
				key="1"
				tab="付款流水"
			>
				<div style="width: 100%">
					<span
						class="mr16"
						:key="index"
						v-for="(item, index) in paymentStatistics"
					>
						{{ item.payTypeName }}：{{ item.payTypeAmount }}元
					</span>
					<a-table
						:pagination="false"
						:columns="capitalFlowColumns"
						:data-source="dataSource"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<a-space
							slot="action"
							slot-scope="record"
						>
							<a
								v-if="
									!isFinanceCompanyAndOnlineContract && record.paymentAttachmentInfo && record.paymentAttachmentInfo.length > 0
								"
								@click="$refs.multiAttachmentPreview.showModal(record.paymentAttachmentInfo)"
								>附件
							</a>
							<!--
                  “中原银行”和“善美供应链”和“宁夏银行”和“新爱建”时展示
                  0-自有；
                  1-善美保理-自有；
                  2-爱建信托
                  3-善美保理-供应链6.5
                  91310000132202077A 新爱建
                  91610139MA6U8HA76Y-善美保理-供应链；
                  9141000031741675X6-中原银行供应链；
                  product-shanmei-bill-善美融单
                  product-shanmei-bill-non-善美融单-非流转
                  91641200073834073D-宁夏银行 -->
							<a
								v-if="
									record.payType == '3' ||
									record.payType == '91310000132202077A' ||
									record.payType == '9141000031741675X6' ||
									record.payType == '91610139MA6U8HA76Y' ||
									record.payType == '91641200073834073D' ||
									record.payType == 'product-shanmei-bill' ||
									record.payType == 'product-shanmei-bill-non'
								"
								@click="showFinanceDetail(record)"
							>
								融资详情
							</a>
						</a-space>
						<template
							slot="attachments"
							slot-scope="text, record"
						>
							<!-- 如果存在附件进行展示 -->
							<a
								@click="showRefundModal(record)"
								v-if="record.attachmentsCount > 0"
							>
								附件
							</a>
						</template>
					</a-table>
					<i-pagination
						:pagination="pagination"
						size="small"
						@change="getList"
					/>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="2"
				tab="退款流水"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="refundColumns"
						:data-source="dataSource"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<a-space
							slot="action"
							slot-scope="record"
						>
							<a
								v-if="
									!isFinanceCompanyAndOnlineContract && record.paymentAttachmentInfo && record.paymentAttachmentInfo.length > 0
								"
								@click="$refs.multiAttachmentPreview.showModal(record.paymentAttachmentInfo)"
								>附件
							</a>
							<!--
                  “中原银行”和“善美供应链”和“宁夏银行”和“新爱建”时展示
                  0-自有；
                  1-善美保理-自有；
                  2-爱建信托
                  3-善美保理-供应链6.5
                  91310000132202077A 新爱建
                  91610139MA6U8HA76Y-善美保理-供应链；
                  9141000031741675X6-中原银行供应链；
                  product-shanmei-bill-善美融单
                  product-shanmei-bill-non-善美融单-非流转
                  91641200073834073D-宁夏银行 -->
							<a
								v-if="
									record.payType == '3' ||
									record.payType == '91310000132202077A' ||
									record.payType == '9141000031741675X6' ||
									record.payType == '91610139MA6U8HA76Y' ||
									record.payType == '91641200073834073D' ||
									record.payType == 'product-shanmei-bill' ||
									record.payType == 'product-shanmei-bill-non'
								"
								@click="showFinanceDetail(record)"
							>
								融资详情
							</a>
						</a-space>
						<template
							slot="attachments"
							slot-scope="text, record"
						>
							<!-- 如果存在附件进行展示 -->
							<a
								@click="showRefundModal(record)"
								v-if="record.attachmentsCount > 0"
							>
								附件
							</a>
						</template>
					</a-table>
					<i-pagination
						:pagination="pagination"
						size="small"
						@change="getList"
					/>
				</div>
			</a-tab-pane>
		</a-tabs>

		<FinanceDetail ref="financeDetail" />
		<MultiAttachmentPreview ref="multiAttachmentPreview" />
	</div>
</template>
<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_BusinessMonitoringUpstreamPaymentStatistics,
	API_BusinessMonitoringUpstreamPaymentList,
	API_BusinessMonitoringDownstreamPaymentStatistics,
	API_BusinessMonitoringDownstreamPaymentList,
	API_FullBusinessLineDetailPaymentStatistics,
	API_FullBusinessLineDetailPaymentList,
	API_GetUpstreamFinanceDetail,
	API_REFUNDLIST,
	API_REFUNDATTACHMENTLIST
} from '@/v2/center/monitoring/api/index';
import MultiAttachmentPreview from './MultiAttachmentPreview';
import iPagination from "@sub/components/iPagination";
import FinanceDetail from './FinanceDetail';
import { mapGetters } from 'vuex';

const capitalFlowColumns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '付款日期', dataIndex: 'payDate' },
	{ title: '付款类型', dataIndex: 'payMethodName' },
	{ title: '资金来源', dataIndex: 'payTypeName' },
	{ title: '付款金额(元)', dataIndex: 'payAmount' },
	{ title: '付款状态', dataIndex: 'statusName' },
	{ title: '融资编号', dataIndex: 'applySerialNo' },
	{ title: '融资类型', dataIndex: 'financingTypeText' },
	{ title: '融资金额', dataIndex: 'finAmount' },
	{ title: '放款日期', dataIndex: 'beginDate' },
	{ title: '融资到期日', dataIndex: 'endDate' },
	{ title: '还款本金', dataIndex: 'repayPrincipal' },
	{ title: '还款利息', dataIndex: 'repayInterest' },
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		width: 135,
		fixed: 'right'
	}
];
const refundColumns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '退款日期', dataIndex: 'refundDate' },
	{
		title: '资金来源',
		dataIndex: 'foundsSource',
		customRender() {
			return '自有资金';
		}
	},
	{ title: '付款金额（元）', dataIndex: 'refundAmount' },
	{ title: '付款状态', dataIndex: 'statusDesc' },
	{
		title: '操作',
		scopedSlots: { customRender: 'attachments' },
		fixed: 'right'
	}
];
const paymentAttachmentColumns = [
	{ title: '单据类型', dataIndex: 'typeName', key: 'typeName' },
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'CapitalFlow',
	mixins: [ListMixin],
	components: {
		iPagination,
		FinanceDetail,
		MultiAttachmentPreview
	},
	props: {
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		contractType: {
			type: [Number, String],
			default: 0
		},
		belongContractType: {
			type: [Number, String],
			default: 0
		},
		// 下游合同编号
		downOrderNo: {
			type: String,
			default: ''
		},
		downOrderId: {
			type: [String, Number],
			default: ''
		},
		contractNo: {
			type: String,
			default: ''
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			capitalFlowColumns,
			refundColumns,
			paymentAttachmentColumns,
			fileData: [],
			isNeedRotate: true,
			previewImage: '',
			previewVisible: false,
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			fileDataSource: [],
			paymentAttachmentInfo: [],
			paymentStatistics: [],
			businessLineType: '',
			paymentAttachmentModalVisible: false,
			fileList: [],
			financeCompany: '',
			type: '1', //查询类型
			url: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是金融机构并且是电子合同
		isFinanceCompanyAndOnlineContract() {
			if (this.financeCompany) {
				if (
					this.businessLineType === 'ONLINE' ||
					(this.contractType === 1 && this.businessLineType === 'UP') ||
					(this.contractType === 0 && this.businessLineType === 'DOWN')
				) {
					return true;
				}
				return false;
			}
			return false;
		}
	},
	created() {
		this.getCapitalFlowData();
		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.financeCompany = companyType == 'FINANCIAL_ORG';
	},
	watch: {
		curUpstream() {
			this.getCapitalFlowData();
		},
		orderNo() {
			this.getCapitalFlowData();
		},
		type() {
			//tabs变化时，重新查询
			this.getUpstreamPaymentList();
		}
	},
	methods: {
		getCapitalFlowData() {
			if (this.contractType !== 2) {
				if (this.belongContractType !== this.contractType) {
					return;
				}
			}
			this.businessLineType = this.$route.query.businessLineType;
			this.getUpstreamPaymentList();
			this.getUpstreamPaymentStatistics();
		},
		getUpstreamPaymentList() {
			if (this.type == 1) {
				//查询融资信息
				this.searchParams = {
					upOrderNo: this.curUpstream.upOrderNo || '',
					downOrderNo: this.downOrderNo || '',
					businessLineType: this.businessLineType,
					orderNo: this.orderNo,
					contractNo: this.contractNo
				};
				this.url.list = [
					API_BusinessMonitoringUpstreamPaymentList,
					API_BusinessMonitoringDownstreamPaymentList,
					API_FullBusinessLineDetailPaymentList
				][this.contractType];
				this.getList();
			} else {
				//查询退款信息
				//获取当前加载合同号,
				let contractNo = this.contractNo;
				this.searchParams = {
					contractNo,
					status: 'COMPLETE' //业务线只加载退款完成的
				};
				this.url.list = API_REFUNDLIST;
				this.getList(1, 10000);
			}
		},
		getUpstreamPaymentStatistics() {
			const params = {
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType: this.businessLineType,
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			const fct = [
				API_BusinessMonitoringUpstreamPaymentStatistics,
				API_BusinessMonitoringDownstreamPaymentStatistics,
				API_FullBusinessLineDetailPaymentStatistics
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.paymentStatistics = res.data;
				}
			});
		},
		showFinanceDetail(data) {
			//  跳转到融资详情
			const { serialNo, payType, payMethod } = data;
			API_GetUpstreamFinanceDetail({ serialNo }).then(res => {
				if (res.success) {
					const params = {
						serialNo,
						payType,
						payMethod,
						contractType: this.contractType,
						upOrderNo: this.curUpstream.upOrderNo,
						downOrderNo: this.downOrderNo,
						businessLineType: this.businessLineType
					};
					this.$refs.financeDetail.showModal(params);
				}
			});
		},
		//展示附件弹框
		showRefundModal(data) {
			//查询附件信息
			API_REFUNDATTACHMENTLIST({
				refundId: data.id,
				pageNo: 1,
				pageSize: 10000
			}).then(res => {
				if (res.success) {
					this.$refs.multiAttachmentPreview.showRefundModal(res.data.records);
				}
			});
		}
	}
};
</script>
