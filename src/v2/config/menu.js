/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */

import { filterMenuVisiable } from "@/v2/utils/checkAuth";

// import monitoring from "@/config/menu/monitoring";
import pledge from "@/config/menu/pledge";
// import assets from "@/config/menu/assets";
// import financing from "@/config/menu/financing";
// import storageCenter from "@/config/menu/storage";
// import steel from "@/config/menu/steel";
import xiaoxi from "@/config/menu/xiaoxi";
import meikuang from "@/config/menu/meikuang";

// import finance from "@/config/menu/finance";
// import monitoring from "@/config/menu/monitoring";
// import steel from "@/config/menu/steel";
// import zhanghu from "@/config/menu/zhanghu";

import workbenchv2 from "@/v2/center/workbench/menu/index";
// import tradev2 from "@/v2/center/trade/menu/index";


import monitoringv2 from "@/v2/center/monitoring/menu/index";
import assetsv2 from "@/v2/center/assets/menu/index";
import financingv2 from "@/v2/center/financing/menu/index";
// import steelsv2 from "@/v2/center/steels/menu/index";
// import financingv2 from "@/v2/center/financing/menu/index";
import steelsv2 from "@/v2/center/steels/menu/index";
import storagev2 from "@/v2/center/storage/menu/index";
import personv2 from "@/v2/center/person/menu/index";
import financeCenter2 from "@/v2/center/financeCenter/menu/index";
import steelStorage from "@/v2/center/steelStorage/menu";
import invoiceTools from "@/v2/center/invoiceTools/menu";
import logisticsPlatform from "@/v2/center/logisticsPlatform/menu";
import counterfoilv2 from "@/v2/center/counterfoil/menu/index";
import tradev2 from "@/v2/center/trade/menu/index";
import logisticSupervise from "@/v2/center/logisticSupervise/menu/index";



/**
 * autoCode：后台权限点控制
 * visible：前端自定义逻辑控制
 */
const getMenuMap = () => {
  const menuMap = [
    workbenchv2,
    // 供应链
    tradev2,
    // gyl(state),
    // monitoring(state),
    monitoringv2,
    // 货物管理
    pledge,
    // 资产管理
    assetsv2,
    // 融资管理
    financingv2,
    //仓储中心
    // storageCenter,
    //煤矿的数字供应链导航菜单
    meikuang,
    // 钢材对应的数字供应链导航菜单
    // steel,
    storagev2,
    // 物流运输管理
    logisticSupervise,
    // zhanghu,
    personv2,
    xiaoxi,
    // 财务中心
    // finance,
    financeCenter2,
    // 钢材仓储中心
    steelStorage,
    // 物产发票管家
    invoiceTools,
    // 钢材
    steelsv2,
    //物流站台
    logisticsPlatform,
    // 票据中心
    counterfoilv2,

  ];

  return menuMap;
};

export default {
  // 菜单 对象结构 为大标题使用
  VUEX_GE_CENTERMENUSMAP() {
    let menuMap = getMenuMap();
    let list = [];
    menuMap.forEach((item) => {
      if (!item.hiddenOnTopHeader) {
        let menuList = filterMenuVisiable(item.menuList);
        list.push({
          ...item,
          menuList: menuList,
        });
      }
    });
    return list;
  },
};
