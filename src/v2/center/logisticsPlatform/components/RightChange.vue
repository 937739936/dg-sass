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
      <div class="title-box">
        <h2 class="title">
          <span>内贸煤炭变更申请表</span>
        </h2>
        <span class="title-left">内贸</span>
        <div class="title-right">
          <p>货运单证<span v-if="modalInfo.billsType">（{{modalInfo.billsType}}）</span></p>
          <p>编号：{{modalInfo.number}}</p>
        </div>
      </div>
      
      <table
        cellspacing="0"
        cellpadding="0"
        class="modalTable"
      >
        <tr>
          <td colspan="5">
            <div>
              <p class="little-title">变更申请</p>
              <p>我单位在<em>贵</em>公司存<em>{{modalInfo.coalType}}</em>煤约为<em>{{modalInfo.quantity}}</em>吨，同意变更给<em>{{modalInfo.assignee}}</em>请予以办理。</p>
            </div>
            <div class="little-content">
              <p>船名：<em>{{modalInfo.shipName}}</em></p>
              <p>航次：<em>{{modalInfo.voyage}}</em></p>
              <p>场地：<em>{{modalInfo.place}}</em></p>
              <p>原作业委托人(印章):</p>
            </div>
            <p class="flex">经办人:{{modalInfo.transferorOperator}}<span>电话:{{modalInfo.transferorOperatorMobile}}</span></p>
            <p class="date">{{modalInfo.transferorSignTime}}</p>
          </td>
          <td colspan="5">
            <p class="little-title">接收证明</p>
            <p>我单位同意接收<em>{{modalInfo.transferor}}</em>在<em>贵</em>公司存<em>{{modalInfo.coalType}}</em>煤约为<em>{{modalInfo.quantity}}</em>吨，请予办理。</p>
            <div class="little-content">
              <p>船名：<em>{{modalInfo.shipName}}</em></p>
              <p>航次：<em>{{modalInfo.voyage}}</em></p>
              <p>场地：<em>{{modalInfo.place}}</em></p>
              <p>新作业委托人(印章):</p>
            </div>
            <p class="flex">经办人:{{modalInfo.assigneeOperator}}<span>电话:{{modalInfo.assigneeOperatorMobile}}</span></p>
            <p class="date">{{modalInfo.assigneeSignTime}}</p>
          </td>
          <td colspan="5" class="parent-td-top">
            <div class="td-top">
              <p class="little-title">港口经营人</p>
              <p>同意变更<em>{{modalInfo.coalType}}</em>煤约为<em>{{modalInfo.quantity}}</em>吨。</p>
            </div>
            <div class="little-content">
              <p>船名：<em>{{modalInfo.shipName}}</em></p>
              <p>航次：<em>{{modalInfo.voyage}}</em></p>
              <p>场地：<em>{{modalInfo.place}}</em></p>
              <p class="portName">港口经营人(印章):</p>
            </div>
            <p class="date">{{modalInfo.portManagerSignDate}}</p>
          </td>
        </tr>
      </table>
      <p>附:《合同条款》</p>
      <p>作业委托人(简称甲方)，港口经营人(简称乙方)</p>
      <div class="footer-content">
        <div> 
          <p>1、甲方的责任与义务</p>
          <p>(1)&nbsp;拥有煤炭在港所有权</p>
          <p>(2)&nbsp;协助乙方管理在港煤炭，包括采样、监装、水尺交接、调账工作</p>
          <p>(3)&nbsp;甲方应于装船前结清港口费用</p>
          <p>(4)&nbsp;如甲方不能及时运输在港煤炭，则应承担由此产生的超期堆存费</p>
          <p>(5)&nbsp;“货运单证(实装过户)”中变更数量为计划数量，实装变更数量已实际数量为准</p>
        </div>
        <div>
          <p>2、乙方的责任与义务</p>
          <p>(1)&nbsp;煤炭装船后，与承运人办理水尺交接手续</p>
          <p>(2)&nbsp;为甲方提供港口煤炭推荐服务</p>
          <p>(3)&nbsp;及时向甲方通报煤炭在港情况</p>
        </div>
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
    min-height: 56px;
  }
  .title {
    text-align: center;
    font-size: 22px;
    span {
      text-decoration:underline;
      border-bottom: 2px solid #000;
      display: inline-block;
      letter-spacing: 5px;
    }
  }
  .title-left {
    border: 1px solid #000;
    padding: 5px 20px;
    font-size: 16px;
    position: absolute;
    left: 0px;
    top: 6px;
  }
  .title-right {
    position: absolute;
    right: 0px;
    top: -8px;
    font-size: 15px;
    max-width: 240px;
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
    td{
      position: relative;
      padding-bottom: 30px;
      .td-top{
        position: absolute;
        top: 10px;
      } 
    }
    p {
      font-size: 15px;
      text-align: left;
      em {
        font-size: 14px;
        display: inline-block;
        padding: 0 10px;
        font-style: normal;
        border-bottom: 1px solid #000;
      }
    }
    .little-title {
      font-size: 20px;
      text-align: center;
    }
    .little-content {
      padding: 15px 20px;
      overflow: hidden;
      p:last-child{
        float: right;
      }
    }
    .flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      span {
        display: inline-block;
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
  .date {
    position: absolute;
    bottom: 5px;
    right: 30px;
  }
  .portName {
    position: absolute;
    bottom: 35px;
    right: 20px;
  }
</style>