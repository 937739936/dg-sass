// 根据合同模板展示字段不同
export function basicInfoDataTrain() {
	var basicInfoDataTrain = [];
	basicInfoDataTrain.push(
		{
			type: 'input',
			label: '合同编号',
			value: 'contractNo'
		},
		{
			type: 'input',
			label: '买方名称',
			value: 'buyerName'
		},
		{
			type: 'input',
			label: '品种',
			value: 'coalType'
		},
		{
			type: 'input',
			label: '品名',
			value: 'goodsName'
		},
		{
			type: 'input',
			label: '运输方式',
			value: 'transType'
		},
		{
			type: 'input',
			label: '发站',
			value: 'deliveryStation'
		},
		{
			type: 'input',
			label: '托运人',
			value: 'shipperName'
		},
		{
			type: 'input',
			label: '到站',
			value: 'arriveStation'
		},
		{
			type: 'input',
			label: '收货人',
			value: 'receiverName'
		}
	);
	return basicInfoDataTrain;
}
export function basicInfoDataCar() {
	let basicInfoDataCar = [];
	basicInfoDataCar.push(
		{
			type: 'input',
			label: '合同编号',
			value: 'contractNo'
		},
		{
			type: 'input',
			label: '买方名称',
			value: 'buyerName'
		},
		{
			type: 'input',
			label: '品种',
			value: 'coalType'
		},
		{
			type: 'input',
			label: '品名',
			value: 'goodsName'
		},
		{
			type: 'input',
			label: '运输方式',
			value: 'transType'
		},
		{
			type: 'input',
			label: '发货矿点',
			value: 'minePoint'
		},
		{
			type: 'input',
			label: '收货人',
			value: 'consigneeName'
		}
	);
	return basicInfoDataCar;
}
export function basicInfoDataShip() {
	let basicInfoDataShip = [];
	basicInfoDataShip.push(
		{
			type: 'input',
			label: '合同编号',
			value: 'contractNo'
		},
		{
			type: 'input',
			label: '买方名称',
			value: 'buyerName'
		},
		{
			type: 'input',
			label: '品种',
			value: 'coalType'
		},
		{
			type: 'input',
			label: '品名',
			value: 'goodsName'
		},
		{
			type: 'input',
			label: '运输方式',
			value: 'transType'
		},
		{
			type: 'input',
			label: '交货地',
			value: 'deliveryPlace'
		},
		{
			type: 'input',
			label: '卸货地',
			value: 'unloadGoodsPlace'
		},
		{
			type: 'input',
			label: '收货人名称',
			value: 'shipConsigneeName'
		}
	);

	return basicInfoDataShip;
}
