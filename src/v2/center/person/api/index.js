import ENV from '@/v2/config/env';
import request from '@/api/request';

// 9. 个人中心  我的企业    已关联企业
export function API_LINKEDCOMPANYS(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedCompanys`, data, 'GET');
}

// 10. 个人中心  我的企业    关联企业历史
export function API_LINKEDHISRECORD(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedHisRecord`, data, 'GET');
}

// 7. 个人中心  个人信息查看
export function API_VIEWPROFILE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/viewProfile`, data, 'GET');
}

//个人是否可以申请入驻企业
export function API_USER_CAN_APPLY(data) {
	return request(`${ENV.BASE_API}/api/companyUser/canApply`, data, 'GET');
}

// 13. 个人中心  我的企业    申请企业认证
export function API_APPLYCOMPANYAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/applyCompanyAuth`, data, 'POST', 2);
}

// 下载企业管理员授权模板
export function API_DOWNLMANAGEAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/applyCompanyAuth/downloadAdminLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 13. 个人中心  我的企业    申请企业认证查看
export function API_VIEWAPPLYCOMPANYAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedHisRecord/viewCompanyAuthInfo`, data, 'GET');
}

//  个人中心  我的企业    企业认证材料下载
export function API_COMPANYFILESDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/userCenter/batchDownload`, data, 'GET', 1, 'blob');
}

//  个人中心  我的企业    获取企业认证暂存的数据
export function API_COMPANYAUTHSAVEINFO() {
	return request(`${ENV.BASE_API}/api/userCenter/viewCompanyAuthSaveInfo`, '', 'GET');
}

// 下载申请表格
export function API_DOWNCERTAPPLYTABLE(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 下载数字证书申请授权书
export function API_DOWNLICENSE(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 下载声明函模板
export function API_DOWNDECLARATION(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadDeclarationLetterTemplate`, data, 'POST', 2, 'blob');
}

// 11. 个人中心  我的企业    主动申请加入企业
export function API_JOINCOMPANYBYAPPLY(data) {
	return request(`${ENV.BASE_API}/api/userCenter/joinCompanyByApply`, data);
}

// 12. 个人中心  我的企业    邀请码加入企业
export function API_JOINCOMPANYBYINVITECODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/joinCompanyByInviteCode`, data);
}

// 20. 个人中心 主动加入企业 搜索列表
export function API_SEACHCOMPANYLIST(data) {
	return request(`${ENV.BASE_API}/api/userCenter/unJoinedCompanyList`, data, 'GET');
}

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;

// 企业银行账户管理 账户列表
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}

// 企业银行账户管理 新增账户
export function API_COMPANYACCOUNTADD(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/add`, data, 'POST', '2');
}

// 企业银行账户管理 删除账户
export function API_COMPANYACCOUNTDELETE(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/${data.id}/delete`, data);
}

// 企业银行账户管理 修改账户
export function API_COMPANYACCOUNTMODIFY(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/${data.id}/modify`, data, 'POST', '2');
}

// 企业银行账户管理 账户详情
export function API_COMPANYACCOUNTID(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/${data.id}`, data, 'GET');
}

// 企业银行账户管理 银行列表
export function API_COMPANYACCOUNTBANKLIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/bankList`, data, 'GET');
}

// 企业银行账户管理 省列表
export function API_COMPANYACCOUNTPROVINCELIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/provinceList`, data, 'GET');
}

// 企业银行账户管理 城市列表
export function API_COMPANYACCOUNTCITYLIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/cityList`, data, 'GET');
}

// 企业银行账户管理 支行列表
export function API_COMPANYACCOUNTBRANCHLIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/subBranchList`, data, 'GET');
}

// 企业证书管理 申请证书
export function API_COMPANYCERTDOAPPLY(data) {
	return request(`${ENV.BASE_API}/api/companyCert/doApply`, data, 'POST', 2);
}

// 企业证书管理 证书列表
export function API_COMPANYCERTLIST(data) {
	return request(`${ENV.BASE_API}/api/companyCert/list`, data, 'GET');
}

// 企业证书管理 冻结证书
export function API_COMPANYCERTFROZEN(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/frozen`, data);
}

// 企业证书管理 解冻证书
export function API_COMPANYCERTUNFROZEN(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/unfrozen`, data);
}

// 企业证书管理 吊销证书
export function API_companyCertRevokeAudit(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/revokeAudit`, data, 'POST', 2);
}

// 企业证书管理 取消申请
export function API_COMPANYCERTCANCEL(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/cancelApply`, data);
}

// 企业证书管理 获取证书操作历史
export function API_GETCERTHISTORY(data) {
	return request(`${ENV.BASE_API}/api/certLog/list`, data, 'GET');
}

// 获取证书状态，是否显示添加证书按钮
export function API_GetCompanyIsAddCert(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/isAddCert`, data, 'GET');
}

// 证书申请 获取操作员列表
export function API_GETOPERATORACCOUNT(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOperatorAccountList`, data, 'POST');
}

// 企业证书管理 变更操作员提交
export function API_COMPANYCERTOPERATORCHANGEDOAPPLY(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/doApply`, data, 'POST', 2);
}

// 更换操作员 下载证书申请表模板
export function API_CHANGEOPERATORDOWNCERTAPPLYTABLE(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 更换操作员 下载证书申请表模板
export function API_CHANGEOPERATORDOWNLICENSETABLE(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 证书申请 获取操作员所填数据
export function API_GETOPERATORINFO(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOperatorInfo`, data, 'POST');
}

// 更换操作员 获取原操作员信息
export function API_GETOLDOPERATORINFO(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOldOperatorInfo`, data, 'GET');
}

// 企业证书管理 证书操作历史详情
export function API_GETCERTHISTORYDETAIL(data) {
	return request(`${ENV.BASE_API}/api/certLog/detail`, data, 'GET');
}

// 下载证书吊销申请表格
export function API_downCertRevokeApplyTable(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadCertRevokeApplyTemplate`, data, 'POST', 2, 'blob');
}

// 变更管理员验证码验证
export function API_checkModifyAdminVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyUser/checkModifyAdminVerifyCode`, data, 'POST');
}

// 变更管理员验证码
export function API_getModifyAdminVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyUser/getModifyAdminVerifyCode`, data, 'POST');
}

// 企业变更查询 变更查询
export function API_CHANGELIST(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList`, data, 'GET');
}

// 变更签章员页面证书列表
export function API_CertList(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/certList`, data, 'GET');
}

// 修改签章员
export function API_ChangeCertOperator(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/changeCertOperator`, data, 'POST', 2);
}

//变更签章员-下载变更操作员申请表模板
export function API_OperatorDownloadCertApplyTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 变更签章员-下载变更操作员授权书模板
export function API_OperatorDownloadLicenseTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 企业开票信息管理
export function API_COMPANYINVOICEBYCOMPANYID(data) {
	return request(`${ENV.BASE_API}/api/companyInvoice/queryByCompanyId`, data, 'GET');
}

// 企业开票信息管理
export function API_SAVECOMPANYINVOICE(data) {
	return request(`${ENV.BASE_API}/api/companyInvoice/save`, data);
}

// 企业联系人-列表
export function API_COMPANYCONTACTLIST(data) {
	return request(`${ENV.BASE_API}/api/companyContract/list`, data, 'GET');
}

// 企业联系人 - 新增
export function API_COMPANYCONTACTADD(data) {
	return request(`${ENV.BASE_API}/api/companyContract/add`, data, 'POST', 2);
}

// 企业联系人 - 修改
export function API_COMPANYCONTACTMODIFY(data) {
	return request(`${ENV.BASE_API}/api/companyContract/modify`, data, 'POST', 2);
}

// 企业联系人 - 删除
export function API_COMPANYCONTACTDELETE(data) {
	return request(`${ENV.BASE_API}/api/companyContract/${data.id}/delete`, {}, 'GET');
}

// 企业基本信息管理 企业关键信息修改
export function API_COMPANYPROFILMODIFYIMPORTANTINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/modifyImportantInfo`, data, 'POST', 2);
}

// 企业基本信息管理 企业关键其他信息
export function API_COMPANYPROFILMODIFYBASICINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/modifyBasicInfo`, data, 'POST', 2);
}

// 企业基本信息管理 企业关键信息修改-模板下载
export function API_COMPANYPROFILMODIFYDOWNLOADTEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/downloadApplyTemplate`, data, 'POST', 2, 'blob');
}

// 企业基本信息管理 企业信息查看
export function API_COMPANYPROFILEVIEW(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/view`, data, 'GET');
}

// 企业变更查询 企业信息修改查看
export function API_CHANGELISTVIEWCOMPANYINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList/viewCompanyInfo`, data, 'GET');
}

// 证书申请
export function API_CertDoApply(data) {
	return request(`${ENV.BASE_API}/api/cert/doApply`, data, 'POST', 2);
}

// 证书申请-下载声明函模板
export function API_DownloadDeclarationLetterTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadDeclarationLetterTemplate`, data, 'POST', 2, 'blob');
}

// 证书申请-下载授权书模板
export function API_CertDownloadLicenseTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 证书申请-下载机构证书申请表
export function API_CertDownloadCertApplyTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 企业电子印章 电子印章列表
export function API_COMPANYSEALLIST(data) {
	return request(`${ENV.BASE_API}/api/companySeal/list`, data, 'GET');
}

// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}

// 企业用户管理 删除企业用户
export function API_COMPANYUSERDELETE(data) {
	return request(`${ENV.BASE_API}/api/companyUser/${data.id}/delete`, data);
}

// 企业用户管理 更换管理员
export function API_CHANGEOPERATORNAME(data) {
	return request(`${ENV.BASE_API}/api/companyUser/modifyLoginName`, data, 'POST');
}

// 企业变更查询 证书申请查看
export function API_CHANGELISTVIEWCETEAPPLYINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList/viewCertApplyInfo`, data, 'GET');
}

// 证书冻结
export function API_CertFrozen(data) {
	return request(`${ENV.BASE_API}/api/cert/frozen`, data, 'POST', 2);
}

// 证书解冻
export function API_CertUnfrozen(data) {
	return request(`${ENV.BASE_API}/api/cert/unfrozen`, data, 'POST', 2);
}

// 6. 注销
export function API_LOGOUT(data) {
	return request(`${ENV.BASE_API}/api/logout`, data);
}

// 国内业务省
export function API_BIZPROVINCELIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizProvinceList`, data, 'GET');
}

// 国内业务市
export function API_BIZCITYLIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizCityList`, data, 'GET');
}

// 新单个文件上传（善美保理新增）
export const API_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/upload`;

// 获取站台仓储及对应角色
export function API_ROLES_STATION(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/roles/station`, data, 'GET');
}

// 获取该账号已关联站台仓储及对应角色
export function API_GET_ROLES_STATION(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/roles/station/detail`, data, 'GET');
}
/** 查询所有仓房信息 */
export const getAllSupervisionHouseList = data => request(`${ENV.BASE_GRAIN_API}/companyRelation/supervisionHouse`, data, 'GET');
/** 查询所有站台信息 */
export const getAllSupervisionStationList = data => request(`${ENV.BASE_STATION_API}/api/station/page`, data, 'GET');
/** 新增监管公司企业账号 */
export const addSupervisionAccount = data => request(`${ENV.BASE_USER_API}/api/company/user/add`, data, 'POST', 2);
/** 查询勾选的仓库 */
export const getSelectSupervisionHouseList = data =>
	request(`${ENV.BASE_USER_API}/api/company/user/info/supervisionrelhouse`, data, 'GET');
/** 查询勾选的站台 */
export const getSelectSupervisionStationList = data =>
	request(`${ENV.BASE_STATION_API}/api/station/supervisor/user/warehouse/rel/listByCompanyUserId`, data, 'GET');
// 更新监管公司账号
export const updateSupervisionAccount = data =>
	request(`${ENV.BASE_USER_API}/api/company/user/${data.id}/modify`, data, 'PUT', 2);
// 获取监管公司账号详情
export const getSupervisionDetail = id => request(`${ENV.BASE_USER_API}/api/company/user/detail/${id}`, '', 'GET');

// 天眼查根据关键字查询企业信息
export function API_TianYanCha(data) {
	return request(`${ENV.BASE_USER_API}/api/tianyancha/company/base/info`, data, 'GET');
}
//天眼查根据关键字模糊查询企业名称
export function API_TianYanChaKeyword(data) {
	return request(`${ENV.BASE_USER_API}/api/tianyancha/search/keyword`, data, 'GET');
}

// 获取协议文本
export function API_GET_AGREEMENT_CLIENT(data) {
	return request(`${ENV.BASE_USER_API}/api/agreement/get`, data, 'GET');
}
export function modifyName(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/modifyName`, data, 'POST', 2);
}
// 获取实名认证申请记录详情
export function API_GET_REALNAME_AUTHENTICATION(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/realAuthApplyLogInfo`, data, 'GET');
}

// 3要素验证接口
export function API_THREE_ELEMENTS(data) {
	return request(`${ENV.BASE_USER_API}/api/idCard/auth/check3Meta`, data, 'POST', 1);
}
