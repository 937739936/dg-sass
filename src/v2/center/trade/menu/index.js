export default {
	name: 'gylv2',
	label: '数字供应链',
	authCode: 'dgChain',
	menuList: [
		{
			name: '合同管理',
			authCode: 'dgChain:contract',
			icon: 'icon-wodehetong',
			children: [
				{
					name: '采购合同',
					link: '/center/contract/buy'
				},
				{
					name: '销售合同',
					link: '/center/contract/sell'
				},
				{
					name: '运输合同',
					authCode: 'dgChain:contract:transportContract',
					link: '/center/contract/transport'
				},
				{
					name: '补充协议',
					authCode: 'dgChain:contract:supplementalAgreement',
					link: '/center/contract/agreement'
				}
			]
		},
		{
			name: '业务线管理',
			authCode: 'dgChain:businessLine',
			icon: require('imgs/menu/yewuxianguanli.png'),
			children: [
				{
					name: '业务线管理',
					link: '/center/businessline'
				}
			]
		},
		{
			name: '收发货管理',
			authCode: 'dgChain:recDel',
			icon: require('imgs/menu/wodeshoufahuo.png'),
			children: [
				{
					name: '发货管理',
					authCode: 'dgChain:recDel:delRecord',
					link: '/center/receive/send'
				},
				{
					name: '汽车派车计划',
					authCode: 'steel:shipmentReceipt:deliverDispatchPlan',
					link: '/center/receive/carplan'
				},
				{
					name: '收货管理',
					authCode: 'dgChain:recDel:recRecord',
					link: '/center/receive/accept'
				},
				{
					name: '发运数据补录管理',
					authCode: 'dgChain:recDel:terminalDeliver',
					link: '/center/receive/coal'
				}
			]
		},
		{
			name: '提货管理',
			authCode: 'dgChain:lading',
			icon: 'icon-tihuoguanli1',
			children: [
				{
					name: '提货管理',
					link: '/center/ladingbill/lading',
					authCode: 'dgChain:lading:lading'
				},
				{
					name: '放货管理',
					link: '/center/ladingbill/delivery',
					authCode: 'dgChain:lading:release'
				},
				{
					name: '收货证明',
					link: '/center/ladingbill/receipt',
					authCode: 'dgChain:lading:receipt'
				}
			]
		},
		// {
		//     name: "提货管理Old",
		//     authCode: "dgChain:lading",
		//     icon: "icon-wodetihuodan",
		//     children: [
		//       {
		//         name: "提货管理",
		//         link: "/center/ladingbill/lading",
		//         authCode:"dgChain:lading:lading"
		//       },
		//       {
		//         name: "收货证明",
		//         link: "/center/ladingbill/receipt",
		//         authCode:"dgChain:lading:receipt"
		//       },
		//     ],
		// },
		{
			name: '货转管理',
			authCode: 'dgChain:goodsTransfer:list',
			icon: 'icon-wodehuozhuan',
			children: [
				{
					name: '货转管理',
					link: '/center/transfer/goodsTransfer'
				}
			]
		},
		// {
		//   name: "我的货转",
		//   icon: "icon-wodehuozhuan",
		//   children: [
		//     {
		//       name: "我开具的",
		//       link: "/center/transfer/send",
		//     },
		//     {
		//       name: "我收到的",
		//       link: "/center/transfer/receive",
		//     },
		//   ],
		// },
		{
			name: '收付款管理',
			authCode: 'dgChain:recPay',
			icon: require('imgs/menu/payment_management.png'),
			children: [
				{
					name: '付款管理',
					authCode: 'dgChain:recPay:payRecord',
					link: '/center/fund/pay'
				},
				{
					name: '收款管理',
					authCode: 'dgChain:recPay:recRecord',
					link: '/center/fund/collect'
				},
				// {
				// 	name: '付款管理Old',
				// 	authCode: 'dgChain:recPay:payRecord',
				// 	link: '/center/fund/pay'
				// },
				// {
				// 	name: '收款管理Old',
				// 	authCode: 'dgChain:recPay:recRecord',
				// 	link: '/center/fund/collect'
				// },
				{
					name: '退款管理',
					authCode: 'dgChain:recPay:refund',
					link: '/center/fund/refund'
				},
				{
					name: '回款管理',
					authCode: 'dgChain:recPay:collectionFlow',
					link: '/center/fund/returned'
				}
			]
		},
		{
			name: '追保函管理',
			icon: 'icon-zhuibaohanguanli',
			authCode: 'dgChain:bondLetterManage',
			children: [
				{
					name: '追保函管理',
					authCode: 'dgChain:bondLetterManage',
					link: '/center/bondLetter/online/list'
				}
			]
		},
		{
			name: '结算单管理',
			authCode: 'dgChain:settle',
			icon: 'icon-jiesuandanguanli',
			children: [
				{
					name: '采购结算单',
					authCode: 'dgChain:settle:sell',
					link: '/center/settle/buy'
				},
				{
					name: '销售结算单',
					authCode: 'dgChain:settle:buy',
					link: '/center/settle/sell'
				},
				{
					name: '运输结算单',
					authCode: 'dgChain:settle:transSettle',
					link: '/center/settle/transport'
				}
			]
		},
		{
			name: '发票管理',
			authCode: 'dgChain:invoice',
			icon: require('imgs/menu/wodefapiao.png'),
			children: [
				{
					name: '进项发票',
					link: '/center/invoice/buy'
				},
				{
					name: '销项发票',
					link: '/center/invoice/sell'
				},
				{
					name: '运费发票',
					link: '/center/invoice/freight'
				}
				// {
				//   name: "异常发票记录",
				//   link: "/center/invoice/unusualInvoiceList",
				// },
			]
		},
		// 所有核心企业均有这个菜单，回环闭环管理需求  --2022/8/11 郭凯宣
		// {
		//   name: "回款管理",
		//   authCode:'dgChain:recPay',
		//   icon: "icon-huikuanguanli",
		//   children: [
		//     // {
		//     //   name: "回款流水管理",
		//     //   authCode:"dgChain:recPay:collectionFlow",
		//     //   link: "/center/collection/stream",
		//     // },
		//   ],
		// },
		{
			name: '我的设备',
			authCode: 'dgChain:myDevice',
			icon: 'icon-shebei',
			children: [
				{
					name: '我的设备',
					authCode: 'dgChain:myDevice:myDevice',
					link: '/center/device/facility'
				}
			]
		}
	]
};
