/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default [
  {
    nickName: "帮助中心",
    path: "help",
    name: "help",
    meta: {
      menuVisibility: false,
      headerVisibility: false
    },
    component: () => import("@/v2/views/help/index.vue"),
  },
  {
    nickName: "帮助中心-分类",
    path: "help/classify",
    name: "helpClassify",
    meta: {
      menuVisibility: false,
      headerVisibility: false
    },
    component: () => import("@/v2/views/help/classifyList.vue"),
  },
  {
    nickName: "帮助中心-未认证",
    path: "help/auth",
    name: "helpAuth",
    meta: {
      menuVisibility: false,
      headerVisibility: false
    },
    component: () => import("@/v2/views/help/auth.vue"),
  }
];
