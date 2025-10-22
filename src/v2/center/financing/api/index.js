/**
 * 融资api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';

export function API_FinancingList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/list`, data, 'GET');
}
export function API_FinancingListAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/toAuditList`, data, 'GET');
}
// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}
export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST');
}
export function API_FinancingAdvanceList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/audit/list`, data, 'GET');
}
export function API_FinancingAdvanceMangList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/list`, data, 'GET');
}
export function API_FinancingCounterfoilList(data) {
	return request(`${ENV.BASE_API}/api/financing/billListForFinancing`, data, 'GET');
}
export function API_GetAdvancePayableList(data) {
	// 预付账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pre/pay`, data, 'GET');
}
export function API_Financinginvalid(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/invalid`, data, 'POST', 2);
}
export function API_FinancingAdvanceinvalid(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/invalid`, data, 'POST', 2);
}
export function API_FinancingbankList(data) {
	return request(`${ENV.BASE_API}/api/financing/bankList`, data, 'GET');
}
export function API_FinancingsellerList(data) {
	return request(
		`${ENV.BASE_USER_API}/api/company/findAllByTypeAndNameLike`,
		{ ...data, companyTypes: ['CORE_COMPANY'] },
		'POST',
		2
	);
}
export function API_FinancingCounterfoilinvalid(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/invalid`, data, 'POST', 2);
}

export function API_FinancingAdvanceListLog(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/auditedList`, data, 'GET');
}
export function API_FinancingCounterfoilListLog(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/financing/list`, data, 'GET');
}
export function API_FinancingCounterfoilListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bill/financing/toAuditList`, data, 'GET');
}

export function API_FinancingExportXls(data) {
	// 核心企业融资记录导出
	return request(`${ENV.BASE_API}/api/financing/apply/export`, data, 'GET', 1, 'blob');
}
export function API_FinancingDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/detail`, data, 'GET');
}
export function API_FinancingRDDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/getFinancingOrder`, data, 'GET');
}
export function API_FinancingRDSubmit(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/financingOrderRegister`, data, 'POST', 2);
}

export function API_FinancingJRDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/${data.financingApplyId}/auditDetail`, data, 'GET');
}
export function API_FinancingAdvanceDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/${data.financingApplyId}/auditDetail`, data, 'GET');
}
export function API_FinancingAdvanceDouDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/view/${data.financingApplyId}/detail`, data, 'GET');
}
export function API_FinancingDetailFK(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/financingLoanRepay`, data, 'GET');
}
export function API_FinancingAdvanceDetailFK(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/view/${data.financingApplyId}/financingLoanRepay`, data, 'GET');
}
export function API_FinancingDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetailViewFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/viewContract`, data, 'POST', 2);
}
export function API_FinancingAdvanceDetailViewFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/viewContract`, data, 'POST', 2);
}
export function API_FinancingDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/downloadZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplyreceivableList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/receivableList`, data, 'GET');
}
export function API_FinancingApplyreceivableListPledge(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/apply/receivableList`, data, 'GET');
}
export function API_FinancingApplypledgeDa(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/confirm`, data, 'POST', 2);
}
export function API_FinancingApplypledgeCashDa(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/confirm`, data, 'POST', 2);
}
export function API_FinancingApplypledge(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/product`, data, 'GET');
}
export function API_FinancingLoanListpledge(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pledge/list`, data, 'GET');
}
export function API_FinancingLoanSumDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/summaryFinancingLoan`, data, 'GET');
}
export function API_FinancingLogpledge(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/apply/auditedList`, data, 'GET');
}
export function API_AssetsPledgeBankPro(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/getPledgeBankProduct`, data, 'GET');
}
export function API_AssetsWareList(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/storage/list`, data, 'GET');
}
export function API_GetPledgePayableList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/list/recv`, data, 'GET');
}
export function API_AssetsGoodsModalList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/inbound/list`, data, 'GET');
}
export function API_AssetsPriceDing(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/listPrice`, data, 'GET');
}
export function API_AssetsPriceDingList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/listByPage`, data, 'GET');
}
export function API_AssetsPriceDingDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/detail`, data, 'GET');
}
export function API_SubstitutionListLOGMAINZF(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/cancel`, data, 'POST', 1);
}
export function API_SubstitutionListLOGMAINPUSH(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/rePush`, data, 'POST', 1);
}
export function API_ReplenishmentListMAINZF(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/cancel`, data, 'POST', 1);
}

export function API_ReplenishmentListMAINPUSH(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/rePush`, data, 'POST', 1);
}

export function API_GetAssetsPledgeDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/detail`, data, 'GET');
}
export function API_AssetsGoodsSave(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/modify`, data, 'POST', 2);
}
export function API_PledgeExchangeList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/list`, data, 'GET');
}
export function API_PledgeExchangeDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/finance/detail`, data, 'GET');
}
export function API_PledgeExchangeDetailApply(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/detail`, data, 'GET');
}
export function API_PledgeExchangeListLOG(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/list`, data, 'GET');
}
export function API_PledgeExchangeLOGDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/detail`, data, 'GET');
}

export function API_PledgeExchangeLOGDetaildownloadFile(data) {
	return request(
		`${ENV.BASE_API}/api/financing/pledge/exchange/view/${data.contractFileId}/downloadFile`,
		data,
		'POST',
		2,
		'blob'
	);
}
export function API_PledgeExchangeLOGDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/view/${data.id}/downloadZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeReplyList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/list`, data, 'GET');
}
export function API_PledgeReplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/detail`, data, 'GET');
}
export function API_PledgeReplyDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplyDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/view/${data.id}/downloadZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/financing/list`, data, 'GET');
}
export function API_PledgeFinExpireApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/loan/detail`, data, 'GET');
}

export function API_PledgeFinExpireApplyDetailXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/repayFileList`, data, 'GET');
}

export function API_PledgeFinExpireDetaildownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/viewContract`, data, 'POST', 2);
}

export function API_PledgeFinExpireDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireDetailrepaymentTrial(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/repaymentTrial`, data, 'POST', 2);
}
export function API_PledgeReplenList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/notice/list`, data, 'GET');
}
export function API_PledgeReplenDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/${data.noticeId}/detail`, data, 'GET');
}
export function API_PledgeReplenDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/view/${data.noticeId}/downloadZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeExchangeApplyXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/exchangeFileList`, data, 'GET');
}
export function API_PledgeExchangeApplydownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/viewContract`, data, 'POST', 2);
}
export function API_PledgeExchangeApplydownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeExchangeApplydownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeReplenApplyXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/addGoodsFileList`, data, 'GET');
}
export function API_PledgeReplenApplydownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/viewContract`, data, 'POST', 2);
}

export function API_PledgeReplenApplydownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenApplydownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/save`, data, 'POST', 2);
}
export function API_PledgeReplenAddSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/save`, data, 'POST', 2);
}
export function API_AssetsGoodsModalFINList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/addgoods/inbound/list`, data, 'GET');
}
export function API_PledgeExchangeAddSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/save`, data, 'POST', 2);
}

export function API_FinancingApplycompanyCredit(data) {
	return request(`${ENV.BASE_API}/api/creditLine/assetCredit`, data, 'GET');
}
export function API_FinancingCounterfoilApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/billDetail`, data, 'GET');
}

export function API_FinancingApplyXieyi(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.receivableId}/financingApplyContractList`, data, 'GET');
}
export function API_FinancingApplyAdvanceXieyi(data) {
	return request(
		`${ENV.BASE_API}/api/financing/pre/coreCompany/apply/${data.receivableId}/financingApplyContractList`,
		data,
		'GET'
	);
}
export function API_FinancingApplyXieyiView(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/viewContract`, data, 'POST', 2);
}
export function API_FinancingAdvanceApplyXieyiView(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/viewContract`, data, 'POST', 2);
}
export function API_FinancingCounterfoilApplyXieyiView(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/viewContract`, data, 'POST', 2);
}
export function API_FinancingCounterfoilFileList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/contractList`, data, 'GET');
}

export function API_FinancingApplyXieyiDown(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceApplyXieyiDown(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingCounterfoilApplyXieyiDown(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplyXieyiDownAll(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceApplyXieyiDownAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingCounterfoilApplyXieyiDownAll(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/save`, data, 'POST', 2);
}
export function API_FinancingApplySaveHN(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/financeSave`, data, 'POST', 2);
}
export function API_FinancingAdvanceApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/save`, data, 'POST', 2);
}
export function API_FinancingCounterApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/save`, data, 'POST', 2);
}

export function API_FinancingCoreCompanyApplySave(data) {
	// 核心企业融资申请
	return request(`${ENV.BASE_API}/api/financing/coreCompany/apply/save`, data, 'POST', 2);
}
export function API_FinancingSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAdvanceSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingCounterfoilSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}

export function API_FinancingGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/supplierSignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/coreCompanySignPdfHashList`, data, 'GET');
}
export function API_FinancingCounterfoilGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/signPdfHashList`, data, 'GET');
}

export function API_FinancingJRGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankSignPdfHashList`, data, 'GET');
}
export function API_FinancingMAINGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanySignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceMAINGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanySignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceMGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderSignPdfHashList`, data, 'GET');
}
export function API_FinancingSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/supplierKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/coreCompanyKeySign`, data, 'POST', 2);
}
export function API_FinancingCounterSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/${data.financingApplyId}/keySign`, data, 'POST', 2);
}

export function API_FinancingJROnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAuditPass`, data, 'POST', 2);
}
export function API_FinancingJRSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankKeySign`, data, 'POST', 2);
}
export function API_FinancingMAINOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAuditPass`, data, 'POST', 2);
}
export function API_FinancingMAINSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyKeySign`, data, 'POST', 2);
}

export function API_FinancingAdvanceMAINSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceMSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceMOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAuditPass`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAINOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAuditPass`, data, 'POST', 2);
}

export function API_CfcaFinJRAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/supplierAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinMAINAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAutoSign`, data, 'POST', 2);
}

export function API_CfcaFinAdvanceAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAdvanceMAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAdvanceMAINAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/coreCompanyAutoSign`, data, 'POST', 2);
}
export function API_CfcaCounterfoilMAINAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/${data.financingApplyId}/autoSign`, data, 'POST', 2);
}

export function API_FinancingAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAuditReject`, data, 'POST', 2);
}
export function API_FinancingMAINAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAuditReject`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAINAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAuditReject`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAuditReject`, data, 'POST', 2);
}
export function API_FinancingSync(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pushAndSyncLoan`, data, 'POST', 2);
}

export function API_FinancingJRSync(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/${data.loanId}/syncRepay`, data, 'POST', 2);
}
export function API_FinancingAuditSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAdvanceAuditSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAuditGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankSignPdfHashList`, data, 'GET');
}
export function API_FinancingListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/auditedList`, data, 'GET');
}
export function API_FinancingJiejuJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/loanBankDetail`, data, 'GET');
}
export function API_FinancingListMAIN(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/auditedList`, data, 'GET');
}
export function API_GetLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/list`, data, 'GET');
}
export function API_GetLoanListConfirm(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/receive/confirm/list`, data, 'GET');
}

export function API_GetLoanListMAINCOUNT(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/countRepayType`, data, 'GET');
}
export function API_GetLoanListAdvanceMAINCOUNT(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/countReceiveConfirm`, data, 'GET');
}

export function API_GetAdvanceLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/list`, data, 'GET');
}
export function API_goAdvanceLoanCheck(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/validate/${data.loanId}`, data, 'GET');
}
export function API_GetLoanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/financingLoanRepay`, data, 'GET');
}
export function API_GetAdvanceLoanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/${data.loanId}/financingLoanRepay`, data, 'GET');
}
export function API_GetLoanHuanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/financingRepayRegister`, data, 'GET');
}
export function API_GetLoanFangDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.loanId}/financing/detail`, data, 'GET');
}
export function API_GetLoanListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/bankList`, data, 'GET');
}
export function API_GetLoanListCounterfoil(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/bill/financing/list`, data, 'GET');
}
export function API_GetLoanListJRFang(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/list/loan`, data, 'GET');
}
export function API_GetLoanDetailListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/queryLoanDetailList`, data, 'GET');
}
export function API_ExportLoanDetailListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/loanDetailList/export`, data, 'GET', 2, 'blob');
}
export function API_ExportLoanDetailListMAIN(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/list/export`, data, 'GET', 2, 'blob');
}
// 获取应收状态统计
export const getFinancingStatistics = data => request(`${ENV.BASE_API}/api/financing/apply/counts`, data, 'GET');
// 获取预付状态统计
export const getFinancingAdvanceStatistics = data => request(`${ENV.BASE_API}/api/financing/pre/apply/counts`, data, 'GET');

export function API_LoanApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/applySave`, data, 'POST', 2);
}
export function API_GetLoanApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/apply/${data.loanId}`, data, 'GET');
}
export function API_GetLoanApplyReceipt(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/receive/confirm`, data, 'POST', 2);
}

export function API_LoanApplySaveNS(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/repayPrincipal`, data, 'POST', 2);
}
export function API_LoanAdvanceApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/pre/applySave`, data, 'POST', 2);
}
export function API_RepayAutoRepay(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/autoRepay/${data.loanId}`, '', 'POST', 2);
}
export function API_LoanFangSave(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/registerByAsset`, data, 'POST', 2);
}
export function API_LoanHuanSave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/register`, data, 'POST', 2);
}
export function API_LoanZuofei(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/invalidLoanByAsset`, data, 'PUT', 2);
}
export function API_AssetsUpdateTrain(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genTrainTrack`, data, 'GET');
}
export function API_AssetsUpdateShip(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genShipTrack`, data, 'GET');
}
export function API_GetFinancingStatusTip(data) {
	return request(`${ENV.BASE_API}/api/financing/getStatusTip`, data, 'GET');
}

// 华能云成放款登记
export function API_FinancingLoanRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/registerByApply`, data, 'POST', 2);
}
// 华能云成还款登记
export function API_FinancingRepayHnycRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/hnycRegister`, data, 'POST', 2);
}
// 华能云成放款作废
export function API_FinancingLoanInvalidLoanByApply(loanId) {
	return request(`${ENV.BASE_API}/api/financing/loan/${loanId}/invalidLoanByApply`, '', 'PUT', 2);
}
// 华能云成融资纪录
export function API_FinancingListHn(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/hnycList`, data, 'GET');
}
// 票据融资纪录
export function API_FinancingListCounterfoil(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/bill/ListForLoan`, data, 'GET');
}
// 额度列表
export function API_CreditLinelList(data) {
	return request(`${ENV.BASE_API}/api/creditLine/list`, data, 'GET');
}
// 导出额度
export function API_CreditLineExport(data) {
	return request(`${ENV.BASE_API}/api/creditLine/export`, data, 'GET', 2, 'blob');
}
// 额度详情
export function API_CreditLineDetail(data) {
	return request(`${ENV.BASE_API}/api/creditLine/detail`, data, 'GET');
}
// 额度启用停用数量
export function API_CreditLineCount(data) {
	return request(`${ENV.BASE_API}/api/creditLine/getCreditLineCount`, data, 'GET');
}
// 获取资金类型
export function API_GetBankProductList(data) {
	return request(`${ENV.BASE_API}/api/creditLine/getBankProductItem`, data, 'GET');
}

// 金融机构账号-核心企业-额度列表
export function API_CoreCompanyCreditLinelList(data) {
	return request(`${ENV.BASE_API}/api/creditLine/coreCompanyPage`, data, 'GET');
}
// 金融机构账号-融资企业-额度列表
export function API_TraderCreditLinelList(data) {
	return request(`${ENV.BASE_API}/api/creditLine/traderPage`, data, 'GET');
}

// 获取台账总览信息
export function API_LedgerSummary(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/summary`, data, 'GET');
}
// 保理业务台账分页列表
export function API_LedgerBusinessList(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/businessDataPage`, data, 'GET');
}
// 保理客户业务数据分页列表
export function API_LedgerCustomerCreditLineList(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/customerCreditLinePage`, data, 'GET');
}
// 保理债务人额度数据分页列表
export function API_LedgerDebtorCreditLineList(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/debtorCreditLinePage`, data, 'GET');
}
// 保理业务台账导出
export function API_LedgerBusinessExport(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/businessDataExport`, data, 'GET', 1, 'blob');
}
// 保理客户业务数据导出
export function API_CustomerCreditLineExport(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/customerCreditLineExport`, data, 'GET', 1, 'blob');
}
// 保理债务人额度数据导出
export function API_DebtorCreditLineExport(data) {
	return request(`${ENV.BASE_API}/api/financing/ledger/debtorCreditLineExport`, data, 'GET', 1, 'blob');
}


