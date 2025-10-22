import ENV from '@/v2/config/env';
import request from '@/api/request';
export const API_SteelsUploadFileWaterMark = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`;
// 异常发票记录
export const getUnusualList = data => request(`${ENV.BASE_API}/api/invoice/incorrectInvoice/page`, data, 'GET');
// 异常发票记录导出
export const exportUnusual = data => request(`${ENV.BASE_API}/api/invoice/incorrectInvoice/exportXls`, data, 'GET', 1, 'blob');

// 上传发票单张图片删除
export const deleteSingleImage = data =>
	request(`${ENV.BASE_API}/api/invoice/common/delImgScanCacheByAttachment?attachmentUrl=${data.attachmentUrl}`, null, 'POST', 2);
// 发票列表 统一
export function getInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/list`, data, 'GET');
}
// 发票红冲
export function reverseInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/reverse`, data, 'GET');
}
// 发票 列表删除
export function deleteInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/delete`, data, 'GET');
}
// 发票作废
export function invalidInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/invalid`, data, 'GET');
}

// 发票统一导出
export function exportInvoiceXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/export`, data, 'GET', 1, 'blob');
}
// 发票excel上传异常发票导出
export function exportInvoiceFailXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/error/invoice/export`, data, 'GET', 1, 'blob');
}

// 发票任务列表
export const getTaskList = data => request(`${ENV.BASE_API}/api/invoice/task/list`, data, 'GET');
// 上传图片发票
/*** 解决重复上传 */
export function NEW_FILE_UPLOAD_MULTIPLE(data) {
	return request(`${ENV.BASE_API}/api/invoice/upload?t=${new Date().getTime()}`, data, 'POST', 3, 'json', 5 * 60 * 1000);
}
// 上传excel发票
export function NEW_EXCEL_UPLOAD_MULTIPLE(data) {
	return request(`${ENV.BASE_API}/api/invoice/excel/upload?t=${new Date().getTime()}`, data, 'POST', 3, 'json', 5 * 60 * 1000);
}

// 删除发票任务

export function deleteTask(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/delete`, data, 'GET');
}
// 删除发票任务 打断上传 通过随机数
export function deleteTaskProgress(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/delete/progress`, data, 'GET');
}
// 获取发票任务信息详情
export function getRelInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/invoice/list`, data, 'GET');
}
// 发票任务关联发票删除
export function deleteRelInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/invoice/delete`, data, 'GET');
}
// 发票任务关联发票重新识别
export function againCheckInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/ocr/check/again`, data, 'POST', 2);
}
// 发票替换
export function replaceInvoice(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/replace`, data, 'POST', 3, 'json', 5 * 60 * 1000);
}
// 发票关联合同
export function getContractList(data) {
	return request(`${ENV.BASE_API}/api/invoice/rel/contract/list`, data, 'GET');
}
// 发票详情
export function getInvoiceDetail(data) {
	return request(`${ENV.BASE_API}/api/invoice/detail`, data, 'GET');
}

// 发票编辑保存
export function saveEdit(data) {
	return request(`${ENV.BASE_API}/api/invoice/edit`, data, 'POST', 2);
}
// 编辑页面 运费发票 删除
export function delInvoiceEdit(data) {
	return request(`${ENV.BASE_API}/api/invoice/delete/rel`, data, 'GET');
}

// 发票新增 check
export function saveCheckEdit(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchSave/check`, data, 'POST', 2);
}
// 发票新增保存
export function saveAdd(data) {
	return request(`${ENV.BASE_API}/api/invoice/save`, data, 'POST', 2);
}
// 发票excel关联合同编辑保存
export function saveExcelEdit(data) {
	return request(`${ENV.BASE_API}/api/invoice/task/rel/edit`, data, 'POST', 2);
}
// 发票上传
export const API_UPLOAD_INVOICE = `${ENV.BASE_API}/api/invoice/common/uploadInvoiceFile`;
// 发票识别
export function API_InvoiceImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}
// 批量下载发
export function API_BatchDownloadFileByUrls(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/batchDownloadFileByUrls`, data, 'POST', 1, 'blob');
}
// 查询图片识别成功的数据
export function API_GetListImgScanSuccessData(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/listImgScanSuccess`, data, 'GET');
}
// 新运费发票详情识别
export function invoiceDetailImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/modify/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}
// 红冲发票识别
export function API_RedInvoiceImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/red/imgScan`, data, 'POST');
}