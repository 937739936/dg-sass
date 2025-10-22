export default {
  nickName: "盘库管理",
  path: "logisticsPlatform",
  meta: {
    title: "盘库管理" ,
  },
  redirect: 'logisticsPlatform/inventoryCheck',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "盘库管理",
      path: "inventoryCheck",
      meta: {
        title: "盘库管理",
      },
      redirect: 'inventoryCheck',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "盘库管理",
          path: "",
          meta: {
            title: "盘库管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventoryCheck/list.vue"),
        },
        {
          nickName: "盘库详情",
          path: "detail",
          meta: {
            title: "盘库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventoryCheck/detail.vue"),
        },
      ]
    },
    
  ],
}