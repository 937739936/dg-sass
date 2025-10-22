<template>
  <div class="payment-base-info">
    <BaseInfoDescriptions :title="title" :dataSource="paymentInfoDesItems" bordered>
      <template slot="receiveAccNo">
        <a-tooltip v-if="receiveAccNo" placement="topRight" :align="{ offset: [12, 0] }">
          <template slot="title" v-if="bankCardTip">
            <div style="white-space: pre-wrap">{{ bankCardTip }}</div>
          </template>
          <div class="description-item-bank-card">
            <span>{{ receiveAccNo || '-' }} </span>
            <div class="bank-card-icon"></div>
          </div>
        </a-tooltip>
        <span v-else> - </span>
      </template>
      <template slot="payAmount" slot-scope="item">
        <span v-if="item.value" class="payAmount">
          <!-- <span class="payAmount-icon">¥ </span> -->
          <NumberFormatView :value="item.value" :isShowMoneyTip="true" :isShowMoneyIcon="true" />
        </span>
        <span v-else class="payAmount"> - </span>
      </template>
    </BaseInfoDescriptions>
  </div>
</template>

<script>
import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';
import NumberFormatView from '../NumberFormatView';
import { formatAccountNumber } from '@sub/utils/factory';

export default {
  name: 'PaymentBaseInfo',
  components: {
    BaseInfoDescriptions,
    NumberFormatView,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    basicInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    receiveAccNo() {
      let basicInfo = this.basicInfo ?? {};
      return formatAccountNumber(basicInfo.receiveAccNo);
    },
    paymentInfoDesItems() {
      let basicInfo = this.basicInfo ?? {};
      let items = [
        {
          label: '付款类型',
          value: basicInfo.paymentTypeDesc || '-',
        },
        {
          label: '付款方式',
          value: basicInfo.paymentMethodDesc || '-',
        },
        {
          label: '收款账号',
          value: this.receiveAccNo,
          scopedSlots: {
            customRender: 'receiveAccNo',
          },
        },
        {
          label: '资金来源',
          value: basicInfo.payTypeName || '-', // 资金类型
        },
        {
          label: '付款日期',
          value: basicInfo.planPayDate || '-', // 付款日期
        },
        {
          label: '付款金额',
          value: basicInfo.payAmount, // 付款金额
          scopedSlots: {
            customRender: 'payAmount',
          },
          style: {
            color: '#ff800f',
          },
          isNotShowOverflowTooltip: true,
        },
      ];
      if (basicInfo.comments) {
        items.push({
          label: '备注',
          value: basicInfo.comments, // 备注
        });
      }
      return items;
    },
    bankCardTip() {
      let basicInfo = this.basicInfo ?? {};
      let tip = '';
      if (basicInfo.receiveAccName) {
        tip += '名称：' + basicInfo.receiveAccName;
      }
      if (basicInfo.receiveAccBank) {
        if (tip) {
          tip += '\n';
        }
        tip += '开户行：' + basicInfo.receiveAccBank;
      }
      if (this.receiveAccNo) {
        if (tip) {
          tip += '\n';
        }
        tip += '账号：' + this.receiveAccNo;
      }
      return tip;
    },
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.payment-base-info {
  width: 100%;
  margin-bottom: 50px;
  .description-item-bank-card {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .bank-card-icon {
      flex-shrink: 0;
      margin-left: 4px;
      width: 14px;
      height: 10px;
      cursor: pointer;
      background: url(~@sub/assets/imgs/trade/pay/bank_card_active.png) no-repeat center;
      background-size: 100% 100%;
    }
  }
  .payAmount {
    color: #ff800f;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .payAmount-icon {
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
}
</style>
