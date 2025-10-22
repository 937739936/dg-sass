<template>
  <div>
    <div class="method-btn-wrap">
      <div class="invoice-export-button" icon="export" @click="exportList" :loading="loadingExport" v-auth="'kitInvoice:buyInvoice:accountBook:export'">导出数据</div>
    </div>
    <div class="search-form search-form-no-margin-left">
      <p class="search-form-tag-list">
        <span class="search-form-label">当前搜索:</span>
        <ul class="selected-tag">
          <li
            v-for="(value, key, index) in formResult"
            :key="index"
          >
            <a-tag closable @close="handleTagClose('buyerNameListStr')" v-if="key === 'buyerNameListStr' && formResult['buyerNameListStr'].length">财务主体:{{formResult.buyerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('sellerNameListStr')" v-if="key === 'sellerNameListStr' && formResult['sellerNameListStr'].length">开票单位:{{formResult.sellerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('recorded')" v-if="key === 'recorded' && formResult['recorded'].length">是否已入账:{{formResult.recorded.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('createDate')" v-if="key === 'createDate' && formResult['createDate'].length && formResult['createDate'][0]">登记日期:{{formResult.createDate[0]}}~{{formResult.createDate[1]}}</a-tag>
            <a-tag closable @close="handleTagClose('invoiceItemNameListStr')" v-if="key === 'invoiceItemNameListStr' && formResult['invoiceItemNameListStr'].length">商品名称:{{formResult.invoiceItemNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('invoiceTypeListStr')" v-if="key === 'invoiceTypeListStr' && formResult['invoiceTypeListStr'].length">发票类型:{{formResult.invoiceTypeListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('recordDateListStr')" v-if="key === 'recordDateListStr' && formResult['recordDateListStr'].length">入账月份:{{formResult.recordDateListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('issuedDate')" v-if="key === 'issuedDate' && formResult['issuedDate'].length && formResult['issuedDate'][0]">开票日期:{{formResult.issuedDate[0]}}~{{formResult.issuedDate[1]}}</a-tag>
          </li>
        </ul>
        <a-button type="link" @click="resetSearch" v-show="showClearAll">清除全部</a-button>
      </p>
      <FormSelectTagItem ref="buyerNameListStr" v-on:change="handleItemChange" label="财务主体" title="buyerNameListStr" :list="buyerList"/>
      <FormMoreAndCheckboxItem ref="sellerNameListStr" v-on:change="handleItemChange" label="开票单位" title="sellerNameListStr" :list="sellerList" placeholder="请输入开票单位"/>
      <FormSelectTagItem ref="recorded" v-on:change="handleItemChange" label="是否已入账" title="recorded" :list="recordList"/>
      <div class="filter-more-list" v-if="showMoreFilter">
        <FormSelectDateItem ref="createDate" v-on:change="handleItemChange" label="登记日期" title="createDate"/>
        <FormNoInputItem ref="invoiceItemNameListStr" v-on:change="handleItemChange" label="商品名称" title="invoiceItemNameListStr" :list="goodsList" placeholder="请输入商品名"/>
        <FormSelectTagItem ref="invoiceTypeListStr" v-on:change="handleItemChange" label="发票类型" title="invoiceTypeListStr" :list="typeList"/>
        <FormSelectMonthItem class="in-entry-month" ref="recordDateListStr" v-on:change="handleItemChange" label="入账月份" title="recordDateListStr" :list="monthList"/>
        <FormSelectDateItem ref="issuedDate" v-on:change="handleItemChange" label="开票日期" title="issuedDate"/>
      </div>
      <div class="filter-more">
        <span @click="filterMore" class="filter-more-text">
          <span :class="[showMoreFilter ? 'more-icon-up' : 'more-icon-down']" class="more-icon"/>{{showMoreFilter ? '收起筛选' : '展开筛选'}}
        </span>
      </div>
    </div>
    <p>
      <a-button type="primary" :disabled="selectedRowKeys.length == 0" @click="entryList" v-auth="'kitInvoice:buyInvoice:accountBook:batchAdd'">批量入账</a-button>
    </p>
    <a-table
      class="table-wrap new-table"
      :columns="columnsEntryTable"
      rowKey="key"
      :data-source="dataList"
      :pagination="false"
      :loading="loading"
      :scroll="{x: 1200}"
      :row-selection="rowSelection"
    >
      <span slot="action" slot-scope="text, scoped">
        <a-space>
          <a @click="detail(scoped)" v-if="scoped.id" v-auth="'kitInvoice:buyInvoice:accountBook:detail'">查看</a>
          <a @click="entry(scoped, 'edit')" v-if="scoped.id" v-auth="'kitInvoice:buyInvoice:accountBook:edit'">编辑</a>
          <a @click="entry(scoped, 'add')" v-if="!scoped.id" v-auth="'kitInvoice:buyInvoice:accountBook:add'">入账</a>
          <a @click="cancelEntry(scoped)" v-if="scoped.id" v-auth="'kitInvoice:buyInvoice:accountBook:delete'">取消入账</a>
        </a-space>
      </span>
    </a-table>
    <p class="pagination-wrap">
      <span class="total" v-html="statistics">
      </span>
      <i-pagination :pagination="pagination" @change="handleTableChange" />
    </p>
    <InvoiceEntry ref="invoiceEntry" :invoiceType="1" v-on:entry="entrySuccess"/>
  </div>
</template>

<script>
import moment from "moment";
import { columnsEntryTable } from "./table.js";
import iPagination from "@/v2/components/iPaginationSimple.vue";
import InvoiceEntry from "../../components/InvoiceEntry.vue";
import comDownload from "@sub/utils/comDownload.js";
import {
  API_GET_INVOICE_ENTRY_EXPORT,
  API_GET_INVOICE_ENTRY_LIST,
  API_GET_INVOICE_ENTRY_CANCEL,
  API_GET_SELLER_LIST,
  API_INVOICE_ENTRY_DATE,
  API_GET_BUYYER_LIST,
  API_GET_INVOICE_TYPE_LIST,
  API_GET_GOODS_LIST
} from "@/v2/center/invoiceTools/api";
import tableSearchList from "../../mixins";

import FormMoreAndCheckboxItem from "@/v2/center/invoiceTools/components/form/moreAndCheckbox.vue";
import FormSelectTagItem from "@/v2/center/invoiceTools/components/form/selectTag.vue";
import FormSelectDateItem from "@/v2/center/invoiceTools/components/form/selectDate.vue";
import FormSelectMonthItem from "@/v2/center/invoiceTools/components/form/selectMonth.vue";
import FormNoInputItem from "@/v2/center/invoiceTools/components/form/noInput.vue";

export default {
  mixins: [tableSearchList],
  data() {
    return {
      columnsEntryTable,
      loading: false,
      formResult: {
        buyerNameListStr: [],
        sellerNameListStr: [],
        invoiceItemNameListStr:[],
        issuedDate: [],
        createDate: [],
        invoiceTypeListStr: [],
        recorded: [],
        recordDateListStr: []
      },
      dataList: [],
      showMoreFilter: false,
      selectedRowKeys: [],
      sellerList: [],
      monthList: [],
      buyerList: [],
      goodsList: [],
      recordList: ['已入账', '未入账'],
      typeList: [],
      loadingExport: false,
      statistics: '',
      totalList: []
    };
  },
  components: {
    iPagination,
    InvoiceEntry,
    FormMoreAndCheckboxItem,
    FormSelectTagItem,
    FormSelectDateItem,
    FormSelectMonthItem,
    FormNoInputItem
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        type: "checkbox",
        selections: [],
        onSelection: this.onSelection,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.id ? true : false
          }
        }),
      };
    },
  },
  methods: {
    entrySuccess() {
      this.totalList = [] // 入账成功后清空
      this.fetchData();
      this.selectedRowKeys = [];
    },
    getTypeList() {
      API_GET_INVOICE_TYPE_LIST({
        invoiceType: 1
      }).then(res => {
        if(res.success) {
          this.typeList = res.data.map(item => item.text);
          this.typeListNormal = res.data;
        }
      })
    },
    getBuyerList() {
      API_GET_BUYYER_LIST({
        invoiceType: 1
      }).then(res => {
        if(res.success) {
          this.buyerList = res.data;
        }
      })
    },
    getDateMonthList() {
      API_INVOICE_ENTRY_DATE({
        invoiceType: 1
      }).then(res => {
        if(res.success) {
          this.monthList = (res.data || []).map(item => moment(item).format("YYYY-MM"));
        }
      })
    },
    getSellerList() {
      API_GET_SELLER_LIST({
        invoiceType: 1
      }).then(res => {
        if(res.success) {
          this.sellerList = res.data;
        }
      })
    },
    goodsNameList() {
      API_GET_GOODS_LIST({
        invoiceType: 1,
      }).then((res) => {
        if (res.success) {
          this.goodsList = res.data;
        }
      });
    },
    handleItemChange(item) {
      const key = Object.keys(item)[0];
      this.formResult[key] = item[key];
    },
    cancelEntry(item) {
      this.$confirm({
        content: '确定要取消入账吗?',
        onOk: () => {
          return API_GET_INVOICE_ENTRY_CANCEL({
            id: item.id
          }).then(res => {
            if(res.success) {
              this.$message.success('取消成功');
              this.fetchData();
            }
          })
        }
      })
    },
    formatePostData() {
      return {
        invoiceType: 1,
        buyerNameListStr: this.formResult.buyerNameListStr.join(","),
        sellerNameListStr: this.formResult.sellerNameListStr.join(","),
        invoiceItemNameListStr:
            this.formResult.invoiceItemNameListStr.join(","),
        recorded: this.formResult.recorded.length ? (this.formResult.recorded.join(",") == "已入账" ? true : false) : null,
        invoiceCreateDateBegin: this.formResult.createDate[0],
        invoiceCreateDateEnd: this.formResult.createDate[1],
        invoiceTypeListStr: this.getInvoiceTypeValueByText(this.formResult.invoiceTypeListStr.join(",")),
        recordDateListStr: this.formResult.recordDateListStr.length ? `${this.formResult.recordDateListStr[0].replace(/年|月/g,'-')}01` : '',
        issuedDateBegin: this.formResult.issuedDate[0],
        issuedDateEnd: this.formResult.issuedDate[1],
      };
    },
    exportList() {
      this.loadingExport = true;
      API_GET_INVOICE_ENTRY_EXPORT({
        ...this.formatePostData(),
      }).then((res) => {
        comDownload(res, undefined, "进项发票入账" + ".xls");
      }).finally(() => {
        this.loadingExport = false;
      })
    },
    entryList() {
      const list = [];
      this.totalList.forEach(item => {
        if(this.selectedRowKeys.includes(item.key)) {
          list.push(item);
        }
      });
      this.$refs.invoiceEntry.showModal(list, "add");
    },
    entry(scoped, type="add") {
      this.$refs.invoiceEntry.showModal(scoped, type, 1);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    filterMore() {
      this.showMoreFilter = !this.showMoreFilter;
    },
    detail(scoped) {
      this.$router.push({
        path: "/center/admin/invoice/in/entry/detail",
        query: {
          id: scoped.id
        }
      });
    },
    fetchData() {
      this.loading = true;
      API_GET_INVOICE_ENTRY_LIST({
        ...this.formatePostData(),
        ...this.pagination
      }).then(res => {
        if(res.success) {
          this.dataList = res.result.records;
          this.pagination.pageNo = res.result.current;
          this.pagination.total = res.result.total;
          this.statistics = res.message
          this.dataList.forEach((item, index) => {
            item.key = `${res.result.current}${index}`;
            if(item.recordDate) {
              item.recordDate = moment(item.recordDate).format("YYYY-MM");
            }
          });

          // 计算加载过的总数据去重，跨分页选中时批量入账时使用
          let obj = {}
          this.totalList = this.totalList.concat(this.dataList).reduce(function (item,next){
            obj[next.key] ? '' : obj[next.key] = true && item.push(next);
            return item;
          },[])

        }
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.goodsNameList();
    this.getDateMonthList();
    this.getSellerList();
    this.getTypeList();
    this.getBuyerList();
  }
};
</script>

<style lang="less" scoped>
.search-form {
  font-size: 14px;
  p {
    width: 100%;
    min-height: 22px;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    .search-form-label {
      width: 75px;
      display: inline-block;
      margin-right: 10px;
      font-weight: 400;
      color: #8b9db8;
    }
    .search-input {
      width: 200px;
    }
    .more-methods {
      position: absolute;
      right: 0;
      margin-right: 0;
    }
  }
  .selected-tag,
  .finance-tag,
  .sell-tag,
  .invoicing-time-tag,
  .register-time-tag,
  .invoice-type-tag,
  .file-type-tag {
    display: flex;
  }
  .more-btn {
    margin-left: 40px;
  }
  .divider-line {
    margin: 5px 0;
  }
  ul {
    width: auto;
    max-width: 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .finance-tag,
  .sell-tag,
  .invoicing-time-tag,
  .register-time-tag,
  .invoice-type-tag,
  .file-type-tag {
    margin-left: -7px;
  }
  .selected-tag {
    /deep/ .ant-tag {
      border: none;
      color: rgba(0, 0, 0, 0.8);
    }
  }
  .sell-tag-cancel {
    // margin-top: 10px;
  }
  /deep/ .ant-tag:hover {
    color: #8191a9;
  }
  .ant-tag-checkable-checked {
    background: #f5f8fd;
    color: #8191a9;
  }
  /deep/ .ant-input {
    border: 1px solid #c5ccdc;
  }
  /deep/ .ant-btn {
    font-size: 12px;
  }
  /deep/ .ant-checkbox-wrapper {
    font-size: 12px;
  }
  /deep/ .ant-checkbox-inner {
    width: 14px;
    height: 14px;
  }
}
.table-wrap {
  margin-top: 20px;
}
/deep/ .ant-table-thead {
  tr:nth-child(1) {
    .ant-table-selection-column-custom {
      padding-left: 6px;
    }
  }
}
.sell-tag {
  align-items: center;
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/searchForm.less');
@import url('~@/v2/style/invoiceTools/common.less');
@import url('~@/v2/style/table-cover.less');
</style>
