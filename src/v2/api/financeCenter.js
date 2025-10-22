// 财务中心接口
import ENV from "@/v2/config/env";
import request from "@/api/request";
// 获取服务费协议模板
export const getTemplateList =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/templateList`, data, 'GET')
// 服务费协议管理列表 
export const getServiceFeeList =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/page`, data, 'GET')
// 获取服务费协议作废url
export const getServiceFeeInvalidUrl =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/invalid/preview`, data, 'GET')
// 获取服务费协议作废url状态
export const afterGenerateInvalidFile =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/afterGenerateInvalidFile`, data, 'GET')
// 服务费协议解除协议托管盖章 
export const invalidAutoSignature =  (data) =>  request(`${ENV.BASE_API}/api/cfca/serviceFeeAgreement/invalid/autoSignature`, data, 'GET')
// UKey作废盖章时获取待签名数据 
export const getInvalidPdfHashList =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/seal/getInvalidPdfHashList`, data, 'GET')
// 服务费作废
export const invalidServiceFee =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/generateInvalidFile`, data, 'GET')
// 服务费详情
export const getServiceFeeDetail =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/detail`, data, 'GET')
// 驳回协议
export const rejectServiceFee =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/reject`, data, 'POST', 2)
// 异议
export const suspend =  (data) =>  request(`${ENV.BASE_API}/api/serviceFee/suspend`, data, 'POST', 2)

// 服务费协议托管盖章 
export const autoSignature =  (data) =>  request(`${ENV.BASE_API}/api/cfca/serviceFeeAgreement/autoSignature`, data, 'GET')
// UKey盖章时获取待签名数据 
export const getPdfHashList =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/seal/getPdfHashList`, data, 'GET')
// 提交盖章
export const confirmToSeal =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/confirmToSeal`, data, 'GET')
/** 获取服务费协议 */
export const getServiceFeeInfo =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/autoGenerate`, data, 'GET')
// 服务费uky盖章
export const feeUKeySeal =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/afterUkeySeal`, data, 'GET')
// 下载服务费协议
export const downServiceFee =  (data) =>  request(`${ENV.BASE_API}/api/serviceFeeAgreement/download`, data, 'GET',1, 'blob')








