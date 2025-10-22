<template>
  <div class="settle-apply-settle-info">
    <a-form-model
      ref="form"
      :rules="rules"
      :model="detailData"
      layout="inline">
      <a-row>
        <a-col :span="12" class="row">
          <a-form-model-item
            ref="settleQuantity"
            prop="settleQuantity"
            label="本次结算数量(吨)"
            :colon="false">
            <a-input
              @blur="calSettleUnitPrice('settleQuantity')"
              v-model="detailData.settleQuantity"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="settleUnitPrice"
            label="本次结算单价(元/吨)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.settleUnitPrice"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            ref="settleTotalPrice"
            prop="settleTotalPrice"
            label="本次货款价税合计(元)"
            :colon="false">
            <a-input
              @blur="calSettleUnitPrice('settleTotalPrice')"
              v-model="detailData.settleTotalPrice"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            ref="settleOtherPart1"
            prop="settleOtherPart1"
            label="本次其他扣款(元/吨)"
            :colon="false">
            <a-input
              @blur="calSettleAmount('settleOtherPart1')"
              v-model="detailData.settleOtherPart1"
              placeholder="如保证金等"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="settleOtherPart2"
            ref="settleOtherPart2"
            label="本次代收代垫(元)"
            :colon="false">
            <a-input
              @blur="calSettleAmount('settleOtherPart2')"
              v-model="detailData.settleOtherPart2"
              placeholder="运费等"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="currentSettleAmount"
            label="本次结算金额(元)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.currentSettleAmount"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="settledAmount"
            label="已结算金额(元)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.settledAmount"/>
          </a-form-model-item>
        </a-col>
        <a-col
          :span="12"
          class="row">
          <a-form-model-item
            prop="finishSettleQuantity"
            label="已结算数量(吨)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.finishSettleQuantity" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="settleTotalAmount"
            label="总结算金额(元)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.settleTotalAmount"/>
          </a-form-model-item>
        </a-col>
        <a-col
          :span="12"
          class="row">
          <a-form-model-item
            prop="totalSettleQuantity"
            label="总结算数量(吨)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.totalSettleQuantity" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12" class="row">
          <a-form-model-item
            prop="finishPayAmount"
            label="已付款金额(元)"
            :colon="false">
            <a-input
              disabled
              v-model="detailData.finishPayAmount"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row class="row textarea-wrap">
        <a-col :span="24">
          <a-form-model-item
            prop="comments"
            label="备注"
            :colon="false">
            <a-textarea v-model="detailData.comments"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-if="detailData.contractTemplate == CONSTANTS.contractTemplateDict.OFFLINE" class="row">
        <a-col :span="24">
          <a-form-model-item label="结算单附件" :colon="false">
            <single-upload
              value="ticketPdfUrl"
              :defaultFileList="defaultTicketPdfUrl"
              :isRequire="true"
              :limitType="['pdf']"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

  </div>
</template>
<script>
import SingleUpload from "components/upload/SingleUpload.vue";
export default {
  name: 'SettleApplySettleInfo',
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
      defaultTicketPdfUrl: [],
      rules:{
        settleQuantity: [
          { required: true, message: '结算数量必填，请填写', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,4})?$/, message: '数量为正数数字，最多四位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '数量为正数数字，最多四位小数')}, trigger: 'blur'}
        ],
        settleUnitPrice: [
          {pattern: /^\d+(\.\d{0,12})?$/, message: '请输入正数，最多12位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '0-99999999之间的数字')}, trigger: 'blur'}

        ],
        settleTotalPrice: [
          { required: true, message: '价税合计必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        settleOtherPart1: [
          { required: true, message: '其他扣款必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ],
        settleOtherPart2:[
          { required: true, message: '代收代垫必填，请填写', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请输入0-99999999间数字，最多两位小数', trigger: 'blur'},
          {validator: (rule, value, callback) => {return this.validateRange(rule, value, callback, 0, 99999999, '请输入0-99999999间数字，最多两位小数')}, trigger: 'blur'}
        ]
      }
    }
  },
  components: {SingleUpload},
  mounted() {
    this.initData()
  },
  methods: {
    initData () {
      this.detailData = JSON.parse(JSON.stringify(this.data))
      this.calSettleAmount()
      if (this.detailData.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
        if (this.detailData.ticketPdfUrl) {
          this.defaultTicketPdfUrl = [
            {
              uid: "0",
              name: "结算单附件.pdf",
              response: {
                url: this.detailData.ticketPdfUrl,
              },
              status: "done",
            },
          ];
        }
      }
    },
    calSettleUnitPrice(name) {
      /**
       * settleUnitPrice 结算单价=货款价税合计/结算数量
       * totalSettleQuantity  总结算数量=本次结算数量+已结算数量
       * @type {number}
       */

      const fieldValueObj = {
        "settleQuantity": this.detailData.settleQuantity,
        "settleTotalPrice": this.detailData.settleTotalPrice,
        "finishSettleQuantity": this.detailData.finishSettleQuantity
      }
      this.$set(this.detailData, 'totalSettleQuantity', (Number(fieldValueObj.settleQuantity||0) + Number(fieldValueObj.finishSettleQuantity||0)).toFixed(4))

      if (fieldValueObj.settleQuantity && fieldValueObj.settleTotalPrice) {
        this.$set(this.detailData, 'settleUnitPrice', (fieldValueObj.settleTotalPrice / fieldValueObj.settleQuantity).toFixed(12))
      }
      this.calSettleAmount(name);
    },
    calSettleAmount(name) {
      this.$refs[name].onFieldBlur()

      // 计算结算金额
      const fieldValueObj = {
        "settleTotalPrice": this.detailData.settleTotalPrice,
        "settleOtherPart1": this.detailData.settleOtherPart1,
        "settleOtherPart2": this.detailData.settleOtherPart2
      }
      let sum = 0;
      if (typeof fieldValueObj.settleTotalPrice != "undefined"
        && typeof fieldValueObj.settleOtherPart1 != "undefined"
        && typeof fieldValueObj.settleOtherPart2 != "undefined") {
        sum = fieldValueObj.settleTotalPrice * 1 - fieldValueObj.settleOtherPart1 * 1 + fieldValueObj.settleOtherPart2 * 1;
      }
      if (sum < 0) {
        this.$message.error("总结算金额不能为负值");
        this.$set(this.detailData, 'settleOtherPart2', '')
      }
      if (!isNaN(sum) && sum >= 0) {
        this.$set(this.detailData, 'settleTotalAmount', (sum+ Number(this.detailData.settledAmount)).toFixed(2))
        this.$set(this.detailData, 'currentSettleAmount', (sum).toFixed(2))
      }
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
      handler() {
        this.initData()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.settle-apply-settle-info{
  ::v-deep.has-error .ant-form-explain,
  .has-error .ant-form-split{
    white-space: nowrap;
    position: absolute;
  }
}
</style>