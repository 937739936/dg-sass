import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取发货选择的合同详情
export function API_queryOfflineContractDetail(data) {
	return request(`${ENV.BASE_API}/api/deliver/deliverApply/queryOfflineContractDetail`, data, 'GET');
}

// 发货申请列表
export function API_pageOfflineContract(data) {
	return request(`${ENV.BASE_API}/api/deliver/deliverApply/pageOfflineContract`, data, 'POST', 2);
}
