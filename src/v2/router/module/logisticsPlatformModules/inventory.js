export default {
  nickName: "库存管理",
  path: "logisticsPlatform",
  meta: {
    title: "库存管理" ,
  },
  redirect: 'logisticsPlatform/inventory',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "库存管理",
      path: "inventory",
      meta: {
        title: "库存管理",
      },
      redirect: 'inventory',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "库存管理",
          path: "",
          meta: {
            title: "库存管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventory.vue"),
        },
        {
          nickName: "货位视频监控",
          path: "goodsAllocation/monitorList",
          meta: {
            title: "货位视频监控",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/goodsAllocationMonitor.vue"),
        },
        {
          nickName: "业务台账详情",
          path: "business/detail",
          meta: {
            title: "业务台账详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventory/businessLineDetail.vue"),
        },
      ]
    },
    {
      nickName: "库存盯市",
      path: "inventoryMarket",
      meta: {
        title: "库存盯市",
      },
      redirect: 'inventoryMarket',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "库存盯市",
          path: "",
          meta: {
            title: "库存盯市",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventory/inventoryMarket.vue"),
        },
        {
          nickName: "价格趋势查看",
          path: "priceTrend",
          meta: {
            title: "价格趋势查看",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inventory/priceTrend.vue"),
        },
      ]
    },
    
  ],
}