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
						{{ contractInfo.paperContractNo }}
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
						v-clipboard:copy="contractInfo.paperContractNo"
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
			<a-descriptions-item label="合同单价(元/吨)">
				<template v-if="contractInfo.followTheMarket"> 随行就市 </template>
				<template v-else> {{ contractInfo.contractPrice | formatMoney }}元/吨 </template>
			</a-descriptions-item>
			<a-descriptions-item label="合同数量">
				{{ contractInfo.contractQuantity | formatMoney }} 吨
				<span v-if="contractInfo.quantityOffset"> （±{{ contractInfo.quantityOffset }}%） </span>
			</a-descriptions-item>
			<a-descriptions-item label="交货期限">
				{{ contractInfo.execDateStart }} ~
				{{ contractInfo.execDateEnd }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transTypeDesc }}
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
			window.open(`/center/contract/${this.type}/offline/detail?type=${this.orderType}&id=${this.contractInfo.id}`);
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
