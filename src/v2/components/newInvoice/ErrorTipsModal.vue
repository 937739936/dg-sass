<template>
  <a-modal
      :visible="visible"
      :footer="null"
      centered
      width="490px"
      @cancel="handleCancel"
      :title="null"
      :destroyOnClose="true"
  >
    <div class="title">
      信息提示
    </div>
    <div style="padding: 20px 20px">

      <div v-if="failsNo.length">
        <div class="sub-title">
          发票号码
        </div>
        <div class="desc">
          <span v-for="item in failsNo" :key="item">【{{ item }}】</span>
          <span v-if="type == 'hc'">
            未查询到发票红冲
          </span>
          <span v-if="type == 'zf'">
            未查询到发票作废
          </span>
          <span v-if="type == 'sc'">
            查询到合同关联了付款
          </span>
        </div>
      </div>

      <div v-if="type== 'sc' && failsCompleteNo.length">
        <div class="sub-title">
          发票号码
        </div>
        <div class="desc">
          <span v-for="item in failsCompleteNo" :key="item">【{{ item }}】</span>
          <span>
            查询到合同业务线已完结，不能删除
          </span>
        </div>
      </div>


      <div style="margin-top: 20px" v-if="successNo.length">
        <div class="sub-title">
          发票号码
        </div>
        <div class="desc">
          <span v-for="item in successNo" :key="item">【{{ item }}】</span>
          <span v-if="type == 'hc'">
            查询到发票红冲，点击确认完成部分发票红冲
          </span>
          <span v-if="type == 'zf'">
            查询到发票作废，点击确认完成部分发票作废
          </span>
          <span v-if="type == 'sc'">
            可以删除，点击确认删除部分发票
          </span>
        </div>
      </div>
    </div>
    <div class="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleSubmit">确认</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      fails: [],
      failsNo: [],
      failsComplete: [],
      failsCompleteNo: [],
      success: [],
      successNo: [],
      type: ''
    };
  },
  methods: {
    init(props) {
      this.visible = true
      this.type = props.type
      this.fails = props.fails
      this.success = props.success
      this.failsComplete = props.failsComplete
      this.failsNo = props.failsNo
      this.failsCompleteNo = props.failsCompleteNo
      this.successNo = props.successNo
    },
    handleCancel() {
      this.visible = false
    },
    handleSubmit() {
      this.visible = false
      this.$emit('next', {
        success: this.success,
        fails: this.fails,
        failsComplete: this.failsComplete,
        type: this.type
      })
    },
  }
};
</script>
<style lang="less" scoped>
.title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 58px;
  color: rgba(0, 0, 0, 0.8);
  background: #F3F5F6;
  padding-left: 20px;
  border-radius: 8px 8px 0px 0px;
}


/deep/ .ant-modal-body {
  padding: 0;
}

/deep/ .ant-modal-close-x {
  background: url("~@/v2/assets/imgs/receive/icon_delete.png") no-repeat;
  background-size: cover;

  .ant-modal-close-icon {
    display: none;
  }
}

.footer {
  text-align: right;
  border-top: 1px solid #E5E6EB;
  padding-top: 18px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-top: 20px;

  .ant-btn {
    margin-left: 20px;
    width: 90px;
    color: rgba(0, 0, 0, 0.8);
    border: 1px solid #C6CDD8;
  }

  .ant-btn-primary {
    color: #FFFFFF;
    border: none;
  }
}


.zf-textarea {
  width: 450px;
  height: 150px !important;
  font-size: 14px;
  line-height: 20px;
  padding: 16px 14px;
  background: #F3F5F6;
  color: rgba(0, 0, 0, 0.8);

  &::-webkit-input-placeholder {
    color: #8191A9;
  }
}

/deep/ .ant-modal-content {
  border-radius: 10px;
}

.sub-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #77889D;
  margin-bottom: 4px;
  padding-left: 8px;
}

.desc {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.8);
}
</style>
