export default {
  nickName: "收发货管理",
  path: "receive",
  meta: {
    title: '收发货管理',
    authCode: "dgChain"
  },
  redirect: 'receive/send',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "发货管理",
      path: "send",
      meta: {
        title: "发货管理",
      },
      redirect: 'send/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "发货管理",
          path: "list",
          component: () => import("@/v2/center/trade/views/receive/ReleaseRecordList.vue"),
        },
        {
          nickName: "填写发货信息",
          path: "/center/receive/send/apply",
          meta: {
            title: "填写发货信息",
          },
          component: () => import("@/v2/center/trade/views/receive/Apply.vue"),
        },
        {
          nickName: "发货信息详情",
          path: "detail",
          meta: {
            title: "发货信息详情",
          },
          component: () => import("@/v2/center/trade/views/receive/SendDetail.vue"),
        },
      ],
    },
    {
      nickName: "汽车派车计划",
      path: "carplan",
      meta: {
        title: "汽车派车计划",
      },
      redirect: 'carplan/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "汽车派车计划",
          path: "list",
          meta: {
            title: "汽车派车计划",
          },
          component: () => import("@/v2/center/trade/views/receive/releaseDispatch/index.vue"),
        },
        {
          nickName: "查看发运明细",
          path: "detail",
          meta: {
            title: "查看发运明细",
          },
          component: () => import("@/v2/center/trade/views/receive/releaseDispatch/Detail.vue"),
        },
      ],
    },
    {
      nickName: "收货管理",
      path: "accept",
      meta: {
        title: "收货管理",
      },
      redirect: 'accept/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "收货记录",
          path: "list",
          component: () => import("@/v2/center/trade/views/receive/ReceiveRecordList.vue"),
        },
        {
          nickName: "填写收货信息",
          path: "confirm",
          meta: {
            title: "填写收货信息",
          },
          component: () => import("@/v2/center/trade/views/receive/AcceptConfirm.vue"),
        },
        {
          nickName: "收货信息详情",
          path: "detail",
          meta: {
            title: "收货信息详情",
          },
          component: () => import("@/v2/center/trade/views/receive/AcceptDetail.vue"),
        },
      ],
    },
  ]
};
