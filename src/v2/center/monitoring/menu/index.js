/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
export default {
	authCode: 'monitor',
	label: '数据监控',
	menuList: [
		{
			name: '全业务线查看',
			authCode: 'monitor:fullBusinessLine',
			icon: 'icon-quanyewuxianchakan',
			children: [
				{
					name: '全业务线查看',
					link: '/center/monitoring/fullBusinessLine'
				}
			]
		},
		{
			name: '业务动态监控',
			authCode: 'monitor:dynamic',
			icon: 'icon-yewudongtaijiankong',
			children: [
				{
					name: '业务动态监控',
					authCode: 'monitor:dynamic',
					link: '/center/monitoring/dynamicMonitoring'
				}
			]
		},
		{
			name: '业务风控详情',
			authCode: 'monitor:risk',
			icon: 'icon-fengxianjiankongtongji',
			children: [
				{
					name: '业务风控详情',
					authCode: 'monitor:risk',
					link: '/center/monitoring/RiskManagementDetail'
				}
			]
		},
		{
			name: '业务运营实况',
			authCode: 'monitor:operation',
			icon: 'icon-yewuyunyingshikuang',
			children: [
				{
					name: '业务运营实况',
					authCode: 'monitor:operation',
					link: '/center/monitoring/businessOperation'
				}
			]
		}
	]
};
