import CONSTANTS from '@sub/utils/constants';
// 订单详情
var orderDetail = function (o) {
	if (!o) return;
	var url = '';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.id && o.companyId) {
		// orderType : BUY采购订单
		// orderType : SELL 销售订单

		if (o.orderType == CONSTANTS.orderTypeDict.BUY) {
			url = `/center/contract/buy/online/detail?id=${o.id}&type=BUY`;
		}
		if (o.orderType == CONSTANTS.orderTypeDict.SELL) {
			url = `/center/contract/sell/online/detail?id=${o.id}&type=SELL`;
		}
	}

	return url;
};
// 收发货详情
var receiveDetail = function (o, type) {
	let url = '';
	// type : 1 发货详情
	// type : 2 收货详情
	if (!o) return;
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.deliverId) {
		if (type == 1) {
			url = `/center/receive/send/detail?deliverId=${o.deliverId}&from=release`;
		} else if (type == 2) {
			url = `/center/receive/accept/detail?deliverId=${o.deliverId}&from=receive`;
		}
	}
	return url;
};
// 付款详情
var payDetail = function (o) {
	let url = '';
	if (!o) return;
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.id && o.orderId) {
		url = `/center/fund/pay/record/detail?id=${o.id}&orderId=${o.orderId}&type=overview&orderType=${o.orderType}`;
	}
	return url;
};
// 货转详情
var goodsTransferDetail = function (o) {
	let url = '';
	if (!o) return;
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.goodsTransferNo && o.orderSerialNo) {
		url = `/center/transfer/send/detailnew?no=${o.goodsTransferNo}&orderNo=${o.orderSerialNo}`;
	}
	return url;
};
// 收款确认
var collectConfirm = function (o) {
	let url = '';
	if (!o) return;
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.id) {
		url = `/center/fund/collect/confirm?id=${o.id}`;
	} else {
		// console.log('收款确认url参数错误:', o);
	}

	return url;
};
// 结算单详情
var settleDetail = function (o) {
	let url = '';
	if (!o) return;
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.statementId) {
		url = `/center/settle/buy/onlinedetail?id=${o.statementId}`;
	}
	return url;
};
// 业务监控详情
var monitoringDetail = function (o) {
	if (!o) return;
	var url = '';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.businessLineNo) {
		url = `/center/businessline/detail?businessLineNo=${o.businessLineNo}`;
	}
	return url;
};

// 退款详情
var refundDetail = function (o) {
	if (!o) return;
	var url = '';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.id) {
		url = `/center/fund/refund/detail?id=${o.id}`;
	}
	return url;
};

var suppleAgreementSign = function (o) {
	if (!o) return;
	var url = '';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	var isInitiator = o.isInitiator ? 'isInitiator' : '';
	if (o && o.id) {
		url = `/center/contract/agreement/stamp?id=${o.id}&isInitiator=${isInitiator}`;
	}
	return url;
};

var suppleAgreementDetail = function (o) {
	if (!o) return;
	var url = '';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.id) {
		url = `/center/contract/agreement/detail?id=${o.id}`;
	}
	return url;
};

var logisticsPlatformInRecordList = function (o) {
	if (!o) return;
	var url = '/center/logisticsPlatform/in';
	o = Object.keys(o).length ? JSON.parse(o) : {};
	if (o && o.stationId) {
		url = `/center/logisticsPlatform/in?stationId=${o.stationId}`;
	}
	return url;
};
//所有的结算的那类型列表
const statementTypeList = [
	'statement01',
	'statement06',
	'STATEMENT_RECEIVER_INNER_AUDIT_REJECT_TO_ORIGINATOR',
	'STATEMENT_RECEIVER_SEAL',
	'STATEMENT_RECEIVER_REJECT',
	'STATEMENT_ORIGINATOR_CANCEL',
	'STATEMENT_INVALID_ORIGINATOR_CANCEL',
	'STATEMENT_ORIGINATOR_SEAL',
	'STATEMENT_RECEIVER_CANCEL_TO_ORIGINATOR',
	'STATEMENT_INVALID_ORIGINATOR_AUDIT_REJECT',
	'statement02',
	'STATEMENT_INVALID_RECEIVER_SEAL',
	'STATEMENT_INVALID_ORIGINATOR_SEAL',
	'statement08',
	'STATEMENT_RECEIVER_INNER_AUDIT_AGREE',
	'STATEMENT_ORIGINATOR_INNER_AUDIT_AGREE',
	'STATEMENT_INVALID_RECEIVER_REJECT',
	'statementInvalid01',
	'STATEMENT_INVALID_ORIGINATOR_AUDIT_AGREE',
	'STATEMENT_RECEIVER_INNER_AUDIT_REJECT_TO_RECEIVER',
	'STATEMENT_ORIGINATOR_INNER_AUDIT_REJECT',
	'statement07',
	'STATEMENT_INVALID_RECEIVER_CANCEL_TO_ORIGINATOR',
	'statement05',
	'STATEMENT_INVALID_RECEIVER_CANCEL_TO_RECEIVER',
	'STATEMENT_RECEIVER_CANCEL_TO_RECEIVER',
	'STATEMENT_INVALID_RECEIVER_AUDIT_AGREE',
	'STATEMENT_INVALID_RECEIVER_AUDIT_REJECT_TO_RECEIVER',
	'STATEMENT_INVALID_RECEIVER_AUDIT_REJECT_TO_ORIGINATOR'
];

export function getMessageListMap(obj) {
	let result = [
		{
			type: 'user01',
			ifShowBtn: false
		},
		{
			type: 'user02',
			ifShowBtn: false
		},
		{
			type: 'user03',
			ifShowBtn: true,
			url: '/center/message/index',
			selectKey: '/center/person/company',
			menuTitle: '个人管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user04',
			ifShowBtn: true,
			url: '/center/message/index',
			selectKey: '/center/person/company',
			menuTitle: '个人管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user05',
			ifShowBtn: false
			// ifShowBtn:true,
			// url:'/center/person/company?defaultKey=2',
			// selectKey:'/center/person/company',
			// menuTitle:'个人管理',
			// barFlag:1,
			// companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user06',
			ifShowBtn: true,
			url: '/center/account/person/info',
			selectKey: '/center/account/person/info',
			menuTitle: '个人管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user07',
			ifShowBtn: true,
			url: '/center/account/person/info',
			selectKey: '/center/account/person/info',
			menuTitle: '个人管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user08',
			ifShowBtn: false
		},
		{
			type: 'user09',
			ifShowBtn: false
		},
		{
			type: 'user10',
			ifShowBtn: true,
			url: '/center/account/company/info',
			selectKey: '/center/account/company/info',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user11',
			ifShowBtn: true,
			url: '/center/account/company/info',
			selectKey: '/center/account/company/info',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user12',
			ifShowBtn: true,
			url: '/center/company/certificate',
			selectKey: '/center/company/certificate',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user13',
			ifShowBtn: true,
			url: '/center/company/certificate',
			selectKey: '/center/company/certificate',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user14',
			ifShowBtn: false
		},
		{
			type: 'user16',
			ifShowBtn: true,
			url: '/center/account/company/user?activeKey=2',
			selectKey: '/center/account/company/user',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user17',
			ifShowBtn: true,
			url: '/center/account/company/info',
			selectKey: '/center/account/company/info',
			menuTitle: '企业管理',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'user18',
			ifShowBtn: true,
			url: '/center/message/notice/detail',
			selectKey: '/center/message/notice/detail',
			menuTitle: '系统公告',
			barFlag: 'zhanghu',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order01',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order02',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order03',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order04',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order05',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order06',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order07',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order08',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order09',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		// order15：订单推送OA成功，跳转到订单详情页；
		// orderStop1：订单终止推送OA成功，跳转到订单详情页；
		{
			type: 'order15',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'orderStop1',
			ifShowBtn: true,
			url: orderDetail(obj),
			selectKey: obj && Object.keys(obj).length && JSON.parse(obj).orderType == 0 ? '/center/order/sell' : '/center/order/buy',
			menuTitle: '我的订单',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},

		{
			type: 'deliver01',
			ifShowBtn: true,
			url: receiveDetail(obj, 1),
			selectKey: '/center/receive/send/list',
			menuTitle: '收发货管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'deliver02',
			ifShowBtn: true,
			url: receiveDetail(obj, 2),
			selectKey: '/center/receive/accept/list',
			menuTitle: '收发货管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'deliver03',
			ifShowBtn: true,
			url: receiveDetail(obj, 1),
			selectKey: '/center/receive/send/list',
			menuTitle: '收发货管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'deliver04',
			ifShowBtn: true,
			url: receiveDetail(obj, 1),
			selectKey: '/center/receive/send/list',
			menuTitle: '收发货管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'deliver05',
			ifShowBtn: true,
			url: receiveDetail(obj, 1),
			selectKey: '/center/receive/send/list',
			menuTitle: '收发货管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		// {
		//     type: 'payment01',
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type: 'payment05', // 付款申请admin平台通过
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type: 'payment06', // 付款申请admin平台驳回
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type: 'payment02',
		//     ifShowBtn: false,
		// },
		//payment08：推送OA成功，跳转到付款详情页
		// {
		//     type: 'payment08', // 付款申请admin平台驳回
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },

		//payment09：上游付款成功推送OA，跳转到付款详情
		// {
		//     type: 'payment09',
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },

		//货转申请驳回
		{
			type: 'goodsTransferReject',
			ifShowBtn: true,
			url: goodsTransferDetail(obj),
			selectKey: '/center/transfer/goodsTransfer/list',
			menuTitle: '货转详情',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		//付款申请驳回
		// {
		//     type: 'payConfirmReject',
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		//通过付款申请
		// {
		//     type: 'payConfirmSuccess',
		//     ifShowBtn: true,
		//     url: collectConfirm(obj),
		//     selectKey: '/center/fund/collect/confirm',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		//收款信息驳回
		// {
		//     type: 'receiveConfirmReject',
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		//收款信息通过
		// {
		//     type: 'receiveConfirmSuccess',
		//     ifShowBtn: true,
		//     url: payDetail(obj),
		//     selectKey: '/center/fund/pay/record/list',
		//     menuTitle: '我的收付款',
		//     barFlag: 'gyl',
		//     companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		//自动收款确认，付款方收到消息
		// {
		//     type: 'payAutoConfirmSuccess',
		//     ifShowBtn: false,
		// },
		//自动收款确认，收款方收到消息
		// {
		//     type: 'receiveAutoConfirmSuccess',
		//     ifShowBtn: false,
		// },
		...statementTypeList.map(item => {
			return {
				type: item,
				ifShowBtn: true,
				url: settleDetail(obj),
				menuTitle: '结算单管理',
				barFlag: 'gyl',
				companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
			};
		}),

		{
			type: 'servicefeeStatement01',
			ifShowBtn: true,
			url: `/center/financeCenter/service/myServiceFee`,
			selectKey: '/center/financeCenter/service/myServiceFee',
			menuTitle: '我的服务费',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'serviceFeeStatement02',
			ifShowBtn: true,
			url: `/center/financeCenter/service/myServiceFee`,
			selectKey: '/center/financeCenter/service/myServiceFee',
			menuTitle: '我的服务费',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'serviceFeeStatement03',
			ifShowBtn: true,
			url: `/center/financeCenter/service/myServiceFee`,
			selectKey: '/center/financeCenter/service/myServiceFee',
			menuTitle: '我的服务费',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'serviceFeeStatement04',
			ifShowBtn: true,
			url: `/center/financeCenter/service/myServiceFee`,
			selectKey: '/center/financeCenter/service/myServiceFee',
			menuTitle: '我的服务费',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'serviceFeeStatement05',
			ifShowBtn: false,
			url: `/center/financeCenter/service/myServiceFee`,
			selectKey: '/center/financeCenter/service/myServiceFee',
			menuTitle: '我的服务费',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'bankcollectioninfo',
			ifShowBtn: true,
			url: '/center/fund/returned/list',
			selectKey: '/center/fund/returned/list',
			menuTitle: '回款管理',
			barFlag: 'gyl',

			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		// {
		//     type:'bankcollectionerror',
		//     ifShowBtn:true,
		//     url: '/center/collection/abnormalCollection',
		//     selectKey: '/center/collection/abnormalCollection',
		//     menuTitle:'异常回款',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		{
			type: 'businessMonitoringDetail',
			ifShowBtn: true,
			url: monitoringDetail(obj),
			selectKey: '/center/monitoring/dynamicMonitoring/detail',
			menuTitle: '业务监控详情',
			barFlag: 'monitoring',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		// 退款
		{
			type: 'REFUND_OPERATION_REJECT',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		{
			type: 'REFUND_RISK_REJECT',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		{
			type: 'REFUND_RISK_APPROVE_NO_OA',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		{
			type: 'REFUND_RISK_APPROVE_OA',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		{
			type: 'REFUND_OA_REJECT',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		{
			type: 'REFUND_OA_APPROVE',
			ifShowBtn: true,
			url: refundDetail(obj),
			selectKey: '/center/fund/refund/list',
			menuTitle: '退款详情',
			barFlag: 'refund',
			id: obj && Object.keys(obj).length ? JSON.parse(obj).id : ''
		},
		// {
		//     type:'supplementalAgreement01',
		//     ifShowBtn:true,
		//     url: suppleAgreementSign(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type:'supplementalAgreement02',
		//     ifShowBtn:true,
		//     url: suppleAgreementSign(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type:'supplementalAgreement03',
		//     ifShowBtn:true,
		//     url: suppleAgreementDetail(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type:'supplementalAgreement04',
		//     ifShowBtn:true,
		//     url: suppleAgreementDetail(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// {
		//     type:'supplementalAgreement05',
		//     ifShowBtn:true,
		//     url: suppleAgreementDetail(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		// //supplementalAgreement06：补充协议推送OA成功，跳转到补充协议详情页面
		// {
		//     type:'supplementalAgreement06',
		//     ifShowBtn:true,
		//     url: suppleAgreementDetail(obj),
		//     selectKey:'/center/contract/contractList',
		//     menuTitle:'补充协议管理',
		//     barFlag: 'gyl',
		//     companyId:obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		// },
		{
			type: 'supplementalAgreement07',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement08',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement09',
			ifShowBtn: true,
			url: suppleAgreementSign(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement10',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement11',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement12',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement13',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement14',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement15',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement16',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},

		{
			type: 'supplementalAgreement17',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'supplementalAgreement18',
			ifShowBtn: true,
			url: suppleAgreementDetail(obj),
			selectKey: '/center/contract/contractList',
			menuTitle: '补充协议管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'order16',
			ifShowBtn: false
		},
		{
			type: 'order17',
			ifShowBtn: false
		},
		{
			type: 'order18',
			ifShowBtn: false
		},
		{
			type: 'order19',
			ifShowBtn: false
		},
		{
			type: 'order20',
			ifShowBtn: false
		},
		{
			type: 'order21',
			ifShowBtn: false
		},
		{
			type: 'order23',
			ifShowBtn: false
		},
		{
			type: 'order23',
			ifShowBtn: false
		},
		{
			type: 'order24',
			ifShowBtn: false
		},
		{
			type: 'order25',
			ifShowBtn: false
		},
		{
			type: 'order26',
			ifShowBtn: false
		},
		{
			type: 'order27',
			ifShowBtn: false
		},
		{
			type: 'order10',
			ifShowBtn: false
		},
		{
			type: 'order13',
			ifShowBtn: false
		},
		{
			type: 'order28',
			ifShowBtn: false
		},
		{
			type: 'order29',
			ifShowBtn: false
		},
		{
			type: 'order30',
			ifShowBtn: false
		},
		{
			type: 'order31',
			ifShowBtn: false
		},
		{
			type: 'order32',
			ifShowBtn: false
		},
		{
			type: 'order33',
			ifShowBtn: false
		},
		{
			type: 'PAYMENT_PAYER_PLATFORM_AUDITING_REJECT', // 付款: 平台运营驳回
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_PAYER_RISK_CONTROL_REJECT', // 付款: 平台风控驳回
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_PAYER_RISK_CONTROL_APPROVE_NO_OA', // 付款: 平台风控审批通过
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_PAYER_RISK_CONTROL_APPROVE_NEED_OA', // 付款: 平台风控审批通过
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_RECEIVER_RISK_CONTROL_APPROVE_NO_OA', // 收款款: 平台风控审批通过
			ifShowBtn: true,
			url: collectConfirm(obj),
			selectKey: '/center/fund/collect/confirm',
			menuTitle: '我的收付款',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_PAYER_OA_REJECT', // 付款: OA审批驳回
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'PAYMENT_PAYER_OA_APPROVE', // 付款: OA审批通过
			ifShowBtn: true,
			url: payDetail(obj),
			selectKey: '/center/fund/pay/record/list',
			menuTitle: '收付款管理',
			barFlag: 'gyl',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		},
		{
			type: 'stationInStoragePrice', // 您今日入库的货物未填写单价
			ifShowBtn: true,
			url: '/center/logisticsPlatform/in',
			selectKey: '/center/logisticsPlatform/in',
			menuTitle: '入库管理',
			barFlag: 'logisticsPlatform',
			companyId: obj && Object.keys(obj).length ? JSON.parse(obj).companyId : ''
		}
	];
	return result;
}
