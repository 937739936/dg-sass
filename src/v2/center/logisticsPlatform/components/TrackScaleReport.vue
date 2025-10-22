<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="900px"
    :forceRender="true"
    title="轨道衡详情"
    class="modal"
  >
    <p class="tips">说明：该数据由国投曹妃甸港口提供</p>
    <div class="content">
      <h2 class="title"><span>轨道衡衡重报告</span></h2>
      <div class="table-title">
        <span>编号：{{modalInfo.number}}</span>
        <span>时间：{{modalInfo.billsTime}}</span>
        <span>货运单证：C</span>
      </div>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="4">车次</td>
          <td colspan="6">{{modalInfo.trainNumber}}</td>
          <td colspan="4">发站</td>
          <td colspan="6">{{modalInfo.deliveryStation}}</td>
        </tr>
        <tr>
          <td colspan="4">车数</td>
          <td colspan="6">{{modalInfo.trainQuantity}}</td>
          <td colspan="4">车型</td>
          <td colspan="6">{{modalInfo.trainType}}</td>
        </tr>
        <tr>
          <td colspan="4">煤种</td>
          <td colspan="6">{{modalInfo.coalType}}</td>
          <td colspan="4">垛位</td>
          <td colspan="6">{{modalInfo.stackingPosition}}</td>
        </tr>
        <tr>
          <td colspan="4">发货人</td>
          <td colspan="16">{{modalInfo.deliverName}}</td>
        </tr>
        <tr>
          <td colspan="4">收货人</td>
          <td colspan="16">{{modalInfo.receiverName}}</td>
        </tr>
      </table>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="20">称重结果</td>
        </tr>
        <tr>
          <td colspan="10">货票吨数</td>
          <td colspan="10">{{modalInfo.waybillQuantity}}</td>
        </tr>
        <tr>
          <td colspan="10">毛重吨数</td>
          <td colspan="10">{{modalInfo.roughWeight}}</td>
        </tr>
        <tr>
          <td colspan="10">净重吨数</td>
          <td colspan="10">{{modalInfo.netWeight}}</td>
        </tr>
        <tr>
          <td colspan="10">盈亏吨数</td>
          <td colspan="10">{{modalInfo.profitLossQuantity}}</td>
        </tr>
        <tr>
          <td colspan="10">过衡单据</td>
          <td colspan="10">{{modalInfo.scaleBills}}</td>
        </tr>
        <tr>
          <td colspan="20">备注</td>
        </tr>
        <tr class="high">
          <td colspan="20">{{modalInfo.remark}}</td>
        </tr>
        <tr>
          <td colspan="10">委托人签字(盖章)</td>
          <td colspan="10">煤管计划员签字(签章)</td>
        </tr>
        <tr class="high">
          <td colspan="10">
            <p class="name">{{modalInfo.consignor}}</p>
            <p class="date">{{modalInfo.reportTime}}</p>
          </td>
          <td colspan="10">
            <p class="name">{{modalInfo.coalPlanner}}</p>
            <p class="date">{{modalInfo.reportTime}}</p>
          </td>
        </tr>
      </table>
    </div>
    <div class="content">
      <h2 class="title">国投曹妃甸港动态电子轨道衡计量表
        <b>卸车编号：{{modalInfo.unloadNumber}}</b>
      </h2>
      <div class="table-title">
        <span>进港日期：{{modalInfo.inPortDate}}</span>
        <span>进港时间：{{modalInfo.inPortTime}}</span>
        <span>离港日期：{{modalInfo.outPortDate}}</span>
        <span>离港时间：{{modalInfo.outPortTime}}</span>
      </div>
      <div class="table-title">
        <span>车数：{{modalInfo.trainQuantity}}</span>
        <span>翻车机：{{modalInfo.carTippler}}</span>
        <span>车次：{{modalInfo.trainNumber}}</span>
        <span>到站：{{modalInfo.arriveStation}}</span>
        <span>煤种：{{modalInfo.coalType}}</span>
      </div>
      <div class="table-title special">
        <span>发货人：{{modalInfo.deliverName}}</span>
        <span>收货人：{{modalInfo.receiverName}}</span>
      </div>
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      > 
        <tr class="header">
          <td colspan="1">序号</td>
          <td colspan="2">车号</td>
          <td colspan="2">重车吨</td>
          <td colspan="2">空车吨</td>
          <td colspan="2">标重</td>
          <td colspan="2">速度</td>
          <td colspan="2">实重</td>
          <td colspan="2">盈亏</td>
        </tr>
        <tr v-for="(item, index) in modalInfo.railwayWagonList" :key="index">
          <td colspan="1">{{ index + 1 }}</td>
          <td colspan="2">{{ item.trainNumber }}</td>
          <td colspan="2">{{ item.fullQuantity }}</td>
          <td colspan="2">{{ item.emptyQuantity }}</td>
          <td colspan="2">{{ item.indicatedWeight }}</td>
          <td colspan="2">{{ item.speed }}</td>
          <td colspan="2">{{ item.trueWeight }}</td>
          <td colspan="2">{{ item.profitLoss }}</td>
        </tr>
        <tr class="footer">
          <td colspan="1">合计</td>
          <td colspan="2"></td>
          <td colspan="2">{{Number(modalInfo.totalFullQuantity) || ''}}</td>
          <td colspan="2">{{Number(modalInfo.totalEmptyQuantity) || ''}}</td>
          <td colspan="2"></td>
          <td colspan="2"></td>
          <td colspan="2">{{Number(modalInfo.totalTrueWeight) || ''}}</td>
          <td colspan="2">{{Number(modalInfo.totalProfitLoss) || ''}}</td>
        </tr>
      </table>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="close">关闭</a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: 'TrackScaleReport',
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
      this.modalInfo.totalFullQuantity = 0
      this.modalInfo.totalEmptyQuantity = 0
      this.modalInfo.totalTrueWeight = 0
      this.modalInfo.totalProfitLoss = 0
      if (this.modalInfo?.railwayWagonList?.length) {
        this.modalInfo.railwayWagonList.forEach(element => {
          this.modalInfo.totalFullQuantity = (Number(element.fullQuantity) + Number(this.modalInfo.totalFullQuantity)).toFixed(2)
          this.modalInfo.totalEmptyQuantity = (Number(element.emptyQuantity) + Number(this.modalInfo.totalEmptyQuantity)).toFixed(2)
          this.modalInfo.totalTrueWeight = (Number(element.trueWeight) + Number(this.modalInfo.totalTrueWeight)).toFixed(2)
          this.modalInfo.totalProfitLoss = (Number(element.profitLoss) + Number(this.modalInfo.totalProfitLoss)).toFixed(2)
        });
      }
      this.modalInfo.reportTime = this.formatTime(this.modalInfo.reportTime)
      this.visible = true
    },
    close(){
      this.visible = false
    },
    formatTime() {
      if (this.modalInfo.reportTime) {
        let dateArr = this.modalInfo.reportTime.split('-')
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
    span {
      text-decoration:underline;
      border-bottom: 2px solid #000;
    }
    b {
      font-size: 14px;
      color: #333;
      float: right;
      font-weight: 400;
      display: inline-block;
      margin-top: 10px;
    }
  }
  .table-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
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
      padding: 5px 6px;
    }
    .header, .footer {
      background: #ccc;
    }
    .high {
      &>td {
        height: 120px;
        position: relative;
      }
      
    }
    .name {
      font-size: 20px;
      font-weight: bold;
      position: absolute;
      left: 125px;
      top: 35px;
    }
    .date {
      position: absolute;
      left: 140px;
      bottom: 10px;
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
      padding: 30px 20px 20px 20px;
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