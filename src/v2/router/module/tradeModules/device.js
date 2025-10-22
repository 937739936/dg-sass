export default {
  nickName: "我的设备",
  path: "device",
  meta: {
    title: '我的设备',
    authCode: "dgChain:myDevice"
  },
  redirect: 'device/facility',
  component: () => import("@/v2/center/trade/views/index.vue"),
  children: [
    {
      nickName: "我的设备",
      path: "facility",
      meta: {
        title: "我的设备",
        authCode: "dgChain:myDevice:myDevice"
      },
      redirect: 'facility/list',
      component: () => import("@/v2/center/trade/views/index.vue"),
      children: [
        {
          nickName: "设备管理",
          path: "list",
          component: () => import("@/v2/center/trade/views/device/DeviceList.vue"),
        },
      ],
    },
  ]
};
