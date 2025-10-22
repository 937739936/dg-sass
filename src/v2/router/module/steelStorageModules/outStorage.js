export default {
  nickName: "出库管理",
  path: "steelStorage/outStorage",
  name: "SteelStorageOutStorage",
  meta: {
    title: "出库管理",
  },
  redirect: 'steelStorage/outStorage/list',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [
    {
      nickName: "出库记录查询",
      path: "list",
      meta: {
        title: "出库记录查询",
      },
      name: "SteelStorageOutStorageList",
      component: () => import("@/v2/center/steelStorage/views/outStorage/list.vue"),
    },
    {
      nickName: "新增出库记录",
      path: "add",
      name: "SteelStorageOutStorageAdd",
      meta: {
        title: "新增出库单",
      },
      component: () => import("@/v2/center/steelStorage/views/outStorage/add.vue"),
    },
    {
      nickName: "出库单详情",
      meta: {
        title: "出库单详情",
      },
      path: "detail",
      name: "SteelStorageOutStorageDetail",
      component: () => import("@/v2/center/steelStorage/views/outStorage/detail.vue"),
    },
  ],
}