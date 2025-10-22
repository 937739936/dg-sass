export default {
	name: 'coal-gyl',
	authCode: 'coalMineDgChain',
	label: '煤炭供应链',
	menuList: [
		{
			name: '合同管理',
			icon: 'icon-wodehetong',
			authCode: 'coalMineDgChain:contract',
			children: [
				{
					name: '销售合同',
					link: '/center/coal/sellContract',
					authCode: 'coalMineDgChain:contract:sellContract'
				}
			]
		},
		{
			name: '发运管理',
			icon: 'icon-shoufahuoguanli',
			authCode: 'coalMineDgChain:despatch',
			children: [
				{
					name: '发运数据补录管理',
					link: '/center/coal/logistics',
					authCode: 'coalMineDgChain:despatch:deliver'
				}
			]
		},
		{
			name: '我的收付款',
			icon: 'icon-shoufukuanguanli',
			authCode: 'coalMineDgChain:receive',
			children: [
				{
					name: '收款管理',
					link: '/center/pay/collectRecordList',
					authCode: 'coalMineDgChain:receive:receive',
					meta: {
						from: 'coal-gyl'
					}
				}
			]
		},
		{
			name: '发票管理',
			icon: require('imgs/menu/wodefapiao.png'),
			authCode: 'coalMineDgChain:invoice',
			children: [
				{
					name: '销项发票',
					link: '/center/invoice/sellInvoiceList',
					authCode: 'coalMineDgChain:invoice:sellInvoice'
				}
			]
		},
		{
			name: '结算单管理',
			icon: 'icon-jiesuandanguanli',
			authCode: 'coalMineDgChain:settlement',
			children: [
				{
					name: '结算单管理',
					link: '/center/coal/statement',
					authCode: 'coalMineDgChain:settlement:settlement'
				}
			]
		}
	]
};
