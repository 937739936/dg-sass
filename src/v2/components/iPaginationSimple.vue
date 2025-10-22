<template>
  <a-row v-if="pagination.total">
    <a-col align="right">
      <a-pagination
        size="small"
        :current="pagination.pageNo"
        :total="pagination.total"
        @change="onChange"
        class="new-pagination"
      />
    </a-col>
  </a-row>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "iPagination",
  props: ["pagination"],
  data() {
    return {
      pageSize: 10
    }
  },
  computed: {
    quick() {
      return (
        this.pagination.total /
          (this.pagination.hideSize ? 10 : 10) >
        5
      );
    },
  },
  methods: {
    ...mapMutations({
      VUEX_setPageSize: 'pagination/VUEX_setPageSize'
    }),
    onShowSizeChange(page, size) {
      this.pageSize = size;
      this.VUEX_setPageSize(size);
      this.$emit("change", page, size);
    },
    onChange(page, size) {
      this.$emit("change", page, size);
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .ant-pagination-item-active a {
  color: #fff !important;
}
::v-deep .ant-pagination-item-active {
  border-color:  @primary-color!important;
  background-color: @primary-color!important ;
  color: #fff !important;
}
::v-deep .ant-pagination-item-active {
  a {
    color: #ffffff;
  }
}
</style>