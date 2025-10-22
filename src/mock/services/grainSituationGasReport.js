/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:11:23
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-22 10:49:17
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
      "total" : 0,
      "pages" : 0,
      "list" : [{
        "detectTime" : "2021-04-21 15:49:56",
        "o2Content" : 12,
        "n2Content" : 78,
        "co2Content" : 1240,
        "ph3Content" : 10,
        "coContent" : 9
      }],
      "hasPreviousPage" : false,
      "hasNextPage" : false,
      "navigatePages" : 0
    }
  }
}