<template>
  <div class="settle-apply-expense-item">
    <div class="title">
      <i class="title_icon"></i>费用项目
    </div>
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
      <a-row>
        <a-col :span="12" class="row">
          <a-form-model-item prop="freightFee" label="运费(元)"  :colon=false>
            <a-input
              @blur="calTotalExpense"
              :disabled="disabled"
              v-model="detailData.freightFee"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="dispatchFee" label="滞期/速遣费(元)"  :colon=false>
            <a-input
              @blur="calTotalExpense"
              :disabled="disabled"
              v-model="detailData.dispatchFee"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="portConstructionFee" label="港建费(元)"  :colon=false>
            <a-input
              @blur="calTotalExpense"
              :disabled="disabled"
              v-model="detailData.portConstructionFee"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="otherFee" label="其他费用(元)"  :colon=false>
            <a-input
              @blur="calTotalExpense"
              :disabled="disabled"
              v-model="detailData.otherFee" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="taxDifference" label="税差(元)"  :colon=false>
            <a-input
              @blur="calTotalExpense"
              :disabled="disabled"
              v-model="detailData.taxDifference" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="feeTotal" label="费用小计(元)"  :colon=false>
            <a-input
              :disabled="true"
              v-model="detailData.feeTotal"/>
          </a-form-model-item>
        </a-col>
      </a-row>

    </a-form-model>
  </div>
</template>

<script>
export default {
  name : "ExpenseItem",
  props:{
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        freightFee:[
          { required: true, message: '请输入运费',trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        dispatchFee:[
          { required: true, message: '请输入运费', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        portConstructionFee:[
          { required: true, message: '请输入港建费', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        otherFee:[
          { required: true, message: '请输入其他费用', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        taxDifference:[
          { required: true, message: '请输入税差', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message:'税差为数字，最多两位小数', trigger: 'blur'}
        ],
        feeTotal:[
          { required: true, message: '请输入费用小计', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message:'费用小计为数字，最多两位小数', trigger: 'blur'}
        ]
      },
      detailData: {}
    }
  },
  mounted() {
    this.initData()
  },
  methods:{
    initData () {
      this.detailData = JSON.parse(JSON.stringify(this.data))
    },
    calTotalExpense(){
      let result = 0;
      const expenseData = {
        "freightFee": this.detailData.freightFee,
        "dispatchFee": this.detailData.dispatchFee,
        "portConstructionFee": this.detailData.portConstructionFee,
        "otherFee": this.detailData.otherFee,
        "taxDifference": this.detailData.taxDifference,
      }
      for (let i in expenseData) {
        if (expenseData[i] && !isNaN(expenseData[i] * 1)) {
          result += expenseData[i] * 1;
        }
      }
      this.$set(this.detailData, 'feeTotal', result.toFixed(2))
    },
    /**
     * form自身的校验规则中，min和max指的是可输入得最小和最大位数，此处需要判断数据范围
     * @param rule
     * @param value
     * @param callback
     * @param min Number 支持的最小数字
     * @param max Number 支持的最大数字
     * @param msg String 不符合判断是抛出的错误信息
     */
    validateRange (rule, value, callback, min, max, msg) {
      if ((min && max && (value < min || value > max))
        || (min && !max && value < min)
        || (!min && max && value > max)) {
        callback(msg)
      } else {
        callback()
      }
    }
  },
  watch: {
    data: {
      handler () {
        this.initData()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.settle-apply-expense-item{
  ::v-deep.has-error .ant-form-explain,
  .has-error .ant-form-split{
    white-space: nowrap;
    position: absolute;
  }
}
</style>
