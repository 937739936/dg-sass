import ENV from '@/v2/config/env';
import request from '@/api/request';

// 业务动态监控-物流合同详情
export function API_LogisticsContract(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/detail`, data, 'GET');
}
// 业务动态监控-结算单列表
export function getTransStatementList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/statement/list`, data, 'GET');
}
// 业务动态监控-结算单统计
export function getTransStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/statement/statistics`, data, 'GET');
}

// 业务动态监控-发票列表
export function getTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/invoice/list`, data, 'GET');
}
// 业务动态监控-发票统计
export function getTransInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/invoice/statistics`, data, 'GET');
}
// 业务动态监控-附件列表
export function getTransAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/attach/list`, data, 'GET');
}
// 业务动态监控-物流合同付款列表
export function getTransPayList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/pay/list`, data, 'GET');
}
// 业务动态监控-物流合同付款统计
export function getTransPayStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/payType/statistics`, data, 'GET');
}
