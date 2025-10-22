export default {
  nickName: "票据签收",
  path: "/center/counterfoil/audit",
  meta: {
    title: "票据签收" ,
  },
  redirect: '/center/counterfoil/audit',
  component: () => import("@/v2/center/counterfoil/views/index.vue"),
  children: [
    {
      nickName: "云票签收审核",
      path: "",
      meta: {
        title: "云票签收审核",
      },
      redirect: 'list',
      component: () => import("@/v2/center/counterfoil/views/index.vue"),
      children: [
        {
          nickName: "云票签收审核",
          path: "list",
          meta: {
            title: "云票签收审核",
          },
          component: () => import("@/v2/center/counterfoil/views/audit/List.vue"),
        },
        {
          nickName: "云票签收审核",
          path: "audit",
          meta: {
            title: "云票签收审核",
          },
          component: () => import("@/v2/center/counterfoil/views/audit/Audit.vue"),
        },
        {
          nickName: "云票签收审核盖章",
          path: "sign",
          meta: {
            title: "云票签收审核盖章",
          },
          component: () => import("@/v2/center/counterfoil/views/audit/Sign.vue"),
        },
        {
          nickName: "云票签收审核详情",
          path: "detail",
          meta: {
            title: "云票签收审核详情",
          },
          component: () => import("@/v2/center/counterfoil/views/audit/Detail.vue"),
        },
      ],
    }
  ]
  
}