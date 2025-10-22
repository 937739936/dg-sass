import ENV from '@/v2/config/env';
import request from '@/api/request';
// 业务动态监控列表(核心企业)
export const getCoreBusinessLineList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/list`, data, 'POST', 2);

// 查询合同关联的业务线
export const getLinkBusinessList = data => request(`${ENV.BASE_API}/api/businessLine/linkedBusinessLineList`, data, 'GET');

// 业务线各状态数量统计
export const getStatusCount = data => request(`${ENV.BASE_API}/api/businessMonitoring/statusCount`, data, 'POST', 2);
// 业务动态监控列表导出Excel(核心企业)
export const exportCoreBusinessLine = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/export`, data, 'POST', 2, 'blob');
// 未关联业务线合同数量统计
export const getContractCount = data => request(`${ENV.BASE_API}/api/businessMonitoring/nogenerate/contractCount`, data, 'GET');
// 未关联业务线合同 列表
export const getNoLinkBusinessContractList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/nogenerate/contractList`, data, 'POST', 2);

export const contractVerify = data => request(`${ENV.BASE_API}/api/businessLine/verify/relate`, data, 'POST', 2);

// 保存采销合同关系
export const saveContractRel = data => request(`${ENV.BASE_API}/api/businessLine/contractRel`, data, 'POST', 2);
// 一键下载附件合同
export const downAttachBusinessContract = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/onlineContract/downAttach`, data, 'GET', 2, 'blob');

// 解除业务线
export const removeBusinessLine = data => request(`${ENV.BASE_API}/api/businessLine/contractRel/remove`, data, 'GET');
// 解除业务线检测
export const removeBusinessLineCheck = data => request(`${ENV.BASE_API}/api/businessLine/verifyContractRel/remove`, data, 'GET');
// 检测采购合同是否能完结
export const checkBuyFinish = data => request(`${ENV.BASE_API}/api/businessMonitoring/canBuyerSubmitAudit`, data, 'GET');
// 上游采购合同完结
export const submitBuyFinish = data => request(`${ENV.BASE_API}/api/businessMonitoring/buyer/submitAudit`, data, 'GET');
// 检测采购合同是否能完结
export const checkSellFinish = data => request(`${ENV.BASE_API}/api/businessMonitoring/canSellerSubmitAudit`, data, 'GET');
// 上游采购合同完结
export const submitSellFinish = data => request(`${ENV.BASE_API}/api/businessMonitoring/seller/submitAudit`, data, 'GET');
// 下载业务线附件
export const downBusinessAttach = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/attachDownload`, data, 'POST', 2, 'blob');

/** 获取核心企业业务线详情 */
export const getCoreBusinessLineDetail = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/detail`, data, 'GET');

/** 获取当前业务线 预警消息列表 */
export const getBusinessLineRiskAlertList = data => request(`${ENV.BASE_API}/api/businessMonitoring/riskAlert/list`, data, 'GET');

/** 获取业务线下面的合同详情 */
// 采购
export const getBusinessLineUpstreamContractDetail = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/contract/detail`, data, 'GET');
// 销售
export const getBusinessLineDownstreamContractDetail = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/contract/detail`, data, 'GET');
// 运输
export const getBusinessLineTransContractDetail = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/detail`, data, 'GET');

// 发运信息 和 货转信息
// 上游发运信息
export const getUpstreamDeliverBatchList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/deliverBatch/list`, data, 'GET');
// 上游货转信息
export const getUpstreamGoodsTransferList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/goodsTransfer/list`, data, 'GET');
// 下游发运信息
export const getDownstreamDeliverBatchList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/list`, data, 'GET');
// 下游货转信息
export const getDownstreamGoodsTransferList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/goodsTransfer/list`, data, 'GET');
// 运输合同-货物运输信息
export const getTransDeliverBatchList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/deliverBatch/list`, data, 'GET');

// 资金流水
// 上游资金流水信息
export const getUpstreamPaymentList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/list`, data, 'GET');
// 下游资金流水信息
export const getDownstreamPaymentList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/businessLine/payment/list`, data, 'GET');
// 运输资金流水信息
export const getTransPaymentList = data => request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/pay/list`, data, 'GET');

// 结算单
// 上游-结算单信息
export const getUpstreamStatementList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/statement/list`, data, 'GET');
// 下游结算单列表
export const getDownstreamStatementList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/statement/list`, data, 'GET');
// 运输合同结算单列表
export const getTransStatementList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/statement/list`, data, 'GET');

// 发票
// 游合同贸易发票列表
export const getUpstreamTransInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trans/invoice/list`, data, 'POST', 2);
// 上游合同贸易发票列表
export const getUpstreamTradeInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trade/invoice/list`, data, 'POST', 2);

// 下游合同贸易发票列表
export const getDownstreamTransInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trans/invoice/list`, data, 'POST', 2);
// 下游合同运费发票列表
export const getDownstreamTradeInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trade/invoice/list`, data, 'POST', 2);
// 运输合同-发票信息
export const getTransInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/trans/contract/invoice/list`, data, 'POST', 2);
// 获取发票数量
export const getInvoiceNumCount = data => request(`${ENV.BASE_API}/api/businessMonitoring/invoice/numCount`, data, 'POST', 2);

// 融资
// 上游
export const getUpstreamFinanceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/upstream/finance/list`, data, 'GET');
// 下游
export const getDownstreamFinanceList = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/finance/list`, data, 'GET');

// 回款
export const getDownstreamCollectionInfo = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/downstream/collection/info`, data, 'GET');

// 金融机构
// 业务动态监控列表(金融机构)
export const getBankBusinessLineList = data => request(`${ENV.BASE_API}/api/businessMonitoring/bank/list`, data, 'POST', 2);
// 业务动态监控列表导出Excel(金融机构)
export const exportBankBusinessLine = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/bank/export`, data, 'POST', 2, 'blob');

// 非直接上下游合同详情
export const getUnDirectStreamContractDetail = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/contract/detail`, data, 'POST', 2);
// 非直接上下游发运信息
export const getUnDirectStreamDeliverBatchList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/deliverBatch/list`, data, 'POST', 2);
// 非直接上下游货转信息
export const getUnDirectStreamGoodsTransferList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/goodsTransfer/list`, data, 'POST', 2);
// 非直接上下游资金流水信息
export const getUnDirectStreamPaymentList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/payment/list`, data, 'POST', 2);
// 非直接上下游结算单列表
export const getUnDirectStreamStatementList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/statement/list`, data, 'POST', 2);
// 非直接上下游合同贸易发票列表
export const getUnDirectStreamTradeInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/trade/invoice/list`, data, 'POST', 2);
// 非直接上下游合同运费发票列表
export const getUnDirectStreamTransInvoiceList = data =>
	request(`${ENV.BASE_API}/api/businessLine/contract/trans/invoice/list`, data, 'POST', 2);

export const contractFinishApplyBusiness = data =>
	request(`${ENV.BASE_API}/api/businessMonitoring/contractFinishApply`, data, 'POST', 2);