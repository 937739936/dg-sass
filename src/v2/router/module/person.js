/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
  nickName: "账户中心",
  path: "account",
  meta: {
    title: '账户中心',
  },
  redirect: 'account/person',
  component: () => import("@/v2/center/person/views/index.vue"),
  children: [
    {
      nickName: "个人信息",
      path: "person",
      meta: {
        title: '个人信息',
      },
      redirect: 'person/info',
      component: () => import("@/v2/center/person/views/index.vue"),
      children: [
        {
          nickName: "个人信息",
          path: "info",
          name: "personIndex",
          component: () => import("@/v2/center/person/views/Person.vue"),
        },
        {
          nickName: "实名认证",
          path: "info/auth",
          name: "personAuth",
          component: () => import("@/v2/center/person/views/components/Auth.vue"),
        },
        {
          nickName: "实名认证-提交成功",
          path: "info/auth/success",
          name: "personAuthSuccess",
          component: () => import("@/v2/center/person/views/components/Authing.vue"),
        },
        {
          nickName: "实名认证-通过",
          path: "info/auth/authed",
          name: "personAuthSuccessAuthed",
          component: () => import("@/v2/center/person/views/components/Authed.vue"),
        },
        {
          nickName: "安全设置",
          path: "safety",
          name: "personSafety",
          component: () => import("@/v2/center/person/views/Safety.vue"),
        },
      ]
    },
    {
      nickName: "企业信息",
      path: "company",
      meta: {
        title: '企业账号管理',
      },
      redirect: 'company/info',
      component: () => import("@/v2/center/person/views/index.vue"),
      children: [
        {
          nickName: "企业基本信息管理",
          path: "info",
          name: "companyIndex",
          component: () => import("@/v2/center/person/views/company/index.vue"),
        },
        {
          nickName: "新增印模",
          path: "info/addSeal",
          name: "addSeal",
          component: () => import("@/v2/center/person/views/company/AddSeal.vue")
        },
        {
          nickName: "新增签章方式",
          path: "info/addCertModel",
          name: "addCertModel",
          component: () => import("@/v2/center/person/views/company/AddCertModel.vue"),
        },
        {
          nickName: "变企业信息或法定代表人",
          path: "info/change",
          name: "changeCompanyInfo",
          component: () => import("@/v2/center/person/views/company/ChangeCompanyInfo.vue"),
        },
        {
          nickName: "证书续期",
          path: "info/certRenewal",
          name: "addSignature",
          component: () => import("@/v2/center/person/views/company/CertRenewal.vue"),
        },
        {
          nickName: "变更签章员",
          path: "info/changeSigner",
          name: "changeSigner",
          component: () => import("@/v2/center/person/views/company/ChangeSigner.vue"),
        },
        {
          nickName: "变更签章员手机号",
          path: "info/changeSignerMobile",
          name: "changeSignerMobile",
          component: () => import("@/v2/center/person/views/company/ChangeSignerMobile.vue"),
        },
        {
          nickName: "签章配置",
          path: "info/configSignature",
          name: "configSignature",
          component: () => import("@/v2/center/person/views/company/ConfigSignature.vue"),
        },
        {
          nickName: "开通电子签章",
          path: "info/openSignature",
          name: "openSignature",
          component: () => import("@/v2/center/person/views/company/OpenSignature.vue"),
        },
        {
          nickName: "企业账号管理",
          path: "user",
          name: "companyUser",
          meta:{
            keepAlive:true
          },
          component: () => import("@/v2/center/person/views/company/User.vue"),
        },
        {
          nickName: "核心/仓储新增企业账号",
          path: "user/addCompanyAccount",
          name: "addCompanyAccount",
          component: () => import("@/v2/center/person/views/company/AddCompanyAccount.vue"),
        },
        {
          nickName: "监管公司新增企业账号",
          path: "new",
          name: "changeCompanyUser",
          component: () => import("@/v2/center/person/views/company/ChangeCompanyUser.vue"),
        },
        {
          nickName: "平台公司巡库权限配置",
          path: "inspectAuthority",
          meta: {
            title: '巡库权限',
          },
          name: "PlatformInspectAuthority",
          component: () => import("@/v2/center/person/views/company/PlatformInspectAuthority.vue"),
        },
        {
          nickName: "联系人管理",
          path: "contact",
          name: "companyContact",
          component: () => import("@/v2/center/person/views/company/Contact.vue"),
        },
        {
          nickName: "更换企业管理员",
          path: "user/changeOperator",
          name: "changeOperator",
          component: () => import("@/v2/center/person/views/company/ChangeOperator.vue"),
        },
        {
          nickName: "变更企业管理员授权期限",
          path: "user/ChangeOperatorAuthorizationPeriod",
          name: "ChangeOperatorAuthorizationPeriod",
          component: () => import("@/v2/center/person/views/company/ChangeOperatorAuthorizationPeriod.vue"),
        },
        {
          nickName: "更换企业管理员手机号",
          path: "user/changeOperatorMobile",
          name: "changeOperatorMobile",
          component: () => import("@/v2/center/person/views/company/ChangeOperatorMobile.vue"),
        },
        {
          nickName: "企业账户密码修改",
          path: "password/edit",
          name: "companyPassedit",
          component: () => import("@/v2/center/person/views/company/PassEdit.vue"),
        },
        {
          nickName: "我的企业",
          path: "mine",
          name: "companyMyCompany",
          component: () => import("@/v2/center/person/views/company/index.vue"),
        },
        {
          nickName: "认证企业",
          path: "info/certified",
          name: "certifiedCompany",
          component: () => import("@/v2/center/person/views/company/CertifiedCompany.vue"),
        },
        {
          nickName: "企业资料管理",
          path: "tax",
          name: "companyTax",
          component: () => import("@/v2/center/person/views/company/Tax.vue"),
        },
        {
          nickName: "企业资料管理-纳税申报表详情",
          path: "tax/detail",
          name: "companyTaxDetail",
          component: () => import("@/v2/center/person/views/company/TaxDetail.vue"),
        },
        {
          nickName: '企业资料管理-企业财报详情',
          path: 'tax/financeReportDetail',
          name: 'companyFinanceReportDetail',
          component: () => import('@/v2/center/person/views/company/FinanceReportDetail.vue')
        },
        {
          nickName: "客户信息管理",
          path: "customer",
          name: "companyCustomer",
          component: () => import("@/v2/center/person/views/company/Customer.vue"),
        },
        {
          nickName: "客户信息管理详情",
          path: "customer/detail",
          name: "companyCustomerDetail",
          component: () => import("@/v2/center/person/views/company/CustomerDetail.vue"),
        },
        {
          nickName: '客户信息管理编辑',
          path: 'customer/edit',
          name: 'companyCustomerEdit',
          component: () => import('@/v2/center/person/views/company/CustomerEdit.vue')
        },
      ]
    },
  ]
}
