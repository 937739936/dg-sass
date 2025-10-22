import ENV from '@/v2/config/env';
import request from '@/api/request';
// 获取文件列表
export function getWpsFileList(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/page`, data, 'GET');
}
// 复制
export function copyWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/copy/${data.id}`, data, 'GET');
}
// 移动
export function moveWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/move/${data.id}`, data, 'GET');
}
// 创建文件文件夹
export function createWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file`, data, 'POST', 2);
}
// 重命名
export function renameWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/rename/${data.id}`, data, 'GET');
}
// 分享文件
export function shareWpsInfo(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/shareLink`, data, 'POST', 2);
}
// 分享历史
export function shareHistoryWps(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/shareHistory/${id}`, '', 'GET');
}
// 分享用户列表
export function shareListWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/user/shareList`, data, 'GET');
}
// iframe链接
export function wpsFileLink(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/fileLink/${data.id}`, data, 'GET');
}
// 删除文件、文件夹
export function deleteWpsFile(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/${id}`, '', 'DELETE');
}
// 上传文件
export const wpsFileUpload = `${ENV.BASE_GANG_API}/api/cloudDoc/file/upload`;
// 鉴权
export function checkWhetherPushWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/user/checkWhetherPush`, data, 'GET');
}
// 下载文件
export function downloadCloudDoc(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/download/${id}`, '', 'GET', 1, 'blob');
}
// 判断当前云表格是否有文件夹
export function API_isExistFolderWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/isExistFolder`, data, 'GET');
}
/** 盯市管理 */
export const getMarketPriceList = data => request(`${ENV.BASE_GANG_API}/api/marketPrice/getPage`, data, 'GET');
/** 盯市管理详情 */
export const getMarketPriceDetail = data => request(`${ENV.BASE_GANG_API}/api/marketPrice/chart`, data, 'GET');

//盯市根据区域和钢材重量查询品名和钢厂产地
export const getFilterItem = data => request(`${ENV.BASE_GANG_API}/api/marketPrice/getFilterItem`, data, 'GET');


//获取最大有效日期
export const getEffectiveMaxDate = data => request(`${ENV.BASE_GANG_API}/api/marketPrice/getEffectiveMaxDate`, data, 'GET');