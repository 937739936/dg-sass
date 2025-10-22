<template>
  <div style="width: 100%;">
    <div  v-if="type == 'buy' &&  info.paymentInfo">
      <ul style="display:block;color:red;font-size: 16px;width:100%;margin-bottom:15px;overflow:hidden;">
        <li v-for="(item,index) in info.paymentInfo.paymentTypeList" :key="index" style="float:left;margin-right:30px;">
          {{item.capitalSource}}:&nbsp;{{item.payAmount.toLocaleString()}}
        </li>
      </ul>
      <a-table
        rowKey="id"
        class="new-table"
        :columns="payColumns" 
        :pagination="false"
        :dataSource="info.paymentInfo.paymentList" 
        :locale="{emptyText: '暂无数据'}" 
        :scroll="{x:true}" style="width: 100%;"
      >
        <template slot="operation" slot-scope="text, record">
            <a @click="goPayDetail(record)" class="edit-btn">查看</a>
        </template>
      </a-table>
    </div>
    <div v-if="type == 'sell' && info.receivable" >
      <a-table 
        rowKey="id" 
         class="new-table"
        :columns="receivableColumns" 
        :pagination="false"
        :dataSource="info.receivable.receivableList" 
        :locale="{emptyText: '暂无数据'}" 
        :scroll="{x:true}" 
        style="width: 100%;"
      >
        <div slot="action" slot-scope="record">
          <a @click="goToDetail('no', record)">查看</a>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      default: () => {}
    },
    type: {
      default: 'buy'
    },
    systemType: {
      default: 'rest'
    }
  },

  data() {
    return {
      payColumns: [
        { title: '资金流水号',dataIndex: 'serialNo',key: 'serialNo'},
        { title: '实际付款日期', dataIndex: 'paymentDate',key: 'paymentDate'},
        { title: '付款类型',  dataIndex: 'typeDesc', key: 'typeDesc'},
        { title: '是否有票',  dataIndex: 'hasInvoiceDesc',  key: 'hasInvoiceDesc' },
        { title: '资金来源', dataIndex: 'capitalSource', key: 'capitalSource', },
        { title: '付款金额(元)', dataIndex: 'payAmount', key: 'payAmount' },
        { title: '付款状态', dataIndex: 'statusDesc',  key: 'statusDesc', },
        { title: '操作', scopedSlots: { customRender: 'operation' }, dataIndex: 'operation',  width: 80, fixed: 'right' },
      ],
      receivableColumns: [
        { title: '资金流水号', dataIndex: 'serialNo' },
        { title: '回款时间', dataIndex: 'payDate' },
        { title: '认领状态', dataIndex: 'claimStatus' },
        { title: '回款金额(元)', dataIndex: 'payAmount',  customRender: (text, record) => (text ? text.toFixed(2) : '') },
        { title: '已认领金额', dataIndex: 'claimedAmount', customRender: (text, record) => (text ? text.toFixed(2) : '') },
        { title: '可认领金额', dataIndex: 'canClaimAmount', customRender: (text, record) => (text ? text.toFixed(2) : '') },
        { title: '回款方式', dataIndex: 'receiveCategory', align: 'center' },
        { title: '操作', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } },
      ]
    }
  },
  methods: {
    // 去往付款详情
    goPayDetail(record) {
        // 查看认领回款明细
      let temp = {
          path: '/center/steels/funds/payment/paymentApplyTwoStep',
          query: {
            id: record.id,
            type: 'view',
            contractTemplate: this.info.contractTemplate,
            contractNo: this.info.contractNo ,
            contractId: this.info.contractId || this.info.id,
            companyName: this.type == 'buy' ? this.info.sellCompanyName :this.info.buyCompanyName,
            companyId: this.type == 'buy' ? this.info.sellCompanyId :this.info.buyCompanyId,
            companyUscc: this.type == 'buy' ? this.info.sellCompanyUscc : this.info.buyCompanyUscc,
            generateWay: this.info.generateWay,
            steelType: this.info.steelType,
            contractType: this.info.contractType,
            businessType: this.info.businessType,
          }
      };
      if(this.systemType == 'rest') {
        this.$router.push(temp);
      } else {
        this.$emit('goPayDetail', record)
      }
      
    },
    goToDetail(flag, data) {
      // 查看认领回款明细
      let temp = {
        path: '/center/steels/funds/collection/claimDetail',
        query: {
          type: 'detail',
          id: data.id,
          collectionType: data.collectionType
        }
      };
      if(this.systemType == 'rest') {
        this.$router.push(temp);
      } else {
        this.$emit('goToDetail', data)
      }
      
    },
  },
  components: {

  }
}
</script>

<style lang="less" scoped>

</style>