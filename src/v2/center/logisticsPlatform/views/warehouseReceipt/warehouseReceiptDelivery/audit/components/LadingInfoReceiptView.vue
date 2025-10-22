<template>
	<div>
		<a-alert
			class="a-alert"
			type="info"
		>
			<template slot="message">
				<div class="alert-wrapper">
					<div class="alert-icon">
						<img
							src="@/assets/imgs/warning/warning.png"
							style="width: 16px; height: 16px"
							alt=""
						/>
					</div>
					<span
						class="alert-message"
						v-html="
							`若仓单全部提货，则仓储方审核通过后线下出库，原仓单状态会更新为“已出库”；<br/>
					若仓单部分提货，则原仓单会拆分为存货子仓单、出库子仓单，仓储方审核通过盖章后线下出库，原仓单状态更新为“已核销”，出库子仓单状态会更新为“已出库”，存货子仓单状态更新为“生效中”；<br/>
					若仓单无需提货，则本次提货数量填写0即可。`
						"
					></span>
				</div>
			</template>
		</a-alert>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="仓储企业">
				{{ receiptHouseInfo.warehouseCompanyName || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="仓库名称">
				{{ receiptHouseInfo.stationName || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="货物名称">
				{{ receiptHouseInfo.goodsName || '-' }}
			</a-descriptions-item>
		</a-descriptions>
		<a-alert
			v-if="receiptHouseInfo"
			class="a-alert warning"
			type="warning"
		>
			<template slot="message">
				<div class="alert-wrapper">
					<div class="alert-icon">
						<img
							src="~@/v2/assets/imgs/receive/alert-warning.png"
							style="width: 16px; height: 16px"
							alt=""
						/>
					</div>
					<span
						class="alert-message"
						v-html="warningMessage()"
					></span>
				</div>
			</template>
		</a-alert>
		<WarehouseInfo
			style="margin-top: 20px"
			ref="warehouseInfo"
			:list="warehouseInfoList"
			@allQuantityChanged="allQuantityChanged"
		></WarehouseInfo>
	</div>
</template>

<script>
import moment from 'moment';
import { formatMoney } from '@sub/filters';
import WarehouseInfo from '../../../components/DeliveryWarehouseInfo.vue';
export default {
	components: {
		WarehouseInfo
	},
	name: 'LadingInfoReceiptView',
	props: {
		receiptHouseInfo: {
			default: {}
		},
		editDeliveryInfoList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			warehouseInfoList: [],
			allQuantity: 0
		};
	},
	mounted() {},
	computed: {},
	watch: {
		editDeliveryInfoList: {
			handler() {
				this.warehouseInfoList = this.editDeliveryInfoList ?? [];
			}
		}
	},
	methods: {
		formatMoney,
		warningMessage() {
			// let offset = Math.abs((this.allQuantity || 0) - (this.receiptHouseInfo.quantity || 0));
			// let offsetStr = (offset > 0 ? '±' : '') + `${offset}`;
			let quantity = formatMoney(this.allQuantity || 0, 4);
			let receiptQuantity = formatMoney(this.receiptHouseInfo.quantity || 0, 4);
			let offsetStr = `${formatMoney(quantity - receiptQuantity, 4)}`;
			return `【${this.receiptHouseInfo.deliveryCompanyName ?? '-'}】申请提货数量为<span style="color: #F46332">${receiptQuantity}吨</span>，本次选择仓单提货数量为<span style="color: #F46332">${quantity}吨</span>，差额为<span style="color: #F46332">${offsetStr}吨</span>。`;
		},
		allQuantityChanged(num) {
			this.allQuantity = num;
		},
		onSave(needError) {
			return new Promise((resolve, reject) => {
				let obj = this.$refs.warehouseInfo.save(needError);
				if (obj) {
					obj.place = this.receiptHouseInfo?.stationName;
					obj.stationId = this.receiptHouseInfo?.stationId;
					resolve(obj);
				} else {
					reject('');
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding: 0 !important;
	margin-top: 20px !important;
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
		width: 22%;
	}
}

.a-alert {
	display: inline-block;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid #d0dfff;
	border-radius: 4px;
	width: 100%;
	// margin-bottom: 24px;
	.alert-wrapper {
		display: flex;
		flex-direction: row;
	}
	.alert-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-right: 12px;
	}
	.alert-message {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		letter-spacing: 0;
		line-height: 18px;
	}
}
.warning {
	margin-top: 20px;
	border: 1px solid rgba(255, 194, 121, 1);
	background: rgba(255, 243, 231, 1);
}
</style>
