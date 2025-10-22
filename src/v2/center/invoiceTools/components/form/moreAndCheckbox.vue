<template>
  <p class="form-item-wrap">
    <span class="search-form-label">{{label}}:</span>
    <ul class="sell-tag sell-tag-checkbox" v-if="tagCheckoutBox">
      <a-checkbox-group v-model="selectNameListStr" :options="tagList" />
      <a-space class="sell-tag-cancel">
        <a-button class="search-more-button" type="" size="small" @click="getListCheckoutBox(false)">取消</a-button>
        <a-button class="search-more-button" type="primary" size="small" @click="confirmSearchCheckbox">确定</a-button>
      </a-space>
    </ul>
    <ul class="sell-tag sell-tag-checkbox"  v-else>
      <li v-for="(item, index) in tagList" :key="index"><a-checkable-tag :checked="selectNameListStr.indexOf(item) > -1" @change="checked => handleTagChange(item)">{{item}}</a-checkable-tag></li>
    </ul>
    <a-space v-if="!tagMore && !tagCheckoutBox">
      <a-input-search
        @focus="changeClass(1)"
        @blur="changeClass(0)"
        :placeholder="placeholder"
        @search="confirmSearch"
        v-model="selectNameListStrInput"
        :class="[isInput ? 'search-input-active' : 'search-input']"
        size="small"
      />
      <!-- <a-button type="primary" size="small" @click="confirmSearch">确定</a-button> -->
    </a-space>
    <a-space class="more-methods">
      <a-button type="" class="more-btn" size="small" @click="getMoreSellList">更多 <a-icon :type="tagMore ? 'caret-up' : 'caret-down'" /></a-button>
      <a-button type="" class="mutil-btn" size="small" @click="getListCheckoutBox(true)" v-show="!tagCheckoutBox" v-if="checkbox"><a-icon type="plus" />多选</a-button>
    </a-space>
  </p>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "开票单位",
    },
    title: {
      type: String,
      default: "sellerNameListStr",
    },
    list: {
      type: Array,
      default: () => [],
    },
    checkbox: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tagList: [],
      selectNameListStr: [],
      tagCheckoutBox: false,
      tagMore: false,
      selectNameListStrInput: "",
      isInput: 0
    };
  },
  watch: {
    list: {
      handler(value) {
        if (value.length) {
          this.tagList = value.slice(0, 3);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    changeClass(type) {
      this.isInput = type;
    },
    getMoreSellList() {
      this.tagMore = !this.tagMore;
      if(this.tagMore) {
        this.tagList = this.list;
      } else {
        this.tagList = this.list.slice(0, 3);
      }
    },
    getListCheckoutBox(flag) {
      this.tagCheckoutBox = flag;
      if (!flag) {
        this.tagMore = false;
        this.tagList = this.list.slice(0, 3);
        this.selectNameListStr = [];
      }
    },
    confirmSearch() {
      if (this.selectNameListStrInput) {
        this.selectNameListStr = [this.selectNameListStrInput.trim()];
        this.$emit("change", { [this.title]: [this.selectNameListStr] });
        this.selectNameListStrInput = "";
      }
    },
    confirmSearchCheckbox() {
      this.$emit("change", { [this.title]: [this.selectNameListStr] });
      this.getListCheckoutBox(false);
    },
    handleTagChange(tag) {
      this.selectNameListStr = [tag];
      this.$emit("change", { [this.title]: [tag] });
    },
    clear() {
      this.selectNameListStr = [];
      this.selectNameListStrInput = "";
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>