/**
 * api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';

// 发票上传
export function FILE_UPLOAD_MULTIPLE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/uploadInvoiceFile`, data, 'POST', 3, 'json', 5 * 60 * 1000);
}

// 获取已经上传的发票附件
export function GET_INCREMENT_FILE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/getIncrementFile`, data, 'get', 2, 'json');
}

// 发票附件解析
export function INCREMENT_FILE_PARSE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/file/parse`, data, 'get', 2, 'json');
}

// 获取解析后的发票图片地址
export function GET_INCREMENTFILE_PATH(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/getIncrementFilePath`, data, 'get', 2, 'json');
}

// 发票识别
export function API_InvoiceImgScan(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}

// 批量下载发票
export function API_BatchDownloadFileByUrls(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/batchDownloadFileByUrls`, data, 'POST', 1, 'blob');
}

// 查询图片识别成功的数据
export function API_GetListImgScanSuccessData(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/listImgScanSuccess`, data, 'GET');
}

// 新运费发票详情识别
export function invoiceDetailImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/modify/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}

// 发票EXCEL识别
export const API_UPLOAD_EXCELSCAN = `${ENV.BASE_API}/api/kit/invoice/upload/excelScan`;

// 查询excel识别的数据
export function API_InvoiceListExcelScanAll() {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/listExcelScanAll`, '', 'GET');
}

// 导出excel
export function API_InvoiceExportXls(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/excel/exportXls`, data, 'GET', 1, 'blob');
}

// 查询excel识别成功的数据
export function API_InvoiceListExcelScanSuccess() {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/listExcelScanSuccess`, '', 'GET');
}

// 进项发票列表
export function API_GET_INVOICE_LIST_IN(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/page`, data, 'GET');
}

// 销售方列表
export function API_GET_SELLER_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/sellerNameList`, data, 'GET');
}

// 进项/运费财务主体列表
export function API_GET_BUYYER_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/buyerNameList`, data, 'GET');
}

// 商品名称列表
export function API_GET_GOODS_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/itemNameList`, data, 'GET');
}

// 发票类型
export function API_GET_INVOICE_TYPE_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/invoiceTypeList`, data, 'GET');
}

// 发票详情
export function API_GET_INVOICE_DETAIL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/detail`, data, 'GET');
}

// 发票列表导出
export function API_GET_INVOICE_EXPORT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/exportXls`, data, 'GET', 1, 'blob');
}

// 发票删除
export function API_INVOICE_DELETE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/delete`, data, 'GET');
}

// 入账日期列表
export function API_INVOICE_ENTRY_DATE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/recordDateList`, data, 'GET');
}

// 入账导出
export function API_GET_INVOICE_ENTRY_EXPORT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/exportXls`, data, 'GET', 1, 'blob');
}

// 入账列表
export function API_GET_INVOICE_ENTRY_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/page`, data, 'GET');
}

// 入账提交
export function API_GET_INVOICE_ENTRY_SUBMIT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/submit`, data, 'POST', 2);
}

// 入账详情
export function API_GET_INVOICE_ENTRY_DETAIL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/detail`, data, 'GET');
}

// 取消入账
export function API_GET_INVOICE_ENTRY_CANCEL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/delete`, data, 'GET');
}

// 商品名称列表
export function API_GET_GOODS_LIST_OUT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/itemNameList`, data, 'GET');
}

// 上游供应商列表
export function API_GET_UP_NAME_OUT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/upCompanyNameList`, data, 'GET');
}

// 下游客户列表
export function API_GET_DOWN_NAME_OUT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/buyerNameList`, data, 'GET');
}

// 销项发票财务主体列表
export function API_GET_FINACE_NAME_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/mainPartNameList`, data, 'GET');
}

// 销项列表数据
export function API_GET_OUT_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/page`, data, 'GET');
}

// 销项发票详情
export function API_GET_OUT_DETAIL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/detail`, data, 'GET');
}

// 销项发票修改
export function API_GET_OUT_EDIT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/submit`, data, 'POST', 2);
}

// 销项发票删除
export function API_GET_OUT_DELETE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/delete`, data, 'GET');
}

// 销项发票导出
export function API_GET_OUT_EXPORT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/commission/exportXls`, data, 'GET', 1, 'blob');
}

// 运费发票列表
export function API_GET_TRANS_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/page`, data, 'GET');
}

// 委托单导入
export const API_UPLOAD_COMMISSION = `${ENV.BASE_API}/api/kit/invoice/upload/commission/excelScan`;

// 委托单保存
export function API_COMMISSION_SUBMIT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/commission/save`, data, 'POST');
}

// 合同买方列表
export function API_BUYER_CONTRACT_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/buyerNameList`, data, 'GET');
}

// 合同卖方列表
export function API_SELLER_CONTRACT_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/sellerNameList`, data, 'GET');
}

// 采购合同列表
export function API_BUY_CONTRACT_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/page`, data, 'GET');
}

// 采购合同列表导出
export function API_BUY_CONTRACT_EXPORT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/exportXls`, data, 'GET', 1, 'blob');
}

// 采购合同详情
export function API_BUY_CONTRACT_DETAIL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/detail`, data, 'GET');
}

// 销售合同列表
export function API_SELL_CONTRACT_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/down/page`, data, 'GET');
}

// 销售合同列表导出
export function API_SELL_CONTRACT_EXPORT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/down/exportXls`, data, 'GET', 1, 'blob');
}

// 采购合同详情
export function API_SELL_CONTRACT_DETAIL(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/down/detail`, data, 'GET');
}

// 上游采购合同买方列表
export function API_BUY_UP_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/buyerNameList`, data, 'GET');
}

// 上游采购合同卖方列表
export function API_SELL_UP_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/up/sellerNameList`, data, 'GET');
}

// 下游销售合同买方列表
export function API_BUY_DOWN_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/down/buyerNameList`, data, 'GET');
}

// 上游采购合同卖方列表
export function API_SELL_DOWN_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/contract/down/sellerNameList`, data, 'GET');
}

// 批量保存发票
export function API_INVOICE_SAVE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/batchSave`, data, 'POST', 2);
}

// 清除图片缓存
export function API_InvoiceDelImgScanCache() {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/delImgScanCache`, {}, 'POST');
}

// 发票编辑提交
export function API_INVOICE_EDIT(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/submit`, data, 'POST', 2);
}

// 合同号模糊查询
export function API_CONTRACT_SEARCH_LIST(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/contractNoLike`, data, 'GET');
}

// 首次入账信息
export function API_INVOICE_ENTRY_ONCE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/accountBook/toRecordInfo`, data, 'POST', 2);
}

// 委托单保存
export function API_INVOICE_OUT_SAVE(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/upload/commission/save`, data, 'POST', 2);
}

// 上传发票单张图片删除
export const deleteSingleImage = data =>
	request(
		`${ENV.BASE_API}/api/kit/invoice/upload/delImgScanCacheByAttachment?attachmentUrl=${data.attachmentUrl}`,
		null,
		'POST',
		2
	);

// 发票红冲
export function API_INVOICE_RED(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/redDashed`, data, 'GET');
}

// 发票作废
export function API_INVOICE_VOID(data) {
	return request(`${ENV.BASE_API}/api/kit/invoice/invalid`, data, 'GET');
}
