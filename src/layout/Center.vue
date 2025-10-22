<template>
	<div>
		<div
			class="lay-container lay-wrapper-normal"
			v-if="isShowHeader"
		>
			<!-- 浏览器更新提示 -->
			<div
				class="browser-update-box"
				v-if="browserUpdateVisible"
			>
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col class="flex-box">
						<img
							src="@/v2/assets/imgs/common/alert_big_icon.png"
							alt=""
							style="width: 48px; height: 48px"
						/>
						<div class="flex-item">
							<p class="title">您当前浏览器版本过低</p>
							<p class="tips">我们希望您可以体验更顺畅、安全的互联网，推荐您使用谷歌浏览器以获得最佳的用户体验。</p>
						</div>
					</a-col>
					<a-col class="flex-box">
						<a-space :size="50">
							<div class="space-item">
								<img
									src="@/v2/assets/imgs/common/chorme_icon.png"
									alt=""
									style="width: 22px; height: 22px"
								/>
								<span @click="downChorme()">下载谷歌浏览器</span>
							</div>
							<img
								@click="closeBrowserUpdateBox()"
								src="@/v2/assets/imgs/common/close_modal_icon.png"
								style="width: 14px; height: 14px"
							/>
						</a-space>
					</a-col>
				</a-row>
			</div>
			<header-com
				v-on:changeTab="changeTab"
				v-if="headerMenu"
			></header-com>
			<div
				class="lay-wrapper"
				ref="layWrapper"
				:style="{ height: headerMenu ? 'calc(100vh - 64px)' : '100vh' }"
			>
				<div class="lay-content">
					<template v-if="sideMenu">
						<div class="side-menu">
							<center-menu ref="centerMenu"></center-menu>
							<div class="bottom-icon"></div>
						</div>
						<div
							class="main-content"
							id="mainContent"
						>
							<div class="main-content-inner">
								<div
									v-if="isShow"
									class="main-content-inner-content"
								>
									<transition
										name="router-fade"
										mode="out-in"
									>
										<div
											style="width: 100%; height: 100%"
											id="bodyScroll"
										>
											<keep-alive>
												<router-view v-if="$route.meta.keepAlive"> </router-view>
											</keep-alive>
											<router-view v-if="!$route.meta.keepAlive"> </router-view>
										</div>
									</transition>
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<div
							class="main-content-noside"
							id="mainContent"
						>
							<div
								class="main-content-inner"
								:style="{
									margin: headerMenu ? '' : '0',
									padding: headerMenu ? '' : '0'
								}"
							>
								<div
									v-if="isShow"
									class="main-content-inner-content"
								>
									<transition
										name="router-fade"
										mode="out-in"
									>
										<router-view />
									</transition>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
		<div
			class="lay-container lay-container-invoice"
			v-else
		>
			<div class="lay-wrapper">
				<div class="lay-content">
					<template>
						<div class="left-menu">
							<div class="logo-wrap">
								<span class="logo"></span>
							</div>
							<InvoiceMenu />
						</div>
						<div class="main-content">
							<div class="main-content-inner">
								<div class="main-content-inner-content">
									<transition
										name="router-fade"
										mode="out-in"
									>
										<div style="width: 100%; height: 100%">
											<Header />
											<Breadcrumb />
											<div class="content-wrap">
												<router-view></router-view>
											</div>
										</div>
									</transition>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import HeaderCom from 'components/common/HeaderCom';
import CenterMenu from 'components/center/CenterMenu';
import InvoiceMenu from '@/v2/components/invoiceMenu';
import Header from '@/v2/components/header.vue';
import Breadcrumb from '@/v2/components/Breadcrumb.vue';
import { mapMutations, mapGetters } from 'vuex';

export default {
	data() {
		return {
			isShow: true,
			noSideMenu: [
				'/center/message/index',
				'/center/message/facilityDetail',
				'/center/message/riskControlDetail',
				'/center/message/riskControlCertDetail',
				'/center/message/riskControlPriceDeclineDetail',
				'/center/message/inventoryDetail'
			], //列表中页面不展示左侧菜单栏
			browserUpdateVisible: false // 是否展示更新谷歌浏览器
		};
	},
	computed: {
		...mapGetters({
			VUEX_ST_USERAUTH: 'user/VUEX_ST_USERAUTH'
		}),
		...mapGetters('business', {
			VUEX_browserFalg: 'VUEX_browserFalg',
			VUEX_closeBrowserTime: 'VUEX_closeBrowserTime'
		}),
		headerMenu() {
			// 不需要显示左侧菜单的 在路由中加入meta menuVisibility: false
			const flag = this.$route?.meta?.headerVisibility;
			if (typeof flag === 'boolean') {
				return flag;
			}
			return true;
		},
		sideMenu() {
			// 不需要显示左侧菜单的 在路由中加入meta menuVisibility: false
			const flag = this.$route?.meta?.menuVisibility;
			if (typeof flag === 'boolean') {
				return flag;
			}
			return true;
		},
		isShowHeader() {
			// TODO:根据用户角色判断header是否显示
			if (!this.VUEX_ST_USERAUTH.includes('kitInvoice')) {
				return true;
			} else {
				if (window.location.pathname.indexOf('/center/admin/invoice') < 0) {
					return true;
				} else {
					return false;
				}
			}
		},
		isTop() {
			return this.$store.state.scroll.isTop;
		}
	},
	components: {
		HeaderCom,
		CenterMenu,
		InvoiceMenu,
		Header,
		Breadcrumb
	},
	created() {
		this.checkBrowser();
	},
	mounted() {
		this.$store.commit('scroll/setDistance', 0);
		const box = document.querySelector('#mainContent');
		box.addEventListener('scroll', e => {
			this.$store.commit('scroll/setTop', false);
			const scrollTop = e.target.scrollTop;
			this.$store.commit('scroll/setDistance', scrollTop);

			if (scrollTop >= 200) {
				this.$store.commit('scroll/setTopBtn', true);
			} else {
				this.$store.commit('scroll/setTopBtn', false);
			}
		});
	},
	watch: {
		browserUpdateVisible: function (data) {
			if (data) {
				this.$refs.layWrapper.style.height = 'calc(100% - 136px)';
			} else {
				this.$refs.layWrapper.style.height = 'calc(100% - 64px)';
			}
		},
		isTop(val) {
			if (val) {
				var box = document.querySelector('#mainContent');
				box && box.scrollTo(0, 0);
			}
		},
		sideMenu: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.handleMainContentScroll();
				});
			}
		}
	},
	methods: {
		...mapMutations({
			VUEX_setBrowserFalg: 'business/VUEX_setBrowserFalg',
			VUEX_setCloseBrowserTime: 'business/VUEX_setCloseBrowserTime'
		}),
		changeTab() {
			this.$refs.centerMenu?.resetCurrentPath();
		},
		IEVersion() {
			var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
			var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
			var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
			var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
			if (isIE) {
				var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
				reIE.test(userAgent);
				var fIEVersion = parseFloat(RegExp['$1']);
				if (fIEVersion == 7) {
					return 7;
				} else if (fIEVersion == 8) {
					return 8;
				} else if (fIEVersion == 9) {
					return 9;
				} else if (fIEVersion == 10) {
					return 10;
				} else {
					return 6; //IE版本<=7
				}
			} else if (isEdge) {
				return 'edge'; //edge
			} else if (isIE11) {
				return 11; //IE11
			} else {
				return -1; //不是ie浏览器
			}
		},
		// 关闭后 第二天或者重新登录时，重新进行提示
		checkBrowser() {
			// 检验浏览器版本
			var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
			if (this.IEVersion() != -1) {
				let myDate = new Date();
				myDate.setDate(myDate.getDate());
				myDate = myDate.toLocaleDateString();
				if (!this.VUEX_browserFalg) {
					this.VUEX_setBrowserFalg(myDate === this.VUEX_closeBrowserTime);
				}
				this.browserUpdateVisible = this.VUEX_browserFalg;
			}
		},
		closeBrowserUpdateBox() {
			// 关闭浏览器版本更新提示
			this.browserUpdateVisible = false;
			this.VUEX_setBrowserFalg(false);
			let myDate = new Date();
			myDate.setDate(myDate.getDate() + 1);
			myDate = myDate.toLocaleDateString();
			this.VUEX_setCloseBrowserTime(myDate);
		},
		downChorme() {
			// 下载谷歌
			var url = 'https://www.google.cn/intl/zh-CN/chrome/';
			window.open(url, '_blank');
		},
		handleMainContentScroll() {
			this.$store.commit('scroll/setDistance', 0);
			const box = document.querySelector('#mainContent');
			if (!box) {
				return;
			}
			box.addEventListener('scroll', e => {
				this.$store.commit('scroll/setTop', false);
				const scrollTop = e.target.scrollTop;
				this.$store.commit('scroll/setDistance', scrollTop);

				if (scrollTop >= 200) {
					this.$store.commit('scroll/setTopBtn', true);
				} else {
					this.$store.commit('scroll/setTopBtn', false);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.lay-wrapper-normal {
	.lay-wrapper {
		width: 100%;
		padding-top: 0;
	}
	.lay-content {
		margin: 0 auto;
		height: 100%;

		display: flex;
		position: relative;
		/*左侧菜单样式重写覆盖antd*/
		.side-menu {
			width: 208px;
			height: 100%;
			overflow-x: hidden;
			overflow-y: auto;
			background-size: 100% 390px;
			background-position: center bottom;
			background: #f3f5f6;
			background-repeat: no-repeat;

			.bottom-icon {
				position: absolute;
				bottom: -10px;
				width: 208px;
				height: 308px;
				pointer-events: none;
				background-size: 208px 208px;
				background-position: center bottom;
				background-repeat: no-repeat;
				z-index: 99;
			}
			& > div {
				margin: 10px 0;
			}

			::v-deep .ant-menu {
				background: transparent;
				color: #fff;
			}
			::v-deep .ant-menu-submenu-title {
				color: rgba(0, 0, 0, 0.8);
			}
			::v-deep .ant-menu-submenu-arrow {
				display: inline-block;
				width: 14px !important;
				height: 14px;
				background: url('~@/v2/assets/imgs/common/drop_down_icon.png');
				background-size: 14px 14px;
				background-repeat: no-repeat;
				background-position: center;
				position: absolute !important;
				top: 18px !important;
				right: 23px;
			}

			::v-deep .ant-menu-submenu-arrow::before {
				display: none;
			}
			::v-deep .ant-menu-submenu-arrow::after {
				display: none;
			}
			::v-deep .ant-menu-submenu-open.ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow {
				display: inline-block;
				width: 14px !important;
				height: 14px;
				background: url('~@/v2/assets/imgs/common/drop_down_icon.png');
				background-size: 14px 14px;
				background-repeat: no-repeat;
				background-position: center;
				top: 40%;
				transform: rotate(180deg);
			}
			::v-deep .ant-menu-item:hover {
				color: rgba(0, 0, 0, 0.4);
				background: #e4ebf4;
			}
			::v-deep .ant-menu-item {
				width: 208px;
				color: rgba(0, 0, 0, 0.4);
				height: 48px !important;
				line-height: 48px !important;
				padding-left: 46px !important;
			}
			::v-deep .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
				color: @primary-color;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position-x: -1px;
				font-weight: 500;
			}
			::v-deep .ant-menu-item,
			::v-deep .ant-menu-submenu-title {
				background: transparent;
				transition: none;
			}
			::v-deep .ant-menu-inline .ant-menu-item::after {
				display: none;
			}
		}

		.main-content {
			flex: 1;
			background-color: #f3f5f6;
			height: 100%;
			overflow-x: hidden;
			overflow-y: auto;
			min-width: 1232px;
		}
		.main-content-noside {
			flex: 1;
			background-color: #f3f5f6;
			height: 100%;
			overflow-x: hidden;
			overflow-y: auto;
		}
		.main-content-inner {
			min-height: calc(100vh - 84px);
			margin: 20px;
			padding: 20px 30px;
			margin-bottom: 0;
			padding-top: 10px;
			border-radius: 2px;
			background-color: #fff;
			position: relative;
			box-sizing: border-box;
		}
		.main-content-inner-content {
			width: 100%;
			height: 100%;
		}
	}

	.browser-update-box {
		width: 100%;
		height: 72px;
		background: #fff7ee;
		padding: 11px 30px;
		.flex-box {
			display: flex;
			.flex-item {
				margin-left: 30px;
				.title {
					font-size: 16px;
					font-family:
						PingFangSC-Medium,
						PingFang SC;
					font-weight: 500;
					color: rgba(0, 0, 0, 0.8);
					line-height: 22px;
					margin-bottom: 6px;
				}
				.tips {
					font-size: 14px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.4);
					line-height: 20px;
				}
			}
			.ant-space-item {
				cursor: pointer;
				.space-item {
					width: 156px;
					height: 32px;
					background: #4682f3;
					border-radius: 4px;
					border: 1px solid #4682f3;
					text-align: center;
					img {
						margin-right: 8px;
						position: relative;
						top: -2px;
					}
					span {
						display: inline-block;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: #ffffff;
						line-height: 32px;
					}
				}
			}
		}
	}
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/invoiveLayout.less');
</style>
