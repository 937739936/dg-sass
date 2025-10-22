<template>
  <div class="business-line">
    <div class="slTitleAssis">放货指令</div>
    <a-table
      class="new-table"
      :bordered="false"
      :columns="columns"
      :rowKey="(record) => record.serialNo"
      :dataSource="dataSource"
      :pagination="false"
      :scroll="{ y: dataSource.length > 5 ? 210 : false }"
      :customRow="onClickRow"
      :rowSelection="
        action == 'view'
          ? null
          : {
              type: 'radio',
              onChange: onSelected,
              selectedRowKeys: selectedRowKeys,
            }
      "
    >
      <template slot="serialNo" slot-scope="text, record">
        <a @click="goReleaseInstruct(record)">{{ text }}</a>
      </template>
      <template slot="releaseDate" slot-scope="text, record">
        <span>{{
          `${record.releaseBeginDate}至${record.releaseEndDate}`
        }}</span>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const columns = [
  {
    title: "放货指令编号",
    key: "serialNo",
    dataIndex: "serialNo",
    width: 200,
    scopedSlots: { customRender: "serialNo" },
  },
  {
    title: "放货日期",
    key: "releaseDate",
    dataIndex: "releaseBeginDate",
    scopedSlots: { customRender: "releaseDate" },
  },
  {
    title: "放货数量（吨）",
    key: "releaseQuantity",
    dataIndex: "releaseQuantity",
  },
  {
    title: "提货联系人姓名",
    key: "contactName",
    dataIndex: "contactName",
  },
  {
    title: "提货联系人电话号码",
    key: "contactMode",
    dataIndex: "contactMode",
  },
];
export default {
  props: ["type", "action"],
  data() {
    return {
      columns,
      tableLoading: false,
      dataSource: [],
      selectedRowKeys: [],
    };
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
  },
  created() {},
  mounted() {},
  methods: {
    setData(list) {
      this.dataSource = list || [];
      if (this.dataSource.length == 1) {
        this.selectedRowKeys = this.dataSource.map((item) => item.serialNo);
        this.change();
      }
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            this.selectedRowKeys = [record.serialNo];
            this.change();
            // this.$forceUpdate();
          },
        },
      };
    },
    onSelected(key, selectedRows) {
      this.selectedRowKeys = selectedRows.map((item) => item.serialNo);
      this.change();
    },
    change() {
      this.$emit(
        "change",
        this.selectedRowKeys[0],
        this.dataSource.find((item) => item.serialNo == this.selectedRowKeys[0])
      );
    },
    goReleaseInstruct(info) {
      if (!info) {
        return;
      }
      let path = `/center/ladingbill/delivery/detail?id=${info.id}`;
      window.open(path);
    },

    openTab(record) {
      const { upOrderNo, downOrderNo, type, serialNo } = record;
      let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&serialNo=${serialNo}&contractType=0`;
      window.open(
        `/center/monitoring/dynamicMonitoring/detail${query}`,
        "_blank"
      );
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
.business-line {
  .new-table {
    margin-top: 20px !important;
    ::v-deep {
      .ant-table-row {
        cursor: pointer;
      }
    }
  }
}
</style>
