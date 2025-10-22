<template>
  <div style="width:100%" class="invoiceBox" v-if="info.invoiceInfo && JSON.stringify(info.invoiceInfo) !== '{}'">
    <template v-if="info.invoiceInfo.invoiceStatistics">
      <span>发票数量：{{info.invoiceInfo.invoiceStatistics.invoiceCount}}</span>
      <span>归属本合同发票总额：{{info.invoiceInfo.invoiceStatistics.invoiceTotalAmount}}元</span>
    </template>
    <a-tabs default-active-key="trade">
      <a-tab-pane key="trade" tab="贸易发票">
        <div class="record-list">
          <a-table 
            :pagination="false" 
             class="new-table"
            :columns="tradeInvoiceColumns" 
            :data-source="info.invoiceInfo.tradeInvoiceList || []"
             :scroll="{x:true}" 
             rowKey="id">
            <template slot="action" slot-scope="record">
                <div v-if="systemType == 'rest'">
                    <a :href="'/center/steels/invoice/'+(record.invoiceForm === 'BUYER_INVOICE'?'buy':'sell')+'detail?id=' + record.id + '&type=detail&title=贸易发票'" class="edit-btn">查看</a>
                </div>
                <div v-else>
                    <a href="javascript:;" @click='viewInvoiceDetail(record, 1)' class="edit-btn">查看</a>
                </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="freight" tab="运费发票" force-render>
          <div class="record-list">
          <a-table 
            :pagination="false" 
            class="new-table"
            :columns="freightInvoiceColumns"
            :data-source="info.invoiceInfo.freightInvoiceList|| []" 
            :scroll="{x:true}" 
            rowKey="id"
          >
            <template slot="action" slot-scope="record">
                <div  v-if="systemType == 'rest'">
                     <a :href="'/center/steels/invoice/freightdetail?id=' + record.id + '&type=detail&title=运费发票'" class="edit-btn">查看</a>
                </div>
                <div v-else>
                    <a href="javascript:;" @click='viewInvoiceDetail(record, 0)' class="edit-btn">查看</a>
                </div>
               
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
function fillDecimal(v, length = 2) {
  const decimal = ".00";
  if ((v + "").indexOf(".") === -1) {
    return v + decimal;
  } else {
    if ((v + "").substring((v + "").indexOf(".")).length == 2) {
      return v + "0";
    } else {
      return v;
    }
  }
}
export default {
  props: {
    info: {
      default: () => {}
    },
    systemType:{
        default: 'rest'
    }
  },
  data() {
    return {
      tradeInvoiceColumns: [
          {
              title: "发票类型",
              dataIndex: "invoiceTypeDesc",
              key: "invoiceTypeDesc",
          },
          {
              title: "发票代码",
              dataIndex: "code",
              key: "code",
          },
          {
              title: "发票号码",
              dataIndex: "no",
              key: "no",
          },
          {
              title: "卖方名称",
              dataIndex: "sellerName",
              key: "sellerName",
          },
          {
              title: "买方名称",
              dataIndex: "buyerName",
              key: "buyerName",
          },
          {
              title: "开票日期",
              dataIndex: "issuedDate",
              key: "issuedDate",
          },
          {
              title: "不含税金额（元）",
              dataIndex: "taxExcludedAmount",
              key: "taxExcludedAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "税额（元）",
              dataIndex: "taxAmount",
              key: "taxAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "价税合计(元)",
              dataIndex: "totalAmount",
              key: "totalAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "拆分到本合同金额（元）",
              dataIndex: "splitAmount",
              key: "splitAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "发票状态",
              dataIndex: "statusDesc",
              key: "statusDesc",
          },
          {
              key: "action",
              fixed: "right",
              slots: { title: "customTitle" },
              scopedSlots: { customRender: "action" }
          }
      ],
      freightInvoiceColumns: [
          {
              title: "发票类型",
              dataIndex: "invoiceTypeDesc",
              key: "invoiceTypeDesc",
          },
          {
              title: "发票代码",
              dataIndex: "code",
              key: "code",
          },
          {
              title: "发票号码",
              dataIndex: "no",
              key: "no",
          },
          {
              title: "卖方名称",
              dataIndex: "sellerName",
              key: "sellerName",
          },
          {
              title: "买方名称",
              dataIndex: "buyerName",
              key: "buyerName",
          },
          {
              title: "开票日期",
              dataIndex: "issuedDate",
              key: "issuedDate",
          },
          {
              title: "不含税金额（元）",
              dataIndex: "taxExcludedAmount",
              key: "taxExcludedAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "税额（元）",
              dataIndex: "taxAmount",
              key: "taxAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "价税合计(元)",
              dataIndex: "totalAmount",
              key: "totalAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "是否包含印花税",
              dataIndex: "stampTaxFlagDesc",
              key: "stampTaxFlagDesc",
          },
          {
              title: "印花税税额（元）",
              dataIndex: "stampTaxFlagAmount",
              key: "stampTaxFlagAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "含印花税合计（元）",
              dataIndex: "stampTaxFlagTotalAmount",
              key: "stampTaxFlagTotalAmount",
              customRender: (text) => {
              return text && fillDecimal((+text).toLocaleString())
              }
          },
          {
              title: "发票状态",
              dataIndex: "statusDesc",
              key: "statusDesc",
          },
          {
              key: "action",
              fixed: "right",
              slots: { title: "customTitle" },
              scopedSlots: { customRender: "action" }
          }
      ],
    }
  },
  methods: {
    viewInvoiceDetail(item, type) {
        this.$emit('viewInvoiceDetail', item, type)
    }
  },
  components: {

  }
}
</script>

<style lang="less" scoped>

</style>
