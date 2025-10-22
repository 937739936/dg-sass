import ENV from '@/v2/config/env';
import request from '@/api/request';

// 发货申请销售合同列表
export function API_SteelsDeliverContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/shipmentContractPage`, data, 'GET');
}
// 提交发货申请
export function API_SteelsDeliverSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/submit`, data, 'POST', 2);
}

// 取消发货申请
export function API_SteelsDeliverDelete(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}`, '', 'DELETE');
}
// 作废发货申请
export function API_SteelsDeliverVoid(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/invalid/${data.deliverId}`, data, 'GET');
}
// 保存发货申请
export function API_SteelsDeliverSave(data) {
	return request(`${ENV.BASE_GANG_API}/shipment`, data, 'POST', 2);
}
// 修改发货申请
export function API_SteelsDeliverUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/shipment`, data, 'PUT', 2);
}

// 获取合同详情-发货申请定制
export function API_SteelsDeliverContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}/getContractInfo`, '', 'GET');
}
// 采销合同关联-end
export function API_SteelsReceiveCancelShipment(data) {
	return request(`${ENV.BASE_GANG_API}/receive/cancelShipment`, data, 'POST', 2);
}
export function API_SteelsReceiveFindAllReceiveRecords(data) {
	return request(`${ENV.BASE_GANG_API}/receive/findAllReceiveRecords/${data}`, data, 'GET');
}
// 收货确认可选数据列表
export function API_SteelsReceiveContractList(data) {
	return request(`${ENV.BASE_GANG_API}/receive/getReceivingPage`, data, 'GET');
}
// 收货详情
export function API_SteelsReceiveDetail(data) {
	return request(`${ENV.BASE_GANG_API}/receive/${data}`, '', 'GET');
}
// 收发货管理
// 发货列表
export function API_SteelsDeliverList(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/page`, data, 'GET');
}
export function API_SteelsReceiveChangeStatus(data) {
	return request(`${ENV.BASE_GANG_API}/receive/changeStatus/${data}`, data, 'GET');
}
// 发货详情
export function API_SteelsDeliverDetail(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}`, '', 'GET');
}
// 收货确认提交
export function API_SteelsReceiveSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/receive`, data, 'POST', 2);
}

// 收货列表
export function API_SteelsReceiveList(data) {
	return request(`${ENV.BASE_GANG_API}/receive/page?`, data, 'GET');
}
