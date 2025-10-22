<template>
  <div>
    <!-- 核心企业和一般贸易是 -->
    <CoreList
      :type='type'
      :transferListApi='getWarehouseReceiptTransferList'
      :receiveListApi='getWarehouseReceiptTransferList'
      :statisticsApi='getWarehouseReceiptTransferStatic'
      :delApi='delWarehouseReceiptTransfer'
      @goApply='goApply'
    ></CoreList>
    <RelationContract
      :isNoRelation='false'
      ref="relationContract" 
      @relation='goAdd'
      querySource='WAREHOUSE_RECEIPT_TRANSFER'
      source='list'
      type="OUT"
  >
  </RelationContract>
  </div>
</template>

<script>
import CoreList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/CoreList'
import StorageAndList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/StorageAndList'
import RelationContract from '../components/RelationContract.vue'

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
    delWarehouseReceiptTransfer,
    getWarehouseReceiptTransferStatic,
    goApply() {
      this.$refs.relationContract.show()
    },
    goAdd(info) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/apply',
				query: {
					contractId: info.orderContractId,
					contractType: info.contractType,
				}
			})
    }
  },
  components: {
    CoreList,
    StorageAndList,
    RelationContract,
  }
}
</script>

<style scoped  lang='less' >

</style>
