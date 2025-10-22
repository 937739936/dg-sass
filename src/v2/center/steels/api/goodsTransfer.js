import ENV from '@/v2/config/env';
import request from '@/api/request';
export const goodsTransferImportPurchase = `${ENV.BASE_GANG_API}/supplementGoodsTransfer/importPurchase`;
// 货转-导出待开具货转清单
export function exportContractPurchase(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/exportContractPurchase`, data, 'GET', 2, 'blob');
}

// 放货通知单合同或物明细导出
export function API_exportContractPurchase(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/exportContractPurchase`, data, 'GET', 1, 'blob');
}
// 获取品名
export const getMaterialNameBySteelType = data =>
	request(`${ENV.BASE_GANG_API}/api/materialCategory/getMaterialNameBySteelType`, data, 'GET');
/** 货转获取入库记录 */
export const getPageByGoodsTransfer = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inout/pageByGoodsTransfer`, data, 'POST', 2);
// 补录货转-获取合同详情
export function getSupplementContractInfo(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/getContractInfo`, data, 'GET');
}
// 放货通知-选择仓库方
export function API_SteelswarehouseContractRelease(data) {
	return request(`${ENV.BASE_GANG_API}/warehouseContract/getListByCompanyName`, data, 'GET');
}
// 放货通知-预览
export function API_SteelsGoodstransferReleasePrevDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/preview`, data, 'POST', 2);
}
// 放货通知-保存
export function API_SteelsGoodstransferReleaseSaveDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/save`, data, 'POST', 2);
}
// 放货通知-详情
export function API_SteelsGoodstransferReleaseDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/${data.id}/detail`, data, 'GET');
}
// 放货通知-提交
export function API_SteelsGoodstransferReleaseSubmitDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/submit`, data, 'POST', 2);
}
export function API_SteelsGoodstransferReleaseSubmitCheckDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/check`, data, 'GET');
}
// 放货通知-选择合同
export function getSupplementGoodsTransferRelease(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/contractPage`, data, 'GET');
}
// 校验合同数量是否可以开具货转 校验
export function checkContractQuantity(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/checkContractQuantity`, data, 'GET');
}
// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}
// 放货通知-导出
export function API_SteelsReleaseExportDownload(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/export`, '', 'GET', 1, 'blob');
}
// 放货通知-取消/作废
export function API_SteelsGoodstransferReleaseQuit(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/cancel`, data, 'POST', 2);
}
// 放货通知-列表
export function API_SteelsGoodstransferPageRelease(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/page`, data, 'GET');
}
// 放货通知-Ukey签章
export function API_SteelsSealReleaseUkey(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/seal/getPdfHashList`, data, 'POST', 2);
}
// 放货通知-托管签章
export function API_SteelsSealReleaseAuto(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/signature/auto`, data, 'POST', 2);
}
// 放货通知-确认签章
export function API_SteelsSignReleaseAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/${data.id}/signConfirm`, '', 'GET');
}

// 货转开具——获取单个详情
export function API_SteelsGoodstransferDetail(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}`, data, 'GET');
}
// 补录货转-保存货转
export function saveSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/save`, data, 'POST', 2);
}
// 补录货转-修改保存货转
export function updateSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/update`, data, 'PUT', 2);
}

// 补录货转-提交货转
export function submitSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/submit`, data, 'POST', 2);
}
// 补录货转 校验
export function checkSupplementGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/check`, data, 'POST', 2);
}
// 获取仓库列表
export const getStorageList = data => request(`${ENV.BASE_GANG_API}/api/storageMonitoring/getAllStorage`, data, 'GET');
// 补录货转选择合同
export function getSupplementGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/contractPage`, data, 'GET');
}
// 校验合同数量是否可以开具货转 校验
// 货转开具——保存
export function API_SteelsGoodstransferSave(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/save`, data, 'POST', 2);
}
// 货转开具——提交
export function API_SteelsGoodstransferSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/submit`, data, 'PUT', 2);
}
// 货转开具——确认 和 驳回
export function API_SteelsGoodstransferConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/confirm`, data, 'POST', 2);
}
// 货转开具——根据所选合同获取详情（基础信息、收发货列表信息）
export function API_SteelsGetReceiveListInfo(contractNo) {
	return request(`${ENV.BASE_GANG_API}/receive/getReceiveListInfo/${contractNo}`, {}, 'GET');
}
// 货转开具——获取仓押业务的货转标的
export function API_SteelsGoodsTransferPurchase(data) {
	return request(`${ENV.BASE_GANG_API}/contrac/${data}/detail`, '', 'GET');
}
// 货转开具——待开具货转的合同列表
export function API_SteelsGoodsTransferContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/goodsTransferContractPage`, data, 'GET');
}

// 货转证明——获取盖章带签名列表
export function API_getApiGoodsTransferDOApplyGetToSignList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/apply/getToSigList`, data, 'POST', 2);
}
// 货转证明盖章
export function API_postApiGoodsTransferDOToConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${goodsTransferNo}/toConfirm`, {}, 'POST');
}
// 开具货转证明盖章
export function API_CfcaGoodsTransferAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferAutoSignature`, data, 'POST', 2);
}
//货转-待确认状态下-点击确认-驳回货转
export function API_GoodsTransferRejectConfirm(data, no) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/${no}/sealToReject`, data, 'POST');
}
//货转-待确认状态下-盖章获取
export function API_GoodsTransferConfirmGetToSigList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/confirm/getToSigList`, data, 'POST', 2);
}
//货转-待确认状态下-确认盖章
export function API_postApiGoodsTransferConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/${goodsTransferNo}/sealToConfirm`, 'POST');
}
//货转-待确认状态下-盖章获取signure
export function API_GoodsTransferConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferConfirmAutoSignature`, data, 'POST', 2);
}
// 货转证明批量下载
export function API_SteelsGoodstransferBatchDownload(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/batchDownload`, data, 'GET', 1, 'blob');
}
// 货转管理列表
// 我开具的
export function API_SteelsGoodstransferPageGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/pageGoodsTransfer`, data, 'GET');
}
// 货转-作废
export function API_SteelsGoodstransferCancel(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/cancel `, data, 'PUT');
}
// 货转-取消
export function API_SteelsGoodstransferQuit(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/quit`, data, 'PUT');
}
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}
// 开具给我的
export function API_SteelsGoodstransferPageRecevieGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/pageRecevieGoodsTransfer`, data, 'GET');
}
// 货转-签章手机验证码
export function API_SteelsGoodstransferSignAuto(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/seal/auto`, data, 'POST', 2);
}
// 货转-签章后推送结果
export function API_SteelsGoodstransferSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}/signAfterConfirm`, data, 'PUT');
}
// 货转-签章Ukey
export function API_SteelsGoodstransferSignUkey(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/seal/ukey`, data, 'POST', 2);
}
