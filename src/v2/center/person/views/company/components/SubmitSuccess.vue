<template>
  <div class="wrap">
    <div class="icon"></div>
    <div class="title">{{ titleDesc }}</div>
    <div class="desc">
      <span>您的信息已经提交审核，平台审核将在1-3个工作日内完成，请耐心等待</span><br>
      <span v-if="descTipVisible" class="desc">审核期间电子签章不可用，审核通过后，可正常使用电子签章</span>
    </div>
    <a-button ghost type="primary" class="btn" @click="back">返回我的企业</a-button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '企业认证审核已提交'
    }
  },
  computed: {
    titleDesc() {
      if (this.$route.query.type === 'edit') {
        return '企业信息变更审核已提交';
      }
      return this.title;
    },
    descTipVisible() {
      return this.$route.query.type === 'edit';
    }
  },
  methods: {
    back() {
      window.location.href = '/center/account/company/info';
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 138px;
  box-sizing: border-box;
}
.icon {
  width: 218px;
  height: 136px;
  background-image: url('~@/v2/assets/imgs/person/authing.png');
  background-size: contain;
}
.title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 10px;
}
.desc {
  width: 443px;
  text-align: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 14px;
}
.btn {
  width: 144px;
  margin-top: 50px;
}
</style>