<template>
	<div>
		<a-descriptions
			class="specialItem"
			bordered 
			:column="3"
			size="middle"
			v-if="contractInfo"
		>
			<a-descriptions-item label="合同编号">
				<a
					class="contractNo"
					href="javascript:;"
					@click="goContractDetail"
				>
					{{ contractInfo.contractNo }}</a
				>
			</a-descriptions-item>
			<a-descriptions-item label="卖方企业">
				{{ contractInfo.sellerName }}
			</a-descriptions-item>
			<a-descriptions-item label="买方企业">
				{{ contractInfo.buyerName }}
			</a-descriptions-item>
			<a-descriptions-item label="品名">
				{{ contractInfo.goodsName }}
			</a-descriptions-item>
			<a-descriptions-item label="基准价格" v-if="contractType === 'ONLINE'">
				<TextOverFlow
					v-if="contractInfo.basePriceDesc"
					:content="contractInfo.basePriceDesc"
					:maxWidth="160"
				/>
				<TextOverFlow
					v-else-if="contractInfo.basePrice"
					:content="contractInfo.basePrice + '元/吨'"
					:maxWidth="160"
				/>
				<span v-else>-</span>
			</a-descriptions-item>
			<a-descriptions-item label="数量" v-if="contractType === 'ONLINE'">
				{{ contractInfo.quantity }} 吨 <span v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</span>
			</a-descriptions-item>
			<a-descriptions-item label="合同单价" v-if="contractType === 'OFFLINE'">
				{{ contractInfo.contractPrice }} 元</span>
			</a-descriptions-item>
			<a-descriptions-item label="合同数量" v-if="contractType === 'OFFLINE'">
				{{ contractInfo.contractQuantity }} 吨 <span v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</span>
			</a-descriptions-item>
			<a-descriptions-item label="交货期限">
				{{ contractInfo.deliveryStartDate }} ~ {{ contractInfo.deliveryEndDate }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transportModeDesc }}
			</a-descriptions-item>
			<a-descriptions-item label="收货人" >
				{{ contractInfo.consigneeCompanyName || "-" }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import TextOverFlow from '@/v2/components/TextOverFlow';

export default {
	props: {
		contractVo: {
			type: Object,
			default: () => {
				return {};
			}
		},
	},
	data() {
		return {
			contractInfo: null,
			contractType: this.$route.query.contractType
		};
	},
	watch: {
		contractVo(data) {
			this.contractInfo = data;
		}
	},
	components: {
		TextOverFlow
	},
	mounted() {
	},
	methods: {
		goContractDetail() {
			const { href } = this.$router.resolve({
				path: `/center/contract/buy/${this.contractType.toLowerCase()}/detail`,
				query: {
					id: this.contractInfo.id,
					type: this.contractType.toLowerCase() === 'online' ? 'BUY' : 'buy'
				}
			});
			window.open(href, '_new');
		}
	}
};
</script>
<style lang="less" scoped>
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
}

/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
}
.contractNo:hover {
	text-decoration: underline;
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 0px;
		left: 0;
	}
}
::v-deep.ant-descriptions-item-label {
	width: 160px;
}
::v-deep.ant-descriptions { 
	padding: 0;
  	.ant-descriptions-item-label {
		width: 160px;
	}
}
</style>
