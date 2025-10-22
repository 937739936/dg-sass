import ENV from "@/v2/config/env";
import request from "@/api/request";

// 首页默认文档数据
export function getDefaultList(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/index`, data, 'GET')
}

// 搜索历史
export function getSearchLogList(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/searchHistory`, data, 'GET')
}

// 搜索
export function getSearchInput(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/search`, data, 'GET')
}

// 搜索关键词清除
export function clearSearchInput(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/deleteSearchHistory`, data, 'GET')
}

// 搜索统计
export function searchResultAmount(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/searchStates`, data, 'GET')
}

// 分类目录
export function getClassifyList(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/categoryTree`, data, 'GET')
}

// 文章详情
export function getArticleDetail(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/detail`, data, 'GET')
}

// 默认文档数据
export function getArticleDefault(data) {
  return request(`${ENV.BASE_API}/api/helpCenterDoc/index`, data, 'GET')
}