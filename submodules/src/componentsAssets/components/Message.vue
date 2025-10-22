<template>
  <div>
    <a-drawer
      title=""
      placement="right"
      :closable="false"
      width="420px"
      :maskClosable="true"
      :visible="show"
      @close="triggerShow"
      :mask="false"
      :zIndex="200"
      class="message-center-drawer"
    >
      <div class="title">
        【企业主体】风险预警消息({{ total }})
        <div class="close" @click="triggerShow">
          <img src="@sub/assets/imgs/common/modal-close.png" alt="" />
        </div>
      </div>
      <div class="body">
        <div class="msg" v-for="(item, key) in messageDetailList" :key="key">
          <a-tooltip>
            <template slot="title">【{{ item.typeBelongDesc }}】 {{ item.messageContent }} </template>
            <div @click="pushMessageDetail(item)">
              <div class="msg-tip hign" v-if="item.riskLevel == 'HIGH'"></div>
              <div class="msg-tip medium" v-if="item.riskLevel == 'MEDIUM'"></div>
              <div class="msg-tip low" v-if="item.riskLevel == 'LOW'"></div>
              <div class="msg-title">【{{ item.typeBelongDesc }}】 {{ item.messageContent }}</div>
              <div class="msg-time">
                {{ item.alertDate }}
              </div>
              <div class="msg-level hign" v-if="item.riskLevel == 'HIGH'">
                {{ item.riskLevelDesc }}
              </div>
              <div class="msg-level medium" v-if="item.riskLevel == 'MEDIUM'">
                {{ item.riskLevelDesc }}
              </div>
              <div class="msg-level low" v-if="item.riskLevel == 'LOW'">
                {{ item.riskLevelDesc }}
              </div>
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="bottom">
        <router-link :to="`/data/risk/list?type=company&alertStatuses=TO_BE_PROCESS&companyName=${companyName}`">
          查看更多
          <img src="@sub/assets/imgs/common/right_arrow_icon.png" alt="" />
        </router-link>
      </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      companyName: '',
      messageDetailList: [],
      show: false,
    };
  },
  inject: {
    listCompanyRiskMessageNoticeParent: { form: 'listCompanyRiskMessageNoticeParent', default: null },
  },
  created() {},
  methods: {
    async init(Obj) {
      this.companyName = Obj.name || '';
      if (this.listCompanyRiskMessageNoticeParent) {
        let res = await this.listCompanyRiskMessageNoticeParent(Obj.companyCreditCode);
        if (res.success) {
          this.total = res.data.total;
          this.messageDetailList = res.data.messageDetailList;
        }
        this.show = true;
      }
    },
    triggerShow() {
      this.show = !this.show;
    },
    pushMessageDetail(item) {
      if (item.ruleType === 'MARKET_PRICE') {
        if (item.alertTypeBelong === 'PRICE_FAIL') {
          let path = '/data/risk/priceWarningDetail';
          this.$router.push({
            path: path,
            query: {
              id: item.recordId,
            },
          });
        } else {
          let path = '/data/makeToMarket/earlyWarning/detail';
          this.$router.push({
            path: path,
            query: {
              serialNo: item.recordNo,
              id: item.recordId,
            },
          });
        }
      } else if (item.ruleType === 'OTHER') {
        let path = '/data/risk/certDetail';
        this.$router.push({
          path: path,
          query: {
            id: item.recordId,
          },
        });
      } else if (item.ruleType === 'COMPANY') {
        let path = '/data/risk/subjectDetail';
        this.$router.push({
          path: path,
          query: {
            id: item.recordId,
          },
        });
      } else if (item.ruleType === 'DEVICE') {
        let path = '/data/risk/deviceDetail';
        this.$router.push({
          path: path,
          query: {
            id: item.recordId,
          },
        });
      } else if (item.ruleType === 'INVENTORY') {
        let path = '/data/risk/inventoryDetail';
        this.$router.push({
          path: path,
          query: {
            id: item.recordId,
          },
        });
      } else {
        let path = '';
        switch (item.alertType) {
          case 'YJWL':
            path = '/data/risk/shipDetail';
            break;
          default:
            path = '/data/risk/detail';
        }
        this.$router.push({
          path: path,
          query: {
            id: item.recordId,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.message-center-drawer {
  height: calc(100vh - 110px);
  margin-top: 110px;
  /deep/ .ant-drawer-content {
    overflow: hidden;
    border-radius: 6px;
  }
  /deep/ .ant-drawer-body {
    height: 100%;
    overflow: hidden;
    padding: 0px;
  }
  /deep/ .ant-drawer-content-wrapper {
    box-shadow: 0 2px 4px 0 rgba(54, 58, 80, 0.32);
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
  }
}
.title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  margin: 20px 16px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef3;
  display: flex;
  justify-content: space-between;
  .close {
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border-radius: 4px;
    font-size: 14px;
    color: #8495aa;
    text-align: center;
    cursor: pointer;
    line-height: 16px;
    &:hover {
      background: rgba(132, 149, 170, 0.1);
    }
    img {
      width: 18px;
    }
  }
}

.body {
  padding: 14px;
  overflow-y: scroll;
  height: calc(100% - 102px);
  .msg {
    padding: 10px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    position: relative;
    line-height: 22px;
    cursor: pointer;
    &:hover {
      background: #f4f4f4;
    }
    .msg-tip {
      position: absolute;
      width: 6px;
      height: 6px;
      left: 10px;
      top: 20px;
      border-radius: 50%;
      background: #dd4444;
    }
    .msg-level {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      font-weight: 599;
      color: #ffffff;
      right: 10px;
      top: 13px;
    }
    .hign {
      background: #dd4444;
    }
    .medium {
      background: #f5822e;
    }
    .low {
      background: #147cf6;
    }
    .msg-title {
      padding-left: 20px;
      height: 22px;
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.8);
    }
    .msg-content {
      padding-left: 28px;
      color: rgba(147, 158, 175, 1);
    }
    .msg-time {
      padding-left: 28px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}

.bottom {
  position: absolute;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1890ff;
  line-height: 20px;
  padding-top: 13px;
  border-top: 1px solid #ebeef3;
  left: 0;
  width: 100%;
  bottom: 10px;
  text-align: center;
  a {
    color: #939eaf;
    img {
      width: 14px;
      margin-bottom: 3px;
    }
  }
}
</style>
