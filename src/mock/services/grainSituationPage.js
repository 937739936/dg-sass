/*
* @Author: zhangyazhou
* @Date:   2021-04-21 16:25:46
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-22 15:05:28
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success" : true,
    "data" : {
      "pageNum" : 1,
      "pageSize" : 10,
      "size" : 0,
      "total" : 27,
      "pages" : 0,
      "list" : [{
        "detectTime" : "2021-04-21 14:17:50",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:51",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:35",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:52",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:16:35",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:36",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:37",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:31",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:12",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:13",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:15",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:16",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:17",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:18",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:19",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:20",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:21",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:22",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:23",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:24",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:25",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:26",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:27",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:28",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:29",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:30",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },{
        "detectTime" : "2021-04-21 14:17:01",
        "outTemp" : "24.1",
        "inTemp" : "21.2",
        "outHumidity" : "61.2",
        "inHumidity" : "63.2",
        "depotTempMax" : "26.2",
        "depotTempMin" : "18.1",
        "depotTempAverage" : "20.9",
        "layerTempJson" : "{\"layer1TempHigh\":3.7,\"layer1TempLow\":3.3,\"layer1TempAverage\":3.5,\"layer2TempHigh\":3.8,\"layer2TempLow\":3.1,\"layer2TempAverage\":3.5,\"layer3TempHigh\":4.0,\"layer3TempLow\":3.3,\"layer3TempAverage\":3.5,\"layer4TempHigh\":0.0,\"layer4TempLow\":0.0,\"layer4TempAverage\":0.0,\"layer5TempHigh\":0.0,\"layer5TempLow\":0.0,\"layer5TempAverage\":0.0}"
      },],
      "hasPreviousPage" : false,
      "hasNextPage" : false,
      "navigatePages" : 0
    }
  }
}