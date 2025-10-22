"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: 'financing',
  authCode: 'finance',
  label: '融资管理',
  menuList: [{
    name: '额度管理',
    icon: require('imgs/menu/edcx.png'),
    authCode: 'finance:creditLine',
    link: '/center/financing/limit/list',
    children: [{
      name: '额度查询',
      authCode: 'finance:creditLine',
      link: '/center/financing/limit/list'
    }]
  }, {
    name: '融资业务管理',
    authCode: 'finance:finance',
    icon: require('imgs/menu/rongziguanli.png'),
    children: [// 融资改版
    {
      name: '应收融资',
      link: '/center/financing/financingList'
    }, {
      name: '预付融资',
      authCode: 'finance:finance:pre',
      link: '/center/financing/financingAdvanceList'
    }, {
      name: '货押融资',
      authCode: 'finance:finance:pledge',
      link: '/center/financing/financingPledgeListMAINLOG'
    }, // 除了金融机构
    {
      name: '票据融资',
      authCode: 'finance:finance:bill',
      link: '/center/financing/financingCounterfoilListLOG'
    }, // 金融机构的
    {
      name: '票据融资',
      authCode: 'finance:audit:bill',
      link: '/center/financing/financingCounterfoilListJR'
    }]
  }, {
    name: '放还款管理',
    //(供应商)
    authCode: 'finance:repayS',
    icon: 'icon-fanghuankuanguanli',
    children: [{
      name: '应收放还款',
      //(供应商)
      authCode: 'finance:repayS',
      // link: "/center/loan/LoanList",
      link: '/center/loan/LoanListMAIN'
    }, {
      name: '预付放还款',
      //(供应商)
      authCode: 'finance:repay:pre',
      link: '/center/loan/loanAdvanceListMAIN'
    }]
  }, {
    name: '放还款管理',
    authCode: 'finance:repay',
    icon: 'icon-fanghuankuanguanli',
    children: [{
      name: '应收放还款',
      //(核心企业)
      authCode: 'finance:repayC',
      link: '/center/loan/LoanListMAIN'
    }, {
      name: '预付放还款',
      //(核心企业)
      authCode: 'finance:repay:pre',
      link: '/center/loan/loanAdvanceListMAIN'
    }, {
      name: '货押放还款',
      //(核心企业)
      authCode: 'finance:repay:pledge',
      link: '/center/loan/loanPledgeList'
    }, {
      name: '应收放还款',
      //(金融机构)
      authCode: 'finance:repayB',
      link: '/center/loan/LoanListJR'
    }, {
      name: '票据放还款',
      //(核心企业)
      authCode: 'finance:repay:bill',
      link: '/center/loan/LoanListCounterfoilMAIN'
    }]
  }, {
    name: '放还款明细',
    //(金融机构)
    authCode: 'finance:repayDetailB',
    icon: 'icon-fanghuankuanchaxun',
    children: [{
      name: '放还款明细',
      //(金融机构)
      authCode: 'finance:repayDetailB',
      link: '/center/loan/LoanDetailList'
    }]
  }, {
    name: '台账管理',
    icon: require('imgs/menu/ledger.png'),
    authCode: 'finance:ledger',
    // authCode: 'finance:creditLine',
    link: '/center/financing/ledger/list',
    children: [{
      name: '台账管理',
      authCode: 'finance:ledger:ledger',
      // authCode: 'finance:creditLine',
      link: '/center/financing/ledger/list'
    }]
  }, {
    name: '贷后管理',
    icon: require('imgs/menu/daihou.png'),
    authCode: 'finance:afterLoan',
    link: '/center/financing/loanClose/list',
    children: [{
      name: '贷后结清管理',
      authCode: 'finance:afterLoan:settleAgree',
      link: '/center/financing/loanClose/list'
    }]
  }]
};
exports["default"] = _default;