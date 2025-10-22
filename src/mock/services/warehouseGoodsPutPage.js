/*
* @Author: zhangyazhou
* @Date:   2021-04-21 14:47:39
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-23 11:00:25
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
        "id" : 1,
        "serialNumber" : "20210101",
        "storageTime" : "2021-04-21 14:05:29",
        "grainName" : "商品名称",
        "grainLevel" : "1级",
        "clearingWeight" : 1000,
        "clearingPrice" : 1001231231,
        "storageCompany" : "仓储企业名称",
        "depotPoint" : "库点名称",
        "storehouse" : "仓房名称",
        "payee" : "收款人名称",
        "clearingForm" : "结算方式",
        "attachmentExist" : true
      } ],
      "hasPreviousPage" : false,
      "hasNextPage" : false,
      "navigatePages" : 0
    }
  }
}