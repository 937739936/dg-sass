<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>补充协议</span
			>
			<a-tabs
				v-model="active"
				size="large"
				@change="handelChange"
			>
				<a-tab-pane
					key="online"
					tab="电子补充协议"
				>
					<div style="width: 100%; padding-right: 2px">
						<OnlineList
							ref="OnlineList"
							:supplementalAgreementNo="supplementalAgreementNo"
						/>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="offline"
					tab="线下补充协议"
				>
					<div style="width: 100%; padding-right: 2px">
						<OfflineList />
					</div>
				</a-tab-pane>
				<div
					slot="tabBarExtraContent"
					v-auth="'dgChain:contract:supplementalAgreement:add'"
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
										src="@/v2/assets/imgs/contract/online_supp_icon.png"
										alt=""
									/>
									<div>
										<p class="btn-box-menu-item-title">新增电子补充协议</p>
										<p class="btn-box-menu-item-tips">使用电子签章签署</p>
									</div>
									<img
										class="icon-right"
										src="@/v2/assets/imgs/contract/right_arrow_icon.png"
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
										src="@/v2/assets/imgs/contract/offline_supp_icon.png"
										alt=""
									/>
									<div>
										<p class="btn-box-menu-item-title">新增线下补充协议</p>
										<p class="btn-box-menu-item-tips">补录线下已签署的补协</p>
									</div>
									<img
										class="icon-right"
										src="@/v2/assets/imgs/contract/right_arrow_icon.png"
										alt=""
									/>
								</div>
							</div>
						</template>
						<div class="btn-box-title">
							<div class="btn">
								<img
									class="icon"
									src="@/v2/assets/imgs/contract/add_contract_icon.png"
									alt=""
								/>
								<span>新增补充协议</span>
							</div>
						</div>
					</a-tooltip>
				</div>
			</a-tabs>
		</a-card>
		<ContractList
			ref="contractList"
			@searchSupple="searchSupple"
		></ContractList>
	</div>
</template>

<script>
import OnlineList from './OnlineList';
import OfflineList from './OfflineList';
import ContractList from './components/ContractList.vue';
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
export default {
	data() {
		return {
			getPopupContainer,
			active: this.$route.query.active || 'online',
			supplementalAgreementNo: ''
		};
	},
	components: {
		OnlineList,
		OfflineList,
		ContractList
	},
	created() {},
	mounted() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		handelChange() {
			// this.$router.push('/center/contract/buy/list?active='+this.active)
		},
		// 新增电子采购合同
		addOnLine() {
			this.$refs.contractList.showRelationOrderList('on');
		},
		//补录线下采购合同
		addOffLine() {
			this.$refs.contractList.showRelationOrderList('off');
		},
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		searchSupple(no) {
			this.$nextTick(() => {
				this.$refs.OnlineList.initDefault(no);
			});
		}
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
