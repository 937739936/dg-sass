export default {
  nickName: "票据开立",
  path: "/center/counterfoil/open",
  meta: {
    title: "票据开立" ,
  },
  redirect: '/center/counterfoil/open',
  component: () => import("@/v2/center/counterfoil/views/index.vue"),
  children: [
    {
      nickName: "票据开立",
      path: "",
      meta: {
        title: "票据开立",
      },
      redirect: 'list',
      component: () => import("@/v2/center/counterfoil/views/index.vue"),
      children: [
        {
          nickName: "票据开立",
          path: "list",
          meta: {
            title: "票据开立",
          },
          component: () => import("@/v2/center/counterfoil/views/open/List.vue"),
        },
        {
          nickName: "申请票据开立",
          path: "apply",
          meta: {
            title: "申请票据开立",
          },
          component: () => import("@/v2/center/counterfoil/views/open/Apply.vue"),
        },
        {
          nickName: "票据开立盖章",
          path: "sign",
          meta: {
            title: "票据开立盖章",
          },
          component: () => import("@/v2/center/counterfoil/views/open/Sign.vue"),
        },
      ],
    }
  ]
  
}