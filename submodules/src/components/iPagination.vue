<template>
  <a-row
    v-show="showPagination || showTotalMain"
    :class="{
      slPagination: true,
      showPagination: showPagination,
      showTotalMain: showTotalMain,
    }"
  >
    <a-col align="right">
      <a-pagination
        :current="pagination.pageNo"
        :total="pagination.total"
        :showSizeChanger="!pagination.hideSize"
        :pageSize="pageSize"
        :showTotal="showTotal"
        show-quick-jumper
        :pageSizeOptions="pageSizeOptions"
        :showQuickJumper="quick"
        @showSizeChange="onShowSizeChange"
        @change="onChange"
      />
    </a-col>
  </a-row>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "iPagination",
  props: {
    pagination: {
      default: () => {},
    },
    pageSizeOptions: {
      default: () => ["10", "20", "30", "40", "50"],
    },
    defaultPageSize: {
      default: 10,
    },
    showTotalMain: {
      default: null,
    },
  },
  data() {
    return {
      pageSize: 10,
    };
  },
  watch: {
    pagination: {
      handler(data) {
        this.handleScroll(data);
      },
      deep: true,
    },
  },
  mounted() {
    this.pageSize = this.defaultPageSize || 10;
    this.slPaginationEle = document.querySelector(".slPagination");
    this.appEle = document.querySelector("#app");
    this.handleScroll(this.pagination);
  },
  computed: {
    quick() {
      return this.pagination.total / (this.pagination.hideSize ? 10 : 10) > 5;
    },
    //左侧信息
    showTotal() {
      if (this.showTotalMain) {
        return () => this.showTotalMain;
      } else {
        return (total) => `共有${total}条信息`;
      }
    },
    // 判断时候展示
    showPagination() {
      if( this.pageSizeOptions[0] > 10) {
        return true
      }
      return  this.pagination.total > this.pageSizeOptions[0];
    },
  },
  beforeDestroy(){
    this.appEle.removeEventListener("scroll", this.scroll,false);
  },
  methods: {
    scroll(){
      var sl = 228 - this.appEle.scrollLeft;
      this.slPaginationEle.style.left = sl + "px";
    },
    // fixed随页面滚动
    handleScroll(data) {
      this.$nextTick(() => {
        if (data.total > 10) {
          this.appEle.removeEventListener("scroll", this.scroll,false);
          this.appEle.addEventListener("scroll", this.scroll,false);
        }
      });
    },
    ...mapMutations({
      VUEX_setPageSize: "pagination/VUEX_setPageSize",
    }),
    onShowSizeChange(page, size) {
      this.pageSize = size;
      this.VUEX_setPageSize(size);
      this.$emit("change", page, size, "size");
    },
    onChange(page, size) {
      this.$emit("change", page, size, "page");
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .ant-pagination-item-active a {
  color: #fff !important;
}
::v-deep .ant-pagination-item-active {
  border-color:  @primary-color !important;
  background-color: @primary-color!important ;
  color: #fff !important;
}
::v-deep .ant-pagination-item-active {
  a {
    color: #ffffff;
  }
}
.slPagination {
  margin-top: 20px;
  ::v-deep ul.ant-pagination {
    li {
      display: none;
    }
  }
  ::v-deep.ant-pagination-total-text {
    float: left;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    span {
      color: #000000;
    }
  }
  ::v-deep.ant-select {
    color: rgba(0, 0, 0, 0.4);
  }
  ::v-deep.ant-pagination-item-link {
    border: none;
    color: rgba(0, 0, 0, 0.4);
  }
  ::v-deep.ant-pagination-item {
    border: none;
    line-height: 32px;
    border-radius: 5px;
    a {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  ::v-deep.ant-pagination-options-quick-jumper {
    color: rgba(0, 0, 0, 0.4);
    input {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  ::v-deep.ant-select-open .ant-select-arrow {
    transform: rotate(180deg);
  }
  ::v-deep.ant-select-selection--single .ant-select-selection__rendered {
    margin-right: 48px;
  }
  ::v-deep&.showPagination {
    ul.ant-pagination {
      li {
        display: inline-block;
      }
      li.ant-select-dropdown-menu-item {
        display: block;
      }
      li.ant-pagination-total-text {
        display: flex;
      }
    }
  }
  ::v-deep&.showTotalMain {
    ul.ant-pagination {
      li.ant-pagination-total-text {
        display: flex;
      }
    }
  }
}
::v-deep .ant-select-dropdown-menu-item {
  text-align: center;
}
::v-deep .ant-select-dropdown-placement-bottomLeft  {
  top: -164px !important;
}
</style>
