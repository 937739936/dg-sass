export default {
  nickName: "基础资料",
  path: "steelStorage/warehouse",
  name: "SteelStorageWarehouse",
  meta: {
    title: "基础资料",
  },
  redirect: 'steelStorage/warehouse/list',
  component: () => import("@/v2/center/steelStorage/views/index.vue"),
  children: [
    {
      nickName: "仓储租赁合同",
      path: "list",
      meta: {
        title: "仓储租赁合同",
      },
      name: "SteelStorageWarehouseList",
      component: () => import("@/v2/center/steelStorage/views/warehouse/list.vue"),
    },
    {
      nickName: "仓储租赁合同详情",
      meta: {
        title: "仓储租赁合同详情",
      },
      path: "Detail",
      name: "SteelStorageWarehouseDetail",
      component: () => import("@/v2/center/steelStorage/views/warehouse/detail.vue"),
    },
  ],
}