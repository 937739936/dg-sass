
<template>
  <div>
    <a-modal
      :class="modalObj.modalTitle ? 'slTitleConfirmModal' : 'slConfirmModal'"
      :visible="visible"
      title=""
      @cancel="handleCancel"
      @ok="handleOk"
      :maskClosable="false"
    >
      <template v-if="modalObj.modalTitle">
        <div class="title">
            <a-icon type="exclamation-circle" theme="filled" v-if="!hideIcon" />{{modalObj.modalTitle}}
        </div>
        <div class="label">
            <p>{{modalObj.modalText}}</p>
            <p v-html="modalObj.modalTextNext"></p>
        </div>
      </template>
      <template v-else>
        <div>
          <a-icon type="exclamation-circle" theme="filled"/>
          {{modalObj.modalText}}
        </div>
      </template>
      <template slot="footer">
        <div :class="!footerVisible ? 'nofooter': ''">
            <a-button @click="handleCancel" v-if="cancelBtnVisible">{{cancelText}}</a-button>
            <a-button type="primary" @click="handleOk">{{okText}}</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  data(){
    return {
      visible:false,
      modalObj: {}
    }
  },
  props: {
    cancelBtnVisible: {
        type: Boolean,
        default: true
    },
    okText: {
        type: String,
        default: '确定'
    },
    cancelText: {
        type: String,
        default: '取消'
    },
    footerVisible: {
        type: Boolean,
        default: true
    },
    // 隐藏icon
    hideIcon: {
        type: Boolean,
        default: false
    },
    
  },
  methods:{
    showModal(data){
      this.visible = true
      this.modalObj = data
    },
    handleCancel(){
      this.visible = false
      if(this.modalObj.cancelConfirm){
        this.modalObj.cancelConfirm()
      }
      this.$emit('cancelConfirm')
    },
    handleOk(){
      this.visible = false
      if(this.modalObj.confirm){
        this.modalObj.confirm()
      }
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
// 确认弹窗无title
.slConfirmModal {
    .ant-modal {
        width: 352px!important;
        color: rgba(0,0,0,0.8)
    }
    .ant-modal-content {
        .ant-modal-body {
            padding: 64px 30px 40px 30px;
            .anticon {
                color: @primary-color;
                font-size: 16px;
                position: relative;
                top: 1px;
            }
        }
        .ant-modal-footer {
            padding: 0 25px 30px;
            border-top: none;
            .ant-btn {
                padding: 0 30px;
                margin-left: 20px;
            }
        }
    }
    .ant-modal-close-x {
        position: relative;
        &::after {
            display: block;
            content: '';
            background-image: url(~@/v2/assets/imgs/common/close_modal_icon.png);
            width: 14px;
            height: 14px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background-size: cover;
        }
        i {
            display: none;
        }
    }
    .cancel-btn {
        color: rgba(0,0,0,0.4);
        border-color: #C3C3C3
    }
    // 水平垂直居中
    .ant-modal-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ant-modal {
        top: 0;
        padding-bottom: 0;
    }
}
// 确认弹窗有title
.slTitleConfirmModal {
    .ant-modal {
        width: 460px!important;
        color: rgba(0,0,0,0.8)
    }
    ::v-deep{
        .ant-modal-body {
            padding-top:20px;
        }
    }
    ::v-deep.ant-modal-content {
        .ant-modal-body {
            padding: 20px;
            
        }
        .ant-modal-footer {
            padding: 0 30px 20px 0;
            border-top: none;
            .ant-btn {
                padding: 0 30px;
                margin-left: 20px;
            }
        }
    }
    .title {
        font-size: 20px;
        line-height: 28px;
        .anticon-exclamation-circle {
            font-size: 20px;
            color: @primary-color;
            margin-right: 14px;
        }
    }
    .label {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.5);
        margin: 20px 0 18px 0;
    }
    .ant-modal-close-x {
        position: relative;
        &::after {
            display: block;
            content: '';
            background-image: url(~@/v2/assets/imgs/common/close_modal_icon.png);
            width: 14px;
            height: 14px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background-size: cover;
        }
        i {
            display: none;
        }
    }
    // 水平垂直居中
    .ant-modal-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ant-modal {
        top: 0;
        padding-bottom: 0;
    }
}
.nofooter {
    display: none;
}

</style>