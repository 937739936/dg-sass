<template>
  <a-modal
    :width="width"
    :visible="visible"
    :footer="null"
    :title="null"
    centered
    @cancel="close"
    destroyOnClose
  >
    <div class="title">{{ title }}</div>
    <div class="main">
      <slot></slot>
    </div>
    <div v-if="footer" class="footer">
      <slot name="footer">
        <a-button @click="close"> {{ cancelText }} </a-button>
        <a-button type="primary" :loading="loading" @click="verify">
          {{ okText }}
        </a-button>
      </slot>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    width: {
      type: [String, Number],
      default: 520,
    },
    okText: {
      type: [String],
      default: "确定",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: [String],
      default: "取消",
    },
    footer: {
      type: [Boolean],
      default: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    async verify() {
      await this.$emit("verify");
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.8);
  background: #f3f5f6;
  padding: 20px;
}

/deep/.ant-modal-content {
  border-radius: 10px;
  overflow: hidden;
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-close-x {
    position: relative;
    &::after {
      display: block;
      content: "";
      background-image: url(~@/v2/assets/imgs/common/close_modal_icon.png);
      width: 14px;
      height: 14px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-size: cover;
    }
    .ant-modal-close-icon {
      display: none;
    }
  }
}
.main {
  padding: 20px;
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
}
.footer {
  padding: 20px;
  border-top: 1px solid #e5e6eb;
  text-align: right;

  /deep/.ant-btn {
    margin-left: 20px;
    padding: 0 30px;
    color: rgba(0, 0, 0, 0.4);
    border: 1px solid #c3c3c3;
  }
  /deep/.ant-btn-primary {
    color: #ffffff;
    border: none;
  }
}
</style>
