export default {
  nickName: "出/入库管理",
  path: "logisticsPlatform",
  meta: {
    title: "入库管理" ,
    reverseTitle: "出库管理",
  },
  redirect: 'logisticsPlatform',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "汽运上/下煤计划",
      path: "coalplan/:type",
      meta: {
        title: "汽运上煤计划",
        reverseTitle: "汽运下煤计划",
      },
      redirect: 'coalplan/:type',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "汽运上/下煤计划列表",
          path: "",
          meta: {
            title: "汽运上煤计划",
            reverseTitle: "汽运下煤计划",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/coalPlan"),
        },
        {
          nickName: "汽运上/下煤计划详情",
          path: "detail",
          meta: {
            title: "汽运上煤计划详情",
            reverseTitle: "汽运下煤计划详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/coalPlanDetail"),
        },
        {
          nickName: "创建汽运上/下煤计划",
          path: "create",
          meta: {
            title: "创建汽运上煤计划",
            reverseTitle: "创建汽运下煤计划",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/coalPlanCreate"),
        },
        {
          nickName: "编辑汽运上/下煤计划",
          path: "edit",
          meta: {
            title: "编辑汽运上煤计划",
            reverseTitle: "编辑汽运下煤计划",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/coalPlanCreate"),
        },
        {
          nickName: "新增派车信息",
          path: "dispatchCarInput",
          meta: {
            title: "新增派车信息",
            reverseTitle: "新增派车信息",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/coalPlanDispatchCarInput"),
        },
      ]
    },
    
    {
      nickName: "入库记录",
      path: "in",
      meta: {
        title: "入库记录",
      },
      redirect: '/center/logisticsPlatform/in',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "入库记录",
          path: "records",
          meta: {
            title: "出库记录",
            reverseTitle: "出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/records.vue"),
        },
        {
          nickName: "入库记录",
          path: "/center/logisticsPlatform/in",
          meta: {
            title: "入库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/inList.vue"),
        },
        {
          nickName: "新增采购入库记录",
          path: "/center/logisticsPlatform/in/add",
          meta: {
            title: "新增采购入库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/inAdd.vue"),
        },
        {
          nickName: "新增盘盈入库记录",
          path: "/center/logisticsPlatform/in/profit/add",
          meta: {
            title: "新增盘盈入库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/inAdd.vue"),
        },
        {
          nickName: "入库信息详情",
          path: "/center/logisticsPlatform/in/detail",
          meta: {
            title: "入库信息详情",
            reverseTitle: "入库信息详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/inDetail.vue"),
        },
        {
          nickName: "入库详情-汽运",
          path: "/center/logisticsPlatform/IN/records/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetail.vue"),
        },
        {
          nickName: "入库详情-火运",
          path: "/center/logisticsPlatform/IN/records/train/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
            editTitle: "编辑入库记录",
            editReverseTitle: "编辑出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordTrainDetail.vue"),
        },
        {
          nickName: "入库详情-曹妃甸",
          path: "CFDdetail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetailCFD.vue"),
        },
      ]
    },
    {
      nickName: "出库记录",
      path: "out",
      meta: {
        title: "出库记录",
      },
      redirect: '/center/logisticsPlatform/out',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "出库记录",
          path: "records",
          meta: {
            title: "出库记录",
            reverseTitle: "出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/records.vue"),
        },
        {
          nickName: "出库记录",
          path: "/center/logisticsPlatform/out",
          meta: {
            title: "出库记录",
            reverseTitle: "出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/outList.vue"),
        },
        {
          nickName: "新增销售出库记录",
          path: "/center/logisticsPlatform/out/add",
          meta: {
            title: "新增销售出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/outAdd.vue"),
        },
        {
          nickName: "新增盘亏出库记录",
          path: "/center/logisticsPlatform/out/profit/add",
          meta: {
            title: "新增盘亏出库记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/outAdd.vue"),
        },
        {
          nickName: "出库信息详情",
          path: "/center/logisticsPlatform/out/detail",
          meta: {
            title: "出库信息详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/outDetail.vue"),
        },
        {
          nickName: "入库详情-汽运",
          path: "/center/logisticsPlatform/OUT/records/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetail.vue"),
        },
        {

          nickName: "入库详情-火运",
          path: "/center/logisticsPlatform/OUT/records/train/detail",
          meta: {
            title: "入库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordTrainDetail.vue"),
        },
        {
          nickName: "出库详情-曹妃甸",
          path: "CFDdetail",
          meta: {
            title: "出库详情",
            reverseTitle: "出库详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/inOut/recordDetailCFD.vue"),
        },
      ]
    },
  ],
}