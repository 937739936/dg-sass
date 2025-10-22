<template>
  <div class="contract-info">
    <div class="slTitleAssis">
      基础信息
      <!-- 线下合同 -->
       <a-button type="primary" v-if="contractInfo.whetherEditAllBoo && !isBank && type =='rest'" ghost class="slBtn" style="margin-left: 25px;" @click="goContractEdit">编辑合同</a-button>
    </div>
    <a-descriptions bordered  :column="3"  size="middle">
      <a-descriptions-item label="合同编号">
        <template v-if="isBank">
          <span  v-if="contractInfo.paperContractNo">{{contractInfo.paperContractNo}}</span>
          <span  v-else>{{contractInfo.contractNo}}</span>
        </template>
        <template v-else>
          <a href="javascript:;" @click="goContract" v-if="contractInfo.paperContractNo">{{contractInfo.paperContractNo}}</a>
          <a href="javascript:;" @click="goContract" v-else>{{contractInfo.contractNo}}</a>
        </template>

        <!-- 长协 -->
        <!-- contractTermType == 'LONG_TERM_CONTRACT' -->
        <span class="long" v-if="contractInfo.contractTermType =='LONG_TERM_CONTRACT'">长协</span>
        <!-- signStatusDesc signStatus=2 -->
        <span class="long" v-if="contractInfo.signStatus == 2">双签</span>
        <span class="long" v-if="contractInfo.signStatus == 1">单签</span>



      </a-descriptions-item>
      <!-- 采购和销售合同 -->
      <template v-if="contractType != 'trans'">
        <a-descriptions-item label="买方企业">{{ contractInfo.buyerCompanyName }}</a-descriptions-item>
        <a-descriptions-item label="卖方企业">{{ contractInfo.sellerCompanyName }}</a-descriptions-item>
        <a-descriptions-item label="签订日期">{{ contractInfo.contractSignDate || '-' }}</a-descriptions-item>
        <a-descriptions-item label="业务类型">{{contractInfo.businessTypeDesc || '-'}}</a-descriptions-item>
      
        <a-descriptions-item label="双签合同获得日期" v-if="contractInfo.doubleSignTime">{{contractInfo.doubleSignTime}}</a-descriptions-item>
        <a-descriptions-item label="品名">{{ contractInfo.goodsName  || '-'}}</a-descriptions-item>
        <a-descriptions-item :label="contractInfo.paperContractNo ? '合同价格': '基准价格'">
          <span>{{ contractInfo.followTheMarket ? "随行就市" : (contractInfo.contractPrice? formatMoney(contractInfo.contractPrice)+"元/吨" :'-' ) }}</span>
        </a-descriptions-item>
        <a-descriptions-item :label="contractInfo.paperContractNo ? '合同数量': '数量'">
          <span>{{contractInfo.contractQuantity? formatMoney(contractInfo.contractQuantity)+"吨" : '-' }}  <i v-if="contractInfo.quantityOffset">(±{{contractInfo.quantityOffset}}%)</i> </span>
        </a-descriptions-item>
        <a-descriptions-item label="交货期限">
          <span v-if="contractInfo.deliveryDateBegin">{{ contractInfo.deliveryDateBegin }}至{{ contractInfo.deliveryDateEnd }}</span>
          <span v-else>-</span>
        </a-descriptions-item>

        <a-descriptions-item label="运输方式"> {{contractInfo.transTypeName}}</a-descriptions-item>
        <a-descriptions-item label="交货方式" v-if="!contractInfo.paperContractNo"> {{contractInfo.deliveryModeDesc}}</a-descriptions-item>

        <a-descriptions-item label="发站" v-if="contractInfo.trainSendStationName">{{ contractInfo.trainSendStationName}} </a-descriptions-item>
        <a-descriptions-item label="到站" v-if="contractInfo.trainArriveStationName">{{  contractInfo.trainArriveStationName}} </a-descriptions-item>
        <a-descriptions-item label="托运人" v-if="contractInfo.consignorCompanyName">{{ contractInfo.consignorCompanyName}} </a-descriptions-item>
        <a-descriptions-item label="收货人" v-if="contractInfo.consigneeCompanyName"> {{contractInfo.consigneeCompanyName}} </a-descriptions-item>
        <a-descriptions-item label="发货地址" v-if="contractInfo.sendGoodsAddress">{{  contractInfo.sendGoodsAddress}} </a-descriptions-item>
        <a-descriptions-item label="收货地址" v-if="contractInfo.receiveGoodsAddress">{{  contractInfo.receiveGoodsAddress}} </a-descriptions-item>
        <a-descriptions-item label="始发港" v-if="contractInfo.shipLoadingPortName">{{  contractInfo.shipLoadingPortName}} </a-descriptions-item>
        <a-descriptions-item label="卸货港" v-if="contractInfo.shipDischargingPortName">{{  contractInfo.shipDischargingPortName}} </a-descriptions-item>
        <a-descriptions-item label="回款账户" v-if="contractInfo.receivableAccount">{{contractInfo.receivableAccount}}</a-descriptions-item>
        <a-descriptions-item label="回款开户行" v-if="contractInfo.receivableBankName">{{contractInfo.receivableBankName}}</a-descriptions-item>
        <a-descriptions-item label="回款账号" v-if="contractInfo.receivableBankNo">{{formatAccountNumber(contractInfo.receivableBankNo)}}</a-descriptions-item>


      </template>
      <!-- 运输合同 -->
      <template v-else>
        <a-descriptions-item label="承运人">{{ contractInfo.consigneeCompanyName }}</a-descriptions-item>
        <a-descriptions-item label="托运人">{{ contractInfo.consignorCompanyName }}</a-descriptions-item>
        <a-descriptions-item label="签订日期">{{ contractInfo.contractSignTime || '-'}}</a-descriptions-item>
        <a-descriptions-item label="合同价格">{{ formatMoney(contractInfo.contractPrice) }}元/吨</a-descriptions-item>
        <a-descriptions-item label="运输吨数">{{ formatMoney(contractInfo.contractQuantity) }}吨</a-descriptions-item>
        <a-descriptions-item label="运输方式">{{ contractInfo.terminalDeliveryVO && contractInfo.terminalDeliveryVO.transportModeDesc }}</a-descriptions-item>
        <a-descriptions-item label="起运地">{{ contractInfo.terminalDeliveryVO && contractInfo.terminalDeliveryVO.origin }}</a-descriptions-item>
        <a-descriptions-item label="目的地">{{  contractInfo.terminalDeliveryVO &&  contractInfo.terminalDeliveryVO.destination }}</a-descriptions-item>
        <a-descriptions-item label="合同有效期">{{ contractInfo.execDateStart }} - {{contractInfo.execDateEnd}}</a-descriptions-item>
        <a-descriptions-item label="运输公司收款账号" >
          <template v-if="contractInfo.receivableAccountBank"> {{ contractInfo.receivableAccountBank }} - {{formatAccountNumber(contractInfo.receivableAccountNo) }}</template>
          <template v-else>-</template>
          
        </a-descriptions-item>

      </template>

    </a-descriptions>
    <!-- 合同附件 -->
    <div class="slTitleAssis" style="margin-top:30px">
      合同附件
      <a-button type="primary" ghost class="slBtn" v-if="isShowAllDownloadBtn" style="margin-left: 25px;" @click="downloadAllContractFile">一键下载</a-button>
    </div>
    <div class="table-box" v-if="contractType != 'trans' && !contractInfo.paperContractNo">
      <a-table
        :columns="onlineColumns"
        class="new-table"
        :bordered="false"
        rowKey="no"
        :dataSource="contractInfo.contractDetailFileRespList"
        :pagination="false"
      >
        <template slot="action" slot-scope="text,items">
          <a-space :size="20">
            <a href="javascript:;" @click="viewContractDetail(items)" v-if="items.fileUrl && !isBank">查看</a>
            <a href="javascript:;" @click="downloadSingleContractFile(items)" v-if="items.fileUrl">下载</a>
          </a-space>
        </template>
      </a-table>
    </div>
    <div class="table-box" v-if="contractType != 'trans' && contractInfo.paperContractNo">
      <a-table
        :columns="offlineColumns"
        class="new-table new-table2"
        :bordered="false"
        rowKey="no"
        :dataSource="contractAttachment"
        :pagination="false"
      >
        <template slot="fileList" slot-scope="text,record">
          <span class="preview-box">
            <a-tooltip  v-for="(item,i ) in record.fileList " :key="i">
              <template slot="title">
                上传时间：{{item.uploadTime}}
              </template>
               <a href="javascript:;"  class="preview" @click="handlePreview(item.fileUrl)"  > {{item.fileName || item.name}} </a>
            </a-tooltip>

          </span>
        </template>
        <template slot="action" slot-scope="text,items">
          <a href="javascript:;" @click="downloadSingleContractFile(items)" >下载</a>
        </template>
      </a-table>
    </div>
    <div class="table-box" v-if="contractType == 'trans'">
      <a-table
        :columns="transColumns"
        class="new-table new-table2"
        :bordered="false"
        rowKey="no"
        :dataSource="contractInfo.terminalAttachmentVO"
        :pagination="false"
      >
      <template slot="fileName" slot-scope="text,items">
            <a-tooltip >
              <template slot="title" v-if="items.uploadTime">
                
                上传时间：{{items.uploadTime}}
              </template>
              <a href="javascript:;" @click="handlePreview(items.fileUrl)" >{{text}}</a>
            </a-tooltip>
         
      </template>
        <template slot="action" slot-scope="text,items">
          <a href="javascript:;" v-if="items.fileUrl" @click="downloadSingleContractFile(items)" >下载</a>
        </template>
      </a-table>
    </div>
    <div class="slTitleAssis" style="margin-top:30px" v-if="isShowSupp">
      补充协议
    </div>
    <div  style="margin-top:20px" v-if="isShowSupp">
      <SuppleAgree ref="suppleAgree" @handlePreview='handlePreview' @downloadSupple='downloadSupple' :type='type' :contractType='contractType'></SuppleAgree>
    </div>
  </div>
</template>

<script>
// 线上采购合同和销售合同

const onlineColumns = [
  { title: "文件类型", dataIndex: "fileTypeText",width: '20%'},
  { title: "文件名称", dataIndex: "fileName",width: '25%'},
  { title: "文件编号", dataIndex: "no",width: '25%'},
  { title: "签订日期", dataIndex: "signTime",width: '19%'},
  { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },align:'left', fixed: 'right'},
]
// 线下采购合同和销售合同 
const offlineColumns = [
  { title: "单据类型", dataIndex: "typeName",width: '20%'},
  { title: "文件名称", dataIndex: "fileList", scopedSlots: { customRender: "fileList" },},
  { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },width: '15%',align:'center'},
]
// 和运输合同
const transColumns = [
  { title: "单据类型", dataIndex: "typeName",width: '20%'},
  { title: "文件名称", dataIndex: "fileName", scopedSlots: { customRender: "fileName" },},
  { title: "上传时间", dataIndex: "uploadTime",},

  { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },width: '15%',align:'center'},
]

import SuppleAgree from './SuppleAgree.vue'
import { formatMoney } from '@sub/filters'
import { formatAccountNumber }  from '@sub/utils/factory.js'


export default {
  props: {
    contractApi: { },
    // 登录的企业信息
    VUEX_ST_COMPANYSUER: {
      default: () => {
        return {
          roles: []
        }
      }
    },
    contractType: {
      default: 'buy'
    },
    // 操作类型
    type: {
      default: 'rest'
    },
    // 金融机构
    isBank: {
      default: false,
    },

  },
  data() {
    return {
      list: [],
      offlineColumns,
      onlineColumns,
      transColumns,
      contractInfo: {
        terminalContractDelivery: {},
        terminalDeliveryVO: {},
      },
      // 是否有补协
      isShowSupp: false,
      
    }
  },
  computed: {
    // 编辑权限
    isRoleAuth() {
     return this.VUEX_ST_COMPANYSUER?.roles?.some(el => ["ADMIN","OPERATOR"].includes(el))
    },
    // 其他合同
    // 当合同状态为“已单签”、“执行中”、“单签审批驳回”、“双签审批驳回”，且当前用户为“业务员”、“企业管理员”时，展
    buyAndSellStatusAuth() {
      return ['EXECUTING', 'SINGLE_SIGN', 'PENDING_AUDITING_REJECT', 'DOUBLE_SIGN_AUDITING_REJECT'].includes(this.contractInfo.status)
    },
    // 当合同状态为“待提交”、“执行中”，展示此按钮
    // 运输合同
    transStatusAuth() {
      return ['EXECUTING', 'DRAFT' ].includes(this.contractInfo.status)
    },
    // 编辑按钮权限
    isEditAuth() {
      if(this.contractType == 'trans') {
        return this.transStatusAuth
      }
      return this.buyAndSellStatusAuth && this.isRoleAuth && this.contractInfo.paperContractNo
    },
    // 线下和运输合同 附件列表
    contractAttachment() {
       const obj = {}
       const list = this.contractInfo.contractAttachment || []
       list.forEach(el => {
        if(!obj[el.type]) {
          obj[el.type] = {fileList: [], typeName: el.typeName, type: el.type}
        }
        obj[el.type].fileList.push(el)

       })
       const contractAttachment = []
       for(let k in obj) {
        contractAttachment.push(obj[k])
       }
       return  contractAttachment
    },
    // 判断当前是否显示一键下载按钮
    isShowAllDownloadBtn() {
      return this.contractAttachment.length || (this.contractInfo.contractDetailFileRespList && this.contractInfo.contractDetailFileRespList.length) || (this.contractInfo.terminalAttachmentVO && this.contractInfo.terminalAttachmentVO.length)
      
    }




  },
  mounted() {

    this.getContactInfo()
  },

  methods: {
    formatMoney,
    formatAccountNumber,
    // 组件
    async getContactInfo() {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        ...this.$route.query,
      }
      const res = await this.contractApi(params)
      this.contractInfo = res.data
    
      this.$emit('getContractInfo', this.contractInfo)
      // 补充协议
      this.isShowSupp = true
      if(!this.contractInfo.supplementalInfo || !this.contractInfo.supplementalInfo?.length) {
         this.isShowSupp = false
      }
      this.$nextTick(() => {
        if(this.isShowSupp) {
          this.$refs.suppleAgree.init(this.contractInfo)
        }
      })

    },
    // 编辑合同信息
    goContractEdit() {
      let path = `/center/contract/${this.contractType}/offline/add`
      // 运输
      if(this.contractType == 'trans') {
        path = `/center/contract/transport/add`
      }
      this.$router.push({ 
        path,
        query: {
          id: this.contractInfo.id,
          type: this.contractType,
          source: 'business',
          flag:'edit'
        }
      })

      // window.open(routeData.href, '_blank')
    },
    // 去往合同
    goContract() {
      let path = `/center/contract/${this.contractType}/online/detail?id=${this.contractInfo.id}&type=${this.contractType.toUpperCase()}`
      if(this.type == 'rest') {
        if(this.contractInfo.paperContractNo) {
          path = `/center/contract/${this.contractType}/offline/detail?id=${this.contractInfo.id}&type=${this.contractType}`
        }
        if(this.contractType == 'trans') {
          path = `/center/contract/transport/detail?id=${this.contractInfo.id}&type=${this.contractType}`
        }
      } else {
        path = `/sys/contract/online/detail?id=${this.contractInfo.id}`
        if(this.contractInfo.paperContractNo) {
          path = `/sys/contract/offline/detail?id=${this.contractInfo.id}&contractNo=${this.contractInfo.orderNo}`
        }
        if(this.contractType == 'trans') {
          path = `/sys/contract/TransportContractDetail?id=${this.contractInfo.id}`
        }
      }
     

      const routeData = this.$router.resolve({ 
        path,
      })


      window.open(routeData.href, '_blank')
    },
    // 一键下载所有合同附件
    downloadAllContractFile() {
      this.$emit('downloadAllContractFile',this.contractInfo, this.contractType)
    },
    // 电子合同查看
    viewContractDetail(record) {
      // 电子合同 查看-跳转到合同详情
      let routeUrl = this.$router.resolve({
        path: this.type == 'rest' ? `/center/contract/${this.contractType.toLowerCase()}/agreement/pdf/detail` : '/sys/contract/preview',
        query: {
          contractNo: this.contractInfo.contractNo,
          contractId: this.contractInfo.id,
          zipFileName:
            this.contractInfo.contractNo + "-" + this.contractInfo.sellerCompanyName + "-" + this.contractInfo.buyerCompanyName + ".zip",
          no: record.no,
          newTab: "newTab",
        },
      });

      window.open(routeUrl.href, "_blank");
    },
    // 下载单个附件
    downloadSingleContractFile(item) {
      this.$emit('downloadSingleContractFile', item, this.contractInfo, this.contractType)
    },
    // 预览附件
    handlePreview(url) {
      this.$emit('handlePreview', url)
    },
    // 下载补充协议
    downloadSupple(serialNo) {
      const query = {
        terminalSupplementalAgreementNo:serialNo,
        id: this.contractInfo.id,
      }
      this.$emit('downloadSupple', query)
    }


    // 下载附件
  },
  components: {
    SuppleAgree,
  }

}
</script>

<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style scoped  lang='less' >
.contract-info {
  margin-top: 30px;
}
.slTitleAssis {
  margin-top: 0;
}
::v-deep.ant-descriptions { 
  font-weight: 400;
  line-height: 20px;
  padding-top: 30px;
  .ant-descriptions-item-label {
    background-color: rgba(243, 245, 246, 1);
    color: #77889D;
    width: 104px;
    height: 48px;
    padding: 0;
    padding-left: 10px;
  }
  .ant-descriptions-item-content {
    color: rgba(0,0,0,0.8);
    padding-left: 12px;
    padding-right: 12px;
  }
}
.long, .doubleSign, .singleSign{
  display: inline-block;
  border-radius: 4px;
  border: 1px solid @primary-color;
  background: #FFF;
  color: @primary-color;
  font-family: PingFang SC;
  font-size: 12px;
  width: 36px;
  height: 20px;
  text-align: center;
  margin-left: 8px;
}
.doubleSign {
  color: #00AE9D!important;
  border: 1px solid #00AE9D;
}
.singleSign {
  color: #FF9726!important;
  border: 1px solid #FF9726;

}
.new-table2 {
  ::v-deep .ant-table-tbody > tr:nth-child(2n) {
    background: #fff;
  } 
  ::v-deep .ant-table-tbody > tr > td {
    border-bottom: 1px solid #E5E6EB;
    padding: 8px 12px;
  }
  ::v-deep .ant-table-tbody > tr > td{
    border-right: 1px solid #E5E6EB;
  }
  ::v-deep .ant-table-tbody > tr >:last-child{
    border-right:0;
  }
}
</style>
