// 财务中心接口
import ENV from '@/v2/config/env';
import request from '@/api/request';
// 获取服务费协议模板
export const getTemplateList = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/templateList`, data, 'GET');
// 获取服务费提供方
export const getSettlementList = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/settlementCompanyList`, data, 'GET');
// 获取当前企业与数链平台签订的服务费协议中的服务方
export const getSignSettlementList = data =>
	request(`${ENV.BASE_API}/api/serviceFeeAgreement/currentUsccSettlementCompanyList`, data, 'GET');
// 服务费协议管理列表
export const getServiceFeeList = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/page`, data, 'GET');
// 获取服务费协议作废url
export const getServiceFeeInvalidUrl = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/invalid/preview`, data, 'GET');
// 获取服务费协议作废url状态
export const afterGenerateInvalidFile = data =>
	request(`${ENV.BASE_API}/api/serviceFeeAgreement/afterGenerateInvalidFile`, data, 'GET');
// 服务费协议解除协议托管盖章
export const invalidAutoSignature = data =>
	request(`${ENV.BASE_API}/api/cfca/serviceFeeAgreement/invalid/autoSignature`, data, 'GET');
// UKey作废盖章时获取待签名数据
export const getInvalidPdfHashList = data =>
	request(`${ENV.BASE_API}/api/serviceFeeAgreement/seal/getInvalidPdfHashList`, data, 'GET');
// 服务费作废
export const invalidServiceFee = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/generateInvalidFile`, data, 'GET');
// 服务费详情
export const getServiceFeeDetail = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/detail`, data, 'GET');
// 驳回协议
export const rejectServiceFee = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/reject`, data, 'POST', 2);
// 异议
export const suspend = data => request(`${ENV.BASE_API}/api/serviceFee/suspend`, data, 'POST', 2);

// 服务费协议托管盖章
export const autoSignature = data => request(`${ENV.BASE_API}/api/cfca/serviceFeeAgreement/autoSignature`, data, 'GET');
// UKey盖章时获取待签名数据
export const getPdfHashList = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/seal/getPdfHashList`, data, 'GET');
// 提交盖章
export const confirmToSeal = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/confirmToSeal`, data, 'GET');
/** 获取服务费协议 */
export const getServiceFeeInfo = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/autoGenerate`, data, 'GET');
// 服务费uky盖章
export const feeUKeySeal = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/afterUkeySeal`, data, 'GET');
// 下载服务费协议
export const downServiceFee = data => request(`${ENV.BASE_API}/api/serviceFeeAgreement/download`, data, 'GET', 1, 'blob');

// 历史数据--服务费结算单预览--展示详情
export function API_ServiceFeeStatementPreviewContract(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/preview`, data, 'GET');
}

//新数据--服务费结算单预览--展示详情
export function API_ServiceFeeDetailNew(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/detail`, data, 'GET');
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 服务费自动盖章
export function API_CfcaServicefeeConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/serviceFeeStatementAutoSignature`, data, 'GET');
}

// 服务费结算单确认获取签章信息
export function API_ServiceFeeStatementGetSigList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/getPdfHashList`, data, 'GET');
}

// 盖章成功保存服务费结算单
export function API_ServiceFeeStatementSave(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/confirmToSeal`, data, 'GET');
}

//获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

// 服务费结算单列表
export function API_GetServiceFeeStatementList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/list`, data, 'POST', 2);
}

// 历史数据--服务费结算单确认
export function API_FUWUFCOMFIRM(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/confirm`, data, 'POST', 2);
}

export function API_FUWUFCOMFIRMNEW(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/newConfirm`, data, 'POST', 2);
}

// 服务费流水明细
export function API_ServiceFeeFlowList(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/list`, data, 'GET');
}

// 导出服务费流水明细
export function API_ServiceFeeExportXls(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/exportXls`, data, 'GET', 1, 'blob');
}
/** 服务费发票列表 */

export function getServiceFeeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/invoice/list`, data, 'POST', 2);
}

// 服务费发票列表导出
export function exportServiceFeeInvoiceXls(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/invoice/exportXls`, data, 'GET', 1, 'blob');
}
// 发票批量下载
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/invoice/batchDownload`, data, 'POST', 2, 'blob');
}
// 发票单个下载
export function serviceFeeInvoiceDownload(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/invoice/download`, data, 'GET', 1, 'blob');
}
// 删除服务费结算单
export function API_delServiceFee(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/delete`, data, 'POST');
}
// 下载服务费结算单
export function API_downloadServiceFee(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/download`, data, 'GET', 1, 'blob');
}
// 申请作废服务费结算单
export function API_cancelServiceFee(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/suspend`, data, 'POST', 2);
}
// 服务费结算作废盖证书托管章
export function API_serviceFeeStatementInvalidAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/serviceFeeStatementInvalidAutoSignature`, data, 'GET');
}
// 获取作废服务费结算单签章信息Ukey
export function API_serviceFeeStatementInvalidGetInvalidPdfHashList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/getInvalidPdfHashList`, data, 'GET');
}
// 确认作废服务费结算单Ukey
export function API_serviceFeeStatementInvalidConfirmToSeal(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/invalidConfirmToSeal`, data, 'GET');
}
