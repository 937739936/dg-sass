<template>
  <div class="send-and-pay">
    <div class="slTitleAssis" style="margin-bottom: 20px">放款信息</div>
    <div class="returned-info-top">
      <div class="returned-info-top-item">
        <p class="c4 ft14 fw600">拟融资金额</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.planFinancingAmount">
          ￥{{ formatMoney(sendAndPayInfo.planFinancingAmount) }}
        </p>
        <span class="c8 ft20 fw600" v-else>-</span>
      </div>
      <div class="returned-info-top-item common">
        <p class="c4 ft14 fw600">放款金额</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.finAmount">￥{{ formatMoney(sendAndPayInfo.finAmount) }}</p>
        <p class="c8 ft20 fw600" v-else>-</p>
      </div>
      <div class="returned-info-top-item common2">
        <p class="c4 ft14 fw600">融资起息日</p>
        <p class="c8 ft20 fw600">{{ sendAndPayInfo.beginDate || '-' }}</p>
      </div>
      <div class="returned-info-top-item">
        <p class="c4 ft14 fw600" style="margin: 0">融资到期日</p>
        <p class="c8 ft20 fw600">{{ sendAndPayInfo.endDate || '-' }}</p>
      </div>
      <div class="returned-info-top-item common" v-if="isBank">
        <p class="c4 ft14 fw600" style="margin: 0">融资方</p>
        <p class="c8 ft20 fw600">{{ sendAndPayInfo.financier || '-' }}</p>
      </div>
      <div class="returned-info-top-item common2" v-if="sendAndPayInfo.forwardCharge == 1">
        <p class="c4 ft14 fw600" style="margin: 0">利息收取方式</p>
        <p class="c8 ft20 fw600">{{ sendAndPayInfo.interestTypeDesc || '-' }}</p>
      </div>
      <div class="returned-info-top-item" v-if="sendAndPayInfo.forwardCharge == 1">
        <p class="c4 ft14 fw600" style="margin: 0">利息</p>
        <p class="c8 ft20 fw600">{{ sendAndPayInfo.loanInterest || '-' }}</p>
      </div>
    </div>
    <div class="slTitleAssis" style="margin-bottom: 20px">还款信息</div>
    <div class="returned-info-top">
      <div class="returned-info-top-item">
        <p class="c4 ft14 fw600">应还本金</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.finAmount">￥{{ formatMoney(sendAndPayInfo.finAmount) }}</p>
        <p class="c8 ft20 fw600" v-else>-</p>
      </div>
      <div class="returned-info-top-item common">
        <p class="c4 ft14 fw600">已还本金合计</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.finAmount">
          ￥{{ formatMoney(accSub(sendAndPayInfo.finAmount, sendAndPayInfo.unPayPrincipal)) }}
        </p>
        <p class="c8 ft20 fw600" v-else>-</p>
      </div>
      <div class="returned-info-top-item common2">
        <p class="c4 ft14 fw600">未还本金合计</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.unPayPrincipal">
          ￥{{ formatMoney(sendAndPayInfo.unPayPrincipal) }}
        </p>
        <p class="c8 ft20 fw600" v-else>-</p>
      </div>
      <div class="returned-info-top-item">
        <p class="c4 ft14 fw600">已还款总额</p>
        <p class="c8 ft20 fw600" v-if="sendAndPayInfo.totalRepayAmount">
          ￥{{ formatMoney(sendAndPayInfo.totalRepayAmount) }}
        </p>
        <p class="c8 ft20 fw600" v-else>-</p>
      </div>
    </div>
    <a-table
      rowKey="name"
      class="new-table"
      style="margin-top: 30px"
      :columns="columns"
      :dataSource="sendAndPayInfo.repayList"
      :pagination="false"
      :defaultExpandAllRows="true"
      :locale="{ emptyText: '暂无数据' }"
    >
    </a-table>
    <div class="apply-box" style="margin-top: 30px">
      <div class="slTitleAssis" style="margin: 0px">还款申请记录</div>
      <div class="export-box" @click="pushAndSyncLoan">
        <RefreshIcon></RefreshIcon>
        <span class="export-text">数据同步</span>
      </div>
    </div>
    <a-table
      rowKey="name"
      class="new-table"
      style="margin-top: 20px"
      :columns="columns2"
      :dataSource="sendAndPayInfo.repayApplyList"
      :pagination="false"
      :defaultExpandAllRows="true"
      :locale="{ emptyText: '暂无数据' }"
    >
      <template slot="statusText" slot-scope="text, record">
        <span class="status" :class="record.status">{{ record.statusText }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { RefreshIcon } from '@sub/components/svg';
const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 80,
    align: 'center',
    customRender: function (t, r, index) {
      return parseInt(index) + 1;
    },
  },
  {
    title: '还款日期',
    dataIndex: 'repayDate',
  },
  {
    title: '还款总额',
    dataIndex: 'repayAmount',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  {
    title: '还款本金',
    dataIndex: 'repayPrincipal',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  {
    title: '还款利息',
    dataIndex: 'repayInterest',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  {
    title: '其他费用',
    dataIndex: 'serviceCharge',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
];
const columns2 = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 80,
    align: 'center',
    customRender: function (t, r, index) {
      return parseInt(index) + 1;
    },
  },
  {
    title: '还款申请编号',
    dataIndex: 'serialNo',
  },
  {
    title: '收款方',
    dataIndex: 'financier',
  },
  {
    title: '还款日期',
    dataIndex: 'repayDate',
  },
  {
    title: '还款总额',
    dataIndex: 'repayAmount',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  {
    title: '还款本金',
    dataIndex: 'repayPrincipal',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  {
    title: '还款利息',
    dataIndex: 'repayInterest',
    customRender: (t) => (t ? `￥${formatMoney(t)}` : '-'),
  },
  { title: '状态', key: 'statusText', dataIndex: 'statusText', scopedSlots: { customRender: 'statusText' } },
  {
    title: '审核意见',
    dataIndex: 'remark',
    fixed: 'right',
  },
];
export default {
  props: {
    sendAndPayInfo: {
      default: () => {
        return {};
      },
    },
    API_FinancingJRSync: {},
    type: {
      default: 'rest',
    },
  },

  data() {
    return {
      columns,
      columns2,
    };
  },
  computed: {
    VUEX_ST_COMPANYSUER() {
      if (this.$store.state.user) {
        return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
      }
      return {};
    },
    // 判断当前是否是金融机构
    isBank() {
      return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
    },
  },
  methods: {
    formatMoney,
    accSub(arg2, arg1) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = r1 >= r2 ? r1 : r2;
      return ((Math.round(arg2 * m) - Math.round(arg1 * m)) / m).toFixed(n);
    },
    pushAndSyncLoan() {
      if (!this.sendAndPayInfo.id) {
        this.$message.error('数据异常');
        return;
      }
      this.$confirm({
        centered: true,
        title: '确定同步吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.API_FinancingJRSync({
            loanId: this.sendAndPayInfo.id,
          }).then((res) => {
            if (res.data) {
              this.$emit('syncLoan');
              this.$message.success('同步成功');
            }
          });
        },
        onCancel() {},
      });
    },
  },
  components: {
    RefreshIcon,
  },
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.send-and-pay {
  width: 100%;
  .returned-info-top {
    width: 100%;
    row-gap: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 20px;
    &-item {
      // width: 188px;
      height: 100px;
      flex-shrink: 0;
      padding: 20px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      background: #f0f8ff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // margin-right: 20px;
      flex: 1;
      &.common {
        background: #ebfaef;
      }
      &.common2 {
        background: #fff9e9;
      }
    }
  }
  .returned-info-left {
    display: flex;
    align-items: center;
  }
}
.apply-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .export-box {
    display: flex;
    align-items: center;
    color: @primary-color;
    cursor: pointer;
    font-weight: 400;
    .export-text {
      margin-left: 6px;
    }
  }
}
.c4 {
  color: rgba(0, 0, 0, 0.4);
}
.c8 {
  color: rgba(0, 0, 0, 0.8);
}
.ft14 {
  font-size: 14px;
}
.ft20 {
  font-size: 20px;
}
.fw600 {
  font-weight: 600;
}
.status {
  display: inline-block;
  padding: 1px 6px;
  align-items: flex-start;
  gap: 10px;
  text-align: center;
  border-radius: 4px;
  font-family: PingFang SC;
  font-size: 12px;
  background: #c9daff;
  color: #596fa0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
}
.REPAID {
  background: #c5ecdd;
  color: #3eb384;
}
.REJECT,
.RECEIVE_RETURN,
.PLATFORM_REJECT {
  background: #e0e0e0;
  color: #a8a8a8;
}
.PLATFORM_AUDIT {
  background: #ffdac8;
  color: #ff7937;
}
</style>
