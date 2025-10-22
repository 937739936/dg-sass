export default {
  nickName: "库存管理",
  path: "logisticSupervise",
  meta: {
    title: "入库管理" ,
    reverseTitle: "出库管理",
  },
  redirect: '/center/logisticSupervise/in',
  component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
  children: [
    {
      nickName: "入库记录",
      path: "logisticSupervise/in",
      meta: {
        title: "入库记录",
      },
      redirect: '/center/logisticSupervise/in',
      component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
      children: [
        {
          nickName: "入库记录",
          path: "/center/logisticSupervise/in",
          meta: {
            title: "入库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/inList.vue"),
        },
        {
          nickName: "新增采购入库记录",
          path: "/center/logisticSupervise/in/add",
          meta: {
            title: "新增采购入库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/inAdd.vue"),
        },
        {
          nickName: "新增盘盈入库记录",
          path: "/center/logisticSupervise/in/profit/add",
          meta: {
            title: "新增盘盈入库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/inAdd.vue"),
        },
        {
          nickName: "入库信息详情",
          path: "/center/logisticSupervise/in/detail",
          meta: {
            title: "入库信息详情",
            reverseTitle: "入库信息详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/inDetail.vue"),
        },
        {
          nickName: "入库详情-汽运",
          path: "/center/logisticSupervise/IN/records/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetail.vue"),
        },
        {
          nickName: "入库详情-火运",
          path: "/center/logisticSupervise/IN/records/train/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
            editTitle: "编辑入库记录",
            editReverseTitle: "编辑出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordTrainDetail.vue"),
        },
      ]
    },
    {
      nickName: "出库记录",
      path: "logisticSupervise/out",
      meta: {
        title: "出库记录",
      },
      redirect: '/center/logisticSupervise/out',
      component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
      children: [
        {
          nickName: "出库记录",
          path: "/center/logisticSupervise/out",
          meta: {
            title: "出库记录",
            reverseTitle: "出库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/outList.vue"),
        },
        {
          nickName: "新增销售出库记录",
          path: "/center/logisticSupervise/out/add",
          meta: {
            title: "新增销售出库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/outAdd.vue"),
        },
        {
          nickName: "新增盘亏出库记录",
          path: "/center/logisticSupervise/out/loss/add",
          meta: {
            title: "新增盘亏出库记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/outAdd.vue"),
        },
        {
          nickName: "出库信息详情",
          path: "/center/logisticSupervise/out/detail",
          meta: {
            title: "出库信息详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inOut/outDetail.vue"),
        },
        {
          nickName: "入库详情-汽运",
          path: "/center/logisticSupervise/OUT/records/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetail.vue"),
        },
        {

          nickName: "入库详情-火运",
          path: "/center/logisticSupervise/OUT/records/train/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordTrainDetail.vue"),
        },
        

      ]
    },
    {
      nickName: "库存台账",
      path: "inventory",
      meta: {
        title: "库存台账",
      },
      redirect: '/center/logisticSupervise/inventory',
      component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
      children: [
        {
          nickName: "库存台账",
          path: "/center/logisticSupervise/inventory",
          meta: {
            title: "库存台账",
            reverseTitle: "库存台账",
          },
          component: () => import("@/v2/center/logisticSupervise/views/inventory/index.vue"),
        },
 
      ]
    },

  ],
}