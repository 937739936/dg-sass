<template>
  <div class="settle-apply-quality-info-three">
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
      <a-col :span="12" class="row">
        <a-form-model-item prop="basicAshContent" label="合同基准灰分(≤%)" :colon="false">
          <a-input
            disabled
            v-model="detailData.basicAshContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="basicSulfurContent" label="合同基准硫分(≤%)" :colon="false">
          <a-input
            disabled
            v-model="detailData.basicSulfurContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="basicVolatileContent" label="合同基准挥发分(≤%)" :colon="false">
          <a-input
            v-model="detailData.basicVolatileContent"
            disabled/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="basicWaterContent" label="合同基准水分(≤%)" :colon="false">
          <a-input
            disabled
            v-model="detailData.basicWaterContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realAshContent" label="本次结算灰分(%)" :colon="false">
          <a-input
            placeholder="请输入8-20之间的值"
            v-model="detailData.realAshContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realSulfurContent" label="本次结算硫分(%)" :colon="false">
          <a-input
            placeholder="请输入0-3之间的值"
            v-model="detailData.realSulfurContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realVolatileContent" label="本次结算挥发分(%)" :colon="false">
          <a-input
            placeholder="请输入0-3之间的值"
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
        <a-form-model-item prop="offsetAshContent" label="本次灰分奖罚(元/吨)" :colon="false">
          <a-input
            :disabled="ifDisabledReward"
            @blur="rewardChange"
            placeholder="可输入负数"
            v-model="detailData.offsetAshContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="offsetSulfurContent" label="本次硫分奖罚(元/吨)" :colon="false">
          <a-input
            :disabled="ifDisabledReward"
            @blur="rewardChange"
            placeholder="可输入负数"
            v-model="detailData.offsetSulfurContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="offsetVolatileContent" label="本次挥发分奖罚(元/吨)" :colon="false">
          <a-input
            :disabled="ifDisabledReward"
            @blur="rewardChange"
            placeholder="可输入负数"
            v-model="detailData.offsetVolatileContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="offsetWaterContent" label="本次水分奖罚(元/吨)" :colon="false">
          <a-input
            :disabled="ifDisabledReward"
            @blur="rewardChange"
            placeholder="可输入负数"
            v-model="detailData.offsetWaterContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="offsetOther" label="本次其他奖罚(元/吨)" :colon="false">
          <a-input
            :disabled="ifDisabledReward"
            @blur="rewardChange"
            placeholder="可输入负数"
            v-model="detailData.offsetOther"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="offsetTotal" label="本次奖罚小计(元/吨)" :colon="false">
          <a-input
            disabled
            v-model="detailData.offsetTotal"/>
        </a-form-model-item>
      </a-col>
    </a-form-model>
  </div>
</template>
<script>
/**
 *结算单开具——品质奖罚——焦炭——3
 */
export default {
  name: 'SettleApplyQualityInfoThree',
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
    },
    ifDisabledReward:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      detailData: {},
      rules: {
        realAshContent: [
          { required: this.ifNeedValid, message: '结算灰分必填，请填写', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写8到20间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 8, 20, '请填写8到20间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realSulfurContent: [
          {required: this.ifNeedValid, message: '结算硫分必填，请填写', trigger: 'blur'},
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到3间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 3, '请填写0到3间的数字，最多两位小数')}, trigger: 'blur'}
        ],
        realVolatileContent:[
          { required: this.ifNeedValid, message: '结算挥发分必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到3间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 3, '请填写0到3间的数字，最多两位小数')}, trigger: 'blur'}
        ],
        realWaterContent:[
          { required: this.ifNeedValid, message: '结算水分必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请填写0到30间的数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 30, '请填写0到30间的数字，最多两位小数')}, trigger: 'blur'}
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
        offsetAshContent:[{ required: this.ifNeedValid && !this.ifDisabledReward, message: '灰分奖罚必填，请填写', trigger: 'blur' }],
        offsetTotal:[{ required: this.ifNeedValid && !this.ifDisabledReward, message: '奖罚小计不能为空', trigger: 'blur' }]
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
        "offsetAshContent": this.detailData.offsetAshContent,
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
.settle-apply-quality-info-three{

}
</style>