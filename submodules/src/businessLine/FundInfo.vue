<template>
  <div class="settle-info">
    <!-- 资金流水 -->
    <div class="table-box">
      <a-table
        :columns="fundColumns"
        class="new-table"
        :bordered="false"
        rowKey="no"
        :scroll='{x:400}'
        :dataSource="list"
        :pagination="false"
      >
        <template slot="status" slot-scope="text,items">
            <!-- 状态 -->
            <span class="status">{{items.statusName}}</span>
          
        </template>

        <template slot="action" slot-scope="text,items">
          <a-space :size="20">
            <a href="javascript:;" @click="goFundDetail(items)">详情</a>
          </a-space>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script>

// colums
import { formatMoney } from '@sub/filters'
 const fundColumns = [
  { title: "资金流水号", dataIndex: "serialNo", width: 250 },
  { title: "付款类型", dataIndex: "paymentTypeDesc", width: 150 },
  { title: "资金来源", dataIndex: "payTypeName" ,width: 100 },
  { title: "付款金额(元)", dataIndex: "payAmount", width: 150,
    customRender: (txt,r) => r.paymentType == 'REFUND' ? formatMoney(-txt) : formatMoney(txt) 
  },
  { title: "付款日期", dataIndex: "payDate", width: 150 },
  { title: "付款状态", dataIndex: "status",  scopedSlots: { customRender: "status" } ,width: 100 },
  { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" },width:80,fixed:'right' },

]

export default {
  props: {
    fundApi: {},
     // 金融机构
    isBank: {
      default: false,
    },
    type: {
      default: 'rest'
    },
    contractType: {
      default: '',
    }


  },
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    fundColumns() {
      // 金融机构欧 ■ 资金流水：展示字段中去掉“资金来源”字段
      if(this.isBank) {
        return [
            { title: "资金流水号", dataIndex: "serialNo", width: 150 },
            { title: "付款类型", dataIndex: "paymentTypeDesc", width: 150 },
            { title: "付款金额(元)", dataIndex: "payAmount", width: 150,  customRender: (txt,r) => r.paymentType == 'REFUND' ? formatMoney(-txt) : formatMoney(txt)  },
            { title: "付款日期", dataIndex: "payDate", width: 150 },
            { title: "付款状态", dataIndex: "status",  scopedSlots: { customRender: "status" } ,width: 100 },
            // { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" },width:80,fixed:'right' },
        ]
      }
      return fundColumns
    }

  },
  methods: {

    async getList() {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        ...this.$route.query
      }
      
      const res = await this.fundApi(params)
      this.list = res.data || []
    },
    goFundDetail(item) {
      let path
      if(this.type == 'rest') {
        path = '/center/fund/pay/record/detail'
        if(this.contractType == 'sell') {
          path = '/center/fund/collect/detail'
        }
        if(this.contractType == 'trans') {
          path ='/center/fund/pay/record/trans/detail'
        }
          // 退款
        if(item.paymentType == 'REFUND') {
          path = '/center/fund/refund/detail'
        }
        let routeData = this.$router.resolve({ 
          path,
          query: {
            id: item.id,
            orderId: item.orderId,
            type: 'overview',
            orderType: item.orderType,
            contractSource: item.contractSource || null,
          }
        })
        window.open(routeData.href, '_blank')
      } else {
        // 退款
        if(item.paymentType == 'REFUND') {
          path = `/sys/refund/detail?id=${item.id}`
          window.open(path, '_blank')
          return
        }
        if (item.existRiskContractAudit) {
          // 跳转到审核详情页面
          this.$router.push({
            path: '/assets/PaymentAuditFinal',
            query: {
              paymentNo:item.serialNo,
              isEdit:0,
              id: item.id,
              contractSource: item.contractSource,
            }
          })
        } else {
          let path = '/sys/payment/detail'
          if(item.contractSource == 'LOGISTICS_CONTRACT_MANUAL') {
            path = '/sys/payment/transDetail'
          }
          this.$router.push({
            path,
            query: {
              id: item.id,
              contractTemplateName: item.contractTemplateName
            }
          })
        }

      }
      
      

    
    }
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style scoped  lang='less' >
.settle-info {
  margin-top: 30px;
  .status {
    display: inline-block;
    border-radius: 4px;
    background: #C5ECDD;
    padding: 1px 6px;
    color: #3EB384;
    font-family: PingFang SC;
    font-size: 12px;
  }
}
</style>
