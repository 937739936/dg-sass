/*
* @Author: zhangyazhou
* @Date:   2021-04-21 14:43:38
* @Last Modified by:   zhangyazhou
* @Last Modified time: 2021-04-23 17:07:43
*/

const Mock = require('mockjs')
const warehouseGoodsPutPage = require('./services/warehouseGoodsPutPage')
const warehouseGoodsPutDetail = require('./services/warehouseGoodsPutDetail')
const grainSituationList = require('./services/grainSituationList')
const grainSituationDepotDetail = require('./services/grainSituationDepotDetail')
const grainSituationPage = require('./services/grainSituationPage')
const grainSituationThreeTemp = require('./services/grainSituationThreeTemp')
const grainSituationHumidity = require('./services/grainSituationHumidity')
const grainSituationPestReport = require('./services/grainSituationPestReport')
const grainSituationGasReport = require('./services/grainSituationGasReport')
const grainSituationPointPestsDetail = require('./services/grainSituationPointPestsDetail')
const grainSituationWarehouseGoodsOutPage = require('./services/grainSituationWarehouseGoodsOutPage')
const grainSituationWarehouseGoodsPutPage = require('./services/grainSituationWarehouseGoodsPutPage')
const grainSituationListByFinancialOrg = require('./services/grainSituationListByFinancialOrg')
const coreCompanyList = require('./services/coreCompanyList')

module.exports = (app) => {
  app.post(/dg-grain-api\/warehouse\/goods\/put\/page/, (req, res) => {
    res.json(Mock.mock(warehouseGoodsPutPage(req)))
  })

  app.get(/dg-grain-api\/warehouse\/goods\/put\/[0-9]+/, (req, res) => {
    res.json(Mock.mock(warehouseGoodsPutDetail(req)))
  })

  app.post(/dg-grain-api\/warehouse\/goods\/out\/page/, (req, res) => {
    res.json(Mock.mock(warehouseGoodsPutPage(req)))
  })

  app.get(/dg-grain-api\/warehouse\/goods\/out\/[0-9]+/, (req, res) => {
    res.json(Mock.mock(warehouseGoodsPutDetail(req)))
  })

  app.get(/dg-grain-api\/grainSituation\/list/, (req, res) => {
    res.json(Mock.mock(grainSituationList(req)))
  })

  app.get(/dg-grain-api\/grainSituation\/depotDetail\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+/, (req, res) => {
    res.json(Mock.mock(grainSituationDepotDetail(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/page/, (req, res) => {
    res.json(Mock.mock(grainSituationPage(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/threeTemp/, (req, res) => {
    res.json(Mock.mock(grainSituationThreeTemp(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/humidity/, (req, res) => {
    res.json(Mock.mock(grainSituationHumidity(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/pestReport/, (req, res) => {
    res.json(Mock.mock(grainSituationPestReport(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/gasReport/, (req, res) => {
    res.json(Mock.mock(grainSituationGasReport(req)))
  })

  app.get(/dg-grain-api\/grainSituation\/pointPestsDetail\/[0-9a-zA-Z]+/, (req, res) => {
    res.json(Mock.mock(grainSituationPointPestsDetail(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/warehouseGoodsOutPage/, (req, res) => {
    res.json(Mock.mock(grainSituationWarehouseGoodsOutPage(req)))
  })

  app.post(/dg-grain-api\/grainSituation\/warehouseGoodsPutPage/, (req, res) => {
    res.json(Mock.mock(grainSituationWarehouseGoodsPutPage(req)))
  })

  app.get(/dg-grain-api\/warehouse\/goods\/put\/attachment\/[0-9]+\/del/, (req, res) => {
    res.json(Mock.mock({ success: true, data: true }))
  })

  app.get(/dg-grain-api\/warehouse\/goods\/out\/attachment\/[0-9]+\/del/, (req, res) => {
    res.json(Mock.mock({ success: true, data: true }))
  })

  app.post(/dg-grain-api\/warehouse\/goods\/put\/attachment\/save/, (req, res) => {
    res.json(Mock.mock({ success: true, data: true }))
  })

  app.post(/dg-grain-api\/warehouse\/goods\/out\/attachment\/save/, (req, res) => {
    res.json(Mock.mock({ success: true, data: true }))
  })

  app.post(/dg-trade-api\/api\/common\/file\/upload/, (req, res) => {
    res.json(Mock.mock({ "success": true, "data": {
      "fileUrl": "trade-files/20210305/微信截图_20210305193131_1614943920136.png",
      "fileName": "微信截图_20210305193131_1614943920136.png",
      "md5Hex": "2131231231" }}))
  })

  app.get(/dg-grain-api\/grainSituation\/listByFinancialOrg\/[0-9a-zA-Z]+/, (req, res) => {
    res.json(Mock.mock(grainSituationListByFinancialOrg(req)))
  })

  app.get(/dg-grain-api\/grainSituation\/getCoreCompanyList/, (req, res) => {
    res.json(Mock.mock(coreCompanyList(req)))
  })
}