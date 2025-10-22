export default {
  nickName: "电子仓单管理",
  path: "logisticsPlatform",
  meta: {
    title: "电子仓单管理",
    editTitle: "电子仓单管理",
  },
  redirect: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list',
  component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
  children: [
    {
      nickName: "仓单协议管理",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list",
      meta: {
        title: "仓单协议管理",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单协议管理",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list",
          meta: {
            title: "仓单协议管理",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/list.vue"),
        },
        {
          nickName: "新增电子仓单管理协议",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOnlineManage",
          meta: {
            title: "新增电子仓单管理协议",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/addOnlineManage.vue"),
        },
        {
          nickName: "新增线下仓单管理协议",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOfflineManage",
          meta: {
            title: "新增线下仓单管理协议",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/addOfflineManage.vue"),
        },
        {
          nickName: "电子仓单管理协议确认",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/confirmAgree",
          meta: {
            title: "电子仓单管理协议确认",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/confirmAgree.vue"),
        },
        {
          nickName: "电子仓单管理协议盖章",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/signAgree",
          meta: {
            title: "电子仓单管理协议盖章",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/signAgree.vue"),
        },
        {
          nickName: "电子仓单协议管理详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/agreeManageDetail",
          meta: {
            title: "电子仓单协议管理详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/agreeManageDetail.vue"),
        },
        {
          nickName: "电子仓单服务协议详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/agreeServeDetail",
          meta: {
            title: "电子仓单服务协议详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/agreeServeDetail.vue"),
        },
        {
          nickName: "电子仓单服务协议确认",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/confirmServeAgree",
          meta: {
            title: "电子仓单服务协议确认",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/confirmServeAgree.vue"),
        },
        {
          nickName: "电子仓单服务协议盖章",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/signServeAgree",
          meta: {
            title: "电子仓单服务协议盖章",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptAgreement/signServeAgree.vue"),
        },
      ]
    },
    {
      nickName: "仓单开立",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list",
      meta: {
        title: "仓单开立",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单开立",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list",
          meta: {
            title: "仓单开立",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptOpen/list.vue"),
        },
        {
          nickName: "电子仓单开立详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/detail",
          meta: {
            title: "电子仓单开立详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptOpen/detail.vue"),
        },
        {
          nickName: "电子仓单开立审核",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/audit",
          meta: {
            title: "电子仓单开立审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptOpen/audit.vue"),
        },
        {
          nickName: "电子仓单开立申请",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/apply",
          meta: {
            title: "电子仓单开立申请",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptOpen/apply.vue"),
        },
        {
          nickName: "电子仓单开立盖章",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/sign",
          meta: {
            title: "电子仓单开立盖章",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptOpen/sign.vue"),
        },
      ]
    },
    {
      nickName: "仓单过户",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/list",
      meta: {
        title: "仓单过户",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单过户",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/list",
          meta: {
            title: "仓单过户",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/list.vue"),
        },
        {
          nickName: "电子仓单过户审核",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/auditList",
          meta: {
            title: "电子仓单过户审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/auditList.vue"),
        },
        {
          nickName: "电子仓单过户详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/detail",
          meta: {
            title: "电子仓单过户详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/detail.vue"),
        },
        {
          nickName: "电子仓单过户申请",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/apply",
          meta: {
            title: "电子仓单过户申请",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/apply.vue"),
        },
        {
          nickName: "电子仓单过户审核",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/audit",
          meta: {
            title: "电子仓单过户审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/audit.vue"),
        },
        {
          nickName: "电子仓单过户盖章",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/sign",
          meta: {
            title: "电子仓单过户盖章",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/sign.vue"),
        },
        {
          nickName: "电子仓单过户确认",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/confirm",
          meta: {
            title: "电子仓单过户确认",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptTransfer/confirm.vue"),
        },

      ]
    },
    {
      nickName: "仓单提货",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/list",
      meta: {
        title: "仓单提货",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单提货",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/list",
          meta: {
            title: "仓单提货",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/list"),
        },
        {
          nickName: "电子仓单提货申请",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add",
          meta: {
            title: "电子仓单提货申请",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/add"),
        },
        {
          nickName: "无仓单提货申请",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add",
          meta: {
            title: "无仓单提货申请",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/add"),
        },
        {
          nickName: "电子仓单提货申请审核",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/audit",
          meta: {
            title: "电子仓单提货申请审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/audit"),
        },
        {
          nickName: "电子仓单提货详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/detail",
          meta: {
            title: "电子仓单提货详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/detail.vue"),
        },

      ]
    },
    {
      nickName: "仓单查询",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/list",
      meta: {
        title: "仓单查询",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单查询列表",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/list",
          meta: {
            title: "仓单查询列表",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptQuery/list.vue"),
        },
        {
          nickName: "电子仓单详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/detail",
          meta: {
            title: "电子仓单详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptQuery/detail.vue"),
        },
      ]
    },
    {
      nickName: "仓单提货审核",
      path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/auditList",
      meta: {
        title: "仓单提货审核",
      },
      component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
      children: [
        {
          nickName: "仓单提货审核",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/auditList",
          meta: {
            title: "仓单提货审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/list/warehouseAuditList.vue"),
        },
        {
          nickName: "电子仓单提货审核",
          path: "/center/logisticsPlatform/warehouseReceipt/delivery/warehouseAudit",
          meta: {
            title: "电子仓单提货审核",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/audit/warehouseAudit.vue"),
        },
        {
          nickName: "电子仓单盖章",
          path: "/center/logisticsPlatform/warehouseReceipt/delivery/sign",
          meta: {
            title: "电子仓单盖章",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/sign.vue"),
        },
        {
          nickName: "电子仓单提货详情",
          path: "/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/auditDetail",
          meta: {
            title: "电子仓单提货详情",
          },
          component: () => import("@/v2/center/logisticsPlatform/views/warehouseReceipt/warehouseReceiptDelivery/detail.vue"),
        },
      ]
    },



  ],
}