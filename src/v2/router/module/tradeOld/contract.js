export default [
  {
    nickName: "合同详情",
    path: "contract/detail",
    name: "contractDetail",
    component: () => import("@/v2/center/trade/views/contract/online/FilesDetail.vue"),
  },
  {
    nickName: "采购合同列表",
    path: "contract/buyContractList",
    name: "contractBuyContractList",
    component: () => import("@/v2/center/trade/views/contract/BuyContractList.vue"),
  },
  {
    nickName: "补录合同详情",
    path: "contract/contractOffLine",
    name: "contractContractOffLine",
    component: () => import("@/v2/center/trade/views/contract/offline/List.vue"),
  },
  {
    nickName: "销售合同列表",
    path: "contract/sellContractList",
    name: "contractSellContractList",
    component: () => import("@/v2/center/trade/views/contract/SellContractList.vue"),
  },
  {
    nickName: "补录线下合同新增修改",
    path: "contract/contractOffLineAdd",
    name: "contractContractOffLineAdd",
    component: () => import("@/v2/center/trade/views/contract/offline/Add.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    nickName: "采销合同关联列表",
    path: "contract/contractAssociationList",
    name: "contractContractAssociationList",
    component: () => import("@/v2/center/trade/views/businessline/List.vue"),
  },
  {
    nickName: "补充协议管理",
    path: "contract/suppleAgreement",
    name: "suppleAgreement",
    component: () => import("@/v2/center/trade/views/contract/suppleAgreement/List.vue"),
  },
  {
    nickName: "新增补充协议管理",
    path: "contract/creatSuppleAgreement",
    name: "creatSuppleAgreement",
    component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Creat.vue"),
  },
  {
    nickName: "补充协议详情",
    path: "contract/suppleAgreementDetail",
    name: "suppleAgreementDetail",
    component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Detail.vue"),
  },
  {
    nickName: "补充协议PDF",
    path: "contract/suppleAgreementPdf",
    name: "SuppleAgreementPdf",
    component: () => import("@/v2/center/trade/views/contract/suppleAgreement/SuppleAgreementPdf.vue"),
  },
  {
    nickName: "补充协议盖章",
    path: "contract/suppleAgreementSign",
    name: "SuppleAgreementSign",
    component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Sign.vue"),
  },
];
