/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:06:03
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-22 10:47:02
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success" : true,
    "data" : [{
      "detectTime" : "2021-04-21 16:44:45",
      "outHumidity" : "21.2",
      "inHumidity" : "24.1"
    },{
      "detectTime" : "2021-05-21 16:44:45",
      "outHumidity" : "11.2",
      "inHumidity" : "30.1"
    },{
      "detectTime" : "2021-05-21 16:44:45",
      "outHumidity" : "20.2",
      "inHumidity" : "5.1"
    }]
  }
}
