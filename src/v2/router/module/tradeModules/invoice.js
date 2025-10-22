export default {
  nickName: "发票管理",
  path: "invoice",
  meta: {
    title: '发票管理',
    authCode: "dgChain"
  },
  redirect: 'invoice/buy',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "进项发票",
      path: "buy",
      meta: {
        title: "进项发票",
      },
      redirect: 'buy/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "进项发票列表",
          path: "list",
          component: () => import("@/v2/center/trade/views/invoice/BuyInvoiceList.vue"),
        },
        {
          nickName: "进项发票详情",
          path: "detail",
          meta: {
            title: "进项发票详情",
          },
          component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
        },
        {
          nickName: "进项发票编辑",
          path: "edit",
          meta: {
            title: "进项发票编辑",
          },
          component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
        },
        {
          nickName: "新增进项发票",
          path: "add",
          meta: {
            title: "新增进项发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/AddBuy.vue"),
        },
        {
          nickName: "关联合同",
          path: "link/contract",
          meta: {
            title: "关联合同",
          },
          component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
        },
        {
          nickName: "上传负数发票",
          path: "upload/negative",
          meta: {
            title: "上传负数发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/SellUploadNegativeInvoice.vue"),
        },
      ],
    },
    {
      nickName: "销项发票",
      path: "sell",
      meta: {
        title: "销项发票",
      },
      redirect: 'sell/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "销项发票列表",
          path: "list",
          component: () => import("@/v2/center/trade/views/invoice/SellInvoiceList.vue"),
        },
        {
          nickName: "销项发票详情",
          path: "detail",
          meta: {
            title: "销项发票详情",
          },
          component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
        },
        {
          nickName: "销项发票编辑",
          path: "edit",
          meta: {
            title: "销项发票编辑",
          },
          component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
        },
        {
          nickName: "新增销项发票",
          path: "add",
          meta: {
            title: "新增销项发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/AddSell.vue"),
        },
        {
          nickName: "关联合同",
          path: "link/contract",
          meta: {
            title: "关联合同",
          },
          component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
        },
        {
          nickName: "上传负数发票",
          path: "upload/negative",
          meta: {
            title: "上传负数发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/BuyUploadNegativeInvoice.vue"),
        },
      ],
    },
    {
      nickName: "运费发票",
      path: "freight",
      meta: {
        title: "运费发票",
      },
      redirect: 'freight/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "运费发票列表",
          path: "list",
          component: () => import("@/v2/center/trade/views/invoice/FreightInvoiceList.vue"),
        },
        {
          nickName: "运费发票详情",
          path: "detail",
          meta: {
            title: "运费发票详情",
          },
          component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
        },
        {
          nickName: "新增运费发票",
          path: "add",
          meta: {
            title: "新增运费发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/AddFreight.vue"),
        },
        {
          nickName: "异常发票记录",
          path: "unusual/list",
          meta: {
            title: "异常发票记录",
          },
          component: () => import("@/v2/center/trade/views/invoice/UnusualInvoiceList.vue"),
        },
        {
          nickName: "关联合同",
          path: "link/contract",
          meta: {
            title: "关联合同",
          },
          component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
        },
        {
          nickName: "进项发票编辑",
          path: "edit",
          meta: {
            title: "进项发票编辑",
          },
          component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
        },
        {
          nickName: "上传负数发票",
          path: "upload/negative",
          meta: {
            title: "上传负数发票",
          },
          component: () => import("@/v2/center/trade/views/invoice/FreightUploadNegativeInvoice.vue"),
        },
      ],
    },
  ]
};
