<template>
  <p class="form-item-wrap">
    <span class="search-form-label">{{label}}:</span>
  <ul class="register-time-tag">
    <li
        v-for="(item, index) in tagList"
        :key="index"
    >
      <a-checkable-tag
          :checked="selectedDateTag.indexOf(item) > -1"
          @change="checked => handleTagChange(item)"
      >{{item}}</a-checkable-tag>
    </li>
  </ul>
  <a-space>
    <a-month-picker
        format="YYYY年MM月"
        allowClear
        placeholder="请选择月份"
        size="small"
        @change="onChange"
        class="select-date"
    />
  </a-space>
  </p>
</template>

<script>
import moment from "moment";

export default {
  props: {
    label: {
      type: String,
      default: '开票日期'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    momentSelectDate() {
      if(this.selectDate.length) {
        return [moment(this.selectDate[0]), moment(this.selectDate[1])];
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      tagList: [moment().format('YYYY年MM月')],
      selectedDateTag: [],
      selectDate: []
    }
  },
  methods: {
    moment,
    handleTagChange(tag) {
      this.selectedDateTag = [tag];
      this.$emit("change", { [this.title]: [tag] });
    },
    confirmSearch() {
      if(this.selectDate.length) {
        this.$emit("change", { [this.title]: [this.selectDate] });
        this.selectedDateTag = [];
        this.selectDate = [];
      }else{
        this.$emit("change", { [this.title]: [] });
        this.selectedDateTag = [];
        this.selectDate = []
      }
    },
    onChange(value, dateString) {
      this.selectDate = dateString;
      this.confirmSearch();
    },
    clear() {
      this.selectDate = [];
      this.selectedDateTag = [];
    },
    calculateTags() {
      for (let i = 1; i < 6; i++) {
        this.tagList.push(moment(new Date()).subtract(i,'months').format('YYYY年MM月'))
      }
    }
  },
  created() {
    this.calculateTags()
  }
};
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>
