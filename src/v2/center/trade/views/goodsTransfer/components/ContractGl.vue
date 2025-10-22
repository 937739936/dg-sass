<template>
	<div>
		<a-descriptions
			bordered
			style="padding: 0"
			class="specialItem"
		>
			<a-descriptions-item label="合同编号">
				<a
					class="contractNo"
					href="javascript:;"
					@click="goContractDetail"
				>
					{{ contract.contractNo }}
				</a>
				<span
					v-if="contract.contractNo"
					class="copy-icon"
					v-clipboard:copy="contract.contractNo"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError">
					<CopyNow></CopyNow>
				</span>
				<span
					v-else
					class="copy-icon">
					<Copy></Copy>
				</span>
			</a-descriptions-item>
			<a-descriptions-item label="订单编号">
				{{ contract.serialNo }}
			</a-descriptions-item>
			<a-descriptions-item label="基准价格">
				<TextOverFlow
					v-if="contract.basePriceDesc"
					:content="contract.basePriceDesc"
					:maxWidth="160"
				/>
				<TextOverFlow
					v-else-if="contract.basePrice"
					:content="contract.basePrice + '元/吨'"
					:maxWidth="160"
				/>
				<span v-else>-</span>
			</a-descriptions-item>
			<a-descriptions-item label="数量">
				{{ contract.quantity | formatMoney }} 吨
				<span v-if="contract.quantityOffset">（±{{ contract.quantityOffset }}%）</span>
			</a-descriptions-item>
			<a-descriptions-item label="交货期限">
				{{ contractDelivery.deliveryStartDate }} ~
				{{ contractDelivery.deliveryEndDate }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractDelivery.transportMode | filterCodeByValueName('despatchTypeDict') }}
			</a-descriptions-item>
			<a-descriptions-item label="交货方式">
				{{ contractDelivery.deliveryMode | filterCodeByValueName('order_delivery_type') }}
			</a-descriptions-item>
			<a-descriptions-item
				label="产地"
				v-if="contractDelivery.originPlace"
			>
				{{ contractDelivery.originPlace }}
			</a-descriptions-item>
			<a-descriptions-item
				label="发货点"
				v-if="contractDelivery.sendGoodsAddress"
			>
				{{ contractDelivery.sendGoodsAddress }}
			</a-descriptions-item>
			<template v-if="contractDelivery.transType == 'SHIP'">
				<a-descriptions-item
					label="装货港"
					v-if="contractDelivery.shipLoadingPortName"
				>
					{{ contractDelivery.shipLoadingPortName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="卸货港"
					v-if="contractDelivery.shipDischargingPortName"
				>
					{{ contractDelivery.shipDischargingPortName }}
				</a-descriptions-item>
			</template>
			<template v-if="contractDelivery.transType == 'TRAIN' || contractDelivery.transType == 'AUTOMOBILE_AND_TRAIN'">
				<a-descriptions-item
					label="发站"
					v-if="contractDelivery.deliveryStationList"
				>
					{{ contractDelivery.deliveryStationList }}
				</a-descriptions-item>
				<a-descriptions-item
					label="到站"
					v-if="contractDelivery.arriveStationList"
				>
					{{ contractDelivery.arriveStationList }}
				</a-descriptions-item>
			</template>
			<a-descriptions-item
				label="托运人"
				v-if="contractDelivery.consignorCompanyName"
			>
				{{ contractDelivery.consignorCompanyName }}
			</a-descriptions-item>
			<a-descriptions-item
				label="收货人"
				v-if="contractDelivery.consigneeCompanyName"
			>
				{{ contractDelivery.consigneeCompanyName }}
			</a-descriptions-item>
			<a-descriptions-item
				label="运费支付方式"
				v-if="contractDelivery.freightPayMode"
			>
				{{ contractDelivery.freightPayMode | filterCodeByValueName('freightPayTypeDict') }}
			</a-descriptions-item>
			<a-descriptions-item
				label="其他运费支付方式"
				v-if="contractDelivery.freightPayModeOther"
			>
				{{ contractDelivery.freightPayModeOther }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import { API_getOrderContractDetailById } from '@/v2/center/trade/api/contract';
import { filterCodeByValueName } from'@sub/utils/globalCode.js';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import {Copy, CopyNow} from '@sub/components/svg'
export default {
	props: {
		orderId: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			contract: {},
			contractDelivery: {}
		};
	},
	components: {
		TextOverFlow,
		Copy,
		CopyNow
	},
	watch: {
		orderId() {
			this.getSelectDetail();
		}
	},
	filters: {
		filterCodeByValueName
	},
	mounted() {
		if (this.orderId) {
			this.getSelectDetail();
		}
	},
	methods: {
		getSelectDetail() {
			API_getOrderContractDetailById({ orderId: this.orderId }).then(res => {
				if (res.success) {
					this.contract = res.data.contract;
					this.contractDelivery = res.data.contractDelivery;
					//订单号
					if (this.$listeners.changeSerialNo) {
						this.$emit('changeSerialNo', this.contract.serialNo);
					}
					//限制开具时间范围
					if (this.$listeners.changeSignTime) {
						this.$emit('changeSignTime', [this.contractDelivery.deliveryStartDate, this.contractDelivery.deliveryEndDate]);
					}
					//交货地点
					if (this.$listeners.changeDeliveryPickUpPlace && this.contractDelivery.deliveryPickUpPlace) {
						this.$emit('changeDeliveryPickUpPlace', this.contractDelivery.deliveryPickUpPlace);
					}
				}
			});
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		goContractDetail() {
			window.open(`/center/contract/sell/online/detail?type=SELL&id=${this.orderId}`);
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
	position: relative;
	top: 2px;
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 0px;
		left: 0;
	}
}
</style>
