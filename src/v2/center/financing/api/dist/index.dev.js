"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_FinancingList = API_FinancingList;
exports.API_FinancingListAudit = API_FinancingListAudit;
exports.API_COMPANYACCOUNTLIST = API_COMPANYACCOUNTLIST;
exports.API_GETLOGINBYMOBILE = API_GETLOGINBYMOBILE;
exports.API_FinancingAdvanceList = API_FinancingAdvanceList;
exports.API_FinancingAdvanceMangList = API_FinancingAdvanceMangList;
exports.API_FinancingCounterfoilList = API_FinancingCounterfoilList;
exports.API_GetAdvancePayableList = API_GetAdvancePayableList;
exports.API_Financinginvalid = API_Financinginvalid;
exports.API_FinancingAdvanceinvalid = API_FinancingAdvanceinvalid;
exports.API_FinancingbankList = API_FinancingbankList;
exports.API_FinancingsellerList = API_FinancingsellerList;
exports.API_FinancingCounterfoilinvalid = API_FinancingCounterfoilinvalid;
exports.API_FinancingAdvanceListLog = API_FinancingAdvanceListLog;
exports.API_FinancingCounterfoilListLog = API_FinancingCounterfoilListLog;
exports.API_FinancingCounterfoilListJR = API_FinancingCounterfoilListJR;
exports.API_FinancingExportXls = API_FinancingExportXls;
exports.API_FinancingDetail = API_FinancingDetail;
exports.API_FinancingRDDetail = API_FinancingRDDetail;
exports.API_FinancingRDSubmit = API_FinancingRDSubmit;
exports.API_FinancingJRDetail = API_FinancingJRDetail;
exports.API_FinancingAdvanceDetail = API_FinancingAdvanceDetail;
exports.API_FinancingAdvanceDouDetail = API_FinancingAdvanceDouDetail;
exports.API_FinancingDetailFK = API_FinancingDetailFK;
exports.API_FinancingAdvanceDetailFK = API_FinancingAdvanceDetailFK;
exports.API_FinancingDetaildownloadFile = API_FinancingDetaildownloadFile;
exports.API_FinancingJRDetaildownloadFile = API_FinancingJRDetaildownloadFile;
exports.API_FinancingAdvanceDetaildownloadFile = API_FinancingAdvanceDetaildownloadFile;
exports.API_FinancingJRDetailViewFile = API_FinancingJRDetailViewFile;
exports.API_FinancingAdvanceDetailViewFile = API_FinancingAdvanceDetailViewFile;
exports.API_FinancingDetaildownloadFileAll = API_FinancingDetaildownloadFileAll;
exports.API_FinancingJRDetaildownloadFileAll = API_FinancingJRDetaildownloadFileAll;
exports.API_FinancingAdvanceDetaildownloadFileAll = API_FinancingAdvanceDetaildownloadFileAll;
exports.API_FinancingApplyreceivableList = API_FinancingApplyreceivableList;
exports.API_FinancingApplyreceivableListPledge = API_FinancingApplyreceivableListPledge;
exports.API_FinancingApplypledgeDa = API_FinancingApplypledgeDa;
exports.API_FinancingApplypledgeCashDa = API_FinancingApplypledgeCashDa;
exports.API_FinancingApplypledge = API_FinancingApplypledge;
exports.API_FinancingLoanListpledge = API_FinancingLoanListpledge;
exports.API_FinancingLoanSumDetail = API_FinancingLoanSumDetail;
exports.API_FinancingLogpledge = API_FinancingLogpledge;
exports.API_AssetsPledgeBankPro = API_AssetsPledgeBankPro;
exports.API_AssetsWareList = API_AssetsWareList;
exports.API_GetPledgePayableList = API_GetPledgePayableList;
exports.API_AssetsGoodsModalList = API_AssetsGoodsModalList;
exports.API_AssetsPriceDing = API_AssetsPriceDing;
exports.API_AssetsPriceDingList = API_AssetsPriceDingList;
exports.API_AssetsPriceDingDetail = API_AssetsPriceDingDetail;
exports.API_SubstitutionListLOGMAINZF = API_SubstitutionListLOGMAINZF;
exports.API_SubstitutionListLOGMAINPUSH = API_SubstitutionListLOGMAINPUSH;
exports.API_ReplenishmentListMAINZF = API_ReplenishmentListMAINZF;
exports.API_ReplenishmentListMAINPUSH = API_ReplenishmentListMAINPUSH;
exports.API_GetAssetsPledgeDetail = API_GetAssetsPledgeDetail;
exports.API_AssetsGoodsSave = API_AssetsGoodsSave;
exports.API_PledgeExchangeList = API_PledgeExchangeList;
exports.API_PledgeExchangeDetail = API_PledgeExchangeDetail;
exports.API_PledgeExchangeDetailApply = API_PledgeExchangeDetailApply;
exports.API_PledgeExchangeListLOG = API_PledgeExchangeListLOG;
exports.API_PledgeExchangeLOGDetail = API_PledgeExchangeLOGDetail;
exports.API_PledgeExchangeLOGDetaildownloadFile = API_PledgeExchangeLOGDetaildownloadFile;
exports.API_PledgeExchangeLOGDetaildownloadFileAll = API_PledgeExchangeLOGDetaildownloadFileAll;
exports.API_PledgeReplyList = API_PledgeReplyList;
exports.API_PledgeReplyDetail = API_PledgeReplyDetail;
exports.API_PledgeReplyDetaildownloadFile = API_PledgeReplyDetaildownloadFile;
exports.API_PledgeReplyDetaildownloadFileAll = API_PledgeReplyDetaildownloadFileAll;
exports.API_PledgeFinExpireList = API_PledgeFinExpireList;
exports.API_PledgeFinExpireApplyDetail = API_PledgeFinExpireApplyDetail;
exports.API_PledgeFinExpireApplyDetailXie = API_PledgeFinExpireApplyDetailXie;
exports.API_PledgeFinExpireDetaildownloadFileView = API_PledgeFinExpireDetaildownloadFileView;
exports.API_PledgeFinExpireDetaildownloadFile = API_PledgeFinExpireDetaildownloadFile;
exports.API_PledgeFinExpireDetaildownloadFileAll = API_PledgeFinExpireDetaildownloadFileAll;
exports.API_PledgeFinExpireDetailrepaymentTrial = API_PledgeFinExpireDetailrepaymentTrial;
exports.API_PledgeReplenList = API_PledgeReplenList;
exports.API_PledgeReplenDetail = API_PledgeReplenDetail;
exports.API_PledgeReplenDetaildownloadFile = API_PledgeReplenDetaildownloadFile;
exports.API_PledgeReplenDetaildownloadFileAll = API_PledgeReplenDetaildownloadFileAll;
exports.API_PledgeExchangeApplyXie = API_PledgeExchangeApplyXie;
exports.API_PledgeExchangeApplydownloadFileView = API_PledgeExchangeApplydownloadFileView;
exports.API_PledgeExchangeApplydownloadFile = API_PledgeExchangeApplydownloadFile;
exports.API_PledgeExchangeApplydownloadFileAll = API_PledgeExchangeApplydownloadFileAll;
exports.API_PledgeReplenApplyXie = API_PledgeReplenApplyXie;
exports.API_PledgeReplenApplydownloadFileView = API_PledgeReplenApplydownloadFileView;
exports.API_PledgeReplenApplydownloadFile = API_PledgeReplenApplydownloadFile;
exports.API_PledgeReplenApplydownloadFileAll = API_PledgeReplenApplydownloadFileAll;
exports.API_PledgeReplenApplySave = API_PledgeReplenApplySave;
exports.API_PledgeReplenAddSave = API_PledgeReplenAddSave;
exports.API_AssetsGoodsModalFINList = API_AssetsGoodsModalFINList;
exports.API_PledgeExchangeAddSave = API_PledgeExchangeAddSave;
exports.API_FinancingApplycompanyCredit = API_FinancingApplycompanyCredit;
exports.API_FinancingCounterfoilApplyDetail = API_FinancingCounterfoilApplyDetail;
exports.API_FinancingApplyXieyi = API_FinancingApplyXieyi;
exports.API_FinancingApplyAdvanceXieyi = API_FinancingApplyAdvanceXieyi;
exports.API_FinancingApplyXieyiView = API_FinancingApplyXieyiView;
exports.API_FinancingAdvanceApplyXieyiView = API_FinancingAdvanceApplyXieyiView;
exports.API_FinancingCounterfoilApplyXieyiView = API_FinancingCounterfoilApplyXieyiView;
exports.API_FinancingCounterfoilFileList = API_FinancingCounterfoilFileList;
exports.API_FinancingApplyXieyiDown = API_FinancingApplyXieyiDown;
exports.API_FinancingAdvanceApplyXieyiDown = API_FinancingAdvanceApplyXieyiDown;
exports.API_FinancingCounterfoilApplyXieyiDown = API_FinancingCounterfoilApplyXieyiDown;
exports.API_FinancingApplyXieyiDownAll = API_FinancingApplyXieyiDownAll;
exports.API_FinancingAdvanceApplyXieyiDownAll = API_FinancingAdvanceApplyXieyiDownAll;
exports.API_FinancingCounterfoilApplyXieyiDownAll = API_FinancingCounterfoilApplyXieyiDownAll;
exports.API_FinancingApplySave = API_FinancingApplySave;
exports.API_FinancingApplySaveHN = API_FinancingApplySaveHN;
exports.API_FinancingAdvanceApplySave = API_FinancingAdvanceApplySave;
exports.API_FinancingCounterApplySave = API_FinancingCounterApplySave;
exports.API_FinancingCoreCompanyApplySave = API_FinancingCoreCompanyApplySave;
exports.API_FinancingSignList = API_FinancingSignList;
exports.API_FinancingAdvanceSignList = API_FinancingAdvanceSignList;
exports.API_FinancingCounterfoilSignList = API_FinancingCounterfoilSignList;
exports.API_FinancingGetSigList = API_FinancingGetSigList;
exports.API_FinancingAdvanceGetSigList = API_FinancingAdvanceGetSigList;
exports.API_FinancingCounterfoilGetSigList = API_FinancingCounterfoilGetSigList;
exports.API_FinancingJRGetSigList = API_FinancingJRGetSigList;
exports.API_FinancingMAINGetSigList = API_FinancingMAINGetSigList;
exports.API_FinancingAdvanceMAINGetSigList = API_FinancingAdvanceMAINGetSigList;
exports.API_FinancingAdvanceMGetSigList = API_FinancingAdvanceMGetSigList;
exports.API_FinancingSignSave = API_FinancingSignSave;
exports.API_FinancingAdvanceSignSave = API_FinancingAdvanceSignSave;
exports.API_FinancingCounterSignSave = API_FinancingCounterSignSave;
exports.API_FinancingJROnlySignSave = API_FinancingJROnlySignSave;
exports.API_FinancingJRSignSave = API_FinancingJRSignSave;
exports.API_FinancingMAINOnlySignSave = API_FinancingMAINOnlySignSave;
exports.API_FinancingMAINSignSave = API_FinancingMAINSignSave;
exports.API_FinancingAdvanceMAINSignSave = API_FinancingAdvanceMAINSignSave;
exports.API_FinancingAdvanceMSignSave = API_FinancingAdvanceMSignSave;
exports.API_FinancingAdvanceMOnlySignSave = API_FinancingAdvanceMOnlySignSave;
exports.API_FinancingAdvanceMAINOnlySignSave = API_FinancingAdvanceMAINOnlySignSave;
exports.API_CfcaFinJRAutoSignature = API_CfcaFinJRAutoSignature;
exports.API_CfcaFinAutoSignature = API_CfcaFinAutoSignature;
exports.API_CfcaFinMAINAutoSignature = API_CfcaFinMAINAutoSignature;
exports.API_CfcaFinAdvanceAutoSignature = API_CfcaFinAdvanceAutoSignature;
exports.API_CfcaFinAdvanceMAutoSignature = API_CfcaFinAdvanceMAutoSignature;
exports.API_CfcaFinAdvanceMAINAutoSignature = API_CfcaFinAdvanceMAINAutoSignature;
exports.API_CfcaCounterfoilMAINAutoSignature = API_CfcaCounterfoilMAINAutoSignature;
exports.API_FinancingAudit = API_FinancingAudit;
exports.API_FinancingMAINAudit = API_FinancingMAINAudit;
exports.API_FinancingAdvanceMAINAudit = API_FinancingAdvanceMAINAudit;
exports.API_FinancingAdvanceMAudit = API_FinancingAdvanceMAudit;
exports.API_FinancingSync = API_FinancingSync;
exports.API_FinancingJRSync = API_FinancingJRSync;
exports.API_FinancingAuditSignList = API_FinancingAuditSignList;
exports.API_FinancingAdvanceAuditSignList = API_FinancingAdvanceAuditSignList;
exports.API_FinancingAuditGetSigList = API_FinancingAuditGetSigList;
exports.API_FinancingListJR = API_FinancingListJR;
exports.API_FinancingJiejuJR = API_FinancingJiejuJR;
exports.API_FinancingListMAIN = API_FinancingListMAIN;
exports.API_GetLoanList = API_GetLoanList;
exports.API_GetLoanListConfirm = API_GetLoanListConfirm;
exports.API_GetLoanListMAINCOUNT = API_GetLoanListMAINCOUNT;
exports.API_GetLoanListAdvanceMAINCOUNT = API_GetLoanListAdvanceMAINCOUNT;
exports.API_GetAdvanceLoanList = API_GetAdvanceLoanList;
exports.API_goAdvanceLoanCheck = API_goAdvanceLoanCheck;
exports.API_GetLoanDetail = API_GetLoanDetail;
exports.API_GetAdvanceLoanDetail = API_GetAdvanceLoanDetail;
exports.API_GetLoanHuanDetail = API_GetLoanHuanDetail;
exports.API_GetLoanFangDetail = API_GetLoanFangDetail;
exports.API_GetLoanListJR = API_GetLoanListJR;
exports.API_GetLoanListCounterfoil = API_GetLoanListCounterfoil;
exports.API_GetLoanListJRFang = API_GetLoanListJRFang;
exports.API_GetLoanDetailListJR = API_GetLoanDetailListJR;
exports.API_ExportLoanDetailListJR = API_ExportLoanDetailListJR;
exports.API_ExportLoanDetailListMAIN = API_ExportLoanDetailListMAIN;
exports.API_LoanApplySave = API_LoanApplySave;
exports.API_GetLoanApplyDetail = API_GetLoanApplyDetail;
exports.API_GetLoanApplyReceipt = API_GetLoanApplyReceipt;
exports.API_LoanApplySaveNS = API_LoanApplySaveNS;
exports.API_LoanAdvanceApplySave = API_LoanAdvanceApplySave;
exports.API_RepayAutoRepay = API_RepayAutoRepay;
exports.API_LoanFangSave = API_LoanFangSave;
exports.API_LoanHuanSave = API_LoanHuanSave;
exports.API_LoanZuofei = API_LoanZuofei;
exports.API_AssetsUpdateTrain = API_AssetsUpdateTrain;
exports.API_AssetsUpdateShip = API_AssetsUpdateShip;
exports.API_GetFinancingStatusTip = API_GetFinancingStatusTip;
exports.API_FinancingLoanRegister = API_FinancingLoanRegister;
exports.API_FinancingRepayHnycRegister = API_FinancingRepayHnycRegister;
exports.API_FinancingLoanInvalidLoanByApply = API_FinancingLoanInvalidLoanByApply;
exports.API_FinancingListHn = API_FinancingListHn;
exports.API_FinancingListCounterfoil = API_FinancingListCounterfoil;
exports.API_CreditLinelList = API_CreditLinelList;
exports.API_CreditLineExport = API_CreditLineExport;
exports.API_CreditLineDetail = API_CreditLineDetail;
exports.API_CreditLineCount = API_CreditLineCount;
exports.API_GetBankProductList = API_GetBankProductList;
exports.API_CoreCompanyCreditLinelList = API_CoreCompanyCreditLinelList;
exports.API_TraderCreditLinelList = API_TraderCreditLinelList;
exports.API_LedgerSummary = API_LedgerSummary;
exports.API_LedgerBusinessList = API_LedgerBusinessList;
exports.API_LedgerCustomerCreditLineList = API_LedgerCustomerCreditLineList;
exports.API_LedgerDebtorCreditLineList = API_LedgerDebtorCreditLineList;
exports.API_LedgerBusinessExport = API_LedgerBusinessExport;
exports.API_CustomerCreditLineExport = API_CustomerCreditLineExport;
exports.API_DebtorCreditLineExport = API_DebtorCreditLineExport;
exports.getFinancingAdvanceStatistics = exports.getFinancingStatistics = void 0;

var _env = _interopRequireDefault(require("@/v2/config/env"));

var _request = _interopRequireDefault(require("@/api/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function API_FinancingList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/list"), data, 'GET');
}

function API_FinancingListAudit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/toAuditList"), data, 'GET');
} // 企业银行账户管理 账户列表


function API_COMPANYACCOUNTLIST(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_USER_API, "/api/company/account/list"), data, 'GET');
}

function API_GETLOGINBYMOBILE(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/loginByCompanyUserId"), data, 'POST');
}

function API_FinancingAdvanceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/audit/list"), data, 'GET');
}

function API_FinancingAdvanceMangList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/list"), data, 'GET');
}

function API_FinancingCounterfoilList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/billListForFinancing"), data, 'GET');
}

function API_GetAdvancePayableList(data) {
  // 预付账款列表
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/list/pre/pay"), data, 'GET');
}

function API_Financinginvalid(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/invalid"), data, 'POST', 2);
}

function API_FinancingAdvanceinvalid(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/invalid"), data, 'POST', 2);
}

function API_FinancingbankList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/bankList"), data, 'GET');
}

function API_FinancingsellerList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_USER_API, "/api/company/findAllByTypeAndNameLike"), _objectSpread({}, data, {
    companyTypes: ['CORE_COMPANY']
  }), 'POST', 2);
}

function API_FinancingCounterfoilinvalid(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/invalid"), data, 'POST', 2);
}

function API_FinancingAdvanceListLog(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/auditedList"), data, 'GET');
}

function API_FinancingCounterfoilListLog(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/financing/list"), data, 'GET');
}

function API_FinancingCounterfoilListJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bill/financing/toAuditList"), data, 'GET');
}

function API_FinancingExportXls(data) {
  // 核心企业融资记录导出
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/export"), data, 'GET', 1, 'blob');
}

function API_FinancingDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/view/").concat(data.financingApplyId, "/detail"), data, 'GET');
}

function API_FinancingRDDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/getFinancingOrder"), data, 'GET');
}

function API_FinancingRDSubmit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/financingOrderRegister"), data, 'POST', 2);
}

function API_FinancingJRDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/").concat(data.financingApplyId, "/auditDetail"), data, 'GET');
}

function API_FinancingAdvanceDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/").concat(data.financingApplyId, "/auditDetail"), data, 'GET');
}

function API_FinancingAdvanceDouDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/view/").concat(data.financingApplyId, "/detail"), data, 'GET');
}

function API_FinancingDetailFK(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/view/").concat(data.financingApplyId, "/financingLoanRepay"), data, 'GET');
}

function API_FinancingAdvanceDetailFK(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/view/").concat(data.financingApplyId, "/financingLoanRepay"), data, 'GET');
}

function API_FinancingDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/view/").concat(data.contractFileId, "/downloadFile"), data, 'POST', 2, 'blob');
}

function API_FinancingJRDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/downloadContract"), data, 'POST', 2, 'blob');
}

function API_FinancingAdvanceDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/downloadContract"), data, 'POST', 2, 'blob');
}

function API_FinancingJRDetailViewFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/viewContract"), data, 'POST', 2);
}

function API_FinancingAdvanceDetailViewFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/viewContract"), data, 'POST', 2);
}

function API_FinancingDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/view/").concat(data.financingApplyId, "/downloadZip"), data, 'POST', 2, 'blob');
}

function API_FinancingJRDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_FinancingAdvanceDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_FinancingApplyreceivableList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/receivableList"), data, 'GET');
}

function API_FinancingApplyreceivableListPledge(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/apply/receivableList"), data, 'GET');
}

function API_FinancingApplypledgeDa(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/confirm"), data, 'POST', 2);
}

function API_FinancingApplypledgeCashDa(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/confirm"), data, 'POST', 2);
}

function API_FinancingApplypledge(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/product"), data, 'GET');
}

function API_FinancingLoanListpledge(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/pledge/list"), data, 'GET');
}

function API_FinancingLoanSumDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/summaryFinancingLoan"), data, 'GET');
}

function API_FinancingLogpledge(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/apply/auditedList"), data, 'GET');
}

function API_AssetsPledgeBankPro(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/getPledgeBankProduct"), data, 'GET');
}

function API_AssetsWareList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/storage/goods/storage/list"), data, 'GET');
}

function API_GetPledgePayableList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/list/recv"), data, 'GET');
}

function API_AssetsGoodsModalList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/inbound/list"), data, 'GET');
}

function API_AssetsPriceDing(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/risk/listPrice"), data, 'GET');
}

function API_AssetsPriceDingList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/risk/listByPage"), data, 'GET');
}

function API_AssetsPriceDingDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/risk/detail"), data, 'GET');
}

function API_SubstitutionListLOGMAINZF(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/cancel"), data, 'POST', 1);
}

function API_SubstitutionListLOGMAINPUSH(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/rePush"), data, 'POST', 1);
}

function API_ReplenishmentListMAINZF(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/cancel"), data, 'POST', 1);
}

function API_ReplenishmentListMAINPUSH(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/rePush"), data, 'POST', 1);
}

function API_GetAssetsPledgeDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/detail"), data, 'GET');
}

function API_AssetsGoodsSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/modify"), data, 'POST', 2);
}

function API_PledgeExchangeList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/list"), data, 'GET');
}

function API_PledgeExchangeDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/finance/detail"), data, 'GET');
}

function API_PledgeExchangeDetailApply(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/detail"), data, 'GET');
}

function API_PledgeExchangeListLOG(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/list"), data, 'GET');
}

function API_PledgeExchangeLOGDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/detail"), data, 'GET');
}

function API_PledgeExchangeLOGDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/view/").concat(data.contractFileId, "/downloadFile"), data, 'POST', 2, 'blob');
}

function API_PledgeExchangeLOGDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/view/").concat(data.id, "/downloadZip"), data, 'POST', 2, 'blob');
}

function API_PledgeReplyList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/list"), data, 'GET');
}

function API_PledgeReplyDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/detail"), data, 'GET');
}

function API_PledgeReplyDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/view/").concat(data.contractFileId, "/downloadFile"), data, 'POST', 2, 'blob');
}

function API_PledgeReplyDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/view/").concat(data.id, "/downloadZip"), data, 'POST', 2, 'blob');
}

function API_PledgeFinExpireList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/financing/list"), data, 'GET');
}

function API_PledgeFinExpireApplyDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/loan/detail"), data, 'GET');
}

function API_PledgeFinExpireApplyDetailXie(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/repayFileList"), data, 'GET');
}

function API_PledgeFinExpireDetaildownloadFileView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/viewContract"), data, 'POST', 2);
}

function API_PledgeFinExpireDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/downloadContract"), data, 'POST', 2, 'blob');
}

function API_PledgeFinExpireDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_PledgeFinExpireDetailrepaymentTrial(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/apply/repaymentTrial"), data, 'POST', 2);
}

function API_PledgeReplenList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/notice/list"), data, 'GET');
}

function API_PledgeReplenDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/").concat(data.noticeId, "/detail"), data, 'GET');
}

function API_PledgeReplenDetaildownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/view/").concat(data.contractFileId, "/downloadFile"), data, 'POST', 2, 'blob');
}

function API_PledgeReplenDetaildownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/view/").concat(data.noticeId, "/downloadZip"), data, 'POST', 2, 'blob');
}

function API_PledgeExchangeApplyXie(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/exchangeFileList"), data, 'GET');
}

function API_PledgeExchangeApplydownloadFileView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/viewContract"), data, 'POST', 2);
}

function API_PledgeExchangeApplydownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/downloadContract"), data, 'POST', 2, 'blob');
}

function API_PledgeExchangeApplydownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/apply/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_PledgeReplenApplyXie(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/apply/addGoodsFileList"), data, 'GET');
}

function API_PledgeReplenApplydownloadFileView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/apply/viewContract"), data, 'POST', 2);
}

function API_PledgeReplenApplydownloadFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/apply/downloadContract"), data, 'POST', 2, 'blob');
}

function API_PledgeReplenApplydownloadFileAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/apply/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_PledgeReplenApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/repay/save"), data, 'POST', 2);
}

function API_PledgeReplenAddSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/add/save"), data, 'POST', 2);
}

function API_AssetsGoodsModalFINList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/pledge/addgoods/inbound/list"), data, 'GET');
}

function API_PledgeExchangeAddSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pledge/exchange/save"), data, 'POST', 2);
}

function API_FinancingApplycompanyCredit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/assetCredit"), data, 'GET');
}

function API_FinancingCounterfoilApplyDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/billDetail"), data, 'GET');
}

function API_FinancingApplyXieyi(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/").concat(data.receivableId, "/financingApplyContractList"), data, 'GET');
}

function API_FinancingApplyAdvanceXieyi(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/coreCompany/apply/").concat(data.receivableId, "/financingApplyContractList"), data, 'GET');
}

function API_FinancingApplyXieyiView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/viewContract"), data, 'POST', 2);
}

function API_FinancingAdvanceApplyXieyiView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/viewContract"), data, 'POST', 2);
}

function API_FinancingCounterfoilApplyXieyiView(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/viewContract"), data, 'POST', 2);
}

function API_FinancingCounterfoilFileList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/contractList"), data, 'GET');
}

function API_FinancingApplyXieyiDown(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/downloadContract"), data, 'POST', 2, 'blob');
}

function API_FinancingAdvanceApplyXieyiDown(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/downloadContract"), data, 'POST', 2, 'blob');
}

function API_FinancingCounterfoilApplyXieyiDown(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/downloadContract"), data, 'POST', 2, 'blob');
}

function API_FinancingApplyXieyiDownAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_FinancingAdvanceApplyXieyiDownAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_FinancingCounterfoilApplyXieyiDownAll(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/downloadContractZip"), data, 'POST', 2, 'blob');
}

function API_FinancingApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/save"), data, 'POST', 2);
}

function API_FinancingApplySaveHN(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/financeSave"), data, 'POST', 2);
}

function API_FinancingAdvanceApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/save"), data, 'POST', 2);
}

function API_FinancingCounterApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/save"), data, 'POST', 2);
}

function API_FinancingCoreCompanyApplySave(data) {
  // 核心企业融资申请
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/coreCompany/apply/save"), data, 'POST', 2);
}

function API_FinancingSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/").concat(data.financingApplyId, "/unsignedContractList"), data, 'GET');
}

function API_FinancingAdvanceSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/").concat(data.financingApplyId, "/unsignedContractList"), data, 'GET');
}

function API_FinancingCounterfoilSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/").concat(data.financingApplyId, "/unsignedContractList"), data, 'GET');
}

function API_FinancingGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/supplierSignPdfHashList"), data, 'GET');
}

function API_FinancingAdvanceGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/coreCompanySignPdfHashList"), data, 'GET');
}

function API_FinancingCounterfoilGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/signPdfHashList"), data, 'GET');
}

function API_FinancingJRGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankSignPdfHashList"), data, 'GET');
}

function API_FinancingMAINGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/coreCompanySignPdfHashList"), data, 'GET');
}

function API_FinancingAdvanceMAINGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/coreCompanySignPdfHashList"), data, 'GET');
}

function API_FinancingAdvanceMGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/traderSignPdfHashList"), data, 'GET');
}

function API_FinancingSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/").concat(data.financingApplyId, "/supplierKeySign"), data, 'POST', 2);
}

function API_FinancingAdvanceSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/").concat(data.financingApplyId, "/coreCompanyKeySign"), data, 'POST', 2);
}

function API_FinancingCounterSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/").concat(data.financingApplyId, "/keySign"), data, 'POST', 2);
}

function API_FinancingJROnlySignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankAuditPass"), data, 'POST', 2);
}

function API_FinancingJRSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankKeySign"), data, 'POST', 2);
}

function API_FinancingMAINOnlySignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/coreCompanyAuditPass"), data, 'POST', 2);
}

function API_FinancingMAINSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/coreCompanyKeySign"), data, 'POST', 2);
}

function API_FinancingAdvanceMAINSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/coreCompanyKeySign"), data, 'POST', 2);
}

function API_FinancingAdvanceMSignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/traderKeySign"), data, 'POST', 2);
}

function API_FinancingAdvanceMOnlySignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/traderAuditPass"), data, 'POST', 2);
}

function API_FinancingAdvanceMAINOnlySignSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/coreCompanyAuditPass"), data, 'POST', 2);
}

function API_CfcaFinJRAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankAutoSign"), data, 'POST', 2);
}

function API_CfcaFinAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/").concat(data.financingApplyId, "/supplierAutoSign"), data, 'POST', 2);
}

function API_CfcaFinMAINAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/coreCompanyAutoSign"), data, 'POST', 2);
}

function API_CfcaFinAdvanceAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/coreCompanyAutoSign"), data, 'POST', 2);
}

function API_CfcaFinAdvanceMAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/traderAutoSign"), data, 'POST', 2);
}

function API_CfcaFinAdvanceMAINAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/").concat(data.financingApplyId, "/coreCompanyAutoSign"), data, 'POST', 2);
}

function API_CfcaCounterfoilMAINAutoSignature(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/").concat(data.financingApplyId, "/autoSign"), data, 'POST', 2);
}

function API_FinancingAudit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankAuditReject"), data, 'POST', 2);
}

function API_FinancingMAINAudit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/coreCompanyAuditReject"), data, 'POST', 2);
}

function API_FinancingAdvanceMAINAudit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/coreCompanyAuditReject"), data, 'POST', 2);
}

function API_FinancingAdvanceMAudit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/traderAuditReject"), data, 'POST', 2);
}

function API_FinancingSync(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pushAndSyncLoan"), data, 'POST', 2);
}

function API_FinancingJRSync(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/").concat(data.loanId, "/syncRepay"), data, 'POST', 2);
}

function API_FinancingAuditSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/").concat(data.financingApplyId, "/unsignedContractList"), data, 'GET');
}

function API_FinancingAdvanceAuditSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/pre/").concat(data.financingApplyId, "/unsignedContractList"), data, 'GET');
}

function API_FinancingAuditGetSigList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/audit/bankSignPdfHashList"), data, 'GET');
}

function API_FinancingListJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/auditedList"), data, 'GET');
}

function API_FinancingJiejuJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/").concat(data.loanId, "/loanBankDetail"), data, 'GET');
}

function API_FinancingListMAIN(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/auditedList"), data, 'GET');
}

function API_GetLoanList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/list"), data, 'GET');
}

function API_GetLoanListConfirm(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/receive/confirm/list"), data, 'GET');
}

function API_GetLoanListMAINCOUNT(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/countRepayType"), data, 'GET');
}

function API_GetLoanListAdvanceMAINCOUNT(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/countReceiveConfirm"), data, 'GET');
}

function API_GetAdvanceLoanList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/pre/list"), data, 'GET');
}

function API_goAdvanceLoanCheck(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/pre/validate/").concat(data.loanId), data, 'GET');
}

function API_GetLoanDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/").concat(data.loanId, "/financingLoanRepay"), data, 'GET');
}

function API_GetAdvanceLoanDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/pre/").concat(data.loanId, "/financingLoanRepay"), data, 'GET');
}

function API_GetLoanHuanDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/").concat(data.loanId, "/financingRepayRegister"), data, 'GET');
}

function API_GetLoanFangDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/").concat(data.loanId, "/financing/detail"), data, 'GET');
}

function API_GetLoanListJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/bankList"), data, 'GET');
}

function API_GetLoanListCounterfoil(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/bill/financing/list"), data, 'GET');
}

function API_GetLoanListJRFang(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/list/loan"), data, 'GET');
}

function API_GetLoanDetailListJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/queryLoanDetailList"), data, 'GET');
}

function API_ExportLoanDetailListJR(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/loanDetailList/export"), data, 'GET', 2, 'blob');
}

function API_ExportLoanDetailListMAIN(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/list/export"), data, 'GET', 2, 'blob');
} // 获取应收状态统计


var getFinancingStatistics = function getFinancingStatistics(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/counts"), data, 'GET');
}; // 获取预付状态统计


exports.getFinancingStatistics = getFinancingStatistics;

var getFinancingAdvanceStatistics = function getFinancingAdvanceStatistics(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/pre/apply/counts"), data, 'GET');
};

exports.getFinancingAdvanceStatistics = getFinancingAdvanceStatistics;

function API_LoanApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/applySave"), data, 'POST', 2);
}

function API_GetLoanApplyDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/apply/").concat(data.loanId), data, 'GET');
}

function API_GetLoanApplyReceipt(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/receive/confirm"), data, 'POST', 2);
}

function API_LoanApplySaveNS(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/repayPrincipal"), data, 'POST', 2);
}

function API_LoanAdvanceApplySave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/pre/applySave"), data, 'POST', 2);
}

function API_RepayAutoRepay(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/autoRepay/").concat(data.loanId), '', 'POST', 2);
}

function API_LoanFangSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/registerByAsset"), data, 'POST', 2);
}

function API_LoanHuanSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/register"), data, 'POST', 2);
}

function API_LoanZuofei(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/").concat(data.loanId, "/invalidLoanByAsset"), data, 'PUT', 2);
}

function API_AssetsUpdateTrain(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/genTrainTrack"), data, 'GET');
}

function API_AssetsUpdateShip(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/asset/receivable/genShipTrack"), data, 'GET');
}

function API_GetFinancingStatusTip(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/getStatusTip"), data, 'GET');
} // 华能云成放款登记


function API_FinancingLoanRegister(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/registerByApply"), data, 'POST', 2);
} // 华能云成还款登记


function API_FinancingRepayHnycRegister(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/repay/hnycRegister"), data, 'POST', 2);
} // 华能云成放款作废


function API_FinancingLoanInvalidLoanByApply(loanId) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/loan/").concat(loanId, "/invalidLoanByApply"), '', 'PUT', 2);
} // 华能云成融资纪录


function API_FinancingListHn(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/hnycList"), data, 'GET');
} // 票据融资纪录


function API_FinancingListCounterfoil(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/apply/bill/ListForLoan"), data, 'GET');
} // 额度列表


function API_CreditLinelList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/list"), data, 'GET');
} // 导出额度


function API_CreditLineExport(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/export"), data, 'GET', 2, 'blob');
} // 额度详情


function API_CreditLineDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/detail"), data, 'GET');
} // 额度启用停用数量


function API_CreditLineCount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/getCreditLineCount"), data, 'GET');
} // 获取资金类型


function API_GetBankProductList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/getBankProductItem"), data, 'GET');
} // 金融机构账号-核心企业-额度列表


function API_CoreCompanyCreditLinelList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/coreCompanyPage"), data, 'GET');
} // 金融机构账号-融资企业-额度列表


function API_TraderCreditLinelList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/creditLine/traderPage"), data, 'GET');
} // 获取台账总览信息


function API_LedgerSummary(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/summary"), data, 'GET');
} // 保理业务台账分页列表


function API_LedgerBusinessList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/businessDataPage"), data, 'GET');
} // 保理客户业务数据分页列表


function API_LedgerCustomerCreditLineList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/customerCreditLinePage"), data, 'GET');
} // 保理债务人额度数据分页列表


function API_LedgerDebtorCreditLineList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/debtorCreditLinePage"), data, 'GET');
} // 保理业务台账导出


function API_LedgerBusinessExport(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/businessDataExport"), data, 'GET', 1, 'blob');
} // 保理客户业务数据导出


function API_CustomerCreditLineExport(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/customerCreditLineExport"), data, 'GET', 1, 'blob');
} // 保理债务人额度数据导出


function API_DebtorCreditLineExport(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/financing/ledger/debtorCreditLineExport"), data, 'GET', 1, 'blob');
}