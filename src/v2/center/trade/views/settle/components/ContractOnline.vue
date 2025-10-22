<template>
	<div>
		<a-descriptions
			bordered
			style="padding: 0"
		>
			<a-descriptions-item label="合同编号">
				<div
					@mouseenter="()=>{this.copyContractNoVisible = true}"
					@mouseleave="()=>{this.copyContractNoVisible = false}"
				>
					<a
						class="contractNo"
						href="javascript:;"
							@click="goContractDetail"
					>
						{{ contractInfo.contractNo }}
					</a>
					<span
						v-show="!copyContractNoVisible"
						class="copy-icon"
						>
						<Copy></Copy>
					</span>
					<span
						v-show="copyContractNoVisible"
						v-clipboard:success="onCopy" 
						v-clipboard:error="onError"  
						v-clipboard:copy="contractInfo.contractNo"
						class="copy-icon"
						>
						<CopyNow></CopyNow>
					</span>
				</div>
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
			<a-descriptions-item label="基准价格">
				<template v-if="contractInfo.basePrice"> {{ contractInfo.basePrice | formatMoney(2) }}元/吨 </template>
				<template v-else>
					{{ contractInfo.basePriceDesc || '-' }}
				</template>
			</a-descriptions-item>
			<a-descriptions-item label="数量">
				{{ contractInfo.quantity | formatMoney(3) }} 吨
				<span v-if="contractInfo.quantityOffset"> （±{{ contractInfo.quantityOffset }}%） </span>
			</a-descriptions-item>
			<a-descriptions-item label="交货期限">
				{{ contractInfo.deliveryStartDate }} ~
				{{ contractInfo.deliveryEndDate }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transportModeDesc || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="收货人">
				{{ contractInfo.receiverName || '-' }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg'
export default {
	props: {
		contractInfo: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		let { meta } = this.$route;
		return {
			meta, //获取title
			copyContractNoVisible: false,
		};
	},

	computed: {
		basePrice() {
			let { contractInfo } = this;
			let { contractExamineIndicatorOption } = contractInfo;
			if (contractExamineIndicatorOption) {
				return contractExamineIndicatorOption[0]?.basePrice || '-';
			} else {
				return '-';
			}
		},
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		//查询类型字段，需大写
		orderType() {
			return this.type.toUpperCase();
		}
	},
	watch: {},
	filters: {},
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
			window.open(`/center/contract/${this.type}/online/detail?type=${this.orderType}&id=${this.contractInfo.orderId}`);
		}
	},
	components: {
		Copy, 
		CopyNow
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
	position: relative;
	top: 2px;
}
</style>
