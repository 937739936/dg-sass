import ENV from "@/v2/config/env";
import request from "@/api/request";

export const getConfigData = (url, data, method = 'get') => {
  return request(`${url}`, data, method);
}