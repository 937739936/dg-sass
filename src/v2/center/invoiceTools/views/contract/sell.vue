<template>
  <div>
    <div class="method-btn-wrap">
      <div class="invoice-export-button" icon="export" @click="exportList" :loading="loadingExport" v-auth="'kitInvoice:contract:sell:export'">导出数据</div>
    </div>
    <div class="search-form search-form-label-100px search-form-no-margin-left">
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
      <FormNoInputItem class="contract-input" ref="contractNo" v-on:change="handleItemChange" label="合同编号" title="contractNo" placeholder="请输入合同编号"/>
      <FormMoreAndCheckboxItem ref="sellerList" v-on:change="handleItemChange" label="合同卖方" title="sellerNameListStr" :list="sellerList" placeholder="请输入合同卖方"/>
      <FormMoreAndCheckboxItem ref="buyerNameListStr" v-on:change="handleItemChange" label="合同买方" title="buyerNameListStr" :list="buyerList" placeholder="请输入合同买方"/>
    </div>
    <a-table
      class="table-wrap new-table"
      :columns="columnsInTableSell"
      :row-key="record => record.key"
      :data-source="dataList"
      :pagination="false"
      :loading="loading"
      :scroll="{x: 1200}"
    >
      <span slot="action" slot-scope="text, scoped">
        <a-space>
          <a @click="detail(scoped)" v-auth="'kitInvoice:contract:sell:detail'">查看</a>
        </a-space>
      </span>
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
import { columnsInTableSell, columnsInvoiceRelationContract } from "./table.js";
import iPagination from "@/v2/components/iPaginationSimple.vue";
import EditInvoice from "../../components/EditInvoice.vue";

import FormNoInputItem from "@/v2/center/invoiceTools/components/form/noInput.vue";
import FormMoreAndCheckboxItem from "@/v2/center/invoiceTools/components/form/moreAndCheckbox.vue";

import {
  API_SELL_CONTRACT_LIST,
  API_SELL_CONTRACT_EXPORT,
  API_BUY_DOWN_LIST,
  API_SELL_DOWN_LIST,
} from "@/v2/center/invoiceTools/api";
import comDownload from "@sub/utils/comDownload.js";
import tableSearchList from "../../mixins";

export default {
  mixins: [tableSearchList],
  data() {
    return {
      columnsInTableSell,
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
  },
  methods: {
    getBuyerList() {
      API_BUY_DOWN_LIST().then((res) => {
        if (res.success) {
          this.buyerList = res.data;
        }
      });
    },
    getSellerList() {
      API_SELL_DOWN_LIST().then((res) => {
        this.sellerList = res.data;
      });
    },
    exportList() {
      this.loadingExport = true;
      API_SELL_CONTRACT_EXPORT({
        ...this.formatePostData(),
      })
        .then((res) => {
          comDownload(res, undefined, "销售合同" + ".xls");
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
        amountRel: this.typeListEnum[this.formResult.amountRel.join(",")],
      };
    },
    fetchData() {
      this.loading = true;
      API_SELL_CONTRACT_LIST({
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
    filterMore() {
      this.showMoreFilter = !this.showMoreFilter;
    },
    detail(scoped) {
      this.$router.push({
        path: "/center/admin/invoice/contract/sell/detail",
        query: {
          id: scoped.downContractNo,
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
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/searchForm.less');
@import url('~@/v2/style/invoiceTools/common.less');
@import url('~@/v2/style/table-cover.less');
</style>
