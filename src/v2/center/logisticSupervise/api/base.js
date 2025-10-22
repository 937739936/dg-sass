import ENV from '@/v2/config/env';
import request from '@/api/request';

//查询核心企业关联运输中转站台下煤种信息
export const getCoalTypeList = data => request(`${ENV.BASE_STATION_API}/api/coal/type/transfer/CoalTypeList`, data, 'GET');
//新增运输中转站台下煤种信息
export const postAddCoalType = data => request(`${ENV.BASE_STATION_API}/api/coal/type/transfer/addCoalType`, data, 'POST', 2);

//查询物流运输管理仓房管理
export const getTransferPage = data => request(`${ENV.BASE_STATION_API}/api/station/house/transfer/page`, data, 'POST', 2);

//添加物流运输管理仓房
export const postTransferAdd = data => request(`${ENV.BASE_STATION_API}/api/station/house/transfer/add`, data, 'POST', 2);
