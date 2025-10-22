export default {
  nickName: "视频监控",
  path: "logisticsPlatform",
  meta: {
    title: "视频监控" ,
  },
  redirect: 'logisticsPlatform',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "视频监控列表",
      path: "monitorList",
      meta: {
        title: "视频监控",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/MonitorList.vue"),
    }
  ],
}