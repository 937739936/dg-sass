/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
  nickName: "结算单管理",
  path: "settle",
  meta: {
    title: '结算单管理',
    authCode: "dgChain"
  },
  redirect: 'settle/apply',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "采购结算单",
      path: "buy",
      meta: {
        title: "采购结算单",
      },
      redirect: 'buy/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "采购结算单列表页",
          path: "list",
          meta: {
            title: "采购结算单列表页",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleList.vue"),
        },
        {
          nickName: "新增电子采购结算单",
          path: "onlineadd",
          meta: {
            title: "新增电子采购结算单",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineAdd.vue"),
        },
        {
          nickName: "编辑电子采购结算单",
          path: "onlineedit",
          meta: {
            title: "编辑电子采购结算单",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineAdd.vue"),
        },
        {
          nickName: "电子采购结算单详情",
          path: "onlinedetail",
          meta: {
            title: "电子采购结算单详情",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineDetail.vue"),
        },
        {
          nickName: "电子采购结算单确认",
          path: "onlineconfirm",
          meta: {
            title: "电子采购结算单确认",
            type: 'buy',
            confirm: true,
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineDetail.vue"),
        },
        {
          nickName: "电子采购结算单盖章",
          path: "onlineseal",
          meta: {
            title: "电子采购结算单盖章",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineSeal.vue"),
        },
        {
          nickName: "电子采购结算单作废确认",
          path: "onlinecancel",
          meta: {
            title: "电子采购结算单作废确认",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineCancel.vue"),
        },
        {
          nickName: "电子采购结算单作废盖章",
          path: "onlinecancelseal",
          meta: {
            title: "电子采购结算单作废盖章",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineCancelSeal.vue"),
        },
        {
          nickName: "新增线下采购结算单",
          path: "offlineadd",
          meta: {
            title: "新增线下采购结算单",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOfflineAdd.vue"),
        },
        {
          nickName: "线下采购结算单详情",
          path: "offlinedetail",
          meta: {
            title: "线下采购结算单详情",
            type: 'buy'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOfflineDetail.vue"),
        },
      ],
    },
    {
      nickName: "销售结算单",
      path: "sell",
      meta: {
        title: "销售结算单",
      },
      redirect: 'sell/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "销售结算单列表页",
          path: "list",
          meta: {
            title: "销售结算单列表页",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleList.vue"),
        },
        {
          nickName: "新增电子销售结算单",
          path: "onlineadd",
          meta: {
            title: "新增电子销售结算单",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineAdd.vue"),
        },
        {
          nickName: "编辑电子销售结算单",
          path: "onlineedit",
          meta: {
            title: "编辑电子销售结算单",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineAdd.vue"),
        },
        {
          nickName: "电子销售结算单详情",
          path: "onlinedetail",
          meta: {
            title: "电子销售结算单详情",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineDetail.vue"),
        },
        {
          nickName: "电子销售结算单确认",
          path: "onlineconfirm",
          meta: {
            title: "电子销售结算单确认",
            type: 'sell',
            confirm: true,
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineDetail.vue"),
        },
        {
          nickName: "电子销售结算单盖章",
          path: "onlineseal",
          meta: {
            title: "电子销售结算单盖章",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineSeal.vue"),
        },
        {
          nickName: "电子销售结算单作废确认",
          path: "onlinecancel",
          meta: {
            title: "电子销售结算单作废确认",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineCancel.vue"),
        },
        {
          nickName: "电子销售结算单作废盖章",
          path: "onlinecancelseal",
          meta: {
            title: "电子销售结算单作废盖章",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOnlineCancelSeal.vue"),
        },
        {
          nickName: "新增线下销售结算单",
          path: "offlineadd",
          meta: {
            title: "新增线下销售结算单",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOfflineAdd.vue"),
        },
        {
          nickName: "线下销售结算单详情",
          path: "offlinedetail",
          meta: {
            title: "线下销售结算单详情",
            type: 'sell'
          },
          component: () => import("@/v2/center/trade/views/settle/SettleOfflineDetail.vue"),
        },
      ],
    },
    {
      nickName: "运输结算单",
      path: "transport",
      meta: {
        title: "运输结算单",
      },
      redirect: 'transport/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "运输结算单列表页",
          path: "list",
          component: () => import("@/v2/center/trade/views/settle/TransSettleList.vue"),
        },
        {
          nickName: "新增线下运输结算单",
          path: "add",
          meta: {
            title: "新增线下运输结算单",
          },
          component: () => import("@/v2/center/trade/views/settle/OfflineSettleAddOrEditTrans.vue"),
        },
        {
          nickName: "线下运输结算单详情",
          path: "detail",
          meta: {
            title: "线下运输结算单详情",
          },
          component: () => import("@/v2/center/trade/views/settle/SettleApplyDetailTrans.vue"),
        },
        {
          nickName: "编辑线下运输结算单",
          path: "edit",
          meta: {
            title: "编辑线下运输结算单",
          },
          component: () => import("@/v2/center/trade/views/settle/OfflineSettleAddOrEditTrans.vue"),
        },
      ]
    },
    // {
    //   nickName: "结算单作废",
    //   path: "cancel",
    //   meta: {
    //     title: "结算单作废",
    //   },
    //   redirect: 'cancel/list',
    //   component: () => import("@/v2/center/trade/views/index.vue"),
    //   children: [
    //     {
    //       nickName: "结算单作废列表页",
    //       path: "list",
    //       component: () => import("@/v2/center/trade/views/settle/SettleCancelList.vue"),
    //     },
    //     {
    //       nickName: "结算单作废盖章",
    //       path: "stamp",
    //       component: () => import("@/v2/center/trade/views/settle/SettleCancelStamp.vue"),
    //     },
    //     {
    //       nickName: "结算单作废确认",
    //       path: "confirm",
    //       component: () => import("@/v2/center/trade/views/settle/SettleCancelConfirm.vue"),
    //     },
    //   ],
    // },
  ]
};
