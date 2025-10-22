/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-22 16:05:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 16:21:28
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/config/orderList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const columns = [
	{
		title: '提货单号',
		dataIndex: 'serialNo',
		key: 'serialNo',
		width: 300
	},
	{
		title: '提货数量(吨)',
		dataIndex: 'quantityTotal',
		key: 'quantityTotal',
		width: 120
	},
	{
		title: '仓库简称',
		dataIndex: 'warehouseShortName',
		key: 'warehouseShortName',
		width: 120
	},
	{
		title: '申请提货企业',
		dataIndex: 'applyCompanyName',
		key: 'applyCompanyName',
		customRender: (text, record) => text || '-',
		width: 180
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		width: 120,
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		width: 250
	},
	{
		title: '提货申请单号',
		dataIndex: 'applyTakeSerialNo',
		key: 'applyTakeSerialNo',
		customRender: (text, record) => text || '-',
		width: 280
	},
	{
		title: '提单有效期',
		dataIndex: 'validity',
		key: 'validity',
		width: 220,
		scopedSlots: { customRender: 'validity' }
	},
	{
		title: '制单员',
		dataIndex: 'makePaperName',
		key: 'makePaperName',
		width: 120
	},
	{
		title: '创建人',
		dataIndex: 'createdName',
		key: 'createdName',
		width: 120
	},
	{
		title: '创建时间',
		dataIndex: 'createdDate',
		key: 'createdDate',
		width: 180
	},
	{
		title: '是否有提单凭证',
		dataIndex: 'hasTakeFlag',
		key: 'hasTakeFlag',
		width: 130
	},
	{
		title: '操作',
		dataIndex: 'methods',
		key: 'methods',
		slots: { title: 'methods' },
		scopedSlots: { customRender: 'methods' },
		width: 200,
		fixed: 'right'
	}
];

export { columns };
