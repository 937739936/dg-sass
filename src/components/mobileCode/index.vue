<template>
  <div class="mobile-check">
    <div class="tip">
      <div class="check-tip tip-title">
        <img src="../../v2/assets/imgs/person/tip.png" alt="">
        为确认身份，我们需验证您的安全手机
      </div>
      <div class="check-tip" style="padding-left: 35px">如果您当前的手机号已无法使用请联系客服</div>
    </div>
    <div class="current-mobile">当前安全手机：<span class="mobile-num">{{mobile}}</span></div>
    <div class="input-wrap">
      <a-input class="input-code" v-model="msgcode" :maxLength="10"/>
      <div class="error-msg" v-show="errormsg">验证码输入错误</div>
      <i class="code" v-if="disabled">{{count}}s后重新发送</i>
      <i class="code" v-else style="cursor:pointer;" @click="getLoginCode">获取验证码</i>
    </div>
    <div class="next">
      <a-button type="primary" class="next-btn" @click="checkCode">下一步</a-button>
    </div>
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
    min-height: 330px;
    position: relative;
    .tip{
      width: 315px;
      height: 64px;
      background: #F3F7FF;
      border-radius: 4px;
      border: 1px solid #E5E6EB;
      margin: 30px auto 17px;
      padding: 7px 0;
      .check-tip {
        font-size: 12px;
        color: #6B6F76;
        line-height: 25px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0,0,0,0.4);
        img{
          width: 16px;
          height: 16px;
          margin-right: 3px;
          margin-left: 12px;
          vertical-align: sub;
        }
      }
      .tip-title{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0,0,0,0.8);
      }
    }
    .next{
      border-top: 1px solid #E5E6EB;
      position: absolute;
      width: 100%;
      text-align: right;
      bottom: 0;
    }
    .error-msg {
      color: red;
      text-align: left;
    }
    .next-btn {
      width: 102px;
      height:32px;
      margin-right: 30px;
      margin-bottom: 16px;
      margin-top: 16px;
      text-align:center;
    }
    .input-wrap {
      width: 290px;
      margin: 0 auto;
      height: 53px;
      margin-top: 10px;
      position: relative;
      .code {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: @primary-color;
        position: absolute;
        right: 7px;
        top: 7px;
      }
    }
    .current-mobile {
      width: 290px;
      margin: 0 auto;
      margin-top: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0,0,0,0.4);
    }
    .mobile-num {
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      color: rgba(0,0,0,0.8);
    }
  }
</style>
