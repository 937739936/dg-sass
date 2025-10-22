<template>
  <a-modal
    title="请输入手机验证码"
    width="500px"
    destroyOnClose
    v-model="visible"
    class="slModal">
    <a-form :form="form" style="width:380px;margin:10px auto 0;">
      <a-row type="flex" justify="center">
        <a-col :span="24" style="margin-bottom: 6px;">
          手机验证码将发送到手机号：{{this.VUEX_ST_PERSONALLINFO.mobile}}
        </a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col :span="24">
          <a-form-item
            label=""
            :colon="false">
            <a-input
              class="code"
              placeholder="请输入短信验证码"
              v-decorator="[
                'smsCode',
                {
                  rules: [
                    { required: true, message: '请输入短信验证码' }] }]">
                <SmsBtn
                  slot="suffix"
                  key="1"
                  @click.native="sendSms()"
                  ref="smsBtn" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script>
  import { API_GetCheckSealMobileVerifyCode } from '@/v2/api';
  import SmsBtn from '../smsBtn/index';
  import { mapGetters } from 'vuex'

  export default {
    name: 'SignModal',

    components: {
      SmsBtn
    },
    data() {
      return {
        form: this.$form.createForm(this),
        autoSignature: '',
        visible: false,
        loading: false,
      };
    },
    computed: {
      ...mapGetters('pagination', {
        pageSize: 'pageSize'
      }),
      ...mapGetters('user', {
        VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
      }),
    },

    /* mounted() {
      setTimeout(() => {
        this.tableWidth.x = document.getElementsByClassName(
          'ant-table-thead'
        )[0].offsetWidth;
      }, 0);
    }, */

    methods: {
      handleCancel() {
        this.visible = false
      },
      showModal (autoSignature) {
        this.visible = true
        this.autoSignature = autoSignature
      },

      sendSms (bol = false) {
        this.$refs.smsBtn.send(this.VUEX_ST_PERSONALLINFO.mobile)
      },

      handleOk () {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.loading = true;
            const params = { smsCode: values.smsCode, mobile: this.VUEX_ST_PERSONALLINFO.mobile }
            API_GetCheckSealMobileVerifyCode(params).then((res) => {
              if (res.success) {
                this.visible = false
                this.autoSignature()
              } else {
                this.$message.success(res.message || '验证失败');
              }
            }).finally(() => {
              this.loading = false;
            });
          }
        })
      },
    }
  };
</script>

<style lang="less" scoped>
  .code ::v-deep input{
    padding-right: 115px !important;
  }
</style>