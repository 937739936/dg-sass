export default {
  nickName: "池资产管理",
  path: "assets/pool",
  meta: {
    title: "池资产管理" ,
  },
  redirect: 'assets/pool',
  component: () => import("@/v2/center/assets/views/index.vue"),
  children: [
    {
      nickName: "池资产管理",
      path: "manage",
      meta: {
        title: "池资产管理",
      },
      redirect: 'manage/list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "池资产管理",
          path: "list",
          meta: {
            title: "池资产管理",
          },
          component: () => import("@/v2/center/assets/views/pool/manage/List.vue"),
        },
        {
          nickName: "新增池资产",
          path: "edit",
          meta: {
            title: "新增池资产",
          },
          component: () => import("@/v2/center/assets/views/pool/manage/Edit.vue"),
        },
        {
          nickName: "查看池资产",
          path: "detail",
          meta: {
            title: "查看池资产",
          },
          component: () => import("@/v2/center/assets/views/pool/manage/Detail.vue"),
        },
      ],
    },
    {
      nickName: "池台账查询",
      path: "account",
      meta: {
        title: "池台账查询",
      },
      redirect: 'account/detail',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "池台账查询",
          path: "detail",
          meta: {
            title: "池台账查询",
          },
          component: () => import("@/v2/center/assets/views/pool/account/Detail.vue"),
        },
      ]
    },
  ]
}