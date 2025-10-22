const fileDownload = [
	// 需要取后端content-disposition中文件名称的url
	'/dg-trade-api/api/businessMonitoring/dowan/attach',
	'/dg-trade-api/api/mine/part/download',
	'/dg-trade-api/api/offline/buyer/order/download',
	'/dg-trade-api/api/offline/seller/order/download',
	'/dg-trade-api/api/lading/batchDownload',
	'/dg-trade-api/api/receipt/batchDownload',
	'/dg-station-api/api/trucking/order/export',
	'/dg-station-api/api/shortPlan/scale/export',
	'/dg-trade-api/api/goodsTransfer/batchDownload',
	'/dg-steel-api/goodstransfer/batchDownload',
	'/dg-trade-api/api/statement/download',
	'/dg-trade-api/api/common/batchDownload', // 批量下载
	'/dg-trade-api/api/terminal/statement/download',
	'/dg-trade-api/api/businessMonitoring/attachDownload',
	'/dg-trade-api/api/settlementAgreement/downloadFile',
	'/dg-trade-api/api/offlineContract/downloadSingleTypeFile',
	'/dg-trade-api/api/offlineContract/download',
	'/dg-trade-api/api/order/common/downloadContractRelatedAllAttachment',
	'/dg-trade-api/api/offlineContract/downloadContractRelatedAllAttachment',
	'/dg-trade-api/api/supplementalAgreement/download',
	'/dg-trade-api/api/supplementalAgreement/downloadAll',
	'/dg-station-api/api/station/lease/contract/downloadAttachmentById',
	'/dg-station-api/api/warehouse/receipt/agreement/download',
	'/dg-station-api/api/warehouseReceipt/issuanceApply/download',
	'/dg-station-api/api/warehouse/receipt/service/agreement/download',
	'/dg-station-api/api/warehouseReceipt/transfer/download',
	'/dg-station-api/api/warehouse/receipt/agreement/previewPdf',
	'/dg-station-api/api/warehouseReceipt/download',
	'/dg-station-api/api/warehouseReceipt/delivery/download',

	'/dg-station-api/api/station/supervisor/report/batch/download',
	'/dg-station-api/api/storage/manage/record/page/by/contract/no/excel',
	'/dg-trade-api/api/lading/exportExcel',
	'/dg-trade-api/api/lading/download', //提货单详情 下载指定文件
	'/dg-trade-api/api/receipt/download', //收货详情 下载指定文件
	'/dg-station-api/api/inventory/manager/inventory/management/businessLine/export',
	'/dg-station-api/api/inventory/manager/inventory/management/echarts/export',
	'/dg-station-api/api/inventory/manager/inventory/management/businessLine/echarts/export',
	'/dg-station-api/api/inventory/task/page/excel',
	'/dg-trade-api/api/serviceFee/download', // 服务费管理下载
	'/dg-trade-api/api/financing/ledger/businessDataExport',
	'/dg-trade-api/api/financing/ledger/customerCreditLineExport',
	'/dg-trade-api/api/financing/ledger/debtorCreditLineExport',
	'/dg-trade-api/api/paymentInfo/paymentList/export', // 付款管理列表导出
	'/dg-trade-api/api/receiveInfo/paymentList/export', // 收款管理列表导出
	'/dg-trade-api/api/paymentCreate/check/checkResult/export', // 付款管理-校验列表导出
	'/dg-trade-api/api/paymentInfo/downloadPaymentAttach', // 付款管理-下载附件
	'/dg-trade-api/api/businessMonitoring/onlineContract/downAttach', // 业务线详情一键下载附件合同
	'/dg-trade-api/api/fullBusinessLine/detail/attach/download', // 数据监控-业务动态监控下游合同打包下载
];

/**
 * @desc 遍历需要从httpHeader中取得的文件名，并把文件名解析添加到返回的response结构中
 * @function
 * @params {Object} http response
 * @return {Object} 返回处理后的response
 */

export default function (response) {
	// 二进制流文件下载
	if (fileDownload.includes(response.config.url)) {
		const contentDisposition = response.headers['content-disposition'] || 'filename=文件';
		const fileName = contentDisposition.split('=')[1].replace(/(^")|("$)/g, '');
		response.data = { data: response.data, name: decodeURI(fileName) };
	}
	return response;
}
