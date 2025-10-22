<template>
	<div>
		<div
			class="top"
			@click="goUp"
			v-if="isShowTopBtn"
		>
			<a-icon type="up" />
		</div>
		<div
			class="toast-icon"
			v-show="!isPickUp"
		>
			<div
				class="service-icon"
				style="width: 34px; height: 34px; position: relative"
			>
				<a href="javascript:window.serviceToastShow()"><div id="service-icon"></div></a>
				<!-- 	<div
					class="service-icon-wrap service-icon-hide"
					id="service-icon-wrap"
				>
					 <div class="filter-bg"></div>
					<ul>
						<li>
              <span class="wechat"></span>
              <a href="javascript:window.serviceToastShow()">微信咨询</a>
            </li>
						<li>
							<span class="phone"></span>
							<a href="javascript:window.serviceToastShow()">电话咨询</a>
						</li>
						<li>
							<span class="online"></span>
							<a href="javascript:window.openJesongChatByGroup(27366, 63357)">在线咨询</a>
						</li>
					</ul>
				</div> -->
			</div>
			<div class="line"></div>
			<div
				class="tools-icon"
				id="tools-icon-content"
				@mouseenter="getTools"
				style="width: 34px; height: 34px; position: relative"
			>
				<div id="tools-icon"></div>
				<div
					class="tools-icon-wrap tools-icon-hide"
					id="tools-icon-wrap"
				>
					<div
						class="filter-bg"
						v-if="!isMobile"
					></div>
					<ul
						:class="[isMobile ? 'shadow' : '']"
						style="min-height: 76px"
					>
						<li class="invoice-tools margin-bottom-10px">
							<span class="invoice"></span>
							<a href="javascript:window.jumpInvoiceTools()">发票管家</a>
						</li>
						<li
							v-if="isShowToolFlag"
							class="margin-bottom-10px"
						>
							<!-- <span class="invoice2"></span> -->
							<img
								src="@/assets/imgs/toastIcon/invoice2.png"
								class="invoice2"
								alt=""
							/>
							<a
								href="javascript:;"
								@click="goInvoiceDiscern"
								>发票识别</a
							>
						</li>
						<li class="margin-bottom-10px">
							<span class="train"></span>
							<a
								href="javascript:;"
								@click="jumpUrl('TRAIN')"
								>火车查询</a
							>
						</li>
						<li>
							<span class="ship"></span>
							<a
								href="javascript:;"
								@click="jumpUrl('SHIP')"
								>船舶查询</a
							>
						</li>
					</ul>
				</div>
			</div>
			<div
				class="up"
				@click="isPickUp = true"
			>
				<a-icon
					type="caret-up"
					theme="filled"
				/>
			</div>
		</div>
		<div
			class="pick-up"
			v-if="isPickUp"
			@click="isPickUp = false"
		>
			<div style="margin-bottom: 5px">...</div>
		</div>
		<div
			class="card-contact-wrap card-contact-wrap-hide"
			id="card-contact-wrap"
		>
			<div class="card-contact">
				<a href="javascript:window.serviceToastHide()">
					<span class="close-icon"><a-icon type="close-circle" /></span>
				</a>
				<div class="text">
					<p class="title">扫码加小牛微信</p>
					<p class="sub">进行业务咨询</p>
				</div>
				<div class="qr"></div>
				<p class="tc des">扫码添加</p>
				<p class="tc phone"><span></span>联系电话：0371-55593676</p>
			</div>
		</div>
	</div>
</template>
<script>
import { delay } from 'lodash';
import { mapGetters } from 'vuex';
import { isShowTool } from '@/v2/center/invoiceDiscern/api';

export default {
	name: 'contactUs.vue',
	data() {
		return {
			visible: false,
			isMobile: navigator.userAgent.includes('Mobile'),
			isPickUp: false,
			isDown: true,
			isShowToolFlag: false
		};
	},
	computed: {
		...mapGetters({
			VUEX_ST_USERAUTH: 'user/VUEX_ST_USERAUTH'
		}),
		invoiceItemShow() {
			if (!window.sessionStorage.getItem('VUEX_ST_TOKEN')) {
				return true;
			} else {
				return this.VUEX_ST_USERAUTH.includes('kitInvoice');
			}
		},
		isShowTopBtn() {
			return this.$store.state.scroll.isShowTopBtn;
		}
	},
	mounted() {
		// this.getTools()
	},
	methods: {
		cancel() {
			delay(() => {
				document.body.classList.remove('body-overflow-auto');
			}, 300);
		},
		bodyStyle() {
			return {
				padding: 0
			};
		},
		async getTools() {
			const token = window.sessionStorage.getItem('VUEX_ST_TOKEN');
			if (token) {
				const res = await isShowTool();
				this.isShowToolFlag = res.data;
			}
		},
		popContactUs() {
			document.body.classList.add('body-overflow-auto');
			this.visible = true;
		},
		jumpUrl(type) {
			// 发运查询
			let url = '/travel/travelSearch?type=' + type;
			window.open(url, '_blank');
		},
		goUp() {
			this.$store.commit('scroll/setTop', true);
		},
		goInvoiceDiscern() {
			let url = '/invoice/discern/list';
			window.open(url, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
#jesong_panel {
	display: none;
}
.card-contact-wrap {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.45);
	z-index: 999;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.card-contact-wrap-hide {
	display: none;
}
.card-contact-wrap-show {
	display: flex;
}
.card-contact {
	width: 312px;
	height: 418px;
	background-image: url('~assets/imgs/contactUs/bg.png');
	background-size: cover;
	position: relative;
	.text {
		padding-top: 50px;
		padding-left: 90px;
	}
	.title {
		font-size: bold;
		margin-top: 5px;
		margin-bottom: 3px;
	}
	.close-icon {
		color: rgba(0, 0, 0, 0.45);
		position: absolute;
		right: 15px;
		top: 10px;
		cursor: pointer;
		z-index: 101;
	}
	.close-icon:hover {
		color: #fff;
	}
	.qr {
		width: 168px;
		height: 168px;
		margin: 0 auto;
		margin-top: 27px;
		background-image: url('~assets/imgs/contactUs/qr.jpg');
		background-size: cover;
	}
	.des {
		margin-top: 8px;
		color: #c0c0c0;
	}
	.phone {
		margin-top: 50px;
		span {
			width: 16px;
			height: 16px;
			display: inline-block;
			background-image: url('~assets/imgs/contactUs/phoneColor.png');
			background-size: cover;
			position: relative;
			top: 2px;
			right: 2px;
		}
	}
}
.toast-icon {
	width: 50px;
	height: 130px;
	background: #ffffff;
	border-radius: 25px;
	padding: 15px 0px;
	padding-bottom: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
	.line {
		width: 40px;
		height: 1px;
		border: 1px solid #eaeff7;
	}
	.service-icon,
	#service-icon,
	.tools-icon,
	#tools-icon {
		width: 34px;
		height: 34px;
		background-size: 34px 34px;
		background-position: center;
		background-repeat: no-repeat;
		cursor: pointer;
		position: relative;
		.invoice-tools {
			display: none;
		}
		ul {
			width: 131px;
			background: #fff;
			border-radius: 4px;
			position: relative;
			z-index: 99;
			a {
				display: inline-block;
				color: #000;
				line-height: 20px;
				font-size: 14px;
			}
			a:hover {
				color: #4682f3;
			}
		}
	}
	.service-icon-wrap {
		width: 150px;
		height: 76px;
		position: relative;
		top: -45px;
		left: -150px;
		z-index: -1;
		// ul{
		//   background-image:
		// }
	}
	.service-icon {
		ul::before {
			content: '';
			display: inline-block;
			width: 7px;
			height: 20px;
			background-image: url('~assets/imgs/toastIcon/right-triangle.png');
			background-size: 7px 20px;
			position: absolute;
			right: -6px;
			top: 45px;
			z-index: -1;
		}
		.filter-bg {
			width: 131px;
			height: 114px;
			background: #d5deed;
			filter: blur(10px);
			position: absolute;
			top: -0;
			left: 0;
			z-index: -2;
		}

		background-image: url('~assets/imgs/toastIcon/service.png');
		position: relative;
		ul {
			height: 76px;
			position: absolute;
			left: 0;
			top: 0;
			padding: 13px 24px 13px 19px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			li {
				width: 100%;
				height: 20px;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
			.wechat,
			.phone,
			.online {
				width: 20px;
				height: 20px;
				background-size: 20px 20px;
				background-position: center;
				background-repeat: no-repeat;
			}
			.wechat {
				background-image: url('~assets/imgs/toastIcon/wechat.png');
			}
			.phone {
				background-image: url('~assets/imgs/toastIcon/phone.png');
			}
			.online {
				background-image: url('~assets/imgs/toastIcon/online.png');
			}
		}
	}
	.tools-icon-wrap {
		width: 150px;
		height: 100px;
		position: relative;
		top: -50px;
		left: -150px;
		z-index: -1;
	}
	#tools-icon {
		animation: fadezoom 8s infinite;
		background-image: url('~assets/imgs/toastIcon/tools.png');
		position: relative;
	}
	.tools-icon {
		ul {
			// height: 120px;
			position: absolute;
			left: 0;
			top: -40px;
			padding: 13px 24px 13px 19px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			li {
				width: 100%;
				height: 20px;
				// padding: 5px 0;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
			.invoice,
			.train,
			.ship,
			.invoice2 {
				width: 20px;
				height: 20px;
				background-size: 20px 20px;
				background-position: center;
				background-repeat: no-repeat;
			}

			.invoice {
				background-image: url('~assets/imgs/toastIcon/invoice.png');
			}
			.train {
				background-image: url('~assets/imgs/toastIcon/train.png');
			}
			.ship {
				background-image: url('~assets/imgs/toastIcon/ship.png');
			}
		}
		ul::before {
			content: '';
			display: inline-block;
			width: 7px;
			height: 20px;
			background-image: url('~assets/imgs/toastIcon/right-triangle.png');
			background-size: 7px 20px;
			position: absolute;
			right: -6px;
			top: 30px;
			z-index: -1;
		}

		.filter-bg {
			width: 131px;
			height: 100px;
			// background: #D5DEED;
			filter: blur(10px);
			position: absolute;
			top: -20px;
			left: 0;
			z-index: -2;
			display: none;
		}
	}
	.tools-icon-single {
		.tools-icon-wrap {
			width: 150px;
			height: 100px;
			position: relative;
			top: -40px;
			left: -150px;
			z-index: -1;
		}
		ul {
			width: 131px;
			// height: 70px;
			position: absolute;
			left: 0;
			top: 0;
			padding: 13px 24px 13px 19px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			border-radius: 4px;
			&.shadow {
				box-shadow: -3px 0px 10px 3px rgba(0, 0, 0, 0.1);
			}
			li {
				width: 100%;
				height: 20px;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				a {
					color: #000;
				}
				a:hover {
					color: #4682f3;
				}
			}
			.invoice,
			.train,
			.ship {
				width: 20px;
				height: 20px;
				background-size: 20px 20px;
				background-position: center;
				background-repeat: no-repeat;
			}
			.invoice {
				background-image: url('~assets/imgs/toastIcon/invoice.png');
			}
			.train {
				background-image: url('~assets/imgs/toastIcon/train.png');
			}
			.ship {
				background-image: url('~assets/imgs/toastIcon/ship.png');
			}
		}
		ul::before {
			content: '';
			display: inline-block;
			width: 7px;
			height: 20px;
			background-image: url('~assets/imgs/toastIcon/right-triangle.png');
			background-size: 7px 20px;
			position: absolute;
			right: -6px;
			top: 10px;
			z-index: -1;
		}

		.filter-bg {
			width: 131px;
			height: 100px;
			// background: #D5DEED;
			filter: blur(10px);
			position: absolute;
			top: -0;
			left: 0;
			z-index: -2;
		}
	}
	#tools-icon:hover,
	#tools-icon-wrap:hover {
		animation: fadenormal 0s infinite;
	}
	.service-icon-show,
	.tools-icon-show {
		display: inline-block;
	}
	.service-icon-hide,
	.tools-icon-hide {
		display: none;
	}
	@keyframes fadezoom {
		50% {
			transform: rotate(0deg);
		}
		60% {
			transform: rotate(360deg);
		}
		70% {
			transform: scale(1.2);
		}
		80% {
			transform: scale(1);
		}
	}
	@keyframes fadenormal {
		100% {
			transform: rotate(0deg) scale(1);
		}
	}
}
.pick-up {
	width: 50px;
	height: 50px;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	cursor: pointer;
}
.up {
	width: 50px;
	text-align: center;
}
.anticon-caret-up {
	color: rgba(0, 0, 0, 0.45);
	cursor: pointer;
}
.top {
	width: 50px;
	height: 50px;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	margin-bottom: 10px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.anticon-up,
.anticon-down {
	font-size: 15px;
	color: rgba(0, 0, 0, 0.4);
	cursor: pointer;
}
.invoice2 {
	width: 15px !important;
	height: 15px !important;
	// background-size: 15px;
	margin-left: 3px;
	margin-top: 2px;
}
.margin-bottom-10px {
	margin-bottom: 10px;
}
</style>
