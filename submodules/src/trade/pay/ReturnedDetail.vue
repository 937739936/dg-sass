<template>
  <div>
    <a-card :bordered="false" style="padding-bottom: 12px;">
      <div slot="title" class="slTitle">
        <span>回款详情</span>
      </div>
      <a-row type="flex" class="flex-top-box">
        <a-col flex="1">
          <div class="titleInfoBox" >
            <div class="titleInfoTitle">
              <a-space :size="12">
                <em class="contractTypeSymbol" style="background: #91C7CB">回</em>
                <div @mouseenter="copyVisible = true"  @mouseleave="copyVisible = false" style="margin-right:20px">

                  <span class="cur" style="margin-right:10px">回款编号：{{detailInfo.collectionFlowVo.receiveSerialNo}}</span>
                  <Copy class="cur"  v-show="!copyVisible"></Copy>
                  <span
                    v-show="copyVisible"
                    v-clipboard:success="onCopy" 
                    v-clipboard:error="onError"  
                    v-clipboard:copy="detailInfo.collectionFlowVo.receiveSerialNo"
                  >
                    <CopyNow  class="cur" ></CopyNow>
                  </span>
                </div>
                <p class="status" :class="detailInfo.collectionFlowVo.claimResult">
                  <span class="text">{{detailInfo.collectionFlowVo.claimResultDesc}}</span>
                </p> 
              </a-space>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="supple-info">
        <div class="titleInfoItem">
          <span class="label">回款方：</span>
          <span class="omit">
            <a-tooltip>
              <template slot="title">
               {{detailInfo.collectionFlowVo.paymentCompanyName}}
              </template>
              {{detailInfo.collectionFlowVo.paymentCompanyName}}
            </a-tooltip>
            
          </span>
            <!-- <span v-else>-</span> -->
        </div>
        <div class="titleInfoItem">
          <span class="label" style="width:80px">收款方：</span>
          <span class="omit"  >
            <a-tooltip>
              <template slot="title">
               {{detailInfo.collectionFlowVo.receiveCompanyName}}
              </template>
              {{detailInfo.collectionFlowVo.receiveCompanyName}}
            </a-tooltip>
          </span>
          <!-- <span v-else>-</span> -->
        </div>
        <div class="titleInfoItem">
          <span class="label" >数据来源：</span>
          <span>{{detailInfo.collectionFlowVo.dataSourceDesc}}</span>
        </div>
        <div class="titleInfoItem">
          <span class="label" >创建时间：</span>
          <span>{{detailInfo.collectionFlowVo.createTime}}</span>
        </div>
      </a-row>
    </a-card>
    <a-card :bordered="false" class="pt0 bot">
      <a-tabs >
        <a-tab-pane key="contractInfo" tab="回款信息">
          <div>
            <div class="slTitleAssis" style="margin:30px 0">回款信息</div>
            <div>
              <ul class="grid-wrap transportBox">
                <li>
                  <span class="label">回款账号名称</span>
                  <span >{{detailInfo.collectionFlowVo.paymentName || '-'}}</span>
                </li>
                <li>
                  <span class="label">回款账号开户行</span>
                  <span class="special">
                    <a-tooltip >
                      <template slot="title">
                          {{detailInfo.collectionFlowVo.paymentAccountBank || '-'}}
                      </template>
                      {{detailInfo.collectionFlowVo.paymentAccountBank || '-'}}
                      
                    </a-tooltip>
                  </span>
                </li>
                <li>
                  <span class="label">回款账号</span>
                  <span>{{formatAccountNumber(detailInfo.collectionFlowVo.paymentAccount) || '-'}}</span>
                </li>
                <li>
                  <span class="label">收款账号名称</span>
                  <span>
                    {{detailInfo.collectionFlowVo.receiveName || '-'}}</span>
                </li>
                <li>
                  <span class="label">收款账号开户行</span>
                  <span class="special">
                    <a-tooltip >
                      <template slot="title">
                          {{detailInfo.collectionFlowVo.receiveAccountBank || '-'}}
                      </template>
                      {{detailInfo.collectionFlowVo.receiveAccountBank || '-'}}
                      
                    </a-tooltip>
                  </span>
                </li>
                <li>
                  <span class="label">收款账号</span>
                  <span>
                    {{formatAccountNumber(detailInfo.collectionFlowVo.receiveAccount) || '-'}}</span>
                </li>
                <li>
                  <span class="label">回款方式</span>
                  <span>{{detailInfo.collectionFlowVo.collectionTypeDesc}}</span>
                </li>
                <li>
                  <span class="label">回款日期</span>
                  <span v-if="detailInfo.collectionFlowVo.receiveDate">{{moment(detailInfo.collectionFlowVo.receiveDate).format('yyyy-MM-DD')}}</span>
                </li>
                <li>
                  <span class="label">回款金额(元)</span>
                  <span style="color: var(--vi, #F46332);fontWeight:600">{{formatMoney(detailInfo.collectionFlowVo.receiveAmount)}}</span>
                </li>
              </ul>
            </div>
            <div class="slTitleAssis" style="margin:30px 0" v-if="detailInfo.attachmentList.length">附件</div>
            <a-table
              :columns="filesColumns"
              border
              v-if="detailInfo.attachmentList.length"
              class="new-table"
              :bordered="false"
              rowKey="fileUrl"
              :dataSource="filesList"
              :pagination="false"
            >
              <template slot="no" slot-scope="text,record">
                <span class="preview-box"   v-for="(item, index) in record.list" :key="index">
                 
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                          {{item.uploadTime}}
                        </template>
                      <a href="javascript:;" class="preview" @click="handlePreview(item)" >
                          {{item.name}}
                        </a>
                    </a-tooltip>
                  <span class="line" style="margin: 0 14px;vertical-align: sub;" v-if="index != record.list.length - 1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="14" viewBox="0 0 2 14" fill="none">
                      <path d="M1 0V14" stroke="#E9EFFC"/>
                    </svg>
                  </span>
                </span>
              </template>
              <template slot="action" slot-scope="text,items">
                <a-space :size="20">
                  <a href="javascript:;" @click="download(items)" >下载</a>
                </a-space>
              </template>
            </a-table>
            <div class="slTitleAssis" style="margin:30px 0">回款认领</div>
            <div class="money-box">
              <div class="money-box-item">
                <p>回款金额(元)</p>
                <p>{{ detailInfo.collectionFlowVo.receiveAmount | formatMoney(2)}}</p>
              </div>
              <div class="money-box-item" style="background: #FFF9F0;">
                <p>已认领金额(元)</p>
                <p>{{detailInfo.claimedAmount | formatMoney(2)}}</p>
              </div>
              <div class="money-box-item" style="background: #EBFAEF;">
                <p>可认领金额(元)</p>
                <p>{{detailInfo.notClaimedAmount | formatMoney(2)}}</p>
              </div>
            </div>
            <a-table class="new-table"  :scroll='{x:true}' :columns="columns" :dataSource="detailInfo.collectionFlowClaimedVoList" :pagination="false" rowKey="id">
              <!-- 认领类型-->
              <template slot="type" slot-scope="text,record">
                <div v-if="record.type == 'FINANCING_CLAIM'" class="business-box">
                  <p class="business">
                    <span>业务线号：</span><a href="javascript:;" style="margin-right:5px" @click="goBusinessLine(record)">{{record.businessLineNo}}</a>
                  </p>
                  <p>业务线名称：{{record.businessLineName}}</p>
                  <p><span>采购合同：{{record.upstreamContractNo}}</span> <span style="margin-left:5px">签订日期：{{record.upstreamContractSignDate}}</span> </p>
                  <p><span>销售合同：{{record.downstreamContractNo}}</span> <span style="margin-left:5px">签订日期：{{record.downstreamContractSignDate}}</span> </p>
                </div>
                <div  v-if="record.type == 'NOT_BUSINESS_CLAIM'"  class="business-box">
                  <p>
                    <span>销售合同编号：</span><a ref="javascript:;" style="margin-right:5px" @click="goSellContract(record)">{{record.downstreamContractNo}}</a>
                  </p>
                  <p>买方名称：{{record.buyerName}}</p>
                  <p>品名：{{record.goodsName}}</p>
                  <p>运输方式：{{record.transportModeDesc}}</p>
                  <p>收货人：{{record.consigneeCompanyName || '-'}}</p>
                  <p>交货期限：{{record.execDateStart}} - {{record.execDateEnd}}</p>

                </div>
                <div  v-if="record.type == 'NON_FINANCING_CLAIM'" class="business-box2">
                  注：下游合同未在数链平台补录。
                </div>
              </template>
              <template slot="downstreamSettleAmount" slot-scope="text,record">
                <span >{{record.downstreamSettleAmount | formatMoney(2)}}</span>
              </template>
              <template slot="claimedAmount" slot-scope="text,record">
                <span href="javascript:;">  {{record.currentClaimedAmount | formatMoney(2)}}</span>
                <!-- <span v-if="record.type == 'NON_FINANCING_CLAIM'"> - </span> -->

              </template>
              <template slot="currentClaimedAmount" slot-scope="text,record">
                <span href="javascript:;" >  {{record.currentClaimedAmount | formatMoney(2)}}</span>


              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="contractOperation" tab="操作记录" v-if=" [2,3].includes(detailInfo.collectionFlowVo.dataSource) ">
          <LogList :list='logList' :columns='logColumns'></LogList>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </div>
</template>

<script>
import {Copy, CopyNow} from '../../components/svg/index'
import LogList from '../../components/LogList.vue'
import { formatMoney } from '@sub/filters'
import { formatAccountNumber  } from '../../utils/factory.js'

import moment from 'moment'
const filesColumns = [
  { title: "文件类型", dataIndex: "typeName", width: 120},
  { title: "文件编号", dataIndex: "no", scopedSlots: { customRender: "no" }, },
  { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },align:'center',  width: 120},
]
const columns = [
  { dataIndex: 'claimTypeDesc', title: '认领类型'},
  { dataIndex: 'paymentTypeDesc', title: '收款类型', customRender:(text)=>{
    return text || '-'
  }},
  { dataIndex: 'type',title: '认领信息', scopedSlots: { customRender: 'type' }, width: 420},
  { dataIndex: 'downstreamSettleAmount',title: '下游结算金额(元)', scopedSlots: { customRender: 'downstreamSettleAmount' }},
  { dataIndex: 'claimedAmount' ,title: '已认领金额(元)',scopedSlots: { customRender: 'claimedAmount' }},

  // { dataIndex: 'currentClaimedAmount' ,title: '本次领金额(元)',scopedSlots: { customRender: 'currentClaimedAmount' }},




]
export default {
  props: {
    logList: {
      default: () => {return []}
    },
    detailInfo: {
      // default: () => {return {
      //   collectionFlowVo: {}

      // }}
    }
  },
  watch: {
    detailInfo(val) {
      
    }
  },
  data() {
    return {

      copyVisible: false,
      filesColumns,
      columns,
      logColumns: [
        { title: "操作类型", dataIndex: "operationType",},
        { title: "操作人", dataIndex: "personalName",},
        { title: "所属公司", dataIndex: "companyName",},
        { title: "操作内容", dataIndex: "comments",},
        { title: "操作时间", dataIndex: "operationTime",},

      ]

    }
  },
  computed:{
    filesList() {
      return [
        {
          typeName: '汇款凭证',
          no: '111',
          list: this.detailInfo.attachmentList,

        }
      ]
    }
  },
  methods: {
    formatMoney,
    moment,
    formatAccountNumber,
       // 复制成功 or 失败（提示信息！！！）
    onCopy: function (e) {
      this.$message.success('复制成功')
      console.log('复制成功！', e)
    },
    onError: function (e) {
      this.$message.error('复制失败')
      console.log('复制失败！', e)
    },
    handlePreview(item) {
      this.$emit('handlePreview', item)
    },
    goBusinessLine(item) {
      this.$emit('goBusinessLine', item)
    },
    goSellContract(item) {
      this.$emit('goSellContract', item)
    },
    download(item) {
      this.$emit('download', item)
    }
  },
  components: {
    Copy,
    CopyNow,
    LogList,
    

  }
}
</script>
<style lang="less" scoped>
@import url("../../style/table.less");
</style>
<style scoped  lang='less' >
  .cur {
    cursor: pointer;
  }
  .slMain{
    font-family: PingFangSC-Regular, PingFang SC;
    .label,.fontlabel {
      color: rgba(0,0,0,0.4);
    }
    .slTitle {
      margin-bottom: 20px;
    }
    .titleInfoBox {
      .titleInfoTitle {
        margin-bottom: 20px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 22px;
      }
    }
    .supple-info {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .titleInfoItem {
        width: 25%;
        display: inline-block;
        // padding-left: 112px;
        position: relative;
        height: 40px;
        float: left;
        .label {
          display: inline-block;
          width: 80px;
          text-align: left;
        }
        .omit {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
          vertical-align: bottom;
          width: calc(100% - 80px);
        }
      }
    }
    .ant-card {
      padding: 20px 30px;
      margin-bottom: 20px;
    }
    .ant-card:last-child {
      margin-bottom: 0;
    }
  }
  .contract-status {
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    padding:0 5px;
      background: #C9D9FF;
      color: #596FA0;
    font-family: PingFangSC-Regular, PingFang SC;
    text-align: center;
    .text {
      font-size: 14px;
      zoom: 0.85;
      position: relative;
      top: -1px;
    }
  }
  .contractTypeSymbol {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: var(--vi, #91C7CB);
    color: #fff;
    text-align: center;
    line-height: 18px;
    border-radius: 4px;
    font-style: normal;
    font-size: 14px;
    position: relative;
    top: -1px;
    font-weight: 600;
  }
  .bot {
    margin-bottom:0px !important;
    padding-bottom:64px !important;
    padding-top:0px !important;
    background: #fff !important;
  }
  .grid-wrap {
    margin-top: 10px;
    width: 100%;
    border-radius: 3px;
    padding: 0;
    height: auto;
    overflow: hidden;
    border-left: 1px solid #E5E6EB;
    li {
      width: 33.3%;
      height: 48px;
      float: left;
      border-bottom: 1px solid #E5E6EB;
      border-right: 1px solid #E5E6EB;
      overflow: hidden;
      position: relative;
      span {
        display: inline-block;
        height: 48px;
        line-height: 48px;
        padding: 0 12px;
      }
      &>span:first-child {
        border-right: 1px solid #E5E6EB;
      }
      .label{
        width: 160px;
        background: #F3F5F6;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #77889D;
        position: absolute;
        left: 0;
        top: 0;
      }
      span:last-child{
        width: 100%;
        padding-left: 172px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    li:nth-child(1),li:nth-child(2), li:nth-child(3) {
      border-top: 1px solid #E5E6EB;
    }
    li:nth-child(3){
      border-radius: 0 3px 0 0;
    }
    li:last-child {
      border-radius: 0 0 3px 0;
    }
    li.special {
      border-radius: 0 3px 3px 0;
    }
  }
  .transportBox {
    .textOverflow {
      height: 48px;
      line-height: 48px;
      left: 160px;
      padding: 0 10px;
    }
  }
  .preview-box {

  }
  .line {

  }
  .money-box {
    display: flex;
    margin-bottom: 30px;
    &-item{
      width: 250px;
      height: 88px;
      flex-shrink: 0;
      border-radius: 6px;
      background: #F0F8FF;
      margin-right: 30px;
      padding: 14px 0;
      padding-left: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: var(--text-40, rgba(0, 0, 0, 0.40));
      p:last-child {
        color: var(--text-80, rgba(0, 0, 0, 0.80));
        font-family: PingFang SC;
        font-size: 20px;
        font-weight: 600;
      }
    }
  
  }
.business-box {
  p {
    color: var(--text-40, rgba(0, 0, 0, 0.40));
    font-family: PingFang SC;
    font-size: 12px;
  }
  P:first-child {
    color: var(--text-80, rgba(0, 0, 0, 0.80));
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}
.business-box2 {
  color: var(--text-40, rgba(0, 0, 0, 0.40));
  font-size: 14px;
}
.status {
  border-radius: 4px;
  background: #C1D7FF;
  display: inline-flex;
  padding: 1px 6px;
  align-items: flex-start;
  gap: 10px;
  color: #4682F3;
  font-family: PingFang SC;
  font-size: 12px;
}
.PART_CLAIM {
  background: #FFDAC8;
  color: #FF7937;
}
.CLAIMED {
  color: #3EB384;
  background: #C5ECDD;
}
.special {
 ::v-deep span {
    padding: 0 !important;
  }
}

</style>
