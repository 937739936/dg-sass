<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>仓单管理协议</span
			>
			<a-tabs
				v-model="active"
				size="large"
			>
				<a-tab-pane
					key="manage"
					tab="电子仓单管理协议"
				>
					<div style="width: 100%; padding-right: 2px">
						<WarehouseReceiptAgreementManagementList
							:type="type"
							:listApi="getWarehouseReceiptAgreementManageList"
							:statisticsApi="getWarehouseReceiptAgreementManageStatistics"
							:exportApi="exportWarehouseReceiptAgreementManageList"
							:downloadApi='downloadWarehouseReceiptAgreementManage'
							:delApi='delWarehouseReceiptAgreementManage'
							:cancelApi='handleWarehouseReceiptAgreementManage'

						></WarehouseReceiptAgreementManagementList>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="serve"
					tab="电子仓单服务协议"
				>
					<div style="width: 100%; padding-right: 2px">
						<WarehouseReceiptAgreementServeList
							:type="type"
							:listApi="getWarehouseReceiptAgreementServeList"

							:statisticsApi="getWarehouseReceiptAgreementServeStatistics"
							:exportApi="exportWarehouseReceiptAgreementServeList"
							:downloadApi='downloadWarehouseReceiptServeManage'
							:cancelApi='handleWarehouseReceiptAgreementServe'
						></WarehouseReceiptAgreementServeList>
					</div>
				</a-tab-pane>
				<div
					slot="tabBarExtraContent"
					v-auth="'logisticsStorageCenter:warehouseReceiptManage:agreement:manageAgreement:add'"
					v-if="!isWarehouse && active == 'manage'"
				>
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
									@click="addOnLine"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
								>
									<img
										class="icon-left"
										src="@sub/assets/online_supp_icon.png"
										alt=""
									/>
									<div style="width: 150px">
										<p class="btn-box-menu-item-title">电子协议</p>
										<p class="btn-box-menu-item-tips">使用电子签章签署</p>
									</div>
									<img
										class="icon-right"
										src="@sub/assets/right_arrow_icon.png"
										alt=""
									/>
								</div>
								<div
									class="btn-box-menu-item"
									@click="addOffLine"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
								>
									<img
										class="icon-left"
										src="@sub/assets/offline_supp_icon.png"
										alt=""
									/>
									<div style="width: 150px">
										<p class="btn-box-menu-item-title">线下协议</p>
										<p class="btn-box-menu-item-tips">补录线下已签署的补协</p>
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
								<span>新增仓单管理协议</span>
							</div>
						</div>
					</a-tooltip>
				</div>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { getPopupContainer } from '@sub/utils/factory.js';
import WarehouseReceiptAgreementManagementList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/WarehouseReceiptAgreementManagementList.vue';
import WarehouseReceiptAgreementServeList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/WarehouseReceiptAgreementServeList.vue';


import {
	API_FinancingList,
	getFinancingStatistics,
	API_FinancingExportXls,
} from '@/v2/center/financing/api/index.js';

import { 
	getWarehouseReceiptAgreementManageList,
	exportWarehouseReceiptAgreementManageList,
	delWarehouseReceiptAgreementManage,
	downloadWarehouseReceiptAgreementManage,
	getWarehouseReceiptAgreementManageStatistics,
	handleWarehouseReceiptAgreementManage,

	getWarehouseReceiptAgreementServeList,
	exportWarehouseReceiptAgreementServeList,
	handleWarehouseReceiptAgreementServe,
	getWarehouseReceiptAgreementServeStatistics,
	downloadWarehouseReceiptServeManage,



} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'
export default {
	data() {
		return {
			active: 'manage',
			type: 'rest'
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		}
	},
	methods: {
		getPopupContainer,
		getWarehouseReceiptAgreementManageList,
		exportWarehouseReceiptAgreementManageList,
		delWarehouseReceiptAgreementManage,
		downloadWarehouseReceiptAgreementManage,
		getWarehouseReceiptAgreementManageStatistics,
		handleWarehouseReceiptAgreementManage,

		getWarehouseReceiptAgreementServeList,
		exportWarehouseReceiptAgreementServeList,
		handleWarehouseReceiptAgreementServe,
		getWarehouseReceiptAgreementServeStatistics,
		downloadWarehouseReceiptServeManage,

		API_FinancingList,
		getFinancingStatistics,
		API_FinancingExportXls,
		// 新增电子
		addOnLine() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOnlineManage');
		},
		//补录
		addOffLine() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOfflineManage');
		},
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		}
	},
	components: {
		WarehouseReceiptAgreementManagementList,
		WarehouseReceiptAgreementServeList
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
