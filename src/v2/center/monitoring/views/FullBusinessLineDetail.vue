<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">全业务线详情</span>
			</div>
			<template
				v-if="graphRelation.length > 0"
				title="全业务线关系图谱"
				:bordered="false"
			>
				<!-- <div style="width: 100%; height: 260px">
          <VisNetwork :graphRelation="graphRelation" :graphData="graphData" />
        </div> -->
			</template>
			<template
				class="mb16"
				:bordered="false"
				v-if="companyChain.length > 0"
			>
				<CompanyRelationChain
					ref="companyRelationChain"
					:contractChain="contractChain"
					:companyChain="companyChain"
					@change="companyChainChange"
				/>
			</template>
			<template
				:bordered="false"
				v-if="contractDetail.orderNo"
			>
				<BusinessLineContract
					:contractType="2"
					:downOrderId="contractDetail.contractId"
					:orderNo="contractDetail.orderNo"
					:contractNo="contractDetail.fullBusinessLineContractNo"
					:upOrderNo="contractDetail.upContract && contractDetail.upContract.orderNo"
					:dynamicMonitoringDetail="{}"
					flag="1"
				/>
			</template>
		</a-card>
	</div>
</template>
<script>
import {
	API_FullBusinessLineDetailV1,
	API_FullBusinessLineGraphData,
	API_FullBusinessLineGraphDataRelation
} from '@/v2/center/monitoring/api/index';
// import VisNetwork from "@/v2/center/monitoring/components/VisNetwork.vue";
import CompanyRelationChain from '@/v2/center/monitoring/components/CompanyRelationChain';
import BusinessLineContract from '@/v2/center/monitoring/components/BusinessLineContract';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	name: 'SteelFullBusinessLineDetail',
	components: {
		// VisNetwork,
		BusinessLineContract,
		CompanyRelationChain,
		Breadcrumb
	},
	data() {
		return {
			id: '',
			graphData: [],
			graphRelation: [],
			activedCoverLeft: 0,
			activedCoverIndex: 0,
			activedCoverMoveBaseWidth: 206,
			companyChain: [],
			contractChain: [],
			detail: {},
			contractDetail: {}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
		this.getGraphData();
	},
	methods: {
		getDetail() {
			API_FullBusinessLineDetailV1(this.id).then(res => {
				if (res.success) {
					this.companyChain = res.data.companyList;
					this.contractChain = res.data.contractList;
				}
			});
		},
		companyChainChange(data) {
			const { activedCoverIndex, upContract, curContract } = data;

			this.contractDetail = { ...curContract };
			this.contractDetail.upContract = upContract;
			// 如果是上下游均补录，则传入上下游补录，否则以合同类型为主
			if (curContract.businessLineType == 'OFFLINE') {
				this.setRoute(curContract.businessLineType, activedCoverIndex);
			} else {
				this.setRoute(curContract.type, activedCoverIndex);
			}
		},
		async getGraphData() {
			await API_FullBusinessLineGraphData(this.id).then(res => {
				if (res.success) {
					this.graphData = res.data;
				}
			});
			await API_FullBusinessLineGraphDataRelation(this.id).then(res => {
				if (res.success) {
					this.graphRelation = res.data;
				}
			});
		},
		setRoute(businessLineType, activedCoverIndex) {
			this.$router.push({
				path: '/center/monitoring/fullBusinessLine/detail',
				query: {
					...this.$route.query,
					businessLineType: businessLineType,
					activedCoverIndex: activedCoverIndex,
					contractType: 0,
					contractContentActiveIndex: this.$route.query.contractContentActiveIndex || 0,
					cashTabIndex: 0
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.business-line {
	margin: 20px 0;
}
.slMain {
	::v-deep.ant-tabs-bar {
		margin: 0 0 16px 0 !important;
	}
}
</style>
