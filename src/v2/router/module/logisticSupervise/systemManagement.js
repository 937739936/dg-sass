export default {
	nickName: '系统管理',
	path: '/center/logisticSupervise/systemManagement',
	meta: {
		title: '系统管理',
		editTitle: '系统管理'
	},
	redirect: '/center/logisticSupervise/systemManagement/coalConfig',
	component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
	children: [
		{
			nickName: '煤种配置',
			path: '/center/logisticSupervise/systemManagement/coalConfig',
			meta: {
				title: '煤种配置'
			},
			redirect: '/center/logisticSupervise/systemManagement/coalConfig/list',
			component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
			children: [
				{
					nickName: '煤种配置',
					path: '/center/logisticSupervise/systemManagement/coalConfig/list',
					meta: {
						title: '煤种配置'
					},
					component: () => import('@/v2/center/logisticSupervise/views/base/coalConfig.vue')
				}
			]
		},
		,
		{
			nickName: '仓房管理',
			path: '/center/logisticSupervise/systemManagement/warehouse',
			meta: {
				title: '仓房管理'
			},
			redirect: '/center/logisticSupervise/systemManagement/warehouse/list',
			component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
			children: [
				{
					nickName: '仓房管理列表',
					path: '/center/logisticSupervise/systemManagement/warehouse/list',
					meta: {
						title: '仓房管理'
					},
					component: () => import('@/v2/center/logisticSupervise/views/base/warehouse.vue')
				},
				{
					nickName: '货位管理',
					path: '/center/logisticSupervise/systemManagement/warehouse/goodsAllocation',
					meta: {
						title: '货位管理'
					},
					component: () => import('@/v2/center/logisticSupervise/views/base/goodsAllocation.vue')
				}
			]
		}
	]
};
