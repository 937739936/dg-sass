export default {
  nickName: "业务运营实况",
  path: "monitoring",
  meta: {
    title: "业务运营实况" ,
  },
  redirect: 'monitoring/businessOperation',
  component: () => import("@/v2/center/monitoring/views/index.vue"),
  children: [
    {
      nickName: "业务运营实况",
      path: "businessOperation",
      meta: {
        title: "业务运营实况",
      },
      component: () => import("@/v2/center/monitoring/views/BusinessOperation.vue"),
    },
  ],
}