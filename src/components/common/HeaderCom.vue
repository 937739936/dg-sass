<template>
	<header>
		<div class="header-nav">
			<div class="lay-content">
				<div class="nav-logo">
					<router-link to="/"
						><img
							src="~imgs/logo.png"
							style="width: 122px; margin-left: 37px"
					/></router-link>
				</div>
				<div class="wrap-er">
					<ul>
						<template v-for="(item, index) in filterMenuList">
							<!-- 顶部菜单内容取自VUEX_GE_CENTERMENUSMAP -->
							<a-dropdown
								:key="index"
								placement="bottomCenter"
								v-if="hasAuth(item.authCode)"
							>
								<li
									:class="[
										setActiveTab(item) ? 'active' : '',
										index == 0 ? 'border' : '',
										item.label == '工作台' ? 'work_table' : ''
									]"
									class="menu-item-header"
									@click="changeTab(item, item.name)"
								>
									{{ item.label }}
								</li>
								<a-menu slot="overlay">
									<a-menu-item
										:key="_item.name"
										v-for="_item in item.menuList"
										class="menu-item"
									>
										<a
											href="javascript:;"
											@click="goDetail(_item, item.name)"
											>{{ _item.name }}</a
										>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</template>
					</ul>
				</div>
				<div class="right-content">
					<div
						:class="'notice-icon ' + (totalNoticeNum || totalWarningNum ? 'has' : '')"
						@mouseenter="hoverNoticeIcon"
					></div>
					<a-drawer
						title=""
						placement="right"
						:closable="true"
						width="420px"
						:maskClosable="true"
						:visible="visibleDrawer"
						@close="onClose"
						:mask="false"
						class="message-center-drawer"
					>
						<div class="msg-body">
							<div class="tabs-box">
								<a-tabs v-model="msgTab">
									<a-tab-pane key="warning">
										<div slot="tab">预警消息({{ totalWarningNum }})</div>
									</a-tab-pane>
									<a-tab-pane key="instation">
										<div slot="tab">站内消息({{ totalNoticeNum }})</div>
									</a-tab-pane>
								</a-tabs>
							</div>
							<div
								v-show="msgTab == 'warning'"
								class="warning-list"
							>
								<div v-if="warningList.length">
									<a-tooltip
										v-for="(item, key) in warningList.slice(0, 50)"
										:key="key"
										:getPopupContainer="
											triggerNode => {
												return triggerNode.parentNode || document.body;
											}
										"
									>
										<template slot="title">{{ item.messageContent }}</template>
										<div
											class="warning-body"
											:key="key"
											@click="jumpPage(item)"
										>
											<div
												class="level hign"
												v-if="item.riskLevel == 'HIGH'"
											>
												{{ item.riskLevelDesc }}
											</div>
											<div
												class="level medium"
												v-if="item.riskLevel == 'MEDIUM'"
											>
												{{ item.riskLevelDesc }}
											</div>
											<div
												class="level low"
												v-if="item.riskLevel == 'LOW'"
											>
												{{ item.riskLevelDesc }}
											</div>
											<div class="warning-title">
												{{ item.alertTypeBelongDesc }}
											</div>
											<div class="warning-content">
												<span v-if="item.ruleName">【{{ item.ruleName }}】</span>{{ item.messageContent }}
											</div>
											<div class="warning-time">
												{{ item.alertDate }}
											</div>
										</div>
									</a-tooltip>
									<div
										class="pop-msg-link"
										@click="goWarningList"
									>
										查看更多
										<img
											src="@/v2/assets/imgs/person/msg-r.png"
											alt=""
											style="width: 14px; margin-bottom: 3px"
										/>
									</div>
								</div>
								<div
									v-else
									class="no-warning"
								>
									<img src="@/v2/assets/imgs/person/msg-no.png" />
									<div>暂无数据</div>
								</div>
							</div>
							<div
								v-show="msgTab == 'instation'"
								class="warning-list"
							>
								<div v-if="noticeData.length">
									<a-tooltip
										v-for="(item, key) in noticeData.slice(0, 50)"
										:key="key"
										:getPopupContainer="
											triggerNode => {
												return triggerNode.parentNode || document.body;
											}
										"
									>
										<template slot="title">
											{{ item.message }}
										</template>
										<div
											class="pop-msg-item"
											@click="goToDetail(item)"
										>
											<div class="circle"></div>
											<div class="warning-content">{{ item.message }}</div>
											<div class="warning-time">{{ item.sendDate }}</div>
										</div>
									</a-tooltip>
									<div
										class="pop-msg-link"
										@click="showNoticeList"
									>
										查看更多
										<img
											src="@/v2/assets/imgs/person/msg-r.png"
											alt=""
											style="width: 14px; margin-bottom: 3px"
										/>
									</div>
								</div>
								<div
									v-else
									class="no-warning"
								>
									<img src="@/v2/assets/imgs/person/msg-no.png" />
									<div>暂无数据</div>
								</div>
							</div>
						</div>
					</a-drawer>
					<HeaderNameAvatar />
				</div>
			</div>
		</div>
		<!--通知弹窗-->
		<personValid ref="personValidModel" />
		<!-- 铁瑞系公司跳转导航 -->
		<TieRuiGuide
			ref="tieRuiGuide"
			v-if="isBelongTieRui"
		/>
	</header>
</template>

<script lang="jsx">
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { hasAuth } from '@/v2/utils/checkAuth';
import { getMessageListMap } from 'untils/message.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import personValid from '@/v2/components/personValid';
import storage from '@sub/utils/storage';
import { API_GetNoticeList, API_SetReadMessage, API_GetWarningHeaderList } from 'api';
import { getSubsystemOptions, subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
import HeaderNameAvatar from './HeaderNameAvatar';
import reportCode from '@/v2/config/reportCode';
import TieRuiGuide from '@/components/TieRuiGuide/index.vue';

export default {
	data() {
		return {
			companySwitchStatusDict: filterCodeByKey('companySwitchStatusDict') || [],
			noticeData: [],
			otherCompany: [],
			totalNoticeNum: 0,
			totalWarningNum: 0,
			visible: false,
			loginUniqueId: storage.session.get('loginUniqueId'),
			msgTab: 'warning',
			warningList: [],
			visibleDrawer: false
		};
	},
	components: {
		personValid,
		HeaderNameAvatar,
		TieRuiGuide
	},
	computed: {
		...mapGetters('user', {
			VUEX_GE_CENTERMENUS: 'VUEX_GE_CENTERMENUS',
			VUEX_GE_CENTERMENUSMAP: 'VUEX_GE_CENTERMENUSMAP',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051';
		},
		filterMenuList() {
			return this.VUEX_GE_CENTERMENUSMAP.filter(
				item => item.menuList && item.menuList.length > 0 && item.name !== 'invoiceTools'
			);
		}
	},
	props: {
		messageVisible: {
			default: true,
			required: false,
			type: Boolean
		}
	},
	watch: {
		$route() {
			this.visibleDrawer = false;
		}
	},
	mounted() {
		if (this.messageVisible) {
			// 为true时展示站内消息。发运信息查询页为false
			this.getNoteList();
			this.getWarningList();
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN',
			VUEX_MU_BACKURL: 'user/VUEX_MU_BACKURL',
			VUEX_MU_CURRENT_PATH: 'user/VUEX_MU_CURRENT_PATH',
			SET_VUEX_CURRENT_PLATEFORM: 'user/SET_VUEX_CURRENT_PLATEFORM'
		}),
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
		hasAuth,
		setActiveTab(item) {
			const currentPathFlag = this.$route.path?.split('/')[2] || '';
			if (item.menuList && item.menuList.length) {
				for (let i = 0; i < item.menuList.length; i++) {
					if (item.menuList[i].children && item.menuList[i].children) {
						for (let j = 0; j < item.menuList[i].children.length; j++) {
							const itemPathFlag = item.menuList[i].children[j]?.link?.split('/')[2];
							if (item.menuList[i].children[j].link === this.$route.path || itemPathFlag === currentPathFlag) {
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		getStatus(v) {
			if (v === 'JOINED') {
				return '';
			}
			let text = '';
			this.companySwitchStatusDict.forEach(item => {
				if (item.value === v) {
					text = item.text;
				}
			});
			return `（${text}）`;
		},
		getNoteList() {
			API_GetNoticeList({
				pageNo: 1,
				pageSize: 50,
				d: Date.now()
			}).then(res => {
				if (res && res.success) {
					this.noticeData = [];
					this.totalNoticeNum = res.result.total;
					res.result.records.forEach(item => {
						item.params = item.params || JSON.stringify({});
						let params = JSON.parse(item.params);
						getMessageListMap(item.params).forEach(it => {
							if (item.type == it.type) {
								if (it.ifShowBtn) {
									this.noticeData.push({
										id: item.id,
										message: item.content,
										isShowBtn: true,
										sendDate: item.sendDate,
										url: it.url,
										selectKey: it.selectKey,
										menuTitle: it.menuTitle,
										barFlag: it.barFlag,
										companyId: it.companyId,
										status: item.status == '0' ? '未读' : '已读',
										stationId: params?.stationId,
										storageCompanyUscc: params?.storageCompanyUscc,
										params: item.params || JSON.stringify({})
									});
								} else {
									this.noticeData.push({
										id: item.id,
										message: item.content,
										sendDate: item.sendDate,
										isShowBtn: false,
										companyId: it.companyId,
										status: item.status == '0' ? '未读' : '已读',
										params: item.params || JSON.stringify({})
									});
								}
							}
						});
					});
				}
			});
		},

		showNoticeList() {
			this.$router.push({
				path: '/center/message/index',
				query: {
					type: 'instation'
				}
			});
		},
		// 注销
		logout() {
			this.VUEX_USER_LOGOUT();
		},
		goDetail(item) {
			let link = '';
			if (item.link) {
				link = item.link;
			} else if (item.children && item.children.length) {
				link = item.children[0].link;
			}
			if (link) {
				this.$router.push({
					path: link
				});
				this.VUEX_MU_CURRENT_PATH(link);
			}
		},
		changeTab(item) {
			// 铁瑞系公司登录系统-非账户中心菜单下展示提示弹窗
			const passFlag = ['账户中心', '财务中心', '资产管理', '融资管理', '数据监控'].includes(item.label);
			if (this.isBelongTieRui) {
				if (!passFlag) {
					this.$refs.tieRuiGuide.showModal();
					return;
				}
			}
			let url = '';
			try {
				url = item.menuList[0].children[0].link;
			} catch (e) {
				url = '';
			}
			if (!url) return;
			this.VUEX_MU_CURRENT_PATH(url);
			this.$emit('changeTab', true);
			this.$router.push(url);
		},
		async goToDetail(item) {
			if (item.selectKey == '/center/contract/contractList') {
				return;
			}
			if (item.url.indexOf('/center/logisticsPlatform/') !== -1) {
				await this.changePlatformIfNeed(item);
			}
			let queryParams = {
				selectKey: item.selectKey
			};
			queryParams = item.params ? Object.assign(queryParams, JSON?.parse(item?.params)) : queryParams;
			this.$router.push({
				path: item.url,
				query: queryParams
			});
			this.setRead(item);
		},
		setRead(item) {
			API_SetReadMessage(item.id);
		},
		showModel() {
			this.unverifiedVisible = false;
			this.visible = true;
			this.$refs.personValidModel.showPersonValid();
		},
		async getWarningList() {
			const params2 = {
				t: Math.random()
			};
			const res2 = await getSubsystemOptions(params2);

			const list = res2.data || [];
			const params = {
				ruleType: 'ALL',
				pageNo: 1,
				pageSize: 50,
				stationIdList: list.map(el => el?.stationId).join()
			};
			API_GetWarningHeaderList(params).then(res => {
				if (res.success) {
					this.warningList = res.result?.msgList || [];
					this.totalWarningNum = res.result?.total;
				}
			});
		},
		goWarningList() {
			this.visibleDrawer = false;
			this.$router.push('/center/message/index');
		},
		jumpPage(record) {
			this.visibleDrawer = false;
			if (['YJGS0001', 'YJGS0002'].includes(record.ruleNo)) {
				// 企业名称 和法定代表人变更
				if (this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin')) {
					this.$router.push({
						path: '/center/account/company/info/change'
					});
				} else {
					this.$router.push({
						path: '/center/message/index'
					});
				}
			} else if (['YJSF0016', 'YJSF0017'].includes(record.ruleNo)) {
				// 陕煤物流监管-预警
				this.$router.push({
					path: '/center/message/riskControlLogisticSuperviseDetail',
					query: {
						id: record.id,
						ruleNo: record.ruleNo
					}
				});
			} else {
				let path = record.alertType === 'YJZS' ? '/center/message/riskControlCertDetail' : '/center/message/riskControlDetail';

				if (record.alertType === 'YJSXT') {
					path = '/center/message/facilityDetail';
				}
				// 价格下跌
				if (record.alertTypeBelong === 'PRICE_FAIL') {
					path = '/center/message/riskControlPriceDeclineDetail';
				}
				if (record.alertTypeBelong === 'INVENTORY') {
					if (record.ruleNo == 'YJKC006' || record.ruleNo == 'YJKC005') {
						// 放货指令 临额|超额
						path = '/center/message/instructDetail';
					} else {
						path = '/center/message/inventoryDetail';
					}
				}
				this.$router.push({
					path,
					query: {
						id: record.id,
						orderType: record.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell'
					}
				});
			}
		},
		onClose() {
			this.visibleDrawer = false;
		},
		hoverNoticeIcon() {
			this.visibleDrawer = true;
			this.getNoteList();
			this.getWarningList();
		},
		async changePlatformIfNeed(record) {
			let { stationId, storageCompanyUscc } = record;
			if (stationId && this.VUEX_CURRENT_PLATEFORM.stationId != stationId) {
				let companyCreditCode = storageCompanyUscc;
				if (!companyCreditCode) {
					let { success, data } = await getSubsystemOptions();
					if (!success) {
						return;
					}
					let currentPlatform = data.filter(item => item.stationId == stationId)[0] || {};
					companyCreditCode = currentPlatform.companyCreditCode;
				}
				let res = await subsystemOptionsEdit({
					stationId: stationId,
					companyCreditCode: companyCreditCode
				});
				if (!res.success) {
					return;
				}
				// 更新vuex
				let optionsRes = await getSubsystemOptions();
				if (!optionsRes.success) {
					return;
				}
				let currentPlatform1 = optionsRes.data.filter(item => item.selected)[0] || {};
				this.SET_VUEX_CURRENT_PLATEFORM({
					...currentPlatform1,
					allStationList: optionsRes.data
				});
				return true;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.lay-content {
	margin: 0 auto;
}
.msg-title {
	height: 20px;
	font-size: 14px;
	font-weight: 400;
	color: rgba(33, 25, 70, 0.6);
	line-height: 20px;
}
.msg-text {
	height: 20px;
	width: 362px;
	font-weight: 400;
	color: rgba(4, 1, 18, 0.8);
	line-height: 20px;
	margin-bottom: 5px;
}
::v-deep .menu-item {
	min-width: 128px;
	height: 40px;
	line-height: 30px;
	text-align: left;
	padding-left: 16px;
	font-size: 13px;
	color: #383a3f;
}
::v-deep .menu-item:hover > a {
	color: @primary-color !important;
}
header {
	height: 64px;
	font-size: 12px;
	color: #ffffff;

	.right-content {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		margin-right: 30px;
		margin-left: 10px;
		padding-left: 20px;
		// padding-bottom: 6px;
	}
	.center-help-btn {
		margin-right: 10px;
		// margin-bottom: -6px;
		span {
			height: 23px;
			display: inline-block;
			font-size: 14px;
			line-height: 23px;
			color: rgba(0, 0, 0, 0.8);
			font-family: PingFangSC-Medium;
		}
	}

	.header-nav {
		overflow: hidden;
		.nav-logo {
			width: 228px;
		}
		height: 100%;
		position: relative;
		z-index: 99;
		background: #ffffff;
		border-bottom: 1px solid #eeeeee;
		.lay-content {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			height: 100%;
			.wrap-er {
				height: 64px;
				flex: 1;
				overflow: hidden;
				ul {
					display: flex;
					align-items: center;
					overflow: hidden;
					overflow-x: overlay;
				}
				.border {
					position: relative;
					margin-right: 60px;
					padding-right: 0;
					margin-left: 0;
				}
				ul {
					li:first-child:before {
						// content: '';
						// width: 1px;
						// height: 16px;
						// background: rgba(0,0,0,0.1);
						// position: absolute;
						// right: -40px;
						// top: 24px;
					}
					li.work_table:before {
						content: '';
						width: 1px;
						height: 16px;
						background: rgba(0, 0, 0, 0.1);
						position: absolute;
						right: -40px;
						top: 24px;
					}
				}
			}
			ul {
				white-space: nowrap;
				height: 100%;
				li {
					height: 100%;
					font-size: 14px;
					font-family: PingFangSC-Medium;
					color: rgba(0, 0, 0, 0.8);
					margin: 0 20px;
					cursor: pointer;
					//line-height: 20px;
					text-align: center;
					line-height: 64px;
					display: inline-block;
					&.active {
						color: @primary-color;
						position: relative;
					}
					&.active:after {
						display: inline-block;
						width: 100%;
						height: 2px;
						border-radius: 2px;
						content: '';
						background: @primary-color;
						position: absolute;
						left: 0;
						bottom: 0;
					}
				}
			}
		}
		.menu-item-header:hover {
			color: @primary-color;
		}
	}
}

/deep/ .ant-popover-inner-content {
	padding: 0 !important;
}

.msg-body {
	width: 380px;
	height: calc(100vh - 150px);
	background: #fff;
	padding-top: 54px;
	.tabs-box {
		position: absolute;
		background-color: #ffffff;
		z-index: 9;
		left: 20px;
		top: 16px;
		right: 20px;
		width: calc(100% - 40px);
	}
	.warning-list {
		height: 100%;
		overflow-y: auto;
		// padding-bottom: 50px;
	}
	.warning-body {
		padding: 10px;
		padding-right: 0;
		padding-left: 37px;
		position: relative;
		cursor: pointer;
		margin-bottom: 6px;
		&:hover {
			background: #f4f4f4;
			border-radius: 4px;
		}
	}
	.level {
		position: absolute;
		width: 16px;
		height: 16px;
		left: 10px;
		top: 10px;
		line-height: 16px;
		text-align: center;
		background: #dd4444;
		border-radius: 4px;
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		color: #ffffff;
	}
	.hign {
		background: #dd4444;
	}
	.medium {
		background: #f5822e;
	}
	.low {
		background: #147cf6;
	}
	.warning-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-size: 14px;
		line-height: 14px;
		font-weight: 700;
		color: rgba(0, 0, 0, 0.8);
	}
	.warning-content {
		font-size: 14px;
		line-height: 14px;
		height: 14px;
		margin-top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #77889d;
	}
	.warning-time {
		font-weight: 400;
		font-size: 12px;
		line-height: 12px;
		margin-top: 8px;
		color: rgba(0, 0, 0, 0.25);
	}
	.pop-msg-link {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 44px;
		line-height: 44px;
		background: #ffffff;
		font-size: 14px;
		font-weight: 400;
		color: rgba(4, 1, 18, 0.8);
		text-align: center;
		color: #939eaf;
		cursor: pointer;
		border-top: 1px solid #e5e6eb;
		width: 90%;
		left: 5%;
	}
	.pop-msg-item {
		padding: 10px;
		padding-left: 26px;
		position: relative;
		cursor: pointer;
		&:hover {
			background: #f4f4f4;
			border-radius: 4px;
		}
	}
	.circle {
		position: absolute;
		width: 6px;
		height: 6px;
		left: 10px;
		top: 22px;
		background: #dd4444;
		border-radius: 50%;
	}
}

/deep/ .ant-tabs {
	color: rgba(0, 0, 0, 0.8);
}
/deep/ .ant-tabs-nav .ant-tabs-tab-active {
	font-weight: 500;
}
.no-warning {
	text-align: center;
	padding: 160px 0;
	img {
		width: 66px;
		margin-bottom: 14px;
		color: rgba(0, 0, 0, 0.4);
	}
}
.message-center-drawer {
	height: calc(100vh - 64px);
	margin-top: 64px;
	/deep/ .ant-drawer-content {
		overflow: hidden;
	}
	/deep/ .ant-drawer-body {
		height: calc(100vh - 64px);
		overflow: hidden;
		padding: 20px;
	}
	/deep/ .ant-drawer-content-wrapper {
		box-shadow: 0 2px 4px 0 rgba(54, 58, 80, 0.32);
	}
	/deep/ .ant-tabs-bar {
		margin: 0;
	}
}
</style>
