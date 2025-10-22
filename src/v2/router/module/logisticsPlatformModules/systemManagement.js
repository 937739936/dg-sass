export default {
  nickName: "系统管理",
  path: "logisticsPlatform",
  meta: {
    title: "系统管理",
    editTitle: "系统管理",
  },
  redirect: 'logisticsPlatform',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "站台信息管理",
      path: "platformInfo",
      meta: {
        title: "站台信息管理",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children:[
        {
          nickName: "站台信息管理",
          path: "",
          meta: {
            title: "站台信息管理",
            keepAlive:true
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/platformInfo.vue"),
        },
        {
          nickName: "线下租赁合同",
          path: "tenancyContractEdit",
          meta: {
            title: "新增线下租赁合同",
            keepAlive:true
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/platformInfo/TenancyContractEdit.vue"),
        },
        {
          nickName: "查看线下租赁合同",
          path: "previewContract",
          meta: {
            title: "查看线下租赁合同",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/platformInfo/PreviewContract.vue"),
        },
      ]
    },
    {
      nickName: "仓房管理",
      path: "warehouse",
      meta: {
        title: "仓房管理",
      },
      redirect: 'warehouse',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓房管理列表",
          path: "",
          meta: {
            title: "仓房管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/warehouse.vue"),
        },
        {
          nickName: "货位管理",
          path: "goodsAllocation",
          meta: {
            title: "货位管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/goodsAllocation.vue"),
        },
        {
          nickName: "巡库员详情",
          path: "supervisorsDetail",
          meta: {
            title: "巡库员详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/supervisorsDetail.vue"),
        },

      ]
    },
    {
      nickName: "磅房管理",
      path: "weighthouse",
      meta: {
        title: "磅房管理",
        editTitle: "磅房管理",
      },
      redirect: 'weighthouse',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [

        {
          nickName: "磅房管理",
          path: "",
          meta: {
            title: "磅房管理",
            editTitle: "磅房管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/weightHouse.vue"),
        },
        {
          nickName: "磅房详情",
          path: ":view/:id",
          meta: {
            title: "磅房详情",
            editTitle: "磅房编辑",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/base/weightHouseDetail.vue"),
        },
      ]
    },
    {
      nickName: "视频配置",
      path: "videoConfig",
      meta: {
        title: "视频配置",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/base/videoConfig.vue"),
    },
    {
      nickName: "盘库配置",
      path: "inventoryConfig",
      meta: {
        title: "盘库配置",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/inventoryCheck/config.vue"),
    },
    {
      nickName: "煤种配置",
      path: "coalConfig",
      meta: {
        title: "煤种配置",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/base/coalConfig.vue"),
    },
    {
      nickName: "打印机配置",
      path: "printerConfig",
      meta: {
        title: "打印机配置",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/base/printerConfig.vue"),
    },
    {
      nickName: "下煤短倒配置",
      path: "shortPourConfig",
      meta: {
        title: "下煤短倒配置",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/base/shortPourConfig.vue"),
    },
  ],
}