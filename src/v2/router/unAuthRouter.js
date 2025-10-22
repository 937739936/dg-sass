import Login from '@/views/Login.vue';

export default [
	{
		path: '/login',
		name: 'login',
		component: Login
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('views/Register.vue')
	},
	{
		path: '/findpass',
		name: 'findpass',
		component: () => import('views/FindPassword.vue')
	},
	{
		nickName: '物流详情页火运',
		path: '/logistics/logisticsDetailTrain',
		name: 'logisticsDetailTrain',
		component: () => import('views/logistics/LogisticsDetailTrain.vue')
	},
	// 后端直接引用-勿删
	{
		nickName: '物流详情页火运',
		path: '/logistics/LogisticsDetailTrainNewInfo',
		name: 'LogisticsDetailTrainNewInfo',
		component: () => import('views/logistics/LogisticsDetailTrainNewInfo.vue')
	},
	// 后端直接引用-勿删
	{
		nickName: '物流详情页火运',
		path: '/logistics/logisticsSreenshot',
		name: 'logisticsSreenshot',
		component: () => import('views/logistics/LogisticsSreenshot.vue')
	},
	// 联运管家 新页面
	{
		nickName: '物流详情页火运',
		path: '/logistics/logisticsDetailTrainNew',
		name: 'logisticsDetailTrainNew',
		component: () => import('views/logistics/LogisticsDetailTrainNew.vue')
	},
	{
		nickName: '物流详情页船运',
		path: '/logistics/logisticsDetailShip',
		name: 'logisticsDetailShip',
		component: () => import('views/logistics/LogisticsDetailShip.vue')
	},
	{
		nickName: '物流详情页船舶信息',
		path: '/logistics/logisticsDetailShipInfo',
		name: 'logisticsDetailShipInfo',
		component: () => import('views/logistics/LogisticsDetailShipInfo.vue')
	},
	{
		nickName: '物流详情页汽运信息',
		path: '/logistics/logisticsDetailCar',
		name: 'logisticsDetailCar',
		component: () => import('views/logistics/LogisticsDetailCar.vue')
	},
	{
		nickName: '汽运轨迹信息',
		path: '/logistics/logisticsDetailCarNew',
		name: 'logisticsDetailCarNew',
		component: () => import('@/views/logistics/LogisticsDetailCarNew.vue')
	},
	{
		nickName: '船舶监控管理',
		path: '/logistics/monitoringShip',
		name: 'monitoringShip',
		component: () => import('views/logistics/MonitoringShip.vue')
	},
	{
		nickName: 'OA审批页',
		path: '/oAOrderAuditType1',
		name: 'oAOrderAuditType1',
		component: () => import('views/oa/OaOrderAuditTypeNew.vue')
	},
	{
		nickName: 'OA付款详情',
		path: '/oaPayDetail',
		name: 'oaPayDetail',
		component: () => import('views/oa/OaPayDetail.vue')
	},
	{
		nickName: 'OA结算单修改',
		path: '/oAStatementAudit',
		name: 'oAStatementAudit',
		component: () => import('views/oa/oAStatementAudit.vue')
	},
	{
		nickName: 'OA补充协议',
		path: '/oaSuppleAgreement',
		name: 'oaSuppleAgreement',
		component: () => import('views/oa/OaSuppleAgreement.vue')
	},
	{
		nickName: 'OA融资详情',
		path: '/oAFinancingDetail',
		name: 'oaFinancingDetail',
		component: () => import('views/oa/OaFinancingDetail.vue')
	},
	{
		nickName: '火运轨迹发运信息查询',
		path: '/travel/travelSearch',
		name: 'travelSearch',
		component: () => import('views/travel/travelSearch.vue')
	},
	{
		nickName: '融资详情',
		path: '/financing/financingDetail',
		name: 'financingDetail',
		component: () => import('@/v2/center/financing/views/financing/accounts/FinancingDetail')
	},
	{
		nickName: '货转凭证开具详情',
		path: '/oaGoodsTransferApplyDetailNew',
		name: 'OaGoodsTransferApplyDetailNew',
		component: () => import('@/v2/center/trade/views/goodsTransfer/GoodsTransferDetail.vue')
	},
	/* 钢材OA页面 */
	{
		nickName: 'OA采购合同详情审批页',
		path: '/oaSteelsContractBuyDetail',
		name: 'OaSteelsContractBuyDetail',
		component: () => import('@/v2/center/steels/views/oa/index.vue')
	},
	{
		nickName: 'OA补充协议详情审批页',
		path: '/oaSteelsSuppleAgreementDetail',
		name: 'OaSteelsSuppleAgreementDetail',
		component: () => import('@/v2/center/steels/views/contract/suppleAgreement/Detail.vue')
	},
	{
		nickName: 'OA付款详情审批页',
		path: '/oaSteelsFundsPaymentApplyTwoStep',
		name: 'OaSteelsFundsPaymentApplyTwoStep',
		component: () => import('@/v2/center/steels/views/funds/payment/PaymentApplyTwoStep.vue')
	},
	{
		nickName: 'OA放货单详情页',
		path: '/oaLetterNoticeDetail',
		name: 'OaLetterNoticeDetail',
		component: () => import('@/v2/center/steels/views/goodsTransfer/letterNotice/detail.vue')
	},
	{
		nickName: 'OA我的结算单详情页',
		path: '/oaSteelsSettleApplyDetail',
		name: 'OaSteelsSettleApplyDetail',
		component: () => import('@/v2/center/steels/views/settle/SettleApplyDetail.vue')
	},
	{
		nickName: 'OA提单页',
		path: '/oaApplyOrder',
		name: 'oaApplyOrder',
		component: () => import('views/oa/oaApplyOrder.vue')
	},
	{
		nickName: 'OA资产详情页',
		path: '/oaReceivableDetail',
		name: 'oaReceivableDetail',
		component: () => import('views/oa/oaReceivableDetail.vue')
	},
	{
		nickName: 'OA资产变更详情页',
		path: '/oaAccountsPayableChangeDetail',
		name: 'oaAccountsPayableChangeDetail',
		component: () => import('views/oa/oaAccountsPayableChangeDetail.vue')
	},
	{
		nickName: '发票识别',
		meta: {
			title: '发票识别'
		},
		path: '/invoice/discern',
		redirect: 'invoice/discern/list',
		component: () => import('@/v2/center/invoiceDiscern/views/index.vue'),
		children: [
			{
				nickName: '发票识别',
				path: 'list',
				meta: {
					title: '发票识别'
				},
				name: 'invoiceDiscernList',
				component: () => import('@/v2/center/invoiceDiscern/views/list.vue')
			},
			{
				nickName: '发票识别',
				path: 'add',
				meta: {
					title: '发票新增'
				},
				name: 'invoiceDiscernAdd',
				component: () => import('@/v2/center/invoiceDiscern/views/add.vue')
			},
			{
				nickName: '发票识别',
				path: 'pictureInvoice',
				meta: {
					title: '发票新增'
				},
				name: 'invoiceDiscernAddPicture',
				component: () => import('@/v2/center/invoiceDiscern/views/pictureInvoice.vue')
			},
			{
				nickName: '发票识别',
				path: 'fourInvoice',
				meta: {
					title: '发票新增'
				},
				name: 'invoiceDiscernAddFourElement',
				component: () => import('@/v2/center/invoiceDiscern/views/fourInvoice.vue')
			},
			{
				nickName: '发票识别',
				path: 'excelInvoice',
				meta: {
					title: '发票新增'
				},
				name: 'invoiceDiscernExcel',
				component: () => import('@/v2/center/invoiceDiscern/views/excelInvoice.vue')
			},
			{
				nickName: '发票识别',
				path: 'detail',
				meta: {
					title: '发票详情'
				},
				name: 'invoiceDiscernDetail',
				component: () => import('@/v2/center/invoiceDiscern/views/detail.vue')
			}
		]
	},
	{
		nickName: '免密登录',
		path: '/loginFree',
		name: 'loginFree',
		component: () => import('@/v2/views/loginFree.vue')
	},
	{
		nickName: '自定义form',
		path: '/diyForm',
		name: 'diyForm',
		component: () => import('@/v2/components/diyForm')
	}
];
