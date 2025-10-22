<template>
  <div>
    <div class="methods-wrap">
      <span slot="title" class="slTitle">个人信息</span>
    </div>
    <div class="content">
      <div class="icon"></div>
      <div class="desc">实名认证审核已提交</div>
      <div class="desc-tips">您的信息已经提交审核，平台审核将在1-3个工作日内完成，请耐心等待</div>
      <a-row type="flex" justify="center" style="margin-top: 50px;" :gutter="[30, 30]">
        <a-col>
          <a-button ghost type="primary" style="width: 144px" @click="$router.replace('/center/account/person/info')">返回个人信息页面</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      count: 60,
      disabled: false
    };
  },
  computed: {
  },
  watch: {},
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title {
  height: 33px;
  font-size: 24px;
  font-family:
    PingFangSC-Medium,
    PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  line-height: 33px;
  margin-bottom: 30px;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
  box-sizing: border-box;
}
.icon {
  width: 218px;
  height: 136px;
  background-image: url('~v2/assets/imgs/person/authing.png');
  background-size: 218px 136px;
}
.desc {
  margin-top: 20;
  color: rgba(0, 0, 0, 0.8);
}
.desc-tips {
  color: rgba(0, 0, 0, 0.4);
  margin-top: 14px;
}
.methods-wrap {
  width: 100%;
}
.slTitle {
  width: 100%;
  padding: 10px 0 20px;
  display: inline-block;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  font-size: 20px;
  font-weight: 500;
  font-family: PingFang SC;
  border-bottom: 1px solid rgba(229, 230, 235, 1);
  box-sizing: border-box;
}
</style>
