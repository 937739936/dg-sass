<template>
  <div class="new-detail" style="width:100%">
    <!-- 补录采购合同详情 -->
    <div class="new-detail-content detail-form">
        <h2>基本信息</h2>
        <a-row class="df">
          <a-form-item label="上游企业名称">
            <div class="fake-ipt"> {{info.sellCompanyName}}</div>
          </a-form-item>
          <a-form-item label="社会统一信用代码">
            <div class="fake-ipt"> {{info.sellCompanyUscc}}</div>
          </a-form-item>
          <a-form-item label="上游纸质合同编号">
            <a-input class="ipt" disabled v-model="info.contractNo"> </a-input>
          </a-form-item>
          <a-form-item label="合同期限">
             <div class="fake-ipt"> {{info.effectiveStartDate}} - {{info.effectiveEndDate}} </div>
          </a-form-item>
          <a-form-item label="钢材种类">
             <div class="fake-ipt"> {{info.steelTypeDesc}}</div>
          </a-form-item>
          <a-form-item label="合同签订状态">
             <div class="fake-ipt">{{info.contractSignStatusDesc}}</div>
          </a-form-item>
          <a-form-item label="合同总数量（吨）">
             <div class="fake-ipt"> {{info.quantity}}</div>
          </a-form-item>
           <a-form-item label="合同签订日期">
            <div class="fake-ipt"> {{info.contractSignDate}}</div>
          </a-form-item>
          <a-form-item label="业务类型" >
            <div class="fake-ipt"> {{info.businessTypeDesc}}</div>
          </a-form-item>
          <a-form-item label="业务经理" v-if="info.assetTeamTraderName">
            <div class="fake-ipt"> {{info.assetTeamTraderName}}{{info.assetTeamTraderPhone}}</div>
          </a-form-item>
          <a-form-item label="是否承兑付款业务" >
            <div class="fake-ipt">  {{info.acceptancePayment == 1 ? '是' : '否'}}</div>
          </a-form-item>
          <a-form-item label="是否指定规格" >
            <div class="fake-ipt">  {{info.appointSpecDesc}}</div>
          </a-form-item>
        </a-row>
    </div>
     <div class="new-detail-content detail-form">
      <h2>货物明细</h2>
      <a-table
        :pagination="false"
        :columns="columns"
        class="new-table"
        :data-source="info.contractPurchaseList"
        :scroll="{x:true}"
        rowKey="id">
      </a-table>
    </div>
  </div>
</template>

<script>
  const columns = [
    {  title: '序号',  customRender: (text, record, index) => `${index + 1}`},
    { title: '品名', dataIndex: 'materialName', key: 'materialName'},
    { title: '规格', dataIndex: 'specs', key: 'specs', },
    { title: '材质', dataIndex: 'materialTexture', key: 'materialTexture',},
    {  title: '产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin',},
    { title: '件数', dataIndex: 'pieceQuantity', key: 'pieceQuantity', },
    { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity', },
    { title: '捆包号', dataIndex: 'baleNo',key: 'baleNo',},
    { title: '理重', dataIndex: 'theoreticalWeight', key: 'theoreticalWeight',},
    { title: '计量方式', dataIndex: 'metrologyWay', key: 'metrologyWay', },
    { title: '含税单价（元/吨）',dataIndex: 'presetUnitPrice', key: 'presetUnitPrice',},
    { title: '不含税单价（元/吨）', dataIndex: 'test3', key: 'test3', },
    { title: '含税金额', dataIndex: 'test4', key: 'test4',fixed: 'right'}
  ]
export default {
  props: {
      info: {
        default: () => {}
      }
    },
  data() {
    return {
      columns,
    }
  },
  methods: {

  },
  components: {

  }
}
</script>


<style scoped lang='less'>

.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
  }
}
.ipt {
  width: 310px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  font-size: 14px;
  color: #8495AA;
  border: 0;
}
.fake-ipt {
    width: 310px;
    height: 40px;
    background: #F0F3FB;
    border-radius: 6px;
    font-size: 14px;
    color: #8495AA;
    border: 0;
    padding: 4px 11px;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

