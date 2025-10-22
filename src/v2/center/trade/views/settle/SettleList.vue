<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>{{ this.typeDesc }}结算单</span
			>
			<a-tabs
				v-model="active"
				size="large"
			>
				<a-tab-pane
					key="online"
					:tab="`电子${this.typeDesc}结算单`"
				>
					<div style="width: 100%">
						<SettleOnlineList />
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="offline"
					:tab="`线下${this.typeDesc}结算单`"
				>
					<div style="width: 100%">
						<SettleOfflineList />
					</div>
				</a-tab-pane>
				<div slot="tabBarExtraContent">
					<a-tooltip
						placement="bottomRight"
						trigger="hover"
						overlayClassName="add-contract-tooltips"
						:getPopupContainer="getPopupContainer"
					>
						<div
							class="btn-box-title"
							v-auth="['dgChain:settle:create', 'monitor:dynamic:terminalStatement:add']"
						>
							<div class="btn">
								<img
									class="icon"
									src="@/v2/assets/imgs/contract/add_contract_icon.png"
									alt=""
								/>
								<span>新增{{ this.typeDesc }}结算单</span>
							</div>
						</div>
						<template slot="title">
							<div class="btn-box-menu">
								<div
									class="btn-box-menu-item"
									v-auth="'dgChain:settle:create'"
									@click="selectOnlineContract"
								>
									<div class="btn-box-menu-item-left">
										<img
											class="icon-left"
											src="@/v2/assets/imgs/contract/online_contract_icon.png"
											alt=""
										/>
										<div>
											<p class="btn-box-menu-item-title">电子{{ this.typeDesc }}结算单</p>
											<p class="btn-box-menu-item-tips">使用电子签章签署</p>
										</div>
									</div>
									<img
										class="icon-right"
										src="@/v2/assets/imgs/contract/right_arrow_icon.png"
										alt=""
									/>
								</div>
								<div
									class="btn-box-menu-item"
									v-auth="'monitor:dynamic:terminalStatement:add'"
									@click="selectOfflineContract"
								>
									<div class="btn-box-menu-item-left">
										<img
											class="icon-left"
											src="@/v2/assets/imgs/contract/offline_contract_icon.png"
											alt=""
										/>
										<div>
											<p class="btn-box-menu-item-title">线下{{ this.typeDesc }}结算单</p>
											<p class="btn-box-menu-item-tips">补录线下已签署的结算单</p>
										</div>
									</div>
									<img
										class="icon-right"
										src="@/v2/assets/imgs/contract/right_arrow_icon.png"
										alt=""
									/>
								</div>
							</div>
						</template>
					</a-tooltip>
				</div>
			</a-tabs>
		</a-card>
		<SelectOnlineContract ref="selectOnlineContract" />
		<SelectOfflineContract ref="selectOfflineContract" />
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import SettleOnlineList from './SettleOnlineList';
import SettleOfflineList from './SettleOfflineList';
import SelectOnlineContract from './components/SelectOnlineContract';
import SelectOfflineContract from './components/SelectOfflineContract';
export default {
	data() {
		let { meta } = this.$route;
		return {
			getPopupContainer,
			meta,
			active: this.$route.query.active || 'online'
		};
	},
	components: {
		SettleOnlineList,
		SettleOfflineList,
		SelectOnlineContract,
		SelectOfflineContract
	},
	created() {},
	mounted() {},
	computed: {
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		typeDesc() {
			//类型中文
			let typeDesc = '';
			switch (this.type) {
				case 'buy':
					typeDesc = '采购';
					break;
				case 'sell':
					typeDesc = '销售';
					break;
			}
			return typeDesc;
		}
	},
	methods: {
		//补录线下结算单
		addOffLine() {
			this.$router.push({
				path: `/center/settle/${this.type}/offlineadd`
			});
		},
		//新增电子结算单选择合同
		selectOnlineContract() {
			this.$refs.selectOnlineContract.showModal();
		},
		//新增线下结算单选择合同
		selectOfflineContract() {
			this.$refs.selectOfflineContract.showModal();
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.ant-tabs {
	.ant-tabs-extra-content {
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
				.btn-box-menu-item-left {
					display: flex;
					align-items: center;
				}
				.icon-left {
					width: 40px;
					height: 40px;
					margin-right: 20px;
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
				&:hover {
					background: #e4ebf4;
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
			// .btn-box-menu-item.hover {
			// }
		}
	}
}
/deep/.add-contract-tooltips {
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
