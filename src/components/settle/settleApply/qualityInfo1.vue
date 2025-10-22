<template>
  <div class="settle-apply-quality-info-one">
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
        <a-col :span="12" class="row">
          <a-form-model-item
            label="合同基准热值(kcal/kg)"
            class="range-input m0"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.basicHeatingValMin"/>
          </a-form-model-item>
          <a-form-model-item class="range-input m0">
            <span class="range-text">至</span>
          </a-form-model-item>
          <a-form-model-item class="range-input">
            <a-input
              disabled
              v-model="detailData.basicHeatingValMax"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item label="合同基准硫分(%)" :colon="false">
            <a-input
              disabled
              v-model="detailData.basicSulfurContent"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item label="合同基准挥发分(%)" class="range-input m0" :colon="false">
            <a-input
              disabled
              v-model="detailData.basicVolatileContentMin"/>
            <a-form-model-item class="range-input m0">
              <span class="range-text">至</span>
            </a-form-model-item>
            <a-form-model-item class="range-input m0">
              <a-input
                disabled
                v-model="detailData.basicVolatileContentMax"/>
            </a-form-model-item>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item label="合同基准水分(%)" :colon="false">
            <a-input
              disabled
              v-model="detailData.basicWaterContent" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="realHeatingVal" label="本次结算热值(kcal/kg)" :colon="false">
            <a-input
              placeholder="请输入1000-7500之间的整数"
              v-model="detailData.realHeatingVal" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="realSulfurContent" label="本次结算硫分(%)" :colon="false">
            <a-input
              placeholder="请输入0-10之间的值"
              v-model="detailData.realSulfurContent"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="realVolatileContent" label="本次结算挥发分(%)" :colon="false">
            <a-input
              placeholder="请输入0-60之间的值"
              v-model="detailData.realVolatileContent"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="realWaterContent" label="本次结算水分(%)" :colon="false">
            <a-input
              placeholder="请输入0-30之间的值"
              v-model="detailData.realWaterContent"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="offsetHeatingVal" label="本次热值奖罚(元/吨)" :colon="false">
            <a-input
              @blur="rewardChange"
              placeholder="可输入负数"
              v-model="detailData.offsetHeatingVal" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="offsetSulfurContent" label="本次硫分奖罚(元/吨)" :colon="false">
            <a-input
              @blur="rewardChange"
              placeholder="可输入负数"
              v-model="detailData.offsetSulfurContent" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="offsetVolatileContent" label="本次挥发分奖罚(元/吨)" :colon="false">
            <a-input
              @blur="rewardChange"
              placeholder="可输入负数"
              v-model="detailData.offsetVolatileContent" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="offsetWaterContent" label="本次水分奖罚(元/吨)" :colon="false">
            <a-input
              @blur="rewardChange"
              placeholder="可输入负数"
              v-model="detailData.offsetWaterContent"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item prop="offsetOther" label="本次其他奖罚(元/吨)" :colon="false">
            <a-input
              @blur="rewardChange"
              placeholder="可输入负数"
              v-model="detailData.offsetOther"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item label="本次奖罚小计(元/吨)" :colon="false">
            <a-input
              disabled
              v-model="detailData.offsetTotal" />
          </a-form-model-item>
        </a-col>
    </a-form-model>
  </div>
</template>
<script>
/**
 *结算单开具——品质奖罚——动力煤——1
 */
export default {
  name: 'SettleApplyQualityInfoOne',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    ifNeedValid:{
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      detailData: {},
      rules: {
        realHeatingVal: [
          {required: this.ifNeedValid, message: '结算热值必填，请填写', trigger: 'blur'},
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请填写1000到7500间的整数数字', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 1000, 7500, '请填写1000到7500间的整数数字')}, trigger: 'blur'}
        ],
        realSulfurContent: [
          {required: this.ifNeedValid, message: '结算硫分必填，请填写', trigger: 'blur'},
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到10间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 10, '请填写0到10间的数字，最多两位小数')}, trigger: 'blur'}
        ],
        realVolatileContent:[
          { required: this.ifNeedValid, message: '结算挥发分必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到60间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 60, '请填写0到60间的数字，最多两位小数')}, trigger: 'blur'}
        ],
        realWaterContent:[
          { required: this.ifNeedValid, message: '结算水分必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到30间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 30, '请填写0到30间的数字，最多两位小数')}, trigger: 'blur'}
        ],
        offsetHeatingVal:[
          { required: this.ifNeedValid, message: '热值奖罚必填，请填写', trigger: 'blur' },
          { pattern: /^(-?)\d+(\.\d{0,2})?$/, message: '请填写数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, -99999999, 99999999, '超出范围')}, trigger: 'blur'}
        ],
        offsetSulfurContent:[
          { required: this.ifNeedValid, message: '硫分奖罚必填，请填写', trigger: 'blur' },
          { pattern: /^(-?)\d+(\.\d{0,2})?$/, message: '请填写数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, -99999999, 99999999, '超出范围')}, trigger: 'blur'}
        ],
        offsetVolatileContent:[
          { required: this.ifNeedValid, message: '挥发分奖罚必填，请填写', trigger: 'blur' },
          { pattern: /^(-?)\d+(\.\d{0,2})?$/, message: '请填写数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, -99999999, 99999999, '超出范围')}, trigger: 'blur'}
        ],
        offsetWaterContent:[
          { required: this.ifNeedValid, message: '水分奖罚必填，请填写', trigger: 'blur' },
          { pattern: /^(-?)\d+(\.\d{0,2})?$/, message: '请填写数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, -99999999, 99999999, '超出范围')}, trigger: 'blur'}
        ],
        offsetOther:[
          { required: this.ifNeedValid , message: '其他奖罚必填，请填写', trigger: 'blur' },
          { pattern: /^(-?)\d+(\.\d{0,2})?$/, message: '请填写数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, -99999999, 99999999, '超出范围')}, trigger: 'blur'}
        ],
        offsetTotal:[{ required: false, message: '奖罚小计不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.detailData = JSON.parse(JSON.stringify(this.data))
    },
    rewardChange() {
      let sum = 0;
      let fieldValueObj = {
        "offsetHeatingVal": this.detailData.offsetHeatingVal,
        "offsetSulfurContent": this.detailData.offsetSulfurContent,
        "offsetVolatileContent": this.detailData.offsetVolatileContent,
        "offsetWaterContent": this.detailData.offsetWaterContent,
        "offsetOther": this.detailData.offsetOther,
      }
      for (let i in fieldValueObj) {
        if (typeof fieldValueObj[i] != "undefined") {
          sum = sum + fieldValueObj[i] * 1;
        }
      }
      if (!isNaN(sum)) this.$set(this.detailData, 'offsetTotal', sum.toFixed(2))
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
.settle-apply-quality-info-one{

}
</style>