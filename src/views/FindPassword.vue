<template>
  <div class="login">
    <div style="width: 100%">
      <header-com-no-menu></header-com-no-menu>
    </div>
    <div class="content">
      <div class="center">
        <h3>找回密码</h3>
        <a-steps :current="current" progress-dot>
          <a-step title="验证手机号"></a-step>
          <a-step title="设置新密码"></a-step>
          <a-step title="密码重置成功"></a-step>
        </a-steps>
        <div class="steps-content">
          <a-form
            slot="description"
            :form="formList[0]"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
            style="width: 290px; margin: 0 auto"
            v-if="current === 0"
          >
            <a-form-item label="">
              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-input
                    @blur="getCompanyMobile"
                    placeholder="请输入企业账号"
                    v-decorator="['account', { rules: [{ required: true, message: '请输入企业账号' }] }]"
                  > </a-input>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="">
              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-input
                    disabled
                    placeholder="请输入企业账号获取手机号"
                    v-decorator="['mobile', { rules: [{ required: true, message: '请输入手机号' }] }]"> </a-input>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-input-search
                    placeholder="请输入验证码"
                    v-decorator="[
                      'code',
                      {
                        rules: [
                          { required: true, message: '请输入验证码' },
                          { pattern: /^\d{6}$/, message: `验证码为6位数字` },
                        ],
                      },
                    ]"
                  >
                    <a-button style="width: 135px" slot="enterButton" type="primary" :disabled="disabled" @click.native="sendFindCode">
                      {{ disabled ? count + "s后重新发送" : "获取验证码" }}
                    </a-button>
                  </a-input-search>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-button style="width: 100%; height: 32px" type="primary" @click="nextStep(0)">下一步</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
          <a-form
            :form="formList[1]"
            slot="description"
            v-if="current === 1"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
            style="width: 290px; margin: 0 auto"
          >
            <a-form-item label="password">
              <a-input-password
                :maxLength="16"
                v-decorator="[
                  'password',
                  { rules: [{ required: true, message: '' }, { validator: (rule, value, callback) => validateFieldsError0(rule, value, callback) }] },
                ]"
                placeholder="请输入新密码"
              />
            </a-form-item>
            <a-form-item label="password2">
              <a-input-password
                :maxLength="16"
                v-decorator="[
                  'password2',
                  { rules: [{ required: true, message: '' }, { validator: (rule, value, callback) => validateFieldsError1(rule, value, callback) }] },
                ]"
                placeholder="请再次输入新密码"
              />
            </a-form-item>
            <a-form-item>
              <a-row type="flex" justify="center">
                <a-col :span="24">
                  <a-button style="width: 100%; height: 32px" type="primary" @click="nextStep(1)">下一步</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
          <a-form
            :form="formList[2]"
            slot="description"
            v-if="current === 2"
            :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }"
            style="width: 290px; margin: 0 auto"
          >
            <a-result status="success">
              <template #extra>
                <a-button @click="login" style="width: 100%; height: 32px" type="primary"> 登录系统 </a-button>
              </template>
            </a-result>
          </a-form>
        </div>
      </div>
      <!-- <agree-modal ref="agreeModal"></agree-modal> -->
      <footer-com></footer-com>
    </div>
  </div>
</template>
<script>
import FooterCom from "components/common/FooterCom";
import { encryptedData } from "untils/factory.js";
import HeaderComNoMenu from "../components/common/HeaderComNoMenu";
import { API_GET_FORGET_PSD_CHECK, API_GET_FORGET_PSD_SEND_CODE, API_GET_FORGET_PSD_CODE_CHECK, API_GET_FORGET_PSD_CHANGE } from "api/account";
import { tencentCaptcha } from "@/v2/utils/factory";

const REGEXP_PSD = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,}$/;

export default {
  name: "FindPassword",

  components: {
    HeaderComNoMenu,
    FooterCom,
  },
  data() {
    return {
      formList: {
        0: this.$form.createForm(this, { name: "step1" }),
        1: this.$form.createForm(this, { name: "step2" }),
        2: this.$form.createForm(this, { name: "step3" }),
      },
      mobile: null,
      count: 60,
      disabled: false,
      timer: null,
      type: "password",
      current: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementsByClassName("searchDeliverTrain")[0].style.display = "none"; // 查询轨迹按钮不展示
    });
  },
  methods: {
    login() {
      if(this.$route.query.redirect_url) {
        location.href = this.$route.query.redirect_url;
      } else {
        this.$router.replace('/login');
      }
    },
    validateFieldsError0(rule, value, callback) {
      if (!value) {
        callback("请输入新密码");
        return;
      } else {
        if (!REGEXP_PSD.test(value)) {
          callback("必须含有数字和字母的8位以上组合");
          return;
        }
        const value2 = this.formList[1].getFieldValue("password2");
        if (value2) {
          if (value !== value2) {
            callback("两次密码输入不一致");
          } else {
            this.formList[1].validateFields(["password2"]);
            callback();
          }
        }
      }
    },
    validateFieldsError1(rule, value, callback) {
      if (!value) {
        callback("请再次输入新密码");
        return;
      } else {
        if (!REGEXP_PSD.test(value)) {
          callback("必须含有数字和字母的8位以上组合");
          return;
        }
        const value1 = this.formList[1].getFieldValue("password");
        if (value1) {
          if (value !== value1) {
            callback("两次密码输入不一致");
          } else {
            this.formList[1].validateFields(["password"]);
            callback();
          }
        }
      }
    },
    nextStep(index) {
      this.formList[index].validateFields((err, values) => {
        if (!err) {
          if (index === 0) {
            this.values = {
              ...this.values,
              ...values,
            };
            const { account, code } = this.values;
            this.validateCodeAccount(account, code);
          }
          if (index === 1) {
            this.handleSubmit();
          }
        }
      });
    },
    // 校验短信验证码
    validateCodeAccount(account, code) {
      API_GET_FORGET_PSD_CODE_CHECK({
        account: account.trim(),
        code: code.trim(),
      }).then((res) => {
        if (res.success) {
          this.current++;
        }
      });
    },
    handleSubmit() {
      this.formList[1].validateFields((err, values) => {
        if (!err) {
          this.values = {
            ...this.values,
            ...values,
          };
          this.forgotPwd();
        }
      });
    },
    async forgotPwd() {
      API_GET_FORGET_PSD_CHANGE({ ...this.values, password: await encryptedData(this.values.password) }).then((res) => {
        if (!res.success) {
          this.$message.error(res.data);
          return;
        }
        this.current++;
      });
    },
    countDown() {
      if (this.timer) window.clearInterval(this.timer);
      this.count = 60;
      this.disabled = true;
      this.count--;
      this.timer = window.setInterval(() => {
        if (this.count <= 0) {
          window.clearInterval(this.timer);
          this.disabled = false;
        }
        this.count--;
      }, 1000);
    },
    sendSms({ ticket, randstr }) {
      let account = this.formList[0].getFieldValue("account");
      API_GET_FORGET_PSD_SEND_CODE({ account, ticket, randstr }).then((res) => {
        if (!res.success) {
          this.$message.error(res.data);
          return;
        }
        this.$message.success("验证码发送成功,请注意查收");
        this.countDown();
      });
    },
    getCompanyMobile() {
      this.formList[0].setFieldsValue({
        mobile: null
      });
      this.formList[0].validateFields(["account"], (err, values) => {
        if (!err) {
          API_GET_FORGET_PSD_CHECK({ account: values.account.trim() }).then((res) => {
            if (res.success) {
              if (res.data.checkResult) {
                this.formList[0].setFieldsValue({
                  mobile: res.data.mobile
                });
                this.values = {
                  ...this.values,
                  ...res.data,
                };
              } else {
                this.$message.error("该账号手机不存在");
              }
            }
          });
        }
      });
    },
    sendFindCode() {
      this.formList[0].validateFields(["account", "mobile"], (err, values) => {
        if(!err) {
          tencentCaptcha(this.sendSms, values.mobile);
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timer);
    next();
  },
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .content {
    width: 100%;
    flex: 1;
    background: url('../assets/imgs/login.png') center center no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction:column;
    justify-content:flex-end;
    align-items: center;
    .center {
      width: 580px;
      height: 400px;
      border-radius: 8px;
      background: #ffffff;
      padding: 25px 0px;
      overflow: hidden;
      position: absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      h3 {
        font-size: 24px;
        font-family: PingFang-SC-Semibold;
        margin-bottom: 24px;
        text-align: center;
      }
      .s-eye {
        position: absolute;
        right: 12px;
        top: 0;
        color: rgba(0,0,0,0.30);
      }
      .edit-account {
        margin-top: 18px;
        color: #cccccc;
        font-size: 14px;
        font-family: PingFangSC-Regular;
      }
    }
  }
  .steps-content {
    margin-top: 20px;
  }
  /deep/ .ant-steps-item-title {
    font-size: 14px;
  } 
}
@media screen and (max-width: 580px) { 
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
      }
    }
    ::v-deep.ant-steps {
      overflow-x: scroll;
      .ant-steps-label-vertical .ant-steps-item {
        padding-top: 3px;
      }
      &::-webkit-scrollbar {
        background: 0 0;
        width: 2px;
        height: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d7d7d7;
        border-radius: 2px;
        width: 2px;
        height: 2px;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .login{
    .content{
      .center{
        width: 95%;
      }
    }
  }
}
</style>
