// 收款登记表单数据
import CONSTANTS from '@sub/utils/constants'
export function basicInfoData(contractTemplate,deliveryType) {
    var basicInfoData = [];
    if(contractTemplate == CONSTANTS.contractTemplateDict.OFFLINE){
        basicInfoData.push(
            {
                type  : 'input',
                label : '订单编号',
                value : 'orderSerialNo'
            },
            {
                type  : 'input',
                label : '合同编号',
                value : 'contractNo'
            },
            {
                type  : 'input',
                label : '煤种',
                value : 'type'
            },
            {
                type  : 'input',
                label : '品名',
                value : 'goodsName'
            },
            {
                type  : 'input',
                label : '数量',
                value : 'quantity'
            },
            {
                type  : 'input',
                label : '交货方式',
                value : 'deliveryType'
            },
            {
                type  : 'input',
                label : '基准价格(元/吨)',
                value : 'basicPrice'
            },
            {
                type  : 'dateRange',
                label : '交货期限',
                value : 'deliveryDate'
            },

        )
    }
    else{
        basicInfoData.push(
            {
                type  : 'input',
                label : '订单编号',
                value : 'orderSerialNo'
            },
            {
                type  : 'input',
                label : '合同编号',
                value : 'contractNo'
            },
            {
                type  : 'input',
                label : '煤种',
                value : 'type'
            },
            {
                type  : 'input',
                label : '品名',
                value : 'goodsName'
            },
            {
                type  : 'input',
                label : '数量',
                value : 'quantity'
            },
            {
                type  : 'input',
                label : '基准价格(元/吨)',
                value : 'basicPrice'
            },
            {
                type  : 'input',
                label : '交提货地点',
                value : 'pickupPlace'
            },
            {
                type  : 'dateRange',
                label : '提货期限',
                value : 'deliveryDate'
            },
            {
                type  : 'input',
                label : '运输方式',
                value : 'transType'
            },
            {
                type  : 'input',
                label : '提货方式',
                value : 'pickupType'
            },
            {
                type  : 'input',
                label : '生产厂家',
                value : 'manufacturer'
            },
        )
    }
    return basicInfoData
}
