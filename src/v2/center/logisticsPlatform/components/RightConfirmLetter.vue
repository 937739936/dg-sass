<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    :forceRender="true"
    title="单据详情"
    width="900px"
    class="modal"
  >
    <p class="tips">说明：该数据由国投曹妃甸港口提供</p>
    <div class="content">
      <div class="title">
        <h2>国投曹妃甸港口有限公司</h2>
        <span>编号：{{modalInfo.number}}</span>
      </div>
      <h2 class="title">2022年煤炭进港物权确认函
      </h2>
      <p class="table-title">经由<em>{{modalInfo.transferor}}</em>、<em>{{modalInfo.assignee}}</em>和<em>{{modalInfo.portName}}</em>三方共同将<em>{{modalInfo.confirmationDate}}</em>份月度货源确认如下：</p>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="4">发运人</td>
          <td colspan="6">货票收货人</td>
          <td colspan="2">发站</td>
          <td colspan="8">{{modalInfo.deliveryStation}}</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="4">{{modalInfo.consignor}}</td>
          <td colspan="6" rowspan="4">{{modalInfo.invoiceConsignee}}</td>
          <td colspan="2">煤种</td>
          <td colspan="4">{{modalInfo.coalType}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="2">到站</td>
          <td colspan="4">{{modalInfo.arriveStation}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="2">列数</td>
          <td colspan="4">{{modalInfo.columnNum}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="2">吨数</td>
          <td colspan="4">{{modalInfo.quantity}}吨</td>
          <td colspan="4"></td>
        </tr>
      </table>
      <p class="table-title">上述资源进港后卸入<em>{{modalInfo.consignee}}</em>场地全部混堆，煤炭(含盈亏)入<em>{{modalInfo.assignee}}</em>台账，在港一切业务手续及港口各项费用由<em>{{modalInfo.assignee}}</em>办理和承付。</p>
      <div class="table-title text-indent">
        <strong>备注：</strong>
        <p>1.港口根据此确认函，并结合实际场存和装卸生产情况，向铁路相关部门提报月度货源申请；</p>
        <p>2.场地交货煤炭则根据场地交货协议优先执行煤炭月度计划，保证计划兑现；</p>
        <p>3.对于煤种、发站、发货人信息不明确、不易区分的资源，港口对错堆、混堆不承担任何责任；</p>
        <p>4.此确认函无港口签章确认无效；</p>
        <p>5.此确认函一经签章确认，即刻生效，不得涂改和撤销。</p>
      </div>
      <div class="sign-box">
        <div>
          <em>{{modalInfo.transferor}}</em>
          <p>经办人: {{modalInfo.transferorOperator}}</p>
          <p class="date">{{modalInfo.transferorSignTime}}</p>
        </div>
        <div>
          <em>{{modalInfo.assignee}}</em>
          <p>经办人:{{modalInfo.assigneeOperator}} </p>
          <p class="date">{{modalInfo.assigneeSignTime}}</p>
        </div>
        <div>
          <p>{{modalInfo.portName}}</p>
          <p>经办人: {{modalInfo.portOperator}}</p>
          <p class="date">{{modalInfo.portSignTime}}</p>
        </div>
        <p class="footer-date">日期：{{modalInfo.transferorSignTime}}</p>
      </div>
      
    </div>
    <div slot="footer">
      <a-button type="primary" @click="close">关闭</a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: 'RightConfirmLetter',
  data() {
    return {
      visible: false,
      modalInfo: {}
    }
  },
  mounted() {
    
  },
  methods: {
    init(data) {
      this.modalInfo = data
      this.modalInfo.transferorSignTime = this.formatTime(this.modalInfo.transferorSignTime)
      this.modalInfo.confirmationDate = this.formatTime(this.modalInfo.confirmationDate)
      this.visible = true
    },
    close(){
      this.visible = false
    },
    formatTime(date) {
      if (date) {
        let dateArr = date.split('-')
        let str = ''
        if (dateArr.length === 3) {
          str = dateArr[0]+'年'+dateArr[1]+'月'+dateArr[2]+'日'
        } else {
          str = dateArr[0]+'年'+dateArr[1]+'月'
        }
        return str
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .title {
    text-align: center;
    font-size: 22px;
    margin-bottom: 5px;
    position: relative;
    h2 {
      font-size: 22px;
    }
    span {
      position: absolute;
      font-size: 18px;
      color: red;
      right: 0px;
      top: 5px;
      font-weight: 400;
    }
  }
  .table-title {
    padding: 0 10px;
    u {
      display: inline-block;
      padding: 0 5px 5px 0;
    }
  }
  .text-indent {
    p {
      text-indent: 20px;
      line-height: 24px;
    }
  }
  .modalTable {
    width: 100%;
    height: 100%;
    border: 1px solid #666666; /*设置边框粗细，实线，颜色*/
    text-align: center; /*文本居中*/
    border-collapse: collapse; /*边框重叠，否则你会看到双实线*/
    table-layout: fixed;
    margin-bottom: 10px;
    margin-top: 10px;
    th,
    td {
      height: 40px;
      border: 1px solid #666666;
      color: #000000;
      padding: 5px 6px;
    }
    .header, .footer {
      background: #ccc;
    }
    .high {
      &>td {
        height: 120px;
      }
    }
  }
  .sign-box {
    width: 100%;
    padding: 10px 10px;
    height: 250px;
    div {
      width: 50%;
      float: left;
      line-height: 40px;
    }
    .date {
      color: red;
    }
  }
  .footer-date {
    line-height: 200px;
  }
  .modal {
    ::v-deep.ant-modal-body {
      background:#f4f4f4;
      padding: 10px 5px;
    }
    .tips {
      color: red;
      width: 100%;
      background: #fff;
      height:28px;
      line-height: 28px;
      padding-left: 6px;
    }
    .content {
      color: #000;
      width: 800px;
      margin: 10px auto;
      background: #fff;
      padding: 30px 10px 20px 10px;
    }
    .ant-modal-footer {
      &>div {
        margin: 10px 0;
        text-align: center;
      }
    }
    ::v-deep.ant-modal-header{
      .ant-modal-title {
        border-left: 3px solid @primary-color;
        padding-left: 5px;
        font-weight: 600;
      }
    }
  } 
  em {
    font-size: 14px;
    display: inline-block;
    padding: 0 10px;
    font-style: normal;
    border-bottom: 1px solid #000;
    line-height: 20px;
  }
</style>