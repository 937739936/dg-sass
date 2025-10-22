<template>
  <a-modal
      :visible="visible"
      :footer="null"
      width="460px"
      centered
      @cancel="handleCancel"
      :title="null"
  >
    <div class="title">
      <img src="~@/v2/assets/imgs/receive/modal-tip.png" alt="">确认删除
    </div>
    <div style="padding: 0 20px 20px">
      <div class="note">
        您确定要删除勾选发票？
      </div>
      <div class="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="goOn">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>

export default {
  data() {
    return {
      visible: false,
      url:''
    };
  },
  methods: {
    goOn() {
      this.visible = false
      this.$emit('next')
    },
    init(url){
      this.visible = true
      this.url = url
    },
    handleCancel() {
      this.visible = false
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  padding-top: 30px;
  margin-left: 30px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;

  img {
    width: 20px;
    margin-right: 4px;
    margin-bottom: 4px;
  }
}

/deep/ .ant-modal-body {
  padding: 0;
}
/deep/ .ant-modal-content{
  border-radius: 10px;
}
/deep/ .ant-modal-close-x{
  background: url("~@/v2/assets/imgs/receive/icon_delete.png") no-repeat;
  background-size: cover;
  .ant-modal-close-icon{
    display: none;
  }
}

.footer {
  text-align: right;

  .ant-btn {
    margin-left: 20px;
    width: 90px;
    color: rgba(0, 0, 0, 0.8);
    border: 1px solid #C6CDD8;
    height: 34px;
  }

  .ant-btn-primary {
    color: #FFFFFF;
    border: none;
  }
}

.note {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  padding-left: 10px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 48px;
}
</style>
