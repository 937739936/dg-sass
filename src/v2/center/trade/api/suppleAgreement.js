import ENV from '@/v2/config/env';
import request from '@/api/request';

// 线下补协列表
export const getOfflineSupAgreementList = data => request(`${ENV.BASE_API}/api/supplementalAgreement/pageOffline`, data, 'POST');

// 电子补协列表
export const getOnlineSupAgreementList = data => request(`${ENV.BASE_API}/api/supplementalAgreement/pageOnline`, data, 'POST', 2);

/** 电子补协 tab数量 */

export const getSupTabNum = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/countTabQuantity`, data, 'POST', 2);
// 合同状态文案

export const getStatusTip = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/getStatusTip`, data, 'GET');

// 一键导出
export const exportXls = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/pageOnline/exportXls`, data, 'POST', 2, 'blob');
export const exportOfflineXls = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/pageOffline/exportXls`, data, 'POST', 2, 'blob');

// 下载当前补协
export const downloadCurrentSup = data => request(`${ENV.BASE_API}/api/supplementalAgreement/download`, data, 'POST', 2, 'blob');
// 将原合同及已生效的补协一起打包下载
export const downloadAllSup = data => request(`${ENV.BASE_API}/api/supplementalAgreement/downloadAll`, data, 'POST', 2, 'blob');
// 删除补协
export const delOnlineSupp = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/delete`, data, 'GET');

// 电子补协 选择合同
export const getOnlineContract = data => request(`${ENV.BASE_API}/api/supplementalAgreement/getOnlineContract`, data, 'POST');
// 线下补协选择合同
export const getOfflineContract = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/getOfflineContract`, data, 'POST', 2);

// 电子补协详情

export const getOnlineSuppleDetail = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/detail`, data, 'GET');

// 线下补协详情
export const getOfflineSuppleDetail = data => request(`${ENV.BASE_API}/api/supplementalAgreement/offline/detail`, data, 'GET');

// 线下补协详情
export const getLogList = data => request(`${ENV.BASE_API}/api/supplementalAgreement/getLogList`, data, 'POST', 2);
// 补协驳回

export const receiverReject = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/receiverReject`, data, 'POST', 2);

// 作废
export const receiverCancel = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/cancel/${data.isInitiator}`, data, 'POST', 2);

// 盖章和确认

// 接收方确认 动作

export const receiverConfirm = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/receiverConfirm`, data, 'POST', 2);

// 盖章 确认
export const signToConfirm = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/sign/signToConfirm/${data.isInitiator}`, data, 'GET');

// UKey盖章时获取待签名数据
export const getPdfHashList = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/sign/getPdfHashList/${data.isInitiator}`, data, 'POST', 2);
// 电子补协-盖章回调-证书托管模式
export const autoSignature = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/sign/autoSignature/${data.isInitiator}`, data, 'POST', 2);
// 电子补协-获取已经生效的补协列表
export const getCompleted = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/getCompleted`, data, 'GET');

// 保存电子补协
export const saveDraft = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/saveDraft`, data, 'POST', 2);
// 电子补协-提交-字段校验
export const submitCheck = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/submit/fieldValid`, data, 'POST', 2);

export const submit = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/submit`, data, 'POST', 2);

/** 电子补协-获取合同最新一条正在进行中的补协 */
export const getSuppleLatest = data => request(`${ENV.BASE_API}/api/supplementalAgreement/online/getLatest`, data, 'GET');
/** 预览 */

export const previewPdf = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/preview/downloadAll`, data, 'POST', 2, 'blob');

// 检测 删除 和 修改接口
export const check = data =>
	request(`${ENV.BASE_API}/api/supplementalAgreement/online/judgeHasOperatePermissionWithThrow`, data, 'POST', 2);
