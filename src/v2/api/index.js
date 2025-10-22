import ENV from '@/v2/config/env';
import request from '@/api/request';
// 校验验证码
export function API_GetCheckSealMobileVerifyCode(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/checkSealMobileVerifyCode`, data, 'GET');
}
// 获取验证码
export function API_GetSealMobileVerifyCode(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/getSealMobileVerifyCode/v2`, data, 'GET');
}
// 获取单个摄像头监控地址
export function API_GrainGrainCameraPreviewURLs(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/previewURLs`, data, 'GET');
}
export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}
// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}
// 发货申请 删除附件
export function API_DeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/delete/attach`, data, 'GET');
}
// 物泊-车辆附件信息导出
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/common/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST');
}
// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}
//校验富文本的敏感词
export function API_SensitiveWordsCheck(data) {
	return request(`${ENV.BASE_API}/api/sensitiveWord/sensitiveWordsCheck`, data, 'POST', 2);
}
export function API_FinancingsellerList(data) {
	return request(
		`${ENV.BASE_USER_API}/api/company/findAllByTypeAndNameLike`,
		{ ...data, companyTypes: ['CORE_COMPANY'] },
		'POST',
		2
	);
}
// //获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}
// 新单个文件上传（善美保理新增）
export const API_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/upload`;
// 国内业务省
export function API_BIZPROVINCELIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizProvinceList`, data, 'GET');
}
// 国内业务市
export function API_BIZCITYLIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizCityList`, data, 'GET');
}

// 国内业务区县
export function API_BIZAREALIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizAreaList`, data, 'GET');
}

// 国内业务站点
export function API_BIZSITELIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizSiteList`, data, 'GET');
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;
//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;
// 站台上传通用
export const API_UPLOAD_STATION = `${ENV.BASE_STATION_API}/common/upload`;

export const commonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_STATION_API}/common/upload?t=${t}`, data, 'POST', 2);
};

// 合同核算办法明细
export function API_GetIndicatorTemplateAccountingDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/accounting/detail`, data, 'GET');
}
// 查看详情时-货值总金额明细
export function API_GetIndicatorTemplateViewDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/view/detail`, data, 'GET');
}
export function API_PaymentGoodsOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsValueByOrderId`, data, 'GET');
}
export function API_exportGoodsValueByOrderId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/exportGoodsValueByOrderId`, data, 'GET', 1, 'blob');
}
export function API_exportGoodsValueByPaymentId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/exportGoodsValueByPaymentId`, data, 'GET', 1, 'blob');
}
export function API_selectGoodsValueByPaymentId(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsValueByPaymentId`, data, 'GET');
}
// 测算付款金额
export function API_paymentApplyCalMaxPayAmount(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/calMaxPayAmount`, data, 'GET');
}
// 清除图片缓存
export function API_InvoiceDelImgScanCache() {
	return request(`${ENV.BASE_API}/api/invoice/common/delImgScanCache`, {}, 'POST');
}
