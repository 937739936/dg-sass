/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-24 09:25:13
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-26 12:20:43
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/config/tableList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const columns = [
	{
		title: '提货单号',
		dataIndex: 'id',
		key: 'id',
		width: 290
	},
	{
		title: '提货数量(吨)',
		dataIndex: 'amount',
		key: 'amount',
		width: 120
	},
	{
		title: '仓库简称',
		dataIndex: 'warehouse',
		key: 'warehouse',
		width: 130
	},
	{
		title: '申请提货企业',
		dataIndex: 'enterprise',
		key: 'enterprise',
		width: 170
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		width: 100
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		width: 100
	},
	{
		title: '提货申请单号',
		dataIndex: 'applyID',
		key: 'applyID',
		width: 120
	},
	{
		title: '提单有效期',
		dataIndex: 'validity',
		key: 'validity',
		width: 120
	},
	{
		title: '制单员',
		dataIndex: 'create',
		key: 'create',
		width: 100
	},
	{
		title: '创建人',
		dataIndex: 'person',
		key: 'person',
		width: 100
	},
	{
		title: '创建时间',
		dataIndex: 'time',
		key: 'time',
		width: 100
	},
	{
		title: '是否有提单凭证',
		dataIndex: 'voucher',
		key: 'voucher',
		width: 100
	},
	{
		title: '操作',
		dataIndex: 'methods',
		key: 'methods',
		width: 100
	}
];

export { columns };
