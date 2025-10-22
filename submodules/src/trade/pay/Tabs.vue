<template>
  <div class="tabs-box">
    <a-tabs v-model="status" @change="tabChange">
      <a-tab-pane v-for="item in tabs" :key="item.value">
        <span slot="tab">
          {{item.label}}
          <template v-if="item.stateNum && !['CLAIMED', 'ALL'].includes(item.value) ">
            <span style="color: var(--primary-color)">
              (<template>{{item.stateNum}}</template>)
            </span>
          </template>
        </span>
      </a-tab-pane>
    </a-tabs>
    <div class="right-box">

      <div class="oa-box" @click="lookOaData"  v-if="info.oaCollectionWarnBoo" >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2 2H12V12H2L2 2ZM0 2C0 0.89543 0.895431 0 2 0H12C13.1046 0 14 0.895431 14 2V12C14 13.1046 13.1046 14 12 14H2C0.89543 14 0 13.1046 0 12V2ZM11.0468 5.89028C11.3637 5.43795 11.2539 4.81438 10.8016 4.49749C10.3492 4.18059 9.72567 4.29038 9.40878 4.74271L8.06158 6.66566L6.1605 5.1924C5.94021 5.02169 5.65867 4.95065 5.38376 4.99641C5.10885 5.04217 4.8655 5.20057 4.71239 5.43344L2.93665 8.13409C2.63322 8.59555 2.76134 9.21562 3.22281 9.51904C3.68427 9.82247 4.30434 9.69435 4.60777 9.23289L5.78971 7.43532L7.66593 8.88931C7.88217 9.05688 8.15762 9.12855 8.42811 9.08762C8.69861 9.04668 8.94052 8.89672 9.09749 8.67266L11.0468 5.89028Z" fill="#C3C3C3"/>
        </svg>
        <span style="margin-left:6px">查看oa同步异常数据</span>
        <span  style="color: var(--primary-color)" v-if="info.oaCollectionWarnCount > 0 && info.oaCollectionWarnCount <= 99">({{info.oaCollectionWarnCount}})</span>
        <span  style="color: var(--primary-color)" v-if="info.oaCollectionWarnCount > 99 ">(99+)</span>

      </div>
      <div class="line"  v-if="info.oaCollectionWarnBoo"></div>
      <div class="export-box"  @click="exportData">
        <ExportIcon />
        <span class="export-text">数据导出</span>
      </div>
    </div>

  </div>
</template>

<script>
import {ExportIcon} from '../../components/svg'
export default {
  data() {
    return {
      status: 'ALL',
      tabs: []
    };
  },
  props: {
    statusData: {
      default: () => {return []}
    },
    tabsNum: {
      default: () => {return []}
    },
    info: {
       default: () => {return {}}
    },
    currentStatus: {
      default: ''
    },
    type: {
      default: 'rest'
    }
  },
  mounted() {
    // 解决tabs条切换抖动问题，故封装成组件
    this.status = this.statusData[0]?.value
  },
  watch: {
    statusData: {
      handler(val) {
        if(!val) return
        this.tabs = val

      },
      immediate: true,
      deep: true
    },
    currentStatus(val) {
      this.status = val || 'ALL'
    },
    tabsNum:  {
      handler(list) {
        this.tabs.forEach((el,i) => {
          el.num = list[i]?.stateNum || 0
        })
      },
      deep: true
    },

  },
  
  methods: {
    tabChange(key) {
      this.$emit('callback',key)
    },
    rest() {
      this.status = this.statusData[0]?.value || 'ALL'
    },
    lookOaData() {
       this.$emit('look')
    },
    exportData() {
      this.$emit('export')
    },
    getTabNum(value) {
      const obj =  this.tabsNum.find(el => el.tabType == value) || {}
      return obj.stateNum
    }
  },
  components: {
    ExportIcon,
  }
};
</script>
<style lang="less" scoped>
  .tabs-box {
    position: relative;
    .right-box {
      position: absolute;
      right: 0;
      top: 16px;
      // text-align: right;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
    }
    .oa-box {
      display: flex;
      align-items: center;
      color: var(--text-40, rgba(0, 0, 0, 0.40));
    }
    .line {
      width: 1px;
      height: 13px;
      background: #E5E6EB;
      margin: 0 20px;
    }
    .export-box {
      display: flex;
      align-items: center;
      color: @primary-color;
      .export-text {
        margin-left: 6px;
      }
      svg {
        position: relative;
        top: -1px;
      }
    }
  }
</style>