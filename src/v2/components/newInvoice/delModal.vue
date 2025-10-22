<template>
  <!-- 删除弹窗 -->
  <a-modal v-model="delVisible" centered  :footer="null" width="460px">
    <div class="title">
      <ConfirmIcon></ConfirmIcon>确认提示
    </div>
    <div style="padding: 0 20px 20px">
      <p v-if="!$slots.default" class="note">您确定要删除此发票？</p>
      <slot></slot>
      <div class="footer">
        <a-button key="back" style="width:90px;line-height: initial;" @click="delVisible=false"> 取消 </a-button>
        <a-button key="submit" style="margin-left:18px;width:90px;line-height: initial;" type="primary" @click="send"> 确定</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { ConfirmIcon } from '@sub/components/svg'
export default {
  props: {
    title: {
      default: '确认提示'
    },

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
    send() {
      this.$emit('confirm')
    }
  },
  components: {
    ConfirmIcon
  }
}
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
  svg {
    width: 20px;
    margin-right: 4px;
    position: relative;
    top: 2px;
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

