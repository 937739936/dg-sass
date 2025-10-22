/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
  name: "financeCenter",
  label: "财务中心",
  // authCode: 'financialCenter',
  menuList: [
    {
      name: "服务费协议管理",
      authCode: "financialCenter:serviceFeeAgreement",
      icon: "icon-fuwufeixieyiguanli",
      children: [
        {
          name: "服务费协议管理",
          link: "/center/financeCenter/serviceFeeProtocol",
          authCode: "financialCenter:serviceFeeAgreement:serviceFeeAgreement",
        },
      ],
    },
    {
      name: "服务费管理",
      authCode: "financialCenter:serviceFee",
      icon: require("imgs/menu/fuwufeiguanli.png"),
     // 陕煤等企业不展示财务中心
      children: [
        {
          name: "服务费结算单",
          authCode: "financialCenter:serviceFee:serviceFeeStatement",
          link: "/center/financeCenter/service/myServiceFee",
        },
        {
          name: "服务费流水明细",
          authCode: "financialCenter:serviceFee:serviceFeeBill",
          link: "/center/financeCenter/service/ServiceFeeFlowDetail",
        },
        {
          name: "服务费发票管理",
          authCode: "financialCenter:serviceFee:invoice",
          link: "/center/financeCenter/service/invoice/list",
        },
      ],
    },
  ],
};
