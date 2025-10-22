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
        rowKey="attachmentId"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: true }"
      >
        <template slot="MONEY" slot-scope="text">
          <NumberFormatView :value="text" :isShowMoneyTip="true" />
        </template>
        <template slot="LINK" slot-scope="text, record">
          <a @click="previewFile(record)">{{ text }}</a>
        </template>
      </a-table>
    </div>
    <ImageViewer ref="imageViewer" />
  </div>
</template>

<script>
import NumberFormatView from '../NumberFormatView';
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
  name: 'TaxInfoTable',
  components: {
    NumberFormatView,
    ImageViewer,
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
    // 预览附件
    previewFile(record) {
      this.$refs.imageViewer.showFile(record);
    },
  },
};

// 数据为空时，显示的表头
const customRender = (text) => text || '-';
const columns = [
  {
    title: '类型',
    dataIndex: 'fileType',
    customRender,
  },
  {
    title: '税种',
    dataIndex: 'taxCategoryDesc',
    customRender,
  },
  {
    title: '税款所属期间',
    dataIndex: 'taxPeriodStart',
    customRender: (text, record) => {
      if (record.taxPeriodStart && record.taxPeriodEnd) {
        return `${record.taxPeriodStart}—${record.taxPeriodEnd}`;
      }
      return '-';
    },
  },
  {
    title: '实缴(退)金额(元)',
    dataIndex: 'amount',
    scopedSlots: {
      customRender: 'MONEY',
    },
  },
  {
    title: '附件',
    dataIndex: 'fileName',
    scopedSlots: {
      customRender: 'LINK',
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
  margin-bottom: 50px;
  .slTitleAssis {
    margin-top: 4px;
  }
  /deep/ .ant-table {
    td,
    th {
      white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
    }
  }
}
</style>