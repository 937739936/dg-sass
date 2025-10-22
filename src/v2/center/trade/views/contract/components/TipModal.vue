<template>
  <a-modal
    class="del-modal slModal tip-modal"
    :visible="delVisible"
    :width='460'
    @cancel="cancel"
    title=""
    :footer='null'
    :closable=closable
    :maskClosable=closable
  >
    <div class="title-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z" fill="var(--primary-color)"/>
      </svg>
      <span class="title" >{{title}}</span>
    </div>

    <div class="tip" v-if="tip">{{tip}}</div>
    <div v-else>
       <slot></slot>
    </div>
   
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
    },
    footer: {
      default: true,
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
  background-color: #fff;
  padding: 16px 20px;
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
    color: @primary-color;
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
