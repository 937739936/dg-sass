export default {
	nickName: '发运管理',
	path: '/center/logisticSupervise/receive',
	meta: {
		title: '发运管理'
	},
	redirect: '/center/logisticSupervise/receive/send',
	component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
	children: [
		{
			nickName: '发运记录',
			path: '/center/logisticSupervise/receive/send',
			meta: {
				title: '发运记录'
			},
			redirect: '/center/logisticSupervise/receive/send/list',
			component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
			children: [
				{
					nickName: '发运记录',
					path: '/center/logisticSupervise/receive/send/list',
					component: () => import('@/v2/center/logisticSupervise/views/receive/ReleaseRecordList.vue')
				},
				{
					nickName: '填写发货信息',
					path: '/center/logisticSupervise/receive/send/apply',
					meta: {
						title: '填写发货信息'
					},
					component: () => import('@/v2/center/logisticSupervise/views/receive/Apply.vue')
				},
				{
					nickName: '发运信息详情',
					path: '/center/logisticSupervise/receive/send/detail',
					meta: {
						title: '发运信息详情'
					},
					component: () => import('@/v2/center/logisticSupervise/views/receive/AcceptDetail.vue')
				},
				{
					nickName: '填写收货信息',
					path: '/center/logisticSupervise/receive/send/confirm',
					meta: {
						title: '填写收货信息'
					},
					component: () => import('@/v2/center/logisticSupervise/views/receive/AcceptConfirm.vue')
				}
			]
		},
		{
			nickName: '物流轨迹',
			path: '/center/logisticSupervise/receive/trajectory',
			meta: {
				title: '物流轨迹'
			},
			redirect: '/center/logisticSupervise/receive/trajectory/list',
			component: () => import('@/v2/center/trade/views/index.vue'),
			children: [
				{
					nickName: '物流轨迹',
					path: '/center/logisticSupervise/receive/trajectory/list',
					component: () => import('@/v2/center/logisticSupervise/views/receive/TrajectoryList.vue')
				}
			]
		}
	]
};
