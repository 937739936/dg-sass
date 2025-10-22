import ENV from '@/v2/config/env';
import request from '@/api/request';
export function API_GetCollectionCollectionBillDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionBillDetail`, '', 'GET');
}
// 回款认领详情 电汇
export function API_GetCollectionCollectionTeleDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionTeleDetail`, '', 'GET');
}
/** 回款认领获取 追保函信息 */
export const getBondLetterForCollection = data => {
	return request(`${ENV.BASE_GANG_API}/api/bondLetter/queryByContractId`, data, 'GET');
};
// 认领记录作废 TODO:钢材部分还在调用-回款闭管理修改-郭凯宣-2022/9/21
export function API_InvalidCollectionClaim(data) {
	return request(`${ENV.BASE_API}/api/collection/invalidCollectionClaim`, data, 'POST');
}
// 完善合同-输入查询企业名称
export function API_GetCompanyName(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/list`, data, 'GET');
}
export const addCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection`, data, 'POST', 2);
};
export const findByDownstreamContractNo = data => {
	return request(`${ENV.BASE_GANG_API}/contract/findByDownstreamContractId/${data}`, data, 'GET');
};
// 回款 线上合同获取详情
export const getCollectionByContractNo = data => {
	// return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}`, '', 'GET')
	return request(`${ENV.BASE_GANG_API}/contract/getByContractNo/${data}`, data, 'GET');
};
export const checkShipmentIsBeyond = data => {
	return request(`${ENV.BASE_GANG_API}/collection/checkShipmentIsBeyond`, data, 'GET');
};
export const collectionDetail = data => {
	return request(`${ENV.BASE_GANG_API}/collection/${data}`, data, 'GET');
};
export const collectionClaim = data => {
	return request(`${ENV.BASE_GANG_API}/collection/claim`, data, 'POST', 2);
};
export const collectionPage = data => {
	return request(`${ENV.BASE_GANG_API}/collection/page`, data, 'GET');
};
export const delCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection/${data}`, data, 'DELETE');
};
// 获取oa同步的回款使用情况
export const getOaCollectionList = data => {
	return request(`${ENV.BASE_GANG_API}/collection/record/${data.id}/usage`, {}, 'GET');
};
export const collectionContractPage = data => {
	return request(`${ENV.BASE_GANG_API}/additionalContract/collectionContractPage`, data, 'GET');
};
export const paymentPage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/getPaymentPage`, data, 'GET');
};

export const deletePayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data}`, data, 'DELETE');
};
export const receiptPage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/getReceiptPage`, data, 'GET');
};
export const paymentContractPage = data => {
	return request(`${ENV.BASE_GANG_API}/contract/paymentContractPage`, data, 'GET');
};
export const checkBusinessLine = data => {
	return request(`${ENV.BASE_GANG_API}/statement/businessLine/${data.contractNo}`, data, 'GET');
};
export function getPaymentSellContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/paymentSellContractPage`, data, 'GET');
}
/**
 * 检测下游是否等级了保证金
 * @param {*} data
 * @returns
 */
export const checkCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection/checkCollection/${data.contractId}`, data, 'GET');
};
// 付款申请 删除附件
export function API_PaymentApplyDeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/delete/attach`, data, 'GET');
}
// 付款申请发票校验
export function payCheckInvoice(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/invoice`, data, 'POST', 2);
}
export const savePayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment`, data, 'POST', 2);
};
export const submitPayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment/submit`, data, 'POST', 2);
};
export const editPayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment`, data, 'PUT', 2);
};
export const paymentDetail = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data}/detail`, null, 'GET');
};
export const receiveAccountByCompanyId = data => {
	return request(`${ENV.BASE_API}/api/paymentApply/receiveAccountByCompanyId`, data, 'GET');
};
export const paymentInvoiceSummary = data => {
	return request(`${ENV.BASE_GANG_API}/payment/invoiceSummary`, data, 'POST', 2);
};
export const paymentinvoicePage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/invoicePage`, data, 'GET');
};
//根据合同id获取已转让金额
export const API_GetAssetSum = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data.id}/getAssetSum`, data, 'GET');
};
//付款时，获取资金类型
export function API_GetSteelBankProductItemTwo(data) {
	return request(`${ENV.BASE_GANG_API}/payment/getFundingSources`, data, 'GET');
}
export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSteel`, data, 'POST');
}
export function API_SteelsStatementfindByContractNo(data) {
	return request(`${ENV.BASE_GANG_API}/statement/findByContractNo/${data.contractNo}`, data, 'GET');
}
// 获取货转信息
export function API_SteelsGetGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/findByContractId`, data, 'GET');
}
// 结算单检验是否有在途的提单
export function getTakeDeliverIng(contractId) {
	return request(`${ENV.BASE_GANG_API}/statement/takeDeliverIng/${contractId}`, '', 'GET');
}
// 向下游付款 检测 是否有其他在途的付款
export function getPaymentIng(data) {
	return request(`${ENV.BASE_GANG_API}/payment/paymentIng`, data, 'POST', 2);
}
// 获取资金来源
export function API_GETCAPITALSOURCE(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/capitalSource`, data, 'GET');
}
// 提交付款
export function API_PAYSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/submit/payment`, data, 'POST', 2);
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
// 下游合同审核前校验合同信息是否完整
export function API_JudgeContract(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/check/exist`, data, 'GET');
}
// 提交付款前校验合同信息是否完整
export function API_JudgeContractNew(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/exist`, data, 'GET');
}
// 获取付款订单详情
export function API_PaymentApplyOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/get/order/info`, data, 'GET');
}
// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}
// 获取合同金额和累计非融资资金付款金额
export function API_GETCONTRACTAMOUNT(data) {
	return request(`${ENV.BASE_GANG_API}/payment/getContractAmount`, data, 'GET');
}
/** 根据合同id获取 */
export function getBusinessList(data) {
	return request(`${ENV.BASE_GANG_API}/payment/businessLineList`, data, 'GET');
}
/** 付款申请选择采购补录合同、回显卖方收款账号信息 */
export function API_getPaymentAccount(data) {
	return request(`${ENV.BASE_GANG_API}/payment/getPaymentAccount`, data, 'GET');
}


