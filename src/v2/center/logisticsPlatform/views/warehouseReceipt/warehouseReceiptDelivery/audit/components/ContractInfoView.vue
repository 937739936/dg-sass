<template>
	<div>
		<a-spin :spinning="loading">
			<a-descriptions
				bordered
				style="padding: 0"
			>
				<a-descriptions-item label="合同编号">
					<div
						@mouseenter="copyNow = true"
						@mouseleave="copyNow = false"
					>
						<a
							@click="goContract"
							href="javascript:;"
							>{{ contractInfo.contractNo || '-' }}</a
						>
						<Copy
							v-if="contractInfo.contractNo"
							class="cur"
							v-show="!copyNow"
						></Copy>
						<span
							v-if="contractInfo.contractNo"
							v-show="copyNow"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="contractInfo.contractNo"
						>
							<CopyNow class="cur"></CopyNow>
						</span>
					</div>
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.sellerName"
					label="卖方企业"
				>
					{{ contractInfo.sellerName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.buyerName"
					label="买方企业"
				>
					{{ contractInfo.buyerName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.goodsName"
					label="品名"
				>
					{{ contractInfo.goodsName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractPrice"
					label="基准价格"
				>
					{{ contractPrice }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="quantityText"
					label="数量"
				>
					{{ quantityText }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="execDate"
					label="交货期限"
				>
					{{ execDate }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.transportModeDesc"
					label="运输方式"
				>
					{{ contractInfo.transportModeDesc || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.consigneeCompanyName"
					label="收货人"
				>
					{{ contractInfo.consigneeCompanyName || '-' }}
				</a-descriptions-item>
			</a-descriptions>
		</a-spin>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { mapGetters } from 'vuex';
import { Copy, CopyNow } from '@sub/components/svg/index';

export default {
	name: 'ContractInfoView',
	components: { Copy, CopyNow },
	props: {
		contractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		loading: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	data() {
		return {
			copyNow: false,
			maxWidth: 0 // 信息文案最大宽度
		};
	},
	watch: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),

		//
		contractPrice: function () {
			// 基准价格
			let contractInfo = this.contractInfo;
			if (contractInfo.followTheMarket) {
				return '随行就市';
			}
			if (!contractInfo.basePrice) {
				return '';
			}
			if (contractInfo.basePrice == '随行就市') {
				return contractInfo.basePrice;
			}
			return `${formatMoney(contractInfo.basePrice, 2)}元/吨`;
		},
		execDate: function () {
			// 交货日期
			let date = '';
			let contractInfo = this.contractInfo;
			if (!contractInfo.startDate && !contractInfo.endDate) {
				return date;
			}
			if (contractInfo.startDate) {
				date = contractInfo.startDate;
			}
			if (contractInfo.endDate) {
				date += ' 至 ';
				date += contractInfo.endDate;
			}
			return date;
		},
		quantityText: function () {
			let quantity = '';
			let contractInfo = this.contractInfo;
			if (contractInfo.quantity) {
				quantity = `${formatMoney(contractInfo.quantity, 4)} 吨`;
			}
			if (contractInfo.quantityOffset) {
				quantity += `（±${contractInfo.quantityOffset}%）`;
			}
			return quantity;
		}
	},
	methods: {
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},

		// 去往合同详情
		goContract() {
			const type = 'BUY';
			const contractType = this.contractInfo.contractType; // ONLINE | OFFLINE
			const contractId = this.contractInfo.orderContractId;
			let path = `/center/contract/${type.toLowerCase()}/${contractType.toLowerCase()}/detail?id=${contractId}&type=${type}`;
			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0 !important;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		// width: inherit;
		width: 22%;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
</style>
