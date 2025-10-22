/**
 * 票据api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';

export function API_GetCounterfoilList(data) {
	return request(`${ENV.BASE_API}/api/assetBill/listByPage`, data, 'GET');
}
export function API_CounterfoilDetail(data) {
	return request(`${ENV.BASE_API}/api/assetBill/detail`, data, 'GET');
}
export function API_GetCounterfoilApplyList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pay`, data, 'GET');
}
export function API_GetCounterfoilApplytoSave(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/toSave`, data, 'GET');
}

export function API_CounterfoilDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/download`, data, 'GET', 2, 'blob');
}
export function API_CounterfoilDetailViewFile(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/view`, data, 'GET');
}
export function API_CounterfoilDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/downloadZipByAsset`, data, 'GET', 2, 'blob');
}
export function API_CounterfoilApplySave(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/submit?assetId=${data.assetId}`, data, 'POST', 2);
}
export function API_GetCounterfoilYunList(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/listByPage`, data, 'GET');
}
export function API_GetCounterfoilYunListCount(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/count`, data, 'GET');
}
export function API_GetCounterfoilYunZF(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/cancel`, data, 'POST', 2);
}
export function API_GetCounterfoilYunDetail(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/detail`, data, 'GET');
}
export function API_GetCounterfoilSignFile(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/listUnSignFile`, data, 'GET');
}

export function API_GetCounterfoilautoSign(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/autoSign?id=${data.id}`, data, 'POST', 2);
}
export function API_GetCounterfoilsignUpdate(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/signUpdate?id=${data.id}`, data, 'POST', 2);
}
export function API_GetCounterfoilsigList(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/sigList?id=${data.id}`, data, 'GET');
}
export function API_GetCounterfoilAudit(data) {
	return request(`${ENV.BASE_API}/api/assetBill/counterfoil/check`, data, 'POST', 2);
}
