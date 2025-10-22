/*
* @Author: zhangyazhou
* @Date:   2021-04-21 15:41:38
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-21 15:53:47
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success": true,
    "data": [{
      "depotPointId": 1,
      "depotPointNumber" : "库点编号",
      "depotPointName" : "库点名称",
      "depotPointAddress" : "库点地址",
      "weather" : {
        "temperature" : "24.9°C",
        "humidity" : "65.4%",
        "rain" : "10mm",
        "speed" : "1级(1.5m/s)",
        "direction" : "东南风(135.0°)",
        "pressure" : "1009.4HPa",
        "weathertime" : "2021-04-21 14:17:55"
      },
      "depots": [{
        "storehouseId" : 12,
        "storehouseNumber" : "01",
        "storehouseName" : "一号仓房",
        "storehouseType" : "平房仓",
        "width" : 21.1,
        "length" : 21.1,
        "height" : 21.1,
        "defaultCapacity" : 2000,
        "keeper" : "刘英杰",
        "grainVarieties" : "小麦",
        "grainLevel" : "二等",
        "inTemp" : "21.3",
        "inHumidity" : "61.3",
        "moisture" : "123",
        "impurities" : "123",
        "currentCapacity" : 1999,
        "depotPointFlag" : "weishi"
      }]
    }]
  }
}