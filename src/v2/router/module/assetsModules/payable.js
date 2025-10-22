export default {
	nickName: '应付账款管理',
	path: 'assets/payable',
	meta: {
		title: '应付账款管理'
	},
	redirect: 'assets/payable',
	component: () => import('@/v2/center/assets/views/index.vue'),
	children: [
		{
			nickName: '应付账款管理',
			path: 'manage',
			meta: {
				title: '应付账款管理'
			},
			redirect: 'manage/list',
			component: () => import('@/v2/center/assets/views/index.vue'),
			children: [
				{
					nickName: '应付账款管理',
					path: 'list',
					meta: {
						title: '应付账款管理'
					},
					component: () => import('@/v2/center/assets/views/payable/manage/List.vue')
				},
				{
					nickName: '编辑应付账款',
					path: 'edit',
					meta: {
						title: '编辑应付账款',
						keepAlive: true
					},
					component: () => import('@/v2/center/assets/views/payable/manage/Edit.vue')
				},
				{
					nickName: '查看应付账款',
					path: 'detail',
					meta: {
						title: '查看应付账款'
					},
					component: () => import('@/v2/center/assets/views/payable/manage/Detail.vue')
				},
				{
					nickName: '盖章',
					path: 'stamp',
					meta: {
						title: '盖章'
					},
					component: () => import('@/v2/center/assets/views/payable/manage/sign.vue')
				}
			]
		},
		{
			nickName: '应付账款变更管理',
			path: 'change',
			meta: {
				title: '应付账款变更管理'
			},
			redirect: 'change/list',
			component: () => import('@/v2/center/assets/views/index.vue'),
			children: [
				{
					nickName: '应付账款变更管理',
					path: 'list',
					meta: {
						title: '应付账款变更管理'
					},
					component: () => import('@/v2/center/assets/views/payable/change/List.vue')
				},
				{
					nickName: '应付账款变更详情',
					path: 'detail',
					meta: {
						title: '应付账款变更详情'
					},
					component: () => import('@/v2/center/assets/views/payable/change/Detail.vue')
				},
				{
					nickName: '编辑应付账款变更',
					path: 'edit',
					meta: {
						title: '编辑应付账款变更'
					},
					component: () => import('@/v2/center/assets/views/payable/change/Edit.vue')
				}
			]
		}
	]
};
