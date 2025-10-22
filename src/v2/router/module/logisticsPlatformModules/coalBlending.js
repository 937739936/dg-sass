export default {
	nickName: '配煤管理',
	path: 'logisticsPlatform',
	meta: {
		title: '配煤管理'
	},
	redirect: 'logisticsPlatform/coalBlending',
	component: () => import('@/v2/center/logisticsPlatform/views/index.vue'),
	children: [
		{
			nickName: '配煤管理',
			path: 'coalBlending',
			meta: {
				title: '配煤管理'
			},
			redirect: 'coalBlending/list',
			component: () => import('@/v2/center/logisticsPlatform/views/index.vue'),
			children: [
				{
					nickName: '配煤记录',
					path: 'list',
					meta: {
						title: '配煤记录'
					},
					component: () => import('@/v2/center/logisticsPlatform/views/coalBlending/List.vue')
				},
				{
					nickName: '配煤详情',
					path: 'detail',
					meta: {
						title: '配煤详情'
					},
					component: () => import('@/v2/center/logisticsPlatform/views/coalBlending/Detail.vue')
				},
				{
					nickName: '新增配煤记录',
					path: 'add',
					meta: {
						title: '新增配煤记录'
					},
					component: () => import('@/v2/center/logisticsPlatform/views/coalBlending/Add.vue')
				},
				{
					nickName: '编辑配煤记录',
					path: 'edit',
					meta: {
						title: '编辑配煤记录'
					},
					component: () => import('@/v2/center/logisticsPlatform/views/coalBlending/Add.vue')
				}
			]
		}
	]
};
