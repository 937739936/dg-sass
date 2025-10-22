export default {
	name: 'steelStorage',
	label: '钢材仓储平台',
	authCode: 'steelWarehouse',
	menuList: [
		{
			name: '基础资料',
			icon: 'icon-jichuziliao',
			children: [
				{
					name: '仓储租赁合同',
					authCode: 'steel:contract:warehouseLease',
					link: '/center/steelStorage/warehouse/list'
				}
			]
		},
		{
			name: '库存管理',
			icon: 'icon-kucunguanli',
			authCode: 'steelWarehouse:store',
			children: [
				{
					name: '仓库监控查看',
					authCode: 'steelWarehouse:store:monitor',
					link: '/center/steelStorage/stock/monitoring'
				},
				{
					name: '明细库存查询',
					authCode: 'steelWarehouse:store:monitor',
					link: '/center/steelStorage/stock/detailInventory'
				},
				{
					name: '汇总库存查询',
					authCode: 'steelWarehouse:store:monitor',
					link: '/center/steelStorage/stock/collectInventory'
				}
				// {
				//   name: "库存查看",
				//   authCode: 'steelWarehouse:store:store',
				//   link: "/center/steelStorage/stock/inventory",
				// },
				// {
				//   name: "库存总览",
				//   authCode: 'steelWarehouse:store:store',
				//   link: "/center/steelStorage/stock/stockView",
				// },
			]
		},
		{
			name: '入库管理',
			icon: 'icon-rukuguanli',
			children: [
				{
					name: '入库记录查询',
					authCode: 'steelWarehouse:instore',
					link: '/center/steelStorage/inStorage/list'
				}
			]
		},
		{
			name: '出库管理',
			icon: 'icon-chukuguanli',
			children: [
				{
					name: '出库记录查询',
					authCode: 'steelWarehouse:outstore',
					link: '/center/steelStorage/outStorage/list'
				}
			]
		},
		{
			name: '实提管理',
			authCode: 'steelWarehouse:reportForm',
			icon: 'icon-shitiguanli',
			children: [
				{
					name: '实提记录查询',
					link: '/center/steelStorage/realExtract/list',
					authCode: 'steelWarehouse:reportForm:inoutAnalysis'
				}
			]
		},
		{
			name: '报表管理',
			authCode: 'steelWarehouse:reportForm',
			icon: 'icon-baobiaoguanli',
			children: [
				{
					name: '出入库统计查询',
					link: '/center/steelStorage/statement/outAndIn',
					authCode: 'steelWarehouse:reportForm:inoutAnalysis'
				},
				{
					name: '库存总览',
					authCode: 'steelWarehouse:store:store',
					link: '/center/steelStorage/statement/stockView'
				}
				// {
				//   name: "库位分布查看报表",
				//   link: "/center/steelStorage/statement/location",
				//   authCode: 'steelWarehouse:reportForm:store',
				// },
				// {
				//   name: "仓库采购合同货物账龄报表",
				//   link: "/center/steelStorage/statement/purchase",
				//   authCode: 'steelWarehouse:reportForm:storeDuration',

				// },
			]
		},
		{
			name: '查仓报告管理',
			authCode: 'steelWarehouse:reportForm',
			icon: 'icon-chacangbaogaoguanli',
			authCode: 'steelWarehouse:reportForm:inoutAnalysis',
			children: [
				{
					name: '查仓报告',
					link: '/center/steelStorage/findWarehouse/report/list',
					authCode: 'steelWarehouse:reportForm:inoutAnalysis'
				}
			]
		}
	]
};
