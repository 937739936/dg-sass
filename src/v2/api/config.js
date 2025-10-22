import ENV from "@/v2/config/env";
import request from "@/api/request";

// 获取订单基准质量指标字典类型
export function API_GETORDERZHIBIAOCODE(data) {
  return request(`${ENV.BASE_API}/api/order/dict/indicator`, data, "GET");
}

// 获取全部字典类型
export function API_GETALLCODE(data) {
  return request(`${ENV.BASE_API}/api/common/dict/all`, data, "GET");
}

// 获取钢材的全局字段
export function API_SteelsAllCode(data) {
  return request(`${ENV.BASE_GANG_API}/common/dict/allDict`, data, "GET");
}

// 字典
export function API_DICT(data) {
  return request(`${ENV.BASE_USER_API}/dict`, data, "GET");
}

// 获取订单字典类型
export function API_GETORDERCODE(data) {
  return request(`${ENV.BASE_API}/api/order/dict/allDict`, data, "GET");
}

//获取物流仓储中心字典类型
export function API_STATION_ALLCODE(data){
  return request(`${ENV.BASE_STATION_API}/dict`, data, "GET");
}