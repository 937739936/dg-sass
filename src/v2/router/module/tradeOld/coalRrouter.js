/**
 * 煤矿企业端路由
 */
export default [
  {
    nickName: "销售合同",
    path: "coal/sellContract",
    name: "sellContract",
    component: () => import("@/v2/center/trade/views/coal/SellContract.vue"),
  },
  {
    nickName: "销售合同详情",
    path: "coal/sellContract/detail",
    name: "sellContractDetail",
    meta: {
      authCode: "coalMineDgChain:contract:sellContract:detail",
    },
    component: () => import("@/v2/center/trade/views/coal/SellContractDetail.vue"),
  },
  {
    nickName: "发运管理",
    path: "coal/logistics",
    name: "logistics",
    component: () => import("@/v2/center/trade/views/coal/Logistics.vue"),
  },
  {
    nickName: "发运管理补录",
    path: "coal/logisticsAdd",
    name: "logisticsAdd",
    component: () => import("@/v2/center/trade/views/coal/LogisticsAdd.vue"),
  },
  {
    nickName: "发运管理",
    path: "coal/logistics/detail",
    name: "logisticsDetail",
    meta: {
      authCode: "coalMineDgChain:despatch:deliver:detail",
    },
    component: () => import("@/v2/center/trade/views/coal/LogisticsDetail.vue"),
  },
  {
    nickName: "发运详情",
    path: "coal/logistics/detailTwo",
    name: "logisticsTwoDetail",
    component: () => import("@/v2/center/trade/views/coal/LogisticsTwoDetail.vue"),
  },
  {
    nickName: "结算单管理",
    path: "coal/statement",
    name: "statement",
    component: () => import("@/v2/center/trade/views/coal/Statement.vue"),
  },
  {
    nickName: "结算单详情",
    path: "coal/statement/detail",
    name: "statementDetail",
    meta: {
      authCode: "coalMineDgChain:settlement:settlement:detail",
    },
    component: () => import("@/v2/center/trade/views/coal/StatementDetail.vue"),
  },
];
