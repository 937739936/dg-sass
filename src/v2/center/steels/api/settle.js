import ENV from '@/v2/config/env';
import request from '@/api/request';
export const settleImportGoodsInfo = `${ENV.BASE_GANG_API}/statement/importGoodsInfo`;
// 结算单检验是否有在途的提单
export function getTakeDeliverIng(contractId) {
	return request(`${ENV.BASE_GANG_API}/statement/takeDeliverIng/${contractId}`, '', 'GET');
}
//  结算单保存/修改
export function API_SteelsStatementSave(data) {
	return request(`${ENV.BASE_GANG_API}/statement/save`, data, 'POST', 2);
}
// 结算单新创建提交
export function API_SteelsStatementSubmit1(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit1`, data, 'PUT', 2);
}
// 结算单提交预览
export function previewStatement(data) {
	return request(`${ENV.BASE_GANG_API}/statement/previewStatement`, data, 'POST', 2);
}
//  创建结算单根据合同获取信息
export function API_SteelsStatementNextStep(data) {
	return request(`${ENV.BASE_GANG_API}/statement/nextStep/${data.id}`, data, 'GET');
}
// 结算单下载模板
export const exportSettleTpl = data => {
	return request(`${ENV.BASE_GANG_API}/statement/downloadGoodsInfo/${data.contractId}`, data, 'GET', 1, 'blob');
};
// 结算单申请盖章
export function API_GETSETTLESUBMITCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/statementApply/submitConfirm`, data, 'POST', 2);
}

// 结算单货转勾选后 代出下边结算单列表
export function API_SteelsStatementDetailParticular(data) {
	return request(`${ENV.BASE_GANG_API}/statement/detailParticular`, data, 'PUT', 2);
}
// 结算单详情
export function API_SteelsStatementDetail(data) {
	return request(`${ENV.BASE_GANG_API}/statement/detail/${data.id}`, '', 'GET');
}

// 结算单修改页提交
export function API_SteelsStatementSubmit3(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit3`, data, 'PUT', 2);
}
//  创建结算单根据补录合同获取信息
export function getSupplStatementNextStep(data) {
	return request(`${ENV.BASE_GANG_API}/statement/suppl/nextStep/${data.id}`, data, 'GET');
}
/** 保存补录结算单 */
export const saveSupplStatement = data => request(`${ENV.BASE_GANG_API}/statement/suppl/save`, data, 'POST', 2);
/** 提交补录结算单 */
export const submitSupplStatement = data => request(`${ENV.BASE_GANG_API}/statement/suppl/submit`, data, 'POST', 2);
/** 详情提交补录结算单 */
export const submitSupplStatement2 = data => request(`${ENV.BASE_GANG_API}/statement/suppl/submit2`, data, 'POST', 2);
//提交结算单作废确认
export function API_SubmitSettlementCancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/save`, data, 'POST', 2);
}
// 我的结算单
export function API_SteelsStatementMyStatementList(data) {
	return request(`${ENV.BASE_GANG_API}/statement/myStatementList`, data, 'GET');
}
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}
// 结算单删除
export function API_SteelsStatementDelete(data) {
	return request(`${ENV.BASE_GANG_API}/statement/delete/${data.id}`, data, 'PUT', 2);
}
// 结算单作废
export function API_SteelsStatementStatementCancel(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancel/${data.id}`, data, 'PUT', 2);
}
// 结算单取消
export function API_SteelsStatementStatementQuit(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementQuit/${data}`, '', 'PUT');
}
// 结算单详情盖章
export function API_GETSETTLESUBMITCONFIRMDETAIL(data) {
	return request(`${ENV.BASE_API}/api/statement/submitConfirm`, data, 'POST');
}
export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSteel`, data, 'POST');
}
// 结算单新创建提交
export function API_SteelsStatementSubmit2(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit2`, data, 'PUT', 2);
}
// 结算单合同列表
export function API_SteelsStatementContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/statementContractPage`, data, 'GET');
}
export function getPaymentSellContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/paymentSellContractPage`, data, 'GET');
}
// 结算单销售合同列表
export function getStatementSellContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/statementSellContractPage`, data, 'GET');
}
// 结算单作废驳回
export function API_SteelsstatementCancelCanccl(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancelCancel/${data.id}`, data, 'PUT');
}
// 结算单作废签章auto
export function API_SteelsStatementCancelSealAuto(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/seal/auto`, data, 'POST', 2);
}
// 结算单作废签章
export function API_SteelsStatementCancelSealUkey(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/seal/ukey`, data, 'POST', 2);
}
// 结算单作废完成
export function API_SteelsStatementCancelSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/${data}/signAfterConfirm`, '', 'PUT');
}
// 结算单作废取消
export function API_SteelsStatementStatementCancelOff(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancelOff/${data.id}`, data, 'PUT', 2);
}
// 结算单待确认驳回
export function API_SteelsStatementStatementOff(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementOff/${data.id}`, data, 'PUT');
}
// 结算单auto签章
export function API_SteelsStatementSealAuto(data) {
	return request(`${ENV.BASE_GANG_API}/statement/seal/auto`, data, 'POST', 2);
}
// 结算单Ukey签章
export function API_SteelsStatementSealUkey(data) {
	return request(`${ENV.BASE_GANG_API}/statement/seal/ukey`, data, 'POST', 2);
}
// 结算单Ukey推送盖章成功结果
export function API_SteelsStatementSignAfterConfirm(id) {
	return request(`${ENV.BASE_GANG_API}/statement/${id}/signAfterConfirm`, '', 'PUT');
}
// 结算单作废/确认
export function API_SteelsStatementConfirmStatementList(data) {
	return request(`${ENV.BASE_GANG_API}/statement/confirmStatementList`, data, 'GET');
}
