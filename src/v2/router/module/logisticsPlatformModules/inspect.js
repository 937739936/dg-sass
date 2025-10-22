export default {
    nickName: "巡库管理",
    path: "logisticsPlatform",
    meta: {
      title: "巡库管理" ,
    },
    redirect: 'logisticsPlatform',
    component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
    children: [
      {
        nickName: "巡库记录",
        path: "inspectRecords",
        meta: {
          title: "巡库记录",
        },
        component: () => import("@/v2/center/logisticsPlatform/views/index.vue"),
        children: [
          {
            nickName: "巡库记录",
            path: "",
            meta: {
              title: "巡库记录",
            },
            component: () => import("@/v2/center/logisticsPlatform/views/inspect/InspectRecords.vue"),
          },
          {
            nickName: "巡库详情",
            path: "detail",
            meta: {
              title: "巡库详情",
            },
            component: () => import("@/v2/center/logisticsPlatform/views/inspect/InspectRecordsDetail.vue"),
          },
        ]
      },
      
    ],
  }