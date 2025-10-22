export default {
  nickName: "服务费管理",
  path: "financeCenter/service",
  meta: {
    title: "服务费管理" ,
  },
  redirect: 'financeCenter/service',
  component: () => import("@/v2/center/financeCenter/views/index.vue"),
  children: [
    {
      nickName: "服务费结算单",
      path: "",
      meta: {
        title: "服务费结算单",
      },
      redirect: 'myServiceFee',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
        {
          nickName: "服务费结算单列表",
          path: "myServiceFee",
          meta: {
            title: "服务费结算单列表",
          },
          component: () => import("@/v2/center/financeCenter/views/service/MyServiceFee.vue"),
        },
        //服务费优化前历史数据页面
        {
          nickName: "服务费结算单确认",
          path: "myServiceFeeConfirm",
          meta: {
            title: "服务费结算单确认",
          },
          component: () => import("@/v2/center/financeCenter/views/service/MyServiceFeeConfirm.vue"),
        },
        {
          nickName: "服务费结算单详情",
          path: "myServiceFeeDetail",
          meta: {
            title: "服务费结算单详情",
          },
          component: () => import("@/v2/center/financeCenter/views/service/MyServiceFeeDetail.vue"),
        },
        //服务费优化后数据页面
        {
          nickName: "服务费结算单确认",
          path: "myServiceFeeConfirmNew",
          meta: {
            title: "服务费结算单确认",
          },
          component: () => import("@/v2/center/financeCenter/views/service/MyServiceFeeConfirmNew.vue"),
        },
        {
          nickName: "服务费结算单详情",
          path: "myServiceFeeDetailNew",
          meta: {
            title: "服务费结算单详情",
          },
          component: () => import("@/v2/center/financeCenter/views/service/MyServiceFeeDetailNew.vue"),
        },
        {
          nickName: "服务费结算单确认盖章",
          path: "confirm/seal",
          meta: {
            title: "服务费结算单确认盖章",
          },
          component: () => import("@/v2/center/financeCenter/views/service/ConfirmMyServiceFeeDetail.vue"),
        },
        {
          nickName: "服务费协议",
          path: "serviceFeeAgreementPdf",
          component: () => import("@/v2/center/financeCenter/views/service/ServiceFeeAgreementPdf.vue"),
        },
        {
          nickName: "服务费发票管理",
          path: "invoice/list",
          meta: {
            title: "服务费发票管理",
          },
          component: () => import("@/v2/center/financeCenter/views/service/invoice/list.vue"),
        },
        {
          nickName: "服务费结算单申请作废",
          path: "cancelApply",
          name: "cancelApply",
          meta: {
            title: "服务费结算单申请作废",
          },
          component: () => import("@/v2/center/financeCenter/views/service/CancelApply.vue"),
        },
        {
          nickName: "服务费结算单作废盖章",
          path: "cancelStamp",
          name: "cancelStamp",
          meta: {
            title: "服务费结算单作废盖章",
          },
          component: () => import("@/v2/center/financeCenter/views/service/CancelStamp.vue"),
        }
      ],
    },
    {
      nickName: "服务费流水明细",
      path: "ServiceFeeFlowDetail",
      meta: {
        title: "服务费流水明细",
      },
      redirect: 'ServiceFeeFlowDetail',
      component: () => import("@/v2/center/financeCenter/views/index.vue"),
      children: [
        {
          nickName: "服务费流水明细列表",
          path: "",
          meta: {
            title: "服务费流水明细列表",
          },
          component: () => import("@/v2/center/financeCenter/views/service/ServiceFeeFlowDetail.vue"),
        },
      ],
    },
  ]
  
}