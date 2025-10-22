export default [
	{
		nickName: '我的收付款',
		path: 'pay',
		meta: {
			title: '我的收付款'
		},
		redirect: '/center/pay/collectRecordList',
		component: () => import('@/v2/center/trade/views/index.vue'),
		children: [
			{
				nickName: '收款记录列表',
				path: 'collect',
				meta: {
					title: '收款管理'
				},
				redirect: '/center/pay/collectRecordList',
				component: () => import('@/v2/center/trade/views/index.vue'),
				children: [
					{
						nickName: '收款记录列表',
						path: '/center/pay/collectRecordList',
						component: () => import('@/v2/center/trade/views/pay/collectManage/List.vue')
					},
					{
						nickName: '收款详情',
						path: '/center/pay/collectRecordList/detail',
						meta: {
							title: '收款详情'
						},
						component: () => import('@/v2/center/trade/views/pay/collectManage/Detail.vue')
					},
					{
						nickName: '收款确认',
						path: '/center/pay/collectRecordList/confirm',
						meta: {
							title: '收款确认'
						},
						component: () => import('@/v2/center/trade/views/pay/collectManage/Confirm.vue')
					}
				]
			}
		]
	}
];
