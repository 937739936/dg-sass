'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.contractSearchList = void 0;

var _globalCode = require('@sub/utils/globalCode.js');

var BusinessTypeSearchItem = {
	decorator: ['businessType'],
	addonBeforeTitle: '业务类型',
	type: 'select',
	placeholder: '请选择业务类型',
	// 应收、代理、标准仓押、代采、自营、其他”
	options: [
		{
			value: 'ACCOUNT_RECEIVABLE',
			label: '应收'
		},
		{
			value: 'AGENT',
			label: '代理'
		},
		{
			value: 'WAREHOUSE_RECEIPTS_PLEDGE',
			label: '标准仓押'
		},
		{
			value: 'SOURCING_AGENT',
			label: '代采'
		},
		{
			value: 'SELF_OPERATION',
			label: '自营'
		},
		{
			value: 'OTHER',
			label: '其他'
		}
	]
};
var onLineSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: [
			{
				label: '火运',
				value: 'TRAIN'
			},
			{
				label: '汽运',
				value: 'AUTOMOBILE'
			},
			{
				label: '汽运和火运',
				value: 'AUTOMOBILE_AND_TRAIN'
			},
			{
				label: '船运',
				value: 'SHIP'
			},
			{
				label: '不涉及运输',
				value: 'NONE'
			}
		]
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		allowClear: true,
		placeholder: '请选择煤种',
		options: (0, _globalCode.filterCodeByKey)('goods_type').map(function (item) {
			return {
				value: item.value,
				label: item.text
			};
		}) // 动力煤、焦煤、焦炭、兰炭、无烟煤、喷吹煤”
		// options: [
		// 	{ value: 'STEAM_COAL', label: '动力煤' },
		// 	{ value: 'COKING_COAL', label: '焦煤' },
		// 	{ value: 'COKE', label: '焦炭' },
		// 	{ value: 'SEMI_COKE', label: '兰炭' },
		// 	{ value: 'SMOKELESS_COAL', label: '无烟煤' },
		// 	{ value: 'INJECTION_COAL', label: '喷吹煤' }
		// ]
	},
	BusinessTypeSearchItem,
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];
var transportationSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: [
			{
				label: '火运',
				value: 'TRAIN'
			},
			{
				label: '汽运',
				value: 'AUTOMOBILE'
			},
			{
				label: '船运',
				value: 'SHIP'
			}
		]
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];
var testSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '仓储合同编号',
		type: 'input',
		placeholder: '请输入仓储合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入仓储方或者承租方'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '仓库名称',
		type: 'select',
		allowClear: true,
		placeholder: '请选择仓库',
		options: []
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeStart', 'signTimeEnd']
	}
]; // contractType: ONLINE / OFFLINE /TRANSPORT

var contractSearchList = function contractSearchList(contractType) {
	switch (contractType) {
		case 'ONLINE':
			return onLineSearchList;

		case 'OFFLINE': {
			var offLineSearchList = [].concat(transportationSearchList);
			offLineSearchList.splice(transportationSearchList.length - 1, 0, BusinessTypeSearchItem);
			return offLineSearchList;
		}

		case 'TRANSPORT':
			return transportationSearchList;

		case 'test':
			return testSearchList;

		default:
			return [];
	}
};

exports.contractSearchList = contractSearchList;
