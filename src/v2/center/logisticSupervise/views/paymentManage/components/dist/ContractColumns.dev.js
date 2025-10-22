'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.contractColumns = exports.testColumns = exports.transportationColumns = exports.commonColumns = void 0;

var customRender = function customRender(text) {
	return text || '-';
}; // 选择电子合同弹窗

var commonColumns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		fixed: 'left',
		customRender: customRender
	},
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender: customRender
	},
	{
		title: '收货人',
		dataIndex: 'consigneeCompanyName',
		customRender: customRender
	},
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: function customRender(text, row) {
			return ''.concat(row.deliveryStartDate || '', '-').concat(row.deliveryEndDate || '');
		}
	}
]; // 选择电子合同弹窗

exports.commonColumns = commonColumns;
var onLineOnlyColumns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		fixed: 'left',
		customRender: customRender
	},
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender: customRender
	},
	{
		title: '收货人',
		dataIndex: 'consigneeCompanyName',
		customRender: customRender
	},
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: function customRender(text, row) {
			return ''.concat(row.deliveryStartDate || '', '\u2014').concat(row.deliveryEndDate || '');
		}
	},
	{
		title: '签订日期',
		dataIndex: 'signTime',
		customRender: customRender
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		customRender: customRender
	},
	{
		title: '数量(吨)',
		dataIndex: 'quantity',
		scopedSlots: {
			customRender: 'quantity'
		}
	},
	{
		title: '基准价格(元/吨)',
		dataIndex: 'basePrice',
		scopedSlots: {
			customRender: 'basePrice'
		}
	},
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: customRender
	},
	{
		title: '煤种',
		dataIndex: 'coalTypeDesc',
		customRender: customRender
	}
]; // 线下合同特有

var offLineOnlyColumns = [
	{
		title: '合同编号',
		dataIndex: 'paperContractNo',
		fixed: 'left',
		customRender: customRender
	},
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender: customRender
	},
	{
		title: '收货人',
		dataIndex: 'consigneeCompanyName',
		customRender: customRender
	},
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: function customRender(text, row) {
			return ''.concat(row.deliveryStartDate || '', '\u2014').concat(row.deliveryEndDate || '');
		}
	},
	{
		title: '签订日期',
		dataIndex: 'contractSignTime',
		customRender: customRender
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		customRender: customRender
	},
	{
		title: '合同数量(吨)',
		dataIndex: 'contractQuantity',
		scopedSlots: {
			customRender: 'quantity'
		}
	},
	{
		title: '合同单价(元/吨)',
		dataIndex: 'contractPrice',
		scopedSlots: {
			customRender: 'contractPrice'
		}
	},
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: customRender
	}
]; // 运输合同特有

var transportationColumns = [
	{
		title: '运输合同编号',
		dataIndex: 'paperContractNo',
		fixed: 'left',
		customRender: customRender
	},
	{
		title: '承运人',
		dataIndex: 'consigneeCompanyName',
		customRender: customRender
	},
	{
		title: '托运人',
		dataIndex: 'test',
		customRender: customRender
	},
	{
		title: '合同有效期',
		dataIndex: 'execDateStart',
		customRender: function customRender(text, row) {
			return ''.concat(row.execDateStart || '', '\u2014').concat(row.execDateEnd || '');
		}
	},
	{
		title: '签订日期',
		dataIndex: 'contractSignTime',
		customRender: customRender
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		customRender: customRender
	},
	{
		title: '起运地',
		dataIndex: 'origin',
		customRender: customRender
	},
	{
		title: '目的地',
		dataIndex: 'destination',
		customRender: customRender
	}
]; // 仓储合同

exports.transportationColumns = transportationColumns;
var testColumns = [
	{
		title: '仓储合同编号',
		dataIndex: 'paperContractNo',
		fixed: 'left',
		customRender: customRender
	},
	{
		title: '仓库名称',
		dataIndex: 'stationName',
		customRender: customRender
	},
	{
		title: '仓储方名称',
		dataIndex: 'warehouseOwnerCompanyName',
		customRender: customRender
	},
	{
		title: '承租方名称',
		dataIndex: 'warehouseTenantCompanyName',
		customRender: customRender
	},
	{
		title: '合同签订日期',
		dataIndex: 'signDate',
		customRender: customRender
	}
]; // contractType: ONLINE / OFFLINE /TRANSPORT

exports.testColumns = testColumns;

var contractColumns = function contractColumns(contractType) {
	switch (contractType) {
		case 'ONLINE':
			return onLineOnlyColumns;

		case 'OFFLINE': {
			return offLineOnlyColumns;
		}

		case 'TRANSPORT':
			return transportationColumns;

		case 'test':
			return testColumns;

		default:
			break;
	}
};

exports.contractColumns = contractColumns;
