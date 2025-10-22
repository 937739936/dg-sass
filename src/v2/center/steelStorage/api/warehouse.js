import ENV from '@/v2/config/env';
import request from '@/api/request';
// 仓储租赁-列表查询
export const warehouseContractList = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getPageList`, data, 'GET');
// 仓储租赁 删除
export const warehouseContractDelete = data => request(`${ENV.BASE_GANG_API}/warehouseContract/delete`, data, 'DELETE');

// 仓储租赁-先保存再 开启
export const warehouseContractStart = data => request(`${ENV.BASE_GANG_API}/warehouseContract/start`, data, 'PUT');

// 仓储租赁-先保存再 停用
export const warehouseContractStop = data => request(`${ENV.BASE_GANG_API}/warehouseContract/stop`, data, 'PUT');

// 仓储租赁明细查询
export const warehouseContractDetails = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getDetail`, data, 'GET');
// 仓储合同列表导出
export const warehouseContractExport = data => request(`${ENV.BASE_GANG_API}/warehouseContract/export`, data, 'GET', 1, 'blob');
// 仓储租赁-保存、修改、直接提交
export const constractSaveOrSubmit = data => request(`${ENV.BASE_GANG_API}/warehouseContract/saveOrSubmit`, data, 'POST', 2);
