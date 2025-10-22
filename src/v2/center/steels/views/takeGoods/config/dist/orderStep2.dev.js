'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.columnsOperation =
	exports.columnsPut =
	exports.columnsEnclosure =
	exports.relationPayment =
	exports.columnsCar =
	exports.columns =
		void 0;
var columns = [
	{
		title: '品名',
		dataIndex: 'materialName',
		key: 'materialName',
		width: 80
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		key: 'materialTexture',
		width: 90
	},
	{
		title: '规格',
		dataIndex: 'specs',
		key: 'specs',
		width: 90
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		key: 'placeOfOrigin',
		width: 80
	},
	{
		title: '可提件数',
		dataIndex: 'canTakePieceQuantity',
		key: 'canTakePieceQuantity',
		scopedSlots: {
			customRender: 'canTakePieceQuantity'
		},
		width: 100
	},
	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		customRender: function customRender(text) {
			return text ? text : '/';
		},
		width: 100
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		scopedSlots: {
			customRender: 'theoreticalWeight'
		},
		width: 100
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'canTakeQuantity',
		key: 'canTakeQuantity',
		width: 120
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		width: 120
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140,
		slots: {
			title: 'takeUnitPrice'
		},
		scopedSlots: {
			customRender: 'takeUnitPrice'
		}
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',
		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		key: 'baleNo',
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180,
		slots: {
			title: 'goodTaxMount'
		},
		scopedSlots: {
			customRender: 'goodTaxMount'
		}
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 80
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 80
	}
];
exports.columns = columns;
var columnsPut = [
	{
		title: '实提件数',
		dataIndex: 'realTakePieceQuantity',
		key: 'realTakePieceQuantity',
		width: 120,
		scopedSlots: {
			customRender: 'realTakePieceQuantity'
		}
	},
	{
		title: '实提数量',
		dataIndex: 'realTakeQuantity',
		key: 'realTakeQuantity',
		width: 120,
		scopedSlots: {
			customRender: 'realTakeQuantity'
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		key: 'materialName',
		width: 80,
		scopedSlots: {
			customRender: 'materialName'
		}
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		key: 'materialTexture',
		width: 90
	},
	{
		title: '规格',
		dataIndex: 'specs',
		key: 'specs',
		width: 90
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		key: 'placeOfOrigin',
		width: 80
	},
	{
		title: '可提件数',
		dataIndex: 'canTakePieceQuantity',
		key: 'canTakePieceQuantity',
		customRender: function customRender(text) {
			return text ? text : '/';
		},
		width: 100
	},
	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		customRender: function customRender(text) {
			return text ? text : '/';
		},
		width: 100
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		customRender: function customRender(text) {
			return text ? text : '/';
		},
		width: 100
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'canTakeQuantity',
		key: 'canTakeQuantity',
		width: 120
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		width: 120
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',
		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		key: 'baleNo',
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180,
		scopedSlots: {
			customRender: 'goodTaxMount'
		}
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 80
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 80
	}
];
exports.columnsPut = columnsPut;
var columnsCar = [
	{
		dataIndex: 'id',
		key: 'id',
		title: '序号',
		scopedSlots: {
			customRender: 'id'
		}
	},
	{
		dataIndex: 'carNumber',
		key: 'carNumber',
		title: '车船号',
		scopedSlots: {
			customRender: 'carNumber'
		}
	},
	{
		dataIndex: 'carName',
		key: 'carName',
		title: '司机姓名',
		scopedSlots: {
			customRender: 'carName'
		}
	},
	{
		dataIndex: 'carTel',
		key: 'carTel',
		title: '手机号',
		scopedSlots: {
			customRender: 'carTel'
		}
	},
	{
		dataIndex: 'carId',
		key: 'carId',
		title: '身份证号',
		scopedSlots: {
			customRender: 'carId'
		}
	}
];
exports.columnsCar = columnsCar;
var relationPayment = [
	{
		title: '回款类型',
		key: 'fundType',
		dataIndex: 'fundType',
		scopedSlots: {
			customRender: 'fundType'
		}
	},
	{
		title: '回款金额',
		key: 'collectionAmount',
		dataIndex: 'collectionAmount',
		scopedSlots: {
			customRender: 'collectionAmount'
		}
	},
	{
		title: '可使用回款金额(元)',
		key: 'availableCollectionAmount',
		dataIndex: 'availableCollectionAmount',
		scopedSlots: {
			customRender: 'availableCollectionAmount'
		}
	},
	{
		title: '本次使用回款金额(元)',
		key: 'currentUseAmount',
		dataIndex: 'currentUseAmount',
		scopedSlots: {
			customRender: 'currentUseAmount'
		}
	},
	{
		title: '回款日期',
		key: 'collectionDate',
		dataIndex: 'collectionDate'
	},
	{
		title: '付款方',
		key: 'companyName',
		dataIndex: 'companyName'
	},
	{
		title: '回款登记编号',
		key: 'collectionSerialNo',
		dataIndex: 'collectionSerialNo'
	}
];
exports.relationPayment = relationPayment;
var columnsEnclosure = [
	{
		title: '类型',
		dataIndex: 'typeDesc'
	},
	{
		title: '文件名',
		dataIndex: 'fileName'
	},
	{
		title: '操作',
		dataIndex: 'methods',
		scopedSlots: {
			customRender: 'methods'
		}
	}
];
exports.columnsEnclosure = columnsEnclosure;
var columnsOperation = [
	{
		title: '操作',
		dataIndex: 'operateType'
	},
	{
		title: '操作人',
		dataIndex: 'createdName'
	},
	{
		title: '操作内容',
		dataIndex: 'operateContent'
	},
	{
		title: '操作时间',
		dataIndex: 'createdDate'
	},
	{
		title: '备注',
		dataIndex: 'remark'
	}
];
exports.columnsOperation = columnsOperation;
