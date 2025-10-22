export default [
    // {
    //     nickName: "个人信息",
    //     path: "message/index",
    //     name: "messageIndex",
    //     component: () => import("@/v2/center/message/List.vue"),
    //     children: [

    //     ]
    // },
    {
        nickName: "个人信息",
        path: "message",
        name: 'message',
        meta: {
          title: "消息中心",
          menuVisibility: false
        },
        redirect: "message/index",
        component: () => import("@/v2/center/message/index.vue"),
        children: [
          {
            nickName: "消息中心",
            path: "index",
            name: 'message_index',
            meta: {
              title: "消息中心",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/List.vue"),
          },
          {
            nickName: "预警详情",
            path: "facilityDetail",
            name: 'message_facilityDetail',
            meta: {
              title: "预警详情",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/FacilityDetail.vue"),
          },
          {
            nickName: "预警详情",
            path: "riskControlDetail",
            meta: {
              title: "预警详情",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/RiskControlDetail.vue"),
          },
          // 陕煤物流监管-预警
          {
            nickName: "预警详情",
            path: "riskControlLogisticSuperviseDetail",
            meta: {
              title: "预警详情",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/RiskControlLogisticSuperviseDetail.vue"),
          },
          {
            nickName: "预警详情",
            path: "riskControlCertDetail",
            meta: {
              title: "预警详情",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/RiskControlCertDetail.vue"),
          },
          {
            nickName: "预警详情",
            path: "riskControlPriceDeclineDetail",
            meta: {
              title: "预警详情",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/RiskControlPriceDeclineDetail.vue"),
          },
          {
            nickName: "预警详情",
            path: "inventoryDetail",
            meta: {
                title: "预警详情",
                menuVisibility: false
            },
            component: () => import("@/v2/center/message/InventoryDetail.vue"),
          },
          {
            nickName: "预警详情",
            path: "instructDetail",
            meta: {
                title: "预警详情",
                menuVisibility: false
            },
            component: () => import("@/v2/center/message/InstructInventoryDetail.vue"),
          },
          {
            nickName: "站内信",
            path: "notice/detail",
            meta: {
              title: "站内信",
              menuVisibility: false
            },
            component: () => import("@/v2/center/message/noticeDetail.vue"),
          }
        ],
    }
];
