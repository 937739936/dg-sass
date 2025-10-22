import ENV from '@/v2/config/env';
import request from '@/api/request';

export function API_workbenchConfigList(data) {
	if (data.methods == 'POST') {
		return request(`${data.apipath}`, data.query, 'POST', 2);
	}
	return request(`${data.apipath}`, data.query || {}, 'GET');
}
export function API_workbenchGongList(data) {
	return request(`${ENV.BASE_API}/api/workbench/notice`, data, 'GET');
}
export function API_GetUnreadWorkbenchList(data) {
	return request(`${ENV.BASE_API}/api/workbench/list/unRead`, data, 'GET');
}
export function API_GetRiskWorkbenchList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/count`, data, 'GET');
}
//工作台数据概览
export function API_GetWorkDataOverview(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/data/overview`, data, 'GET');
}
//工作台发运数据统计
export function API_GetWorkDespatchData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/despatch/data`, data, 'GET');
}
//工作台合同签署情况统计
export function API_GetWorkContractData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/contract/data`, data, 'GET');
}
//工作台自有资金统计
export function API_GetWorkOwnData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/own/data`, data, 'GET');
}
//工作台资金使用情况-金融机构
export function API_GetWorkBankList(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/bank/list`, data, 'GET');
}
//工作台资金使用情况-金融机构
export function API_GetWorkBankData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/bank/fund/data`, data, 'GET');
}
//工作台数据概览导出
export function API_GetWorkBankExportOverview(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/data/overview`, data, 'GET', 2, 'blob');
}
//工作台累计业务数据导出
export function API_GetWorkContractExport(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/contract/data`, data, 'GET', 2, 'blob');
}
//工作台发运数据导出
export function API_GetWorkBankExportDespatch(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/despatch/data`, data, 'GET', 2, 'blob');
}
//工作台自有资金数据导出
export function API_GetWorkBankExportMoney(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/own/money/data`, data, 'GET', 2, 'blob');
}
//工作台金融机构资金使用情况导出接口
export function API_GetWorkBankExportFund(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/fund/used/data`, data, 'GET', 2, 'blob');
}
export function API_workbenchNoticeDetail(data) {
	return request(`${ENV.BASE_API}/api/workbench/notice/detail/${data.id}`, data, 'GET');
}
