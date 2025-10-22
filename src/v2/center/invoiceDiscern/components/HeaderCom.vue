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
						<li class="active">发票识别</li>
						<!-- 顶部菜单内容取自VUEX_GE_CENTERMENUSMAP -->
						<!-- <a-dropdown
              v-for="(item, index) in filterMenuList"
              :key="index"
              placement="bottomCenter"
              v-auth="item.authCode"
            >
              <li
                :class="[setActiveTab(item) ? 'active' : '']+' '+(index==0?'border':'')"
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
                  <a href="javascript:;" @click="goDetail(_item, item.name)">{{
                    _item.name
                  }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown> -->
					</ul>
				</div>
				<div class="right-content">
					<a-popover
						trigger="hover"
						placement="bottomRight"
						v-if="VUEX_ST_PERSONALLINFO.curCompanyId"
					>
						<div
							:class="'notice-icon ' + (totalNoticeNum || totalWarningNum ? 'has' : '')"
							@mouseenter="hoverNoticeIcon"
						></div>
						<template slot="content">
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
													{{ item.messageContent }}
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
						</template>
					</a-popover>
					<a-popover
						v-model="visible"
						trigger="hover"
						@visibleChange="visibleChange"
						placement="bottomRight"
					>
						<div class="nickname">
							<p
								class="name ellipsis"
								:style="{
									'line-height': !VUEX_ST_COMPANYSUER.company ? '35px' : ''
								}"
							>
								{{ VUEX_ST_PERSONALLINFO.name || '未认证' }}
							</p>
							<p
								class="name companyName ellipsis"
								v-if="VUEX_ST_COMPANYSUER.company"
							>
								{{ VUEX_ST_COMPANYSUER.company.abbreviation }}
							</p>
						</div>

						<template slot="content">
							<div
								v-if="!VUEX_ST_COMPANYSUER.company"
								class="unverified"
							>
								<div class="userinfo">
									<img
										class="avatar"
										:src="
											VUEX_ST_PERSONALLINFO.picUrl
												? VUEX_ST_PERSONALLINFO.picUrl
												: require('@/v2/assets/imgs/person/default-avatar.png')
										"
									/>
									<div
										v-if="!VUEX_ST_PERSONALLINFO.name"
										class="name"
									>
										个人认证
										<img
											src="@/v2/assets/imgs/person/wsm.png"
											alt=""
											class="rz"
										/>
										<a
											href="javascript:;"
											@click="showModel"
										>
											去实名
										</a>
									</div>
									<div
										v-else
										class="name"
									>
										{{ VUEX_ST_PERSONALLINFO.name }}
										<img
											src="@/v2/assets/imgs/person/ysm.png"
											alt=""
											class="rz"
										/>
									</div>
								</div>
								<div style="margin-top: 13px; margin-left: 4px; margin-right: -16px; border-bottom: 1px solid #e5e6eb"></div>
								<div
									class="select-item"
									@click="goPage('/center/account/person/info')"
								>
									个人信息
								</div>
								<div
									class="select-item"
									@click="goPage('/center/account/person/safety')"
								>
									安全管理
								</div>
								<div style="margin-left: 4px; margin-right: -16px; border-bottom: 1px solid #e5e6eb"></div>
								<div
									class="select-item"
									@click="logout"
									style="margin-bottom: -12px"
								>
									安全退出
									<img
										src="@/v2/assets/imgs/person/over.png"
										alt=""
										style="margin-top: 17px"
									/>
								</div>
							</div>
							<div
								class="verified"
								v-else
							>
								<div class="userinfoMain">
									<div class="userinfo">
										<img
											class="avatar"
											:src="
												VUEX_ST_PERSONALLINFO.picUrl
													? VUEX_ST_PERSONALLINFO.picUrl
													: require('@/v2/assets/imgs/person/default-avatar.png')
											"
										/>
										<div class="name">
											{{ VUEX_ST_PERSONALLINFO.name }}
											<img
												src="@/v2/assets/imgs/person/ysm.png"
												alt=""
												class="rz"
											/>
										</div>
									</div>
									<!-- 核心企业有切换业务负责人权限 -->
									<div
										v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'"
										class="businessUser"
										@click="getDirectorByUser"
									>
										<a-tooltip>
											<template slot="title"> 切换业务负责人 </template>
											<i class="iconfont icon-zhanghuguanli"></i>
										</a-tooltip>
									</div>
								</div>
								<div style="margin-top: 13px; margin-left: 4px; margin-right: -16px; border-bottom: 1px solid #e5e6eb"></div>

								<div
									class="quick-entrance quick-entrance2"
									v-if="VUEX_ST_COMPANYSUER.company.group"
								>
									<div
										class="quick-btn"
										@click="goPage('/center/account/person/info')"
									>
										个人信息
									</div>
									<div
										class="quick-btn"
										@click="goPage('/center/account/person/safety')"
									>
										安全管理
									</div>
									<template>
										<div
											class="quick-btn"
											@click="operation('applyJoinCompany')"
										>
											加入新企业
										</div>
										<div
											class="quick-btn"
											@click="operation('verifyJoinCompany')"
										>
											邀请码验证
										</div>
										<div
											class="quick-btn"
											@click="operation('companyTypeModal')"
										>
											认证新企业
										</div>
									</template>
								</div>

								<div
									class="quick-entrance"
									v-else
								>
									<div
										style="width: 50%"
										@click="goPage('/center/account/person/info')"
									>
										个人信息
									</div>
									<div
										style="width: 50%"
										@click="goPage('/center/account/person/safety')"
									>
										安全管理
									</div>
								</div>
								<div style="margin-left: 4px; margin-right: -16px; border-bottom: 1px solid #e5e6eb"></div>

								<div class="company-list">
									<div
										class="item"
										v-for="item in otherCompany"
										:key="`${item.companyUscc}${item.mobile}`"
									>
										<div
											style="width: 310px"
											@click.stop="switchCompany(item)"
										>
											<div class="company-name">
												{{ item.companyName }}
											</div>
											<div class="username">{{ item.personalName }}（{{ item.mobile }}）</div>
										</div>
										<div style="line-height: 48px">
											<img
												src="@/v2/assets/imgs/person/nowLogin.png"
												alt=""
												style="width: 76px; margin-bottom: 8px"
												v-if="item.currentLogin"
											/>
											<template v-else>
												<a
													href="javascript:;"
													style="margin-right: 20px"
													@click.stop="switchCompany(item)"
													>切换账号</a
												>
												<a
													href="javascript:;"
													v-if="item.supportDel"
													@click.stop="deleteCompany(item)"
													>删除</a
												>
											</template>
										</div>
									</div>
								</div>

								<a-row
									class="logout"
									@click="logout"
									style="margin-bottom: -12px"
								>
									<a-col
										:span="12"
										@click="logout"
									>
										安全退出
										<img
											src="@/v2/assets/imgs/person/over.png"
											alt=""
										/>
									</a-col>
									<a-col
										:span="12"
										@click="addAccount"
									>
										添加账号
										<img
											src="@/v2/assets/imgs/person/add.png"
											alt=""
										/>
									</a-col>
								</a-row>
							</div>
						</template>
					</a-popover>
					<img
						class="avatar"
						:src="
							VUEX_ST_PERSONALLINFO.picUrl
								? VUEX_ST_PERSONALLINFO.picUrl
								: require('@/v2/assets/imgs/person/default-avatar.png')
						"
					/>
				</div>
			</div>
		</div>
		<!--通知弹窗-->
		<CompanyTypeModal
			ref="companyTypeModal"
			:isGroup="true"
		/>
		<ApplyJoinCompany
			ref="applyJoinCompany"
			:isGroup="true"
		/>
		<VerifyJoinCompany
			ref="verifyJoinCompany"
			:isGroup="true"
		/>
		<personValid ref="personValidModel" />
		<Login ref="login" />
		<CurrentDirector ref="currentDirector" />
	</header>
</template>

<script lang="jsx">
import { API_COMPANYUSERSWITCH, API_COMPANYGETSWITCHCOMPANY, API_COMPANYUSERDELETELOGINHISTORY } from 'api/account';

import ENV from 'api/env.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import unAuthRouter from '@/v2/router/unAuthRouter';
import axios from 'axios';
import { getMessageListMap } from 'untils/message.js';
import CompanyTypeModal from '@/v2/center/person/components/CompanyTypeModal.vue';
import ApplyJoinCompany from '@/v2/center/person/components/ApplyJoinCompany.vue';
import VerifyJoinCompany from '@/v2/center/person/components/VerifyJoinCompany.vue';
import { getPersonalDetail } from 'untils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import personValid from '@/v2/components/personValid';
import storage from "@sub/utils/storage";
import Login from '@/components/common/modules/Login';
import CurrentDirector from '@/components/common/modules/CurrentDirector';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { API_GetNoticeList, API_GetWarningList, API_SetReadMessage } from 'api';
import { getSubsystemOptions } from '@/v2/center/logisticsPlatform/api';

export default {
	data() {
		return {
			ENV: ENV,
			companySwitchStatusDict: filterCodeByKey('companySwitchStatusDict') || [],
			noticeData: [],
			otherCompany: [],
			totalNoticeNum: 0,
			totalWarningNum: 0,
			visible: false,
			loginUniqueId: storage.session.get('loginUniqueId'),
			msgTab: 'warning',
			warningList: []
		};
	},
	components: {
		CompanyTypeModal,
		ApplyJoinCompany,
		VerifyJoinCompany,
		personValid,
		Login,
		CurrentDirector
	},
	computed: {
		...mapGetters('user', {
			VUEX_GE_CENTERMENUS: 'VUEX_GE_CENTERMENUS',
			VUEX_GE_CENTERMENUSMAP: 'VUEX_GE_CENTERMENUSMAP',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		hasAuth() {
			return unAuthRouter.some(el => {
				return el.path == this.$route.path || el.path + '/' == this.$route.path;
			});
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
	mounted() {
		if (this.messageVisible) {
			// 为true时展示站内消息。发运信息查询页为false
			this.getNoteList();
			this.getWarningList();
		}
		this.getOtherCompany();
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN',
			VUEX_MU_BACKURL: 'user/VUEX_MU_BACKURL',
			VUEX_MU_CURRENT_PATH: 'user/VUEX_MU_CURRENT_PATH'
		}),
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
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
		visibleChange(v) {
			if (v) {
				this.getOtherCompany();
			}
		},
		async getvisitorId() {
			const fp = await FingerprintJS.load();
			const result = await fp.get();
			storage.session.set('loginUniqueId', result.visitorId);
			this.loginUniqueId = result.visitorId;
		},
		async getOtherCompany() {
			if (!this.loginUniqueId) {
				await this.getvisitorId();
			}
			if (this.VUEX_ST_COMPANYSUER.companyName) {
				API_COMPANYGETSWITCHCOMPANY({
					loginUniqueId: this.loginUniqueId
				}).then(res => {
					if (res.success) {
						this.otherCompany = res.data || [];
					}
				});
			}
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
		// 更新用户信息 权限信息
		operation(value) {
			this.$refs[value].showModal();
			this.visible = false;
		},
		switchCompany({
			companyUscc,
			status,
			rejectReason,
			companyName,
			authCompanyType,
			loginPassword,
			supportDel,
			companyUserId,
			currentLogin
		}) {
			if (currentLogin) {
				return;
			}
			if (status === 'EDIT') {
				this.$confirm({
					centered: true,
					title: `您发起的“${companyName}”的企业认证审核被驳回，驳回原因：${rejectReason}`,
					okText: '重新提交认证',
					// content: '',
					cancelText: '取消',
					icon: () => (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					),
					onOk: () =>
						this.$router.push({
							path: '/center/account/company/info/certified',
							query: { recertification: 'recertification', uscc: companyUscc, name: companyName, type: authCompanyType }
						})
					// onCancel() {}
				});
				return;
			}
			if (status === 'APPROVAL') {
				this.$confirm({
					centered: true,
					title: '当前企业正在审核，请等待审核结果',
					okText: '确定',
					okCancel: null,
					// content: '',
					cancelText: '取消',
					icon: () => (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					)
					// onOk:() => ,
					// onCancel() {}
				});
				return;
			}

			API_COMPANYUSERSWITCH({ companyUscc, loginPassword, supportDel, loginUniqueId: this.loginUniqueId, companyUserId }).then(
				res => {
					let ary = [];
					this.filterMenuList.map(item => {
						item.menuList.map(r => {
							if (r.link) {
								ary.push(r);
							} else if (r.children) {
								ary = ary.concat(r.children);
							}
						});
					});
					if (this.$route.matched[1].meta.authCode == 'dgChain') {
						storage.session.set('nowAuthCode', 'dgChain');
					} else {
						ary.map(i => {
							if (this.$route.fullPath == i.link) {
								storage.session.set('nowAuthCode', i.authCode);
							}
						});
					}
					// 替换token 更新用户详情，以及权限
					if (res.success) {
						if (!res.data.result) {
							if (res.data.message.includes('冻结')) {
								this.$warning({
									title: '提示',
									content: res.data.message,
									okText: '取消',
									onOk: () => {}
								});
							} else {
								this.$warning({
									title: '提示',
									content: res.data.message,
									okText: '去登录',
									onOk: () => {
										this.logout();
									}
								});
							}
						} else {
							const { token } = res.data.token;
							this.VUEX_MU_USERTOKEN(token);
							// 临时写法
							storage.session.set('switchCompany', true);
							getPersonalDetail(this.reloadPage);
						}
					}
				}
			);
		},
		deleteCompany({ companyUserId }) {
			this.$confirm({
				centered: true,
				content: '删除后需重新输入账号和密码登录，您确认删除吗？',
				title: '信息提示',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.deleteCompanyHistory(companyUserId);
				},
				onCancel() {}
			});
		},
		deleteCompanyHistory(companyUserId) {
			API_COMPANYUSERDELETELOGINHISTORY({ companyUserId, loginUniqueId: this.loginUniqueId }).then(res => {
				// 替换token 更新用户详情，以及权限
				if (res.success) {
					this.$message.success('操作成功');
					this.getOtherCompany();
				}
			});
		},
		reloadPage() {
			window.location.reload();
			// window.location.href = "/center/workbench/myToDoList";
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
										status: item.status == '0' ? '未读' : '已读'
									});
								} else {
									this.noticeData.push({
										id: item.id,
										message: item.content,
										sendDate: item.sendDate,
										isShowBtn: false,
										companyId: it.companyId,
										status: item.status == '0' ? '未读' : '已读'
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
		//切换业务负责人
		getDirectorByUser() {
			this.$refs.currentDirector.showModal();
		},
		// 注销
		logout() {
			this.VUEX_USER_LOGOUT();
		},
		addAccount() {
			this.$refs.login.init();
		},
		goCcsFin() {
			// if (!this.ifAuth()) return
			API_SSO_CCSFIN_GET().then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				let ticket = res.result;

				//先退出云控，再登录
				axios({
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Cache-Control': 'no-cache',
						Pragma: 'no-cache'
					},
					responseType: 'text/html',
					url: `${ENV.VUE_APP_YIMEI_FIN_URL}/logout`,
					method: 'get'
				}).then(() => {
					// 在新窗口调用post请求来登陆运控
					var url = ENV.VUE_APP_YIMEI_FIN_URL + '/login?ssoTicket=' + ticket;

					var formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' + '</form>';

					var win = window.open('', '_blank');
					win.document.body.innerHTML = formStr;
					win.document.forms[0].submit();
				});
			});
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
		goPage(url) {
			this.$router.push(url);
		},
		goToDetail(item) {
			this.$router.push({
				path: item.url,
				query: {
					selectKey: item.selectKey
				}
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
			if (!list.length) {
				return;
			}
			list.forEach(el => {
				el.value = el?.stationId;
			});
			const params = {
				ruleType: 'ALL',
				pageNo: 1,
				pageSize: 50,
				stationIdList: list.map(el => el?.stationId).join()
			};
			API_GetWarningList(params).then(res => {
				if (res.success) {
					this.warningList = res.result.records;
					this.totalWarningNum = res.result.total;
				}
			});
		},
		goWarningList() {
			this.$router.push('/center/message/index');
		},
		jumpPage(record) {
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
			} else if (['YJSF0016', 'YJSF0017'].includes(record.ruleNo)){ 
				// 陕煤物流监管-预警
				this.$router.push({
					path: '/center/message/riskControlLogisticSuperviseDetail',
					query: {
						id: record.id,
						ruleNo:  record.ruleNo,
					}
				});
			} else {
				let path = record.alertType === 'YJZS' ? '/center/message/riskControlCertDetail' : '/center/message/riskControlDetail';

				if (record.alertType === 'YJSXT') {
					path = '/center/message/facilityDetail';
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
		hoverNoticeIcon() {
			this.getNoteList();
			this.getWarningList();
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
	color: @primary-color!important;
}
header {
	height: 64px;
	font-size: 12px;
	color: #ffffff;

	.right-content {
		display: flex;
		cursor: pointer;
		margin-right: 30px;
		margin-left: 10px;
	}
	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: block;
		margin-top: 3px;
		object-fit: cover;
	}
	.notice-icon {
		width: 18px;
		height: 18px;
		background-image: url(~@/v2/assets/imgs/home/notice_icon.png);
		margin-right: 24px;
		background-size: cover;
		position: relative;
		margin-top: 9px;
		.notice-count {
			height: 16px;
			padding: 0 5px;
			position: absolute;
			font-size: 12px;
			line-height: 16px;
			font-weight: 500;
			color: #ffffff;
			top: -5px;
			left: 18px;
			background: #e8372b;
			border-radius: 8px 8px 8px 0px;
		}
		&:hover {
			background-image: url(~@/v2/assets/imgs/home/notice_icon_hover.png);
		}
	}
	.notice-icon.has {
		width: 21px;
		height: 23px;
		background-image: url(~@/v2/assets/imgs/home/notice_icon_has.png);
		margin-top: 4px;
		&:hover {
			background-image: url(~@/v2/assets/imgs/home/notice_icon_has_hover.png);
		}
	}

	.nickname {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #141517;
		letter-spacing: 0;
		text-align: left;
		line-height: 40px;
		margin-left: 14px;
		.name {
			line-height: 18px;
			display: block;
			margin-right: 10px;
			font-size: 14px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.8);
			text-align: right;
		}
		.companyName {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: rgba(0, 0, 0, 0.4);
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
				flex: 1;
				overflow-x: auto;
				overflow-x: auto;
				overflow-y: hidden;
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
				}
				// .border:after{

				// }
				// .active.border:after{
				//   top: 24px;
				// }
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
						height: 3px;
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

.unverified {
	width: 224px;
	.userinfo {
		display: flex;
		line-height: 38px;
		.name {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 38px;
			.rz {
				width: 40px;
				height: 20px;
				margin-bottom: 2px;
				margin-left: 6px;
				margin-right: 8px;
			}
		}
		.avatar {
			width: 38px;
			height: 38px;
			margin-left: 4px;
			margin-right: 12px;
			border-radius: 50%;
		}
	}
	.select-item {
		height: 48px;
		line-height: 48px;
		padding-left: 4px;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		img {
			width: 14px;
			height: 14px;
		}
	}
}
.verified {
	width: 424px;
	.userinfoMain {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		.businessUser {
			width: 22px;
			height: 22px;
			border-radius: 4px;
			text-align: center;
			font-size: 18px;
			line-height: 22px;
			cursor: pointer;
			&:hover {
				background: rgba(119, 136, 157, 0.1);
			}
		}
	}
	.userinfo {
		display: flex;
		line-height: 38px;
		.name {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 38px;
			.rz {
				width: 40px;
				height: 20px;
				margin-bottom: 2px;
				margin-left: 6px;
				margin-right: 8px;
			}
		}
		.avatar {
			width: 38px;
			height: 38px;
			margin-left: 4px;
			margin-right: 12px;
			border-radius: 50%;
		}
	}
	.quick-entrance {
		display: flex;
		height: 48px;

		.quick-btn:hover {
			background: rgba(243, 245, 246, 1);
			border-radius: 4px;
		}
		div {
			width: 20%;
			text-align: center;
			line-height: 48px;
			font-weight: 400;
			cursor: pointer;
			color: @primary-color;
			font-size: 14px;
			&:after {
				content: '';
				float: right;
				display: block;
				width: 1px;
				height: 12px;
				background: #e5e6eb;
				margin-top: 16px;
			}
			&:last-child {
				&:after {
					display: none;
				}
			}
		}
	}
	.quick-entrance2 {
		padding: 5px 0;
		box-sizing: border-box;
		line-height: 38px;
		.quick-btn {
			line-height: 38px;
		}
	}

	.company-list {
		max-height: calc(100vh - 260px);
		overflow-y: auto;
		overflow-x: hidden;
		margin-right: -16px;
		.item {
			line-height: 64px;
			height: 64px;
			margin-left: -16px;
			margin-right: -16px;
			display: flex;
			padding-left: 20px;
			padding-top: 10px;
			&:hover {
				background: rgba(228, 235, 244, 1) !important;
			}
			&:nth-child(2n + 2) {
				background: #f3f5f6;
			}
			&:hover {
				color: #0053db;
				cursor: pointer;
				white-space: nowrap;
			}
		}
		.company-name {
			width: 300px;
			height: 20px;
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 20px;
			margin-bottom: 8px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.username {
			height: 17px;
			font-size: 12px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.4);
			line-height: 17px;
		}
	}
	.logout {
		div {
			height: 48px;
			line-height: 48px;
			text-align: center;
			cursor: pointer;
			&:first-child {
				&:after {
					content: '';
					float: right;
					display: block;
					width: 1px;
					height: 12px;
					background: #e5e6eb;
					margin-top: 16px;
				}
			}
			img {
				width: 14px;
				height: 14px;
				margin-left: 10px;
			}
			&:hover {
				color: @primary-color;
			}
		}
	}
}

.msg-body {
	width: 380px;
	background: #ffffff;
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
		max-height: calc(100vh - 150px);
		overflow-y: auto;
		padding-bottom: 50px;
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
</style>
