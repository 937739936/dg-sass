export default {
  nickName: "提货管理",
  path: "ladingbill",
  meta: {
    title: '提货管理',
    authCode: "dgChain"
  },
  redirect: 'ladingbill/lading',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "提货管理",
      path: "lading",
      meta: {
        title: "提货管理",
      },
      redirect: 'lading/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "提货管理",
          path: "list",
          component: () => import("@/v2/center/trade/views/ladingNew/ladingbill/list"),
        },
        {
          nickName: "新增提货记录",
          path: "add",
          meta: {
            title: "新增提货记录",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/ladingbill/add"),
        },
        {
          nickName: "编辑提货记录",
          path: "edit",
          meta: {
            title: "编辑提货记录",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/ladingbill/add"),
        },
        {
          nickName: "提货详情",
          path: "detail",
          meta: {
            title: "提货记录详情",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/ladingbill/detail"),
        },
        {
          nickName: "提货通知盖章",
          path: "stamp",
          meta: {
            title: "提货通知盖章",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/ladingbill/stamp"),
        },
      ]
    },
    {
      nickName: "放货管理",
      path: "delivery",
      meta: {
        title: "放货管理",
      },
      redirect: 'delivery/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "放货管理",
          path: "list",
          component: () => import("@/v2/center/trade/views/ladingNew/delivery/list"),
        },
        {
          nickName: "新增放货指令",
          path: "add",
          meta: {
            title: "新增放货指令",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/delivery/add"),
        },
        {
          nickName: "编辑放货指令",
          path: "edit",
          meta: {
            title: "编辑放货指令",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/delivery/add"),
        },
        {
          nickName: "放货指令详情",
          path: "detail",
          meta: {
            title: "放货指令详情",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/delivery/detail"),
        },
      ]
    },
    {
      nickName: "收货证明",
      path: "receipt",
      meta: {
        title: "收货管理",
      },
      redirect: 'receipt/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "收货证明",
          path: "list",
          component: () => import("@/v2/center/trade/views/ladingNew/receiptProve/list"),
        },
        {
          nickName: "新增收货证明",
          path: "add",
          meta: {
            title: "新增收货记录",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/receiptProve/add"),
        },
        {
          nickName: "收货证明详情",
          path: "detail",
          meta: {
            title: "收货证明详情",
          },
          component: () => import("@/v2/center/trade/views/ladingNew/receiptProve/newDetail"),
        },
        {
          nickName: "收货证明盖章",
          path: "stamp",
          component: () => import("@/v2/center/trade/views/ladingNew/receiptProve/stamp"),
        },
      ]
    },
  ]
};
