/*
* @Author: zhangyazhou
* @Date:   2021-04-21 15:01:31
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-23 10:35:42
*/
module.exports = (req) => {
  const { url, method, params } = req
  console.log(JSON.stringify({ url, method, params }, null, 4))
  return {
    "success" : true,
    "data" : {
      "baseInfo" : {
        "serialNumber" : "20210101",
        "storageCompany" : "仓储企业",
        "depotPoint" : "库点",
        "storehouse" : "仓房",
        "coreCompany" : "权属企业",
         storageTime: '12300000'
      },
      "qualityTesting" : {
        "number" : "ZJYYYYMMDD00N",
        "grainName" : "小麦",
        "grainLevel" : "1级",
        "grainAddress" : "产地",
        "yearOfHarvest" : "收获年份",
        "imperfectGrain" : "10%",
        "moisture" : "1%",
        "bulkDensity" : "11g/kg",
        "impurities" : "2%",
        "checkBuckle" : 32123.12312,
        "inspector" : "张三",
        "inspectionTime" : "2021-04-21 14:05:29"
      },
      "weighInfo" : {
        "grossWeight" : 1123120.123123,
        "tareWeight" : 101231.2312,
        "buckleHeavy" : 1012.3123,
        "grossWeightTime" : "2021-04-21 15:49:57",
        "tareWeightTime" : "2021-04-21 15:49:57",
        "netWeight" : 1012312312,
        "grossWeightInspector" : "毛重监磅员",
        "keeper" : "仓库保管员",
        "licensePlate" : "车牌号",
        "driver" : "承运人",
        "driverIdCard" : "承运人身份证号码",
        "driverPhone" : "18638763303"
      },
      "watchPictures" : [ {
        "imgUrl" : "https://img2.baidu.com/it/u=4087057811,445331467&fm=26&fmt=auto&gp=0.jpg",
        "shootingTime" : "2021-04-21 14:05:29"
      } ],
      "settlementInfo" : {
        "number" : "JSD20210101",
        "clearingWeight" : 10123123,
        "clearingPrice" : 1000,
        "clearingUnitPrice" : 10123123,
        "payee" : "收款人",
        "payeeIdCard" : "410104199103300079",
        "payeeBank" : "收款人银行名称",
        "payeeBankAccount" : "2312312313",
        "amountCollected" : 200000,
        "clearingForm" : "结算方式",
        "clearingPersonnel" : "结算人员"
      },
      "attachments" : [ {
        "fileId" : 1,
        "type" : "STATEMENT",
        "path" : "/trade-files/20210421/2f8c4d3e991f46b0ab0db75cde4edefd.pdf",
        "typeName" : "结算单",
        "originalFileName" : "xxx.pdf",
        "convertFileName" : "结算单01.pdf"
      } ]
    }
  }
}