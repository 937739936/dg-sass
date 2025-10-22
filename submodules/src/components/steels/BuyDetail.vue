<template>
  <div class="new-detail" style="width:100%">
    <!-- 采购合同详情 -->
    <div class="new-detail-content detail-form">
      <h2>基本信息</h2>
      <a-row class="df">
        <a-form-item label="卖方">
          <div class="fake-ipt"> {{info.sellCompanyName}}</div>
        </a-form-item>
        <a-form-item label="买方">
          <div class="fake-ipt"> {{info.buyCompanyName}}</div>
        </a-form-item>
        <a-form-item label="钢材种类">
          <a-input class="ipt" disabled v-model="info.steelTypeDesc"> </a-input>
        </a-form-item>
        <a-form-item label="合同模板">
          <div class="fake-ipt"> {{info.contractTemplateDesc}}</div>
        </a-form-item>
        <a-form-item label="业务类型">
          <div class="fake-ipt"> {{info.businessTypeDesc}}</div>
        </a-form-item>
        <a-form-item label="合同期限">
          <div class="fake-ipt">{{info.effectiveStartDate}} -  {{info.effectiveEndDate}}</div>
        </a-form-item>
        <a-form-item label="运费支付方式" v-if="isScrapSteel">
          <div class="fake-ipt"> {{info.freightPaymentModeDesc}}</div>
        </a-form-item>
        <a-form-item label="运费结算方式"  v-if="['RECEIVABLE_STEEL_BUY_002'].includes(info.contractTemplate)">
          <div class="fake-ipt"> {{info.freightSettlementMode === 'TWO_TICKET' ? '两票结算':'一票结算'}}</div>
        </a-form-item>
        <a-form-item label="运输方式" v-if="isScrapSteel || ['RECEIVABLE_STEEL_BUY_002'].includes(info.contractTemplate)">
          <div class="fake-ipt"> {{info.transportModeDesc}}</div>
        </a-form-item>
        <a-form-item label="交付履约地" v-if="isScrapSteel">
          <div class="fake-ipt"> {{info.deliverPlace}}</div>
        </a-form-item>
        <a-form-item :label="info.contractTemplate === 'RECEIVABLE_STEEL_BUY_002' ? '收货地点':'交货地点'" v-else>
          <div class="fake-ipt"> {{info.deliveryPlace}}</div>
        </a-form-item>
        <a-form-item label="收货人" v-if="['RECEIVABLE_STEEL_BUY_002'].includes(info.contractTemplate)">
          <div class="fake-ipt"> {{info.deliveryMember}}</div>
        </a-form-item>
        <a-form-item label="是否指定规格" v-if="info.appointSpecDesc">
          <div class="fake-ipt"> {{info.appointSpecDesc}}</div>
        </a-form-item>
        <a-form-item label="合同签约地">
          <div class="fake-ipt"> {{info.contractSignPlace}}</div>
        </a-form-item>
        <a-form-item label="使用资金来源">
          <div class="fake-ipt"> {{info.capitalSource}}</div>
        </a-form-item>
        <a-form-item label="业务经理" v-if="info.assetTeamTraderName">
          <div class="fake-ipt"> {{info.assetTeamTraderName}}{{info.assetTeamTraderPhone}}</div>
        </a-form-item>
        <a-form-item label="货权过户费"  v-if="['FINISHED_STEEL_BUY_004'].includes(info.contractTemplate)">
          <div class="fake-ipt"> {{info.titleTransferFeeDesc}}</div>
        </a-form-item>
        <a-form-item label="交货方式" v-if="info.deliveryModeDesc">
          <div class="fake-ipt"> {{info.deliveryModeDesc}}</div>
        </a-form-item>
        <a-form-item label="其他" v-if="info.otherDeliveryMode &&  ['OTHER_DELIVERY', 'OTHER'].includes(info.deliveryMode)">
          <div class="fake-ipt"> {{info.otherDeliveryMode}}</div>
        </a-form-item>
        <a-form-item label="是否承兑业务" v-if="!isScrapSteel &&!['RECEIVABLE_STEEL_BUY_002'].includes(info.contractTemplate)" >
          <div class="fake-ipt"> {{info.acceptancePayment == 1 ? '是' : '否'}}</div>
        </a-form-item>
        <template v-if="isBelongTieRui && info.extensionInfo">
          <a-form-item label="供综产品">
            <div class="fake-ipt"> {{info.extensionInfo.productName || '-'}}</div>
          </a-form-item>
          <a-form-item label="供综项目">
            <div class="fake-ipt"> {{info.extensionInfo.projectName || '-'}}</div>
          </a-form-item>
          <a-form-item label="供综贸易订单">
            <div class="fake-ipt"> {{info.extensionInfo.orderTradingName || '-'}}</div>
          </a-form-item>
        </template>
      </a-row>
    </div>
    <div class="new-detail-content detail-form">
      <h2>采购明细表</h2>
      <a-table
          :pagination="false"
          :columns="columns"
          class="new-table"
          :data-source="info.contractPurchaseList"
          :scroll="{x:true}"
          rowKey="id">
      </a-table>
    </div>
    <div class="new-detail-content detail-form">
      <a-row class="df">
        <a-form-item label="备注" v-if="info.remark">
          <div class="fake-ipt"> {{info.remark}}</div>
        </a-form-item>
      </a-row>
    </div>
    <div class="new-detail-content detail-form">
      <h2>银行账户信息</h2>
      <a-row class="df">
        <a-form-item label="卖方账号">
          <div class="fake-ipt"> {{info.sellCompanyName}} {{info.sellCompanyUscc}}</div>
        </a-form-item>
        <a-form-item label="开户行">
          <div class="fake-ipt">{{info.sellCompanyName}}</div>
        </a-form-item>
        <a-form-item label="账号">
          <div class="fake-ipt">{{info.sellBankNo}}</div>
        </a-form-item>
        <a-form-item label="买方账号">
          <div class="fake-ipt"> {{info.buyCompanyName}}  {{info.buyCompanyUscc}}</div>

        </a-form-item>
        <a-form-item label="开户行">
          <div class="fake-ipt">{{info.buyCompanyName}}</div>
        </a-form-item>
        <a-form-item label="账号">
          <div class="fake-ipt">{{info.buyBankNo}}</div>
        </a-form-item>
      </a-row>
    </div>
    <div class="new-detail-content detail-form" v-if="isScrapSteel">
      <h2>下游合同信息</h2>
      <a-row class="df">
        <a-form-item label="下游签约企业名称">
          <div class="fake-ipt">{{info.additionalCompanyName}}</div>
        </a-form-item>
        <a-form-item label="下游企业简称">
          <div class="fake-ipt">{{info.additionalCompanyAbbr}}</div>
        </a-form-item>
        <a-form-item label="下游企合同编号">
          <div class="fake-ipt">{{info.additionalContractNo}}</div>
        </a-form-item>

      </a-row>
    </div>
    <div class="new-detail-content detail-form" v-if="['STEEL_PROFILE', 'FINISHED_STEEL_BUY_004','RECEIVABLE_STEEL_BUY_002'].includes(info.contractTemplate)">
      <h2>联系人信息</h2>
      <a-row class="df">
        <a-form-item label="甲方联系人">
          <div class="fake-ipt">{{info.buyerContactName}}</div>
        </a-form-item>
        <a-form-item label="联系电话">
          <div class="fake-ipt">{{info.buyerContactPhone}}</div>
        </a-form-item>
        <a-form-item label="微信">
          <div class="fake-ipt">{{info.buyerWechatId}}</div>
        </a-form-item>
        <a-form-item label="联系邮箱">
          <div class="fake-ipt">{{info.buyerContactEmail}}</div>
        </a-form-item>
        <a-form-item label="联系地址">
          <div class="fake-ipt">{{info.buyerContactAddress}}</div>
        </a-form-item>
      </a-row>
      <a-row  class="df">
        <a-form-item label="乙方联系人">
          <div class="fake-ipt">{{info.sellerContactName}}</div>
        </a-form-item>
        <a-form-item label="联系电话">
          <div class="fake-ipt">{{info.sellerContactPhone}}</div>
        </a-form-item>
        <a-form-item label="微信">
          <div class="fake-ipt">{{info.sellerWechatId}}</div>
        </a-form-item>
        <a-form-item label="联系邮箱">
          <div class="fake-ipt">{{info.sellerWechatId}}</div>
        </a-form-item>
        <a-form-item label="联系地址">
          <div class="fake-ipt">{{info.sellerContactAddress}}</div>
        </a-form-item>
      </a-row>
    </div>
  </div>
</template>

<script>
const buyDetailsColumns = [
  { title: '序号', customRender: function (t, r, index) {
    return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
  }},
  { title: '品种', dataIndex: 'materialName', },
  { title: '数量', dataIndex: 'quantity', customRender:(text) => text || '-' },
  { title: '预设单价(元/吨)',  dataIndex: 'presetUnitPrice',},
]
const  buyDetailsColumns2 = [
  { title: '序号', customRender: function (t, r, index) {
    return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
  }},
  { title: '品名', dataIndex: 'materialName', key: 'materialName'},
  { title: '规格', dataIndex: 'specs', key: 'specs', },
  { title: '材质', dataIndex: 'materialTexture', key: 'materialTexture',},
  {  title: '产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin',},
  { title: '件数', dataIndex: 'pieceQuantity', key: 'pieceQuantity', },
  { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity', },
  { title: '捆包号', dataIndex: 'baleNo',key: 'baleNo',},
  { title: '理重', dataIndex: 'theoreticalWeight', key: 'theoreticalWeight',},
  { title: '计量方式', dataIndex: 'metrologyWay', key: 'metrologyWay', },
  { title: '含税单价（元/吨）',dataIndex: 'presetUnitPrice', key: 'presetUnitPrice',},
  { title: '不含税单价（元/吨）', dataIndex: 'test3', key: 'test3', },
  { title: '含税金额', dataIndex: 'test4', key: 'test4',fixed: 'right'}
]
const  buyDetailsColumnsBuy002 = [
  { title: '序号', customRender: function (t, r, index) {
    return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
  }},
  { title: '物资名称', dataIndex: 'materialName', key: 'materialName'},
  { title: '材质', dataIndex: 'materialTexture', key: 'materialTexture',},
  { title: '规格', dataIndex: 'specs', key: 'specs', },
  {  title: '厂家', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin',},
  { title: '数量', dataIndex: 'quantity', key: 'quantity', },
  { title: '单位', dataIndex: 'unit', key: 'unit', },
  { title: '单价（元）',dataIndex: 'presetUnitPrice', key: 'presetUnitPrice',},
  { title: '交货期限',dataIndex: 'deliveryDeadline', key: 'deliveryDeadline',},
  { title: '备注',dataIndex: 'remark', key: 'remark',},
]
import { mapGetters } from 'vuex';
// import contract from '@/v2/center/steels/mixins/contract.js'
export default {
  props: {
    info: {
      default: () => {}
    }
  },
  // mixins: [contract],
  data() {
    return {

    }
  },
  watch: {
    contractTemplate: {
			handler(v) {
				if (!v) return
				let hasTotal = false
				if (this.info.contractPurchaseList.length) {
					this.info.contractPurchaseList.forEach((item) => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity')
					})
				}
				if (!hasTotal) {
					if (this.isAddTotalColumn) {
						this.info.contractPurchaseList.push({
							transferQuantity: '总计',
							quantity: '', //数量
							pieceQuantity: '', // 件数
							presetUnitPrice: '', // 含税价格
						});
						// 计算总计
						this.computedTotal();
						this.$forceUpdate();
					}
				}
			}
		}
  },
  computed: {
    // 判断是否是废钢
    isScrapSteel() {
      return this.info.steelType.includes('SCRAP_STEEL')
    },
    contractTemplate() {
      return this.info.contractTemplate
    },
    columns() {
      if(this.contractTemplate === "RECEIVABLE_STEEL_BUY_002"){
        return buyDetailsColumnsBuy002
      }
      if(this.isScrapSteel) {
        return buyDetailsColumns

      }
      return buyDetailsColumns2
    },
    name() {
      return ''
      // const item = this.traderList.find(el => el.userId == this.info.assetTeamTraderId) || {}
      // return `${item.realname} ${item.phone}`
    },
    ...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
    //是否属于铁瑞集团
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051'
		},
    // 表格是否增加总计行
		// 采购合同模板001、002、004、005、应收采购合同模板002、废钢合同模板001
		isAddTotalColumn() {
			return [ 'FINISHED_STEEL_BUY_001', 'FINISHED_STEEL_BUY_002','FINISHED_STEEL_BUY_004', 'RECEIVABLE_STEEL_BUY_002', 'SCRAP_STEEL_001'].includes(this.contractTemplate)
		},
  },
  mounted() {
    // this.handleSearchTrader()
  },
  methods: {
    computedTotal() {
			const lastItem = this.info.contractPurchaseList[this.info.contractPurchaseList.length - 1];
			let quantity = 0
			let pieceQuantity = 0
			let test4 = 0
			this.info.contractPurchaseList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					quantity += +(el.quantity || 0);
					if (el.pieceQuantity !== "/") {
						pieceQuantity += +(el.pieceQuantity || 0);
					}
					test4 += +(el.test4 || 0);
				}
			});
			lastItem.quantity = parseFloat(quantity.toFixed(4));
			lastItem.pieceQuantity = parseFloat(parseInt(pieceQuantity));
			lastItem.test4 = parseFloat(test4.toFixed(2));
      if (this.info?.totalTaxAmount) {
				lastItem.test4 = this.info?.totalTaxAmount.toFixed(2);
			}
			this.$forceUpdate();
		},

  },
  components: {

  }
}
</script>

<style scoped lang='less'>

.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
  }
}
.ipt {
  width: 310px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  font-size: 14px;
  color: #8495AA;
  border: 0;
}
.fake-ipt {
  width: 310px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  font-size: 14px;
  color: #8495AA;
  border: 0;
  padding: 4px 11px;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
