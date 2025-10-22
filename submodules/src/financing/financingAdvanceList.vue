<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">预付融资管理</span>
        <a-space style="text-align: right">
          <a-button type="primary" v-auth="'finance:finance:pre:apply'" @click="goApply">融资申请</a-button>
           <!-- v-auth="'finance:finance:pre:apply'" -->
        </a-space>
      </div>
      <SlFormNew
          :list="searchList"
          layout="inline"
          style="margin:10px 0"
          @change="handleChange"
          @resetFunc="resetFunc"
      ></SlFormNew>
      <Tab :statusData='statusData' :currentStatus='status' @callback='changeTab' @export='exportData' source='advance'></Tab>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table class="new-table" :pagination="false" :columns="columns" :data-source="listDataSource"  :scroll="{x:true}" rowKey="id" :loading='loading'>
          <template slot="planFinancingAmount" slot-scope="text, record">
            <a-tooltip >
              <template  slot="title"  v-if="text">
                {{convertCurrency(text)}}
              </template>
              <span v-if="text">{{formatMoney(text)}}</span>
              <span v-else>-</span>
              
            </a-tooltip>
          </template>
          <template slot="finAmount" slot-scope="text, record">
            <a-tooltip >
              <template  slot="title" v-if="text">
                {{convertCurrency(text)}}
              </template>
              <span v-if="text">{{formatMoney(text)}}</span>
              <span v-else>-</span>
            </a-tooltip>
          </template>
          <template slot="receivableAmount" slot-scope="text, record">
            <a-tooltip >
              <template  slot="title">
          
                {{convertCurrency(text)}}
              </template>
              {{formatMoney(text)}}
            </a-tooltip>
          </template>
          <a-space slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="$router.push('financingAdvanceDetail?id=' + record.id + '')">详情</a>



            <!-- 盖章 -->
            <a   v-if="record.canSign && record.status == 'TO_BE_SIGNED'"  style="margin-left:20px" v-auth="'finance:finance:pre:sign'" href="javascript:;"  @click="$router.push('financingAdvanceSign?id=' + record.id + '&type=detail')">盖章</a>
            <!-- 放款类型为融单时，融资状态为“待放款”状态下，显示“融单登记”按钮-->
            <a v-if="record.status == 'WAITING_LOAN' && record.loanType == 'FINANCIAL_ORDER'"  style="margin-left:20px" href="javascript:;" @click="$router.push('FinancingAdvanceRDRegis?id=' + record.id + '')">融单登记</a>

              <a href="javascript:;" v-auth="'finance:finance:pre:audit'"  style="margin-left:20px"  v-if="record.canAudit && record.status == 'TRADER_AUDIT'"   @click="$router.push('financingAdvanceDetailAudit?id=' + record.id + '&type=mai')">审核</a>

              <a href="javascript:;" v-auth="'finance:finance:pre:audit'"   style="margin-left:20px"  v-if="record.canAudit && record.status == 'CORE_COMPANY_AUDIT'"   @click="$router.push('financingAdvanceDetailAudit?id=' + record.id + '&type=main')">审核</a>

              <a href="javascript:;" v-auth="'finance:finance:pre:sign'"  style="margin-left:20px"   v-if="record.canSign && record.status == 'TRADER_TO_BE_SIGNED'"  @click="gotoSign(record,'mai')">盖章</a>

              <a href="javascript:;" v-auth="'finance:finance:pre:sign'"   style="margin-left:20px"  v-if="record.canSign && record.status == 'CORE_COMPANY_TO_BE_SIGNED'"  @click="gotoSign(record,'main')">盖章</a>


            <!-- 审核盖章 -->
          </a-space>
          <div slot="status" slot-scope="text,record">
            <FinancingTipInfo :item="record" :API_GetFinancingStatusTip='API_GetFinancingStatusTip' />
          </div>
        </a-table>
        <i-pagination :pagination="pagination" v-show='pageSize < pagination.total' @change="getList"/>
      </div>
    </a-card>
  </div>
</template>

<script>




import { formatMoney } from '@sub/filters'
import iPagination from "@sub/components/iPagination";
import FinancingTipInfo from '@sub/financing/FinancingTipInfo.vue'
import Tab from '@sub/financing/Tab.vue'
import SlFormNew from "@sub/components/ui-new/Form/sl-form";

import {filterCodeByValueName,filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js'
const customRender = t => t || '-'
const columns = [
  {title: '融资编号', dataIndex: 'serialNo', key: 'serialNo'},
  {title: '出资机构', dataIndex: 'bankName', key: 'bankName'},
  {title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName'},
  { title: '拟融资金额(元)', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount',scopedSlots: { customRender: 'planFinancingAmount' }},
  { title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount',scopedSlots: { customRender: 'finAmount' }},
  {title: '放款类型', dataIndex: 'loanTypeText', key: 'loanTypeText'},
  {title: '融资利率（%）', dataIndex: 'rate', key: 'rate'},
  {title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate',customRender},
  {title: '融资到期日', dataIndex: 'endDate', key: 'endDate', customRender},
  {title: '预付账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo'},
  {title: '预付账款金额(元)', dataIndex: 'receivableAmount', key: 'receivableAmount', scopedSlots: {customRender: 'receivableAmount'}},
  {title: '融资状态', key: 'statusText', dataIndex: 'statusText', fixed: 'right', scopedSlots: {customRender: 'status'}},
  {title: '操作', key: 'action', fixed: 'right', scopedSlots: {customRender: 'action'}}
];

const searchList = [
  {
    decorator: ["serialNo"],
    addonBeforeTitle: "编号",
    type: "input",
    placeholder: "请输入融资编号或预付账款流水号",
  },
  {
    decorator: ["bankName"],
    addonBeforeTitle: "出资机构",
    type: "input",
    placeholder: "请输入出资机构",
  },
  {
    decorator: ["sellerName"],
    addonBeforeTitle: "卖方名称",
    type: "input",
    placeholder: "请输入卖方名称",
  },
  {
    decorator: ["beginDate"],
    addonBeforeTitle: "融资起息日",
    type: "rangePicker",
    realKey: ["beginDateStart", "beginDateEnd"],
  },
  {
    decorator: ["endDate"],
    addonBeforeTitle: "融资到期日",
    type: "rangePicker",
    realKey: ["endDateStart", "endDateEnd"],
  },
  {
    decorator: ["loanType"],
    addonBeforeTitle: "放款类型",
    type: "select",
    placeholder: "请选择放款类型",
    options: filterCodeByKey('loanTypeDict').map((item) => {
      return {value: item.value, label: item.text};
    }),
  },
];


export default {
  props: {
    listApi: {},
    syncApi: {},
    API_GetFinancingStatusTip: {},
    getFinancingAdvanceStatistics: {}
  },
  data() {
    return {
      columns,
      // constants,
      searchList,
      pagination: {
        pageNo: 1,
        total:0,
      },
      pageSize: 10,
      listDataSource:[],
      statusData: [
        {label: '全部', value: 'ALL', num: 0},
        {label: '待我方审核', value: 'AUDIT', num: 0},
        {label: '待我方盖章', value: 'SIGN', num: 0},
        {label: '待对方审核', value: 'PARTY_AUDIT',},
        {label: '待对方盖章', value: 'PARTY_SIGN',},
        {label: '待放款', value: 'WAITING_LOAN'},
        {label: '已放款', value: 'LOANED'},
        {label: '部分还款', value: 'PART_REPAY'},
        {label: '已结清', value: 'CLEARED'},
        {label: '无效', value: 'INVALID'},

      ],
      status: '',
      searchParams: {},
      loading: false,
    }
  },
  computed: {
    VUEX_ST_COMPANYSUER() {
      if(this.$store.state.user) {
        return this.$store.state.user.VUEX_ST_COMPANYSUER
      }
      return {}
      
    },
  },
  components: {
    iPagination,
    FinancingTipInfo,
    Tab,
    SlFormNew
  },
  mounted() {
    this.getList()
    this.getTabStatistics()
  },
  methods: {
    formatMoney,
    convertCurrency,
    resetFunc() {
      this.searchParams = {}
      this.status = 'ALL'
      this.pagination.pageNo = 1
      this.pageSize = 10
      this.getTabStatistics()
    },
    handleChange(data) {
      this.searchParams = data;
      this.getTabStatistics()
      this.getList()
    },
    async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
      this.pagination.pageNo = pageNo
       this.loading = true
      this.pageSize = pageSize
      const params = {
         ...this.pagination,
         pageSize: this.pageSize,
         ...this.searchParams,
         status: this.status,
      }
      try {
        const res = await this.listApi(params)
        this.loading = false
        this.listDataSource = res.data.records
        this.pagination.total = res.data.total
      } catch (error) {
        this.loading = false
      }
    },
    // 切换tab
    changeTab(val) {
      this.status = val
      this.getTabStatistics()
      this.getList(1, 10)

    },
       // 导出
    exportData() {
      this.$emit('export',  {...this.searchParams,  status: this.status,})
    },
    goApply() {
      this.$emit('goApply')
    },
    gotoSign(record, type) {
      this.$router.push({
        path: '/center/financing/financingAdvanceAuditSign',
        query: {
          auditOpinion: '通过',
          type: type,
          id: record.id
        }
      })

    },
        // 获取统计
    async getTabStatistics() {
      if(!this.getFinancingAdvanceStatistics) return
      const res = await this.getFinancingAdvanceStatistics(this.searchParams)
      const list = res.data || []
      this.statusData.forEach(el => {
        const item  = list.find(el2 => el2.status == el.value ) || {}
        el.num = item.count
      })
      this.$forceUpdate()
    }
  },

};


</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;

  /deep/ .ant-card-head .ant-card-head-title {
    border-bottom: 1px solid #E5E6EB;
    padding-bottom: 20px;
    margin-bottom: 10px;
  }
}

.tabs-box {
  position: relative;

  ::v-deep.ant-tabs-bar {
    padding-right: 90px;
  }
}

.table-box.fixedBottom {
  .new-table {
    margin-bottom: 2px;
  }

  .slPagination {
    margin-top: 10px;
    width: calc(100% - 254px);
    min-width: 1186px;
    background: #fff;
    padding: 10px 30px;
    position: fixed;
    bottom: 0;
    z-index: 1;
    left: 228px;
  }
}
</style>
