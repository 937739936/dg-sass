/**
 * 煤矿企业端路由
 */
export default {
  nickName: "收发货管理",
  path: "receive",
  meta: {
    title: '收发货管理',
    authCode: "dgChain"
  },
  redirect: 'receive/coal',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "发运数据补录",
      path: "coal",
      meta: {
        title: "发运数据补录",
      },
      redirect: 'coal/logistics',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "发运管理",
          path: "logistics",
          component: () => import("@/v2/center/trade/views/coal/Logistics.vue"),
        },
        {
          nickName: "发运管理补录",
          path: "add",
          component: () => import("@/v2/center/trade/views/coal/LogisticsAdd.vue"),
        },
        {
          nickName: "销售合同",
          path: "contract",
          component: () => import("@/v2/center/trade/views/coal/SellContract.vue"),
        },
        {
          nickName: "销售合同详情",
          path: "contract/detail",
          component: () => import("@/v2/center/trade/views/coal/SellContractDetail.vue"),
        },
        {
          nickName: "发运管理",
          path: "logistics/detail",
          component: () => import("@/v2/center/trade/views/coal/LogisticsDetail.vue"),
        },
        {
          nickName: "发运详情",
          path: "logistics/detail/two",
          component: () => import("@/v2/center/trade/views/coal/LogisticsTwoDetail.vue"),
        },
        {
          nickName: "结算单管理",
          path: "statement",
          component: () => import("@/v2/center/trade/views/coal/Statement.vue"),
        },
        {
          nickName: "结算单详情",
          path: "statement/detail",
          component: () => import("@/v2/center/trade/views/coal/StatementDetail.vue"),
        },
      ],
    },
  ]
};
