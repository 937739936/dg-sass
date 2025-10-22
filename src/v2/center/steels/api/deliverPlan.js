import ENV from '@/v2/config/env';
import request from '@/api/request';

// 查询企业接口
export function API_CommonCompanySearch(data) {
	return request(`${ENV.BASE_GANG_API}/common/companySearch`, data, 'GET');
}
// 获得有效的仓库列表
export function API_WarehouseContract(data) {
	return request(`${ENV.BASE_GANG_API}/warehouseContract/getValidWarehouse`, data, 'GET');
}

// 发货计划列表
export function API_ShipmentPlanList(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/getPage`, data, 'GET');
}
// 发货计划保存
export function API_ShipmentPlanSave(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/save`, data, 'POST', 2);
}
// 发货计划提交
export function API_ShipmentPlanSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/submit`, data, 'POST', 2);
}
// 发货计划详情
export function API_ShipmentPlanDetail(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/detail`, data, 'GET');
}
// 发货计划作废
export function API_ShipmentPlanCancel(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/cancel`, data, 'PUT');
}
// 发货计划完结
export function API_ShipmentPlanComplete(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/complete`, data, 'PUT');
}
// 发货计划取消
export function API_ShipmentPlanDelete(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/delete`, data, 'PUT');
}
// 发货计划统计
export function API_ShipmentPlanTotal(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/queryTotal`, data, 'GET');
}
// 导入发运货物明细
export const API_ShipmentPlanImport = `${ENV.BASE_GANG_API}/api/shipment/plan/particularsImport`;
// 更新车辆信息
export function API_ShipmentPlanUpdateParticulars(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/plan/updateParticulars`, data, 'POST', 2);
}
// 汽运详情
export function API_ShipmentPlanTrucksDetail(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/Trace/trucksDetail`, data, 'GET');
}
// 火运详情
export function API_ShipmentPlanTrainDetail(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/Trace/trainDetail`, data, 'GET');
}
// 汽运导出
export function API_ShipmentPlanTruckTraceExport(data) {
	return request(`${ENV.BASE_GANG_API}/api/shipment/Trace/truckTraceExport`, data, 'GET', 2, 'blob');
}
