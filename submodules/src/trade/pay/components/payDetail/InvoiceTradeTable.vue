<template>
  <div class="sub-table-container">
    <div v-if="title" class="slTitleAssis">
      {{ title }}
    </div>
    <div class="table-box">
      <a-table
        :columns="columns"
        class="new-table"
        :bordered="false"
        rowKey="id"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: true }"
      >
        <template slot="MONEY" slot-scope="text">
          <NumberFormatView :value="text" :isShowMoneyTip="true" />
        </template>
        <template slot="QUANTITY" slot-scope="text">
          <NumberFormatView :value="text" />
        </template>
        <template slot="STATUSDESC" slot-scope="text, record">
          <div :class="`status-tag status-${record.state}`">{{ text || '-' }}</div>
        </template>
        <template slot="actions" slot-scope="text, record">
          <a @click="openDetail(record)">详情</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import NumberFormatView from '../NumberFormatView.vue';

export default {
  name: 'InvoiceTradeTable',
  components: {
    NumberFormatView,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    // 数据源
    dataSource: {
      type: Array,
      default: () => [],
    },
    // 是否是上游
    isUpLine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      columns: columns,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    openDetail(record) {
      if (this.isUpLine) {
        // 上游发票详情页
        this.$emit('openNewTabPage', 'UP_TRADING_INVOICE_DETAIL', record);
      } else {
        // 下游发票详情页
        this.$emit('openNewTabPage', 'DOWN_TRADING_INVOICE_DETAIL', record);
      }
    },
  },
};

// 数据为空时，显示的表头
const customRender = (text) => text || '-';
const columns = [
  {
    title: '发票代码',
    dataIndex: 'code',
    customRender,
  },
  {
    title: '发票号码',
    dataIndex: 'no',
    customRender,
  },
  {
    title: '开票日期',
    dataIndex: 'issuedDate',
    customRender,
  },
  {
    title: '不含税金额(元)',
    dataIndex: 'taxExcludedAmount',
    scopedSlots: {
      customRender: 'MONEY',
    },
  },
  {
    title: '税额(元)',
    dataIndex: 'taxAmount',
    scopedSlots: {
      customRender: 'MONEY',
    },
  },
  {
    title: '价税合计(元)',
    dataIndex: 'totalAmount',
    scopedSlots: {
      customRender: 'MONEY',
    },
  },
  {
    title: '拆分到本合同金额(元)',
    dataIndex: 'currentContractSplitedAmount',
    scopedSlots: {
      customRender: 'MONEY',
    },
  },
  {
    title: '发票状态',
    dataIndex: 'stateDesc',
    scopedSlots: {
      customRender: 'STATUSDESC',
    },
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    scopedSlots: {
      customRender: 'actions',
    },
  },
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
  width: 100%;
  .slTitleAssis {
    margin-top: 4px;
  }
  .status-tag {
    display: inline-block;
    padding: 0 6px;
    height: 20px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 20px;
    background: #c1d7ff;
    color: #4682f3;
    // cursor: pointer;
    &.status-RED_DASHED {
      background: #f2d0d0;
      color: #dd4444;
    }
    &.status-NORMAL {
      background: #c5ecdd;
      color: #3eb384;
    }
    &.status-INVALID {
      background: #e0e0e0;
      color: #a8a8a8;
    }
  }
}
</style>