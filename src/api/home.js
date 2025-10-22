import ENV from './env';
import request from '@/api/request'

// 获取首页友情链接
export function GET_LINK_LIST(data){
  return request(`${ENV.BASE_API}/api/websiteConfig/queryAll`, data, 'GET');
}
// 首页公司动态
export function API_HOMEPAGEDYNAMICQUERYCONFIG(data) {
  return request(`${ENV.BASE_API}/api/homepage/dynamic/queryConfig`, data, 'POST',2)
}
// 首页公司动态
export function API_HOMEPAGEDYNAMICQUERYBYID(data) {
  return request(`${ENV.BASE_API}/api/homepage/dynamic/queryById`, data, 'GET')
}
// 首页公司业绩
export function API_HOMEPAGEDYNAMICQUERYSTATISTICS(data) {
  return request(`${ENV.BASE_API}/api/homepage/dynamic/query/statistics/data`, data, 'GET',)
}