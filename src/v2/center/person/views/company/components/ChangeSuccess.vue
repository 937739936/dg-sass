<template>
  <div class="wrap">
    <div class="icon"></div>
    <div class="desc">恭喜您，修改成功！</div>
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
  methods: {
    back() {
      this.$router.back();
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
  width: 64px;
  height: 64px;
  background-image: url('~@/v2/assets/imgs/person/success-l.png');
  background-size: contain;
}
.title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 10px;
}
.desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 14px;
}
.btn {
  width: 144px;
  margin-top: 50px;
}
</style>