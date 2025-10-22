<template>
	<div>
		<a-descriptions
			bordered
			style="padding: 0"
		>
			<a-descriptions-item label="合同编号">
				<a
					class="contractNo"
					href="javascript:;"
					@click="goContractDetail"
				>
					{{ contractData.paperContractNo }}
				</a>
				<span
					v-if="contractData.paperContractNo"
					class="copy-icon"
					v-clipboard:copy="contractData.paperContractNo"
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
			<a-descriptions-item label="合同单价">
				<span v-if="!contractData.followTheMarket"> {{ contractData.contractPrice | formatMoney }}元/吨 </span>
				<span v-else> 随行就市 </span>
			</a-descriptions-item>
			<a-descriptions-item label="合同数量">
				{{ contractData.contractQuantity | formatMoney }}吨
				<span v-if="contractData.quantityOffset"> (+/-{{ contractData.quantityOffset }}%) </span>
			</a-descriptions-item>
			<a-descriptions-item label="合同总价">
				{{ contractData.contractAmount | formatMoney }}<span v-if="contractData.contractAmount">元</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="签订日期"
				v-if="contractData.contractSignTime"
			>
				{{ contractData.contractSignTime }}
			</a-descriptions-item>
			<a-descriptions-item label="合同有效期">
				{{ contractData.execDateStart }}-{{ contractData.execDateEnd }}
			</a-descriptions-item>
			<a-descriptions-item
				label="合同类型"
				v-if="contractData.contractTermTypeDesc"
			>
				{{ contractData.contractTermTypeDesc }}
			</a-descriptions-item>
			<a-descriptions-item
				label="合同签章状态"
				v-if="contractData.signStatusDesc"
			>
				{{ contractData.signStatusDesc }}
			</a-descriptions-item>
			<a-descriptions-item
				label="双签合同获得日期"
				v-if="contractData.doubleSignTime"
			>
				{{ contractData.doubleSignTime }}
			</a-descriptions-item>
			<a-descriptions-item label="回款账号">
				{{ contractData.receivableBankName }}-{{ contractData.receivableBankAccountNo }}
			</a-descriptions-item>
			<a-descriptions-item
				label="运输方式"
				v-if="contractData.transportModeDesc"
			>
				{{ terminalDelivery.transportModeDesc }}
			</a-descriptions-item>
			<template v-if="terminalDelivery.transportMode === 'AUTOMOBILE_AND_TRAIN'">
				<a-descriptions-item
					label="发站"
					v-if="contractData.trainSendStationName"
				>
					{{ terminalDelivery.trainSendStationName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="到站"
					v-if="contractData.trainArriveStationName"
				>
					{{ terminalDelivery.trainArriveStationName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="托运人"
					v-if="contractData.consignorCompanyName"
				>
					{{ terminalDelivery.consignorCompanyName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="发货地址"
					v-if="contractData.sendGoodsAddress"
				>
					{{ terminalDelivery.sendGoodsAddress }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货地址"
					v-if="contractData.receiveGoodsAddress"
				>
					{{ terminalDelivery.receiveGoodsAddress }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货人名称"
					v-if="contractData.consigneeCompanyName"
				>
					{{ terminalDelivery.consigneeCompanyName }}
				</a-descriptions-item>
			</template>
			<template v-if="terminalDelivery.transportMode === 'SHIP'">
				<a-descriptions-item
					label="装货港"
					v-if="contractData.shipLoadingPortName"
				>
					{{ terminalDelivery.shipLoadingPortName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="卸货港"
					v-if="contractData.shipDischargingPortName"
				>
					{{ terminalDelivery.shipDischargingPortName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货人名称"
					v-if="contractData.consigneeCompanyName"
				>
					{{ terminalDelivery.consigneeCompanyName }}
				</a-descriptions-item>
			</template>
			<template v-if="terminalDelivery.transportMode === 'TRAIN'">
				<a-descriptions-item
					label="发站"
					v-if="contractData.trainSendStationName"
				>
					{{ terminalDelivery.trainSendStationName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="到站"
					v-if="contractData.trainArriveStationName"
				>
					{{ terminalDelivery.trainArriveStationName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="托运人"
					v-if="contractData.consignorCompanyName"
				>
					{{ terminalDelivery.consignorCompanyName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货人名称"
					v-if="contractData.consigneeCompanyName"
				>
					{{ terminalDelivery.consigneeCompanyName }}
				</a-descriptions-item>
			</template>
			<template v-if="terminalDelivery.transportMode === 'AUTOMOBILE'">
				<a-descriptions-item
					label="发货地址"
					v-if="contractData.sendGoodsAddress"
				>
					{{ terminalDelivery.sendGoodsAddress }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货地址"
					v-if="contractData.receiveGoodsAddress"
				>
					{{ terminalDelivery.receiveGoodsAddress }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收货人名称"
					v-if="contractData.consigneeCompanyName"
				>
					{{ terminalDelivery.consigneeCompanyName }}
				</a-descriptions-item>
			</template>
			<a-descriptions-item
				label="业务类型"
				v-if="contractData.businessTypeDesc"
			>
				{{ contractData.businessTypeDesc }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import { getSellDownContractDetail } from '@/v2/center/trade/api/downcontract';
import { filterCodeByValueName } from'@sub/utils/globalCode.js';
import { Copy, CopyNow } from '@sub/components/svg'

export default {
	components: {
		Copy, 
		CopyNow 
	},
	props: {
		orderId: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			contractData: {}
		};
	},
	watch: {
		orderId() {
			this.getSelectDetail();
		}
	},
	computed: {
		terminalDelivery() {
			let terminalDelivery = this.contractData.terminalDelivery || {};
			for (let key in terminalDelivery) {
				if (!terminalDelivery[key]) {
					terminalDelivery[key] = '-';
				}
			}
			return terminalDelivery;
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
			getSellDownContractDetail({ id: this.orderId }).then(res => {
				if (res.success) {
					this.contractData = res.data;
					//订单号
					if (this.$listeners.changeSerialNo) {
						this.$emit('changeSerialNo', this.contractData.contractNo);
					}
					//限制开具时间范围
					if (this.$listeners.changeSignTime) {
						this.$emit('changeSignTime', [this.contractData.execDateStart, this.contractData.execDateEnd]);
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
			window.open(`/center/contract/sell/offline/detail?id=${this.orderId}&type=sell`);
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
</style>
