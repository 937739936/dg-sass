/**
 * api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';

// 一般贸易商驳回

/** 获取发票明细列表 */
export const getInvoiceToolsDetailList = data => request(`${ENV.BASE_API}/api/invoice/tools/itemList`, data, 'GET');

/** 获取发票列表 */
export const getInvoiceToolsList = data => request(`${ENV.BASE_API}/api/invoice/tools/list`, data, 'GET');

/** 导出发票 */
export const exportInvoiceTool = data => request(`${ENV.BASE_API}/api/invoice/tools/export`, data, 'GET', 1, 'blob');
/** 导出发票明雄 */
export const exportInvoiceDetailTool = data => request(`${ENV.BASE_API}/api/invoice/tools/itemExport`, data, 'GET', 1, 'blob');

/** 删除发票 */
export const delInvoice = data => request(`${ENV.BASE_API}/api/invoice/tools/delete`, data, 'DELETE');

/** 发票统计 */
export const invoiceStatistics = data => request(`${ENV.BASE_API}/api/invoice/tools/statistics`, data, 'GET');
// 明细列表统计
export const invoiceStatisticsDetail = data => request(`${ENV.BASE_API}/api/invoice/tools/itemStatistics`, data, 'GET');
/** 发票工具 任务详情 */
export const getInvoiceTaskDetail = data => request(`${ENV.BASE_API}/api/invoice/tools/taskDetail`, data, 'GET');
// 发票保存
export const saveInvoiceTask = data => request(`${ENV.BASE_API}/api/invoice/tools/save`, data, 'POST', 2);
// excel 发票 编辑保存
export const saveExcelInvoice = data => request(`${ENV.BASE_API}/api/invoice/tools/excelEdit`, data, 'POST', 2);
/** 四要素上传发票 */
export const nextFourFactor = data => request(`${ENV.BASE_API}/api/invoice/tools/fourFactor/upload`, data, 'POST', 2);
// 获取四要素详情
export const getFourFactorDetail = data => request(`${ENV.BASE_API}/api/invoice/tools/fourFactor/detail`, data, 'GET');
/** 四要素保存 */
export const saveFourFactor = data => request(`${ENV.BASE_API}/api/invoice/tools/fourFactor/save`, data, 'GET');
// excel上传验证错误发票导出
export const exportErrorInvoice = data =>
	request(`${ENV.BASE_API}/api/invoice/tools/excel/error/export`, data, 'POST', 2, 'blob');
// 四要素导出
export const exportFourInvoice = data =>
	request(`${ENV.BASE_API}/api/invoice/tools/fourFactor/saveAfterExport`, data, 'POST', 2, 'blob');

// 保存 导出 销货清单
export const saveAfterExport = data => request(`${ENV.BASE_API}/api/invoice/tools/saveAfterExport`, data, 'POST', 2, 'blob');
/** 发票详情 */
export const getInvoiceDetail = data => request(`${ENV.BASE_API}/api/invoice/tools/detail`, data, 'GET');

export const againCheckInvoice = data => request(`${ENV.BASE_API}/api/invoice/tools/ocr/check/again`, data, 'POST', 2);

export const replaceInvoice = data => request(`${ENV.BASE_API}/api/invoice/tools/ocr/check/replace`, data, 'POST', 2);

/** 查看当前开通服务 */
export const isShowTool = data => request(`${ENV.BASE_API}/api/invoice/tools/opened`, data, 'GET');
