// 回款闭环管理
// 郭凯宣--2022/9/2
import ENV from '@/v2/config/env';
import request from '@/api/request';

// 回款流水数据列表
export function getFlowDataList(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getDataList`, data, 'GET');
}
// 查询报表数据是否可修改
export function checkBusinessLineEnd(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/checkBusinessLineEnd`, data, 'GET');
}
// 查询报表数据
export function getFlowDetail(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getDataDetail`, data, 'GET');
}
// 下游合同数据列表-分页
export function getTerminalContractList(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getTerminalContractList`, data, 'GET');
}
// 下游合同数据,业务线过来反显合同信息，查询
export function getTerminalContractById(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getTerminalContractById`, data, 'GET');
}
// 回款关联业务线列表
export function getBusinessLineListByCollection(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getBusinessLineListByCollection`, data, 'GET');
}
// 根据业务线获取认领历史列表
export function getBusinessLineClaimedList(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getBusinessLineClaimedList`, data, 'GET');
}
// 单笔录入
export function saveSingleArtificialData(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/saveSingleArtificialData`, data, 'POST', 2);
}
// 认领数据作废
export function invalidCollectionFlow(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/invalidCollectionFlow`, data, 'GET');
}
// 获取认领修改页数据
export function getModifyDetailData(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/getModifyDetailData`, data, 'GET');
}
// 回款流水excel上传
export function excelScan(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/excelScan`, data, 'POST', 2);
}
// 回款流水excel提交
export function confirmExcelSubmit(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/confirmExcelSubmit`, data, 'POST', 2);
}
// 认领数据维度统计数据列表-分页
export function getClaimStatisticsList(data) {
	return request(`${ENV.BASE_API}/api/collection/monitor/getClaimStatisticsList`, data, 'GET');
}
// 业务线维度统计数据列表-分页
export function getBusinessStatisticsList(data) {
	return request(`${ENV.BASE_API}/api/collection/monitor/getBusinessStatisticsList`, data, 'GET');
}
// 业务线维度统计数据列表-分页
export function getCollectionOaWarmList(data) {
	return request(`${ENV.BASE_API}/api/collection/warm/info/getDataList`, data, 'GET');
}

// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}

// 回款认领详情 回款类型为商承和银承时-汇票
export function API_GetCollectionCollectionBillDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionBillDetail`, '', 'GET');
}

// 回款认领详情 电汇
export function API_GetCollectionCollectionTeleDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionTeleDetail`, '', 'GET');
}
