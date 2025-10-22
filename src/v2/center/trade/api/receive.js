import ENV from '@/v2/config/env';
import request from '@/api/request';

// 联运管家火运-收发货获取轨迹详情
export function API_getRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/trajectory/detail`, data, 'GET');
}

// 铁路货运跟踪
export function API_GETTRAINRECORD(data) {
	return request(`${ENV.BASE_API}/api/deliver/trailRecordTrain`, data, 'GET');
}

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 船运历史轨迹判断
export function API_GetShipTrackFlag(data) {
	return request(`${ENV.BASE_API}/api/deliver/getShipTrackFlag`, data, 'GET');
}

// 联运管家火运--根据运单号获取运单信息
export function API_getDeliverInfoTrains(data) {
	return request(`${ENV.BASE_API}/api/waybill/fill/deliver/info`, data, 'POST', 2);
}

//司机发运信息保存与修改
export function dispatchDriverSaveOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/driver/dispatch/plan/saveOrUpdate`, data, 'POST', 2);
}

// 物泊-轨迹信息导出
export function API_getDeliverLogisticsTruckInfoExportXls(data) {
	return request(`${ENV.BASE_API}/api/deliver/logisticsTruckInfoExportXls`, data, 'GET', 1, 'blob');
}

//发货管理新增发货时发运计划列表
export function dispatchList(data) {
	return request(`${ENV.BASE_API}/api/driver/dispatch/plan/list`, data, 'POST', 2);
}

// 调用企查查
export function API_getCommonGetCompanyDetailFromQichacha(data) {
	return request(`${ENV.BASE_API}/api/common/getCompanyDetailFromQichacha`, data, 'GET');
}

// 陆港通——根据企业名称查询货源列表
export function API_getDeliverListGoodsSourceByCompanyName(data) {
	return request(`${ENV.BASE_API}/api/deliver/listGoodsSourceByCompanyName`, data, 'GET');
}

// 物泊-更新货源信息
export function API_postDeliverUpdatePublishNum(data) {
	return request(`${ENV.BASE_API}/api/deliver/updatePublishNum`, data, 'POST');
}

// 物泊-车辆附件信息导出
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/common/batchDownload`, data, 'GET', 1, 'blob');
}

//获取始发到港时间
export function API_GetPortTimeList(data) {
	return request(`${ENV.BASE_API}/api/deliver/getPortInTimeList`, data, 'GET');
}

// 物泊-获取船运实时轨迹
export function API_getDeliverGetRpcShip(data) {
	return request(`${ENV.BASE_API}/api/deliver/getRpcShip`, data, 'GET');
}

//模糊匹配港口名称
export function API_GetPortList(data) {
	return request(`${ENV.BASE_API}/api/deliver/getPortList`, data, 'GET');
}

//联运管家 -导出车号表
export function API_ExportTrainTable(data) {
	return request(`${ENV.BASE_API}/api/waybill/vehicle/export`, data, 'GET', 2, 'blob');
}

// 收货记录列表
export function API_RECEIVERECORDLISTWait(data) {
	return request(`${ENV.BASE_API}/api/receive/receiveRecordList/waitReceive`, data, 'POST', 2);
}
// 收货记录-船运列表
export function API_DEVICESHIPLIST(data) {
	return request(`${ENV.BASE_API}/api/device/ship/list`, data, 'GET');
}
// 收货记录列表
export function API_RECEIVERECORDLISTReady(data) {
	return request(`${ENV.BASE_API}/api/receive/receiveRecordList/received`, data, 'POST', 2);
}

// 收货记录列表——撤销收货
export function API_RECEIVERECORDCANCEL(data) {
	return request(`${ENV.BASE_API}/api/receive/cancel`, data, 'POST', 2);
}

// 收货记录列表-撤销的收货记录列表
export function API_GetReceiveCancelList(data) {
	return request(`${ENV.BASE_API}/api/receive/cancelList`, data, 'GET');
}

// 收发货状态提示
export function deliver(data) {
	return request(`${ENV.BASE_NET}api/deliver/getStatusTip`, data, 'GET');
}

// 发货申请保存
export function API_DELIVERYSAVE(data) {
	return request(`${ENV.BASE_API}/api/deliver/save`, data, 'POST', 2);
}

// 联运管家火运-获取托运人列表
export function API_getApiTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/shipper/list`, data, 'GET');
}

// 联运管家火运-推送托运人
export function API_saveTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/sync/shipper`, data, 'GET');
}

// 发货申请列表
export function API_GETDELIVERAPPLYLIST(data) {
	return request(`${ENV.BASE_API}/api/deliver/deliverApplyList`, data, 'POST', 2);
}

// 发货申请记录
export function API_DELIVERYRECORDLIST(data) {
	return request(`${ENV.BASE_API}/api/deliver/deliverRecordList`, data, 'POST', 2);
}

// 派车计划列表
export function API_getDispatchPlanList(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/page`, data, 'POST', 2);
}
// 派车计划详情
export function API_getDispatchPlanDetail(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/detail`, data, 'GET');
}
// 发运明细详情
export function API_getDispatchPlanshippingDetail(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/getShippingDetails`, data, 'POST', 2);
}
// 导出车号表
export function API_exportDispatchCarNumberTable(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/shippingDetail/exportExcel`, data, 'POST', 2, 'blob');
}
// 批量下载磅单
export function API_exportDispatchPoundOrder(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/downloadZip`, data, 'POST', 2, 'blob');
}
// 派车计划导出
export function API_exportDispatchPlan(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/orderDispatchPlan/export`, data, 'POST', 2, 'blob');
}
// 获取发货选择的合同详情
export function API_getSelectContractDetail(data) {
	return request(`${ENV.BASE_API}/api/deliver/contractSelect`, data, 'GET');
}
// 发货详情
export function API_getDeliverRecordInfo(data) {
	return request(`${ENV.BASE_API}/api/deliver/deliverRecordInfo`, data, 'GET');
}
// 发货详情-业务线跳转的
export function API_getDeliverRecordBusinessInfo(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/detail`, data, 'GET');
}
// 发货作废
export function API_getCancelRecord(data) {
	return request(`${ENV.BASE_API}/api/deliver/cancel`, data, 'POST', 2);
}
// 收货作废
export function API_getCancelRecordAccept(data) {
	return request(`${ENV.BASE_API}/api/receive/cancelReceivedRecord`, data, 'GET');
}
// 收货详情
export function API_getReceiveRecordInfo(data) {
	return request(`${ENV.BASE_API}/api/receive/receiveRecordInfo`, data, 'POST', 2);
}
// 收货详情
export function API_RECEIVESAVE(data) {
	return request(`${ENV.BASE_API}/api/receive/save`, data, 'POST', 2);
}
// 发货-订单维度收发货数量统计
export function API_deliverQuantityStatistics(data) {
	return request(`${ENV.BASE_API}/api/deliver/quantityStatistics`, data, 'GET');
}
//运输信息- 删除船舶时检查是否处于监控中状态
export function API_checkUsedInMonitor(id) {
	return request(`${ENV.BASE_API}/api/deliver/checkDeliverShipMonitorStatusNotInMonitor`, { id }, 'GET');
}
//判断合同是否已关联“汽运上/下煤计划”
export function API_checkCoalPlanByOrder(data) {
	return request(`${ENV.BASE_API}/api/deliver/checkCoalPlanByOrder`, data, 'GET');
}
//查询当前用户最新20条港口地址
export function API_deliverGetPortSearchHistorys(data) {
	return request(`${ENV.BASE_API}/api/deliver/getPortSearchHistory`, data, 'GET');
}
//存储当前用户搜索港口记录
export function API_deliverShipPortSearchLogSave(data) {
	return request(`${ENV.BASE_API}/api/deliver/shipPortSearchLogSave`, data, 'POST', 2);
}
// /收货 获取选择的站台列表
export function getStationList(data) {
	return request(`${ENV.BASE_STATION_API}/api/storage/manage/record/list/station/by/contract/no`, data, 'GET');
}
export function getAddStationList(data) {
	return request(`${ENV.BASE_STATION_API}/api/station/listByConditions`, data, 'POST', 2);
}
/** 发货批次下载附件 */
export function sendDownloadAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/downloadAttach`, data, 'POST', 2, 'blob');
}
/** 发货批次删除附件 */
export function sendDeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/deleteAttach`, data, 'POST', 2);
}

/** 发货上传附件 */
export function sendAddAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/addAttach`, data, 'POST', 2);
}
export const commonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_API}/api/deliver/addAttach?t=${t}`, data, 'POST', 3, 'json', 5 * 60 * 1000);
};

export const receiveCommonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_API}/api/common/file/upload/batch?t=${t}`, data, 'POST', 2);
};
export const receiveOcr = data => {
	return request(`${ENV.BASE_API}/api/receive/uploadAndOcrPoundBill`, data, 'POST', 2);
};
/** 收货上传附件 */
export function API_UPLOAD_FILE(data) {
	return request(`${ENV.BASE_API}/api/common/file/upload`, data, 'POST', 2);
}
