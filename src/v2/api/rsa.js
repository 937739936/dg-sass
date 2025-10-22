import ENV from "@/v2/config/env";
import request from "@/api/request";

// 获取用户权限集合
export function API_GET_KEY(data) {
  return request(`${ENV.BASE_USER_API}/api/file/getKey`, data, "GET");
}