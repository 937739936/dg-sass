export default {
  nickName: "结算单管理",
  path: "logisticSupervise/statement",
  meta: {
    title: "结算单管理" ,
  },
  redirect: '/center/logisticSupervise/statement/transSettle',
  component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
  children: [

    {
      nickName: "运输结算单",
      path: "logisticSupervise/statement/transSettle",
      meta: {
        title: "运输结算单",
      },
      redirect: '/center/logisticSupervise/statement/transSettle',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
         
        {
          nickName: "运输结算单",
          path: "/center/logisticSupervise/statement/transSettle",
          meta: {
            title: "运输结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/transSettle/list.vue"),
        },
        {
          nickName: "新增线下运输结算单",
          path: "/center/logisticSupervise/statement/transSettle/add",
          meta: {
            title: "新增线下运输结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/transSettle/add.vue"),
        },
        {
          nickName: "线下运输结算单详情",
          path: "/center/logisticSupervise/statement/transSettle/detail",
          meta: {
            title: "线下运输结算单详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/transSettle/detail.vue"),
        },
        {
          nickName: "编辑线下运输结算单",
          path: "/center/logisticSupervise/statement/transSettle/edit",
          meta: {
            title: "编辑线下运输结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/transSettle/add.vue"),
        },
      ]
    },

    {
      nickName: "仓储费结算单",
      path: "logisticSupervise/statement/storage",
      meta: {
        title: "仓储费结算单",
      },
      redirect: '/center/logisticSupervise/statement/storage',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
         
        {
          nickName: "仓储费结算单",
          path: "/center/logisticSupervise/statement/storage",
          meta: {
            title: "仓储仓储费结算单结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/storage/list.vue"),
        },
        {
          nickName: "新增仓储费结算单",
          path: "/center/logisticSupervise/statement/storage/add",
          meta: {
            title: "新增仓储费结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/storage/add.vue"),
        },
        {
          nickName: "仓储费结算单详情",
          path: "/center/logisticSupervise/statement/storage/detail",
          meta: {
            title: "仓储费结算单详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/storage/detail.vue"),
        },
        {
          nickName: "编辑仓储费结算单",
          path: "/center/logisticSupervise/statement/storage/edit",
          meta: {
            title: "编辑仓储费结算单",
          },
          component: () => import("@/v2/center/logisticSupervise/views/statement/storage/add.vue"),
        },
      ]
    }
   


    
  ],
}