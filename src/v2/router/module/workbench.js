export default [
  {
    nickName: "我的待办",
    path: "workbench/myToDoList",
    name: "myToDoList",
    meta: {
      menuVisibility: false
    },
    component: () => import("@/v2/center/workbench/views/index"),
  },
];
