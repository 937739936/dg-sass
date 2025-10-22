export default {
	name: 'zhanghu',
	label: '账户中心',
	menuList: [
		{
			name: '个人管理',
			icon: 'icon-gerenguanli',
			children: [
				{
					name: '个人信息',
					link: '/center/account/person/info'
				},
				{
					name: '安全设置',
					link: '/center/account/person/safety'
				}
			]
		},
		{
			name: '企业管理',
			icon: 'icon-qiyeguanli',
			children: [
				{
					name: '我的企业',
					authCode: 'company:myCompany',
					link: '/center/account/company/info'
				},
				{
					name: '企业账号管理',
					authCode: 'company:user',
					meta: {
						aauthCode: 'company:user'
					},
					link: '/center/account/company/user'
				},
				{
					name: '企业资料管理',
					authCode: 'company:attachment',
					link: '/center/account/company/tax'
				},
				{
					name: '密码管理',
					authCode: 'company:passwordManage',
					link: '/center/account/company/password/edit'
				}
			]
		},
		{
			name: '客户管理',
			authCode: 'company:customer',
			icon: 'icon-kehuguanli',
			children: [
				{
					name: '客户信息管理',
					authCode: 'company:customer',
					link: '/center/account/company/customer'
				}
			]
		}
	]
};
