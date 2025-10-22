export default {
  nickName: "票据查询",
  path: "/center/counterfoil/record",
  meta: {
    title: "票据查询" ,
  },
  redirect: '/center/counterfoil/record',
  component: () => import("@/v2/center/counterfoil/views/index.vue"),
  children: [
    {
      nickName: "票据查询",
      path: "",
      meta: {
        title: "票据查询",
      },
      redirect: 'list',
      component: () => import("@/v2/center/counterfoil/views/index.vue"),
      children: [
        {
          nickName: "票据查询",
          path: "list",
          meta: {
            title: "票据查询",
          },
          component: () => import("@/v2/center/counterfoil/views/record/List.vue"),
        },
        {
          nickName: "票据查询详情",
          path: "rongDetail",
          meta: {
            title: "票据查询详情",
          },
          component: () => import("@/v2/center/counterfoil/views/record/RongDetail.vue"),
        },
        {
          nickName: "票据查询详情",
          path: "yunDetail",
          meta: {
            title: "票据查询详情",
          },
          component: () => import("@/v2/center/counterfoil/views/audit/Detail.vue"),
        },
      ],
    }
  ]
  
}