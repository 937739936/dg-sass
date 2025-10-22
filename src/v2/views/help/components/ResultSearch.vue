<template>
  <div class="wrap-result">
    <div class="left">
      <p class="total">
        <span
          @click="selectCategory(-1, {})"
          :class="[activeIndex === -1 ? 'total-active' : '']"
        >全部({{classifyTotal > 999 ? '999+' : classifyTotal}})</span>
      </p>
      <ul>
        <li
          v-for="(item, index) in amount"
          :key="item.id"
          :style="{
            fontWeight: activeIndex === index ? 'bold' : 'normal',
          }"
          @click="selectCategory(index, item)"
        >
          <span class="title" :style="{
            color: activeIndex === index ? '#4682F3' : 'rgba(0, 0, 0, 0.80)',
          }">{{item.categoryName}}</span>
          <span :style="{
            color: activeIndex === index ? '#4682F3' : 'rgba(0, 0, 0, 0.80)',
          }">({{item.count > 99 ? '99+' : item.count}})</span>
        </li>
      </ul>
    </div>
    <div class="right">
      <p class="content-loading" v-if="loading">
        <a-spin />
      </p>
      <ul v-else>
        <li class="content-item-wrap" v-for="(item, index) in countList" :key="index">
          <p class="title">
            <span v-html="remarkKeywords(item.title, 0)" @click="detailContent({...item,type: 1})"></span>
          </p>
          <p class="content" v-html="remarkKeywords(item.content, 1)"></p>
          <p class="tags-wrap">
            <span>来源：</span>
            <ul>
              <li
                v-for="(tags, tagIndex) in item.categoryNameChain"
                :key="tagIndex">
                <span class="cursor-pointer hover-color" @click="detailContent({...tags, categoryId: item.categoryId, type: 2})">{{tags.name}}</span>
                <span class="tags-split" v-if="tagIndex !== item.categoryNameChain.length - 1">/</span>
              </li>
            </ul>
          </p>
        </li>
      </ul>
      <iPagination :pagination="pagination" @change="pageChange" />
    </div>
  </div>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { getSearchInput, searchResultAmount } from "@/v2/api/helpCenter";
const REGEXP_HTML = /<[^>]+>/gi;
export default {
  props: {
    keywords: {
      type: String,
      default: "",
    },
    searchResult: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      countList: [],
      activeIndex: -1,
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10,
      },
      amount: [],
      classifyTotal: 0,
      loading: false,
      categoryId: null,
    };
  },
  watch: {
    keywords: {
      handler(val) {
        if (val) {
          this.inputSearchAmount(val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    iPagination,
  },
  methods: {
    detailContent(item) {
      this.$router.push({
        path: "/center/help/classify",
        query: {
          id: item.id,
          categoryId: item.categoryId,
          type: item.type,
        },
      });
    },
    selectCategory(index, item) {
      this.activeIndex = index;
      this.categoryId = item?.categoryId;
      this.resetPagination(0);
      this.inputSearch(this.keywords);
    },
    async inputSearchAmount(content) {
      const result = await searchResultAmount({
        keyword: content.trim(),
      });
      if (result.success) {
        this.amount = result.data;
        this.classifyTotal = result.data.reduce((pre, cur) => {
          return pre + cur.count;
        }, 0);
        // this.categoryId = result.data[0]?.categoryId;
        this.inputSearch(content);
      }
    },
    resetPagination(type = 1) {
      if(type) {
        this.activeIndex = -1;
        this.categoryId = null;
      }
      this.pagination.pageNo = 1;
      this.pagination.pageSize = 10;
      this.pagination.total = 0;
    },
    async inputSearch(content) {
      this.loading = true;
      const { pageNo, pageSize } = this.pagination;
      const result = await getSearchInput({
        keyword: content.trim(),
        pageNo,
        pageSize,
        categoryId: this.categoryId,
      });
      this.loading = false;
      if (result.success) {
        const { total, records } = result.data;
        this.pagination = {
          ...this.pagination,
          total,
        };
        this.$emit('updateTotal', total);
        this.countList = records;
      }
    },
    remarkKeywords(strContent, type) {
      if(strContent) {
        const flagIndex = strContent.indexOf('<span');
        if(type) {
          return strContent.substring(flagIndex, strContent.length);
        }
      }
      return strContent;
    },
    // 截取搜索结果 从高亮的第一个关键词开始
    substringContent(str, keywords) {
      let flagIndex = -1;
      for( let i = 0;i < keywords.length;i ++) {
        const jointStr = '<span style="color: #4682F3">' + keywords[i] + "</span>";
        flagIndex = str.indexOf(jointStr);
        if (flagIndex >= 0) {
          break;
        }
      }
      return str.substring(flagIndex, str.length);
    },
    pageChange(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      this.pagination.pageSize = pageSize;
      this.inputSearch(this.keywords);
    },
  },
};
</script>

<style lang="less" scoped>
.wrap-result {
  width: 1200px;
  height: 1092px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  margin: 0 auto;
  margin-top: 40px;
  display: flex;
  overflow: hidden;
  .left {
    width: 200px;
    border-right: 1px solid #e5e6eb;
    box-sizing: border-box;
    padding: 10px 0 0 30px;
    overflow: hidden;
    overflow-y: auto;
    ul {
      padding-left: 10px;
      li {
        width: 140px;
        height: 48px;
        font-size: 14px;
        cursor: pointer;
        line-height: 48px;
        display: flex;
        .title {
          max-width: 130px;
          width: auto;
          font-size: 14px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 4px;
          font-family: PingFang SC;
        }
      }
    }
  }
  .right {
    flex: 1;
    padding: 30px;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    .content-loading {
      width: 100%;
      height: 400px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .title {
      font-size: 18px;
      font-weight: 500;
      span {
        cursor: pointer;
      }
    }
    .content-item-wrap {
      margin-bottom: 50px;
      .title {
        span {
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
    .content {
      width: 940px;
      height: auto;
      font-size: 14px;
      line-height: 26px;
      color: rgba(0, 0, 0, 0.8);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-top: 10px;
      /deep/ table {
        tr,th,td {
          height: 30px;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.4);
        }
        th {
          background-color: #f1f1f1;
        }
        border-collapse: collapse;
      }
    }
    .tags-wrap {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      width: auto;
      height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
      ul {
        display: flex;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-weight: 400;
        }
        li:nth-last-child(1) {
          color: rgba(0, 0, 0, 0.4);
          font-weight: bold;
        }
      }
    }
    .tags-split {
      display: inline-block;
      margin: 0 8px;
    }
  }
  .total {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .cursor-pointer {
    max-width: 120px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .hover-color:hover {
    color: #4682F3;
  }
  .total-active {
    color: #4682F3;
    font-weight: bold;
  }
}
</style>
