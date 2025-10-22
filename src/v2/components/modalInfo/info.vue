<template>
  <a-modal
    class="slModal"
    :visible="visible"
    :width="width"
    @cancel="close"
    :footer="null"
    :title="null"
  >
    <div class="title-box">
      <a-space :size="14">
        <ConfirmIcon style="position: relative; top:3px;"></ConfirmIcon>
        <span class="title">{{ title }}</span>
      </a-space>
    </div>
    <div class="tip" v-html="tip"></div>
    <div v-if="footer" class="footer">
      <slot name="footer">
        <a-button @click="close">
          {{ cancelText }}
        </a-button>
        <a-button type="primary" :loading="loading" @click="verify">
          {{ okText }}
        </a-button>
      </slot>
    </div>
  </a-modal>
</template>

<script>
import { ConfirmIcon } from '@sub/components/svg'
export default {
  props: {
    title: {
      type: [String],
      default: "消息提示",
    },
    tip: {
      type: [String],
      default: "",
    },
    width: {
      type: [String, Number],
      default: 460,
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
    open() {
      this.visible = true;
    },
    close() {
      //是否存在父组件关闭调用，关闭阻塞
      if (this.$listeners.close) {
        this.$emit("close");
      }
      this.visible = false;
    },
    async verify() {
      await this.$emit("verify");
    },
  },
  components: {
    ConfirmIcon
  },
};
</script>

<style scoped lang="less">
/deep/.ant-modal-content {
  border-radius: 10px;
  overflow: hidden;
  .ant-modal-body {
    padding: 20px;
  }
}
.title-box {
  display: flex;
  align-items: center;
  .icon {
    color: #4682f3;
    font-size: 20px;
  }
  .title {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
  }
}
.tip {
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.5);
  margin: 20px 0 30px;
}
.icon {
  width: 16px;
  height: 16px;
  img {
    width: 16px;
    height: 16px;
  }
}
.footer {
  text-align: right;

  /deep/.ant-btn {
    margin-left: 20px;
    padding: 0 20px;
    min-width: 88px;
    color: rgba(0, 0, 0, 0.8);
    border: 1px solid #e5e6eb;
  }
  /deep/.ant-btn-primary {
    color: #ffffff;
    border: none;
  }
}
</style>
