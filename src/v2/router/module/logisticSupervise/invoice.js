export default {
  nickName: "发票管理",
  path: "logisticSupervise/invoice",
  meta: {
    title: "发票管理" ,
  },
  redirect: '/center/logisticSupervise/invoice/freight',
  component: () => import("@/v2/center/logisticSupervise/views/index.vue"),
  children: [
    {
      nickName: "运费发票",
      path: "logisticSupervise/invoice/freight",
      meta: {
        title: "运费发票",
      },
      redirect: '/center/logisticSupervise/invoice/freight',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
         
        {
          nickName: "运费发票",
          path: "/center/logisticSupervise/invoice/freight",
          meta: {
            title: "运费发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/freightList.vue"),
        },
        {
          nickName: "新增运费发票",
          path: "/center/logisticSupervise/invoice/freight/add",
          meta: {
            title: "新增运费发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/AddFreight.vue"),
        },
        {
          nickName: "运费发票详情",
          path: "/center/logisticSupervise/invoice/freight/detail",
          meta: {
            title: "运费发票详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/FreightDetail.vue"),
        },
        {
          nickName: "编辑运费发票",
          path: "/center/logisticSupervise/invoice/freight/edit",
          meta: {
            title: "编辑运费发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/FreightDetail.vue"),
        },
        {
          nickName: "关联合同",
          path: "/center/logisticSupervise/invoice/freight/link/contract",
          meta: {
            title: "关联合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/LinkContract.vue"),
        },

      ]
    },
    {
      nickName: "仓储发票",
      path: "logisticSupervise/invoice/buy",
      meta: {
        title: "仓储发票",
      },
      redirect: '/center/logisticSupervise/invoice/buy',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
         
        {
          nickName: "仓储发票",
          path: "/center/logisticSupervise/invoice/buy",
          meta: {
            title: "仓储发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/buyList.vue"),
        },
        {
          nickName: "新增仓储发票",
          path: "/center/logisticSupervise/invoice/buy/add",
          meta: {
            title: "新增仓储发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/AddBuy.vue"),
        },
        {
          nickName: "仓储发票详情",
          path: "/center/logisticSupervise/invoice/buy/detail",
          meta: {
            title: "仓储发票详情",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/BuyDetail.vue"),
        },
        {
          nickName: "编辑仓储发票",
          path: "/center/logisticSupervise/invoice/buy/edit",
          meta: {
            title: "编辑仓储发票",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/BuyDetail.vue"),
        },
        {
          nickName: "关联合同",
          path: "/center/logisticSupervise/invoice/buy/link/contract",
          meta: {
            title: "关联合同",
          },
          component: () => import("@/v2/center/logisticSupervise/views/invoice/LinkContract.vue"),
        },

      ]
    }
   


    
  ],
}