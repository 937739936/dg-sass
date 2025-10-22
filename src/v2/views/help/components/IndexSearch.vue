<template>
  <div>
    <div class="question-list">
      <p class="title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M16.2246 1.30469H3.75586C2.36914 1.30469 1.24609 2.42773 1.24609 3.81445V16.2852C1.24609 17.6719 2.36914 18.7949 3.75586 18.7949H16.2266C17.6133 18.7949 18.7363 17.6719 18.7363 16.2852V3.81445C18.7363 2.42773 17.6113 1.30469 16.2246 1.30469ZM10.9141 15.7441C10.666 15.9922 10.3281 16.1328 9.97656 16.1328C9.24414 16.1328 8.65039 15.5391 8.65039 14.8066C8.65039 14.0742 9.24414 13.4805 9.97656 13.4805C10.709 13.4805 11.3027 14.0742 11.3027 14.8066C11.3027 15.1582 11.1621 15.4961 10.9141 15.7441ZM13.5957 8.53516C13.1074 9.18555 12.5312 9.76562 11.8848 10.2598C11.5449 10.5078 11.2578 10.8184 11.0352 11.1738C10.9023 11.5703 10.8535 11.9902 10.8887 12.4062H8.93945V11.8887C8.92188 11.3535 9.03125 10.8223 9.25781 10.3379C9.58398 9.82031 10.0078 9.36914 10.5039 9.01172C10.9062 8.71094 11.2812 8.37695 11.6309 8.01758C11.8125 7.7832 11.9121 7.49219 11.9102 7.19531C11.9102 6.7793 11.7266 6.38672 11.4062 6.12109C11.0352 5.8125 10.5625 5.65234 10.0801 5.66992C9.59766 5.66406 9.12695 5.82812 8.75391 6.13477C8.36914 6.52344 8.10547 7.01758 7.99805 7.55469C7.93164 7.95312 6.00977 8.125 6.02148 7.31641C6.08008 6.41602 6.50195 5.58008 7.1875 4.99609C7.95703 4.32227 8.94922 3.95898 9.97266 3.97461C11.041 3.91797 12.0898 4.26367 12.916 4.94336C13.5801 5.50391 13.959 6.33008 13.9512 7.19727C13.9668 7.66797 13.8418 8.13281 13.5957 8.53516Z"
            fill="#BBCBE9"
          />
        </svg>
        <span class="question-item-title">常见问题</span>
        <span class="click-text" @click="classifyList(null)">查看全部</span>
      </p>
      <ul class="list-wrap padding-left-20px">
        <li class="dot" v-for="item in questionList" :key="item.id">
          <!-- <span class="item-dot"></span> -->
          <span @click="contentDetail({ ...item, type: 1 })">{{
            item.title
          }}</span>
        </li>
      </ul>
    </div>
    <ul class="business-list">
      <li v-for="item in businessList" :key="item.id">
        <p class="title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.9153 18.765H3.08348C1.3807 18.765 0 17.3555 0 15.6172L0 3.14778C0 1.40949 1.3807 0 3.08348 0H6.9852C8.01539 0 8.92836 0.67936 9.24334 1.68148L9.78212 3.39559C9.93544 3.88396 10.2368 4.30998 10.6426 4.61219C11.0485 4.91441 11.5379 5.07719 12.0403 5.07706H16.9165C18.6193 5.07706 20 6.48655 20 8.22484V15.616C19.9988 17.3555 18.6181 18.765 16.9153 18.765Z" fill="#4682F3"/>
  <path d="M15.8263 10H4.17369C2.97301 10 2 9.15446 2 8.11108V4.87814C2 3.28875 3.48304 2 5.31204 2H14.688C16.517 2 18 3.28875 18 4.87814V8.11108C18 9.15446 17.027 10 15.8263 10Z" fill="#9AE7FF"/>
  <path d="M16.4279 5.15999H12.1902C11.0837 5.15999 10.2994 4.66195 9.96112 3.74568C9.76137 3.20472 9.52683 2.54252 9.33173 2H5.31204C3.48304 2 2 3.28875 2 4.87814V15.0935C2 16.1368 2.97301 16.9824 4.17369 16.9824H15.8263C17.027 16.9824 18 16.1368 18 15.0935V5.2805C17.5027 5.15999 16.9742 5.15999 16.4279 5.15999Z" fill="#2ECDFF"/>
  <rect x="5.01855" y="8.38672" width="9.96301" height="1.56641" rx="0.783203" fill="#D9F8FF"/>
  <rect x="5.01855" y="12.1445" width="6.58533" height="1.56641" rx="0.783203" fill="#D9F8FF"/>
</svg>
          <span class="item-title">{{ item.name }}</span>
          <span class="more" @click="classifyList(item)">查看全部</span>
        </p>
        <div class="list-wrap">
          <p v-for="items in item.children" :key="items.id">
            <span class="list-dot"></span>
            <span
              class="list-item-module"
              @click="
                contentDetail({ ...items, categoryId: items.parentId, type: 2 })
              "
              >{{ items.name }}</span
            >
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDefaultList } from "@/v2/api/helpCenter";
import reportCode from "@/v2/config/reportCode";

export default {
  data() {
    return {
      questionList: [],
      businessList: [],
      classifyIcon: require("@/assets/imgs/helpcenter/classify-icon.png"),
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    contentDetail(item) {
      const code = reportCode.helpCenter.docDetail;
      window.reportUtil.reportEvent(code, {keywords: this.keywords});
      if (item.type === 1) {
        const { id, categoryId } = item;
        window.open(
          `/center/help/classify?id=${id}&categoryId=${categoryId}&type=1`
        );
        return;
      }
      const { id, categoryId, type } = item;
      window.open(
        `/center/help/classify?id=${id}&categoryId=${categoryId}&type=${type}`
      );
    },
    async initData() {
      const result = await getDefaultList();
      if (result.success) {
        const { hotCategory, hotQuestions } = result.data;
        this.questionList = hotQuestions;
        this.businessList = hotCategory;
      }
    },
    classifyList(item) {
      if (!item) {
        window.open(`/center/help/classify?type=1`);
      } else {
        const { id } = item;
        window.open(
          `/center/help/classify?id=${id}&categoryId=${id}&type=2`
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list-wrap {
  width: 1200px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  li {
    width: 33.33%;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 20px;
    padding: 0 10px;
    padding-left: 6px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      width: auto;
      max-width: 100%;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      position: relative;
      padding-left: 15px;
    }
    span::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      background: #000;
      position: absolute;
      top: 50%;
      margin-top: -3px;
      left: 0;
    }
    span:hover {
      color: #4682f3;
    }
    span:hover::before {
      background: #4682f3;
    }
  }
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
.business-list {
  width: 1200px;
  min-height: 241px;
  height: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 20px;
  margin: 0 auto;
  margin-top: 30px;
  li {
    width: 380px;
    height: 226px;
    border-radius: 10px;
    background: #fff;
    padding: 20px 16px;
    box-sizing: border-box;
    .title {
      width: 100%;
      height: 26px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      img {
        width: 20px;
        height: 20px;
      }
      .item-title {
        max-width: 100px;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        margin-left: 10px;
        color: rgba(0, 0, 0, 0.8);
      }
      .more {
        font-size: 12px;
        font-weight: 400;
        color: #4682f3;
        position: absolute;
        right: 0;
        cursor: pointer;
        font-family: PingFang SC;
      }
    }
    .list-wrap {
      width: 340px;
      margin-top: 20px;
      p {
        width: 100%;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 6px;
        margin-bottom: 10px;
        .list-item-module {
          max-width: 330px;
          width: auto;
          height: 20px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.8);
          position: relative;
          padding-left: 15px;
        }
        .list-item-module::before {
          content: '';
          width: 6px;
          height: 6px;
          display: inline-block;
          background: #000;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 0;
          margin-top: -3px;
        }
      }
      .list-item-module:hover {
        color: #4682f3;
      }
      .list-item-module:hover::before {
         background: #4682f3;
      }
    }
  }
}
.question-list {
  width: 100%;
  height: 146px;
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 76px;
  padding-top: 20px;
  box-sizing: border-box;
  // padding-left: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 1200px;
    text-align: left;
    height: 26px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    .question-item-title {
      margin: 0 16px 0 10px;
    }
  }
  .padding-left-20px {
    padding-left: 16px;
  }
}
</style>
