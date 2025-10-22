<template>
  <div>
    <ul class="grid-wrap" v-if="isRelationContract">
      <li>
        <span class="label">合同编号</span>
        <span >
          <a href="javascript:;" @click="goContractDetail">{{info.contractNo}}</a>
          <a href="javascript:;" @click="openRelationModal" style="margin-left:5px">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style="vertical-align: middle;cursor: pointer;margin-top:-2px">
              <path d="M9.77515 1.74834L8.60848 2.915H2.91667V11.0817H11.0833V5.38987L12.25 4.22321V11.665C12.25 11.9871 11.9888 12.2484 11.6667 12.2484H2.33333C2.01117 12.2484 1.75 11.9871 1.75 11.665V2.33167C1.75 2.00951 2.01117 1.74834 2.33333 1.74834H9.77515ZM11.9498 1.22363L12.7747 2.04859L7.41247 7.41083L6.58898 7.41223L6.58752 6.58588L11.9498 1.22363Z" fill="var(--primary-color)"/>
            </svg>
          </a>

        </span>

      </li>
      <li>
        <span class="label">卖方企业</span>
        <span>{{info.sellerName}}</span>
      </li>
      <li>
        <span class="label">买方企业</span>
        <span>{{info.buyerName}}</span>
      </li>
      <li>
        <span class="label">品名</span>
        <span>{{info.goodsName}}</span>
      </li>
      <li>
        <span class="label">基准价格</span>
        <span v-if="info.followTheMarket">随行就市</span>
        <span v-if="info.basePrice !== undefined && info.basePrice !== null  && !info.followTheMarket && !info.basePriceDesc">
          <i v-if="info.basePrice == '随行就市'">{{info.basePrice}}</i>
          <i v-else>￥{{info.basePrice | formatMoney(2)}}/吨</i>
        </span>
        <i v-if="info.basePriceDesc && !info.followTheMarket">{{info.basePriceDesc || '-'}}</i>

      </li>
      <li>
        <span class="label">数量</span>
        <span>{{info.quantity}}  <i v-if="info.quantityOffset">±{{info.quantityOffset}}%</i> </span>
      </li>
      <li>
        <span class="label">交货期限</span>
        <span>{{info.deliveryStartDate}} - {{info.deliveryEndDate}} </span>
      </li>
      <li>
        <span class="label">运输方式</span>
        <span>{{info.transportModeDesc}}</span>
      </li>
      <li>
        <span class="label">收货人</span>
        <span>{{info.consigneeCompanyName || '-'}}</span>
      </li>
    </ul>
    <a-form :form="relationForm" :colon="false"  class="slFormDetail" v-else>
      <a-row>
        <a-col :span="8">
          <a-form-item :label="type == 'IN' ? '关联采购合同' : '关联销售合同'" >
            <a-input
              readOnly
              :placeholder="type == 'IN' ? '请点击选择采购合同' : '请点击选择销售合同' "
              @click="openRelationModal"
              :disabled="relationForm.getFieldValue('noRelation') "
              v-decorator="[
                `contractNo`,
                {
                  rules: [
                    {
                      required: !relationForm.getFieldValue('noRelation'),
                      message: `请选择是否关联合同`,
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" class="no-relation">
          <a-form-item label="">
            <a-checkbox
              @change="changeRelation"
              v-decorator="[
                `noRelation`,
                {
                  valuePropName: 'checked',
                },
              ]"
              >暂不关联</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <RelationContract 
      ref="relationContract" 
      :type="type" 
      source='add' 
      @relation='getSelectContract'
      :querySource="querySource"
      :operationType="operationType"
    ></RelationContract>
  </div>
</template>

<script>
import RelationContract from './relationContract.vue'
import { mapGetters } from "vuex"
import { getContractInfo } from "../../../api/inout.js";
export default {
  props: {
    type: {
      default: 'IN'
    },
    querySource: {
      default: 'IN_OUT_STORAGE'
    },
    operationType:{
      default: ''
    },
  },
  data() {
    return {
      info: { },
      relationForm: this.$form.createForm(this),
      
    }
  },
  computed: {
    ...mapGetters('user', {
        VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),

    // 判断当前是否关联了合同
    isRelationContract() {
      
      return !!this.info.serialNo
    }
  },
  watch:{
    $route(to ){
      if(to.query.serialNo) {
        this.getContractInfo()
      } else {
        this.info = {}
        this.$emit("sendRelationFlag",null,{})
        this.$nextTick(() => {
          this.relationForm.setFieldsValue({noRelation: true})
        })
      }
    }
  },
  mounted() {
    if(this.$route.query.serialNo) {
      this.getContractInfo()
    } else {
      this.$nextTick(() => {
        
        this.relationForm.setFieldsValue({noRelation: true})
      })
    }
  },
  methods: {
    // 选择合同
    openRelationModal() {

       this.$refs.relationContract.show()
    },
    init(info= {}) {
      
      if(info.orderNo) {
        this.getContractInfo(info.orderNo, info.contractType)
        this.$emit('sendRelationFlag', info.orderNo, {...info, firstEdit: true})
        this.$nextTick(() => {
           this.relationForm.setFieldsValue({noRelation: false})
        })
      }
    },
    async getContractInfo(serialNo, type) {
      // this.type == 'IN' ? 'BUY' : 'SELL'  
      let  orderTypeEnum = 'ONLINE'  
      if(this.$route.query.orderTypeEnum == 'OFFLINE') {
        orderTypeEnum = 'OFFLINE'
      }
        
      const params = {
        serialNo: this.$route.query.serialNo || serialNo,
        orderTypeEnum: orderTypeEnum || type,
        storageGoodsInOutTypeEnum:this.type,
        stationId: this.VUEX_CURRENT_PLATEFORM.stationId
      }

      const res = await getContractInfo(params)
      this.info = res.data || {}
      this.info.contractType = this.$route.query.orderTypeEnum

      if(!serialNo && !type) {
         this.$emit('sendRelationFlag', this.info.serialNo, this.info)
      }
      
    },
    // 去往合同详情
    goContractDetail() {
      let contractType  = this.type == 'IN' ? 'BUY' : 'SELL'

      let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${this.info.id}&type=${contractType}`

      if(this.info.contractType == 'OFFLINE') {
      
        path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${this.info.id}&type=${contractType.toLowerCase()}`

      }
      window.open(path)
    },
    changeRelation(e) {
      this.relationForm.setFields({
        contractNo: {
          value: undefined,
          errors: null,
        },
      });
    },
     // 获取选择的合同
    getSelectContract(info = {}) {
      // this.info = info
      // if(!info.serialNo) {
      //   this.$nextTick(() => {
      //     this.relationForm.setFieldsValue({noRelation: true})
      //     this.$emit('sendRelationFlag', '', {})
        
      //   })
      // } else {
      //    this.$emit('sendRelationFlag', this.info.serialNo, this.info)
      // }
      const query = {...this.$route.query};
      delete query.serialNo
      if(info.serialNo){
        query.serialNo = info.serialNo
      }
      delete query.orderTypeEnum
      if(info.contractType){
        query.orderTypeEnum = info.contractType
      }
      this.$router.replace({ query})


    },
    geInfo() {
      return new Promise((resolve) => {
        if(this.relationForm.getFieldValue('noRelation') === false)  {
          this.relationForm.validateFieldsAndScroll((err, values) => {
            if(err) {
              resolve(false)
            } else {
              resolve(this.info)
            }
          })
        } else {
          resolve(this.info)
        }
      })
    }
  },
  components: {
    RelationContract,
  }
}
</script>

<style scoped  lang='less' >
.grid-wrap {
  margin-top: 20px;
  width: 100%;
  border-radius: 3px;
  height: auto;
  overflow: hidden;
  border-left: 1px solid #E5E6EB;
  li {
    width: 33.3%;
    height: 48px;
    float: left;
    border-bottom: 1px solid #E5E6EB;
    border-right: 1px solid #E5E6EB;
    overflow: hidden;
    position: relative;
    span {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      padding: 0 12px;
      text-align: left;
    }
    &>span:first-child {
      border-right: 1px solid #E5E6EB;
    }
    .label{
      width: 120px;
      background: #F3F5F6;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #77889D;
      position: absolute;
      left: 0;
      top: 0;
    }
    span:last-child{
      width: 100%;
      padding-left: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  li:nth-child(1),li:nth-child(2), li:nth-child(3) {
    border-top: 1px solid #E5E6EB;
  }
  li:nth-child(3){
    border-radius: 0 3px 0 0;
  }
  li:last-child {
    border-radius: 0 0 3px 0;
  }
  li.special {
    border-radius: 0 3px 3px 0;
  }
}
.ant-col{
  height: 82px;
  // margin-bottom: 10px
}
.col-height.ant-col {
  height: inherit;
}
.ant-form-item {
  width: 364px;
  margin-bottom: 0;
}
.no-relation {
  position: relative;
  top: 35px;
}

</style>
