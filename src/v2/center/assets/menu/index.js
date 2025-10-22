export default {
	name: 'assets',
	authCode: 'asset',
	label: '资产管理',
	menuList: [
		{
			name: '应收账款管理',
			authCode: 'asset:recv:manage',
			icon: 'icon-yingshouzhangkuanguanli',
			children: [
				{
					name: '应收账款管理', // 金融端
					authCode: 'asset:recvB',
					link: '/center/assets/receivable/JR'
				},
				{
					name: '应收账款变更审核', // 金融端
					authCode: 'asset:recvBModify',
					link: '/center/assets/receivable/change'
				},
				{
					name: '应收账款管理', // 核心企业
					authCode: 'asset:recv',
					link: '/center/assets/receivable'
				}
			]
		},
		{
			name: '应付账款管理',
			authCode: 'asset:pay:manage',
			icon: 'icon-yingfuzhangkuanguanli',
			children: [
				{
					name: '应付账款管理',
					authCode: 'asset:pay',
					link: '/center/assets/payable/manage'
				},
				{
					name: '应付账款变更管理',
					authCode: 'asset:pay:modify',
					link: '/center/assets/payable/change'
				}
			]
		},
		{
			name: '确权盖章管理',
			authCode: 'asset:confirm',
			icon: 'icon-querengaizhangguanli',
			children: [
				{
					name: '确权盖章管理',
					authCode: 'asset:confirm',
					link: '/center/assets/confirmRights'
				}
			]
		},
		// 供应商
		{
			name: '确权盖章管理',
			authCode: 'asset:sellerConfirm',
			icon: 'icon-querengaizhangguanli',
			children: [
				{
					name: '确权盖章管理',
					authCode: 'asset:sellerConfirm',
					link: '/center/assets/confirmRights/selllist'
				}
			]
		},
		{
			name: '预付资产管理',
			authCode: 'asset:pre',
			icon: 'icon-yufuzichanguanli',
			children: [
				{
					name: '预付资产管理',
					authCode: 'asset:pre',
					link: '/center/assets/advance'
				}
			]
		},
		{
			name: '货押资产管理',
			authCode: 'asset:pledge',
			icon: 'icon-huoyazichanguanli',
			children: [
				{
					name: '货押资产管理',
					authCode: 'asset:pledge:corecompany',
					link: '/center/assets/pledge'
				}
			]
		},
		{
			name: '池资产管理',
			authCode: 'asset:pool',
			icon: require('imgs/menu/chizichanguanli.png'),
			children: [
				{
					name: '池资产管理',
					authCode: 'asset:pool:list',
					link: '/center/assets/pool/manage'
				},
				{
					name: '池台账查询',
					authCode: 'asset:pool:view',
					link: '/center/assets/pool/account/detail'
				}
			]
		}
	]
};
