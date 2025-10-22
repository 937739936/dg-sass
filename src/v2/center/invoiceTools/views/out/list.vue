<template>
  <div>
    <div class="method-btn-wrap">
      <div class="invoice-add-button" type="primary" icon="plus" @click="$router.push('/center/admin/invoice/out/add')" v-auth="'kitInvoice:sellInvoice:list:add'"> 销项发票 </div>
      <div class="invoice-export-button" icon="export" @click="exportList" :loading="loadingExport" v-auth="'kitInvoice:sellInvoice:list:export'">导出数据</div>
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
            <a-tag closable @close="handleTagClose('issuedDate')" v-if="key === 'issuedDate' && formResult['issuedDate'].length && formResult['issuedDate'][0]">开票日期:{{formResult.issuedDate[0]}}~{{formResult.issuedDate[1]}}</a-tag>
            <a-tag closable @close="handleTagClose('createDate')" v-if="key === 'createDate' && formResult['createDate'].length && formResult['createDate'][0]">登记日期:{{formResult.createDate[0]}}~{{formResult.createDate[1]}}</a-tag>
            <a-tag closable @close="handleTagClose('no')" v-if="key === 'no' && formResult['no'].length">编号:{{formResult.no.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('businessLineName')" v-if="key === 'businessLineName' && formResult['businessLineName'].length">业务线号:{{formResult.businessLineName.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('upCompanyNameListStr')" v-if="key === 'upCompanyNameListStr' && formResult['upCompanyNameListStr'].length">上游供应商:{{formResult.upCompanyNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('downNameListStr')" v-if="key === 'downNameListStr' && formResult['downNameListStr'].length">下游客户:{{formResult.downNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('commissionItemNameListStr')" v-if="key === 'commissionItemNameListStr' && formResult['commissionItemNameListStr'].length">商品名称:{{formResult.commissionItemNameListStr.join(',')}}</a-tag>
          </li>
        </ul>
        <a-button type="link" @click="resetSearch" v-show="showClearAll">清除全部</a-button>
      </p>
      <FormSelectTagItem ref="buyerNameListStr" v-on:change="handleItemChange" label="财务主体" title="buyerNameListStr" :list="buyerList" />
      <FormSelectDateItem ref="issuedDate" v-on:change="handleItemChange" label="开票日期" title="issuedDate"/>
      <FormSelectDateItem ref="createDate" v-on:change="handleItemChange" label="登记日期" title="createDate"/>
      <div class="filter-more-list" v-if="showMoreFilter">
        <FormNoInputItem ref="no" v-on:change="handleItemChange" label="编号" title="no" placeholder="请输入编号"/>
        <FormNoInputItem ref="businessLineName" v-on:change="handleItemChange" label="业务线" title="businessLineName" placeholder="请输入业务线"/>
        <FormMoreAndCheckboxItem class="out-list-input" ref="upCompanyNameListStr" v-on:change="handleItemChange" label="上游供应商" title="upCompanyNameListStr" :list="upList" :checkbox="false" placeholder="请输入供应商"/>
        <FormMoreAndCheckboxItem class="out-list-input" ref="downNameListStr" v-on:change="handleItemChange" label="下游客户" title="downNameListStr" :list="downList" :checkbox="false" placeholder="请输入客户名称"/>
        <FormMoreAndCheckboxItem class="out-list-input" ref="commissionItemNameListStr" v-on:change="handleItemChange" label="商品名称" title="commissionItemNameListStr" :list="goodsList" placeholder="请输入商品名称"/>
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
      <div slot="businessLineNameList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.businessLineNameList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.businessLineNameList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="upContractNoList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.upContractNoList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.upContractNoList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="upCompanyNameList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.upCompanyNameList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.upCompanyNameList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="downContractNoList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.downContractNoList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.downContractNoList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="downCompanyNameList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.downCompanyNameList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.downCompanyNameList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="splitQuantityList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.splitQuantityList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.splitQuantityList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="splitAmountList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.splitAmountList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.splitAmountList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="action" slot-scope="text, scoped">
        <a-space>
          <a @click="download(scoped)" v-auth="'kitInvoice:sellInvoice:list:download'">下载附件</a>
          <a @click="detail(scoped)" v-auth="'kitInvoice:sellInvoice:list:detail'">详情</a>
          <a @click="deleteItem(scoped)" v-auth="'kitInvoice:sellInvoice:list:delete'">删除</a>
        </a-space>
      </div>
    </a-table>
    <p class="pagination-wrap">
      <span class="total" v-html="statistics">
      </span>
      <i-pagination :pagination="pagination" @change="handleTableChange" />
    </p>
    <OutDetails ref="outDetails" v-on:update="fetchData"/>
  </div>
</template>

<script>
import { columnsInTable } from "./table.js";
import iPagination from "@/v2/components/iPaginationSimple.vue";
import OutDetails from "../../components/outDetails.vue";

import FormNoInputItem from "@/v2/center/invoiceTools/components/form/noInput.vue";
import FormMoreAndCheckboxItem from "@/v2/center/invoiceTools/components/form/moreAndCheckbox.vue";
import FormSelectTagItem from "@/v2/center/invoiceTools/components/form/selectTag.vue";
import FormSelectDateItem from "@/v2/center/invoiceTools/components/form/selectDate.vue";

import {
  API_GET_OUT_LIST,
  API_GET_OUT_DELETE,
  API_GET_OUT_EXPORT,
  API_GET_GOODS_LIST_OUT,
  API_GET_DOWN_NAME_OUT,
  API_GET_UP_NAME_OUT,
  API_GET_FINACE_NAME_LIST
} from "@/v2/center/invoiceTools/api";
import ENV from "@/v2/config/env";
import comDownload from "@sub/utils/comDownload.js";
import tableSearchList from "../../mixins";

export default {
  mixins: [tableSearchList],
  data() {
    return {
      columnsInTable,
      loading: false,
      formResult: {
        mainPartNameListStr: [],
        buyerNameListStr: [],
        no: [],
        businessLineName: [],
        upCompanyNameListStr: [],
        downNameListStr: [],
        sellerNameListStr: [],
        commissionItemNameListStr: [],
        issuedDate: [],
        createDate: [],
      },
      dataList: [],
      showMoreFilter: false,
      goodsList: [],
      downList: [],
      upList: [],
      buyerList: [],
      loadingExport: false,
      statistics: ''
    };
  },
  components: {
    iPagination,
    OutDetails,
    FormNoInputItem,
    FormMoreAndCheckboxItem,
    FormSelectTagItem,
    FormSelectDateItem
  },
  methods: {
    getBuyerList() {
      API_GET_FINACE_NAME_LIST().then(res => {
        if(res.success) {
          this.buyerList = res.data;
        }
      })
    },
    getUpNameList() {
      API_GET_UP_NAME_OUT().then(res => {
        if(res.success) {
          this.upList = res.data;
        }
      })
    },
    getDownUserList() {
      API_GET_DOWN_NAME_OUT().then(res => {
        if(res.success) {
          this.downList = res.data;
        }
      })
    },
    getGoodsNameList() {
      API_GET_GOODS_LIST_OUT().then(res => {
        if(res.success) {
          this.goodsList = res.data;
        }
      })
    },
    exportList() {
      this.loadingExport = true;
      API_GET_OUT_EXPORT({
        ...this.formatePostData(),
        ...this.pagination
      }).then((res) => {
        comDownload(res, undefined, "销项发票" + ".xls");
      }).finally(() => {
        this.loadingExport = false;
      });
    },
    deleteItem(item) {
      this.$confirm({
        content: '确定要删除吗?',
        onOk: () => {
          return API_GET_OUT_DELETE({
            id: item.id
          }).then(res => {
            if(res.success) {
              this.$message.success('删除成功');
              this.fetchData();
            }
          })
        }
      })
    },
    handleItemChange(item) {
      const key = Object.keys(item)[0];
      this.formResult[key] = item[key];
    },
    filterMore() {
      this.showMoreFilter = !this.showMoreFilter;
    },
    download(scoped) {
      window.open(`${ENV.BASE_NET}${scoped.attachment}`, '_blank');
    },
    detail(scoped) {
      this.$refs.outDetails.showModal(scoped);
    },
    formatePostData() {
      return {
        mainPartNameListStr: this.formResult.mainPartNameListStr.join(','),
        mainPartName: this.formResult.buyerNameListStr.join(','),
        issuedDateBegin: this.formResult.issuedDate[0],
        issuedDateEnd: this.formResult.issuedDate[1],
        createDateBegin: this.formResult.createDate[0],
        createDateEnd: this.formResult.createDate[1],
        no: this.formResult.no.join(','),
        businessLineName: this.formResult.businessLineName.join(','),
        upCompanyNameListStr: this.formResult.upCompanyNameListStr.join(','),
        commissionItemNameListStr: this.formResult.commissionItemNameListStr.join(','),
        buyerNameListStr: this.formResult.downNameListStr.join(','),
      }
    },
    fetchData() {
      this.loading = true;
      API_GET_OUT_LIST({
        ...this.formatePostData(),
        ...this.pagination,
      }).then(res => {
        if(res.success) {
          this.dataList = res.result.records;
          this.pagination.pageNo = res.result.current;
          this.pagination.total = res.result.total;
          this.statistics = res.message
        }
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.getGoodsNameList();
    this.getUpNameList();
    this.getDownUserList();
    this.getBuyerList();
  }
};
</script>

<style lang="less" scoped>
.method-btn-wrap {
  width: 100%;
  height: 32px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
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
    /deep/ .search-form-label {
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
    margin-top: 10px;
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
.table-merge-line {
  width: calc(100% + 32px);
  background: #E9EFFC;
  margin: 0;
}
.table-row-merge-line {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  span {
    width: 100%;
    height: 60px;
    display: inline-block;
    overflow: hidden;
    word-break: break-all;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/searchForm.less');
@import url('~@/v2/style/invoiceTools/common.less');
@import url('~@/v2/style/table-cover.less');
</style>
