/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
  name: "pledge",
  authCode: "goods",
  label: "货物管理",
  menuList: [
    {
      name: "货物管理",
      authCode: "goods:goods",
      icon: "icon-huozhuanguanli",
      children: [
        {
          name: "货物管理",
          authCode: "goods:goods",
          link: "/center/pledge/portlist",
        },
      ],
    },

    {
      name: "质押物管理",
      authCode: "goods:pledge",
      icon: "icon-zhiyawuguanli",
      children: [
        {
          name: "质押物管理", // 核心企业
          authCode: "goods:pledge:manage:coreCompany",
          link: "/center/pledge/substitutionListMAIN",
        },
        {
          name: "质押物管理", // 金融端
          authCode: "goods:pledge:manage:financial",
          link: "/center/pledge/substitutionListJR",
        },
        {
          name: "质押物管理", // 仓储端
          authCode: "goods:pledge:manage:warehouse",
          link: "/center/pledge/substitutionListCANG",
        },
        {
          name: "质押物置换记录", // 核心企业
          authCode: "goods:pledge:replace:coreCompany",
          link: "/center/pledge/substitutionListLOGMAIN",
        },
        {
          name: "质押物置换记录", // 金融
          authCode: "goods:pledge:replace:financial",
          link: "/center/pledge/substitutionListLOGJR",
        },
        {
          name: "质押物置换记录", // 仓储
          authCode: "goods:pledge:replace:warehouse",
          link: "/center/pledge/substitutionListLOGCANG",
        },
        {
          name: "还款赎货记录", // 核心企业
          authCode: "goods:pledge:redeem:coreCompany",
          link: "/center/pledge/substitutionListReplyMAIN",
        },
        {
          name: "还款赎货记录", // 仓储
          authCode: "goods:pledge:redeem:warehouse",
          link: "/center/pledge/substitutionListReplyCANG",
        },
        {
          name: "还款赎货记录", // 金融
          authCode: "goods:pledge:redeem:financial",
          link: "/center/pledge/substitutionListReplyJR",
        },
      ],
    },
    {
      name: "预警管理",
      authCode: "goods:warning",
      icon: "icon-yujingguanli",
      children: [
        {
          name: "融资到期提醒", // 金融
          authCode: "goods:warning:remind:financial",
          link: "/center/pledge/finExpireListJR",
        },

        {
          name: "融资到期提醒", // 核心企业
          authCode: "goods:warning:remind:coreCompany",
          link: "/center/pledge/finExpireListMAIN",
        },
        {
          name: "补货通知", // 核心企业
          authCode: "goods:warning:replenishment:coreCompany",
          link: "/center/pledge/replenishmentListMAIN",
        },
        {
          name: "补货记录", // 金融机构
          authCode: "goods:warning:replenishment:financial",
          link: "/center/pledge/replenishmentListJR",
        },
        {
          name: "补货记录", // 仓储
          authCode: "goods:warning:replenishment:warehouse",
          link: "/center/pledge/replenishmentListCANG",
        },
        {
          name: "价格盯市", //
          authCode: "goods:warning:price",
          link: "/center/pledge/priceDingList",
        },
      ],
    },
  ],
};
