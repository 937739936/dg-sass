export default {
  nickName: "货押资产管理",
  path: "assets/pledge",
  meta: {
    title: "货押资产管理" ,
  },
  redirect: 'assets/pledge',
  component: () => import("@/v2/center/assets/views/index.vue"),
  children: [
    {
      nickName: "货押资产管理",
      path: "",
      meta: {
        title: "货押资产管理",
      },
      redirect: 'list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "货押资产管理列表",
          path: "list",
          meta: {
            title: "货押资产管理",
          },
          component: () => import("@/v2/center/assets/views/pledge/List.vue"),
        },
        {
          nickName: "新增货押资产",
          path: "edit",
          meta: {
            title: "新增货押资产",
          },
          component: () => import("@/v2/center/assets/views/pledge/Edit.vue"),
        },
        {
          nickName: "查看货押资产",
          path: "detail",
          meta: {
            title: "查看货押资产",
          },
          component: () => import("@/v2/center/assets/views/pledge/Detail.vue"),
        },
      ],
    },
  ]
}