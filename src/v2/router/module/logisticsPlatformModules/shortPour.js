export default {
  nickName: "短倒管理",
  path: "logisticsPlatform",
  meta: {
    title: "短倒管理" ,
  },
  redirect: 'logisticsPlatform',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "下煤短倒计划",
      path: "short_pour",
      meta: {
        title: "下煤短倒计划",
      },
      redirect: 'short_pour/plan',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "下煤短倒计划列表",
          path: "plan",
          meta: {
            title: "下煤短倒计划",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/shortPourPlan.vue"),
        },
        {
          nickName: "创建/编辑下煤短倒计划",
          path: "plan/edit",
          meta: {
            title: "创建下煤短倒计划",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/shortPourPlanEdit.vue"),
        },
        {
          nickName: "下煤短倒计划详情",
          path: "plan/detail",
          meta: {
            title: "下煤短倒详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/shortPourPlanDetail.vue"),
        },
      ]
    },
    {
      nickName: "下煤短倒记录",
      path: "records",
      meta: {
        title: "下煤短倒记录",
      },
      redirect: 'records/shortPour',
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "下煤短倒记录",
          path: "shortPour",
          meta: {
            title: "下煤短倒记录",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/shortPourRecords.vue"),
        },
      ]
    },
  ],
}