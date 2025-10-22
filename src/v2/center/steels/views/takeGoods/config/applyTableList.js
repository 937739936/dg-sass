/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-22 16:05:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 11:31:04
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/config/applyTableList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const columns = [
	{
		title: '提货申请单号',
		dataIndex: 'serialNo',
		key: 'serialNo',
		width: 290
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		key: 'sellCompanyName',
		width: 200
	},
	{
		title: '申请提货总件数',
		dataIndex: 'pieceQuantityTotal',
		key: 'pieceQuantityTotal',
		width: 130
	},
	{
		title: '申请提货总数量(吨)',
		dataIndex: 'quantityTotal',
		key: 'quantityTotal',
		width: 170
	},
	{
		title: '钢材种类',
		dataIndex: 'steelType',
		key: 'steelType',
		width: 150,
		scopedSlots: { customRender: 'steelType' }
	},
	{
		title: '提货方式',
		dataIndex: 'takeType',
		key: 'takeType',
		width: 150,
		scopedSlots: { customRender: 'takeType' }
	},
	{
		title: '预计提货日期',
		dataIndex: 'expectTakeDate',
		key: 'expectTakeDate',
		width: 140,
		// sorter: (a, b) => new Date(a.expectTakeDate).getTime() - new Date(b.expectTakeDate).getTime(),
		sortDirections: ['descend', 'ascend']
	},
	{
		title: '关联提货单号',
		dataIndex: 'takeSerialNo',
		key: 'takeSerialNo',
		width: 290,
		slots: { title: 'takeSerialNo' },
		scopedSlots: { customRender: 'takeSerialNo' }
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		slots: { title: 'status' },
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '创建时间',
		dataIndex: 'createdDate',
		key: 'createdDate',
		width: 200
	},
	{
		title: '操作',
		dataIndex: 'methods',
		key: 'methods',
		slots: { title: 'methods' },
		scopedSlots: { customRender: 'methods' },
		width: 220,
		fixed: 'right'
	}
];

export { columns };
