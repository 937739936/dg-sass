<template>
  <div>
    <div class="methods-wrap">
      <span slot="title" class="slTitle">个人信息</span>
    </div>
    <div class="tips">
      <div class="flex-center">
        <span class="icon"></span>
        <span class="desc-top">尊敬的客户：根据国家互联网用户实名制相关要求，同时为保障您的账号资产安全，在使用本产品、功能和服务之前，需先完成<span
            class="person-auth" @click="$router.push('/center/account/person/info/auth')">个人实名认证</span>。</span>
      </div>
      <span class="desc-bot">个人实名认证完成后，即可认证或加入企业。</span>
    </div>
    <div class="content">
      <div class="card"></div>
      <div class="content-tip">未实名认证</div>
      <a-button type="primary" class="auth-btn" @click="$router.push('/center/account/person/info/auth')">立即认证</a-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

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

.tips {
  widows: 100%;
  height: 60px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid rgba(229, 230, 235, 1);
  box-sizing: border-box;
  background: rgba(243, 247, 255, 1);
  border-radius: 4px;
  margin-top: 30px;
  color: rgba(0, 0, 0, 0.8);
}

.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-image: url('~v2/assets/imgs/common/info_icon.png');
  background-size: 16px 16px;
  background-position: center;
}

.desc-top {
  margin-left: 12px;
}

.desc-bot {
  margin-left: 28px;
}

.person-auth {
  color: @primary-color;
  cursor: pointer;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
  box-sizing: border-box;
}

.card {
  width: 218px;
  height: 136px;
  background-image: url('~v2/assets/imgs/person/card.png');
  background-size: 218px 136px;
}

.content-tip {
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  margin-top: 20px;
}

.auth-btn {
  width: 116px;
  height: 38px;
  margin-top: 50px;
}
</style>
