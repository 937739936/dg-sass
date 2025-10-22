/**
 * api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';
// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}
// OA流程选择
export function API_GETOAAUDITCODELIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOAAuditCodeList`, data, 'GET');
}
// 根据关键字查询OA用户信息
export function API_GETOAUSERBYKEYWORD(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOaUserByKeyword`, data, 'GET');
}
// 删除模板
export function API_DELETETEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/${data.id}/delete`, data, 'POST');
}
// 模板列表
export function API_TEXTTEMPLATELIST(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/list`, data, 'GET');
}
// 收藏模板
export function API_SAVETEXTTEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/save`, data, 'POST', 2);
}
// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}
//校验富文本的敏感词
export function API_SensitiveWordsCheck(data) {
	return request(`${ENV.BASE_API}/api/sensitiveWord/sensitiveWordsCheck`, data, 'POST', 2);
}
// 物泊-车辆附件信息导出
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/common/batchDownload`, data, 'GET', 1, 'blob');
}
// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}
// 合同核算办法明细
export function API_GetIndicatorTemplateAccountingDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/accounting/detail`, data, 'GET');
}
// 查看详情时-货值总金额明细
export function API_GetIndicatorTemplateViewDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/view/detail`, data, 'GET');
}
// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

export const API_SteelsUploadFileWaterMark = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`;
// 获取钢厂列表
export function getOriginPlace(data) {
	return request(`${ENV.BASE_GANG_API}/api/materialCategory/originPlaceRel/getOriginPlace`, data, 'GET');
}
// 获取品类级联
export const getMaterialCategory = data => request(`${ENV.BASE_GANG_API}/api/materialCategory/cascade`, data, 'GET');
// 获取钢材采购明细表的后台字典配置
export function API_GetSteelsCondition(data) {
	return request(`${ENV.BASE_API}/api/common/getDictItemsByCondition/${data.type}`, { condition: data.condition }, 'GET');
}
// 上传附件
export const importPurchase = `${ENV.BASE_GANG_API}/contractPurchase/importPurchase`;
export const importPurchase2 = `${ENV.BASE_GANG_API}/contractPurchase/importPurchase2`;
export const importReleasePurchase = `${ENV.BASE_GANG_API}/transferRelease/importRelease`;
// 完善合同-输入查询企业名称
export function API_GetCompanyName(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/list`, data, 'GET');
}
// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}
// 获取提单品类级联
export const getTakeBillMaterialCategory = (id, data) =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/materialCategory/${id}`, data, 'GET');
