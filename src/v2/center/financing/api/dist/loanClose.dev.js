"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settlementAgreementSealSyncHandle = exports.getSignHashList = exports.autoSignLoanClose = exports.getSignList = exports.settlementAgreement = exports.getUnClearStatic = exports.getUnClearList = exports.getLoanCloseDetail = exports.invalidLoanClose = exports.downloadLoanCloseFile = exports.getLoanCloseStatistics = exports.getLoanCloseList = void 0;

var _env = _interopRequireDefault(require("@/v2/config/env"));

var _request = _interopRequireDefault(require("@/api/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 结清协议-分页列表
var getLoanCloseList = function getLoanCloseList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/pageSettlementAgreement"), data, 'GET');
}; // 结清协议-分页列表-各tab页数据统计


exports.getLoanCloseList = getLoanCloseList;

var getLoanCloseStatistics = function getLoanCloseStatistics(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/countEachTabStateNum"), data, 'GET');
}; // 结清协议-（批量）下载


exports.getLoanCloseStatistics = getLoanCloseStatistics;

var downloadLoanCloseFile = function downloadLoanCloseFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/downloadFile"), data, 'POST', 2, 'blob');
}; // 结清协议-（批量）作废


exports.downloadLoanCloseFile = downloadLoanCloseFile;

var invalidLoanClose = function invalidLoanClose(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/invalidSettlementAgreement"), data, 'POST', 2);
}; // 获取详情


exports.invalidLoanClose = invalidLoanClose;

var getLoanCloseDetail = function getLoanCloseDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/getDetail"), data, 'GET');
}; // 获取未结清的数据


exports.getLoanCloseDetail = getLoanCloseDetail;

var getUnClearList = function getUnClearList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/pageFinancingApply"), data, 'GET');
}; // 获取未结清的数据-统计


exports.getUnClearList = getUnClearList;

var getUnClearStatic = function getUnClearStatic(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/countRestFinancingApplyEachTabStateNum"), data, 'GET');
}; // 生成结清协议


exports.getUnClearStatic = getUnClearStatic;

var settlementAgreement = function settlementAgreement(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/generateSettlementAgreement"), data, 'GET');
}; // 获取盖章文件


exports.settlementAgreement = settlementAgreement;

var getSignList = function getSignList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/listToSealFile"), data, 'POST', 2);
}; // 托管盖章


exports.getSignList = getSignList;

var autoSignLoanClose = function autoSignLoanClose(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/cfca/settlementAgreementAutoSignature"), data, 'POST', 2);
};

exports.autoSignLoanClose = autoSignLoanClose;

var getSignHashList = function getSignHashList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/cfca/settlementAgreement/getToSigList"), data, 'POST', 2);
}; // 通用盖章处理


exports.getSignHashList = getSignHashList;

var settlementAgreementSealSyncHandle = function settlementAgreementSealSyncHandle(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_API, "/api/settlementAgreement/settlementAgreementSealSyncHandle"), data, 'POST', 2);
};

exports.settlementAgreementSealSyncHandle = settlementAgreementSealSyncHandle;