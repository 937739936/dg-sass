export default {
  nickName: "确权盖章管理",
  path: "assets/confirmRights",
  meta: {
    title: "确权盖章管理" ,
  },
  redirect: 'assets/confirmRights',
  component: () => import("@/v2/center/assets/views/index.vue"),
  children: [
    {
      nickName: "确权盖章管理",
      path: "",
      meta: {
        title: "确权盖章管理",
      },
      redirect: 'list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "确权盖章管理",
          path: "list",
          meta: {
            title: "确权盖章管理",
          },
          component: () => import("@/v2/center/assets/views/confirmRights/List.vue"),
        },
          // 供应商
        {
          nickName: "确权盖章管理",
          path: "selllist",
          meta: {
            title: "确权盖章管理",
          },
          component: () => import("@/v2/center/assets/views/confirmRights/SellList.vue"),
        },
        {
          nickName: "确权管理盖章",
          path: "stamp",
          meta: {
            title: "确权管理盖章",
          },
          component: () => import("@/v2/center/assets/views/confirmRights/Stamp.vue"),
        },
          // 供应商
        {
          nickName: "确权管理盖章",
          path: "sellstamp",
          meta: {
            title: "确权管理盖章",
          },
          component: () => import("@/v2/center/assets/views/confirmRights/SellStamp.vue"),
        },
      ],
    },
  ]
}
