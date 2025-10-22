import ENV from '@/v2/config/env';
import request from '@/api/request';
// 电子采购合同、线下采购合同列表
export const API_getLadingBillContractList = data => request(`${ENV.BASE_API}/api/lading/listContractByPage`, data, 'POST', 2);
// 出入库记录列表
export const API_getStorageRecordOutList = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/manage/record/storageRecordOutPage`, data, 'POST', 2);

// 提货单列表
export const API_getLadingList = data => request(`${ENV.BASE_API}/api/lading/listByPage`, data, 'POST', 2);
// 提货单列表-数据导出
export const API_exportLadingList = data => request(`${ENV.BASE_API}/api/lading/exportExcel`, data, 'POST', 2, 'blob');
// 提货单列表-作废
export const API_invalidLading = data => request(`${ENV.BASE_API}/api/lading/cancel`, data, 'POST', 2);
// 提货单列表-删除
export const API_deleteLading = data => request(`${ENV.BASE_API}/api/lading/delete`, data, 'GET', 1);
// 提货单新增-编辑
export const API_getLadingBillSave = data => request(`${ENV.BASE_API}/api/lading/saveOrUpdate`, data, 'POST', 2);
// 提货单新增-获取合同信息
export const API_getContractInfo = data => request(`${ENV.BASE_API}/api/lading/getContractInfo`, data, 'GET', 1);
// 提货单详情
export const API_getLadingDetailInfo = data => request(`${ENV.BASE_API}/api/lading/detail`, data, 'GET', 1);

// 收货证明列表
export const API_getReceiptList = data => request(`${ENV.BASE_API}/api/receipt/listByPage`, data, 'POST', 2);
//收货证明详情
export const API_RECEIPT_DETAIL = data => request(`${ENV.BASE_API}/api/receipt/detail`, data, 'GET', 1);
//新增收货证明
export const API_SUBMIT_RECEIPT = data => request(`${ENV.BASE_API}/api/receipt/saveOrUpdate`, data, 'POST', 2);
//新增收货证明时获取合同详情
export const API_ADD_RECEIPT_DETAIL = data => request(`${ENV.BASE_API}/api/receipt/add/detail`, data, 'POST', 2);
// 收货证明列表-数据导出
export const API_exportReceiptList = data => request(`${ENV.BASE_API}/api/receipt/exportExcel`, data, 'POST', 2, 'blob');
// 收货证明列表-下载
export const API_downLoadReceiptFile = data => request(`${ENV.BASE_API}/api/receipt/batchDownload`, data, 'GET', 1, 'blob');
// 收货证明列表-作废
export const API_invalidReceiptFile = data => request(`${ENV.BASE_API}/api/receipt/cancel`, data, 'POST', 2);
// 收货证明列表-删除
export const API_deleteReceiptFile = data => request(`${ENV.BASE_API}/api/receipt/delete`, data, 'GET', 1);
export const API_getReceiptProveDataById = data => request(`${ENV.BASE_API}/api/receipt/detail`, data, 'GET');

// 提货详情下载指定类型文件
export const API_downloadLadingFile = data => request(`${ENV.BASE_API}/api/lading/download`, data, 'GET', 1, 'blob');

// 提货详情下载指定类型文件
export const API_downloadReceiptFile = data => request(`${ENV.BASE_API}/api/receipt/download`, data, 'GET', 1, 'blob');

// 提货单pdf预览链接
export const API_ladingPreviewPdf = data => request(`${ENV.BASE_API}/api/lading/previewPdf`, data, 'POST', 2);
// 编辑时判断pdf字段是否修改
export const API_ladingJudgePdfParamChange = data => request(`${ENV.BASE_API}/api/lading/judgePdfParamChange`, data, 'POST', 2);

// 获取企业是否开通电子签章模块
export const API_GetCompanyCertModel = data => request(`${ENV.BASE_USER_API}/api/cert/getCompanyCertModel`, data, 'GET');  