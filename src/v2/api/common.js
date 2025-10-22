import ENV from '@/v2/config/env';
import request from '@/api/request';

// 模板列表
export function API_TEXTTEMPLATELIST(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/list`, data, 'GET');
}

// 收藏模板
export function API_SAVETEXTTEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/save`, data, 'POST', 2);
}

// 删除模板
export function API_DELETETEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/${data.id}/delete`, data, 'POST');
}

export function API_EXPORT_INVOICE(type = 2, DATA) {
	/**
	 *    @type 1 下载发票附件  2导出发票四要素
	 */
	let path = '';
	if (type === 1) {
		path = `/api/invoice/common/batchDownloadFileByIds`;
	} else {
		path = `/api/invoice/common/exportXlsByIds`;
	}
	return request(ENV.BASE_API + path, DATA, 'GET', 2, 'blob');
}

// 发票详情
export function API_InvoiceDetailNew(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/detail`, data, 'GET');
}

// 保存发票
export function API_INVOICESAVE(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/save`, data, 'POST', 2);
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

//获取订单是否有付款
export function API_ORDER_HAS_PAYMENT(data) {
	/**
	 * data.orderSerialNo 订单id
	 * data.code         发票代码
	 * data.no           发票号码
	 * */
	return request(`${ENV.BASE_API}/api/invoiceDO/hasPayment`, data, 'GET');
}
//获取关联订单列表
export function API_GET_LINKORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/order/list`, data, 'GET');
}

//发票列表 发票关联订单
export function API_INVOICES_LINK_ORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/batch/invoiceOrderRel/save`, data, 'POST', 2);
}

// 新单个文件上传（善美保理新增）
export const API_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/upload`;

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 发货申请 删除附件
export function API_DeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/delete/attach`, data, 'GET');
}

//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

// 附件下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}

// 根据企业uscc获取企业信息
export function API_GET_COMPANYINFO_BY_USCC(data) {
	return request(`${ENV.BASE_USER_API}/api/company/getCompanyByUscc`, data, 'GET');
}

// 获取企业签章员和管理员
export function API_GET_COMPANY_ROLE_LIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/getCompanyUserDataVO`, data, 'GET');
}

// 根据id获取业务人真实手机号
export function API_GET_USER_MOBILE_BY_ID(data) {
	return request(`${ENV.BASE_API}/api/businessOwnershipConfig/getById`, data, 'GET');
}
/** 获取地图key */
export function getMapKey(data) {
	return request(`${ENV.BASE_API}/api/common/map/getKey`, data, 'GET');
}
// 接口调用次数记录
export function sendMapCount(data) {
	return request(`${ENV.BASE_API}/api/common/map/api/count`, data, 'GET');
}
// 关键字搜索 地图
export function mapSearch(data) {
	return request(`${ENV.BASE_API}/api/common/map/place/search`, data, 'GET');
}
// 逆地理解析
export function geocodeInverse(data) {
	return request(`${ENV.BASE_API}/api/common/map/geocode/inverse`, data, 'GET');
}
