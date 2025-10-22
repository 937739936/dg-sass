<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				> 仓单过户</span
			>
			<a-tabs
				v-model="active"
				size="large"
			>
				<a-tab-pane
					key="manage"
					tab="我转让的仓单"
				>
					<div style="width: 100%; padding-right: 2px">
						<TransferList
							:type="type"
							:listApi="transferListApi"
							:delApi='delApi'
						></TransferList>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="serve"
					tab="我收到的仓单"
				>
					<div style="width: 100%; padding-right: 2px">
						<ReceiveList
							:type="type"
							:listApi="receiveListApi"
							:statisticsApi='statisticsApi'
						></ReceiveList>
					</div>
				</a-tab-pane>
        	
				<div
					slot="tabBarExtraContent"
					v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptTransfer:apply'"
				>
        	<div class="btn-box-title" @click="goApply">
							<div class="btn">
								<span>过户申请</span>
							</div>
						</div>
				</div>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { getPopupContainer } from '@sub/utils/factory.js';
import ReceiveList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/ReceiveList.vue';
import TransferList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/TransferList.vue';

export default {
  props: {
    transferListApi: {},
		delApi: {},
    receiveListApi: {},
		statisticsApi: {},
  },
	data() {
		return {
			active: 'manage',
			type: 'rest'
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
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
		// 新增电子
		goApply() {
      this.$emit('goApply')
    },
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		}
	},
	components: {
		ReceiveList,
		TransferList
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
