<template>
  <a-select
    class="work-flow-select"
    label-in-value
    show-search
    :value="value"
    :placeholder="placeholder"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    :disabled="disabled"
    @search="fetchUser"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="(d, index) in data" :key="computedKey(index)">
      {{ d.text }}
    </a-select-option>
  </a-select>
</template>

<script>
import { debounce } from "lodash";
import { API_GETOAUSERBYKEYWORD } from "api";

export default {
  props: {
    system: {
      type: Object,
      default: () => {},
    },
    valueDefault: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  watch: {
    valueDefault: {
      handler(item) {
        if(item && Object.keys(item).length) {
          this.value = {
            text: `${item?.operatorName}-${item?.DEPARTMENTPATHNAME}`,
            value: `${item?.operatorName} ${item?.operatorMobile}`,
            key: `${item?.operatorName} ${item?.operatorMobile}`,
          };
        } else {
          this.value = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      data: [],
      value: [],
      fetching: false,
    };
  },
  methods: {
    computedKey(key) {
      const { MOBILE, USERNAME } = this.data[key];
      return JSON.stringify({ MOBILE, USERNAME, ...this.system });
    },
    fetchUser(value) {
      if (!value) return;
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = [];
      this.fetching = true;
      API_GETOAUSERBYKEYWORD({
        keyword: value.trim(),
        systemCode: this.system.systemCode,
      })
        .then((body) => {
          if (fetchId !== this.lastFetchId) {
            return;
          }
          const data = body.data
            .filter((item) => item.MOBILE)
            .map((user) => ({
              text: `${user.USERNAME}${user.DEPARTMENTPATHNAME?'-'+user.DEPARTMENTPATHNAME+'-': '-'}${user.MOBILE}`,
              value: `${user.USERNAME} ${user.MOBILE}`,
              key: `${user.USERNAME} ${user.MOBILE}`,
              ...user,
            }));
          this.data = data;
          this.fetching = false;
        })
        .catch(() => {
          this.fetching = false;
        });
    },
    handleChange(value) {
      const temp = JSON.parse(value.key);
      this.$emit("change", {
        ...temp,
        operatorName: temp.USERNAME,
        operatorMobile: temp.MOBILE,
      });
      this.$emit("select", {
        ...temp,
        operatorName: temp.USERNAME,
        operatorMobile: temp.MOBILE,
      });
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
    resetValue() {
      this.value = {};
    }
  },
};
</script>

<style lang="less" scoped>
.work-flow-select {
  /deep/ .ant-select-selection__placeholder {
    // display: inline-block !important;
  }
}
</style>
