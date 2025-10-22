import ENV from '@/v2/config/env';
import request from '@/api/request';
// 获取仓库列表
export const getStorageList = data => request(`${ENV.BASE_GANG_API}/api/storageMonitoring/getStorage`, data, 'GET');
/** 获取仓库监控 仓库查询列表 */
export const getWarehouseList = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getWarehouse`, data, 'GET');
// 获取仓库列表简称
export const getStorageAbbreviationList = data =>
	request(`${ENV.BASE_GANG_API}/warehouseContract/getValidWarehouse`, data, 'GET');
// 获取仓库列表简称 列表查询
export const getAllWarehouseList = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getAllWarehouse`, data, 'GET');
// 获取仓库详情
export const getStorageDetail = data => request(`${ENV.BASE_GANG_API}/warehouseContract/detailByAbbr`, data, 'GET');
// 库存查看统计
export const getInventoryAnalysis = data => request(`${ENV.BASE_GANG_API}/api/warehouse/store/analysis`, data, 'GET');
// 库存查看列表
export const getInventoryList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/store/page`, data, 'GET');
// 导出库存查看
export const exportInventory = data => request(`${ENV.BASE_GANG_API}/api/warehouse/store/export`, data, 'GET', 1, 'blob');
// 入库记录
export const getInStorageList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/page/IN`, data, 'GET');
// 出入库记录详情
export const getOutInStorageDetail = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/${data.id}`, data, 'GET');
// 出入库记录详情 实时
export const getOutInModifyDetailDetail = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inout/${data.id}/modifyDetail`, data, 'GET');

// 出库记录
export const getOutStorageList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/page/OUT`, data, 'GET');
// 获取品名
export const getMaterialNameBySteelType = data =>
	request(`${ENV.BASE_GANG_API}/api/materialCategory/getMaterialNameBySteelType`, data, 'GET');
// 出入库统计查看报表导出
export const exportOutAndIn = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/inoutAnalysis/export`, data, 'GET', 1, 'blob');
// 出入库统计查看报表
export const getOutAndIn = data => request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/inoutAnalysis`, data, 'GET');
// 仓库库存库位查看报表导出
export const exportLocation = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/storelist/export`, data, 'GET', 1, 'blob');
// 仓库库存库位查看报表
export const getLocation = data => request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/storelist`, data, 'GET');
// 账龄报表报表
export const getStoreDuration = data => request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/storeDuration`, data, 'GET');

export const exportStoreDuration = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/reportForm/storeDuration/export`, data, 'GET', 1, 'blob');
// 上传 通用 出入库
export const commonUpload = data => request(`${ENV.BASE_GANG_API}/common/upload`, data, 'POST', 2);
/** 作废出入库 */
export const invalidWarehouse = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/${data.id}/invalid`, data, 'GET');
// 取消出入库
export const deleteWarehouse = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/${data.id}/delete`, data, 'GET');
// 图片ocr识别
export const ocrScan = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/detail/identifyImg`, data, 'GET');
// 图片选区识别
export const getIdentifyImgSingleRow = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inout/detail/identifyImgSingleRow`, data, 'POST', 2);
/** 获取出入库导入明细 */
export const identifyExcel = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/detail/identifyExcel`, data, 'GET');
// 导出出入库明细
export const exportExcel = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/detail/export`, data, 'POST', 2, 'blob');
// 导出scr识别的数据
export const exportImgIdentify = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inout/detail/exportImgIdentify`, data, 'GET', 1, 'blob');
/** 新增出入库 */
export const addInout = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/save`, data, 'POST', 2);
/** 修改出入库 */
export const editInout = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/update`, data, 'POST', 2);
/** 校验出库 */

export const checkInout = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/check`, data, 'POST', 2);
// 提交出入库
export const submitInout = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/submit`, data, 'POST', 2);

// 获取入库记录详情
export const getInoutDetail = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inout/${data.id}`, data, 'GET');
// 出库品类级联
export const getOutCascade = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/cascade`, data, 'GET');
/** 获取理论重量和数量 */
export const getOutTheoryData = data => request(`${ENV.BASE_GANG_API}/api/warehouse/inventory/theoryData`, data, 'GET');
/** 获取实提记录查询 */
export const getActualExtractList = data => request(`${ENV.BASE_GANG_API}/api/warehouse/actualExtract/page`, data, 'GET');
// 根据出库id集合获取实际库存和出库明细
export const getOutboundInventory = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/actualExtract/getOutboundInventory`, data, 'GET');
// 提交实提
export const submitActualExtract = data => request(`${ENV.BASE_GANG_API}/api/warehouse/actualExtract/submit`, data, 'POST', 2);
// 获取实提详情
export const getActualExtractDetail = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/actualExtract/${data.id}/detail`, data, 'GET');

/** 作废实提 */
export const invalidActualExtract = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/actualExtract/${data.id}/invalid`, data, 'GET');
