<template>
	<div class="slMain">
		<a-spin :spinning="actionloading">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>付款管理</span
				>
				<ActionTooltipButton
					:tooltipActionList="tooltipActionList"
					@clickTooltipButton="clickTooltipButton"
				>
					<div
						class="action-box"
						v-auth="'dgChain:recPay:payApply:newAdd'"
					>
						<img
							class="button-icon"
							src="@/v2/assets/imgs/common/add_new_icon.png"
							alt=""
						/>
						<span class="button-text">新增付款</span>
					</div>
				</ActionTooltipButton>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="changeSearch"
			></SlFormNew>
			<CountTabs
				:tabPanes="tabPanes"
				:exporting="exporting"
				@tabChange="tabChange"
				@exportClick="exportData"
			>
			</CountTabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot-scope="text, record"
						slot="payAmount"
					>
						<NumberFormatView
							:value="record.payAmount"
							:isShowMoneyTip="true"
						></NumberFormatView>
					</template>
					<template
						slot="paymentStatusDesc"
						slot-scope="text, item"
					>
						<PaymentStatusTag
							:statusDes="item.paymentStatusDesc"
							:status="item.paymentStatus"
							:paymentNo="item.paymentNo"
						/>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
		</a-spin>
		<StartAddPaymentModel ref="startAddPaymentModel" />
		<ConfirmModal ref="confirmModal"></ConfirmModal>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import ActionTooltipButton from '@/v2/center/trade/views/pay/payManage/components/ActionTooltipButton';
import StartAddPaymentModel from '@/v2/center/trade/views/pay/payManage/models/StartAddPaymentModel';
import {
	API_AdditionalPaymentButtonShow,
	API_GetPaymentAllPayTypeList,
	API_GetPaymentList,
	API_GetPaymenAllStatusCount,
	API_PaymentListExport,
	API_DeletePaymentRecord,
	API_InvalidPaymentRecord,
	API_GetPaymentDirectReSubmit,
	API_GetAdditionalPayEditParams
} from '@/v2/center/trade/api/pay';
import CountTabs from '@/v2/center/trade/views/pay/payManage/components/CountTabs';
import comDownload from '@sub/utils/comDownload.js';
import ConfirmModal from 'v2/components/modal/ConfirmModal';
import NumberFormatView from '@sub/trade/pay/components/NumberFormatView';
import PaymentStatusTag from '../components/PaymentStatusTag';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	mixins: [ListMixin],
	components: {
		ActionTooltipButton,
		StartAddPaymentModel,
		CountTabs,
		ConfirmModal,
		NumberFormatView,
		PaymentStatusTag
	},
	data() {
		return {
			actionloading: false, // 是否正在加载数据(目前 重新编辑、获取追加付款编辑信息时使用)
			exporting: false, // 是否正在导出
			isNeedAdditionalPayment: false, // 是否需要追加付款
			tabPanes: TabPanes, // 状态列表
			searchList: DefaultSearchList,
			columns: columns(this),
			url: {
				list: API_GetPaymentList
			},
			defaultParams: {
				paymentDisplayStatus: TabPanes[0].key // 默认显示全部
			}
		};
	},
	computed: {
		tooltipActionList() {
			let actionList = [
				{
					name: '新增付款',
					tips: '发起一笔新付款',
					icon: require('@/v2/assets/imgs/pay/new_payment_menu_icon.png'),
					key: 'NewPayment',
					auth: 'dgChain:recPay:payApply:newAdd'
				}
			];
			if (this.isNeedAdditionalPayment) {
				actionList.push({
					name: '追加付款',
					tips: '应用在追加融资场景',
					icon: require('@/v2/assets/imgs/pay/additional_payment_menu_icon.png'),
					key: 'AdditionalPayment',
					auth: 'dgChain:recPay:payApply:backhander'
				});
			}
			return actionList;
		}
	},
	watch: {
		dataSource: {
			deep: true,
			handler() {
				// 监听列表变化后进行状态统计
				this.getTabStatusCount();
			}
		}
	},
	mounted() {
		this.initPageConfigInfo();
	},
	methods: {
		// 初始化页面配置信息
		initPageConfigInfo() {
			this.getPayTypeList();
			this.checkIsNeedAdditionalPayment();
		},
		// 检查是否需要追加付款
		checkIsNeedAdditionalPayment() {
			API_AdditionalPaymentButtonShow().then(res => {
				if (res.success) {
					this.isNeedAdditionalPayment = res.data;
				}
			});
		},
		// 获取所有资金类型列表
		getPayTypeList() {
			API_GetPaymentAllPayTypeList().then(res => {
				if (res.success) {
					let payTypeList = res.data ?? [];
					let options = payTypeList.map(item => {
						return {
							value: item.payType,
							label: item.payTypeName
						};
					});
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'payType') {
							item.options = options;
						}
					});
				}
			});
		},
		// 获取所有状态的统计数量
		getTabStatusCount() {
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				...this.pageSize
			};
			API_GetPaymenAllStatusCount(params).then(res => {
				if (res.success) {
					let statusCountList = res.data ?? [];
					let tabPanes = this.tabPanes;
					tabPanes.map(item => {
						if (item.key === 'NEW' || item.key === 'REJECT') {
							item.count = statusCountList.find(countItem => countItem.displayStatus === item.key)?.count || '';
						}
					});
					this.tabPanes = tabPanes;
				}
			});
		},
		// 点击Tab切换
		tabChange(activeKey) {
			this.defaultParams.paymentDisplayStatus = activeKey;
		},
		// 点击悬浮按钮
		clickTooltipButton(tooltipAction) {
			switch (tooltipAction.key) {
				case 'NewPayment':
					// 新增付款
					this.$refs.startAddPaymentModel.addNewPayment();
					break;
				case 'AdditionalPayment':
					// 追加付款
					this.$router.push({ path: '/center/fund/pay/additional/payment/oneStep' });
					break;
				default:
					break;
			}
		},
		// 数据导出
		exportData() {
			// TODO: 导出功能待实现
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.exporting = true;
			API_PaymentListExport(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.exporting = false;
				});
		},
		actionMinList(record) {
			let operateSet = record.operateSet || [];
			let operatorVo = {
				canEdit: operateSet.includes('SAVE'),
				canAgainSubmit: operateSet.includes('REPEAT_SUBMIT'),
				canDirectAgainSubmit: operateSet.includes('REPEAT_SUBMIT_WHEN_ASSET_OA_REJECT'),
				canDelete: operateSet.includes('DELETE'),
				canCanal: operateSet.includes('CANCEL'),
				canDetail: true
			};
			// let operatorVo = {
			// 	canEdit: true,
			// 	canAgainSubmit: true,
			// 	canDelete: true,
			// 	canCanal: true,
			// 	canDetail: true
			// };
			return [
				{
					text: '修改',
					key: 'edit',
					condition: operatorVo.canEdit,
					auth: 'dgChain:recPay:payRecord:update',
					incident: 'paymentEdit'
				},
				{
					text: '重新提交',
					key: 'reSubmit',
					condition: operatorVo.canAgainSubmit,
					auth: 'dgChain:recPay:payRecord:againSubmit',
					incident: 'paymentResubmit'
				},
				{
					text: '重新提交',
					key: 'directReSubmit',
					condition: operatorVo.canDirectAgainSubmit,
					auth: 'dgChain:recPay:payRecord:againSubmit',
					incident: 'paymentDirectResubmit'
				},
				{
					text: '删除',
					key: 'delete',
					condition: operatorVo.canDelete,
					auth: 'dgChain:recPay:payRecord:cancel',
					incident: 'paymentDelete'
				},
				{
					text: '作废',
					key: 'invalid',
					condition: operatorVo.canCanal,
					auth: 'dgChain:recPay:payRecord:invalid',
					incident: 'paymentInvalid'
				},
				{
					text: '详情',
					key: 'detail',
					condition: operatorVo.canDetail,
					incident: 'pushToDetail',
					auth: 'dgChain:recPay:payRecord:view'
				}
			];
		},
		// 付款编辑
		paymentEdit(record) {
			if (record.additional == true) {
				// 追加付款数据
				this.additionalPaymentEdit(record);
				return;
			}
			this.$refs.startAddPaymentModel.paymentEdit(record);
		},
		// 付款重新提交
		paymentResubmit(record) {
			this.$refs.startAddPaymentModel.paymentResubmit(record);
		},
		// 付款直接重新提交(资产OA审核失败以后重新提交接口)
		paymentDirectResubmit(record) {
			this.actionloading = true;
			API_GetPaymentDirectReSubmit({ paymentId: record.id }).then(res => {
				if (res.success) {
					this.$message.success('重新提交成功');
					this.getList();
					let data = res.data || {};
					const id = data.receivableId
					const status = data.receivableStatus
					switch (data.financingType) {
						case 'ACCOUNTS_RECEIVABLE_LOANS':
							this.$router.push('/center/assets/payable/manage/edit?id='+id+'&activeIndex=0&status='+status);
							break;
						case 'PRE_PAYMENT_LOANS':
							this.$router.push('/center/assets/advance/edit?id='+id+'&activeIndex=0');
							break;
						case 'COUNTERFOIL_LOANS':
							this.$router.push('/center/assets/payable/manage/edit?id='+id+'&activeIndex=0&status='+status);
							break;
						default:
							break;
					}
				}
			}).finally(() => {
				this.actionloading = false;
			});;
		},
		// 付款删除
		paymentDelete(record) {
			this.$refs.confirmModal.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该付款吗，删除后无法恢复',
				confirm: () => {
					API_DeletePaymentRecord({ paymentNo: record.paymentNo }).then(res => {
						if (res.success) {
							this.$message.success('删除成功');
							this.getList();
						}
					});
				}
			});
		},
		// 付款作废
		paymentInvalid(record) {
			this.$refs.confirmModal.showModal({
				modalTitle: '确认作废',
				modalText: '确认要作废该付款吗？',
				confirm: () => {
					API_InvalidPaymentRecord({ paymentNo: record.paymentNo }).then(res => {
						if (res.success) {
							this.$message.success('付款已作废');
							this.getList();
						}
					});
				}
			});
		},
		// 跳转到详情页
		pushToDetail(record) {
			// 详情
			this.$router.push({
				path: '/center/fund/pay/record/detail',
				query: {
					id: record.id
				}
			});
		},
		// 追加付款编辑
		additionalPaymentEdit(record) {
			this.actionloading = true;
			API_GetAdditionalPayEditParams({ paymentId: record.id }).then(res => {
				if (res.success) {
					let i = {...record, ...res.data };
					let query = {
							mainPaymentNo: i.mainPaymentNo,
							orderNo: i.orderNo,
							id: i.id,
							orderId: i.orderId,
							sellerName: i.sellerName,
							coalType: i.coalType,
							transType: i.transportMode,
							contractNo: i.contractNo,
							orderType: i.orderType,
							serialNo: i.serialNo,
							isAdditionalPaymentCreat: '',
							additionalPaymentEdit: 'additionalPaymentEdit',
							type: 'overview',
							orderBusinessType: i.orderBusinessType,
							CYFlag: ['STEAM_COAL_013', 'COKING_COAL_005', 'COKING_008'].includes(i.contractTemplate) ? 1 : 0,
							sellerUscc: i.sellerUscc,
							isBZCY: i.orderBusinessType === 'WAREHOUSE_RECEIPTS_PLEDGE' ? 1 : 0,
							isCheckPay: '',
						};
						this.$router.push({
							path: '/center/fund/pay/additional/payment/twoStep',
							query: query
						});
				}
			}).finally(() => {
				this.actionloading = false;
			});
		}
	}
};

// 所有的状态列表
const TabPanes = [
	{
		tab: '全部',
		key: 'ALL',
		count: ''
	},
	{
		tab: '待提交',
		key: 'NEW',
		count: ''
	},
	{
		tab: '驳回',
		key: 'REJECT',
		count: ''
	},
	{
		tab: '审批中',
		key: 'AUDITING',
		count: ''
	},
	{
		tab: '资产整理中',
		key: 'ASSET_ARRANGING',
		count: ''
	},
	{
		tab: '融资放款中',
		key: 'FINANCE_REPAYING',
		count: ''
	},
	{
		tab: '待收款确认',
		key: 'WAIT_REPAY_CONFIRM',
		count: ''
	},
	{
		tab: '已付款',
		key: 'PAYED',
		count: ''
	},
	{
		tab: '无效',
		key: 'INVALID',
		count: ''
	}
];

// 默认搜索表单数据
const DefaultSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、资金流水号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['paymentType'],
		addonBeforeTitle: '付款类型',
		type: 'select',
		placeholder: '请选择付款类型',
		options: [
			{ value: 'PRE_PAYMENT', label: '预付款' },
			{ value: 'PRE_SETTLEMENT', label: '预结算付款' },
			{ value: 'SETTLEMENT', label: '结算付款' }
		]
	},
	{
		decorator: ['planPayDate'],
		addonBeforeTitle: '付款日期',
		type: 'rangePicker',
		realKey: ['planPayDateBegin', 'planPayDateEnd']
	},
	{
		decorator: ['payType'],
		addonBeforeTitle: '资金来源',
		type: 'select',
		placeholder: '请选择资金来源',
		options: []
	},
	{
		decorator: ['orderBusinessType'],
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

const customRender = text => text || '-';
const columns = function (that) {
	return [
		{
			title: '合同编号',
			dataIndex: 'contractNo',
			customRender
		},
		{
			title: '收款方', //卖方企业名称
			dataIndex: 'sellerName',
			customRender
		},
		{
			title: '付款类型',
			dataIndex: 'paymentTypeDesc',
			customRender
		},
		{
			title: '资金来源', // 资金类型
			dataIndex: 'payTypeName',
			customRender
		},
		{
			title: '付款金额(元)',
			dataIndex: 'payAmount',
			scopedSlots: { customRender: 'payAmount' }
			// customRender
		},
		{
			title: '付款日期',
			dataIndex: 'planPayDate',
			customRender
		},
		{
			title: '资金流水号',
			dataIndex: 'paymentNo', // 付款单号
			customRender
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			customRender
		},
		{
			title: '付款状态',
			dataIndex: 'paymentStatusDesc',
			scopedSlots: {
				customRender: 'paymentStatusDesc'
			},
			fixed: 'right'
		},
		{
			key: 'action',
			title: '操作',
			fixed: 'right',
			customRender: (text, record) => {
				return that.actionMinDiv(record);
			}
		}
	];
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.action-box {
		background: @primary-color;
		height: 32px;
		padding: 0 14px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		.button-icon {
			width: 14px;
			height: 14px;
		}
		.button-text {
			margin-left: 4px;
			color: #fff;
			font-size: 14px;
		}
	}
	.statusDes {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 20px;
		background: #c1d7ff;
		color: #4682f3;
		cursor: pointer;
		&.status-1 {
			// 待提交
			background: #c1d7ff;
			color: #4682f3;
		}
		&.status-2 {
			// 已生效
			background: #c5ecdd;
			color: #3eb384;
		}
		&.status-3 {
			// 审核
			background: #ffdbc8;
			color: #ff7937;
		}
		&.status-4 {
			// 驳回
			background: #f2d0d0;
			color: #dd4444;
		}
	}
}
</style>