export default {
  nickName: "应收账款管理",
  path: "assets",
  meta: {
    title: "应收账款管理" ,
    editTitle: "应收账款管理",
  },
  redirect: 'assets',
  component: () => import("@/v2/center/assets/views/index.vue"),
  children: [
    {
      nickName: "应收账款管理",
      path: "receivable",
      meta: {
        title: "应收账款管理",
      },
      redirect: 'receivable/list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "应收账款管理",
          path: "list",
          meta: {
            title: "应收账款管理",
          },
          component: () => import("@/v2/center/assets/views/receivable/List.vue"),
        },
        {
          nickName: "应收账款详情",
          path: "detail",
          meta: {
            title: "应收账款详情",
          },
          component: () => import("@/v2/center/assets/views/receivable/Detail.vue"),
        },
        {
          nickName: "手动录入资产",
          path: "manual/edit",
          meta: {
            title: "新增应收账款",
            keepAlive: true,
          },
          component: () => import("@/v2/center/assets/views/receivable/manual/Edit.vue"),
        },
        {
          nickName: "手动录入资产详情",
          path: "manual/detail",
          meta: {
            title: "查看应收账款",
          },
          component: () => import("@/v2/center/assets/views/receivable/manual/Detail.vue"),
        },
        {
          nickName: "贷后补录",
          path: "manual/daiDetail",
          meta: {
            title: "贷后补录",
          },
          component: () => import("@/v2/center/assets/views/receivable/manual/DaiDetail.vue"),
        },
      ],
    },
    // 金融机构
    {
      nickName: "应收账款管理",
      path: "receivable/JR",
      meta: {
        title: "应收账款管理",
      },
      redirect: 'receivable/JR/list',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "应收账款管理",
          path: "list",
          meta: {
            title: "应收账款管理",
          },
          component: () => import("@/v2/center/assets/views/receivable/ListJR.vue"),
        },
        {
          nickName: "应收账款审核",
          path: "audit",
          meta: {
            title: "应收账款审核",
          },
          component: () => import("@/v2/center/assets/views/receivable/AuditJR.vue"),
        },
        {
          nickName: "查看应收账款",
          path: "detail",
          meta: {
            title: "查看应收账款",
          },
          component: () => import("@/v2/center/assets/views/receivable/DetailJR.vue"),
        },
        {
          nickName: "手动录入资产详情",
          path: "manual/detail",
          meta: {
            title: "查看应收账款",
          },
          component: () => import("@/v2/center/assets/views/receivable/manual/DetailJR.vue"),
        },
      ],
    },
    // 金融机构
    {
      nickName: "应收账款变更管理",
      path: "receivable/change",
      meta: {
        title: "应收账款变更管理",
        editTitle: "应收账款变更管理",
      },
      redirect: 'receivable/change/listJR',
      component: () => import("@/v2/center/assets/views/index.vue"),
      children: [
        {
          nickName: "应收账款变更管理",
          path: "listJR",
          meta: {
            title: "应收账款变更管理",
          },
          component: () => import("@/v2/center/assets/views/receivable/change/ListJR.vue"),
        },
        {
          nickName: "应收账款变更详情",
          path: "detailJR",
          meta: {
            title: "应收账款变更详情",
            editTitle: "应收账款变更审核",
          },
          component: () => import("@/v2/center/assets/views/receivable/change/DetailJR.vue"),
        },
      ]
    },
  ]
  
}