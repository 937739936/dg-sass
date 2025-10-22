/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:06:03
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-21 17:21:20
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success" : true,
    "data" : [{
      "detectTime" : "2021-04-21 16:44:45",
      "outTemp" : "24.1",
      "inTemp" : "21.2",
      "grainTemp" : "20.9"
    },{
      "detectTime" : "2021-05-30 16:44:45",
      "outTemp" : "10.1",
      "inTemp" : "15.2",
      "grainTemp" : "5.9"
    }]
  }
}
