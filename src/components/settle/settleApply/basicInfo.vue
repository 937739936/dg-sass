<template>
  <div class="settle-apply-basic-info">
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
      <a-row>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="contractNo"
            label="合同编号"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.contractNo"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="quantity"
            label="合同数量"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.quantity"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row" v-if="detailData.deliveryType != 'PLACE_GOODS_TRANSFER'">
          <a-form-model-item
            prop="transType"
            label="运输方式"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.transType"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="contractPrice"
            ref="contractPrice"
            label="合同单价(元/吨)"
            :colon="false">
            <a-input
              @blur="() => { $refs.contractPrice.onFieldBlur() }"
              disabled
              placeholder="请输入合同单价"
              v-model="detailData.contractPrice"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="salesMan"
            ref="salesMan"
            :colon=false
            class="order-wrap"
            label="业务员">
            <a-select
              @blur="() => { $refs.salesMan.onFieldBlur() }"
              class="salesman-select"
              show-search
              labelInValue
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="inputSalesman"
              v-model="detailData.salesMan">
              <a-select-option v-for="d in salesManInfo" :key="d.value">{{ d.text }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <template v-if="detailData.transType != '船运'">
          <a-col :span="12" class="row">
            <a-form-model-item
              prop="deliverQuantity"
              label="票重(吨)"
              :colon="false">
              <a-input
                disabled
                v-model="detailData.deliverQuantity"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" class="row">
            <a-form-model-item
              prop="receiveQuantity"
              label="衡重(吨)"
              :colon="false">
              <a-input
                disabled
                v-model="detailData.receiveQuantity"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" class="row">
            <a-form-model-item
              prop="trainNum"
              label="车数"
              :colon="false">
              <a-input
                disabled
                v-model="detailData.trainNum"/>
            </a-form-model-item>
          </a-col>
        </template>
      </a-row>
    </a-form-model>

  </div>
</template>
<script>
import {API_GetSalesMan} from "api/index";

export default {
  name: 'SettleApplyBasicInfo',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      rules: {
        contractPrice: [
          { required: false, message: '请输入合同单价', trigger: 'blur' }
        ],
        salesMan: [
          { required: true, message: `业务员必填`, trigger: 'blur' }
        ]
      },
      detailData: {},
      salesManInfo: [],
      contractTemplate: 0
    }
  },
  mounted() {
    this.detailData = JSON.parse(JSON.stringify(this.data))
    this.contractTemplate = this.detailData.contractTemplate
    this.$set(this.rules.contractPrice[0], 'required', false)
  },
  methods: {
    // 业务员
    inputSalesman(v) {
      if (v == "") return false
      API_GetSalesMan(v).then((res) => {
        let arr = res.result || []
        if (arr.length === 0) {
          this.$set(this.detailData, 'salesMan', undefined)
          return (this.salesManInfo = []);
        }
        this.salesManInfo = arr.map((item) => {
          return {
            text: item.oaUserName,
            value: item.oaMobile,
          };
        });
      });
    }
  },
  watch: {
    data: {
      handler () {
        this.detailData = JSON.parse(JSON.stringify(this.data))
        this.contractTemplate = this.detailData.contractTemplate
        this.$set(this.rules.contractPrice[0], 'required', false)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.settle-apply-basic-info{

}
</style>