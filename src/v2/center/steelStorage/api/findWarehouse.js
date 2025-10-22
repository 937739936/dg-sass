import ENV from '@/v2/config/env';
import request from '@/api/request';
// 获取查仓列表
export const getCheckWarehouseList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/check/page`, data, 'GET');
// 获取查仓详情
export const getCheckWarehouseDetail = data => request(`${ENV.BASE_GANG_API}/api/warehouse/check/${data.id}/detail`, data, 'GET');

// 查仓导出
export const exportCheckWarehouse = data => request(`${ENV.BASE_GANG_API}/api/warehouse/check/export`, data, 'GET', 1, 'blob');
// 一键下载照片
export const downloadAttach = data => request(`${ENV.BASE_GANG_API}/api/warehouse/check/downloadAttach`, data, 'GET', 1, 'blob');
