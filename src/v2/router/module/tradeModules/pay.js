export default {
	nickName: '收付款管理',
	path: 'fund',
	meta: {
		title: '收付款管理',
		editTitle: '收付款管理',
		authCode: 'dgChain'
	},
	redirect: 'fund/pay',
	component: () => import('@/v2/center/trade/views/index.vue'),
	children: [
		{
			nickName: '付款管理',
			path: 'pay',
			meta: {
				title: '付款管理'
			},
			component: () => import('@/v2/center/trade/views/index.vue'),
			redirect: 'pay/record/list',
			children: [
				{
					nickName: '付款管理列表',
					path: 'record/list',
					component: () => import('@/v2/center/trade/views/pay/payManage/List.vue')
				},
				{
					nickName: '新增付款',
					path: 'add',
					meta: {
						title: '新增付款'
					},
					component: () => import('@/v2/center/trade/views/pay/payManage/Add.vue')
				},
				{
					nickName: '运输合同新增付款',
					path: 'addTrans',
					meta: {
						title: '新增付款'
					},
					component: () => import('@/v2/center/trade/views/pay/payManage/AddTrans.vue')
				},
				{
					nickName: '付款详情',
					path: 'record/detail',
					meta: {
						title: '付款详情'
					},
					component: () => import('@/v2/center/trade/views/pay/payManage/Detail.vue')
				},
				{
					nickName: '追加付款第一步',
					path: 'additional/payment/oneStep',
					component: () => import('@/v2/center/trade/views/pay/additionalPayment/OneStep.vue')
				},
				{
					nickName: '追加付款第二步',
					path: 'additional/payment/twoStep',
					component: () => import('@/v2/center/trade/views/pay/additionalPayment/TwoStep.vue')
				},
				{
					nickName: '追加付款第三步',
					path: 'additional/payment/threeStep',
					component: () => import('@/v2/center/trade/views/pay/additionalPayment/ThreeStep.vue')
				}
			]
		},
		// {
		// 	nickName: '付款管理old',
		// 	path: 'pay',
		// 	meta: {
		// 		title: '付款管理old'
		// 	},
		// 	component: () => import('@/v2/center/trade/views/index.vue'),
		// 	redirect: 'pay/record/list',
		// 	children: [
		// 		{
		// 			nickName: '付款申请列表',
		// 			path: 'list',
		// 			component: () => import('@/v2/center/trade/views/pay/PayApplyList.vue')
		// 		},
		// 		{
		// 			nickName: '付款申请',
		// 			path: 'record/payApply',
		// 			component: () => import('@/v2/center/trade/views/pay/PayApply.vue')
		// 		},
		// 		{
		// 			nickName: '付款申请',
		// 			path: 'record/payApply/transport',
		// 			component: () => import('@/v2/center/trade/views/pay/PayApplyTrans.vue')
		// 		},
		// 		{
		// 			nickName: '付款成功',
		// 			path: 'success',
		// 			component: () => import('@/v2/center/trade/views/pay/PaySuccess.vue')
		// 		},
		// 		{
		// 			nickName: '付款记录列表',
		// 			path: 'record/list',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordList.vue')
		// 		},
		// 		{
		// 			nickName: '付款记录详情',
		// 			path: 'record/detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordDetail.vue')
		// 		},
		// 		{
		// 			nickName: '运输合同付款记录详情',
		// 			path: 'record/trans/detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordTransDetail.vue')
		// 		},
		// 		{
		// 			nickName: '付款确认',
		// 			path: 'confirm',
		// 			component: () => import('@/v2/center/trade/views/pay/PaymentConfirm.vue')
		// 		},
		// 		{
		// 			nickName: '我的应付列表',
		// 			path: 'payable/list',
		// 			component: () => import('@/v2/center/trade/views/pay/PayableList.vue')
		// 		},
		// 		{
		// 			nickName: '我的应付应收详情',
		// 			path: 'payable/detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayableDetail.vue')
		// 		},
		// 		{
		// 			nickName: '追加付款第一步',
		// 			path: 'additional/payment/oneStep',
		// 			component: () => import('@/v2/center/trade/views/pay/additionalPayment/OneStep.vue')
		// 		},
		// 		{
		// 			nickName: '追加付款第二步',
		// 			path: 'additional/payment/twoStep',
		// 			component: () => import('@/v2/center/trade/views/pay/additionalPayment/TwoStep.vue')
		// 		},
		// 		{
		// 			nickName: '追加付款第三步',
		// 			path: 'additional/payment/threeStep',
		// 			component: () => import('@/v2/center/trade/views/pay/additionalPayment/ThreeStep.vue')
		// 		}
		// 	]
		// },
		{
			nickName: '收款管理',
			path: 'collect',
			meta: {
				title: '收款管理'
			},
			redirect: 'collect/record/list',
			component: () => import('@/v2/center/trade/views/index.vue'),
			children: [
				{
					nickName: '收款管理列表',
					path: 'record/list',
					component: () => import('@/v2/center/trade/views/pay/collectManage/List.vue')
				},
				{
					nickName: '收款详情',
					path: 'detail',
					meta: {
						title: '收款详情'
					},
					component: () => import('@/v2/center/trade/views/pay/collectManage/Detail.vue')
				},
				{
					nickName: '收款确认',
					path: 'confirm',
					meta: {
						title: '收款确认'
					},
					component: () => import('@/v2/center/trade/views/pay/collectManage/Confirm.vue')
				}
			]
		},
		// {
		// 	nickName: '收款管理old',
		// 	path: 'collect',
		// 	meta: {
		// 		title: '收款管理'
		// 	},
		// 	redirect: 'collect/record/list',
		// 	component: () => import('@/v2/center/trade/views/index.vue'),
		// 	children: [
		// 		{
		// 			nickName: '收款成功',
		// 			path: 'success',
		// 			component: () => import('@/v2/center/trade/views/pay/CollectSuccess.vue')
		// 		},
		// 		{
		// 			nickName: '收款确认',
		// 			path: 'confirm',
		// 			component: () => import('@/v2/center/trade/views/pay/CollectConfirm.vue')
		// 		},
		// 		{
		// 			nickName: '运输合同收款确认',
		// 			path: 'confirm/trans',
		// 			component: () => import('@/v2/center/trade/views/pay/CollectConfirmTrans.vue')
		// 		},
		// 		{
		// 			nickName: '收款记录列表',
		// 			path: 'record/list',
		// 			component: () => import('@/v2/center/trade/views/pay/CollectRecordList.vue')
		// 		},
		// 		{
		// 			nickName: '我的应收列表',
		// 			path: 'receivable/list',
		// 			component: () => import('@/v2/center/trade/views/pay/ReceivableList.vue')
		// 		},
		// 		{
		// 			nickName: '我的应付应收详情',
		// 			path: 'payable/detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayableDetail.vue')
		// 		},
		// 		{
		// 			nickName: '收款记录详情',
		// 			path: 'detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordDetail.vue')
		// 		},
		// 		{
		// 			nickName: '运输合同收款记录详情',
		// 			path: 'detail/trans',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordTransDetail.vue')
		// 		},
		// 		{
		// 			nickName: '运输合同收款记录详情',
		// 			path: 'record/trans/detail',
		// 			component: () => import('@/v2/center/trade/views/pay/PayRecordTransDetail.vue')
		// 		}
		// 	]
		// },
		{
			nickName: '退款管理',
			path: 'refund',
			meta: {
				title: '退款管理',
				editTitle: '退款管理'
			},
			redirect: 'refund/list',
			component: () => import('@/v2/center/trade/views/index.vue'),
			children: [
				{
					nickName: '退款管理',
					path: 'list',
					component: () => import('@/v2/center/trade/views/pay/refund/List.vue'),
					meta: {
						title: '退款管理',
						editTitle: '退款管理'
					}
				},
				{
					nickName: '新增退款',
					path: 'add',
					meta: {
						title: '新增退款',
						editTitle: '修改退款'
					},
					component: () => import('@/v2/center/trade/views/pay/refund/Add.vue')
				},
				{
					nickName: '退款详情',
					path: 'detail',
					meta: {
						title: '退款详情'
					},
					component: () => import('@/v2/center/trade/views/pay/refund/Detail.vue')
				}
			]
		},
		// 回款管理
		{
			nickName: '回款管理',
			path: 'returned',
			meta: {
				title: '回款管理'
			},
			redirect: 'returned/list',
			component: () => import('@/v2/center/trade/views/index.vue'),
			children: [
				{
					nickName: '回款认领',
					path: 'list',
					component: () => import('@/v2/center/trade/views/pay/returned/list.vue')
				},
				{
					nickName: '回款详情',
					path: 'detail',
					meta: {
						title: '回款详情'
					},
					component: () => import('@/v2/center/trade/views/pay/returned/detail.vue')
				},
				{
					nickName: '新增回款',
					path: 'add',
					meta: {
						title: '新增回款'
					},
					component: () => import('@/v2/center/trade/views/pay/returned/add.vue')
				},
				{
					nickName: '新增回款',
					path: '/center/collection/stream/add',
					meta: {
						title: '新增回款'
					},
					component: () => import('@/v2/center/trade/views/pay/returned/add.vue')
				}
			]
		}
	]
};
