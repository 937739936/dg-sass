export default {
	name: 'piaoju',
	label: '票据中心',
	authCode: 'shanmeiBillCenter',
	menuList: [
		{
			name: '票据开立',
			icon: 'icon-piaojukaili',
			authCode: 'shanmeiBillCenter:issu',
			children: [
				{
					name: '票据开立',
					authCode: 'shanmeiBillCenter:issu:issu',
					link: '/center/counterfoil/open/list'
				}
			]
		},
		{
			name: '票据签收',
			icon: 'icon-piaojuqianshou',
			authCode: 'shanmeiBillCenter:receive',
			children: [
				{
					name: '票据签收',
					authCode: 'shanmeiBillCenter:receive:receive',
					link: '/center/counterfoil/audit/list'
				}
			]
		},
		{
			name: '票据查询',
			icon: 'icon-piaojuchaxun',
			authCode: 'shanmeiBillCenter-manage',
			children: [
				{
					name: '票据查询',
					authCode: 'shanmeiBillCenter-manage-list',
					link: '/center/counterfoil/record/list'
				}
			]
		}
	]
};
