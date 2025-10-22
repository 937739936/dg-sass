import ENV from '@/v2/config/env';
import request from '@/api/request';

// 完善合同附件上传
export const API_ContractAttachFilesUpload = `${ENV.BASE_API}/api/terminal/attachment/upload`;

export const contractAttachFilesUpload = data => request(`${ENV.BASE_API}/api/terminal/attachment/upload`, data, 'POST', 2);

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 完善合同-删除结算单附件
export function API_DeleteSettlementFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/delete/attachment`, data, 'GET');
}

// 完善合同--删除附件
export function API_DeleteContractFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/delete/attachment`, data, 'GET');
}

//业务监控--下游--核心企业、资方-上传下游合同附件
export const API_DownstreamContractUpload = `${ENV.BASE_API}/api/terminal/attachment/upload/single`;

// 新单个文件上传（善美保理新增）
export const API_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/upload`;

// 发货申请 删除附件
export function API_DeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/delete/attach`, data, 'GET');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

export const commonAttachFilesUpload = data => request(`${ENV.BASE_API}/api/common/upload`, data, 'POST', 2);

/**
 * 站台相关附件上传
 */
export const commonStationUpload = data => request(`${ENV.BASE_STATION_API}/common/upload`, data, 'POST', 2);

// 新单个文件上传（新）
export const API_NEW_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/new/upload`;

// 站台上传文件地址
export const API_STATION_UPLOAD_FILE = `${ENV.BASE_STATION_API}/common/upload`;
