export default {
  name: "piaoju",
  label: "票据中心",
  authCode: "shanmeiBillCenter",
  menuList: [
    {
      name: "票据管理",
      icon: "icon-piaojuguanli",
      authCode: "shanmeiBillCenter-manage",
      children: [
        {
          name: "票据列表",
          authCode: "shanmeiBillCenter-manage-list",
          link: "/center/counterfoil/counterfoilList",
        },
      ],
    },
  ],
};
