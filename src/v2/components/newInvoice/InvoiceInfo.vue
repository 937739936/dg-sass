<template>
<div>
  <div class="modalContent">
    <p class="title">{{info.invoiceVO.buyerName}}{{info.invoiceVO.typeDesc}}</p>
      <div>
          <p><span class="c8">发票代码：</span><span>{{info.invoiceVO.code}}</span></p>
          <p><span class="c8">发票号码：</span><span>{{info.invoiceVO.no}}</span></p>
          <p><span class="c8">开票日期：</span><span>{{info.invoiceVO.issuedDate}}</span></p>
          <p><span class="c8">校验码：</span><span>{{info.invoiceVO.checkCode}}</span></p>
          <p><span class="c8">机器编号：</span><span>{{info.invoiceVO.machineCode}}</span></p>
      </div>
    <table cellspacing="0" cellpadding="0" class="modalTable" style="margin-bottom: 20px;" :scroll="{x:true}">
      <tr style="height:180px">
          <td colspan="1"  class="c8" style="width: 95px;">购买方</td>
          <td colspan="11" class="left" style="padding:0;padding-left:24px">
              <p ><span class="c8">名称</span>{{info.invoiceVO.buyerName}}</p>
              <p  style="margin-top:20px"><span class="c8">纳税人识别号</span>{{info.invoiceVO.buyerUscc}}</p>
              <p  style="margin-top:20px"><span class="c8">地址、电话</span>{{info.invoiceVO.purchaserAddressAndPhone}}</p>
              <p style="margin-top:20px"><span class="c8">开户行及账号</span>{{info.invoiceVO.purchaserBankAndNumber}}</p>
          </td>
          <td colspan="1"  class="c8" style="width: 95px;">密码区</td>
          <td colspan="8"></td>
      </tr>
      <tr>
          <td colspan="5" class="c8">
              <p>货物或应税劳务、服务名称</p>
          </td>
          <td colspan="2"  class="c8">
              <p>规格型号</p>
          </td>
          <td colspan="1"  class="c8">
              <p>单位</p>
          </td>
          <td colspan="2"  class="c8">
              <p>数量</p>
          </td>
          <td colspan="3"  class="c8">
              <p>单价</p>
          </td>
          <td colspan="3"  class="c8">
              <p>金额</p>
          </td>
          <td colspan="2"  class="c8">
              <p>税率</p>
          </td>
          <td colspan="3"  class="c8">
              <p>税额</p>
          </td>
      </tr>
      <tr v-for="(item,index) in info.invoiceItemVOList" :key="index">
          <td colspan="5">
              <p class="blue">{{item.name}}</p>
          </td>
          <td colspan="2" >
              <p class="blue">{{item.spec}}</p>
          </td>
          <td colspan="1">
              <p class="blue">{{item.unit}}</p>
          </td>
          <td colspan="2">
              <p class="blue">{{item.quantity}}</p>
          </td>
          <td colspan="3">
              <p class="blue">{{item.unitPrice}}</p>
          </td>
          <td colspan="3">
              <p class="blue">{{item.amount}}</p>
          </td>
          <td colspan="2">
              <p class="blue">{{item.taxRate*100}}%</p>
          </td>
          <td colspan="3">
              <p class="blue">{{item.tax}}</p>
          </td>
      </tr>
      <tr>
          <td colspan="5" class="c8">价税合计（大写）</td>
          <td colspan="6" style="border-right: 1px solid transparent;"><p class="blue" style="text-align: left;margin-left: 15px;margin-bottom:0;">{{info.invoiceVO.amountTaxCn}}</p></td>
          <td colspan="10" class="c8"><span class="c8">（小写）</span><span class="blue" style="display: inline-block;margin-left: 20px;">¥{{info.invoiceVO.amountTax}}</span></td>
      </tr>
      <tr style="height:180px">
          <td colspan="1"  style="width: 95px;" class="c8">销售方</td>
          <td colspan="11" class="left"  style="padding:0;padding-left:24px" >
              <p><span class="c8">名称：</span>{{info.invoiceVO.sellerName}}</p>
              <p  style="margin-top:20px"><span class="c8"><span>纳税人识别号</span></span>{{info.invoiceVO.sellerUscc}}</p>
              <p  style="margin-top:20px"><span class="c8">地址、电话：</span>{{info.invoiceVO.salerAddressAndPhone}}</p>
              <p  style="margin-top:20px"><span class="c8">开户行及账号：</span>{{info.invoiceVO.salerBankAndNumber}}</p>
          </td>
          <td colspan="1" class="c8"  style="width: 95px;">备注</td>
          <td colspan="8"><p class="blue" v-html="info.invoiceVO.remarks"></p></td>
      </tr>
    </table>
  </div>
   <a class="tip" href="https://etax.jiangxi.chinatax.gov.cn/fpcx/" style="" target="_blank">本数据来源于中国国家税务局发票验证系统</a>
</div>

</template>

<script>
export default {
  props: {
    info: {
      default: () => { return {invoiceVO: {}}}
    }
  },
  data() {
    return {
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang='less'>
.modalContent {
  color:#383A3F;
  border: 1px solid rgba(0,0,0,0.8);
  padding: 30px;
  padding-top: 20px;
  .title {
    color: #000;
    font-weight: 500;
  }
  &>p {
    text-align: center;
    font-size: 18px;
    color:#0053DB;
    margin-bottom: 15px;
  }
  &>div {
    display: flex;
    flex-decoration: row;
    justify-content: space-between;
    margin-bottom: 5px;
    span {
        // color:#0053DB;
    }
  }
  }
.modalTable{
  width:100%;
  height:100%;
  border: 1px solid rgba(0,0,0,0.8);
  text-align:center;/*文本居中*/
  border-collapse: collapse;/*边框重叠，否则你会看到双实线*/
  table-layout:fixed;
  th,td{
    height: 32px;
    border:1px solid black;
    color: #000000;
    padding: 10px 6px;
  }
  .left {
    text-align: left;
    // display: flex;
    // justify-content: space-around;
    // flex-direction: column;
    p{
      color: rgba(0,0,0,0.8);
      span {
        display: inline-block;
        width: 110px;
      }
    }
  }
  .blue {
    // color:#0053DB;
    color: rgba(0,0,0,0.8);
    // text-align: left;
  }

}
.c8 {
  color: #8495AA !important;
}
.tip {
  display:block;
  text-align: center;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  margin-top: 20px;
}
</style>
