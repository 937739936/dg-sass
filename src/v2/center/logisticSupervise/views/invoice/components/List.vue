<template>
  <div class="slMain">
    <a-card :bordered="false">
      <span slot="title" class="slTitle">
        {{ invoiceTitle }}
        <a-space style="float:right" :size="20">
          <a-button @click="exportFile" type="primary" ghost>
            Excel导出
          </a-button>
          <a-button type="primary" @click="goAdd" v-auth="'logicDeliverMonitor:invoiceManager:deliver:add'">
            新增发票
          </a-button>
        </a-space>
      </span>
      <!-- 查询区域 -->
      <SlFormNew :list="searchList" ref="slFormNew" layout="inline" @change="changeSearch"></SlFormNew>
      <!-- 表格 -->
      <div :class="'table-box '+(pagination.total>10?'fixedBottom ':' ')">
        <a-table
            :columns="columns"
            class="new-table"
            :rowSelection="rowSelection"
            :bordered="false"
            :rowKey="key"
            :dataSource="list"
            :pagination="false"
            :loading="loading"
            :scroll="{ x: true }"
        >
        <span slot="contractNo" slot-scope="text, record">
          <div v-for="(item, index) in record.contractNoList" :key="index">
            {{ item || "-" }}
          </div>
        </span>
          <span slot="customTitle2">
          开具金额(元)
          <a-tooltip>
            <template slot="title"> 不含税 </template>
            <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size: 12px"></i>
          </a-tooltip>
        </span>
          <span slot="notSplitAmount">
          发票可拆分金额(元)
          <a-tooltip>
            <template slot="title"> 含税 </template>
            <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size: 12px"></i>
          </a-tooltip>
        </span>
          <span slot="customTitle"> 操作 </span>
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a href="javascript:;" class="btn" @click="goDetail('detail', record)">查看</a>
              <!-- 判断是否是异常发票 -->
              <a href="javascript:;" v-auth="'logicDeliverMonitor:invoiceManager:deliver:edit'" v-if="record.state == 'NORMAL'" class="btn"
                 @click="goDetail('modify', record)">编辑</a>
              <!-- 异常发票判断 -->
              <a href="javascript:;" v-auth="'logicDeliverMonitor:invoiceManager:deliver:delete'" v-if="record.state != 'NORMAL'" class="btn" @click="del(record.id)">删除</a>

              <a-dropdown v-else placement="bottomCenter" style="margin-right: 12px" v-auth="'logicDeliverMonitor:invoiceManager:deliver:more'">
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 更多
                  <img src="@/v2/assets/imgs/invoicetools/gengduo.png" alt="" style="width: 9px;margin-bottom: 3px">
                </a>
                <a-menu slot="overlay" class="menu-box-invoice">
                  <a-menu-item v-auth="'logicDeliverMonitor:invoiceManager:deliver:redPunch'">
                    <a href="javascript:;" @click="spill(record)">红冲</a>
                  </a-menu-item>
                  <a-menu-item v-auth="'logicDeliverMonitor:invoiceManager:deliver:cancel'">
                    <a href="javascript:void(0)" @click="invalid(record)">作废</a>
                  </a-menu-item>
                  <a-menu-item v-auth="'logicDeliverMonitor:invoiceManager:deliver:delete'">
                    <a href="javascript:;" @click="del(record.id)">删除</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-space>
          </div>
        </a-table>
        <div :class="'pagination-checkbox '+(pagination.total<10?'fixedCheckbox ':' ')" v-if="selectedRows.length">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
            fill="var(--primary-color)" stroke="none">
            <path d="M70 288 c-40 -21 -51 -55 -48 -140 3 -65 7 -81 26 -100 20 -21 32
            -23 112 -23 124 0 135 11 135 135 0 80 -2 92 -23 112 -19 19 -35 23 -100 26
            -49 2 -86 -2 -102 -10z m170 -128 c0 -18 -7 -20 -80 -20 -73 0 -80 2 -80 20 0
            18 7 20 80 20 73 0 80 -2 80 -20z"/>
            </g>
          </svg>
          <span>
          已选{{ selectedRows.length }}项
        </span>
          <a-space :size="16">
            <a-button type="primary" :disabled="disableBtn" ghost @click="hc">批量红冲</a-button>
            <a-button type="primary" :disabled="disableBtn" ghost @click="zf">批量作废</a-button>
            <a-button type="primary" :disabled="disableBtn" ghost @click="sc">批量删除</a-button>
          </a-space>
        </div>
        <i-pagination :pagination="pagination" size="small" @change="getList"  v-show='pageSize < pagination.total'  />
      </div>
      <DelModal ref="delModal" @confirm="confirmDel"></DelModal>
      <ErrorTipsModal ref="errorTipModal" @next="next"/>
      <ConfirmDelete ref="confirmDelete" @next="sc"/>
    </a-card>
  </div>
</template>

<script>
import {ListMixin} from "@/v2/components/mixin/ListMixin";
import iPagination from "@sub/components/iPagination";
import {mapGetters} from "vuex";
import {buyColumns, freightColumns} from "./columns/columns.js";
import DelModal from "./delModal.vue";
import ErrorTipsModal from "@/v2/components/newInvoice/ErrorTipsModal";
import ConfirmDelete from "@/v2/components/newInvoice/ConfirmDelete";
import {
  getInvoiceList,
  exportInvoiceXls,
  invalidInvoice,
  deleteInvoice,
  reverseInvoice,
  API_INVOICES_REVERSE_BATCH,
  API_INVOICES_INVALID_BATCH,
  API_INVOICES_DELETE_BATCH
} from "@/v2/center/trade/api/invoice";
import comDownload from "@sub/utils/comDownload.js";
import {invoiceTypeInfo} from "./columns/constant.js";
import moment from "moment";
// 煤炭
// const pathCoalInfo = {
//   INPUT: {
//     detail: "/center/invoice/buy/detail",
//     modify: "/center/invoice/buy/edit",
//   },
//   OUTPUT: {
//     detail: "/center/invoice/sell/detail",
//     modify: "/center/invoice/sell/edit",
//   },
//   DELIVER: {
//     detail: "/center/invoice/freight/detail",
//     modify: "/center/invoice/freight/edit",
//   },
// };
// 物流运输管理
const pathCoalInfo = {
  INPUT: {
    detail: "/center/logisticSupervise/invoice/buy/detail",
    modify: "/center/logisticSupervise/invoice/buy/edit",
  },
  OUTPUT: {
    detail: "/center/invoice/sell/detail",
    modify: "/center/invoice/sell/edit",
  },
  DELIVER: {
    detail: "/center/logisticSupervise/invoice/freight/detail",
    modify: "/center/logisticSupervise/invoice/freight/edit",
  },
};
// 钢材
const pathSteelInfo = {
  INPUT: {
    detail: "/center/steels/invoice/buydetail",
    modify: "/center/steels/invoice/buyedit",
  },
  OUTPUT: {
    detail: "/center/steels/invoice/selldetail",
    modify: "/center/steels/invoice/selledit",
  },
  DELIVER: {
    detail: "/center/steels/invoice/Freightdetail",
    modify: "/center/steels/invoice/freightEdit",
  },
};


const searchList = [
  {
    decorator: ['contractNo'],
    addonBeforeTitle: '编号',
    type: 'input',
    placeholder: '请输入合同编号',
    allowClear: true,
  },
  {
    decorator: ['sellerName'],
    addonBeforeTitle: '销售方',
    type: 'input',
    placeholder: '输入销售方信息',
    allowClear: true,
  },
  {
    decorator: ['buyerName'],
    addonBeforeTitle: '购买方',
    type: 'input',
    placeholder: '输入购买方信息',
    allowClear: true,
  },
  {
    decorator: ['issuedDate'],
    addonBeforeTitle: '开票日期',
    realKey: ['issuedDateBegin', 'issuedDateEnd'],
    type: 'rangePicker',
    placeholder: ['', ''],
    allowClear: true,
  },
  {
    decorator: ['code'],
    addonBeforeTitle: '发票代码',
    type: 'input',
    placeholder: '输入发票代码',
    allowClear: true,
  },
  {
    decorator: ['no'],
    addonBeforeTitle: '发票号码',
    type: 'input',
    placeholder: '输入发票号码',
    allowClear: true,
  },
  {
    decorator: ['whetherHasAttachment'],
    addonBeforeTitle: '是否包含附件',
    type: 'select',
    placeholder: '请选择是/否',
    allowClear: true,
    options: [
      {value: '', label: '全部'},
      {value: '0', label: '否'},
      {value: '1', label: '是'},
    ]
  },
]
export default {
  props: ["invoiceType", "industryType"],
  mixins: [ListMixin],
  data() {
    return {
      searchParams: {
        contractNo: "",
        sellerName: "",
        buyerName: "",
      },
      issuedDate: [],
      /** 筛选项操作 */
      isSpread: false,
      // 加载
      loading: false,
      list: [],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
      },
      pageSize: 10,
      delId: "",
      searchList: [],
      key: "id",
      selectedRows: [],
      filterSelect: {},
      disableBtn: false
    };
  },
  computed: {
    // 发票title
    invoiceTitle() {
      return invoiceTypeInfo[this.invoiceType];
    },
    ...mapGetters("config", {
      VUEX_ST_ALLCODE: "VUEX_ST_ALLCODE",
    }),
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
    columns() {
      // 进项发票
      if (this.invoiceType == "INPUT") {
        return buyColumns;
      }
      // 销项
      if (this.invoiceType == "OUTPUT") {
        return buyColumns;
      }
      // 运费
      if (this.invoiceType == "DELIVER") {
        return freightColumns;
      }
    },
    iptStyle() {
      if (window.screen.width < 1900) {
        return {width: "252px"};
      }
      return {width: "290px"};
    },
    rowSelection() {
      let that = this;
      return {
        getCheckboxProps: (rescord) => {
          return {
            props: {
              disabled: rescord.disabled,
            },
          };
        },
        selectedRowKeys: that.selectedRows,
        columnWidth:30,
        onSelect: (record, selected) => {
          that.filterSelect[record[that.key]] = record.no
          if (selected) {
            that.selectedRows.push(record[that.key]);
          } else {
            that.selectedRows = that.selectedRows.filter((item) => {
              return item != record[that.key];
            });
          }
        },
        onSelectAll: (selected, selectedRows) => {
          that.selectedRows = selectedRows.map((item) => {
            return item[that.key];
          });
          selectedRows.map(item=>{
            that.filterSelect[item[that.key]] = item.no
          })
        },
      };
    },
    onCheckAllChange(e) {
      //如果选中给全部值，否则清空
      let that = this;
      Object.assign(this, {
        selectedRows: e.target.checked
            ? that.dataSource.map((item) => {
              return item[that.key];
            })
            : [],
      });
    },
    // showTotal() {
    //   //当有选中数据时，修改底部展示
    //   let length = this.selectedRows.length,
    //       that = this;
    //   if (length) {
    //     //筛选其中可选项
    //     let dataList = this.dataSource.filter((item) => {
    //       return !item.disabled;
    //     }).length;
    //     let h = this.$createElement;
    //     return h("a-space", { attrs: { size: 12 } }, [
    //       h(
    //           "a-checkbox",
    //           {
    //             attrs: {
    //               indeterminate: !!length && length < dataList,
    //               checked: length == dataList,
    //             },
    //             on: {
    //               change: that.onCheckAllChange,
    //             },
    //           },
    //           null
    //       ),
    //       h("span", null, `已选${length}项`),
    //     ]);
    //   } else {
    //     return ``;
    //   }
    // },
  },
  mounted() {
    this.searchList = [...searchList];
    console.log(this.VUEX_ST_ALLCODE.invoiceStateDict)
    this.searchList.push({
      decorator: ["state"],
      addonBeforeTitle: "状态",
      type: "select",
      placeholder: "请选择当前状态",
      optionsConfig: {
        key: "text",
        value: "value",
      },
      allowClear: true,
      options: [
        {value: "", text: "全部"},
        {value: "NORMAL", text: "正常"},
        {value: "INVALID", text: "已作废"},
        {value: "RED_DASHED", text: "红冲"},
      ]
    });
    this.getList();
  },
  methods: {
    changeSearch(data) {
      this.searchParams = data;
      this.selectedRows = []
      this.getList(1, this.pageSize);
    },
    // 获取发票列表
    async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
      this.pageSize = pageSize;
      this.pagination.pageNo = pageNo;
      // if (this.searchParams.issuedDate && this.searchParams.issuedDate.length) {
      //   this.searchParams.issuedDateBegin = this.searchParams.issuedDate[0]
      //   this.searchParams.issuedDateEnd = this.searchParams.issuedDate[1]
      // } else {
      //   delete this.searchParams.issuedDateBegin
      //   delete this.searchParams.issuedDateEnd
      // }
      const params = {
        ...this.searchParams,
        ...this.pagination,
        pageSize,
        type: this.invoiceType,
        industryType: this.industryType,
      };
      if(params.type == 'INPUT') {
        params.productCode = 'WAREHOUSE_RENT'
      }
      if(params.type == 'DELIVER') {
        params.productCode = 'LOGIC_DELIVER'
      }

      delete params.issuedDate;
      this.loading = true;
      try {
        const res = await getInvoiceList(params);
        this.list = res.data.records;
        this.pagination.total = res.data.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    // 去往详情和编辑
    goDetail(type, item) {
      const pathInfo = this.industryType == "STEEL" ? pathSteelInfo : pathCoalInfo;
      const pathItem = pathInfo[this.invoiceType];
      this.$router.push({
        path: pathItem[type],
        query: {
          id: item.id,
          no: item.no,
          type,
          invoiceType: this.invoiceType,
          industryType: this.industryType,
        },
      });
    },
    async spill(record) {
      // 红冲发票
      const res = await reverseInvoice({invoiceId: record.id});
      if (res.data) {
        this.$message.success("发票号码为" + record.no + "的发票，已红冲");
        this.getList(1, this.pageSize);
      } else {
        this.$message.error("未查询到发票红冲，红冲失败");
      }
    },
    async invalid(record) {
      // 作废发票
      const res = await invalidInvoice({invoiceId: record.id});
      if (res.data) {
        this.$message.success("发票号码为" + record.no + "的发票，已作废");
        this.getList(1, this.pageSize);
      } else {
        this.$message.error("未查询到发票作废，作废失败");
      }
    },
    // 新增发票
    goAdd() {
      const str = {
        INPUT: "buy/add?type=buy",
        OUTPUT: "sell/add?type=sell",
        DELIVER: "freight/add?type=freight",
        invoiceType: this.invoiceType,
      };
      const steelStr = {
        INPUT: "addBuy?type=buy",
        OUTPUT: "addSell?type=sell",
        DELIVER: "addFreight?type=freight",
        invoiceType: this.invoiceType,
      };
      // 判断是钢材新增还是发票新增
      const path = this.industryType == "STEEL" ? `/center/steels/invoice/${steelStr[this.invoiceType]}` : `/center/logisticSupervise/invoice/${str[this.invoiceType]}`;
      this.$router.push(path);
    },
    del(id) {
      this.delId = id;
      this.$refs.delModal.open();
    },
    async confirmDel() {
      await deleteInvoice({id: this.delId});
      this.$message.success("删除成功");
      this.$refs.delModal.close();
      this.getList();
      this.selectedRows = this.selectedRows.filter(item=>item!== this.delId)
    },
    // 导出
    async exportFile() {
      const params = {
        ...this.searchParams,
        ...this.pagination,
        pageSize: this.pageSize,
        type: this.invoiceType,
        industryType: this.industryType,
      };
      if(params.type == 'INPUT') {
        params.productCode = 'WAREHOUSE_RENT'
      }
      if(params.type == 'DELIVER') {
        params.productCode = 'LOGIC_DELIVER'
      }

      const res = await exportInvoiceXls(params);

      comDownload(res, undefined, `${this.invoiceTitle}_${moment().format("YYYYMMDD")}.xls`);
    },

    hc(success) {
      this.disableBtn = true
      API_INVOICES_REVERSE_BATCH({invoiceIds: success.length ? success :  this.selectedRows}).then(res => {
        if (res.success) {
          if (res.data.status == 1) {
            this.$message.success('所选发票已红冲，操作成功')
            this.searchParams = {}
            if(!success.length){
              this.selectedRows = []
            }
            this.$refs.slFormNew.resetSearchQuery()
            this.getList()
          } else if (res.data.status == 0) {
            this.$message.error('所选发票未查询到发票红冲，红冲失败')
          } else {
            let failsNo = []
            let successNo = []
            res.data.fails.map(item => {
              failsNo.push(this.filterSelect[item])
            })
            res.data.success.map(item => {
              successNo.push(this.filterSelect[item])
            })
            this.$refs.errorTipModal.init({
              failsNo,
              successNo,
              success: res.data.success,
              fails: res.data.fails,
              type:'hc'
            })
          }
        }
      }).finally(()=>{
        this.disableBtn = false
      })
    },
    next(data) {
      this.selectedRows = [].concat(data.fails).concat(data.failsComplete)
      if(!data.success.length) return
      if(data.type == 'hc'){
        this.hc(data.success)
      }
      if(data.type == 'sc'){
        this.sc(data.success)
      }
      if(data.type == 'zf'){
        this.zf(data.success)
      }
    },
    zf(success=[]) {
      this.disableBtn = true
      API_INVOICES_INVALID_BATCH({invoiceIds: success.length ? success : this.selectedRows}).then(res => {
        if (res.success) {
          if (res.data.status == 1) {
            this.$message.success('所选发票已作废，操作成功')
            this.searchParams = {}
            if(!success.length){
              this.selectedRows = []
            }
            this.$refs.slFormNew.resetSearchQuery()
            this.getList()
          } else if (res.data.status == 0) {
            this.$message.error('所选发票未查询到发票作废，作废失败')
          } else {
            let failsNo = []
            let successNo = []
            res.data.fails.map(item => {
              failsNo.push(this.filterSelect[item])
            })
            res.data.success.map(item => {
              successNo.push(this.filterSelect[item])
            })
            this.$refs.errorTipModal.init({
              failsNo,
              successNo,
              success: res.data.success,
              fails: res.data.fails,
              type:'zf'
            })
          }
        }
      }).finally(()=>{
        this.disableBtn = false
      })
    },
    scConfirm(){
      this.$refs.confirmDelete.init()
    },
    sc(success=[]) {
      this.disableBtn = true
      API_INVOICES_DELETE_BATCH({ids:  success.length ? success : this.selectedRows}).then(res => {
        if (res.success) {
          if (res.data.status == 1) {
            this.$message.success('所选发票已删除，操作成功')
            this.searchParams = {}
            if(!success.length){
              this.selectedRows = []
            }
            this.$refs.slFormNew.resetSearchQuery()
            this.getList()
          } else if (res.data.status == 0) {
            if(res.data.fails.length && !res.data.failsComplete.length){
              this.$message.error('查询到勾选发票的合同关联了付款，无法删除')
            }else if(res.data.failsComplete.length && !res.data.fails.length){
              this.$message.error('查询到勾选发票的合同业务线已完结，无法删除')
            }else{
              let failsNo = ''
              let failsCompleteNo	 = ''
              res.data.fails.map(item => {
                failsNo+=`【${this.filterSelect[item]}】`
              })
              res.data.failsComplete.map(item => {
                failsCompleteNo+=`【${this.filterSelect[item]}】`
              })
              this.$message.error(`【${failsNo}】查询到合同关联了付款，【${failsCompleteNo}】查询到合同业务线已完结，无法删除`)
            }
          } else {
            let failsNo = []
            let successNo = []
            let failsCompleteNo	 = []
            res.data.fails.map(item => {
              failsNo.push(this.filterSelect[item])
            })
            res.data.success.map(item => {
              successNo.push(this.filterSelect[item])
            })
            res.data.failsComplete.map(item => {
              failsCompleteNo.push(this.filterSelect[item])
            })
            this.$refs.errorTipModal.init({
              failsNo,
              successNo,
              failsCompleteNo,
              success: res.data.success,
              fails: res.data.fails,
              failsComplete: res.data.failsComplete,
              type:'sc'
            })
          }
        }
      }).finally(()=>{
        this.disableBtn = false
      })
    }
  },
  components: {
    iPagination,
    DelModal,
    ErrorTipsModal,
    ConfirmDelete
  },
};
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style scoped lang="less">
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

.pagination-checkbox {
  position: absolute;
  z-index: 999;
  background-color: #fff;

  svg {
    width: 18px;
    position: relative;
    top: 4px;
  }

  span {
    margin: 0 12px;
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
  .pagination-checkbox {
    margin-top: 20px;
    position: fixed;
    z-index: 999;
    background-color: #fff;
    bottom: 10px;

    img {
      width: 16px;
    }

    span {
      margin: 0 12px;
    }
  }
}
/deep/ .new-table th:nth-child(1){
  padding-right: 0!important
}
/deep/ .new-table td:nth-child(1){
  padding-right: 0!important
 }
/deep/ .new-table .ant-table-tbody > tr.ant-table-row-selected td,  /deep/ .new-table-file .ant-table-tbody > tr.ant-table-row-selected td{
  background: none;
}
.fixedCheckbox{
  position: relative;
  margin-top: 20px;
}
</style>
