<template>
	<div>
		<div class="sub-title">发货信息</div>
		<div
			class="alert-warning"
			v-if="deliverInfo.statusDesc == '已作废'"
		>
			<img
				src="~@/v2/assets/imgs/receive/alert-warning.png"
				alt=""
			/>
			作废原因：{{ deliverInfo.cancelReason }}
		</div>
		<a-descriptions
			bordered
			style="padding: 0; margin-top: 30px; margin-bottom: 30px"
		>
			<a-descriptions-item label="运输方式">
				<span v-if="transInfo.transType == 1">火运</span>
				<span v-if="transInfo.transType == 2">汽运</span>
				<span v-if="transInfo.transType == 3">船运</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="付款节点"
				v-if="transInfo.transType == 3 && deliverInfo.contractVo.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE'"
			>
				{{ transInfo.payNode == 'SHIPMENT' ? '装船付' : transInfo.payNode == 'ARRIVAL' ? '到港付' : '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="发货日期">
				{{ transInfo.deliverDate }}
			</a-descriptions-item>
			<a-descriptions-item label="发货数量(吨)">
				{{ transInfo.deliverQuantity || '-' }}
			</a-descriptions-item>
			<template v-if="transInfo.transType == 1">
				<a-descriptions-item label="托运人">
					{{ transInfo.shipperName }}
				</a-descriptions-item>
				<a-descriptions-item label="运单号">
					{{ transInfo.serialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="车数">
					{{ transInfo.trainNum }}
				</a-descriptions-item>
				<a-descriptions-item label="发站">
					{{ transInfo.deliveryStation || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="到站">
					{{ transInfo.arriveStation || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="铁路计划号">
					{{ transInfo.railwayPlanNo || '-' }}
				</a-descriptions-item>
			</template>
			<template v-if="transInfo.transType == 2">
				<a-descriptions-item label="发货地址">
					{{ transInfo.deliverAddr }}
				</a-descriptions-item>
				<a-descriptions-item label="收货地址">
					{{ transInfo.receiveAddr }}
				</a-descriptions-item>
				<a-descriptions-item label="车数">
					{{ transInfo.trainNum }}
				</a-descriptions-item>
			</template>
			<template v-if="transInfo.transType == 3">
				<a-descriptions-item label="提单号">
					{{ transInfo.ladingNo || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="提单日期">
					{{ transInfo.ladingDate || '-' }}
				</a-descriptions-item>
			</template>
			<a-descriptions-item
				label="上煤计划编号"
				v-if="transInfo.coalPlanSerialNo"
			>
				<a
					v-if="authFlag"
					href="javascript:;"
					@click="jumpDetail(transInfo.coalPlanId)"
					>{{ transInfo.coalPlanSerialNo }}</a
				>
				<span v-else>{{ transInfo.coalPlanSerialNo }}</span>
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
export default {
	props: {
		transInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		deliverInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		authFlag() {
			return (
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage:inCoalPlan')
			);
		}
	},
	data() {
		return {};
	},
	components: {},
	mounted() {},
	methods: {
		jumpDetail(id) {
			const { stationId, stationCompanyUscc } = this.transInfo;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/coalplan/IN/detail',
				query: {
					contractType: 'ONLINE',
					id
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;
	margin-top: 30px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
}
/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
}
.alert-warning {
	background: rgba(244, 131, 13, 0.1);
	border: 1px solid #ffd5b0;
	border-radius: 4px;
	height: 44px;
	line-height: 44px;
	margin-top: 20px;
	padding-left: 14px;
	color: rgba(0, 0, 0, 0.8);

	img {
		margin-right: 12px;
		height: 16px;
		vertical-align: sub;
	}
}
</style>
