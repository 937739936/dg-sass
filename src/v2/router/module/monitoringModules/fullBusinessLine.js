export default {
  nickName: "全业务线查看",
  path: "monitoring/fullBusinessLine",
  meta: {
    title: "全业务线查看" ,
  },
  redirect: 'monitoring/fullBusinessLine',
  component: () => import("@/v2/center/monitoring/views/index.vue"),
  children: [
    {
      nickName: "全业务线查看",
      path: "",
      meta: {
        title: "全业务线查看",
      },
      redirect: 'list',
      component: () => import("@/v2/center/monitoring/views/index.vue"),
      children: [
        {
          nickName: "全业务线查看",
          path: "list",
          meta: {
            title: "全业务线查看",
          },
          component: () => import("@/v2/center/monitoring/views/FullBusinessLineList.vue"),
        },
        {
          nickName: "全业务线详情",
          path: "detail",
          meta: {
            title: "全业务线详情",
          },
          component: () => import("@/v2/center/monitoring/views/FullBusinessLineDetail.vue"),
        },
        {
          nickName: "全业务线详情-钢材",
          path: "steelDetail",
          meta: {
            title: "全业务线详情",
          },
          component: () => import("@/v2/center/monitoring/views/steel/SteelFullBusinessLineDetail.vue"),
        },
      ],
    },
  ]
  
}