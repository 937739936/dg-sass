<template>
  <a
    :disabled="state.smsSendBtn"
    v-text="!state.smsSendBtn && '获取验证码' || (state.time+'秒后重新获取')"></a>
</template>

<script>
import { API_GetSealMobileVerifyCode } from 'api';
import { tencentCaptcha } from "@/v2/utils/factory";
export default {
  data () {
    return {
      state: {
        time: 60,
        start: false,
        smsSendBtn: false
      },
      interval: null,
      mobile:''
    }
  },
  methods: {
    /**
     * @param {String} phone 传入需要发短信的手机号
     * 注册组件后 通过$refs.XX.send(phone)
     * 有表单验证的先验证通过再调用
     */
    send (mobile) {
      this.mobile = mobile
      tencentCaptcha(this.sendSms,mobile)
    },
    sendSms ({ ticket, randstr }) {
      const { state } = this
      state.smsSendBtn = true
      if (state.start) return
      state.start = true

      API_GetSealMobileVerifyCode({ mobile:this.mobile,ticket, randstr }).then(res => {
        if (res.success) {
          this.interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              this.reset()
            }
          }, 1000)
          this.$message.success('短信验证码已发送，请查收')
        } else {
          this.reset()
        }
      }).catch(() => {
        this.reset()
      })
    },
    reset () {
      const { state } = this
      state.time = 60
      state.start = false
      state.smsSendBtn = false
      clearInterval(this.interval)
    }
  }
}
</script>
