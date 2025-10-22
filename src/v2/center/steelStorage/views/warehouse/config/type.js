/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-24 09:46:26
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-28 10:52:16
 * @FilePath: /dg-trade-frontend/src/views/center/steels/contract/warehouse/config/type.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const warehouseType = [
	{
		value: 1,
		label: '仓库'
	},
	{
		value: 2,
		label: '站台'
	},
	{
		value: 3,
		label: '港口'
	}
];

const goodsType = [
	{
		value: 1,
		label: '煤炭'
	},
	{
		value: 2,
		label: '粮食'
	},
	{
		value: 3,
		label: '钢材'
	},
	{
		value: 4,
		label: '化工品'
	}
];

const statusType = [
	{
		value: 1,
		label: '新建'
	},
	{
		value: 2,
		label: '启用'
	},
	{
		value: 3,
		label: '停用'
	}
];

const fileTypeList = [
	{
		value: 'WAREHOUSE_RENTAL_CONTRACT',
		text: '仓储租赁合同(双签)'
	}
];

export { warehouseType, goodsType, statusType, fileTypeList };
