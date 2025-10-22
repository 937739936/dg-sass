'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.API_transport_contract_list = API_transport_contract_list;
exports.API_GETCURRENTENV = API_GETCURRENTENV;
exports.getTransferWarehouseList = getTransferWarehouseList;
exports.API_transport_settle_save = API_transport_settle_save;
exports.API_transport_settle_details = API_transport_settle_details;
exports.API_contractDetail = API_contractDetail;
exports.API_CANCELREASONSETTLE = API_CANCELREASONSETTLE;
exports.API_DOWNLPREVIEWTE = API_DOWNLPREVIEWTE;
exports.API_SubmitSettlementCancel = API_SubmitSettlementCancel;
exports.API_DownloadSettleFiles = API_DownloadSettleFiles;
exports.API_OFFLINEBUYERORDERDDOWNLOAD = API_OFFLINEBUYERORDERDDOWNLOAD;
exports.API_OFFLINESELLERORDERDDOWNLOAD = API_OFFLINESELLERORDERDDOWNLOAD;
exports.API_DownstreamContractUpload = exports.commonUpload = exports.API_ContractAttachFilesUpload = void 0;

var _env = _interopRequireDefault(require('@/v2/config/env'));

var _request = _interopRequireDefault(require('@/api/request'));

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

// 选择线下运输合同-分页列表
function API_transport_contract_list(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/terminal/statement/unify/contractPage'),
		data,
		'POST',
		2
	);
} // 上传

var API_ContractAttachFilesUpload = ''.concat(_env['default'].BASE_API, '/api/terminal/attachment/upload'); // 获取当前环境地址

exports.API_ContractAttachFilesUpload = API_ContractAttachFilesUpload;

function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + _env['default'].BASE_API + '/' + data;
}

var commonUpload = function commonUpload(data) {
	var t = Math.random();
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/terminal/attachment/upload?t=').concat(t),
		data,
		'POST',
		2
	);
}; // 获取仓库列表

exports.commonUpload = commonUpload;

function getTransferWarehouseList(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_STATION_API, '/api/station/transferWarehouse/list'),
		data,
		'GET'
	);
} // 业务监控--下游--核心企业、资方-上传下游合同附件

var API_DownstreamContractUpload = ''.concat(_env['default'].BASE_API, '/api/terminal/attachment/upload/single'); // 线下运输结算单-保存/提交

exports.API_DownstreamContractUpload = API_DownstreamContractUpload;

function API_transport_settle_save(data) {
	return (0, _request['default'])(''.concat(_env['default'].BASE_API, '/api/terminal/statement/unify/save'), data, 'POST', 2);
} // 线下运输结算单-详情

function API_transport_settle_details(data) {
	return (0, _request['default'])(''.concat(_env['default'].BASE_API, '/api/terminal/statement/unify/detail'), data, 'GET');
} // 合同详情

function API_contractDetail(data) {
	return (0, _request['default'])(''.concat(_env['default'].BASE_API, '/api/offlineContract/unifyContract/detail'), data, 'GET');
} // 取消结算单

function API_CANCELREASONSETTLE(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/statement/').concat(data.statementId, '/cancel'),
		data,
		'GET'
	);
} // 下载预览模板

function API_DOWNLPREVIEWTE(url, data) {
	return (0, _request['default'])(url, data, 'GET', 2, 'blob');
} // 提交结算单作废确认

function API_SubmitSettlementCancel(data) {
	return (0, _request['default'])(''.concat(_env['default'].BASE_API, '/api/statement/invalid/save'), data, 'POST', 2);
} // 线下结算单下载附件

function API_DownloadSettleFiles(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/terminal/statement/download'),
		data,
		'GET',
		1,
		'blob'
	);
} // 采购补录合同附件下载

function API_OFFLINEBUYERORDERDDOWNLOAD(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/offline/buyer/order/download'),
		data,
		'GET',
		1,
		'blob'
	);
} // 销售补录合同附件下载

function API_OFFLINESELLERORDERDDOWNLOAD(data) {
	return (0, _request['default'])(
		''.concat(_env['default'].BASE_API, '/api/offline/seller/order/download'),
		data,
		'GET',
		1,
		'blob'
	);
}
