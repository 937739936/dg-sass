import ENV from '@/v2/config/env';
import request from '@/api/request';

// 仓储中心合同列表
export function API_GrainContractPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/page`, data, 'GET');
}

// 仓储中心上传
// export const API_UPLOAD_GRAIN = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;
export const API_UPLOAD_GRAIN = `${ENV.BASE_GRAIN_API}/common/uploadAndWaterMark`;

//站台通用接口上传
export const API_UPLOAD_STATION = `${ENV.BASE_STATION_API}/common/upload`;

// 入库商品详情
export function API_WarehousePutDetail(id) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/${id}`, '', 'GEt');
}

// 出库商品详情
export function API_WarehouseOutDetail(id) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/${id}`, '', 'GEt');
}

// 保存出库附件
export function API_WarehousePutAttachmentSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/attachment/save`, data, 'POST', 2);
}

// 删除出库附件
export function API_WarehousePutAttachmentDel(fileId) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/attachment/${fileId}/del`, '', 'GET');
}

// 保存入库附件
export function API_WarehouseOutAttachmentSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/attachment/save`, data, 'POST', 2);
}

// 删除入库附件
export function API_WarehouseOutAttachmentDel(fileId) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/attachment/${fileId}/del`, '', 'GET');
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 泰州港-入港信息详情
export function API_getWarehouseHarborInGet(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/get`, data, 'GET');
}
// 泰州港-新增入港
export function API_postWarehouseHarborInInsert(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/insert`, data, 'POST');
}
// 泰州港-更新入港
export function API_postWarehouseHarborInUpdate(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/update`, data, 'POST');
}
// 泰州港-删除入港
export function API_postWarehouseHarborInDelete(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/delete`, data, 'POST');
}
// 泰州港-新增出港
export function API_postWarehouseHarborOutInsert(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/out/insert`, data, 'POST');
}
// 泰州港-更新出港
export function API_postWarehouseHarborOutUpdate(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/out/update`, data, 'POST');
}
// 泰州港-删除出港
export function API_postWarehouseHarborOutDelete(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/out/delete`, data, 'POST');
}
// 泰州港-出入场登记列表
export function API_getWarehouseHarborListTz(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/list/tz`, data, 'GET');
}
// 泰州港-出场登记分页列表
export function API_getWarehouseHarborOutListPage(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/out/listPage`, data, 'GET');
}
// 泰州港-我的仓储-统计信息
export function API_getWarehouseHarborGetMyWarehouseStatistic(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/getMyWarehouseStatistic`, data, 'GET');
}
// 泰州港-我的仓储-出入场列表
export function API_getWarehouseHarborMyListTzInOut(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/list/tz/inOut`, data, 'GET');
}
// 泰州港-我的仓储-入港信息
export function API_getWarehouseHarborInListPage(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/in/listPage`, data, 'GET');
}
// 泰州港-我的仓储-出港信息
export function API_getWarehouseHarborMyListTzOut(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/list/tz/out`, data, 'GET');
}
// 泰州港-我的仓储导出-出入场
export function API_getWarehouseHarborMyInOutExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/inOut/exportXls`, data, 'GET', 1, 'blob');
}
// 泰州港-我的仓储导出-入场
export function API_getWarehouseHarborMyInExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/in/exportXls`, data, 'GET', 1, 'blob');
}
// 泰州港-我的仓储导出-出场
export function API_getWarehouseHarborMyOutExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/my/out/exportXls`, data, 'GET', 1, 'blob');
}
// 泰州港-存货量
export function API_getWarehouseHarborInventoryListTz(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/inventory/list/tz`, data, 'GET');
}

// 曹妃甸-入场列表
export function API_getWarehouseHarborInListHncf(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/in/listHncf`, data, 'GET');
}
// 曹妃甸-出场列表
export function API_getWarehouseHarborOutListHncf(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/out/listHncf`, data, 'GET');
}
// 曹妃甸-华能曹妃港口方库存列表
export function API_getWarehouseHarborInventoryListHncf(data, harborType) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/inventory/list/hncf/${harborType}`, data, 'GET');
}
// 曹妃甸-新增出港
export function API_postWarehouseHarborHncfOutInsert(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/out/insert`, data, 'POST', 2);
}
// 曹妃甸-入场详情
export function API_getWarehouseHarborHncfListHncfIn(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/listHncfIn`, data, 'GET');
}
// 曹妃甸-出场详情
export function API_getWarehouseHarborHncfListHncfOut(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/listHncfOut`, data, 'GET');
}
// 曹妃甸-库存详情
export function API_getWarehouseHarborHncfListHncfStore(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/listHncfStore`, data, 'GET');
}
// 曹妃甸-库存详情导出
export function API_getWarehouseHarborHncfStoreInventoryExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/inventory/exportXls`, data, 'GET', 1, 'blob');
}
// 曹妃甸-入场详情导出
export function API_getWarehouseHarborHncfStoreInExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/in/exportXls`, data, 'GET', 1, 'blob');
}
// 曹妃甸-出场详情导出
export function API_getWarehouseHarborHncfStoreOutExportXls(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/out/exportXls`, data, 'GET', 1, 'blob');
}
// 曹妃甸-库存统计
export function API_getWarehouseHarborHncfStoreGetMyWarehouseStatistic(data) {
	return request(`${ENV.BASE_API}/api/warehouse/harbor/hncf/store/getMyWarehouseStatistic`, data, 'GET');
}
// 模糊查询核心企业
export function API_getCompanyProfileListCoreCompanyByName(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/listCoreCompanyByName`, data, 'GET');
}

// 盖章时查询确认单附件地址
export function API_GrainConfirmationShipInfo(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/seal/info`, data, 'GET');
}

// 仓储or仓储企业盖章[Ukey]
export function API_GrainConfirmationShipUkey(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data.id}/seal/ukey`, data, 'GET');
}

// 仓储or仓储企业盖章[托管]
export function API_GrainConfirmationShipAuto(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/seal/auto`, '', 'GET');
}

// 仓储企业签章并提交核心企业确认
export function API_GrainConfirmationSealToConfirm(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/sealToConfirm`, data, 'POST', 2);
}

// 核心企业盖章并提交确认
export function API_GrainConfirmationConfirm(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/confirm`, data, 'POST', 2);
}

// 合同归档
export function API_GrainContractArchive(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data}/archive`, '', 'GET');
}

// 仓储中心合同详情
export function API_GrainContractDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data}/detail`, '', 'GET');
}

// 新增合同
export function API_GrainContractSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/save`, data, 'POST', 2);
}

// 获取卖方[仓储企业]列表
export function API_GrainStorageCompanyList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/storageCompany`, data, 'GET');
}

// 获取仓储企业获取对应入库记录
export function API_GrainGetListByStorageCompany(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/getListByStorageCompany`, data, 'GET');
}

// 合同确认单开具
export function API_GrainConfirmationShipAdd(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/add`, data, 'POST', 2);
}

// 核心企业根据仓房id获取预警信息
export function API_GrainSituationGetCoreCompanyEarlyWarning(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getCoreCompanyEarlyWarning`, data, 'POST', 2);
}

// 获取所有预警类型
export function API_GrainSituationEarlyWarningType() {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/earlyWarningType`, '', 'GET');
}

//核心企业列表-金融机构
export function API_GrainSituationGetCoreCompanyList() {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/getCoreCompanyList`, '', 'GET');
}

// 获取预警信息详情
export function API_GrainSituationGetEarlyWarningDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getEarlyWarningDetail/${data}`, '', 'GET');
}

// 预警设置列表
export function API_GrainEarlyWarningGetDepotEarlyWarning(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getDepotEarlyWarning/${data}`, '', 'GET');
}

// 保存预警设置
export function API_GrainSaveEarlyWarningData(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/saveEarlyWarningData`, data, 'POST', 2);
}

export function API_GrainGetAssociatedDepotPoint() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getAssociatedDepotPoint`, '', 'GET');
}

// 添加订阅
export function API_GrainSituationEarlyWarningAddSubscription(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/addSubscription`, data, 'POST', 2);
}

export function API_GrainGetLoanHuanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/${data.loanId}/loanBankDetail`, data, 'GET');
}

export function API_GrainFinancingOrderDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data.id}/detail`, data, 'GET');
}

export function API_GrainFinancingLoanRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/register`, data, 'POST', 2);
}

export function API_GrainFinancingRepayRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/storage/register`, data, 'POST', 2);
}

export function API_GrainGetLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/bankList`, data, 'GET');
}

export function API_LoanZuofei(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/invalidLoanByAsset`, data, 'PUT', 2);
}

// 获取权属企业当前绑定的所有仓储企业
export function API_OutWarehouseReceiptGetStorageCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getStorageCompany`, '', 'GET');
}

// 商品品种
export function API_OutWarehouseReceiptGetGrainVariety() {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/getGrainVariety`, '', 'GET');
}

// 保存出仓单
export function API_OutWarehouseReceiptSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt`, data, 'POST', 2);
}

// 出仓单ukey签章
export function API_OutWarehouseReceiptUkey(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/seal/ukey`, data, 'GET');
}

// 出仓单托管盖章
export function API_OutWarehouseReceiptAutoSignature(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}/seal/auto`, '', 'GET');
}

// 更新出仓单状态
export function API_OutWarehouseReceiptUpdateStatus(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/updateStatus`, data, 'PUT', 2);
}

// 出仓单详情
export function API_OutWarehouseReceiptDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}`, '', 'GET');
}

// 出仓单完结
export function API_OutWarehouseReceiptFinish(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/finish/${data.last}`, '', 'GET');
}

// 出仓单完结前查询累计出仓单数量
export function API_OutWarehouseReceiptWhetherCanBeCompleted(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}/whetherCanBeCompleted`, '', 'GET');
}

// 是否是最后出仓单校验
export function API_GetCheckLast(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/checkLast/${data.storehouseId}`, data, 'GET');
}

// 出仓单附件
export function API_OutWarehouseReceiptGetAttach(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/getAttach/${data}`, data, 'GET');
}

// 出仓单作废
export function API_OutWarehouseReceiptCancel(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/cancel`, data, 'POST', 2);
}

// 出仓单出库记录
export function API_OutWarehouseReceiptSelectGoodsOutPageByDeliveryNum(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/selectGoodsOutPageByDeliveryNum`, data, 'GET');
}

// 历史数据--服务费结算单预览--展示详情
export function API_ServiceFeeStatementPreviewContract(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/preview`, data, 'GET');
}

//新数据--服务费结算单预览--展示详情
export function API_ServiceFeeDetailNew(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/detail`, data, 'GET');
}

// 服务费自动盖章
export function API_CfcaServicefeeConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/serviceFeeStatementAutoSignature`, data, 'GET');
}

// 服务费结算单确认获取签章信息
export function API_ServiceFeeStatementGetSigList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/getPdfHashList`, data, 'GET');
}

// 盖章成功保存服务费结算单
export function API_ServiceFeeStatementSave(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/confirmToSeal`, data, 'GET');
}

//获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

// 服务费结算单列表
export function API_GetServiceFeeStatementList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/list`, data, 'POST', 2);
}

// 新数据--服务费结算单确认
export function API_FUWUFCOMFIRMNEW(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/newConfirm`, data, 'POST', 2);
}

// 服务费流水明细
export function API_ServiceFeeFlowList(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/list`, data, 'GET');
}

// 导出服务费流水明细
export function API_ServiceFeeExportXls(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/exportXls`, data, 'GET', 1, 'blob');
}

// 仓房详情
export function API_GetWarehouseLDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseDetail/${data.batchId}/${data.storehouseId}`, data, 'GET');
}

// 库存图表
export function API_GrainSituationInventoryChart(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/inventoryChart`, data, 'POST', 2);
}

// 仓房使用历史列表
export function API_GetWarehouseHistoryList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/warehouseHistoryList`, data, 'POST', 2);
}

// 仓房使用历史检索项 获取所有当前企业关联过的银行
export function API_GetRelBanksList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getRelBanks`, data, 'GET');
}

// 获取金融机构对应的资金类型
export function API_GetFundsList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/fundList/${data.bankId}`, data, 'GET');
}

// 封仓
export function API_BlockWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/closeWarehouse/${data.batchId}`, data, 'GET');
}

// 判断该仓房下所有电子锁是否已处于关锁状态
export function API_CheckBlockWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/inLockStatus/${data.batchId}`, data, 'GET');
}

// 仓清确认
export function API_ClearWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/clearWarehouse/${data.batchId}`, data, 'GET');
}

// 审批解除封仓
export function API_AuditReleaseWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/openApprove`, data, 'GET');
}

// 非融资判断是否有正在执行中的出仓单
export function API_OutReceiptnExecution(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/outReceiptInExecution`, data, 'GET');
}

// 关联资金方撤回
export function API_RecallRelatingFunds(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/recallRelating`, data, 'GET');
}

// 解除封仓页面需要的数据
export function API_GetKeyLockAndWorks(data) {
	return request(`${ENV.BASE_GRAIN_API}/lock/getKeyLockAndWorks/${data}`, '', 'GET');
}

// 解除封仓
export function API_OpenWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/openWarehouse`, data, 'POST', 2);
}

// 仓房下是否有电子锁
export function API_WAREHOUSEGRAINSITUATIONHAVELOCK(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/haveLock/${data}`, '', 'GET');
}

export function getWareHouseList(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/listAreaPoint`, data, 'GET');
}

//仓房保管等级修改
export function modifyCustodianLevel(data) {
	return request(`${ENV.BASE_GRAIN_NET}admin/warehouse/modifyCustodianLevel`, data, 'PUT');
}

export function getDepotPointWareHouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/depotPointWareHouse`, data, 'GET');
}

// 关联资金方提交
export function API_SubmitRelatingFunds(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/relating`, data, 'POST', 2);
}

// 获取所有金融机构
export function API_GetBankList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/bankList`, data, 'GET');
}

// 核心企业根据仓房id获取预警信息
export function API_GrainSituationGetEarlyWarningByStorehouseId(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getEarlyWarningByStorehouseId`, data, 'POST', 2);
}

// 粮情数据列表
export function API_GrainSituationPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/page`, data, 'POST', 2);
}

// 三温图
export function API_GrainSituationThreeTemp(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/threeTemp`, data, 'POST', 2);
}

// 湿度图
export function API_GrainSituationHumidity(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/humidity`, data, 'POST', 2);
}

// 气体报表
export function API_GrainSituationGasReport(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/gasReport`, data, 'POST', 2);
}

// 害虫报表
export function API_GrainSituationPestReport(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/pestReport`, data, 'POST', 2);
}

// 害虫报表（右）
export function API_GrainSituationPointPestsDetail(pgId, depotPointFlag) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/pointPestsDetail/${pgId}/${depotPointFlag}`, '', 'GET');
}

// 仓房详情中--获取电子锁记录
export function API_GetKeylostdatasByBatchId(data) {
	return request(`${ENV.BASE_GRAIN_API}/lock/getLockdatas`, data, 'GET');
}

// 根据仓房ID获取关联的摄像设备
export function API_GrainGrainSituationWarehouseCameras(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouse/cameras/${data}`, '', 'GET');
}

// 摄像头控制
export function API_GrainGrainCameraControlling(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/controlling`, data, 'GET');
}

// 出仓单分页
export function API_OutWarehouseReceiptPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/page`, data, 'GET');
}

// 入库管理列表
export function API_WarehousePutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/page`, data, 'POST', 2);
}

// 出库管理列表
export function API_WarehouseOutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/page`, data, 'POST', 2);
}

// 粮情监控入库数据入库
export function API_GrainSituationWarehouseGoodsPutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseGoodsPutPage`, data, 'POST', 2);
}

// 粮情监控入库数据出库
export function API_GrainSituationWarehouseGoodsOutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseGoodsOutPage`, data, 'POST', 2);
}

// 确认单列表
export function API_GrainConfirmationShipList(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/page`, data, 'GET');
}

//保存预警跟踪处理
export function API_GrainSituationSaveWarningTracking(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/saveWarningTracking`, data, 'POST', 2);
}

// 预警订阅列表
export function API_GrainSituationEarlyWarningSubscriptionList(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/subscriptionList`, data, 'POST', 2);
}

// 删除订阅
export function API_GrainEarlyWarningDeleteSubscription(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/deleteSubscription/${data}`, '', 'GET');
}

// 出仓单-金融机构审批
export function API_OutWarehouseReceiptAudit(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/audit`, data, 'POST', 2);
}

// 金融机构列表
export function API_OutWarehouseReceiptFinancialOrg() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/financialOrg`, '', 'GET');
}

// 仓储企业列表
export function API_OutWarehouseReceiptStorageCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/storageCompany`, '', 'GET');
}

// 出仓单状态列表
export function API_OutWarehouseReceiptDeliveryStatus() {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/deliveryStatus`, '', 'GET');
}

// 库点列表
export function API_OutWarehouseReceiptDepotPointList() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/depotPoint`, '', 'GET');
}

// 货权方列表
export function API_OutWarehouseReceiptCoreCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/coreCompany`, '', 'GET');
}

export function API_GrainFinancingOrderList(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/page`, data, 'GET');
}

// 根据id查询报表数据
export function reportDetail(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/${data.id}`, '', 'GET');
}

// 更新报表数据
export function reportUpdate(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/update`, data, 'PUT', 2);
}

// 重新获取地理位置
export function reportLoc(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/reGrapLocation`, data, 'PUT', 2);
}

// 查询报表品种列表
export function reportTypeList(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/list/type`, data, 'GET');
}

// 查询报表列表
export function reportList(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/list`, data, 'GET');
}

// 导入报表
export function reportParse(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/parse`, data, 'POST', 2);
}

// 导出报表
export function reportExport(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/export`, data, 'GET', 1, 'blob');
}

// 查询全年总量
export function reportGet(data) {
	return request(`${ENV.BASE_GRAIN_NET}view/report/getTotalSet`, data, 'GET');
}

// 删除报表数据
export function reportDelete(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/${data.id}`, data, 'DELETE');
}

// 设置全年总量
export function reportSetting(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/setting`, data, 'PUT', 2);
}

// 查询所有品种
export function reportFindAllVariety(data) {
	return request(`${ENV.BASE_GRAIN_NET}api/report/findAllVariety`, data, 'GET');
}
