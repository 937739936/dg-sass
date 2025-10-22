export default {
    nickName: "额度查询",
    path: "financing/limit",
    name: "goodsTransfer",
    meta: {
        title: "额度查询",
    },
    redirect: 'financing/limit/list',
    component: () => import("@/v2/center/trade/views/index.vue"),
    children: [
        {
            nickName: "额度查询列表",
            path: "list",
            name: "goodsTransferList",
            meta:{
                keepAlive: true
            },
            component: () => import("@/v2/center/financing/views/limit/List"),
        },
        {
            nickName: "额度查询详情",
            path: "detail",
            name: "goodsTransferApply",
            meta: {
                title: "查看额度详情"
            },
            component: () => import("@/v2/center/financing/views/limit/Detail"),
        }
    ]
};
