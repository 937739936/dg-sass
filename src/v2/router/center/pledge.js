export default [
  {
    nickName: "货物管理",
    path: "pledge/portlist",
    name: "pledgePortlist",
    component: () => import("views/center/pledge/cargoManage/PortList.vue"),
  },
  {
    nickName: "货物管理详情",
    path: "pledge/portdetail",
    name: "pledgePortdetail",
    component: () => import("views/center/pledge/cargoManage/PortDetail.vue"),
  },
  {
    nickName: "货物管理出入库详情",
    path: "pledge/cargoManageInOutDetail",
    name: "substitutionListInOutDetail",
    component: () => import("views/center/pledge/cargoManage/InOutDetail"),
  },
  {
    nickName: "货物管理出入库新增",
    path: "pledge/cargoManageCreateInOut",
    name: "substitutionListCreateInOut",
    component: () => import("views/center/pledge/cargoManage/CreateInOut.vue"),
  },
  {
    nickName: "质押物管理", // 核心企业
    path: "pledge/substitutionListMAIN",
    name: "substitutionListMAIN",
    component: () => import("views/center/pledge/substitution/SubstitutionListMAIN.vue"),
  },
  {
    nickName: "质押物管理", // 金融机构
    path: "pledge/substitutionListJR",
    name: "substitutionListJR",
    component: () => import("views/center/pledge/substitution/SubstitutionListJR.vue"),
  },
  {
    nickName: "质押物管理", // 仓储机构
    path: "pledge/substitutionListCANG",
    name: "substitutionListCANG",
    component: () => import("views/center/pledge/substitution/SubstitutionListCANG.vue"),
  },
  {
    nickName: "质押物详情",
    path: "pledge/substitutionDetail",
    name: "substitutionDetail",
    component: () => import("views/center/pledge/substitution/SubstitutionDetail.vue"),
  },
  {
    nickName: "质押物置换记录", // 核心企业
    path: "pledge/substitutionListLOGMAIN",
    name: "substitutionListLOGMAIN",
    component: () => import("views/center/pledge/substitution/SubstitutionListLOGMAIN.vue"),
  },
  {
    nickName: "质押物置换记录", // 金融机构
    path: "pledge/substitutionListLOGJR",
    name: "substitutionListLOGJR",
    component: () => import("views/center/pledge/substitution/SubstitutionListLOGJR.vue"),
  },
  {
    nickName: "质押物置换记录", // 仓储机构
    path: "pledge/substitutionListLOGCANG",
    name: "substitutionListLOGCANG",
    component: () => import("views/center/pledge/substitution/SubstitutionListLOGCANG.vue"),
  },
  {
    nickName: "质押物置换申请", // 置换申请
    path: "pledge/substitutionApply",
    name: "substitutionApply",
    component: () => import("views/center/pledge/substitution/SubstitutionApply.vue"),
  },
  {
    nickName: "质押物置换申请", // 置换记录详情
    path: "pledge/substitutionLOGDetail",
    name: "substitutionLOGDetail",
    component: () => import("views/center/pledge/substitution/SubstitutionLOGDetail.vue"),
  },
  {
    nickName: "还款赎货记录", // 还款疏忽详情
    path: "pledge/substitutionListReplyMAIN",
    name: "substitutionListReplyMAIN",
    component: () => import("views/center/pledge/substitution/reply/SubstitutionListReplyMAIN.vue"),
  },

  {
    nickName: "还款赎货记录", // 还款疏忽详情
    path: "pledge/substitutionListReplyCANG",
    name: "substitutionListReplyCANG",
    component: () => import("views/center/pledge/substitution/reply/SubstitutionListReplyCANG.vue"),
  },
  {
    nickName: "还款赎货记录", // 还款疏忽详情
    path: "pledge/substitutionListReplyJR",
    name: "substitutionListReplyJR",
    component: () => import("views/center/pledge/substitution/reply/SubstitutionListReplyJR.vue"),
  },
  {
    nickName: "还款赎货详情", // 还款赎货详情
    path: "pledge/substitutionReplyDetail",
    name: "substitutionReplyDetail",
    component: () => import("views/center/pledge/substitution/reply/SubstitutionReplyDetail.vue"),
  },
  {
    nickName: "融资到期提醒", // 融资到期提醒金融
    path: "pledge/finExpireListJR",
    name: "finExpireListJR",
    component: () => import("views/center/pledge/warning/FinExpireListJR.vue"),
  },
  {
    nickName: "融资到期提醒", // 融资到期提醒核心
    path: "pledge/finExpireListMAIN",
    name: "finExpireListMAIN",
    component: () => import("views/center/pledge/warning/FinExpireListMAIN.vue"),
  },
  {
    nickName: "到期兑付", // 到期兑付
    path: "pledge/finExpireApplyD",
    name: "finExpireApplyD",
    component: () => import("views/center/pledge/warning/FinExpireApplyD.vue"),
  },
  {
    nickName: "提前还款", // 兑付申请
    path: "pledge/finExpireApplyT",
    name: "finExpireApplyT",
    component: () => import("views/center/pledge/warning/FinExpireApplyT.vue"),
  },
  {
    nickName: "补货通知", // 补货通知核心
    path: "pledge/replenishmentListMAIN",
    name: "replenishmentListMAIN",
    component: () => import("views/center/pledge/replenishment/ReplenishmentListMAIN.vue"),
  },
  {
    nickName: "补货记录", // 补货记录金融
    path: "pledge/replenishmentListJR",
    name: "replenishmentListJR",
    component: () => import("views/center/pledge/replenishment/ReplenishmentListJR.vue"),
  },
  {
    nickName: "补货记录", // 补货记录仓储
    path: "pledge/replenishmentListCANG",
    name: "replenishmentListCANG",
    component: () => import("views/center/pledge/replenishment/ReplenishmentListCANG.vue"),
  },
  {
    nickName: "补货详情", // 补货详情
    path: "pledge/replenishmentDetail",
    name: "replenishmentDetail",
    component: () => import("views/center/pledge/replenishment/ReplenishmentDetail.vue"),
  },
  {
    nickName: "补货申请", // 补货申请
    path: "pledge/replenishmentApply",
    name: "replenishmentApply",
    component: () => import("views/center/pledge/replenishment/ReplenishmentApply.vue"),
  },
  {
    nickName: "价格盯市", // 补货申请
    path: "pledge/priceDingList",
    name: "priceDingList",
    component: () => import("views/center/pledge/warning/PriceDingList.vue"),
  },
  {
    nickName: "补保证金申请", // 补保证金申请
    path: "pledge/replenishmentCashApply",
    name: "replenishmentCashApply",
    component: () => import("views/center/pledge/replenishment/ReplenishmentCashApply.vue"),
  },
  {
    nickName: "补保证金详情", // 补保证金详情
    path: "pledge/replenishmentCashDetail",
    name: "replenishmentCashDetail",
    component: () => import("views/center/pledge/replenishment/ReplenishmentCashDetail.vue"),
  },
];
