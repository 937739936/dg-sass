import ENV from '@/v2/config/env';
import request from '@/api/request';

// 电子、线下追保函列表查询
export function API_GetBondLetterPage(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/getBondLetterPage`, data, 'POST', 2);
}
// 电子、线下追保函列表查询
export function API_ExportExcel(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/exportExcel`, data, 'POST', 2, 'blob');
}
// 电子、线下追保函状态提示
export function API_GetStatusTip(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/getStatusTip`, data, 'GET');
}
// 选择销售合同
export function API_GetContractPage(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/getContractPage`, data, 'POST', 2);
}
// 各tab页数据统计
export function API_GetCountEachTabStateNum(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/countEachTabStateNum`, data, 'POST', 2);
}
// 新增、修改 追保函的合同和业务线详情信息
export function API_GetContractBusinessLineInfo(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/contractBusinessLineInfo`, data, 'GET');
}
// 提交或修改追保函
export function API_BondLetterSaveOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/saveOrUpdate`, data, 'POST', 2);
}
// 追保函预览
export function API_GetPreviewBondLetter(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/preview`, data, 'POST', 2);
}
export function API_GetPreviewBondLetterLoad(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/preview`, data, 'POST', 2, 'blob');
}
// 作废
export function API_BondLetterCancel(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/cancel`, data, 'POST', 2);
}
// 接收方确认
export function API_BondLetterConfirm(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/confirm`, data, 'GET');
}
//UKey盖章时获取待签名数据
export function API_GetBondLetterPdfHashList(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/seal/getBondLetterPdfHashList`, data, 'POST', 2);
}
//盖章之后状态变更(发起方、接收方盖章)
export function API_BondLetterSealToConfirm(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/afterSign`, data, 'GET');
}
//托管盖章之后状态变更(发起方、接收方盖章)
export function API_BondLetterAfterAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/bondLetterAutoSignature`, data, 'GET');
}
//接收方确认时 -驳回
export function API_BondLetterReject(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/reject`, data, 'POST', 2);
}
// 下载文件
export function API_DownLoadFile(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/downLoadFile`, data, 'GET', 1, 'blob');
}
// 追保函详情
export function API_GetBondLetterDetail(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/details`, data, 'GET');
}
// 追保函操作记录
export function API_GetOperationLogRecords(data) {
	return request(`${ENV.BASE_API}/api/bondLetter/operationLogRecords`, data, 'GET');
}
