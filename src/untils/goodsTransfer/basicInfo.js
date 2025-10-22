/**
 * 目前主要用于我的收发货模块
 * type由合同模板、运费支付方式、运输方式共同决定
 * @type {string[]}
// 001--汽运
// 002--火运，运费支付方式不是下游支付
// 003--火运，运费支付方式是下游支付
// 005--汽运和火运
// 008--船运、焦炭
// 010--船运，兰炭、喷吹煤、无烟煤
// 011--船运、动力煤非009，非010
// 012--船运、焦煤003（云成嘉瑞与陕煤专用）
// 013--船运、动力煤009（云成国内船运）
// 014--船运、动力煤010（云成国内船运）
 *
 *  String[] directGoodsTransferTypes  发货提交时直接开具货转的type
 *  Function getOrderInfo  获取货转开具的基本信息和收发货信息字段
 *  Function getTitle  获取货转开具的收发货信息字段title
 *  Function getReceiveOrDeliverFlag  获取基于什么方式开具货转，目前有基于收货、基于发货、以及汽运和火运
 */
import { indexOf } from 'core-js/fn/array'
import CONSTANTS from '@sub/utils/constants.js'
let directGoodsTransferTypes = ['002', '008', '010'] // 直接开具货转的类型 // 002--火运，运费支付方式不是下游支付、008--船运、焦炭、010--船运，兰炭、喷吹煤、无烟煤
let allBaseInfoList = [
	{
		type:'input',
		label:'合同编号',
		value:'contractNo'
	},{
		type:'input',
		label:'订单编号',
		value:'orderNo'
	},{
		type:'input',
		label:'品种',
		value:'coalType',
		filterValue: 'coalTypeText'
	},{
		type:'input',
		label:'运输方式',
		value:'transType',
		filterValue: 'transTypeText'
	},{
		type:'input',
		label:'买方名称',
		value:'buyerName'
	},{
		type:'input',
		label:'垛位号',
		value:'stackNum'
	},{
		type:'input',
		label:'订单数量',
		value:'quantity'
	},{
		type:'input',
		label:'提货期限',
		value:'signTime'
	},{
		type:'input',
		label:'卖方名称',
		value:'sellerName'
	},{
		type:'input',
		label:'交货地', // 船运平仓
		value:'deliveryPlace'
	},{
		type:'selectTag',
		label:'收货人',
		value:'consigneeCompanyName'
	},{
		type:'input',
		label:'发货矿点',
		value:'originPlace'
	},{
		type:'date',
		label:'提单日期',
		value:'billLoadingDate'
	}, {
		type:'input',
		label:'提单号',
		value:'billLoadingNo'
	}
]
let allGoodsInfoList = [
	{
		title:'批次号',
		dataIndex:'batchNo'
	}, {
		title:'收货编号',
		dataIndex:'receiveNo'
	}, {
		title:'品名',
		dataIndex:'goodsName'
	}, {
		title:'收货数量',
		dataIndex:'receiveQuantity'
	}, {
		title:'收货日期',
		dataIndex:'receiveDate'
	}, {
		title:'车数',
		dataIndex:'trainNum'
	}, {
		title:'发货数量',
		dataIndex:'deliverQuantity'
	}, {
		title:'发货日期',
		dataIndex:'deliverDate'
	}, {
		title:'托运人',
		dataIndex:'shipperName'
	}, {
		title:'发站',
		dataIndex:'deliveryStation'
	}, {
		title:'到站',
		dataIndex:'arriveStation'
	}, {
		title:'铁路计划号',
		dataIndex:'railwayPlanNo',
		scopedSlots: { customRender: 'railwayPlanNo' }
	}, {
		title:'交货地',
		dataIndex:'deliveryPlace'
	}, {
		title:'装货数量',
		dataIndex:'deliverQuantity'
	}, {
		title:'装货日期',
		dataIndex:'deliverDate'
	}, {
		title:'收货人',
		dataIndex:'receiverName'
	}, {
		title:'发货人',
		dataIndex:'deliverName'
	}, {
		title:'车皮信息',
		dataIndex:'operation',
		scopedSlots: { customRender: 'operation' }
	},{
		title:'船舶信息',
		dataIndex:'operationShip',
		scopedSlots: { customRender: 'operationShip' }
	}, {
		title:'车次',
		dataIndex:'trainNumber'
	},{
		title:'卸货港',
		dataIndex:'shipDischargingPortName'
	}, {
		title:'装货港',
		dataIndex:'shipLoadingPortName'
	}
]

//针对目前系统中船运的货转开具功能，增加新字段：“提单号”、“提单日期”，动力煤合同模板009和010，焦煤003因其合同模板是定制化的不做调整,调整 008、010、011---Edit by gyn 2022-9-20
let infoMap = {
	'001': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称', '收货人', '发货矿点'], // 汽运——基本信息
		goodsInfo: ['批次号', '收货编号', '品名', '收货数量', '收货日期', '车数'] // 汽运——收货信息
	},
	'002': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称', '收货人'], // 火运——基本信息
		goodsInfo: ['批次号', '品名', '发货数量', '发货日期','托运人', '发站', '到站','铁路计划号',  '车数'] // 火运——收货信息
	},
	'003': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称', '收货人'], // 基本信息
		goodsInfo: ['批次号', '收货编号', '品名','收货数量', '收货日期', '托运人', '发站', '到站', '铁路计划号', '车数'] // 火运自备车——收货信息
	},
	'004': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称'], // 基本信息
		goodsInfo: ['批次号', '收货编号', '品名', '发货日期',  '收货日期', '收货数量', '车次', '车数', '发站', '到站','发货人', '收货人', '车皮信息'] // 收货信息
	},
	'005': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称', '收货人'], // 基本信息
		goodsInfo1: ['批次号', '品名', '发货数量', '发货日期', '托运人', '发站', '到站','铁路计划号', '车数'], // 火运发货信息
		goodsInfo2: ['批次号', '收货编号', '品名', '收货数量', '收货日期', '托运人', '发站', '到站','铁路计划号', '车数'], // 火运自备车信息
		goodsInfo3: ['批次号', '收货编号', '品名', '收货数量', '收货日期', '车数'] // 汽运收货信息列表
	},
	'006': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称'],
		goodsInfo: ['批次号', '品名','收货数量', '收货日期', '发货数量', '发货日期', '交货地', '船舶信息']
	},
	'007': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '订单数量', '提货期限', '卖方名称', '交货地'],
		goodsInfo: ['批次号', '品名','收货日期', '收货数量', '发货日期', '发货数量']
	},
	'008': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称','提单日期','提单号'],
		goodsInfo: ['批次号', '品名','装货数量', '装货日期', '交货地', '船舶信息']
	},
	'010': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称','提单日期','提单号'],
		goodsInfo: ['批次号', '品名','装货数量', '装货日期', '交货地', '船舶信息']
	},
	'011': {
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称','提单日期','提单号'],
		goodsInfo:['批次号', '品名','发货数量', '发货日期', '装货港', '卸货港', '船舶信息']
	},
	'012': { //焦煤004
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称','垛位号'],
		goodsInfo: ['批次号', '品名','装货数量', '装货日期', '交货地', '船舶信息']
	},
	'013': { //动力煤009
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称'],
		goodsInfo:['批次号', '品名','发货数量', '发货日期', '装货港', '卸货港', '船舶信息']
	},
	'014': { //动力煤010
		baseInfo: ['订单编号', '合同编号', '品种', '运输方式', '买方名称','提单日期','提单号'],
		goodsInfo: ['批次号', '品名','装货数量', '装货日期', '交货地', '船舶信息']
	},
}
/**
 * @param type
 * @param trainFlag005  汽运和火运时，其中的火运是普通火运（trainFlag005=false）还是火运自备车（trainFlag005=true）
 * @param coalType 煤种
 * @param transType 运输方式
 * @returns {{baseInfo: [], goodsInfo: []}|{baseInfo: [], goodsInfo1: string[], goodsInfo: string[]}}
 */
function getOrderInfo (type, trainFlag005, coalType) {
	let typeObj = infoMap[type] // 获取到相应方式的表单对象
	let baseInfoArr = [] // 基本信息
	let goodsInfoArr = [] // 收发货信息
	typeObj.baseInfo.forEach(title => {
		let obj = allBaseInfoList.find(item => item.label === title)
		baseInfoArr.push(obj)
	})
	/**
	 * 除了汽运和火运，其他都是显示基本信息和收发货信息
	 * 汽运和火运的情况，需要显示汽运列表和火运列表，下游支付的汽运和火运的火运列表要显示火运自备车的列表字段信息
	 */
	if (type === '005') {
		let resultObj = {baseInfo: baseInfoArr}
		// transType===下游支付时，显示火运自备车字段，否则显示火运字段
		for(let key in typeObj) {
			if (key !== 'baseInfo') {
				resultObj[key] = []
				typeObj[key].forEach(title => {
					let obj = allGoodsInfoList.find(item => item.title === title)
					resultObj[key].push(obj)
				})
			}
		}
		return {
			baseInfo: baseInfoArr,
			goodsInfo: !trainFlag005 ? resultObj.goodsInfo1 : resultObj.goodsInfo2,
			goodsInfo1: resultObj.goodsInfo3
		}
	} else {
		typeObj.goodsInfo.forEach(title => {
			let obj = allGoodsInfoList.find(item => item.title === title)
			goodsInfoArr.push(obj)
		})
		// 焦煤和焦炭的汽运，没有发货矿点字段
		if (type === '001' && (coalType === CONSTANTS.coalTypeDict.COKING_COAL || coalType === CONSTANTS.coalTypeDict.COKE)) {
			baseInfoArr.splice(baseInfoArr.indexOf('发货矿点'), 1)
		}
		return {
			baseInfo: baseInfoArr,
			goodsInfo: goodsInfoArr
		}
	}
}

/**
 * 根据不同方式获取列表title
 * @param type
 * @returns {string}
 */
function getTitle(type){
	let title = ''
	switch (type){
		case '001':
		case '003':
		case '004':title = '收货信息';break
		case '002':
		case '010':
		case '008':title = '发货信息';break
		case '005':title = '火运发货信息';break
		case '006':
		case '007':title = '收发货信息';break
		case '011':title = '发货信息';break
		case '012':title = '发货信息';break
		case '013':title = '发货信息';break
		case '014':title = '发货信息';break
	}
	return title
}
/**
 * 基于收货还是基于发货开具货转
 * 1 基于收货(汽运、火运自备车、火运北港接列、船运、船运平仓销售)
 * 2 基于发货(火运、焦炭船运)
 * 3 汽运和火运  如果是火运，需要区分是火运还是火运自备车
 */
function getReceiveOrDeliverFlag(type) {
	let flag = undefined
	switch (type){
		case '001':
		case '003':
		case '004':
		case '006':
		case '007':flag = 1;break
		case '002':
		case '010':
		case '008':flag = 2;break
		case '005':flag = 3;break
		case '011':flag = 2;break
		case '012':flag = 2;break
		case '013':flag = 2;break
		case '014':flag = 2;break
	}
	return flag
}

export {getOrderInfo, getReceiveOrDeliverFlag, getTitle, directGoodsTransferTypes}
