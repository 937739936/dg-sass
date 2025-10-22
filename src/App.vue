<template>
	<a-config-provider
		:locale="locale"
		:autoInsertSpaceInButton="false"
	>
		<div id="app">
			<!-- <div class="global-modal-wrap" v-if="VUEX_ST_LOADING">
        <img class="loading" src="~imgs/loading.gif" />
      </div> -->
			<transition
				name="router-fade"
				mode="out-in"
			>
				<router-view />
			</transition>
			<!-- 火运轨迹查询 -->
			<div
				class="searchDeliverTrain"
				:style="contactStyle"
			>
				<!-- <img
          @click="jumpUrl"
          src="./assets/imgs/travel/search_icon.png"
          alt=""
          style="width: 60px; height: 60px"
        /> -->
			</div>
			<!-- <Guide v-if="showGuide"/> -->
			<Online />
		</div>
	</a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import ENV from 'api/env.js';
import { getQueryVariable } from '@/untils/factory.js';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import storage from '@sub/utils/storage';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
// import Guide from "@/v2/center/trade/views/contract/guide/index.vue";
import Online from '@/v2/components/Online';

export default {
	data() {
		return {
			locale: zhCN,
			showGuide: false,
			contactStyle: {}
		};
	},
	components: {
		Online
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('config', {
			VUEX_ST_LOADING: 'VUEX_ST_LOADING'
		}),
		...mapGetters('order', {
			VUEX_ST_ORDERCREATESTEP2INFO: 'VUEX_ST_ORDERCREATESTEP2INFO'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		})
	},
	watch: {
		$route: {
			handler(value) {
				if (['/center/contract/buy/list', '/center/contract/sell/list'].includes(value.path)) {
					if (localStorage.getItem('contractListGuide') == '-1') {
						this.showGuide = false;
					} else {
						this.showGuide = true;
						localStorage.setItem('contractListGuide', 0);
					}
				}
				if (['/center/contract/buy/online/add/step2', '/center/contract/sell/online/add/step2'].includes(value.path)) {
					if (localStorage.getItem('contractCreateGuide') == '-1') {
						this.showGuide = false;
					} else {
						this.showGuide = true;
						localStorage.setItem('contractCreateGuide', 5);
					}
				}
				this.SET_VUEX_GE_CENTERMENUS(value);
				if (window.sessionStorage.getItem('VUEX_ST_TOKEN') && this.VUEX_ST_USERAUTH.includes('kitInvoice')) {
					window.changeToastClassIconNormal();
				}
				if (
					![
						'/center/contract/buy/online/add/step1',
						'/center/contract/buy/online/add/step2',
						'/center/contract/sell/online/add/step1',
						'/center/contract/sell/online/add/step2'
					].includes(value.path)
				) {
					this.VUEX_CLEAR_CONTRACT_DATA();
				}
			}
			// immediate: true
		},
		'VUEX_ST_PERSONALLINFO.curCompanyId': {
			immediate: true,
			handler: function (data) {
				if (data) {
					// 用户绑定企业展示轨迹查询入口，未绑定就不展示
					this.$nextTick(() => {
						document.getElementsByClassName('searchDeliverTrain')[0].style.display = 'block'; // 查询轨迹按钮不展示
					});
				}
			}
		},
		'VUEX_ST_PERSONALLINFO.id': {
			immediate: true,
			handler: function (data) {
				const that = this;
				if (!data) return;
				var ws_rest = new ReconnectingWebSocket(`${ENV.REST_SOCKET_URL}${data}`);
				ws_rest.reconnectDecay = 1;
				ws_rest.onopen = function (evt) {};
				ws_rest.onmessage = function (evt) {
					let resp = eval('(' + evt.data + ')');
					if (resp.type == '1') {
						//刷新登录信息
						that.VUEX_USER_LOGOUT();
					} else if (resp.type == '2') {
						//刷新字典
						that.VUEX_AT_GETALLCODE_V2();
					} else if (resp.type == '3') {
						that.$message.info(resp.msg).then(function () {
							window.sessionStorage.clear();
							window.localStorage.clear();
							window.location.href = '/login';
						});
					} else if (resp.type == 'noticeMessage') {
						that.VUEX_MU_UNREADLIST(new Date().getTime());
					}
				};
				var ws_admin = new ReconnectingWebSocket(`${ENV.ADMIN_SOCKET_URL}${data}`);
				ws_admin.reconnectDecay = 1;
				ws_admin.onopen = function (evt) {};
				ws_admin.onmessage = function (evt) {
					let resp = eval('(' + evt.data + ')');
					if (resp.type == '1') {
						//刷新登录信息
						that.VUEX_USER_LOGOUT();
					} else if (resp.type == '2') {
						//刷新字典
						that.VUEX_AT_GETALLCODE_V2();
					} else if (resp.type == '3') {
						that.$message.info(resp.msg).then(function () {
							window.sessionStorage.clear();
							window.localStorage.clear();
							window.location.href = '/login';
						});
					} else if (resp.type == 'noticeMessage') {
						that.VUEX_MU_UNREADLIST(new Date().getTime());
					}
				};
			}
		}
	},
	async created() {
		this.$eventBus.$on('hideGuide', flag => {
			if (flag == -1) {
				this.showGuide = false;
			}
		});
		if (storage.session.get('VUEX_ST_TOKEN') && !getQueryVariable('companyUserId')) {
			// 判断是否有token变化，如果有token变化，需要重新刷新，防止组件内部方法依旧使用的原先token请求导致的数据未更新
			await this.VUEX_USER_TOKEN();
			this.VUEX_AT_GETALLCODE_V2();
			await this.VUEX_USER_PERSONAL_DETAILS();
			await this.VUEX_PERMISSION_LIST();
		}
		let href = window.location.href;
		if (href.indexOf('bigViewLogisticsDetailTrain') != -1 || href.indexOf('bigViewLogisticsDetailShip') != -1) {
			this.$nextTick(() => {
				document.getElementsByClassName('searchDeliverTrain')[0].style.display = 'none'; // 查询轨迹按钮不展示
			});
		}
		if (getQueryVariable('companyUserId') && window.location.pathname != '/oAOrderAuditType1') {
			this.VUEX_AT_GETALLCODE_V2();
		}
		this.VUEX_initSotre();
		this.getvisitorId();
	},
	mounted() {},

	methods: {
		...mapActions({
			VUEX_AT_GETALLCODE_V2: 'config/VUEX_AT_GETALLCODE',
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT',
			VUEX_PERMISSION_LIST: 'user/VUEX_PERMISSION_LIST',
			VUEX_USER_PERSONAL_DETAILS: 'user/VUEX_USER_PERSONAL_DETAILS',
			VUEX_USER_TOKEN: 'user/VUEX_USER_TOKEN'
		}),
		...mapMutations({
			VUEX_initSotre: 'pagination/VUEX_initSotre',
			SET_VUEX_GE_CENTERMENUS: 'user/SET_VUEX_GE_CENTERMENUS',
			VUEX_MU_UNREADLIST: 'user/VUEX_MU_UNREADLIST',
			VUEX_MU_ORDERCREATESTEP2INFO_CLEAR: 'order/VUEX_MU_ORDERCREATESTEP2INFO_CLEAR',
			VUEX_CLEAR_CONTRACT_DATA: 'contract/VUEX_CLEAR_CONTRACT_DATA'
		}),
		async getvisitorId() {
			const fp = await FingerprintJS.load();
			const result = await fp.get();
			storage.session.set('loginUniqueId', result.visitorId);
		}
	}
};
</script>
<style>
html,
body,
#app,
.lay-container {
	width: 100%;
	position: absolute;
	background: #fff !important;
	bottom: 0px;
	top: 0;
}

@media (max-width: 1980px) {
	#app {
		overflow-x: auto;
	}
	.mobile-min-width-unset #app {
		overflow-x: hidden;
	}
}

.lay-container {
	min-width: 1440px;
}
.lay-container:has(.help-content-index-wrap) {
	min-width: 100vw;
}
.mobile-min-width-unset {
	/* min-width: unset !important; */
}

/*外链的字体*/
html,
body,
div,
p,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6 {
	font-family:
		'PingFangSC-Regular',
		'PingFang SC,' tahoma,
		arial,
		'Hiragino Sans GB',
		'Hiragino Sans GB W3',
		'Microsoft Yahei',
		'PingFangSC' \5b8b\4f53;
}
#app {
	/* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.loading {
	position: fixed;
	z-index: 9999;
	width: 80px;
	height: 80px;
	left: 50%;
	top: 50%;
	margin-left: -40px;
	margin-top: -40px;
}
::-webkit-scrollbar {
	background: 0 0;
	width: 6px;
	height: 6px;
}
::-webkit-scrollbar-thumb {
	background: #d7d7d7;
	border-radius: 6px;
	width: 6px;
	height: 6px;
}
.searchDeliverTrain {
	position: fixed;
	right: 12px;
	bottom: 62px;
	z-index: 1000;
}
.global-modal-wrap {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 9999;
}
</style>
