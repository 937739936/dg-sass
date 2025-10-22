/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:45:18
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-22 14:31:37
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
      "success" : true,
    "data" : {
      "everyLayerDetailList" : [ [ [ "0", 3 ], [ "1", 4 ], [ "2", 5 ], [ "2", 0 ]  ], [ [ "0", 3 ], [ "1", 4 ], [ "1", -1], [ "2", 5 ] ], [ [ "0", 3 ], [ "1", 4 ], [ "2", 5 ] ] ],
      "layerPestsCountList" : [ {
        "pestsMax" : 123,
        "pestsAverage" : 13,
        "pestsMin" : 0
      }, {
        "pestsMax" : 123,
        "pestsAverage" : 123,
        "pestsMin" : 0
      }, {
        "pestsMax" : 123,
        "pestsAverage" : 123,
        "pestsMin" : 0
      }, {
        "pestsMax" : 123,
        "pestsAverage" : 123,
        "pestsMin" : 0
      } ]
    }
  }
}