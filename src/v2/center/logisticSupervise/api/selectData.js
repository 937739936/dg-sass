
import ENV from "@/v2/config/env";
import request from "@/api/request";

//获取厂房以及对应货位下拉列表
export function getHouseList(data={}){
  return  request(`${ENV.BASE_STATION_API}/api/storage/record/dict/house`,data,'GET');
}
// 获取仓房货位列表 新
export function getHouseListNew(data={}){
  return  request(`${ENV.BASE_STATION_API}/api/storage/record/dict/house/by/company/type`,data,'GET');
}
//仓房下货位存货量相关信息
export function getGoodsAllocationInventory(data) {
  if(data.type == "IN"){
    return request(`${ENV.BASE_STATION_API}/api/storage/record/in/goodsAllocationInventory`,data,'GET')
  }
  return request(`${ENV.BASE_STATION_API}/api/storage/record/out/goodsAllocationInventory`,data,'GET')
}
//获取运输方式
export const getTransportModeList = (data) => request(`${ENV.BASE_STATION_API}/api/storage/record/dict/transportMode`,data,'GET');

//根据托运人名称查询托运人信息
export const getShipperList = (data) => request(`${ENV.BASE_STATION_API}/api/train/track/shipper/search`,data,'GET');

// 获取订单详情始发站信息
export function API_STATION(data){
  return request(`${ENV.BASE_API}/api/area/bizStationList`, data, 'GET')
}