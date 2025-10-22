<template>
  <div class="slMain">
    <breadcrumb />
    <a-card class="invoice-detail" :bordered="false">
      <div class="title">上传负数发票</div>
      <div class="link">
        <div class="top" style="margin-top: 20px">
          发票与合同关联信息
        </div>
      </div>
      <div class='table-box'>
        <a-table
          :columns="contractColumns"
          class="new-table"
          :rowKey="record => record.orderNo"
          :dataSource="contractList"
          :pagination="false"
          :scroll="{ x: true }">
          <div slot="splitAmountTitle">
            拆分金额(元)
            <a-tooltip>
              <template slot="title">
                含税
              </template>
              <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size:12px"></i>
            </a-tooltip>
          </div>
          <template slot="splitAmount" slot-scope="text, record">
            <span>￥{{ text && fillDecimal((+record.splitAmount).toLocaleString()) }}  </span>
          </template>
        </a-table>
        <div class="tip">
          <span>价税合计总额</span> <span class="money" ><span class="money-symbol">￥</span>{{ fillDecimal((+invoiceVO.totalAmount || 0.00).toLocaleString()) }}</span>
          <span style="margin-left:30px">剩余拆分金额</span> <span class="money"><span class="money-symbol">￥</span>{{ fillDecimal(notSplitAmount).toLocaleString() }}</span>
          <p v-if="invoiceVO.stampTaxFlag == 2 && invoiceType =='DELIVER'">
            <span style="margin-left:30px">含印花税合计总额</span> <span class="money"><span class="money-symbol">￥</span>{{ fillDecimal(invoiceVO.stampTaxFlagTotalAmount || 0.00).toLocaleString() }}</span>
          </p>
          <p v-if="invoiceVO.stampTaxFlag == 1 && invoiceType =='DELIVER'">
            <span style="margin-left:30px">含印花税合计总额</span> <span class="money"><span class="money-symbol">￥</span>{{ fillDecimal(invoiceVO.totalAmount || 0.00).toLocaleString() }}</span>
          </p>
        </div>
      </div>
      <div class="link">
        <div class="top" style="margin-top: 20px">
          发票附件
        </div>
      </div>
      <div>
        <a-tabs :animated="false" defaultActiveKey="RED">
          <a-tab-pane
            key="ORIGIN"
            tab="原发票"
          >
            <div class="invoice-img-pane">
              <div class="affix" v-if="invoiceVO.attachment" @click="handlePreview(invoiceVO.attachment)">
                <img src="@/v2/assets/imgs/invoicetools/png-icon.png" alt="" style="width: 12px;margin-bottom: 2px">
                {{originInvoiceName}}
              </div>
              <div style="width: 100%; text-align:center;margin-bottom:40px" v-else>
                <img style="width:83px" src="@/assets/imgs/newInvoice/no_file.png" alt="">
                <p class="c8" style="color:#8495AA;margin-top:10px">暂无数据</p>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane
            key="RED"
            tab="负数发票"
          >
            <div class="invoice-img-pane">
              <div class="affix" v-if="redInvoiceVO.attachment" @click="handlePreview(redInvoiceVO.attachment)">
                <img src="@/v2/assets/imgs/invoicetools/png-icon.png" alt="" style="width: 12px;margin-bottom: 2px">
                {{redInvoiceName}}
              </div>
              <UploadNegativeAttachment
                v-else
                :invoiceType="invoiceType"
                :industryType="industryType"
                @handleNegativeInvoiceSuccess="getDetail"
                > 
              </UploadNegativeAttachment>
            </div>  
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="link">
        <div class="top" style="margin-bottom: 20px;">
          原发票信息
        </div>
      </div>
      <InvoiceDetailTable :invoiceVO="detailData.invoiceVO" :invoiceItemVOList="detailData.invoiceItemVOList"></InvoiceDetailTable>
      <div v-if="redInvoiceVO.attachment">
        <div class="link">
          <div class="top" style="margin-bottom: 20px; margin-top: 20px">
            负数发票信息
          </div>
        </div>
        <InvoiceDetailTable :invoiceVO="redInvoiceVO" :invoiceItemVOList="redInvoiceItemVOList"></InvoiceDetailTable>
      </div>
      <img :src="previewImg" style="display: none" ref="viewer" v-viewer />
      <div class="btn-box">
        <div
          class="btn-wrap"
          v-if="detailData"
        >
          <a-button
            @click="$router.back()"
            type='primary'
            >返回</a-button
          >
        </div>
      </div>
    </a-card>
    
  </div>
</template>

<script>
import ENV from "@/v2/config/env";
import breadcrumb from "@/v2/components/breadcrumb/index";
import { fillDecimal } from '@/v2/utils/factory.js';
import InvoiceDetailTable from './InvoiceDetailTable.vue'
import UploadNegativeAttachment from './UploadNegativeAttachment.vue'
import { getInvoiceDetail } from '@/v2/center/steels/api/invoice.js'

export default {
  name: 'UploadNegativeInvoice',
  components: {
    breadcrumb,
    InvoiceDetailTable,
    UploadNegativeAttachment
  },
  props: ["invoiceType", "industryType"],
  data() {
    return {
      previewImg: '',
      contractColumns: contractColumns,
      detailData: {} // 发票详情
    }
  },
  mounted() {
    this.getDetail()
  },
  computed: {
    detailDataNotEmpty() {
      return this.detailData || {}
    },
    // 发票与合同关联信息
    contractList() {
      return this.detailData.contractList || []
    },
    // 原发票信息
    invoiceVO() {
      return this.detailDataNotEmpty.invoiceVO || {}
    },
    // 原发票名称
    originInvoiceName() {
      let attachment = this.invoiceVO.attachment || ''
      const arr = attachment.split('/')
      if (arr.length === 0) {
        return ''
      }
      let name = arr[arr.length - 1]
      return decodeURIComponent(name);
    },
    redInvoiceVO() {
      return this.detailDataNotEmpty.redInvoiceVO || {}
    },
    redInvoiceItemVOList() {
      return this.detailDataNotEmpty.redInvoiceItemVOList || []
    },
    // 红冲发票名称
    redInvoiceName() {
      let attachment = this.redInvoiceVO.attachment || ''
      const arr = attachment.split('/')
      if (arr.length === 0) {
        return ''
      }
      let name = arr[arr.length - 1]
      return decodeURIComponent(name);
    },
    splitedAmount() {
      let splitedAmount = 0
        // 重新计算 拆分金额

        // 获取当前 有业务线号的
        // businessLineNo
        let obj = {}
        const hasNumberList =  this.contractList.filter(el => el.businessLineNo)
        /** 获取有相同业务线号的取最大值 */
        // 获取所有相同的业务线号数组
        hasNumberList.forEach(el => {
          if(obj[el.businessLineNo]) {
            obj[el.businessLineNo].push(el)
          } else {
            obj[el.businessLineNo] = [el]
          }
        })
        let hasSplitedAmount = 0
        let noNumberSplitedAmount = 0
        /** 遍历 相同的数组 取出每个相同 数组的 拆分金额最大值 */
        for(let key in obj) {
          const newArr = obj[key].filter(el => el.splitAmount || el.splitAmount === 0).map(el => Number(el.splitAmount))
          hasSplitedAmount += (Math.max.apply(null,newArr) * 100) / 100
        }
        const noNumberList =  this.contractList.filter(el => !el.businessLineNo)
        noNumberSplitedAmount = noNumberList.reduce((pre, cur, index, arr) => {
          // js 解决计算精度问题
          return (pre * 100 + cur.splitAmount * 100) / 100;
        }, 0)
         splitedAmount = hasSplitedAmount + noNumberSplitedAmount
         return splitedAmount;
    },
    notSplitAmount() {
      // TODO: 剩余拆分金额计算
      let notSplitAmount = 0
      if (this.invoiceVO.stampTaxFlag == 2 && this.invoiceVO.stampTaxFlagTotalAmount) {
          notSplitAmount = (this.invoiceVO.stampTaxFlagTotalAmount * 100 - this.splitedAmount * 100) / 100
        } else {
          notSplitAmount = (this.invoiceVO.totalAmount * 100 - this.splitedAmount * 100) / 100
        }
        if(notSplitAmount < 0) {
          notSplitAmount = 0
        }
      return notSplitAmount
    },
  },
  methods: {
    fillDecimal,
    // 预览
    handlePreview (path) {
      this.previewImg = ENV.BASE_NET + path;
      this.$refs.viewer.$viewer.show();
    },
    getDetail() {
      getInvoiceDetail({ invoiceId: this.$route.query.id }).then(res => {
        if (res.success) {
          this.detailData = res.data
        }
      })
    },
  }
}


const contractColumns = [
  {
    title: '合同编号',
    dataIndex: 'contractNo'
  },
  {
    title: '卖方名称',
    dataIndex: 'sellerName'
  },
  {
    title: '买方名称',
    dataIndex: 'buyerName'
  },
  {
    slots: { title: "splitAmountTitle" },
    scopedSlots: { customRender: 'splitAmount' },
  },
]

</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.invoice-detail {
  // background-color: #f0f2f5;
  .title {
    padding-bottom: 15px;
    border-bottom: 1px solid #E9EFFC;
    display: flex;
    font-size: 20px;
    color: rgba(0,0,0,0.8);
    font-weight: 500;
    align-items: center;
    justify-content: space-between;
  }
  .link {
    font-family: PingFangSC-Medium, PingFang SC;
    color: rgba(0,0,0,0.8);
  }
  .top {
    height: 32px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.8);
    position: relative;
    padding-left: 12px;
    &:before{
      content: '';
      top: 7px;
      position: absolute;
      display: block;
      width: 4px;
      height: 18px;
      left: 0;
      background: @primary-color;
    }
  }
  .tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8495AA;
    margin-top: 23px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 20px;
    .money {
      margin-left: 16px;
      line-height: 20px;
      font-size: 18px;
      font-family: D-DIN-PRO-Medium, D-DIN-PRO,PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #F46332;
      .money-symbol {
        font-size: 12px;
      }
    }
  }
  .invoice-img-pane {
    margin: 30px 0 50px 0;
    .affix {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @primary-color;
      cursor: pointer;
    }
  }
  .btn-box {
    background: #ffffff !important;
    border-top: 1px solid #E5E6EB;
    padding-top: 20px;
    margin-top: 20px;
  }
  .btn-box .btn-wrap {
    margin: 0;
  }
}
</style>