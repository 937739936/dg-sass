// 合同信息
const columns = [
	{
		title: '品名',
		dataIndex: 'materialName',
		width: 120
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 100
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 100
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		width: 120
	},
	{
		title: '可提件数',
		dataIndex: 'availablePieceQuantity',
		width: 120
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		width: 120
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'availableQuantity',
		width: 150
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		width: 120
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		width: 200
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		width: 200
	}
];
// 不指定规格合同清单
const noAppointColumns = [
	{
		title: '品名',
		dataIndex: 'materialName',
		width: 120
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 100
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 100
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		width: 120
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		width: 120
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		width: 120
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		width: 200
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		width: 200
	}
];
// 货转信息
const transferColumns = [
	{
		title: '品名',
		dataIndex: 'materialName',
		width: 120
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 100
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 100
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		width: 120
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		width: 120
	},
	{
		title: '可提件数',
		dataIndex: 'availablePieceQuantity',
		width: 120
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'availableQuantity',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 150
	}
];
// 不指定规格的货转信息
const noAppointTransferColumns = [
	{
		title: '品名',
		dataIndex: 'materialName',
		width: 120
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 100
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 100
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		width: 120
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		width: 120
	},
	{
		title: '货转件数',
		dataIndex: 'availablePieceQuantity',
		width: 120
	},
	{
		title: '货转数量（吨）',
		dataIndex: 'availableQuantity',
		width: 150,
		customRender: (text, record) => (text || text === 0 ? text : '/')
	}
];
const columnsList = [
	{
		title: '序号',
		dataIndex: 'id'
	},
	{
		dataIndex: '车船号',
		slots: { title: 'carNumber' },
		scopedSlots: { customRender: 'carNumber' }
	},
	{
		title: '司机姓名',
		dataIndex: 'carName',
		scopedSlots: { customRender: 'carName' }
	},
	{
		title: '手机号',
		dataIndex: 'carTel',
		scopedSlots: { customRender: 'carTel' }
	},
	{
		title: '身份证号',
		dataIndex: 'carId',
		scopedSlots: { customRender: 'carId' }
	},
	{
		title: '操作',
		dataIndex: 'methods',
		slots: { title: 'methods' },
		scopedSlots: { customRender: 'methods' }
	}
];

const columnsListUpload = [
	{
		title: '序号',
		dataIndex: '序号'
	},
	{
		title: '车船号',
		dataIndex: '车船号'
	},
	{
		title: '司机姓名',
		dataIndex: '司机姓名'
	},
	{
		title: '手机号',
		dataIndex: '手机号'
	},
	{
		title: '身份证号',
		dataIndex: '身份证号'
	}
];

const columnsSpecifications = [
	{
		dataIndex: 'materialName',
		slots: { title: 'materialName' },
		scopedSlots: { customRender: '品名' },
		width: 120
	},
	{
		dataIndex: 'materialTexture',
		slots: { title: 'materialTexture' },
		scopedSlots: { customRender: '材质' },
		width: 120
	},
	{
		dataIndex: 'specs',
		slots: { title: 'specs' },
		scopedSlots: { customRender: 'specs' },
		width: 120
	},
	{
		dataIndex: 'placeOfOrigin',
		slots: { title: 'placeOfOrigin' },
		scopedSlots: { customRender: '产地' },
		width: 120
	},
	{
		dataIndex: 'currentApplyPieceQuantity',
		slots: { title: 'currentApplyPieceQuantity' },
		scopedSlots: { customRender: 'currentApplyPieceQuantity' },
		width: 120
	},
	{
		dataIndex: 'theoreticalWeight',
		slots: { title: 'theoreticalWeight2' },
		scopedSlots: { customRender: 'theoreticalWeight' },
		width: 120
	},
	{
		dataIndex: 'currentApplyQuantity',
		slots: { title: 'currentApplyQuantity' },
		scopedSlots: { customRender: 'currentApplyQuantity' },
		width: 120
	},
	{
		dataIndex: 'metrologyWay',
		slots: { title: 'metrologyWay' },
		scopedSlots: { customRender: 'metrologyWay' },
		width: 120
	},
	{
		// title: "预提捆包号",
		dataIndex: 'baleNo',
		slots: { title: 'baleNo' },
		scopedSlots: { customRender: 'baleNo' },
		width: 120
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		slots: { title: 'warehouseInfo' },
		scopedSlots: { customRender: 'warehouseInfo' },
		width: 120
	},
	{
		title: '备注',
		dataIndex: 'remark',
		slots: { title: 'remark' },
		scopedSlots: { customRender: 'remark' },
		width: 150
	},
	{
		title: '操作',
		dataIndex: 'methods',
		slots: { title: 'methods' },
		scopedSlots: { customRender: 'methods' },
		fixed: 'right',
		width: 120
	}
];

const columnsNoSpecifications = [
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'theoreticalWeight'
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight'
	},
	{
		title: '可提件数',
		dataIndex: '可提件数'
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay'
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo'
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: '合同含税单价(元/吨)'
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: '合同不含税单价(元/吨)'
	}
];

const columnsNumberSpecifications = [
	{
		title: '品名',
		dataIndex: '品名'
	},
	{
		title: '材质',
		dataIndex: '材质'
	},
	{
		title: '规格',
		dataIndex: '规格'
	},
	{
		title: '产地',
		dataIndex: '产地'
	},
	{
		title: '可提件数',
		dataIndex: '可提件数'
	},
	{
		title: '理重(吨)',
		dataIndex: '理重(吨)'
	},
	{
		title: '计量方式',
		dataIndex: '计量方式'
	},
	{
		title: '捆包号',
		dataIndex: '捆包号'
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: '合同含税单价(元/吨)'
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: '合同不含税单价(元/吨)'
	}
];

const columnsCar = [
	{
		title: '序号',
		dataIndex: 'id',
		slots: { title: 'id' },
		scopedSlots: { customRender: 'id' }
	},
	{
		dataIndex: 'carNumber',
		slots: { title: 'carNumber' },
		scopedSlots: { customRender: 'carNumber' }
	},
	{
		title: '司机姓名',
		dataIndex: 'carName',
		slots: { title: 'carName' },
		scopedSlots: { customRender: 'carName' }
	},
	{
		title: '手机号',
		dataIndex: 'carTel',
		slots: { title: 'carTel' },
		scopedSlots: { customRender: 'carTel' }
	},
	{
		title: '身份证号',
		dataIndex: 'carId',
		slots: { title: 'carId' },
		scopedSlots: { customRender: 'carId' }
	},
	{
		title: '操作',
		dataIndex: 'methods',
		slots: { title: 'methods' },
		scopedSlots: { customRender: 'methods' }
	}
];
export {
	columns,
	columnsList,
	transferColumns,
	noAppointTransferColumns,
	columnsListUpload,
	columnsCar,
	columnsSpecifications, // 指定规格提货
	columnsNoSpecifications, // 不指定规格提货
	columnsNumberSpecifications, // 捆包号提货
	noAppointColumns
};
