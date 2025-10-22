export default {
    nickName: "入库管理",
    path: "steelStorage/inStorage",
    name: "SteelStorageInStorage",
    meta: {
      title: "入库管理",
    },
    redirect: 'steelStorage/inStorage/list',
    component: () => import("@/v2/center/steelStorage/views/index.vue"),
    children: [

      {
        nickName: "入库记录查询",
        path: "list",
        meta: {
          title: "入库记录查询",
        },
        name: "SteelStorageInStorageList",
        component: () => import("@/v2/center/steelStorage/views/inStorage/list.vue"),
      },
      {
        nickName: "新增入库记录",
        path: "add",
        name: "SteelStorageInStorageAdd",
        meta: {
          title: "新增入库单",
        },
        component: () => import("@/v2/center/steelStorage/views/inStorage/add.vue"),
      },
      {
        nickName: "入库记录明细",
        meta: {
          title: "入库单详情",
        },
        path: "detail",
        name: "SteelStorageInStorageDetail",
        component: () => import("@/v2/center/steelStorage/views/inStorage/detail.vue"),
      },
    ],
}