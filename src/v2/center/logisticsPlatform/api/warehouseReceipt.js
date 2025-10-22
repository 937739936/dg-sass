import ENV from "@/v2/config/env";
import request from "@/api/request";

// 区块链列表 和区块链详情
export const getBlockChainDetail = (data) => request(`${ENV.BASE_API}/api/record/getById`,data,'GET');

export const getBlockChainList = (data) => request(`${ENV.BASE_API}/api/record/listByPage`,data,'GET');

export const downBlockChainCer = (data) => request(`${ENV.BASE_API}/api/record/downloadCert`,data,'GET',1, 'blob');




// 仓单管理协议列表
export const getWarehouseReceiptAgreementManageList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/page`,data,'POST',2);
// 仓单管理协议列表导出
export const exportWarehouseReceiptAgreementManageList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/page/export`,data,'POST',2, 'blob');
// 仓单管理协议列表附件下载
export const downloadWarehouseReceiptAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/download`,data,'GET',1, 'blob');
// 仓单管理协议-删除
export const delWarehouseReceiptAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/delete`,data,'GET');
// 仓单管理协议-详情
export const getWarehouseReceiptAgreementManageDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/detail`,data,'GET');
// 仓单管理协议-统计接口
export const getWarehouseReceiptAgreementManageStatistics = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/page/count`,data,'POST',2);
//仓单管理协议-确认/ 驳回/ 作废
export const handleWarehouseReceiptAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/audit`,data,'POST',2);






// 获取选择的仓储合同列表
export const getWarehouseReceiptLeaseContractList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/leaseContract/page`,data,'POST',2);
// 保存和提交仓单协议
export const saveOrSubmitWarehouseReceiptAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/saveOrSubmit`,data,'POST',2);
// 电子协议预览pdf下载
export const downloadPreviewWarehouseReceiptAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/previewPdf`,data,'POST',2, 'blob');
// 仓单管理协议盖章
export const getAgreementManageHashList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/ukey/getPDFHashList`,data,'GET');
// 仓单管理协议盖章
export const signSaveAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/ukey/signUpdate`,data,'GET');
// 仓单管理协议盖章
export const autoSignAgreementManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/agreement/auto/signature`,data,'GET');


// 仓单服务议列表
export const getWarehouseReceiptAgreementServeList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/page`,data,'POST',2);
// 仓单服务协议列表导出
export const exportWarehouseReceiptAgreementServeList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/page/export`,data,'POST',2, 'blob');
//仓单服务协议-确认/ 驳回/ 作废
export const handleWarehouseReceiptAgreementServe = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/audit`,data,'POST',2);
// 仓单服务协议-统计接口
export const getWarehouseReceiptAgreementServeStatistics = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/page/count`,data,'POST',2);
// 仓单服务协议列表附件下载
export const downloadWarehouseReceiptServeManage = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/download`,data,'GET',1, 'blob');
// 仓单服务协议-详情
export const getWarehouseReceiptAgreementServeDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/detail`,data,'GET');

// 仓单服务协议盖章
export const getAgreementServeHashList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/ukey/getPDFHashList`,data,'GET');
// 仓单服务协议盖章
export const signSaveAgreementServe = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/ukey/signUpdate`,data,'GET');
// 仓单服务协议盖章
export const autoSignAgreementServe = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/auto/signature`,data,'GET');
// 仓单服务协议-确认
export const confirmAgreementServe = (data) => request(`${ENV.BASE_STATION_API}/api/warehouse/receipt/service/agreement/confirm`,data,'POST', 2);



// 仓单开立
// 仓单开立列表
export const getWarehouseReceiptOpenList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/page`,data,'POST',2);
// 仓单开立获取统计
export const getWarehouseReceiptOpenStatic = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/countEachTabStateNum`,data,'POST',2);

// 仓单开立 选择入库记录列表
export const getWarehouseReceiptOpenInList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/selectInStorageInfo`,data,'POST',2);
// 选择合同列表
export const getWarehouseReceiptContractList = (data) => request(`${ENV.BASE_API}/api/warehouseReceipt/listContractByPage`,data,'POST',2);

// 查找指标
export const getIndex = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/indexInfo`,data,'POST',2);

// 选择合同列表详情
export const getWarehouseReceiptContractDetail = (data) => request(`${ENV.BASE_API}/api/warehouseReceipt/getContractInfo`,data,'GET');
// 根据销售合同-查询业务线信息
export const getWarehouseReceiptBusinessLineInfo= (data) => request(`${ENV.BASE_API}/api/warehouseReceipt/transfer/businessLineInfo`,data,'GET');

// 仓单开立详情
export const getWarehouseReceiptOpenDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/detail`,data,'GET');
// 仓单开立 删除
export const delWarehouseReceiptOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/delete`,data,'GET');

// 仓单开立附件一件下载
export const downloadWarehouseReceiptOpenFiles = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/download`,data,'GET',1, 'blob');
// 仓单开立审核（驳回、通过、作废）-仓储端
export const handleWarehouseReceiptOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/audit`,data,'POST',2);

// 仓单开立 获取统计
// 仓单开立盖章
export const getOpenHashList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/ukey/getPDFHashList`,data,'GET');
// 仓单开立盖章
export const signSaveOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/ukey/signUpdate`,data,'GeT');
// 仓单开立盖章
export const autoSingOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/auto/signature`,data,'GET');
// 仓单开立 选择仓储合同
export const getWarehouseReceiptOpenContractList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/warehouseContractPage`,data,'POST', 2);
// 仓单开立 申请保存和提交
export const saveOrSubmitWarehouseReceiptOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/saveOrUpdate`,data,'POST', 2);
// 仓单开立 pdf预览
export const previewWarehouseReceiptOpen = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/previewPdf`,data,'POST', 2);

// 仓单开立 获取最新的 仓储合同
export const getLatestWarehouseContract = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/issuanceApply/findLatestWarehouseContract`,data,'GET');


// 仓单过户查询列表
export const getWarehouseReceiptTransferList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/page`,data,'POST',2);
// 仓单过户 删除
export const delWarehouseReceiptTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/delete`,data,'GET');

// 仓单过户详情
export const getWarehouseReceiptTransferDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/detail`,data,'GET');
// 仓单过户 附件一键下载
export const downloadWarehouseReceiptTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/download`,data,'GET',1, 'blob');

// 仓单过户 操作
export const handleWarehouseReceiptTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/audit`,data,'POST', 2);

// 仓单过户 盖章
export const getTransferHashList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/ukey/getPDFHashList`,data,'GET');
// 仓单过户 盖章
export const signSaveTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/ukey/signUpdate`,data,'GET');
// 仓单过户 盖章
export const autoSingTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/auto/signature`,data,'GET');
// 仓单过户 操作
export const confirmWarehouseReceiptTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/confirm`,data,'POST', 2);
// 仓单过户 统计
export const getWarehouseReceiptTransferStatic = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/countEachTabStateNum`,data,'POST', 2);

// 仓单过户 - 根据选择的采购合同获取对应的仓单信息
export const getBuyContractTransferInfo = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/transferInfo`,data,'GET');
// 仓单过户-申请保存
export const saveOrUpdateWarehouseReceiptTransfer = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/transfer/saveOrUpdate`,data,'POST', 2);





























/// 仓单提货
/// 列表查询
export const API_getWarehouseReceiptDeliveryList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/page`,data,'POST',2);
// tab 数量
export const API_getWarehouseReceiptDeliveryStatistics = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/countEachTabStateNum`,data,'POST',2);

/// 保存提交
export const API_saveOrUpdateWarehouseReceiptDelivery = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/saveOrUpdate`,data,'POST',2);
/// 仓单提货信息-仓单列表信息
export const API_getWarehouseReceiptDeliveryInfo = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/deliveryInfo`,data,'GET');
/// 仓单提货详情
export const API_warehouseReceiptDeliveryDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/detail`,data,'GET');


/// 无仓单提货申请审核
export const API_deliveryAudit_noReceipt = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/noWarehouseReceipt/audit`,data,'POST',2);
/// 仓单提货申请审核
export const API_deliveryAudit_receipt = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/warehouseCompany/audit`,data,'POST',2);
/// 仓单提货信息-删除
export const API_warehouseReceiptDelete = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/delete`,data,'GET');
/// 仓单提货信息-作废
// export const API_warehouseReceiptCancel = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/cancel`,data,'GET');
/// 仓单提货-查询操作记录
export const API_warehouseReceiptOperationLog = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/list/operation/log`,data,'GET');

// 
// 一键下载附件 ( type = 1:提货附件 、2:待盖章仓单附件)
export const API_warehouseReceiptDeliveryDownload = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/download`,data,'GET',1, 'blob');

// 仓单提货 盖章
export const API_deliveryUKeyGetPDFHashList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/ukey/getPDFHashList`,data,'GET');
export const API_deliveryUKeySignUpdate = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/ukey/signUpdate`,data,'GET');
export const API_deliveryAutoSignature = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/delivery/auto/signature`,data,'GET');

/// 仓单查询
/// 仓单-列表查询
export const API_getWarehouseReceiptList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/page`,data,'POST',2);
// 状态提示
export const API_warehouseReceiptStatusTip = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/statusTip`,data,'GET');
// tab统计数量
export const API_getWarehouseReceiptStatistics = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/countEachTabStateNum`,data,'POST',2);
// 列表导出
export const API_exportWarehouseList = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/exportExcel`,data,'POST',2, 'blob');
// 数量提示
export const API_getWarehouseReceiptQuantityTip = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/getQuantityTip`,data,'GET');
// 详情
export const API_getWarehouseReceiptDetail = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/detail`,data,'GET');
// 流转信息
export const API_warehouseReceiptGetInformationFlow = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/getInformationFlow`,data,'GET');
// 仓单详情-附件下载
export const API_warehouseReceiptDownload = (data) => request(`${ENV.BASE_STATION_API}/api/warehouseReceipt/download`,data,'GET',1, 'blob');

