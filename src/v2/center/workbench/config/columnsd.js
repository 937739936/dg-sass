import ENV from '@/api/env';
export const tradeData = [
	{
		// 合同确认
		name: '合同确认',
		api: ENV.BASE_API + '/api/workbench/confirmContract',
		auth: 'workbench:undo:trade:contractConfirm',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '买方名称', dataIndex: 'buyerCompanyName', key: 'buyerCompanyName' },
			{ title: '煤种', dataIndex: 'coalTypeDesc', key: 'coalTypeDesc' },
			{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
			{ title: '基准价格(元)', dataIndex: 'basePrice', key: 'basePrice' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_CONFIRM' && row.orderType == 'BUY'
					},
					{
						name: '去确认',
						path: '',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_CONFIRM' && row.orderType == 'SELL'
					},
					// 确认盖章
					{
						name: '去盖章',
						path: '/center/contract/sell/confirm/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'CONFIRM_WAIT_SIGN_SEAL' && row.orderType == 'BUY'
					},
					// 确认盖章
					{
						name: '去盖章',
						path: '/center/contract/buy/confirm/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'CONFIRM_WAIT_SIGN_SEAL' && row.orderType == 'SELL'
					}
				]
			}
		]
	},
	{
		// 发货申请
		name: '发货申请',
		api: ENV.BASE_API + '/api/workbench/shipmentApply',
		auth: 'workbench:undo:trade:deliverApply',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '买方名称', dataIndex: 'buyerCompanyName', key: 'buyerCompanyName' },
			{ title: '收货人简称', dataIndex: 'consigneeShortName', key: 'consigneeShortName' },
			{ title: '订单数量(吨)', dataIndex: 'quantity', key: 'quantity' },
			{
				title: '操作',
				action: [{ name: '去发货', path: '/center/receive/send/ship', barFlag: 'gyl', query: ['orderId', 'contractId'] }]
			}
		]
	},
	{
		// 货转开具
		name: '货转开具',
		api: ENV.BASE_API + '/api/workbench/goodsTransfer',
		auth: 'workbench:undo:trade:goodsTransfer',
		columns: [
			{ title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
			{ title: '已发货数量', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
			{ title: '已开具货转数量', dataIndex: 'goodsTransferedQuantity', key: 'goodsTransferedQuantity' },
			{
				title: '操作',
				action: [
					{
						name: '去开具',
						path: '/center/transfer/goodsTransfer/apply',
						barFlag: 'gyl',
						query: ['orderType', 'serialNo', 'serialId']
					}
				]
			}
		]
	},
	{
		// 收款确认
		name: '收款确认',
		api: ENV.BASE_API + '/api/workbench/collectionConfirmation',
		auth: 'workbench:undo:trade:collectionConfirmation',
		columns: [
			{ title: '资金流水号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '付款方', dataIndex: 'buyerName', key: 'buyerName' },
			{ title: '收款金额', dataIndex: 'payAmount', key: 'payAmount' },
			{ title: '收款日期', dataIndex: 'planPayDate', key: 'planPayDate' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '/center/fund/collect/confirm?type=overview&method=collect',
						barFlag: 'gyl',
						query: ['id', 'orderId']
					}
				]
			}
		]
	},
	{
		// 结算确认
		name: '结算确认',
		api: ENV.BASE_API + '/api/workbench/settlementConfirmation',
		auth: 'workbench:undo:trade:settlementConfirmation',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '结算单编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
			{ title: '结算数量(吨)', dataIndex: 'settleQuantity', key: 'settleQuantity' },
			{ title: '结算金额(元)', dataIndex: 'settleAmount', key: 'settleAmount' },
			{
				title: '操作',
				action: [{ name: '去确认', path: '/center/settle/buy/onlineconfirm', barFlag: 'gyl', query: ['orderId', 'id'] }]
			}
		]
	},
	{
		// 服务费确认
		name: '服务费确认',
		api: ENV.BASE_API + '/api/workbench/serviceFeeConfirmation',
		auth: 'workbench:undo:trade:serviceFeeConfirmation',
		columns: [
			{ title: '服务费结算单编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '服务费金额(元)', dataIndex: 'serviceFeeAmount', key: 'serviceFeeAmount' },
			{ title: '结算日期', dataIndex: 'createDate', key: 'createDate' },
			{ title: '状态', dataIndex: 'statusDesc', key: 'statusDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '/center/financeCenter/service/myServiceFeeConfirmNew',
						barFlag: 'financialCenter',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_CONFIRM'
					},
					{
						name: '去盖章',
						path: '/center/financeCenter/service/confirm/seal?isNew=true',
						barFlag: 'financialCenter',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_SIGN_SEAL'
					}
				]
			}
		]
	},
	{
		// 上游合同签章
		name: '上游合同签章',
		api: ENV.BASE_API + '/api/workbench/upstreamContractSignature',
		auth: 'workbench:undo:coreCompany:upstreamContractSignature',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
			{ title: '收货人简称', dataIndex: 'consigneeShortName', key: 'consigneeShortName' },
			{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
			{ title: '基准价格(元)', dataIndex: 'basePrice', key: 'basePrice' },
			{ title: '运输方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去盖章',
						path: '/center/contract/buy/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_SIGN_SEAL' && row.orderType == 'BUY'
					},
					{
						name: '去盖章',
						path: '/center/contract/sell/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_SIGN_SEAL' && row.orderType == 'SELL'
					},
					{
						name: '去提交',
						path: '/center/contract/buy/online/add/step1?flag=edit&type=buy',
						barFlag: 'gyl',
						query: ['id'],
						checkShow: row => row.orderStatus == 'DRAFT' && row.orderType == 'BUY'
					},
					{
						name: '去提交',
						path: '/center/contract/sell/online/add/step1?flag=edit$type=sell',
						barFlag: 'gyl',
						query: ['id'],
						checkShow: row => row.orderStatus == 'DRAFT' && row.orderType == 'SELL'
					}
				]
			}
		]
	},
	{
		// 上游合同确认
		name: '上游合同确认',
		api: ENV.BASE_API + '/api/workbench/upstreamContractConfirm',
		auth: 'workbench:undo:coreCompany:upstreamContractConfirm',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'sellerCompanyName', key: 'sellerCompanyName' },
			{ title: '收货人简称', dataIndex: 'consigneeCompanyName', key: 'consigneeCompanyName' },
			{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
			{ title: '基准价格(元)', dataIndex: 'basePrice', key: 'basePrice' },
			{ title: '运输方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_CONFIRM' && row.orderType == 'BUY'
					},
					{
						name: '去确认',
						path: '',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'WAIT_CONFIRM' && row.orderType == 'SELL'
					},
					// 确认盖章
					{
						name: '去盖章',
						path: '/center/contract/buy/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'CONFIRM_WAIT_SIGN_SEAL' && row.orderType == 'BUY'
					},
					// 确认盖章
					{
						name: '去盖章',
						path: '/center/contract/sell/stamp',
						barFlag: 'gyl',
						query: ['id', 'serialNo', 'type', 'initiatorUscc'],
						checkShow: row => row.orderStatus == 'CONFIRM_WAIT_SIGN_SEAL' && row.orderType == 'SELL'
					}
				]
			}
		]
	},
	{
		// 收货确认
		name: '收货确认',
		api: ENV.BASE_API + '/api/workbench/receiptConfirmation',
		auth: 'workbench:undo:coreCompany:receiptConfirmation',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
			{ title: '收货人简称', dataIndex: 'consigneeShortName', key: 'consigneeShortName' },
			{ title: '批次号', dataIndex: 'receiveNo', key: 'receiveNo' },
			{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
			{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
			{
				title: '操作',
				action: [{ name: '去确认', path: '/center/receive/accept/confirm', barFlag: 'gyl', query: ['deliverId'] }]
			}
		]
	},

	{
		// 业务线完善
		name: '业务线完善',
		api: ENV.BASE_API + '/api/workbench/businessLinePerfect',
		auth: 'workbench:undo:coreCompany:businessLinePerfect',
		columns: [
			{ title: '业务线号', dataIndex: 'businessLineNo', key: 'businessLineNo' },
			{ title: '业务线', dataIndex: 'businessLineName', key: 'businessLineName' },
			{ title: '采购合同编号', dataIndex: 'buyContractNo', key: 'buyContractNo' },
			{ title: '销售合同编号', dataIndex: 'sellContractNo', key: 'sellContractNo' },
			{
				title: '操作',
				action: [
					{
						name: '去完善',
						path: '/center/monitoring/dynamicMonitoring/detail',
						barFlag: 'monitoring',
						query: ['upOrderNo', 'downOrderNo', 'businessLineType']
					}
				]
			}
		]
	},
	{
		// 回款认领
		name: '待回款认领',
		auth: 'workbench:undo:coreCompany:collectionClaim',
		api: ENV.BASE_API + '/api/workbench/getCollectionFlowNotClaimList',
		columns: [
			{ title: '收款编号', dataIndex: 'receiveSerialNo', key: 'receiveSerialNo' },
			{ title: '收款户名', dataIndex: 'receiveName', key: 'receiveName' },
			{ title: '收款账号', dataIndex: 'receiveAccount', key: 'receiveAccount' },
			{ title: '收款开户行', dataIndex: 'receiveAccountBank', key: 'receiveAccountBank' },
			{ title: '对方户名', dataIndex: 'paymentName', key: 'paymentName' },
			{ title: '对方账号', dataIndex: 'paymentAccount', key: 'paymentAccount' },
			{ title: '对方开户行', dataIndex: 'paymentAccountBank', key: 'paymentAccountBank' },
			{ title: '回款时间', dataIndex: 'collectionDate', key: 'collectionDate' },
			{ title: '回款方式', dataIndex: 'collectionTypeDesc', key: 'collectionTypeDesc' },
			{ title: '回款金额', dataIndex: 'receiveAmount', key: 'receiveAmount' },
			{ title: '认领状态', dataIndex: 'claimResultDesc', key: 'claimResultDesc' },
			{ title: '已认领金额', dataIndex: 'claimAmount', key: 'claimAmount' },
			{ title: '可认领余额', dataIndex: 'notClaimedAmount', key: 'notClaimedAmount' },
			{ title: '数据来源', dataIndex: 'dataSourceDesc', key: 'dataSourceDesc' },
			{
				title: '操作',
				action: [
					{
						checkShow: row => row.dataSource == 2,
						auth: 'dgChain:recPay:collectionFlow:rl',
						name: '去认领',
						path: '/center/collection/stream/add?type=claim',
						barFlag: 'gyl',
						query: ['receiveSerialNo:receiveSerialNo']
					},
					{
						checkShow: row => row.dataSource == 1,
						name: '查看',
						auth: 'dgChain:recPay:collectionFlow:ck',
						path: '/center/fund/returned/detail',
						barFlag: 'gyl',
						query: ['receiveSerialNo:receiveSerialNo']
					},
					{
						checkShow: row => row.dataSource == 3,
						name: '查看',
						auth: 'dgChain:recPay:collectionFlow:ck',
						path: '/center/collection/stream/detail',
						barFlag: 'gyl',
						query: ['id:bankCollectionId', 'type:collectionType']
					}
				]
			}
		]
	},
	{
		// 确权发起
		name: '确权发起',
		auth: 'workbench:undo:coreCompany:assetConfirm',
		api: ENV.BASE_API + '/api/workbench/assetConfirm',
		columns: [
			{ title: '应付账款流水号', dataIndex: 'assetSerialNo', key: 'assetSerialNo' },
			{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
			{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '应付账款金额(元)', dataIndex: 'receivableAmount', key: 'receivableAmount' },
			{
				title: '操作',
				action: [{ name: '去确权', path: '/center/assets/confirmRights/stamp', barFlag: 'assets', query: ['id'] }]
			}
		]
	},

	{
		// 待完善资产
		name: '待完善资产',
		auth: 'workbench:undo:coreCompany:assetEdit',
		api: ENV.BASE_API + '/api/workbench/assetEdit',
		columns: [
			{ title: '应付账款流水号', dataIndex: 'assetSerialNo', key: 'assetSerialNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '应付账款金额', dataIndex: 'receivableAmount', key: 'receivableAmount' },
			{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
			{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
			{
				title: '操作',
				action: [{ name: '去完善', path: '/center/assets/payable/manage/edit?activeIndex=0', barFlag: 'assets', query: ['id'] }]
			}
		]
	},
	// 粮食
	{
		// 出仓单管理
		name: '出仓单管理',
		auth: 'workbench:undo:warehouseReceipt:add',
		api: ENV.BASE_GRAIN_API + '/outWarehouseReceipt/outWarehouseRemindList',
		columns: [
			{ title: '出仓单编号', dataIndex: 'deliveryNum', key: 'deliveryNum' },
			{ title: '开具日期', dataIndex: 'createDate', key: 'createDate' },
			{ title: '出仓单数量（吨）', dataIndex: 'deliveryAmount', key: 'deliveryAmount' },
			{ title: '已执行数量（吨）', dataIndex: 'issuedWeight', key: 'issuedWeight' },
			{ title: '待办内容', dataIndex: 'content', key: 'content' },
			{ title: '状态', dataIndex: 'statusDesc', key: 'statusDesc' },
			{
				title: '操作',
				action: [
					{ name: '查看', path: '/center/storageCenter/out/receipt/detail', barFlag: 'storageCenter', query: ['id'] },
					{ name: '完结', path: '/center/storageCenter/out/receipt/finish', barFlag: 'storageCenter', query: ['id'] }
				]
			}
		]
	},
	{
		// 仓房管理
		name: '仓房管理',
		auth: 'workbench:undo:warehouseStore:add',
		api: ENV.BASE_GRAIN_API + '/companyRelation/warehouseRemindList',
		columns: [
			{ title: '仓储企业', dataIndex: 'warehouseCompanyName', key: 'warehouseCompanyName' },
			{ title: '库点', dataIndex: 'pointName', key: 'pointName' },
			{ title: '仓房号', dataIndex: 'storehouseNum', key: 'storehouseNum' },
			{ title: '事项内容', dataIndex: 'content', key: 'content' },
			{
				title: '操作',
				action: [
					{
						name: '关联资金方',
						path: '/center/storageCenter/storehouse/relatedFunds',
						barFlag: 'storageCenter',
						query: ['id', 'batchId', 'storehouseId']
					}
				]
			}
		]
	},
	{
		// 确认单开具
		name: '确认单开具',
		auth: 'workbench:undo:confirmationSheet:add',
		api: ENV.BASE_GRAIN_API + '/contract/workbench/confirmationShip/notOpen',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'companyName', key: 'companyName' },
			{ title: '商品名称', dataIndex: 'productName', key: 'productName' },
			{ title: '合同类型', dataIndex: 'contractTypeDesc', key: 'contractTypeDesc' },
			{ title: '合同签订日期', dataIndex: 'signTime', key: 'signTime' },
			{
				title: '操作',
				action: [
					{
						name: '去开具',
						path: '/center/storageCenter/contract/createConfirmationSlip',
						barFlag: 'storageCenter',
						query: ['id']
					}
				]
			}
		]
	},
	{
		// 商品确认
		name: '商品确认',
		auth: 'workbench:undo:confirmationSheet:coreCompany:affirm',
		api: ENV.BASE_GRAIN_API + '/confirmationShip/workbench/coreCompany/confirm',
		columns: [
			{ title: '商品确认单编号', dataIndex: 'confirmationNo', key: 'confirmationNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'companyName', key: 'companyName' },
			{ title: '库点', dataIndex: 'depotPointName', key: 'depotPointName' },
			{ title: '确权金额', dataIndex: 'clearingTotalAmount', key: 'clearingTotalAmount' },
			{
				title: '操作',
				action: [
					{ name: '去确认', path: '/center/storageCenter/confirmationSlip/confirm', barFlag: 'storageCenter', query: ['id'] }
				]
			}
		]
	},

	// {
	// 	// 结算单发起
	// 	name:'结算单发起',
	// 	auth:'workbench:undo:coreCompany:settlementApply',
	// 	api:ENV.BASE_API+'/api/workbench/settlementApply',
	// 	columns:[
	// 		{ title: "订单编号", dataIndex: "orderSerialNo", key: "orderSerialNo" },
	// 		{ title: "卖方名称", dataIndex: "sellerName", key: "sellerName" },
	// 		{ title: "收货人简称", dataIndex: "consigneeShortName", key: "consigneeShortName" },
	// 		{ title: "合同编号", dataIndex: "contractNo", key: "contractNo" },
	// 		{ title: "已发货数量(吨)", dataIndex: "deliverQuantity", key: "deliverQuantity" },
	// 		{ title: "已付款金额(元)", dataIndex: "paymentAmount", key: "paymentAmount" },
	// 		{ title: "操作", action: [{name:'去确认',path:'/center/settle/apply/edit',barFlag:'gyl' ,query:['orderId']}] },

	// 	]
	// },

	{
		// 商品确认（仓）
		name: '商品确认仓',
		api: ENV.BASE_GRAIN_API + '/confirmationShip/workbench/warehouse/confirm',
		auth: 'workbench:undo:confirmationSheet:warehouse:affirm',
		columns: [
			{ title: '商品确认单编号', dataIndex: 'confirmationNo', key: 'confirmationNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'companyName', key: 'companyName' },
			{ title: '库点', dataIndex: 'depotPointName', key: 'depotPointName' },
			{ title: '确权金额', dataIndex: 'clearingTotalAmount', key: 'clearingTotalAmount' },
			{
				title: '操作',
				action: [
					{ name: '去确认', path: '/center/storageCenter/confirmationSlip/confirm', barFlag: 'storageCenter', query: ['id'] }
				]
			}
		]
	}
];
// 钢材 区分 一般贸易商 和 核心企业
// barFlag 激活顶部tab
export const steelsCommonTradeData = [
	{
		// 合同确认
		name: '合同确认',
		api: ENV.BASE_GANG_API + '/api/workbench/getAllContract',
		auth: '',
		query: {
			status: 'TO_BE_CONFIRMED'
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '合同类型', dataIndex: 'contractTypeDesc', key: 'contractTypeDesc' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },
			{ title: '合同数量', dataIndex: 'quantity', key: 'quantity' },
			{ title: '业务类型', dataIndex: 'businessTypeDesc', key: 'businessTypeDesc' },
			{
				title: '操作',
				action: [
					// 确认盖章
					{
						name: '去盖章',
						path: '/center/steels/contract/sell/stamp',
						barFlag: 'steel',
						query: ['id', 'contractNo', 'origin', 'initiatorUscc']
					}
				]
			}
		]
	},
	{
		// 发货申请
		name: '发货申请',
		api: ENV.BASE_GANG_API + '/contract/shipmentToDoContract',
		auth: '',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '合同数量', dataIndex: 'quantity', key: 'quantity' },
			{
				title: '操作',
				action: [
					{
						name: '去发货',
						path: '/center/steels/receive/deliver/releaseApply?flag=add',
						barFlag: 'steel',
						query: ['steelType', 'contractId', 'contractNo', 'contractTemplate']
					}
				]
			}
		]
	},
	{
		// 货转开具
		name: '货转开具',
		api: ENV.BASE_GANG_API + '/shipment/toDoShipmentList',
		auth: '',
		columns: [
			{ title: '批次号', dataIndex: 'shipmentNo', key: 'shipmentNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '发货数量', dataIndex: 'quantity', key: 'quantity' },
			{ title: '发货日期', dataIndex: 'shipmentDate', key: 'shipmentDate' },
			{ title: '货转开具标识', dataIndex: 'goodsTransferFlagDesc', key: 'goodsTransferFlagDesc' },
			{
				title: '操作',
				action: [{ name: '去开具', path: '/center/steels/transfer/send/apply', barFlag: 'steel', query: ['contractNo'] }]
			}
		]
	},
	{
		name: '提货申请',
		api: ENV.BASE_GANG_API + '/takeDeliveryApply/getTodoContractPage',
		auth: '',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '提货申请编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },
			{ title: '合同数量', dataIndex: 'quantity', key: 'quantity' },
			{ title: '业务类型', dataIndex: 'businessTypeDesc', key: 'businessTypeDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去提货',
						path: `/center/take/goods/step?currentStep=1`,
						barFlag: 'steel',
						checkShow: row => !row.status || row.status != '2',
						query: ['contractId']
					},
					{
						name: '去提交',
						path: '/center/take/goods/step?type=edit',
						checkShow: row => row.status == '2',
						barFlag: 'steel',
						query: ['contractNo', 'serialNo', 'id']
					}
				]
			}
		]
	},
	{
		// 结算确认
		name: '结算单确认',
		api: ENV.BASE_GANG_API + '/statement/confirmStatementList',
		auth: '',
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '合同类型', dataIndex: 'contractTypeDesc', key: 'contractTypeDesc' },
			{ title: '结算单编号', dataIndex: 'statementNo', key: 'statementNo' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },

			{ title: '结算数量(吨)', dataIndex: 'particularQuantity', key: 'particularQuantity' },
			{ title: '结算金额(元)', dataIndex: 'settleAmount', key: 'settleAmount' },
			{
				title: '操作',
				action: [
					{ name: '去确认', path: '/center/steels/settle/settleConfirmDetail?type=confirm', barFlag: 'steel', query: ['id'] }
				]
			}
		]
	},
	{
		// 服务费确认
		name: '服务费确认',
		api: ENV.BASE_API + '/api/workbench/steelServiceFeeConfirmation',
		auth: '',
		columns: [
			{ title: '服务费结算单编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '服务费金额(元)', dataIndex: 'serviceFeeAmount', key: 'serviceFeeAmount' },
			{ title: '结算日期', dataIndex: 'createDate', key: 'createDate' },
			{ title: '状态', dataIndex: 'statusDesc', key: 'statusDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '/center/financeCenter/service/myServiceFeeConfirmNew',
						barFlag: 'steel',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_CONFIRM'
					},
					{
						name: '去盖章',
						path: '/center/financeCenter/service/confirm/seal?isNew=true',
						barFlag: 'steel',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_SIGN_SEAL'
					}
				]
			}
		]
	}
];
// 核心企业
export const steelsCoreTradeData = [
	{
		// 合同确认
		name: '合同签章',
		api: ENV.BASE_GANG_API + '/api/workbench/getAllContract',
		auth: 'workbench:undo:steelContractSign:add',
		query: {
			status: 'DRAFT,TO_BE_SIGN_UP'
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '合同类型', dataIndex: 'contractTypeDesc', key: 'contractTypeDesc' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },
			{ title: '合同数量', dataIndex: 'quantity', key: 'quantity' },
			{ title: '业务类型', dataIndex: 'businessTypeDesc', key: 'businessTypeDesc' },
			{
				title: '操作',
				action: [
					// 确认盖章
					{
						name: '去提交',
						path: '/center/steels/contract/sell/create?type=edit',
						barFlag: 'steel',
						query: ['contractId', 'origin'],
						checkShow: row => row.status == 'DRAFT' && row.origin == 'sell'
					},
					{
						name: '去提交',
						path: '/center/steels/contract/buy/create?type=edit',
						barFlag: 'steel',
						query: ['contractId', 'origin'],
						checkShow: row => row.status == 'DRAFT' && row.origin == 'buy'
					},
					{
						name: '去盖章',
						path: '/center/steels/contract/buy/stamp?type=buy',
						barFlag: 'steel',
						query: ['id', 'contractNo', 'origin', 'initiatorUscc'],
						checkShow: row => row.status == 'TO_BE_SIGN_UP'
					}
				]
			}
		]
	},
	{
		// 收货确认
		name: '收货确认',
		api: ENV.BASE_GANG_API + '/receive/getReceivingPage',
		auth: 'workbench:undo:steelReceiptConfirmation:add',
		query: {
			pageNo: 1,
			pageSize: 500
		},
		columns: [
			{ title: '批次号', dataIndex: 'shipmentNo', key: 'shipmentNo' },
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },
			{ title: '发货日期', dataIndex: 'shipmentDate', key: 'shipmentDate' },
			{ title: '发货数量', dataIndex: 'quantity', key: 'quantity' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '/center/steels/receive/receipt/receiveApply?flag=add',
						barFlag: 'steel',
						query: ['steelType', 'deliverId']
					}
				]
			}
		]
	},
	{
		// 回款认领
		name: '回款认领',
		api: ENV.BASE_GANG_API + '/collection/page',
		auth: 'workbench:undo:steelCollectionClaim:add',
		query: {
			status: 'UNCLAIMED,PARTIAL_CLAIM',
			pageSize: 10000
		},
		columns: [
			{ title: '交易编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '对方户名', dataIndex: 'collectionAccount', key: 'collectionAccount' },
			{ title: '回款时间', dataIndex: 'collectionDate', key: 'collectionDate' },
			{ title: '回款方式', dataIndex: 'collectionModeDesc', key: 'collectionModeDesc' },
			{ title: '回款金额', dataIndex: 'collectionAmount', key: 'collectionAmount' },
			{
				title: '操作',
				action: [
					// 人工录入
					{
						name: '去确认',
						path: '/center/steels/funds/collection/claimDetail?type=view',
						barFlag: 'steel',
						query: ['id', 'collectionType'],
						checkShow: row => row.dataSource == 'MANUAL'
					},
					// oa同步
					{
						name: '去查看',
						path: '/center/steels/funds/collection/oaClaimDetail?type=view',
						barFlag: 'steel',
						query: ['id'],
						checkShow: row => row.dataSource == 'CCSOA'
					}
				]
			}
		]
	},
	{
		name: '开提单',
		api: ENV.BASE_GANG_API + '/takeDelivery/getApplyPageList?',
		auth: 'workbench:undo:steelBillOfLading:add',
		query: {
			pageNo: 1,
			pageSize: 500
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '提货申请单号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '申请提货企业', dataIndex: 'createCompanyName', key: 'createCompanyName' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '申请提货数量（吨）', dataIndex: 'quantityTotal', key: 'quantityTotal' },
			{ title: '交提货期限', dataIndex: 'date', key: 'date' },
			{
				title: '操作',
				action: [
					{ name: '开提单', path: `/center/take/order/step?currentStep=1`, barFlag: 'steel', query: ['contractId', 'serialNo'] }
				]
			}
		]
	},
	{
		// 关联回款
		name: '关联回款',
		api: ENV.BASE_GANG_API + '/takeDelivery/getCollectionTakeDeliveryList',
		auth: 'workbench:undo:steelRelatedCollection:add',
		query: {
			pageNo: 1,
			pageSize: 500
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '提货申请单号', dataIndex: 'applyTakeSerialNo', key: 'applyTakeSerialNo' },
			{ title: '申请提货企业', dataIndex: 'createCompanyName', key: 'createCompanyName' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '申请提货数量（吨）', dataIndex: 'quantityTotal', key: 'quantityTotal' },
			{ title: '提单有效期', dataIndex: 'date', key: 'date' },
			{
				title: '操作',
				action: [
					{
						name: '关联回款',
						path: '/center/take/order/step?type=relation',
						barFlag: 'steel',
						query: ['id', 'status', 'contractId', 'num', 'serialNo']
					}
				]
			}
		]
	},
	{
		// 填写实提
		name: '填写实提',
		api: ENV.BASE_GANG_API + '/takeDelivery/getRealTakeDeliveryList',
		auth: 'workbench:undo:steelFillTakegoods:add',
		query: {
			pageNo: 1,
			pageSize: 500
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '提货申请单号', dataIndex: 'applyTakeSerialNo', key: 'applyTakeSerialNo' },
			{ title: '申请提货企业', dataIndex: 'createCompanyName', key: 'createCompanyName' },
			{ title: '钢材种类', dataIndex: 'steelTypeDesc', key: 'steelTypeDesc' },
			{ title: '申请提货数量（吨）', dataIndex: 'quantityTotal', key: 'quantityTotal' },
			{ title: '提单有效期', dataIndex: 'date', key: 'date' },
			{
				title: '操作',
				// let path = '/center/take/order/step'
				// // 购销
				// if(row.issueMode == 'CONTRACT') {
				//   path = '/center/take/order/contract/stepTwo'
				// }
				action: [
					{
						name: '填写实提',
						path: '/center/take/order/step?type=input',
						barFlag: 'steel',
						checkShow: row => row.issueMode == 'TAKE_DELIVERY_APPLY',
						query: ['id', 'status', 'contractId', 'num', 'serialNo']
					},
					{
						name: '填写实提',
						path: '/center/take/order/contract/stepTwo?type=input',
						barFlag: 'steel',
						checkShow: row => row.issueMode == 'CONTRACT',
						query: ['id', 'status', 'contractId', 'num', 'serialNo']
					}
				]
			}
		]
	},
	{
		// 结算单盖章
		name: '结算单盖章',
		api: ENV.BASE_GANG_API + '/statement/myStatementList',
		auth: 'workbench:undo:steelSealSettlement:add',
		query: {
			pageNo: 1,
			pageSize: 500,
			status: 'WAIT_CONFIRM'
		},
		columns: [
			{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
			{ title: '合同类型', dataIndex: 'contractTypeDesc', key: 'contractTypeDesc' },
			{ title: '结算单编号', dataIndex: 'statementNo', key: 'statementNo' },
			{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
			{ title: '卖方名称', dataIndex: 'sellCompanyName', key: 'sellCompanyName' },
			{ title: '结算数量(吨)', dataIndex: 'particularQuantity', key: 'particularQuantity' },
			{ title: '结算金额(元)', dataIndex: 'settleAmount', key: 'settleAmount' },
			{
				title: '操作',
				action: [
					{
						name: '去盖章',
						path: '/center/steels/settle/apply/edit/submit/seal',
						barFlag: 'steel',
						query: ['id']
					}
				]
			}
		]
	},
	{
		// 服务费确认
		name: '服务费确认',
		api: ENV.BASE_API + '/api/workbench/steelServiceFeeConfirmation',
		auth: 'workbench:undo:serviceCharge:confirm',

		columns: [
			{ title: '服务费结算单编号', dataIndex: 'serialNo', key: 'serialNo' },
			{ title: '服务费金额(元)', dataIndex: 'serviceFeeAmount', key: 'serviceFeeAmount' },
			{ title: '结算日期', dataIndex: 'createDate', key: 'createDate' },
			{ title: '状态', dataIndex: 'statusDesc', key: 'statusDesc' },
			{
				title: '操作',
				action: [
					{
						name: '去确认',
						path: '/center/financeCenter/service/myServiceFeeConfirmNew',
						barFlag: 'steel',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_CONFIRM'
					},
					{
						name: '去盖章',
						path: '/center/financeCenter/service/confirm/seal?isNew=true',
						barFlag: 'steel',
						query: ['id'],
						checkShow: row => row.status == 'WAIT_SIGN_SEAL'
					}
				]
			}
		]
	}
];
