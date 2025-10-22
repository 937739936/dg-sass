import ENV from '@/v2/config/env';
import request from '@/api/request';

// 销售补录合同的买方列表
export function API_GetOfflineSellerBuyerList(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/buyerList`, data, 'GET');
}

// 线下补协合同列表
export function API_OfflineSupplementalAgreementContractPage(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/getOfflineContract`, data, 'GET');
}

// 正在进行中的补协
export function API_SupplementalAgreementLatest(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/getLatest`, data, 'GET');
}

// 补充协议 保存草稿
export function API_SupplementalAgreementSaveDraft(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/saveDraft`, data, 'POST', 2);
}

// 补协状态提示
export function supplementalAgreement(data) {
	return request(`${ENV.BASE_NET}api/supplementalAgreement/getStatusTip`, data, 'GET');
}

// 采销关联合同列表
export function API_RELATIONCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/businessLine/contractRelPage`, data, 'GET');
}

// 解除关联合同关系(判断采销两个合同的货转数据是否有复用开具的货转)
export function API_RELIEVERELATIONVERIFY(data) {
	return request(`${ENV.BASE_API}/api/businessLine/verifyContractRel/remove/goodsTransfer`, data, 'GET');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

// 采购补录查询卖方列表
export function API_GETOFFLINESELLERLIST(data) {
	return request(`${ENV.BASE_API}/api/offline/buyer/order/sellerList`, data, 'GET');
}
// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}

// 判断补录合同号是否重复
export function API_OFFLINESELLERORDEREXIST(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/exist`, data, 'POST', 2);
}

// 合同附件详情
export function API_CONTRACTFILEDETAIL(data) {
	return request(`${ENV.BASE_API}/api/contract/attachments`, data, 'GET');
}

// 销售补录合同删除
export function API_OFFLINESELLERORDERDELETE(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/delete`, data, 'GET');
}

/** 合同下一步 判断 是否 法定代表人变更 */

export function checkCompanyChange(data) {
	return request(`${ENV.BASE_USER_API}/api/company/contract/companyChange/valid`, data, 'GET');
}

// 订单合同重构
// 电子合同列表
export function API_pageOrderContractList(data) {
	return request(`${ENV.BASE_API}/api/order/common/pageOrderContractList`, data, 'GET');
}
// 电子合同详情
export function API_getOrderContractDetailById(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderContractDetailById`, data, 'GET');
}
// 电子合同详情--付款记录
export function API_getOrderPaymentResp(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderPaymentResp`, data, 'GET');
}
// 电子合同详情--结算单记录
export function API_getOrderStatementResp(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderStatementResp`, data, 'GET');
}
// 电子合同详情--发票信息
export function API_getOrderInvoiceInfoResp(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderInvoiceInfoResp`, data, 'GET');
}
// 电子合同详情--合同操作记录
export function API_listOrderOperation(data) {
	return request(`${ENV.BASE_API}/api/order/common/listOrderOperation`, data, 'GET');
}
// 电子合同详情--合同终止
export function API_listOrderTerminateLog(data) {
	return request(`${ENV.BASE_API}/api/order/common/listOrderTerminateLog`, data, 'GET');
}
// 电子合同复制列表
export function API_pageCopyList(data) {
	return request(`${ENV.BASE_API}/api/order/common/pageCopyList`, data, 'GET');
}
// 电子合同修改
export function API_getModifyInfo(data) {
	return request(`${ENV.BASE_API}/api/order/common/getModifyInfo`, data, 'GET');
}
// 电子合同-合同预览(返回PDF文档地址)
export function API_getPreviewContract(data) {
	return request(`${ENV.BASE_API}/api/order/common/getPreviewContract`, data, 'POST', 2);
}
// 电子合同-作废订单
export function API_orderCancel(data) {
	return request(`${ENV.BASE_API}/api/order/common/cancel`, data, 'POST', 2);
}
// 电子合同-获取上下游负责人信息
export function API_listTerminalDirector(data) {
	return request(`${ENV.BASE_API}/api/businessOwnershipConfig/option`, data, 'GET');
}
// 电子合同-修改上下游负责人
export function API_updateTerminalDirector(data) {
	return request(`${ENV.BASE_API}/api/order/businessOwnership/updateDirector`, data, 'POST', 2);
}
// 获取用户下的业务负责人
export function API_getDirectorOptionByCompany(data) {
	return request(`${ENV.BASE_API}/api/order/businessOwnership/getDirectorOptionByCompany`, data, 'get');
}
// 获取用户下的当前设置的业务负责人
export function API_getCurrentDirectorByUser(data) {
	return request(`${ENV.BASE_API}/api/order/businessOwnership/getCurrentDirectorByUser`, data, 'get');
}
// 设置当前用户的业务负责人
export function API_setCurrentDirector(data) {
	return request(`${ENV.BASE_API}/api/order/businessOwnership/setUserCurrentDirector`, data, 'POST', 2);
}
// 电子合同-业务转移-获取企业的业务账号列表
export function API_listBusinessUserAccept(data) {
	return request(`${ENV.BASE_API}/api/order/common/listBusinessUserAccept`, data, 'GET');
}
// 电子合同-业务转移-回显
export function API_getBusinessUserAcceptInfo(data) {
	return request(`${ENV.BASE_API}/api/order/common/getBusinessUserAcceptInfo`, data, 'GET');
}
// 电子合同-业务转移-提交
export function API_updateBusinessAcceptUser(data) {
	return request(`${ENV.BASE_API}/api/order/common/updateBusinessAcceptUser`, data, 'POST', 2);
}
// 电子合同-盖章并提交确认订单
export function API_sealToConfirm(data) {
	return request(`${ENV.BASE_API}/api/order/common/toReceiveConfirmSeal`, data, 'POST', 2);
}
// 电子合同-确认并盖章
export function API_confirmAndSealToConfirm(data) {
	return request(`${ENV.BASE_API}/api/order/common/toReceiveConfirmAndSealToConfirm`, data, 'POST', 2);
}
// 电子合同-终止合同-预览
export function API_getPreviewTerminalContract(data) {
	return request(`${ENV.BASE_API}/api/order/common/getPreviewTerminalContract`, data, 'POST', 2);
}
// 电子合同-终止合同-保存
export function API_saveTerminalContract(data) {
	return request(`${ENV.BASE_API}/api/order/common/saveTerminalContract`, data, 'POST', 2);
}
// 电子合同-确认页面订单驳回
export function API_orderConfirmReject(data) {
	return request(`${ENV.BASE_API}/api/order/common/reject`, data, 'POST', 2);
}
// 电子合同-返回所有的电厂名单-暂时用不到
export function API_listTerminalPower(data) {
	return request(`${ENV.BASE_API}/api/order/common/listTerminalPower`, data, 'POST', 2);
}
// 电子合同-销售订单盖章时判断是否已经盖章
export function API_hasSeal(data) {
	return request(`${ENV.BASE_API}/api/order/common/hasSeal`, data, 'GET');
}
// 电子合同-提交盖章详情
export function API_getConfirmInfo(data) {
	return request(`${ENV.BASE_API}/api/order/common/getConfirmInfo`, data, 'GET');
}
// 电子合同-采购进入订单提交盖章详情前先判断订单是否已盖章
export function API_hasSubmitSeal(data) {
	return request(`${ENV.BASE_API}/api/order/common/hasSubmitSeal`, data, 'GET');
}
// 电子合同-合同相关附件一键下载
export function API_downloadAllContractAttachment(data) {
	return request(`${ENV.BASE_API}/api/order/common/downloadAllContractAttachment`, data, 'GET', 1, 'blob');
}
// 电子合同-判断当前订单已有实际的收发货
export function API_hasValidDeliverBatch(data) {
	return request(`${ENV.BASE_API}/api/order/common/hasValidDeliverBatch`, data, 'GET');
}
// 电子合同-ccs根据用户名和手机号精确查询用户信息
export function API_getOaUser(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOaUser`, data, 'GET');
}
//新增接口
// 电子合同-详情-发运信息
export function API_getOrderDispatchAndGoodsTransferResp(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderDispatchAndGoodsTransferResp`, data, 'GET');
}
// 电子合同-分页列表-各tab页数据统计
export function API_countEachTabStateNum(data) {
	return request(`${ENV.BASE_API}/api/order/common/countEachTabStateNum`, data, 'GET');
}
// 电子合同-导出
export function API_contractExportExcel(data) {
	return request(`${ENV.BASE_API}/api/order/common/contractExportExcel`, data, 'GET', 1, 'blob');
}
// 线下合同-导出
export function API_offlineContractExportExcel(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/offlineContractExportExcel`, data, 'GET', 1, 'blob');
}
// 电子合同-修改审批流
export function API_updateOrderAuditChainRel(data) {
	return request(`${ENV.BASE_API}/api/order/common/updateOrderAuditChainRel`, data, 'POST', 2);
}
// 电子合同-详情-预警信息
export function API_ccountOrderContractRiskAlertById(data) {
	return request(`${ENV.BASE_API}/api/order/common/countOrderContractRiskAlertById`, data, 'GET');
}
// 电子合同完结
export function API_fnBusinessContractFinish(data) {
	return request(`${ENV.BASE_API}/api/order/common/fnBusinessContractFinish`, data, 'POST', 2);
}
// v2合同创建第二步pdf下载
export function API_contractFileDownload(data) {
	return request(`${ENV.BASE_API}/api/order/common/downloadPreviewContract`, data, 'POST', 2, 'blob');
}

export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST');
}

// 电子合同详情--发票信息--导出所有的发票附件
export function API_DownloadFiles(data) {
	return request(`${ENV.BASE_API}/api/order/common/batchDownloadInvoiceFileByOrderId`, data, 'GET', 1, 'blob');
}
// 电子合同详情--发票信息--导出所有的发票excel
export function API_DownloadExcel(data) {
	return request(`${ENV.BASE_API}/api/order/common/exportExcelContractInvoice`, data, 'GET', 1, 'blob');
}

// 接收方配置OA审批流
export function API_receiveOrderAuditChainRel(data) {
	return request(`${ENV.BASE_API}/api/order/common/receiveOAAudit`, data, 'POST', 2);
}

// 电子合同接收方盖章
export function API_SUBMIT_RECEIVE_SEAL(data) {
	return request(`${ENV.BASE_API}/api/order/common/toReceiveConfirmSeal`, data, 'POST', 2);
}

// 电子合同发起方盖章
export function API_SUBMITT_SEND_SEAL(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/toInitiatorConfirmSeal`, data, 'POST', 2);
}

// 合同终止信息列表
export function API_CONTRACT_TERMINATE_LIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/listTerminateOperation`, '', 'GET');
}

// 合同终止作废
export function API_CONTRACT_TERMINATE_CANCEL(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/terminate/cancellation`, data, 'GET');
}

// 电子合同-合同终止-接受方确认
export function API_CONTRACT_TERMINATE_CONFIRM(data) {
	return request(`${ENV.BASE_API}/api/order/common/terminate/toReceiveConfirm`, data, 'POST', 2);
}

//上下煤计划查询归属电子合同列表
export function API_stationOnlineContractList(data) {
	return request(`${ENV.BASE_API}/api/order/common/station/onlineOrderList`, data, 'POST', 2);
}
//上下煤计划修改归属合同,合同关联多个上煤计划
export function API_updateContract(data) {
	return request(`${ENV.BASE_API}/api/station/deliver/addCoalPlanContactRel`, data, 'POST', 2);
}
//根据上下煤计划查询非作废的发货批次
export function API_getBatchByCoalPlanNo(data) {
	return request(`${ENV.BASE_API}/api/station/deliver/getBatchByCoalPlanNo`, data, 'GET');
}
//根据上下煤计划修改归属合同校验
export function API_checkContract(data) {
	return request(`${ENV.BASE_API}/api/station/deliver/checkContract`, data, 'GET');
}
//上下煤计划查询归属补录合同列表
export function API_stationOfflineContractList(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/station/offlineContractList`, data, 'POST', 2);
}

// 合同终止确认，接收方确认时 OA信息提醒
export function API_checkContractStopConfirmOA(data) {
	return request(`${ENV.BASE_API}/api/order/common/order/receiveConfirm/oaRepeatCheck`, data, 'POST', 2);
}

// 电子合同 发起方/接收方签章时作废合同
export function API_contract_cancel(data) {
	return request(`${ENV.BASE_API}/api/order/common/seal/cancel`, data, 'POST', 2);
}

// 电子合同-接收方确认时 OA信息提醒
export function API_contract_receive_repeat_oa(data) {
	return request(`${ENV.BASE_API}/api/order/common/order/receiveConfirm/oaRepeatCheck`, data, 'POST', 2);
}

// 我的合同列表选择合同后校验是否可开结算单
export function API_GETSETTLEAPPLYCHECK(data) {
	return request(`${ENV.BASE_API}/api/statement/beforeApplyCheck`, data, 'GET');
}

// 合同附件一下健下载
export function downloadContractRelatedAllAttachment(data) {
	return request(`${ENV.BASE_API}/api/order/common/downloadContractRelatedAllAttachment`, data, 'POST', 1, 'blob');
}

export function API_loginByCompanyUserIdForAsset(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForAsset`, data, 'POST');
}

// 校验企业是否处于假国企/黑名单内
export function API_validCompanyIsInRiskBlack(data) {
	return request(`${ENV.BASE_API}/api/risk/validCompanyIsInRiskBlack`, data, 'GET');
}
// 盯市指标-下拉选择信息
export function API_GetMarketIndicatorSelectVo(data) {
	return request(`${ENV.BASE_API}/api/risk/queryMarketIndicatorSelectVo`, data, 'POST', 2);
}

//从order.js合并过来的接口
// 业务国家
export function API_BIZCOUNTRYLIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizCountryList`, data, 'GET');
}

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

// 获取买方列表
export function API_GETBUYERLIST(data) {
	return request(`${ENV.BASE_API}/api/order/sell/buyerList`, data, 'GET');
}

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// oa订单修改详情
export function API_GETOADETAIL(data) {
	return request(`${ENV.BASE_API}/api/order/oa/audit/modifyInfo/${data.orderId}?type=${data?.type || ''}`, '', 'GET');
}

// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}

// 获取卖方列表
export function API_GETSELLERLIST(data) {
	return request(`${ENV.BASE_API}/api/order/buy/sellerList`, data, 'GET');
}
// 获取资产trader
export const getTraderList = data => request(`${ENV.BASE_API}/api/order/common/getAssetsTrader`, data, 'GET');
// 创建采购订单下一步合同校验
export const checkOrderInfo = data => request(`${ENV.BASE_API}/api/order/common/getCurrentMonthOrderList`, data, 'GET');

// 暂存采购订单（新增）
export function API_SAVEBUYORDER(data) {
	return request(`${ENV.BASE_API}/api/order/buy/save`, data, 'POST', 2);
}

// oa合同保存
export function API_GETOASUBMITCONTRACT(data) {
	return request(`${ENV.BASE_API}/api/order/oa/audit/save/${data.orderId}`, data, 'POST', 2);
}

//校验富文本的敏感词
export function API_SensitiveWordsCheck(data) {
	return request(`${ENV.BASE_API}/api/sensitiveWord/sensitiveWordsCheck`, data, 'POST', 2);
}

// 暂存销售订单（新增）
export function API_SAVESELLORDER(data) {
	return request(`${ENV.BASE_API}/api/order/sell/save`, data, 'POST', 2);
}

// 获取订单详情始发站信息
export function API_STATION(data) {
	return request(`${ENV.BASE_API}/api/area/bizStationList`, data, 'GET');
}

// 线下合同模板收货人要从下拉列表查询
export function API_getReceiverList(searchKeys) {
	let _searchKeys = encodeURIComponent(searchKeys || '');
	return request(`${ENV.BASE_API}/api/company/power/list?searchKeys=${_searchKeys}`, '', 'GET', 2);
}

// 订单获取服务费资金来源
export function API_GETBANKPRODUCTITEM(data) {
	return request(`${ENV.BASE_API}/api/order/buy/getBankProductItem`, data, 'GET');
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 批量下载合同、承诺函
export function API_DOWNLPREVIEWTEBatchDownLoad(data) {
	return request(`${ENV.BASE_API}/api/order/common/previewContract/batchDownLoad`, data, 'GET', 2, 'blob');
}

// 采购合同列表
export function API_BUYCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/buy/page`, data, 'GET');
}

// 销售合同列表
export function API_SELLCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/sell/page`, data, 'GET');
}

// 采购补录合同关联销售列表
export function API_OFFLINEBUYERORDERLINKLIST(data) {
	return request(`${ENV.BASE_API}/api/offline/buyer/order/link/seller/list`, data, 'GET');
}

// 销售补录合同关联采购列表
export function API_OFFLINESELLERORDERLINKLIST(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/link/buyer/list`, data, 'GET');
}

// OA流程选择
export function API_GETOAAUDITCODELIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOAAuditCodeList`, data, 'GET');
}

// 根据关键字查询OA用户信息
export function API_GETOAUSERBYKEYWORD(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOaUserByKeyword`, data, 'GET');
}

// 订单确认
export const orderConfirmToSeal = id => request(`${ENV.BASE_API}/api/order/buy/${id}/confirmToSeal`, {}, 'GET');

// 获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

// 修改订单流程回显
export function API_GETORDERAUDITCHAINANDOPERATOR(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderAuditChainAndOperator`, data, 'GET');
}

// 订单状态提示
export function getOrderStatus(data) {
	return request(`${ENV.BASE_NET}api/order/common/getStatusTip`, data, 'GET');
}

// 销售订单  获取待签名数据
export function API_SELLORDERGETTOSIGLIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/seal/getReceivePdfHashList`, data, 'POST', 2);
}

// 采购订单  确认订单获取待签名数据
export function API_BUYORDERGETTOCONFIRMSIGLIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/seal/getReceivePdfHashList`, data, 'POST', 2);
}

// 销售订单确认
export function API_CfcaOrderConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/orderConfirmAutoSignature`, data, 'POST', 2);
}

//订单终止--一般贸易商确认 获取待签名数据
export function API_STOPSELLORDERGETTOSUBMITSIGLIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/seal/getTerminatePdfHashList`, data, 'POST', 2);
}

// 订单终止--一般贸易商提交确认
export function API_SUBMITTOCONFIRMSTOPSELLORDER(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/terminateSealToConfirm`, data, 'POST');
}

// 订单终止--一般贸易商驳回终止
export function API_STOPSELLORDERREJECT(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/terminateContractReject`, data, 'GET');
}

// 订单终止-托管盖章--核心企业盖章，一般贸易商确认
export function API_CfcaStopOrderAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/terminateContractAutoSignature`, data, 'POST', 2);
}
// 采购订单  获取待签名数据
export function API_BUYORDERGETTOSIGLIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/seal/getInitiatorPdfHashList`, data, 'POST', 2);
}

// 采购订单盖章
export function API_CfcaOrderAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/orderAutoSignature`, data, 'POST', 2);
}

//订单终止--核心企业盖章 获取待签名数据
export function API_STOPBUYORDERGETTOSIGLIST(data) {
	return request(`${ENV.BASE_API}api/order/common/seal/getTerminatePdfHashList`, data, 'POST', 2);
}

// 订单终止--核心企业盖章提交盖章成功并提交对方确认
export function API_SUBMITTOCONFIRMSTOPBUYORDER(data) {
	return request(`${ENV.BASE_API}/api/order/common/${data.orderId}/terminateSealToConfirm`, data, 'GET');
}
//根据订单编号查询订单发运计划
export function dispatchByOrderSerialNo(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/detail/by/orderSerialNo`, data, 'GET');
}
//订单生成发运计划
export function dispatchSaveOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/saveOrUpdate`, data, 'POST', 2);
}
//订单发运计划分享
export function dispatchShare(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/share`, data, 'GET');
}
//根据地址关键字 返回地址详情 （经纬度）
export function getAddressDetail(data) {
	return request(`${ENV.BASE_API}/api/order/dispatch/plan/getPlaceByAddress`, data, 'GET');
}

// 出入库分页查询
export function getInOutDetailList(data) {
	return request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page/by/contract/no`, data, 'GET');
}
// 出入库信息导出
export function exportInOutDetailList(data) {
	return request(`${ENV.BASE_STATION_API}/api/storage/manage/record/page/by/contract/no/excel`, data, 'GET', 2, 'blob');
}
// 线下合同状态提示
export function offlineContractStatusTip(data) {
	return request(`${ENV.BASE_API}/api/offlineContract/getStatusTip`, data, 'GET');
}
// 判断日期是否是工作日
export function checkDateIsWorkDay(data) {
	return request(`${ENV.BASE_API}/api/order/common/ifWorkDay`, data, 'GET');
}
export function otherBusinessTypeContractFinish(data) {
	return request(`${ENV.BASE_API}/api/order/common/otherBusinessTypeContractFinish`, data, 'GET');
}
