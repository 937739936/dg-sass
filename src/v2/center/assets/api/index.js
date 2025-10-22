/**
 * 资产api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';

export function API_GetAssetsPledgeDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/detail`, data, 'GET');
}
export function API_GetAccountsPledgecheckContract(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/checkContract`, data, 'GET');
}
export function API_AssetsGoodsSave(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/modify`, data, 'POST', 2);
}
export function API_AssetsPledgeBankPro(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/getPledgeBankProduct`, data, 'GET');
}
export function API_AssetsWareList(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/storage/list`, data, 'GET');
}
/** 获取新增应收账款 结算单列表 */
export const getReceivableStatementList = data =>
	request(`${ENV.BASE_API}/api/asset/receivable/statement/list/by/contract`, data, 'GET');

// 导出发票exl
export const exportReceivableInvoice = data =>
	request(`${ENV.BASE_API}/api/asset/receivable/exportInvoice`, data, 'GET', 2, 'blob');

// 完善合同-输入查询企业名称
export function API_GetCompanyName(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/list`, data, 'GET');
}
export function API_GetPledgePayableList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/list/recv`, data, 'GET');
}
export function API_GetAccountsPayableZF(data) {
	// 应付账款作废
	return request(`${ENV.BASE_API}/api/asset/receivable/cancel`, data, 'POST', 2);
}
export function API_GetAdvancePayableList(data) {
	// 预付账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pre/pay`, data, 'GET');
}
export function API_SyncPayable(data) {
	// 应收账款同步状态
	return request(`${ENV.BASE_API}/api/asset/receivable/sync/pay`, data, 'POST', 2);
}
export function API_GetAccountsDetail(data) {
	//应收应付详情
	return request(`${ENV.BASE_API}/api/asset/receivable/detail`, data, 'GET');
}
export function API_EditAccountsPayable(data) {
	// 编辑应付账款
	return request(`${ENV.BASE_API}/api/asset/receivable/modify`, data, 'POST', 2);
}
// 根据资产查询发货批次
export function API_GetDeliveryBatchByAssetId(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/getDeliveryBatchByAssetId`, data, 'GET');
}
// 根据发货批次id查询收货批次和货转信息等运输信息
export function API_GetTransInfo(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/getTransInfo`, data, 'GET');
}
// 根据发货批次id查询其他材料是否有更新项
export function API_GetTrack(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/getTrack`, data, 'GET');
}
// 根据发货批次id判断是否有下游货转 获取其他附件
export function API_GetOtherAttach(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/getOtherAttach`, data, 'POST', 2);
}
// 根据资产id查询货转信息列表
export function API_GetGoodsTransByAssetId(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/getGoodsTransByAssetId`, data, 'GET');
}
// 资产发票列表
export function API_GetInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/invoice/list`, data, 'GET');
}
export function API_GetConfirmLetterUrl(data) {
	// 获取确认函url
	return request(`${ENV.BASE_API}/api/asset/confirm/getUrl`, data, 'GET');
}
export function API_GetConfirmLetterSellerUrl(data) {
	// 获取卖方确认函url
	return request(`${ENV.BASE_API}/api/asset/confirm/seller/getUrl`, data, 'GET');
}
export function API_GetSignList(data) {
	// 获取确权盖章的签名数据-ukey盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/getToSigList`, data, 'GET');
}
export function API_GetSignSellList(data) {
	// 获取卖方确权盖章的签名数据-ukey盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/seller/getToSigList`, data, 'GET');
}
export function API_SubmitSign(data) {
	// 提交确权盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/sign`, data, 'POST', 2);
}
export function API_SubmitSellSign(data) {
	// 提交确权盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/seller/sign`, data, 'POST', 2);
}
export function API_GetConfirmAutoSignature(data) {
	// 确权盖章-公司托管盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/autoSignature`, data, 'GET');
}
export function API_GetConfirmAutoSellSignature(data) {
	// 确权盖章-公司托管盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/seller/autoSignature`, data, 'GET');
}
// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}
export function API_GetConfirmAssetsList(data) {
	// 确权列表
	return request(`${ENV.BASE_API}/api/asset/confirm/list`, data, 'GET');
}
export function API_GetConfirmAssetsSellList(data) {
	// 确权列表
	return request(`${ENV.BASE_API}/api/asset/confirm/seller/list`, data, 'GET');
}
export function API_JudgeConfirm(data) {
	// 确权盖章判断 判断当前资产下所有发票的发票状态，是否含有红冲、作废的发票；若包含有红冲作废的发票，不允许确权；
	return request(`${ENV.BASE_API}/api/asset/confirm/checkInvoice`, data, 'GET');
}
export function API_GetAccountsReceivableListJR(data) {
	// 应收账款列表金融
	return request(`${ENV.BASE_API}/api/asset/receivable/list/bank`, data, 'GET');
}
export function API_GetAccountsDetailJR(data) {
	//应收应付详情金融
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/bank/detail`, data, 'GET');
}
export function API_AuditReceivableJRDownload(data) {
	//一键下载所有文档金融
	return request(`${ENV.BASE_API}/api/asset/receivable/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivableDownload(data) {
	//一键下载所有文档供应商
	return request(`${ENV.BASE_API}/api/asset/receivable/company/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivableSellerSignDownload(data) {
	//下载供应商盖章版材料
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/downloadSignAttachment`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivableJR(data) {
	//应收审核金融
	return request(`${ENV.BASE_API}/api/asset/receivable/bank/audit`, data, 'PUT', 2);
}
export function API_GetAccountsReceivableList(data) {
	// 应收账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/recv`, data, 'GET');
}
export function API_GetAccountsReceivableCountAssetTabState(data) {
	// 应付列表-tab数量
	return request(`${ENV.BASE_API}/api/asset/receivable/countAssetTabState`, data, 'GET');
}
export function API_GetAccountsReceivableCountManualAssetTabState(data) {
	// 应收列表-tab数量
	return request(`${ENV.BASE_API}/api/asset/receivable/countManualAssetTabState`, data, 'GET');
}
export function API_GetAccountsReceivableListStatistics(data) {
	// 预付收账款列表-tab数量
	return request(`${ENV.BASE_API}/api/asset/receivable/countPreAssetTabState`, data, 'GET');
}
export function API_AccountsReceivableAssetExportExcel(data) {
	// 应收资产管理-分页列表-导出
	return request(`${ENV.BASE_API}/api/asset/receivable/assetExportExcel`, data, 'GET', 1, 'blob');
}
export function API_AccountsReceivableListExportExcel(data) {
	// 预付收账款列表-列表导出
	return request(`${ENV.BASE_API}/api/asset/receivable/preAssetExportExcel`, data, 'GET', 1, 'blob');
}
export function API_ListAssetOperation(data) {
	// 资产-操作记录
	return request(`${ENV.BASE_API}/api/asset/receivable/listAssetOperation`, data, 'GET');
}

export function API_GetAccountsPoolReceivableList(data) {
	// 应收账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pool/pay`, data, 'GET');
}

export function API_SyncReceivable(data) {
	// 应收账款同步状态
	return request(`${ENV.BASE_API}/api/asset/receivable/sync/recv`, data, 'POST', 2);
}
export function API_GetAccountsPayableList(data) {
	// 应付账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pay`, data, 'GET');
}
export function API_GetAccountsManualDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/detail`, data, 'GET');
}
export function API_EditAccountsManualPayable(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/modify`, data, 'POST', 2);
}
export function API_asset_getManualBankProduct(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getManualBankProduct`, data, 'GET');
}
export function API_assetmanual_getManualBuyer(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getManualBuyer`, data, 'GET');
}
export function API_assetmanual_getEndDate(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getEndDate`, data, 'GET');
}
export function API_AuditReceivableManualDownload(data) {
	//一键下载所有文档手动
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivablePoolDownload(data) {
	//一键下载所有文档手动
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_GetAccountsPayableChangeBankList(data) {
	// 应付账款变更列表金融
	return request(`${ENV.BASE_API}/api/asset/receivable/list/bankModify`, data, 'GET');
}
export function API_GetAccountsPayableChangeList(data) {
	// 应付账款变更列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/payModify`, data, 'GET');
}
export function API_GetInvoiceResult(data) {
	// 发票查验结果
	return request(`${ENV.BASE_API}/api/asset/receivable/getInvoicePdfInfo`, data, 'GET');
}
export function API_ExportInvoice(data) {
	// 导出发票
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.receivableId}/invoice/export`, data, 'GET', 1, 'blob');
}
// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}
export function API_GetAccountsManualcheckContract(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/checkContract`, data, 'GET');
}
// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}
export const API_UploadSTEELAssetsFile = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`; //资产管理模块钢材  附件上传
export function API_GetReceivableInvoListLine(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/list/invoice`, data, 'GET');
}
export function API_AssetsGoodsModalFINList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/addgoods/inbound/list`, data, 'GET');
}
// 库点列表
export function API_STORAGEGOODSPOINTLIST(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/point/list`, data, 'GET');
}
export function API_AssetsGoodsModalList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/inbound/list`, data, 'GET');
}
export function API_FullBusinessLineDetailV1(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/v1/detail/${data}`, data, 'GET');
}
export function API_GetReceivablefullBusinessLine(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/fullBusinessLine/order/detail`, data, 'GET');
}
// 获取订单详情始发站信息
export function API_STATION(data) {
	return request(`${ENV.BASE_API}/api/area/bizStationList`, data, 'GET');
}
export function API_AssetsUpdateTrain(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genTrainTrack`, data, 'GET');
}
export function API_AssetsUpdateShip(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genShipTrack`, data, 'GET');
}
export function API_RECEIVERECORDINFO(data) {
	return request(`${ENV.BASE_API}/api/receive/${data.deliverId}/receiveRecordInfo`, data, 'GET');
}
export function API_getRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/trajectory/detail`, data, 'GET');
}
// 铁路货运跟踪
export function API_GETTRAINRECORD(data) {
	// return request(`${ENV.BASE_API}/api/deliver/${data.id}/trailRecordTrain`, data, 'GET')
	return request(`${ENV.BASE_API}/api/deliver/trailRecordTrain`, data, 'GET');
}
export function API_InvoiceDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/delete`, data, 'POST');
}
export function API_getDeliverGetRpcShip(data) {
	return request(`${ENV.BASE_API}/api/deliver/getRpcShip`, data, 'GET');
}
export function API_getDeliverInfoTrains(data) {
	return request(`${ENV.BASE_API}/api/waybill/fill/deliver/info`, data, 'POST', 2);
}
export function API_getApiTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/shipper/list`, data, 'GET');
}
export function API_saveTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/sync/shipper`, data, 'GET');
}
export function API_GetPoolOrderList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/contract/list`, data, 'GET');
}
export function API_GetOrderList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/contract/list`, data, 'GET');
}
export function API_GetPoolOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/contract/select`, data, 'GET');
}
export function API_GetManualOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/contract/select`, data, 'GET');
}

export function API_GETPOOLDeliverData(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/deliver/select`, data, 'POST', 2);
}
export function API_EditAccountsPoolAssets(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/modify`, data, 'POST', 2);
}
export function API_GetReceivableInvoListPool(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/invoice/list`, data, 'GET');
}
export function API_GetAccountsPoolDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/detail`, data, 'GET');
}
export function API_GetAssetsPoolZhangDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/credit/detail`, data, 'GET');
}

export function API_GetAssetsPoolZhangListDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/credit/receivable`, data, 'GET');
}
export function API_GetAssetsPoolZhangSync(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pool/credit/sync`, data, 'POST', 2);
}
export function API_GetAssetsStatusTip(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/getStatusTip`, data, 'GET');
}

// 根据资金类型判断是否需要平台风控审核
export function API_COMPANplatformRiskAudit(data) {
	return request(`${ENV.BASE_API}/api/common/platformRiskAudit`, data, 'GET');
}
