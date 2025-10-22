export default {
  nickName: "库存管理",
  path: "steelStorage/stock",
  name: "SteelStorageStock",
  meta: {
    title: "库存管理",
  },
  redirect: 'steelStorage/stock/monitoring',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [
    {
      nickName: "仓库监控查看",
      path: "monitoring",
      meta: {
        title: "仓库监控查看",
      },
      name: "SteelStorageStockMonitoring",
      component: () => import("@/v2/center/steelStorage/views/stock/monitoring.vue"),
    },
    {
      nickName: "明细库存查看",
      path: "detailInventory",
      meta: {
        title: "明细库存查看",
      },
      name: "SteelStorageStockDetailInventory",
      component: () => import("@/v2/center/steelStorage/views/stock/detailInventory.vue"),
    },
    {
      nickName: "汇总库存查看",
      meta: {
        title: "汇总库存查看",
      },
      path: "collectInventory",
      name: "SteelStorageStockCollectInventory",
      component: () => import("@/v2/center/steelStorage/views/stock/collectInventory.vue"),
    },
  ],
}