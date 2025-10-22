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
    <slot name="footer">
      <div class="footer">
        <a-button @click="close"> {{ cancelText }} </a-button>
        <a-button type="primary" :loading="loading" @click="verify">
          {{ okText }}
        </a-button>
      </div>
    </slot>
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
      default: 500,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: [String],
      default: "确定",
    },
    cancelText: {
      type: [String],
      default: "取消",
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
  font-size: 20px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.8);
}

/deep/.ant-modal-content {
  border-radius: 10px;
  overflow: hidden;
  .ant-modal-body {
    padding: 20px;
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
  .icon-danchuang-closeicon {
    font-size: 32px;
    color: rgba(195, 195, 195, 1);
  }
}

.main {
  margin: 14px 0;
}
.footer {
  text-align: right;

  .ant-btn {
    margin-left: 20px;
    padding: 0 30px;
    color: rgba(0, 0, 0, 0.4);
    border: 1px solid #c3c3c3;
  }

  .ant-btn-primary {
    color: #ffffff;
    border: none;
  }
}
</style>
