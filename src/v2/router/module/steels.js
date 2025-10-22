export default [
  // 采购合同列表
  {
    path: "/center/steels/contract/buy/list",
    name: "SteelsContractBuyList",
    component: () => import("@/v2/center/steels/views/contract/buy/List.vue"),
  },
  // 采购合同补录
  {
    path: "/center/steels/contract/buy/supplement",
    name: "SteelsContractBuySupplement",
    component: () => import("@/v2/center/steels/views/contract/buy/Supplement.vue"),
  },
  // 销售合同列表
  {
    path: "/center/steels/contract/sell/list",
    name: "SteelsContractSellList",
    component: () => import("@/v2/center/steels/views/contract/sell/List.vue"),
  },
  // 创建采购合同
  {
    path: "/center/steels/contract/buy/create",
    name: "SteelsContractBuyCreate",
    component: () => import("@/v2/center/steels/views/contract/buy/Create.vue"),
  },
  // 销售合同补录
  {
    path: "/center/steels/contract/sell/supplement",
    name: "SteelsContractSellSupplement",
    component: () => import("@/v2/center/steels/views/contract/sell/Supplement.vue"),
  },
  // 协议预览
  {
    path: "/center/steels/contract/preview",
    name: "ContractPreview",
    component: () => import("@/v2/center/steels/views/contract/preview.vue"),
  },
  {
    path: "/center/steels/contract/sell/create",
    name: "SteelsContractSellCreate",
    component: () => import("@/v2/center/steels/views/contract/sell/Create.vue"),
  },
  // 采购合同详情
  {
    path: "/center/steels/contract/buy/detail",
    name: "SteelsContractBuyDetail",
    component: () => import("@/v2/center/steels/views/contract/buy/Detail.vue"),
  },
  // 采购合同盖章
  {
    path: "/center/steels/contract/buy/stamp",
    name: "SteelsContractBuyStamp",
    component: () => import("@/v2/center/steels/views/contract/buy/StampDetail.vue"),
  },
  // 销售合同确认
  {
    path: "/center/steels/contract/sell/stamp",
    name: "SteelsContractSellStamp",
    component: () => import("@/v2/center/steels/views/contract/sell/ConfirmDetail.vue"),
  },
  // 采购合同详情电子合同查看
  {
    nickName: "服务费协议",
    path: "/center/steels/contract/buy/serviceFeeAgreementPdf",
    name: "SteelsOrderSellServiceFeeAgreementPdf",
    component: () => import("@/v2/center/steels/views/contract/buy/ServiceFeeAgreementPdf.vue"),
  },
  // 补充协议列表
  {
    nickName: "补充协议管理",
    path: "/center/steels/suppleAgreement/list",
    name: "SteelsSuppleAgreementList",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/List.vue"),
  },
  // 补充协议创建第一步选择合同
  {
    path: "/center/steels/suppleAgreement/createOne",
    name: "SteelsSuppleAgreementCreateOne",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/ContractList.vue"),
  },
  // 补充协议创建第一步
  {
    nickName: "新增补充协议管理",
    path: "/center/steels/suppleAgreement/createTwo",
    name: "SteelsSuppleAgreementCreateTwo",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/Creat.vue"),
  },
  {
    nickName: "补充协议详情",
    path: "/center/steels/suppleAgreementDetail",
    name: "SteelsSuppleAgreementDetail",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/Detail.vue"),
  },
  {
    nickName: "补充协议PDF",
    path: "/center/steels/suppleAgreementPdf",
    name: "SteelsSuppleAgreementPdf",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/SuppleAgreementPdf.vue"),
  },
  {
    nickName: "补充协议盖章",
    path: "/center/steels/suppleAgreementSign",
    name: "SteelsSuppleAgreementSign",
    component: () => import("@/v2/center/steels/views/contract/suppleAgreement/Sign.vue"),
  },
  //采销合同关联
  {
    nickName: "采销合同关联列表",
    path: "/center/steels/relation/list",
    name: "SteelsRelationList",
    component: () => import("@/v2/center/steels/views/contract/relation/List.vue"),
  },
  {
    nickName: "新增采销合同关联",
    path: "/center/steels/relation/create",
    name: "SteelsRelationCreate",
    component: () => import("@/v2/center/steels/views/contract/relation/Create.vue"),
  },
  //采销合同关联详情
  {
    nickName: "采销合同关联详情",
    path: "/center/steels/relation/detail",
    name: "SteelsRelationDetail",
    component: () => import("@/v2/center/steels/views/contract/relation/Detail.vue"),
  },
  // 发货计划列表
  {
    path: "/center/steels/deliverPlan/list",
    name: "SteelsDeliverPlanList",
    component: () => import("@/v2/center/steels/views/deliverPlan/List.vue"),
  },
  // 发货计划新增
  {
    path: "/center/steels/deliverPlan/add",
    name: "SteelsDeliverPlanAdd",
    component: () => import("@/v2/center/steels/views/deliverPlan/Add.vue"),
  },
  // 发货计划详情
  {
    path: "/center/steels/deliverPlan/detail",
    name: "SteelsDeliverPlanDetail",
    component: () => import("@/v2/center/steels/views/deliverPlan/Detail.vue"),
  },
  // 调整车辆
  {
    path: "/center/steels/deliverPlan/update",
    name: "SteelsDeliverPlanDetailUpdate",
    component: () => import("@/v2/center/steels/views/deliverPlan/Update.vue"),
  },
  // 发货列表
  {
    path: "/center/steels/receive/deliver/list",
    name: "SteelsReceiveDeliverList",
    component: () => import("@/v2/center/steels/views/receive/deliver/List.vue"),
  },
  // 发货申请列表
  {
    path: "/center/steels/receive/deliver/applyList",
    name: "SteelsReceiveApplyList",
    component: () => import("@/v2/center/steels/views/receive/deliver/ApplyList.vue"),
  },
  // 发货申请第二步
  {
    path: "/center/steels/receive/deliver/releaseApply",
    name: "SteelsReceiveReleaseApply",
    component: () => import("@/v2/center/steels/views/receive/deliver/ReleaseApply.vue"),
  },
  // 发货详情
  {
    path: "/center/steels/receive/deliver/detail",
    name: "SteelsReceiveReleaseDetail",
    component: () => import("@/v2/center/steels/views/receive/deliver/Detail.vue"),
  },
  // 收货列表
  {
    path: "/center/steels/receive/receipt/list",
    name: "SteelsReceiveReceiptList",
    component: () => import("@/v2/center/steels/views/receive/receipt/List.vue"),
  },
  // 收货确认列表
  {
    path: "/center/steels/receive/receipt/confirmList",
    name: "SteelsReceiveReceiptConfirmList",
    component: () => import("@/v2/center/steels/views/receive/receipt/ConfirmList.vue"),
  },
  // 收货确认第二步
  {
    path: "/center/steels/receive/receipt/receiveApply",
    name: "SteelsReceiveReceiveApply",
    component: () => import("@/v2/center/steels/views/receive/receipt/ReceiveApply.vue"),
  },
  // 收货详情
  {
    path: "/center/steels/receive/receipt/detail",
    name: "SteelsReceiveReceiptDetail",
    component: () => import("@/v2/center/steels/views/receive/receipt/Detail.vue"),
  },
  // 付款
  {
    path: "/center/steels/funds/payment/list",
    name: "SteelsFundsPaymentList",
    component: () => import("@/v2/center/steels/views/funds/payment/List.vue"),
  },
  // 收款
  {
    path: "/center/steels/funds/payment/receiptList",
    name: "SteelsFundsPaymentReceiptList",
    component: () => import("@/v2/center/steels/views/funds/payment/receiptList.vue"),
  },
  {
    path: "/center/steels/funds/payment/paymentApplyOneStep",
    name: "SteelsFundsPaymentPaymentApplyOneStep",
    component: () => import("@/v2/center/steels/views/funds/payment/PaymentApplyOneStep.vue"),
  },
  {
    path: "/center/steels/funds/payment/paymentApplyTwoStep",
    name: "SteelsFundsPaymentApplyTwoStep",
    component: () => import("@/v2/center/steels/views/funds/payment/PaymentApplyTwoStep.vue"),
  },
  // {
  //   path: "/center/steels/funds/payment/payRecordDetail",
  //   name: "SteelsFundsPaymentPayRecordDetail",
  //   component: () => import("@/v2/center/steels/views/funds/payment/PayRecordDetail.vue"),
  // },
  {
    path: "/center/steels/funds/collection/list",
    name: "SteelsFundsCollectionList",
    component: () => import("@/v2/center/steels/views/funds/collection/List.vue"),
  },
  {
    path: "/center/steels/funds/collection/claimDetail",
    name: "SteelsFundsCollectionClaimDetail",
    component: () => import("@/v2/center/steels/views/funds/collection/ClaimDetail.vue"),
  },
  {
    path: "/center/steels/funds/collection/oaClaimDetail",
    name: "SteelsFundsCollectionOaClaimDetail",
    component: () => import("@/v2/center/steels/views/funds/collection/OaClaimDetail.vue"),
  },
  {
    path: "/center/steels/funds/collection/roClaimDetail",
    name: "SteelsFundsCollectionRoClaimDetail",
    component: () => import("@/v2/center/steels/views/funds/collection/RoClaimDetail.vue"),
  },
//   {
//     path: "/center/steels/serviceCharge/flowDetail/list",
//     name: "SteelsServiceChargeFlowDetailList",
//     component: () => import("@/v2/center/steels/views/serviceCharge/flowDetail/List.vue"),
//   },
//   {
//     nickName: "服务费流水明细",
//     path: "/center/steels/service/ServiceFeeFlowDetail",
//     name: "SteelsInvoiceFreightInvoiceList",
//     component: () => import("@/v2/center/steels/views/serviceCharge/flowDetail/List.vue"),
//   },
  {
    nickName: "进项发票列表",
    path: "/center/steels/invoice/buyInvoiceList",
    name: "steelsBuyInvoiceList",
    component: () => import("@/v2/center/steels/views/invoice/BuyInvoiceList.vue"),
  },
  {
    nickName: "销项发票列表",
    path: "/center/steels/invoice/sellInvoiceList",
    name: "steelsSellInvoiceList",
    component: () => import("@/v2/center/steels/views/invoice/SellInvoiceList.vue"),
  },
  {
    nickName: "运费发票列表",
    path: "/center/steels/invoice/freightInvoiceList",
    name: "steelsFreightInvoiceList",
    component: () => import("@/v2/center/steels/views/invoice/FreightInvoiceList.vue"),
  },
  {
    nickName: "上传负数发票",
    path: "/center/steels/invoice/upload/sellNegative",
    meta: {
      title: "上传负数发票",
    },
    component: () => import("@/v2/center/steels/views/invoice/SellUploadNegativeInvoice.vue"),
  },
  {
    nickName: "上传负数发票",
    path: "/center/steels/invoice/upload/buyNegative",
    meta: {
      title: "上传负数发票",
    },
    component: () => import("@/v2/center/steels/views/invoice/BuyUploadNegativeInvoice.vue"),
  },
  {
    nickName: "上传负数发票",
    path: "/center/steels/invoice/upload/freightNegative",
    meta: {
      title: "上传负数发票",
    },
    component: () => import("@/v2/center/steels/views/invoice/FreightUploadNegativeInvoice.vue"),
  },
  {
    nickName: "进项发票详情",
    path: "/center/steels/invoice/buyDetail",
    name: "steelsBuyInvoiceDetail",
    component: () => import("@/v2/center/steels/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "/center/steels/invoice/buyEdit",
    name: "steelsBuyInvoiceEdit",
    component: () => import("@/v2/center/steels/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "销项发票详情",
    path: "/center/steels/invoice/sellDetail",
    name: "steelsSellInvoiceDetail",
    component: () => import("@/v2/center/steels/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "销项发票编辑",
    path: "/center/steels/invoice/sellEdit",
    name: "steelsSellInvoiceEdit",
    component: () => import("@/v2/center/steels/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "运费发票详情",
    path: "/center/steels/invoice/freightDetail",
    name: "steelsFreightInvoiceDetail",
    component: () => import("@/v2/center/steels/views/invoice/FreightDetail.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "/center/steels/invoice/freightEdit",
    name: "steelsFreightInvoiceEdit",
    component: () => import("@/v2/center/steels/views/invoice/FreightDetail.vue"),
  },
  {
    nickName: "新增进项发票",
    path: "/center/steels/invoice/addBuy",
    name: "steelsInvoiceAddBuy",
    component: () => import("@/v2/center/steels/views/invoice/AddBuy.vue"),
  },
  {
    nickName: "新增销项发票",
    path: "/center/steels/invoice/addSell",
    name: "steelsInvoiceAddSell",
    component: () => import("@/v2/center/steels/views/invoice/AddSell.vue"),
  },
  {
    nickName: "新增运费发票",
    path: "/center/steels/invoice/addFreight",
    name: "steelsInvoiceAddFreight",
    component: () => import("@/v2/center/steels/views/invoice/AddFreight.vue"),
  },
  {
    nickName: "关联合同",
    path: "/center/steels/invoice/linkContract",
    name: "linkContract",
    component: () => import("@/v2/center/steels/views/invoice/LinkContract.vue"),
  },
//   // 货转
  {
    nickName: "补录货转",
    path: "/center/steels/goodsTransfer/goodsTransferAdditionalList",
    name: "GoodsTransferAdditionalList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferAdditionalList.vue"),
  },
  {
    nickName: "补录货转",
    path: "/center/steels/goodsTransfer/godsTransferAdditional",
    name: "GoodsTransferAdditional",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferAdditional.vue"),
  },
  // 榆神（应收货转开具）
  {
    nickName: "货转开具",
    path: "/center/steels/goodsTransfer/GoodsTransferAdditionalApply",
    name: "GoodsTransferAdditionalApply",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferAdditionalApply.vue"),
  },
  {
    nickName: "货转凭证开具",
    path: "/center/steels/goodsTransfer/goodsTransferApplyList",
    name: "SteelsGoodsTransferApplyList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferApplyList.vue"),
  },
  {
    nickName: "货转凭证开具申请",
    path: "/center/steels/goodsTransfer/goodsTransferApply",
    name: "SteelsGoodsTransferApply",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferApply.vue"),
  },
  {
    nickName: "货转凭证开具详情",
    path: "/center/steels/goodsTransfer/goodsTransferApplyDetail",
    name: "SteelsGoodsTransferApplyDetail",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferApplyDetail.vue"),
  },

  {
    nickName: "查看货转",
    path: "/center/steels/goodsTransfer/detail",
    name: "SteelsGoodsTransferDetail",
    component: () => import("@/v2/center/steels/views/goodsTransfer/Detail.vue"),
  },

  {
    nickName: "开具的货转列表",
    path: "/center/steels/goodsTransfer/goodsTransferIssueList",
    name: "SteelsGoodsTransferIssueList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferIssueList.vue"),
  },
  {
    nickName: "收到的货转列表",
    path: "/center/steels/goodsTransfer/goodsTransferReceiveList",
    name: "SteelsGoodsTransferReceiveList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferReceiveList.vue"),
  },

  {
    nickName: "货转记录盖章详情",
    path: "/center/steels/goodsTransfer/goodsTransferStampDetail",
    name: "SteelsGoodsTransferStampDetail",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferStampDetail.vue"),
  },
  {
    nickName: "货转记录确认详情",
    path: "/center/steels/goodsTransfer/goodsTransferConfirmDetail",
    name: "SteelsGoodsTransferConfirmDetail",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferConfirmDetail.vue"),
  },
  {
    nickName: "货转确认",
    path: "/center/steels/goodsTransfer/GoodsTransferConfirmApply",
    name: "goodsTransferConfirmApply",
    component: () => import("@/v2/center/steels/views/goodsTransfer/GoodsTransferConfirmApply.vue"),
  },
  {
    nickName: "放货通知单",
    path: "/center/steels/goodsTransfer/letterNotice/list",
    name: "LetterNoticeList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/letterNotice/list.vue"),
  },
  {
    nickName: "新增放货通知单现在合同",
    path: "/center/steels/goodsTransfer/letterNotice/contractList",
    name: "LetterNoticeContractList",
    component: () => import("@/v2/center/steels/views/goodsTransfer/letterNotice/contractList.vue"),
  },
  {
    nickName: "新增放货通知单",
    path: "/center/steels/goodsTransfer/letterNotice/add",
    name: "LetterNoticeContractAdd",
    component: () => import("@/v2/center/steels/views/goodsTransfer/letterNotice/add.vue"),
  },
  {
    nickName: "放货通知单盖章",
    path: "/center/steels/goodsTransfer/letterNotice/stamp",
    name: "LetterNoticeContractStamp",
    component: () => import("@/v2/center/steels/views/goodsTransfer/letterNotice/stamp.vue"),
  },
  {
    nickName: "放货通知单详情",
    path: "/center/steels/goodsTransfer/letterNotice/detail",
    name: "LetterNoticeContractDetail",
    component: () => import("@/v2/center/steels/views/goodsTransfer/letterNotice/detail.vue"),
  },

  // 结算单
  {
    nickName: "结算单开具",
    path: "/center/steels/settle/settleApplyList",
    name: "SteelsSettleApplyList",
    component: () => import("@/v2/center/steels/views/settle/SettleApplyList.vue"),
  },
  {
    nickName: "结算单补录",
    path: "/center/steels/settle/additional",
    name: "SteelsSettleAdditional",
    component: () => import("@/v2/center/steels/views/settle/additional.vue"),
  },
  {
    nickName: "结算单填写",
    path: "/center/steels/settle/settleApply",
    name: "SteelsSettleApply",
    component: () => import("@/v2/center/steels/views/settle/SettleApply.vue"),
  },
  {
    nickName: "结算单填写",
    path: "/center/steels/settle/settleApplybl",
    name: "SteelsSettleApply",
    component: () => import("@/v2/center/steels/views/settle/SettleApplybl.vue"),
  },
  {
    nickName: "结算单提交盖章",
    path: "/center/steels/settle/settleApply/submit/seal",
    name: "SteelsSettleSubmitSeal",
    component: () => import("@/v2/center/steels/views/settle/SubmitSettleDetail.vue"),
  },
  {
    nickName: "结算单成功页",
    path: "/center/steels/settle/settleSuccess",
    name: "SteelsSettleSuccess",
    component: () => import("@/v2/center/steels/views/settle/SettleSuccess.vue"),
  },
  {
    nickName: "结算单确认成功页",
    path: "/center/steels/settle/settleConfirmSuccess",
    name: "SteelsSettleConfirmSuccess",
    component: () => import("@/v2/center/steels/views/settle/SettleConfirmSuccess.vue"),
  },
  {
    nickName: "我的结算单列表页",
    path: "/center/steels/settle/mySettleList",
    name: "SteelsMySettleList",
    component: () => import("@/v2/center/steels/views/settle/MySettleList.vue"),
  },
  // {
  //   nickName: "新增线下结算单",
  //   path: "/center/steels/settle/offlineSettleAddOrEdit",
  //   name: "OfflineSteelsAddOrEdit",
  //   component: () => import("@/v2/center/steels/views/settle/OfflineSettleAddOrEdit.vue"),
  // },
  // {
  //   nickName: "我的线下结算单详情",
  //   path: "/center/steels/settle/offlineSettleDetail",
  //   name: "OfflineSteelsDetail",
  //   component: () => import("@/v2/center/steels/views/settle/OfflineSettleDetail.vue"),
  // },
  {
    nickName: "我的结算单详情页",
    path: "/center/steels/settle/settleApplyDetail",
    name: "SteelsSettleApplyDetail",
    component: () => import("@/v2/center/steels/views/settle/SettleApplyDetail.vue"),
  },
  {
    nickName: "我的结算单详情页",
    path: "/center/steels/settle/settleApplyDetailbl",
    name: "SteelsSettleApplyDetailbl",
    component: () => import("@/v2/center/steels/views/settle/SettleApplyDetailbl.vue"),
  },
  {
    nickName: "结算单确认列表",
    path: "/center/steels/settle/settleConfirmList",
    name: "SteelsSettleConfirmList",
    component: () => import("@/v2/center/steels/views/settle/SettleConfirmList.vue"),
  },
  {
    nickName: "结算单详情列表",
    path: "/center/steels/settle/settleConfirmDetail",
    name: "SteelsSettleConfirmDetail",
    component: () => import("@/v2/center/steels/views/settle/SettleConfirmDetail.vue"),
  },
  {
    nickName: "结算单作废列表页",
    path: "/center/steels/settle/settleCancelList",
    name: "SteelsSettleCancelList",
    component: () => import("@/v2/center/steels/views/settle/SettleCancelList.vue"),
  },
  {
    nickName: "结算单作废盖章",
    path: "/center/steels/settle/settleCancelStamp",
    name: "SteelsSettleCancelStamp",
    component: () => import("@/v2/center/steels/views/settle/SettleCancelStamp.vue"),
  },
  {
    nickName: "结算单作废确认",
    path: "/center/steels/settle/settleCancelConfirm",
    name: "steelsCancelConfirm",
    component: () => import("@/v2/center/steels/views/settle/SettleCancelConfirm.vue"),
  },
  {
    nickName: "提货申请",
    path: "/center/take/goods/apply",
    name: "takeGoodsApply",
    component: () => import("@/v2/center/steels/views/takeGoods/apply.vue"),
  },
  {
    nickName: "我的提单",
    path: "/center/take/goods/list",
    name: "takeGoodsList",
    component: () => import("@/v2/center/steels/views/takeGoods/list.vue"),
  },
  {
    nickName: "提货申请",
    path: "/center/take/goods/step",
    name: "takeGoodsStep1",
    component: () => import("@/v2/center/steels/views/takeGoods/goods/index.vue"),
  },
  {
    nickName: "提单申请",
    path: "/center/take/order/step",
    name: "takeOrderStep1",
    component: () => import("@/v2/center/steels/views/takeGoods/order/index.vue"),
  },
  {
    nickName: "合同提单申请",
    path: "/center/take/order/contract/stepTwo",
    name: "takeOrderStep2",
    component: () => import("@/v2/center/steels/views/takeGoods/order/contract/stepTwo.vue"),
  },
  {
    nickName: "补录合同提单申请",
    path: "/center/take/order/contract/stepTwoAdditional",
    name: "takeOrderStep2",
    component: () => import("@/v2/center/steels/views/takeGoods/order/contract/stepTwoAdditional.vue"),
  },
  {
    nickName: "盖章",
    path: "/center/take/order/seal",
    name: "takeOrderSeal",
    component: () => import("@/v2/center/steels/views/takeGoods/order/seal.vue"),
  },
  // {
  //   nickName: "单据管理",
  //   path: "/center/steels/receipts/myReceipts",
  //   name: "MyReceipts",
  //   component: () => import("@/v2/center/steels/views/receipts/myReceipts.vue"),
  // },
  // {
  //   nickName: "单据盖章",
  //   path: "/center/steels/receipts/stamp",
  //   name: "MyReceiptsStamp",
  //   component: () => import("@/v2/center/steels/views/receipts/stamp.vue"),
  // },
//     // 报表管理
  // WPS不用了，隐藏我的报表，振月
  // {
  //   nickName: "我的报表",
  //   path: "/center/steels/statement/myStatementList",
  //   name: "MyStatementList",
  //   component: () => import("@/v2/center/steels/views/statement/MyStatementList.vue"),
  // },
  // {
  //   nickName: "我的报表",
  //   path: "/center/steels/statement/iframeWps",
  //   name: "IframeWps",
  //   component: () => import("@/v2/center/steels/views/statement/IframeWps.vue"),
  // },
  {
    nickName: "盯市管理",
    path: "/center/steels/markMarket/markMarket/list",
    name: "markMarket",
    component: () => import("@/v2/center/steels/views/markMarket/markMarket/list.vue"),
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    nickName: "趋势图",
    path: "/center/steels/markMarket/markMarket/detail",
    name: "markMarketDetail",
    component: () => import("@/v2/center/steels/views/markMarket/markMarket/detail.vue"),
  },
  {
    nickName: "新增追保函",
    path: "/center/steels/additionalMargin/additionalMargin/contractList",
    name: "additionalMarginContract",
    component: () => import("@/v2/center/steels/views/additionalMargin/additionalMargin/contractList.vue"),
  },
  {
    nickName: "新增追保函",
    path: "/center/steels/additionalMargin/additionalMargin/add",
    name: "additionalMarginAdd",
    component: () => import("@/v2/center/steels/views/additionalMargin/additionalMargin/add.vue"),
  },
  {
    nickName: "我的追保函",
    path: "/center/steels/additionalMargin/additionalMargin/list",
    name: "additionalMarginList",
    component: () => import("@/v2/center/steels/views/additionalMargin/additionalMargin/list.vue"),
  },
  {
    nickName: "我的追保函详情",
    path: "/center/steels/additionalMargin/additionalMargin/detail",
    name: "additionalMarginDetail",
    component: () => import("@/v2/center/steels/views/additionalMargin/additionalMargin/detail.vue"),
  },
  {
    nickName: "我的追保函盖章",
    path: "/center/steels/additionalMargin/additionalMargin/stamp",
    name: "additionalMarginStamp",
    component: () => import("@/v2/center/steels/views/additionalMargin/additionalMargin/stamp.vue"),
  },
  {
    nickName: "新增进项发票",
    path: "/center/steels/invoice/buy/add",
    name: "buy/add",
    component: () => import("@/v2/center/trade/views/invoice/AddBuy.vue"),
  },
  {
    nickName: "进项发票列表",
    path: "/center/steels/invoice/buy/list",
    name: "buy/list",
    component: () => import("@/v2/center/trade/views/invoice/BuyInvoiceList.vue"),
  },
  {
    nickName: "进项发票详情",
    path: "/center/steels/invoice/buy/detail",
    name: "buy/detail",
    component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "/center/steels/invoice/buy/edit",
    name: "buy/edit",
    component: () => import("@/v2/center/trade/views/invoice/BuyDetail.vue"),
  },
  {
    nickName: "关联合同",
    path: "/center/steels/invoice/buy/link/contract",
    name: "link/contract",
    component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
  },
  {
    nickName: "新增销项发票",
    path: "/center/steels/invoice/sell/add",
    name: "invoiceSellAdd",
    component: () => import("@/v2/center/trade/views/invoice/AddSell.vue"),
  },
  {
    nickName: "销项发票列表",
    path: "/center/steels/invoice/sell/list",
    name: "sellInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/SellInvoiceList.vue"),
  },
  {
    nickName: "销项发票详情",
    path: "/center/steels/invoice/sell/detail",
    name: "sellInvoiceDetail",
    component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "销项发票编辑",
    path: "/center/steels/invoice/sell/edit",
    name: "sellInvoiceEdit",
    component: () => import("@/v2/center/trade/views/invoice/SellDetail.vue"),
  },
  {
    nickName: "关联合同",
    path: "/center/steels/invoice/sell/link/contract",
    name: "linkContractSell",
    component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
  },
  {
    nickName: "新增运费发票",
    path: "/center/steels/invoice/freight/add",
    name: "invoiceFreightAdd",
    component: () => import("@/v2/center/trade/views/invoice/AddFreight.vue"),
  },
  {
    nickName: "运费发票列表",
    path: "/center/steels/invoice/freight/list",
    name: "freightInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/FreightInvoiceList.vue"),
  },
  {
    nickName: "运费发票详情",
    path: "/center/steels/invoice/freight/detail",
    name: "freightInvoiceDetail",
    component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
  },
  {
    nickName: "异常发票记录",
    path: "/center/steels/invoice/freight/unusual/list",
    name: "unusualInvoiceList",
    component: () => import("@/v2/center/trade/views/invoice/UnusualInvoiceList.vue"),
  },
  {
    nickName: "关联合同",
    path: "/center/steels/invoice/freight/link/contract",
    name: "linkContractFreight",
    component: () => import("@/v2/center/trade/views/invoice/LinkContract.vue"),
  },
  {
    nickName: "进项发票编辑",
    path: "/center/steels/invoice/freight/edit",
    name: "freightInvoiceEdit",
    component: () => import("@/v2/center/trade/views/invoice/FreightDetail.vue"),
  },
];
