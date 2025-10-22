<template>
  <div>
    <!-- 关联采购、销售合同弹窗 -->
    <a-drawer
      class="slDrawer"
      title="OA同步异常数据"
      placement="right"
      :visible="orderRelationModal"
      @ok="handleSubmit"
      @close="onClose"
      :footer="null"
      destroyOnClose
    >
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="getRelationOrderList"
        :isShowIcon="false"
        :isShowSearchBox="true"
        :colSpan="8"
        ref="slFormNew"
      ></SlFormNew>
      <!-- 表格 -->
      <div class="table-box">
        <a-table
          class="new-table"
          :bordered="false"
          :scroll="{ x: true }"
          :dataSource="relationOrderList"
          :columns="columns"
          :pagination="false"
          :rowKey="(record) => record.id"
          :loading="loading"
        >
     
           <template  slot="receiveName" slot-scope="action, item">
            <div class="payment-box">
              <span class="payment-box-name" v-if="item.receiveName">{{item.receiveName}}</span>
               <a-tooltip>
                <template slot="title">
                  <p>名称：{{item.receiveName}}</p>
                  <p>开户行：{{item.receiveAccountBank}}</p>
                  <p>账号：{{formatAccountNumber(item.receiveAccount)}}</p>

                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M3.55208 5.53125C3.11025 5.53125 2.75208 5.88942 2.75208 6.33125C2.75208 6.77308 3.11025 7.13125 3.55208 7.13125H5.95208C6.3939 7.13125 6.75208 6.77308 6.75208 6.33125C6.75208 5.88942 6.3939 5.53125 5.95208 5.53125H3.55208Z" fill="#4682F3"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H14C15.1046 12 16 11.1046 16 10V2C16 0.895431 15.1046 0 14 0H2ZM14 1.6H2C1.77909 1.6 1.6 1.77909 1.6 2V2.92578H14.4V2C14.4 1.77909 14.2209 1.6 14 1.6ZM1.6 10V4.52578H14.4V10C14.4 10.2209 14.2209 10.4 14 10.4H2C1.77909 10.4 1.6 10.2209 1.6 10Z" fill="#4682F3"/>
                </svg>
              </a-tooltip>
            </div>
          </template>
        </a-table>
      </div>
      <i-pagination :pagination="paginationRelation" size="small" @change="handleTableChange" />
      <!-- 底部 -->
      <!-- <div class="footer">
        <a-space :size="30">
          <a-button class="relation-contract-modal-btn" style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button class="relation-contract-modal-btn" type="primary" @click="handleSubmit">确定</a-button>
        </a-space>
      </div> -->
    </a-drawer>
  </div>
</template>

<script>

import { filterCodeByKey } from '@sub/utils/globalCode.js'



import { formatAccountNumber }  from '@sub/utils/factory.js'
import { formatMoney } from '@sub/filters'

import { getPopupContainer } from "../../utils/factory.js";
import SlFormNew from "@sub/components/ui-new/Form/sl-form.vue";
import iPagination from "@sub/components/iPagination";
const searchList = [
  {
    decorator: ["keyNo"],
    addonBeforeTitle: "编号",
    type: "input",
    placeholder: "请输入订单、合同、回款编号",
  },
  {
    decorator: ["paymentCompanyName"],
    addonBeforeTitle: "回款方",
    type: "input",
    placeholder: "请输入回款方",
  },
  {
    decorator: ["receiveName"],
    addonBeforeTitle: "收款账号",
    type: "input",
    placeholder: "请输入收款账号",
  },
   {
    decorator: ["issuedDate"],
    addonBeforeTitle: "回款日期",
    type: "rangePicker",
    realKey: ["minCollectionDate", "maxCollectionDate"],
  },
  {
    decorator: ["collectionType"],
    addonBeforeTitle: "回款方式",
    type: "select",
    placeholder: "请选择回款方式",
    options: filterCodeByKey('collectionTypeDict') || filterCodeByKey('collectionTypeDict'),
  },
  {
    decorator: ["dataSource"],
    addonBeforeTitle: "数据来源",
    type: "select",
    placeholder: "请选择数据来源",
    options: [
      {label: "OA同步", value: "1",},
      { label: "手工录入",value: "2", },
      { label: "银行同步",value: "3",},
    ],
  },



  
];

const columns = [
  {
    title: "回款编号",
    dataIndex: "collectionNo",
    align: "center",
    width: 200,
     fixed: "left",
  },
  {
    title: "回款方",
    dataIndex: "paymentCompanyName",
    align: "center",
    width: 150
  },
   {
    title: "收款账号",
    dataIndex: "receiveName",
    scopedSlots: { customRender: "receiveName" },
  },
  {
    title: "错误原因",
    dataIndex: "reason",
    width: 150
  },
  {
    title: "回款日期",
    dataIndex: "collectionDate",
    align: "center",
    width: 180
  },               
  {
    title: "回款金额(元)",
    dataIndex: "collectionAmount",
     customRender: (txt) => formatMoney(txt, 2),
    align: "center",
    width: 150
  },
  {
    title: "认领日期",
    dataIndex: "claimedDate",
    align: "center",
    width: 180
  },   

  {
    title: "认领金额(元)",
    dataIndex: "claimedAmount",
    align: "center",
    customRender: (txt) => formatMoney(txt, 2),
    width: 150
  },
  {
    title: "认领人员",
    dataIndex: "claimedPerson",
    align: "center",
    width: 150
  },
  {
    title: "变更时间",
    dataIndex: "updateDate",
    align: "center",
    width: 150
  },


  {
    title: "变更人员",
    dataIndex: "updateBy",
    align: "center",
    width: 150
  },
 
  {
    title: "关联数链合同编号",
    dataIndex: "relSlContractNo",
    align: "center",
    width: 150
  },
  {
    title: "关联数链订单编号",
    dataIndex: "orderNo",
    align: "center",
    width: 150
  },
  {
    title: "下游合同编号",
    dataIndex: "downstreamContractNo",
    align: "center",
    width: 150
  },
];
export default {
  name: "OaErrorModal",
  computed: {
  },
  props: {
    Fn: {
     
    },
    info: {
      default: () => {return {}}
    }
  },
  data() {
    return {
      getPopupContainer,
      columns,
      searchModalParamsRelation: {},
      orderRelationModal: false,
      relationOrderList: [],
      paginationRelation: {},
      searchList,
      loading: false
    };
  },
  components: {
    SlFormNew,
    iPagination
  },

  created() {

  },
  methods: {
    formatAccountNumber,
    getRelationOrderList(data) {


      this.searchModalParamsRelation = data || {}
      this.loading = true;
      this.selectedRowKeys = [];
      this.selected = {};
      this.Fn(this.searchModalParamsRelation).then((res) => {
        if (res.success) {
          let result = res.result || res.data;
          this.relationOrderList = result.records;
          const paginationRelation = {
            total: result.total,
            pageSize: result.size,
            current: result.current,
            pageNo: result.current,
            showTotal: function (total) {
              return `共${total}条记录 第${result.current}页 `;
            },
          };
          this.paginationRelation = paginationRelation;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    //外部引用方法打开弹框
    show() {
      this.orderRelationModal = true;
      this.resetValuesRelation()
    },
    //切换头部，重置
    resetValuesRelation() {
      this.searchModalParamsRelation = {};
      this.relationOrderList = [];
      this.paginationRelation = {
        current: 1,
      };
      this.getRelationOrderList();
      if (this.$refs.slFormNew) {
        this.$refs.slFormNew.resetSearchQuery()
      }
    },
    handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
      this.paginationRelation.pageSize = pageSize;
      this.paginationRelation.pageNo = pageNo;
      this.paginationRelation.current = pageNo;
      this.searchModalParamsRelation.pageNo = this.paginationRelation.current
      this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize
      this.getRelationOrderList(this.searchModalParamsRelation);
    },

    handleSubmit() {

      this.$emit("detail", selected);
    },
    onClose() {
      this.orderRelationModal = false
      this.selectedRowKeys = []
    }
  },
};
</script>
<style lang="less" scoped>
@import url("../../style/table.less");
@import url("../../style/style.less");
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
  height: 32px;
  line-height: 32px;
}
.slDrawer .ant-drawer-content-wrapper {
    width: 1136px !important;
}
</style>