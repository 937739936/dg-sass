import ENV from "@/v2/config/env";
import request from "@/api/request";


// 获取用户权限集合
export function API_PERMISSION(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/permission`, data, "GET");
}

// 获取个人信息
export function API_PERSONALDETAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/detail`, data, "GET");
}

// 修改手机号-发送验证码到原手机
export function API_SENDCODEMODIFYMOBILEOLD(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendCode/modifyMobile/old`, data, "POST");
}

// 修改手机号-发送验证码到新手机
export function API_SENDCODEMODIFYMOBILENEW(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendCode/modifyMobile/new`, data, "POST");
}

// 修改手机号-校验新手机验证码
export function API_CHECKCODEMODIFYMOBILE(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/checkCode/modifyMobile`, data, "POST");
}

// 修改手机号
export function API_MODIFYMOBILE(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modifyMobile`, data, "POST", 2);
}

// 绑定/修改邮箱-发送邮箱验证码
export function API_SENDEMAILCODEMODIFYEMAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendEmailCode/modifyEmail`, data, "POST");
}

// 修改邮箱-发送短信验证码
export function API_SENDSMSCODEMODIFYEMAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendSmsCode/modifyEmail`, data, "POST");
}

// 修改邮箱-校验短信验证码
export function API_CHECKSMSCODEMODIFYEMAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/checkSmsCode/modifyEmail`, data, "POST");
}

// 绑定邮箱
export function API_BINDEMAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/bindEmail`, data, "POST");
}

// 修改邮箱
export function API_MODIFYEMAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modifyEmail`, data, "POST");
}

// 企业信息查看
export function API_COMPANYDETAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/detail`, data, "GET");
}

// 企业认证申请
export function API_COMPANYAUTHAPPLY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/apply`, data, "POST", 2);
}

// 下载企业管理员授权模板
export function API_COMPANYAUTHDOWNLOADADMINLICENSETEMPLATE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/download/adminLicenseTemplate`, data, "POST", 2);
}

// 企业认证时企查查获取企业信息
export function API_COMPANTGETCOMPANYINFO(data) {
  return request(`${ENV.BASE_USER_API}/api/company/getCompanyInfo`, data, "GET");
}

// 企业信用代码校验
export function API_COMPANYAUTHCHECKCOMPANYUSCC(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/check/companyUscc`, data, "POST", 1);
}
/** 根据企业类型查询企业可选择的经营业务类型 */
export const getCompanyBusinessList = (data) => request(`${ENV.BASE_USER_API}/api/company/auth/businessScope`, data, "GET");
// 验证姓名，身份证号是否合法
export function API_CHECKIDCARD(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/check/idCard`, data, "POST");
}

// 企业名称校验
export function API_COMPANYAUTHCHECKCOMPANYNAME(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/check/companyName`, data, "POST");
}

// 企业重新认证回显
export function API_USERCENTERGETAPPLYCOMPANYAUTH(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/detail`, data, "GET");
}

//根据企业简称获取简称拼音
export function API_COMPANYAUTHGETABBREVIATIONSPELL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/getAbbreviationSpell`, data, "GET");
}

// 企业信息修改回显
export function API_COMPANYMODIFYDETAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/detail`, data, "GET");
}

// 修改企业名称或法定代表人-发送验证码
export function API_COMPANYMODIFYSENDCODEMODIFYCOMPANY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/sendCode/modifyCompany`, data, "GET");
}

// 修改企业名称或法定代表人-发送验证码
export function API_COMPANYMODIFYCHECKCODEMODIFYCOMPANY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/checkCode/modifyCompany`, data, "GET");
}

// 下载模板-企业信息变更申请表
export function API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/download/companyInfoModifyTemplate`, data, "POST", 2);
}

// 变更申请
export function API_COMPANYMODIFYAPPLY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/apply`, data, "POST", 2);
}

// 变更管理员-发送验证码
export function API_COMPANYADMINMODIFYMODIFYADMIN(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/sendCode/modifyAdmin`, data, "GET");
}

// 变更管理员-校验验证码
export function API_COMPANYADMINMODIFYCHECKCODEMODIFYADMIN(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/checkCode/modifyAdmin`, data, "GET");
}

// 待变更企业管理员
export function API_COMPANYADMINMODIFYTOMODIFY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/toModify`, data, "GET");
}

// 修改企业管理员
export function API_COMPANYADMINMODIFYMODIFYADMINUSER(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/modifyAdmin`, data, "POST", 2);
}

// 下载模板-企业管理员信息变更申请表
export function API_COMPANYADMINMODIFYDOWNLOADADMINAPPLYTEMPLATE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/download/adminApplyTemplate`, data, "POST", 2);
}

// 企业管理员回显
export function API_COMPANYADMINMODIFYDETAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/detail`, data, "GET");
}

// 企业用户列表 不分页
export function API_COMPANYUSERLIST(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/list`, data, "POST", 2);
}

// 客户信息管理列表分页
export function API_COMPANYCUSTOMER(data) {
  return request(`${ENV.BASE_USER_API}/api/company/customer/page`, data, "GET");
}

// 客户类型
export function API_COMPANYCUSTOMERTYPE() {
  return request(`${ENV.BASE_USER_API}/api/company/customer/type`, "", "GET");
}

// 客户信息删除
export function API_COMPANYCUSTOMERDELETE(id) {
  return request(`${ENV.BASE_USER_API}/api/company/customer/${id}`, "", "DELETE");
}

// 客户信息新增
export function API_COMPANYCUSTOMERTYPEADD(data) {
  return request(`${ENV.BASE_USER_API}/api/company/customer`, data, "POST", 2);
}

// 客户信息管理导出
export function API_COMPANYCUSTOMERExport(data) {
  return request(`${ENV.BASE_USER_API}/api/company/customer/export`, data, "GET", 1, "blob");
}

// 客户信息详情
export function API_COMPANYCUSTOMERTYPEID(id) {
  return request(`${ENV.BASE_USER_API}/api/company/customer/${id}`, "", "GET");
}
// 客户信息纳税详情
export function API_COMPANYCUSTOMERTAX(data) {
  return request(`${ENV.BASE_USER_API}/api/company/tax/new/list`, data, "GET");
}

export function API_COMPANYCUSTOMERTAXADD(data) {
   return request(`${ENV.BASE_USER_API}/api/company/tax`, data, "POST",2);
}
export function API_COMPANYCUSTOMERTAXDEL(data) {
   return request(`${ENV.BASE_USER_API}/api/company/tax/attachment/delete?fileId=${data.id}`, data, "DELETE");
}
// 客户信息修改
export function API_COMPANYCUSTOMERTYPEPUT(data) {
  return request(`${ENV.BASE_USER_API}/api/company/customer`, data, "PUT", 2);
}
// 股东信息-实控人
export function API_CompanyActualController(id){
    return request(`${ENV.BASE_USER_API}/api/company/customer/detail/actualController/${id}`, id, 'GET')
}
// 股东信息-最新公示
export function API_CompanyCustomerNews(data){
    return request(`${ENV.BASE_USER_API}/api/company/customer/shareholder/pubStock`, data, 'GET')
}
// 股东信息-工商登记
export function API_CompanyCustomerRegister(data){
    return request(`${ENV.BASE_USER_API}/api/company/customer/shareholder/regStock`, data, 'GET')
}
// 企业客户基本信息
export function API_CompanyCustomerInfo(id){
    return request(`${ENV.BASE_USER_API}/api/company/customer/detail/${id}`, id, 'GET')
}

// 企业账号修改密码
export function API_COMPANYUSERMODIFYPASSOWRD(data, id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/${id}/modify/password`, data, "PUT", 2);
}

// 企业资料纳税申报材料详情
export function API_COMPANYTAXID(id) {
  return request(`${ENV.BASE_USER_API}/api/company/tax/${id}`, "", "GET");
}

// 企业用户列表分页
export function API_COMPANYUSERPAGE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/page`, data, "POST", 2);
}

// 申请列表
export function API_COMPANYUSERAPPLYPAGE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/page`, data, "POST", 2);
}

// 企业邀请列表
export function API_COMPANYUSERINVITEPAGE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite/page`, data, "POST", 2);
}

// 创建企业用户
export function API_COMPANYUSERADD(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/add`, data, "POST", 2);
}

// 审批拒绝
export function API_COMPANYUSERREJECT(id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/${id}/reject`, "", "POST");
}

// 获取未分配的企业账户列表
export function API_COMPANYUSERLISTUNASSIGNED() {
  return request(`${ENV.BASE_USER_API}/api/company/user/list/unAssigned`, "", "GET");
}

// 用户申请通过
export function API_COMPANYUSERAPPLYPASS(data, id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/${id}/pass`, data, "POST");
}

// 邀请员工
export function API_COMPANYUSERINVITE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite?ticket=${data.ticket}&randstr=${data.randstr}`, data, "POST", 2);
}

// 取消申请
export function API_COMPANYUSERINVITECANCEL(id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite/${id}/cancel`, "", "GET");
}

// 重新邀请
export function API_COMPANYUSERINVITEREINVITE(id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite/${id}/reInvite`, "", "GET");
}

// 解绑
export function API_COMPANYUSERINVITEUNBIND(id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/${id}/unbind`, "", "PUT");
}

// 修改企业用户
export function API_COMPANYUSERMODIFY(data, id) {
  return request(`${ENV.BASE_USER_API}/api/company/user/${id}/modify`, data, "PUT", 2);
}

// 企业用户角色
export function API_USERROLECOMPANYTYPE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/roles/companyType`, data, "GET");
}

// 企业已开通的服务
export function API_USERCOMPANYSERVICE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/getCompanyService`, data, "GET");
}

// 员工邀请验证
export function API_COMPANYUSERINVITEVALIDATED(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite/validated`, data, "POST");
}

// 该用户当前企业所属集团下可加入企业
export function API_COMPANYGROUPCANAPPLYLIST(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/companyGroup/subsidiaries/canApply`, data, "GET");
}

// 该用户当前企业所属集团下不可加入企业
export function API_COMPANYGROUPCANNOTAPPLYLIST(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/companyGroup/subsidiaries/cannotApply`, data, "GET");
}

// 申请加入企业
export function API_COMPANYUSERAPPLY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply`, data, "POST");
}

// 企业银行账户
export function API_COMPANYACCOUNTLIST(data) {
  return request(`${ENV.BASE_USER_API}/api/company/account/list`, data, "GET");
}

export function API_COMPANYACCOUNTDELETE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/account/${data}`, data, "DELETE");
}

// 修改企业简称
export function API_COMPANYMODIFYABBREVIATIONSPELL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/abbreviationSpell`, data, "PUT", 2);
}

// 修改企业法人
export function API_COMPANYMODIFYABBREVIATIONLEGAL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/legalPerson`, data, "PUT", 2);
}

// 修改企业代理人
export function API_COMPANYMODIFYABBREVIATIONAGENT(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/agentPerson`, data, "PUT", 2);
}

// 发票
export function API_COMPANYINVOICEDETAIL(data) {
  return request(`${ENV.BASE_USER_API}/api/company/invoice/detail`, data, "GET");
}

// 保存发票
export function API_COMPANYINVOICESAVE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/invoice/save`, data, "POST", 2);
}

// 该用户当前企业所属集团下未认证企业
export function API_COMPANYGROUPNOAUTHLIST(data) {
  return request(`${ENV.BASE_USER_API}/api/company/auth/companyGroup/subsidiaries/noAuth`, data, "GET");
}

// 企业联系人
export function API_COMPANYLINKMANPAGE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/linkman/page`, data, "GET");
}

// 增加联系人
export function API_COMPANYACCOUNTLISTBANKADD(data) {
  return request(`${ENV.BASE_USER_API}/api/company/linkman`, data, "POST", 2);
}

// 编辑联系人
export function API_COMPANYACCOUNTLISTBANKEDIT(data, id) {
  return request(`${ENV.BASE_USER_API}/api/company/linkman/${id}`, data, "PUT", 2);
}

// 联系人详情
export function API_COMPANYACCOUNTLISTBANKDETAIL(id) {
  return request(`${ENV.BASE_USER_API}/api/company/linkman/${id}`, "", "GET");
}

// 删除联系人
export function API_COMPANYLINKMANDELETE(data) {
  return request(`${ENV.BASE_USER_API}/api/company/linkman/${data}`, "", "DELETE");
}

// 新增企业账户
export function API_COMPANYACCOUNT(data) {
  return request(`${ENV.BASE_USER_API}/api/company/account`, data, "POST", 2);
}

// 修改企业账户
export function API_COMPANYACCOUNTEDIT(data, id) {
  return request(`${ENV.BASE_USER_API}/api/company/account/${id}`, data, "PUT", 2);
}

// 银行名称
export function API_COMPANYACCOUNTLISTBANK(data) {
  return request(`${ENV.BASE_USER_API}/api/company/account/list/bank`, data, "POST");
}

// 支行列表
export function API_COMPANYACCOUNTLISTSUBBRANCH(data) {
  return request(`${ENV.BASE_USER_API}/api/company/account/list/subBranch`, data, "POST", 2);
}

// 企业资料其他文件列表分页
export function API_COMPANYTAXOTHER(data) {
  return request(`${ENV.BASE_USER_API}/api/company/attachment/other/page`, data, "GET");
}

// 企业资料其他文件-文件类型
export function API_COMPANYTAXOTHERTYPE() {
  return request(`${ENV.BASE_USER_API}/api/company/attachment/other/fileType`, "", "GET");
}

// 企业资料其他文件新增
export function API_COMPANYTAXOTHERADD(data) {
  return request(`${ENV.BASE_USER_API}/api/company/attachment/other`, data, "POST", 2);
}

// 企业资料其他文件删除id
export function API_COMPANYTAXOTHERDELETE(id) {
  return request(`${ENV.BASE_USER_API}/api/company/attachment/other/${id}`, "", "DELETE");
}
// 企业资料-企业年报列表
export function API_CompanyFinanceReport(data) {
  return request(`${ENV.BASE_USER_API}/api/company/financeReport/page`, data, 'GET')
}
// 企业资料-新增企业年报
export function API_AddFinanceReport(data) {
  return request(`${ENV.BASE_USER_API}/api/company/financeReport/add`, data, 'POST', 2)
}
// 企业资料-删除企业年报
export function API_DeleteFinanceReport(id) {
  return request(`${ENV.BASE_USER_API}/api/company/financeReport/delete/${id}`, '', 'DELETE')
}
// 企业资料-企业年报详情
export function API_FinanceReportDetail(id) {
  return request(`${ENV.BASE_USER_API}/api/company/financeReport/detail/${id}`,id, 'GET')
}

// 企业资料纳税申报材料列表分页
export function API_COMPANYTAX(data) {
  return request(`${ENV.BASE_USER_API}/api/company/tax/page`, data, "GET");
}

// 企业资料纳税申报材料新增
export function API_COMPANYTAXADD(data) {
  return request(`${ENV.BASE_USER_API}/api/company/tax`, data, "POST", 2);
}

// 企业资料纳税申报材料删除
export function API_COMPANYTAXDELETE(id) {
  return request(`${ENV.BASE_USER_API}/api/company/tax/${id}`, "", "DELETE");
}

// 退出登录
export function API_LOGOUT(data) {
  return request(`${ENV.BASE_USER_API}/api/new/logout`, data, "POST");
}

// 邀请码加入企业
export function API_COMPANYUSERINVITEJOINCOMPANY(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/invite/joinCompany`, data, "GET");
}

// 个人信息修改
export function API_PERSONALMODIFY(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modify`, data, "PUT", 2);
}

// 实名认证
export function API_REALNAMEAUTH(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/realNameAuthBy3Meta`, data, "POST");
}

// 实名认证-发送短信验证码
export function API_SENDCODEREALNAMEAUTH(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendCode/realNameAuth`, data, "POST");
}

// 姓名、手机号、身份证号一致校验
export function API_idCardAuth3Meta(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/checkCode/idCardAuth3Meta`, data, "POST");
}
// 个人修改手机号时校验
export function API_nameMobileCheckCode(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/checkCode/name/mobile`, data, "POST");
}


// 电子签章
// 获取所有的电子签章的业务章类型
export function API_SealBusinessTypeList() {
  return request(`${ENV.BASE_USER_API}/api/seal/business-type-list`, '', 'GET')
}
// 电子签章申请相关材料模版下载
export function API_CertApplyTemplateDownload(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/template/download`, data, 'POST', 2)
}
// 电子签章申请提交
export function API_CertApply(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply`, data, 'POST', 2)
}
// 电子签章申请的详情信息
export function API_CertApplyInfo(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply`, data, 'GET')
}
// 证书详细信息
export function API_CertInfo() {
  return request(`${ENV.BASE_USER_API}/api/cert/Info`, '', 'GET')
}
// 电子签章激活发送手机验证码
export function API_ActivateCertsSendCode(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/activateCerts/sendCode`, data, 'GET')
}
// 电子签章激活提交
export function API_ActivateCertsSubmit(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/activateCertsOfCompany`, data, 'POST', 2)
}
// 电子签章解冻
export function API_CertUnfrozen() {
  return request(`${ENV.BASE_USER_API}/api/cert/unfrozen`, '', 'PUT')
}
// 电子签章冻结
export function API_CertFrozen() {
  return request(`${ENV.BASE_USER_API}/api/cert/frozen`, '', 'PUT')
}
// 变更签章员提交
export function API_ChangeCertOperator(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify`, data, 'POST',2)
}
// 变更签章员信息
export function API_ChangeCertOperatorInfo(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify`, data, 'GET')
}


// 变更签章员手机号获取验证码
export function API_CertSingerModifyMobileCode(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify/mobile/code`, data, 'GET')
}
// 变更签章员手机号
export function API_CertSingerModifyMobile(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify/mobile`, data, 'POST', 2)
}
// 变更签章员手机号模版下载
export function API_CertSingerModifyMobileTemplateDownload() {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify/template/download/mobile`, '', 'GET', 1, 'blob')
}


// 企业信息缺失提示
export function API_CompanyInfolossWarn() {
  return request(`${ENV.BASE_USER_API}/api/company/infoLoss/warn`, '', 'GET')
}
// 判断用户身份，能否直接修改手机号的校验
export function API_PersonalModifyMobileValid(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modifyMobile/valid`, data, 'POST', 2)
}

//修改管理员手机号 发送验证码
export function API_ModifyAadminMobileSendCode(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/modifyMobile/sendCode`, data, 'GET')
}
//提交管理员手机号变更申请
export function API_ModifyAdminMobileSubmit(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/modifyMobile`, data, 'POST', 2)
}
//下载管理员手机号变更申请书
export function API_ModifyAdminMobileTemplateDownload(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/download/adminModifyMobileTemplate`, data,'GET', 1, 'blob')
}
//获取用户角色信息
export function API_CompanyUserRoleInfo(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/role/userInfo`, data, 'GET')
}

// 企业签约地

// 添加合同签约地
export function API_CompanySignAddressAdd(data) {
  return request(`${ENV.BASE_USER_API}/api/company/signAddress`, data, 'POST', 2)
}
// 合同签约地列表
export function API_CompanySignAddressPage(data) {
  return request(`${ENV.BASE_USER_API}/api/company/signAddress/page`, data, 'GET')
}
// 合同签约地列表全量查询
export function API_CompanySignAddressSellerandbuyer(data) {
  return request(`${ENV.BASE_USER_API}/api/company/signAddress/sellerandbuyer`, data, 'GET')
}
// 编辑合同签约地
export function API_CompanySignAddressEdit(data) {
  return request(`${ENV.BASE_USER_API}/api/company/signAddress/${data.id}`, data, "PUT", 2);
}
// 删除合同签约地
export function API_CompanySignAddressDelete(id) {
  return request(`${ENV.BASE_USER_API}/api/company/signAddress/${id}`, "", "DELETE");
}

// 下载机构证书申请表模版
export function API_DownloadCertApplyTemplate(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/template/download/certApply`, data,'POST',2, 'blob')
}
// 新增印模下载数字证书申请表模版
export function API_AddDownloadCertApplyTemplate(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/template/download/certApply/noValid`, data,'POST',2, 'blob')
}
// 下载数字证书申请授权书模版
export function API_DownloadAuthorizationTemplate(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/template/download/authorization
  `, data,'POST',2, 'blob')
}
//获取变更管理员最近的一条驳回记录
export function API_GetAdminModifyLastEditDetail() {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/getLastEditDetail
  `, '','GET')
}
//下载签章员数字证书变更申请表
export function API_DownloadSingerModifyTemplateApply(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify/template/apply
  `,data,'POST',2, 'blob')
}
//下载签章员数字证书变更授权书
export function API_DownloadSingerModifyTemplateAuthorization(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/signer/modify/template/authorization
  `,data,'POST',2, 'blob')
}



// 新增签章提交
export function API_CertSealChangeApply(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/certSealChangeApply`, data, 'POST', 2)
}
// 新增签章驳回后重新新增数据回显
export function API_CertSealChangeApplyInfo(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/getCertChangeDetail`, data, 'GET')
}
// 下载授权代表说明函
export function API_DownloadAuthorizedLetterTemplate(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/template/download/authorizedLetter`, data,'POST',2, 'blob')
}
//签章配置列表
export function API_GetConfigSignatureList(data) {
  return request(`${ENV.BASE_USER_API}/api/electronic/doc/getSealConfigList`, data,'GET')
}
// 证书临期消息
export function API_CertRenewalMsg(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/renewalApply/getApplyMsgList`, data,'GET')
}
// 证书续期提交
export function API_CertRenewalApplySubmit(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/renewalApply/certRenewalApplySubmit`, data,'POST',2)
}
// 证书续期/换发申请书模版下载
export function API_DownloadCertRenewal(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/renewalApply/template/download/certRenewal`, data,'POST',2, 'blob')
}
// 证书续期托管盖章
export function API_CertRenewalAutoSignature(data) {
  return request(`${ENV.BASE_API}/api/cfca/certRenewalAutoSignature`, data,'POST',2)
}
// 证书续期Ukey盖章
export function API_CertRenewalGetToSignList(data) {
  return request(`${ENV.BASE_API}/api/cfca/cert/renewal/getToSigList`, data,'POST',2)
}
// 获取证书续期（换发）申请书
export function API_GetCertRenewalPdf(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/renewalApply/generateCertRenewalPdf`, data,'GET')
}
// 获取新增证书签章模式的证书申请表
export function API_GetAddCertModelPdf(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/generateCertModelAddPdf`, data,'POST',2)
}
// 获取新增证书签章模式的证书申请表
export function API_CertModelAddApplySubmit(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/certModelAddApply`, data,'POST',2)
}
//新增证书签章模式-托管盖章
export function API_CertModelAddAutoSignature(data) {
  return request(`${ENV.BASE_API}/api/cfca/certModelAddAutoSignature`, data,'POST',2)
}
//新增证书签章模式-UKEY盖章
export function API_CertModelAddGetToSigList(data) {
  return request(`${ENV.BASE_API}/api/cfca/certModelAdd/getToSigList`, data,'POST',2)
}


// 企业联系人根据companyId查找
export function API_COMPANYLINKMANFINDBYCOMPANYID(data){
  return request(`${ENV.BASE_USER_API}/api/company/linkman/findByCompanyId`, data, 'GET')
}

//签章各类申请前校验
export function API_CheckBeforeEachApply(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/checkBeforeEachApply`, data,'GET')
}
// 根据服务类型获取卖方列表
export function API_GetSellListByServiceType(data) {
  return request(`${ENV.BASE_USER_API}/api/company/companyListByServiceType`, data, 'GET')
}
//获取合同签约地
export function API_GetContractSignPlace(data) {
  return request(`${ENV.BASE_USER_API}/api/company/getContractSignAddress`, data, 'GET')
}

// 判断当前企业是否已有合同专用章印模
export function API_CheckHaveContractSeal(data) {
  return request(`${ENV.BASE_USER_API}/api/cert/apply/checkHaveContractSeal` , data, 'GET')
}

// 变更管理员授权期限
export function API_GetAdminModifyValidity(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/adminModify/modifyAdminAuthValidTime`, data, 'POST', 2)
}

// 管理员用户信息详情
export function API_GetAdminUserDetail(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/admin/detail`, data, 'GET')
}
// 三要素验证未通过提交
export function API_ThreeElementNotPassSubmit(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/realNameAuthBy3MetaAndFile`, data, 'POST', 1)
}

// 获取实名认证申请记录详情
export function API_GetRealNameAuthDetail(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/realAuthApplyLogInfo`, data, 'GET')
}

// 修改手机号-新手机号收到的验证码-校验验证码
export function API_CheckNewPhoneCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/checkModifyMobileNewMobileCode`, data, 'POST')
}

// 存储修改手机号时3要素未通过后提交的
export function API_Store3MetaNotPass(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modifyMobileBy3MetaAndFile`, data, 'POST')
}

// 绑定邮箱发送手机短信验证码
export function API_SendBindEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendCode/bindEmail`, data, 'POST')
}
// 绑定邮箱校验手机短信验证码
export function API_CheckBindEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/checkCode/bindEmail`, data, 'POST')
}

// 修改邮箱发送短信或邮件验证码接口
export function API_SendModifyEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendSmsCode/modifyEmail`, data, 'POST')
}
// 修改邮箱短信或邮件验证码检查接口
export function API_CheckModifyEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/checkSmsCode/modifyEmail`, data, 'POST')
}

// 修改邮件新邮件获取邮件验证码接口
export function API_SendNewEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/sendEmailCode/modifyEmail`, data, 'POST')
}
// 修改邮件校验邮件验证码并修改邮件提交接口
export function API_CheckNewEmailCode(data) {
  return request(`${ENV.BASE_USER_API}/api/personal/modifyEmail`, data, 'POST')
}

// 管理员到期或冻结提醒
export function API_AdminExpireOrFreezeRemind(data) {
  return request(`${ENV.BASE_USER_API}/api/company/admin/auth/expire/warn`, data, 'GET')
}

// 企业工商信息变更类型查询
export function API_GetCompanyInfoChangeType(data) {
  return request(`${ENV.BASE_USER_API}/api/company/change/history/eci/change/query`, data, 'GET')
}

// 根据企业信息变更类型查询企业信息
export function API_GetCompanyInfoByChangeType(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/formInitInfoByChangeType`, data, 'GET')
}

// 修改企业管理员身份证有效期
export function API_ModifyAdminIdCardValidity(data) {
  return request(`${ENV.BASE_USER_API}/api/company/modify/adminCardValidTime`, data, 'PUT', 2)
}

// 当前用户申请加入企业的最新记录
export function API_GetApplyJoinLatestRecord(data) {
  return request(`${ENV.BASE_USER_API}/api/company/user/apply/lastLog`, data, 'GET')
}

// 电子证书开通所需材料--下载模版
export function API_SystemConfigFile(data) {
  return request(`${ENV.BASE_USER_API}/api/systemConfigFile/downloadZip`, data, 'POST', 2, 'blob')
}