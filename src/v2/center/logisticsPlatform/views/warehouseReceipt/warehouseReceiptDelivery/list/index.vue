<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>仓单提货</span
			>
			<a-tabs
				v-model="active"
				size="large"
			>
				<a-tab-pane
					key="1"
					tab="我发起的"
				>
					<div style="width: 100%; padding-right: 2px">
						<DeliveryListView
							:deliveryFlag="1"
							ref="deliveryListView1"
							:listApi="API_getWarehouseReceiptDeliveryList"
							:statisticsApi="API_getWarehouseReceiptDeliveryStatistics"
							@handleModify="handleModify"
							@handleViewDetail="handleViewDetail"
							@handleDelete="handleDelete"
						></DeliveryListView>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="我收到的"
				>
					<div style="width: 100%; padding-right: 2px">
						<DeliveryListView
							:deliveryFlag="2"
							:listApi="API_getWarehouseReceiptDeliveryList"
							:statisticsApi="API_getWarehouseReceiptDeliveryStatistics"
							@handleViewDetail="handleViewDetail"
							@gotoAudit="gotoAudit"
						></DeliveryListView>
					</div>
				</a-tab-pane>
				<div slot="tabBarExtraContent">
					<a-tooltip
						placement="bottomRight"
						trigger="hover"
						overlayClassName="add-contract-tooltips"
						:getPopupContainer="getPopupContainer"
					>
						<template slot="title">
							<div class="btn-box-menu">
								<div
									class="btn-box-menu-item"
									@click="receipteLading"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
								>
									<img
										class="icon-left"
										src="@sub/assets/delivery_receipt_icon.png"
										alt=""
									/>
									<div style="width: 150px">
										<p class="btn-box-menu-item-title">仓单直接提货</p>
										<p class="btn-box-menu-item-tips">根据持有仓单进行提货</p>
									</div>
									<img
										class="icon-right"
										src="@sub/assets/right_arrow_icon.png"
										alt=""
									/>
								</div>
								<div
									class="btn-box-menu-item"
									@click="noReceiptLadingApply"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
								>
									<img
										class="icon-left"
										src="@sub/assets/delivery_no_receipt_icon.png"
										alt=""
									/>
									<div style="width: 150px">
										<p class="btn-box-menu-item-title">无仓单提货申请</p>
										<p class="btn-box-menu-item-tips">向卖方发起提货申请</p>
									</div>
									<img
										class="icon-right"
										src="@sub/assets/right_arrow_icon.png"
										alt=""
									/>
								</div>
							</div>
						</template>
						<div class="btn-box-title">
							<div class="btn">
								<span>新增提货申请</span>
							</div>
						</div>
					</a-tooltip>
				</div>
			</a-tabs>
		</a-card>

		<RelationContract
			:isNoRelation="false"
			ref="receiptRelationContract"
			querySource="WAREHOUSE_RECEIPT_DELIVERY"
			@relation="doReceiptLadingLading"
			type="IN"
		>
		</RelationContract>
		<RelationContract
			:isNoRelation="false"
			ref="noReceiptRelationContract"
			querySource="WAREHOUSE_RECEIPT_DELIVERY"
			@relation="doNoReceiptLadingLading"
			type="IN"
		>
		</RelationContract>
		<ModalInfo
			ref="delModal"
			title="确认删除"
			tip="确认要删除该申请吗，删除后无法恢复"
			@verify="confirmDel"
		>
		</ModalInfo>
	</div>
</template>

<script>
import { getPopupContainer } from '@sub/utils/factory.js';
import DeliveryListView from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/List.vue';

import RelationContract from '../../components/RelationContract.vue';

import {
	API_getWarehouseReceiptDeliveryList,
	API_getWarehouseReceiptDeliveryStatistics,
	API_warehouseReceiptDelete
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';
import ModalInfo from '@/v2/components/modalInfo/info';

export default {
	props: {},
	data() {
		return {
			active: '1',
			currentItem: {}
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		}
	},
	methods: {
		getPopupContainer,
		API_getWarehouseReceiptDeliveryList,
		API_getWarehouseReceiptDeliveryStatistics,

		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		// 仓单直接提货
		receipteLading() {
			this.$refs.receiptRelationContract.show();
		},
		// 无仓单提货申请
		noReceiptLadingApply() {
			this.$refs.noReceiptRelationContract.show();
		},
		doReceiptLadingLading(info) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add',
				query: {
					warehouseReceiptDeliveryType: 'WAREHOUSE_RECEIPT',
					contractId: info.orderContractId,
					contractType: info.contractType
				}
			});
		},
		doNoReceiptLadingLading(info) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add',
				query: {
					warehouseReceiptDeliveryType: 'NO_WAREHOUSE_RECEIPT',
					contractId: info.orderContractId,
					contractType: info.contractType
				}
			});
		},
		handleViewDetail(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/detail';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		handleModify(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		gotoAudit(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/audit';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		handleDelete(record) {
			this.currentItem = record;
			this.$refs.delModal.open();
		},

		// 确认删除
		confirmDel() {
			this.$refs.delModal.close();
			API_warehouseReceiptDelete({ id: this.currentItem.id })
				.then(res => {
					if (res.success) {
						this.$refs.deliveryListView1.getList(1, 10);
					}
				})
				.finally(() => {});
		}
	},
	components: {
		DeliveryListView,
		RelationContract,
		ModalInfo
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.ant-tabs {
	/deep/ .ant-tabs-extra-content {
		padding: 0;
		position: relative;
		top: 8px;
		right: 2px;
		.btn-box-title {
			display: flex;
			align-items: center;
			& > .btn {
				height: 32px;
				background: @primary-color;
				border-radius: 4px;
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #ffffff;
				line-height: 22px;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 10px;
				.icon {
					width: 18px;
					vertical-align: middle;
					margin-right: 10px;
				}
			}
		}
		.btn-box-menu {
			.btn-box-menu-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				cursor: pointer;
				height: 64px;
				margin-bottom: 8px;
				padding: 0 3px 0 12px;
				border-radius: 4px;
				width: 254px;
				.icon-left {
					width: 40px;
					height: 40px;
				}
				.icon-right {
					width: 14px;
					height: 14px;
					vertical-align: middle;
				}
				.btn-box-menu-item-title {
					font-size: 16px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.8);
					line-height: 22px;
				}
				.btn-box-menu-item-tips {
					font-size: 14px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: #77889d;
					line-height: 20px;
				}
			}
			.btn-box-menu-item:first-child {
				position: relative;
				& > ::after {
					content: '';
					width: 250px;
					height: 1px;
					background: #e5e6eb;
					position: absolute;
					right: -8px;
					bottom: -8px;
				}
			}
			.btn-box-menu-item:last-child {
				margin-top: 16px;
				margin-bottom: 0;
			}
			.btn-box-menu-item.hover {
				background: #e4ebf4;
			}
		}
	}
}
</style>
<style lang="less">
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}

.add-contract-tooltips {
	z-index: 100;
	.ant-tooltip-arrow {
		display: none;
	}
	.ant-tooltip-inner {
		width: 270px;
		height: 161px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		right: 22px;
		z-index: 1000;
	}
}
</style>
