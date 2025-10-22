<template>
  <a-modal :visible="visible" width="540px" :footer="null" @cancel="closeModal">
    <div class="login">
      <div class="content">
        <div class="center">
          <a-tabs :defaultActiveKey="defaultActiveKey" @change="changeTabValue">
            <a-tab-pane tab="验证码登录" :key="2">
              <a-form :form="form" @submit="handleSubmit" style="width: 100%">
                <a-row>
                  <a-form-item>
                    <a-input
                        :maxLength="11"
                        v-decorator="[
                      'mobile',
                      {
                        rules: [
                          { required: true, message: '请输入手机号' },
                          {
                            pattern: /^1[3456789]\d{9}$/,
                            message: '请输入正确的手机号',
                          },
                        ],
                        validateTrigger: 'blur',
                      },
                    ]"
                        placeholder="请输入手机号"
                    >
                      <a-icon
                          slot="prefix"
                          type="mobile"
                          style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input>
                    <i class="code" v-if="disabled" style="cursor: pointer"
                    >{{ count }}s后重新发送</i
                    >
                    <i
                        class="code"
                        v-else
                        style="cursor: pointer"
                        @click="getLoginCode"
                    >获取验证码</i
                    >
                  </a-form-item>
                </a-row>
                <a-row>
                  <a-form-item>
                    <a-input
                        v-decorator="[
                      'code',
                      {
                        rules: [
                          { required: true, message: '验证码不能空' },
                          { pattern: /^\d{6}$/, message: '请输入正确的验证码' },
                        ],
                        validateTrigger: 'blur',
                      },
                    ]"
                        type="text"
                        :maxLength="6"
                        placeholder="请输入您的验证码"
                    >
                      <a-icon
                          slot="prefix"
                          type="lock"
                          style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input>
                  </a-form-item>
                </a-row>
                <a-button
                    style="width: 100%; height: 40px"
                    type="primary"
                    html-type="submit"
                >登录</a-button
                >
              </a-form>
            </a-tab-pane>
            <a-tab-pane tab="账户密码登录" :key="1">
              <a-form
                  :form="form"
                  @submit="handleSubmit"
                  style="width: 100%"
                  hideRequiredMark
              >
                <a-row>
                  <a-form-item>
                    <a-input v-decorator="['account']" placeholder="账户名">
                      <a-icon
                          slot="prefix"
                          type="user"
                          style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input>
                  </a-form-item>
                </a-row>
                <a-row>
                  <a-form-item>
                    <a-input-password
                        v-decorator="['password']"
                        :type="type"
                        placeholder="密码"
                    >
                      <a-icon
                          slot="prefix"
                          type="lock"
                          style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input-password>
                  </a-form-item>
                </a-row>
                <a-button
                    style="width: 100%; height: 40px"
                    type="primary"
                    html-type="submit"
                >登录</a-button
                >
              </a-form>
            </a-tab-pane>
          </a-tabs>
          <div class="login-agreement">
            <span>登录即代表您同意</span>
            <a @click.prevent="$refs.agreeModal.showModal()"
            >《{{ systemConfig.name }}用户服务协议》</a
            >
            <a @click.prevent="$refs.privacyModal.showModal()"
            >《隐私保护政策》</a
            >
          </div>
        </div>
      </div>
      <agree-modal ref="agreeModal" :fileType="'USER_AGREEMENT'"></agree-modal>
      <agree-modal
          ref="privacyModal"
          :fileType="'PRIVACY_AGREEMENT'"
      ></agree-modal>
    </div>
  </a-modal>
</template>
<script>
import {
  API_LOGINBYPWD,
  API_LOGINBYCODE,
  API_SENDLOGINCODE,
} from "api/account";
import { mapMutations, mapGetters } from "vuex";
import AgreeModal from "@/v2/components/modal/AgreementModal.vue";
import ENV from "@/api/env.js";
import { encryptedData } from "untils/factory.js";
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import axios from 'axios'
import {tencentCaptcha} from "@/v2/utils/factory";
import systemConfig from '@/v2/config/common';

export default {
  name: "Login",
  metaInfo: {
    meta: [{                 // set meta
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
    }]
  },
  components: {
    AgreeModal,
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: "advanced_search" }),
      type: "password",
      disabled: false,
      count: 60,
      timer: null,
      ENV: ENV,
      iconType: "eye-invisible",
      showAgreeInfo: true, //右下角是否展示服务协议更新
      loginTab: 2,
      defaultActiveKey: 2,
      loginUniqueId:'',
      visible:false,
      systemConfig
    };
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_BACKURL: "VUEX_ST_BACKURL",
    }),
  },
  methods: {
    init(){
      this.visible = true
      this.getvisitorId()
    },
    ...mapMutations({
      VUEX_MU_USERTOKEN: "user/VUEX_MU_USERTOKEN",
      VUEX_MU_COMPANYSUER: "user/VUEX_MU_COMPANYSUER",
      VUEX_MU_PERSONALLINFO: "user/VUEX_MU_PERSONALLINFO",
    }),
    changeTabValue(value) {
      this.loginTab = value;
      this.form.resetFields();
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      switch (this.loginTab) {
        case 1:
          this.loginByPass();
          break;
        case 2:
          this.loginByCode();
          break;
        default:
          break;
      }
    },
    // 校验手机号
    validateMobile(value) {
      let tips = "";
      if (!value) tips = "手机号不能为空";
      else if (!/^1[3456789]\d{9}$/.test(value)) tips = "请输入正确的手机号";

      this.form.setFields({
        ["mobile"]: {
          value: value,
          errors: tips
              ? [
                {
                  message: tips,
                  field: "mobile",
                },
              ]
              : null,
        },
      });
      return tips ? false : true;
    },
    countDown() {
      this.count = 60;
      let num = 60;
      if (this.timer) window.clearInterval(this.timer);
      this.timer = window.setInterval(() => {
        if (num <= 0) {
          window.clearInterval(this.timer);
          this.disabled = false;
        }
        num--;
        this.count = num;
      }, 1000);
    },
    validateCode(value) {
      let tips = "";
      if (!value) tips = "验证码不能为空";
      // if(!/\d{6}$/.test(value)) tips = '验证码为6位数字'
      this.form.setFields({
        ["code"]: {
          value: value,
          errors: tips
              ? [
                {
                  message: tips,
                  field: "code",
                },
              ]
              : null,
        },
      });
      return tips ? false : true;
    },
    // 获取登录验证码
    getLoginCode() {
      const mobile = this.form.getFieldValue('mobile')
      if(this.validateMobile(mobile)) {
        tencentCaptcha(this.sendSms,mobile)
      }
    },
    sendSms({ ticket, randstr }) {
      const mobile = this.form.getFieldValue("mobile");
      if (this.validateMobile(mobile)) {
        API_SENDLOGINCODE({
          mobile,
          ticket,
          randstr
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.data);
            return;
          }
          this.$message.success("发送成功");
          this.disabled = true;
          this.countDown();
        });
      }
    },
    // 验证码登录
    loginByCode() {
      this.form.validateFields(["mobile", "code"], (err, values) => {
        if (
            !err &&
            this.validateMobile(values.mobile) &&
            this.validateCode(values.code)
        ) {
          this.values = values
          this.toLoginByCode()
        }
      });
    },
    toLoginByCode() {
      this.loading = true;
      API_LOGINBYCODE({ ...this.values,loginUniqueId:this.loginUniqueId})
          .then((res) => {
            if (!res.success) {
              // this.$message.error(res.message)
              this.loading = false;
              return;
            }
            this.getPersonalDetail(res.data.token);
          })
          .catch((err) => {
            this.loading = false;
          });
    },
    // 账户密码登录
    loginByPass() {
      this.form.validateFields(["password", "account"], async (err, values) => {
        if (!values.account) {
          this.form.setFields({
            ["account"]: {
              value: "",
              errors: [
                {
                  message: "账户名不能为空",
                  field: "account",
                },
              ],
            },
          });
          return;
        } else {
          this.form.setFields({ ["account"]: { value: values.account } });
        }
        if (!values.password) {
          this.form.setFields({
            ["password"]: {
              value: "",
              errors: [
                {
                  message: "密码不能为空",
                  field: "password",
                },
              ],
            },
          });
          return;
        } else {
          this.form.setFields({ ["password"]: { value: values.password } });
        }
        if (!err) {
          this.values = values
          this.toLoginByPass()
        }
      });
    },
    async toLoginByPass() {
      this.loading = true;
      let password = await encryptedData(this.values.password)
      API_LOGINBYPWD({
        ...this.values,
        password,
        loginUniqueId:this.loginUniqueId
      })
      .then((res) => {
        if (!res.success) {
          this.loading = false;
          this.$message.error("登录失败");
          return;
        }
        this.getPersonalDetail(res.data.token);
      })
      .catch((err) => {
        this.loading = false;
      });
    },
    async getvisitorId() {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      this.loginUniqueId = result.visitorId
    },
    closeModal(){
      window.clearInterval(this.timer);
      this.visible = false
    },
    getPersonalDetail(token){
      let fetchDetail = axios.create({
        headers:{
          Authorization:token,
          Source:'PC'
        }
      })
      fetchDetail.get(`${this.ENV.BASE_USER_API}/api/personal/detail`).then(res=>{
        if(res.data.success){
          this.visible = false
          this.$message.success('添加成功')
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>

.code {
  position: absolute;
  right: 12px;
  top: -10px;
  height: 32px;
  font-size: 14px;
  color: @primary-color;
}

.login {
  width: 100%;
  height:400px;
  overflow: hidden;
  display: flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items: flex-start;

  .content {
    width: 100%;
    height:100%;
    background-size: 100% 100%;
    display: flex;
    flex-direction:column;
    justify-content:flex-end;
    align-items: center;
    position: relative;

    .center {
      margin: 0 auto;
      width: 460px;
      height: 340px;
      border-radius: 8px;
      background: #ffffff;
      padding: 25px 72px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform:translate(-50%,-50%);
      // margin-left: -260px;
      // margin-top: -200px;

      .notice {
        position: absolute;
        padding: 10px 38px;
        width: 460px;
        top: -80px;
        background: #fffae2;
        font-size: 14px;
        z-index: 99;
        left: 50%;
        margin-left: -230px;
        border-radius: 5px;

        &:before {
          content: '!';
          position: absolute;
          width: 14px;
          height: 14px;
          color: #fff;
          background: #FFBF00;
          left: 16px;
          top: 13px;
          border-radius: 50%;
          text-align: center;
          line-height: 14px;
          font-size: 12px;
        }
      }

      h3 {
        font-size: 24px;
        font-family: PingFang-SC-Semibold;
        margin-bottom: 24px;
      }

      .edit-account {
        width: 100%;
        margin-top: 18px;
        display:flex;
        flex-direction: row;
        justify-content:space-between;
        align-items: center;

        p {
          cursor: pointer;
          color: #cccccc;
          font-size: 14px;
          font-family: PingFangSC-Regular;
        }
      }
    }
  }
}

.s-eye {
  top: 2px;
}

.fixed-right-bottom {
  padding: 24px;
  width: 280px;
  height: 140px;
  position: absolute;
  padding: 18px;
  text-indent: 24pt;
  right: 8px;
  bottom: 8px;
  background-color: #ffffff;

  div {
    text-align: center;
    margin-top: 12px;
  }
}

.fade-animate-enter-active, .fade-animate-leave-active {
  transition: opacity 0.5s;
}

.fade-animate-enter, .fade-animate-leave-to {
  opacity: 0;
}

.login-agreement {
  position: absolute;
  left: 40px;
  bottom: 17px;
  text-align: center;
  margin-top: 10px;
  color: #ccc;
  font-size: 14px;
}
//app 基础功能上线后可以删除
@media screen and (max-width: 475px) {
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
        .login-agreement{
          display:none;
          width:100%;
          font-size:12px;
          left:50%;
          bottom:10px;
          transform:translateX(-50%);
        }
      }
    }
  }
  .footer{
    display:none;
  }
}

</style>
