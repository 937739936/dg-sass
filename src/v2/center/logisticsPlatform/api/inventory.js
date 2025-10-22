import ENV from "@/v2/config/env";
import request from "@/api/request";

/**
 * 货主下拉框
 */
export const getShipperList = (data) => request(`${ENV.BASE_STATION_API}/api/inventory/manager/company/list`,data,'GET');

//库存管理 汇总
export const getInventorySummary = (data) => request(`${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/summary`,data,'GET');

/**
 * 库存管理 库存概览
 * {startDate,endDate}
 */
export const getOverviewEcharts = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/echarts`,data,'GET');
}
/**
 * 库存管理 库存概览 导出
 */
export const exportOverview = `${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/echarts/export`

/**
 * 业务线台账
 * /api/inventory/manager/inventory/management/businessLine
 */
export const getBusinessLinePage = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/businessLine`,data,'GET');
}
/**
 * 库存管理 业务线台账 导出
 */
export const exportBusinessLine = `${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/businessLine/export`
/**
 * 库存管理 业务线台账详情 导出
 */
export const exportBusinessLineEchart = `${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/businessLine/echarts/export`
/**
 * 业务线台账详情
 * {businessLineNo}
 */
export const getBusinessLineDetail = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/businessLine/detail`,data,'GET');
}
/**
 * 根据业务线查询 预警条数
 * {businessLineNo}
 */
export const countQueryByBusinessLine = (data) => {
  return request(`${ENV.BASE_API}/api/riskAlertRecord/countQueryByBusinessLine`,data,'GET');
}
/**
 * 根据业务线查询预警
 * {businessLineNo,monitorCategoryEnum,pageNo,pageSize}
 * monitorCategoryEnum:{
 *  COMPANY :企业监控
    TRADE :交易监控
    DEVICE :设备监控
    MARKET_PRICE :价格波动
    INVENTORY :库存监控
    OTHER :其他
 * }
 */
export const getBusinessLineRiskPage  = (data) => {
  return request(`${ENV.BASE_API}/api/riskAlertRecord/pageQueryByBusinessLine`,data,'GET');
}

// 库存盯市列表
export const getInventoryMarketPage  = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/page`,data,'GET');
}
// 指数指标分页
export const getPricePage  = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/page`,data,'GET');
}
// 指数名称
export const getIndexNameList  = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/indexNameList`,data,'GET');
}
// 指标名称
export const getIndicatorNameList  = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/indicatorNameList`,data,'GET');
}
// 指定地点
export const getLocationGroupList = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/locationGroupList`,data,'GET');
}
// 数据来源
export const getSourceList = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/sourceList`,data,'GET');
}
// 关联价格
export const saveRelatedPrice = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/saveOrUpdate`, data, 'POST', 2);
}
// 库存价格趋势
export const getPriceTrend = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/coal/type/indicator/price/trend`, data, 'GET');
}
// 煤种库存列表
export const getCoalTypeinventoryList = (data) => {
  return request(`${ENV.BASE_STATION_API}/api/inventory/manager/inventory/management/coalType/inventory`, data, 'GET');
}



