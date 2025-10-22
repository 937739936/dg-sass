export default [
  {
    nickName: "进项发票列表",
    path: "invoice/buyInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/BuyInvoiceList.vue"),
  },
  {
    nickName: "销项发票列表",
    path: "invoice/sellInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/SellInvoiceList.vue"),
  },
  {
    nickName: "运费发票列表",
    path: "invoice/freightInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/FreightInvoiceList.vue"),
  },
  {
    nickName: '异常发票记录',
    path: 'invoice/unusualInvoiceList',
    component: () => import('@/v2/center/trade/views/invoice/UnusualInvoiceList.vue')
  },
  {
    nickName: "进项发票详情",
    path: "invoice/buyDetail",
    component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "invoice/buyEdit",
    component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "销项发票详情",
    path: "invoice/sellDetail",
    component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "销项发票编辑",
    path: "invoice/sellEdit",
    component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "运费发票详情",
    path: "invoice/freightDetail",
    component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "invoice/freightEdit",
    component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
  },
  {
    nickName: "新增进项发票",
    path: "invoice/addBuy",
    component: () => import("@/v2/center/trade/views/invoice/AddBuy.vue"),
  },
  {
    nickName: "新增销项发票",
    path: "invoice/addSell",
    component: () => import("@/v2/center/trade/views/invoice/AddSell.vue"),
  },
  {
    nickName: "新增运费发票",
    path: "invoice/addFreight",
    component: () => import("@/v2/center/trade/views/invoice/AddFreight.vue"),
  },
  {
    nickName: "关联合同",
    path: "invoice/linkContract",
    component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
  },
];
