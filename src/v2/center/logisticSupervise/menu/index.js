/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
	name: 'logisticSupervise',
	label: '物流运输监管',
	authCode: 'logicDeliverMonitor',
	menuList: [
		//  合同
		{
			name: '合同管理',
			authCode: '',
			icon: 'icon-fuwufeixieyiguanli',
			children: [
				{
					name: '运输合同',
					link: '/center/logisticSupervise/contract/transport',
					authCode: 'logicDeliverMonitor:contractManager:deliver'
				},
				{
					name: '仓储合同',
					link: '/center/logisticSupervise/contract/storage',
					authCode: 'logicDeliverMonitor:contractManager:warehouse'
				}
			]
		},
		{
			name: '发运管理',
			authCode: '',
			icon: 'icon-shoufahuoguanli',
			children: [
				{
					name: '发运记录',
					link: '/center/logisticSupervise/receive/send',
					authCode: 'logicDeliverMonitor:deliverManager:deliverRecord'
				},
				{
					name: '物流轨迹',
					link: '/center/logisticSupervise/receive/trajectory',
					authCode: 'logicDeliverMonitor:deliverManager:logisticsTrack'
				}
			]
		},
		// 你们在上面添加
		{
			name: '付款管理',
			authCode: '',
			icon: 'icon-fuwufeixieyiguanli',
			children: [
				{
					name: '付款记录',
					link: '/center/logisticSupervise/paymentManage',
					authCode: 'logicDeliverMonitor:paymentManager:paymentRecord'
				}
			]
		},
		//  结算单
		{
			name: '结算单管理',
			authCode: '',
			icon: 'icon-jiesuandanguanli',
			children: [
				{
					name: '运输结算单',
					link: '/center/logisticSupervise/statement/transSettle',
					authCode: 'logicDeliverMonitor:statementManager:deliver'
				},
				{
					name: '仓储费结算单',
					link: '/center/logisticSupervise/statement/storage',
					authCode: 'logicDeliverMonitor:statementManager:warehouse'
				}
			]
		},
		{
			name: '发票管理',
			authCode: '',
			icon: require('imgs/menu/wodefapiao.png'),
			children: [
				{
					name: '运费发票',
					link: '/center/logisticSupervise/invoice/freight',
					authCode: 'logicDeliverMonitor:invoiceManager:deliver'
				},
				{
					name: '仓储发票',
					link: '/center/logisticSupervise/invoice/buy',
					authCode: 'logicDeliverMonitor:invoiceManager:warehouse'
				}
			]
		},
		{
			name: '库存管理',
			authCode: '',
			icon: 'icon-kucunguanli',
			children: [
				{
					name: '入库记录',
					link: '/center/logisticSupervise/in',
					authCode: 'logicDeliverMonitor:storeManager:inputRecord'
				},
				{
					name: '出库记录',
					link: '/center/logisticSupervise/out',
					authCode: 'logicDeliverMonitor:storeManager:outputRecord'
				},
				{
					name: '库存台账',
					link: '/center/logisticSupervise/inventory',
					authCode: 'logicDeliverMonitor:storeManager:storeBook'
				}
			]
		},
		{
			name: '巡库管理',
			icon: 'icon-zhantaixunku1',
			authCode: '',
			children: [
				{
					name: '巡库记录',
					authCode: 'logicDeliverMonitor:viewStoreManager:record',
					link: '/center/logisticSupervise/inspect/records'
				}
			]
		},
		{
			name: '质检管理',
			icon: 'icon-zhantaixunku1',
			authCode: 'logicDeliverMonitor:inspectionTaskManage',
			children: [
				{
					name: '质检记录',
					authCode: 'logicDeliverMonitor:inspectionTaskManage:record',
					link: '/center/logisticSupervise/quality/records'
				}
			]
		},
		{
			name: '系统管理',
			icon: 'icon-xitongguanli',
			authCode: '',
			children: [
				{
					name: '煤种配置',
					authCode: 'logicDeliverMonitor:systemManager:coalConfig',
					link: '/center/logisticSupervise/systemManagement/coalConfig'
				},
				{
					name: '仓房管理',
					authCode: 'logicDeliverMonitor:systemManager:warehouseManager',
					link: '/center/logisticSupervise/systemManagement/warehouse'
				}
			]
		}
	]
};
