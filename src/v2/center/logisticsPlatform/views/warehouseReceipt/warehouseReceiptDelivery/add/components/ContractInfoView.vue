<template>
	<div>
		<a-spin :spinning="loading">
			<a-descriptions
				bordered
				style="padding: 0"
			>
				<a-descriptions-item label="合同编号">
					<a
						class="contractNo"
						href="javascript:;"
						@click="viewContractDetail"
					>
						{{ contractInfo.contractNo }}
					</a>
					<em @click="changeContract()">
						<Edit class="contract-edit-icon"></Edit>
					</em>
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
import { Edit } from "@sub/components/svg"
export default {
	name: 'ContractInfoView',
	components: {
		Edit
	},
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
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null //浏览器尺寸
		};
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),

		contractPrice: function () {
			// 基准价格
			let contractInfo = this.contractInfo;
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
				quantity = `${formatMoney(contractInfo.quantity)} 吨`;
			}
			if (contractInfo.quantityOffset) {
				quantity += `（±${contractInfo.quantityOffset}%）`;
			}
			return quantity;
		}
	},
	methods: {
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			} else {
				this.maxWidth = 350;
			}
		},
		viewContractDetail() {
			// let type = "BUY";
			let type = this.contractInfo.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'BUY' : 'SELL';

			let contractInfo = this.contractInfo;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + contractInfo.contractType.toLowerCase() + '/detail',
				query: {
					id: contractInfo.orderContractId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		changeContract() {
			this.$emit('changeContract');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		goContractDetail() {
			window.open(`/center/contract/${this.type}/offline/detail?type=${this.orderType}&id=${this.contractInfo.id}`);
		}
	}
};
</script>

<style lang="less" scoped>
.contract-edit-icon {
	margin-left: 12px;
	cursor: pointer;
	width: 14px;
	height: 14px;
	position: relative;
	top: 2px;
	// align-self: center;
	// vertical-align: baseline;
}
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
	padding: 17px 12px;
}

/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
	padding: 17px 12px;
}
</style>
