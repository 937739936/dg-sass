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
      <a-range-picker
        format="YYYY-MM-DD"
        allowClear
        :placeholder="['最早日期', '最晚日期']"
        size="small"
        @change="onChange"
        :default-value="momentSelectDate"
        class="select-date"
      />
      <!-- <a-button type="primary" size="small" @click="confirmSearch">确定</a-button> -->
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
        return [];
      }
    }
  },
  data() {
    return {
      tagList: ["当天", "近3天", "近一周", "近一个月"],
      dateFormat: 'YYYY-MM-DD',
      selectedDateTag: [],
      selectDate: [],
      momentDate: {
        当天: [
          moment().format("YYYY-MM-DD"), 
          moment().format("YYYY-MM-DD"),
        ],
        近3天: [
          moment().subtract(2, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        近一周: [
          moment().subtract(6, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        近一个月: [
          moment().subtract(29, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
      },
    };
  },
  methods: {
    moment,
    handleTagChange(tag) {
      this.selectedDateTag = [tag];
      this.$emit("change", { [this.title]: this.momentDate[tag] });
    },
    confirmSearch() {
      if(this.selectDate.length) {
        this.$emit("change", { [this.title]: this.selectDate });
        this.selectDate = [];
      }
    },
    onChange(value, dateString) {
      this.selectDate = dateString;
      this.confirmSearch();
    },
    clear() {
      this.selectDate = [];
      this.selectedDateTag = [];
    }
  },
};
</script>

<style lang="less" scoped>
@import url("./style.less");
</style>