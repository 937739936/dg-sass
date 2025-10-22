import ENV from './env';
import request from '@/api/request';

// 获取当前环境地址
export function API_GETCURRENTENV(data) {
	if (/^http/.test(data)) {
		return data;
	}
	return window.location.origin + ENV.BASE_API + '/' + data;
}

// 云控环境退出
export function API_FIN_LOG_OUT(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/logout`, data, 'GET', 1, 'text/html');
}
// 云控环境登录
export function API_FIN_LOG_IN(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/login?ssoTicket=${data}`, '', 'POST', 1, 'text/html');
}
// 云控检查额度信息

export function API_FIN_CHECK_CREDIT(data) {
	return request(`${ENV.VUE_APP_YIMEI_FIN_URL}/company/cloudmelt/apply/trade/confirmFormCheck`, data, 'POST');
}

// 1. 注册
export function API_REGISTER(data) {
	return request(`${ENV.BASE_API}/api/register`, data);
}

// 2. 登录 => 验证码登录
export function API_LOGINBYCODE(data) {
	return request(`${ENV.BASE_API}/api/loginByVerifyCode`, data);
}

// 3. 登录 => 密密录
export function API_LOGINBYPASS(data) {
	return request(`${ENV.BASE_API}/api/login`, data);
}

// 4. 找回密码
export function API_FINDPASS(data) {
	return request(`${ENV.BASE_API}/api/forgotPassword`, data);
}

// 5. 找回密码 校验企业账户
export function API_CHECKOUTNAME(data) {
	return request(`${ENV.BASE_API}/api/checkLoginName`, data, 'GET');
}

// 5. 找回密码 发送验证码
export function API_SENDFINDCODE(data) {
	return request(`${ENV.BASE_API}/api/getForgotPasswordVerifyCode`, data);
}

// 6. 注销
export function API_LOGOUT(data) {
	return request(`${ENV.BASE_API}/api/logout`, data);
}

// 7. 个人中心  个人信息查看
export function API_VIEWPROFILE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/viewProfile`, data, 'GET');
}

// 8. 个人中心  个人信息保存
export function API_SAVEROFILE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/saveProfile`, data, 'POST', 2);
}

// 9. 个人中心  我的企业    已关联企业
export function API_LINKEDCOMPANYS(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedCompanys`, data, 'GET');
}

// 10. 个人中心  我的企业    关联企业历史
export function API_LINKEDHISRECORD(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedHisRecord`, data, 'GET');
}

// 11. 个人中心  我的企业    主动申请加入企业
export function API_JOINCOMPANYBYAPPLY(data) {
	return request(`${ENV.BASE_API}/api/userCenter/joinCompanyByApply`, data);
}

// 12. 个人中心  我的企业    邀请码加入企业
export function API_JOINCOMPANYBYINVITECODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/joinCompanyByInviteCode`, data);
}

//  个人中心  我的企业    企业认证材料下载
export function API_COMPANYFILESDOWNLOAD(data) {
	return request(`${ENV.BASE_API}/api/userCenter/batchDownload`, data, 'GET', 1, 'blob');
}

//  个人中心  我的企业    获取企业认证暂存的数据
export function API_COMPANYAUTHSAVEINFO() {
	return request(`${ENV.BASE_API}/api/userCenter/viewCompanyAuthSaveInfo`, '', 'GET');
}

// 13. 个人中心  我的企业    申请企业认证
export function API_APPLYCOMPANYAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/applyCompanyAuth`, data, 'POST', 2);
}

// 13. 个人中心  我的企业    申请企业认证查看
export function API_VIEWAPPLYCOMPANYAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/linkedHisRecord/viewCompanyAuthInfo`, data, 'GET');
}

//个人是否可以申请入驻企业
export function API_USER_CAN_APPLY(data) {
	return request(`${ENV.BASE_API}/api/companyUser/canApply`, data, 'GET');
}

// 14. 个人中心  安全中心    修改邮箱
export function API_MODIFYEMAILBYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/modifyEmailByCode`, data);
}

// 15. 个人中心  安全中心    发送邮箱验证码
export function API_MODIFYEMAILVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getModifyEmailVerifyCode`, data);
}

// 16. 个人中心  安全中心    原手机发送验证码
export function API_MODIFYEMAILVERIFYCODEBYOLD(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getModifyMobileVerifyCodeByOld`, data);
}
// 校验原手机验证码
export function API_MODIFYEMAILVERIFYCODEBYOLDCHECKVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkVerifyCode`, data);
}

// 工作台

export function API_workbenchConfigList(data) {
	if (data.methods == 'POST') {
		return request(`${data.apipath}`, data.query, 'POST', 2);
	}
	return request(`${data.apipath}`, data.query || {}, 'GET');
}
export function API_workbenchGongList(data) {
	return request(`${ENV.BASE_API}/api/workbench/notice`, data, 'GET');
}
export function API_GetUnreadWorkbenchList(data) {
	return request(`${ENV.BASE_API}/api/workbench/list/unRead`, data, 'GET');
}
export function API_GetRiskWorkbenchList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/count`, data, 'GET');
}
//工作台数据概览
export function API_GetWorkDataOverview(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/data/overview`, data, 'GET');
}
//工作台发运数据统计
export function API_GetWorkDespatchData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/despatch/data`, data, 'GET');
}
//工作台合同签署情况统计
export function API_GetWorkContractData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/contract/data`, data, 'GET');
}
//工作台自有资金统计
export function API_GetWorkOwnData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/own/data`, data, 'GET');
}
//工作台资金使用情况-金融机构
export function API_GetWorkBankList(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/bank/list`, data, 'GET');
}
//工作台资金使用情况-金融机构
export function API_GetWorkBankData(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistics/bank/fund/data`, data, 'GET');
}
//工作台数据概览导出
export function API_GetWorkBankExportOverview(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/data/overview`, data, 'GET', 2, 'blob');
}
//工作台累计业务数据导出
export function API_GetWorkContractExport(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/contract/data`, data, 'GET', 2, 'blob');
}
//工作台发运数据导出
export function API_GetWorkBankExportDespatch(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/despatch/data`, data, 'GET', 2, 'blob');
}
//工作台自有资金数据导出
export function API_GetWorkBankExportMoney(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/own/money/data`, data, 'GET', 2, 'blob');
}
//工作台金融机构资金使用情况导出接口
export function API_GetWorkBankExportFund(data) {
	return request(`${ENV.BASE_API}/api/workbench/statistic/export/fund/used/data`, data, 'GET', 2, 'blob');
}
export function API_workbenchNoticeDetail(data) {
	return request(`${ENV.BASE_API}/api/workbench/notice/detail/${data.id}`, data, 'GET');
}

// 17. 个人中心  安全中心    新手机发送验证码
export function API_MODIFYEMAILVERIFYCODEBYNEW(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getModifyMobileVerifyCodeByNew`, data);
}

// 18. 个人中心  安全中心    修改手机号
export function API_MODIFYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/modifyMobile`, data);
}
// 邮箱验证码
export function API_GETEMAILMOBILEVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getEmailMobileVerifyCode`, data);
}
// 校验邮箱验证码
export function API_CHECKEMAILMOBILEVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkEmailMobileVerifyCode`, data);
}
// 绑定邮箱验证码
export function API_GETMODIFYEMAILVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getModifyEmailVerifyCode`, data);
}
export function API_ADDEMAIL(data) {
	return request(`${ENV.BASE_API}/api/userCenter/addEmailByCode`, data);
}

// 19. 切换企业
export function API_CHANGECOMPANY(data) {
	return request(`${ENV.BASE_API}/api/userCenter/changeCompany`, data, 'GET');
}

// 20. 个人中心 主动加入企业 搜索列表
export function API_SEACHCOMPANYLIST(data) {
	return request(`${ENV.BASE_API}/api/userCenter/unJoinedCompanyList`, data, 'GET');
}

// 个人中心 实名认证发送短信

export function API_GETAUTHIDVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getAuthIdVerifyCode`, data, 'POST');
}
export function API_CHECKAUTHIDVERIFYCODE(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkAuthIdVerifyCode`, data, 'POST');
}

// 个人中心 实名认证提交

export function API_AUTHIDSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/userCenter/authId`, data, 'POST');
}

// 企业基本信息管理 企业信息查看
export function API_COMPANYPROFILEVIEW(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/view`, data, 'GET');
}

// 企业基本信息管理 企业关键其他信息
export function API_COMPANYPROFILMODIFYBASICINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/modifyBasicInfo`, data, 'POST', 2);
}

// 企业基本信息管理 企业关键信息修改
export function API_COMPANYPROFILMODIFYIMPORTANTINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/modifyImportantInfo`, data, 'POST', 2);
}
// 企业基本信息管理 企业关键信息修改-模板下载

export function API_COMPANYPROFILMODIFYDOWNLOADTEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/downloadApplyTemplate`, data, 'POST', 2, 'blob');
}

// 企业变更查询 变更查询
export function API_CHANGELIST(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList`, data, 'GET');
}

// 企业变更查询 企业信息修改查看
export function API_CHANGELISTVIEWCOMPANYINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList/viewCompanyInfo`, data, 'GET');
}

// 企业信息变更记录详情

// 企业变更查询 证书申请查看
export function API_CHANGELISTVIEWCETEAPPLYINFO(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/changeList/viewCertApplyInfo`, data, 'GET');
}

// 证书申请 获取操作员列表
export function API_GETOPERATORACCOUNT(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOperatorAccountList`, data, 'POST');
}

// 变更管理员验证码
export function API_getModifyAdminVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyUser/getModifyAdminVerifyCode`, data, 'POST');
}
// 变更管理员验证码验证
export function API_checkModifyAdminVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyUser/checkModifyAdminVerifyCode`, data, 'POST');
}
export function API_COMPANYLISTROLES(data) {
	return request(`${ENV.BASE_API}/api/companyUser/listRoles`, data, 'GET');
}

// 证书申请 获取操作员所填数据
export function API_GETOPERATORINFO(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOperatorInfo`, data, 'POST');
}

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

// 企业银行账户管理 城市列表
export function API_COMPANYACCOUNTCITYLIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/cityList`, data, 'GET');
}

// 企业银行账户管理 省列表
export function API_COMPANYACCOUNTPROVINCELIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/provinceList`, data, 'GET');
}

// 企业银行账户管理 支行列表
export function API_COMPANYACCOUNTBRANCHLIST(data) {
	return request(`${ENV.BASE_API}/api/companyAccount/subBranchList`, data, 'GET');
}

// 企业证书管理 证书列表
export function API_COMPANYCERTLIST(data) {
	return request(`${ENV.BASE_API}/api/companyCert/list`, data, 'GET');
}

// 企业证书管理 获取证书操作历史
export function API_GETCERTHISTORY(data) {
	return request(`${ENV.BASE_API}/api/certLog/list`, data, 'GET');
}

// 企业证书管理 证书操作历史详情
export function API_GETCERTHISTORYDETAIL(data) {
	return request(`${ENV.BASE_API}/api/certLog/detail`, data, 'GET');
}

// 企业证书管理 冻结证书
export function API_COMPANYCERTFROZEN(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/frozen`, data);
}

// 企业证书管理 吊销证书
export function API_COMPANYCERTREVOKE(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/revoke`, data);
}

// 企业证书管理 解冻证书
export function API_COMPANYCERTUNFROZEN(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/unfrozen`, data);
}

// 企业证书管理 取消申请
export function API_COMPANYCERTCANCEL(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/cancelApply`, data);
}

// 企业证书管理 证书申请详情查看
export function API_COMPANYCERTAPPLYINFO(data) {
	return request(`${ENV.BASE_API}/api/companyCert/applyInfo`, data, 'GET');
}

// 企业证书管理 申请证书
export function API_COMPANYCERTDOAPPLY(data) {
	return request(`${ENV.BASE_API}/api/companyCert/doApply`, data, 'POST', 2);
}

// 企业证书管理 吊销证书
export function API_companyCertRevokeAudit(data) {
	return request(`${ENV.BASE_API}/api/companyCert/${data.id}/revokeAudit`, data, 'POST', 2);
}

// 企业证书管理 变更操作员提交
export function API_COMPANYCERTOPERATORCHANGEDOAPPLY(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/doApply`, data, 'POST', 2);
}

// 企业电子印章 电子印章列表
export function API_COMPANYSEALLIST(data) {
	return request(`${ENV.BASE_API}/api/companySeal/list`, data, 'GET');
}

// 企业账号管理 账号列表
export function API_COMPANYUSERLIST(data) {
	return request(`${ENV.BASE_API}/api/companyUser/list`, data, 'GET');
}

// 企业用户管理 创建企业用户
export function API_COMPANYUSERADD(data) {
	return request(`${ENV.BASE_API}/api/companyUser/add`, data, 'POST', 2);
}

// 企业用户管理 修改企业用户
export function API_COMPANYUSERMODIFY(data) {
	return request(`${ENV.BASE_API}/api/companyUser/${data.id}/modify`, data, 'POST', 2);
}

// 企业用户管理 删除企业用户
export function API_COMPANYUSERDELETE(data) {
	return request(`${ENV.BASE_API}/api/companyUser/${data.id}/delete`, data);
}

// 企业用户管理 解绑
export function API_COMPANYUSERUNBIND(data) {
	return request(`${ENV.BASE_API}/api/companyUser/${data.id}/unbind`, data);
}

// 企业用户管理 邀请列表
export function API_COMPANYUSERINVITELIST(data) {
	return request(`${ENV.BASE_API}/api/companyUser/invite/list`, data, 'GET');
}

// 企业用户管理 邀请一个员工
export function API_COMPANYUSERDOINVITE(data) {
	return request(`${ENV.BASE_API}/api/companyUser/invite/doInvite`, data);
}

// 企业用户管理 取消邀请
export function API_COMPANYUSERAPPLYCANCEL(data) {
	return request(`${ENV.BASE_API}/api/companyUser/invite/cancel`, data);
}

// 企业用户管理 获取未分配的企业账户
export function API_GETUNASSIGNEDLIST(data) {
	return request(`${ENV.BASE_API}/api/companyUser/unAssignedList`, data, 'GET');
}

// 企业用户管理 重新邀请
export function API_COMPANYUSERAPPLYREINVITE(data) {
	return request(`${ENV.BASE_API}/api/companyUser/invite/reInvite`, data);
}

// 企业用户管理 申请列表
export function API_COMPANYUSERAPPLYLIST(data) {
	return request(`${ENV.BASE_API}/api/companyUser/apply/list`, data, 'GET');
}

// 企业用户管理 申请审核通过
export function API_COMPANYUSERAPPLYAUDITSUCESS(data) {
	return request(`${ENV.BASE_API}/api/companyUser/apply/auditSuccess`, data);
}

// 企业用户管理 申请审核拒绝
export function API_COMPANYUSERAPPLYAUDITFAIL(data) {
	return request(`${ENV.BASE_API}/api/companyUser/apply/auditFailed`, data);
}

// 企业用户管理 管理员变更
export function API_COMPANYUSERMODIFYADMIN(data) {
	return request(`${ENV.BASE_API}/api/companyUser/modifyAdmin`, data, 'POST');
}

// 企业用户管理 获取管理员更换列表
export function API_GETOPERATORMODIFYLIST(data) {
	return request(`${ENV.BASE_API}/api/companyUser/toModify`, data, 'POST');
}

// 企业用户管理 更换管理员
export function API_CHANGEOPERATORNAME(data) {
	return request(`${ENV.BASE_API}/api/companyUser/modifyLoginName`, data, 'POST');
}

// 企业用户管理 更换操作员
export function API_NewAdminInfo(data) {
	return request(`${ENV.BASE_API}/api/companyUser/newAdminInfo`, data, 'POST');
}

// 管理员变更申请书
export function API_DownloadAdminApplyTemplate(data) {
	return request(`${ENV.BASE_API}/api/companyUser/downloadAdminApplyTemplate`, data, 'POST', 2, 'blob');
}

// 企业账户密码修改
export function API_MODIFYPASSWORD(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/modifyPassword`, data);
}

// 企业开票信息管理
export function API_COMPANYINVOICEBYCOMPANYID(data) {
	return request(`${ENV.BASE_API}/api/companyInvoice/queryByCompanyId`, data, 'GET');
}
// 企业开票信息管理
export function API_SAVECOMPANYINVOICE(data) {
	return request(`${ENV.BASE_API}/api/companyInvoice/save`, data);
}
// // 历史数据--服务费结算单确认
export function API_FUWUFCOMFIRM(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/confirm`, data, 'POST', 2);
}
// 新数据--服务费结算单确认
export function API_FUWUFCOMFIRMNEW(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/newConfirm`, data, 'POST', 2);
}

// 企业联系人-列表
export function API_COMPANYCONTACTLIST(data) {
	return request(`${ENV.BASE_API}/api/companyContract/list`, data, 'GET');
}
// 订单联系人-列表
export function API_COMPANYCONTACTDORDERLIST(data) {
	return request(`${ENV.BASE_API}/api/companyContract/query`, data, 'GET');
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

// 单个文件上传
export const API_UPLOAD = `${ENV.BASE_API}/api/common/upload`;
// 仓储中心上传
export const API_UPLOAD_GRAIN = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

// 发票上传
export const API_UPLOAD_INVOICE = `${ENV.BASE_API}/api/invoice/common/uploadInvoiceFile`;
// 发票EXCEL识别
export const API_UPLOAD_EXCELSCAN = `${ENV.BASE_API}/api/invoice/common/excelScan`;

// 新单个文件上传（善美保理新增）
export const API_UPLOAD_FILE = `${ENV.BASE_API}/api/common/file/upload`;
//上传附件新增水印
export const API_UPLOAD_WATER_MARk = `${ENV.BASE_API}/api/common/file/upload/and/waterMark`;

export const commonUpload = data => {
	const t = Math.random();
	return request(`${ENV.BASE_API}/api/common/file/upload/and/waterMark?t=${t}`, data, 'POST', 2);
};
// 附件上传返回文件id
export const commonFileUpload = data => {
	return request(`${ENV.BASE_API}/api/common/file/uploadAndSave`, data, 'POST', 2);
};
// 返回图片地址增量数据
export function API_GetIncrementFilePath(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/getIncrementFilePath`, data, 'GET');
}
// 获取单个字典类型
export function API_GETSINGLECODE(data) {
	return request(`${ENV.BASE_API}/api/common/dict/single/${data.code}`, data, 'GET');
}
// 获取全部字典类型
export function API_GETALLCODE(data) {
	return request(`${ENV.BASE_API}/api/common/dict/all`, data, 'GET');
}

// 获取全部权限
export function API_GETALLAUTH(data) {
	return request(`${ENV.BASE_API}/api/companyUser/permission`, data, 'GET');
}
// 获取订单基准质量指标字典类型
export function API_GETORDERZHIBIAOCODE(data) {
	return request(`${ENV.BASE_API}/api/order/dict/indicator`, data, 'GET');
}

// 企业基本信息查看
export function API_VIEWCOMPANYPROFILE(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/view`, data, 'GET');
}

// 国内业务市
export function API_BIZCITYLIST(data) {
	return request(`${ENV.BASE_API}/api/area/bizCityList`, data, 'GET');
}

// 国内地图数据列表
export function API_NATIONALMAP(data) {
	return request(`${ENV.BASE_API}/api/index/internalMap`, data, 'GET');
}

// 国际地图数据列表
export function API_INTERNALMAP(data) {
	return request(`${ENV.BASE_API}/api/index/internationalMap`, data, 'GET');
}

// OA审核采购订单列表
export function API_OAAUDITBUYORDERLIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/pageAuditList`, data, 'GET');
}

// 采购订单 修改订单
export function API_MODIFYBUYORDER(data) {
	return request(`${ENV.BASE_API}/api/orderBuy/${data.orderId}/modifyInfo`, data, 'GET');
}

// 销售订单 修改订单
export function API_MODIFYSELLORDER(data) {
	return request(`${ENV.BASE_API}/api/orderSell/${data.orderId}/modifyInfo`, data, 'GET');
}
// 订单获取服务费资金来源 (所有)
export function API_GETBANKPRODUCTITEMALL(data) {
	return request(`${ENV.BASE_API}/api/order/buy/getBankProductName`, data, 'GET');
}

// 采购订单 关闭订单
export function API_FINSHBUYORDER(data) {
	return request(`${ENV.BASE_API}/api/order/buy/${data.orderId}/complete`, data, 'POST');
}

// 销售订单详情
/**
 * @data string 订单ID
 * */

// 销售订单  确认订单
/* export function API_SELLORDERCONFIRMTOOA(data){
    return request(`${ENV.BASE_API}/api/orderSell/${data.orderId}/confirmToOa`, data, 'POST')
} */

// 采购订单  确认订单
/* export function API_BUYORDERCONFIRMTOOA(data){
    return request(`${ENV.BASE_API}/api/orderBuy/${data.orderId}/confirmToOa`, data, 'POST')
} */

// 采购订单  提交盖章判断订单是否已作废
export function API_BUYORDERSEAL(data) {
	return request(`${ENV.BASE_API}/api/order/buy/${data.orderId}/sealIdentify`, data, 'GET');
}

// 销售订单  提交盖章判断订单是否已作废
export function API_SELLORDERSEAL(data) {
	return request(`${ENV.BASE_API}/api/order/sell/${data.orderId}/sealIdentify`, data, 'GET');
}

// 预览合同销售订单 新创
export function API_PREVIEWCONTRACTSELL(data) {
	return request(`${ENV.BASE_API}/api/orderSell/previewContract`, data, 'POST', 2);
}
// 模板列表
export function API_TEXTTEMPLATELIST(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/list`, data, 'GET');
}

// 收藏模板
export function API_SAVETEXTTEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/save`, data, 'POST', 2);
}

// 合同列表
export function API_CONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/list`, data, 'GET');
}
// 采购合同列表
export function API_BUYCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/buy/page`, data, 'GET');
}
// 销售合同列表
export function API_SELLCONTRACTLIST(data) {
	return request(`${ENV.BASE_API}/api/contract/sell/page`, data, 'GET');
}
// 合同详情
export function API_CONTRACTDETAIL(data) {
	return request(`${ENV.BASE_API}/api/contract/${data.contractId}`, data, 'GET');
}
// 判断补录合同号是否重复
// export function API_OFFLINEBUYERORDEREXIST(data){
//     return request(`${ENV.BASE_API}/api/offline/buyer/order/exist`, data, 'POST', 2)
// }
// 登录 发送验证码
export function API_GETLOGINCODE(data) {
	return request(`${ENV.BASE_API}/api/getLoginVerifyCode`, data, 'POST');
}

export function API_GETLOGINBYMOBILE(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserId`, data, 'POST');
}

// 注册 发送验证码
export function API_GETREGISTERCODE(data) {
	return request(`${ENV.BASE_API}/api/getRegisterVerifyCode`, data, 'POST');
}

// 下载声明函模板
export function API_DOWNDECLARATION(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadDeclarationLetterTemplate`, data, 'POST', 2, 'blob');
}

// 下载申请表格
export function API_DOWNCERTAPPLYTABLE(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 下载证书吊销申请表格
export function API_downCertRevokeApplyTable(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadCertRevokeApplyTemplate`, data, 'POST', 2, 'blob');
}

// 更换操作员 下载证书申请表模板
export function API_CHANGEOPERATORDOWNCERTAPPLYTABLE(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}

// 更换操作员 下载证书申请表模板
export function API_CHANGEOPERATORDOWNLICENSETABLE(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 更换操作员 获取原操作员信息
export function API_GETOLDOPERATORINFO(data) {
	return request(`${ENV.BASE_API}/api/cfcaOperatorChange/getOldOperatorInfo`, data, 'GET');
}

// 下载数字证书申请授权书
export function API_DOWNLICENSE(data) {
	return request(`${ENV.BASE_API}/api/companyCert/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}

// // CFCA获取hash签名数据
// export function API_CFCAHASH(data){
//     return request(`${ENV.BASE_API}/api/cfca/getPdfHash`, data, 'POST', 2)
// }

// // CFCA获取pdf
// export function API_CFCAPDF(data){
//     return request(`${ENV.BASE_API}/api/cfca/composePdf`, data, 'POST', 2)
// }

// // CFCA验证
// export function API_CFCAVALID(data){
//     return request(`${ENV.BASE_API}/api/cfca/validCert`, data, 'POST')
// }

// 下载预览模板
export function API_DOWNLPREVIEWTE(url, data) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, data, 'GET', 2, 'blob');
}

// 下载企业管理员授权模板
export function API_DOWNLMANAGEAUTH(data) {
	return request(`${ENV.BASE_API}/api/userCenter/applyCompanyAuth/downloadAdminLicenseTemplate`, data, 'POST', 2, 'blob');
}

// 获取订单详情始发站信息
export function API_STATION(data) {
	return request(`${ENV.BASE_API}/api/area/bizStationList`, data, 'GET');
}

// 删除模板
export function API_DELETETEMPLATE(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/${data.id}/delete`, data, 'POST');
}

// 刷新登陆状态
export function API_REFRESHSTATUS(data) {
	return request(`${ENV.BASE_API}/api/userCenter/viewLoginInfo`, data, 'GET');
}

// 发货申请保存
export function API_DELIVERYSAVE(data) {
	return request(`${ENV.BASE_API}/api/deliver/save`, data, 'POST', 2);
}

// 收货确认详情
export function API_RECEIVECONFIRMINFO(data) {
	return request(`${ENV.BASE_API}/api/receive/${data.deliverId}`, data, 'GET');
}
// 收货确认
export function API_RECEIVESAVECHECK(data) {
	return request(`${ENV.BASE_API}/api/receive/receiveQuantity`, data, 'GET');
}

// 收货记录列表
export function API_RECEIVERECORDLIST(data) {
	return request(`${ENV.BASE_API}/api/receive/receiveRecordList`, data, 'GET');
}

// 收货记录列表——撤销收货
export function API_RECEIVERECORDCANCEL(data) {
	return request(`${ENV.BASE_API}/api/receive/cancel`, data, 'GET');
}

// 收货记录列表-撤销的收货记录列表
export function API_GetReceiveCancelList(data) {
	return request(`${ENV.BASE_API}/api/receive/cancelList`, data, 'GET');
}

// 收货记录详情
export function API_RECEIVERECORDINFO(data) {
	return request(`${ENV.BASE_API}/api/receive/${data.deliverId}/receiveRecordInfo`, data, 'GET');
}

// 代采购获取签名信息

export function API_GetToSigListDCG(data) {
	return request(`${ENV.BASE_API}/api/receive/getToSigList`, data, 'POST', 2);
}

// 采购——获取收货证明
export function API_GetReceiptCertificateInfo(data) {
	return request(`${ENV.BASE_API}/api/receive/receiptCertificateInfo`, data, 'POST', 2);
}

// 付款申请列表
export function API_PAYAPPLYLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/list`, data, 'GET');
}
// 付款申请发票汇总列表
export function API_PAYAPPinvoLYLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/getInvoiceSum`, data, 'POST', 2);
}
// 付款申请发票校验
export function payCheckInvoice(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/invoice`, data, 'POST', 2);
}

// 应付列表
export function API_GetPayableList(data) {
	return request(`${ENV.BASE_API}/api/receivable/pay/list`, data, 'GET');
}

// 应收列表
export function API_GetReceivableList(data) {
	return request(`${ENV.BASE_API}/api/receivable/receive/list`, data, 'GET');
}

// 获取收款账号
export function API_GETRECEIVEACCOUNT(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/receiveAccount`, data, 'GET');
}
// 获取资金来源
export function API_GETCAPITALSOURCE(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/capitalSource`, data, 'GET');
}
// 获取可追加付款的资金类型
export function API_GetAvailableProductFromPayment(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/getAvailableProductFromPayment`, data, 'GET');
}
// 追加付款列表
export function API_GetAdditionalPaymentList(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/list`, data, 'GET');
}
// 保存追加付款
export function API_SavePaymentAdditional(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/save`, data, 'POST', 2);
}
// 提交追加付款
export function API_SubmitPaymentAdditional(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/submit`, data, 'POST', 2);
}
// 是否显示追加付款按钮
export function API_AdditionalPaymentButtonShow(data) {
	return request(`${ENV.BASE_API}/api/paymentAdditional/additionalPaymentButtonShow`, data, 'GET');
}

// 查询货物信息
export function API_GETGOODSINFO(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsByPayType`, data, 'GET');
}
// 查询货物信息--动力煤应收船运预结算付款
export function API_GETSOURCEGOODSINFO(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/selectPreStatementDelivery`, data, 'GET');
}

// 查询发票信息
export function API_GETINVOICEINFO(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/relationInvoice`, data, 'GET');
}

// 下游合同审核前校验合同信息是否完整
export function API_JudgeContract(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/check/exist`, data, 'GET');
}
// 提交付款前校验合同信息是否完整
export function API_JudgeContractNew(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/check/exist`, data, 'GET');
}
// 保存付款
export function API_PAYSAVE(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/savePayment`, data, 'POST', 2);
}

// 全业务线--付款申请--获取全业务线数据
export function API_PayGetBizLineInfo(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/getBizLineInfo`, data, 'GET');
}

// 提交付款
export function API_PAYSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/submit/payment`, data, 'POST', 2);
}

// 获取付款记录列表
export function API_GETPAYRECORDLIST(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/list`, data, 'GET');
}
// 作废付款申请
export function API_GETPAYRECORDLISTZF(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/invalid`, data, 'POST', 2);
}

//全业务线--获取企业所有可用的资金类型
export function API_GETPAYBANK(data) {
	return request(`${ENV.BASE_API}/api/bankProductItem/getBankProductItem`, data, 'GET');
}

// 获取付款订单详情
export function API_PaymentApplyOrderDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/get/order/info`, data, 'GET');
}
// export function API_PaymentGoodsCalc(data) {
//     return request(`${ENV.BASE_API}/api/paymentApply/selectGoodsValueByOrderId`, data, 'GET')
// }

// 付款确认审批通过接口
export function API_PASSPAYMENTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/confirm/payment`, data, 'POST', 2);
}

// 付款确认审批拒绝接口
export function API_REJECTPAYMENTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/reject/payment/confirm`, data, 'POST');
}
// 收款确认审批通过接口
export function API_PASSCOLLECTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/confirm/repayment`, data, 'POST');
}

// 收款确认审批拒绝接口
export function API_REJECTCOLLECTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/reject/repayment/confirm`, data, 'POST');
}

// 删除付款记录
export function API_GETPAYRECORDCANCEL(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/cancel`, data, 'POST');
}

// 付款记录详情
export function API_GETPAYRECORDDETAIL(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/detail`, data, 'GET');
}

// 结算单开具列表
export function API_GETSETTLEAPPLYLIST(data) {
	return request(`${ENV.BASE_API}/api/statementApply/list`, data, 'GET');
}

// 结算单获取收货信息
export function API_GETSETTLEGOODSINFO(data) {
	return request(`${ENV.BASE_API}/api/statementApply/deliverBatch`, data, 'GET');
}
// 结算单获取收货信息或者货转信息
export function API_GETSETTLEGOODSINFOALL(data) {
	return request(`${ENV.BASE_API}/api/statementApply/deliverOrGoodsTransferInfo`, data, 'GET');
}
// 结算单获取合同基本信息

/**
 * @data string 结算单ID
 * 返回值示例 返回合同的基本信息
{
	"success": true,
	"message": "操作成功！",
	"code": 200,
	"result": {
		"no": "WHHX-NQRC1-202009-14",
		"quantity": 11111.00,
		"transType": "火运",
		"basicPrice": 250.00,
		"heatMin": "3000",
		"heatMax": "",
		"sulfur": "2",
		"vadMin": "",
		"vadMax": "",
		"water": "",
		"serviceRate": null,
		"settledAmount": 0,
		"deliveryType": 1,
		"ash": null,
		"vad": null,
		"coalType": 1,
		"contractTemplate": 5,
		"oaMobile": "13556180053",
		"oaUserName": "方泽丹"
	},
	"timestamp": 1599206357509
}
 * */
export function API_GETSETTLECONTRACTINFO(data) {
	return request(`${ENV.BASE_API}/api/statementApply/getContractBasicInfo`, data, 'GET');
}

// 判断订单下是否存在非终态结算单
export function API_HasNonTerminalStatement(data) {
	return request(`${ENV.BASE_API}/api/statementApply/hasNonTerminalStatement`, data, 'GET');
}

// 结算单保存
export function API_GETSETTLESAVE(data) {
	return request(`${ENV.BASE_API}/api/statementApply/save`, data, 'POST', 2);
}

// 结算单详情
export function API_GETSETTLEDETAIL(data) {
	return request(`${ENV.BASE_API}/api/statement/detail`, data, 'GET');
}

// 结算单提交
export function API_GETSETTLESUBMIT(data) {
	return request(`${ENV.BASE_API}/api/statementApply/submit`, data, 'POST', 2);
}

// 结算单申请盖章
export function API_GETSETTLESUBMITCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/statementApply/submitConfirm`, data, 'POST', 2);
}

// 结算单详情页提交
export function API_GETSETTLEDETAILSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/statement/submit`, data, 'POST');
}

// 结算单详情盖章
export function API_GETSETTLESUBMITCONFIRMDETAIL(data) {
	return request(`${ENV.BASE_API}/api/statement/submitConfirm`, data, 'POST');
}

// 结算单 提交盖章成功并提交对方确认
export function API_SUBMITTOCONFIRMSETTLE(data) {
	return request(`${ENV.BASE_API}/api/statementApply/${data.statementId}/toConfirm`, data, 'POST');
}

// 结算单  提交盖章详情
export function API_SETTLESUBMITINFO(data) {
	return request(`${ENV.BASE_API}/api/statementApply/${data.statementId}/submitInfo`, data, 'GET');
}

// 结算单  获取待签名数据
export function API_SETTLESUBMITGETTOSIGLIST(data) {
	return request(`${ENV.BASE_API}/api/statementApply/submit/getToSigList`, data, 'POST', 2);
}

// 结算单  提交盖章判断结算单是否已作废
export function API_SETTLESUBMITSEAL(data) {
	return request(`${ENV.BASE_API}/api/statementApply/${data.statementId}/sealIdentify`, data, 'GET');
}

// 结算单确认列表
export function API_GETSETTLECONFIRMLIST(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/list`, data, 'GET');
}

// 结算单确认提交
export function API_GETSETTLELISTCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/confirm`, data, 'POST');
}

// 结算单确认盖章
export function API_GETSETTLECONFIRMSUBMIT(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/confirmSubmit`, data, 'POST');
}

// 结算单确认盖章
export function API_STATEMENTSEAL(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/seal`, data, 'POST', 2);
}

// 结算单确认推送OA审批
/* export function API_STATEMENTCONFIRMTOOA(data) {
    return request(`${ENV.BASE_API}/api/statementConfirm/confirmToOa`, data, 'POST')
} */

// 结算单盖章确认后保存
export function API_STATEMENTSEALTOCONFIRM(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/sealConfirm`, data, 'POST');
}

// 结算单信息驳回
export function API_SETTLECONFIRMREJECT(data) {
	return request(`${ENV.BASE_API}/api/statementConfirm/cancel`, data, 'POST');
}

// 结算单列表进入前确定是否维护开票信息
export function API_SETTLELISTCONFIRMINVOICE() {
	return request(`${ENV.BASE_API}/api/statementApply/getCompanyInvoice`, '', 'GET');
}

//结算单作废新需求--start
//结算单能否作废校验
export function API_CheckSettlementCancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/check`, data, 'GET');
}
//结算单作废确认书pdf地址
export function API_GetSettlementCancelPDF(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/create/pdf`, data, 'GET');
}
//提交结算单作废确认
export function API_SubmitSettlementCancel(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/save`, data, 'POST', 2);
}
//结算单作废列表
export function API_SettlementCancelList(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/list`, data, 'GET');
}
// 结算单作废列表-取消
export function API_SettlementCancelDelete(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/${data.statementInvalidId}/cancel`, data, 'GET');
}
//结算单作废盖章 校验是否可盖章
export function API_SettlementCancelStampCheck(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/${data.id}/canSign`, data, 'GET');
}
// 结算单作废盖章  获取待签名数据
export function API_SettlementCancelGetToSigList(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/sign/getToSigList`, data, 'POST', 2);
}
// 结算单作废盖章 提交盖章成功并提交对方确认
export function API_SettlementCancelSignToConfirm(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/${data.id}/sign/toConfirm`, data, 'GET');
}
// 结算单作废盖章/确认盖章 -自动盖章
export function API_SettlementCancelCfcaStatementAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/statementInvalidAutoSignature`, data, 'POST', 2);
}
// // 结算单作废 -自动盖章
// export function API_SettlementCancelConfirmCfcaStatementAutoSignature(data) {
//     return request(`${ENV.BASE_API}/api/cfca/statementInvalidAutoConfirm`, data, 'POST', 2)
// }

//结算单作废确认 校验是否可确认
export function API_SettlementCancelConfirmCheck(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/${data.id}/canConfirm`, data, 'GET');
}
// 结算单作废确认  获取待签名数据
export function API_SettlementCancelConfirmGetToSigList(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/confirm/getToSigList`, data, 'POST', 2);
}
// 结算单作废确认 提交确认成功并提交对方确认
export function API_SettlementCancelConfirmSignToConfirm(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/confirm/success`, data, 'GET');
}
// 结算单作废确认 -驳回
export function API_SettlementCancelConfirmReject(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/confirm/reject`, data, 'GET');
}
// 结算单作废-查看结算单pdf
export function API_SettlementCancelViewPdf(data) {
	return request(`${ENV.BASE_API}/api/statement/invalid/statement/pdf/view`, data, 'GET');
}

// 补录线下结算单
// 线下结算单列表
export function API_GetOffinleSettleList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/page`, data, 'GET');
}
// 线下结算单下载附件
export function API_DownloadSettleFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/download`, data, 'GET', 1, 'blob');
}
// 线下结算单删除
export function API_DeleteSettle(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/delete`, data, 'GET');
}
// 补录合同列表
export function API_TerminalContractList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/terminalContractPage`, data, 'GET');
}
// 提交线下补录结算单
export function API_OffinleSettleSave(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/saveOrUpdate`, data, 'POST', 2);
}
// 线下结算单详情
export function API_OffinleStatementDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/detail`, data, 'GET');
}
// 判断当前合同是否已有结算日期相同、相同的结算单号的结算单
export function API_JudgeStatementDate(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/existSame`, data, 'GET');
}
// 提交时判断是否需要对方确认
export function API_JudgeNeedConfirm(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/needConfirm`, data, 'GET');
}
// 从业务动态监控的补录结算单入口进来，反显合同信息
export function API_JumpFromMonotoring(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/terminalContractDetail`, data, 'GET');
}

// 获取发票列表
export function API_GETINVOICELIST(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/list`, data, 'GET');
}

//发票列表 发票关联订单
export function API_INVOICES_LINK_ORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/batch/invoiceOrderRel/save`, data, 'POST', 2);
}

// 铁路货运跟踪
export function API_GETTRAINRECORD(data) {
	// return request(`${ENV.BASE_API}/api/deliver/${data.id}/trailRecordTrain`, data, 'GET')
	return request(`${ENV.BASE_API}/api/deliver/trailRecordTrain`, data, 'GET');
}

// 铁路货运跟踪-添加银行查看轨迹接口
export function API_SOAGETTRAINRECORD(data) {
	// return request(`${ENV.BASE_API}/api/deliver/${data.id}/trailRecordTrain`, data, 'GET')
	return request(`${ENV.BASE_API}/soa/track/api/trailRecordTrain`, data, 'GET');
}

// 获取云控单点登录票据
export function API_SSO_CCSFIN_GET(data) {
	return request(`${ENV.BASE_API}/api/sso/getTicket`, data, 'GET');
}

// 保存发票
export function API_INVOICESAVE(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/save`, data, 'POST', 2);
}

// 发票详情
// export function API_INVOICEDETAIL(data) {
//     return request(`${ENV.BASE_API}/api//invoiceDO/detail/${data.id}`, '','GET');
// }

//获取订单是否有付款
export function API_ORDER_HAS_PAYMENT(data) {
	/**
	 * data.orderSerialNo 订单id
	 * data.code         发票代码
	 * data.no           发票号码
	 * */
	return request(`${ENV.BASE_API}/api/invoiceDO/hasPayment`, data, 'GET');
}
//获取关联订单列表
export function API_GET_LINKORDER(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/order/list`, data, 'GET');
}

// 发票四要素识别
export function API_INVOICEELEMENTSCAN(data) {
	return request(`${ENV.BASE_API}/api/invoice/elementScan`, data, 'POST', 2);
}

// 发票批量识别图片
export const API_INVOICEBATCHUPLOAD_IMG = `${ENV.BASE_API}/api/invoice/imgBatchScan`;

// 发票批量识别EXCEL
export const API_INVOICEBATCHUPLOAD_EXCEL = `${ENV.BASE_API}/api/invoice/excelBatchScan`;

// 发票批次保存
export function API_INVOICEBATCHSAVE(data) {
	return request(`${ENV.BASE_API}/api/invoice/batch/save`, data, 'POST', 2);
}

// 发票批次列表
export function API_INVOICEBATCHLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batch/list`, data, 'GET');
}
// 发票Excel批次列表数据
export function API_InvoiceBatchExcelList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchExcel/list`, data, 'GET');
}

// 发票批次详情数据图片
export function API_INVOICEBATCHITEMLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItem/list`, data, 'GET');
}

// 发票批次详情数据EXCEL
export function API_InvoiceBatchExcelItemList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemExcel/list`, data, 'GET');
}

// 发票批次处理详情数据图片
export function API_INVOICEBATCHOPERATEITEMLIST(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemOperate/list`, data, 'GET');
}

// 发票批次处理详情数据EXCEL
export function API_InvoiceBatchOperateExcelItemList(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemOperateExcel/list`, data, 'GET');
}

// 发票批次详情删除图片
export function API_INVOICEBATCHITEMDELETE(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItem/deleteAll`, data, 'POST');
}

// 发票批次删除EXCEL
export function API_InvoiceBatchExcelDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchItemExcel/deleteAll`, data, 'POST');
}

// 发票重新识别图片
export function API_INVOICEREADD(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchEdit/reAdd/${data.itemId}`, '', 'GET');
}
// 发票重新识别EXCEL
export function API_InvoiceReAddExcel(data) {
	return request(`${ENV.BASE_API}/api/invoice/batchEditExcel/reAdd/${data.itemId}`, '', 'GET');
}
export function API_EXPORT_INVOICE(type = 2, DATA) {
	/**
	 *    @type 1 下载发票附件  2导出发票四要素
	 */
	let path = '';
	if (type === 1) {
		path = `/api/invoice/common/batchDownloadFileByIds`;
	} else {
		path = `/api/invoice/common/exportXlsByIds`;
	}
	return request(ENV.BASE_API + path, DATA, 'GET', 2, 'blob');
}
// export function API_EXPORT_INVOICE(type=2,DATA){
//     /**
//      *	@type 1 下载发票附件  2导出发票四要素
//      */
//     let path='';
//     if(type===1) {
//         path = `/api/invoiceDO/attachment/batchDownloadFile/ids`;
//     }
//     else{
//         path=`/api/invoiceDO/element/exportXls/ids`
//     }
//     return request(ENV.BASE_API+path, DATA, 'GET', 2, 'blob')
// }

// // 批量导出发票详情EXCEL
// export function API_BatchExportInvoice(data){
//     return request(`${ENV.BASE_API}/api/invoice/exportXls`, data, 'GET', 2, 'blob')
// }

// // 批量导出发票详情PDF
// export function API_BatchExportInvoicePDF(data){
//     return request(`${ENV.BASE_API}/api/invoice/pdf?id=${data}`, '', 'GET', 2, 'blob')
// }

// 融资
export function API_FinancingList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/list`, data, 'GET');
}
export function API_FinancingListAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/toAuditList`, data, 'GET');
}

export function API_FinancingAdvanceList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/audit/list`, data, 'GET');
}
export function API_FinancingAdvanceMangList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/list`, data, 'GET');
}

export function API_Financinginvalid(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/invalid`, data, 'POST', 2);
}
export function API_FinancingAdvanceinvalid(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/invalid`, data, 'POST', 2);
}
export function API_FinancingbankList(data) {
	return request(`${ENV.BASE_API}/api/financing/bankList`, data, 'GET');
}
export function API_FinancingsellerList(data) {
	return request(
		`${ENV.BASE_USER_API}/api/company/findAllByTypeAndNameLike`,
		{ ...data, companyTypes: ['CORE_COMPANY'] },
		'POST',
		2
	);
}
export function API_FinancingAdvanceListLog(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/auditedList`, data, 'GET');
}
export function API_FinancingExportXls(data) {
	// 核心企业融资记录导出
	return request(`${ENV.BASE_API}/api/financing/apply/export`, data, 'GET', 1, 'blob');
}
export function API_FinancingDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/detail`, data, 'GET');
}
export function API_FinancingRDDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/getFinancingOrder`, data, 'GET');
}
export function API_FinancingRDSubmit(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/financingOrderRegister`, data, 'POST', 2);
}

export function API_FinancingJRDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/${data.financingApplyId}/auditDetail`, data, 'GET');
}
export function API_FinancingAdvanceDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/${data.financingApplyId}/auditDetail`, data, 'GET');
}
export function API_FinancingAdvanceDouDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/view/${data.financingApplyId}/detail`, data, 'GET');
}
export function API_FinancingDetailFK(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/financingLoanRepay`, data, 'GET');
}
export function API_FinancingAdvanceDetailFK(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/view/${data.financingApplyId}/financingLoanRepay`, data, 'GET');
}
export function API_FinancingDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetailViewFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/viewContract`, data, 'POST', 2);
}
export function API_FinancingAdvanceDetailViewFile(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/viewContract`, data, 'POST', 2);
}
export function API_FinancingDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/view/${data.financingApplyId}/downloadZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingJRDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplyreceivableList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/receivableList`, data, 'GET');
}
export function API_FinancingApplyreceivableListPledge(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/apply/receivableList`, data, 'GET');
}
export function API_FinancingApplypledgeDa(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/confirm`, data, 'POST', 2);
}
export function API_FinancingApplypledgeCashDa(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/confirm`, data, 'POST', 2);
}
export function API_FinancingApplypledge(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/product`, data, 'GET');
}
export function API_FinancingLoanListpledge(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pledge/list`, data, 'GET');
}
export function API_FinancingLoanSumDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/summaryFinancingLoan`, data, 'GET');
}
export function API_FinancingLogpledge(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/apply/auditedList`, data, 'GET');
}
export function API_AssetsPledgeBankPro(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/getPledgeBankProduct`, data, 'GET');
}
export function API_AssetsWareList(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/storage/list`, data, 'GET');
}
export function API_GetPledgePayableList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/list/recv`, data, 'GET');
}
export function API_AssetsGoodsModalList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/inbound/list`, data, 'GET');
}
export function API_AssetsPriceDing(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/listPrice`, data, 'GET');
}
export function API_AssetsPriceDingList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/listByPage`, data, 'GET');
}
export function API_AssetsPriceDingDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/risk/detail`, data, 'GET');
}
export function API_SubstitutionListLOGMAINZF(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/cancel`, data, 'POST', 1);
}
export function API_SubstitutionListLOGMAINPUSH(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/rePush`, data, 'POST', 1);
}
export function API_ReplenishmentListMAINZF(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/cancel`, data, 'POST', 1);
}

export function API_ReplenishmentListMAINPUSH(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/rePush`, data, 'POST', 1);
}

export function API_GetAssetsPledgeDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/detail`, data, 'GET');
}
export function API_AssetsGoodsSave(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/modify`, data, 'POST', 2);
}
export function API_PledgeExchangeList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/list`, data, 'GET');
}
export function API_PledgeExchangeDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/finance/detail`, data, 'GET');
}
export function API_PledgeExchangeDetailApply(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/detail`, data, 'GET');
}
export function API_PledgeExchangeListLOG(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/list`, data, 'GET');
}
export function API_PledgeExchangeLOGDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/detail`, data, 'GET');
}

export function API_PledgeExchangeLOGDetaildownloadFile(data) {
	return request(
		`${ENV.BASE_API}/api/financing/pledge/exchange/view/${data.contractFileId}/downloadFile`,
		data,
		'POST',
		2,
		'blob'
	);
}
export function API_PledgeExchangeLOGDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/view/${data.id}/downloadZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeReplyList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/list`, data, 'GET');
}
export function API_PledgeReplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/detail`, data, 'GET');
}
export function API_PledgeReplyDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplyDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/view/${data.id}/downloadZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/financing/list`, data, 'GET');
}
export function API_PledgeFinExpireApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/loan/detail`, data, 'GET');
}

export function API_PledgeFinExpireApplyDetailXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/repayFileList`, data, 'GET');
}

export function API_PledgeFinExpireDetaildownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/viewContract`, data, 'POST', 2);
}

export function API_PledgeFinExpireDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeFinExpireDetailrepaymentTrial(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/apply/repaymentTrial`, data, 'POST', 2);
}
export function API_PledgeReplenList(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/notice/list`, data, 'GET');
}
export function API_PledgeReplenDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/${data.noticeId}/detail`, data, 'GET');
}
export function API_PledgeReplenDetaildownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/view/${data.contractFileId}/downloadFile`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenDetaildownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/view/${data.noticeId}/downloadZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeExchangeApplyXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/exchangeFileList`, data, 'GET');
}
export function API_PledgeExchangeApplydownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/viewContract`, data, 'POST', 2);
}
export function API_PledgeExchangeApplydownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeExchangeApplydownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}

export function API_PledgeReplenApplyXie(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/addGoodsFileList`, data, 'GET');
}
export function API_PledgeReplenApplydownloadFileView(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/viewContract`, data, 'POST', 2);
}

export function API_PledgeReplenApplydownloadFile(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenApplydownloadFileAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_PledgeReplenApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/repay/save`, data, 'POST', 2);
}
export function API_PledgeReplenAddSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/add/save`, data, 'POST', 2);
}
export function API_AssetsGoodsModalFINList(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/addgoods/inbound/list`, data, 'GET');
}
export function API_PledgeExchangeAddSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pledge/exchange/save`, data, 'POST', 2);
}

export function API_FinancingApplycompanyCredit(data) {
	return request(`${ENV.BASE_API}/api/creditLine/assetCredit`, data, 'GET');
}
export function API_FinancingApplyXieyi(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.receivableId}/financingApplyContractList`, data, 'GET');
}
export function API_FinancingApplyAdvanceXieyi(data) {
	return request(
		`${ENV.BASE_API}/api/financing/pre/coreCompany/apply/${data.receivableId}/financingApplyContractList`,
		data,
		'GET'
	);
}
export function API_FinancingApplyXieyiView(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/viewContract`, data, 'POST', 2);
}
export function API_FinancingAdvanceApplyXieyiView(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/viewContract`, data, 'POST', 2);
}
export function API_FinancingApplyXieyiDown(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceApplyXieyiDown(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/downloadContract`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplyXieyiDownAll(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingAdvanceApplyXieyiDownAll(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/downloadContractZip`, data, 'POST', 2, 'blob');
}
export function API_FinancingApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/save`, data, 'POST', 2);
}
export function API_FinancingApplySaveHN(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/financeSave`, data, 'POST', 2);
}
export function API_FinancingAdvanceApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/save`, data, 'POST', 2);
}
export function API_FinancingCoreCompanyApplySave(data) {
	// 核心企业融资申请
	return request(`${ENV.BASE_API}/api/financing/coreCompany/apply/save`, data, 'POST', 2);
}
export function API_FinancingSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAdvanceSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/supplierSignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/coreCompanySignPdfHashList`, data, 'GET');
}

export function API_FinancingJRGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankSignPdfHashList`, data, 'GET');
}
export function API_FinancingMAINGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanySignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceMAINGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanySignPdfHashList`, data, 'GET');
}
export function API_FinancingAdvanceMGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderSignPdfHashList`, data, 'GET');
}
export function API_FinancingSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/supplierKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/coreCompanyKeySign`, data, 'POST', 2);
}

export function API_FinancingJROnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAuditPass`, data, 'POST', 2);
}
export function API_FinancingJRSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankKeySign`, data, 'POST', 2);
}
export function API_FinancingMAINOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAuditPass`, data, 'POST', 2);
}
export function API_FinancingMAINSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyKeySign`, data, 'POST', 2);
}

export function API_FinancingAdvanceMAINSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceMSignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderKeySign`, data, 'POST', 2);
}
export function API_FinancingAdvanceMOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAuditPass`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAINOnlySignSave(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAuditPass`, data, 'POST', 2);
}

export function API_CfcaFinJRAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/${data.financingApplyId}/supplierAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinMAINAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAutoSign`, data, 'POST', 2);
}

export function API_CfcaFinAdvanceAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAdvanceMAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAutoSign`, data, 'POST', 2);
}
export function API_CfcaFinAdvanceMAINAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/financing/pre/apply/${data.financingApplyId}/coreCompanyAutoSign`, data, 'POST', 2);
}
export function API_FinancingAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankAuditReject`, data, 'POST', 2);
}
export function API_FinancingMAINAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/coreCompanyAuditReject`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAINAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/coreCompanyAuditReject`, data, 'POST', 2);
}
export function API_FinancingAdvanceMAudit(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/traderAuditReject`, data, 'POST', 2);
}
export function API_FinancingSync(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pushAndSyncLoan`, data, 'POST', 2);
}

export function API_FinancingJRSync(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/${data.loanId}/syncRepay`, data, 'POST', 2);
}
export function API_FinancingAuditSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAdvanceAuditSignList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/pre/${data.financingApplyId}/unsignedContractList`, data, 'GET');
}
export function API_FinancingAuditGetSigList(data) {
	return request(`${ENV.BASE_API}/api/financing/audit/bankSignPdfHashList`, data, 'GET');
}
export function API_FinancingListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/auditedList`, data, 'GET');
}
export function API_FinancingJiejuJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/loanBankDetail`, data, 'GET');
}
export function API_FinancingListMAIN(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/auditedList`, data, 'GET');
}
export function API_GetLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/list`, data, 'GET');
}
export function API_GetLoanListConfirm(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/receive/confirm/list`, data, 'GET');
}

export function API_GetLoanListMAINCOUNT(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/countRepayType`, data, 'GET');
}
export function API_GetLoanListAdvanceMAINCOUNT(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/countReceiveConfirm`, data, 'GET');
}

export function API_GetAdvanceLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/list`, data, 'GET');
}
export function API_goAdvanceLoanCheck(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/validate/${data.loanId}`, data, 'GET');
}
export function API_GetLoanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/financingLoanRepay`, data, 'GET');
}
export function API_GetAdvanceLoanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/pre/${data.loanId}/financingLoanRepay`, data, 'GET');
}
export function API_GetLoanHuanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/financingRepayRegister`, data, 'GET');
}
export function API_GetLoanFangDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.loanId}/financing/detail`, data, 'GET');
}
export function API_GetLoanListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/bankList`, data, 'GET');
}
export function API_GetLoanListJRFang(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/list/loan`, data, 'GET');
}
export function API_GetLoanDetailListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/queryLoanDetailList`, data, 'GET');
}
export function API_ExportLoanDetailListJR(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/loanDetailList/export`, data, 'GET', 2, 'blob');
}
export function API_ExportLoanDetailListMAIN(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/list/export`, data, 'GET', 2, 'blob');
}

export function API_LoanApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/applySave`, data, 'POST', 2);
}
export function API_GetLoanApplyDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/apply/${data.loanId}`, data, 'GET');
}
export function API_GetLoanApplyReceipt(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/receive/confirm`, data, 'POST', 2);
}

export function API_LoanApplySaveNS(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/repayPrincipal`, data, 'POST', 2);
}
export function API_LoanAdvanceApplySave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/pre/applySave`, data, 'POST', 2);
}
export function API_RepayAutoRepay(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/autoRepay/${data.loanId}`, '', 'POST', 2);
}
export function API_LoanFangSave(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/registerByAsset`, data, 'POST', 2);
}
export function API_LoanHuanSave(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/register`, data, 'POST', 2);
}
export function API_LoanZuofei(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/${data.loanId}/invalidLoanByAsset`, data, 'PUT', 2);
}
export function API_AssetsUpdateTrain(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genTrainTrack`, data, 'GET');
}
export function API_AssetsUpdateShip(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/genShipTrack`, data, 'GET');
}
export function API_GetFinancingStatusTip(data) {
	return request(`${ENV.BASE_API}/api/financing/getStatusTip`, data, 'GET');
}

// 我的服务费

// // 服务费结算单列表
export function API_GetServiceFeeStatementList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/list`, data, 'POST', 2);
}
// 服务费结算单详情
export function API_GetServiceFeeStatementDetail(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/beforeConfirm`, data, 'GET');
}
// 服务费自动盖章
export function API_CfcaServicefeeConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/serviceFeeStatementAutoSignature`, data, 'GET');
}
// 历史数据--服务费结算单预览--展示详情
export function API_ServiceFeeStatementPreviewContract(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/preview`, data, 'GET');
}
//新数据--服务费结算单预览--展示详情
export function API_ServiceFeeDetailNew(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/detail`, data, 'GET');
}
// 盖章成功保存服务费结算单
export function API_ServiceFeeStatementSave(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/confirmToSeal`, data, 'GET');
}
// 服务费结算单确认获取签章信息
export function API_ServiceFeeStatementGetSigList(data) {
	return request(`${ENV.BASE_API}/api/serviceFee/${data.serviceFeeId}/seal/getPdfHashList`, data, 'GET');
}

// 核心企业盖章成功保存服务费结算单
export function API_ServiceFeeStatementCcsSealSave(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeStatement/${data.serviceFeeStatementId}/sealSave`, data, 'POST', 2);
}

// 核心企业确认盖章详情
export function API_ServiceFeeStatementConfirmInfo(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeStatement/${data.serviceFeeStatementId}/confirmInfo`, data, 'GET');
}

// 核心企业列表获取待签名数据
export function API_ServiceFeeStatementGetConfirmSigList(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeStatement/${data.serviceFeeStatementId}/getToSigList`, data, 'GET');
}

// 服务费流水明细
export function API_ServiceFeeFlowList(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/list`, data, 'GET');
}
// 导出服务费流水明细
export function API_ServiceFeeExportXls(data) {
	return request(`${ENV.BASE_API}/api/serviceFeeBill/exportXls`, data, 'GET', 1, 'blob');
}

// 货转凭证开具列表
export function API_GetGoodsTransferApplyList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/goodsTransferApplyList`, data, 'GET');
}

// 货转凭证记录列表
export function API_GetGoodsTransferRecordList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/goodsTransferRecordList`, data, 'GET');
}
// 全业务线--货转附件打包下载
export function API_GetGoodsTransferDownload(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/downloadZip`, data, 'GET', 1, 'blob');
}

// 货转记录取消
export function API_GetGoodsTransferCancel(goodsTransferId) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/${goodsTransferId}/cancel`, '', 'GET');
}

// 货转记录作废
export function API_GoodsTransferInvalid(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/invalid`, data, 'POST');
}

// 货转记录盖章详情
export function API_GetGoodsTransferSubmitInfo(goodsTransferId) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/${goodsTransferId}/submitInfo`, '', 'GET');
}

// 货转盖章并提交
export function API_GoodsTransferSubmitToConfirm(goodsTransferId) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/${goodsTransferId}/toConfirm`, '', 'POST', 2);
}

//货转-待确认状态下-点击确认-驳回货转
export function API_GoodsTransferRejectConfirm(data, no) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/${no}/sealToReject`, data, 'POST');
}
//货转-待确认状态下-盖章获取signure
export function API_GoodsTransferConfirmAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferConfirmAutoSignature`, data, 'POST', 2);
}
//货转-待确认状态下-盖章获取
export function API_GoodsTransferConfirmGetToSigList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/confirm/getToSigList`, data, 'POST', 2);
}
//货转-待确认状态下-确认盖章
export function API_postApiGoodsTransferConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransfer/confirm/${goodsTransferNo}/sealToConfirm`, 'POST');
}

// 根据企业ID获取对应的账户信息列表
export function API_GetCompanyAccountList(companyId) {
	return request(`${ENV.BASE_API}/api/companyAccount/companyAccountList/${companyId}`, '', 'GET');
}

// 船运轨迹实时位置
export function API_GetSingleShip(data) {
	return request(`${ENV.BASE_API}/api/deliver/getSingleShip`, data, 'GET');
}
// 船运轨迹信息
export function API_GetShipDeliveryInfo(data) {
	return request(`${ENV.BASE_API}/api/deliver/getShipDeliveryInfo`, data, 'GET');
}

// 船运历史轨迹
export function API_GetShipTrack(data) {
	return request(`${ENV.BASE_API}/api/deliver/getShipTrack`, data, 'GET');
}

// 船运历史轨迹判断
export function API_GetShipTrackFlag(data) {
	return request(`${ENV.BASE_API}/api/deliver/getShipTrackFlag`, data, 'GET');
}

// 下面几个接口（云控使用的船舶信息）都不需要权限-----------start
// 云控使用的船舶信息 —— 货运轨迹
export function API_GetShipGetShipDeliveryInfo(data) {
	return request(`${ENV.BASE_API}/api/ship/getShipDeliveryInfo`, data, 'GET');
}

export function API_GetShipDeliverInfoShips(deliverId, data) {
	return request(`${ENV.BASE_API}/api/ship/deliverInfoShips/${deliverId}`, data, 'GET');
}
// 船运-添加银行查看轨迹接口
export function API_SOAGetShipDeliverInfoShips(deliverId, data) {
	return request(`${ENV.BASE_API}/soa/track/api/deliverInfoShips/${deliverId}`, data, 'GET');
}

// 云控使用的船舶信息 —— 船运历史轨迹判断
export function API_GetShipGetShipTrackFlag(data) {
	return request(`${ENV.BASE_API}/api/ship/getShipTrackFlag`, data, 'GET');
}
// 云控使用的船舶信息 —— 船运历史轨迹判断-添加银行查看轨迹接口
export function API_SOAGetShipGetShipTrackFlag(data) {
	return request(`${ENV.BASE_API}/soa/track/api/getShipTrackFlag`, data, 'GET');
}

// 云控使用的船舶信息 —— 船运历史轨迹信息
export function API_GetShipGetShipTrack(data) {
	return request(`${ENV.BASE_API}/api/ship/getShipTrack`, data, 'GET');
}

// 云控使用的船舶信息 —— 船运实时位置
export function API_GetShipGetSingleShip(data) {
	return request(`${ENV.BASE_API}/api/ship/getSingleShip`, data, 'GET');
}
// 上面几个接口（云控使用的船舶信息）都不需要权限-----------end

// 获取oa付款详情信息
export function API_GetOaPayDetail(serialNo) {
	return request(`${ENV.BASE_API}/api/OAPaymentAudit/paymentDetail/${serialNo}`, '', 'GET');
}

// 获取通知消息列表
export function API_GetNoticeList(data) {
	return request(`${ENV.BASE_API}/api/sys/message/list`, data, 'GET');
}
// 获取预警消息列表
export function API_GetWarningList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/page`, data, 'GET');
}
// 获取预警消息列表
export function API_GetInventoryList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/listRestByPage`, data, 'GET');
}
// 获取预警消息列表
export function API_GetInventoryRuleNoList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/ruleNoVOList`, data, 'GET');
}
//消息中心-预警消息-价格下跌预警
export function API_GetPriceWarningList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/page/market`, data, 'POST', 2);
}
//消息中心-预警消息-价格下跌预警
export function API_GetPriceWarningDetail(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/page/market/detail`, data, 'GET');
}
//消息中心-预警消息-价格下跌预警-状态统计
export function API_GetPriceWarningStatus(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/page/market/statusCount`, data, 'POST', 2);
}
//消息中心-预警消息-库存监控预警-状态统计
export function API_GetInventoryWarningStatus(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/statusList`, data, 'GET');
}
//消息中心-预警消息-库存监控预警-预警申诉
export function API_PostInventorySaveComplainData(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/saveComplainData`, data, 'POST', 2);
}
//消息中心-预警消息-库存监控预警-预警详情
export function API_GetInventoryWarningDetail(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/inventoryAlert/detail`, data, 'GET');
}
// 获取预警消息列表-头部
export function API_GetWarningHeaderList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/listRiskAlertMessage`, data, 'GET');
}
// 获取预警消息列表
export function API_GetWarningCount(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/getStatusCount`, data, 'GET');
}
// 获取预警消息列表
export function API_GetAlertTypeBelongList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/alertTypeBelongList?ruleTypeList=TRADE,AFTER_LOAN,OTHER`, data, 'GET');
}

// 已读通知消息
export function API_SetReadMessage(data) {
	return request(`${ENV.BASE_API}/api/sys/message/read/${data}`, '', 'POST', 2);
}

// 全部已读
export function API_SetReadAll() {
	return request(`${ENV.BASE_API}/api/sys/message/readAll`, '', 'POST', 2);
}

//获取业务员信息
export function API_GetSalesMan(userName) {
	return request(`${ENV.BASE_API}/api/paymentApply/loadOaUserByUserName?userName=${encodeURIComponent(userName)}`, '', 'GET', 2);
}

//OA人员是否存在
export function API_oaUserExists(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/oaUserExists`, data, 'GET');
}

// //获取表格字段自定义排序内容
export function API_GetTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/load`, data, 'GET');
}

//保存表格字段自定义排序内容
export function API_SaveTableSorter(data) {
	return request(`${ENV.BASE_API}/api/select/sort/save`, data, 'POST', 2);
}

//联系人删除模版
export function API_DeleteContacts(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/delete`, data, 'POST');
}

//添加联系人使用频次
export function API_UpdateUseCount(data) {
	return request(`${ENV.BASE_API}/api/textTemplate/update/useCount`, data, 'GET', 2);
}

//获取服务费信息
export function API_GetServiceInfo(data) {
	return request(`${ENV.BASE_API}/api/service/charge/template`, data, 'POST', 2);
}

//判断是否有服务费协议模版
export function API_hasServiceTemplate(data) {
	return request(`${ENV.BASE_API}/api/orderBuy/hasServiceTemplate`, data, 'GET', 2);
}

//对接oa,交易凭证一键下载（多个文件）
export function API_OneClickDownload(data) {
	return request(`${ENV.BASE_API}/api/OAPaymentAudit/paymentDetail/batchDownloadFile`, data, 'GET', 1, 'blob');
}

//对接oa,修改结算单
export function API_modifyOASettlement(data) {
	return request(`${ENV.BASE_API}/api/OAStatementAudit/modifyInfo/${data.statementId}`, '', 'GET');
}
//对接oa,修改结算单,获取收货信息
export function API_getSettleGoodInfo(data) {
	return request(`${ENV.BASE_API}/api/OAStatementAudit/deliverBatch?orderId=${data.orderId}`, '', 'GET');
}
//对接oa,保存修改购的结算单
export function API_saveSettle(data) {
	return request(`${ENV.BASE_API}/api/OAStatementAudit/save`, data, 'POST', 2);
}
//对接oa,预览结算单
export function API_previewSettle(data) {
	return request(`${ENV.BASE_API}/api/OAStatementAudit/previewStatement`, data, 'POST', 2);
}
// 获取托运人列表（非火运）
export function API_getApiDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/deliver/shipper`, data, 'GET');
}

// 联运管家
// 联运管家火运-获取托运人列表
export function API_getApiTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/shipper/list`, data, 'GET');
}

// 联运管家火运-推送托运人
export function API_saveTrainDeliverShipper(data) {
	return request(`${ENV.BASE_API}/api/waybill/sync/shipper`, data, 'GET');
}

// 联运管家火运-保存运单信息
export function API_saveDeliverInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/save`, data, 'POST', 2);
}
// 联运管家火运-收发货获取轨迹详情
export function API_getRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/trajectory/detail`, data, 'GET');
}
export function API_getSoaTrailRecordTrain(data) {
	return request(`${ENV.BASE_API}/soa/track/api/trailRecordTrain/waybillId`, data, 'GET');
}
export function API_getSoaBuildWaybillInfoVO(data) {
	return request(`${ENV.BASE_API}/soa/track/api/buildWaybillInfoVO`, data, 'GET');
}
export function API_getApiBuildWaybillInfoVO(data) {
	return request(`${ENV.BASE_API}/api/waybill/buildWaybillInfoVO`, data, 'GET');
}
// 联运管家火运-小工具实时获取轨迹详情
export function API_getActualRouteInfo(data) {
	return request(`${ENV.BASE_API}/api/waybill/actual/trajectory/detail`, data, 'GET');
}
// 联运管家火运--根据运单号获取运单信息
export function API_getDeliverInfoTrains(data) {
	return request(`${ENV.BASE_API}/api/waybill/fill/deliver/info`, data, 'POST', 2);
}
// 获取车皮信息
export function API_getGoodsTransferDODeliverInfoTrains(deliverId) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/deliverInfoTrains/${deliverId}`, {}, 'GET');
}
//联运管家 -导出车号表
export function API_ExportTrainTable(data) {
	return request(`${ENV.BASE_API}/api/waybill/vehicle/export`, data, 'GET', 2, 'blob');
}
//百宝箱 -导出车号表
export function API_ExportTrainTableTool(data) {
	return request(`${ENV.BASE_API}/api/waybill/trainSeachLog/vehicle/export`, data, 'GET', 2, 'blob');
}
// 货转开具——货转开具列表
export function API_getGoodsTransferDOApplyList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/goodsTransferApplyList`, data, 'GET');
}
// 货转开具——查看货转，获取url
export function API_getGoodsTransfeUrl(no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/previewAttach/${no}`, no, 'GET');
}
// 货转开具——查询货转订单批次
export function API_getGoodsTransferDOOrderNoNext(orderNo) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/next`, {}, 'GET');
}
// 货转开具——保存
export function API_postApiGoodsTransferDOSave(data, orderNo, no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/save/${orderNo}?no=${no ? no : ''}`, data, 'POST', 2);
}
// 货转开具——修改——保存
export function API_postApiGoodsTransferDOModifySave(data, orderNo, no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/save/${orderNo}?no=${no ? no : ''}`, data, 'POST', 2);
}
// 货转开具——提交
export function API_postApiGoodsTransferDOSubmit(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/submit`, data, 'POST', 2);
}
// 货转开具——获取货转开具修改信息
export function API_getApiGoodsTransferDOUpdList(orderNo, no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/${no}/updList`, {}, 'GET');
}
// 货转证明——获取盖章带签名列表
export function API_getApiGoodsTransferDOApplyGetToSignList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/apply/getToSigList`, data, 'POST', 2);
}
// 货转证明盖章
export function API_postApiGoodsTransferDOToConfirm(goodsTransferNo) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${goodsTransferNo}/toConfirm`, {}, 'POST');
}
// 货转证明批量下载
export function API_getApiGoodsTransferDOBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/batchDownload`, data, 'GET', 1, 'blob');
}
// 货转证明——详情查看
export function API_getApiGoodsTransferInfo(orderNo, no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${orderNo}/${no}/info`, {}, 'GET');
}
// 获取订单类型（根据合同、运费支付方式以及运输方式确定的）
export function API_getApiGoodsTransferDOGetType(orderNo) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/getType/${orderNo}`, {}, 'GET');
}

// 货转证明——货转记录——新接口
export function API_getApiGoodsTransferDoRecordList(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/goodsTransferRecordList`, data, 'GET');
}
// 货转证明——取消
export function API_getApiGoodsTransferCancel(no) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/${no}/cancel`, {}, 'GET');
}
// 货转证明——作废
export function API_postApiGoodsTransferInvalid(data) {
	return request(`${ENV.BASE_API}/api/goodsTransferDO/invalid`, data, 'POST');
}
// 货转证明——下载
export function API_getCommonDownload(url) {
	return request(`${ENV.BASE_API}/api/common/download/${url}`, {}, 'GET', 1, 'blob');
}
// 物泊-轨迹信息查询
export function API_getDeliverGetTruckTraceInfo(data) {
	return request(`${ENV.BASE_API}/api/deliver/getTruckTraceInfo`, data, 'GET');
}
// 物泊-轨迹信息导出
export function API_getDeliverLogisticsTruckInfoExportXls(data) {
	return request(`${ENV.BASE_API}/api/deliver/logisticsTruckInfoExportXls`, data, 'GET', 1, 'blob');
}
// 物泊-车辆附件信息导出
export function API_getCommonBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/common/batchDownload`, data, 'GET', 1, 'blob');
}
// 物泊-更新货源信息
export function API_postDeliverUpdatePublishNum(data) {
	return request(`${ENV.BASE_API}/api/deliver/updatePublishNum`, data, 'POST');
}
// 物泊-查看单据
export function API_getDeliverListTicketsByBatchIdAndTicketNo(data) {
	return request(`${ENV.BASE_API}/api/deliver/listTicketsByBatchIdAndTicketNo`, data, 'GET');
}

// 陆港通——根据企业名称查询货源列表
export function API_getDeliverListGoodsSourceByCompanyName(data) {
	return request(`${ENV.BASE_API}/api/deliver/listGoodsSourceByCompanyName`, data, 'GET');
}
// 陆港通——查询轨迹信息
export function API_getDeliverListTraceInfoByDeliveryNum(data) {
	return request(`${ENV.BASE_API}/api/deliver/listTraceInfoByDeliveryNum`, data, 'GET');
}
// 调用企查查
export function API_getCommonGetCompanyDetailFromQichacha(data) {
	return request(`${ENV.BASE_API}/api/common/getCompanyDetailFromQichacha`, data, 'GET');
}
// 中储智运——查询轨迹
export function API_getDeliverGetTruckTraceInfoZczy(data) {
	return request(`${ENV.BASE_API}/api/deliver/getTruckTraceInfoZczy`, data, 'GET');
}

// 物泊-获取船运实时轨迹
export function API_getDeliverGetRpcShip(data) {
	return request(`${ENV.BASE_API}/api/deliver/getRpcShip`, data, 'GET');
}

//绑定SAP单号后获取合同详情
export function API_getSAPContractDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/detail`, data, 'GET');
}
//卓鼎修改回款账号同步SAP数据
export function API_SyncSAPContract(data) {
	return request(`${ENV.BASE_API}/api/sap/sync`, data, 'GET');
}
// 完善合同--获取结算单列表
export function API_ContractSettlementList(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/list`, data, 'GET');
}
// 完善合同-获取结算单信息
export function API_GetSettlementInfo(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/detail`, data, 'GET');
}
// 完善合同-保存结算单信息   原先线下结算单保存，先添加线下结算单补录，原页面不再使用，接口，亚南定义新的，原接口使用，原先定义取消，2022/8/9--郭凯宣
// export function API_SaveSettlement(data) {
//     return request(`${ENV.BASE_API}/api/terminal/statement/saveOrUpdate`, data, 'POST', 2)
// }
// 完善合同-删除结算单附件
export function API_DeleteSettlementFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/statement/delete/attachment`, data, 'GET');
}
// 完善合同附件上传
export const API_ContractAttachFilesUpload = `${ENV.BASE_API}/api/terminal/attachment/upload`;

// 完善合同--获取发票列表
export function API_ContractInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/list`, data, 'GET');
}
// 数据监控下游 发票
export function API_GetInvoiceSellTerminalList(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/terminal/list`, data, 'GET');
}
// 完善合同--删除发票
export function API_DeleteContractInvoice(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/delete`, data, 'GET');
}
// 完善合同--获取发票详情
export function API_GetContractInvoiceInfo(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/detail`, data, 'GET');
}
// 完善合同--保存发票
export function API_ContractINVOICESAVE(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/save`, data, 'POST', 2);
}
// 完善合同--发票四要素识别
export function API_ContractINVOICEELEMENTSCAN(data) {
	return request(`${ENV.BASE_API}/api/terminal/invoice/discern`, data, 'POST', 2);
}

// 完善合同--获取下游回款模式
export function API_GetTerminalModel(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/get/terminal/model`, data, 'GET');
}
// 完善合同--手动录入模式时获取回款列表
export function API_ContractCashList(data) {
	return request(`${ENV.BASE_API}/api/terminal/payment/list`, data, 'GET');
}
// 完善合同--手动录入模式、SAP模式时获取下游合同线上业务回款和非线上业务回款认领金额
export function API_GetClaimRecordCategory(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/record/category`, data, 'GET');
}
// 完善合同-获取手动模式、SAP模式下线上业务回款认领数据
export function API_GetClaimRecordList(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/record/list`, data, 'GET');
}
// 完善合同--查看手动模式、SAP模式下线上业务回款认领详情
export function API_GetClaimFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/view/single/finance/clain/detail`, data, 'GET');
}
// 完善合同--查看手动模式、SAP模式下非线上业务回款认领详情
export function API_GetClaimUnFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/view/single/unFinance/clain/detail`, data, 'GET');
}
// 完善合同--删除手动模式下平台业务、非线上业务回款认领明细 TODO:钢材部分还在调用-回款闭管理修改-郭凯宣-2022/9/21
export function API_DeleteClaimRecord(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/delete/clain/record`, data, 'GET');
}

// 完善合同--银企直连模式--获取下游合同平台业务和非平台业务业务认领金额
export function API_GetOtherClaimRecordCategory(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/record/bank/company/category`, data, 'GET');
}
// 完善合同-银企直连模式--获取线上业务回款认领数据
export function API_GetOtherClaimRecordList(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/list/bank/company/payment`, data, 'GET');
}
// 完善合同--银企直连模式--查看线上业务回款认领详情
export function API_GetOtherClaimFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/view/finance/bank/company/payment`, data, 'GET');
}
// 完善合同--银企直连模式--查看非线上业务回款认领详情
export function API_GetOtherClaimUnFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/terminal/claim/view/unFinance/bank/company/payment`, data, 'GET');
}

// 完善合同--删除回款
export function API_DeleteContractCash(data) {
	return request(`${ENV.BASE_API}/api/terminal/payment/delete`, data, 'GET');
}
// 完善合同--校验，同一企业合同中不允许出现相同的资金流水号
export function API_CheckPaymentIsExit(data) {
	return request(`${ENV.BASE_API}/api/terminal/payment/isExit/serialNo`, data, 'GET');
}

// 完善合同--获取附件列表
export function API_ContractFilesList(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/attachment/list`, data, 'GET');
}
// 完善合同--删除附件
export function API_DeleteContractFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/delete/attachment`, data, 'GET');
}
// 完善合同-获取附件信息
export function API_GetContractFilesInfo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/delete/attachment`, data, 'GET');
}
// 完善合同-保存附件信息
export function API_SaveContractFiles(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/add/attachment`, data, 'POST', 2);
}
// 完善合同-输入查询企业名称
export function API_GetCompanyName(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/list`, data, 'GET');
}
// 监控-终端企业列表
export function API_GetDownstreamCompanyList(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/query/downstreamCompanyList`, data, 'GET');
}
// 完善合同-保存修改的合同信息
export function API_SaveManualEdit(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/add`, data, 'POST', 2);
}

// 合同核算办法明细
export function API_GetIndicatorTemplateAccountingDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/accounting/detail`, data, 'GET');
}

// 付款申请时-货值总金额明细
export function API_GetIndicatorTemplateAddDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/add/detail`, data, 'GET');
}
// 查看详情时-货值总金额明细
export function API_GetIndicatorTemplateViewDetail(data) {
	return request(`${ENV.BASE_API}/api/indicator/template/view/detail`, data, 'GET');
}

// 发票重构——单张发票识别
export function API_postInvoiceDoSingleInvoiceScan(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/singleInvoiceScan`, data, 'POST', 2);
}
// 发票重构——单张发票保存
export function API_postInvoiceDoSave(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/save`, data, 'POST', 2);
}
// 发票重构——发票excel批量识别
export const API_postInvoiceDoExcelBatchScan = `${ENV.BASE_API}/api/invoiceDO/excelBatchScan`;
// 发票重构——关联订单信息保存
export function API_postInvoiceDoBatchInvoiceOrderRelSave(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/batch/invoiceOrderRel/save`, data, 'POST', 2);
}

/* 回款认领相关接口 */
// 回款认领详情 回款类型为商承和银承时-汇票
export function API_GetCollectionCollectionBillDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionBillDetail`, '', 'GET');
}
// 回款认领详情 电汇
export function API_GetCollectionCollectionTeleDetail(collectionId) {
	return request(`${ENV.BASE_API}/api/collection/${collectionId}/collectionTeleDetail`, '', 'GET');
}
// 认领记录作废 TODO:钢材部分还在调用-回款闭管理修改-郭凯宣-2022/9/21
export function API_InvalidCollectionClaim(data) {
	return request(`${ENV.BASE_API}/api/collection/invalidCollectionClaim`, data, 'POST');
}
// 销售补录合同的买方列表
export function API_GetOfflineSellerBuyerList(data) {
	return request(`${ENV.BASE_API}/api/offline/seller/order/buyerList`, data, 'GET');
}

/* 回款认领结束 */

/* 证书托管 自动盖章 */
// 开具货转证明盖章
export function API_CfcaGoodsTransferAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/goodsTransferAutoSignature`, data, 'POST', 2);
}
// 结算单盖章/确认盖章
export function API_CfcaStatementAutoSignature(data) {
	return request(`${ENV.BASE_API}/api/cfca/statementAutoSignature`, data, 'POST', 2);
}
// 获取证书状态，是否显示添加证书按钮
export function API_GetCompanyIsAddCert(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/isAddCert`, data, 'GET');
}
//业务动态监控列表（核心企业）
export function API_GetCCSDynamicMonitoringList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/list`, data, 'GET');
}
export function API_GetCCSDynamicMonitoringListCompany(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/link/core/company/list`, data, 'GET');
}

//业务动态监控列表（资方）
export function API_GetCapitalDynamicMonitoringList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/list`, data, 'GET');
}
//业务动态监控列表（资方）-头部详情
export function API_GetCapitalDynamicMonitoringDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/detail/numCount`, data, 'GET');
}
//导出业务数据监控列表(核心企业)
export function API_ExportCCSDynamicMonitoring(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/export`, data, 'GET', 2, 'blob');
}

//导出业务数据监控列表(资方)
export function API_ExportCapitalDynamicMonitoring(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/export`, data, 'GET', 2, 'blob');
}

//业务数据监控详情(核心企业、资方)
export function API_GetDynamicMonitoringDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/detail`, data, 'GET');
}

//业务数据监控详情(核心企业、资方)--判断能否发起数据完整性审核
export function API_JudgeCanSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/canSubmitAudit`, data, 'GET');
}

//业务数据监控详情(核心企业、资方)--上游提交审核
export function API_UpstreamSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/buyer/submitAudit`, data, 'GET');
}

//业务数据监控详情(核心企业、资方)--下游提交审核
export function API_DownstreamSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/seller/submitAudit`, data, 'GET');
}

//业务监控--上游--核心企业、资方--合同详情
export function API_GetUpstreamContractDetail(data) {
	return request(`${ENV.BASE_API}/api/contract/queryByOrderNo`, data, 'GET');
}

//业务监控--上游--核心企业、资方--结算单列表
export function API_GetUpstreamSettlementList(data) {
	return request(`${ENV.BASE_API}/api/statement/getStatementListBySerialNo`, data, 'GET');
}
//业务监控--上游--核心企业、资方--发票列表
export function API_GetUpstreamInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoiceDO/getInvoiceListByOrderNo`, data, 'GET');
}

//业务监控--上游--核心企业、资方-货物结算列表
export function API_GetUpstreamPaymentList(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/getPaymentListByOrderNo`, data, 'GET');
}
//业务监控--上游--货物结算列表--融资详情-融资信息
export function API_GetUpstreamFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/view/finance/detail`, data, 'GET');
}
//业务监控--上游--货物结算列表--融资详情-放款
export function API_GetUpstreamFinanceDetailFK(data) {
	return request(`${ENV.BASE_API}/api/paymentInfo/view/financingLoanRepay/detail`, data, 'GET');
}
API_GetUpstreamFinanceDetailFK;
//业务监控--上游--核心企业、资方-货物结算附件 --取 API_GETPAYRECORDDETAIL

//业务监控--下游--核心企业、资方-上传下游合同附件
export const API_DownstreamContractUpload = `${ENV.BASE_API}/api/terminal/attachment/upload/single`;

//业务监控--下游--核心企业、资方-合同详情 API_getSAPContractDetail
/* 1.2版本新接口（企业证书相关） */
// 企业证书状态
export function API_CompanyCertStatus(data) {
	return request(`${ENV.BASE_API}/api/cert/companyCertStatus`, data, 'GET');
}

// 证书冻结
export function API_CertFrozen(data) {
	return request(`${ENV.BASE_API}/api/cert/frozen`, data, 'POST', 2);
}
// 证书解冻
export function API_CertUnfrozen(data) {
	return request(`${ENV.BASE_API}/api/cert/unfrozen`, data, 'POST', 2);
}
// 变更签章员页面证书列表
export function API_CertList(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/certList`, data, 'GET');
}
//变更签章员-下载变更操作员申请表模板
export function API_OperatorDownloadCertApplyTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}
/// 变更签章员-下载变更操作员授权书模板
export function API_OperatorDownloadLicenseTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}
// 企业员工查询
export function API_CompanyPersonalUserList(data) {
	return request(`${ENV.BASE_API}/api/companyUser/companyPersonalUserList`, data, 'GET', 2);
}
// 修改签章员
export function API_ChangeCertOperator(data) {
	return request(`${ENV.BASE_API}/api/cert/operator/changeCertOperator`, data, 'POST', 2);
}
// 证书申请-下载声明函模板
export function API_DownloadDeclarationLetterTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadDeclarationLetterTemplate`, data, 'POST', 2, 'blob');
}
// 证书申请-下载机构证书申请表
export function API_CertDownloadCertApplyTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadCertApplyTemplate`, data, 'POST', 2, 'blob');
}
// 证书申请-下载授权书模板
export function API_CertDownloadLicenseTemplate(data) {
	return request(`${ENV.BASE_API}/api/cert/downloadLicenseTemplate`, data, 'POST', 2, 'blob');
}
// 证书申请
export function API_CertDoApply(data) {
	return request(`${ENV.BASE_API}/api/cert/doApply`, data, 'POST', 2);
}
// 企业认证时企查查获取企业信息
export function API_GetCompanyByName(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getCompanyByName`, data, 'GET', 2);
}
// 企业信用代码校验
export function API_CheckBizNo(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkBizNo`, data, 'POST', 1);
}
// 真实姓名身份证校验
export function API_CheckIdCard(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkIdCard`, data, 'POST', 1);
}
// 企业名称校验
export function API_CheckCompanyName(data) {
	return request(`${ENV.BASE_API}/api/userCenter/checkCompanyName`, data, 'GET');
}

// 企业信息修改回显
export function API_GetCompanyModifyLog(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/getCompanyModifyLog`, data, 'GET');
}

//根据企业简称获取简称拼音
export function API_GetAbbrPinYin(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getAbbrPinYin`, data, 'GET');
}
// 提交修改的企业简称
export function API_SubmitModifyImportantInfo(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/update/abbrAndPinYin`, data, 'POST', 2);
}

// 企业重新认证回显
export function API_GetApplyCompanyAuth(data) {
	return request(`${ENV.BASE_API}/api/userCenter/getApplyCompanyAuth`, data, 'GET');
}
// 企业联系人列表
export function API_CompanyContractPage(data) {
	return request(`${ENV.BASE_API}/api/companyContract/page`, data, 'GET');
}
// 联系人详情
export function API_CompanyContractDetail(id) {
	return request(`${ENV.BASE_API}/api/companyContract/${id}/detail`, '', 'GET');
}

// 修改企业名称或法定代表人-发送短信验证码到原手机
export function API_GetModifyCompanyVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/getModifyCompanyVerifyCode`, data, 'POST');
}

export function API_CheckModifyCompanyVerifyCode(data) {
	return request(`${ENV.BASE_API}/api/companyProfile/checkModifyCompanyVerifyCode`, data, 'POST');
}
// 是否可以新增补充协议
// export function API_SupplementalAgreementCanSubmit(data) {
//     return request(`${ENV.BASE_API}/api/supplementalAgreement/canSubmit`, data,'GET')
// }
// 预览协议
export function API_SupplementalAgreementPreview(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/preview`, data, 'POST', 2);
}
// 补充协议修改
export function API_SupplementalAgreementDetail(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/modify`, data, 'GET');
}
// 获取已经生效的补充协议列表
export function API_SupplementalAgreementGetCompleted(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/getCompleted`, data, 'GET');
}
// 补充协议盖章后修改状态
// export function API_SupplementalAgreementAfterSeal(data) {
//     return request(`${ENV.BASE_API}/api/supplementalAgreement/seal/afterSeal`, data,'POST')
// }
// 补充协议自动盖章
// export function API_SupplementalAgreementAutoSignature(data) {
//     return request(`${ENV.BASE_API}/api/cfca/supplementalAgreementAutoSignature`, data,'GET')
// }
// 正在进行中的补协
export function API_SupplementalAgreementLatest(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/getLatest`, data, 'GET');
}

// 数据监控上游附件
export function API_ContractGetAttachment(data) {
	return request(`${ENV.BASE_API}/api/contract/getAttachment`, data, 'GET');
}

/*资产管理接口 开始*/
export function API_GetAccountsReceivableList(data) {
	// 应收账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/recv`, data, 'GET');
}
export function API_GetAccountsDetailJR(data) {
	//应收应付详情金融
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.id}/bank/detail`, data, 'GET');
}
export function API_AuditReceivableJR(data) {
	//应收审核金融
	return request(`${ENV.BASE_API}/api/asset/receivable/bank/audit`, data, 'PUT', 2);
}
export function API_AuditReceivableJRDownload(data) {
	//一键下载所有文档金融
	return request(`${ENV.BASE_API}/api/asset/receivable/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivableManualDownload(data) {
	//一键下载所有文档手动
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_AuditReceivableDownload(data) {
	//一键下载所有文档供应商
	return request(`${ENV.BASE_API}/api/asset/receivable/company/batchDownload`, data, 'GET', 1, 'blob');
}
export function API_GetAccountsReceivableListJR(data) {
	// 应收账款列表金融
	return request(`${ENV.BASE_API}/api/asset/receivable/list/bank`, data, 'GET');
}
export function API_SyncReceivable(data) {
	// 应收账款同步状态
	return request(`${ENV.BASE_API}/api/asset/receivable/sync/recv`, data, 'POST', 2);
}
export function API_GetAccountsDetail(data) {
	//应收应付详情
	return request(`${ENV.BASE_API}/api/asset/receivable/detail`, data, 'GET');
}
export function API_GetAccountsPayableList(data) {
	// 应付账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pay`, data, 'GET');
}

export function API_GetAccountsPayableChangeBankList(data) {
	// 应付账款变更列表金融
	return request(`${ENV.BASE_API}/api/asset/receivable/list/bankModify`, data, 'GET');
}
export function API_GetAccountsPayableChangeList(data) {
	// 应付账款变更列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/payModify`, data, 'GET');
}

export function API_GetAdvancePayableList(data) {
	// 预付账款列表
	return request(`${ENV.BASE_API}/api/asset/receivable/list/pre/pay`, data, 'GET');
}

export function API_GetAccountsPayableZF(data) {
	// 应付账款作废
	return request(`${ENV.BASE_API}/api/asset/receivable/cancel`, data, 'POST', 2);
}
export function API_EditAccountsPayable(data) {
	// 编辑应付账款
	return request(`${ENV.BASE_API}/api/asset/receivable/modify`, data, 'POST', 2);
}
export function API_SyncPayable(data) {
	// 应收账款同步状态
	return request(`${ENV.BASE_API}/api/asset/receivable/sync/pay`, data, 'POST', 2);
}
export function API_GetInvoiceResult(data) {
	// 发票查验结果
	return request(`${ENV.BASE_API}/api/asset/receivable/getInvoicePdfInfo`, data, 'GET');
}
export function API_ExportInvoice(data) {
	// 导出发票
	return request(`${ENV.BASE_API}/api/asset/receivable/${data.receivableId}/invoice/export`, data, 'GET', 1, 'blob');
}

export function API_GetConfirmAssetsList(data) {
	// 确权列表
	return request(`${ENV.BASE_API}/api/asset/confirm/list`, data, 'GET');
}
export function API_JudgeConfirm(data) {
	// 确权盖章判断 判断当前资产下所有发票的发票状态，是否含有红冲、作废的发票；若包含有红冲作废的发票，不允许确权；
	return request(`${ENV.BASE_API}/api/asset/confirm/checkInvoice`, data, 'GET');
}
export function API_GetConfirmLetterUrl(data) {
	// 获取确认函url
	return request(`${ENV.BASE_API}/api/asset/confirm/getUrl`, data, 'GET');
}
export function API_GetSignList(data) {
	// 获取确权盖章的签名数据-ukey盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/getToSigList`, data, 'GET');
}
export function API_SubmitSign(data) {
	// 提交确权盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/sign`, data, 'POST', 2);
}
export function API_GetConfirmAutoSignature(data) {
	// 确权盖章-公司托管盖章
	return request(`${ENV.BASE_API}/api/asset/confirm/autoSignature`, data, 'GET');
}
export const API_UploadSTEELAssetsFile = `${ENV.BASE_GANG_API}/common/upload/and/waterMark`; //资产管理模块钢材  附件上传
export function API_GetDownloadRAR(data) {
	return request(`${ENV.BASE_API}/api/common/file/download/${data}`, data, 'GET', 1, 'blob');
}
export function API_GetReceivablefullBusinessLine(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/fullBusinessLine/order/detail`, data, 'GET');
}
export function API_GetReceivableInvoListLine(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/list/invoice`, data, 'GET');
}
export function API_asset_getManualBankProduct(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getManualBankProduct`, data, 'GET');
}
export function API_assetmanual_getManualBuyer(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getManualBuyer`, data, 'GET');
}
export function API_assetmanual_getEndDate(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/getEndDate`, data, 'GET');
}
export function API_EditAccountsManualPayable(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/modify`, data, 'POST', 2);
}
export function API_GetAccountsManualDetail(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/detail`, data, 'GET');
}
export function API_GetAccountsManualcheckContract(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/manual/checkContract`, data, 'GET');
}
export function API_GetAccountsPledgecheckContract(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/pledge/checkContract`, data, 'GET');
}

/*资产管理接口 结束*/

// 发货申请 删除附件
export function API_DeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/deliver/delete/attach`, data, 'GET');
}

// 付款申请 删除附件
export function API_PaymentApplyDeleteAttach(data) {
	return request(`${ENV.BASE_API}/api/paymentApply/delete/attach`, data, 'GET');
}

/* 仓储中心接口开始 */
// 入库管理列表
export function API_WarehousePutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/page`, data, 'POST', 2);
}
// 出库管理列表
export function API_WarehouseOutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/page`, data, 'POST', 2);
}
// 入库商品详情
export function API_WarehousePutDetail(id) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/${id}`, '', 'GEt');
}
// 出库商品详情
export function API_WarehouseOutDetail(id) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/${id}`, '', 'GEt');
}
// 保存出库附件
export function API_WarehousePutAttachmentSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/attachment/save`, data, 'POST', 2);
}
// 删除出库附件
export function API_WarehousePutAttachmentDel(fileId) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/attachment/${fileId}/del`, '', 'GET');
}
// 保存入库附件
export function API_WarehouseOutAttachmentSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/attachment/save`, data, 'POST', 2);
}
// 删除入库附件
export function API_WarehouseOutAttachmentDel(fileId) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/attachment/${fileId}/del`, '', 'GET');
}
// 粮情数据列表
export function API_GrainSituationPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/page`, data, 'POST', 2);
}
// 三温图
export function API_GrainSituationThreeTemp(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/threeTemp`, data, 'POST', 2);
}
// 湿度图
export function API_GrainSituationHumidity(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/humidity`, data, 'POST', 2);
}
// 害虫报表
export function API_GrainSituationPestReport(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/pestReport`, data, 'POST', 2);
}
// 气体报表
export function API_GrainSituationGasReport(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/gasReport`, data, 'POST', 2);
}
// 害虫报表（右）
export function API_GrainSituationPointPestsDetail(pgId, depotPointFlag) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/pointPestsDetail/${pgId}/${depotPointFlag}`, '', 'GET');
}
// 粮情监控入库数据入库
export function API_GrainSituationWarehouseGoodsPutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseGoodsPutPage`, data, 'POST', 2);
}
// 粮情监控入库数据出库
export function API_GrainSituationWarehouseGoodsOutPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseGoodsOutPage`, data, 'POST', 2);
}
//核心企业列表-金融机构
export function API_GrainSituationGetCoreCompanyList() {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/getCoreCompanyList`, '', 'GET');
}

export function API_GrainSituationWarehouseCameras(depotId) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouse/cameras/${depotId}`, '', 'GET');
}
// 获取所有预警类型
export function API_GrainSituationEarlyWarningType() {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/earlyWarningType`, '', 'GET');
}
// 核心企业根据仓房id获取预警信息
export function API_GrainSituationGetCoreCompanyEarlyWarning(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getCoreCompanyEarlyWarning`, data, 'POST', 2);
}
// 获取预警信息详情
export function API_GrainSituationGetEarlyWarningDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getEarlyWarningDetail/${data}`, '', 'GET');
}
//保存预警跟踪处理
export function API_GrainSituationSaveWarningTracking(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/saveWarningTracking`, data, 'POST', 2);
}
// 核心企业根据仓房id获取预警信息
export function API_GrainSituationGetEarlyWarningByStorehouseId(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getEarlyWarningByStorehouseId`, data, 'POST', 2);
}
// 预警订阅列表
export function API_GrainSituationEarlyWarningSubscriptionList(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/subscriptionList`, data, 'POST', 2);
}
// 添加订阅
export function API_GrainSituationEarlyWarningAddSubscription(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/addSubscription`, data, 'POST', 2);
}
// 库存图表
export function API_GrainSituationInventoryChart(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/inventoryChart`, data, 'POST', 2);
}
// 删除订阅
export function API_GrainEarlyWarningDeleteSubscription(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/deleteSubscription/${data}`, '', 'GET');
}
// 预警设置列表
export function API_GrainEarlyWarningGetDepotEarlyWarning(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/getDepotEarlyWarning/${data}`, '', 'GET');
}
// 保存预警设置
export function API_GrainSaveEarlyWarningData(data) {
	return request(`${ENV.BASE_GRAIN_API}/earlyWarning/saveEarlyWarningData`, data, 'POST', 2);
}

export function API_GrainGetAssociatedDepotPoint() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getAssociatedDepotPoint`, '', 'GET');
}
export function API_GrainFinancingOrderList(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/page`, data, 'GET');
}
export function API_GrainFinancingOrderDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data.id}/detail`, data, 'GET');
}
export function API_GrainFinancingLoanRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/register`, data, 'POST', 2);
}
export function API_GrainGetLoanList(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/bankList`, data, 'GET');
}
export function API_GrainGetLoanHuanDetail(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/storage/${data.loanId}/loanBankDetail`, data, 'GET');
}
export function API_GrainFinancingRepayRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/storage/register`, data, 'POST', 2);
}
// 批次管理
// 仓房管理列表
export function API_GetWarehouseList(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/list`, data, 'GET');
}
// 仓房详情
export function API_GetWarehouseLDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouseDetail/${data.batchId}/${data.storehouseId}`, data, 'GET');
}
// 判断该仓房下所有电子锁是否已处于关锁状态
export function API_CheckBlockWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/inLockStatus/${data.batchId}`, data, 'GET');
}
// 封仓
export function API_BlockWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/closeWarehouse/${data.batchId}`, data, 'GET');
}
// 仓清确认
export function API_ClearWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/clearWarehouse/${data.batchId}`, data, 'GET');
}
// 审批解除封仓
export function API_AuditReleaseWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/openApprove`, data, 'GET');
}
// 关联资金方提交
export function API_SubmitRelatingFunds(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/relating`, data, 'POST', 2);
}
// 关联资金方撤回
export function API_RecallRelatingFunds(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/recallRelating`, data, 'GET');
}
// 获取所有金融机构
export function API_GetBankList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/bankList`, data, 'GET');
}
// 获取金融机构对应的资金类型
export function API_GetFundsList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/fundList/${data.bankId}`, data, 'GET');
}
// 仓房使用历史列表
export function API_GetWarehouseHistoryList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/warehouseHistoryList`, data, 'POST', 2);
}
// 仓房使用历史检索项 获取所有当前企业关联过的银行
export function API_GetRelBanksList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getRelBanks`, data, 'GET');
}
// 非融资判断是否有正在执行中的出仓单
export function API_OutReceiptnExecution(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/outReceiptInExecution`, data, 'GET');
}
// 解除封仓页面需要的数据
export function API_GetKeyLockAndWorks(data) {
	return request(`${ENV.BASE_GRAIN_API}/lock/getKeyLockAndWorks/${data}`, '', 'GET');
}
// 解除封仓
export function API_OpenWarehouse(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/openWarehouse`, data, 'POST', 2);
}
// 仓房详情中--获取电子锁记录
export function API_GetKeylostdatasByBatchId(data) {
	return request(`${ENV.BASE_GRAIN_API}/lock/getLockdatas`, data, 'GET');
}
// 是否是最后出仓单校验
export function API_GetCheckLast(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/checkLast/${data.storehouseId}`, data, 'GET');
}

/* 仓储中心接口结束 */

// 数据监控 下游完善合同 采购订单详情
export function API_GetDetailByPaperContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/getDetailByPaperContractNo`, data, 'GET');
}
export function API_GetDetailRecordContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/audit/getAuditList`, data, 'GET');
}
export function API_GetDetailRecordDetailContractNo(data) {
	return request(`${ENV.BASE_API}/api/terminal/contract/audit/getAuditDetail`, data, 'GET');
}

/*发票改造接口开始*/

// 进项发票列表
export function API_GetBuyInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/list`, data, 'GET');
}
// 销项发票列表
export function API_GetSellInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/list`, data, 'GET');
}
// 运费发票列表
export function API_GetFreightInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/list`, data, 'GET');
}
// 发票识别
export function API_InvoiceImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}
// 新运费发票详情识别
export function invoiceDetailImgScan(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/modify/imgScan?invoiceType=${data.invoiceType}`, data, 'POST');
}

// 批量下载发
export function API_BatchDownloadFileByUrls(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/batchDownloadFileByUrls`, data, 'POST', 1, 'blob');
}
// 查询图片识别成功的数据
export function API_GetListImgScanSuccessData(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/listImgScanSuccess`, data, 'GET');
}
// 进项发票关联合同列表列表
export function API_GetInvoicelistBuyContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/listBuyContract`, data, 'GET');
}
// 销项发票关联合同列表列表
export function API_GetInvoicelistSellContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/listSellContract`, data, 'GET');
}
// 运费发票关联合同列表列表
export function API_GetInvoicelistFreightContract(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/listDeliverInvoiceContract`, data, 'GET');
}

// 进项发票导出
export function API_InvoiceBuyExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/buy/exportXls`, data, 'GET', 1, 'blob');
}
// 销项发票导出
export function API_InvoiceSellExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/sell/exportXls`, data, 'GET', 1, 'blob');
}
// 运费发票导出
export function API_InvoiceFreightExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/deliver/exportXls`, data, 'GET', 1, 'blob');
}
// 批量发票信息保存
export function API_InvoiceBatchSave(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/batchSave`, data, 'POST', 2);
}
// 发票删除
export function API_InvoiceDelete(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/delete`, data, 'POST');
}
// 发票检测
export const batchInvoiceCheck = data => request(`${ENV.BASE_API}/api/invoice/common/batchSave/check`, data, 'POST', 2);

// 根据ID下载发票附件
export function API_InvoiceDownloadFileById(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/downloadFileById`, data, 'GET', 1, 'blob');
}
// 清除图片缓存
export function API_InvoiceDelImgScanCache() {
	return request(`${ENV.BASE_API}/api/invoice/common/delImgScanCache`, {}, 'POST');
}
// 查询excel识别的数据
export function API_InvoiceListExcelScanAll() {
	return request(`${ENV.BASE_API}/api/invoice/common/listExcelScanAll`, '', 'GET');
}
// 导出excel
export function API_InvoiceExportXls(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/excel/exportXls`, data, 'GET', 1, 'blob');
}
// 查询excel识别成功的数据
export function API_InvoiceListExcelScanSuccess() {
	return request(`${ENV.BASE_API}/api/invoice/common/listExcelScanSuccess`, '', 'GET');
}
// 发票详情
export function API_InvoiceDetailNew(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/detail`, data, 'GET');
}
// 发票修改
export function API_InvoiceModifyNew(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/modify`, data, 'POST', 2);
}
// 红冲发票
export function API_InvoiceCommonReverse(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/reverse`, data, 'GET');
}
// 作废发票
export function API_InvoiceCommonInvalid(data) {
	return request(`${ENV.BASE_API}/api/invoice/common/invalid`, data, 'GET');
}

/*发票改造接口结束*/

// 仓储中心合同列表
export function API_GrainContractPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/page`, data, 'GET');
}
// 仓储中心合同详情
export function API_GrainContractDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data}/detail`, '', 'GET');
}
// 合同归档
export function API_GrainContractArchive(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/${data}/archive`, '', 'GET');
}
// 获取仓储企业获取对应入库记录
export function API_GrainGetListByStorageCompany(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/put/getListByStorageCompany`, data, 'GET');
}
// 合同确认单开具
export function API_GrainConfirmationShipAdd(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/add`, data, 'POST', 2);
}
// 新增合同
export function API_GrainContractSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/contract/save`, data, 'POST', 2);
}
// 获取卖方[仓储企业]列表
export function API_GrainStorageCompanyList(data) {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/storageCompany`, data, 'GET');
}
// 盖章时查询确认单附件地址
export function API_GrainConfirmationShipInfo(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/seal/info`, data, 'GET');
}
// 仓储or仓储企业盖章[Ukey]
export function API_GrainConfirmationShipUkey(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data.id}/seal/ukey`, data, 'GET');
}
// 仓储or仓储企业盖章[托管]
export function API_GrainConfirmationShipAuto(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/seal/auto`, '', 'GET');
}
// 仓储企业签章并提交核心企业确认
export function API_GrainConfirmationSealToConfirm(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/sealToConfirm`, data, 'POST', 2);
}
// 核心企业盖章并提交确认
export function API_GrainConfirmationConfirm(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/${data}/confirm`, data, 'POST', 2);
}
// 确认单列表
export function API_GrainConfirmationShipList(data) {
	return request(`${ENV.BASE_GRAIN_API}/confirmationShip/page`, data, 'GET');
}
// 根据仓房ID获取关联的摄像设备
export function API_GrainGrainSituationWarehouseCameras(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/warehouse/cameras/${data}`, '', 'GET');
}

// OA补协详情
export function API_SupplementalAgreementOaAuditView(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/oaAudit/view`, data, 'GET');
}
// OA补协详情
export function API_SupplementalAgreementOaAuditSave(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/oaAudit/save`, data, 'POST', 2);
}
// OA下载补协
export function API_supplementalAgreementOaAuditBatchDownload(data) {
	return request(`${ENV.BASE_API}/api/supplementalAgreement/oaAudit/batchDownload`, data, 'GET');
}
// OA补协登录
export function API_LOGINBYMOBILEFORSA(data) {
	return request(`${ENV.BASE_API}/api/loginByCompanyUserIdForSA`, data, 'POST');
}
// 获取单个摄像头监控地址
export function API_GrainGrainCameraPreviewURLs(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/previewURLs`, data, 'GET');
}
// 获取单个摄像头回放地址
export function API_GrainGrainCameraPlaybackURLs(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/playbackURLs`, data, 'GET');
}
// 摄像头控制
export function API_GrainGrainCameraControlling(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/controlling`, data, 'GET');
}
// 摄像头抓拍
export function API_GrainGrainCameraManualCapture(data) {
	return request(`${ENV.BASE_GRAIN_API}/camera/manualCapture`, data, 'GET');
}

// 陕煤数据大屏 火运轨迹查询
export function API_ShanMeiTrain(data) {
	return request(`${ENV.BASE_API}/api/shanmei/risk/control/data/screen/train/trail`, data, 'GET');
}
// 陕煤数据大屏 船运轨迹查询
export function API_ShanMeiShip(data) {
	return request(`${ENV.BASE_API}/api/shanmei/risk/control/data/screen/ship/trail`, data, 'GET');
}

// 出仓单分页
export function API_OutWarehouseReceiptPage(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/page`, data, 'GET');
}
// 保存出仓单
export function API_OutWarehouseReceiptSave(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt`, data, 'POST', 2);
}
// 更新出仓单状态
export function API_OutWarehouseReceiptUpdateStatus(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/updateStatus`, data, 'PUT', 2);
}
// 出仓单ukey签章
export function API_OutWarehouseReceiptUkey(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/seal/ukey`, data, 'GET');
}
// 出仓单-金融机构审批
export function API_OutWarehouseReceiptAudit(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/audit`, data, 'POST', 2);
}
// 出仓单作废
export function API_OutWarehouseReceiptCancel(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/cancel`, data, 'POST', 2);
}
// 出仓单完结
export function API_OutWarehouseReceiptFinish(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data.id}/finish/${data.last}`, '', 'GET');
}
// 获取权属企业当前绑定的所有仓储企业
export function API_OutWarehouseReceiptGetStorageCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/getStorageCompany`, '', 'GET');
}
// 出仓单详情
export function API_OutWarehouseReceiptDetail(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}`, '', 'GET');
}
// 商品品种
export function API_OutWarehouseReceiptGetGrainVariety() {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/getGrainVariety`, '', 'GET');
}
// 出仓单完结前查询累计出仓单数量
export function API_OutWarehouseReceiptWhetherCanBeCompleted(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}/whetherCanBeCompleted`, '', 'GET');
}
// 出仓单附件
export function API_OutWarehouseReceiptGetAttach(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/getAttach/${data}`, data, 'GET');
}
// 出仓单托管盖章
export function API_OutWarehouseReceiptAutoSignature(data) {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/${data}/seal/auto`, '', 'GET');
}
// 出仓单出库记录
export function API_OutWarehouseReceiptSelectGoodsOutPageByDeliveryNum(data) {
	return request(`${ENV.BASE_GRAIN_API}/warehouse/goods/out/selectGoodsOutPageByDeliveryNum`, data, 'GET');
}
// 金融机构列表
export function API_OutWarehouseReceiptFinancialOrg() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/financialOrg`, '', 'GET');
}
// 仓储企业列表
export function API_OutWarehouseReceiptStorageCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/storageCompany`, '', 'GET');
}
// 出仓单状态列表
export function API_OutWarehouseReceiptDeliveryStatus() {
	return request(`${ENV.BASE_GRAIN_API}/outWarehouseReceipt/deliveryStatus`, '', 'GET');
}
// 库点列表
export function API_OutWarehouseReceiptDepotPointList() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/depotPoint`, '', 'GET');
}
// 货权方列表
export function API_OutWarehouseReceiptCoreCompany() {
	return request(`${ENV.BASE_GRAIN_API}/companyRelation/coreCompany`, '', 'GET');
}

// 华能云成放款登记
export function API_FinancingLoanRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/loan/registerByApply`, data, 'POST', 2);
}
// 华能云成还款登记
export function API_FinancingRepayHnycRegister(data) {
	return request(`${ENV.BASE_API}/api/financing/repay/hnycRegister`, data, 'POST', 2);
}
// 华能云成放款作废
export function API_FinancingLoanInvalidLoanByApply(loanId) {
	return request(`${ENV.BASE_API}/api/financing/loan/${loanId}/invalidLoanByApply`, '', 'PUT', 2);
}
// 华能云成融资纪录
export function API_FinancingListHn(data) {
	return request(`${ENV.BASE_API}/api/financing/apply/hnycList`, data, 'GET');
}
// 数据监控-业务线查看列表
export function API_FullBusinessLineList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/page`, data, 'GET');
}
// 数据监控-风控预警
export function API_riskAlertRecordList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/listByPage`, data, 'GET');
}
// 数据监控-风控预警详情
export function API_riskAlertDetail(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/getDataDetail`, data, 'GET');
}
// 数据监控-预警申诉保存
export function API_saveComplainData(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/saveComplainData`, data, 'POST', 2);
}

// 数据监控-风控预警资金类型
export function API_selectAllPaymentTypeList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/selectAllPaymentType`, data, 'GET');
}
// 数据监控-风控预警导出
export function API_exportRiskAlertRecordList(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/export`, data, 'GET', 2, 'blob');
}
// 数据监控-业务动态监控核心企业列表
export function API_BusinessMonitoringCoreCompanyList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/list`, data, 'GET');
}
// 数据监控-业务动态监控核心企业导出
export function API_BusinessMonitoringCoreCompanyExport(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/export`, data, 'GET', 2, 'blob');
}
// 数据监控-业务动态监控核心企业详情
export function API_BusinessMonitoringCoreCompanyDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/coreCompany/detail`, data, 'GET');
}
// 数据监控-业务动态监控金融机构列表
export function API_BusinessMonitoringBankList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/list`, data, 'GET');
}
// 数据监控-业务动态监控金融机构导出
export function API_BusinessMonitoringBankExport(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/export`, data, 'GET', 2, 'blob');
}
// 数据监控-业务动态监控金融机构详情
export function API_BusinessMonitoringBankDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/bank/detail/numCount`, data, 'GET');
}
// 数据监控-业务动态监控上游新增或者修改
export function API_BusinessMonitoringUpstreamAddOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/addOrUpdate`, data, 'POST', 2);
}
// 数据监控-业务动态监控上游合同详情
export function API_BusinessMonitoringUpstreamContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/contract/detail`, data, 'GET');
}
// 数据监控-业务动态监控上游合同附件列表
export function API_BusinessMonitoringUpstreamAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/attach/list`, data, 'GET');
}
// 数据监控-业务动态监控上游收发货信息列表
export function API_BusinessMonitoringUpstreamDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/deliverBatch/list`, data, 'GET');
}
// 数据监控-业务动态监控上游收发货列表统计接口
export function API_BusinessMonitoringUpstreamDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/deliverBatch/statistics`, data, 'GET');
}
// 数据监控-业务动态监控上游货转列表统计接口
export function API_BusinessMonitoringUpstreamGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/goodsTransfer/statistics`, data, 'GET');
}
// 数据监控-业务动态监控上游货转列表
export function API_BusinessMonitoringUpstreamGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/goodsTransfer/list`, data, 'GET');
}
// 数据监控-业务动态监控上游资金流水统计接口
export function API_BusinessMonitoringUpstreamPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/statistics`, data, 'GET');
}
// 数据监控-业务动态监控上游资金流水列表接口
export function API_BusinessMonitoringUpstreamPaymentList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/list`, data, 'GET');
}
// 数据监控-业务动态监控上游结算统计接口
export function API_BusinessMonitoringUpstreamStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/statement/statistics`, data, 'GET');
}
// 数据监控-业务动态监控上游结算列表接口
export function API_BusinessMonitoringUpstreamStatementList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/statement/list`, data, 'GET');
}
// 数据监控-业务动态监控上游发票统计接口
export function API_BusinessMonitoringUpstreamInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/invoice/statistics`, data, 'GET');
}
// 数据监控-业务动态监控上游贸易发票列表
export function API_BusinessMonitoringUpstreamTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trade/invoice/list`, data, 'GET');
}
// 数据监控-业务动态监控上游运费发票列表
export function API_BusinessMonitoringUpstreamTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/trans/invoice/list`, data, 'GET');
}
// 上游切换获取详情
export function API_BusinessMonitoringUpstreamChangeContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/change/contract/detail`, data, 'GET');
}
//  数据监控-业务动态监控上游其他附件
export function API_BusinessMonitoringUpstreamOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/other/attach/list`, data, 'GET');
}
// 数据监控-业务动态监控下游新增或者修改
export function API_BusinessMonitoringDownstreamAddOrUpdate(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/addOrUpdate`, data, 'POST', 2);
}
// 数据监控-业务动态监控下游合同详情
export function API_BusinessMonitoringDownstreamContractDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/contract/detail`, data, 'GET');
}
// 数据监控-业务动态监控下游合同附件列表
export function API_BusinessMonitoringDownstreamAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/attach/list`, data, 'GET');
}
// 数据监控-业务动态监控下游收发货信息列表
export function API_BusinessMonitoringDownstreamDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/list`, data, 'GET');
}
// 数据监控-业务动态监控下游收发货列表统计接口
export function API_BusinessMonitoringDownstreamDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/deliverBatch/statistics`, data, 'GET');
}
// 数据监控-业务动态监控下游货转列表统计接口
export function API_BusinessMonitoringDownstreamGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/goodsTransfer/statistics`, data, 'GET');
}
// 数据监控-业务动态监控下游货转列表
export function API_BusinessMonitoringDownstreamGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/goodsTransfer/list`, data, 'GET');
}
// 数据监控-业务动态监控下游资金流水统计接口
export function API_BusinessMonitoringDownstreamPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/statistics`, data, 'GET');
}
// 数据监控-业务动态监控下游资金流水列表接口
export function API_BusinessMonitoringDownstreamPaymentList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/list`, data, 'GET');
}
// 数据监控-业务动态监控下游结算统计接口
export function API_BusinessMonitoringDownstreamStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/statement/statistics`, data, 'GET');
}
// 数据监控-业务动态监控下游结算列表接口
export function API_BusinessMonitoringDownstreamStatementList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/statement/list`, data, 'GET');
}
// 数据监控-业务动态监控下游发票统计接口
export function API_BusinessMonitoringDownstreamInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/invoice/statistics`, data, 'GET');
}
// 数据监控-业务动态监控下游贸易发票列表
export function API_BusinessMonitoringDownstreamTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trade/invoice/list`, data, 'GET');
}
// 数据监控-业务动态监控下游运费发票列表
export function API_BusinessMonitoringDownstreamTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/trans/invoice/list`, data, 'GET');
}
//  数据监控-业务动态监控下游其他附件
export function API_BusinessMonitoringDownstreamOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/other/attach/list`, data, 'GET');
}
//  数据监控-业务动态监控下游融资详情
export function API_BusinessMonitoringDownstreamPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/payment/finance/detail`, data, 'GET');
}
//  数据监控-业务动态监控上游融资详情
export function API_BusinessMonitoringUpstreamPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/payment/finance/detail`, data, 'GET');
}
// 数据监控-全业务线查看合同详情
export function API_FullBusinessLineDetailContractDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/contract/detail`, data, 'GET');
}
// 数据监控-全业务线查看合同附件列表
export function API_FullBusinessLineDetailAttachList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/attach/list`, data, 'GET');
}
// 数据监控-全业务线查看发货统计
export function API_FullBusinessLineDetailDeliverBatchStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/deliverBatch/statistics`, data, 'GET');
}
// 数据监控-全业务线查看发货列表
export function API_FullBusinessLineDetailDeliverBatchList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/deliverBatch/list`, data, 'GET');
}
// 数据监控-全业务线查看货转统计
export function API_FullBusinessLineDetailGoodsTransferStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/goodsTransfer/statistics`, data, 'GET');
}
// 数据监控-全业务线查看货转列表
export function API_FullBusinessLineDetailGoodsTransferList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/goodsTransfer/list`, data, 'GET');
}
// 数据监控-全业务线查看资金流水统计
export function API_FullBusinessLineDetailPaymentStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/statistics`, data, 'GET');
}
// 数据监控-全业务线查看资金流水列表
export function API_FullBusinessLineDetailPaymentList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/list`, data, 'GET');
}
// 数据监控-全业务线查看融资详情
export function API_FullBusinessLineDetailPaymentFinanceDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/payment/finance/detail`, data, 'GET');
}
// 数据监控-全业务线查看结算统计
export function API_FullBusinessLineDetailStatementStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/statement/statistics`, data, 'GET');
}
// 数据监控-全业务线查看结算列表
export function API_FullBusinessLineDetailStatementList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/statement/list`, data, 'GET');
}
// 数据监控-全业务线查看发票统计
export function API_FullBusinessLineDetailInvoiceStatistics(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/invoice/statistics`, data, 'GET');
}
// 数据监控-全业务线查看贸易发票列表
export function API_FullBusinessLineDetailTradeInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/trade/invoice/list`, data, 'GET');
}
// 数据监控-全业务线查看运费发票列表
export function API_FullBusinessLineDetailTransInvoiceList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/trans/invoice/list`, data, 'GET');
}
// 数据监控-全业务线查看其他附件
export function API_FullBusinessLineDetailOtherAttachList(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/other/attach/list`, data, 'GET');
}
// 数据监控-业务动态监控上游合同显示隐藏审批按钮/模块
export function API_BusinessMonitoringCanBuyerSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/canBuyerSubmitAudit`, data, 'GET');
}
// 数据监控-业务动态监控下游合同显示隐藏审批按钮/模块
export function API_BusinessMonitoringCanSellerSubmitAudit(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/canSellerSubmitAudit`, data, 'GET');
}
// 数据监控-业务动态监控上游合同打包下载
export function API_BusinessMonitoringUpstreamAttachDownload(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/upstream/attach/download`, data, 'GET', 1, 'blob');
}
// 数据监控-业务动态监控下游合同打包下载
export function API_BusinessMonitoringDownstreamAttachDownload(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/downstream/attach/download`, data, 'GET', 1, 'blob');
}
// 数据监控-全业务线查看详情
export function API_FullBusinessLineDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/${data}`, '', 'GET');
}
// 数据监控-全业务线合同详情
export function API_FullBusinessLineContractDetail(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/detail/${data.id}/contract`, data, 'GET');
}
// 数据监控-全业务线关系图-数据集合
export function API_FullBusinessLineGraphData(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/graph/${data}/data`, data, 'GET');
}
// 数据监控-全业务线关系图-数据关系
export function API_FullBusinessLineGraphDataRelation(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/graph/${data}/relation`, data, 'GET');
}
// 数据监控-全业务线关系图-资方分页
export function API_FullBusinessLineBankPage(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/bank/page`, data, 'GET');
}

export function API_FullBusinessLineDetailV1(data) {
	return request(`${ENV.BASE_API}/api/fullBusinessLine/v1/detail/${data}`, data, 'GET');
}
// 仓房下是否有电子锁
export function API_WAREHOUSEGRAINSITUATIONHAVELOCK(data) {
	return request(`${ENV.BASE_GRAIN_API}/grainSituation/haveLock/${data}`, '', 'GET');
}
// 判断当前登录人是否是下游负责人
export function API_ISTERMINALDIRECTOR(data) {
	return request(`${ENV.BASE_API}/api/collectionTerminalManager/isTerminalDirector`, data, 'GET');
}
// 企业对接OA接口
export function API_COMPANYOACHECK(data) {
	return request(`${ENV.BASE_API}/api/common/check/oa`, data, 'GET');
}
export function API_COMPANYOACHECKFIN(data) {
	return request(`${ENV.BASE_API}/api/financing/check/oa`, data, 'GET');
}
export function API_COMPANYOACHECKPOOL(data) {
	return request(`${ENV.BASE_API}/api/asset/receivable/check/oa`, data, 'GET');
}

export function API_BUSINESSMONITORINGDOWANATTACH(data) {
	return request(`${ENV.BASE_API}/api/businessMonitoring/dowan/attach`, data, 'POST', 2, 'blob');
}
// OA流程选择
export function API_GETOAAUDITCODELIST(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOAAuditCodeList`, data, 'GET');
}
export function API_GETFINOAAUDITCODELIST(data) {
	return request(`${ENV.BASE_API}/api/financing/getOAAuditCodeList`, data, 'GET');
}

// 根据关键字查询OA用户信息
export function API_GETOAUSERBYKEYWORD(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOaUserByKeyword`, data, 'GET');
}
// 港口列表
export function API_STORAGEGOODSSTORAGELIST(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/storage/list`, data, 'GET');
}
// 库点列表
export function API_STORAGEGOODSPOINTLIST(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/point/list`, data, 'GET');
}
// 库存点详情
export function API_STORAGEGOODSPOINTDETAIL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/point/detail`, data, 'GET');
}
// 入库列表
export function API_STORAGEGOODSINRECORDPAGE(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/in/record/page`, data, 'GET');
}
// 出库列表
export function API_STORAGEGOODSOUTRECORDPAGE(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/out/record/page`, data, 'GET');
}
// 出入库详情
export function API_STORAGEGOODSOUTRECORDDETAIL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type}/record/${data.id}/detail`, data, 'GET');
}
// 入库/出库合同详情
export function API_STORAGEGOODSOUTRECORDCONTRACT(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type}/record/${data.id}/contract`, data, 'GET');
}
// 出入库单据
export function API_STORAGEGOODSOUTRECORDBILLS(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type}/record/${data.id}/attachment/bills`, data, 'GET');
}
// 出入库单据
export function API_STORAGEGOODSOUTRECORDOTHERATTACHMENT(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type}/record/${data.id}/attachment/other`, data, 'GET');
}
// 删除出入库数据
export function API_STORAGEGOODSOUTRECORDDEL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type}/record/${data.id}/delete`, data, 'DELETE');
}
// 保存出入库
export function API_STORAGEGOODSOUTRECORDSAVE(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/${data.type.toLowerCase()}/record/save`, data, 'POST', 2);
}
// 获取当前登录企业对应的货物记录
export function API_STORAGEGOODSDETAIL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/detail`, data, 'GET');
}
export function API_STORAGEGOODSONLINECONTRACTDETAIL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/in/record/contract/online/detail`, data, 'GET');
}

export function API_STORAGEGOODSOUTRECORDASSETSTATUS(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/in/record/asset/status`, data, 'POST', 2);
}

export function API_STORAGEGOODSINRECORDCONTRACTOFFLINEDETAIL(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/in/record/contract/offline/detail`, data, 'GET');
}

export function API_STORAGEGOODSSTORAGEDIRECTION(data) {
	return request(`${ENV.BASE_API}/api/storage/goods/storage/direction`, data, 'GET');
}

export function API_GETORDERAUDITChAINANOPERATORBYORdERNO(data) {
	return request(`${ENV.BASE_API}/api/order/common/getOrderAuditChainAndOperatorByOrderNo`, data, 'GET');
}

// 签章新重构的接口
// CFCA验证
export function API_CFCAVALID(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/valid`, data, 'GET');
}
// CFCA获取pdf 合成签名到PDF
export function API_CFCAPDF(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/composePdf`, data, 'POST', 2);
}
// CFCA获取hash签名数据
export function API_CFCAHASH(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/pdfHash`, data, 'POST', 2);
}
// 获取验证码
export function API_GetSealMobileVerifyCode(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/getSealMobileVerifyCode/v2`, data, 'GET');
}
// 校验验证码
export function API_GetCheckSealMobileVerifyCode(data) {
	return request(`${ENV.BASE_USER_API}/api/cert/checkSealMobileVerifyCode`, data, 'GET');
}

//船运轨迹优化
//模糊匹配港口名称
export function API_GetPortList(data) {
	return request(`${ENV.BASE_API}/api/deliver/getPortList`, data, 'GET');
}
//获取始发到港时间
export function API_GetPortTimeList(data) {
	return request(`${ENV.BASE_API}/api/deliver/getPortInTimeList`, data, 'GET');
}

//校验富文本的敏感词
export function API_SensitiveWordsCheck(data) {
	return request(`${ENV.BASE_API}/api/sensitiveWord/sensitiveWordsCheck`, data, 'POST', 2);
}

// 船运轨迹2期，百宝箱查询轨迹
// 获取用户船舶查询历史记录
export function API_GetShipHistoryList(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipDetail/searchLog`, data, 'GET');
}
//清空用户船舶查询记录
export function API_ClearShipHistoryList(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipDetail/clearSearchLog`, data, 'GET');
}
//根据关键字模糊搜索
export function API_ShipSearch(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipDetail/search`, data, 'GET');
}
// 查询船舶信息
export function API_GetShipDetailInfo(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipDetail`, data, 'GET');
}
//获取船舶当前位置
export function API_GetShipPosition(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipPosition`, data, 'GET');
}
//获取船舶轨迹查询历史记录
export function API_GetShipTrackSearchLog(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipTrack/searchLog`, data, 'GET');
}
//查询船舶轨迹
export function API_GetShipTrackSearch(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipTrack`, data, 'GET');
}
//清空用户船舶轨迹查询历史记录
export function API_ClearShipTrackSearchLog(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipTrack/clearSearchLog`, data, 'GET');
}
//删除船舶轨迹查询历史记录
export function API_DeleteShipTrackSearchLog(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipTrack/deleteSearchLog`, data, 'GET');
}

// 查询靠港记录
export function API_GetShipPortRecordList(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipPort`, data, 'GET');
}

//关键字搜索地点
export function API_shipBoxGetPortListByKeyword(data) {
	return request(`${ENV.BASE_API}/api/shipBox/getPortListByKeyword`, data, 'GET');
}
//查询船舶轨迹点地理位置信息
export function API_shipBoxShipTrackAddress(data) {
	return request(`${ENV.BASE_API}/api/shipBox/shipTrack/address`, data, 'GET');
}
//计算坐标间直线距离
export function API_shipBoxGetDistanceByLocation(data) {
	return request(`${ENV.BASE_API}/api/shipBox/getDistanceByLocation`, data, 'GET');
}

// 消息中心预警消息统计
export function API_GetMessageCount(data) {
	return request(`${ENV.BASE_API}/api/riskAlertRecord/getTotalCount`, data, 'GET');
}
