import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取配煤查询参数列表
export const getCoalBlendingSearchParams = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/getPageParam`, data, 'GET');
// 获取配煤列表
export const getCoalBlendingPage = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/page`, data, 'POST', 2);
// 获取配煤列表
export const invalidCoalBlendingRecord = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/${data}/cancel`, {}, 'GET');
// 获取配煤详情信息详情
export const getCoalBlendingeDetail = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/${data}/detail`, {}, 'GET');

// 获取煤种库存信息
export const getCoalTypeInventory = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/getCoalTypeInventory`, data, 'GET');
// 保存配煤信息
export const saveCoalBlendingInfo = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/modify`, data, 'POST', 2);

// 获取关联业务线列表
export const getBusinessLinePage = data => request(`${ENV.BASE_STATION_API}/api/businessLine/page`, data, 'POST', 2);

// 获取关联业务线详情
export const getBusinessLineDetail = data => request(`${ENV.BASE_STATION_API}/api/businessLine/detail`, data, 'POST', 1);

// 获取煤种上一次的单价
export const getCoalTypeLastPrice = data => request(`${ENV.BASE_STATION_API}/api/blendingCoal/getCoalTypeLastPrice`, data, 'GET');
