<template>
  <div>
    <div class="tip-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z" fill="#4682F3"/>
      </svg>
      <span style="margin-left:14px" v-if="activeMore == 'ONE_TO_MORE'">当前采购合同已关联{{downNum }}个销售合同，存在于{{downNum}}条业务线中，属于一对多业务线。</span>
      <span style="margin-left:14px" v-if="activeMore == 'MORE_TO_ONE'">当前销售合同已关联{{upNum}}个采购合同，存在于{{upNum}}条业务线中，属于多对一业务线。</span>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeMore: {
      default: ''
    },
    detailData: {
      default: () => {
        return {}
      }
    }
  },
  computed: {
    upNum() {
      const list = this.detailData.upBusinessLineList || []
      return list.length
    },
    downNum() {
      const list = this.detailData.downBusinessLineList || []
      return list.length
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped  lang='less' >
.tip-box {
  background-color: #E1EAFE;
  border: 1px solid #D0DFFF;
  height: 44px;
  padding-left: 14px;
  border-radius: 4px;
  display: flex;
  align-items:center;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 30px;
}
</style>
