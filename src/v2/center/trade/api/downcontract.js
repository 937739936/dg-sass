import ENV from '@/v2/config/env';
import request from '@/api/request';

// 线下合同列表
export const getDownContractList = data => request(`${ENV.BASE_API}/api/offlineContract/pageOfflineContract`, data, 'GET');

// 线下合同-采购合同-提交
export const saveOrUpdateBuyDownContract = data =>
	request(`${ENV.BASE_API}/api/offline/buyer/order/saveOrUpdate`, data, 'POST', 2);
// 线下合同-采购合同-详情
export const getBuyDownContractDetail = data => request(`${ENV.BASE_API}/api/offline/buyer/order/detail`, data, 'GET');

// 获取预警信息
export const getWaringDetail = data =>
	request(`${ENV.BASE_API}/api/offlineContract/countOfflineContractRiskAlertByContractNo`, data, 'GET');

// 获取合同详情 操作记录
export const getDownContractLog = data =>
	request(`${ENV.BASE_API}/api/offlineContract/listOfflineContractOperation`, data, 'GET');

// 获取合同详情 结算信息
export const getDownContractSettleInfo = data =>
	request(`${ENV.BASE_API}/api/offlineContract/getOfflineContractStatementResp`, data, 'GET');
// 获取合同详情 发票信息
export const getDownContractInvoiceInfo = data =>
	request(`${ENV.BASE_API}/api/offlineContract/getOfflineContractInvoiceInfoResp`, data, 'GET');

// 获取合同详情 付款信息

export const getDownContractPayInfo = data =>
	request(`${ENV.BASE_API}/api/offlineContract/getOfflineContractPaymentResp`, data, 'GET');

// 线下合同-销售合同-提交
export const saveOrUpdateSellDownContract = data =>
	request(`${ENV.BASE_API}/api/offline/seller/order/saveOrUpdate`, data, 'POST', 2);
// 线下合同-销售合同-详情
export const getSellDownContractDetail = data => request(`${ENV.BASE_API}/api/offline/seller/order/detail`, data, 'GET');
// 线下合同 下载

export function downloadDownContract(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/downloadContractRelatedAllAttachment`, data, 'POST', 1, 'blob');
}

// 线下合同 删除
export const delBuyDownContract = data => request(`${ENV.BASE_API}/api/offline/buyer/order/delete`, data, 'GET');

export const delSellDownContract = data => request(`${ENV.BASE_API}/api/offline/seller/order/delete`, data, 'GET');
// 修改业务负责人
export const saveOfflineContractDirector = data =>
	request(`${ENV.BASE_API}/api/offlineContract/saveOfflineContractDirector`, data, 'POST', 2);

/** 修改审批流 */
export const updateOfflineContractAuditChainRel = data =>
	request(`${ENV.BASE_API}/api/offlineContract/updateOfflineContractAuditChainRel`, data, 'POST', 2);

// 合同下载 单文件
export const downloadSingleFile = data =>
	request(`${ENV.BASE_API}/api/offlineContract/downloadSingleTypeFile`, data, 'POST', 2, 'blob');
// -修改电子合同信息时，回传线下合同的OA审核流程和流程发起人信息
export const getOfflineContractAuditChainAndOperator = data =>
	request(`${ENV.BASE_API}/api/offlineContract/getOfflineContractAuditChainAndOperator`, data, 'GET');
// 关联合同
/**  */
export const downContractLinkBuy = data => request(`${ENV.BASE_API}/api/offline/seller/order/link/buyer/list`, data, 'GET');

export const downContractLinkSell = data => request(`${ENV.BASE_API}/api/offline/buyer/order/link/seller/list`, data, 'GET');

//退款列表
export function API_RefundBaseList(data) {
	return request(`${ENV.BASE_API}/api/refund/baseList`, data, 'GET');
}
// 判断线下销售合同编辑时是否修改了数据
export function validEditDataSame(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/validEditDataSame`, data, 'POST', 2);
}
