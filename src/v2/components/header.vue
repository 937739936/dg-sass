<template>
  <div class="wrap">
    <span class="title">{{ title }}</span>
    <UserInfo />
  </div>
</template>

<script>
import UserInfo from "@/v2/components/userInfo.vue";

export default {
  data() {
    return {};
  },
  components: {
    UserInfo,
  },
  computed: {
    title() {
      let path = this.$route.meta.path;
      if (path && path.length) {
        return path.map((item) => item.name).pop();
      } else {
        return "";
      }
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .title {
    width: auto;
    height: 32px;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    line-height: 32px;
  }
}
</style>