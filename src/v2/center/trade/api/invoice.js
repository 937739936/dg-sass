import ENV from '@/v2/config/env';
import request from '@/api/request';

// 清除图片缓存
export function API_InvoiceDelImgScanCache() {
	return request(`${ENV.BASE_API}/api/invoice/common/delImgScanCache`, {}, 'POST');
}

// 进项发票关联合同列表列表
export function API_GetInvoicelistBuyContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/listBuyContract`, data, 'GET');
}

// 销项发票关联合同列表列表
export function API_GetInvoicelistSellContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/listSellContract`, data, 'GET');
}

// 运费发票关联合同列表列表
export function API_GetInvoicelistFreightContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/listDeliverInvoiceContract`, data, 'GET');
}

// 发票EXCEL识别
export const API_UPLOAD_EXCELSCAN = `${ENV.BASE_API}/api/invoice/common/excelScan`;

// 查询excel识别的数据
export function API_InvoiceListExcelScanAll() {
	return request(`${ENV.BASE_API}/api/invoice/common/listExcelScanAll`, '', 'GET');
}

// 导出excel
export function API_InvoiceExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/excel/exportXls`, data, 'GET', 1, 'blob');
}

// 查询excel识别成功的数据
export function API_InvoiceListExcelScanSuccess() {
	return request(`${ENV.BASE_API}/api/invoice/common/listExcelScanSuccess`, '', 'GET');
}

// 发票详情
export function API_InvoiceDetailNew(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/detail`, data, 'GET');
}

// 发票修改
export function API_InvoiceModifyNew(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/modify`, data, 'POST', 2);
}

// 获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}

// 运费发票导出
export function API_InvoiceFreightExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/exportXls`, data, 'GET', 1, 'blob');
}

// 进项发票列表
export function API_GetBuyInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/list`, data, 'GET');
}

// 销项发票列表
export function API_GetSellInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/list`, data, 'GET');
}

// 运费发票列表
export function API_GetFreightInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/list`, data, 'GET');
}

// 进项发票导出
export function API_InvoiceBuyExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/exportXls`, data, 'GET', 1, 'blob');
}

// 销项发票导出
export function API_InvoiceSellExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/exportXls`, data, 'GET', 1, 'blob');
}

// 发票删除
export function API_InvoiceDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/delete`, data, 'POST');
}

export function API_EXPORT_INVOICE(type = 2, DATA) {
	/**
	 *    @type 1 下载发票附件  2导出发票四要素
	 */
	let path = '';
	if (type === 1) {
		path = `/api/invoice/common/batchDownloadFileByIds`;
	} else {
		path = `/api/invoice/common/exportXlsByIds`;
	}
	return request(ENV.BASE_API + path, DATA, 'GET', 2, 'blob');
}

// 红冲发票
export function API_InvoiceCommonReverse(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/reverse`, data, 'GET');
}

// 作废发票
export function API_InvoiceCommonInvalid(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/invalid`, data, 'GET');
}

// 批量发票信息保存
export function API_InvoiceBatchSave(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/batchSave`, data, 'POST', 2);
}

// 发票检测
export const batchInvoiceCheck = data => request(`${ENV.BASE_API}/api/invoice/common/batchSave/check`, data, 'POST', 2);

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

// 上传发票单张图片删除
export const deleteSingleImage = data =>
	request(`${ENV.BASE_API}/api/invoice/common/delImgScanCacheByAttachment?attachmentUrl=${data.attachmentUrl}`, null, 'POST', 2);

export function FILE_UPLOAD_MULTIPLE(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/uploadInvoiceFile`, data, 'POST', 3, 'json', 5 * 60 * 1000);
}

export function GET_INCREMENT_FILE(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/getIncrementFile`, data, 'get', 2, 'json');
}

export function INCREMENT_FILE_PARSE(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/file/parse`, data, 'get', 2, 'json');
}

export function GET_INCREMENTFILE_PATH(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/getIncrementFilePath`, data, 'get', 2, 'json');
}

// 发票重构——单张发票识别
export function API_postInvoiceDoSingleInvoiceScan(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/singleInvoiceScan`, data, 'POST', 2);
}

// 发票重构——单张发票保存
export function API_postInvoiceDoSave(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/save`, data, 'POST', 2);
}

// 异常发票记录
export const getUnusualList = data => request(`${ENV.BASE_API}/api/invoice/incorrectInvoice/page`, data, 'GET');
// 异常发票记录导出
export const exportUnusual = data => request(`${ENV.BASE_API}/api/invoice/incorrectInvoice/exportXls`, data, 'GET', 1, 'blob');

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

// 保存发票
export function API_INVOICESAVE(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/save`, data, 'POST', 2);
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

//获取订单是否有付款
export function API_ORDER_HAS_PAYMENT(data) {
	/**
	 * data.orderSerialNo 订单id
	 * data.code         发票代码
	 * data.no           发票号码
	 * */
	return request(`${ENV.BASE_API}/api/invoiceDO/hasPayment`, data, 'GET');
}

// 发票重构——发票excel批量识别
export const API_postInvoiceDoExcelBatchScan = `${ENV.BASE_API}/api/invoiceDO/excelBatchScan`;

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 发票Excel批次列表数据
export function API_InvoiceBatchExcelList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchExcel/list`, data, 'GET');
}

// 发票批次详情数据EXCEL
export function API_InvoiceBatchExcelItemList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemExcel/list`, data, 'GET');
}

// 发票批次删除EXCEL
export function API_InvoiceBatchExcelDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemExcel/deleteAll`, data, 'POST');
}

// 发票重新识别EXCEL
export function API_InvoiceReAddExcel(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchEditExcel/reAdd/${data.itemId}`, '', 'GET');
}

// 发票批次处理详情数据EXCEL
export function API_InvoiceBatchOperateExcelItemList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemOperateExcel/list`, data, 'GET');
}

// 发票重构——关联订单信息保存
export function API_postInvoiceDoBatchInvoiceOrderRelSave(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/batch/invoiceOrderRel/save`, data, 'POST', 2);
}

// 发票批量识别图片
export const API_INVOICEBATCHUPLOAD_IMG = `${ENV.BASE_API}/api/invoice/imgBatchScan`;

// 发票批次保存
export function API_INVOICEBATCHSAVE(data) {
	return request(`${ENV.BASE_API}/api/invoice/batch/save`, data, 'POST', 2);
}

// 发票批次列表
export function API_INVOICEBATCHLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batch/list`, data, 'GET');
}

// 发票批次详情数据图片
export function API_INVOICEBATCHITEMLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItem/list`, data, 'GET');
}

// 发票批次处理详情数据图片
export function API_INVOICEBATCHOPERATEITEMLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemOperate/list`, data, 'GET');
}

// 发票批次详情删除图片
export function API_INVOICEBATCHITEMDELETE(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItem/deleteAll`, data, 'POST');
}

// 发票重新识别图片
export function API_INVOICEREADD(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchEdit/reAdd/${data.itemId}`, '', 'GET');
}

// 获取关联订单列表
export function API_GET_LINKORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/order/list`, data, 'GET');
}

// 发票列表 发票关联订单
export function API_INVOICES_LINK_ORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/batch/invoiceOrderRel/save`, data, 'POST', 2);
}

export const API_SteelsUploadFileWaterMark = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`;

// 发票列表 批量红冲
export function API_INVOICES_REVERSE_BATCH(data) {
	return request(`${ENV.BASE_API}/api/invoice/reverse/batch`, data, 'POST', 2);
}

// 发票列表 批量作废
export function API_INVOICES_INVALID_BATCH(data) {
	return request(`${ENV.BASE_API}/api/invoice/invalid/batch`, data, 'POST', 2);
}

// 发票列表 批量删除
export function API_INVOICES_DELETE_BATCH(data) {
	return request(`${ENV.BASE_API}/api/invoice/delete/batch`, data, 'POST', 2);
}
