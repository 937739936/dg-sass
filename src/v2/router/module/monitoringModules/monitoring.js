export default {
  nickName: "业务动态监控",
  path: "monitoring/dynamicMonitoring",
  meta: {
    title: "业务动态监控" ,
  },
  redirect: 'monitoring/dynamicMonitoring',
  component: () => import("@/v2/center/monitoring/views/index.vue"),
  children: [
    {
      nickName: "业务动态监控",
      path: "",
      meta: {
        title: "业务动态监控",
      },
      redirect: 'list',
      component: () => import("@/v2/center/monitoring/views/index.vue"),
      children: [
        {
          nickName: "业务动态监控",
          path: "list",
          meta: {
            title: "业务动态监控",
          },
          component: () => import("@/v2/center/monitoring/views/DynamicMonitoringList.vue"),
        },
        {
          nickName: "业务动态监控详情",
          path: "detail",
          meta: {
            title: "业务动态监控详情",
          },
          component: () => import("@/v2/center/trade/views/businessline/Detail.vue"),
        },
        {
          nickName: "下游合同回款认领明细",
          path: "downStream/claimDetail",
          component: () =>
            import("@/v2/center/monitoring/views/downStream/ClaimDetail.vue"),
        },
        {
          nickName: "下游合同附件编辑",
          path: "downStream/filesEdit",
          component: () => import("@/v2/center/monitoring/views/downStream/FilesEdit.vue"),
        },
      ],
    }
  ]
  
}