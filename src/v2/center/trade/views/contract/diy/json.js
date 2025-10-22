export default {
	formLayout: {
		layout: 'vertical',
		rowColumn: 8,
		labelAlign: 'right'
	},
	mapConfig: {
		contract: '基本信息',
		buyAndSell: '买卖方信息',
		quality: '质量数量信息',
		transportation: '运输信息',
		productIndicatorJsonStr: '基准质量指标',
		acceptUser: '银行账户信息',
		contacts: '联系人信息',
		contractExtension: '富文本',
		commitment: '承诺函'
	},
	formList: {
		contract: [],
		buyAndSell: [],
		quality: [
			{
				label: 'goodsName',
				title: '品名',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入品名',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				minLength: 1,
				maxLength: 50,
				active: false
			},
			{
				label: 'deliveryDate',
				title: '交货期限',
				type: 'string',
				widget: 'range-picker',
				default: '0',
				placeholder: ['开始日期', '结束日期'],
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'basePrice',
				title: '基准价格(元/吨)',
				type: 'number',
				widget: 'input-number',
				default: null,
				placeholder: '请输入基准价格(元/吨)',
				disabled: false,
				required: true,
				precision: 2,
				min: 0,
				max: 9999.99,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'quantity',
				title: '数量(吨)',
				type: 'number',
				widget: 'input-quality',
				default: null,
				placeholder: '请输入数量(吨)',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				list: [
					{
						label: 'quantity',
						title: '数量(吨)',
						type: 'number',
						widget: 'input-quality',
						default: null,
						placeholder: '请输入数量(吨)',
						required: true,
						min: 0,
						max: 9999999.999,
						precision: 3,
						style: {
							display: 'block'
						}
					},
					{
						label: 'quantityOffset',
						title: '数量(吨)',
						type: 'number',
						widget: 'input-quantityOffset',
						default: null,
						placeholder: '请输入数量(吨)',
						required: true,
						min: 0,
						max: 100,
						precision: 0,
						style: {
							display: 'block'
						}
					}
				],
				active: false
			},
			{
				label: 'settleMode',
				title: '结算类型',
				type: 'string',
				widget: 'select',
				default: '',
				placeholder: '请选择结算类型',
				disabled: false,
				required: true,
				options: [
					{
						label: '一票结算',
						value: 'ONE_TICKET'
					},
					{
						label: '两票结算',
						value: 'TWI_TICKET'
					}
				],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'depositAmount',
				title: '保证金/违约金(元)',
				type: 'number',
				widget: 'input-number',
				default: null,
				placeholder: '请输入保证金/违约金(元)',
				disabled: false,
				min: 0,
				max: 9999999.99,
				precision: 2,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			}
		],
		transportation: [
			{
				label: 'transportMode',
				title: '运输方式',
				type: 'string',
				widget: 'select',
				default: '',
				placeholder: '请选择运输方式',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'deliveryType',
				title: '交货方式',
				type: 'string',
				widget: 'select',
				default: null,
				placeholder: '请选择交货方式',
				disabled: false,
				required: true,
				options: [
					{
						label: '车板交货',
						value: 'VEHICLE_BOARD'
					},
					{
						label: '平仓交货',
						value: 'FLAT_WAREHOUSE'
					},
					{
						label: '场地货转',
						value: 'PLACE_GOODS_TRANSFER'
					},
					{
						label: '舱底交货',
						value: 'BILGE_DELIVERY'
					},
					{
						label: '场地入库',
						value: 'GROUND_STORAGE'
					},
					{
						label: '其他',
						value: 'OTHER'
					}
				],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'deliveryTypeOther',
				title: '其他交货方式',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入其他交货方式',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'none'
				},
				active: false
			},
			{
				label: 'pickupPlace',
				title: '交(提)货地点',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入交(提)货地点',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'transportResponsibility',
				title: '运输负责方',
				type: 'string',
				widget: 'select',
				default: null,
				placeholder: '请选择运输负责方',
				disabled: false,
				required: true,
				options: [
					{
						label: '卖方',
						value: '卖方'
					},
					{
						label: '买方',
						value: '买方'
					},
					{
						label: '其他',
						value: '其他'
					}
				],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'transportResponsibilityOther',
				title: '其他运输负责方',
				type: 'string',
				widget: 'input',
				default: '默认值',
				placeholder: '请输入其他运输负责方',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'none'
				},
				active: false
			},
			{
				label: 'placeOfOrigin',
				title: '产地',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入产地',
				disabled: false,
				required: true,
				maxLength: 50,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'departureStation',
				title: '发站',
				type: 'string',
				widget: 'input-search',
				default: '',
				placeholder: '请输入内容查询',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'arriveStation',
				title: '到站',
				type: 'string',
				widget: 'input-search',
				default: '',
				placeholder: '请输入内容查询',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'shipLoadingPortName',
				title: '装货港',
				type: 'string',
				widget: 'select-multiple',
				default: '',
				placeholder: '请选择装货港',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'shipDischargingPortName',
				title: '卸货港',
				type: 'string',
				widget: 'select-multiple',
				default: '',
				placeholder: '请选择卸货港',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'deliverAddr',
				title: '发货地',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入发货地',
				disabled: false,
				required: true,
				maxLength: 50,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'shipperName',
				title: '托运人',
				type: 'string',
				widget: 'select-multiple',
				default: '',
				placeholder: '请输入托运人',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'receiverName',
				title: '收货人',
				type: 'string',
				widget: 'select-multiple',
				default: '',
				placeholder: '请输入收货人',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'warehouseTransferArea',
				title: '仓储中转地',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入仓储中转地',
				disabled: false,
				required: true,
				maxLength: 50,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'freightPayType',
				title: '运费支付方式',
				type: 'string',
				widget: 'select',
				default: '',
				placeholder: '请选择运费支付方式',
				disabled: false,
				required: true,
				options: [
					{
						label: '卖方支付',
						value: 'OPPOSITE_SIDE'
					},
					{
						label: '买方支付',
						value: 'MY_SIDE'
					},
					{
						label: '其他',
						value: 'OTHER'
					}
				],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'freightPayModeOther',
				title: '其他运费支付方式',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入其他运费支付方式',
				disabled: false,
				required: true,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			}
		],
		productIndicator: [
			{
				label: 'productIndicator',
				title: '基准质量指标',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入基准质量指标',
				disabled: false,
				required: true,
				style: {
					display: 'block'
				},
				active: false
			}
		],
		acceptUser: [
			{
				label: 'buyBankNo',
				title: '买方账号',
				type: 'string',
				widget: 'select-bank',
				default: '',
				placeholder: '请选择买方账号',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				// "children": [
				//   {
				//     "label": "bankName",
				//     "title": "开户行",
				//     "default": "",
				//     "disabled": true
				//   },
				//   {
				//     "label": "accountNo",
				//     "title": "账号",
				//     "default": "",
				//     "disabled": true
				//   }
				// ],
				active: false
			},
			{
				label: 'sellerBankNo',
				title: '卖方账号',
				type: 'string',
				widget: 'select-bank',
				default: '',
				placeholder: '请选择卖方账号',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				children: [
					{
						label: 'bankName',
						title: '开户行',
						default: '',
						disabled: true
					},
					{
						label: 'accountNo',
						title: '账号',
						default: '',
						disabled: true
					}
				],
				active: false
			}
		],
		contacts: [
			{
				label: 'buyContact',
				title: '甲方(买方)联系人',
				type: 'string',
				widget: 'select-contacts',
				default: '',
				placeholder: '请选择甲方(买方)联系人',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				// "children": [
				//   {
				//     "label": "buyContactName",
				//     "title": "甲方联系人姓名",
				//     "default": "",
				//     "disabled": true
				//   },
				//   {
				//     "label": "buyContactPhone",
				//     "title": "甲方联系人手机号",
				//     "default": "",
				//     "disabled": true
				//   },
				//   {
				//     "label": "buyContactArea",
				//     "title": "甲方联系人所在区",
				//     "default": "",
				//     "disabled": true
				//   },
				//   {
				//     "label": "buyContactAddress",
				//     "title": "甲方联系人详细地址",
				//     "default": "",
				//     "disabled": true
				//   },
				//   {
				//     "label": "buyContactEmail",
				//     "title": "甲方联系人电子邮箱",
				//     "default": "",
				//     "disabled": true
				//   }
				// ],
				active: false
			},
			{
				label: 'sellerContact',
				title: '乙方(卖方)联系人',
				type: 'string',
				widget: 'select-contacts',
				default: '',
				placeholder: '请选择乙方(卖方)联系人',
				disabled: false,
				required: true,
				options: [],
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				children: [
					{
						label: 'sellerContactName',
						title: '乙方联系人姓名',
						default: '',
						disabled: true
					},
					{
						label: 'sellerContactPhone',
						title: '乙方联系人手机号',
						default: '',
						disabled: true
					},
					{
						label: 'sellerContactArea',
						title: '乙方联系人所在区',
						default: '',
						disabled: true
					},
					{
						label: 'sellerContactAddress',
						title: '乙方联系人详细地址',
						default: '',
						disabled: true
					},
					{
						label: 'sellerContactEmail',
						title: '乙方联系人电子邮箱',
						default: '',
						disabled: true
					}
				],
				active: false
			}
		],
		contractExtension: [
			{
				label: 'qualityIndexHtmlStr',
				title: '基准质量指标',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'qualityExamineWayHtmlStr',
				title: '质量和数量验收标准及方法',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'makePriceWayHtmlStr',
				title: '合同定价办法',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'settleWayHtmlStr',
				title: '结算付款方式',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'otherAppointHtmlStr',
				title: '其他约定',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'settleWayHtmlStr',
				title: '结算及付款期限',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'makePriceWayHtmlStr',
				title: '价格',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'transRiskHtmlStr',
				title: '运输、风险',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'rightDutyHtmlStr',
				title: '履行权利与责任',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'forceMajeureHtmlStr',
				title: '不可抗力',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'disputeResolutionHtmlStr',
				title: '争议解决',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'qualityExamineWayHtmlStr',
				title: '质量和数量验收',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'makePriceWayHtmlStr',
				title: '合同价格',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'customHtmlStr',
				title: '自定义条款说明',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'downstreamOtherAppointHtml',
				title: '其他事项',
				type: 'string',
				widget: 'editor',
				default: '',
				style: {
					display: 'block'
				},
				active: false
			}
		],
		commitment: [
			{
				label: 'downstreamSignCompanyName',
				title: '下游直接签约企业',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入下游直接签约企业',
				disabled: false,
				maxLength: 50,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'downstreamSignCompanyName',
				title: '上游直接签约企业',
				type: 'string',
				widget: 'input',
				default: '',
				placeholder: '请输入上游直接签约企业',
				disabled: false,
				maxLength: 50,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'downstreamSignHtmlStr',
				title: '承诺函-第一条款',
				type: 'string',
				widget: 'editor',
				default: '',
				placeholder: '请输入承诺函-第一条款',
				disabled: false,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: false
			},
			{
				label: 'downstreamOtherAppointHtml',
				title: '承诺函-其他事项',
				type: 'string',
				widget: 'editor',
				default: '',
				placeholder: '请输入承诺函-其他事项',
				disabled: false,
				props: {
					allowClear: true
				},
				style: {
					display: 'block'
				},
				active: true
			}
		]
	}
};
