import ENV from '@/v2/config/env';

import request from '@/api/request';
// 提货申请列表
export function getOrderApplyList(data) {
	return request(`${ENV.BASE_GANG_API}/takeDeliveryApply/getPageList`, data, 'GET');
}

// 提货申请-保存提交修改
export function orderApplyItemEdit(data) {
	return request(`${ENV.BASE_GANG_API}/takeDeliveryApply/saveOrSubmitTakeDeliveryApply`, data, 'POST', 2);
}

// 合同列表查询
export const getContractList = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/getContractPage`, data, 'GET');
// 根据合同id查询合同详情
export const getContractDetailsById = data => request(`${ENV.BASE_GANG_API}/contract/getContractDetail`, data, 'GET');
// 根据合同id查询合同清单
export const getContractListById = data => request(`${ENV.BASE_GANG_API}/contract/getContractPageList`, data, 'GET');
// 开具提单第一步-提单申请列表查询
export const getTakeGoodsApplyList = data => request(`${ENV.BASE_GANG_API}/takeDelivery/getApplyPageList`, data, 'GET');
// 删除提货申请信息
export const deleteGoodsApplyItem = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/deleteApply`, data, 'DELETE');

// 转移提货
export const transferGoods = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/transferApply`, data, 'POST');
// 提货申请-保存、修改、直接提交
export const goodsApplySaveOrSubmit = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/saveOrSubmitTakeDeliveryApply`, data, 'POST', 2);
// 快速检索对手名称(卖方名称)
export const getSellNameList = data => request(`${ENV.BASE_GANG_API}/contract/getSellName`, data, 'GET');
// 合同详情
export const getConstractDetailsById = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/contractDetail`, data, 'GET');
/** 获取货转信息 */
export const getGoodsTransferDetail = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/goodsTransferDetail`, data, 'GET');
// 提货单查看详情
export const getShowTakeDeliveryInfo = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/getApplyDetail`, data, 'GET');

// 提货单-列表查询
export const getTakeDeliveryPageList = data => request(`${ENV.BASE_GANG_API}/takeDelivery/getTakeDeliveryPageList`, data, 'GET');
// 驳回状态 点作废按钮
export const rejectToVoid = data => request(`${ENV.BASE_GANG_API}/takeDelivery/rejectToVoid`, data, 'PUT');

// 仓储租赁-列表查询
export const warehouseContractList = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getPageList`, data, 'GET');
// 仓储租赁 删除
export const warehouseContractDelete = data => request(`${ENV.BASE_GANG_API}/warehouseContract/delete`, data, 'DELETE');

// 仓储租赁-先保存再 开启
export const warehouseContractStart = data => request(`${ENV.BASE_GANG_API}/warehouseContract/start`, data, 'PUT');

// 仓储租赁-先保存再 停用
export const warehouseContractStop = data => request(`${ENV.BASE_GANG_API}/warehouseContract/stop`, data, 'PUT');

// 仓库简称下拉
export const getStartByLessor = data => request(`${ENV.BASE_GANG_API}/warehouseContract/getStartByLessor`, data, 'GET');
// 查看该企业下制单员的信息
export const getMakePaperInfo = data => request(`${ENV.BASE_GANG_API}/takeDelivery/getMakePaperInfo`, data, 'GET');

// 提货单-预览
export const takeDeliveryPreview = data => request(`${ENV.BASE_GANG_API}/takeDelivery/preview`, data, 'POST', 2);
// 提货单-保存
export const takeDeliverySaveOrSubmit = data => request(`${ENV.BASE_GANG_API}/takeDelivery/saveOrSubmit`, data, 'POST', 2);
// 查看回款信息
export const findCollectionByContractNo = data =>
	request(`${ENV.BASE_GANG_API}/takeDelivery/findCollectionByContractId`, data, 'GET');
// 校验回款信息是否双签
export const checkCollection = data => request(`${ENV.BASE_GANG_API}/takeDelivery/checkCollection`, data, 'POST', 2);
// 提货单查看详情
export const showTakeDeliveryInfo = data => request(`${ENV.BASE_GANG_API}/takeDelivery/showTakeDeliveryInfo`, data, 'GET');
// 实提
export const realTake = data => request(`${ENV.BASE_GANG_API}/takeDelivery/realTake`, data, 'POST', 2);
// 已签约 的提单上传附件
export const uploadAttach = data => request(`${ENV.BASE_GANG_API}/takeDelivery/uploadAttach`, data, 'POST', 2);
// 添加回款（审核、待提交状态）
export const addCollection = data => request(`${ENV.BASE_GANG_API}/takeDelivery/addCollection`, data, 'POST', 2);
// 提货单-盖章[Ukey] step1
export const ukeySignature = data => request(`${ENV.BASE_GANG_API}/takeDelivery/ukeySignature`, data, 'POST', 2);
// 提货单-盖章[Ukey] step2
export const changeStatusAfterSign = data => request(`${ENV.BASE_GANG_API}/takeDelivery/changeStatusAfterSign`, data, 'GET');
// 提货单-企业盖章[托管]
export const autoSignature = data => request(`${ENV.BASE_GANG_API}/takeDelivery/autoSignature`, data, 'POST', 2);
// 验证是否关联采购合同
export const checkBusinessLine = data => request(`${ENV.BASE_GANG_API}/statement/businessLine/${data.contractNo}`, data, 'GET');
// 提货申请导出
export const takeDeliveryApplyExport = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/export`, data, 'GET', 1, 'blob');

// 提单列表导出
export const exportTakeDelivery = data => request(`${ENV.BASE_GANG_API}/takeDelivery/exportTakeDelivery`, data, 'GET', 1, 'blob');
// 开具提单第一步导出
export const exportFirstTakeExcel = data =>
	request(`${ENV.BASE_GANG_API}/takeDelivery/exportFirstTakeExcel`, data, 'GET', 1, 'blob');
// 提货申请-导出合同采购明细清单
export const exportContractPurchase = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/exportContractPurchase`, data, 'GET', 1, 'blob');
// 提货申请-导出货物清单
export const exportGoodsPurchase = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/exportGoodsTransferDetail`, data, 'GET', 1, 'blob');
// 提货申请-导出合同采购明细清单
export const templateDownload = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryApply/templateDownload`, data, 'GET', 1, 'blob');
// 提单-申请提货清单-导入
export const realTakeImport = data => request(`${ENV.BASE_GANG_API}/takeDelivery/realTakeImport`, data, 'GET', 1, 'blob');
// 实提模板下载
export const downloadRealTakeTemplate = data =>
	request(`${ENV.BASE_GANG_API}/takeDelivery/downloadRealTakeTemplate`, data, 'GET', 1, 'blob');
// 邮件信息展示
export const getMailInfo = data => request(`${ENV.BASE_GANG_API}/takeDelivery/getMailInfo`, data, 'GET');
// 发送邮件
export const sendMail = data => request(`${ENV.BASE_GANG_API}/takeDelivery/sendMail`, data, 'GET');
// 提单中货物清单导出
export const takePurchaseExport = data => request(`${ENV.BASE_GANG_API}/takeDelivery/takePurchaseExport`, data, 'GET', 1, 'blob');
// 导出-勾选的提单列表
export const exportSelectData = data => request(`${ENV.BASE_GANG_API}/takeDelivery/exportSelectData`, data, 'GET', 1, 'blob');

// 提单OA批量下载附件
export const batchDownload = data => request(`${ENV.BASE_GANG_API}/takeDelivery/batchDownload`, data, 'GET', 1, 'blob');
// 提单导出勾选的提货明细信息
export const takeSelectPurchaseExport = data =>
	request(`${ENV.BASE_GANG_API}/takeDelivery/takeSelectPurchaseExport`, data, 'GET', 1, 'blob');
// 提单OA附件列表
export const getBatchAttachList = data => request(`${ENV.BASE_GANG_API}/takeDelivery/getBatchAttachList`, data, 'GET');
// 提单作废之前检验
export const rejectBeforeCheck = data => request(`${ENV.BASE_GANG_API}/takeDelivery/rejectBeforeCheck`, data, 'PUT');
// 驳回提货申请
export const rejectTakeGoods = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/${data.id}/reject`, data, 'GET');
// 作废提货申请
export const invalidTakeGoods = data => request(`${ENV.BASE_GANG_API}/takeDeliveryApply/${data.id}/invalid`, data, 'GET');
/** 获取提单详情 */
// export const getShowTakeDeliveryInfo = (data) => request(`${ENV.BASE_GANG_API}/takeDelivery/showTakeDeliveryInfo`,data,"GET");
// 获取业务线列表
// 转移提货申请-查询业务线
export function API_GetCompanyBusinessLineList(data) {
	return request(`${ENV.BASE_GANG_API}/takeDeliveryApply/businessLineList`, data, 'GET');
}

// 转移提货申请
export function transferApply(data) {
	return request(
		`${ENV.BASE_GANG_API}/takeDeliveryApply/transferApply?id=${data.id}&businessLineFullNo=${data.businessLineFullNo}&companyUscc=${data.companyUscc}`,
		null,
		'POST',
		2
	);
}
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}

export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSteel`, data, 'POST');
}
// 提单 选择合同

export const getTakeOrderContractList = data => request(`${ENV.BASE_GANG_API}/takeDeliveryContract/contractPage`, data, 'get');
// 查询提单的业务线
export const getTakeDeliveryBusinessLineList = data => request(`${ENV.BASE_GANG_API}/takeDelivery/businessLineList`, data, 'get');
// 开具提单 获取合同详情
export const getTakeDeliveryContractDetail = data => request(`${ENV.BASE_GANG_API}/takeDelivery/contractDetail`, data, 'get');
// 导出合同提单货物明细
// 提货申请-导出合同采购明细清单
export const exportContractDetail = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryContract/exportContractDetail`, data, 'GET', 1, 'blob');
// 按合同开具-导出货物清单模板
export const exportPurchaseRel = data =>
	request(`${ENV.BASE_GANG_API}/takeDeliveryContract/exportPurchaseRel`, data, 'GET', 1, 'blob');
// 按合同开具-导入货物清单
export const importContractDetail = `${ENV.BASE_GANG_API}/takeDeliveryContract/importPurchaseRel`;
