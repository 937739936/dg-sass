export default {
  nickName: "合同管理",
  path: "contract",
  meta: {
    title: '合同管理',
    authCode: "dgChain"
  },
  redirect: 'contract/buy',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "采购合同",
      path: "buy",
      meta: {
        title: "采购合同",
      },
      redirect: 'buy/list',
      component: () => import("@/v2/center/trade/views/contract/index.vue"),
      children: [
        {
          nickName: "采购合同列表",
          path: "list",
          meta: {
            title: "采购合同列表",
          },
          component: () => import("@/v2/center/trade/views/contract/BuyContractList.vue"),
        },
        {
          nickName: "新增电子采购合同",
          path: "online/add/step1",
          meta: {
            title: "新增电子采购合同",
          },
          component: () => import("@/v2/center/trade/views/contract/online/AddFirst.vue"),
        },
        {
          nickName: "新增电子采购合同",
          path: "online/add/step2",
          meta: {
            title: "新增电子采购合同",
            keepAlive: false, // 需要被缓存
          },
          component: () => import("@/v2/center/trade/views/contract/online/AddTwo.vue"),
        },
        {
          nickName: "补录线下合同新增",
          path: "offline/add",
          meta: {
            title: "新增线下采购合同",
            keepAlive: true, // 需要被缓存
          },
          component: () => import("@/v2/center/trade/views/contract/offline/Add.vue"),
        },
        {
          nickName: "电子采购合同详情",
          path: "online/detail",
          meta: {
            title: "电子采购合同详情",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Detail.vue"),
        },
        {
          nickName: "补录合同详情",
          path: "offline/detail",
          meta: {
            title: "线下采购合同详情",
          },
          component: () => import("@/v2/center/trade/views/contract/offline/Detail.vue"),
        },
        {
          nickName: "电子采购合同盖章",
          path: "stamp",
          meta: {
            title: "电子采购合同盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Stamp.vue"),
        },
        {
          nickName: "电子采购合同确认盖章",
          path: "confirm/stamp",
          meta: {
            title: "电子采购合同确认盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/ConfirmStamp.vue"),
        },
        {
          nickName: "电子采购合同确认",
          path: "confirm/contract",
          meta: {
            title: "电子采购合同确认",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Confirm.vue"),
        },
        {
          nickName: "合同终止",
          path: "stop",
          meta: {
            title: "发起合同终止",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Stop.vue"),
        },
        {
          nickName: "盖章终止销售/采购合同",
          path: "stamp/stop",
          meta: {
            title: "盖章终止销售/采购合同",
          },
        component: () => import("@/v2/center/trade/views/contract/online/StopStamp.vue"),
        },
        {
          nickName: "合同终止确认",
          path: "confirm/stop",
          meta: {
            title: "合同终止确认",
          },
          component: () => import("@/v2/center/trade/views/contract/online/StopConfirmStamp.vue"),
        },
        {
          nickName: "补协查看pdf",
          path: "agreement/pdf/detail",
          meta: {
            title: "查看电子采购合同",
          },
          component: () => import("@/v2/center/trade/views/contract/online/FilesDetail.vue"),
        },
        {
          nickName: "合同终止协议盖章",
          path: "termination/stamp",
          meta: {
            title: "合同终止协议盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/TerminationAgreementStamp.vue"),
        }
      ],
    },
    {
      nickName: "销售合同",
      path: "sell",
      meta: {
        title: "销售合同",
      },
      redirect: 'sell/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "销售合同列表",
          path: "list",
          meta: {
            title: "销售合同列表",
          },
          component: () => import("@/v2/center/trade/views/contract/SellContractList.vue"),
        },
        {
          nickName: "新增电子销售合同",
          path: "online/add/step1",
          meta: {
            title: "新增电子销售合同",
          },
          component: () => import("@/v2/center/trade/views/contract/online/AddFirst.vue"),
        },
        {
          nickName: "新增电子销售合同",
          path: "online/add/step2",
          meta: {
            title: "新增电子销售合同",
            keepAlive: false, // 需要被缓存
          },
          component: () => import("@/v2/center/trade/views/contract/online/AddTwo.vue"),
        },
        {
          nickName: "补录线下合同新增",
          path: "offline/add",
          meta: {
            title: "新增线下销售合同",
            keepAlive: true, // 需要被缓存
          },
          component: () => import("@/v2/center/trade/views/contract/offline/Add.vue"),
        },
        {
          nickName: "电子销售合同详情",
          path: "online/detail",
          meta: {
            title: "电子销售合同详情",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Detail.vue"),
        },
        {
          nickName: "补录合同详情",
          path: "offline/detail",
          meta: {
            title: "线下销售合同详情",
          },
          component: () => import("@/v2/center/trade/views/contract/offline/Detail.vue"),
        },
        {
          nickName: "电子销售合同盖章",
          path: "stamp",
          meta: {
            title: "电子销售合同盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Stamp.vue"),
        },
        {
          nickName: "电子销售合同确认盖章",
          path: "confirm/stamp",
          meta: {
            title: "电子销售合同确认盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/ConfirmStamp.vue"),
        },
        {
          nickName: "电子销售合同确认",
          path: "confirm/contract",
          meta: {
            title: "电子销售合同确认",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Confirm.vue"),
        },
        {
          nickName: "合同终止",
          path: "stop",
          meta: {
            title: "合同终止",
          },
          component: () => import("@/v2/center/trade/views/contract/online/Stop.vue"),
        },
        {
          nickName: "盖章终止销售/采购合同",
          path: "stamp/stop",
          meta: {
            title: "盖章终止销售/采购合同",
          },
          component: () => import("@/v2/center/trade/views/contract/online/StopStamp.vue"),
        },
        {
          nickName: "合同终止确认/采购合同",
          path: "confirm/stop",
          meta: {
            title: "合同终止确认",
          },
          component: () => import("@/v2/center/trade/views/contract/online/StopConfirmStamp.vue"),
        },
        {
          nickName: "补协查看pdf",
          path: "agreement/pdf/detail",
          meta: {
            title: "查看电子销售合同",
          },
          component: () => import("@/v2/center/trade/views/contract/online/FilesDetail.vue"),
        },
        {
          nickName: "合同终止协议盖章",
          path: "termination/stamp",
          meta: {
            title: "合同终止协议盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/online/TerminationAgreementStamp.vue"),
        }
      ],
    },
    {
      nickName: "运输合同",
      path: "transport",
      meta: {
        title: "运输合同",
      },
      redirect: 'transport/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "运输合同管理",
          path: "list",
          meta: {
            title: "运输合同管理",
          },
          component: () => import("@/v2/center/trade/views/contract/transport/list.vue"),
        },
        {
          nickName: "新增线下运输合同",
          path: "add",
          meta: {
            title: "新增线下运输合同",
          },
          component: () => import("@/v2/center/trade/views/contract/transport/add.vue"),
        },
        {
          nickName: "线下运输合同详情",
          path: "detail",
          meta: {
            title: "线下运输合同详情",
          },
          component: () => import("@/v2/center/trade/views/contract/transport/detail.vue"),
        },
      ]
    },
    {
      nickName: "补充协议",
      path: "agreement",
      meta: {
        title: "补充协议",
      },
      redirect: 'agreement/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "补充协议管理",
          path: "list",
          meta: {
            title: "补充协议管理",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/List.vue"),
        },
        {
          nickName: "新增电子补充协议",
          path: "add",
          meta: {
            title: "新增电子补充协议",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Creat.vue"),
        },
        {
          nickName: "电子补充协议详情",
          path: "detail",
          meta: {
            title: "电子补充协议详情",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Detail.vue"),
        },
        {
          nickName: "线下补充协议详情",
          path: "downSuppleDetail",
          name: "downSuppleAgreementDetail",
          meta: {
            title: "线下补充协议详情",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/downSuppleDetail.vue"),
        },
        {
          nickName: "补充协议详确认盖章",
          path: "confirmStamp",
          name: "suppleAgreementConfirmStamp",
          meta: {
            title: "电子补充协议确认",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/ConfirmStamp.vue"),
        },
        {
          nickName: "补充协议PDF",
          path: "pdf",
          meta: {
            title: "补充协议PDF",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/SuppleAgreementPdf.vue"),
        },
        {
          nickName: "补充协议盖章",
          path: "stamp",
          meta: {
            title: "电子补充协议盖章",
          },
          component: () => import("@/v2/center/trade/views/contract/suppleAgreement/Sign.vue"),
        },
      ],
    },
  ],
};
