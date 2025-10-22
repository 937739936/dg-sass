// 用户、企业模块相关接口
import ENV from './env';
import request from '@/api/request';

// 字典
export function API_DICT(data) {
	return request(`${ENV.BASE_USER_API}/dict`, data, 'GET');
}
// 密码登录
export function API_LOGINBYPWD(data) {
	return request(`${ENV.BASE_USER_API}/api/login/account`, data, 'POST');
}
// 验证码登录
export function API_LOGINBYCODE(data) {
	return request(`${ENV.BASE_USER_API}/api/login/code`, data, 'POST');
}
// 发送登陆短信验证码
export function API_SENDLOGINCODE(data) {
	return request(`${ENV.BASE_USER_API}/api/sendCode/login`, data, 'POST');
}
// 退出登录
export function API_LOGOUT(data) {
	return request(`${ENV.BASE_USER_API}/api/logout`, data, 'POST');
}
// 注册
export function API_REGISTER(data) {
	return request(`${ENV.BASE_USER_API}/api/register`, data, 'POST');
}
// 发送注册验证码
export function API_SENDREGISTECODE(data) {
	return request(`${ENV.BASE_USER_API}/api/sendCode/register`, data, 'POST');
}
// 获取用户权限集合
export function API_PERMISSION(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/permission`, data, 'GET');
}
// 获取用户角色集合
export function API_USERROLE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/roles`, data, 'GET');
}
// 企业用户角色
export function API_USERROLECOMPANYTYPE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/roles/companyType`, data, 'GET');
}
// 获取个人信息
export function API_PERSONALDETAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/detail`, data, 'GET');
}
// 个人信息修改
export function API_PERSONALMODIFY(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/modify`, data, 'PUT', 2);
}
// 修改手机号-发送验证码到原手机
export function API_SENDCODEMODIFYMOBILEOLD(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/sendCode/modifyMobile/old`, data, 'POST');
}
// 修改手机号-发送验证码到新手机
export function API_SENDCODEMODIFYMOBILENEW(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/sendCode/modifyMobile/new`, data, 'POST');
}
// 修改手机号-校验新手机验证码
export function API_CHECKCODEMODIFYMOBILE(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/checkCode/modifyMobile`, data, 'POST');
}
// 修改手机号
export function API_MODIFYMOBILE(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/modifyMobile`, data, 'POST', 2);
}
// 绑定/修改邮箱-发送邮箱验证码
export function API_SENDEMAILCODEMODIFYEMAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/sendEmailCode/modifyEmail`, data, 'POST');
}
// 绑定邮箱
export function API_BINDEMAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/bindEmail`, data, 'POST');
}
// 修改邮箱-发送短信验证码
export function API_SENDSMSCODEMODIFYEMAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/sendSmsCode/modifyEmail`, data, 'POST');
}
// 修改邮箱
export function API_MODIFYEMAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/modifyEmail`, data, 'POST');
}
// 修改邮箱-校验短信验证码
export function API_CHECKSMSCODEMODIFYEMAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/checkSmsCode/modifyEmail`, data, 'POST');
}
// 实名认证-发送短信验证码
export function API_SENDCODEREALNAMEAUTH(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/sendCode/realNameAuth`, data, 'POST');
}
// 验证姓名，身份证号是否合法
export function API_CHECKIDCARD(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/check/idCard`, data, 'POST');
}
// 实名认证-校验验证码 ？？？ 实名认证提交时增加姓名 生份证校验？
export function API_CHECKCODEREALNAMEAUTH(data) {
	return request(`${ENV.BASE_USER_API}/api/personal/checkCode/realNameAuth`, data, 'POST');
}
// 企业信息查看
export function API_COMPANYDETAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/detail`, data, 'GET');
}
// 该用户当前企业所属集团下可加入企业
export function API_COMPANYGROUPCANAPPLYLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply/companyGroup/subsidiaries/canApply`, data, 'GET');
}
// 该用户当前企业所属集团下未认证企业
export function API_COMPANYGROUPNOAUTHLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/companyGroup/subsidiaries/noAuth`, data, 'GET');
}
// 切换企业
export function API_COMPANYUSERSWITCH(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/switch`, data, 'POST', 2);
}
// 删除用户登录历史记录
export function API_COMPANYUSERDELETELOGINHISTORY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/deleteLoginHistory`, data, 'POST', 2);
}
// 该用户当前企业所属集团下不可加入企业
export function API_COMPANYGROUPCANNOTAPPLYLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply/companyGroup/subsidiaries/cannotApply`, data, 'GET');
}
// 申请加入企业
export function API_COMPANYUSERAPPLY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply`, data, 'POST');
}
// 企业银行账户
export function API_COMPANYACCOUNTLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, 'GET');
}
// 企业银行账户
export function API_COMPANYACCOUNTLISTBYCOMPANYID(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/listByCompanyId`, data, 'GET');
}
// 新增企业账户
export function API_COMPANYACCOUNT(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account`, data, 'POST', 2);
}
// 修改企业账户
export function API_COMPANYACCOUNTEDIT(data, id) {
	return request(`${ENV.BASE_USER_API}/api/company/account/${id}`, data, 'PUT', 2);
}
// 银行名称
export function API_COMPANYACCOUNTLISTBANK(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list/bank`, data, 'POST');
}
export function API_COMPANYACCOUNTDELETE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/${data}`, data, 'DELETE');
}
// 企业联系人
export function API_COMPANYLINKMANPAGE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/page`, data, 'GET');
}
// 增加联系人
export function API_COMPANYACCOUNTLISTBANKADD(data) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman`, data, 'POST', 2);
}
// 编辑联系人
export function API_COMPANYACCOUNTLISTBANKEDIT(data, id) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/${id}`, data, 'PUT', 2);
}
// 联系人详情
export function API_COMPANYACCOUNTLISTBANKDETAIL(id) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/${id}`, '', 'GET');
}
// 企业联系人根据companyId查找
export function API_COMPANYLINKMANFINDBYCOMPANYID(data) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/findByCompanyId`, data, 'GET');
}
// 邀请码加入企业
export function API_COMPANYUSERINVITEJOINCOMPANY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite/joinCompany`, data, 'GET');
}
// 企业认证申请
export function API_COMPANYAUTHAPPLY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/apply`, data, 'POST', 2);
}
// 下载企业管理员授权模板
export function API_COMPANYAUTHDOWNLOADADMINLICENSETEMPLATE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/download/adminLicenseTemplate`, data, 'GET');
}
// 企业认证时企查查获取企业信息
export function API_COMPANTGETCOMPANYINFO(data) {
	return request(`${ENV.BASE_USER_API}/api/company/getCompanyInfo`, data, 'GET');
}
// 企业信用代码校验
export function API_COMPANYAUTHCHECKCOMPANYUSCC(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/check/companyUscc`, data, 'POST', 1);
}
// 企业名称校验
export function API_COMPANYAUTHCHECKCOMPANYNAME(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/check/companyName`, data, 'POST');
}
//根据企业简称获取简称拼音
export function API_COMPANYAUTHGETABBREVIATIONSPELL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/auth/getAbbreviationSpell`, data, 'GET');
}
// 修改企业简称
export function API_COMPANYMODIFYABBREVIATIONSPELL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/abbreviationSpell`, data, 'PUT', 2);
}
// 修改企业法定代表人
export function API_COMPANYMODIFYABBREVIATIONLEGAL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/legalPerson`, data, 'PUT', 2);
}
// 修改企业代理人
export function API_COMPANYMODIFYABBREVIATIONAGENT(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/agentPerson`, data, 'PUT', 2);
}
// 支行列表
export function API_COMPANYACCOUNTLISTSUBBRANCH(data) {
	return request(`${ENV.BASE_USER_API}/api/company/account/list/subBranch`, data, 'POST', 2);
}
// 发票
export function API_COMPANYINVOICEDETAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/invoice/detail`, data, 'GET');
}
// 保存发票
export function API_COMPANYINVOICESAVE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/invoice/save`, data, 'POST', 2);
}
// 企业用户列表 不分页
export function API_COMPANYUSERLIST(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/list`, data, 'POST', 2);
}
// 企业用户列表分页
export function API_COMPANYUSERPAGE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/page`, data, 'POST', 2);
}
// 企业账号修改密码
export function API_COMPANYUSERMODIFYPASSOWRD(data, id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/${id}/modify/password`, data, 'PUT', 2);
}
// 修改企业名称或法人-发送验证码
export function API_COMPANYMODIFYSENDCODEMODIFYCOMPANY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/sendCode/modifyCompany`, data, 'GET');
}
// 修改企业名称或法人-发送验证码
export function API_COMPANYMODIFYCHECKCODEMODIFYCOMPANY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/checkCode/modifyCompany`, data, 'GET');
}
// 企业信息修改回显
export function API_COMPANYMODIFYDETAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/detail`, data, 'GET');
}
// 下载模板-企业信息变更申请表
export function API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/download/companyInfoModifyTemplate`, data, 'POST', 2);
}
// 变更申请
export function API_COMPANYMODIFYAPPLY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/modify/apply`, data, 'POST', 2);
}
// 变更管理员-发送验证码
export function API_COMPANYADMINMODIFYMODIFYADMIN(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/sendCode/modifyAdmin`, data, 'GET');
}
// 变更管理员-校验验证码
export function API_COMPANYADMINMODIFYCHECKCODEMODIFYADMIN(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/checkCode/modifyAdmin`, data, 'GET');
}
// 待变更企业管理员
export function API_COMPANYADMINMODIFYTOMODIFY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/toModify`, data, 'GET');
}
// 删除联系人
export function API_COMPANYLINKMANDELETE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/linkman/${data}`, '', 'DELETE');
}
// 修改企业管理员
export function API_COMPANYADMINMODIFYMODIFYADMINUSER(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/modifyAdmin`, data, 'POST', 2);
}
// 申请列表
export function API_COMPANYUSERAPPLYPAGE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply/page`, data, 'POST', 2);
}
// 企业邀请列表
export function API_COMPANYUSERINVITEPAGE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite/page`, data, 'POST', 2);
}
// 下载模板-企业管理员信息变更申请表
export function API_COMPANYADMINMODIFYDOWNLOADADMINAPPLYTEMPLATE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/download/adminApplyTemplate`, data, 'POST', 2);
}
// 创建企业用户
export function API_COMPANYUSERADD(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/add`, data, 'POST', 2);
}
// 审批拒绝
export function API_COMPANYUSERREJECT(id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply/${id}/reject`, '', 'POST');
}
// 获取未分配的企业账户列表
export function API_COMPANYUSERLISTUNASSIGNED() {
	return request(`${ENV.BASE_USER_API}/api/company/user/list/unAssigned`, '', 'GET');
}
// 用户申请通过
export function API_COMPANYUSERAPPLYPASS(data, id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/apply/${id}/pass`, data, 'POST');
}
// 邀请员工
export function API_COMPANYUSERINVITE(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite`, data, 'POST', 2);
}
// 取消申请
export function API_COMPANYUSERINVITECANCEL(id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite/${id}/cancel`, '', 'GET');
}
// 重新邀请
export function API_COMPANYUSERINVITEREINVITE(id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite/${id}/reInvite`, '', 'GET');
}
// 解绑
export function API_COMPANYUSERINVITEUNBIND(id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/${id}/unbind`, '', 'PUT');
}
// 修改企业用户
export function API_COMPANYUSERMODIFY(data, id) {
	return request(`${ENV.BASE_USER_API}/api/company/user/${id}/modify`, data, 'PUT', 2);
}
// 根据服务类型获取卖方列表
export function API_GetSellListByServiceType(data) {
	return request(`${ENV.BASE_USER_API}/api/company/companyListByServiceType`, data, 'GET');
}
//获取合同签约地
export function API_GetContractSignPlace(data) {
	return request(`${ENV.BASE_USER_API}/api/company/getContractSignAddress`, data, 'GET');
}
// 员工邀请验证
export function API_COMPANYUSERINVITEVALIDATED(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/invite/validated`, data, 'POST');
}
// 获取可切换企业列表
export function API_COMPANYGETSWITCHCOMPANY(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/getSwitchCompany`, data, 'POST', 2);
}
// 企业管理员回显
export function API_COMPANYADMINMODIFYDETAIL(data) {
	return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/detail`, data, 'GET');
}
// 获取公钥
export function API_GETKEY(data) {
	return request(`${ENV.BASE_USER_API}/api/getKey`, data, 'GET');
}
// 客户信息管理列表分页
export function API_COMPANYCUSTOMER(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/page`, data, 'GET');
}
// 客户信息管理导出
export function API_COMPANYCUSTOMERExport(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/export`, data, 'GET', 1, 'blob');
}
// 客户类型
export function API_COMPANYCUSTOMERTYPE() {
	return request(`${ENV.BASE_USER_API}/api/company/customer/type`, '', 'GET');
}
// 客户信息新增
export function API_COMPANYCUSTOMERTYPEADD(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer`, data, 'POST', 2);
}
// 客户信息详情
export function API_COMPANYCUSTOMERTYPEID(id) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/${id}`, '', 'GET');
}
// 客户信息修改
export function API_COMPANYCUSTOMERTYPEPUT(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer`, data, 'PUT', 2);
}
// 客户信息删除
export function API_COMPANYCUSTOMERDELETE(id) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/${id}`, '', 'DELETE');
}
// 股东信息-实控人
export function API_CompanyActualController(id) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/detail/actualController/${id}`, id, 'GET');
}
// 股东信息-最新公示
export function API_CompanyCustomerNews(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/shareholder/pubStock`, data, 'GET');
}
// 股东信息-工商登记
export function API_CompanyCustomerRegister(data) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/shareholder/regStock`, data, 'GET');
}
// 企业客户基本信息
export function API_CompanyCustomerInfo(id) {
	return request(`${ENV.BASE_USER_API}/api/company/customer/detail/${id}`, id, 'GET');
}

// 企业资料纳税申报材料列表分页
export function API_COMPANYTAX(data) {
	return request(`${ENV.BASE_USER_API}/api/company/tax/page`, data, 'GET');
}
// 企业资料纳税申报材料新增
export function API_COMPANYTAXADD(data) {
	return request(`${ENV.BASE_USER_API}/api/company/tax`, data, 'POST', 2);
}
// 企业资料纳税申报材料删除
export function API_COMPANYTAXDELETE(id) {
	return request(`${ENV.BASE_USER_API}/api/company/tax/${id}`, '', 'DELETE');
}
// 企业资料纳税申报材料详情
export function API_COMPANYTAXID(id) {
	return request(`${ENV.BASE_USER_API}/api/company/tax/${id}`, '', 'GET');
}
// 企业资料其他文件-文件类型
export function API_COMPANYTAXOTHERTYPE() {
	return request(`${ENV.BASE_USER_API}/api/company/attachment/other/fileType`, '', 'GET');
}
// 企业资料其他文件新增
export function API_COMPANYTAXOTHERADD(data) {
	return request(`${ENV.BASE_USER_API}/api/company/attachment/other`, data, 'POST', 2);
}
// 企业资料其他文件列表分页
export function API_COMPANYTAXOTHER(data) {
	return request(`${ENV.BASE_USER_API}/api/company/attachment/other/page`, data, 'GET');
}
// 企业资料其他文件删除id
export function API_COMPANYTAXOTHERDELETE(id) {
	return request(`${ENV.BASE_USER_API}/api/company/attachment/other/${id}`, '', 'DELETE');
}
// 企业资料-企业年报列表
export function API_CompanyFinanceReport(data) {
	return request(`${ENV.BASE_USER_API}/api/company/financeReport/page`, data, 'GET');
}
// 企业资料-新增企业年报
export function API_AddFinanceReport(data) {
	return request(`${ENV.BASE_USER_API}/api/company/financeReport/add`, data, 'POST', 2);
}
// 企业资料-删除企业年报
export function API_DeleteFinanceReport(id) {
	return request(`${ENV.BASE_USER_API}/api/company/financeReport/delete/${id}`, '', 'DELETE');
}
// 企业资料-企业年报详情
export function API_FinanceReportDetail(id) {
	return request(`${ENV.BASE_USER_API}/api/company/financeReport/detail/${id}`, id, 'GET');
}

//获取协议
export function API_GET_AGREEMENT_BY_FILETYPE(fileType) {
	return request(`${ENV.BASE_USER_API}/api/agreement/get`, { fileType }, 'GET');
}
//获取协议历史版本
export function API_GET_AGREEMENT_HISTORY_BY_FILETYPE(fileType) {
	return request(`${ENV.BASE_USER_API}/api/agreement/getHistory`, { fileType }, 'GET');
}
//获取协议by id
export function API_GET_AGREEMENT_BY_ID(id) {
	return request(`${ENV.BASE_USER_API}/api/agreement/queryById`, { id }, 'GET');
}
//获取验证码/无感参数
export function API_GET_APPID(data) {
	return request(`${ENV.BASE_USER_API}/api/captcha/getCaptchaAppId/v2`, data, 'GET');
}

// 忘记密码 校验账号
export function API_GET_FORGET_PSD_CHECK(data) {
	return request(`${ENV.BASE_USER_API}/api/forgetPwd/account/check`, data, 'GET');
}

// 忘记密码 发送短信验证码
export function API_GET_FORGET_PSD_SEND_CODE(data) {
	return request(`${ENV.BASE_USER_API}/api/forgetPwd/code/send`, data, 'POST', 2);
}

// 忘记密码 下一步 校验短信验证码
export function API_GET_FORGET_PSD_CODE_CHECK(data) {
	return request(`${ENV.BASE_USER_API}/api/forgetPwd/code/check`, data, 'POST', 2);
}
//获取协滑块验证码参数
export function API_GET_APPID_YD(data) {
	return request(`${ENV.BASE_USER_API}/api/captcha/getCaptchaAppId`, data, 'GET');
}
//校验手机号是否存在
export function API_GET_ACCOUNT_CHECK(data) {
	return request(`${ENV.BASE_USER_API}/api/account/check`, data, 'GET');
}

// 忘记密码 密码找回
export function API_GET_FORGET_PSD_CHANGE(data) {
	return request(`${ENV.BASE_USER_API}/api/forgetPwd/reset`, data, 'POST', 2);
}

// 免密登录
export function API_LOGIN_FREE_PASSWORD(data) {
	return request(`${ENV.BASE_USER_API}/api/login/free`, data, 'POST');
}
// 刷新token
export function API_REFRESH_TOKEN(data) {
	return request(`${ENV.BASE_USER_API}/api/refreshToken`, data, 'POST');
}
