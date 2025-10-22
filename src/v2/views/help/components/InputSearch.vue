<template>
  <div :class="className">
    <a-input
      v-model="keywords"
      placeholder="请输入关键字，如：合同、付款、结算单审批"
      :class="[(inputFocus && !keywords) ? 'search-input search-input-focus' : 'search-input']"
      @focus="initData"
      @blur="blurChange"
      @pressEnter="search"
      :maxLength="50"
    >
      <svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.5713 2C15.2983 2 19.1425 5.84429 19.1425 10.5714C19.1425 12.42 18.5479 14.1281 17.5494 15.5296L21.5811 19.5614C22.1396 20.12 22.1396 21.0229 21.5811 21.5815C21.3025 21.86 20.9368 22 20.5711 22C20.2053 22 19.8396 21.86 19.561 21.5815L15.5293 17.5497C14.1279 18.5482 12.4198 19.1429 10.5713 19.1429C5.84421 19.1429 2 15.2986 2 10.5714C2 5.84429 5.84421 2 10.5713 2ZM10.5713 4.85714C9.05576 4.85714 7.60234 5.45918 6.53073 6.53082C5.45911 7.60246 4.85709 9.05591 4.85709 10.5714C4.85709 12.087 5.45911 13.5404 6.53073 14.612C7.60234 15.6837 9.05576 16.2857 10.5713 16.2857C12.0867 16.2857 13.5402 15.6837 14.6118 14.612C15.6834 13.5404 16.2854 12.087 16.2854 10.5714C16.2854 9.05591 15.6834 7.60246 14.6118 6.53082C13.5402 5.45918 12.0867 4.85714 10.5713 4.85714Z"
          fill="#C3C3C3"
        />
      </svg>
      <span slot="suffix" class="suffix-wrap" v-show="keywords">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" style="cursor: pointer" @click="clearKeywords">
          <g clip-path="url(#clip0_5870_81151)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM10.8182 5.36505C11.3203 4.86295 12.1344 4.86295 12.6365 5.36505C13.1386 5.86716 13.1386 6.68122 12.6365 7.18333L10.8187 9.00115L12.6366 10.8191C13.1387 11.3212 13.1387 12.1353 12.6366 12.6374C12.1345 13.1395 11.3204 13.1395 10.8183 12.6374L9.0004 10.8194L7.18168 12.6382C6.67958 13.1403 5.86551 13.1403 5.3634 12.6382C4.8613 12.136 4.8613 11.322 5.3634 10.8199L7.18213 9.00115L5.36352 7.18255C4.86142 6.68045 4.86142 5.86638 5.36352 5.36428C5.86563 4.86217 6.6797 4.86217 7.1818 5.36428L9.0004 7.18288L10.8182 5.36505Z"
              fill="#8495AA"
            />
          </g>
          <defs>
            <clipPath id="clip0_5870_81151">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span class="grid-line"></span>
        <span class="search-btn" @click="search">搜索</span>
      </span>
    </a-input>
    <div class="search-result" v-if="inputFocus && !keywords">
      <div class="search-log">搜索历史</div>
      <div class="log-list-wrap">
        <p
          v-for="(item, index) in logList"
          :key="index"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="searchIndex(item)"
        >
          <span class="name">{{ item }}</span>
          <span class="delete" v-if="hoverIndex === index" @click.stop="deleteItem(item)">删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { getSearchLogList, clearSearchInput } from '@/v2/api/helpCenter';
import reportCode from "@/v2/config/reportCode";

export default {
  props: {
    className: {
      type: String,
      default: 'search-input-wrap'
    },
  },
  data() {
    return {
      keywords: this.$route.query.keywords,
      inputFocus: false,
      logList: [],
      hoverIndex: -1
    };
  },
  watch: {
    keywords: {
      handler() {
        // this.debounceHandler();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.initData(0);
    this.initSearch();
  },
  methods: {
    initSearch() {
      if(this.$route.query.keywords) {
        this.$emit('keywordsChange', this.keywords);
      }
    },
    search() {
      if(this.className === 'classify-input-wrap') {
        const code = reportCode.helpCenter.searchIndex;
        window.reportUtil.reportEvent(code, {keywords: this.keywords});
        this.$router.push({
          path: '/center/help',
          query: {
            keywords: this.keywords
          }
        });
        return;
      }
      const code = reportCode.helpCenter.docDetailSearch;
      window.reportUtil.reportEvent(code, {keywords: this.keywords});
      this.$emit('keywordsChange', this.keywords);
    },
    async deleteItem(item) {
      const result = await clearSearchInput({
        keyword: item
      });
      if(result.success) {
        this.initData();
      }
    },
    async initData(type = 1) {
      if(type) {
        this.inputFocus = true;
      }
      const result = await getSearchLogList();
      if(result.success) {
        this.logList = result.data;
      }
    },
    debounceHandler: debounce(function () {
      this.$emit('keywordsChange', this.keywords);
    }, 500),
    blurChange() {
      setTimeout(() => {
        this.inputFocus = false;
      }, 200);
    },
    clearKeywords() {
      this.keywords = "";
      if(this.$route.query.keywords) {
        this.$router.replace({
          path: '/center/help'
        });
      }
    },
    searchIndex(item) {
      if(this.className === 'classify-input-wrap') {
        this.$router.push({
          path: '/center/help',
          query: {
            keywords: item
          }
        });
        return;
      }
      this.keywords = item;
      this.$emit('keywordsChange', this.keywords);
    }
  },
};
</script>

<style lang="less" scoped>
.search-input-wrap {
  width: 758px;
  position: relative;
  margin: 0 auto;
  .search-btn {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    color: #4682f3;
    cursor: pointer;
  }
  .list-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
    li {
      width: 33.33%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 20px;
      position: relative;
      padding-left: 20px;
      cursor: pointer;
    }
    li:hover {
      color: #4682f3;
    }
  }
  .search-input {
    width: 760px;
    height: 64px;
    display: block;
    flex-shrink: 0;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 0px 20px 0px rgba(112, 159, 214, 0.2);
    overflow: hidden;
    margin: 0 auto;
    margin-top: 40px;
    border: 1px solid #fff;
    box-sizing: border-box;
    /deep/ input {
      width: 670px;
      height: 64px;
      border: 1px solid #fff;
      box-sizing: border-box;
      border: none;
      padding-left: 64px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
    }
    /deep/ input::placeholder {
      font-size: 16px;
    }
    /deep/ input:focus {
      box-shadow: none;
    }
    /deep/ .ant-input-prefix {
      width: 20px;
      height: 62px;
      top: 31px;
      left: 20px;
      transform: 0;
    }
    /deep/ .ant-input-suffix {
      right: 20px;
    }
  }
  .search-input::placeholder {
    color: rgba(0, 0, 0, 0.25);
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .search-result {
    width: 760px;
    max-height: 260px;
    overflow: hidden;
    background: #fff;
    padding: 0 20px;
    border: 1px solid #4682f3;
    border-top: none;
    box-sizing: border-box;
    border-radius: 0 0 20px 20px;
    padding-bottom: 20px;
    position: absolute;
    top: 64px;
    z-index: 99;
    p {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .name {
        width: 600px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        cursor: pointer;
      }
      .delete {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
      }
      .delete:hover {
        color: #4682f3;
      }
    }
    p:hover {
      width: calc(100% + 40px);
      margin-left: -20px;
      padding: 0 20px;
      background: #e4ebf4;
    }
  }
  .search-log {
    width: 100%;
    height: 40px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 14px;
    text-align: left;
    line-height: 40px;
    border-top: 1px solid #e5e6eb;
    box-sizing: border-box;
    font-weight: bold;
  }
  .search-input-focus {
    border-radius: 20px 20px 0 0;
    box-shadow: none;
    border: 1px solid #4682f3;
    border-bottom: 0;
    box-sizing: border-box;
  }
  .log-list-wrap {
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 0 20px;
    height: 200px;
    overflow: hidden;
    overflow-y: auto;
  }
  .suffix-wrap {
    width: auto;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .grid-line {
      width: 1px;
      height: 24px;
      display: inline-block;
      background: #e5e6eb;
      margin: 0 20px 0 16px;
    }
  }
}

.classify-input-wrap {
  position: absolute;
  right: 200px;
  top: 11px;
  .search-btn {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    color: #4682f3;
    cursor: pointer;
  }
  .list-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
    li {
      width: 33.33%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 20px;
      position: relative;
      padding-left: 20px;
      cursor: pointer;
    }
    li:hover {
      color: #4682f3;
    }
  }
  .search-input {
    width: 404px;
    height: 40px;
    display: block;
    flex-shrink: 0;
    border-radius: 12px;
    background: #fff;
    overflow: hidden;
    border: 1px solid #E5E6EB;
    box-sizing: border-box;
    /deep/ input {
      width: 400px;
      height: 40px;
      border: none;
      padding-left: 64px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/ input:focus {
      box-shadow: none;
    }
    /deep/ .ant-input-prefix {
      width: 20px;
      height: 40px;
      top: 0;
      left: 20px;
      transform: 0;
      top: 20px;
    }
    /deep/ .ant-input-suffix {
      right: 20px;
    }
  }
  .search-input::placeholder {
    color: rgba(0, 0, 0, 0.25);
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .search-result {
    width: 404px;
    max-height: 260px;
    overflow: hidden;
    background: #fff;
    padding: 0 20px;
    border: 1px solid #4682f3;
    border-top: none;
    box-sizing: border-box;
    border-radius: 0 0 12px 12px;
    padding-bottom: 20px;
    position: absolute;
    top: 39px;
    z-index: 99;
    p {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .name {
        width: 300px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        cursor: pointer;
      }
      .delete {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
      }
      .delete:hover {
        color: #4682f3;
      }
    }
    p:hover {
      width: calc(100% + 40px);
      margin-left: -20px;
      padding: 0 20px;
      background: #e4ebf4;
    }
  }
  .search-log {
    width: 100%;
    height: 40px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 14px;
    text-align: left;
    line-height: 40px;
    border-top: 1px solid #e5e6eb;
    box-sizing: border-box;
  }
  .search-input-focus {
    border-radius: 12px 12px 0 0;
    box-shadow: none;
    border: 1px solid #4682f3;
    border-bottom: 0;
    box-sizing: border-box;
  }
  .log-list-wrap {
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 0 20px;
    height: 200px;
    overflow: hidden;
    overflow-y: auto;
  }
  .suffix-wrap {
    width: auto;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .grid-line {
      width: 1px;
      height: 24px;
      display: inline-block;
      background: #e5e6eb;
      margin: 0 20px 0 16px;
    }
  }
}
</style>
