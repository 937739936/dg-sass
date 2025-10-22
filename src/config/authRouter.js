/**
 * 菜单权限配置文件
 */
export default {
  // 所有核心企业均有这个菜单，回环闭环管理需求  --2022/8/11
  "dgChain:payback": {
    // authCode
    companyType: ["CORE_COMPANY"],
    visible: true, // true: 满足当前配置的companyUscc和companyUserRoles展示当前authCode
  },
  "dgChain:payback:list": {
    companyUserRoles: ["directorFlag", "admin", "observer", "operator"],
    visible: true,
  },
  "dgChain:payback:terminal": {
    companyUserRoles: ["admin", "observer", "operator"],
    visible: true,
  },
  // 陕煤等企业不展示财务中心
  "financialCenter:serviceFeeAgreement": {
    companyUscc: ["91610138MA6X3K6K0G", "91610131MAB0GDQQ8W", "91150627MA13NN7393", "91330900MA2DM61W7R", "91659010MA78NP385U", "91460000MA7JN2U760"],
    visible: false,
  },
  "financialCenter:serviceFee": {
    companyUscc: ["91610138MA6X3K6K0G", "91610131MAB0GDQQ8W", "91150627MA13NN7393", "91330900MA2DM61W7R", "91659010MA78NP385U", "91460000MA7JN2U760"],
    visible: false,
  },
  // 中原银行和陕煤,铁投
  "monitor:risk": {
    companyUscc: ["9141000031741675X6", "91410100MA9GXHFJ5E"],
    visible: true,
  },
  // 卓鼎、中原银行、陕煤、铁投、丰瑞、铁瑞、蓉欧、晋瑞
  "monitor:operation": {
    companyUscc: ["91410100MA45CKY3XX", "9141000031741675X6", "91610138MA6X3K6K0G", "91410100MA9GXHFJ5E", "91370600MA3TP03G5F", "91410100MA9KA84X3Q", "91510100MA69N5DE2T", "914101000689293263", "91371100056216898D"],
    visible: true,
  },
  "steel:receiptPayment:getment": {
    companyType: ["CORE_COMPANY"],
    visible: false,
  },
  "company": {
    auth: true,
    visible: true,
  },
  "company:user": {
    curCompanyId: "",
    visible: false
  },
  "company:password": {
    curCompanyId: "",
    visible: false
  },
  //农开展示仓储管理-报表管理
  "warehouse:report":{
    companyUscc: ["91410100MA46D874X7"],
    visible: true,
  },
  //农开展示仓储管理-运营大屏
  "warehouse:screen":{
    companyUscc: ["91410100MA46D874X7"],
    visible: true,
  },
  "steel:myDoc": {
    companyUscc: [
      "91370600MA3TP03G5F",
      "916108007450080310",
      "91410581MA44LMGK8N", 
      "91210124MA10JK9R5D", 
      "91410581358057095N",
       "91410581MA3X48H71T", 
       "91321003MA1T4KP94L", 
       '91330681MA2BDYYQ33',
       '91330400MA2B8MU21Q',
       '91440101MA5CN00N0L',
       '913204116081248533',
       '91410581MA9GL74B70',
       '91410100559609298G'
    ],
    visible: true,
  },
};
