<template>
  <div>
    <div class="method-btn-wrap">
      <div class="invoice-add-button" type="primary" icon="plus" @click="add" v-auth="'kitInvoice:buyInvoice:list:add'"> 进项发票 </div>
      <div class="invoice-export-button" icon="export" @click="exportList" :loading="loadingExport" v-auth="'kitInvoice:buyInvoice:list:export'">导出数据</div>
    </div>
    <div class="search-form">
      <p class="search-form-tag-list">
        <span class="search-form-label">当前搜索:</span>
        <ul class="selected-tag">
          <li
            v-for="(value, key, index) in formResult"
            :key="index"
          >
            <a-tag closable @close="handleTagClose('buyerNameListStr')" v-if="key === 'buyerNameListStr' && formResult['buyerNameListStr'].length">财务主体:{{formResult.buyerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('sellerNameListStr')" v-if="key === 'sellerNameListStr' && formResult['sellerNameListStr'].length">销售方:{{formResult.sellerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('invoiceItemNameListStr')" v-if="key === 'invoiceItemNameListStr' && formResult['invoiceItemNameListStr'].length">商品名称:{{formResult.invoiceItemNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('no')" v-if="key === 'no' && formResult['no'].length">发票号码:{{formResult.no.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('issuedDate')" v-if="key === 'issuedDate' && formResult['issuedDate'].length && formResult['issuedDate'][0]">开票日期:{{formResult.issuedDate[0]}}~{{formResult.issuedDate[1]}}</a-tag>
            <a-tag closable @close="handleTagClose('createDate')" v-if="key === 'createDate' && formResult['createDate'].length && formResult['createDate'][0]">登记日期:{{formResult.createDate[0]}}~{{formResult.createDate[1]}}</a-tag>
            <a-tag closable @close="handleTagClose('invoiceTypeListStr')" v-if="key === 'invoiceTypeListStr' && formResult['invoiceTypeListStr'].length">发票类型:{{formResult.invoiceTypeListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('hasAttachment')" v-if="key === 'hasAttachment' && formResult['hasAttachment'].length">是否有附件:{{formResult.hasAttachment.join(',')}}</a-tag>
          </li>
        </ul>
        <a-button type="link" @click="resetSearch" v-show="showClearAll">清除全部</a-button>
      </p>
      <FormSelectTagItem ref="buyerNameListStr" v-on:change="handleItemChange" label="财务主体" title="buyerNameListStr" :list="buyerList"/>
      <FormMoreAndCheckboxItem ref="sellerNameListStr" v-on:change="handleItemChange" label="销售方" title="sellerNameListStr" :list="sellerList" placeholder="请输入销售方"/>
      <FormMoreAndCheckboxItem ref="invoiceItemNameListStr" v-on:change="handleItemChange" label="商品名称" title="invoiceItemNameListStr" :list="goodsList" placeholder="请输入商品名"/>
      <div class="filter-more-list" v-if="showMoreFilter">
        <FormNoInputItem ref="no" v-on:change="handleItemChange" label="发票号码" title="no" placeholder="请输入号码"/>
        <FormSelectDateItem ref="issuedDate" v-on:change="handleItemChange" label="开票日期" title="issuedDate"/>
        <FormSelectDateItem ref="createDate" v-on:change="handleItemChange" label="登记日期" title="createDate"/>
        <FormSelectTagItem ref="invoiceTypeListStr" v-on:change="handleItemChange" label="发票类型" title="invoiceTypeListStr" :list="typeList"/>
        <FormSelectTagItem ref="hasAttachment" v-on:change="handleItemChange" label="是否有附件" title="hasAttachment" :list="attachList"/>
      </div>
      <div class="filter-more">
        <span @click="filterMore" class="filter-more-text">
          <span :class="[showMoreFilter ? 'more-icon-up' : 'more-icon-down']" class="more-icon"/>{{showMoreFilter ? '收起筛选' : '展开筛选'}}
        </span>
      </div>
    </div>
    <a-table
      class="table-wrap new-table"
      :columns="columnsInTable"
      :row-key="record => record.id"
      :data-source="dataList"
      :pagination="false"
      :loading="loading"
      :scroll="{x: 1200}"
    >
      <span slot="hasAttachment" slot-scope="text, scoped">{{scoped.hasAttachment ? '有附件' : '无附件'}}</span>
      <span slot="action" slot-scope="text, scoped">
        <a-space>
          <a @click="detail(scoped)" v-if="scoped.state == 'NORMAL'" v-auth="'kitInvoice:buyInvoice:list:detail'">查看</a>
          <a @click="edit(scoped)" v-if="scoped.state == 'NORMAL'" v-auth="'kitInvoice:buyInvoice:list:edit'">编辑</a>
          <a @click="deleteItem(scoped)" v-auth="'kitInvoice:buyInvoice:list:delete'">删除</a>
          <a-dropdown 
            v-if="scoped.state == 'NORMAL'" 
            v-auth="['kitInvoice:buyInvoice:list:redDashed','kitInvoice:buyInvoice:list:invalid']"
          >
            <a class="ant-dropdown-link">
              更多<a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-auth="'kitInvoice:buyInvoice:list:redDashed'">
                <a @click="red(scoped)">红冲</a>
              </a-menu-item>
              <a-menu-item v-auth="'kitInvoice:buyInvoice:list:invalid'">
                <a @click="valid(scoped)">作废</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-space>
      </span>
    </a-table>
    <p class="pagination-wrap">
      <span class="total" v-html="statistics">
      </span>
      <i-pagination :pagination="pagination" @change="handleTableChange" />
    </p>
    <EditInvoice ref="editInvoice" v-on:editOk="fetchData" type="1"/>
  </div>
</template>

<script>
import moment from "moment";
import { columnsInTable } from "./table.js";
import iPagination from "@/v2/components/iPaginationSimple.vue";
import EditInvoice from "../../components/EditInvoice.vue";

import FormMoreAndCheckboxItem from "@/v2/center/invoiceTools/components/form/moreAndCheckbox.vue";
import FormNoInputItem from "@/v2/center/invoiceTools/components/form/noInput.vue";
import FormSelectTagItem from "@/v2/center/invoiceTools/components/form/selectTag.vue";
import FormSelectDateItem from "@/v2/center/invoiceTools/components/form/selectDate.vue";

import {
  API_GET_INVOICE_LIST_IN,
  API_GET_INVOICE_EXPORT,
  API_INVOICE_DELETE,
  API_GET_SELLER_LIST,
  API_GET_GOODS_LIST,
  API_GET_BUYYER_LIST,
  API_GET_INVOICE_TYPE_LIST,
  API_INVOICE_RED,
  API_INVOICE_VOID,
} from "@/v2/center/invoiceTools/api";
import tableSearchList from "../../mixins";
import comDownload from "@sub/utils/comDownload.js";

export default {
  mixins: [tableSearchList],
  data() {
    return {
      columnsInTable,
      loading: false,
      formResult: {
        buyerNameListStr: [],
        sellerNameListStr: [],
        invoiceItemNameListStr: [],
        no: [],
        issuedDate: [],
        createDate: [],
        invoiceTypeListStr: [],
        hasAttachment: [],
      },
      dataList: [],
      showMoreFilter: false,
      sellerList: [],
      goodsList: [],
      buyerList: [],
      typeList: [],
      attachList: ["有附件", "无附件"],
      loadingExport: false,
      statistics:''
    };
  },
  components: {
    iPagination,
    EditInvoice,
    FormNoInputItem,
    FormMoreAndCheckboxItem,
    FormSelectTagItem,
    FormSelectDateItem,
  },
  methods: {
    moment,
    red(scoped) {
      API_INVOICE_RED({
        invoiceId: scoped.id
      }).then(res => {
        if(res.success && res.data) {
          this.$message.success("状态修改成功");
          this.fetchData();
        } else {
          this.$message.error("状态修改失败");
        }
      });
    },
    valid(scoped) {
      API_INVOICE_VOID({
        invoiceId: scoped.id
      }).then(res => {
        if(res.success && res.data) {
          this.$message.success("状态修改成功");
          this.fetchData();
        } else {
          this.$message.error("状态修改失败");
        }
      });
    },
    add() {
      this.$router.push({
        path: "/center/admin/invoice/in/add",
        query: {
          type: 1,
        },
      });
    },
    getTypeList() {
      API_GET_INVOICE_TYPE_LIST({
        invoiceType: 1,
      }).then((res) => {
        if (res.success) {
          this.typeList = res.data.map((item) => item.text);
          this.typeListNormal = res.data;
        }
      });
    },
    getBuyerList() {
      API_GET_BUYYER_LIST({
        invoiceType: 1,
      }).then((res) => {
        if (res.success) {
          this.buyerList = res.data;
        }
      });
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
    getSellerList() {
      API_GET_SELLER_LIST({
        invoiceType: 1,
      }).then((res) => {
        if (res.success) {
          this.sellerList = res.data;
        }
      });
    },
    handleItemChange(item) {
      const key = Object.keys(item)[0];
      this.formResult[key] = item[key];
    },
    deleteItem(item) {
      this.$confirm({
        content: "确定要删除吗?",
        onOk: () => {
          return API_INVOICE_DELETE({
            invoiceId: item.id,
          }).then((res) => {
            if (res.success) {
              this.$message.success("删除成功");
              this.fetchData();
            }
          });
        },
      });
    },
    formatePostData() {
      return {
        invoiceType: 1,
        buyerNameListStr: this.formResult.buyerNameListStr.join(","),
        sellerNameListStr: this.formResult.sellerNameListStr.join(","),
        invoiceItemNameListStr:
          this.formResult.invoiceItemNameListStr.join(","),
        no: this.formResult.no.join(","),
        issuedDateBegin: this.formResult.issuedDate[0],
        issuedDateEnd: this.formResult.issuedDate[1],
        createDateBegin: this.formResult.createDate[0],
        createDateEnd: this.formResult.createDate[1],
        invoiceTypeListStr: this.getInvoiceTypeValueByText(
          this.formResult.invoiceTypeListStr.join(",")
        ),
        hasAttachment: this.formResult.hasAttachment.length
          ? this.formResult.hasAttachment.join(",") == "有附件"
            ? true
            : false
          : "",
      };
    },
    exportList() {
      this.loadingExport = true;
      API_GET_INVOICE_EXPORT({
        ...this.formatePostData(),
        ...this.pagination,
      })
        .then((res) => {
          comDownload(res, undefined, "进项发票列表" + ".xls");
        })
        .finally(() => {
          this.loadingExport = false;
        });
    },
    filterMore() {
      this.showMoreFilter = !this.showMoreFilter;
    },
    edit(scoped) {
      this.$refs.editInvoice.showModel(scoped);
    },
    detail(scoped) {
      this.$router.push({
        path: "/center/admin/invoice/in/detail",
        query: {
          id: scoped.id,
        },
      });
    },
    fetchData() {
      this.loading = true;
      API_GET_INVOICE_LIST_IN({
        ...this.formatePostData(),
        ...this.pagination,
      })
        .then((res) => {
          if (res.success) {
            this.dataList = res.result.records;
            this.pagination.pageNo = res.result.current;
            this.pagination.total = res.result.total;
            this.statistics = res.message
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.goodsNameList();
    this.getSellerList();
    this.getBuyerList();
    this.getTypeList();
  },
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
      width: 230px;
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
.sell-tag {
  align-items: center;
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/searchForm.less');
@import url('~@/v2/style/invoiceTools/common.less');
@import url('~@/v2/style/table-cover.less');
</style>
