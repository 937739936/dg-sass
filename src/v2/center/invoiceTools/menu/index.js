export default {
	name: 'invoiceTools',
	label: '发票管家',
	authCode: 'kitInvoice',
	menuList: [
		{
			name: '进项发票',
			icon: require('@/v2/assets/imgs/menu/invoice/in.png'),
			children: [
				{
					name: '进项发票列表',
					link: '/center/admin/invoice/in/list',
					authCode: 'kitInvoice:buyInvoice:list'
				},
				{
					name: '进项发票入账',
					link: '/center/admin/invoice/in/entry',
					authCode: 'kitInvoice:buyInvoice:accountBook'
				}
			]
		},
		{
			name: '销项发票',
			icon: require('@/v2/assets/imgs/menu/invoice/out.png'),
			authCode: 'kitInvoice:sellInvoice',
			children: [
				{
					name: '销项发票列表',
					link: '/center/admin/invoice/out/list',
					authCode: 'kitInvoice:sellInvoice:list'
				}
			]
		},
		{
			name: '运费发票',
			icon: require('@/v2/assets/imgs/menu/invoice/transport.png'),
			authCode: 'kitInvoice:deliverInvoice',
			children: [
				{
					name: '运费发票列表',
					link: '/center/admin/invoice/transport/list',
					authCode: 'kitInvoice:deliverInvoice:list'
				},
				{
					name: '运费发票入账',
					link: '/center/admin/invoice/transport/entry',
					authCode: 'kitInvoice:deliverInvoice:accountBook'
				}
			]
		},
		{
			name: '合同管理',
			icon: require('@/v2/assets/imgs/menu/invoice/contract.png'),
			children: [
				{
					name: '采购合同管理',
					link: '/center/admin/invoice/contract/buy/list',
					authCode: 'kitInvoice:contract:buy'
				},
				{
					name: '销售合同管理',
					link: '/center/admin/invoice/contract/sell/list',
					authCode: 'kitInvoice:contract:sell'
				}
			]
		}
	]
};
