/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:09:27
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-21 17:32:57
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
      "list" : [ {
        "detectTime" : "2021-04-21 15:49:56",
        "pgId" : "F8C77F87B77D4C36A13F5FC533E861A4",
        "pestisCount" : 43,
        "pestisMax" : 99,
        "pestisMin" : 0
      } ],
      "hasPreviousPage" : false,
      "hasNextPage" : false,
      "navigatePages" : 0
    }
  }
}