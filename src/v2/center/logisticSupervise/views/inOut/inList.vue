<template>
	<div class="slMain">
		<WarehouseList
			type="in"
			:listFn="getInOutList"
			:houseApi="getHouseListNew"
			:statisticsApi="getInOutStatistics"
			:delApi="delInOut"
			@export="exportData"
			@detail="goDetail"
			auth="logicDeliverMonitor:storeManager:inputRecord:add"
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
			typeRecord="IN"
		>
		</RelationContract>
	</div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import WarehouseList from './components/warehouseList.vue';
import { getInOutStatistics, getInOutList, exportInOutList, delInOut } from '../../api/inout.js';
import { getHouseListNew } from '../../api/selectData';
import comDownload from '@sub/utils/comDownload.js';
import RelationContract from './components/relationContract.vue';

export default {
	data() {
		return {
			source: 'LOGIC_DELIVER',
			relationType: null,
			typeRecord: null,
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
		// 是否是仓储企业
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
			const name = `入库管理-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format(
				'YYYYMMDD'
			)}.xls`;
			comDownload(res, undefined, name);
		},
		// 新增
		async add(type, typeRecord) {
			if (this.isWarehouseCompany) {
				this.$router.push({
					path: typeRecord === 'PURCHASE_IN' ? '/center/logisticSupervise/in/add' : '/center/logisticSupervise/in/profit/add',
					query: {}
				});
				return;
			}
			this.relationType = type;
			this.typeRecord = typeRecord;
			this.$refs.relationContract.show(type);
		},
		// 关联合同新增
		goAdd(info = {}) {
			this.$router.push({
				path: this.typeRecord === 'PURCHASE_IN' ? '/center/logisticSupervise/in/add' : '/center/logisticSupervise/in/profit/add',
				query: {
					serialNo: info.contractNo,
					orderTypeEnum: info.contractType,
					contractId: info.id,
					type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'in'
				}
			});
		},
		edit(item) {
			this.$router.push({
				path: this.typeRecord === 'PURCHASE_IN' ? '/center/logisticSupervise/in/add' : '/center/logisticSupervise/in/profit/add',
				query: {
					id: item.id,
					type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'in'
				}
			});
		},
		goDetail(item) {
			this.$router.push({
				path: '/center/logisticSupervise/in/detail',
				query: {
					id: item.id,
					type: this.relationType,
					typeRecord: this.typeRecord,
          recordType: 'in'
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
