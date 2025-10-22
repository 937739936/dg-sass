"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contractFinishApplyBusiness = exports.getUnDirectStreamTransInvoiceList = exports.getUnDirectStreamTradeInvoiceList = exports.getUnDirectStreamStatementList = exports.getUnDirectStreamPaymentList = exports.getUnDirectStreamGoodsTransferList = exports.getUnDirectStreamDeliverBatchList = exports.getUnDirectStreamContractDetail = exports.exportBankBusinessLine = exports.getBankBusinessLineList = exports.getDownstreamCollectionInfo = exports.getDownstreamFinanceList = exports.getUpstreamFinanceList = exports.getInvoiceNumCount = exports.getTransInvoiceList = exports.getDownstreamTradeInvoiceList = exports.getDownstreamTransInvoiceList = exports.getUpstreamTradeInvoiceList = exports.getUpstreamTransInvoiceList = exports.getTransStatementList = exports.getDownstreamStatementList = exports.getUpstreamStatementList = exports.getTransPaymentList = exports.getDownstreamPaymentList = exports.getUpstreamPaymentList = exports.getTransDeliverBatchList = exports.getDownstreamGoodsTransferList = exports.getDownstreamDeliverBatchList = exports.getUpstreamGoodsTransferList = exports.getUpstreamDeliverBatchList = exports.getBusinessLineTransContractDetail = exports.getBusinessLineDownstreamContractDetail = exports.getBusinessLineUpstreamContractDetail = exports.getBusinessLineRiskAlertList = exports.getCoreBusinessLineDetail = exports.downBusinessAttach = exports.submitSellFinish = exports.checkSellFinish = exports.submitBuyFinish = exports.checkBuyFinish = exports.removeBusinessLineCheck = exports.removeBusinessLine = exports.downAttachBusinessContract = exports.saveContractRel = exports.sellRelBuy = exports.contractVerify = exports.buyRelSell = exports.getNoLinkBusinessContractList = exports.getContractCount = exports.exportCoreBusinessLine = exports.getStatusCount = exports.getLinkBusinessList = exports.getCoreBusinessLineList = void 0;

var _env = _interopRequireDefault(require("@/v2/config/env"));

var _request = _interopRequireDefault(require("@/api/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 业务动态监控列表(核心企业)
var getCoreBusinessLineList = function getCoreBusinessLineList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/coreCompany/list"), data, 'POST', 2);
}; // 查询合同关联的业务线


exports.getCoreBusinessLineList = getCoreBusinessLineList;

var getLinkBusinessList = function getLinkBusinessList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/linkedBusinessLineList"), data, 'GET');
}; // 业务线各状态数量统计


exports.getLinkBusinessList = getLinkBusinessList;

var getStatusCount = function getStatusCount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/statusCount"), data, 'POST', 2);
}; // 业务动态监控列表导出Excel(核心企业)


exports.getStatusCount = getStatusCount;

var exportCoreBusinessLine = function exportCoreBusinessLine(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/coreCompany/export"), data, 'POST', 2, 'blob');
}; // 未关联业务线合同数量统计


exports.exportCoreBusinessLine = exportCoreBusinessLine;

var getContractCount = function getContractCount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/nogenerate/contractCount"), data, 'GET');
}; // 未关联业务线合同 列表


exports.getContractCount = getContractCount;

var getNoLinkBusinessContractList = function getNoLinkBusinessContractList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/nogenerate/contractList"), data, 'POST', 2);
}; // 采购合同关联销售合同校验


exports.getNoLinkBusinessContractList = getNoLinkBusinessContractList;

var buyRelSell = function buyRelSell(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/verify/buyRelSell"), data, 'POST', 2);
};

exports.buyRelSell = buyRelSell;

var contractVerify = function contractVerify(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/verify/relate"), data, 'POST', 2);
}; // 销售合同关联采购合同校验


exports.contractVerify = contractVerify;

var sellRelBuy = function sellRelBuy(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/verify/sellRelBuy"), data, 'POST', 2);
}; // 保存采销合同关系


exports.sellRelBuy = sellRelBuy;

var saveContractRel = function saveContractRel(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contractRel"), data, 'POST', 2);
}; // 一键下载附件合同


exports.saveContractRel = saveContractRel;

var downAttachBusinessContract = function downAttachBusinessContract(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/onlineContract/downAttach"), data, 'GET', 2, 'blob');
}; // 解除业务线


exports.downAttachBusinessContract = downAttachBusinessContract;

var removeBusinessLine = function removeBusinessLine(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contractRel/remove"), data, 'GET');
}; // 解除业务线检测


exports.removeBusinessLine = removeBusinessLine;

var removeBusinessLineCheck = function removeBusinessLineCheck(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/verifyContractRel/remove"), data, 'GET');
}; // 检测采购合同是否能完结


exports.removeBusinessLineCheck = removeBusinessLineCheck;

var checkBuyFinish = function checkBuyFinish(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/canBuyerSubmitAudit"), data, 'GET');
}; // 上游采购合同完结


exports.checkBuyFinish = checkBuyFinish;

var submitBuyFinish = function submitBuyFinish(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/buyer/submitAudit"), data, 'GET');
}; // 检测采购合同是否能完结


exports.submitBuyFinish = submitBuyFinish;

var checkSellFinish = function checkSellFinish(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/canSellerSubmitAudit"), data, 'GET');
}; // 上游采购合同完结


exports.checkSellFinish = checkSellFinish;

var submitSellFinish = function submitSellFinish(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/seller/submitAudit"), data, 'GET');
}; // 下载业务线附件


exports.submitSellFinish = submitSellFinish;

var downBusinessAttach = function downBusinessAttach(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/attachDownload"), data, 'POST', 2, 'blob');
};
/** 获取核心企业业务线详情 */


exports.downBusinessAttach = downBusinessAttach;

var getCoreBusinessLineDetail = function getCoreBusinessLineDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/coreCompany/detail"), data, 'GET');
};
/** 获取当前业务线 预警消息列表 */


exports.getCoreBusinessLineDetail = getCoreBusinessLineDetail;

var getBusinessLineRiskAlertList = function getBusinessLineRiskAlertList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/riskAlert/list"), data, 'GET');
};
/** 获取业务线下面的合同详情 */
// 采购


exports.getBusinessLineRiskAlertList = getBusinessLineRiskAlertList;

var getBusinessLineUpstreamContractDetail = function getBusinessLineUpstreamContractDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/contract/detail"), data, 'GET');
}; // 销售


exports.getBusinessLineUpstreamContractDetail = getBusinessLineUpstreamContractDetail;

var getBusinessLineDownstreamContractDetail = function getBusinessLineDownstreamContractDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/contract/detail"), data, 'GET');
}; // 运输


exports.getBusinessLineDownstreamContractDetail = getBusinessLineDownstreamContractDetail;

var getBusinessLineTransContractDetail = function getBusinessLineTransContractDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/detail"), data, 'GET');
}; // 发运信息 和 货转信息
// 上游发运信息


exports.getBusinessLineTransContractDetail = getBusinessLineTransContractDetail;

var getUpstreamDeliverBatchList = function getUpstreamDeliverBatchList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/deliverBatch/list"), data, 'GET');
}; // 上游货转信息


exports.getUpstreamDeliverBatchList = getUpstreamDeliverBatchList;

var getUpstreamGoodsTransferList = function getUpstreamGoodsTransferList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/goodsTransfer/list"), data, 'GET');
}; // 下游发运信息


exports.getUpstreamGoodsTransferList = getUpstreamGoodsTransferList;

var getDownstreamDeliverBatchList = function getDownstreamDeliverBatchList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/deliverBatch/list"), data, 'GET');
}; // 下游货转信息


exports.getDownstreamDeliverBatchList = getDownstreamDeliverBatchList;

var getDownstreamGoodsTransferList = function getDownstreamGoodsTransferList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/goodsTransfer/list"), data, 'GET');
}; // 运输合同-货物运输信息


exports.getDownstreamGoodsTransferList = getDownstreamGoodsTransferList;

var getTransDeliverBatchList = function getTransDeliverBatchList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/deliverBatch/list"), data, 'GET');
}; // 资金流水
// 上游资金流水信息


exports.getTransDeliverBatchList = getTransDeliverBatchList;

var getUpstreamPaymentList = function getUpstreamPaymentList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/payment/list"), data, 'GET');
}; // 下游资金流水信息


exports.getUpstreamPaymentList = getUpstreamPaymentList;

var getDownstreamPaymentList = function getDownstreamPaymentList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/businessLine/payment/list"), data, 'GET');
}; // 运输资金流水信息


exports.getDownstreamPaymentList = getDownstreamPaymentList;

var getTransPaymentList = function getTransPaymentList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/pay/list"), data, 'GET');
}; // 结算单
// 上游-结算单信息


exports.getTransPaymentList = getTransPaymentList;

var getUpstreamStatementList = function getUpstreamStatementList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/statement/list"), data, 'GET');
}; // 下游结算单列表


exports.getUpstreamStatementList = getUpstreamStatementList;

var getDownstreamStatementList = function getDownstreamStatementList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/statement/list"), data, 'GET');
}; // 运输合同结算单列表


exports.getDownstreamStatementList = getDownstreamStatementList;

var getTransStatementList = function getTransStatementList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/statement/list"), data, 'GET');
}; // 发票
// 游合同贸易发票列表


exports.getTransStatementList = getTransStatementList;

var getUpstreamTransInvoiceList = function getUpstreamTransInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/trans/invoice/list"), data, 'POST', 2);
}; // 上游合同贸易发票列表


exports.getUpstreamTransInvoiceList = getUpstreamTransInvoiceList;

var getUpstreamTradeInvoiceList = function getUpstreamTradeInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/trade/invoice/list"), data, 'POST', 2);
}; // 下游合同贸易发票列表


exports.getUpstreamTradeInvoiceList = getUpstreamTradeInvoiceList;

var getDownstreamTransInvoiceList = function getDownstreamTransInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/trans/invoice/list"), data, 'POST', 2);
}; // 下游合同运费发票列表


exports.getDownstreamTransInvoiceList = getDownstreamTransInvoiceList;

var getDownstreamTradeInvoiceList = function getDownstreamTradeInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/trade/invoice/list"), data, 'POST', 2);
}; // 运输合同-发票信息


exports.getDownstreamTradeInvoiceList = getDownstreamTradeInvoiceList;

var getTransInvoiceList = function getTransInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/invoice/list"), data, 'POST', 2);
}; // 获取发票数量


exports.getTransInvoiceList = getTransInvoiceList;

var getInvoiceNumCount = function getInvoiceNumCount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/invoice/numCount"), data, 'POST', 2);
}; // 融资
// 上游


exports.getInvoiceNumCount = getInvoiceNumCount;

var getUpstreamFinanceList = function getUpstreamFinanceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/upstream/finance/list"), data, 'GET');
}; // 下游


exports.getUpstreamFinanceList = getUpstreamFinanceList;

var getDownstreamFinanceList = function getDownstreamFinanceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/finance/list"), data, 'GET');
}; // 回款


exports.getDownstreamFinanceList = getDownstreamFinanceList;

var getDownstreamCollectionInfo = function getDownstreamCollectionInfo(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/downstream/collection/info"), data, 'GET');
}; // 金融机构
// 业务动态监控列表(金融机构)


exports.getDownstreamCollectionInfo = getDownstreamCollectionInfo;

var getBankBusinessLineList = function getBankBusinessLineList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/bank/list"), data, 'POST', 2);
}; // 业务动态监控列表导出Excel(金融机构)


exports.getBankBusinessLineList = getBankBusinessLineList;

var exportBankBusinessLine = function exportBankBusinessLine(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/bank/export"), data, 'POST', 2, 'blob');
}; // 非直接上下游合同详情


exports.exportBankBusinessLine = exportBankBusinessLine;

var getUnDirectStreamContractDetail = function getUnDirectStreamContractDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/contract/detail"), data, 'POST', 2);
}; // 非直接上下游发运信息


exports.getUnDirectStreamContractDetail = getUnDirectStreamContractDetail;

var getUnDirectStreamDeliverBatchList = function getUnDirectStreamDeliverBatchList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/deliverBatch/list"), data, 'POST', 2);
}; // 非直接上下游货转信息


exports.getUnDirectStreamDeliverBatchList = getUnDirectStreamDeliverBatchList;

var getUnDirectStreamGoodsTransferList = function getUnDirectStreamGoodsTransferList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/goodsTransfer/list"), data, 'POST', 2);
}; // 非直接上下游资金流水信息


exports.getUnDirectStreamGoodsTransferList = getUnDirectStreamGoodsTransferList;

var getUnDirectStreamPaymentList = function getUnDirectStreamPaymentList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/payment/list"), data, 'POST', 2);
}; // 非直接上下游结算单列表


exports.getUnDirectStreamPaymentList = getUnDirectStreamPaymentList;

var getUnDirectStreamStatementList = function getUnDirectStreamStatementList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/statement/list"), data, 'POST', 2);
}; // 非直接上下游合同贸易发票列表


exports.getUnDirectStreamStatementList = getUnDirectStreamStatementList;

var getUnDirectStreamTradeInvoiceList = function getUnDirectStreamTradeInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/trade/invoice/list"), data, 'POST', 2);
}; // 非直接上下游合同运费发票列表


exports.getUnDirectStreamTradeInvoiceList = getUnDirectStreamTradeInvoiceList;

var getUnDirectStreamTransInvoiceList = function getUnDirectStreamTransInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessLine/contract/trans/invoice/list"), data, 'POST', 2);
};

exports.getUnDirectStreamTransInvoiceList = getUnDirectStreamTransInvoiceList;

var contractFinishApplyBusiness = function contractFinishApplyBusiness(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/contractFinishApply"), data, 'POST', 2);
};

exports.contractFinishApplyBusiness = contractFinishApplyBusiness;