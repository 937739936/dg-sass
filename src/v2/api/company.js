import ENV from "@/v2/config/env";
import request from "@/api/request";


// 获取协议文本
export function API_GET_AGREEMENT_CLIENT(data) {
  return request(`${ENV.BASE_USER_API}/api/agreement/get`, data, "GET");
}