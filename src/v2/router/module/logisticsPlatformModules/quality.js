export default {
    nickName: "质检管理",
    path: "logisticsPlatform",
    meta: {
      title: "质检管理" ,
    },
    redirect: 'logisticsPlatform',
    component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
    children: [
      {
        nickName: "质检记录",
        path: "qualityRecords",
        meta: {
          title: "质检记录",
        },
        component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
        children: [
          {
            nickName: "质检记录",
            path: "",
            meta: {
              title: "质检记录",
            },
            component: () => import("@/v2/center/logisticsPlatform/views/quality/qualityRecords.vue"),
          },
          {
            nickName: "巡库详情",
            path: "detail",
            meta: {
              title: "巡库详情",
            },
            component: () => import("@/v2/center/logisticsPlatform/views/quality/qualityRecordsDetail.vue"),
          },
        ]
      },
      
    ],
  }