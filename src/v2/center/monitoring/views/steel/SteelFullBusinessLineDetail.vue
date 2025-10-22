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
				<!-- <div style="width: 100%; height: 260px" v-if="contractChain.length>=3">
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
				v-if="detailData"
			>
				<BusinessLineContract
					:relationContractDetail="detailData"
					:contractType="detailData.buyCompanyType == 'CORE_COMPANY' ? 0 : 1"
				/>
			</template>
		</a-card>
	</div>
</template>
<script>
import {
	API_FullBusinessLineSteelDetail,
	API_FullBusinessLineSteelBottomDetail,
	API_FullBusinessLineGraphDataRelation
} from '@/v2/center/monitoring/api/index';
// import VisNetwork from "@/v2/center/monitoring/components/VisNetwork.vue";
import CompanyRelationChain from '@/v2/center/monitoring/components/CompanyRelationChain';
import BusinessLineContract from './components/BusinessLineContract.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	name: 'FullBusinessLineDetail',
	components: {
		// VisNetwork,
		BusinessLineContract,
		CompanyRelationChain,
		Breadcrumb
	},
	data() {
		return {
			id: '',
			detailData: false,
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
	},
	methods: {
		getDetail() {
			API_FullBusinessLineSteelDetail(this.id).then(res => {
				if (res.success) {
					this.companyChain = res.data.companyList.map(r => {
						return {
							list: null,
							name: r,
							uscc: ''
						};
					});

					this.contractChain = res.data.contractIdList.map(r => {
						return {
							contractId: r
						};
					});

					this.getGraphData();
				}
			});
		},
		companyChainChange(data) {
			API_FullBusinessLineSteelBottomDetail(data.curContract.contractId).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		getGraphData() {
			this.graphData = this.companyChain.map((r, index) => {
				return {
					id: r.name,
					label: r.name,
					level: index + 1
				};
			});
			this.graphRelation = this.graphData
				.map((r, index) => {
					return {
						from: r.id,
						to: this.graphData[index + 1] ? this.graphData[index + 1].id : null
					};
				})
				.filter(r => r.to);
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
