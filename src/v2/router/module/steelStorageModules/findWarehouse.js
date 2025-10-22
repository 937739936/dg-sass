export default {
  nickName: "查仓报告管理",
  path: "steelStorage/findWarehouse",
  name: "SteelStorageFindWarehouse",
  meta: {
    title: "查仓报告管理",
  },
  redirect: 'steelStorage/findWarehouse/report/list',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [

    {
      nickName: "查仓报告",
      path: "report/list",
      name: "SteelStorageFindWarehouseReportList",
      component: () => import("@/v2/center/steelStorage/views/findWarehouse/report/list.vue"),
    },
    {
      nickName: "查仓报告详情",
      path: "report/detail",
      name: "SteelStorageFindWarehouseReportDetail",
      component: () => import("@/v2/center/steelStorage/views/findWarehouse/report/detail.vue"),
    },
  ],
}