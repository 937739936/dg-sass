<template>
  <p class="form-item-wrap">
    <span class="search-form-label">{{label}}:</span>
    <ul class="finance-tag">
      <li v-for="(item, index) in list" :key="index"><a-checkable-tag :checked="selectList.indexOf(item) > -1" @change="checked => handleTagChange(item)">{{item}}</a-checkable-tag></li>
    </ul>
  </p>
</template>

<script>
export default {
  props: {
    list:{
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tagList: [],
      selectList: [],
    };
  },
  methods: {
    handleTagChange(tag) {
      this.selectList = [tag];
      this.$emit("change", { [this.title]: [tag] });
    },
    clear() {
      this.selectList = [];
    }
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>