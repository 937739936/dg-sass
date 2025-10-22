/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */

const files = require.context("./center", false, /\.js$/);
const centerModules = [];
files.keys().forEach((key) => {
  centerModules.push(...files(key).default);
});

import monitoringv2 from "@/v2/router/module/monitoring";
import storagev2 from "@/v2/router/module/storage";
import personv2 from "@/v2/router/module/person";
import financeCenterV2 from "@/v2/router/module/financeCenter";
import steelStorage from "@/v2/router/module/steelStorage";
import invoiceTools from "@/v2/router/module/invoiceTools";
import workbenchv2 from "@/v2/router/module/workbench";
import logisticsPlatform from "@/v2/router/module/logisticsPlatform";
import assetsv2 from "@/v2/router/module/assets";
import counterfoilv2 from "@/v2/router/module/counterfoil";
import financingv2 from "@/v2/router/module/financing";
import quota from "@/v2/router/module/quota";

import steelsV2 from "@/v2/router/module/steels";

import tradeRouterV2 from "@/v2/router/module/trade";
import message from "@/v2/router/module/message";

// 矿方路由文件
import tradeCoalOld from "@/v2/router/module/tradeOld/coalRrouter";
import tradeContractOld from "@/v2/router/module/tradeOld/contract";
import tradeInvoiceOld from "@/v2/router/module/tradeOld/invoice";
import tradePayOld from "@/v2/router/module/tradeOld/pay";

// 运输管理路由
import logisticSupervise from "@/v2/router/module/logisticSupervise";





const routesList = [
  ...centerModules,
  ...tradeRouterV2,
  ...monitoringv2,
  ...storagev2,
  personv2,
  ...steelStorage,
  ...workbenchv2,
  ...financeCenterV2,
  ...logisticsPlatform,
  ...invoiceTools,
  ...logisticsPlatform,
  ...assetsv2,
  ...counterfoilv2,
  ...financingv2,
  ...steelsV2,
  // 矿方路由
  ...tradeContractOld,
  ...tradeCoalOld,
  ...tradePayOld,
  ...tradeInvoiceOld,
  ...message,
  quota,
  // 运输管理路由
  ...logisticSupervise,
];

export default {
  path: "/center",
  redirect: "/center/account/person/info",
  meta: {
    title: "首页",
  },
  component: () => import("layout/Center.vue"),
  children: routesList,
};
