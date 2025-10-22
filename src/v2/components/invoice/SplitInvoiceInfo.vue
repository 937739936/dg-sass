<!--发票分拆信息-->
<template>
  <div class="split-amount-invoice-info">
    <a-table bordered :rowKey="(record, index) => index" :columns="columns" :dataSource="tableData" :pagination="false">
      <template slot="splitAmount" slot-scope="text, record, index">
        <a-input v-model="record.splitAmount" @blur="handleAmountBlur(record, index)" />
      </template>
    </a-table>
  </div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

export default {
  name: "SplitAmountInvoiceInfo",
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      },
    },
    amountTax: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "invoice",
    },
  },
  data() {
    return {
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          },
        },
        {
          title: "发票号码",
          align: "center",
          dataIndex: "no",
          key: "no",
        },
        {
          title: "发票类型",
          align: "center",
          dataIndex: "invoiceType",
          key: "invoiceType",
          customRender(text) {
            return filterCodeByValueName(text + "", "invoice_type");
          },
        },
        {
          title: "订单编号",
          align: "center",
          dataIndex: "orderSerialNo",
          key: "orderSerialNo",
        },
        {
          title: "订单数量(吨)",
          align: "center",
          dataIndex: "orderAmount",
          key: "orderAmount",
        },
        {
          title: "卖方名称",
          align: "center",
          dataIndex: "sellerName",
          key: "sellerName",
        },
        {
          title: "买方名称",
          align: "center",
          dataIndex: "buyerName",
          key: "buyerName",
        },
        {
          title: "价税合计(元)",
          align: "center",
          dataIndex: "totalAmount",
          key: "totalAmount",
        },
        {
          title: "发票拆分金额(含税)(元)",
          align: "center",
          dataIndex: "splitAmount",
          key: "splitAmount",
          scopedSlots: { customRender: "splitAmount" },
        },
      ],
      tableData: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.tableData = JSON.parse(JSON.stringify(this.dataSource));
    },
    handleAmountBlur(record) {
      let reg = /^([1-9]\d*(\.\d{1,2})?)$|^(0\.\d{1,2})?$/;
      if (!reg.test(record.splitAmount)) {
        this.$message.error("请输入大于0的数字，最多支持两位小数");
        this.$set(record, "splitAmount", 0);
        return false;
      }
    },
    /**
     *  校验发票拆分金额 校验发票拆分金额
     *  1、所有的拆分金额都要大于0
     *  2、同一张发票在各个订单的拆分金额总和需小于等于发票价税合计金额
     * @returns {boolean|[]}
     */
    checkSplitAmount() {
      // if (this.type == 'invoice'){
      // 单个发票添加时，判断所有订单拆分金额之和不大于发票金额
      let isSplitInfoComplete = this.tableData.some((item) => {
        return !item.splitAmount;
      });
      if (isSplitInfoComplete) {
        this.$message.error("发票拆分金额请输入大于0的数字");
        return false;
      }
      return this.tableData;
    },
  },
  watch: {
    dataSource: {
      handler() {
        this.initData();
      },
      deep: true,
    },
    amountTax() {
      this.initData();
    },
  },
};
</script>
<style lang="less" scoped>
.split-amount-invoice-info {
  margin: 20px 0px;
  ::v-deep.ant-table-bordered.ant-table-empty .ant-table-placeholder {
    border: 1px solid #e8e8e8;
  }
  ::v-deep.ant-table-thead > tr > th,
  ::v-deep.ant-table-tbody > tr > td {
    padding: 10px;
  }
  ::v-deep.ant-table-tbody > tr > td {
    word-break: break-all;
  }
  ::v-deep.ant-table-thead > tr > th {
    white-space: nowrap;
  }
}
</style>
