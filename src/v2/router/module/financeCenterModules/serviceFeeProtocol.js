export default {
  nickName: "服务费协议管理",
  path: "financeCenter/serviceFeeProtocol",
  meta: {
    title: "服务费协议管理" ,
  },
  redirect: 'financeCenter/serviceFeeProtocol',
  component: () => import("@/v2/center/financeCenter/views/index.vue"),
  children: [
    {
      nickName: "服务费协议管理",
      path: "",
      meta: {
        title: "服务费协议管理",
      },
      redirect: 'list',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
        {
          nickName: "服务费协议管理",
          path: "list",
          meta: {
            title: "服务费协议管理",
          },
          component: () => import("@/v2/center/financeCenter/views/serviceFeeProtocol/list.vue"),
        },
        {
          nickName: "服务费协议详情",
          path: "detail",
          meta: {
            title: "服务费协议详情",
          },
          component: () => import("@/v2/center/financeCenter/views/serviceFeeProtocol/detail.vue"),
        },
        {
          nickName: "服务费协议盖章",
          path: "sign",
          meta: {
            title: "服务费协议盖章",
          },
          component: () => import("@/v2/center/financeCenter/views/serviceFeeProtocol/sign.vue"),
        },
        {
          nickName: "服务费协议作废",
          path: "invalid",
          meta: {
            title: "服务费协议作废",
          },
          component: () => import("@/v2/center/financeCenter/views/serviceFeeProtocol/invalid.vue"),
        },
      ],
    }
  ]
  
}