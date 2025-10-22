<template>
  <div class="wrap">
    <div class="auth-img"></div>
    <p class="title">手机号变更审核已提交</p>
    <p class="content">您的信息已经提交审核，平台审核将在1-3个工作日内完成，请耐心等待</p>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  box-sizing: border-box;
  .title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.8)
  }
  .content {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .auth-img {
    width: 220px;
    height: 136px;
    background-image:url("~v2/assets/imgs/person/mobile-auth.png");
    background-size: 220px 136px;
  }
}
</style>