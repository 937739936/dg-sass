export default {
	name: 'steel',
	label: '钢材供应链',
	authCode: 'steel',
	menuList: [
		{
			name: '合同管理',
			authCode: 'steel:contract',
			icon: 'icon-wodehetong',
			children: [
				{
					name: '采购合同',
					authCode: 'steel:contract:buyContract',
					link: '/center/steels/contract/buy/list'
				},
				{
					name: '销售合同',
					authCode: 'steel:contract:sellContract',
					link: '/center/steels/contract/sell/list'
				},
				{
					name: '补充协议',
					authCode: 'steel:contract:supplementAgreement',
					link: '/center/steels/suppleAgreement/list'
				},
				{
					name: '采销合同关联管理',
					authCode: 'steel:contract:contractRelation',
					link: '/center/steels/relation/list'
				}
			]
		},
		{
			name: '发货计划管理',
			authCode: 'steel:shipmentPlan',
			icon: 'icon-fahuojihua',
			children: [
				{
					name: '发货计划',
					authCode: 'steel:shipmentPlan:list',
					link: '/center/steels/deliverPlan/list'
				}
			]
		},
		{
			name: '收发货管理',
			authCode: 'steel:shipmentReceipt',
			icon: 'icon-shoufahuoguanli',
			children: [
				{
					name: '发货管理',
					authCode: 'steel:shipmentReceipt:shipemnt',
					link: '/center/steels/receive/deliver/list'
				},
				{
					name: '收货管理',
					authCode: 'steel:shipmentReceipt:receipt',
					link: '/center/steels/receive/receipt/list'
				}
			]
		},
		{
			name: '货转管理',
			authCode: 'steel:goodsTransfer',
			icon: 'icon-huozhuanguanli',
			children: [
				{
					name: '我开具的',
					authCode: 'steel:goodsTransfer:openGT',
					link: '/center/steels/goodsTransfer/goodsTransferIssueList'
				},
				{
					name: '我收到的',
					authCode: 'steel:goodsTransfer:receiveGT',
					link: '/center/steels/goodsTransfer/goodsTransferReceiveList'
				},
				{
					name: '放货通知单',
					authCode: 'steel:goodsTransfer:transferRelease',
					link: '/center/steels/goodsTransfer/letterNotice/list'
				}
			]
		},
		{
			name: '提货管理',
			authCode: 'steel',
			icon: 'icon-tihuoguanli',
			children: [
				{
					name: '提货申请',
					authCode: 'steel:takeDeliveryApply',
					link: '/center/take/goods/apply'
				},
				{
					name: '我的提单',
					authCode: 'steel:takeDelivery',
					link: '/center/take/goods/list'
				}
			]
		},
		{
			name: '收付款管理',
			authCode: 'steel:receiptPayment',
			icon: 'icon-shoufukuanguanli',
			children: [
				{
					name: '付款管理',
					authCode: 'steel:receiptPayment:payment',
					link: '/center/steels/funds/payment/list'
				},
				{
					name: '收款管理',
					authCode: 'steel:receiptPayment:receipt',
					link: '/center/steels/funds/payment/receiptList'
				},
				{
					name: '回款管理',
					authCode: 'steel:collection',
					link: '/center/steels/funds/collection/list'
				}
			]
		},
		{
			name: '结算单管理',
			authCode: 'steel:statement',
			icon: 'icon-jiesuandanguanli',
			children: [
				{
					name: '结算单开具',
					authCode: 'steel:statement:openST',
					link: '/center/steels/settle/settleApplyList'
				},
				{
					name: '结算单确认',
					authCode: 'steel:statement:confirm',
					link: '/center/steels/settle/settleConfirmList'
				},
				{
					name: '结算单作废',
					authCode: 'steel:statement:cancel',
					link: '/center/steels/settle/settleCancelList'
				},
				{
					name: '我的结算单',
					authCode: 'steel:statement:mystatement',
					link: '/center/steels/settle/mySettleList'
				}
			]
		},
		{
			name: '发票管理',
			authCode: 'steel:invoice',
			icon: require('imgs/menu/wodefapiao.png'),
			children: [
				{
					name: '进项发票',
					authCode: 'steel:invoice:buyer',
					link: '/center/steels/invoice/buyInvoiceList'
				},
				{
					name: '销项发票',
					authCode: 'steel:invoice:seller',
					link: '/center/steels/invoice/sellInvoiceList'
				},
				{
					name: '运费发票',
					authCode: 'steel:invoice:freight',
					link: '/center/steels/invoice/freightInvoiceList'
				}
			]
		},
		// WPS不用了，隐藏我的报表，振月
		// {
		//   name: "报表管理",
		//   authCode: "",
		//   icon: "icon-baobiaoguanli",
		//   children: [
		//     {
		//       name: "我的报表",
		//       authCode: "",
		//       link: "/center/steels/statement/myStatementList",
		//     },
		//   ],
		// },
		{
			name: '盯市管理',
			authCode: 'steel:marketWatch',

			icon: 'icon-shoufahuoguanli',
			children: [
				{
					name: '市场价格',
					authCode: 'steel:marketWatch:marketPrice',
					link: '/center/steels/markMarket/markMarket/list'
				}
			]
		},
		{
			name: '追保函管理',
			authCode: 'steel:bondLetter',
			icon: 'icon-shoufahuoguanli',
			children: [
				{
					name: '我的追保函',
					authCode: 'steel:bondLetter:list',
					link: '/center/steels/additionalMargin/additionalMargin/list'
				}
			]
		}
		// {
		//   name: "单据管理",
		//   icon: require("imgs/menu/invoice.png"),
		//   authCode: "steel:myDoc",
		//   children: [
		//     {
		//       name: "我的单据",
		//       link: "/center/steels/receipts/myReceipts",
		//     },
		//   ],
		// },
	]
};
