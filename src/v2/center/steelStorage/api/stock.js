import ENV from '@/v2/config/env';
import request from '@/api/request';
// 明细库存查询
export const getDetailPageList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/detailPage`, data, 'GET');
// 明细库存查询 导出
export const detailExport = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/detailExport`, data, 'GET', 1, 'blob');
// 汇总库存查询
export const getSummaryPageList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/summaryPage`, data, 'GET');
// 汇总库存查询 导出
export const summaryExport = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/summaryExport`, data, 'GET', 1, 'blob');
