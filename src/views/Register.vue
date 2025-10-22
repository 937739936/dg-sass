<template>
  <div class="login">
    <div style="width:100%;" class="logo">
      <header-com-no-menu></header-com-no-menu>
    </div>
    <div class="content">
      <div class="center">
        <h3>会员注册</h3>
        <a-form :form="form" @submit="handleSubmit" style="width:100%;" >
          <a-form-item label="手机号" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-input
              :maxLength=11
              v-decorator="[
                'mobile',
                {rules: [{ required: true, message: '请输入手机号!' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确' }],
                validateTrigger:'blur'}
              ]"
            />
          </a-form-item>
          <a-form-item label="短信验证码" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-col span=13>
              <a-input
                :maxLength="6"
                v-decorator="[
                  'code',
                  {rules: [
                    { required: true, message: '请输入验证码!' },
                    { pattern: /^\d{6}$/, message: `验证码为6位数字` }
                  ],
                  validateTrigger:'blur'
                  }
                ]"
              />
            </a-col>
            <a-col span=10 offset=1>
              <a-button
                type="primary"
                :disabled="disabled"
                @click="getSmsCode"
                class="sendbtn"
              >{{ disabled ? count+'s后重新发送' : '获取验证码' }}</a-button>
            </a-col>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <div  class="protocol">
            <a-checkbox
              v-model="agree"
              ></a-checkbox>
              <span style="margin-left:2px;">我已阅读并同意</span>
              <a  @click.prevent="$refs.agreeModal.showModal()">{{ systemConfig.registerInformation.userServiceAgreement }}</a><a @click.prevent="$refs.privacyModal.showModal()">{{ systemConfig.registerInformation.privacyProtectionPolicy }}</a>
              </div>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <a-button class="register-btn" type="primary" html-type="submit" :disabled="!agree">立即注册</a-button>
          </a-form-item>
        </a-form>
        <a-row class="edit-account">
          <a-col span=12 offset=6>
            <span>已有{{ systemConfig.name }}账号？</span>
            <router-link to="/login" replace>登录</router-link>
          </a-col>
        </a-row>
      </div>
      <footer-com></footer-com>
    </div>
    <agree-modal ref="agreeModal" :fileType="'USER_AGREEMENT'"></agree-modal>
    <agree-modal ref="privacyModal" :fileType="'PRIVACY_AGREEMENT'"></agree-modal>
  </div>
</template>
<script>
import HeaderComNoMenu from "components/common/HeaderComNoMenu";
import FooterCom from "components/common/FooterCom";
import AgreeModal from '@/v2/components/modal/AgreementModal.vue'
// import { API_REGISTER, API_GETREGISTERCODE } from 'api';
import { mapMutations, mapGetters } from "vuex";
import { API_REGISTER, API_SENDREGISTECODE } from 'api/account'
import { tencentCaptcha } from '@/v2/utils/factory.js';
import { getPersonalDetail, encryptedData } from "untils/factory.js";
import { getQueryString } from "@/v2/utils/index";
import storage from "@sub/utils/storage";
import systemConfig from "@/v2/config/common";

export default {
  metaInfo: {
    meta: [{                 // set meta
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
    }]
  },
  data() {
    return {
      form: this.$form.createForm(this),
      timer: null,
      count: 60,
      disabled: false,
      agree: false,
      systemConfig
    };
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_BACKURL: "VUEX_ST_BACKURL",
    }),
  },
  mounted(){
    this.$nextTick(()=>{
      this.form.resetFields()
      document.getElementsByClassName('searchDeliverTrain')[0].style.display="none" // 查询轨迹按钮不展示
    })
  },
  methods: {
    ...mapMutations({
      VUEX_MU_USERTOKEN: "user/VUEX_MU_USERTOKEN",
    }),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.values = values;
          this.register()
          // tencentCaptcha(this.register);
        }
      });
    },
    register() {
      const { mobile, code } = this.values;
      API_REGISTER({
        mobile,
        code
      }).then(res=>{
        storage.local.clear();
        storage.session.clear();
        if(!res.success){
          this.$message.error(res.data)
          return
        }
        this.$message.success("恭喜您，注册完成！")
        const { token } = res.data;

        this.VUEX_MU_USERTOKEN(token);
        getPersonalDetail(this.jumpPage);
      })
    },
    jumpPage(path) {
      const redirectUrl = getQueryString('redirectUrl');
      this.$router.push(redirectUrl||this.VUEX_ST_BACKURL || path);
    },
    countDown(){
      this.count = 60
      let num = 60
      if(this.timer) window.clearInterval(this.timer)
      this.timer = window.setInterval(()=>{
        if(num <= 0) {
          window.clearInterval(this.timer)
          this.disabled = false
        }
        num --
        this.count = num
      }, 1000)
    },
    getSmsCode(){
      this.form.validateFields(['mobile'], (err,values) => {
        if (!err) {
          tencentCaptcha(this.sendSms,values.mobile,'CODE_REGISTER')
        }
      });
    },
    sendSms({ ticket, randstr }) {
      const mobile = this.form.getFieldValue("mobile");
        API_SENDREGISTECODE({
          mobile,
          ticket,
          randstr
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.data);
            return;
          }
          this.$message.success('发送成功')
          this.disabled = true
          this.countDown()
        });
    },
  },
  components: {
    HeaderComNoMenu,
    FooterCom,
    AgreeModal
  },
  beforeRouteLeave(to, from, next){
    window.clearInterval(this.timer)
    next()
  }
};
</script>

<style lang="less" scoped>
@media only screen and (max-width:575px){
  .ant-form-item-label {
    width:20%
    line-height 1.5
    text-align right
  }
  .ant-form-item-control-wrapper{
    width:50%;
  }
}
.login{
  position:absolute;
  width:100%;
  height:100%;
  top:0;
  left:0;
  overflow:hidden;
  display: flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items: flex-start;
  .content{
    width:100%;
    flex:1;
    background:url('../assets/imgs/login.png') center center no-repeat;
    background-size:100% 100%;
    display: flex;
    flex-direction:column;
    justify-content:flex-end;
    align-items: center;
    .center{
      width:580px;
      height:400px;
      border-radius:8px;
      background:#ffffff;
      padding:25px 0px;
      overflow:hidden;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      h3{
        font-size:24px;
        font-family:PingFang-SC-Semibold;
        margin-bottom:24px;
        text-align:center;
      }
      .protocol{
        margin-left: -49px;
        white-space: nowrap;
      }
      .sendbtn{
        width:100%;
        font-size:14px;
      }
      .register-btn{
        width:100%;
        height:40px;
      }
      .s-eye{
        position:absolute;
        right:12px;
        top:0;
        color:rgba(0,0,0,0.30);
      }
      .edit-account{
        margin-top:18px;
        color:#cccccc;
        font-size:14px;
        font-family:PingFangSC-Regular;
      }
    }
  }
}
/* app 基础功能上线后可以删除 */
@media screen and (max-width: 475px) {
  /deep/.ant-form-item{
    display:flex;

  }
  /deep/.ant-form-item-label {
    padding-top:10px;
    flex-shrink:0;
    width:90px;
    text-align:left;

  }
  /deep/.ant-form-item-control-wrapper{
    flex:1;
  }
  .login{
    position:fixed;

    width:100%;
    .logo{
      display:none;
    }
    .content{
      min-width: unset;
      width:100%;
      .center{
        width:90%;
        padding:25px;
        h3{
          text-align:center;
        }
        .protocol{
          font-size:12px;
          margin-left: -80px;
          line-height:1.5;
          white-space: break-spaces;
        }
        .sendbtn{
          width:100%;
          font-size:12px;
        }
        .register-btn{
          margin-left:-30px;
        }
       .edit-account{
        font-size:12px;
       }
      }
    }
  }
  .footer{
    display:none;
  }
}
@media screen and (max-width: 375px) {
  .login{
    .content{
      .center{
        padding:20px 10px;
        .protocol {
          margin-left: -49px;
        }
        .sendbtn {
          padding: 0;
        }
      }
    }
  }
}
</style>
