<template>
  <div class="settle-apply-quality-info-four">
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
      <a-col :span="12" class="row">
        <a-form-model-item prop="realAshContent" label="本次结算灰分(Ad)(≤)(%)" :colon="false">
          <a-input
            placeholder="请输入10-11之间的值"
            v-model="detailData.realAshContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realSulfurContent" label="本次结算硫分(St,d)(≤)(%)" :colon="false">
          <a-input
            placeholder="请输入0.3-3.0之间的值"
            v-model="detailData.realSulfurContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realVolatileContent" label="本次结算挥发分(Vdaf)(≤)(%)" :colon="false">
          <a-input
            placeholder="请输入22-28之间的值"
            v-model="detailData.realVolatileContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realWaterContent" label="本次结算水分(Mt)(≤)(%)" :colon="false">
          <a-input
            placeholder="请输入5-10之间的值"
            v-model="detailData.realWaterContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realGContent" label="本次结算G(≥)" :colon="false">
          <a-input
            placeholder="请输入70-95之间的值"
            v-model="detailData.realGContent" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realYContent" label="本次结算Y(≥)(mm)" :colon="false">
          <a-input
            placeholder="请输入大于或等于13的值"
            v-model="detailData.realYContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realYxContent" label="本次结算岩相" :colon="false">
          <a-input
            placeholder="请输入0-0.2之间的值"
            v-model="detailData.realYxContent"/>
        </a-form-model-item>
      </a-col>
      <a-col :span="12" class="row">
        <a-form-model-item prop="realRqdContent" label="本次结算热强度(≥)" :colon="false">
          <a-input
            placeholder="请输入55-80之间的值"
            v-model="detailData.realRqdContent"/>
        </a-form-model-item>
      </a-col>
    </a-form-model>

  </div>
</template>
<script>
/**
 *结算单开具——品质奖罚——焦煤——4
 */
export default {
  name: 'SettleApplyQualityInfoFour',
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
      detailData: {},
      rules: {
        realAshContent: [
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写10到11间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 10, 11, '请填写10到11间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realSulfurContent: [
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写0.3到3.0间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0.3, 3.0, '请填写0.3到3.0间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realVolatileContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写22到28间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 22, 28, '请填写22到28间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realWaterContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写5到10间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 5, 10, '请填写5到10间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realGContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写70到95间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 70, 95, '请填写70到95间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realYContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写大于或等于13的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 13, undefined, '请填写大于或等于13的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realYxContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写0到0.2间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 0.2, '请填写0到0.2间的数字，最多四位小数')}, trigger: 'blur'}
        ],
        realRqdContent:[
          { pattern: /^\d+(\.\d{0,4})?$/, message: '请填写55到80间的数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 55, 80, '请填写55到80间的数字，最多四位小数')}, trigger: 'blur'}
        ]
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
.settle-apply-quality-info-four{
  ::v-deep.ant-form-item-label label{
    //width: 176px !important;
    //margin-right: 0px !important;
    white-space: pre-wrap;
    line-height: 18px;
  }
}
</style>