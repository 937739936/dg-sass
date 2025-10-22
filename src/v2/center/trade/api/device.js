import ENV from '@/v2/config/env';
import request from '@/api/request';

//设备管理-分页条件查询
export function API_DEVICELIST(data) {
	return request(`${ENV.BASE_API}/api/device/page`, data, 'GET');
}
//设备管理-导出
export function API_DEVICEEXPORT(data) {
	return request(`${ENV.BASE_API}/api/device/export`, data, 'GET', 1, 'blob');
}
//设备管理-根据设备序列号查询设备型号和版本
export function API_DEVICEINFO(data) {
	return request(`${ENV.BASE_API}/api/device/info`, data, 'GET');
}
//设备管理-设备名称唯一性校验
export function API_DEVICENAME(data) {
	return request(`${ENV.BASE_API}/api/device/name`, data, 'GET');
}
//设备管理-设备详情
export function API_DEVICEDETAIL(data) {
	return request(`${ENV.BASE_API}/api/device/detail`, data, 'GET');
}
//设备管理-新增设备
export function API_DEVICEDEADD(data) {
	return request(`${ENV.BASE_API}/api/device/add`, data, 'POST', 2);
}
//设备管理-设备编辑保存
export function API_DEVICEDEUPDATE(data) {
	return request(`${ENV.BASE_API}/api/device/update`, data, 'POST', 2);
}
//监控查询-监控
export function API_DEVICEDEMONITOR(data) {
	return request(`${ENV.BASE_API}/api/device/monitor`, data, 'GET');
}
//监控查询-获取监控设备token
export function API_DEVICEDEACCESSTOKEN(data) {
	return request(`${ENV.BASE_API}/api/device/accessToken/${data.type}`, data, 'GET');
}
