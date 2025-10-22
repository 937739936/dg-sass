<template>
    <a-modal v-model="visible" title="实名认证" dialogClass="person-dia" :width="588" :footer="null">
      <div style="padding-left: 30px;padding-right: 30px">
        <a-steps :current="stepsInfo.current">
          <a-step v-for="item in stepsInfo.steps" :key="item.title" :title="item.title" />
        </a-steps>
      </div>
      <div class="steps-content">
        <template v-if="stepsInfo.current == 0">
          <mobileCode @checksuccess="checkSetpOne" />
        </template>
        <div v-if="stepsInfo.current == 1" style="min-height: 330px">
          <a-form :form="modelForm" style="padding-top:30px;">
            <a-row type="flex" justify="center">
              <a-col :span="12">
                <div style="color: rgba(0,0,0,0.4);">请输入真实姓名</div>
                <a-form-item>
                  <a-input
                          placeholder=""
                          v-decorator="[
                          `modelName`,
                          {
                              rules: [
                                  { required: true, message: `姓名必填`},
                                  { validator: null }
                              ],
                              validateTrigger:'blur'
                          }
                      ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row type="flex" justify="center">
              <a-col :span="12">
                <div style="color: rgba(0,0,0,0.4);">
                  请输入身份证号
                </div>
                <a-form-item>
                  <a-input
                          placeholder=""
                          v-decorator="[
                          `modelIdCard`,
                          {
                              rules: [
                                  { required: true, message: `身份证必填`},
                                  { validator: validIdCard }
                              ],
                              validateTrigger:'blur'
                          }
                      ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div class="next">
            <a-button type="primary" class="next-btn" @click="checkSetpTwo">下一步</a-button>
          </div>
        </div>
        <div v-if="stepsInfo.current == 2" style="min-height: 330px">
          <div class="success-icon">
            <img src="../../assets/imgs/person/success-l.png" alt="">
          </div>
          <p class="success-title">恭喜您！完成实名认证</p>
          <div class="userinfo">
            <div class="success-text">
              <div class="label">
                姓名：
              </div>
              {{successname}}
            </div>
            <div class="success-text" style="background: #F3F5F6;">
              <div class="label">
                身份证号：
              </div>
              {{successidcard}}
            </div>
          </div>
          <div class="next">
            <a-button type="primary" class="next-btn" @click="visible=false">确定</a-button>
          </div>
        </div>
      </div>
    </a-modal>
</template>

<script>
import { API_AUTHIDSUBMIT } from 'api';
import {
  API_REALNAMEAUTH,
} from '@/v2/api/account'
import { mapMutations, mapGetters} from 'vuex'
import { checkID, encryptedData } from 'untils/factory.js'
import mobileCode from '@/components/mobileCode'

export default {
  name:'personValid',
  components: {
    mobileCode,
  },
  data () {
    return {
      visible: false,
      modelForm: this.$form.createForm(this),
      successidcard:'',
      successname:'',
      stepsInfo:{
        current:0,
        steps:[
          {
            title: '验证手机号码',
          },
          {
            title: '验证身份信息',
          },
          {
            title: '完成实名认证',
          }
        ]
      }

    }
  },
  computed:{

    ...mapGetters('user', {
      VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
    }),
  },
  methods: {
    ...mapMutations({
      VUEX_MU_PERSONALLINFO: 'user/VUEX_MU_PERSONALLINFO'
    }),
    showPersonValid(){
      this.visible = true
    },
    checkSetpTwo(){
      this.modelForm.validateFieldsAndScroll(async (err,values)=>{
        if (err) return
        API_REALNAMEAUTH({
          code: this.precode||null,
          name: values.modelName,
          idCard: await encryptedData(values.modelIdCard),
          mobile: this.VUEX_ST_PERSONALLINFO.mobile
        }).then(res=>{
            if(res.success){
              if (res.data.result) {
                this.successidcard = res.data.idCard
                this.successname = res.data.name
                this.stepsInfo.current = 2
                this.VUEX_MU_PERSONALLINFO({
                  ...this.VUEX_ST_PERSONALLINFO,
                  auth:1,
                  name: values.modelName,
                  idCard: this.successidcard,
                })
                this.$emit('validSuccess')
              } else {
                this.$message.error(res.data.message)
              }
            }
        })
      })
    },
    checkSetpOne(code){
      this.precode = code
      this.stepsInfo.current = 1
    },
    // 校验身份证
    validIdCard(rule,value, callback){
      if(!value) {
        callback()
        return
      }
      if(!checkID(value)){
        callback('请输入有效的身份证号')
      }
      callback()
    }

  }
}
</script>
<style scoped lang="less">
/deep/ .ant-steps-item-wait .ant-steps-item-icon{
  background: #C3C3C3;
  border: none;
  .ant-steps-icon{
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
  }
}
/deep/ .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon{
  font-size: 16px;
  font-weight: 500;
}
/deep/ .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
}
/deep/ .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  font-weight: 500;
  color: rgba(0,0,0,0.4);
}
/deep/ .ant-modal-header{
  background: #F3F5F6;
  border-bottom: none;
  .ant-modal-title{
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0,0,0,0.8);
  }
}
/deep/ .ant-modal-body{
  padding: 0;
  padding-top: 30px;
}
.next{
  border-top: 1px solid #E5E6EB;
  position: absolute;
  width: 100%;
  text-align: right;
  bottom: 0;
  .next-btn {
    width: 102px;
    height:32px;
    margin-right: 30px;
    margin-bottom: 16px;
    margin-top: 16px;
    text-align:center;
  }
}
.success-icon{
  text-align: center;
  padding-top: 30px;
  img{
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
  }
}
.success-title{
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0,0,0,0.8);
  text-align: center;
  line-height: 20px;
  margin-bottom: 20px;
}
.userinfo{
  width: 270px;
  height: 64px;
  border:1px solid #E5E6EB;
  border-radius: 4px;
  margin: 0 auto;
  .success-text{
    height: 32px;
    line-height: 32px;
    padding-left: 12px;
    display: flex;
    color:rgba(0,0,0,0.8);
    .label{
      width: 70px;
      text-align: right;
      color:rgba(0,0,0,0.4);
    }
  }
}
</style>
