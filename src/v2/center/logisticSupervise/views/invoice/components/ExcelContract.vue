<template>
  <a-card class="link-contract" :bordered="false">
    <div class="title">
      {{invoiceTitle}}
    </div>
    <div class="attachment attachment2" style="margin-top:30px">
      <div class="top">
        发票与合同关联信息
        <a-button type="primary" style="float:right;" ghost @click="exportFile" >导出失败发票</a-button>
      </div>
      <div class="top2">
        <div class="total">
          <p><span style="color:#8495AA">验证成功发票数</span> <span class="num">{{successList.length}}</span></p>
          <p style="margin-left:85px;"><span style="color:#8495AA">验证失败发票数</span> <span class="num">{{list.length - successList.length}}</span></p>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-box">
      <a-table
        :columns="columns"
        class="new-table"
        :bordered='false'
        :rowKey="(record, index) => `${record.orderNo}-${record.contractNo}-${record.myInvoiceDO && record.myInvoiceDO.no}-${record.index}`"
        :dataSource="list"
        :pagination="false"
        :loading="loading"
        :scroll="{  x: true }">
         <span slot="splitAmount">
          发票拆分金额(元)
          <a-tooltip>
            <template slot="title">
              含税
            </template>
             <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size:12px"></i>
          </a-tooltip>
        </span>
        <span slot="发票金额">
          发票金额(元)
          <a-tooltip>
            <template slot="title">
              不含税
            </template>
            <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size:12px"></i>
          </a-tooltip>
        </span>
        <div slot="scanReason" slot-scope="text, record" >
          <p class="check-success" v-if="record.scanStatus === 0"> <i style="color:#45B48C;fontSize:12px" class="icon-yanzhengjieguo-chenggong iconfont"></i> {{record.scanReason || '验证成功'}}</p>
          <p class="check-fail" v-else> <i style="color:#E04A4A;fontSize:12px"  class="icon-yanzhengjieguo-shibai iconfont"></i> {{record.scanReason}}</p>

        </div>
        <div slot="action" slot-scope="text, record, index" >
          <div class="btn-box">
            <a  href="javascript:;" class="btn" @click="edit(record, index)" >编辑</a>
            <a  href="javascript:;" style="margin-left:26px"  class="btn" @click="del(record, index)" >删除</a>
          </div>
        </div>
      </a-table>
    </div>
    <!-- <i-pagination :pagination="pagination" size="small" @change="getList" /> -->
    <!-- 保存 -->
    <div class="save-box">
       <div class="btn " style="margin-right: 20px;" @click="goBack"> 上一步</div>
       <div class="btn btn1" @click="save"> 保存</div>
    </div>
    <DelModal ref="delModal" @confirm='confirmDel'></DelModal>
    <ErrorModal ref="errorModal" @confirm='confirmDel' ></ErrorModal>
    <a-modal v-model="editVisible" title="编辑发票信息" wrapClassName='edit-invoice-box'>
      <div slot="closeIcon"><i  class="icon-danchuang-closeicon iconfont" style="fontSize:25px"></i></div>
      <div>
        <p class="tip-box">
          <span class="tip1" v-if="currentItem.scanStatus === 0"> <i class="icon-fapiaoxiaoyan-chenggong iconfont"></i>  恭喜，验证成功！</span>
          <span class="tip2" v-else> <i class="icon-fapiaoshibie-shibai iconfont"></i> {{currentItem.scanReason}}</span>
        </p>
      </div>
      <a-form :form="form" class="form" layout="inline">
        <a-form-item label="发票代码">
          <a-input
            placeholder="请输入发票代码"
            :disabled='currentItem.scanStatus === 0'
            v-decorator="[`code`, {rules: [ { required:true,message: `请输入发票代码`, type: 'string',},],}, ]"
          />
        </a-form-item>
        <a-form-item label="发票号码">
          <a-input
            :disabled='currentItem.scanStatus === 0'
            placeholder="请输入发票号码"
            v-decorator="[`no`, {rules: [ { required:true,message: `请输入发票号码`, type: 'string',},],}, ]"
          />
        </a-form-item>
        <a-form-item label="开票日期"  style="margin:0">
          <a-date-picker
            placeholder="请选择开票日期"
            :disabled='currentItem.scanStatus === 0'
            v-decorator="[
              'issuedDate',
              {
                validateTrigger:'change',
                rules: [
                  { required: true, message: '请选择开票日期' },
                ]
              },
            ]"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="发票金额(元)不含税" style="margin-top:30px">
          <a-input-number
            :disabled='currentItem.scanStatus === 0'
            placeholder="请输入发票金额不含税"
            :precision="2"
            v-decorator="[`taxExcludedAmount`, {rules: [ { required:true,message: `请输入发票金额不含税`},],}, ]"
          />
        </a-form-item>
        <a-form-item label="价税合计(元)" style="margin-top:30px">
          <a-input-number
            placeholder="请输入价税合计"
            :precision="2"
            :disabled='currentItem.scanStatus === 0'
            v-decorator="[`totalAmount`, {rules: [ { required:true,message: `请输入价税合计`},],}, ]"
          />
        </a-form-item>
        <a-form-item label="发票拆分金额(元)含税" style="margin-top:30px;margin-right:0">
          <a-input-number
            placeholder="请输入发票拆分金额(元)含税"
            style="background:#fff"
            :precision="2"
            v-decorator="[`splitAmount`, {rules: [ { required:true,message: `请输入发票拆分金额(元)含税`},],}, ]"
          />
        </a-form-item>
        <a-form-item label="合同编号" style="margin-top:30px;margin-right:0">
          <a-input
            placeholder="请输入合同编号"
            style="background:#fff"
            v-decorator="[`contractNo`, {rules: [ { required:true,message: `请输入合同编号`},],}, ]"
          />
        </a-form-item>
      </a-form>
    <template slot="footer">
      <a-button key="back" @click="editVisible=false"> 取消 </a-button>
      <a-button key="submit"  style="margin-left:20px;" @click="saveEdit" type="primary"> 确定</a-button>
    </template>
  </a-modal>

  </a-card>
</template>

<script>

import { invoiceTypeInfo } from './columns/constant.js'
import { excelColumns } from './columns/columns.js'
import iPagination from "@sub/components/iPagination";
import DelModal from './delModal.vue'
import ErrorModal from './errorModal.vue'
import comDownload from "@sub/utils/comDownload.js";
import { saveExcelEdit, saveAdd, getRelInvoiceList,exportInvoiceFailXls } from '@/v2/center/steels/api/invoice.js'
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      list: [ ],
      successList: [],
      pagination: {
        total: 10, // 总条数
        pageNo: 1,
      },
      editVisible: false,
      form: this.$form.createForm(this),
      currentItem: {},
      currentIndex: '',
      disabled: false,

    }
  },
  computed: {
    invoiceTitle() {
      return invoiceTypeInfo[this.$route.query.invoiceType]
    },
    columns() {
       return excelColumns
    },
  },
  watch: {
    list: {
      handler(arr) {
        this.successList = arr.filter(el => el.scanStatus === 0 && !el.scanReason) || []
      },
      deep: true,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const params = {
        taskId: this.$route.query.taskId
      }
      const res = await getRelInvoiceList(params)
      const list = res.data  || []
      list.forEach((el, index) => {
        if(el.myInvoiceDO && el.myInvoiceDO.scanTime) {
          el.myInvoiceDO.scanTime =  moment(el.myInvoiceDO.scanTime).format('yyyy-MM-DD HH:mm:ss')
        }
        el.index = index
      })


      this.list = list || []
      // this.successList = list.filter(el => el.scanStatus === 0 && !el.scanReason) || []
    },
    edit(item, index) {
      this.editVisible = true
      this.currentItem = item
      this.currentIndex = index
      this.$nextTick(() => {
        this.form.setFieldsValue({
          code: item.myInvoiceDO.code,
          no: item.myInvoiceDO.no,
          totalAmount: item.myInvoiceDO.totalAmount,
          taxExcludedAmount: item.myInvoiceDO.taxExcludedAmount,
          issuedDate: item.myInvoiceDO.issuedDate,
          splitAmount: item.splitAmount,
          contractNo: item.contractNo,
        })
      })

    },
    del(item, index) {
      this.currentItem = item
      this.currentIndex = index
      this.$refs.delModal.open()
    },
    // 确认删除
    confirmDel() {
      this.list.forEach((el, i, arr) => {
        if(i == this.currentIndex) {
          arr.splice(i, 1)
        }
      });
      this.$refs.delModal.close()
    },
    goBack() {
      this.$router.go(-1)
    },
    // 保存编辑
    saveEdit() {
      this.form.validateFieldsAndScroll(async(err,values) => {
        if(!err) {
          const params = {
            id: this.currentItem.id,
            taskId: this.$route.query.taskId,
            type: this.$route.query.invoiceType,
            industryType: this.$route.query.industryType,
            index: this.currentIndex,
            buyerName: this.currentItem.buyerName || '',
            sellerName: this.currentItem.sellerName || '',
            ...values,
          }
  
          if(this.$route.query.invoiceType == 'INPUT') {
            params.productCode = 'WAREHOUSE_RENT'
          }
          if(this.$route.query.invoiceType == 'DELIVER') {
            params.productCode = 'LOGIC_DELIVER'
          }
          const res = await saveExcelEdit(params)
          this.list[this.currentIndex] = res.data
          this.successList = this.list.filter(el => el.scanStatus === 0 && !el.scanReason)
          this.$forceUpdate()
          this.$message.success('保存成功')
          this.editVisible = false
        }
      })

    },
    // 跳转列表页面
    skip() {
      const str = {
        INPUT: 'buyInvoiceList',
        OUTPUT: 'sellInvoiceList',
        DELIVER: 'freightInvoiceList',
      }
      const coalStr = {
        INPUT: 'buy',
        OUTPUT: 'sell',
        DELIVER: 'freight',
      }
      // 判断是钢材新增还是发票新增
      const path = this.$route.query.industryType == 'STEEL' ? `/center/steels/invoice/${str[this.$route.query.invoiceType]}` : `/center/logisticSupervise/invoice/${coalStr[this.$route.query.invoiceType]}`
      this.$router.push(path);
    },
    async save() {
      if(!this.successList.length) {
        this.$message.error("没有成功的发票")
        return
      }
      let flag = this.successList.some(el => !el.contractNo)
      if(flag) {
          this.$message.error("没有成功的发票")
        return
      }
      let item = this.successList.find(el => !el.splitAmount)
      if(item) {
        this.$message.error(`合同编号：${item.contractNo}发票拆分金额必须大于0,请核实`)
        return
      }
      const params = {
        splitList: this.successList,
        existList: [],
        taskId: this.$route.query.taskId,
      }
      if(this.$route.query.invoiceType == 'INPUT') {
        params.productCode = 'WAREHOUSE_RENT'
      }
      if(this.$route.query.invoiceType == 'DELIVER') {
        params.productCode = 'LOGIC_DELIVER'
      }
      this.loading = true
      try {
        await saveAdd(params)
        this.loading = false
        if (this.$route.query.orderNo) {
          if (this.$route.query.manuaId) {
            this.$router.push({
              path: '/center/assets/'+this.$route.query.ref,
              query: {
                id:this.$route.query.manuaId,
                activeIndex:6
              }
            })
            return
          }
          this.$route.query.contractType = this.$route.query.contractType=="UP"? 0:1;
          this.$router.push({
            path: '/center/monitoring/dynamicMonitoring/detail',
            query: {
              upOrderNo: this.$route.query.upOrderNo,
              downOrderNo:this.$route.query.downOrderNo,
              businessLineType:this.$route.query.businessLineType,
              contractType:this.$route.query.contractType,
              contractContentActiveIndex:this.$route.query.contractContentActiveIndex,
              cashTabIndex:this.$route.query.cashTabIndex,
               businessLineNo: this.$route.query.businessLineNo
            }
          })
          return
        }
        // 新增应收账款 菜单过来的
        if(this.$route.query.source == 'receivable') {
          this.$router.push({
              path: `/center/assets/receivable/manual/edit`,
              query: {
                id:this.$route.query.manuaId,
                activeIndex:6,
                contractId: this.$route.query.contractId,
                contractType: this.$route.query.contractType,
              }
            })
          return
        }
        this.skip()
      } catch (error) {
        this.loading = false
      }

    },
     // 导出
    async exportFile() {

      if(this.disabled) return
      this.disabled = true
      const params = {
        taskId: this.$route.query.taskId,
      }
      try {
        const res = await  exportInvoiceFailXls(params)
        comDownload(res, undefined, `${this.invoiceTitle}.xls`)
        this.disabled = false
      } catch (error) {
        this.disabled = false
      }

    }
  },
  components: {
    iPagination,
    DelModal,
    ErrorModal,
  }
}
</script>
<style lang="less">
.edit-invoice-box {
   .ant-modal {
    width: 980px !important;

  }
  .ant-modal-header {
    border-bottom: 0;
    height: 58px;
    padding: 0;
    background: #F5F7FA;
    .ant-modal-title {
      font-weight: 600;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      line-height: 58px;
      color: rgba(0,0,0,0.8);
      padding-left: 30px;
    }
  }
  .tip-box {
    margin-top: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #EB5353;
    .tip2 {
       vertical-align: middle;
    }
    .tip1 {
      color: #53C199;
      vertical-align: middle;
    }
  }
  .ant-modal-close-x {
    width: 24px;
    height: 24px;
    background: rgba(132, 149, 170, 0.10);
    line-height: 24px;
    margin-right: 32px;
    margin-top: 17px;
  }
  .ant-modal-close {
    top: 0px;

  }
  .ant-modal-body {
    padding: 0 30px;
  }
  .ant-modal-footer {
    padding-top: 28px;
    padding-bottom: 28px;
    border-top: 1px solid #EFF0F3;
    text-align: center;
  }
  .footer-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .footer-btn1 {
      color: @primary-color;
      border: 1px solid @primary-color;
      background: #fff;
      width: 90px;
      height: 34px;
      border-radius: 6px;
      font-size: 14px;
    }
    .footer-btn{
      width: 90px;
      height: 34px;
      background: @primary-color;
      border-radius: 6px;
    }
  }
  .form {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8495AA;
    line-height: 20px;
    margin-top: 20px;
    margin-bottom: 30px;
    .ant-form-item {
      margin-right: 40px;
    }
    .ant-form-item-label {
      color: #8495AA;
      display: block;
      text-align:left;
      line-height: inherit;
      margin-bottom: 10px;
    }
    label {
       color: #8495AA;
       font-size: 14px;

    }
    .ant-input-number-input {
      height: 40px;
    }

    .ant-input, .ant-input-number {
      width: 280px;
      height: 40px;
      background: #fff;
      border-radius: 6px;

    }
    .ant-input-disabled, .ant-input-number-disabled {
      background: #F0F3FB;
    }
  }

}
</style>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style scoped lang='less'>
.link-contract {
  .title {
    padding-bottom: 15px;
    font-size: 20px;
    color: rgba(0,0,0,0.8);
    font-weight: 600;
    border-bottom: 1px solid #E9EFFC;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Medium, PingFang SC,PingFangSC-Regular, PingFang SC;
  }
  .attachment {
    margin-top: 30px;
    .top {
      height: 32px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.8);
      position: relative;
      margin-bottom: 20px;
      padding-left: 12px;
      &:before{
        content: '';
        top: 7px;
        position: absolute;
        display: block;
        width: 4px;
        height: 18px;
        left: 0;
        background: @primary-color;
      }
    }
    .top2 {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .btn-link {
      float: right;
      width: 126px;
      height: 38px;
      border-radius: 4px;
      border: 1px solid @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @primary-color;
      font-size: 14px;
      // margin-right: 20px;
      cursor: pointer;
      .icon {
        margin-right: 10px;
        color: @primary-color;
      }
    }

  }
  .total {
    display: flex;
  }
  .check-fail, .check-success {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #E45454;
  }
  .check-success {
    color: #45B48C;
  }
  .num {
    margin-left:10px
  }
}
.save-box {
  display: flex;
  align-items: center;
  justify-content: center;
    margin-top: 58px;
  .btn {
    width: 114px;
    height: 38px;
    border-radius: 4px;
    border: 1px solid @primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
    color: @primary-color;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin-right: 10px;
    }
  }
  .btn1 {
    background: @primary-color;
    color: #fff;

  }
}
</style>
