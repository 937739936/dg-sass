export default [
	{
		nickName: '融资管理',
		path: 'financing',
		meta: {
			title: '融资管理'
		},
		redirect: '/center/financing/financingList',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '应收融资管理',
				path: '/center/financing/financing',
				meta: {
					title: '应收融资管理'
				},
				redirect: '/center/financing/financingList',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '应收融资管理供应商',
						path: '/center/financing/financingList',
						name: 'financingList',
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingList')
					},
					{
						nickName: '融资详情供应商',
						path: '/center/financing/financingDetail',
						name: 'financingDetailAccounts',
						meta: {
							title: '融资详情'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingDetail')
					},

					{
						nickName: '融资申请',
						path: '/center/financing/financingApply',
						name: 'financingApply',
						meta: {
							title: '融资申请'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingApply')
					},
					{
						nickName: '融资申请-上海银行',
						path: '/center/financing/financingApplySh',
						name: 'financingApplySh',
						meta: {
							title: '融资申请'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/sh/FinancingApplySH')
					},
					{
						nickName: '融资盖章',
						path: '/center/financing/financingSign',
						name: 'financingSign',
						meta: {
							title: '盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingSign')
					},
					{
						nickName: '融资审核',
						path: '/center/financing/financingDetailAudit',
						name: 'financingDetailAudit',
						meta: {
							title: '审核'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingDetailAudit')
					},

					{
						nickName: '融资审核盖章',
						path: '/center/financing/financingAuditSign',
						name: 'financingAuditSign',
						meta: {
							title: '盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/accounts/FinancingAuditSign')
					}
				]
			},
			{
				nickName: '预付融资管理',
				path: '/center/financing/financingAdvance',
				meta: {
					title: '预付融资管理'
				},
				redirect: '/center/financing/financingAdvanceList',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '预付融资管理核心企业',
						path: '/center/financing/financingAdvanceList',
						name: 'financingAdvanceList',
						meta: {
							title: '预付融资管理'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceList')
					},
					{
						nickName: '预付融资申请核心企业',
						path: '/center/financing/financingAdvanceApply',
						name: 'financingAdvanceApply',
						meta: {
							title: '融资申请'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceApply')
					},
					{
						nickName: '预付融资盖章',
						path: '/center/financing/financingAdvanceSign',
						name: 'financingAdvanceSign',
						meta: {
							title: '盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceSign')
					},
					{
						nickName: '预付融资详情核心企业',
						path: '/center/financing/financingAdvanceDetail',
						name: 'financingAdvanceDetail',
						meta: {
							title: '融资详情'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceDetail')
					},
					{
						nickName: '融单登记',
						path: '/center/financing/financingAdvanceRDRegis',
						name: 'financingAdvanceRDRegis',
						meta: {
							title: '融单登记'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceRDRegis')
					},
					{
						nickName: '预付融资审核核心企业',
						path: '/center/financing/financingAdvanceDetailAudit',
						name: 'financingAdvanceDetailAudit',
						meta: {
							title: '审核'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceDetailAudit')
					},
					{
						nickName: '预付融资盖章金融',
						path: '/center/financing/financingAdvanceAuditSign',
						name: 'financingAdvanceAuditSign',
						meta: {
							title: '盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/advance/FinancingAdvanceAuditSign')
					}
				]
			},
			{
				nickName: '货押融资申请',
				path: '/center/financing/financingPledgeList',
				meta: {
					title: '货押融资申请'
				},
				redirect: '/center/financing/financingPledgeListMAINLOG',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '货押融资记录核心',
						path: '/center/financing/financingPledgeListMAINLOG',
						name: 'financingPledgeListMAINLOG',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/financing/pledge/FinancingPledgeListMAINLOG')
					},
					{
						nickName: '货押融资列表供应商',
						path: '/center/financing/financingPledgeList',
						name: 'financingPledgeList',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/financing/pledge/FinancingPledgeList')
					},
					{
						nickName: '货押融资申请供应商',
						path: '/center/financing/financingPledgeApply',
						name: 'financingPledgeApply',
						meta: {
							title: '融资申请'
						},
						component: () => import('@/v2/center/financing/views/financing/pledge/FinancingPledgeApply')
					},
					{
						nickName: '货押融资详情供应商',
						path: '/center/financing/financingPledgeDetail',
						name: 'financingPledgeDetail',
						meta: {
							title: '融资详情'
						},
						component: () => import('@/v2/center/financing/views/financing/pledge/FinancingPledgeDetail')
					}
				]
			},
			{
				nickName: '票据融资管理',
				path: '/center/financing/financingCounterfoilList',
				meta: {
					title: '票据融资管理'
				},
				redirect: '/center/financing/financingCounterfoilListLOG',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '票据融资管理',
						path: '/center/financing/financingCounterfoilListLOG',
						name: 'financingCounterfoilListLOG',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilListLOG')
					},
					{
						nickName: '票据融资申请列表',
						path: '/center/financing/financingCounterfoilList',
						name: 'financingCounterfoilList',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilList')
					},
					{
						nickName: '票据融资申请',
						path: '/center/financing/financingCounterfoilApply',
						name: 'financingCounterfoilApply',
						meta: {
							title: '融资申请'
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilApply')
					},
					{
						nickName: '票据融资详情',
						path: '/center/financing/financingCounterfoilDetail',
						name: 'financingCounterfoilDetail',
						meta: {
							title: '融资详情'
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilDetail')
					},
					{
						nickName: '票据融资签章',
						path: '/center/financing/financingCounterfoilSign',
						name: 'financingCounterfoilSign',
						meta: {
							title: '融资盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilSign')
					},
					{
						nickName: '票据融资审核签章',
						path: '/center/financing/financingCounterfoilAuditSign',
						name: 'financingCounterfoilAuditSign',
						meta: {
							title: '融资盖章'
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilAuditSign')
					}
				]
			}
		]
	},
	{
		nickName: '放还款管理',
		path: '',
		meta: {
			title: '放还款管理'
		},
		redirect: '/center/loan/LoanListMAIN',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '应收类放还款管理',
				path: '/center/loan/LoanList',
				meta: {
					title: '应收类放还款管理'
				},
				redirect: '/center/loan/LoanListMAIN',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '应收放还款管理核心',
						path: '/center/loan/loanListMAIN',
						name: 'LoanListMAIN',
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanListMAIN')
					},
					{
						nickName: '应收还款申请', // 还供应商
						path: '/center/loan/loanApplySupplier',
						name: 'LoanApplySupplier',
						meta: {
							title: '还款申请'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanApplySupplier')
					},
					{
						nickName: '还款申请-上海银行',
						path: '/center/loan/loanApplySh',
						name: 'LoanApplySH',
						meta: {
							title: '还款申请'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/sh/LoanApplySH')
					},
					{
						nickName: '还款申请-南商银行',
						path: '/center/loan/loanApplyNS',
						name: 'LoanApplyNS',
						meta: {
							title: '还款申请'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/ns/LoanApplyNS')
					},
					{
						nickName: '应收还款申请z', // 还资方
						path: '/center/loan/loanApply',
						name: 'LoanApply',
						meta: {
							title: '还款申请'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanApply')
					},
					{
						nickName: '还款登记',
						path: '/center/loan/loanReceivableHuan',
						name: 'LoanHuan',
						meta: {
							title: '还款登记'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanHuan')
					},
					{
						nickName: '收款确认',
						path: '/center/loan/loanReceipt',
						name: 'LoanReceipt',
						meta: {
							title: '收款确认'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanReceipt')
					},
					{
						nickName: '还款申请详情',
						path: '/center/loan/loanApplyDetail',
						name: 'LoanApplyDetail',
						meta: {
							title: '还款申请详情'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanApplyDetail')
					}
				]
			},
			{
				nickName: '预付类放还款管理',
				path: '/center/loan/loanAdvanceList',
				meta: {
					title: '预付类放还款管理'
				},
				redirect: '/center/loan/loanAdvanceListMAIN',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '预付放还款管理核心',
						path: '/center/loan/loanAdvanceListMAIN',
						name: 'LoanAdvanceListMAIN',
						meta: {},
						component: () => import('@/v2/center/financing/views/loan/advance/LoanAdvanceListMAIN')
					},
					{
						nickName: '预付还款登记',
						path: '/center/loan/loanAdvanceApply',
						name: 'LoanAdvanceApply',
						meta: {
							title: '还款申请'
						},
						component: () => import('@/v2/center/financing/views/loan/advance/LoanAdvanceApply')
					}
				]
			},
			{
				nickName: '货押类放还款管理',
				path: '/center/loan/loanPledge',
				meta: {
					title: '货押类放还款管理'
				},
				redirect: '/center/loan/loanPledgeList',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '货押放还款管理',
						path: '/center/loan/loanPledgeList',
						name: 'loanPledgeList',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/loan/pledge/LoanPledgeList')
					},
					{
						nickName: '货押放还款详情',
						path: '/center/loan/loanPledgeDetailMAIN',
						name: 'loanPledgeDetailMAIN',
						meta: {
							title: '还款详情'
						},
						component: () => import('@/v2/center/financing/views/loan/pledge/LoanPledgeDetailMAIN')
					}
				]
			},
			{
				nickName: '票据类放还款管理',
				path: '/center/loan/loanListCounterfoil',
				meta: {
					title: '票据类放还款管理'
				},
				redirect: '/center/loan/loanListCounterfoilMAIN',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '票据放还款管理', // 核心企业
						path: '/center/loan/loanListCounterfoilMAIN',
						name: 'LoanListCounterfoilMAIN',
						meta: {
							keepAlive: true
						},
						component: () => import('@/v2/center/financing/views/loan/counterfoil/LoanListCounterfoilMAIN')
					},
					{
						nickName: '票据放还款详情',
						path: '/center/loan/loanCounterfoilDetail',
						name: 'LoanCounterfoilDetail',
						meta: {
							title: '还款详情'
						},
						component: () => import('@/v2/center/financing/views/loan/counterfoil/LoanCounterfoilDetail')
					},
					{
						nickName: '还款登记',
						path: '/center/loan/loanHuan',
						name: 'LoanHuan',
						meta: {
							title: '还款登记'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanHuan')
					},
					{
						nickName: '票据放还款选融资',
						path: '/center/loan/loanFangListCounterfoil',
						name: 'LoanFangListCounterfoil',
						meta: {
							title: '放款登记'
						},
						component: () => import('@/v2/center/financing/views/loan/counterfoil/LoanFangListCounterfoil')
					}
				]
			}
		]
	},

	{
		nickName: '融资审核',
		path: '',
		meta: {
			title: '融资审核'
		},
		redirect: '/center/financing/financingCounterfoilListJR',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '票据融资审核',
				path: '/center/financing/financingCounterfoilList',
				meta: {
					title: '票据融资审核'
				},
				redirect: '/center/financing/financingCounterfoilListJR',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '票据融资审核列表',
						path: '/center/financing/financingCounterfoilListJR',
						name: 'financingCounterfoilListJR',
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilListJR')
					},

					{
						nickName: '票据融资审核详情',
						path: '/center/financing/financingCounterfoilDetailAudit',
						name: 'financingCounterfoilDetailAudit',
						meta: {
							title: '票据融资审核'
						},
						component: () => import('@/v2/center/financing/views/financing/counterfoil/FinancingCounterfoilDetailAudit')
					}
				]
			}
		]
	},
	{
		nickName: '放还款明细',
		path: '',
		meta: {
			title: '放还款明细'
		},
		redirect: '/center/loan/loanDetailList',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '放还款明细',
				path: '/center/loan/loanDetail',
				meta: {
					title: '放还款明细'
				},
				redirect: '/center/loan/loanDetailList',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '放款明细表金融',
						path: '/center/loan/loanDetailList',
						name: 'LoanDetailList',
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanDetailList')
					}
				]
			}
		]
	},
	{
		nickName: '放还款管理',
		path: '',
		meta: {
			title: '放还款管理'
		},
		redirect: '/center/loan/LoanListJR',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '应收类放还款管理',
				path: 'center/loan/LoanListJ',
				meta: {
					title: '应收类放还款管理'
				},
				redirect: '/center/loan/LoanListJR',
				component: () => import('@/v2/center/financing/views/index.vue'),
				children: [
					{
						nickName: '放还款管理金融',
						path: '/center/loan/loanListJR',
						name: 'LoanListJR',
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanListJR')
					},
					// {
					//   nickName: "放款登记选择",
					//   path: "/center/loan/loanFangList",
					//   name: "LoanFangList",
					//   meta: {
					//     title: "放款登记",
					//   },
					//   component: () =>
					//     import("@/v2/center/financing/views/loan/accounts/LoanFangList"),
					// },
					// {
					//   nickName: "放款登记选择--中航租赁",
					//   path: "/center/loan/loanFangListZH",
					//   name: "LoanFangListZH",
					//   meta: {
					//     title: "放款登记",
					//   },
					//   component: () =>
					//     import(
					//       "@/v2/center/financing/views/loan/accounts/zh/LoanFangListZH"
					//     ),
					// },
					{
						nickName: '放款登记',
						path: '/center/loan/loanFang',
						name: 'LoanFang',
						meta: {
							title: '放款登记'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/LoanFang')
					},
					{
						nickName: '放款登记--中航租赁',
						path: '/center/loan/loanFangZH',
						name: 'LoanFangZH',
						meta: {
							title: '放款登记'
						},
						component: () => import('@/v2/center/financing/views/loan/accounts/zh/LoanFangZH')
					}
					// {
					//   nickName: "借据详情",
					//   path: "/center/loan/loanJiejuDetail",
					//   name: "LoanJiejuDetail",
					//   meta: {
					//     title: "借据详情",
					//   },
					//   component: () =>
					//     import(
					//       "@/v2/center/financing/views/loan/accounts/LoanJiejuDetail"
					//     ),
					// },
					// {
					//   nickName: "预付还款详情核心",
					//   path: "/center/loan/loanAdvanceDetailMAIN",
					//   name: "LoanAdvanceDetailMAIN",
					//   component: () =>
					//     import(
					//       "@/v2/center/financing/views/loan/advance/LoanAdvanceDetailMAIN"
					//     ),
					// },
					// {
					//   nickName: "预付还款申请详情",
					//   path: "/center/loan/loanAdvanceApplyDetail",
					//   name: "LoanAdvanceApplyDetail",
					//   component: () =>
					//     import(
					//       "@/v2/center/financing/views/loan/advance/LoanAdvanceApplyDetail"
					//     ),
					// },
				]
			}
		]
	},
	{
		nickName: '台账管理',
		path: '/center/financing/ledger',
		meta: {
			title: '台账管理'
		},
		redirect: '/center/financing/ledger/list',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '台账管理',
				path: '/center/financing/ledger/list',
				meta: {
					title: '台账管理'
				},
				component: () => import('@/v2/center/financing/views/ledger/List.vue')
			}
		]
	},
	{
		nickName: '贷后管理',
		path: '',
		meta: {
			title: '贷后管理'
		},
		redirect: '/center/financing/loanClose/list',
		component: () => import('@/v2/center/financing/views/index.vue'),
		children: [
			{
				nickName: '贷后结清管理',
				path: '/center/financing/loanClose/list',
				meta: {
					title: '贷后结清管理'
				},
				component: () => import('@/v2/center/financing/views/loanClose/list.vue')
			},
			{
				nickName: '贷后结清盖章',
				path: '/center/financing/loanClose/sign',
				meta: {
					title: '贷后结清盖章'
				},
				component: () => import('@/v2/center/financing/views/loanClose/sign.vue')
			},
			{
				nickName: '贷后结清详情',
				path: '/center/financing/loanClose/detail',
				meta: {
					title: '贷后结清详情'
				},
				component: () => import('@/v2/center/financing/views/loanClose/detail.vue')
			}
		]
	}
];
