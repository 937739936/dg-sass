export default {
	nickName: '巡库管理',
	path: '/center/logisticSupervise/inspect',
	meta: {
		title: '巡库管理'
	},
	redirect: '/center/logisticSupervise/inspect/records',
	component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
	children: [
		{
			nickName: '巡库记录',
			path: '/center/logisticSupervise/inspect/records',
			meta: {
				title: '巡库记录'
			},
			redirect: '/center/logisticSupervise/inspect/records/list',
			component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
			children: [
				{
					nickName: '巡库记录',
					path: '/center/logisticSupervise/inspect/records/list',
					meta: {
						title: '巡库记录'
					},
					component: () => import('@/v2/center/logisticSupervise/views/inspect/InspectRecords.vue')
				},
				{
					nickName: '巡库详情',
					path: '/center/logisticSupervise/inspect/records/detail',
					meta: {
						title: '巡库详情'
					},
					component: () => import('@/v2/center/logisticSupervise/views/inspect/InspectRecordsDetail.vue')
				}
			]
		}
	]
};
