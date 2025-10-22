import ENV from '@/v2/config/env';
import request from '@/api/request';

//物流节点左侧切换选项
export const getSubsystemOptions = data => request(`${ENV.BASE_USER_API}/subsystem/switch/options`, data, 'GET');
//物流节点左侧切换获取该选项下的权限集合
export const subsystemOptionsEdit = data => request(`${ENV.BASE_USER_API}/subsystem/switch/options/permission`, data, 'POST', 2);
// 仓房管理 仓房列表
export const getStationHouseList = data => request(`${ENV.BASE_STATION_API}/api/station/house/page`, data, 'GET');
//新增
export const stationHouseAdd = data => request(`${ENV.BASE_STATION_API}/api/station/house/add`, data, 'POST', 2);
//编辑
export const stationHouseEdit = data => request(`${ENV.BASE_STATION_API}/api/station/house/modify`, data, 'PUT', 2);
//可分配货主名单
export const getShipperList = data => request(`${ENV.BASE_STATION_API}/api/station/house/distribution/shipper/list`, data, 'GET');
//分配货主
export const shipperSave = data => request(`${ENV.BASE_STATION_API}/api/station/house/distribution/shipper/save`, data, 'PUT', 2);
//实际巡库人分页条件查询
export const getSupervisorList = data => request(`${ENV.BASE_STATION_API}/api/station/supervisor/user/config/page`, data, 'GET');
//添加实际巡库人
export const supervisorAdd = data => request(`${ENV.BASE_STATION_API}/api/station/supervisor/user/config/add`, data, 'POST', 2);
//删除实际巡库人
export const supervisorDelete = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/user/config/delete`, data, 'DELETE');
// 修改巡库任务开关
export const changeSupervisorStatus = data =>
	request(`${ENV.BASE_STATION_API}/api/station/house/open/supervisor`, data, 'POST', 2);

//货位管理  货位列表
export const getGoodsAllocationList = data =>
	request(`${ENV.BASE_STATION_API}/api/station/house/goods/allocation/page`, data, 'GET');
//货位管理 新增
export const goodsAllocationAdd = data =>
	request(`${ENV.BASE_STATION_API}/api/station/house/goods/allocation/add`, data, 'POST', 2);
//货位管理 编辑
export const goodsAllocationEdit = data =>
	request(`${ENV.BASE_STATION_API}/api/station/house/goods/allocation/modify`, data, 'PUT', 2);
//货位管理 删除
export const goodsAllocationDelete = data =>
	request(`${ENV.BASE_STATION_API}/api/station/house/goods/allocation/delete`, data, 'DELETE');
//货位管理 货位所有摄像头信息
// export const goodsAllocationCameraAllList = (data) => request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/station`, data, 'GET')
//货位管理 货位已关摄像头信息
export const goodsAllocationCameraListRel = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/goodsallocation`, data, 'GET');

//磅房管理
/**
 *
 * @param {*} data
 * data {
 *  name=召豪
 *  enable=false
 *  pageNo=1
 *  pageSize=10
 * }
 * @returns
 */
export const getEquipmentScaleList = data => request(`${ENV.BASE_STATION_API}/api/equipment/scale/page`, data, 'GET');
//磅房管理   详情
export const getEquipmentScaleDetail = data => request(`${ENV.BASE_STATION_API}/api/equipment/scale/detail`, data, 'GET');
//磅房管理   编辑
export const equipmentScaleEdit = data => request(`${ENV.BASE_STATION_API}/api/equipment/scale/modify`, data, 'PUT', 2);
//磅房管理  磅房关联打印机列表
export const getEquipmentScalePrinterList = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/printer/list/scale`, data, 'GET');
//磅房管理 磅房已关联监控信息
export const getEquipmentScaleCameraListRel = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/scale`, data, 'GET');
//磅房管理 磅房全部监控信息
export const getEquipmentScaleCameraAllList = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/station`, data, 'GET');

//视频配置
export const getEquipmentCameraList = data => request(`${ENV.BASE_STATION_API}/api/equipment/camera/page`, data, 'GET');
//视频配置 -- 编辑
export const equipmentCameraEdit = data => request(`${ENV.BASE_STATION_API}/api/equipment/camera/modify`, data, 'PUT', 2);

//煤种配置
export const getCoalTypeList = data => request(`${ENV.BASE_STATION_API}/api/coal/type/page`, data, 'GET');
//新增
export const coalTypeAdd = data => request(`${ENV.BASE_STATION_API}/api/coal/type/add`, data, 'POST', 2);
//删除
export const coalTypeDelete = data => request(`${ENV.BASE_STATION_API}/api/coal/type/delete`, data, 'delete');
//查询全部煤种
export const getCoalTypeAllList = data => request(`${ENV.BASE_STATION_API}/api/coal/type/list`, data, 'GET');

//打印机配置
export const getEquipmentPrinterList = data => request(`${ENV.BASE_STATION_API}/api/equipment/printer/page`, data, 'GET');
//编辑
export const equipmentPrinterEdit = data => request(`${ENV.BASE_STATION_API}/api/equipment/printer/modify`, data, 'PUT', 2);

//上下煤计划 -  列表
export const getCoalPlanList = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/page`, data, 'GET');
//详情
export const getCoalPlanDetail = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/detail`, data, 'GET');
//新增
export const coalPlanAdd = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/add`, data, 'POST', 2);
//编辑
export const coalPlanEdit = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/modify`, data, 'POST', 2);
//发货单位列表
export const getDeliveryCompanyList = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/deliveryCompany/list`, data, 'GET');
//收货公司列表
export const getReceivingCompanyList = data =>
	request(`${ENV.BASE_STATION_API}/api/coal/plan/receivingCompany/list`, data, 'GET');
//获取站台下已经保存的收货地址信息
export const getStationReceiveAddress = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/manage/record/getStationReceiveAddress`, data, 'GET');

//开启or关闭
export const coalPlanStatusEdit = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/status/modify`, data, 'PUT', 2);
//查看二维码
export const coalPlaQrCode = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/qrCode`, data, 'GET');

//根据收货单位获取其关联的仓房信息
export const getStationHouseByShipper = data => request(`${ENV.BASE_STATION_API}/api/station/house/findByShipper`, data, 'GET');
//派车信息列表
export const getTruckingOrderList = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/page`, data, 'GET');
//派车详情
export const getTruckingOrderDetail = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/detail`, data, 'GET');

//修改汽运单
export const truckingUpdateEdit = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/manualAdd`, data, 'POST', 2);

//更新矿发订单
export const truckingFileUpdate = (id, data) =>
	request(`${ENV.BASE_STATION_API}/api/trucking/order/updatePoundFile/${id}`, data, 'POST', 2);

//更新矿发订单
export const deleteTruckingFileUpdate = id =>
	request(`${ENV.BASE_STATION_API}/api/trucking/order/deletePoundFile/${id}`, '', 'POST', 2);

//派车单  修改手机号
export const truckingOrderEdit = data =>
	request(`${ENV.BASE_STATION_API}/api/trucking/order/modify/licensePlateNumber`, data, 'PUT', 2);
//派车单 删除
export const truckingOrderDelete = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/delete`, data, 'DELETE');
//派车单导出
export const truckingOrderExport = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/export`, data, 'GET', 1, 'blob');
//发送短信
export const coalPlanSendSms = data => request(`${ENV.BASE_STATION_API}/api/coal/plan/sendSms`, data, 'GET', 1);
//视频监控
export const getMonitorList = data => request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/station`, data, 'GET');
export const getSummary = data => request(`${ENV.BASE_STATION_API}/api/equipment/camera/summary`, data, 'GET');

//出入库记录
export const getRecordsList = data => request(`${ENV.BASE_STATION_API}/api/storage/record/page`, data, 'POST', 2);
//出入库导出
export const getRecordsExport = data => request(`${ENV.BASE_STATION_API}/api/storage/record/export`, data, 'POST', 2, 'blob');
//删除出入库记录
export const deleteRecords = data => request(`${ENV.BASE_STATION_API}/api/storage/record/delete`, data, 'DELETE');
//新增入库记录
export const addInRecords = data => request(`${ENV.BASE_STATION_API}/api/storage/record/train/add/in`, data, 'POST', 2);
//新增出库记录
export const addOutRecords = data => request(`${ENV.BASE_STATION_API}/api/storage/record/train/add/out`, data, 'POST', 2);
//编辑出入库记录
export const editRecords = data => request(`${ENV.BASE_STATION_API}/api/storage/record/attachment/save`, data, 'POST', 2);
//出入库 附件删除
export const deleteRecordAttachment = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/record/attachment/delete`, data, 'DELETE');
//火运 详情
export const getTrainRecordDetail = data => request(`${ENV.BASE_STATION_API}/api/storage/record/train/detail`, data, 'GET');
//火运 编辑
export const getTrainRecordEdit = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/record/train/add/out/edit`, data, 'POST', 2);
//汽运 详情
export const getAutoMobileRecordDetail = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/record/automobile/detail`, data, 'GET');

//根据托运人名称，运单号，查询运单信息
export const getTrainTrackWaybill = data => request(`${ENV.BASE_STATION_API}/api/train/track/waybill/search`, data, 'GET');
//托运人推送  获取托运人没有code 时调用此接口
export const pushTrainShipper = data => {
	return request(`${ENV.BASE_STATION_API}/api/train/track/shipper/sync`, data, 'POST');
};

//库存管理 列表
export const getInventoryList = data => request(`${ENV.BASE_STATION_API}/api/inventory/manager/page`, data, 'GET');

//库存管理 货位监控信息
export const getGoodsAllocationCameraList = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/list/goodsallocation`, data, 'GET');
//库存管理 货位库存汇总
export const getGoodsAllocationInventorySummary = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/manager/goodsAllocation/inventory/summary`, data, 'POST', 2);

// 曹妃甸
// 附件获取附件结构化数据
export const getExtraAttachmentData = data =>
	request(`${ENV.BASE_STATION_API}/api/storage/record/train/detail/extraAttachmentData`, data, 'GET');

//视频回放接口
export const getVideoPlayBack = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/getHikPlaybackUrlByTime`, data, 'GET');

/** 获取站台详情 */

export const getStationDetail = data => request(`${ENV.BASE_STATION_API}/api/station/detail?t=${Math.random()}`, data, 'GET');

export const updatedStation = data => request(`${ENV.BASE_STATION_API}/api/station/update`, data, 'PUT', 2);

//根据用户当前选择的站台查询站台和设备平面图信息
export const getStationAndCameraPlaneGraph = () =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/getStationAndCameraPlaneGraph`, {}, 'GET');

//根据设备id修改设备在平面图坐标
export const updateCameraPlaneGraphPosition = data =>
	request(`${ENV.BASE_STATION_API}/api/equipment/camera/updateCameraPlaneGraphPosition`, data, 'PUT', 2);

//站台巡库记录-列表
export const getInspectRecordsList = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/report/rest/page`, data, 'GET');
//站台巡库记录-批量下载报告
export const downloadInspectRecordsReport = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/report/batch/download`, data, 'GET', 1, 'blob');
//站台巡库记录-基础详情
export const getInspectRecordsBaseDetail = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/report/base/detail`, data, 'GET');
//站台巡库记录-巡库详情（对应时间段）
export const getInspectRecordsDetailByTime = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/report/detail`, data, 'GET');

//派车单-派车单提交
export const submitTruckingList = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/manualAdd`, data, 'POST', 2);
//派车单-车牌校验
export const checkBoundTruck = data => request(`${ENV.BASE_STATION_API}/api/trucking/order/checkBoundTruck`, data, 'GET');
// 导入派车单excel
export const importDispatchCarExcel = (id, data) =>
	request(`${ENV.BASE_STATION_API}/api/trucking/order/${id}/importExcel`, data, 'POST', 3, 'json', 5 * 60 * 1000);

// 盘库管理
// 盘库管理-列表
export const getInventoryTaskList = data => request(`${ENV.BASE_STATION_API}/api/inventory/task/page`, data, 'GET');
// 盘库管理-导出excel
export const exportInventoryTaskList = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/task/page/excel`, data, 'GET', 1, 'blob');
// 盘库管理-仓房货物盘点列表
export const getGoodsAllocationCheckList = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/task/goodsAllocation/list`, data, 'GET');
// 盘库管理-货位盘库操作
export const submitGoodsAllocationInventory = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/task/goodsAllocation/inventory`, data, 'POST', 2);
// 盘库管理-盘库详情
export const getInventoryTaskDetail = data => request(`${ENV.BASE_STATION_API}/api/inventory/task/detail`, data, 'GET');
// 盘库管理-修改盘库详情
// export const modifyInventoryTask = (data) => request(`${ENV.BASE_STATION_API}/api/inventory/task/modify`,data,'POST',2);
// 盘库管理-配置列表
export const getInventoryConfigList = data => request(`${ENV.BASE_STATION_API}/api/inventory/config/page`, data, 'GET');
// 盘库管理-盘库配置详情
export const getInventoryConfigDetail = data => request(`${ENV.BASE_STATION_API}/api/inventory/config/detail`, data, 'GET');
// 盘库管理-修改盘库配置详情
export const modifyInventoryConfigDetail = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/config/modify`, data, 'POST', 2);
// 盘库管理-修改盘库定时配置开关
export const modifyInventoryAutoEnable = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/config/autoEnable`, data, 'POST', 2);
// 盘库管理-修改盘库配置详情煤种
export const modifyInventoryTaskCoalType = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/task/modifyCoalType`, data, 'POST', 2);
// 盘库管理-修改盘库配置详情密度
export const modifyInventoryTaskDensity = data =>
	request(`${ENV.BASE_STATION_API}/api/inventory/task/modifyDensity`, data, 'POST', 2);

//质检记录-列表
export const getTaskList = data =>
	request(`${ENV.BASE_STATION_API}/api/station/inspection/task/page`, data, 'POST',2);
//站台巡库记录-巡库详情（对应时间段）
export const getTaskDetail = data =>
	request(`${ENV.BASE_STATION_API}/sys/station/inspection/task/detail`, data, 'GET');