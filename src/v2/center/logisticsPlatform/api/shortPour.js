import ENV from "@/v2/config/env";
import request from "@/api/request";

//查询短倒配置
export const searchShortPlanStatus = (data) => request(`${ENV.BASE_STATION_API}/api/station/shortPlan/status`,data,'GET');
//设置使用短倒计划
export const useShortPlan = (data) => request(`${ENV.BASE_STATION_API}/api/station/shortPlan/add`,data,'POST',2);

//添加车辆
export const addTruck = (data) => request(`${ENV.BASE_STATION_API}/api/station/truck/add`,data,'POST',2);
//删除车辆
export const deleteTruck = (data) => request(`${ENV.BASE_STATION_API}/api/station/truck/delete`,data,'DELETE');
//车辆列表 
export const truckList = (data) => request(`${ENV.BASE_STATION_API}/api/station/truck/page`,data,'GET');

//下煤短倒记录
export const shortPourRecords = (data) => request(`${ENV.BASE_STATION_API}/api/shortPlan/scale/page`,data,'POST',2);

//短倒记录导出 
export const doExportShortPourRecords = (data) => request(`${ENV.BASE_STATION_API}/api/shortPlan/scale/export`,data,'POST',2,'blob');

//短倒计划添加车辆列表 
export const truckListForPlan = (data) => request(`${ENV.BASE_STATION_API}/api/station/truck/list/forPlan`,data,'GET');