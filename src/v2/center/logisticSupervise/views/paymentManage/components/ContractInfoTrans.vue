<template>
	<div>
		<a-descriptions
			bordered
			style="padding: 0; margin-bottom: 30px"
			class="specialItem"
			v-if="contractInfo"
		>
			<a-descriptions-item label="运输合同编号">
				<a
					class="contractNo"
					href="javascript:;"
					@click="goContractDetail"
				>
					<TextOverFlow
						:content="contractInfo.contractNo"
						:maxWidth="160"
					/>
				</a>
			</a-descriptions-item>
			<a-descriptions-item label="托运人">
				<TextOverFlow
					:content="contractInfo.buyerName"
					:maxWidth="160"
				/>
			</a-descriptions-item>
			<a-descriptions-item label="承运人">
				<TextOverFlow
					:content="contractInfo.sellerName"
					:maxWidth="160"
				/>
			</a-descriptions-item>
			<a-descriptions-item label="合同有效期">
				{{ contractInfo.execDateStart }} ~ {{ contractInfo.execDateEnd }}
			</a-descriptions-item>
			<a-descriptions-item label="签订日期">
				{{ contractInfo.contractSignTime }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transportModeDesc }}
			</a-descriptions-item>
			<a-descriptions-item label="起运地">
				<TextOverFlow
					:content="contractInfo.origin"
					:maxWidth="160"
				/>
			</a-descriptions-item>
			<a-descriptions-item label="目的地">
				<TextOverFlow
					:content="contractInfo.destination"
					:maxWidth="160"
				/>
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import TextOverFlow from '@sub/components/TextOverflow.vue';
export default {
	props: {
		contractVo: {
			type: Object,
			default: () => {
				return {};
			}
		}
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
	mounted() {},
	methods: {
		goContractDetail() {
			const { href } = this.$router.resolve({
				path: `/center/logisticSupervise/contract/transport/detail`,
				query: {
					id: this.contractInfo.id
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
</style>
