import ENV from '@/v2/config/env';
import request from '@/api/request';

// 保存
export function API_Save(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/tempSaveOrSubmit`, data, 'POST', 2);
}

// 提交
export function API_Submit(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/submit`, data, 'POST', 2);
}

// 选择企业类型已认证为“物流企业”的公司
export function API_getlogisticsList(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/logisticsCompanyList`, data, 'get');
}

// 详情
export function API_contractdetail(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/logisticsCompanyList`, data, 'GET');
}

// 列表
export function API_contractlist(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/pageList`, data, 'POST', 2);
}

// 列表导出
export function API_contractListExport(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/exportExcel`, data, 'GET', 1, 'blob');
}

// 合同详情
export function API_contractDetail(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/detail`, data, 'GET');
}

// 物流合同付款统计
export function API_contractPay(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/payType/statistics`, data, 'GET');
}

// 物流合同付款列表
export function API_contractPayList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/pay/list`, data, 'GET');
}

// 物流合同结算统计
export function API_contractSettle(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/statement/statistics`, data, 'GET');
}

// 物流合同结算列表
export function API_contractSettleList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/statement/list`, data, 'GET');
}

// 物流合同发票统计
export function API_contractInvoice(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/invoice/statistics`, data, 'GET');
}

// 物流合同发票列表
export function API_contractInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/invoice/list`, data, 'GET');
}

// 物流合同其他附件列表
export function API_contractAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/attach/list`, data, 'GET');
}

// 线下运输结算单-保存/提交
export function API_SettleSave(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/saveTerminalTransStatement`, data, 'POST', 2);
}

// 线下运输结算单-作废
export function API_SettleVoid(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/invalid`, data, 'GET');
}

// 线下运输结算单-详情
export function API_SettleDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/getTerminalTransStatementDetail`, data, 'GET');
}

// 线下运输结算单-列表
export function API_SettleList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/page`, data, 'POST', 2);
}

// 线下运输结算单-列表统计
export function API_SettleListAmount(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/countRestEachTabStateNum`, data, 'POST', 2);
}

// 运输合同-一键下载
export function API_downloadAllTransContractAttachment(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/batchDownLoad`, data, 'GET', 1, 'blob');
}

// 线下运输合同删除
export function API_contract_delete(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/delete`, data, 'GET');
}

// 运输合同列表 数据统计
export function API_contract_Amount(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/getStatisticsData`, data, 'POST', 2);
}

// 修改业务线
export function API_change_businessline(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/modifyBusinessLineNo`, data, 'POST', 2);
}

// 业务线列表
export function API_businessline_list(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/transContractRelPage`, data, 'GET');
}

// 选择线下运输合同-分页列表
export function API_transport_contract_list(data) {
	
	let path = '/api/terminal/statement/unify/contractPage'
	return request(`${ENV.BASE_API}${path}`, data, 'POST', 2);
}

// 线下运输结算单-保存/提交
export function API_transport_settle_save(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/save`, data, 'POST', 2);
}

// 线下运输结算单-详情
export function API_transport_settle_details(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/detail`, data, 'GET');
}

// 线下运输结算单-删除
export function API_transport_settle_delete(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/delete`, data, 'GET');
}

// 运输合同付款查询资金来源
export function API_GETCAPITALSOURCE_TRANS(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/trans/contract/capitalSource`, data, 'GET');
}

// 查询货物信息
export function API_GETGOODSINFO_TRANS(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/trans/contract/selectGoodsByPayType`, data, 'GET');
}

// 运输合同获取业务负责人
export function API_get_businessOwnerList(data) {
	return request(`${ENV.BASE_API}/api/businessOwnershipConfig/option`, data, 'GET');
}
