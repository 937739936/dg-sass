import ENV from '@/v2/config/env';
import request from '@/api/request';

// 选择线下运输合同-分页列表
export function API_transport_contract_list(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/contractPage`, data, 'POST', 2);
}
// 上传
export const API_ContractAttachFilesUpload = `${ENV.BASE_API}/api/terminal/attachment/upload`;

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

export const commonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_API}/api/terminal/attachment/upload?t=${t}`, data, 'POST', 2);
};
// 获取仓库列表
export function getTransferWarehouseList(data) {
	return request(`${ENV.BASE_STATION_API}/api/station/transferWarehouse/list`, data, 'GET');
}

// 业务监控--下游--核心企业、资方-上传下游合同附件
export const API_DownstreamContractUpload = `${ENV.BASE_API}/api/terminal/attachment/upload/single`;

// 线下运输结算单-保存/提交
export function API_transport_settle_save(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/save`, data, 'POST', 2);
}

// 线下运输结算单-详情
export function API_transport_settle_details(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/unify/detail`, data, 'GET');
}
// 合同详情
export function API_contractDetail(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/unifyContract/detail`, data, 'GET');
}
// 取消结算单
export function API_CANCELREASONSETTLE(data) {
	return request(`${ENV.BASE_API}/api/statement/${data.statementId}/cancel`, data, 'GET');
}
// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}
// 提交结算单作废确认
export function API_SubmitSettlementCancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/save`, data, 'POST', 2);
}
// 线下结算单下载附件
export function API_DownloadSettleFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/download`, data, 'GET', 1, 'blob');
}

// 采购补录合同附件下载
export function API_OFFLINEBUYERORDERDDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/offline/buyer/order/download`, data, 'GET', 1, 'blob');
}

// 销售补录合同附件下载
export function API_OFFLINESELLERORDERDDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/download`, data, 'GET', 1, 'blob');
}
