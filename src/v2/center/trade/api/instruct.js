import ENV from '@/v2/config/env';
import request from '@/api/request';
// 放货指令列表查询
export const API_getReleaseInstructList = data => request(`${ENV.BASE_API}/api/releaseInstruct/listByPage`, data, 'POST', 2);
// 出入库记录列表
export const API_getStorageRecordOutList = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/manage/record/storageRecordOutPage`, data, 'POST', 2);
// 仓库名称搜索
export const API_getStationList = data => request(`${ENV.BASE_STATION_API}/api/station/list`, data, 'GET', 1);
// 放货指令列表-作废
export const API_invalidLading = data => request(`${ENV.BASE_API}/api/releaseInstruct/cancel`, data, 'GET', 1);
// 放货指令列表-完结
export const API_completeLading = data => request(`${ENV.BASE_API}/api/releaseInstruct/completed`, data, 'GET', 1);
// 详情
export const API_getLadingDetailById = data => request(`${ENV.BASE_API}/api/releaseInstruct/detail`, data, 'GET', 1);
// 详情 - 出库记录列表
export const API_getLadingOutBoundById = data => request(`${ENV.BASE_API}/api/releaseInstruct/outBound/page`, data, 'GET', 1);
// 下载指定类型文件
export const API_downloadLadingFile = data => request(`${ENV.BASE_API}/api/releaseInstruct/download`, data, 'GET', 1, 'blob');
// 合同列表
export const API_getLadingBillContractList = data =>
	request(`${ENV.BASE_API}/api/releaseInstruct/listContractByPage`, data, 'POST', 2);

// 查看状态预警气泡信息提醒
export const API_GetStatusTipById = data => request(`${ENV.BASE_API}/api/releaseInstruct/getStatusTip`, data, 'GET');

// 获取合同信息
export const API_getContractInfo = data => request(`${ENV.BASE_API}/api/lading/getContractInfo`, data, 'GET', 1);
// 编辑&新增
export const API_getLadingBillSave = data => request(`${ENV.BASE_API}/api/releaseInstruct/saveOrUpdate`, data, 'POST', 2);
// 根据(订单id或补录合同id)和合同类型 查询绑定的站台信息
export const API_getRelStationData = data => request(`${ENV.BASE_API}/api/lading/getRelStationData`, data, 'GET', 1);
