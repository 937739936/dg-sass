import ENV from '../../api/env'
import request from '@/api/request'

// 查询煤种信息
export function getCoalType(data) {
  return request(`${ENV.BASE_API}/api/common/colaType/list/effective`, data, 'get', 2);
}

// 根据煤种查询配置
export function getCoalConfigByType(data) {
  return request(`${ENV.BASE_API}/api/sys/pdf/template/detail`, data, 'get');
}

// 根据模板code查询模板html
export function API_getTempleteByCode(data){
  return request(`${ENV.BASE_API}/api/sys/pdf/template/content`, data, 'GET')
}