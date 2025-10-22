import ENV from '@/v2/config/env';
import request from '@/api/request';

export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSteel`, data, 'POST');
}
export function getOAAuditCode(data) {
	return request(`${ENV.BASE_GANG_API}/api/oa/getOAAuditCode`, '', 'GET');
}

// 因钢材需求新增的交易接口

// 获取钢材卖方列表
export function API_GetSteelsSellerList(data) {
	return request(`${ENV.BASE_API}/api/company/companyListByServiceType`, data, 'GET');
}
// 获取钢材采购明细表的后台字典配置
export function API_GetSteelsCondition(data) {
	return request(`${ENV.BASE_API}/api/common/getDictItemsByCondition/${data.type}`, { condition: data.condition }, 'GET');
}
//获取资金类型
export function API_GetSteelBankProductItem(data) {
	return request(`${ENV.BASE_API}/api/order/buy/getSteelBankProductItem`, data, 'GET');
}

// 钢材项目接口
// 获取配置的交提货方式
export const getPickGoodsTypeList = data => request(`${ENV.BASE_API}/api/common/category/loadTreeRoot`, data, 'GET');
// 获取钢材的全局字段

export function API_SteelsAllCode(data) {
	return request(`${ENV.BASE_GANG_API}/common/dict/allDict`, data, 'GET');
}
// 结算单合同列表
export function API_SteelsStatementContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/statementContractPage`, data, 'GET');
}
// 采购合同列表
export function API_SteelsBuyContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/buyContractPage`, data, 'GET');
}
// 保存采购合同
export function API_SteelsBuyContractSave(data) {
	return request(`${ENV.BASE_GANG_API}/contract`, data, 'POST', 2);
}
// 修改采购合同
export function API_SteelsBuyContractUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/contract`, data, 'PUT', 2);
}
// 修改oa流程联系人
export function editModifyProcessInitiator(data) {
	return request(`${ENV.BASE_GANG_API}/contract/modifyProcessInitiator`, data, 'POST', 2);
}
// 提交采购合同
export function API_SteelsBuyContractSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/contract/submit`, data, 'POST', 2);
}
// 预览采购合同
export function API_SteelsBuyContractPreview(data) {
	return request(`${ENV.BASE_GANG_API}/contract/preview`, data, 'POST', 2);
}
// 获取钢材合同 钢材种类
export function getSteelTypeCascade(data) {
	return request(`${ENV.BASE_GANG_API}/contract/steelTypeCascade`, data, 'GET');
}
// 取消合同获取合同详情
export function API_SteelsContractDelete(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}`, '', 'DELETE');
}
// 修改合同获取合同详情
export function API_SteelsContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}`, '', 'GET');
}
// 获取合同详情-发货申请定制
export function API_SteelsDeliverContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}/getContractInfo`, '', 'GET');
}
// 查看合同详情
export function API_SteelsContractViewDetail(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}/detail`, '', 'GET');
}

// 结算单提交预览
export function previewStatement(data) {
	return request(`${ENV.BASE_GANG_API}/statement/previewStatement`, data, 'POST', 2);
}
// 合同批量下载
export function API_SteelsContractDownAll(data) {
	return request(`${ENV.BASE_GANG_API}/contract/batchDownload`, data, 'GET', 1, 'blob');
}
// 合同冻结和启用
export const freezeContract = data => request(`${ENV.BASE_GANG_API}/contract/${data.contractId}/freeze`, data, 'GET');
// 合同完结
export const completedContract = data => request(`${ENV.BASE_GANG_API}/contract/${data.contractId}/completed`, data, 'GET');

/**  获取关联的采购和合同列表*/
export function getAssociatedContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/associatedContractPage`, data, 'GET');
}

// 一般贸易商  销售合同列表
export function API_SteelsSellContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/sell/page`, data, 'GET');
}

// 核心企业  销售合同列表
export function API_SteelsAdditionalContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/sell/page`, data, 'GET');
}

// 保存补录合同
export function API_SteelsAdditionalContractSave(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract`, data, 'POST', 2);
}

// 补录合同详情
export function API_SteelsAdditionalContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data.id}`, '', 'GET');
}
// 修改后保存补录合同
// export function API_SteelsAdditionalContractUpdateToSave(data) {
//   return request(`${ENV.BASE_GANG_API}/additionalContract`, data, 'PUT', 2)
// }

// Ukey签章
export function API_SteelsSealUkey(data) {
	return request(`${ENV.BASE_GANG_API}/contract/seal/ukey`, data, 'POST', 2);
}
// 托管签章
export function API_SteelsSealAuto(data) {
	return request(`${ENV.BASE_GANG_API}/contract/seal/auto`, data, 'POST', 2);
}
// 确认签章
export function API_SteelsSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.id}/signAfterConfirm`, '', 'GET');
}
// 盖章驳回
export function API_SteelsReject(data) {
	return request(`${ENV.BASE_GANG_API}/contract/reject/${data.id}`, data, 'GET');
}
// 上传附件
// export const API_SteelsUploadFile = `${ENV.BASE_GANG_API}/common/upload`
export const API_SteelsUploadFileWaterMark = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`;
export const importPurchase = `${ENV.BASE_GANG_API}/contractPurchase/importPurchase`;
export const importReleasePurchase = `${ENV.BASE_GANG_API}/transferRelease/importRelease`;
export const settleImportGoodsInfo = `${ENV.BASE_GANG_API}/statement/importGoodsInfo`;
export const goodsTransferImportPurchase = `${ENV.BASE_GANG_API}/supplementGoodsTransfer/importPurchase`;

// 核心企业盖章前校验
export function API_SteelsCheckDownstreamContract(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}/checkDownstreamContract`, '', 'GET');
}

// 合同详情附件单一文件下载---购销合同
export function API_SteelsDownloadContract(data) {
	return request(`${ENV.BASE_GANG_API}/contract/download`, data, 'GET', 1, 'blob');
}
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}

// 收发货管理
// 发货列表
export function API_SteelsDeliverList(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/page`, data, 'GET');
}
// 发货申请销售合同列表
export function API_SteelsDeliverContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/shipmentContractPage`, data, 'GET');
}

// 保存发货申请
export function API_SteelsDeliverSave(data) {
	return request(`${ENV.BASE_GANG_API}/shipment`, data, 'POST', 2);
}
// 修改发货申请
export function API_SteelsDeliverUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/shipment`, data, 'PUT', 2);
}
// 提交发货申请
export function API_SteelsDeliverSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/submit`, data, 'POST', 2);
}
// 发货详情
export function API_SteelsDeliverDetail(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}`, '', 'GET');
}
// 取消发货申请
export function API_SteelsDeliverDelete(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/${data}`, '', 'DELETE');
}
// 作废发货申请
export function API_SteelsDeliverVoid(data) {
	return request(`${ENV.BASE_GANG_API}/shipment/invalid/${data.deliverId}`, data, 'GET');
}

// 收货列表
export function API_SteelsReceiveList(data) {
	return request(`${ENV.BASE_GANG_API}/receive/page?`, data, 'GET');
}
// 收货确认可选数据列表
export function API_SteelsReceiveContractList(data) {
	return request(`${ENV.BASE_GANG_API}/receive/getReceivingPage`, data, 'GET');
}
// 收货确认提交
export function API_SteelsReceiveSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/receive`, data, 'POST', 2);
}
// 收货详情
export function API_SteelsReceiveDetail(data) {
	return request(`${ENV.BASE_GANG_API}/receive/${data}`, '', 'GET');
}

// // 买方Ukey签章
// export function API_SteelsBuySealUkey(data){
//     return request(`${ENV.BASE_GANG_API}/contract/${data.id}/seal/ukey`, data, 'GET')
// }
// // 买方托管签章
// export function API_SteelsBuySealAuto(data){
//     return request(`${ENV.BASE_GANG_API}}/contract/${data.id}/seal/auto`, '', 'GET')
// }
// // 买方确认签章
// export function API_SteelsBuySignAfterConfirm(data){
//     return request(`${ENV.BASE_GANG_API}/contract/${data.id}/signAfterConfirm`, '', 'GET')
// }
export const paymentPage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/getPaymentPage`, data, 'GET');
};
export const receiptPage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/getReceiptPage`, data, 'GET');
};
export const savePayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment`, data, 'POST', 2);
};
export const editPayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment`, data, 'PUT', 2);
};
export const paymentContractPage = data => {
	return request(`${ENV.BASE_GANG_API}/contract/paymentContractPage`, data, 'GET');
};
/**
 * 校验是否有业务线
 * @param {*} data
 * @returns
 */
export const checkBusinessLine = data => {
	return request(`${ENV.BASE_GANG_API}/statement/businessLine/${data.contractNo}`, data, 'GET');
};
export const receiveAccountByCompanyId = data => {
	return request(`${ENV.BASE_API}/api/paymentApply/receiveAccountByCompanyId`, data, 'GET');
};
export const getGoodsDataInfoByContractNo = data => {
	return request(`${ENV.BASE_GANG_API}/shipment/getByContractNo/${data}`, data, 'GET');
};
export const submitPayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment/submit`, data, 'POST', 2);
};
export const paymentDetail = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data}/detail`, data, 'GET');
};
export const deletePayment = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data}`, data, 'DELETE');
};
export const collectionPage = data => {
	return request(`${ENV.BASE_GANG_API}/collection/page`, data, 'GET');
};
export const addCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection`, data, 'POST', 2);
};
export const collectionContractPage = data => {
	return request(`${ENV.BASE_GANG_API}/additionalContract/collectionContractPage`, data, 'GET');
};
export const findByDownstreamContractNo = data => {
	return request(`${ENV.BASE_GANG_API}/contract/findByDownstreamContractId/${data}`, data, 'GET');
};
export const checkShipmentIsBeyond = data => {
	return request(`${ENV.BASE_GANG_API}/collection/checkShipmentIsBeyond`, data, 'GET');
};
export const delCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection/${data}`, data, 'DELETE');
};
export const collectionDetail = data => {
	return request(`${ENV.BASE_GANG_API}/collection/${data}`, data, 'GET');
};
export const collectionClaim = data => {
	return request(`${ENV.BASE_GANG_API}/collection/claim`, data, 'POST', 2);
};

//根据合同id获取已转让金额
export const API_GetAssetSum = data => {
	return request(`${ENV.BASE_GANG_API}/payment/${data.id}/getAssetSum`, data, 'GET');
};
//付款时，获取资金类型
export function API_GetSteelBankProductItemTwo(data) {
	return request(`${ENV.BASE_GANG_API}/payment/getFundingSources`, data, 'GET');
}

// 发票管理开始
export const scanImgInvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/scanInvoice`, data, 'POST');
};
export const scanExcelInvoiceUrl = `${ENV.BASE_GANG_API}/invoice/excelScan`;
export const getImgScanSuccessList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/imgScanSuccessList`, data, 'GET');
};
export const batchDownInvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/batchDownloadFileByUrls`, data, 'POST', 2, 'blob');
};
export const getBuyContractList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/buyContractList`, data, 'GET');
};
export const getSellContractList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/sellContractList`, data, 'GET');
};
export const getAllContractList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/allContractList`, data, 'GET');
};
export const batchSaveInvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/batchSave`, data, 'POST', 2);
};
export const getExcelScanSuccessList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/excelScanSuccessList`, data, 'GET');
};
export const getExcelScanAllList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/excelScanAllList`, data, 'GET');
};
export const getInvoiceDetail = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/${data}`, data, 'GET');
};
export const editInvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/modify`, data, 'POST', 2);
};
export const getInvoiceList = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/page`, data, 'GET');
};
export const deleteInvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/${data}`, data, 'DELETE');
};
export const paymentInvoiceSummary = data => {
	return request(`${ENV.BASE_GANG_API}/payment/invoiceSummary`, data, 'POST', 2);
};
export const exportXlsinvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/exportXls`, data, 'GET', 1, 'blob');
};
export const exportinvoice = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/export`, data, 'GET', 1, 'blob');
};
export const invoicedownloadAttachment = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/downloadAttachment`, data, 'GET', 1, 'blob');
};
export const paymentinvoicePage = data => {
	return request(`${ENV.BASE_GANG_API}/payment/invoicePage`, data, 'GET');
};
export const invoiceinvalid = data => {
	return request(`${ENV.BASE_GANG_API}/invoice/invalid/${data}`, data, 'GET');
};
// 清除图片缓存
export function invoicedelImgScanCache() {
	return request(`${ENV.BASE_GANG_API}/invoice/delImgScanCache`, {}, 'POST');
}

// 发票管理结束

// 补充协议开始
// 补充协议列表
export function API_SupplementalAgreementList(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/page`, data, 'GET');
}
// 创建补协第一步---获取补协合同列表
export function API_SupplementalAgreementContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/contractPage`, data, 'GET');
}
// 创建补协第一步---选择合同后校验是否存在正在进行中的补协
export function API_SupplementalAgreementLatest(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.contractNo}/getNewest`, data, 'GET');
}
// 创建补协第二步---获取合同详情
export function API_SupplementalAgreementContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.contractNo}/getContractInfo`, data, 'GET');
}
// 新建保存补充协议
export function API_SupplementalAgreementSaveDraft(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement`, data, 'POST', 2);
}
// 修改保存补充协议
export function API_SupplementalAgreementUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement`, data, 'PUT', 2);
}
// 预览协议
export function API_SupplementalAgreementPreview(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/preview`, data, 'POST', 2);
}
// 提交补充协议
export function API_SupplementalAgreementSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/submit`, data, 'POST', 2);
}
// 补充协议修改时获取详情
export function API_SupplementalAgreementModifyDetail(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.id}/modifyDetail`, data, 'GET');
}
// 补充协议盖章-UKey获取签名数据
export function API_SupplementalAgreementGetPdfHashList(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/seal/getPdfHashList`, data, 'POST', 2);
}
// 补充协议盖章-证书托管模式
export function API_SupplementalAgreementAutoSign(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/signature/auto`, data, 'POST', 2);
}
// 补充协议盖章后确认签章
export function API_SupplementalAgreementToConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}/signConfirm`, data, 'GET');
}
// 补充协议盖章驳回
export function API_SupplementalAgreementReject(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.id}/reject`, data, 'GET');
}

// 下载单个补协文件
export function API_SupplementalAgreementSingleFile(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}/download`, '', 'GET', 1, 'blob');
}
// 下载合同及历史协议一起下载
export function API_SupplementalAgreementAllFile(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}/downloadAll`, '', 'GET', 1, 'blob');
}
// 取消补协
export function API_SupplementalAgreementDelete(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}`, '', 'DELETE');
}

// 查看补协详情
export function API_SupplementalAgreementDetail(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.id}/detail`, '', 'GET');
}
// 补充协议结束

// 采销合同关联-start
// 采销合同关联列表
export function API_SteelsRelationContractList(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/page`, data, 'GET');
}
// 解除采销合同关联关系
export function API_SteelsRelieveRelationContract(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/delete`, data, 'DELETE');
}
// 保存采销合同关联关系
export function API_SteelsSaveRelationContract(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/save`, data, 'POST', 2);
}
// 检测合同是否已经关联其他合同
export function checkContractBinding(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/isContractBinding`, data, 'GET');
}
// 采销合同关联详情
export function API_SteelsRelationContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/${data.id}`, data, 'GET');
}
// 采销合同关联详情--上游合同附件一键下载
export function API_SteelsElectronicContractDownloadAll(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.contractNo}/onlinePdfDownload`, '', 'GET', 1, 'blob');
}
// 采销合同关联详情--下游合同附件一键下载
export function API_SteelsSupplementContractDownloadAll(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data.contractId}/oneClickToDownload`, '', 'GET', 1, 'blob');
}
// 采销合同关联-end
// 货转管理-start
// 货转管理列表
// 我开具的
export function API_SteelsGoodstransferPageGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/pageGoodsTransfer`, data, 'GET');
}
// 开具给我的
export function API_SteelsGoodstransferPageRecevieGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/pageRecevieGoodsTransfer`, data, 'GET');
}
// 货转证明批量下载
export function API_SteelsGoodstransferBatchDownload(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/batchDownload`, data, 'GET', 1, 'blob');
}
// 货转开具——获取仓押业务的货转标的
export function API_SteelsGoodsTransferPurchase(data) {
	return request(`${ENV.BASE_GANG_API}/contrac/${data}/detail`, '', 'GET');
}
// 货转开具——待开具货转的合同列表
export function API_SteelsGoodsTransferContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/goodsTransferContractPage`, data, 'GET');
}
// 货转开具——根据所选合同获取详情（基础信息、收发货列表信息）
export function API_SteelsGetReceiveListInfo(contractNo) {
	return request(`${ENV.BASE_GANG_API}/receive/getReceiveListInfo/${contractNo}`, {}, 'GET');
}
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
// 货转开具——获取单个详情
export function API_SteelsGoodstransferDetail(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}`, data, 'GET');
}
export function API_SteelsReceiveChangeStatus(data) {
	return request(`${ENV.BASE_GANG_API}/receive/changeStatus/${data}`, data, 'GET');
}
// 采销合同关联-end
export function API_SteelsReceiveCancelShipment(data) {
	return request(`${ENV.BASE_GANG_API}/receive/cancelShipment`, data, 'POST', 2);
}
export function API_SteelsReceiveFindAllReceiveRecords(data) {
	return request(`${ENV.BASE_GANG_API}/receive/findAllReceiveRecords/${data}`, data, 'GET');
}
// 货转-签章手机验证码
export function API_SteelsGoodstransferSignAuto(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/seal/auto`, data, 'POST', 2);
}
// 货转-签章Ukey
export function API_SteelsGoodstransferSignUkey(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/seal/ukey`, data, 'POST', 2);
}
// 货转-签章后推送结果
export function API_SteelsGoodstransferSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}/signAfterConfirm`, data, 'PUT');
}
// 销售合同取消
export function API_SteelsAdditionalContractDelete(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data}`, '', 'DELETE');
}

// 货转-作废
export function API_SteelsGoodstransferCancel(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/cancel `, data, 'PUT');
}
// 货转-取消
export function API_SteelsGoodstransferQuit(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/quit`, data, 'PUT');
}

// 放货通知-详情
export function API_SteelsGoodstransferReleaseDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/${data.id}/detail`, data, 'GET');
}
// 放货通知-选择合同
export function getSupplementGoodsTransferRelease(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/contractPage`, data, 'GET');
}
// 放货通知-列表
export function API_SteelsGoodstransferPageRelease(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/page`, data, 'GET');
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
// 放货通知-提交
export function API_SteelsGoodstransferReleaseSubmitDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/submit`, data, 'POST', 2);
}
export function API_SteelsGoodstransferReleaseSubmitCheckDetail(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/check`, data, 'GET');
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

// 放货通知-导出
export function API_SteelsReleaseExportDownload(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/export`, '', 'GET', 1, 'blob');
}
// 放货通知-取消/作废
export function API_SteelsGoodstransferReleaseQuit(data) {
	return request(`${ENV.BASE_GANG_API}/transferRelease/cancel`, data, 'POST', 2);
}

// 结算单
//  创建结算单根据合同获取信息
export function API_SteelsStatementNextStep(data) {
	return request(`${ENV.BASE_GANG_API}/statement/nextStep/${data.id}`, data, 'GET');
}
//  创建结算单根据补录合同获取信息
export function getSupplStatementNextStep(data) {
	return request(`${ENV.BASE_GANG_API}/statement/suppl/nextStep/${data.id}`, data, 'GET');
}
// 结算单开具  计算衡重票种
export function API_SteelsStatementCalcuateWeighing(data) {
	return request(`${ENV.BASE_GANG_API}/statement/calculateWeight`, data, 'PUT');
}
// 结算单货转勾选后 代出下边结算单列表
export function API_SteelsStatementDetailParticular(data) {
	return request(`${ENV.BASE_GANG_API}/statement/detailParticular`, data, 'PUT', 2);
}
// 结算单下载模板
export const exportSettleTpl = data => {
	return request(`${ENV.BASE_GANG_API}/statement/downloadGoodsInfo/${data.contractId}`, data, 'GET', 1, 'blob');
};
//  结算单保存/修改
export function API_SteelsStatementSave(data) {
	return request(`${ENV.BASE_GANG_API}/statement/save`, data, 'POST', 2);
}
// 结算单新创建提交
export function API_SteelsStatementSubmit1(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit1`, data, 'PUT', 2);
}
// 结算单新创建提交
export function API_SteelsStatementSubmit2(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit2`, data, 'PUT', 2);
}
// 结算单修改页提交
export function API_SteelsStatementSubmit3(data) {
	return request(`${ENV.BASE_GANG_API}/statement/submit3`, data, 'PUT', 2);
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
// 结算单取消
export function API_SteelsStatementStatementQuit(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementQuit/${data}`, '', 'PUT');
}
// 结算单作废取消
export function API_SteelsStatementStatementCancelOff(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancelOff/${data.id}`, data, 'PUT', 2);
}
// 结算单作废签章
export function API_SteelsStatementCancelSealUkey(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/seal/ukey`, data, 'POST', 2);
}
// 结算单作废签章auto
export function API_SteelsStatementCancelSealAuto(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/seal/auto`, data, 'POST', 2);
}
// 结算单作废完成
export function API_SteelsStatementCancelSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/statement/cancel/${data}/signAfterConfirm`, '', 'PUT');
}
// 结算单作废驳回
export function API_SteelsstatementCancelCanccl(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancelCancel/${data.id}`, data, 'PUT');
}

// 结算单待确认驳回
export function API_SteelsStatementStatementOff(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementOff/${data.id}`, data, 'PUT');
}
// 我的结算单
export function API_SteelsStatementMyStatementList(data) {
	return request(`${ENV.BASE_GANG_API}/statement/myStatementList`, data, 'GET');
}
// 结算单作废/确认
export function API_SteelsStatementConfirmStatementList(data) {
	return request(`${ENV.BASE_GANG_API}/statement/confirmStatementList`, data, 'GET');
}
// 结算单详情
export function API_SteelsStatementDetail(data) {
	return request(`${ENV.BASE_GANG_API}/statement/detail/${data.id}`, '', 'GET');
}
/** 保存补录结算单 */
export const saveSupplStatement = data => request(`${ENV.BASE_GANG_API}/statement/suppl/save`, data, 'POST', 2);
/** 保存补录结算单 */
export const submitSupplStatement = data => request(`${ENV.BASE_GANG_API}/statement/suppl/submit`, data, 'POST', 2);
// 结算单删除
export function API_SteelsStatementDelete(data) {
	return request(`${ENV.BASE_GANG_API}/statement/delete/${data.id}`, data, 'PUT', 2);
}
// 结算单作废
export function API_SteelsStatementStatementCancel(data) {
	return request(`${ENV.BASE_GANG_API}/statement/statementCancel/${data.id}`, data, 'PUT', 2);
}
export function API_SteelsStatementfindByContractNo(data) {
	return request(`${ENV.BASE_GANG_API}/statement/findByContractNo/${data.contractNo}`, data, 'GET');
}
// 获取货转信息
export function API_SteelsGetGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/findByContractId`, data, 'GET');
}
// 修改采购合同-OA页面
export function API_SteelsBuyContractUpdateToSaveOa(data) {
	return request(`${ENV.BASE_GANG_API}/contract/oaOutsideChainUpdate`, data, 'PUT', 2);
}
// 获取钢厂列表
export function getOriginPlace(data) {
	return request(`${ENV.BASE_GANG_API}/api/materialCategory/originPlaceRel/getOriginPlace`, data, 'GET');
}
export function getPaymentSellContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/paymentSellContractPage`, data, 'GET');
}
// 结算单销售合同列表
export function getStatementSellContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/statementSellContractPage`, data, 'GET');
}
// 获取品类级联
export const getMaterialCategory = data => request(`${ENV.BASE_GANG_API}/api/materialCategory/cascade`, data, 'GET');
// 获取提单品类级联
export const getTakeBillMaterialCategory = id =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/materialCategory/${id}`, {}, 'GET');
// 修改后保存补录合同
export function API_SteelsAdditionalContractUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract`, data, 'POST', 2);
}
// 保存双签合同
export function saveUploadDoubleSigned(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/uploadDoubleSigned`, data, 'POST', 2);
}

/**
 * 检测下游是否等级了保证金
 * @param {*} data
 * @returns
 */
export const checkCollection = data => {
	return request(`${ENV.BASE_GANG_API}/collection/checkCollection/${data.contractNo}`, data, 'GET');
};
// 回款 线上合同获取详情
export const getCollectionByContractNo = data => {
	// return request(`${ENV.BASE_GANG_API}/goodstransfer/${data.id}`, '', 'GET')
	return request(`${ENV.BASE_GANG_API}/contract/getByContractNo/${data}`, data, 'GET');
};
// 补录货转-获取合同详情
export function getSupplementContractInfo(data) {
	return request(`${ENV.BASE_GANG_API}/goodstransfer/getContractInfo`, data, 'GET');
}
// 补录货转 校验
export function checkSupplementGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/check`, data, 'POST', 2);
}
// 校验合同数量是否可以开具货转 校验
export function checkContractQuantity(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/checkContractQuantity`, data, 'GET');
}

// 补录货转-修改保存货转
export function updateSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/update`, data, 'PUT', 2);
}
// 补录货转-保存货转
export function saveSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/save`, data, 'POST', 2);
}
// 补录货转-提交货转
export function submitSupplement(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/submit`, data, 'POST', 2);
}
// 补录货转选择合同
export function getSupplementGoodsTransfer(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/contractPage`, data, 'GET');
}
// 货转-导出待开具货转清单
export function exportContractPurchase(data) {
	return request(`${ENV.BASE_GANG_API}/supplementGoodsTransfer/exportContractPurchase`, data, 'GET', 2, 'blob');
}
// 货转-货物明细导入
// 结算单检验是否有在途的提单
export function getTakeDeliverIng(contractId) {
	return request(`${ENV.BASE_GANG_API}/statement/takeDeliverIng/${contractId}`, '', 'GET');
}

// 向下游付款 检测 是否有其他在途的付款
export function getPaymentIng(data) {
	return request(`${ENV.BASE_GANG_API}/payment/paymentIng`, data, 'POST', 2);
}
// 上传单据
export const uploadMyReceipts = `${ENV.BASE_API}/api/my/doc/save`;
// 我的单据列表
export function getMyReceiptsList(data) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/page`, data, 'GET');
}
// 我的单据uk盖章
export function myReceiptsUk(data) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/${data.id}/seal/ukey`, data, 'GET');
}
export function confirmMyReceiptsUk(data) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/${data.id}/sealed`, data, 'GET');
}
// 我的单据托管盖章
export function myReceiptsAuto(id) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/${id}/seal/auto`, '', 'GET');
}
export function saveMyReceipts(data) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/save`, data, 'POST', 2);
}
export function deleteMyReceipts(id) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/${id}/delete`, '', 'GET');
}
// 托管盖章
export function confirmMyReceiptsAuto(data) {
	return request(`${ENV.BASE_GANG_API}/api/my/doc/${data.id}/seal/auto`, data, 'GET');
}

// 获取合同接入审批流信息
export function getOaInfo(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.id}/getProcessInitiator`, '', 'GET');
}
/** 货转获取入库记录 */
export const getPageByGoodsTransfer = data =>
	request(`${ENV.BASE_GANG_API}/api/warehouse/inout/pageByGoodsTransfer`, data, 'POST', 2);
// 获取仓库列表
export const getStorageList = data => request(`${ENV.BASE_GANG_API}/api/storageMonitoring/getAllStorage`, data, 'GET');
// 获取品名
export const getMaterialNameBySteelType = data =>
	request(`${ENV.BASE_GANG_API}/api/materialCategory/getMaterialNameBySteelType`, data, 'GET');

// wps集成
// 创建文件文件夹
export function createWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file`, data, 'POST', 2);
}
// 获取文件列表
export function getWpsFileList(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/page`, data, 'GET');
}
// 删除文件、文件夹
export function deleteWpsFile(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/${id}`, '', 'DELETE');
}
// 重命名
export function renameWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/rename/${data.id}`, data, 'GET');
}
// 上传文件
export const wpsFileUpload = `${ENV.BASE_GANG_API}/api/cloudDoc/file/upload`;
// 复制
export function copyWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/copy/${data.id}`, data, 'GET');
}
// 移动
export function moveWpsFile(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/move/${data.id}`, data, 'GET');
}
// iframe链接
export function wpsFileLink(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/fileLink/${data.id}`, data, 'GET');
}
// 分享文件
export function shareWpsInfo(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/shareLink`, data, 'POST', 2);
}
// 分享历史
export function shareHistoryWps(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/shareHistory/${id}`, '', 'GET');
}
// 分享用户列表
export function shareListWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/user/shareList`, data, 'GET');
}
// 鉴权
export function checkWhetherPushWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/user/checkWhetherPush`, data, 'GET');
}
// 下载文件
export function downloadCloudDoc(id) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/download/${id}`, '', 'GET', 1, 'blob');
}
// 判断当前云表格是否有文件夹
export function API_isExistFolderWps(data) {
	return request(`${ENV.BASE_GANG_API}/api/cloudDoc/file/isExistFolder`, data, 'GET');
}
