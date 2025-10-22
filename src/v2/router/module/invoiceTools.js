export default [
  {
    nickName: "进项发票列表",
    path: "admin/invoice/in/list",
    name: "invoiceInList",
    meta: {
      path: [
        {
          name: "进项发票",
          path: "",
        },
        {
          name: "进项发票列表",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/list.vue"),
  },
  {
    nickName: "进项发票新增",
    path: "admin/invoice/in/add",
    name: "invoiceInAdd",
    meta: {
      path: [
        {
          name: "进项发票",
          path: "admin/invoice/in/list",
        },
        {
          name: "进项发票新增",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/add.vue"),
  },
  {
    nickName: "进项发票关联合同",
    path: "admin/invoice/in/add/relation",
    name: "invoiceInAddRelation",
    meta: {
      path: [
        {
          name: "进项发票",
          path: "admin/invoice/in/list",
        },
        {
          name: "进项发票新增",
          path: "admin/invoice/in/add",
        },
        {
          name: "关联合同",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/relation.vue"),
  },
  {
    nickName: "进项发票详情",
    path: "admin/invoice/in/detail",
    name: "invoiceInDetail",
    meta: {
      path: [
        {
          name: "进项发票",
          path: "admin/invoice/in/list",
        },
        {
          name: "发票详情",
          path: "admin/invoice/in/detail",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/detail.vue"),
  },
  {
    nickName: "进项发票入账详情",
    path: "admin/invoice/in/entry/detail",
    name: "invoiceInEntryDetail",
    meta: {
      path: [
        {
          name: "进项发票入账",
          path: "admin/invoice/in/entry",
        },
        {
          name: "入账详情",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/detailEntry.vue"),
  },
  {
    nickName: "进项发票入账",
    path: "admin/invoice/in/entry",
    name: "invoiceInEntry",
    meta: {
      path: [
        {
          name: "进项发票",
          path: "",
        },
        {
          name: "进项发票入账",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/in/entry.vue"),
  },
  {
    nickName: "销项发票列表",
    path: "admin/invoice/out/list",
    name: "invoiceOutList",
    meta: {
      path: [
        {
          name: "销项发票",
          path: "",
        },
        {
          name: "销项发票列表",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/out/list.vue"),
  },
  {
    nickName: "销项发票新增",
    path: "admin/invoice/out/add",
    name: "invoiceOutAdd",
    meta: {
      path: [
        {
          name: "销项发票",
          path: "admin/invoice/out/list",
        },
        {
          name: "销项发票新增",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/out/add.vue"),
  },
  {
    nickName: "销项发票新增确认",
    path: "admin/invoice/out/add/confirm",
    name: "invoiceOutAddConfirm",
    meta: {
      path: [
        {
          name: "销项发票",
          path: "admin/invoice/out/list",
        },
        {
          name: "销项发票新增",
          path: "admin/invoice/out/add",
        },
        {
          name: "信息确认",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/out/confirm.vue"),
  },
  {
    nickName: "运费发票列表",
    path: "admin/invoice/transport/list",
    name: "invoiceTransportList",
    meta: {
      path: [
        {
          name: "运费发票",
          path: "",
        },
        {
          name: "运费发票列表",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/list.vue"),
  },
  {
    nickName: "运费发票新增",
    path: "admin/invoice/transport/add",
    name: "invoiceTransportAdd",
    meta: {
      path: [
        {
          name: "运费发票",
          path: "admin/invoice/transport/list",
        },
        {
          name: "运费发票新增",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/add.vue"),
  },
  {
    nickName: "运费发票关联合同",
    path: "admin/invoice/transport/add/relation",
    name: "invoiceTransportRelation",
    meta: {
      path: [
        {
          name: "运费发票",
          path: "admin/invoice/transport/list",
        },
        {
          name: "运费发票新增",
          path: "admin/invoice/transport/add",
        },
        {
          name: "关联合同",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/relation.vue"),
  },
  {
    nickName: "运费发票详情",
    path: "admin/invoice/transport/add/detail",
    name: "invoiceTransportDetail",
    meta: {
      path: [
        {
          name: "运费发票",
          path: "admin/invoice/transport/list",
        },
        {
          name: "运费发票详情",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/detail.vue"),
  },
  {
    nickName: "运费发票入账",
    path: "admin/invoice/transport/entry",
    name: "invoiceTransportEntry",
    meta: {
      path: [
        {
          name: "运费发票",
          path: "",
        },
        {
          name: "运费发票入账",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/entry.vue"),
  },
  {
    nickName: "运费发票入账详情",
    path: "admin/invoice/transport/entry/detail",
    name: "invoiceTransportEntryDetail",
    meta: {
      path: [
        {
          name: "运费发票入账",
          path: "admin/invoice/transport/entry",
        },
        {
          name: "入账详情",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/transport/detailEntry.vue"),
  },
  {
    nickName: "采购合同管理",
    path: "admin/invoice/contract/buy/list",
    name: "invoiceContractBuy",
    meta: {
      path: [
        {
          name: "合同管理",
          path: "",
        },
        {
          name: "采购合同管理",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/contract/buy.vue"),
  },
  {
    nickName: "采购合同详情",
    path: "admin/invoice/contract/buy/detail",
    name: "invoiceContractBuyDetail",
    meta: {
      path: [
        {
          name: "采购合同管理",
          path: "admin/invoice/contract/buy/list",
        },
        {
          name: "合同详情",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/contract/detailsBuy.vue"),
  },
  {
    nickName: "销售合同管理",
    path: "admin/invoice/contract/sell/list",
    name: "invoiceContractSell",
    meta: {
      path: [
        {
          name: "合同管理",
          path: "",
        },
        {
          name: "销售合同管理",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/contract/sell.vue"),
  },
  {
    nickName: "销售合同详情",
    path: "admin/invoice/contract/sell/detail",
    name: "invoiceContractSellDetail",
    meta: {
      path: [
        {
          name: "合同管理",
          path: "admin/invoice/contract/sell/list",
        },
        {
          name: "销售合同详情",
          path: "",
        },
      ],
    },
    component: () => import("@/v2/center/invoiceTools/views/contract/detailsSell.vue"),
  },
];
