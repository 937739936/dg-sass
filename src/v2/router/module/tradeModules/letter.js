export default {
  nickName: "追保函管理",
  path: "bondLetter",
  meta: {
    title: "追保函管理" ,
    editTitle: "追保函管理",
  },
  redirect: 'bondLetter/online/list',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "电子追保函列表",
      meta: {
        title: "电子追保函列表",
      },
      path: "online/list",
      component: () => import("@/v2/center/trade/views/bondLetter/List.vue"),
    },
    {
      nickName: "电子追保函详情",
      meta: {
        title: "电子追保函详情",
      },
      path: "online/detail",
      component: () => import("@/v2/center/trade/views/bondLetter/online/Detail.vue"),
    },
    {
      nickName: "新增电子追保函",
      meta: {
        title: "新增电子追保函",
        editTitle: "修改电子追保函",
      },
      path: "online/add",
      component: () => import("@/v2/center/trade/views/bondLetter/online/Add.vue"),
    },
    {
      nickName: "电子追保函盖章",
      meta: {
        title: "电子追保函盖章",
      },
      path: "online/stamp",
      component: () => import("@/v2/center/trade/views/bondLetter/online/Stamp.vue"),
    },
    {
      nickName: "电子追保函确认",
      meta: {
        title: "电子追保函确认",
      },
      path: "online/confirm",
      component: () => import("@/v2/center/trade/views/bondLetter/online/Confirm.vue"),
    },
    {
      nickName: "线下追保函详情",
      meta: {
        title: "线下追保函详情",
      },
      path: "offline/detail",
      component: () => import("@/v2/center/trade/views/bondLetter/offline/Detail.vue"),
    },
    {
      nickName: "新增线下追保函",
      meta: {
        title: "新增线下追保函",
        editTitle: "修改线下追保函",
      },
      path: "offline/add",
      component: () => import("@/v2/center/trade/views/bondLetter/offline/Add.vue"),
    },
  ]
}