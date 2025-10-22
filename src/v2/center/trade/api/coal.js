import ENV from '@/v2/config/env';
import request from '@/api/request';

//联运管家 -导出车号表
export function API_ExportTrainTable(data) {
	return request(`${ENV.BASE_API}/api/waybill/vehicle/export`, data, 'GET', 2, 'blob');
}

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

// 合同管理--销售合同列表
export const getSellContractList = data => request(`${ENV.BASE_API}/api/mine/part/list`, data, 'GET');

//销售合同--附件下载
export const downloadSellContractAttachment = id => {
	return request(`${ENV.BASE_API}/api/mine/part/download`, { id }, 'GET', 2, 'blob');
};

//发运管理--发运数据补录列表
export const getLogisticsList = data => request(`${ENV.BASE_API}/api/deliver/terminal/page`, data, 'GET');

//发运管理-- 发运数据补录删除
export const getLogisticsDelete = deliverId => request(`${ENV.BASE_API}/api/deliver/${deliverId}/delete`, '', 'GET');

// 收货记录列表——撤销收货
export function API_RECEIVERECORDCANCEL(data) {
	return request(`${ENV.BASE_API}/api/receive/cancel`, data, 'GET');
}

// 收货记录列表-撤销的收货记录列表
export function API_GetReceiveCancelList(data) {
	return request(`${ENV.BASE_API}/api/receive/cancelList`, data, 'GET');
}

// 调用企查查
export function API_getCommonGetCompanyDetailFromQichacha(data) {
	return request(`${ENV.BASE_API}/api/common/getCompanyDetailFromQichacha`, data, 'GET');
}

// 联运管家火运--根据运单号获取运单信息
export function API_getDeliverInfoTrains(data) {
	return request(`${ENV.BASE_API}/api/waybill/fill/deliver/info`, data, 'POST', 2);
}

// 联运管家火运-获取托运人列表
export function API_getApiTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/shipper/list`, data, 'GET');
}

// 联运管家火运-推送托运人
export function API_saveTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/sync/shipper`, data, 'GET');
}

//发运管理-- 发运数据补录详情
export const getLogisticsDetail = batchNo => request(`${ENV.BASE_API}/api/deliver/terminal/detail`, { batchNo }, 'GET');

//发运管理-- 查询补录合同发运信息
export const getLogisticsTerminalDelivery = contractId =>
	request(`${ENV.BASE_API}/api/deliver/terminal/terminalDelivery`, { contractId }, 'GET');

//发运管理--发运数据补录选择合同列表
export const getLogisticsContractList = data => request(`${ENV.BASE_API}/api/deliver/terminal/terminalContractPage`, data, 'GET');

//发运管理--发运数据补录提交
export const getLogisticsSubmit = data => request(`${ENV.BASE_API}/api/deliver/terminal/submit`, data, 'POST', 2);

//发运管理  驳回/确认
export const doLogisticsStatus = data => request(`${ENV.BASE_API}/api/deliver/terminal/confirmDeliver`, data, 'POST', 2);

// 联运管家火运-收发货获取轨迹详情
export function API_getRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/trajectory/detail`, data, 'GET');
}

//发运管理--发运数据补录收货
export const getLogisticsReceive = data => request(`${ENV.BASE_API}/api/deliver/terminal/receive`, data, 'POST', 2);

//发运管理-- 发运数据补录详情-打包下载收货信息附件
export const getLogisticsDownloadAll = receiveNo =>
	request(`${ENV.BASE_API}/api/deliver/terminal/receiveAttach/downloadAll`, { receiveNo }, 'GET', 2, 'blob');

//销售合同--合同详情--矿方
export const getSellContractDetail = id => request(`${ENV.BASE_API}/api/mine/part/detail`, { id }, 'GET');

//销售合同--驳回
export const doRejectSellContract = data => request(`${ENV.BASE_API}/api/mine/part/reject`, data, 'GET');

//销售合同--合同确认
export const doConfirmSellContract = id => request(`${ENV.BASE_API}/api/mine/part/confirm`, { id }, 'GET');

//结算单管理--结算单列表
export const getStatementList = data => request(`${ENV.BASE_API}/api/terminal/statement/page`, data, 'GET');

//结算单管理--结算单列表--下载
export const downloadStatementAttachment = data =>
	request(`${ENV.BASE_API}/api/terminal/statement/download`, data, 'GET', 2, 'blob');

//结算单管理--结算单获取详情
export const getStatementDetail = statementId => request(`${ENV.BASE_API}/api/terminal/statement/detail`, { statementId }, 'GET');

//结算单管理--结算单驳回
export const doRejectStatus = data => request(`${ENV.BASE_API}/api/terminal/statement/reject`, data, 'POST', 2);
//结算单管理--结算单确认
export const doStatementStatus = data => request(`${ENV.BASE_API}/api/terminal/statement/confirm`, data, 'POST', 2);
