export default {
	name: 'storageCenter',
	label: '仓储中心',
	authCode: 'warehouse',
	menuList: [
		{
			name: '合同管理',
			authCode: 'warehouse:contract',
			icon: 'icon-wodehetong',
			children: [
				{
					name: '合同管理',
					link: '/center/storageCenter/contract'
				}
			]
		},
		{
			name: '商品确认单',
			authCode: 'warehouse:confirmation',
			icon: 'icon-shangpinquerendan',
			children: [
				{
					name: '商品确认单',
					link: '/center/storageCenter/confirmationSlip'
				}
			]
		},
		{
			name: '仓储管理',
			authCode: 'warehouse:monitor',
			icon: require('imgs/menu/cangchuguanli.png'),
			children: [
				{
					name: '入库管理',
					link: '/center/storageCenter/in',
					authCode: 'warehouse:putManage'
				},
				{
					name: '出库管理',
					link: '/center/storageCenter/out',
					authCode: 'warehouse:outManage'
				},
				{
					name: '仓房管理',
					link: '/center/storageCenter/storehouse/list',
					authCode: 'warehouse:monitor:storeHouseMange'
				},
				{
					name: '仓房使用历史查询',
					link: '/center/storageCenter/history/list',
					authCode: 'warehouse:monitor:historySelect'
				},
				{
					name: '报表管理',
					link: '/center/storageCenter/report/list',
					authCode: 'warehouse:report'
				},
				{
					name: '仓储动态监控',
					link: '/center/storageCenter/report/monitoring',
					authCode: 'warehouse:screen'
				}
			]
		},
		{
			name: '出仓单管理',
			authCode: 'warehouse:outManage:outWarehouseReceipt',
			icon: 'icon-chucangdanguanli',
			children: [
				{
					name: '出仓单管理',
					link: '/center/storageCenter/out/receipt'
				}
			]
		},
		{
			name: '预警管理',
			authCode: 'warehouse:warnManage',
			icon: 'icon-yujingguanli',
			children: [
				{
					name: '预警数据',
					authCode: 'warehouse:warnManage:warnData',
					link: '/center/storageCenter/earlywarning/data'
				},
				{
					name: '预警订阅',
					authCode: 'warehouse:warnManage:subscription',
					link: '/center/storageCenter/earlywarning/subscribe'
				},
				{
					name: '预警设置',
					authCode: 'warehouse:warnManage:config',
					link: '/center/storageCenter/earlywarning/setting'
				}
			]
		},
		{
			name: '放还款管理',
			authCode: 'warehouse:financeLoanRepay',
			icon: 'icon-fanghuankuanguanli',
			children: [
				{
					name: '放还款管理',
					authCode: 'warehouse:financeLoanRepay:financeLoanRepay',
					link: '/center/storageCenter/loan/loanList'
				}
			]
		}
	]
};
