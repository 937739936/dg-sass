import ENV from '@/v2/config/env';
import request from '@/api/request';

//业务数据监控详情(核心企业、资方)--下游提交审核
export function API_DownstreamSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/seller/submitAudit`, data, 'GET');
}

//业务数据监控详情(核心企业、资方)--上游提交审核
export function API_UpstreamSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/buyer/submitAudit`, data, 'GET');
}

// 数据监控-业务动态监控核心企业详情
export function API_BusinessMonitoringCoreCompanyDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/detail`, data, 'GET');
}

// 上游切换获取详情
export function API_BusinessMonitoringUpstreamChangeContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/change/contract/detail`, data, 'GET');
}

// 数据监控-业务动态监控下游合同显示隐藏审批按钮/模块
export function API_BusinessMonitoringCanSellerSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/canSellerSubmitAudit`, data, 'GET');
}

// 数据监控-业务动态监控上游合同显示隐藏审批按钮/模块
export function API_BusinessMonitoringCanBuyerSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/canBuyerSubmitAudit`, data, 'GET');
}

// 数据监控-业务动态监控下游合同详情
export function API_BusinessMonitoringDownstreamContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/contract/detail`, data, 'GET');
}

export function API_BUSINESSMONITORINGDOWANATTACH(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/dowan/attach`, data, 'POST', 2, 'blob');
}

export function API_GetCCSDynamicMonitoringListCompany(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/link/core/company/list`, data, 'GET');
}

//业务动态监控列表（资方）-头部详情
export function API_GetCapitalDynamicMonitoringDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/detail/numCount`, data, 'GET');
}

// 数据监控-业务动态监控核心企业列表
export function API_BusinessMonitoringCoreCompanyList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/list`, data, 'GET');
}

// 数据监控-业务动态监控核心企业导出
export function API_BusinessMonitoringCoreCompanyExport(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/export`, data, 'GET', 2, 'blob');
}

// 数据监控-业务动态监控金融机构列表
export function API_BusinessMonitoringBankList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/list`, data, 'GET');
}

// 数据监控-业务动态监控金融机构导出
export function API_BusinessMonitoringBankExport(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/export`, data, 'GET', 2, 'blob');
}

// 数据监控-业务线查看列表
export function API_FullBusinessLineList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/page`, data, 'GET');
}
// 数据监控-业务线查看列表（钢材）
export function API_FullBusinessSteelLineList(data) {
	return request(`${ENV.BASE_GANG_API}/api/fullBusinessLine/page`, data, 'GET');
}

// 数据监控-全业务线关系图-资方分页
export function API_FullBusinessLineBankPage(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/bank/page`, data, 'GET');
}

// 数据监控-风控预警详情
export function API_riskAlertDetail(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/getDataDetail`, data, 'GET');
}

// 数据监控-预警申诉保存
export function API_saveComplainData(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/saveComplainData`, data, 'POST', 2);
}

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 数据监控-风控预警
export function API_riskAlertRecordList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/listByPage`, data, 'GET');
}

// 数据监控-风控预警导出
export function API_exportRiskAlertRecordList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/export`, data, 'GET', 2, 'blob');
}

// 数据监控-风控预警资金类型
export function API_selectAllPaymentTypeList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/selectAllPaymentType`, data, 'GET');
}

// 数据监控-业务动态监控上游资金流水统计接口
export function API_BusinessMonitoringUpstreamPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/statistics`, data, 'GET');
}

// 数据监控-业务动态监控上游资金流水列表接口
export function API_BusinessMonitoringUpstreamPaymentList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/list`, data, 'GET');
}

// 数据监控-业务动态监控下游资金流水统计接口
export function API_BusinessMonitoringDownstreamPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/statistics`, data, 'GET');
}

// 数据监控-业务动态监控下游资金流水列表接口
export function API_BusinessMonitoringDownstreamPaymentList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/list`, data, 'GET');
}

// 数据监控-全业务线查看资金流水统计
export function API_FullBusinessLineDetailPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/statistics`, data, 'GET');
}

// 数据监控-全业务线查看资金流水列表
export function API_FullBusinessLineDetailPaymentList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/list`, data, 'GET');
}

//业务监控--上游--货物结算列表--融资详情-融资信息
export function API_GetUpstreamFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/view/finance/detail`, data, 'GET');
}

// 完善合同--删除回款 TODO:废弃接口-回款闭管理修改-郭凯宣-2022/9/21
// export function API_DeleteContractCash(data) {
//   return request(`${ENV.BASE_API}/api/terminal/payment/delete`, data, "GET");
// }

// 查询认领数据是否可修改
export function checkBusinessLineEnd(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/checkBusinessLineEnd`, data, 'GET');
}

// 认领数据作废
export function invalidCollectionFlow(data) {
	return request(`${ENV.BASE_API}/api/collection/flow/invalidCollectionFlow`, data, 'GET');
}

// 完善合同-获取手动模式、SAP模式下线上业务回款认领数据
export function API_GetClaimRecordList(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/record/list`, data, 'GET');
}

// 完善合同--获取下游回款模式 TODO:废弃接口-回款闭管理修改-郭凯宣-2022/9/21
// export function API_GetTerminalModel(data) {
//   return request(`${ENV.BASE_API}/api/terminal/claim/get/terminal/model`, data, "GET");
// }

// 完善合同--手动录入模式、SAP模式时获取下游合同线上业务回款和非线上业务回款认领金额
export function API_GetClaimRecordCategory(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/record/category`, data, 'GET');
}

// 完善合同-银企直连模式--获取线上业务回款认领数据 TODO:废弃接口-回款闭管理修改-郭凯宣-2022/9/21
// export function API_GetOtherClaimRecordList(data) {
//   return request(`${ENV.BASE_API}/api/terminal/claim/list/bank/company/payment`, data, "GET");
// }

// 完善合同--银企直连模式--获取下游合同平台业务和非平台业务业务认领金额 TODO:废弃接口-回款闭管理修改-郭凯宣-2022/9/21
// export function API_GetOtherClaimRecordCategory(data) {
//   return request(`${ENV.BASE_API}/api/terminal/claim/record/bank/company/category`, data, "GET");
// }

// 数据监控-业务动态监控上游合同详情
export function API_BusinessMonitoringUpstreamContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/contract/detail`, data, 'GET');
}

// 数据监控-业务动态监控上游合同附件列表
export function API_BusinessMonitoringUpstreamAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/attach/list`, data, 'GET');
}

// 数据监控-业务动态监控下游合同附件列表
export function API_BusinessMonitoringDownstreamAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/attach/list`, data, 'GET');
}

// 数据监控-业务动态监控上游合同打包下载
export function API_BusinessMonitoringUpstreamAttachDownload(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/attach/download`, data, 'GET', 1, 'blob');
}

// 数据监控-业务动态监控下游合同打包下载
export function API_BusinessMonitoringDownstreamAttachDownload(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/attach/download`, data, 'GET', 1, 'blob');
}

// 数据监控-全业务线查看合同详情
export function API_FullBusinessLineDetailContractDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/contract/detail`, data, 'GET');
}

// 数据监控-全业务线查看合同附件列表
export function API_FullBusinessLineDetailAttachList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/attach/list`, data, 'GET');
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 数据监控-业务动态监控上游收发货列表统计接口
export function API_BusinessMonitoringUpstreamDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/deliverBatch/statistics`, data, 'GET');
}

// 数据监控-业务动态监控上游收发货信息列表
export function API_BusinessMonitoringUpstreamDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/deliverBatch/list`, data, 'GET');
}

// 数据监控-业务动态监控上游货转列表统计接口
export function API_BusinessMonitoringUpstreamGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/goodsTransfer/statistics`, data, 'GET');
}

// 数据监控-业务动态监控上游货转列表
export function API_BusinessMonitoringUpstreamGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/goodsTransfer/list`, data, 'GET');
}

// 数据监控-业务动态监控下游收发货列表统计接口
export function API_BusinessMonitoringDownstreamDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/statistics`, data, 'GET');
}

// 数据监控-业务动态监控下游收发货信息列表
export function API_BusinessMonitoringDownstreamDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/list`, data, 'GET');
}

// 数据监控-业务动态监控下游货转列表统计接口
export function API_BusinessMonitoringDownstreamGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/goodsTransfer/statistics`, data, 'GET');
}

// 数据监控-业务动态监控下游货转列表
export function API_BusinessMonitoringDownstreamGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/goodsTransfer/list`, data, 'GET');
}

// 数据监控-全业务线查看发货统计
export function API_FullBusinessLineDetailDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/deliverBatch/statistics`, data, 'GET');
}

// 数据监控-全业务线查看货转列表
export function API_FullBusinessLineDetailGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/goodsTransfer/list`, data, 'GET');
}
//货转-货转开具-货转下载
export function API_goodsTransferBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/batchDownload`, data, 'POST', 2, 'blob');
}
// 数据监控-全业务线查看货转统计
export function API_FullBusinessLineDetailGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/goodsTransfer/statistics`, data, 'GET');
}

// 数据监控-全业务线查看发货列表
export function API_FullBusinessLineDetailDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/deliverBatch/list`, data, 'GET');
}

// 联运管家火运-收发货获取轨迹详情
export function API_getRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/trajectory/detail`, data, 'GET');
}

// 铁路货运跟踪
export function API_GETTRAINRECORD(data) {
	return request(`${ENV.BASE_API}/api/deliver/trailRecordTrain`, data, 'GET');
}

// 完善合同--删除附件
export function API_DeleteContractFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/delete/attachment`, data, 'GET');
}

//  数据监控-业务动态监控上游其他附件
export function API_BusinessMonitoringUpstreamOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/other/attach/list`, data, 'GET');
}

//  数据监控-业务动态监控下游其他附件
export function API_BusinessMonitoringDownstreamOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/other/attach/list`, data, 'GET');
}

// 数据监控-全业务线查看其他附件
export function API_FullBusinessLineDetailOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/other/attach/list`, data, 'GET');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

// 完善合同附件上传
export const API_ContractAttachFilesUpload = `${ENV.BASE_API}/api/terminal/attachment/upload`;

// 完善合同-删除结算单附件
export function API_DeleteSettlementFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/delete/attachment`, data, 'GET');
}

//业务监控--下游--核心企业、资方-上传下游合同附件
export const API_DownstreamContractUpload = `${ENV.BASE_API}/api/terminal/attachment/upload/single`;

export function API_GetUpstreamFinanceDetailFK(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/view/financingLoanRepay/detail`, data, 'GET');
}

export function API_FinancingDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/downloadZip`, data, 'POST', 2, 'blob');
}

export function API_FinancingDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}

//  数据监控-业务动态监控上游融资详情
export function API_BusinessMonitoringUpstreamPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/finance/detail`, data, 'GET');
}

//  数据监控-业务动态监控下游融资详情
export function API_BusinessMonitoringDownstreamPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/finance/detail`, data, 'GET');
}

// 数据监控-全业务线查看融资详情
export function API_FullBusinessLineDetailPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/finance/detail`, data, 'GET');
}

// 数据监控-业务动态监控资金流水-列表
export function API_REFUNDLIST(data) {
	return request(`${ENV.BASE_API}/api/refund/list`, data, 'GET');
}

//  数据监控-业务动态监控资金流水-附件列表
export function API_REFUNDATTACHMENTLIST(data) {
	return request(`${ENV.BASE_API}/api/refundAttachment/list`, data, 'GET');
}

// 完善合同--保存发票
export function API_ContractINVOICESAVE(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/save`, data, 'POST', 2);
}

// 发票删除
export function API_InvoiceDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/delete`, data, 'POST');
}

// 数据监控-业务动态监控上游发票统计接口
export function API_BusinessMonitoringUpstreamInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/invoice/statistics`, data, 'GET');
}

// 数据监控-业务动态监控上游贸易发票列表
export function API_BusinessMonitoringUpstreamTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trade/invoice/list`, data, 'GET');
}

// 数据监控-业务动态监控上游运费发票列表
export function API_BusinessMonitoringUpstreamTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trans/invoice/list`, data, 'GET');
}

// 数据监控-业务动态监控下游发票统计接口
export function API_BusinessMonitoringDownstreamInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/invoice/statistics`, data, 'GET');
}

// 数据监控-业务动态监控下游贸易发票列表
export function API_BusinessMonitoringDownstreamTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trade/invoice/list`, data, 'GET');
}

// 数据监控-业务动态监控下游运费发票列表
export function API_BusinessMonitoringDownstreamTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trans/invoice/list`, data, 'GET');
}

// 数据监控-全业务线查看发票统计
export function API_FullBusinessLineDetailInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/invoice/statistics`, data, 'GET');
}

// 数据监控-全业务线查看运费发票列表
export function API_FullBusinessLineDetailTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/trans/invoice/list`, data, 'GET');
}

// 数据监控-全业务线查看贸易发票列表
export function API_FullBusinessLineDetailTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/trade/invoice/list`, data, 'GET');
}

// 云控使用的船舶信息 —— 船运历史轨迹判断
export function API_GetShipTrackFlag(data) {
	return request(`${ENV.BASE_API}/api/deliver/getShipTrackFlag`, data, 'GET');
}

export function API_GetShipDeliverInfoShips(deliverId, data) {
	return request(`${ENV.BASE_API}/api/ship/deliverInfoShips/${deliverId}`, data, 'GET');
}

// 完善合同--获取结算单列表
export function API_ContractSettlementList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/list`, data, 'GET');
}

// 数据监控-业务动态监控上游结算统计接口
export function API_BusinessMonitoringUpstreamStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/statement/statistics`, data, 'GET');
}

// 数据监控-业务动态监控上游结算列表接口
export function API_BusinessMonitoringUpstreamStatementList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/statement/list`, data, 'GET');
}

// 数据监控-业务动态监控下游结算统计接口
export function API_BusinessMonitoringDownstreamStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/statement/statistics`, data, 'GET');
}

// 数据监控-业务动态监控下游结算列表接口
export function API_BusinessMonitoringDownstreamStatementList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/statement/list`, data, 'GET');
}

// 数据监控-全业务线查看结算统计
export function API_FullBusinessLineDetailStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/statement/statistics`, data, 'GET');
}

// 数据监控-全业务线查看结算列表
export function API_FullBusinessLineDetailStatementList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/statement/list`, data, 'GET');
}

export function API_FullBusinessLineDetailV1(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/v1/detail/${data}`, data, 'GET');
}
export function API_FullBusinessLineSteelDetail(data) {
	return request(`${ENV.BASE_GANG_API}/api/fullBusinessLine/${data}/detail`, data, 'GET');
}
export function API_FullBusinessLineSteelBottomDetail(data) {
	return request(`${ENV.BASE_GANG_API}/api/fullBusinessLine/contract/detail/${data}`, data, 'GET');
}
// 数据监控-全业务线关系图-数据集合
export function API_FullBusinessLineGraphData(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/graph/${data}/data`, data, 'GET');
}

// 数据监控-全业务线关系图-数据关系
export function API_FullBusinessLineGraphDataRelation(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/graph/${data}/relation`, data, 'GET');
}

// 数据监控-业务动态监控下游新增或者修改
export function API_BusinessMonitoringDownstreamAddOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/addOrUpdate`, data, 'POST', 2);
}

// 数据监控-业务动态监控上游新增或者修改
export function API_BusinessMonitoringUpstreamAddOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/addOrUpdate`, data, 'POST', 2);
}

// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}

// 数据监控-业务动态监控下游合同打包下载
export function API_FullBusinessLineAttachDownload(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/attach/download`, data, 'GET', 1, 'blob');
}

// 数据监控 下游完善合同 采购订单详情
export function API_GetDetailByPaperContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/getDetailByPaperContractNo`, data, 'GET');
}

export function API_GetDetailRecordContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/audit/getAuditList`, data, 'GET');
}

export function API_GetDetailRecordDetailContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/audit/getAuditDetail`, data, 'GET');
}

// 监控-终端企业列表
export function API_GetDownstreamCompanyList(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/downstreamCompanyList`, data, 'GET');
}

// 获取订单详情始发站信息
export function API_STATION(data) {
	return request(`${ENV.BASE_API}/api/area/bizStationList`, data, 'GET');
}

//卓鼎修改回款账号同步SAP数据
export function API_SyncSAPContract(data) {
	return request(`${ENV.BASE_API}/api/sap/sync`, data, 'GET');
}

// 完善合同-获取结算单信息
export function API_GetSettlementInfo(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/detail`, data, 'GET');
}

// 完善合同-保存结算单信息
export function API_SaveSettlement(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/saveOrUpdate`, data, 'POST', 2);
}
