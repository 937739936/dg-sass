"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_Save = API_Save;
exports.API_Submit = API_Submit;
exports.API_getlogisticsList = API_getlogisticsList;
exports.API_contractdetail = API_contractdetail;
exports.API_contractlist = API_contractlist;
exports.API_contractListExport = API_contractListExport;
exports.API_contractDetail = API_contractDetail;
exports.API_contractPay = API_contractPay;
exports.API_contractPayList = API_contractPayList;
exports.API_contractSettle = API_contractSettle;
exports.API_contractSettleList = API_contractSettleList;
exports.API_contractInvoice = API_contractInvoice;
exports.API_contractInvoiceList = API_contractInvoiceList;
exports.API_contractAttachList = API_contractAttachList;
exports.API_SettleSave = API_SettleSave;
exports.API_SettleVoid = API_SettleVoid;
exports.API_SettleDetail = API_SettleDetail;
exports.API_SettleList = API_SettleList;
exports.API_SettleListAmount = API_SettleListAmount;
exports.API_downloadAllTransContractAttachment = API_downloadAllTransContractAttachment;
exports.API_contract_delete = API_contract_delete;
exports.API_contract_Amount = API_contract_Amount;
exports.API_change_businessline = API_change_businessline;
exports.API_businessline_list = API_businessline_list;
exports.API_transport_contract_list = API_transport_contract_list;
exports.API_transport_settle_save = API_transport_settle_save;
exports.API_transport_settle_details = API_transport_settle_details;
exports.API_transport_settle_delete = API_transport_settle_delete;
exports.API_GETCAPITALSOURCE_TRANS = API_GETCAPITALSOURCE_TRANS;
exports.API_GETGOODSINFO_TRANS = API_GETGOODSINFO_TRANS;
exports.API_get_businessOwnerList = API_get_businessOwnerList;

var _env = _interopRequireDefault(require("@/v2/config/env"));

var _request = _interopRequireDefault(require("@/api/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 保存
function API_Save(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/tempSaveOrSubmit"), data, 'POST', 2);
} // 提交


function API_Submit(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/submit"), data, 'POST', 2);
} // 选择企业类型已认证为“物流企业”的公司


function API_getlogisticsList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/logisticsCompanyList"), data, 'get');
} // 详情


function API_contractdetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/logisticsCompanyList"), data, 'GET');
} // 列表


function API_contractlist(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/pageList"), data, 'POST', 2);
} // 列表导出


function API_contractListExport(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/exportExcel"), data, 'GET', 1, 'blob');
} // 合同详情


function API_contractDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/detail"), data, 'GET');
} // 物流合同付款统计


function API_contractPay(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/payType/statistics"), data, 'GET');
} // 物流合同付款列表


function API_contractPayList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/pay/list"), data, 'GET');
} // 物流合同结算统计


function API_contractSettle(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/statement/statistics"), data, 'GET');
} // 物流合同结算列表


function API_contractSettleList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/statement/list"), data, 'GET');
} // 物流合同发票统计


function API_contractInvoice(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/invoice/statistics"), data, 'GET');
} // 物流合同发票列表


function API_contractInvoiceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/invoice/list"), data, 'GET');
} // 物流合同其他附件列表


function API_contractAttachList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessMonitoring/trans/contract/attach/list"), data, 'GET');
} // 线下运输结算单-保存/提交


function API_SettleSave(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/saveTerminalTransStatement"), data, 'POST', 2);
} // 线下运输结算单-作废


function API_SettleVoid(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/invalid"), data, 'GET');
} // 线下运输结算单-详情


function API_SettleDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/getTerminalTransStatementDetail"), data, 'GET');
} // 线下运输结算单-列表


function API_SettleList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/page"), data, 'POST', 2);
} // 线下运输结算单-列表统计


function API_SettleListAmount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/countRestEachTabStateNum"), data, 'POST', 2);
} // 运输合同-一键下载


function API_downloadAllTransContractAttachment(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/batchDownLoad"), data, 'GET', 1, 'blob');
} // 线下运输合同删除


function API_contract_delete(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/delete"), data, 'GET');
} // 运输合同列表 数据统计


function API_contract_Amount(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/getStatisticsData"), data, 'POST', 2);
} // 修改业务线


function API_change_businessline(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/modifyBusinessLineNo"), data, 'POST', 2);
} // 业务线列表


function API_businessline_list(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/offlineContract/unifyContract/transContractRelPage"), data, 'GET');
} // 选择线下运输合同-分页列表


function API_transport_contract_list(data) {
  var path = '/api/terminal/statement/unify/contractPage';
  return (0, _request["default"])("".concat(_env["default"].BASE_API).concat(path), data, 'POST', 2);
} // 线下运输结算单-保存/提交


function API_transport_settle_save(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/save"), data, 'POST', 2);
} // 线下运输结算单-详情


function API_transport_settle_details(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/detail"), data, 'GET');
} // 线下运输结算单-删除


function API_transport_settle_delete(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/terminal/statement/unify/delete"), data, 'GET');
} // 运输合同付款查询资金来源


function API_GETCAPITALSOURCE_TRANS(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/paymentApply/trans/contract/capitalSource"), data, 'GET');
} // 查询货物信息


function API_GETGOODSINFO_TRANS(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/paymentApply/trans/contract/selectGoodsByPayType"), data, 'GET');
} // 运输合同获取业务负责人


function API_get_businessOwnerList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/businessOwnershipConfig/option"), data, 'GET');
}