import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 物泊-获取船运实时轨迹
export function API_getDeliverGetRpcShip(data) {
	return request(`${ENV.BASE_API}/api/deliver/getRpcShip`, data, 'GET');
}

//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

export const API_getLadingList = data => request(`${ENV.BASE_API}/api/lading/listByPage`, data, 'GET');

export const API_getLadingBillDataById = data => request(`${ENV.BASE_API}/api/lading/detail`, data, 'GET');

export const API_getLadingBillContractList = data => request(`${ENV.BASE_API}/api/lading/listContractByPage`, data, 'GET');

export const API_getLadingBillAddDetail = data => request(`${ENV.BASE_API}/api/lading/toSave`, data, 'GET');

export const API_getLadingBillSave = data => request(`${ENV.BASE_API}/api/lading/saveOrUpdate`, data, 'POST', 2);

export function API_DownLoadLadingFile(data) {
	return request(`${ENV.BASE_API}/api/lading/batchDownload`, data, 'GET', 1, 'blob');
}
export const API_QuitLading = data => request(`${ENV.BASE_API}/api/lading/cancel`, data, 'POST', 2);

export function API_LadingSealReleaseUkey(data) {
	return request(`${ENV.BASE_API}/api/lading/ukey/getPDFHashList`, data, 'GET');
}

export function API_LadingSealReleaseAuto(data) {
	return request(`${ENV.BASE_API}/api/lading/auto/signature`, data, 'GET');
}
export function API_LadingSignReleaseAfterConfirm(data) {
	return request(`${ENV.BASE_API}/api/lading/ukey/signUpdate?id=${data.id}`, data, 'POST', 2);
}

// 收货证明列表
export function API_getReceiptList(data) {
	return request(`${ENV.BASE_API}/api/receipt/listByPage`, data, 'GET');
}
// 收货证明列表-选择合同
export function API_getReceiptListContract(data) {
	return request(`${ENV.BASE_API}/api/receipt/listContractByPage`, data, 'GET');
}
// 收货证明详情
export function API_getReceiptProveAddDetail(data) {
	return request(`${ENV.BASE_API}/api/receipt/listContractByPage`, data, 'GET');
}
export const API_getReceiptProveDataById = data => request(`${ENV.BASE_API}/api/receipt/detail`, data, 'GET');

export const API_getReceiptProvelAddDetail = data => request(`${ENV.BASE_API}/api/receipt/toSave`, data, 'GET');

export const API_getReceiptProvelSave = data => request(`${ENV.BASE_API}/api/receipt/saveOrUpdate`, data, 'POST', 2);

export function API_DownLoadReceiptFile(data) {
	return request(`${ENV.BASE_API}/api/receipt/batchDownload`, data, 'GET', 1, 'blob');
}
export const API_QuitReceipt = data => request(`${ENV.BASE_API}/api/receipt/cancel`, data, 'POST', 2);

export function API_ReceiptSealReleaseUkey(data) {
	return request(`${ENV.BASE_API}/api/receipt/ukey/getPDFHashList`, data, 'GET');
}
export function API_ReceiptSealReleaseAuto(data) {
	return request(`${ENV.BASE_API}/api/receipt/auto/signature`, data, 'GET');
}
export function API_ReceiptSignReleaseAfterConfirm(data) {
	return request(`${ENV.BASE_API}/api/receipt/ukey/signUpdate?id=${data.id}`, data, 'POST', 2);
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 物泊-车辆附件信息导出
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/common/batchDownload`, data, 'GET', 1, 'blob');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}
