import ENV from '@/v2/config/env';
import request from '@/api/request';

// 结清协议-分页列表
export const getLoanCloseList = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/pageSettlementAgreement`, data, 'GET')
// 结清协议-分页列表-各tab页数据统计
export const getLoanCloseStatistics = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/countEachTabStateNum`, data, 'GET')

// 结清协议-（批量）下载
export const downloadLoanCloseFile = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/downloadFile`, data, 'POST', 2, 'blob')

// 结清协议-（批量）作废
export const invalidLoanClose = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/invalidSettlementAgreement`, data, 'POST', 2)
// 获取详情
export const getLoanCloseDetail = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/getDetail`, data, 'GET')
// 获取未结清的数据
export const getUnClearList = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/pageFinancingApply`, data, 'GET')
// 获取未结清的数据-统计
export const getUnClearStatic = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/countRestFinancingApplyEachTabStateNum`, data, 'GET')
// 生成结清协议
export const settlementAgreement = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/generateSettlementAgreement`, data, 'GET')
// 获取盖章文件
export const getSignList = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/listToSealFile`, data, 'POST', 2)
// 托管盖章
export const autoSignLoanClose = (data) => request(`${ENV.BASE_API}/api/cfca/settlementAgreementAutoSignature`, data, 'POST', 2)

export const getSignHashList = (data) => request(`${ENV.BASE_API}/api/cfca/settlementAgreement/getToSigList`, data, 'POST', 2)

// 通用盖章处理
export const settlementAgreementSealSyncHandle = (data) => request(`${ENV.BASE_API}/api/settlementAgreement/settlementAgreementSealSyncHandle`, data, 'POST', 2)














