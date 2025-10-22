import ENV from "@/v2/config/env";
import request from "@/api/request";

/**
 * 站台租赁合同分页查询
 * @param {
 *  pageNo:1,
 *  pageSize:10,
 * } data 
 * @returns 
 */
export const getContractPage = (data) => {

  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/page`,data,'GET');
}

/**
 * 查询仓储方和承租方
 * @returns {
 *   "warehouseOwnerCompanyName": "", //仓储方名称
 *   "warehouseTenantCompanyName": "" //承租方名称
 * }
 */
export const getContractBoth = () => request(`${ENV.BASE_STATION_API}/api/station/lease/contract/add/info/init`,{},'GET');

/**
 * 站台租赁合同编辑或新增
 * @param {*} data 
 * @returns 
 */
export const editOfflineContract = (data) => {

  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/add`,data,'POST' ,2);
}
/**
 * 下载合同
 * @param {*} id 
 * @returns 
 */
export const downloadAttachmentById = (id) => {
  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/downloadAttachmentById`,{id},'GET',1,"blob");
}

/**
 * 根据租赁合同id查询操作记录
 * @param {*} id 
 * @returns 
 */
export const getOperationLogById = (id) => {
  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/getStationLeaseContractOperationLogById`,{id},'GET');
}

/**
 * 作废合同
 */
export const cancellation = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/cancellation`,data,'POST' ,2); 
}

/**
 * 查看附件
 */
export const getAttachmentById = (id) => {
  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/getAttachmentById`,{id},'GET' ); 
}

/**
 * 查看合同详情
 */
export const getDetail = (id) => {
  return request(`${ENV.BASE_STATION_API}/api/station/lease/contract/detail`,{id},'GET' ); 
}
/**
 * 精确匹配企查查
 */
export const searchCompany = (data) => {
  return request(`${ENV.BASE_API}/api/terminal/contract/search/company/not/like`, data, 'GET')
}