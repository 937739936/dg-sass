import ENV from "@/v2/config/env";
import request from "@/api/request";

// 获取站台 出入库统计数据

export const getInOutStatistics = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/weight/statistics`,data,'GET');
// 获取出入库详情
export const getInOutDetail = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/detail`,data,'GET');

// 获取出入库列表
export const getInOutList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page`,data,'GET');

// 删除出入库
export const delInOut = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/delete`,data,'DELETE');

// 导出出入库
export const exportInOutList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page/excel`,data,'GET', 2, 'blob');

// 获取当前企业 新增出入库 获取的合同列表
export const getRelOrderContractList = (data) => request(`${ENV.BASE_API}/api/storageRecord/pageRelOrderContractList`,data,'GET');
// 判断当前 新增出入库是否关联合同
export const existRelOrder = (data) => {
  data.querySource = data.querySource ||'IN_OUT_STORAGE'
  return request(`${ENV.BASE_API}/api/storageRecord/existRelOrder`,data,'GET')
};

/** 获取选择的合同详情 */
export const getContractInfo = (data) => request(`${ENV.BASE_API}/api/storageRecord/loadBasicContractInfo`,data,'GET');
// 坑、矿口 品名历史记录
export const getInOutHistoryList = (data) => request(`${ENV.BASE_STATION_API}/api/optional/type/list`,data,'POST', 2);

// 分页条件查询出入库管理信息记录对应的出入库明细
export const getInOutDetailList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page/record/detail`,data,'GET');
// 查询操作记录
export const getInOutLogList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/list/operation/log`,data,'GET');
// 新增出入库
export const addInOut = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/add`,data,'POST', 2);
// 导出出入库明细
// 导出出入库
export const exportInOutDetailList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page/record/detail/excel`,data,'GET', 2, 'blob');
// 出入库附件下载
export const downloadFile = (data) => request(`${ENV.BASE_STATION_API}/common/download`,data,'POST', 2, 'blob');
// 企查查 获取 企业列表

/**
 * 汽运-出入库记录编辑
 */
export const automobileRecordEdit = (data) => request(`${ENV.BASE_STATION_API}/api/storage/record/automobile/record/edit`,data,'POST',2);

// 榜单附件上传
export const receiveCommonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_API}/api/common/file/upload/batch?t=${t}`, data, 'POST', 2);
};
// 收货地址ocr
export const receiveOcr = data => {
	return request(`${ENV.BASE_STATION_API}/api/storage/manage/record/uploadAndOcrPoundBill`, data, 'POST', 2);
};

// 出入库记录修改
export const modifyInOutRecordPrice = (data) => request(`${ENV.BASE_STATION_API}/api/storage/manage/record/modify`,data,'POST', 2);




















