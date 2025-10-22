<template>
	<div>
			<WarehouseReceiptOpenList
				:type="type"
				:listApi="getWarehouseReceiptOpenList"
				:statisticsApi="getWarehouseReceiptOpenStatic"
				:delApi='delWarehouseReceiptOpen'
				@goApply='goApply'
			></WarehouseReceiptOpenList>
		   <RelationContract
			 	:isNoRelation='false'
				ref="relationContract" 
				querySource='WAREHOUSE_RECEIPT_ISSUANCE'
				@relation='goAdd'
				source='list'
				type="IN"
    >
    </RelationContract>
	</div>


</template>

<script>
import WarehouseReceiptOpenList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/List.vue';
import RelationContract from '../components/RelationContract.vue'

import { mapGetters, mapMutations } from 'vuex';
import { 
getWarehouseReceiptOpenList,
getWarehouseReceiptOpenStatic,
delWarehouseReceiptOpen,
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
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		}
	},
  methods: {
		...mapMutations({
			VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR',
		}),
		getWarehouseReceiptOpenList,
		getWarehouseReceiptOpenStatic,
		delWarehouseReceiptOpen,


		goApply() {
			this.$refs.relationContract.show()
		},
		goAdd(info) {
			this.VUEX_SET_UPDATE_INDICATOR([]);
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/apply',
				query: {
					contractId: info.orderContractId,
					contractType: info.contractType,

				}
			})
		}
  },
  components: {
    WarehouseReceiptOpenList,
		RelationContract,
  }
}
</script>

<style scoped  lang='less' >

</style>
