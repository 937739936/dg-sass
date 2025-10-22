"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWpsFileList = getWpsFileList;
exports.copyWpsFile = copyWpsFile;
exports.moveWpsFile = moveWpsFile;
exports.createWpsFile = createWpsFile;
exports.renameWpsFile = renameWpsFile;
exports.shareWpsInfo = shareWpsInfo;
exports.shareHistoryWps = shareHistoryWps;
exports.shareListWps = shareListWps;
exports.wpsFileLink = wpsFileLink;
exports.deleteWpsFile = deleteWpsFile;
exports.checkWhetherPushWps = checkWhetherPushWps;
exports.downloadCloudDoc = downloadCloudDoc;
exports.API_isExistFolderWps = API_isExistFolderWps;
exports.getEffectiveMaxDate = exports.getFilterItem = exports.getMarketPriceDetail = exports.getMarketPriceList = exports.wpsFileUpload = void 0;

var _env = _interopRequireDefault(require("@/v2/config/env"));

var _request = _interopRequireDefault(require("@/api/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 获取文件列表
function getWpsFileList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/page"), data, 'GET');
} // 复制


function copyWpsFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/copy/").concat(data.id), data, 'GET');
} // 移动


function moveWpsFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/move/").concat(data.id), data, 'GET');
} // 创建文件文件夹


function createWpsFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file"), data, 'POST', 2);
} // 重命名


function renameWpsFile(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/rename/").concat(data.id), data, 'GET');
} // 分享文件


function shareWpsInfo(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/shareLink"), data, 'POST', 2);
} // 分享历史


function shareHistoryWps(id) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/shareHistory/").concat(id), '', 'GET');
} // 分享用户列表


function shareListWps(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/user/shareList"), data, 'GET');
} // iframe链接


function wpsFileLink(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/fileLink/").concat(data.id), data, 'GET');
} // 删除文件、文件夹


function deleteWpsFile(id) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/").concat(id), '', 'DELETE');
} // 上传文件


var wpsFileUpload = "".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/upload"); // 鉴权

exports.wpsFileUpload = wpsFileUpload;

function checkWhetherPushWps(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/user/checkWhetherPush"), data, 'GET');
} // 下载文件


function downloadCloudDoc(id) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/download/").concat(id), '', 'GET', 1, 'blob');
} // 判断当前云表格是否有文件夹


function API_isExistFolderWps(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/cloudDoc/file/isExistFolder"), data, 'GET');
}
/** 盯市管理 */


var getMarketPriceList = function getMarketPriceList(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/marketPrice/getPage"), data, 'GET');
};
/** 盯市管理详情 */


exports.getMarketPriceList = getMarketPriceList;

var getMarketPriceDetail = function getMarketPriceDetail(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/marketPrice/chart"), data, 'GET');
}; //盯市根据区域和钢材重量查询品名和钢厂产地


exports.getMarketPriceDetail = getMarketPriceDetail;

var getFilterItem = function getFilterItem(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/marketPrice/getFilterItem"), data, 'GET');
}; //获取最大有效日期


exports.getFilterItem = getFilterItem;

var getEffectiveMaxDate = function getEffectiveMaxDate(data) {
  return (0, _request["default"])("".concat(_env["default"].BASE_GANG_API, "/api/marketPrice/getEffectiveMaxDate"), data, 'GET');
};

exports.getEffectiveMaxDate = getEffectiveMaxDate;