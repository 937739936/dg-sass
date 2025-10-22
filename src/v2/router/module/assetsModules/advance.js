export default {
  nickName: "预付资产管理",
  path: "assets/advance",
  meta: {
    title: "预付资产管理" ,
  },
  redirect: 'assets/advance',
  component: () => import("@/v2/center/assets/views/index.vue"),
  children: [
    {
      nickName: "预付资产管理",
      path: "",
      meta: {
        title: "预付资产管理",
      },
      redirect: 'list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "预付资产管理列表",
          path: "list",
          meta: {
            title: "预付资产管理",
          },
          component: () => import("@/v2/center/assets/views/advance/List.vue"),
        },
        {
          nickName: "编辑预付账款",
          path: "edit",
          meta: {
            title: "编辑预付账款",
          },
          component: () => import("@/v2/center/assets/views/advance/Edit.vue"),
        },
        {
          nickName: "查看预付资产",
          path: "detail",
          meta: {
            title: "查看预付资产",
          },
          component: () => import("@/v2/center/assets/views/advance/Detail.vue"),
        },
      ],
    },
  ]
}