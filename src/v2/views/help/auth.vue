<template>
  <div class="help-classify-wrap">
    <div class="header">
      <div class="header-title">
        <router-link to="/">
          <div class="logo"></div>
        </router-link>
        <span class="grid-line"></span>
        <span class="title">帮助中心</span>
      </div>
      <HeaderNameAvatar />
    </div>
    <div class="help-classify-content">
      <div class="help-classify-content-top">
        <div class="left">
        </div>
        <div class="right">
          <div class="content-wrap" @scroll="throttleHandler">
            <template>
              <p class="content-title">{{title}}</p>
              <div v-html="content" id="auth-content-wrap"></div>
            </template>
            <p class="spin-wrap" v-if="loading">
              <a-spin />
            </p>
          </div>
        </div>
        <div class="nav-wrap">
          <ul class="nav-list">
            <li
              :class="['nav-item', navActive === index ? 'nav-item-active' : '']"
              v-for="(item, index) in h1List"
              :key="index"
              @click="scrollContent(item, index)"
            >
            <span>{{ item.content }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-wrap">
      <a-button
        type="primary"
        class="auth-btn"
        @click="$router.push('/center/account/person/info')"
      >立即认证</a-button>
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
import HeaderNameAvatar from "@/components/common/HeaderNameAvatar.vue";
import { getArticleDefault } from '@/v2/api/helpCenter';

export default {
  data() {
    return {
      navActive: 0,
      content: '',
      h1List: [],
      loading: false,
      title: ''
    };
  },
  watch: {
  },
  components: {
    HeaderNameAvatar
  },
  mounted() {
    this.getContent();
  },
  methods: {
    async getContent() {
      this.loading = true;
      const result = await getArticleDefault();
      this.loading = false;
      if(result.success) {
        const { defaultDoc } = result.data;
        this.content = defaultDoc.content;
        this.title = defaultDoc.title;
        this.$nextTick(() => {
          const htmlContent = document.querySelector('#auth-content-wrap');
          this.h1List = [];
          this.computedH1Title(htmlContent);
        });
      }
    },
    throttleHandler: throttle(function (e) {
      this.contentScroll(e);
    }, 500),
    contentScroll(e) {
      const scrollTop = e.target.scrollTop;
      this.navActive = 0;
      for (let i = 0;i < this.h1List.length;i ++) {
        if (scrollTop >= this.h1List[i].top) {
          this.navActive = i;
        }
      }
    },
    // 设置内容菜单导航
    computedH1Title(htmlContent) {
      if (htmlContent && htmlContent.childNodes) {
        htmlContent.childNodes.forEach(item => {
          if (item?.tagName?.toUpperCase() === 'H1') {
            this.h1List.push({
              content: item.innerHTML.replace(/<[^<>]+>/g, ''),
              top: item.offsetTop - 124,
            });
          }
          if (item.childNodes) {
            this.computedH1Title(item.childNodes);
          }
        })
      }
    },
    scrollContent(item, index) {
      this.navActive = index;
      const elem = document.querySelector('#content-wrap');
      const scrollElem = elem.getElementsByTagName('h1');
      scrollElem[index].scrollIntoView({
        behavior: 'smooth'
      });
    },
  },
};
</script>

<style lang="less" scoped>
.help-classify-wrap {
  .flex-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 140px;
    overflow: hidden;
  }
  .flex-middle {
    width: calc(100% - 280px);
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
    border-bottom: 1px solid #eee;
    position: relative;
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
    height: 14px;
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
  .help-classify-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 128px);
    overflow: hidden;
    .help-classify-content-top {
      display: flex;
    }
    .left {
      width: 288px;
      height: calc(100vh - 128px);
      // border-right: 1px solid #e5e6eb;
      box-sizing: border-box;
      padding: 20px;
      overflow: hidden;
      overflow-y: auto;
    }
    .right {
      flex: 1;
      padding: 20px 30px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      .content-wrap {
        width: 100%;
        height: calc(100vh - 170px);
        overflow: hidden;
        overflow-y: auto;
        .content-title {
          color: rgba(0, 0, 0, 0.80);
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 30px;
        }
        .spin-wrap {
          width: 100%;
          height: 70%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      }
      .title {
        width: 100%;
        height: 24px;
        line-height: 1;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 500;
      }
    }
    .nav-wrap {
      width: 230px;
      padding-right: 30px;
      padding-top: 30px;
      height: auto;
      .nav-list {
        width: 200px;
        height: 40px;
        .nav-item {
          width: 200px;
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          color: #77889d;
          font-size: 14px;
          font-weight: 400;
          border-left: 1px solid #e5e6eb;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
          text-align: left;
          span {
            width: 179px;
            height: 40px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
        .nav-item::before {
          content: "";
          width: 5px;
          height: 5px;
          background: #77889d;
          display: inline-block;
          border-radius: 50%;
          margin: 0 8px;
        }
        .nav-item-active::after {
          content: "";
          width: 8px;
          height: 12px;
          display: inline-block;
          background-image: url("~@/assets/imgs/helpcenter/pointer.png");
          background-size: 8px 12px;
          background-repeat: no-repeat;
          position: absolute;
          left: 0;
        }
      }
    }
  }
  .footer-wrap {
    width: 100%;
    height: 64px;
    border-top: 1px solid #E5E6EB;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .auth-btn {
      width: 116px;
      height: 32px;
    }
  }
}
</style>
