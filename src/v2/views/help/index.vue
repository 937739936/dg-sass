<template>
  <div class="wrap" v-on:scroll="handleScroll" v-if="auth">
    <div class="background-image"></div>
    <div class="header" :style="{ background: scrollTop > 0 ? '#fff' : '' }">
      <div class="header-title">
        <router-link to="/">
          <div class="logo"></div>
        </router-link>
        <span class="grid-line"></span>
        <span class="title">帮助中心</span>
      </div>
      <HeaderNameAvatar />
    </div>
    <div class="help-content-index-wrap">
      <p class="desc">您好，请问需要什么帮助？</p>
      <SearchInput v-on:keywordsChange="keywordsChange" />
      <SearchIndex v-if="!keywords" />
      <SearchResult ref="searchResult" v-on:updateTotal="updateTotal" v-show="keywords && resultTotal !== 0" :keywords="keywords" />
      <NoData v-show="keywords && resultTotal === 0"/>
    </div>
    <div class="footer-wrap">
      <FooterText />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderNameAvatar from "@/components/common/HeaderNameAvatar.vue";
import FooterText from "@/v2/center/home/components/FooterText.vue";
import SearchIndex from "@/v2/views/help/components/IndexSearch.vue";
import SearchResult from "@/v2/views/help/components/ResultSearch.vue";
import NoData from "@/v2/views/help/components/DataNoTip.vue";
import SearchInput from "@/v2/views/help/components/InputSearch.vue";

export default {
  data() {
    return {
      scrollTop: 0,
      keywords: '',
      resultTotal: null
    };
  },
  components: {
    HeaderNameAvatar,
    FooterText,
    SearchIndex,
    SearchResult,
    NoData,
    SearchInput
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER"
    }),
    auth() {
      return this.VUEX_ST_PERSONALLINFO.auth && this.VUEX_ST_COMPANYSUER.companyId;
    }
  },
  mounted() {
    document.querySelector('#mainContent').addEventListener('scroll', this.handleScroll);
    if(!this.auth) {
      this.$router.replace('/center/help/auth');
    }
  },
  beforeDestroy() {
    const mainContent =  document.querySelector('#mainContent')
     mainContent.removeEventListener &&  mainContent.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    updateTotal(total) {
      this.resultTotal = total;
    },
    async keywordsChange(content) {
      this.keywords = content;
      if(!content) return;
      this.$refs.searchResult.resetPagination();
      this.$refs.searchResult.inputSearchAmount(content);
    },
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .lay-container{
  width:100%;
}
.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #f3f5f6;
  position: relative;
  background-image: url("~@/assets/imgs/helpcenter/background.png");
  background-repeat: no-repeat;
  background-size: 100vw auto;
  .help-content-index-wrap {
    width: 100vw;
    min-height: calc(100vh - 104px);
    padding-bottom: 82px;
    position: relative;
    z-index: 88;
  }
  .dot::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    background: #000;
    position: absolute;
    top: 50%;
    margin-top: -3px;
    left: 5px;
  }
  .question-item-title {
    color: rgba(0, 0, 0, 0.8);
    font-family: PingFang SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
  }
  .click-text {
    color: #4682f3;
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
  }
  .header {
    width: 100%;
    height: 64px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .header-title {
    width: auto;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .logo {
    width: 130px;
    height: 32px;
    background-image: url("~@/assets/imgs/helpcenter/logo.png");
    background-size: contain;
  }
  .grid-line {
    width: 1px;
    height: 16px;
    background: rgba(0, 0, 0, 0.1);
    display: inline-block;
    margin: 0 20px;
  }
  .title {
    color: rgba(0, 0, 0, 0.8);
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .desc {
    width: 384px;
    height: 45px;
    margin: 0 auto;
    color: rgba(0, 0, 0, 0.8);
    font-family: PingFang SC;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-top: 96px;
    position: relative;
    z-index: 88;
  }
  .footer-wrap {
    width: 100%;
    height: 40px;
    background: #eaeced;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /deep/ li {
      color: rgba(0, 0, 0, 0.4);
      font-size: 12px;
    }
    /deep/ a {
      color: rgba(0, 0, 0, 0.4) !important;
      font-size: 12px;
    }
  }
  .search-input-wrap {
     width: 758px;
     position: relative;
     margin: 0 auto;
  }
}
</style>
