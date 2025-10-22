export default {
  nickName: "合同管理",
  path: "logisticSupervise/contract",
  meta: {
    title: "合同管理" ,
  },
  redirect: 'logisticSupervise/contract/transport',
  component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
  children: [

    {
      nickName: "运输合同",
      path: "transport",
      meta: {
        title: "运输合同",
      },
      redirect: 'transport/list',
      component: () => import("@/v2/center/logisticSupervise/views/contract/index.vue"),
      children: [
         
        {
          nickName: "运输合同",
          path: "list",
          meta: {
            title: "运输合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/transport/list.vue"),
        },
        {
          nickName: "新增运输合同",
          path: "add",
          meta: {
            title: "新增运输合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/transport/add.vue"),
        },
        {
          nickName: "运输合同详情",
          path: "detail",
          meta: {
            title: "运输合同详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/transport/detail.vue"),
        },
      ]
    },

    {
      nickName: "仓储合同",
      path: "storage",
      meta: {
        title: "仓储合同",
      },
      redirect: 'storage/list',
      component: () => import("@/v2/center/logisticSupervise/views/contract/index.vue"),
      children: [
         
        {
          nickName: "仓储合同",
          path: "list",
          meta: {
            title: "仓储合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/storage/list.vue"),
        },
        {
          nickName: "新增仓储合同",
          path: "add",
          meta: {
            title: "新增仓储合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/storage/add.vue"),
        },
        {
          nickName: "仓储合同详情",
          path: "detail",
          meta: {
            title: "仓储合同详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/contract/storage/detail.vue"),
        },
      ]
    }
  ],
}