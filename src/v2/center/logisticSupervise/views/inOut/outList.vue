<template>
	<div class="slMain">
		<WarehouseList
			type="out"
			:listFn="getInOutList"
			:houseApi="getHouseListNew"
			:statisticsApi="getInOutStatistics"
			:delApi="delInOut"
			@export="exportData"
			@detail="goDetail"
			auth="logicDeliverMonitor::storeManager:outputRecord:add"
			@add="add"
			@edit="edit"
			:isCoreCompany="isCoreCompany"
			:isManager="isManager"
		>
		</WarehouseList>
		<RelationContract
			ref="relationContract"
			@relation="goAdd"
			source="list"
			tipMessage="注：无生效中放货指令的标准仓押合同，无法进行手动新增出库"
			operationType="ADD_OUTBOUND"
			typeRecord="OUT"
		>
		</RelationContract>
	</div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import WarehouseList from './components/warehouseList.vue';
import { getInOutStatistics, getInOutList, exportInOutList, delInOut } from '../../api/inout.js';
import { getHouseListNew } from '../../api/selectData';
import RelationContract from './components/relationContract.vue';
export default {
	data() {
		return {
      relationType: null
    };
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		// 是否是仓储企业
		isWarehouseCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		}
	},
	created() {},
	methods: {
		getHouseListNew,
		getInOutStatistics,
		getInOutList,
		delInOut,

		async exportData(params) {
			const res = await exportInOutList({ ...params, source: 'LOGIC_DELIVER' });
			const name = `出库管理-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format(
				'YYYYMMDD'
			)}.xls`;
			comDownload(res, undefined, name);
		},
		// 新增
		async add(type, typeRecord) {
      this.relationType = type;
			this.typeRecord = typeRecord;
			this.$refs.relationContract.show();
		},
		// 关联合同新增
		goAdd(info = {}) {
			this.$router.push({
				path: this.typeRecord === 'SALE_OUT' ? '/center/logisticSupervise/out/add' : '/center/logisticSupervise/out/loss/add',
				query: {
					serialNo: info.serialNo,
					orderTypeEnum: info.contractType,
					contractId: info.id,
          type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'out'
				}
			});
		},
		edit(item) {
			this.$router.push({
				path: this.typeRecord === 'SALE_OUT' ? '/center/logisticSupervise/out/add' : '/center/logisticSupervise/out/loss/add',
				query: {
					id: item.id,
					type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'out'
				}
			});
		},
		goDetail(item) {
			this.$router.push({
				path: '/center/logisticSupervise/out/detail',
				query: {
					id: item.id,
					type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'out'
				}
			});
		}
	},
	components: {
		WarehouseList,
		RelationContract
	}
};
</script>

<style scoped  lang='less' >
.slMain {
	margin-top: -10px;
}
</style>
