<template>
  <div >
    <StorageAndList
      :type='type'
      :listApi='getWarehouseReceiptTransferList'
      :statisticsApi='getWarehouseReceiptTransferStatic'
    ></StorageAndList>
  </div>
</template>

<script>

import StorageAndList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/StorageAndList'



import { 
getWarehouseReceiptTransferList,
delWarehouseReceiptTransfer,
getWarehouseReceiptTransferStatic,
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'

export default {
  data() {
    return {
      type: 'rest'
    }
  },
  computed: {
    VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
    		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
  },
  methods: {
    getWarehouseReceiptTransferList,
    getWarehouseReceiptTransferStatic,
    goApply() {
      this.$refs.relationContract.show()
    },
    goAdd(info) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/apply',
				query: {
					contractId: info.id,
					serialNo: info.serialNo,
					orderTypeEnum: info.contractType,

				}
			})
    }
  },
  components: {
    StorageAndList,
  }
}
</script>

<style scoped  lang='less' >

</style>
