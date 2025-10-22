<template>
  <div class="tabs-box">
    <a-tabs v-model="status" @change="tabChange">
      <a-tab-pane v-for="item in tabs" :key="item.value">
        <span slot="tab">
          {{item.label}}
          <template v-if="item.num ">
            <span style="color: var(--primary-color)">
              (<template>{{item.num}}</template>)
            </span>
          </template>
        </span>
      </a-tab-pane>
    </a-tabs>
    <div class="right-box" v-if="isExport" >

      <div class="export-box"  @click="exportData">
        <ExportIcon />
        <span class="export-text">数据导出</span>
      </div>
    </div>

  </div>
</template>

<script>
import {ExportIcon} from '@sub/components/svg'
import { mapMutations, mapGetters } from "vuex";

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
    currentStatus: {
      default: ''
    },
    type: {
      default: 'rest'
    },
    isExport: {
      default: true
    }
  },
  computed: {
     ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
     // 判断当前是否是金融机构
    isBank() {
      return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG'
    }
  },
  mounted() {
    // 解决tabs条切换抖动问题，故封装成组件
  },
  watch: {
    statusData: {
      handler(val) {
        if(!val) return
        this.tabs = val
        this.$forceUpdate()
    
      },
      immediate: true,
      deep: true
    },
    currentStatus: {
      handler(val) {
         this.status = val || 'ALL'

      },
      deep: true,
      immediate: true,
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
    synchroData() {
      this.$emit('synchro')
    },
  },
  components: {
    ExportIcon,
  }
};
</script>
<style lang="less" scoped>
  .tabs-box {
    position: relative;
   /deep/ .ant-tabs-bar {
      padding-right: 250px;
     }
    .right-box {
      position: absolute;
      right: 0;
      top: 14px;
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
       cursor: pointer;
      .export-text {
        margin-left: 6px;
      }
    }
  }
</style>