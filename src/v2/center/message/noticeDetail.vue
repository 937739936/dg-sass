<template>
  <div>
    <div class="title">{{ title }}</div>
    <div v-html="content"></div>
    <a-row type="flex" justify="center" style="margin-top: 40px;">
      <a-button type="default" @click="$router.back()">返回</a-button>
    </a-row>
  </div>
</template>

<script>
import { API_workbenchNoticeDetail } from 'api';

export default {
  data() {
    return {
      title: '',
      content: ''
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const { data } = await API_workbenchNoticeDetail({
        id: this.$route.query.id
      });
      this.title = data.mainTitle;
      this.content = data.textDetail;
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin: 20px 0;
}
</style>