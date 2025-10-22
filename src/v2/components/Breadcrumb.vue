<template>
  <div class="breadcrumb-wrap">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="item in currentPath" :key="item.path">
        <router-link v-if="item.path" :to="'/center/'+item.path">{{ item.name }}</router-link>
        <span v-else> {{ item.name }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    currentPath() {
      return this.$route.meta.path || [];
    },
  },
  methods: {
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.breadcrumb-wrap {
  margin-top: 30px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8191a9;
  line-height: 22px;
}
</style>