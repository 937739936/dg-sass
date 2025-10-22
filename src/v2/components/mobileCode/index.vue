<template>
  <div class="mobile-check">
    <p class="check-tip">为确认身份，我们需验证您的安全手机</p>
    <p class="check-tip">如果您当前的手机号已无法使用请联系客服</p>
    <div class="current-mobile">当前安全手机：<span class="mobile-num">{{mobile}}</span></div>
    <div class="input-wrap">
      <a-input class="input-code" v-model="msgcode" :maxLength="10"/>
      <div class="error-msg" v-show="errormsg">验证码输入错误</div>
      <i class="code" v-if="disabled">{{count}}s后重新发送</i>
      <i class="code" v-else style="cursor:pointer;" @click="getLoginCode">获取短信验证码</i>
    </div>
    <a-button type="primary" class="next-btn" @click="checkCode">下一步</a-button>
  </div>
</template>

<script>
import {
  API_CHECKCODEREALNAMEAUTH,
  API_SENDCODEREALNAMEAUTH
} from 'api/account'
import {mapGetters} from 'vuex'
import { tencentCaptcha } from "@/v2/utils/factory";
export default {
  props:['sendapi','checkapi'],
  data () {
    return {
      msgcode:'',
      count:0,
      errormsg:'',
      disabled:false,

    }
  },
  computed:{

    ...mapGetters('user', {
      VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
    }),
    mobile(){
      let str = this.VUEX_ST_PERSONALLINFO.mobile
      return  str.substr(0,3) + "****" + str.substr(7)

    }
  },
  methods: {
    beforeRouteLeave(to, from, next){
      window.clearInterval(this.timer)
      next()
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
    getLoginCode(){
      tencentCaptcha(this.sendSms,this.VUEX_ST_PERSONALLINFO.mobile)
    },
    sendSms({ ticket, randstr }) {
      const mobile = this.VUEX_ST_PERSONALLINFO.mobile
      let func = this.sendapi || API_SENDCODEREALNAMEAUTH
      func({
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

    checkCode(){
      if (!this.msgcode) {
        this.errormsg = '请输入验证码'
        return
      }
      let func = this.checkapi || API_CHECKCODEREALNAMEAUTH
      func({
          code:this.msgcode
      }).then(res=>{
        if(!res.success || !res.data){
          this.$message.error(res.data || '验证码错误')
          return
        }

        this.errormsg = ''

        this.$emit('checksuccess',this.msgcode)


      }).catch(e=>{
        this.errormsg = '验证码输入错误'
      })

      // this.errormsg = '验证码输入错误'


    }
  }
}
</script>
<style scoped lang="less">
  .mobile-check {
    min-height: 300px;
    text-align: center;
    .error-msg {
      color: red;
      text-align: left;
    }
    .next-btn {
       width:120px;
       height:32px;
       text-align:center;
       margin-top: 16px;
    }
    .input-wrap {
      width: 330px;
      margin: 0 auto;
      height: 53px;
      margin-top: 10px;
      position: relative;
      .code {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #0053DB;
        position: absolute;
        right: 7px;
        top: 7px;
      }
    }
    .check-tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #6B6F76;
      text-align: center;
    }
    .current-mobile {
      margin-top: 15px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #383A3F;
      text-align: center;
    }
    .mobile-num {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #0053DB;
    }
  }
</style>
