<template>
	<div>
		<a-descriptions
			bordered
			style="margin-bottom: 30px"
			class="specialItem"
		>
			<a-descriptions-item label="运输合同编号">
				<a
					class="contractNo"
					href="javascript:;"
					@click="goContractDetail"
				>
					{{ contractInfo.paperContractNo }}</a
				>
				<img
					v-show="contractInfo.paperContractNo"
					class="copy-icon"
					src="@/v2/assets/imgs/common/copy_icon.png"
					alt=""
					v-clipboard:copy="contractInfo.paperContractNo"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
				/>
			</a-descriptions-item>
			<a-descriptions-item label="托运人">
				{{ contractInfo.buyerName }}
			</a-descriptions-item>
			<a-descriptions-item label="承运人">
				{{ contractInfo.sellerName }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transportModeDesc }}
			</a-descriptions-item>
			<a-descriptions-item label="起运地">
				{{ contractInfo.origin }}
			</a-descriptions-item>
			<a-descriptions-item label="目的地">
				{{ contractInfo.destination }}
			</a-descriptions-item>
			<a-descriptions-item label="合同签订日期">
				{{ contractInfo.contractSignTime }}
			</a-descriptions-item>
			<a-descriptions-item label="合同有效日期">
				{{ contractInfo.execDateStart }} ~ {{ contractInfo.execDateEnd }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
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
			contractInfo: this.contractVo
		};
	},
	watch: {
		contractVo: {
			deep: true,
			immediate: true,
			handler(data) {
				this.contractInfo = data;
			}
		}
	},
	components: {
		TextOverFlow
	},
	filters: {},
	...mapGetters('contract', {
		VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA'
	}),
	mounted() {},
	methods: {
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		goContractDetail() {
			window.open(`/center/logisticSupervise/contract/transport/detail?id=${this.contractInfo.id}`);
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
.copy-icon {
	width: 14px;
	margin-left: 4px;
	cursor: pointer;
	&:hover {
		content: url('~@/v2/assets/imgs/common/copy_active_icon.png');
	}
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 0px;
		left: 0;
	}
}
</style>
