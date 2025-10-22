/**
 * api列表
 */
import ENV from '@/v2/config/env';
import request from '@/api/request';
// 合同冻结和启用
export const freezeContract = data => request(`${ENV.BASE_GANG_API}/contract/${data.contractId}/freeze`, data, 'GET');
// 合同完结
export const completedContract = data => request(`${ENV.BASE_GANG_API}/contract/${data.contractId}/completed`, data, 'GET');
// 企业银行账户
export function API_COMPANYACCOUNTLISTBYCOMPANYID(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/listByCompanyId`, data, 'GET');
}
// 企业联系人根据companyId查找
export function API_COMPANYLINKMANFINDBYCOMPANYID(data) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/findByCompanyId`, data, 'GET');
}
// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}
export function getOAAuditCode(data) {
	return request(`${ENV.BASE_GANG_API}/api/oa/getOAAuditCode`, '', 'GET');
}
// 修改oa流程联系人
export function editModifyProcessInitiator(data) {
	return request(`${ENV.BASE_GANG_API}/contract/modifyProcessInitiator`, data, 'POST', 2);
}
// 获取合同接入审批流信息
export function getOaInfo(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.id}/getProcessInitiator`, '', 'GET');
}
// 获取钢材采购明细表的后台字典配置
export function API_GetSteelsCondition(data) {
	return request(`${ENV.BASE_API}/api/common/getDictItemsByCondition/${data.type}`, { condition: data.condition }, 'GET');
}
// 获取品类级联
export const getMaterialCategory = data => request(`${ENV.BASE_GANG_API}/api/materialCategory/cascade`, data, 'GET');
/**  获取关联的采购和合同列表*/
export function getAssociatedContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/contract/associatedContractPage`, data, 'GET');
}
// 修改合同获取合同详情
export function API_SteelsContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}`, '', 'GET');
}
// 保存采购合同
export function API_SteelsBuyContractSave(data) {
	return request(`${ENV.BASE_GANG_API}/contract`, data, 'POST', 2);
}
// 修改采购合同
export function API_SteelsBuyContractUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/contract`, data, 'PUT', 2);
}
// 提交采购合同
export function API_SteelsBuyContractSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/contract/submit`, data, 'POST', 2);
}
//付款时，获取资金类型
export function API_GetSteelBankProductItemTwo(data) {
	return request(`${ENV.BASE_GANG_API}/payment/getFundingSources`, data, 'GET');
}
// 预览采购合同
export function API_SteelsBuyContractPreview(data) {
	return request(`${ENV.BASE_GANG_API}/contract/preview`, data, 'POST', 2);
}
export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSteel`, data, 'POST');
}
// 修改采购合同-OA页面
export function API_SteelsBuyContractUpdateToSaveOa(data) {
	return request(`${ENV.BASE_GANG_API}/contract/oaOutsideChainUpdate`, data, 'PUT', 2);
}
// 查看合同详情
export function API_SteelsContractViewDetail(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}/detail`, '', 'GET');
}
// 获取配置的交提货方式
export const getPickGoodsTypeList = data => request(`${ENV.BASE_API}/api/common/category/loadTreeRoot`, data, 'GET');
// 获取钢材合同 钢材种类
export function getSteelTypeCascade(data) {
	return request(`${ENV.BASE_GANG_API}/contract/steelTypeCascade`, data, 'GET');
}
// 合同批量下载
export function API_SteelsContractDownAll(data) {
	return request(`${ENV.BASE_GANG_API}/contract/batchDownload`, data, 'GET', 1, 'blob');
}
// 采销合同关联详情--上游合同附件一键下载
export function API_SteelsElectronicContractDownloadAll(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.contractNo}/onlinePdfDownload`, '', 'GET', 1, 'blob');
}

// export function API_GETLOGINBYMOBILE(data){
//   return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST')
// }
// 附件下载
export function API_SteelsDownloadFilesPath(data) {
	return request(`${ENV.BASE_GANG_API}/common/download`, data, 'GET', 1, 'blob');
}

// 取消合同获取合同详情
export function API_SteelsContractDelete(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}`, '', 'DELETE');
}
// Ukey签章
export function API_SteelsSealUkey(data) {
	return request(`${ENV.BASE_GANG_API}/contract/seal/ukey`, data, 'POST', 2);
}
// 托管签章
export function API_SteelsSealAuto(data) {
	return request(`${ENV.BASE_GANG_API}/contract/seal/auto`, data, 'POST', 2);
}
// 确认签章
export function API_SteelsSignAfterConfirm(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data.id}/signAfterConfirm`, '', 'GET');
}
// 盖章驳回
export function API_SteelsReject(data) {
	return request(`${ENV.BASE_GANG_API}/contract/reject/${data.id}`, data, 'GET');
}
// 核心企业盖章前校验
export function API_SteelsCheckDownstreamContract(data) {
	return request(`${ENV.BASE_GANG_API}/contract/${data}/checkDownstreamContract`, '', 'GET');
}
// 保存补录合同
export function API_SteelsAdditionalContractSave(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract`, data, 'POST', 2);
}
// 提交补录合同
export function API_SteelsAdditionalContractSubmit(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/submit`, data, 'POST', 2);
}
// 补录合同详情
export function API_SteelsAdditionalContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data.id}`, '', 'GET');
}
// 修改后保存补录合同
export function API_SteelsAdditionalContractUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract`, data, 'POST', 2);
}
// 保存双签合同
export function saveUploadDoubleSigned(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/uploadDoubleSigned`, data, 'POST', 2);
}

// 采销合同关联详情--下游合同附件一键下载
export function API_SteelsSupplementContractDownloadAll(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data.contractId}/oneClickToDownload`, '', 'GET', 1, 'blob');
}
// 保存采销合同关联关系
export function API_SteelsSaveRelationContract(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/save`, data, 'POST', 2);
}
// 检测合同是否已经关联其他合同
export function checkContractBinding(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/isContractBinding`, data, 'GET');
}
// 采销合同关联详情
export function API_SteelsRelationContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/${data.id}`, data, 'GET');
}
// 采销合同关联列表
export function API_SteelsRelationContractList(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/page`, data, 'GET');
}
// 解除采销合同关联关系
export function API_SteelsRelieveRelationContract(data) {
	return request(`${ENV.BASE_GANG_API}/businessLine/delete`, data, 'DELETE');
}
// 获取合同列表
export function getContractList(data) {
	return request(`${ENV.BASE_GANG_API}/contract/page`, data, 'GET');
}

// 销售合同取消
export function API_SteelsAdditionalContractDelete(data) {
	return request(`${ENV.BASE_GANG_API}/additionalContract/${data}`, '', 'DELETE');
}

// 下载单个补协文件
export function API_SupplementalAgreementSingleFile(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}/download`, data, 'GET', 1, 'blob');
}
// 下载合同及历史协议一起下载
export function API_SupplementalAgreementAllFile(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}/download/all`, data, 'GET', 1, 'blob');
}

// 取消补协
export function API_SupplementalAgreementDelete(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data}`, '', 'DELETE');
}
// 正在进行中的补协
// 创建补协第一步---选择合同后校验是否存在正在进行中的补协
export function API_SupplementalAgreementLatest(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.contractNo}/getNewest`, data, 'GET');
}

// 预览协议
export function API_SupplementalAgreementPreview(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/preview`, data, 'POST', 2);
}
// 提交补充协议
export function API_SupplementalAgreementSubmit(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/submit`, data, 'POST', 2);
}
// 补充协议修改
export function API_SupplementalAgreementDetail(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/modify`, data, 'GET');
}
// 补充协议盖章
export function API_SupplementalAgreementGetPdfHashList(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/seal/getPdfHashList`, data, 'POST', 2);
}
// 补充协议盖章后修改状态（发起方）
export function API_SupplementalAgreementToConfirm(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/${data}/toConfirm`, data, 'POST');
}
// 获取已经生效的补充协议列表
export function API_SupplementalAgreementGetCompleted(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/getCompleted`, data, 'GET');
}
// 修改保存补充协议
export function API_SupplementalAgreementUpdateToSave(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement`, data, 'PUT', 2);
}
// 补充协议修改时获取详情
export function API_SupplementalAgreementModifyDetail(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.id}/modifyDetail`, data, 'GET');
}
// 创建补协第一步---选择合同后校验是否存在正在进行中的补协
// export function API_SupplementalAgreementLatest(data) {
//   return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.contractNo}/getNewest`, data,'GET')
// }
// 创建补协第二步---获取合同详情
export function API_SupplementalAgreementContractDetail(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/${data.contractNo}/getContractInfo`, data, 'GET');
}
// 补充协议列表
export function API_SupplementalAgreementList(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/page`, data, 'GET');
}
// 一般贸易商驳回
export function API_SupplementalAgreementReject(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/reject`, data, 'POST', 2);
}
// 补充协议盖章-证书托管模式
export function API_SupplementalAgreementAutoSign(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/signature/auto`, data, 'POST', 2);
}
// 创建补协第一步---获取补协合同列表
export function API_SupplementalAgreementContractPage(data) {
	return request(`${ENV.BASE_GANG_API}/supplementalAgreement/contractPage`, data, 'GET');
}
/** 获取采购补录合同业务类型 */
export const getAdditionalBusinessTypeList = data => request(`${ENV.BASE_GANG_API}/contract/additionalBusinessType`, data, 'GET');
