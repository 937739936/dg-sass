<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="900px"
    :forceRender="true"
    title="单据详情"
    class="modal"
  >
    <p class="tips">说明：该数据由国投曹妃甸港口提供</p>
    <div class="content">
      <div class="title-box">
        <h2 class="title">
          国投曹妃甸港口有限公司
        </h2>
        <h2 class="title">
          <span>港口内贸货物航次作业委托单</span>
        </h2>
        <span class="title-left">作业委托人、港口经营人、货物接收人的有关权利、义务,适合（港口货物作业规格）</span>
        <div class="title-right">
          <p>货运单证</p>
          <p>编号：{{modalInfo.number}}</p>
        </div>
      </div>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="2" rowspan="2">作业委托人</td>
          <td colspan="2">名称</td>
          <td colspan="5">{{modalInfo.operationalClient}}</td>
          <td colspan="2">起运港</td>
          <td colspan="3">{{modalInfo.loadingPort}}</td>
          <td colspan="2">中转港</td>
          <td colspan="2">{{modalInfo.transferPort}}</td>
        </tr>
        <tr>
          <td colspan="2">地址电话</td>
          <td colspan="5">
            <p>{{modalInfo.operationalClientAddress}}</p>
            <p>{{modalInfo.operationalClientMobile}}</p>
          </td>
          <td colspan="2">到达港</td>
          <td colspan="3">{{modalInfo.arrivePort}}</td>
          <td colspan="2">是否移泊</td>
          <td colspan="2">{{modalInfo.isShift == 'true'?'是':'否'}}</td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">货物接收人</td>
          <td colspan="2">名称</td>
          <td colspan="5">{{modalInfo.goodsReceiver}}</td>
          <td colspan="2">船名</td>
          <td colspan="3">{{modalInfo.shipName}}</td>
          <td colspan="1" rowspan="2">港口经营人</td>
          <td colspan="1">名称</td>
          <td colspan="2">{{modalInfo.portManager}}</td>
        </tr>
        <tr>
          <td colspan="2">地址电话</td>
          <td colspan="5">
            <p>{{modalInfo.goodsReceiverAddress}}</p>
            <p>{{modalInfo.goodsReceiverMobile}}</p>
          </td>
          <td colspan="2">航次</td>
          <td colspan="3">{{modalInfo.voyage}}</td>
          <td colspan="1">地址电话</td>
          <td colspan="2">
            <p>{{modalInfo.portManagerAddress}}</p>
            <p>{{modalInfo.portManagerMobile}}</p>
          </td>
        </tr>
      </table>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="2">提运单号</td>
          <td colspan="2">识别标志</td>
          <td colspan="2">货物名称</td>
          <td colspan="1">件数</td>
          <td colspan="1">包装方式</td>
          <td colspan="2">计划载重量（吨）</td>
          <td colspan="1.5">体积(m3)</td>
          <td colspan="2">实际载重量（吨）</td>
          <td colspan="1">流向</td>
          <td colspan="1">费率</td>
          <td colspan="4">作业费用及结算方式</td>
        </tr>
        <tr v-for="(item, index) in modalInfo.waybillsList" :key="index">
          <td colspan="2">{{item.waybillsNumber}}</td>
          <td colspan="2">{{item.mark}}</td>
          <td colspan="2">{{item.goodsName}}</td>
          <td colspan="1">{{item.quantity}}</td>
          <td colspan="1">{{item.packing}}</td>
          <td colspan="2">{{item.planWeight}}</td>
          <td colspan="1.5">{{item.volume}}</td>
          <td colspan="2">{{item.realityWeight}}</td>
          <td colspan="1">{{item.flowDirection}}</td>
          <td colspan="1">{{item.rate}}</td>
          <td colspan="4">{{item.feeAndSettlementMethod}}</td>
        </tr>
        <tr>
          <td colspan="2">合计</td>
          <td colspan="2"></td>
          <td colspan="2"></td>
          <td colspan="1">{{Number(modalInfo.totalQuantity) || ''}}</td>
          <td colspan="1"></td>
          <td colspan="2">{{Number(modalInfo.totalPlanWeight) || ''}}</td>
          <td colspan="1.5">{{Number(modalInfo.totalVolume) || ''}}</td>
          <td colspan="2">{{Number(modalInfo.totalRealityWeight) || ''}}</td>
          <td colspan="1"></td>
          <td colspan="1"></td>
          <td colspan="4"></td>
        </tr>
      </table>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="2">其他约定</td>
          <td colspan="14">{{modalInfo.otherAppoint}}</td>
        </tr>
      </table>
      <div class="flex">
        <p>作业委托人(签章)：
          <span class="date">{{modalInfo.operationalClientSignDate}}</span>
        </p>
        <p>港口经营人(签章)：
          <span class="date">{{modalInfo.portManagerSignDate}}</span>
        </p>
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
      this.modalInfo.totalQuantity = 0
      this.modalInfo.totalPlanWeight = 0
      this.modalInfo.totalVolume = 0
      this.modalInfo.totalRealityWeight = 0
      if (this.modalInfo?.waybillsList?.length) {
        this.modalInfo.waybillsList.forEach(element => {
          this.modalInfo.totalQuantity = (Number(element.quantity) + Number(this.modalInfo.totalQuantity)).toFixed(2)
          this.modalInfo.totalPlanWeight = (Number(element.planWeight) + Number(this.modalInfo.totalPlanWeight)).toFixed(2)
          this.modalInfo.totalVolume = (Number(element.volume) + Number(this.modalInfo.totalVolume)).toFixed(2)
          this.modalInfo.totalRealityWeight = (Number(element.realityWeight) + Number(this.modalInfo.totalRealityWeight)).toFixed(2)
        });
      }
      if(this.modalInfo.operationalClientSignDate) {
        let arr = this.modalInfo.operationalClientSignDate.split('-')
        this.modalInfo.operationalClientSignDate = arr.join('/')
      }
      this.visible = true
    },
    close(){
      this.visible = false
    }
  }
};
</script>
<style lang="less" scoped>
  .title-box {
    position: relative;
    min-height: 60px;
    margin: 0 0 15px 0;
  }
  .title {
    text-align: center;
    font-size: 22px;
    margin-bottom: 6px;
    span {
      border-bottom: 2px solid #000;
      display: inline-block;
      letter-spacing: 3px;
    }
  }
  .title-left {
    border: 1px solid #000;
    padding: 2px 5px;
    font-size: 14px;
    position: absolute;
    left: 0px;
    top: 14px;
    width: 210px;
  }
  .title-right {
    position: absolute;
    right: 0px;
    bottom: 0;
    font-size: 14px;
  }
  .table-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 30px;
  }
  .table-title.special {
    justify-content: flex-start;
    span {
      display: inline-block;
      margin-right: 80px;
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
    th,
    td {
      height: 40px;
      border: 1px solid #666666;
      color: #000000;
      padding: 10px 5px;
    }
  }
  .flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 80px;
      p {
        display: inline-block;
        margin-right: 80px;
        margin-left: 30px;
        position: relative;
        span {
          color: red;
          position: absolute;
          left: 30px;
          top: 50px;
        }
      }
    }
  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    p {
      line-height: 24px;
    }
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
  
</style>