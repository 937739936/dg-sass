export default {
  nickName: "付款管理",
  path: "/center/logisticSupervise/paymentManage",
  meta: {
    title: "付款管理" ,
  },
  redirect: '/center/logisticSupervise/paymentManage/list',
  component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
  children: [

    {
      nickName: "付款记录",
      path: "/center/logisticSupervise/paymentManage/list",
      meta: {
        title: "付款记录",
      },
      redirect: '/center/logisticSupervise/paymentManage/list',
      component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
      children: [
         
        {
          nickName: "付款记录",
          path: "/center/logisticSupervise/paymentManage/list",
          meta: {
            title: "付款记录",
          },
          component: () => import("@/v2/center/logisticSupervise/views/paymentManage/list.vue"),
        },
        {
          nickName: "新增付款",
          path: "/center/logisticSupervise/paymentManage/add",
          meta: {
            title: "新增付款",
          },
          component: () => import("@/v2/center/logisticSupervise/views/paymentManage/add.vue"),
        },
        {
          nickName: "付款详情",
          path: "/center/logisticSupervise/paymentManage/detail",
          meta: {
            title: "付款详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/paymentManage/detail.vue"),
        },

      ]
    }
  ],
}