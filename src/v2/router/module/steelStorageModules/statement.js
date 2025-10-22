export default {
  nickName: "报表管理",
  path: "steelStorage/statement",
  name: "SteelStorageStatement",
  meta: {
    title: "库存管理",
  },
  redirect: 'steelStorage/statement/outAndIn',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [
    {
      nickName: "出入库统计查看报表",
      path: "outAndIn",
      name: "SteelStorageStatementOutAndIn",
      component: () => import("@/v2/center/steelStorage/views/statement/outAndIn.vue"),
    },
    {
      nickName: "库位分布查看报表",
      path: "location",
      name: "SteelStorageStatementLocation",
      component: () => import("@/v2/center/steelStorage/views/statement/location.vue"),
    },
    {
      nickName: "仓库采购合同货物账龄报表",
      path: "purchase",
      name: "SteelStorageStatementPurchase",
      component: () => import("@/v2/center/steelStorage/views/statement/purchase.vue"),
    },
    {
      nickName: "库存总览",
      path: "stockView",
      name: "SteelStorageStatementStockView",
      component: () => import("@/v2/center/steelStorage/views/statement/stockView.vue"),
    },
  ],
}