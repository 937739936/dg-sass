import ENV from '@/v2/config/env';
import request from '@/api/request';

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 补录合同列表
export function API_TerminalContractList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/terminalContractPage`, data, 'GET');
}
// 我的电子结算单列表
export function API_GETSETTLELIST(data) {
	return request(`${ENV.BASE_API}/api/statement/list`, data, 'GET');
}
// 我的电子结算单列表导出
export function API_GETSETTLEEXPORT(data) {
	return request(`${ENV.BASE_API}/api/statement/export`, data, 'GET', 1, 'blob');
}
// 我的电子结算单列表状态数量统计
export function API_GETSETTLECOUNT(data) {
	return request(`${ENV.BASE_API}/api/statement/countByStatus`, data, 'GET');
}
// 我的电子结算单列表选择合同
export function API_GETSETTLECONTRAT(data) {
	return request(`${ENV.BASE_API}/api/statement/contractList`, data, 'GET');
}
// 我的电子结算单列表选择合同后校验是否可开结算单
export function API_GETSETTLEAPPLYCHECK(data) {
	return request(`${ENV.BASE_API}/api/statement/beforeApplyCheck`, data, 'GET');
}
// 我的电子结算单选择合同的填充信息
export function API_GETSETTLETEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/statement/defaultTemplate`, data, 'GET');
}
// 我的电子结算单预览
export function API_POSTSETTLETEPREVIEW(data) {
	return request(`${ENV.BASE_API}/api/statement/preview`, data, 'POST', 2);
}
// 我的电子结算单保存
export function API_POSTSETTLETESAVE(data) {
	return request(`${ENV.BASE_API}/api/statement/save`, data, 'POST', 2);
}
// 我的电子结算单提交
export function API_POSTSETTLETESUBMIT(data) {
	return request(`${ENV.BASE_API}/api/statement/submit`, data, 'POST', 2);
}
// 我的电子结算单列表中下载单个结算单文件
export function API_GETSETDownload(data) {
	return request(`${ENV.BASE_API}/api/statement/download`, data, 'GET', 1, 'blob');
}
// 我的电子结算单接受方确认
export function API_POSTSETTLETEreceiverConfirm(data) {
	return request(`${ENV.BASE_API}/api/statement/receiverConfirm`, data, 'POST', 2);
}
// 我的电子结算单接受方驳回
export function API_POSTSETTLETEreceiverReject(data) {
	return request(`${ENV.BASE_API}/api/statement/receiverReject`, data, 'POST', 2);
}
// 我的电子结算单发起方盖章作废
export function API_POSTSETTLETEcancel(data) {
	return request(`${ENV.BASE_API}/api/statement/cancel`, data, 'POST', 2);
}
// 我的电子结算单发起方作废,获取OA信息和作废单
export function API_GETINVALIDTemplate(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/template`, data, 'GET', 1);
}
// 我的电子结算单发起方作废前判断是否可作废
export function API_GETINVALIDCheck(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/invalidCheck`, data, 'GET', 1);
}
// 我的电子结算单发起方作废
export function API_GETINVALIDSave(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/save`, data, 'POST', 2);
}
// 我的电子结算单接受方作废确认
export function API_GETINVALIDreceiverConfirm(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/receiverConfirm`, data, 'POST', 2);
}
// 我的电子结算单接受方作废驳回
export function API_GETINVALIDreceiverReject(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/receiverReject`, data, 'POST', 2);
}
// 我的电子结算单作废的作废
export function API_GETINVALIDcancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/cancel`, data, 'POST', 2);
}

// 我的结算单删除
export function API_GETSETTLECANCEL(data) {
	return request(`${ENV.BASE_API}/api/statement/delete`, data, 'GET', 1);
}

// 取消结算单
export function API_CANCELREASONSETTLE(data) {
	return request(`${ENV.BASE_API}/api/statement/${data.statementId}/cancel`, data, 'GET');
}

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 提交结算单作废确认
export function API_SubmitSettlementCancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/save`, data, 'POST', 2);
}

// 完善合同附件上传
export const API_ContractAttachFilesUpload = `${ENV.BASE_API}/api/terminal/attachment/upload`;

// 完善合同--删除附件
export function API_DeleteContractFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/delete/attachment`, data, 'GET');
}

// 业务监控--下游--核心企业、资方-上传下游合同附件
export const API_DownstreamContractUpload = `${ENV.BASE_API}/api/terminal/attachment/upload/single`;

// 线下结算单列表
export function API_GetOffinleSettleList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/page`, data, 'GET');
}
// 线下结算单导出
export function API_GetOffinleSettleExport(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/export`, data, 'GET', 1, 'blob');
}

// 线下结算单下载附件
export function API_DownloadSettleFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/download`, data, 'GET', 1, 'blob');
}

// 线下结算单删除
export function API_DeleteSettle(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/delete`, data, 'GET');
}

// 采购补录合同附件下载
export function API_OFFLINEBUYERORDERDDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/offline/buyer/order/download`, data, 'GET', 1, 'blob');
}

// 销售补录合同附件下载
export function API_OFFLINESELLERORDERDDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/download`, data, 'GET', 1, 'blob');
}

// 判断当前合同是否已有结算日期相同、相同的结算单号的结算单
export function API_JudgeStatementDate(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/existSame`, data, 'GET');
}

// 提交时判断是否需要对方确认
export function API_JudgeNeedConfirm(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/needConfirm`, data, 'GET');
}

// 提交线下补录结算单
export function API_OffinleSettleSave(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/saveOrUpdate`, data, 'POST', 2);
}

// 线下结算单详情
export function API_OffinleStatementDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/detail`, data, 'GET');
}

// 线下合同反显合同信息
export function API_JumpFromMonotoring(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/terminalContractDetail`, data, 'GET');
}

export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}

// 结算单详情
export function API_GETSETTLEDETAIL(data) {
	return request(`${ENV.BASE_API}/api/statement/detail`, data, 'GET');
}

// 结算单作废详情
export function API_GETSETTLEINVALIDDETAIL(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/detail`, data, 'GET');
}

// 结算单 提交盖章UK盖章前调取
export function API_POSTSTATEMENTgetseal(data) {
	return request(`${ENV.BASE_API}/api/statement/getSealList`, data, 'POST', 2);
}
// 结算单 提交盖章成功并提交对方确认
export function API_POSTSTATEMENTseal(data) {
	return request(`${ENV.BASE_API}/api/statement/seal`, data, 'POST', 2);
}
// 结算单 作废提交盖章成功并提交对方确认UK盖章前调取
export function API_POSTINVALIDgetseal(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/getSealList`, data, 'POST', 2);
}
// 结算单 作废提交盖章成功并提交对方确认
export function API_POSTINVALIDseal(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/seal`, data, 'POST', 2);
}

/* 结算单重组接口修改
 */
// 根据煤种查询配置
export function getCoalConfigByType(data) {
	return request(`${ENV.BASE_API}/api/sys/pdf/template/detail`, data, 'get');
}
