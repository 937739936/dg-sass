<template>
  <a-modal
    class="del-modal slModal tip-modal"
    :visible="delVisible"
    :width='460'
    @cancel="cancel"
    :title="title"
    :footer='null'
    :closable=closable
    :maskClosable=closable
  >
  <slot></slot>
   
  </a-modal>
</template>

<script>
export default {
  props: {
    title: {
      default: '确认删除',
    },
    tip: {
      default: ''
    },
    cancelBtnText: {
      default: '取消',
    },
    okBtnText: {
      default: '确定'
    },
    closable: {
      default: true
    }
    
  },
  data() {
    return {
      delVisible: false,

    }
  },
  methods: {
    open() {
      this.delVisible = true
    },
    close() {
      this.delVisible = false
    
    },
    cancel() {
      this.delVisible = false
      this.$emit('cancel')
    },
    saveDel() {
      this.$emit('ok')
    }
  },
  components: {

  }
}
</script>

<style scoped lang='less'>
::v-deep .ant-modal-body {
  padding-top: 20px;
}
::v-deep .ant-modal-header  {
  // background-color: #fff;
  // padding: 16px 20px;
  background: #f3f5f6;
}
.tip-modal {
  ::v-deep  .ant-modal-footer {
  border-top: 0;
  padding-top: 0;
}
}

.title-box {
  display: flex;
  align-items: center;
  .icon {
    color: #4682F3;
    font-size: 20px;
  }
  .title {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
    font-size: 20px;
    margin-left: 14px;
  }
}
.tip {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  margin-top: 20px;
}
.icon {
  width: 16px;
  height: 16px;
  img {
    width: 16px;
    height:  16px;
  }
}
</style>
