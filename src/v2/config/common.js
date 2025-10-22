import ENV from "@/v2/config/env";

export default {
  name: '数链科技',
  fullName: '郑州数链科技有限公司',
  title: '数链科技-大宗商品数字供应链服务平台',
  description: '打造全球领先的大宗商品数字供应链服务平台：依托大宗商品实时交易数字化，构建可信的数字资产，实现资产和资金的精准对接。',
  keywords: '数链科技,数字供应链,金融科技,大宗商品,产业数字化,人工智能,大数据,区块链,供应链金融,大宗融资,贸易融资,煤炭托盘,煤炭仓储,钢材托盘,钢材垫资,钢材仓储,煤炭应收,钢材代采,煤炭仓押,钢铁代采,钢铁资金预付,钢材资金预付,煤炭垫资,钢铁托盘,钢铁仓押,煤炭应收账款,煤炭资金预付,煤炭预付,煤炭代采,钢材预付,钢铁预付,钢材仓押,钢铁垫资,钢铁仓储',
  pageLogin: {
    logo: require('@/v2/assets/imgs/home/logo.png'),
    title: '欢迎来到数链科技',
    userServiceAgreement: '《数链科技用户服务协议》',
    privacyProtectionPolicy: '《隐私保护政策》'
  },
  filingInformation: {
    rightsReserved: '数链科技 All rights reserved',
    company: '郑州数链科技有限公司',
    no: '豫ICP备2021002766号-1',
    stagingNo: '豫ICP备2021002766号-2'
  },
  registerInformation: {
    userServiceAgreement: '《数链科技用户服务协议》',
    privacyProtectionPolicy: '《隐私保护政策》'
  },
  signPage: {
    digitalCertificateServiceAgreement: '《数链科技数字证书服务协议》'
  },
  accountInfo: {
    avatarDefault: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/DEFAULT_AVATAR.png`,
    authorizationLetter: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_AUTH_TEMPLATE.docx`,
    adminAuthorizationLetter: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_ADMIN_AUTH_TEMPLATE.docx`,
    authLicenseImgExampleGly: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_AUTH_PNG_TEMPLATE.png`,
    explanationLetterRegistrationTemplate: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/SITUATION_LETTER_TEMPLATE.pdf`,
    explanationLetterExample: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/SITUATION_LETTER_PNG_TEMPLATE.png`,
    changeAdminImg: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_ADMIN_UPDATE_APPLY_PNG_TEMPLATE.png`,
    changeAdminMobile: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_ADMIN_MOBILE_UPDATE_APPLY_PNG_TEMPLATE.png`,
    modifyApplyImgExample: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_INFO_UPDATE_APPLY_PNG_TEMPLATE.png`,
    applyImgExample: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_APPLY_PNG_TEMPLATE.png`,
    certPreviewImage: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_APPLY_AND_USE_PNG_TEMPLATE.png`,
    changeOperator: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_USER_UPDATE_AUTH_PNG_TEMPLATE.png`,
    changeSingerMobileImg: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_USER_MOBILE_UPDATE_PNG_TEMPLATE.png`,
    renewalImgExample: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_RENEWAL_APPLY_PNG_TEMPLATE.png`,
    authorizedLetterImgExample: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/CFCA_CRET_APPLY_AUTHORIZED_PERSON_SEAL_PNG_TEMPLATE.png`,
    companyAuth: `${ENV.BASE_USER_API}/trade-files/systemConfigFile/downloadByCode/COMPANY_AUTH_TEMPLATE.docx`,
    shengmingImgExample: require('@/v2/assets/imgs/person/shengmingImg.png'),
    idcardImgExample: require('@/v2/assets/imgs/person/idcard.png'),
    bizLicenseImgExample: require('@/v2/assets/imgs/person/bizLicenseImg.png'),
    authLicenseImgExample: require('@/v2/assets/imgs/person/authLicenseImg.png'),
    licence: require('@/v2/assets/imgs/person/licence.png'),
    changeAdminCardImg: require('@/v2/assets/imgs/person/adminCardImg.png'),
    certChangeUserImg: require('@/v2/assets/imgs/person/certChangeUser.png')
  }
};