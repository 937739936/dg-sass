<template>
  <div>
    <List 
      :type='type'
      :listApi='getLoanCloseList'
      :getUnClearList='getUnClearList'
      :getLoanCloseStatistics='getLoanCloseStatistics'
      :batchDownloadApi='downloadLoanCloseFile'
      :invalidLoanClose='invalidLoanClose'
      ref="list"
      @openModal='openModal'

    ></List>
    <UnclearedDrawer 
      :listApi='getUnClearList'
      :getUnClearStatic='getUnClearStatic'
      :settlementAgreement='settlementAgreement'
      @success='updateList'
      ref="unclearedDrawer"></UnclearedDrawer>
  </div>
</template>

<script>

import {
	getLoanCloseList,
  getLoanCloseStatistics,
  downloadLoanCloseFile,
  invalidLoanClose,
  getUnClearList,
  getUnClearStatic,
  settlementAgreement,
} from '@/v2/center/financing/api/loanClose.js';
import List from '@sub/financing/loanClose/List'
import UnclearedDrawer from '@sub/financing/loanClose/UnclearedDrawer.vue'

export default {
  data() {
    return {
      type: 'rest'
    }
  },
  methods: {
    getLoanCloseList,
    getLoanCloseStatistics,
    downloadLoanCloseFile,
    invalidLoanClose,
    getUnClearList,
    getUnClearStatic,
    settlementAgreement,
    openModal() {
      this.$refs.unclearedDrawer.show()
    },
    updateList() {
      this.$refs.list.getList()
    }
  },
  components: {
    List,
    UnclearedDrawer,
  }
}
</script>

<style scoped  lang='less' >

</style>
