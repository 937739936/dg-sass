export default {
	name: 'logisticsPlatform',
	label: '物流仓储中心',
	authCode: 'logisticsStorageCenter',
	menuList: [
		{
			name: '入库管理',
			icon: 'icon-rukuguanli',
			authCode: 'logisticsStorageCenter:inManage',
			children: [
				{
					name: '汽运上煤计划',
					authCode: 'logisticsStorageCenter:inManage:inCoalPlan',
					link: '/center/logisticsPlatform/coalplan/IN'
				},
				{
					name: '入库记录',
					authCode: 'logisticsStorageCenter:inManage:storage',
					link: '/center/logisticsPlatform/in'
				}
			]
		},
		{
			name: '短倒管理',
			icon: 'icon-duandaoguanli',
			authCode: 'logisticsStorageCenter:shortPlan',
			children: [
				{
					name: '下煤短倒计划',
					// authCode:'logisticsStorageCenter:inManage:inCoalPlan',
					link: '/center/logisticsPlatform/short_pour/plan'
				},
				{
					name: '下煤短倒记录',
					// authCode:'logisticsStorageCenter:inManage:storage',
					link: '/center/logisticsPlatform/records/shortPour'
				}
			]
		},
		{
			name: '出库管理',
			icon: 'icon-chukuguanli',
			authCode: 'logisticsStorageCenter:outManage',
			children: [
				{
					name: '汽运下煤计划',
					authCode: 'logisticsStorageCenter:outManage:outCoalPlan',
					link: '/center/logisticsPlatform/coalplan/OUT'
				},
				{
					name: '出库记录',
					authCode: 'logisticsStorageCenter:outManage:storage',
					link: '/center/logisticsPlatform/out'
				}
			]
		},
		{
			name: '提货管理',
			authCode: 'logisticsStorageCenter:lading',
			icon: 'icon-tihuoguanli1',
			children: [
				{
					name: '提货管理',
					link: '/center/logisticsPlatform/lading',
					authCode: 'logisticsStorageCenter:lading:lading'
				},
				{
					name: '放货管理',
					link: '/center/logisticsPlatform/delivery',
					authCode: 'logisticsStorageCenter:lading:release'
				},
				{
					name: '收货证明',
					link: '/center/logisticsPlatform/receipt',
					authCode: 'logisticsStorageCenter:lading:receipt'
				}
			]
		},
		{
			name: '配煤管理',
			icon: require('imgs/menu/menu-peimei.png'),
			authCode: 'logisticsStorageCenter:blendingManage', // 产品说和入库记录权限保持一致
			children: [
				{
					name: '配煤记录',
					authCode: 'logisticsStorageCenter:blendingManage:blendingCoal',
					link: '/center/logisticsPlatform/coalBlending'
				}
			]
		},
		{
			name: '库存管理',
			icon: 'icon-kucunguanli',
			authCode: 'logisticsStorageCenter:inventoryManage',
			children: [
				{
					name: '库存台账',
					link: '/center/logisticsPlatform/inventory'
				},
				{
					name: '库存盯市',
					authCode: 'logisticsStorageCenter:inventoryManage:price',
					link: '/center/logisticsPlatform/inventoryMarket'
				}
			]
		},
		{
			name: '视频监控',
			icon: 'icon-shipinjiankong',
			authCode: 'logisticsStorageCenter:videoSurveillance',
			children: [
				{
					name: '站台监控',
					link: '/center/logisticsPlatform/monitorList'
				}
			]
		},
		{
			name: '巡库管理',
			icon: 'icon-zhantaixunku1',
			authCode: 'logisticsStorageCenter:inManage', // 产品说和入库记录权限保持一致
			children: [
				{
					name: '巡库记录',
					authCode: 'logisticsStorageCenter:inManage:storage',
					link: '/center/logisticsPlatform/inspectRecords'
				}
			]
		},

		{
			name: '质检管理',
			icon: 'icon-zhantaixunku1',
			authCode: 'logisticsStorageCenter:inspectionTaskManage',
			children: [
				{
					name: '质检记录',
					authCode: 'logisticsStorageCenter:inspectionTaskManage:record',
					link: '/center/logisticsPlatform/qualityRecords'
				}
			]
		},
		{
			name: '盘库管理',
			icon: 'icon-pankuguanli',
			authCode: 'logisticsStorageCenter:inventoryTaskManage:inventoryTask',
			children: [
				{
					name: '盘库管理',
					authCode: 'logisticsStorageCenter:inventoryTaskManage:inventoryTask',
					link: '/center/logisticsPlatform/inventoryCheck'
				}
			]
		},
		{
			name: '系统管理',
			icon: 'icon-xitongguanli',
			authCode: 'logisticsStorageCenter:sysManage',
			children: [
				{
					name: '站台信息管理',
					authCode: 'logisticsStorageCenter:sysManage:houseManage',
					link: '/center/logisticsPlatform/platformInfo'
				},
				{
					name: '仓房管理',
					authCode: 'logisticsStorageCenter:sysManage:houseManage',
					link: '/center/logisticsPlatform/warehouse'
				},
				{
					name: '磅房管理',
					authCode: 'logisticsStorageCenter:sysManage:scaleManage:houseManage',
					link: '/center/logisticsPlatform/weighthouse'
				},
				{
					name: '视频配置',
					authCode: 'logisticsStorageCenter:sysManage:cameraConfig',
					link: '/center/logisticsPlatform/videoConfig'
				},
				{
					name: '盘库配置',
					authCode: 'logisticsStorageCenter:sysManage:inventoryTaskConfig',
					link: '/center/logisticsPlatform/inventoryConfig'
				},
				{
					name: '煤种配置',
					authCode: 'logisticsStorageCenter:sysManage:coalTypeConfig',
					link: '/center/logisticsPlatform/coalConfig'
				},
				{
					name: '打印机配置',
					authCode: 'logisticsStorageCenter:sysManage:houseConfig',
					link: '/center/logisticsPlatform/printerConfig'
				},
				{
					name: '下煤短倒配置',
					authCode: 'logisticsStorageCenter:sysManage:shortPlanConfig',
					link: '/center/logisticsPlatform/shortPourConfig'
				}
			]
		},
		{
			name: '电子仓单管理',
			icon: 'icon-dianzicangdanguanli',
			authCode: 'logisticsStorageCenter:warehouseReceiptManage',
			children: [
				{
					name: '仓单开立',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptApply',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list'
				},
				{
					name: '仓单开立审核',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptApplyAudit',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list'
				},
				{
					name: '仓单提货',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptDelivery',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/list'
				},
				{
					name: '仓单提货审核',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptDeliveryAudit',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/auditList'
				},
				{
					name: '仓单过户',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptTransfer',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/list'
				},
				{
					name: '仓单过户审核',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptTransferAudit',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/auditList'
				},
				{
					name: '仓单查询',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:receiptQuery',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/list'
				},
				{
					name: '仓单协议管理',
					authCode: 'logisticsStorageCenter:warehouseReceiptManage:agreement',
					link: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list'
				}
			]
		}
	]
};
