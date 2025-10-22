<template>
  <TipModal
    :title="title"
    style="width: 600px"
    ref="contractFinish"
    class="contract-finish"
    okBtnText="合同完结"
		>
			<div class="tip-box" v-if="isLoading">
				<a-spin size="large" />
				<div style="margin-top:10px">正在校验完结规则，请稍后</div>
			</div>
			<!-- 报错信息 -->
			<template v-if="!contractFinishInfo.validPass">
				 <a-alert :message="message" type="error" show-icon />
					<a-table
						class="new-table"
						style="margin-top:20px"
						:bordered="false"
						:scroll="{ x: true }"
						:dataSource="validList"
						:columns="validColumns"
						:pagination="false"
						:rowKey="(r, i) => i"
					>
					<template
						slot="result"
						slot-scope="result, record"
					>
						<!-- 合同校验 -->
						<template v-if="record.validType == 'CONTRACT'">
							<!-- 电子合同 -->
								<div v-if="record.errorType == 'CONTRACT_SELL_NOT_DOUBLE_SIGN'">合同<a href="javascript:;" @click="goDetail(record)">{{record.params.no}}</a>卖方未签署，请双签</div>
								<div v-if="record.errorType == 'CONTRACT_BUY_NOT_DOUBLE_SIGN'">合同<a href="javascript:;" @click="goDetail(record)">{{record.params.no}}</a>买方未签署，请双签</div>
							<!-- 线下合同 -->
								<div v-if="record.errorType == 'CONTRACT_NOT_EXEC_TING'">存在审批中的合同<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a>，合同状态需为执行中</div>
						</template>
						<!-- 补协校验 -->
						<template v-if="record.validType == 'SUPPLEMENT'">
							<!-- 电子 -->
								<div v-if="record.errorType == 'ONLINE_SUPPLEMENT_SELL_NOT_DOUBLE_SIGN'">补充协议<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> 卖方未签署，请双签</div>
								<div v-if="record.errorType == 'ONLINE_SUPPLEMENT_BUY_NOT_DOUBLE_SIGN'">补充协议<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> 买方未签署，请双签</div>
								<div v-if="record.errorType == 'ONLINE_SUPPLEMENT_DRAFT'">补充协议<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> 未提交</div>
								<div v-if="record.errorType == 'ONLINE_SUPPLEMENT_AUDITING'">补充协议<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> 正在审批中</div>



							<!-- 线下 -->
								<div v-if="record.errorType == 'OFFLINE_SUPPLEMENT_NOT_AUDIT_ING'">存在审批中的补充协议<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a></div>

						</template>
						<!-- 发货校验 -->
						<template  v-if="record.validType == 'DELIVER'">
							<!-- 未完结 -->
							<div v-if="record.errorType == 'DELIVER_NOT_FINISH'">存在未完结的发货批次<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> ，请完结发货批次</div>
							<!-- 未开具货转 -->
							<div v-if="record.errorType == 'DELIVER_NOT_GOODSTRANSFER'">存在未开具货转的发货批次<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a></div>
						</template>
						<!-- 提货单校验 -->
						<template  v-if="record.validType == 'LADING'">
							<div>存在进行中的提货单<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> ，提货单状态需为终态</div>
						</template>
						<!-- 收货证明校验 -->
						<template  v-if="record.validType == 'RECEIPT'">
							<div>存在进行中的收货证明<a v-if="contractFinishInfo.orderType =='BUY'"  href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> ，收货状态需为终态</div>
						</template>
							<!-- 货转校验 -->
						<template  v-if="record.validType == 'GOODSTRANSFER'">

							<div>存在正在进行的货转 <a v-if="contractFinishInfo.orderType =='SELL'" href="javascript:;"  @click="goDetail(record)">{{record.params.goodsTransferNo}}</a> ，货转状态需为终态</div>

						</template>
						<!-- 付款校验 -->
						<template  v-if="record.validType == 'PAYMENT'">
							<div v-if="record.errorType == 'PAYMENT_NOT_FINISH'">存在正在进行的付款  <a v-if="contractFinishInfo.orderType =='BUY' || (record.params.status == 'WAIT_REPAY_CONFIRM' && contractFinishInfo.orderType =='SELL')" href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> ，付款状态需为终态</div>


							<div v-if="record.errorType == 'PAYMENT_NOT_EXIT_APYED'">不存在已付款记录，请检查</div>

						</template>
						<!-- 结算单校验 -->
						<template  v-if="record.validType == 'STATEMENT'">
							<div>存在正在进行的结算单<a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> ，结算单状态需为终态</div>
						</template>
						<!-- 发票校验 -->
						<template  v-if="record.validType == 'INVOICE'">
							<div><a href="javascript:;"  @click="goDetail(record)">{{record.params.no}}</a> 不存在附件，请检查</div>
						</template>
						<!-- 融资校验 -->
						<template  v-if="record.validType == 'ASSET'">
							<div>还款金额{{record.params.repayAmount}}元、融资金额{{record.params.financeAmount}}元不一致</div>
						</template>
						<!-- 金额校验 -->
						<template  v-if="record.validType == 'AMOUNT'">
              <div v-if="record.errorType =='AMOUNT_ALL_EQUALS_ZERO'">发票金额、结算单金额、{{payAmountDes}}缺失</div>
							<div v-if="record.errorType =='AMOUNT_NOT_CONSISTENT'">
                发票金额{{record.params.invoiceAmount}}元、结算单金额{{record.params.statementAmount}}元、{{payAmountDes}}{{record.params.payAmount}}元三者不一致
              </div>
						</template>

            <!--  -->

					</template>
				</a-table>
			</template>

	</TipModal>
</template>

<script>
import TipModal from '@sub/components/TipModal.vue';
const validColumns = [
	{ title: '校验项', dataIndex: 'validTypeDesc', width: 140 },
	{ title: '校验结果', dataIndex: 'result', scopedSlots: { customRender: 'result' } },
]

export default {
  props: {
    isLoading:{
      default: false,
    },
    info: {
      default: () => {
        return {
          validList: [],
          validPass: true,
        }
      }
    },
    title: {
      default: '业务线完结申请'
    },
    message: {
      default: '赋能业务合同存在以下问题，请处理后重新发起申请'
    }
  },
  data() {
    return {
      // 合同完结信息处理
			validColumns,
			contractFinishInfo: {},
			validList: [
				
			],
    }
  },
  watch: {
    info: {
      handler(newInfo) {
        let validTypeInfo = {
          CONTRACT: '合同校验',
          SUPPLEMENT: '补协校验',
          DELIVER: '发货校验',
          LADING: '提货单校验',
          RECEIPT: '收货证明校验',
          GOODSTRANSFER: '货转校验',
          PAYMENT: '付款校验',
          COLLECTION: '回款校验',
          STATEMENT: '结算单校验',
          INVOICE: '发票校验',
          ASSET: '融资校验',
          AMOUNT: '金额校验',
        }
        let list = newInfo.validList || []
        list.forEach(el => {

          el.validTypeDesc = validTypeInfo[el.validType]
          el.handleDesc = newInfo.orderType == 'BUY' ? '买方' : '卖方'

        })
        this.validList = list
        this.contractFinishInfo = newInfo
      }
    },
    deep: true,
  },
  computed: {
    payAmountDes() {
      if(this.contractFinishInfo.orderType == 'SELL' && this.contractFinishInfo.contractType == 'OFFLINE') {
        return '贸易回款金额'
      }
      return '已付款金额'
    }
  },
  methods: {
    open() {

      this.$refs.contractFinish.open()
    },
    close() {
      this.$refs.contractFinish.close()
    },
    // 去往详情页面
    goDetail(item) {
      // 判断合同页面
      let path = ''
      let query = {}
      // 合同校验
      if(item.validType == 'CONTRACT') {
        // 采购合同
        if(this.contractFinishInfo.orderType == 'BUY') {
          // 卖方未签署
          if(item.errorType == 'CONTRACT_SELL_NOT_DOUBLE_SIGN') {
            path = '/sys/contract/online/detail'
            query = { 
              id: item.params.id,
              type: this.contractFinishInfo.orderType,
              initiatorUscc: item.params.initiatorUscc,

            }
          }
          // 买方未签署
          if(item.errorType == 'CONTRACT_BUY_NOT_DOUBLE_SIGN') {
            path = '/sys/contract/online/detail'
            query = { 
              id: item.params.id,
              type: this.contractFinishInfo.orderType,
              serialNo: item.params.serialNo,
              initiatorUscc: item.params.initiatorUscc,
            }
          }
          // 线下
          if(item.errorType == 'CONTRACT_NOT_EXEC_TING') {
            path = '/sys/contract/offline/detail'
            query = { 
              id: item.params.id,
              type: 'buy',
              initiatorUscc: item.params.initiatorUscc,
            }
          }
        }
        // 销售
        if(this.contractFinishInfo.orderType == 'SELL') {
          // 卖方未签署
          if(item.errorType == 'CONTRACT_SELL_NOT_DOUBLE_SIGN') {
              path = '/sys/contract/online/detail'
              query = { 
                id: item.params.id,
                type: this.contractFinishInfo.orderType,
                serialNo: item.params.serialNo,
                initiatorUscc: item.params.initiatorUscc,
              }
          }
          // 买方未签署
          if(item.errorType == 'CONTRACT_BUY_NOT_DOUBLE_SIGN') {
            path = '/sys/contract/online/detail'
            query = { 
              id: item.params.id,
              type: this.contractFinishInfo.orderType,
              initiatorUscc: item.params.initiatorUscc,
            }
          }
           // 线下
          if(item.errorType == 'CONTRACT_NOT_EXEC_TING') {
            path = '/sys/contract/offline/detail'
            query = { 
              id: item.params.id,
              type: 'sell',
              initiatorUscc: item.params.initiatorUscc,
            }
          }
        }
      }
      // 补协校验
      if(item.validType == 'SUPPLEMENT') {
        
          // 采购合同
        if(this.contractFinishInfo.orderType == 'BUY') {
          // 卖方未签署
          if( ['ONLINE_SUPPLEMENT_SELL_NOT_DOUBLE_SIGN', 'ONLINE_SUPPLEMENT_AUDITING', 'ONLINE_SUPPLEMENT_DRAFT'].includes(item.errorType)) {
            path = '/sys/suppleAgreement/detail'
            query = { 
              id: item.params.id,
              contractType: 'buy',
              suppleType: 'on',
              isInitiator: item.params.isInitiator,
            }
          }
          // 买方未签署
          if(item.errorType == 'ONLINE_SUPPLEMENT_BUY_NOT_DOUBLE_SIGN') {
            path = '/sys/suppleAgreement/detail'
            query = { 
              id: item.params.id,
              contractType: 'buy',
              suppleType: 'on',
              isInitiator: item.params.isInitiator,
            }
          }
        }
        // 销售
        if(this.contractFinishInfo.orderType == 'SELL') {
             // 卖方未签署
          if(item.errorType == 'ONLINE_SUPPLEMENT_SELL_NOT_DOUBLE_SIGN') {
            path = '/sys/suppleAgreement/detail'
            query = { 
              id: item.params.id,
              contractType: 'sell',
              suppleType: 'on',
              isInitiator: item.params.isInitiator,
            }
          }
          // 买方未签署
          if( ['ONLINE_SUPPLEMENT_BUY_NOT_DOUBLE_SIGN', 'ONLINE_SUPPLEMENT_AUDITING', 'ONLINE_SUPPLEMENT_DRAFT'].includes(item.errorType)) {
            path = '/sys/suppleAgreement/detail'
            query = { 
              id: item.params.id,
              contractType: 'sell',
              suppleType: 'on',
              isInitiator: item.params.isInitiator,
            }
          }
        }
        // 线下补协
        if(item.errorType == 'OFFLINE_SUPPLEMENT_NOT_AUDIT_ING') {
          path = '/sys/suppleAgreement/detailOffline'
          query = { 
            id: item.params.id,
            suppleType: 'off',
            isInitiator: item.params.isInitiator,
          }
        }

      }
      // 发货校验
      if(item.validType == 'DELIVER') {
        if(this.contractFinishInfo.orderType == 'SELL') {
          path = '/biz/deliver/deliverDetail'
          query = { 
            deliverId: item.params.deliverId,
            receiveId:item.params.receiveId,
          }
        } else {
           path = '/biz/deliver/deliverDetail'
            query = { 
              deliverId: item.params.deliverId,
              receiveId:item.params.receiveId,
            }
        }

      }
      // 提货单校验
      if(item.validType == 'LADING') {
        path = '/lading/ladingbill/detail'
        query = { 
          id: item.params.id,
        }
      }
       // 收货证明校验
      if(item.validType == 'RECEIPT') {
        path = '/lading/receiptProve/detail'
        query = { 
          id: item.params.id,
        }
      }
         // 货转校验
      if(item.validType == 'GOODSTRANSFER') {
        path = '/biz/goodsTransfer/detail'
        query = { 
          goodsTransferNo: item.params.goodsTransferNo,
        }
      }
      // 付款校验
      if(item.validType == 'PAYMENT') {

        path = '/sys/payment/detail'

        if(item.params.status == 'WAIT_REPAY_CONFIRM' && this.contractFinishInfo.orderType =='SELL') {
           path = '/sys/payment/detail'
        }

        query = { 
          id: item.params.id,
        }
      }
       // 结算单校验
      if(item.validType == 'STATEMENT') {
        // 判断是否是线上
        if(this.contractFinishInfo.contractType == 'ONLINE') {

          if(this.contractFinishInfo.orderType == 'BUY') {
            path = '/sys/statement/electronic/detail'
            query = { 
              id: item.params.id,
            }
          }
          if(this.contractFinishInfo.orderType == 'SELL') {
            path = '/sys/statement/electronic/detail'
            query = { 
              id: item.params.id,
            }
          }

        } else {
          if(this.contractFinishInfo.orderType == 'BUY') {
            path = '/sys/statement/offline/detail'
            query = { 
              id: item.params.id,
            }
          }

          if(this.contractFinishInfo.orderType == 'SELL') {
            path = '/sys/statement/offline/detail'
            query = { 
              id: item.params.id,
            }
          }

        }
      }

      if(item.validType == 'INVOICE') {
        // 判断当前是贸易发票还是运费发票
        if(item.params.invoiceType == 'TRADE_INVOICE') {
          if(this.contractFinishInfo.orderType == 'BUY') {
            path = '/biz/invoice/detail'
            query = { 
              id: item.params.id,
              industryType: 'COAL',
               invoiceType: 1,
            }
          } else {
            path = '/biz/invoice/detail'
            query = { 
              id: item.params.id,
              invoiceType: 1,
              industryType: 'COAL',
            }
          }
        } else {
          path = '/biz/invoice/detail'
          query = { 
            id: item.params.id,
            industryType: 'COAL',
            invoiceType: 2,
          }
        }
      }





      let routerData = this.$router.resolve({
				path,
				query,
			});
			window.open(routerData.href, '_blank');

    },


  },
  components: {
    TipModal,
  }
}
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped  lang='less' >
.contract-finish {
	/deep/ .ant-modal {
		width: 800px !important;
		// min-height: 300px;
	}
	
}
.tip-box {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: rgba(0, 0, 0, 0.6);
	min-height: 250px;
}
</style>
