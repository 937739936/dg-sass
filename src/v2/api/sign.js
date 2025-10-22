import ENV from "@/v2/config/env";
import request from "@/api/request";
// 校验验证码
export function API_GetCheckSealMobileVerifyCode(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/checkSealMobileVerifyCode`, data, 'GET')
}
// 获取企业签章方式
export function API_GetCompanyCertModel(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/getCertModel`, data, 'GET')
}
// 煤炭模块电子单据盖章--获取企业有效的印模列表
export function API_GetCompanySealList(data) {
  return request(`${ENV.BASE_API}/api/cfca/getNeedEffectiveSealConfigList`, data, 'POST', 2)
}
// 钢材模块电子单据盖章--获取企业有效的印模列表
export function API_GetCompanySealListSteel(data) {
  return request(`${ENV.BASE_GANG_API}/common/getSealConfigList`, data, 'GET')
}
// 判断 签章的时候 法定代表人信息不一致
export function checkCompanyChange(data) {
  return request(`${ENV.BASE_USER_API}/api/company/current/companyChange/valid`, data, 'GET')
}

