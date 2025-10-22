<template>
  <div class="help-classify-wrap">
    <div class="header">
      <div class="header-title">
        <router-link to="/">
          <div class="logo"></div>
        </router-link>
        <span class="grid-line"></span>
        <span class="title" @click="goBack"> 帮助中心 </span>
      </div>
      <div>
        <SearchInput className="classify-input-wrap" />
      </div>
      <HeaderNameAvatar />
    </div>
    <div class="help-classify-content">
      <div class="help-classify-content-top">
        <div class="left">
          <a-directory-tree
            v-if="!loadingTreeData"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            
            :load-data="onLoadData"
            @expand="onExpand"
            @select="onSelect"
            
          >
          <a-tree-node :key="item.id" :title="item.name" v-for="item in treeData">
            <a-tree-node :key="items.id" :title="items.name" v-for="items in item.children">
              <a-tree-node :key="leaf.id" :title="leaf.name" is-leaf v-for="leaf in items.children" />
              <!-- <a-tree-node key="0-0-1" title="leaf 0-1" is-leaf /> -->
            </a-tree-node>
          </a-tree-node>
            <!-- <a-icon slot="switcherIcon" type="down" /> -->
          </a-directory-tree>
          <a-skeleton v-else active />
        </div>
        <div class="right">
          <p class="breadcrumb-wrap">
            <span
              v-for="(item, index) in breadcrumbList"
              :key="item.id"
              class="breadcrumb-item-wrap"
            >
              <span @click="changeContent(item)" class="breadcrumb-item"
                >{{ item.name }}
              </span>
              <span
                class="split-line"
                v-show="!(index === breadcrumbList.length - 1)"
                >/</span
              >
            </span>
            <!-- <span class="breadcrumb-item-wrap">
              <span class="breadcrumb-item">{{ contentTitle }}</span>
            </span> -->
          </p>
          <div class="content-wrap-wrapper" @scroll="throttleHandler">
            <div class="content-wrap">
              <div v-if="!showContent">
                <p class="title">{{ currentClickTitle }}</p>
                <ul class="menu-list">
                  <li v-for="item in currentClickMenu" :key="item.key" class="menu-item" @click="changeContent(item)">
                    <span style=" flex: 1;" >{{ item.name }}</span>
                    <span class="arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none">
                        <path d="M3.60156 1.19688L8.40156 5.99688L3.60156 10.7969" stroke="#C3C3C3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>

                  </li>
                </ul>
              </div>
              <template v-else>
                <p class="content-title">{{ contentTitle }}</p>
                <div v-html="content" id="content-wrap"></div>
                <div class="nav-footer-wrap" v-if="showContent && !loading">
  
                  <p
                    class="flex-center flex-start"
                    style="flex:1"
                    v-if="preArticle && preArticle.id"
                    @click="nextOrPrevArticle(preArticle, 1)"
                   
                    
                  >
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        上一篇：{{ preArticle.title }}
                      </template>
                      <a-button type="" class="click-btn-wrap" :disabled="loading"  style="text-align: left;">
                        <svg   xmlns="http://www.w3.org/2000/svg"  width="22"  height="22"   viewBox="0 0 22 22" fill="none" >
                          <path
                            d="M5.11736 2.78125C4.35033 2.78125 3.72949 3.4022 3.72949 4.16912V17.8848C3.72949 18.6518 4.35044 19.2727 5.11736 19.2727C5.88428 19.2727 6.50523 18.6517 6.50523 17.8848V4.16912C6.50534 3.4022 5.8823 2.78125 5.11736 2.78125ZM18.1327 4.67831L18.2272 17.4078C18.24 19.0213 16.2871 19.8377 15.1463 18.6969L8.73328 12.2838C8.02862 11.5792 8.02862 10.4361 8.73328 9.73149L15.0518 3.41507C16.184 2.28284 18.1219 3.07561 18.1327 4.67831Z"
                            fill="#C3C3C3"
                          />
                        </svg>
                        <span class="nav-footer-item"  >上一篇：{{ preArticle.title }}</span >
                      </a-button>
                    </a-tooltip>
                  </p>
                  <!-- <p class="flex-middle"></p> -->
                  <p
                    class="flex-center flex-end"
                    v-if="nextArticle && nextArticle.id"
                     style="flex:1"
                    @click="nextOrPrevArticle(nextArticle, 1)"
                  >
                   <a-tooltip placement="topRight">
                      <template slot="title">
                        下一篇：{{ nextArticle.title }}
                      </template>
                      <a-button type="" class="click-btn-wrap" :disabled="loading" style="text-align: right;">
                        <span class="nav-footer-item" >下一篇：{{ nextArticle.title }}</span >
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="22"  height="22" viewBox="0 0 22 22" fill="none" >
                          <path
                            d="M16.8826 2.78125C17.6497 2.78125 18.2705 3.4022 18.2705 4.16912V17.8848C18.2705 18.6518 17.6496 19.2727 16.8826 19.2727C16.1157 19.2727 15.4948 18.6517 15.4948 17.8848V4.16912C15.4947 3.4022 16.1177 2.78125 16.8826 2.78125ZM3.86733 4.67831L3.77284 17.4078C3.75997 19.0213 5.71291 19.8377 6.85372 18.6969L13.2667 12.2838C13.9714 11.5792 13.9714 10.4361 13.2667 9.73149L6.94821 3.41507C5.81598 2.28284 3.87811 3.07561 3.86733 4.67831Z"
                            fill="#C3C3C3"
                          />
                        </svg>
                      </a-button>
                    </a-tooltip>
                  </p>
                </div>
              </template>
              <p class="spin-wrap" v-if="loading">
                <a-spin />
              </p>
            </div>
          </div>
        </div>
        <div class="nav-wrap">
          <ul class="nav-list">
            <li
              :class="[
                'nav-item',
                'nav_' + item.id,
                navActive === index ? 'nav-item-active' : '',
              ]"
              v-for="(item, index) in h1List"
              :key="index"
              @click="scrollContent(item, index)"
            >
              <span
                class="item-dot"
                :style="{
                  background: navActive === index ? '#4682f3' : '#77889D',
                }"
              ></span>
              <span
                :style="{
                  color: navActive === index ? '#4682f3' : '#77889D',
                }"
                >{{ item.content }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-wrap">
      <FooterText />
    </div>
    <image-viewer ref="imageViewer" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { throttle } from "lodash";
import HeaderNameAvatar from "@/components/common/HeaderNameAvatar.vue";
import FooterText from "@/v2/center/home/components/FooterText.vue";
import SearchInput from "@/v2/views/help/components/InputSearch.vue";
import imageViewer from "@/v2/components/imageViewer.vue";
import {
  getClassifyList,
  getArticleDetail,
  getSearchInput,
} from "@/v2/api/helpCenter";
import { filePreview } from "@/v2/utils/file";
import reportCode from "@/v2/config/reportCode";
import { nanoid } from "nanoid";
import { cloneDeep } from 'lodash';
const replaceHtmlTag = ["H1"];
export default {
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      treeData: [],
      breadcrumbList: [],
      currentClickMenu: [],
      currentClickTitle: "",
      navList: [],
      navActive: 0,
      keywords: "",
      showContent: false,
      content: "",
      h1List: [],
      nextArticle: {},
      preArticle: {},
      loading: false,
      articleId: null,
      loadingTreeData: false,
      contentTitle: "",
      imageUrlList: [],
      contentImages: [],
      timer: null,
      scrollTop: 0,
      stopScroll: 0,
      tempNavActive: 0,
      htmlContentStr: "",
      htmlContentHeightArr: [],
      isDetailReadReported: false, // 详情阅读是否上报过
      readTimerId: null, // 阅读时间
      readingTimeSecond: 0, // 阅读时间单位秒
    };
  },
  watch: {
    selectedKeys: {
      handler() {
        this.setBreadcrumbList(this.selectedKeys);
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    HeaderNameAvatar,
    FooterText,
    SearchInput,
    imageViewer,
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
    auth() {
      return (
        this.VUEX_ST_PERSONALLINFO.auth && this.VUEX_ST_COMPANYSUER.companyId
      );
    },
  },
  mounted() {
    if (!this.auth) {
      this.$router.replace("/center/help/auth");
      return;
    }
    this.initData();
    document.querySelector('.content-wrap-wrapper').addEventListener('scroll', this.handleReadingProgress);
  },
  beforeDestroy() {
    document.querySelector('.content-wrap-wrapper').removeEventListener('scroll', this.handleReadingProgress);
    this.startReadTimer();
  },
  methods: {
    // 根据分类id获取分类下文章列表
    async getArticleListById(id) {
      this.loading = true;
      this.showContent = false;
      this.contentTitle = "";
      const result = await this.getArticleList(id);
      this.loading = false;
      if (result.success) {
        result.data.records.forEach((item) => {
          item.isArticle = true;
          item.name = item.title;
          item.id = `article_${item.id}`;
          item.isLeaf = true;
        });
        for(let i = 0;i < this.treeData.length;i ++) {
          if(this.treeData[i].children) {
            let cloneItem = cloneDeep(this.treeData[i]);
            for(let j = 0;j < cloneItem.children.length;j ++) {
              if(cloneItem.children[j].id === id) {
                cloneItem.children[j].children = result.data.records || [];
                this.$set(this.treeData, i, cloneItem);
                break;
              }
            }
          }
        }
        this.currentClickMenu = result.data.records;
      }
    },
    formateTreeData(categoryId, res) {
      for(let i = 0;i < this.treeData.length;i ++) {
        if(this.treeData[i].children) {
          let cloneItem = cloneDeep(this.treeData[i]);
          for(let j = 0;j < cloneItem.children.length;j ++) {
            if(cloneItem.children[j].id === categoryId) {
              cloneItem.children[j].children = res.data.records || [];
              this.$set(this.treeData, i, cloneItem);
              break;
            }
          }
        }
      }
    },
    changeExpendKey(id) {
      for (let i = 0; i < this.treeData.length; i++) {
        if (this.treeData[i].children) {
          for (let j = 0; j < this.treeData[i].children.length; j++) {
            if (this.treeData[i].children[j].id === Number(id)) {
              this.expandedKeys.push(this.treeData[i].id);
              break;
            }
          }
        }
      }
    },
    async getArticleListInCategory(categoryId) {
      return this.getArticleList(categoryId).then(res => {
        if(res.success) {
          res.data.records.forEach(item => {
            item.name = item.title;
            item.isLeaf = true;
            item.id = `article_${item.id}`;
          });
          this.formateTreeData(categoryId, res);
        }
      });
    },
    async nextOrPrevArticle({ id, categoryId }, type) {
      if (!id) return;
      if (type) {
        const code = reportCode.helpCenter.docDetail;
        window.reportUtil.reportEvent(code, {id: id});
      }
      this.loading = true;
      this.articleId = id;
      this.isDetailReadReported = false;
      this.showContent = true;
      this.content = "";
      this.h1List = [];
      this.imageUrlList = [];
      this.contentImages = [];
      this.changeExpendKey(categoryId);
      await this.getArticleListInCategory(categoryId);
      try {
        let articleId = id.toString();
        if(articleId.indexOf('_') >= 0) {
          articleId = articleId.split('_')[1];
        }
        const result = await getArticleDetail({ id: articleId });
        this.loading = false;
        if (result.success) {
          const { content, next, pre, id, categoryId, title } = result.data;
          this.content = content;
          if(next) {
            next.id = `article_${next.id}`;
            this.nextArticle = next;
          } else {
            this.nextArticle = {};
          }
          if(pre) {
            pre.id = `article_${pre.id}`;
            this.preArticle = pre;
          } else {
            this.preArticle = {};
          }
          this.selectedKeys = [`article_${id}`];
          this.expandedKeys = [...this.expandedKeys, categoryId];
          this.contentTitle = title;
          this.$nextTick(() => {
            const htmlContent = document.querySelector("#content-wrap");
            this.h1List = [];
            this.replaceHtmlDom(htmlContent);
            this.computedH1Title(htmlContent);
            this.getImageUrlFormContent(htmlContent);
            const imgs = htmlContent.getElementsByTagName("img");
            this.contentImages = [...imgs];
            this.contentImages.forEach((item, index) => {
              item.addEventListener("click", this.showImage.bind(null, index));
            });
            this.stopReadTimer();
            this.startReadTimer();
            this.handleReadingProgress();
          });
        }
      } catch (error) {
        this.showContent = false;
        this.loading = false;
      }
    },
    replaceHtmlDom(htmlContent) {
      const tagFlag = [];
      const htmlArr = [];
      const createHtmlArr = [];
      const parentElem = document.querySelector("#content-wrap");
      htmlContent?.childNodes.forEach((item, index) => {
        if (
          item.nodeType === 1 &&
          replaceHtmlTag.includes(item.tagName?.toUpperCase())
        ) {
          const id = nanoid(4);
          const content = item.innerHTML.replace(/<[^<>]+>/g, "");
          if(content) {
            this.h1List.push({
              content,
              top: item.offsetTop - 124,
              id,
              clientHeight: item.clientHeight,
            });
            tagFlag.push(index);
          }
        }
      });
      for (let i = 0; i < tagFlag.length; i++) {
        htmlArr.push(
          [...htmlContent.childNodes].slice(tagFlag[i], tagFlag[i + 1])
        );
      }
      htmlArr.forEach((item, index) => {
        const elem = document.createElement("div");
        elem.setAttribute("class", this.h1List[index].id);
        elem.style.overflow = "hidden";
        item.forEach((items) => {
          elem.appendChild(items);
        });
        createHtmlArr.push(elem);
      });
      createHtmlArr.forEach((item) => {
        parentElem.appendChild(item);
      });
    },
    showImage(index) {
      filePreview(this.imageUrlList, this.$refs.imageViewer.show, false, index);
    },
    async initData() {
      this.loadingTreeData = true;
      const result = await getClassifyList();
      this.loadingTreeData = false;
      if (result.success) {
        const questionItem = result.data.filter(
          (item) => item.tag === "QUESTION"
        );
        const arr = [];
        result.data.forEach((item) => {
          if (item.tag !== "QUESTION") {
            arr.push(item);
          }
        });
        this.treeData = arr.concat(questionItem);
        const { id, categoryId, type } = this.$route.query;
        if (id && categoryId && type) {
          if (type === "1") {
            this.nextOrPrevArticle({ id, categoryId }, 0);
            this.initMenuActive(1, categoryId, id);
            this.showContent = true;
          } else {
            this.expandedKeys = [Number(id)];
            this.selectedKeys = [Number(id)];
            const selectId = categoryId === "categoryId" ? id : categoryId;
            const currentTreeItem = this.treeData.filter(
              (item) => item.id == selectId
            )[0];
            if (categoryId === "categoryId") {
              this.currentClickMenu = currentTreeItem.children || [];
            } else {
              this.getArticleListById(id);
            }
            this.currentClickTitle = currentTreeItem?.name;
          }
        } else {
          this.initMenuActive(2, categoryId, id);
        }
      }
    },
    // 导航自动滚动
    scrollNavWrap(index) {
      const navWrap = document.querySelector(".nav-list");
      const scrollItem = navWrap.querySelector(`.nav_${this.h1List[index].id}`);
      if (scrollItem) {
        scrollItem.scrollIntoView({
          behavior: "smooth",
          top: 0
        });
      }
    },
    // 内容区域滚动结束
    scrollEnd() {
      this.stopScroll = document.querySelector(".content-wrap-wrapper").scrollTop;
      if (this.stopScroll === this.scrollTop) {
        this.$nextTick(() => {
          this.navActive = this.tempNavActive;
          // this.scrollNavWrap(this.navActive);
        });
      }
    },
    throttleHandler: throttle(function (e) {
      this.$nextTick(() => {
        this.contentScroll(e);
      });
    }, 500),
    getContentChangeLine() {
      const elem = document.querySelector(".content-wrap-wrapper");
      return elem.getBoundingClientRect().top;
    },
    contentScroll(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.scrollEnd, 500);
      const scrollTop = e.target.scrollTop;
      this.scrollTop = scrollTop;
      const elem = document.querySelector(".content-wrap-wrapper");
      const distance = this.getContentChangeLine();
      if (scrollTop === 0) {
        this.tempNavActive = 0;
        return;
      }
      if (scrollTop + elem.getBoundingClientRect().height + 10 >= elem.scrollHeight) {
        this.tempNavActive = this.h1List.length - 1;
        return;
      }
      for (let i = 0; i < this.h1List.length; i++) {
        const elemCurrent = elem.getElementsByClassName(
          `${this.h1List[i].id}`
        )[0];
        const offsetTop = elemCurrent.getBoundingClientRect().top;
        const offsetBottom = elemCurrent.getBoundingClientRect().bottom;
        if(distance >= Math.floor(offsetTop) && distance < offsetBottom) {
          this.tempNavActive = i;
        }
      }
    },
    // 获取image元素链接
    getImageUrlFormContent(htmlContent) {
      if (htmlContent && htmlContent.childNodes) {
        htmlContent.childNodes.forEach((item) => {
          if (item.nodeType === 1 && item.tagName?.toUpperCase() === "IMG") {
            this.imageUrlList.push(item.getAttribute("src"));
          }
          this.getImageUrlFormContent(item);
        });
      }
    },
    // 设置内容菜单导航
    computedH1Title(htmlContent) {
      if (htmlContent && htmlContent.childNodes) {
        htmlContent.childNodes.forEach((item) => {
          this.htmlContentHeightArr.push(item.clientHeight);
          if (item.nodeType === 1) {
            if (replaceHtmlTag.includes(item.tagName?.toUpperCase())) {
              const content = item.innerHTML.replace(/<[^<>]+>/g, "");
              if (content) {
                this.htmlContentStr += `空,${item.clientHeight},`;
              }
            } else {
              this.htmlContentStr += `${item.clientHeight},`;
            }
          }
        });
      }
    },
    scrollContent(item, index) {
      try {
        this.isClick = true;
        this.navActive = index;
        const elem = document.querySelector(".content-wrap");
        const scrollElem = elem.getElementsByClassName(`${item.id}`);
        scrollElem[0].scrollIntoView({
          behavior: "smooth",
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 初始化页面内容
    initMenuActive(type, categoryId, id) {
      let currentTreeItem = null;
      if (type === 1) {
        currentTreeItem = {
          id: `article_${Number(id)}`,
          categoryId: Number(categoryId),
        }
      } else {
        currentTreeItem = this.treeData.filter(
          (item) => item.tag === "QUESTION"
        )[0];
      }
      this.expandedKeys = [currentTreeItem?.categoryId, currentTreeItem?.id];
      this.currentClickMenu = currentTreeItem?.children || [];
      this.currentClickTitle = currentTreeItem?.name;
    },
    // 面包屑点击事件
    changeContent(item) {
      this.showContent = false;
      this.contentTitle = "";
      if (item.isArticle || item.isLeaf) {
        const { id, categoryId } = item;
        this.nextOrPrevArticle({id, categoryId}, 1);
        return;
      }
      if (item.link) {
        this.$router.replace("/center/help");
      } else {
        this.selectedKeys = [item.id];
        this.currentClickTitle = item.name;
        this.currentClickMenu = item.children;
        // 获取文章列表
        if (!item.children) {
          this.getArticleListById(item.id);
        }
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    getArticleList(id) {
      const tempId = id.toString().indexOf('article_') >= 0 ? id.toString().replace('article_', '') : id;
      return getSearchInput({
        categoryId: tempId,
        pageNo: 1,
        pageSize: 9999,
      });
    },
    onLoadData(treeNode) {
      return new Promise(async (resolve) => {
        if (treeNode.$children) {
          resolve();
          return;
        }
        const result = await this.getArticleList(treeNode.eventKey);
        result.data.records.forEach(item => {
          item.name = item.title;
          item.isLeaf = true;
          item.id = `article_${item.id}`;
        });
        treeNode.$children = result.data.records;
        this.treeData = [...this.treeData];
        resolve();
      })
    },
    updateExpandedKeys(selectedKeys) {
      const tempExpandedKeys = [...this.expandedKeys];
      if (tempExpandedKeys.includes(selectedKeys)) {
        for( let i = 0;i < tempExpandedKeys.length;i ++) {
          if (tempExpandedKeys[i] == selectedKeys) {
            tempExpandedKeys.splice(i, 1);
            this.expandedKeys = [...new Set(tempExpandedKeys)];
            break;
          }
        }
      } else {
        this.expandedKeys = [...tempExpandedKeys, selectedKeys];
      }
      this.$forceUpdate();
    },
    onSelect(selectedKeys, info) {
      this.h1List = [];
      if (selectedKeys.length) {
        const props = info.node;
        const { eventKey, isLeaf } = info.node;
        if (isLeaf) {
          this.nextOrPrevArticle({id: eventKey, categoryId: eventKey}, 1);
          return;
        }
        this.selectedKeys = selectedKeys;
        this.currentClickTitle = props.title;
        this.currentClickMenu = props.dataRef?.children || [];
        if (!this.currentClickMenu.length) {
          this.getArticleListById(selectedKeys[0]);
        } else {
          this.showContent = false;
        }
      }
    },
    // 设置面包屑
    async setBreadcrumbList() {
      let result = [];
      this.findParent(this.treeData, this.selectedKeys[0], result);
      this.breadcrumbList = [
        {
          id: "/center/help",
          name: "帮助中心",
          link: "/center/help",
        },
      ].concat(result);
    },
    findParent(data, key, result) {
      for (let item of data) {
        if (item.id == key) {
          result.unshift(item);
          return true;
        }
        if (item.children && item.children.length > 0) {
          let isFind = this.findParent(item.children, key, result);
          if (isFind) {
            result.unshift(item);
            return true;
          }
        }
      }
      return false;
    },
    goBack() {
      this.$router.push('/center/help')
    },
    // 开启阅读定时器
    startReadTimer() {  
      if (!this.timerId) {  
        this.timerId = setInterval(() => {  
          this.readingTimeSecond += 1;  
          this.handleReadingProgress();
        }, 1000);  
      }  
    },  
    // 停止阅读定时器
    stopReadTimer() {  
      if (this.timerId) {  
        clearInterval(this.timerId);  
        this.timerId = null;  
        this.readingTimeSecond = 0;
      }  
    },
    // 处理阅读
    handleReadingProgress() {
      let contentWrapperElement = document.querySelector('.content-wrap-wrapper')
      let scrollTop = contentWrapperElement?.scrollTop;
      let clientHeight = contentWrapperElement?.clientHeight;
      let scrollHeight = contentWrapperElement?.scrollHeight;
      // 阅读百分比
      let readPercent = (clientHeight + scrollTop) / scrollHeight;
      // console.log('isDetailReadReported:', this.isDetailReadReported, 'readPercent:',readPercent,'readingTimeSecond:',this.readingTimeSecond);
      if (this.isDetailReadReported == false && readPercent > 0.6 && this.readingTimeSecond > 5) {
        this.reportReadComplite();
        this.isDetailReadReported = true;
        this.stopReadTimer();
      }
    },
    reportReadComplite() {
      const code = reportCode.helpCenter.docDetailRead;
      window.reportUtil.reportEvent(code, {id: this.articleId}); 
    }
  },
  beforeCreate() {
    this.contentImages?.forEach((item) => {
      item.removeEventListener(this.showImage);
    });
  },
};
</script>


<style lang="less" scoped>
.help-classify-wrap {
  .flex-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 300px;
    overflow: hidden;
  }
  .flex-middle {
    width: calc(100% - 280px);
  }
  .header {
    width: 100%;
    height: 64px;
    // overflow: hidden;
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
    position: sticky;
    background: #fff;
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
    cursor: pointer;
  }
  .search-input {
    width: 404px;
    flex-shrink: 0;
    position: absolute;
    right: 200px;
    top: 12px;
    /deep/ .ant-input-prefix {
      left: 20px;
    }
    /deep/ .ant-input-suffix {
      right: 20px;
    }
    /deep/ input {
      height: 40px;
      border-radius: 12px;
      padding-left: 64px;
    }
  }
  .help-classify-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 64px);
    overflow: hidden;
    .help-classify-content-top {
      display: flex;
    }
    .left {
      width: 288px;
      height: calc(100vh - 64px);
      border-right: 1px solid #e5e6eb;
      box-sizing: border-box;
      padding: 20px;
      overflow: hidden;
      overflow-y: auto;
      /deep/ .ant-tree {
        .ant-tree-title {
          width: 200px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(0, 0, 0, 0.8);
        }
        .ant-tree-node-selected {
          .ant-tree-title {
            color: #4682f3;
          }
        }
        font-family: PingFang SC;
        li span.ant-tree-switcher {
          width: 16px;
          height: 16px;
          line-height: 16px;
        }
        .ant-tree li .ant-tree-node-content-wrapper {
          padding: 0 8px;
        }
        li .ant-tree-node-content-wrapper.ant-tree-node-selected {
          background-color: #fff;
          color: #4682f3;
        }
        li .ant-tree-node-content-wrapper:hover {
          background-color: #fff;
        }
        .ant-tree-switcher_open {
          vertical-align: middle;
          i {
            svg {
              display: none;
            }
            width: 16px;
            height: 16px;
            display: inline-block;
            background-image: url("~@/assets/imgs/helpcenter/frame-open.png");
            background-size: 16px 16px;
          }
        }
        .ant-tree-switcher_close {
          vertical-align: middle;
          i {
            svg {
              display: none;
            }
            width: 16px;
            height: 16px;
            display: inline-block;
            background-image: url("~@/assets/imgs/helpcenter/frame-close.png");
            background-size: 16px 16px;
          }
        }
        li {
          .ant-tree-node-content-wrapper {
            font-size: 14px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.8);
          }
          ul {
            li {
              .ant-tree-node-content-wrapper {
                font-weight: 400;
              }
              ul {
                li {
                  .ant-tree-node-content-wrapper {
                    color: rgba(0, 0, 0, 0.4);
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      padding: 20px 30px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      padding-bottom: 0;
      .content-wrap-wrapper {
        margin-top: 20px;
        width: 100%;
        height: calc(100vh - 124px);
        overflow: hidden;
        overflow-y: auto;
      }
      .content-wrap-wrapper::-webkit-scrollbar {
        display: none;
      }
      .content-wrap {
        width: 100%;
        height: auto;
        /deep/ table {
          tr,
          th,
          td {
            height: 30px;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.4);
          }
          th {
            background-color: #f1f1f1;
          }
          border-collapse: collapse;
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
      .breadcrumb-wrap {
        width: 100%;
        height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .breadcrumb-item-wrap {
          width: auto;
          display: flex;
        }
        .breadcrumb-item-wrap:nth-last-child(1) {
          .breadcrumb-item {
            font-weight: bold;
          }
        }
        .breadcrumb-item {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }
        .breadcrumb-item:nth-last-child(1) {
          cursor: auto;
        }
        span {
          color: rgba(0, 0, 0, 0.4);
          font-size: 14px;
          font-weight: 400;
        }
        span:nth-last-child(1) {
          font-weight: bold;
        }
        .split-line {
          display: inline-block;
          margin: 0 8px;
          font-weight: normal !important;
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
      .menu-list {
        margin-top: 30px;
        display: flex;
        flex-wrap: wrap;
        width: 640px;
       
        
        .menu-item {
          display: flex;
          width: 300px;
          padding: 20px;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          border-radius: 4px;
          background: var(--hover, #E4EBF4);
          padding-left: 0;
          padding-right: 0;
          font-size: 16px;
           margin-right: 20px;
           margin-bottom: 20px;
        }
        li {
          width: auto;
          height: 22px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          color: rgba(0, 0, 0, 0.8);
          font-size: 14px;
          padding-left: 20px;
          position: relative;
          margin-top: 16px;
          span {
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left:30px ;
           
          }
          .arrow {
            display: inline-block;
            // width: 20px;
            margin-top: 3px;
            padding-left:0px ;
            padding-right: 20px;

          }
          span:hover {
            color: #1890ff;
          }
          span:hover::before {
            background: #1890ff;
          }
          span::before {
            content: "";
            width: 5px;
            height: 5px;
            display: inline-block;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 50%;
            position: absolute;
            left: 20px;
            top: 50%;
            margin-top: -2.5px;
          }
        }
      }
      .nav-footer-wrap {
        display: flex;
        justify-content: space-between;
        .nav-footer-item {
          width: auto;
          // max-width: 180px;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 8px;
          cursor: pointer;
        }
        .nav-footer-item:hover {
          color: #4682f3;
        }
        width: 100%;
        height: 105px;
        display: flex;
        justify-content: space-between;
        // align-items: flex-start;
        // padding-top: 30px;
        border-top: 1px solid #e5e6eb;
        box-sizing: border-box;
        // margin-top: 30px;
      }
    }
    .nav-wrap {
      width: 230px;
      padding-right: 30px;
      padding-top: 30px;
      height: calc(100vh - 64px);
      overflow: hidden;
      overflow-y: auto;
      .nav-list {
        width: 200px;
        height: auto;
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
        .item-dot {
          width: 5px !important;
          height: 5px !important;
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
    .nav-wrap::-webkit-scrollbar {
      display: none;
    }
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
  .click-btn-wrap {
    border: none;
    box-shadow: none;
    padding: 0;
    width: 100%;
  }
  .click-btn-wrap:hover {
    svg {
      path {
        fill: #1890ff;
      }
    }
  }
  .click-btn-wrap[disabled] {
    background-color: #fff;
  }
  .click-btn-wrap[disabled]:hover {
    background-color: #fff;
    svg {
      path {
        fill: rgb(195, 195, 195);
      }
    }
  }
  .content-title {
    color: rgba(0, 0, 0, 0.8);
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .flex-start {
    justify-content: flex-start;
  }
  .flex-end {
    justify-content: flex-end;
  }
}
/deep/ .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before,
/deep/ .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before {
   background: #fff;
}
/deep/ .ant-tree li span.ant-tree-iconEle {
  display: none;
}
/deep/ .ant-tree.ant-tree-directory > li span.ant-tree-node-content-wrapper::before, .ant-tree.ant-tree-directory .ant-tree-child-tree > li span.ant-tree-node-content-wrapper::before {
  display: none;
}
/deep/ .ant-tree-title {
  max-width: 200px;
  width: auto !important;
}

</style>
