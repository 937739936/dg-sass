export const getTestDetailInfo = () => {
	// TODO: 获取付款详情信息
	let detailInfo = {
		// TODO: 这里是付款详情信息
		paymentNo: 'SKZJ2024052919120032',
		basicInfo: {
			paymentStatus: 'WAIT_REPAY_CONFIRM',
			paymentStatusDesc: '待收款确认',
			receivableId: null,
			receivableSerialNo: null,
			assetType: null,
			createTime: '2024-05-29 19:12:22',
			hasInvoice: 'INVOICE',
			paymentType: 'PRE_SETTLEMENT',
			paymentTypeDesc: '结算付款',
			paymentMethod: 'YHHP',
			paymentMethodDesc: '银行汇票',
			receiveAccName: '扬州正融电力燃料有限公司',
			receiveId: '198547adda4b4556a5d7d65c2b480d6c',
			receiveAccNo: '6555 1217 0076 5432',
			receiveAccBank: '中国建设银行股份有限公司抚顺章党支行',
			payAmount: 1,
			payType: '0',
			payTypeName: '自有资金',
			planPayDate: '2024-05-29',
			comments: '12344444',
			receiveConfirmExpireDay: 7,
			waitRepayConfirmTime: '2024-05-30 00:03:42'
		},
		contractVO: {
			businessType: 'WAREHOUSE_RECEIPTS_PLEDGE', // 标准仓押
			paymentStatus: 'WAIT_REPAY_CONFIRM',
			paymentStatusDesc: '待收款确认',
			contractId: '123456789',
			contractNo: 'HT-123456789-001-001-001',
			contractType: '1',
			buyerName: '张三',
			sellerName: '李四',
			businessLineNo: 'YWX-123456789',
			receivableId: '123456789',
			receivableSerialNo: 'ZC-123456789-001-001-001', //资产编号
			createTime: '2021-01-01 12:00:002021-01-01 12:00:00' //创建时间
		},
		businessLineVO: {
			businessLineNo: 'SKYWX202402020001',
			businessLineName: '正融电力-荣厚实业-上海胜华电缆（集团）有限公司',
			businessLineType: 'DOWN',
			upOrderNo: 'SKOD202402021338350001',
			buyerContractNo: 'ZRDL-RHSY-202402-002',
			downOrderNo: 'SKBT202402020001',
			sellerContractNo: 'BDZX001WWW'
		},
		// 流程发起人信息
		auditChainAndOperator: {
			needPushOA: true,
			operatorInfo: [
				{
					systemName: 'CCS',
					operatorName: '张三',
					operatorMobile: '13800138000'
				},
				{
					systemName: 'CCS',
					operatorName: '李四',
					operatorMobile: '13600136000'
				},
				{
					systemName: 'CCS',
					operatorName: '张三',
					operatorMobile: '13800138000'
				},
				{
					systemName: 'CCS',
					operatorName: '李四',
					operatorMobile: '13600136000'
				}
			]
		},
		// 流程链列表
		processChains: [
			{
				remark: null,
				status: 'SUCCESS',
				name: '河南荣厚实业有限公司提交付款申请',
				groupCode: 'SUBMIT',
				businessStatus: 'RISK_CONTROL_AUDITING',
				businessOperation: 'SUBMIT',
				time: '2024-05-29 19:53:07'
			},
			{
				remark: null,
				status: 'SUCCESS',
				name: '平台审批通过',
				groupCode: 'PLATFORM_OR_RISK',
				businessStatus: 'WAIT_REPAY_CONFIRM',
				businessOperation: 'RISK_CONTROL_APPROVE',
				time: '2024-05-30 00:03:42'
			},
			{
				remark: null,
				status: 'RUNNING',
				name: '待收款确认',
				groupCode: 'WAIT_REPAY_CONFIRM',
				businessStatus: 'WAIT_REPAY_CONFIRM',
				businessOperation: null,
				time: null
			},
			{
				remark: null,
				status: 'WAIT',
				name: '已付款,流程结束',
				groupCode: 'PAYED',
				businessStatus: 'PAYED',
				businessOperation: null,
				time: null
			}
		],
		// 操作记录
		paymentOperateLogList: [
			{
				operationTime: '2021-01-01 12:00:00',
				comments:
					'在季前赛上获得一些表现机会，李月汝进入常规赛之后无法赢得更多信任在季前赛上获得一些表现机会，李月汝进入常规赛之后无法赢得更多信任在季前赛上获得一些表现机会，李月汝进入常规赛之后无法赢得更多信任在季前赛上获得一些表现机会，李月汝进入常规赛之后无法赢得更多信任。今天，火花队以70比68险胜神秘人队，拿到了赛季首胜。“库里教妹”卡梅隆-布林卡送出了关键的封盖，但是李月汝只在上半场获得了1分29秒的出场时间，2投0中，没有得分。'
			},
			{
				operationType: 'CANCEL',
				operationTypeDesc: '作废',
				operationBy: '东皇太八',
				operationByCompany: '河南荣厚实业有限公司河南荣厚实业有限公司',
				comments: '作废',
				operationTime: '2024-05-28 15:12:17'
			},
			{
				operationType: 'PLATFORM_AUDITING_REJECT',
				operationTypeDesc: '平台运营审核驳回',
				operationBy: '测试管理员',
				operationByCompany: null,
				comments: '平台审批驳回',
				operationTime: '2024-05-28 11:16:14'
			},
			{
				operationType: 'SUBMIT',
				operationTypeDesc: '提交',
				operationBy: '东皇太八',
				operationByCompany: '河南荣厚实业有限公司',
				comments: '提交',
				operationTime: '2024-05-28 11:14:11'
			},
			{
				operationType: 'SAVE',
				operationTypeDesc: '修改',
				operationBy: '东皇太八',
				operationByCompany: '河南荣厚实业有限公司',
				comments: '修改',
				operationTime: '2024-05-28 11:09:52'
			}
		],
		// 发货信息
		deliverGoodsTransVO: {
			// deliverRecordList: [
			// 	{
			// 		id: '4d44003c27f55a8f32909e9e5ce3f9c9',
			// 		deliverDate: '2024-04-102024-04-102024-04-102024-04-102024-04-102024-04-102024-04-102024-04-102024-04-102024-04-10',
			// 		deliverQuantity: 111,
			// 		receiveQuantity: 50,
			// 		batchNo: 'BN202404290001',
			// 		status: 4,
			// 		statusDesc: '已收货'
			// 	},
			// 	{
			// 		id: 'b8fd81baccb959c7315cc2ddf850a725',
			// 		deliverDate: '2024-04-01',
			// 		batchNo: 'BN202404220004',
			// 		deliverQuantity: 33,
			// 		receiveQuantity: 10,
			// 		status: 2,
			// 		statusDesc: '待收货',
			// 		trainNum: 6
			// 	},
			// 	{
			// 		id: '03c736095b9d8981930564664359eedc',
			// 		deliverDate: '2024-04-03',
			// 		deliverQuantity: 1000,
			// 		receiveQuantity: 9,
			// 		transType: 'TRAIN',
			// 		batchNo: 'BN202404220003',
			// 		status: 10,
			// 		statusDesc: '审核中',
			// 		trainNum: 5
			// 	}
			// ],
			goodsTransferRecordList: [
				{
					id: '184c1b5a95074a828ea217d147985e4a',
					goodsTransferNo: 'HNRH-XJDYC-202304-007-202404160004',
					status: 'SEALED',
					statusDesc: '已签约',
					goodsTransferQuantity: 99999,
					signDate: '2023-04-11',
					transTypeDesc: '汽运',
					receiverName:
						'河南荣厚实业有限公司河南荣厚实业有限公司河南荣厚实业有限公司河南荣厚实业有限公司河南荣厚实业有限公司河南荣厚实业有限公司'
				}
			]
		},
		// 下游回款
		collectionVO: {
			accumulateClaimedAmount: 29394,
			accumulateClaimedMarginAmount: 99405,
			accumulateClaimedGoodsAmount: 12,
			collectionInfoList: [
				{
					receiveSerialNo: '测试回款1444',
					receiveDate: '2024-03-21 12:00:00',
					claimedAmount: 300090,
					paymentTypeDesc:
						'保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金保证金'
				},
				{
					receiveSerialNo: 'ceshiskakashsjs',
					receiveDate: '2024-03-05 12:00:00',
					claimedAmount: 12000,
					paymentTypeDesc: '商业承兑汇票'
				}
			]
		},
		paymentVO: {
			paymentAmountTotal: 55994,
			paymentRecordList: [
				{
					id: 61,
					serialNo: 'SKTK2024041618400001',
					payDate: '2024-04-16',
					payAmount: 55994,
					paymentTypeDesc: '退款',
					paymentType: 'REFUND'
				},
				{
					id: '6ccaeba7fd5d11eeb71700505684ac67',
					serialNo: 'SKZJ2024041816260003',
					payDate:
						'2024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-18',
					payAmount: 1000,
					paymentTypeDesc: '预付款',
					paymentType: 'PRE_PAYMENT'
				}
			]
		},
		statementVOList: [
			{
				id: '20f62f5b737c67259cd71a08705abcc9',
				serialNo: 'SKJSD2024020213490001',
				confirmTime:
					'2024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-182024-04-18',
				settleAmount: 8000,
				settleUnitPrice: 80,
				settleQuantity: 8000,
				status: 'EFFECTIVE',
				statusDesc: '已生效',
				dataType: 'ONLINE'
			}
		],
		taxVOList: [
			{
				bid: '123456789',
				taxCategoryDesc: '印花税',
				taxPeriodStart: '2024-04-01',
				taxPeriodEnd: '2024-04-30',
				amount: 1048848.33,
				fileName: '20240401-20240430-税费明细.pdf'
			}
		],
		upStreamInvoiceVO: {
			tradeInvoiceList: null,
			transInvoiceList: [
				{
					id: '9fae4ae011c811ef897d0050568416ca',
					code: '1400212130',
					no: '03604200',
					issuedDate: '2021-11-07',
					taxExcludedAmount: 378390.75,
					taxAmount: 33938.25,
					totalAmount: 412329,
					splitedAmount: 1600,
					notSplitAmount: 410877.5,
					currentContractSplitedAmount: 200,
					state: 'NORMAL',
					stateDesc: '正常',
					stampTaxFlag: 2,
					stampTaxFlagAmount: 148.5,
					stampTaxFlagTotalAmount: 412477.5,
					invoiceType: 'DELIVER_INVOICE',
					fileName: null,
					fileUrl: null,
					whetherHasAttachment: null
				}
			]
		},
		downStreamInvoiceVO: {
			tradeInvoiceList: [
				{
					id: '05870e4c10da11efb71700505684ac67',
					issuedDate: '2021-05-31',
					code: '4100211130',
					no: '11603256',
					stampTaxFlag: 1,
					stampTaxFlagAmount: null,
					stampTaxFlagTotalAmount: null,
					totalAmount: '104530.14',
					taxExcludedAmount: '92504.55',
					stateDesc: '正常',
					whetherHasAttachment: '是',
					notSplitAmount: '0.00',
					splitAmount: 104530.14,
					createTime: '2024-05-13 11:36:45',
					state: 'NORMAL',
					attachment: 'trade-files/20240513/water-mark/1622533646(1)_1622533765999_1715571355019.jpg',
					updateCompanyName: '陕西陕煤供应链管理有限公司',
					industryType: 'COAL'
				}
			],
			transInvoiceList: [
				// {
				// 	id: '5726edff2ab06a8ab09c9824bfc96d34',
				// 	code: '9999',
				// 	no: '2022030011',
				// 	issuedDate: '2022-03-01 12:00:00',
				// 	taxExcludedAmount: 55994,
				// 	taxAmount: 1000,
				// 	invoiceType: 'UP_STREAM',
				// 	totalAmount: 56994,
				// 	splitedAmount: 56994,
				// 	notSplitAmount: 0,
				// 	currentContractSplitedAmount: 0,
				// 	state: 'EFFECTIVE',
				// 	stateDesc: '已生效',
				// 	stampTaxFlag: '',
				// 	stampTaxFlagAmount: '',
				// 	stampTaxFlagTotalAmount: '',
				// 	invoiceTypeDesc: '上游发票'
				// },
				{
					id: '5726edff2ab06a8ab09c9824bfc96d34',
					issuedDate: '2021-09-06',
					code: '1400204130',
					no: '04060742',
					stampTaxFlag: 2,
					stampTaxFlagAmount: 360.9,
					stampTaxFlagTotalAmount: 894175.6,
					totalAmount: '893814.70',
					taxExcludedAmount: '820106.15',
					taxAmount: '893814.70',
					stateDesc: '正常',
					notSplitAmount: '893875.60',
					state: 'NORMAL',
					attachment: 'trade-files/20240416/3_1713264192948.png',
					industryType: 'COAL'
				},
				{
					id: '01657a14ee7895bb997dc0ed93f0a4d7',
					issuedDate: '2024-01-17',
					code: '6200231130',
					no: '00678007',
					stampTaxFlag: 2,
					stampTaxFlagAmount: 123.9,
					stampTaxFlagTotalAmount: 562686.6,
					totalAmount: '562562.70',
					taxExcludedAmount: '516141.16',
					stateDesc: '正常',
					whetherHasAttachment: '是',
					notSplitAmount: '562485.60',
					splitAmount: 201,
					createTime: '2024-04-16 15:34:21',
					state: 'NORMAL',
					attachment: 'trade-files/20240416/71e7a652e6a341b5a42f6105afbc48b8_1713252594788.jpeg',
					updateCompanyName: '河南荣厚实业有限公司',
					industryType: 'COAL'
				}
			]
		},
		fileInfoList: [
			{
				id: 2067,
				module: 'PAYMENT',
				bizNo: 'SKZJ2024051114020003',
				serialNo: null,
				fileId: '1789174288142716929',
				attachId: null,
				name: '1.png',
				transferName: '代发证明SKZJ2024051114020003001.png',
				url: 'trade-files/20240507/water-mark/7afab56c859b4d1394d35786b67179d9.png',
				type: 'DFZM',
				typeName: '代发证明',
				locked: 0,
				checked: 0,
				generatingSource: 1,
				dataSource: 1,
				dataSourceDesc: '收发货上传',
				ext: 'png',
				md5: '6d4252465bfdadf3cf413c6a174e3bad',
				size: 1045551,
				sealStatus: null,
				createId: '2c94af7b4cd27245a3cd2977760d3624',
				createDate: '2024-05-11 14:02:46',
				updateId: '2c94af7b4cd27245a3cd2977760d3624',
				uploadTime: '2024-05-11 14:02:46'
			},
			{
				id: 2069,
				module: 'PAYMENT',
				bizNo: 'SKZJ2024051114020003',
				serialNo: null,
				fileId: '1789174288868331522',
				attachId: null,
				name: '文件空excel.xlsx',
				transferName: '核算表SKZJ2024051114020003001.xlsx',
				url: 'trade-files/20240326/b55264c2264e4d2abff165aae8f63459.xlsx',
				type: 'HSB',
				typeName: '核算表',
				locked: 0,
				checked: 0,
				generatingSource: 1,
				dataSource: 1,
				dataSourceDesc: '收发货上传',
				ext: 'xlsx',
				md5: 'a1f1a2a125f43b14244aa51505002774',
				size: 8889,
				sealStatus: null,
				createId: '2c94af7b4cd27245a3cd2977760d3624',
				createDate: '2024-05-11 14:02:46',
				updateId: '2c94af7b4cd27245a3cd2977760d3624',
				uploadTime: '2024-05-11 14:02:46'
			},
			{
				id: 2068,
				module: 'PAYMENT',
				bizNo: 'SKZJ2024051114020003',
				serialNo: null,
				fileId: '1789174288721530882',
				attachId: null,
				name: '1.png',
				transferName: '委托结算函SKZJ2024051114020003001.png',
				url: 'trade-files/20240507/water-mark/7afab56c859b4d1394d35786b67179d9.png',
				type: 'WTJSH',
				typeName: '委托结算函',
				locked: 0,
				checked: 0,
				generatingSource: 1,
				dataSource: 1,
				dataSourceDesc: '收发货上传',
				ext: 'png',
				md5: '6d4252465bfdadf3cf413c6a174e3bad',
				size: 1045551,
				sealStatus: null,
				createId: '2c94af7b4cd27245a3cd2977760d3624',
				createDate: '2024-05-11 14:02:46',
				updateId: '2c94af7b4cd27245a3cd2977760d3624',
				uploadTime: '2024-05-11 14:02:46'
			}
		],
		bankProductItemVO: {
			payType: '0',
			payTypeName: '自有资金',
			financingType: 'NONE',
			creditType: null,
			availableAmount: null,
			remainingAmount: null,
			upInvoiceConfig: true,
			upInvoiceRequired: false,
			downInvoiceConfig: false,
			downInvoiceRequired: false,
			taxPaymentUpConfig: false,
			taxPaymentUpRequired: false,
			taxReturnUpConfig: false,
			taxReturnUpRequired: false,
			fileConfigList: [
				{
					attachType: 'UP_OTHER',
					attachTypeDesc: '上游其他材料',
					required: false
				},
				{
					attachType: 'DOWN_OTHER',
					attachTypeDesc: '下游其他材料',
					required: false
				},
				{
					attachType: 'BOND_CREDENTIALS',
					attachTypeDesc: '履约保证金凭证/转保证金文件',
					required: false
				},
				{
					attachType: 'BOND_LETTER',
					attachTypeDesc: '保证金承诺函',
					required: false
				},
				{
					attachType: 'BZJ_ZF_PJ',
					attachTypeDesc: '保证金支付凭证',
					required: false
				},
				{
					attachType: 'LJQE_LETTER',
					attachTypeDesc: '量价确认函',
					required: false
				},
				{
					attachType: 'DB_LETTER',
					attachTypeDesc: '担保函',
					required: false
				},
				{
					attachType: 'GUARANTEE_SLIP',
					attachTypeDesc: '保单',
					required: false
				},
				{
					attachType: 'HSB',
					attachTypeDesc: '核算表',
					required: false
				}
			],
			accountingExtType: 2
		}
	};
	return detailInfo;
};
