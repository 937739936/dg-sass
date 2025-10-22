export default {
	nickName: '质检管理',
	path: '/center/logisticSupervise/quality',
	meta: {
		title: '质检管理'
	},
	redirect: '/center/logisticSupervise/quality/records',
	component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
	children: [
		{
			nickName: '质检记录',
			path: '/center/logisticSupervise/quality/records',
			meta: {
				title: '质检记录'
			},
			redirect: '/center/logisticSupervise/quality/records/list',
			component: () => import('@/v2/center/logisticSupervise/views/index.vue'),
			children: [
				{
					nickName: '质检记录',
					path: '/center/logisticSupervise/quality/records/list',
					meta: {
						title: '质检记录'
					},
					component: () => import('@/v2/center/logisticSupervise/views/quality/QualityRecords.vue')
				},
				{
					nickName: '质检详情',
					path: '/center/logisticSupervise/quality/records/detail',
					meta: {
						title: '质检详情'
					},
					component: () => import('@/v2/center/logisticSupervise/views/quality/QualityRecordsDetail.vue')
				}
			]
		}
	]
};
