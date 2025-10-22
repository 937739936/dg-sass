<template>
  <a-modal class="modal-wrap" :title="title" :visible="visible" :width="width" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
    <p>{{ ModalText }}</p>
  </a-modal>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 600,
    }
  },
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: true,
      confirmLoading: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.modal-wrap {
  /deep/ .anticon-close {
    display: none;
  }
  /deep/ .ant-modal-close-x {
    background-image: url('~v2/assets/imgs/common/close_modal_icon.png');
    background-position: center;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }
  /deep/ .ant-modal-header {
    height: 58px;
    background: rgba(243, 245, 246, 1);
    border: none;
  }
  /deep/ .ant-modal-title {
    font-weight: 500;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.8);
    font-family: PingFang SC;
  }
}
</style>
