<template>
  <div class="new-detail">
    <div class="new-detail-content detail-form" style="padding-bottom:0px;padding-top: 0;margin-top:10px">
      <h2>基本信息</h2>
      <a-row class="df">

          <a-form-item label="合同编号">
            <div class="fake-ipt"> {{contract.contractNo}}</div>
          </a-form-item>
          <a-form-item label="买方名称">
            <div class="fake-ipt"> {{contract.buyCompanyName}}</div>
          </a-form-item>

          <a-form-item label="钢材种类">
            <div class="fake-ipt"> {{contract.steelTypeDesc}}</div>
          </a-form-item>

          <a-form-item label="网价参考">
            <div class="fake-ipt"> {{contract.marketPriceSourceDesc}}</div>
          </a-form-item>
          <a-form-item label="保证金比例(%)">
            <div class="fake-ipt"> {{contract.bondRatio}}</div>
          </a-form-item>
          <a-form-item label="保证金金额(元)">
           <div class="fake-ipt"> {{contract.bondAmount}}</div>
          </a-form-item>
          <a-form-item label="市场价格下跌幅度设置(%)">
            <div class="fake-ipt"> {{contract.marketPriceDownRatio}}</div>
          </a-form-item>
          <a-form-item label="网价涨跌幅(元/吨)">
           <div class="fake-ipt"> {{contract.marketPriceFloatTypeDesc}}{{contract.marketPriceFloatAmount}}</div>
          </a-form-item>
          <a-form-item label="合同数量(吨)">
            <div class="fake-ipt"> {{contract.quantity}}</div>
          </a-form-item>
      </a-row>
      <h2 style="margin-top:58px">合同网价标的</h2>
      <a-table 
        :columns="columns"
        class="new-table" 
        rowKey="id" 
        :dataSource="marketPrice"
        :pagination="false" 
        :scroll="{ x: true }"
      >
      <template slot="raise" slot-scope="text, record">
        <div style="color:#45BF83" v-if="record.raise < 0" s>
          <img class="up" src="../../assets/imgs/storage/down.png" alt="">
          {{record.raise}}
        </div>
        <div style="color:#DD4444" v-else-if="record.raise > 0">
          <img class="up" src="../../assets/imgs/storage/up.png" alt="">
          +{{record.raise}}
        </div>
        <div v-else>
          -
        </div>
      </template>
      </a-table>
    </div>
    <div class="new-detail-content detail-form" style="padding-bottom: 0;margin-top:70px">
      <h2>追保计算</h2>
      <a-row class="df">
          <a-form-item label="已付款金额(元)">
             <div class="fake-ipt"> {{bondCalcInfo.paidAmount}}</div>
          </a-form-item>
          <a-form-item label="已收款金额(元)">
             <div class="fake-ipt"> {{bondCalcInfo.collectionAmount}}</div>
          </a-form-item>

          <a-form-item label="占压金额(元)">
            <div class="fake-ipt"> {{bondCalcInfo.occupyAmount}}</div>
          </a-form-item>
          <a-form-item label="保证金金额(元)">
             <div class="fake-ipt"> {{bondCalcInfo.bondAmount}}</div>
          </a-form-item>

          <a-form-item label="采购单价(元/吨)">
           <div class="fake-ipt"> {{bondCalcInfo.unitPrice}}</div>
          </a-form-item>

          <a-form-item label="未回款吨位(吨)">
             <div class="fake-ipt"> {{bondCalcInfo.noCollectionQuantity}}</div>
          </a-form-item>

          <a-form-item :label="`市场价格(元/吨) ${bondCalcInfo.priceUpdateDate || ''}`">
           <div class="fake-ipt"> {{bondCalcInfo.marketUnitPrice}}</div>

          </a-form-item>

          <a-form-item label="基准价格(元/吨)">
           <div class="fake-ipt"> {{bondCalcInfo.baseUnitPrice}}</div>
          </a-form-item>

          <a-form-item label="风险抓手(元/吨)">
           <div class="fake-ipt"> {{bondCalcInfo.riskPrice}}</div>
          </a-form-item>

          <a-form-item label="风险抓手占比(%)">
             <div class="fake-ipt"> {{bondCalcInfo.riskRatio}}</div>
          </a-form-item>

          <a-form-item label="市场价格涨跌幅度(%)">
             <div class="fake-ipt"> {{bondCalcInfo.marketPriceRaise}}</div>
          </a-form-item>

      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    contract: {
      default: () => { }
    },
    marketPrice: {
      default: () => []
    },
    bondCalcInfo: {
      default: () => { }
    }
  },
  data() {
    return {
      columns: [
        {  title: '来源', dataIndex: 'sourceFromDesc', key: 'sourceFromDesc'},
        {  title: '日期', dataIndex: 'date', key: 'date'},
        {  title: '时间', dataIndex: 'time', key: 'time'},
        {  title: '区域', dataIndex: 'area', key: 'area'},
        {  title: '钢材种类', dataIndex: 'steelType', key: 'steelType'},
        {  title: '品名', dataIndex: 'materialName', key: 'materialName'},
        {  title: '规格', dataIndex: 'specs', key: 'specs'},
        {  title: '材质', dataIndex: 'materialTexture', key: 'materialTexture'},
        {  title: '钢厂/产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin',},
        {  title: '价格(元/吨)', dataIndex: 'unitPrice', key: 'unitPrice'},
        { title: "涨跌(元/吨)", dataIndex: "raise", key: "raise", scopedSlots: { customRender: "raise" }  },
        {  title: '备注', dataIndex: 'note', key: 'note', fixed: 'right'},
      ]
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang='less'>
.new-detail {
  color: rgba(0,0,0,0.8);
}
::v-deep label {
  color: rgba(0,0,0,0.8) !important;
}
.up {
  width: 25px;
  height: 25px;
  // background: rgba(231,255,243,0.5);
  border-radius: 7px;
}
.df {
  display: flex;
  flex-wrap: wrap;
}
.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
     text-align: left;
  }
  ::v-deep .ant-form-item-label {
    text-align: left;
  }
}
.ipt {
  width: 364px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  color: #8495AA;
  border: 0;
}
.fake-ipt {
  width: 364px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  border: 0;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  color: #8495AA;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
