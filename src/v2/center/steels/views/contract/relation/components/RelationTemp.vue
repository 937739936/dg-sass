<template>
	<div>
		<div class="buy">
			<a-row>
				<h3 style="margin: 30px 0">{{ typeInfoWord.typeName }}</h3>
			</a-row>
			<div class="df aic">
				<label class="ant-form-item-required label">{{ type == 'buy' ? '选择采购合同' : '选择销售合同' }}</label>
				<a-input
					style="width: 400px"
					@click="selectContract"
					v-model="info.contractNo"
					readOnly
				></a-input>
			</div>
			<a-row style="margin: 20px 0">
				<a-col :span="8">合同编号： {{ info.contractNo }} </a-col>
				<a-col :span="8"
					>{{ typeInfoWord.companyName }}： {{ type == 'buy' ? info.sellCompanyName : info.buyCompanyName }}
				</a-col>
				<a-col :span="8">钢材种类： {{ info.steelTypeDesc }} </a-col>
			</a-row>
			<a-row style="margin: 20px 0">
				<a-col :span="8">数量： {{ info.quantity }} </a-col>
				<a-col :span="8">运输方式: {{ info.transportModeDesc }} </a-col>
				<a-col :span="8">合同期限：{{ info.effectiveStartDate }} - {{ info.effectiveEndDate }} </a-col>
			</a-row>
			<a-row style="margin: 20px 0">
				<a-col :span="8">签订日期：{{ info.createdDate }}</a-col>
			</a-row>
		</div>
		<RelationContractModal
			ref="relationContractModal"
			@detail="getContractDetailInfo"
			:type="type"
			:OAData="false"
			:oaflag="false"
		></RelationContractModal>
	</div>
</template>

<script>
import RelationContractModal from './RelationContractModal.vue';
export default {
	props: {
		// 合同类型
		type: {
			default: 'buy'
		}
	},
	data() {
		return {
			info: {}
		};
	},
	computed: {
		// 统一文案
		typeInfoWord() {
			let obj = {
				typeName: '采购合同',
				companyName: '卖方企业'
			};
			if (this.type == 'sell') {
				obj = {
					typeName: '销售合同',
					companyName: '买方企业'
				};
			}
			return obj;
		}
	},

	methods: {
		// 选择合同
		selectContract() {
			this.$refs.relationContractModal.searchSubmitRelation();
		},
		// 获取选择的合同信息
		getContractDetailInfo(info) {
			this.info = info;
			this.$emit('detail', info);
		}
	},
	components: {
		RelationContractModal
	}
};
</script>

<style scoped lang="less">
.df {
	display: flex;
}
.aic {
	align-items: center;
}
.jcc {
	justify-content: center;
}
.jcsb {
	justify-content: space-between;
}

.buy {
	.label {
		width: 100px;
	}
	.contact-name {
		border: 1px solid #d9d9d9;
		width: 600px;
		height: 30px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		padding-left: 5px;
	}
}
</style>
