<template>
  <div  class="slMain">
    <a-card :bordered="false"> 
      <span slot="title" class="slTitle"><span>标题</span></span>
      <div class="tabs-box">
        <a-tabs v-model="activeTab" @change="tabChange">
          <a-tab-pane v-for="item in tabList" :key="item.value">
            <span slot="tab">
              {{item.label}}
            </span>
          </a-tab-pane>
        </a-tabs>
        <div class="right-box">
          <a-button  type="primary"  @click="add"  class="add">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="13" height="13" rx="3.5" stroke="white"/>
              <path d="M6.49093 10.4989C6.49093 10.7756 6.71885 11 7.00002 11C7.28118 11 7.50911 10.7756 7.50911 10.4989V7.50112H10.4909C10.7721 7.50112 11 7.27675 11 6.99998C11 6.72321 10.7721 6.49884 10.4909 6.49884H7.50911V3.50114C7.50911 3.22437 7.28118 3 7.00002 3C6.71885 3 6.49093 3.22437 6.49093 3.50114V6.49884H3.50909C3.22793 6.49884 3 6.72321 3 6.99998C3 7.27675 3.22793 7.50112 3.50909 7.50112H6.49093V10.4989Z" fill="white"/>
            </svg>
            <span>新增</span>
          </a-button>
        </div>
      </div>
      <SlFormNew
          :list="searchList"
          layout="inline"
          @change="handleChange"
          :isShowIcon="false"
          :isShowSearchBox="true"
          :colSpan="6"
          @resetFunc='resetFunc'
          ref="slFormNew"
        ></SlFormNew>
        <div class="tip-box">
          <div class="export-box" @click="exportData">
            <ExportIcon></ExportIcon>
            <span class="export-text">数据导出</span>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-box">
          <a-table
            class="new-table"
            :bordered="false"
            :scroll="{ x: true }"
            :dataSource="list"
            :columns="columns"
            :pagination="false"
            :rowKey="(record) => record.id"
            :loading="loading"
          >
            <template slot="goodsName" slot-scope="text">
              <a-tooltip v-if="text">
                <template slot="title">{{text}}</template>
              <p class="omit"> {{text || '-'}}</p>
              </a-tooltip>
              <span v-else>-</span>
            </template>

            <template slot="action" slot-scope="text,record">
              <a-space>
                <template>
                  <!-- <a @click.prevent="edit(record)">编辑</a> -->
                  <a  @click.prevent="detail(record)" >详情</a>
                  <a  @click.prevent="del(record)">删除</a>
                </template>
              
              </a-space>
            </template>
      
          </a-table>
        </div>
        <i-pagination :pagination="pagination" size="small" @change="handleTableChange" />
        <DelModal ref="delModal" @ok='confirmDel'>
          <p style="margin-top:18px;color: rgba(0, 0, 0, 0.50);">删除提示</p>
        </DelModal>
        <!-- 关联合同 -->
    </a-card >
  </div>
</template>

<script>

import { filterCodeByKey } from "@sub//utils/globalCode.js";
import { formatAccountNumber }  from '@sub/utils/factory.js'
import DelModal from '@sub/components/DelModal.vue'
import { formatMoney } from '@sub/filters'
import { getPopupContainer } from "@sub//utils/factory.js";
import SlFormNew from "@sub/components/ui-new/Form/sl-form.vue";
import iPagination from "@sub/components/iPagination";
import moment from 'moment'
import comDownload from '@sub/utils/comDownload';
import {ExportIcon} from '@sub/components/svg'
import { mapGetters, mapMutations } from "vuex";
import { getAction,downFile, postAction, downFilePost } from '@/api/manage'


const searchList = [
    {
      decorator: ["storageDate"],
      addonBeforeTitle: "日期",
      type: "datePicker",
      placeholder: "请选择",
        allowClear: false,
    },
    {
      decorator: ["goodsName"],
      addonBeforeTitle: "品名",
      type: "input",
      placeholder: "请输入品名",
    },
    {
      decorator: ["coalPlanNo"],
      addonBeforeTitle: "编号",
      type: "input",
      placeholder: "请输编号",
    },
];



export default {

  data() {
    return {
      searchList: [],
      list: [],
      searchParams: {},
      pagination: {
        pageNo: 1,
        total: 10,
        pageSize: 10,
      },
      loading: false,
      tabList: [
        {value: '', label: '全部'},
        {value: 'AUTOMOBILE', label: '汽运'},
      ],
      activeTab: '',
      // 统计数据
      statisticsInfo: {},
      // 当前操作的像
      currentItem: {}
    }
  },
  computed: {

    columns() {
      return [
          {title: `日期`,key: "storageDate",dataIndex: "storageDate",},
          {title: `品名`,key: "goodsName",dataIndex: "goodsName",scopedSlots: { customRender: "goodsName" },},
          {title: `数量(吨)`,key: "weight",dataIndex: "weight",},
          {title: `车数`,key: "carsNumber",dataIndex: "carsNumber", customRender: t => t || '-'},
          {title: `合同编号`,key: "contractNo",dataIndex: "contractNo", customRender: t => t || '-'},
          {title: `计划`,key: "coalPlanNo",dataIndex: "coalPlanNo", customRender: t => t || '-'},
          {title: `单位`,key: "deliveryReceiveCompanyName",dataIndex: "deliveryReceiveCompanyName",  scopedSlots: { customRender: "deliveryReceiveCompanyName" }},
          {title: `仓房&货位`,key: "warehouseGoodsAllocationName",dataIndex: "warehouseGoodsAllocationName", scopedSlots: { customRender: "warehouseGoodsAllocationName" }},
          { title: "操作",  key: "操作",  dataIndex: "操作",fixed:"right", scopedSlots: { customRender: "action" },},
      ]
    }
  },

  watch: {

  },
  mounted() {
      this.getList()
      
  },
  
  methods: {

    handleChange(data) {
      this.searchParams = data
      this.getList()
    },
    async getList() {

      this.loading = true
      const params = {
        ...this.searchParams,
        ...this.pagination,
      }
      try {
        const res = await  postAction('/sys/storage/manage/record/page/by/contract/no', params)
        this.list = res.data.records || []
        this.pagination.total = res.data.total || 0
        this.loading = false
      } catch (error) {
         this.loading = false
      }

    },
    tabChange() {
      this.getList()
    },
    handleTableChange(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
      this.pagination.pageNo = pageNo
      this.pagination.pageSize = pageSize
      this.getList()

    },
    // 重置
    resetFunc() {
      this.searchParams = {}
      this.getList()
      
    },

    del(item) {
      this.currentItem = item
      this.$refs.delModal.open()
    },
    detail(item) {

      this.$emit('detail', item)
    },
    edit(item) {
      this.$emit('edit', item)
    },


    // 新增
    add() {
      this.$emit('add')

    },
    exportData() {
        const params = {
         ...this.searchParams,
         pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,

      }
      const res = await downFilePost('/sys/storage/manage/record/page/by/contract/no/excel', params)
      const name = `${this.detailData.paperContractNo || this.detailData.contractNo}-${this.type == 'IN' ? '入' : '出'}库信息-${moment().format('YYYY-MM-DD')}.xls`
      comDownload(res, undefined, name)
    },

  },
  components: {
    SlFormNew,
    iPagination,
    ExportIcon,
    DelModal,

  }
}
</script>

<style lang="less" scoped>
@import url("~@/style/table.less");
</style>
<style lang="less" scoped>
  .tabs-box {
    position: relative;
    .right-box {
      position: absolute;
      right: 0;
      top: 10px;
      // text-align: right;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
    }
    .oa-box {
      display: flex;
      align-items: center;
      color: var(--text-40, rgba(0, 0, 0, 0.40));
    }
    .line {
      width: 1px;
      height: 13px;
      background: #E5E6EB;
      margin: 0 20px;
    }

  }
  .export-box {
    display: flex;
    align-items: center;
    color: #4682F3;
    cursor: pointer;
    .export-text {
      margin-left: 6px;
      position: relative;
      top: 2px;
    }
  }
  .add {
    border-radius: 4px;
    border: 0px solid #4682F3;
    display: inline-flex;
    padding: 5px 14px;
    align-items: center;
    gap: 4px;
    background: #4682F3;
  }
  .tip-box {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    margin-bottom: 20px;
  }
.omit {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
