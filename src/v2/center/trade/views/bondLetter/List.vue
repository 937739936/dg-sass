<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>追保函管理</span
			>
			<a-tabs
				v-model="active"
				size="large"
				@change="handelChange"
			>
				<a-tab-pane
					key="online"
					tab="电子追保函"
					v-auth="'dgChain:bondLetterManage:online'"
				>
					<div style="width: 100%; padding-right: 2px">
						<OnLineList />
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="offline"
					tab="线下追保函"
					v-auth="'dgChain:bondLetterManage:offline'"
				>
					<div style="width: 100%; padding-right: 2px">
						<OffLineList />
					</div>
				</a-tab-pane>
				<div
					slot="tabBarExtraContent"
					v-if="VUEX_ST_USERAUTH.includes('dgChain:bondLetterManage:offline:addEdit')"
				>
					<a-tooltip
						placement="bottomRight"
						trigger="hover"
						overlayClassName="add-letter-tooltips"
						:getPopupContainer="getPopupContainer"
					>
						<template slot="title">
							<div class="btn-box-menu">
								<div
									class="btn-box-menu-item"
									@click="add('online')"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
									v-auth="'dgChain:bondLetterManage:online:addEdit'"
								>
									<img
										class="icon-left"
										src="@/v2/assets/imgs/bondLetter/online_icon.png"
										alt=""
									/>
									<div>
										<p class="btn-box-menu-item-title">电子追保函</p>
										<p class="btn-box-menu-item-tips">使用电子签章签署</p>
									</div>
								</div>
								<div
									class="btn-box-menu-item"
									@click="add('offline')"
									@mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)"
									v-auth="'dgChain:bondLetterManage:offline:addEdit'"
								>
									<img
										class="icon-left"
										src="@/v2/assets/imgs/bondLetter/offline_icon.png"
										alt=""
									/>
									<div>
										<p class="btn-box-menu-item-title">线下追保函</p>
										<p class="btn-box-menu-item-tips">补录线下已签署的追保函</p>
									</div>
								</div>
							</div>
						</template>
						<div class="btn-box-title">
							<div class="btn">
								<img
									class="icon"
									src="@/v2/assets/imgs/bondLetter/add_icon.png"
									alt=""
								/>
								<span>新增追保函</span>
							</div>
						</div>
					</a-tooltip>
				</div>
			</a-tabs>
		</a-card>
		<ChooseContract
			ref="chooseContract"
			:type="type.toUpperCase()"
			contractType="ONLINE"
			@detail="getContractDetail"
		/>
	</div>
</template>

<script>
import OnLineList from './online/List';
import OffLineList from './offline/List';
import { getPopupContainer } from '@/v2/utils/factory.js';
import ChooseContract from './components/ChooseContract';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			getPopupContainer,
			active: this.$route.query.active || 'online',
			type: 'online'
		};
	},
	components: {
		OnLineList,
		OffLineList,
		ChooseContract
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		})
	},
	created() {},
	mounted() {},
	methods: {
		handelChange() {
			this.$router.push('/center/bondLetter/online/list?active=' + this.active);
		},
		add(type) {
			this.type = type;
			this.menuVisible = false;
			this.$refs.chooseContract.showModal();
		},
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		getContractDetail(data) {
			this.$router.push({
				path: '/center/bondLetter/' + this.type + '/add',
				query: {
					type: this.type.toUpperCase(),
					view: 'add',
					orderContractId: data.id,
					contractType: data.contractType
				}
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
				padding: 0 14px;
				.icon {
					width: 14px;
					vertical-align: middle;
					margin-right: 4px;
				}
			}
		}
		.btn-box-menu {
			.btn-box-menu-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				cursor: pointer;
				height: 64px;
				padding: 8px 3px 8px 18px;
				border-radius: 4px;
				width: 224px;
				.icon-left {
					width: 30px;
					height: 37px;
					margin-right: 16px;
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
					margin-bottom: 5px;
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
			.btn-box-menu-item:last-child {
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
.add-letter-tooltips {
	z-index: 100;
	.ant-tooltip-arrow {
		display: none;
	}
	.ant-tooltip-inner {
		width: 240px;
		height: 144px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		z-index: 1000;
		position: relative;
		right: 3px;
	}
}
</style>
