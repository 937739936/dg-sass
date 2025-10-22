/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-24 09:25:13
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-28 15:26:06
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/config/goodsStep2.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		width: 250
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		width: 200
	},
	{
		title: '钢材种类',
		dataIndex: 'steelTypeDesc',
		width: 160
	},
	{
		title: '交货方式',
		dataIndex: 'deliveryModeDesc',
		width: 160
	},
	{
		title: '合同期限',
		dataIndex: 'effectiveDate',
		slots: { title: 'effectiveDate' },
		scopedSlots: { customRender: 'effectiveDate' },
		width: 240
	},
	{
		title: '合同总数量(吨)',
		dataIndex: 'quantity',
		width: 160
	},
	{
		title: '已提货数量(吨)',
		dataIndex: 'issuedQuantity',
		width: 160
	}
];

export { columns };
