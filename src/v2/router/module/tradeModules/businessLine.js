export default {
  nickName: "业务线管理",
  path: "businessline",
  meta: {
    title: "业务线管理",
    authCode: "dgChain"
  },
  redirect: "/center/businessline/list",
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "业务线列表",
      path: "/center/businessline/list",
      meta: {
        title: "采销合同关联列表",
      },
      component: () => import("@/v2/center/trade/views/businessline/List.vue"),
    },
    {
      nickName: "业务线关联",
      path: "/center/businessline/addAssociation",
      meta: {
        title: "业务线关联",
      },
      component: () => import("@/v2/center/trade/views/businessline/addAssociation.vue"),
    },
    {
      nickName: "业务线详情",
      path: "/center/businessline/detail",
      meta: {
        title: "业务线详情",
      },
      component: () => import("@/v2/center/trade/views/businessline/Detail.vue"),
    },
  ],
};
