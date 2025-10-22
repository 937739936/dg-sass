export default {
  nickName: "货转管理",
  path: "transfer/goodsTransfer",
  meta: {
    title: "货转管理",
  },
  redirect: 'transfer/goodsTransfer/list',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "货转管理列表",
      path: "list",
      component: () => import("@/v2/center/trade/views/goodsTransfer/GoodsTransferList.vue"),
    },
    {
      nickName: "填写货转信息",
      path: "apply",
      meta: {
        title: "填写货转信息",
      },
      component: () => import("@/v2/center/trade/views/goodsTransfer/GoodsTransferApply.vue"),
    },
    {
      nickName: "货转信息详情",
      path: "detail",
      meta: {
        title: "货转信息详情",
      },
      component: () => import("@/v2/center/trade/views/goodsTransfer/GoodsTransferDetail.vue"),
    },
    {
      nickName: "货转盖章",
      path: "stamp",
      meta: {
        title: "货转盖章",
      },
      component: () => import("@/v2/center/trade/views/goodsTransfer/GoodsTransferStampDetail.vue"),
    },
    {
      nickName: "货转确认",
      path: "confirm",
      meta: {
        title: "货转信息确认",
      },
      component: () => import("@/v2/center/trade/views/goodsTransfer/GoodsTransferConfirmDetail.vue"),
    },
  ]
};
