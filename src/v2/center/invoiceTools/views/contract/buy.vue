<template>
  <div>
    <div class="method-btn-wrap">
      <div class="invoice-export-button" icon="export" @click="exportList" :loading="loadingExport" v-auth="'kitInvoice:contract:buy:export'">导出数据</div>
    </div>
    <div class="search-form search-form-label-100px">
      <p class="search-form-tag-list">
        <span class="search-form-label">当前搜索:</span>
        <ul class="selected-tag">
          <li
            v-for="(value, key, index) in formResult"
            :key="index"
          >
            <a-tag closable @close="handleTagClose('contractNo')" v-if="key === 'contractNo' && formResult['contractNo'].length">合同编号:{{formResult.contractNo.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('buyerNameListStr')" v-if="key === 'buyerNameListStr' && formResult['buyerNameListStr'].length">合同卖方:{{formResult.buyerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('sellerNameListStr')" v-if="key === 'sellerNameListStr' && formResult['sellerNameListStr'].length">合同买方:{{formResult.sellerNameListStr.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('quantityRel')" v-if="key === 'quantityRel' && formResult['quantityRel'].length">进销项数量差:{{formResult.quantityRel.join(',')}}</a-tag>
            <a-tag closable @close="handleTagClose('amountRel')" v-if="key === 'amountRel' && formResult['amountRel'].length">进销项金额差:{{formResult.amountRel.join(',')}}</a-tag>
          </li>
        </ul>
        <a-button type="link" @click="resetSearch" v-show="showClearAll">清除全部</a-button>
      </p>
      <FormNoInputItem ref="contractNo" v-on:change="handleItemChange" label="合同编号" title="contractNo" placeholder="请输入合同编号"/>
      <FormMoreAndCheckboxItem ref="sellerNameListStr" v-on:change="handleItemChange" label="合同卖方" title="sellerNameListStr" :list="sellerList" placeholder="请输入合同卖方"/>
      <FormMoreAndCheckboxItem ref="buyerNameListStr" v-on:change="handleItemChange" label="合同买方" title="buyerNameListStr" :list="buyerList" placeholder="请输入合同买方"/>
      <div class="filter-more-list" v-if="showMoreFilter">
        <FormSelectTagItem ref="quantityRel" v-on:change="handleItemChange" label="进销项数量差" title="quantityRel" :list="typeList"/>
        <FormSelectTagItem ref="amountRel" v-on:change="handleItemChange" label="进销项金额差" title="amountRel" :list="typeList"/>
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
      :row-key="record => record.key"
      :data-source="dataList"
      :pagination="false"
      :loading="loading"
      :scroll="{x: 1200}"
    >
      <div slot="downContractNoList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.downContractNoList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.downContractSplitAmountList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="downContractSplitQuantityList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.downContractSplitQuantityList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.downContractSplitAmountList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="downContractSplitAmountList" slot-scope="text, scoped">
        <p class="table-row-merge-line" v-for="(item,index) in scoped.downContractSplitAmountList" :key="index">
          <span>{{item}}</span>
          <a-divider class="table-merge-line" v-if="index != scoped.downContractSplitAmountList.length - 1"></a-divider>
        </p>
      </div>
      <div slot="action" slot-scope="text, scoped">
        <a-space>
          <a @click="detail(scoped)" v-auth="'kitInvoice:contract:buy:detail'">查看</a>
        </a-space>
      </div>
    </a-table>
    <p class="pagination-wrap">
      <span class="total" v-html="statistics">
      </span>
      <i-pagination :pagination="pagination" @change="handleTableChange" />
    </p>
    <EditInvoice ref="editInvoice" title="进项发票编辑" :columns="columnsInvoiceRelationContract"/>
  </div>
</template>

<script>
import { columnsInTable, columnsInvoiceRelationContract } from "./table.js";
import iPagination from "@/v2/components/iPaginationSimple.vue";
import EditInvoice from "../../components/EditInvoice.vue";

import FormNoInputItem from "@/v2/center/invoiceTools/components/form/noInput.vue";
import FormMoreAndCheckboxItem from "@/v2/center/invoiceTools/components/form/moreAndCheckbox.vue";
import FormSelectTagItem from "@/v2/center/invoiceTools/components/form/selectTag.vue";

import {
  API_BUY_CONTRACT_LIST,
  API_BUY_CONTRACT_EXPORT,
  API_BUYER_CONTRACT_LIST,
  API_SELLER_CONTRACT_LIST,
} from "@/v2/center/invoiceTools/api";
import comDownload from "@sub/utils/comDownload.js";
import tableSearchList from "../../mixins";

export default {
  mixins: [tableSearchList],
  data() {
    return {
      columnsInTable,
      columnsInvoiceRelationContract,
      loading: false,
      formResult: {
        contractNo: [],
        buyerNameListStr: [],
        sellerNameListStr: [],
        quantityRel: [],
        amountRel: [],
      },
      dataList: [],
      showMoreFilter: false,
      sellerList: [],
      buyerList: [],
      typeList: ["小于0", "等于0", "大于0"],
      loadingExport: false,
      typeListEnum: {
        小于0: -1,
        等于0: 0,
        大于0: 1,
      },
      statistics: ''
    };
  },
  components: {
    iPagination,
    EditInvoice,
    FormNoInputItem,
    FormMoreAndCheckboxItem,
    FormSelectTagItem,
  },
  methods: {
    filterMore() {
      this.showMoreFilter = !this.showMoreFilter;
    },
    getBuyerList() {
      API_BUYER_CONTRACT_LIST().then((res) => {
        if (res.success) {
          this.buyerList = res.data;
        }
      });
    },
    getSellerList() {
      API_SELLER_CONTRACT_LIST().then((res) => {
        this.sellerList = res.data;
      });
    },
    exportList() {
      this.loadingExport = true;
      API_BUY_CONTRACT_EXPORT({
        ...this.formatePostData(),
      })
        .then((res) => {
          comDownload(res, undefined, "采购合同" + ".xls");
        })
        .finally(() => {
          this.loadingExport = false;
        });
    },
    formatePostData() {
      return {
        contractNo: this.formResult.contractNo.join(","),
        buyerNameListStr: this.formResult.buyerNameListStr.join(","),
        sellerNameListStr: this.formResult.sellerNameListStr.join(","),
        quantityRel:
          this.typeListEnum[this.formResult.quantityRel.join(",")],
        amountRel:
          this.typeListEnum[this.formResult.amountRel.join(",")],
      };
    },
    fetchData() {
      this.loading = true;
      API_BUY_CONTRACT_LIST({
        ...this.formatePostData(),
        ...this.pagination,
      })
        .then((res) => {
          if (res.success) {
            this.dataList = res.result.records;
            this.pagination.total = res.result.total;
            this.pagination.pageNo = res.result.current;
            this.statistics = res.message
            this.dataList.forEach((item, index) => {
              item.key = index;
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleItemChange(item) {
      const key = Object.keys(item)[0];
      this.formResult[key] = item[key];
    },
    detail(scoped) {
      this.$router.push({
        path: "/center/admin/invoice/contract/buy/detail",
        query: {
          id: scoped.upContractNo,
        },
      });
    },
  },
  mounted() {
    this.getBuyerList();
    this.getSellerList();
  },
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
    .search-form-label {
      width: 100px;
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
.filter-more {
  width: 100%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  margin-top: 20px;
}
.filter-more-text {
  cursor: pointer;
  color: #8b9db8;
}
.more-icon {
  margin-right: 5px;
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
