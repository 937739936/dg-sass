<template>
  <div class="business-line-info">
    <BaseInfoDescriptions v-if="isHasBusinessLine" :dataSource="displayItems" :columnsCountOneRow="3" bordered>
      <template slot="money" slot-scope="{ value }">
        <span v-if="value == 0 || value == '0'">
          {{ '随行就市' }}
        </span>
        <span v-else-if="!value">{{ '-' }}</span>
        <div v-else>
          <span class="payAmount-icon">¥</span>
          <span>{{ value }}/吨</span>
        </div>
      </template>
    </BaseInfoDescriptions>
    <a-form v-else :form="form" :colon="false" class="slFormDetail">
      <a-form-item label="业务线" :colon="false">
        <a-input
          style="width: 364px"
          disabled
          v-decorator="[
            'businessLine',
            {
              rules: [{ required: true, message: '业务线不能为空！' }],
              initialValue: '暂不关联',
            },
          ]"
        />
        <a-checkbox
          style="width: 20%; margin-left: 14px"
          v-model="isNotContract"
          @change="handleNotContractChange"
          :disabled="!enableeEdit"
          >暂不关联</a-checkbox
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';

export default {
  name: 'BusinessLineInfo',
  components: {
    BaseInfoDescriptions,
  },
  props: {
    businessLineDetail: {
      type: Object,
      default: () => {},
    },
    enableeEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      isNotContract: true, // 是否暂不关联
    };
  },
  computed: {
    businessLineDetailNotEmpty() {
      return this.businessLineDetail || {};
    },
    isHasBusinessLine() {
      if (this.businessLineDetailNotEmpty.businessLineNo) {
        return true;
      }
      return false;
    },
    displayItems() {
      let list = [];
      let businessLineDetail = this.businessLineDetailNotEmpty;
      list = [
        {
          label: '业务线号',
          value: businessLineDetail.businessLineNo,
          click: () => {
            this.$emit('handleBusinessLineClick', businessLineDetail.businessLineNo);
          }, // 点击事件（可选），不为空时value显示为可点击，点击时触发该事件
          isNeedCopy: false, // 是否需要复制功能，点击时复制value到粘贴板,
        },
        {
          label: '业务线',
          value: businessLineDetail.businessLineName || '-',
        },
        {
          label: '创建时间',
          value: businessLineDetail.createdDate || '-',
        },
        {
          label: '采购合同号',
          value: businessLineDetail.buyerContractNo || '-',
        },
        {
          label: '采购合同品名',
          value: businessLineDetail.upStreamGoodsName || '-',
        },
        {
          label: '采购合同单价',
          value: businessLineDetail.buyerContractUnitPrice,
          scopedSlots: {
            customRender: 'money',
          },
        },
        {
          label: '销售合同号',
          value: businessLineDetail.sellerContractNo || '-',
        },
        {
          label: '销售合同品名',
          value: businessLineDetail.downStreamGoodsName || '-',
        },
        {
          label: '销售合同单价',
          value: businessLineDetail.sellerContractUnitPrice,
          scopedSlots: {
            customRender: 'money',
          },
        },
      ];
      return list;
    },
  },
  watch: {
    businessLineDetail: {
      deep: true,
      handler(val) {
        let tempVal = val || {};
        if (tempVal.businessLineNo) {
          this.isNotContract = false;
        } else {
          this.isNotContract = true;
        }
      },
    },
  },
  methods: {
    formatMoneyText(text) {
      if (text == 0 || text == '0') {
        return '随行就市';
      }
      if (!text) {
        return '-';
      }
      return `¥${text}/吨`;
    },
    handleNotContractChange(e) {
      this.$emit('handleNotContractChange', e.target.checked);
    },
    validateBusinessLineInfo() {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (err) {
            reject('业务线信息填写有误');
            return;
          }
          resolve({});
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.business-line-info {
  // padding-bottom: 1px;
  margin-bottom: 50px;
  .slFormDetail {
    padding: 0 0;
    // padding-bottom: 20px;
  }
  .payAmount-icon {
    font-family: PingFangSC-Regular, PingFang SC;
  }
}
</style>