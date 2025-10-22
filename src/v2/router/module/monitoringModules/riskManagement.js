export default {
  nickName: "业务风控详情",
  path: "monitoring",
  meta: {
    title: "业务风控详情" ,
  },
  redirect: 'monitoring/riskManagementDetail',
  component: () => import("@/v2/center/monitoring/views/index.vue"),
  children: [
    {
      nickName: "业务风控详情",
      path: "riskManagementDetail",
      meta: {
        title: "业务风控详情",
      },
      component: () => import("@/v2/center/monitoring/views/RiskManagementDetail.vue"),
    },
  ],
}