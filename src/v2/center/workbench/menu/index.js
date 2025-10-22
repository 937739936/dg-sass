export default {
	name: 'workbenchv2',
	label: '工作台',
	authCode: 'workbench',
	menuList: [
		{
			name: '工作台',
			authCode: 'workbench',
			children: [
				{
					name: '我的待办',
					authCode: 'workbench:undo',
					link: '/center/workbench/myToDoList'
				}
			]
		}
	]
};
