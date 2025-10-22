/*
* @Author: zhangyazhou
* @Date:   2021-04-21 17:53:34
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-23 11:00:18
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
        "clearingPrice" : 10012310,
        storageTime: '2020-12-12',
        "payee" : "收款人名称",
        "clearingForm" : "结算方式",
        "id" : 1,
        "serialNumber" : "20210101",
        "grainName" : "商品名称",
        "grainLevel" : "1级",
        "clearingWeight" : 1000
      } ],
      "hasPreviousPage" : false,
      "hasNextPage" : false,
      "navigatePages" : 0
    }
  }
}