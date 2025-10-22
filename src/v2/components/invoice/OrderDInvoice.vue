<template>
  <div>
    <h4>发票信息统计</h4>
    <table class="invoice-count" style="width: 100%">
      <tr>
        <th>已开票数量(吨)</th>
        <th>已开票金额(不含税)(元)</th>
        <th>已开票金额(含税)(元)</th>
      </tr>
      <tr v-if="invoiceInfo && invoiceInfo.invoiceStatisticVO">
        <td><p v-text="invoiceInfo.invoiceStatisticVO.invoicedQuantity"></p></td>
        <td><p v-text="invoiceInfo.invoiceStatisticVO.invoicedTaxExcludedAmount"></p></td>
        <td><p v-text="invoiceInfo.invoiceStatisticVO.invoicedTotalAmount"></p></td>
      </tr>
    </table>
    <div class="table-top">
      <p>已关联的发票</p>
      <a-button type="primary" :disabled="hasSelected" @click="exportInvoice(1)">下载发票附件</a-button>
      <a-button type="primary" :disabled="hasSelected" @click="exportInvoice(2)">导出发票四要素</a-button>
    </div>
    <a-table
      id="invoice-table"
      rowKey="id"
      :columns="columns"
      :scroll="{ x: true }"
      :bordered="true"
      :dataSource="invoiceInfo.invoiceList"
      :rowSelection="rowSelection"
    >
      <span slot="customTitle"> 操作<a-icon type="setting" style="margin-left: 5px"></a-icon> </span>
      <span slot="action" slot-scope="text, record">
        <a-space>
          <a href="javascript:;" @click="viewInvoice(record)">查看</a>
          <a target="_blank" :href="BASE_NET + `api/invoice/common/pdf?id=${record.id}`">PDF</a>
        </a-space>
      </span>
    </a-table>
    <a-modal v-model="voiceModal" width="1200px" :footer="null">
      <InvoiceDetail ref="InvoiceDetail" :invoiceData="invoiceData" :hidePageFooter="true"></InvoiceDetail>
      <div class="btn-wrapper">
        <a-button @click="voiceModal = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import ENV from "@/v2/config/env.js";
import { API_EXPORT_INVOICE, API_InvoiceDetailNew } from "@/v2/api/common";
import InvoiceDetail from "./Detail";

/***
 *订单详情下发票
 */
export default {
  name: "OrderDInvoice",
  components: {
    InvoiceDetail,
  },
  computed: {
    hasSelected() {
      return this.selectedKey.length === 0;
    },
    rowSelection() {
      return {
        type: this.single ? "radio" : "checkbox",
        onChange: (selectedRowKeys, selectedRow) => {
          this.selectedRow = selectedRow;
          this.selectedKey = selectedRowKeys;
        },
        selectedRowKeys: this.selectedKey,
      };
    },
  },
  props: {
    invoiceInfo: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => {
        return {
          invoiceList: [],
          invoiceStatisticVO: {},
        };
      },
    },
  },
  data() {
    return {
      selectedRow: [],
      selectedKey: [],
      BASE_NET: ENV.BASE_NET,
      columns: [
        {
          align: "center",
          title: "发票类型",
          width: 100,
          dataIndex: "invoiceType",
          customRender(text) {
            return filterCodeByValueName(text, "invoice_type");
          },
        },
        {
          align: "center",
          title: "发票代码",
          dataIndex: "code",
        },
        {
          align: "center",
          title: "发票号码",
          dataIndex: "no",
        },
        {
          align: "center",
          title: "卖方名称",
          dataIndex: "sellerName",
        },
        {
          align: "center",
          title: "买方名称",
          dataIndex: "buyerName",
        },
        {
          align: "center",
          title: "价税合计（元）",
          dataIndex: "totalAmount",
        },
        {
          align: "center",
          title: "是否包含印花税（元）",
          dataIndex: "stampTaxFlag",
          customRender: (text) => {
            return text == 2 ? "是" : "否";
          },
        },
        {
          align: "center",
          title: "印花税税额（元）",
          dataIndex: "stampTaxFlagAmount",
        },
        {
          align: "center",
          title: "含印花税合计（元）",
          dataIndex: "stampTaxFlagTotalAmount",
        },
        {
          align: "center",
          title: "发票拆分金额(含税)(元)",
          dataIndex: "splitAmount",
        },
        {
          align: "center",
          title: "开票日期",
          dataIndex: "issuedDate",
        },
        {
          align: "center",
          title: "上传时间",
          dataIndex: "createTime",
        },
        {
          align: "center",
          title: "查验结果",
          dataIndex: "scanStatus",
          customRender(text) {
            return text === 0 ? "成功" : "失败";
          },
        },
        {
          align: "center",
          title: "结算类型",
          dataIndex: "settlementType",
          customRender: (text) => {
            return filterCodeByValueName(text, "settleModeDict");
          },
        },
        {
          align: "center",
          fixed: "right",
          icon: "setting",
          // width:200,
          slots: { title: "customTitle" },
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      voiceModal: false,
      invoiceData: {},
    };
  },
  methods: {
    async viewInvoice(record) {
      let res = await API_InvoiceDetailNew({ invoiceId: record.id });
      const result = res;
      this.invoiceData = { ...result.data };
      this.invoiceData["url"] = result.data.attachment;
      this.invoiceData["linkOrders"] = result.data.invoiceContractVOList;
      this.invoiceData["invoiceType"] = result.data.invoiceType;
      this.invoiceData["status"] = result.data.status;
      this.invoiceData["scanStatus"] = result.data.scanStatus;
      this.voiceModal = true;
      this.$nextTick(() => {
        this.$refs.InvoiceDetail.setValues();
      });
    },
    exportInvoice(type) {
      /**
       *    @type 1 下载发票附件 2 下载发票图片 3导出发票四要素
       */
      API_EXPORT_INVOICE(type, { invoiceIds: this.selectedKey.join(",") }).then((res) => {
        this.createFile(res, type === 1 ? "发票附件.zip" : "发票四要素.xls");
      });
    },
    createFile(stream, fileName) {
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(new Blob([stream]), "发票列表" + ".xls");
      } else {
        let url = window.URL.createObjectURL(new Blob([stream]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName || "发票列表.xls");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      }
    },
  },
};
</script>

<style lang="less" scoped>
.invoice-count {
  width: 100%;
  line-height: 30px;
  margin-top: 20px;

  th {
    background: #eee;
    border: 1px solid #808080;
    padding-left: 20px;
  }

  td {
    border: 1px solid #808080;
    padding-left: 20px;
  }
}

::v-deep #invoice-table {
  td,
  th {
    white-space: nowrap !important;
  }
}

.table-top {
  padding: 20px 0;
  display: flex;
  line-height: 32px;

  button {
    margin-left: 16px;
  }
}
.btn-wrapper {
  text-align: center;
}
</style>
