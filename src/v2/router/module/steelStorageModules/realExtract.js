export default {
  nickName: "实提管理",
  path: "steelStorage/realExtract",
  name: "SteelStorageRealExtract",
  meta: {
    title: "实提管理",
  },
  redirect: 'steelStorage/realExtract/list',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [
    {
      nickName: "实提管理",
      path: "list",
      meta: {
        title: "实提管理",
      },
      name: "SteelStorageRealExtractList",
      component: () => import("@/v2/center/steelStorage/views/realExtract/list.vue"),
    },
    {
      nickName: "选择出库记录",
      path: "outList",
      name: "SteelStorageRealExtractOutList",
      meta: {
        title: "选择出库记录",
      },
      component: () => import("@/v2/center/steelStorage/views/realExtract/outList.vue"),
    },
    {
      nickName: "新增实提",
      path: "add",
      name: "SteelStorageRealExtractOutAdd",
      meta: {
        title: "新增实提",
      },
      component: () => import("@/v2/center/steelStorage/views/realExtract/add.vue"),
    },
    {
      nickName: "实提详情",
      meta: {
        title: "实提详情",
      },
      path: "detail",
      name: "SteelStorageRealExtractOutDetail",
      component: () => import("@/v2/center/steelStorage/views/realExtract/detail.vue"),
    },
  ],
}