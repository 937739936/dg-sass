import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取可追加付款的资金类型
export function API_GetAvailableProductFromPayment(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/getAvailableProductFromPayment`, data, 'GET');
}

// 追加付款列表
export function API_GetAdditionalPaymentList(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/list`, data, 'GET');
}

// 获取资金来源
export function API_GETCAPITALSOURCE(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/capitalSource`, data, 'GET');
}

// 查询货物信息
export function API_GETGOODSINFO(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsByPayType`, data, 'GET');
}

// 查询发票信息
export function API_GETINVOICEINFO(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/relationInvoice`, data, 'GET');
}

// 付款记录详情
export function API_GETPAYRECORDDETAIL(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/detail`, data, 'GET');
}

// 获取付款订单详情
export function API_PaymentApplyOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/get/order/info`, data, 'GET');
}

// 保存追加付款
export function API_SavePaymentAdditional(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/save`, data, 'POST', 2);
}

// 提交追加付款
export function API_SubmitPaymentAdditional(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/submit`, data, 'POST', 2);
}

// 付款申请 删除附件
export function API_PaymentApplyDeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/delete/attach`, data, 'GET');
}

// 付款申请发票汇总列表
export function API_PAYAPPinvoLYLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/getInvoiceSum`, data, 'POST', 2);
}

// 付款申请发票校验
export function payCheckInvoice(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/invoice`, data, 'POST', 2);
}

// 采购合同列表
export function API_BUYCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/buy/page`, data, 'GET');
}

// 销售合同列表
export function API_SELLCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/sell/page`, data, 'GET');
}

// OA流程选择
export function API_GETOAAUDITCODELIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOAAuditCodeList`, data, 'GET');
}

// 根据关键字查询OA用户信息
export function API_GETOAUSERBYKEYWORD(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOaUserByKeyword`, data, 'GET');
}

// 收款确认审批拒绝接口
export function API_REJECTCOLLECTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/reject/repayment/confirm`, data, 'POST');
}

// 收款确认审批通过接口
export function API_PASSCOLLECTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/confirm/repayment`, data, 'POST');
}

// 获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

//全业务线--获取企业所有可用的资金类型
export function API_GETPAYBANK(data) {
	return request(`${ENV.BASE_API}/api/bankProductItem/getBankProductItem`, data, 'GET');
}

// 删除付款记录
export function API_GETPAYRECORDCANCEL(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/cancel`, data, 'POST');
}

// 获取收款账号
export function API_GETRECEIVEACCOUNT(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/receiveAccount`, data, 'GET');
}
// 付款-终端账号删除
export function API_GETACCOUNTDELETE(data) {
	return request(`${ENV.BASE_API}/api/terminal/company/account/delete`, data, 'GET');
}

// 提交付款
export function API_PAYSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/submit/payment`, data, 'POST', 2);
}

// 根据资金类型判断是否需要平台风控审核
export function API_COMPANplatformRiskAudit(data) {
	return request(`${ENV.BASE_API}/api/common/platformRiskAudit`, data, 'GET');
}
// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}

// 应付列表
export function API_GetPayableList(data) {
	return request(`${ENV.BASE_API}/api/receivable/pay/list`, data, 'GET');
}

// 保存付款
export function API_PAYSAVE(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/savePayment`, data, 'POST', 2);
}

// 全业务线--付款申请--获取全业务线数据
export function API_PayGetBizLineInfo(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/getBizLineInfo`, data, 'GET');
}

export function API_GETORDERAUDITChAINANOPERATORBYORdERNO(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderAuditChainAndOperatorByOrderNo`, data, 'GET');
}

// 付款确认审批拒绝接口
export function API_REJECTPAYMENTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/reject/payment/confirm`, data, 'POST');
}

// 付款确认审批通过接口
export function API_PASSPAYMENTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/confirm/payment`, data, 'POST', 2);
}

//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

// 作废付款申请
export function API_GETPAYRECORDLISTZF(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/invalid`, data, 'POST', 2);
}

// 获取付款记录列表
export function API_GETPAYRECORDLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/list`, data, 'GET');
}

// 是否显示追加付款按钮
export function API_AdditionalPaymentButtonShow(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/additionalPaymentButtonShow`, data, 'GET');
}

// 付款状态提示
export function paymentInfo(data) {
	return request(`${ENV.BASE_NET}api/paymentInfo/getStatusTip`, data, 'GET');
}

// 应收列表
export function API_GetReceivableList(data) {
	return request(`${ENV.BASE_API}/api/receivable/receive/list`, data, 'GET');
}

// 获取云控单点登录票据
export function API_SSO_CCSFIN_GET(data) {
	return request(`${ENV.BASE_API}/api/sso/getTicket`, data, 'GET');
}

// 云控环境退出
export function API_FIN_LOG_OUT(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/logout`, data, 'GET', 1, 'text/html');
}

// 云控环境登录
export function API_FIN_LOG_IN(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/login?ssoTicket=${data}`, '', 'POST', 1, 'text/html');
}

// 云控检查额度信息
export function API_FIN_CHECK_CREDIT(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/company/cloudmelt/apply/trade/confirmFormCheck`, data, 'POST');
}

// 合同核算办法明细
export function API_GetIndicatorTemplateAccountingDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/accounting/detail`, data, 'GET');
}

// 查看详情时-货值总金额明细
export function API_GetIndicatorTemplateViewDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/view/detail`, data, 'GET');
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

export function API_PaymentGoodsOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsValueByOrderId`, data, 'GET');
}

export function API_exportGoodsValueByOrderId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/exportGoodsValueByOrderId`, data, 'GET', 1, 'blob');
}

export function API_exportGoodsValueByPaymentId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/exportGoodsValueByPaymentId`, data, 'GET', 1, 'blob');
}

export function API_selectGoodsValueByPaymentId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsValueByPaymentId`, data, 'GET');
}

// 测算付款金额
export function API_paymentApplyCalMaxPayAmount(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/calMaxPayAmount`, data, 'GET');
}
// 追加付款--测算付款金额
export function API_paymentAdditionalCalMaxPayAmount(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/calPayAmount`, data, 'GET');
}

// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}

// 付款申请列表
export function API_PAYAPPLYLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/list`, data, 'GET');
}

// 提交付款前校验合同信息是否完整
export function API_JudgeContractNew(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/exist`, data, 'GET');
}

//退款管理合同选择列表
export function API_REFUNDCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/refund/contractList`, data, 'GET');
}

//退款管理根据合同号获取退款模板信息-新增时查询合同信息
export function API_REFUNDREMPLATE(data) {
	return request(`${ENV.BASE_API}/api/refund/template`, data, 'GET');
}

//退款管理检查可退款金额
export function API_REFUNDSTATS(data) {
	return request(`${ENV.BASE_API}/api/refund/stats`, data, 'GET');
}

//退款管理 保存退款信息
export function API_REFUNDSTORE(data) {
	return request(`${ENV.BASE_API}/api/refund/store`, data, 'POST', 2);
}

//退款管理 提交退款信息
export function API_REFUNDSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/refund/submit`, data, 'POST', 2);
}

//退款管理 退款作废
export function API_REFUNDDISCARD(data) {
	return request(`${ENV.BASE_API}/api/refund/discard`, data, 'POST', 2);
}

//退款管理 退款取消(删除)
export function API_REFUNDDELETE(data) {
	return request(`${ENV.BASE_API}/api/refund/delete/${data.id}`, data, 'POST', 2);
}

//退款管理列表
export function API_REFUNDLIST(data) {
	return request(`${ENV.BASE_API}/api/refund/list`, data, 'GET');
}

//退款管理退款详情
export function API_REFUNDDETAIL(data) {
	return request(`${ENV.BASE_API}/api/refund/detail`, data, 'GET');
}

// 退款管理-选择电子合同
export function API_RefundOnlineContractList(data) {
	return request(`${ENV.BASE_API}/api/refund/online/contractList`, data, 'GET');
}
// 退款管理-选择线下合同
export function API_RefundOfflineContractList(data) {
	return request(`${ENV.BASE_API}/api/refund/offline/contractList`, data, 'GET');
}
// 退款管理-下载
export function API_RefundDownload(data) {
	return request(`${ENV.BASE_API}/api/refund/download`, data, 'GET', 1, 'blob');
}
// 退款管理-校验
export function API_RefundSubmitValid(data) {
	return request(`${ENV.BASE_API}/api/refund/submitValid`, data, 'POST', 2);
}
// 退款管理-数据统计
export function API_RefundCountEachTabStateNum(data) {
	return request(`${ENV.BASE_API}/api/refund/countEachTabStateNum`, data, 'GET');
}
// 退款管理-数据统计
export function API_RefundExport(data) {
	return request(`${ENV.BASE_API}/api/refund/export`, data, 'GET', 1, 'blob');
}
//退款管理-查询收款账号
export function API_RefundReceiveAccount(data) {
	return request(`${ENV.BASE_API}/api/refund/receiveAccount`, data, 'GET');
}

// 查询自己的付款控制配置
// export function API_PaymentLimitConfig(data) {
//   return request(`${ENV.BASE_API}/api/paymentLimit/config`, data, "GET");
// }
// 查询登录企业所有通过合同关联的企业被付款限制的集合
// export function API_PaymentLimitLinkCompany(data) {
//   return request(`${ENV.BASE_API}/api/paymentLimit/linkCompany`, data, "GET");
// }
// 查询某个企业所有的付款限制
// export function API_PaymentLimitReasonByUscc(data) {
//   return request(`${ENV.BASE_API}/api/paymentLimit/limitReasonByUscc`, data, "GET");
// }
// 仓押业务-付款第一步-强校验规则
export function API_CYValidPaymentStrongRule(data) {
	return request(`${ENV.BASE_API}/api/payment/warehouseDeposit/validPaymentStrongRule`, data, 'POST', 2);
}
//仓押类型-获取对应下游合同的收/付款方银行账号信息
export function API_CYGetPaymentAccountVo(data) {
	return request(`${ENV.BASE_API}/api/payment/warehouseDeposit/getPaymentAccountVo`, data, 'POST', 2);
}
//仓押类型-获取对应下游合同的收/付款方银行账号信息
export function API_CYGetPaymentAccountVoByPaymentId(data) {
	return request(`${ENV.BASE_API}/api/payment/warehouseDeposit/getPaymentAccountVo/byPaymentId`, data, 'GET');
}

// 付款申请校验
export function payApplyCheck(data) {
	return request(`${ENV.BASE_API}/api/payment/limit/apply/check`, data, 'GET');
}
// 超期未完结合同
export function getContractUnFinishList(data) {
	return request(`${ENV.BASE_API}/api/payment/limit/contractUnFinish/pageQuery`, data, 'GET');
}
// 服务费结算单限制
export function getServiceFeeUnPayList(data) {
	return request(`${ENV.BASE_API}/api/payment/limit/serviceFeeUnPay/pageQuery`, data, 'GET');
}
// 付款校验-数据导出
export function exportLimitData(data) {
	return request(`${ENV.BASE_API}/api/payment/limit/data/export`, data, 'GET', 1, 'blob');
}

/** 获取回款列表 */
export const getReturnedList = data => request(`${ENV.BASE_API}/api/collection/flow/getDataList`, data, 'GET');
// 回款管理-分页列表tab页签统计
export const getReturnedTabNum = data => request(`${ENV.BASE_API}/api/collection/flow/countEachTabStateNum`, data, 'GET');
/** 回款管理导出 */
export const exportReturnedData = data => request(`${ENV.BASE_API}/api/collection/flow/exportExcel`, data, 'GET', 1, 'blob');
/** 删除回款管理 */
export const delReturnedData = data => request(`${ENV.BASE_API}/api/collection/flow/deleteCollectionFlow`, data, 'GET');
/** 获取操作记录 */
export const getReturnedLogList = data => request(`${ENV.BASE_API}/api/collection/flow/listCollectionFlowOperation`, data, 'GET');
// 获取回款详情
export const getReturnedDetail = data => request(`${ENV.BASE_API}/api/collection/flow/getDataDetail`, data, 'GET');
// 新增回款-选择业务线
export const getBusinessLineListByCollection = data =>
	request(`${ENV.BASE_API}/api/collection/flow/getBusinessLineListByCollection`, data, 'GET');
// 新增回款-选择销售合同

export const getTerminalContractList = data =>
	request(`${ENV.BASE_API}/api/collection/flow/getTerminalContractList`, data, 'GET');
/**是否展示回款异常 */
export const getOaCollectionWarnInfo = data =>
	request(`${ENV.BASE_API}/api/collection/flow/getOaCollectionWarnInfo`, data, 'GET');
// 获取回款方下拉
export const getCollectionAccountList = data =>
	request(`${ENV.BASE_API}/api/collection/flow/listTerminalRemitAccount`, data, 'GET');
// 回款方银行账户信息-记忆检索
export const getCollectionAccountMemory = data =>
	request(`${ENV.BASE_API}/api/collection/flow/listCollectionAccountMemory`, data, 'GET');

// 回款管理-回款凭证下载
export const downloadReturnedFile = data => request(`${ENV.BASE_API}/api/collection/flow/downloadFile`, data, 'POST', 1, 'blob');

// 新增回款
export const addReturned = data => request(`${ENV.BASE_API}/api/collection/flow/saveSingleArtificialData`, data, 'POST', 2);

// 获取下游合同回款信息
export const API_GetReturnedInfo = data =>
	request(`${ENV.BASE_API}/api/paymentApply/getDownStreamCollectionInfo`, data, 'POST', 2);

// 资金类型获取详情的接
export const API_GetBankProductItem = data => request(`${ENV.BASE_API}/api/paymentApply/getBankProductItem`, data, 'GET');

//付款升级改版2024-05-11 start
// 付款新增页面-合同信息
export const API_PaymentCreateContract = data => request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/contract`, data, 'POST', 2);
// 付款新增页面-业务线信息
export const API_PaymentCreateBusinessLine = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/businessLine`, data, 'POST', 2);
// 付款新增页面-业务线下游回款（线下合同）
export const API_PaymentCreateDownStreamCollection = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/downStreamCollection`, data, 'GET');
// 付款新增页面-业务线下游付款（电子合同）
export const API_PaymentCreateDownStreamPayment = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/downStreamPayment`, data, 'GET');
// 付款新增页面-统计字段查询
export const API_PaymentCreateStatistics = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/statistics`, data, 'POST', 2);
// 付款新增页面-收款方账号
export const API_PaymentCreateReceiveAccount = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/receiveAccount`, data, 'GET');
// 付款新增页面-可用资金类型
export const API_PaymentCreateBankProductItem = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/bankProductItem`, data, 'POST', 2);
// 付款新增页面-发运数据
export const API_PaymentCreateDeliverGoodsTrans = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/deliverGoodsTrans`, data, 'POST', 2);
// 付款新增页面-发票数据
export const API_PaymentCreateInvoice = data => request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/invoice`, data, 'POST', 2);
// 付款新增页面-结算单数据
export const API_PaymentCreateStatement = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/statement`, data, 'POST', 2);
// 付款新增页面-税务数据
export const API_PaymentCreateTax = data => request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/tax`, data, 'POST', 2);
// 付款新增页面-保存
export const API_PaymentCreateSave = data => request(`${ENV.BASE_API}/api/paymentCreate/save`, data, 'POST', 2);
// 付款新增页面-提交
export const API_PaymentCreateSubmit = data => request(`${ENV.BASE_API}/api/paymentCreate/submit`, data, 'POST', 2);

// 新增付款-第一步合同选择-电子采购合同列表
export const API_getOnLineContractList = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/onlineContract/page`, data, 'POST', 2);
// 新增付款-第一步合同选择-线下采购合同列表
export const API_getOffLineContractList = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/offlineContract/page`, data, 'POST', 2);
// 新增付款-第一步合同选择-运输合同列表
export const API_getTransportContractList = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/transportContract/page`, data, 'POST', 2);
// 新增付款-第二步-合同付款校验
export const API_ContractPaymentCheck = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/check/getCheckResult`, data, 'POST', 2);
// 新增付款-第二步-获取未完结合同列表
export const API_GetContractUnFinishList = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/check/contractUnFinish/page`, data, 'POST', 2);
// 新增付款-第二步-获取未完服务费结算单列表
export const API_GetServiceFeeUnPayList = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/check/serviceFeeUnPay/page`, data, 'POST', 2);
// 新增付款-第二步-校验数据导出
export const API_CheckResultExport = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/check/checkResult/export`, data, 'POST', 2, 'blob');

// 付款管理-付款列表 -----
// 付款管理-付款列表
export const API_GetPaymentList = data => request(`${ENV.BASE_API}/api/paymentInfo/paymentPage`, data, 'POST', 2);
// 付款管理-付款列表不同状态的统计数量
export const API_GetPaymenAllStatusCount = data => request(`${ENV.BASE_API}/api/paymentInfo/statusCount`, data, 'POST', 2);
// 付款管理-获取付款列表资金类型列表
export const API_GetPaymentAllPayTypeList = data => request(`${ENV.BASE_API}/api/paymentInfo/queryAllPayType`, data, 'GET');
// 付款管理-列表导出
export const API_PaymentListExport = data =>
	request(`${ENV.BASE_API}/api/paymentInfo/paymentList/export`, data, 'POST', 2, 'blob');
// 付款管理-删除付款
export const API_DeletePaymentRecord = data => request(`${ENV.BASE_API}/api/paymentInfo/deletePayment`, data, 'GET');
// 付款管理-作废付款
export const API_InvalidPaymentRecord = data => request(`${ENV.BASE_API}/api/paymentInfo/cancelPayment`, data, 'GET');
// 付款管理-直接重新提交
export const API_GetPaymentDirectReSubmit = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/repeatSubmitWhenAssetOaReject`, data, 'GET');
// 付款管理-获取状态提示信息
export const API_GetPaymentStatusTip = data => request(`${ENV.BASE_API}/api/paymentInfo/queryPaymentStatusTip`, data, 'POST', 2);

// 付款管理-详情 -----
// 付款管理-详情
export const API_GetPaymentDetail = data => request(`${ENV.BASE_API}/api/paymentInfo/queryPaymentDetail`, data, 'GET');

// 收款管理
// 收款管理-收款列表
export const API_GetCollectList = data => request(`${ENV.BASE_API}/api/receiveInfo/paymentPage`, data, 'POST', 2);
// 收款管理-收款列表不同状态的统计数量
export const API_GetCollectAllStatusCount = data => request(`${ENV.BASE_API}/api/receiveInfo/statusCount`, data, 'POST', 2);
// 收款管理-获取收款列表资金类型列表
export const API_GetCollectAllPayTypeList = data => request(`${ENV.BASE_API}/api/receiveInfo/queryAllPayType`, data, 'GET');
// 收款管理-列表导出
export const API_CollectListExport = data =>
	request(`${ENV.BASE_API}/api/receiveInfo/paymentList/export`, data, 'POST', 2, 'blob');
// 收款管理-收款详情
export const API_GetCollectDetail = data => request(`${ENV.BASE_API}/api/receiveInfo/queryPaymentDetail`, data, 'GET');
// 收款管理-收款确认、驳回
export const API_ConllectConfirmOrReject = data => request(`${ENV.BASE_API}/api/receiveInfo/confirmPayment`, data, 'POST', 2);
// 付款-终端账号删除
export const API_GetAccountDelete = data =>
	request(`${ENV.BASE_API}/api/paymentCreate/infoQuery/receiveAccount/delete`, data, 'POST', 2);
// 收付款附件下载
export const API_PaymentAttachDownload = data =>
	request(`${ENV.BASE_API}/api/paymentInfo/downloadPaymentAttach`, data, 'POST', 2, 'blob');
// 收款管理-获取追加付款编辑参数
export const API_GetAdditionalPayEditParams = data =>
	request(`${ENV.BASE_API}/api/paymentAdditional/queryPaymentAdditionalOtherVO`, data, 'GET');
