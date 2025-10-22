
<template>
  <div>
    <a-modal
      class="slTitleConfirmModal"
      :visible="visible"
      title=""
      @cancel="handleCancel"
      :maskClosable="false"
    >
			<div class="title">
				<a-icon type="exclamation-circle" theme="filled"/>温馨提示
			</div>
			<div class="label">
					<p>为了更好地使用体验，请登录铁物大宗商品供应链业务信息系统完成相应业务</p>
					<a target="_blank" href="http://dzxt.henanrcicmc.com:1080/login">http://dzxt.henanrcicmc.com:1080/login</a>
			</div>
      <template slot="footer">
        <div>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary"><a target="_blank" href="http://dzxt.henanrcicmc.com:1080/login">立即跳转</a></a-button>
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
    }
  },
  methods:{
		showModal() {
			this.visible = true
		},
    handleCancel(){
      this.visible = false
    },
    handleOk(){
      let routeUrl = this.$router.resolve({
					path: "http://dzxt.henanrcicmc.com:1080/login",
			});
			window.open(routeUrl.href, '_blank');
    }
  }
}
</script>
<style lang="less" scoped>
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
    .ant-modal-content {
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
            color: #4682F3;
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
</style>