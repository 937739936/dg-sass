/*
* @Author: zhangyazhou
* @Date:   2021-04-21 15:53:29
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-22 18:43:49
*/

module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success" : true,
    "data" : {
      "storehouseId" : 12,
      storageCompany: '仓储企业',
      "storehouseNumber" : "01",
      "storehouseName" : "一号仓房",
      "storehouseType" : "平房仓",
      "width" : 8.5,
      "length" : 31.2,
      "height" : 10,
      "defaultCapacity" : 2000,
      "keeper" : "刘英杰",
      "grainVarieties" : "小麦",
      "grainLevel" : "二等",
      "inTemp" : "21.3",
      "inHumidity" : "61.3",
      "moisture" : "123",
      "impurities" : "123",
      "currentCapacity" : 1,
      "depotPointFlag" : "weishi",
      "coreCompany" : "核心企业1",
      "cumulativeStorage" : 20001,
      "cumulativeOutbound" : 20000,
      "depotPointName" : "豫粮集团尉氏县粮食产业有限公司"
    }
  }
}