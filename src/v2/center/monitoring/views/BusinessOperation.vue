<template>
	<div
		style="width: 100%; height: 100%"
		id="box"
		@mouseover="mouseoverFunc"
		@mouseleave="mouseleaveFunc"
		@mousemove="mousemoveFunc"
	>
		<div class="fullscreen-box">
			<p>
				<i
					class="fullscreen-btn"
					@click="clickFullscreen"
					@mouseover="textShow"
					@mouseleave="textHide"
					v-show="iconVisible"
				></i>
			</p>
			<span
				class="fullscreen-text"
				v-show="textVisible && !isFullScreen"
				>全屏</span
			>
			<span
				class="fullscreen-text"
				v-show="textVisible && isFullScreen"
				>退出全屏</span
			>
		</div>
		<!-- 陕煤供应链、晋瑞 -->
		<template v-if="largerList.length">
			<div style="width: 100%; height: 100%">
				<a-carousel
					autoplay
					:pauseOnHover="false"
					ref="carousel"
					:autoplaySpeed="autoplaySpeed"
					:beforeChange="beforeChange"
				>
					<div
						v-for="(item, index) in largerList"
						:key="item"
					>
						<iframe
							v-if="loadList.includes(index)"
							:id="'iframe' + index"
							style="width: 100%; height: 100%"
							:src="item + '?uscc=' + VUEX_ST_COMPANYSUER.companyUscc"
							frameborder="0"
						></iframe>
					</div>
				</a-carousel>
				<div
					class="custom-slick-arrow"
					:style="`transform:scale(${percentW},${percentH});left: calc(50% - ${94 * percentW}px);bottom:${45 * percentH}px`"
					@click="$refs.carousel.prev()"
				>
					<a-icon type="left" />
				</div>
				<div
					class="custom-slick-arrow"
					:style="`transform:scale(${percentW},${percentH});right: calc(50% - ${94 * percentW}px);bottom:${45 * percentH}px`"
					@click="$refs.carousel.next()"
				>
					<a-icon type="right" />
				</div>
				<div
					v-show="iconVisible"
					:style="`transform:scale(${percentW},${percentH});right: calc(50% - ${130 * percentW}px);bottom:${43 * percentH}px`"
					class="suspend"
					@click="isAutoplayChange"
				>
					<a-icon :type="autoplaySpeed == 30000 ? 'pause' : 'caret-right'" />
				</div>
			</div>
		</template>
		<!-- 单个大屏企业 -->
		<template v-else-if="oneLargerList[VUEX_ST_COMPANYSUER.companyUscc]">
			<iframe
				style="width: 100%; height: 100%"
				:src="oneLargerList[VUEX_ST_COMPANYSUER.companyUscc] + '?uscc=' + VUEX_ST_COMPANYSUER.companyUscc"
				frameborder="0"
			></iframe>
		</template>
	</div>
</template>
<script>
// 卓鼎运营datav大屏
// https://datav.aliyuncs.com/share/bcb086fb0e6736618ee39d778948b4c5
// https://datav.aliyuncs.com/share/20d61856c8d84a2e6ffcc8193d91ff28
// https://datav.aliyuncs.com/share/755ad3bd7e339e7da83fbdbd4edcb3e9
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			isFullScreen: false,
			iconVisible: false,
			textVisible: false,
			timer: null,
			lastMove: null,
			autoplaySpeed: 30000, //定时时间
			percentW: document.documentElement.clientWidth / 1920,
			percentH: document.documentElement.clientHeight / 1080,
			smLargerList: [
				'/bigview/shanmei/yy.html',
				'/bigview/shanmei/yewu.html',
				'/bigview/shanmei/zijin.html',
				'/bigview/shanmei/wuliu.html',
				'/bigview/shanmei/fk.html',
				'/bigview/shanmei/transport.html'
			], //陕煤
			jrLargerList: [
				'/bigview/jinrui/yy.html',
				'/bigview/jinrui/yewu.html',
				'/bigview/jinrui/zijin.html',
				'/bigview/jinrui/wuliu.html',
				'/bigview/jinrui/fk.html'
			], //晋瑞
			roLargerList: [
				'/bigview/rongou/yy.html',
				'/bigview/rongou/yewu.html',
				'/bigview/rongou/zijin.html',
				'/bigview/rongou/wuliu.html',
				'/bigview/rongou/fk.html'
			], //蓉欧
			trLargerList: [
				'/bigview/tierui/yy.html',
				'/bigview/tierui/yewu.html',
				'/bigview/tierui/zijin.html',
				'/bigview/tierui/wuliu.html',
				'/bigview/tierui/fk.html'
			], //铁瑞
			loadList: [], //已经加载的大屏
			// 单个大屏企业
			oneLargerList: {
				'91410100MA9GXHFJ5E': '/bigview/tietou/yunying.html', //铁投
				'91370600MA3TP03G5F': '/bigview/fengrui/yunying.html', //山东丰瑞实业有限公司
				'914101000689293263': '/bigview/zhongping/yunying.html', //中平
				'91410100MA45CKY3XX': '/bigview/zhuoding/yunying.html' //卓鼎
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		largerList() {
			let largerList = [];
			//陕煤晋瑞存在多个大屏
			switch (this.VUEX_ST_COMPANYSUER.companyUscc) {
				case '91610138MA6X3K6K0G':
					//陕煤
					largerList = this.smLargerList;
					break;
				case '91371100056216898D':
					//晋瑞
					largerList = this.jrLargerList;
					break;
				case '91510100MA69N5DE2T':
					//蓉欧
					largerList = this.roLargerList;
					break;
				case '91410100MA9KA84X3Q':
					//河南铁瑞实业有限公司（简称“铁瑞”）
					largerList = this.trLargerList;
					break;
			}
			return largerList;
		}
	},
	created() {
		if (document.getElementsByClassName('main-content-inner')[0]) {
			document.getElementsByClassName('main-content-inner')[0].style.height = '100%';
			document.getElementsByClassName('main-content-inner')[0].style.padding = '0';
		}
		//判断时间自动加载下一大屏
		this.nextLarger();
	},
	mounted() {
		this.lastMove = new Date().getTime();
		if (document.getElementsByClassName('main-content-inner')[0]) {
			document.getElementsByClassName('main-content-inner')[0].style.height = '100%';
			document.getElementsByClassName('main-content-inner')[0].style.padding = '0';
		}
		window.screenWidth = document.body.clientWidth;
		this.percentW = document.documentElement.clientWidth / 1920;
		this.percentH = document.documentElement.clientHeight / 1080;
		this.$nextTick(() => {
			if (document.getElementsByClassName('slick-dots-bottom')[0]) {
				document.getElementsByClassName('slick-dots-bottom')[0].style.transform =
					'scale(' + this.percentW + ',' + this.percentH + ')';
				document.getElementsByClassName('slick-dots-bottom')[0].style.bottom = `${45 * this.percentH}px`;
			}
		});
		window.onresize = () => {
			return (() => {
				window.screenWidth = document.body.clientWidth;
				this.percentW = document.documentElement.clientWidth / 1920;
				this.percentH = document.documentElement.clientHeight / 1080;
				this.$nextTick(() => {
					if (document.getElementsByClassName('slick-dots-bottom')[0]) {
						document.getElementsByClassName('slick-dots-bottom')[0].style.transform =
							'scale(' + this.percentW + ',' + this.percentH + ')';
						document.getElementsByClassName('slick-dots-bottom')[0].style.bottom = `${45 * this.percentH}px`;
					}
				});
			})();
		};
	},
	destroyed() {
		if (document.getElementsByClassName('main-content-inner')[0]) {
			document.getElementsByClassName('main-content-inner')[0].style.height = 'auto';
			document.getElementsByClassName('main-content-inner')[0].style.padding = '10px 20px 20px 20px';
		}
	},
	watch: {
		iconVisible: function (data) {
			this.iconVisible = data;
		},
		textVisible: function (data) {
			this.textVisible = data;
		}
	},
	methods: {
		clickFullscreen() {
			// 全屏显示和退出
			let element = document.getElementById('box');
			if (this.isFullScreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullScreen) {
					element.webkitRequestFullScreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					// IE11
					element.msRequestFullscreen();
				}
			}
			this.isFullScreen = !this.isFullScreen;
			let oBtn = document.getElementsByClassName('fullscreen-btn')[0];
			if (this.isFullScreen) {
				oBtn.classList.add('exit');
				oBtn.classList.remove('on');
			} else {
				oBtn.classList.remove('exit');
				oBtn.classList.remove('on');
			}
		},
		textShow() {
			// 文字展示
			this.textVisible = true;
			let oBtn = document.getElementsByClassName('fullscreen-btn')[0];
			oBtn.classList.add('on');
		},
		textHide() {
			// 文字隐藏
			this.textVisible = false;
			let oBtn = document.getElementsByClassName('fullscreen-btn')[0];
			oBtn.classList.remove('on');
		},
		//自动轮播控制
		isAutoplayChange() {
			//延长轮播时间，产生暂停效果
			let autoplaySpeed = this.autoplaySpeed == 30000 ? 1000 * 60 * 60 * 24 : 30000;
			this.autoplaySpeed = autoplaySpeed;
		},
		//切换大屏前判断是否需要重新加载
		beforeChange(from, to) {
			if (!this.loadList.includes(to)) {
				this.loadList.push(to);
			}
		},
		//加载下一个大屏
		nextLarger() {
			let i = 0;
			//判断是否全部加载完毕
			if (this.loadList.length < this.largerList.length) {
				for (i; i < this.largerList.length; i++) {
					if (!this.loadList.includes(i)) {
						this.loadList.push(i);
						break;
					}
				}
				this.$nextTick(() => {
					this.nextIframe(i);
				});
				setTimeout(this.nextLarger, 5000);
			}
		},
		//判断大屏加载完成
		nextIframe(i) {
			let iframe = document.getElementById('iframe' + i);
			if (!iframe) {
				return;
			}
			let that = this;
			if (iframe.attachEvent) {
				iframe.attachEvent('onload', function () {
					that.nextLarger();
				});
			} else {
				iframe.onload = function () {
					that.nextLarger();
				};
			}
		},
		mousemoveFunc() {
			this.lastMove = new Date().getTime();
			this.iconVisible = true;
		},
		mouseoverFunc() {
			if (!this.isFullScreen) {
				this.iconVisible = true;
			}
		},
		mouseleaveFunc() {
			if (!this.isFullScreen) {
				this.iconVisible = false;
			}
		}
	}
};
</script>
<style scoped lang="less">
#box {
	position: relative;
}
.fullscreen-box {
	position: absolute;
	top: 10px;
	right: 20px;
	z-index: 10;
	overflow: hidden;
	p {
		overflow: hidden;
	}
}

.fullscreen-btn {
	display: inline-block;
	float: right;
	width: 26px;
	height: 26px;
	background: url('../../../assets/imgs/bigview/default_fullscreen.png') 100% / cover;
	cursor: pointer;
}
.fullscreen-btn.exit {
	background: url('../../../assets/imgs/bigview/default_exit_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on {
	background: url('../../../assets/imgs/bigview/checked_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on.exit {
	background: url('../../../assets/imgs/bigview/checked_exit_fullscreen.png') 100% / cover;
}
.fullscreen-text {
	padding: 9px 12px;
	background: rgba(44, 245, 230, 0.18);
	border-radius: 2px;
	color: #38fdfb;
	display: inline-block;
	float: right;
}
#box {
	::v-deep.ant-carousel {
		height: 100%;
		width: 100%;
		.slick-slider {
			height: 100%;
			width: 100%;
		}
		.slick-list {
			height: 100% !important;
			width: 100%;
		}
		.slick-track {
			color: #fff;
			width: 100%;
			height: 100%;
		}
		.slick-slide {
			color: #fff;
			width: 100%;
			height: 100%;
			div {
				width: 100%;
				height: 100%;
			}
		}
		.slick-dots li button {
			width: 10px !important ;
			height: 10px !important;
			background: #7ffffe !important;
			border-radius: 100% !important;
			margin: 0;
		}
		.slick-dots li {
			width: 10px !important ;
			text-align: center;
			margin: 0 5px;
		}
		.slick-dots-bottom {
			bottom: 50px;
			height: 24px;
			background: rgba(96, 255, 254, 0.35);
			border-radius: 21px;
			width: max-content;
			left: 0;
			right: 0;
			margin: auto;
			padding: 7px 10px;
		}
	}
	.custom-slick-arrow {
		position: absolute;
		font-size: 16px;
		line-height: 24px;
		height: 24px;
		color: #7ffffe;
		cursor: pointer;
	}
	.suspend {
		position: absolute;
		bottom: 0;
		width: 28px;
		height: 28px;
		background: rgba(127, 255, 254, 0.33);
		border-radius: 50%;
		text-align: center;
		line-height: 28px;
		font-size: 16px;
		color: #7ffffe;
		cursor: pointer;
	}
}
</style>
