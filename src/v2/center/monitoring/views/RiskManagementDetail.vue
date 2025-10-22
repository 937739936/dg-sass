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
		<!-- 陕煤风控在运营中分大屏展示 -->
		<template v-if="urlConfig[VUEX_ST_COMPANYSUER.companyUscc]">
			<iframe
				:src="urlConfig[VUEX_ST_COMPANYSUER.companyUscc]"
				frameborder="0"
				style="width: 100%; height: 100%"
			></iframe>
		</template>
	</div>
</template>
<script>
//原卓鼎风控大屏，不再使用
// https://datav.aliyuncs.com/share/7bd19b9b5e7ea1956917dcb67a2a6509
// https://datav.aliyuncs.com/share/07e8cd41af8a18adf3711b487b9e50fa
// https://datav.aliyuncs.com/share/21549a76d9b896e6d40eead1b59bda4a
const urlConfig = {
	'91410100MA45CKY3XX': '/bigview/zhuoding/fengkong.html', // 卓鼎
	'91410100MA9GXHFJ5E': '/bigview/tietou/fengkong.html?uscc=91410100MA9GXHFJ5E' // 铁投
};
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			urlConfig,
			isFullScreen: false,
			iconVisible: false,
			textVisible: false,
			timer: null,
			lastMove: null
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		if (document.getElementsByClassName('main-content-inner')[0]) {
			document.getElementsByClassName('main-content-inner')[0].style.height = '100%';
			document.getElementsByClassName('main-content-inner')[0].style.padding = '0';
		}
	},
	mounted() {
		this.lastMove = new Date().getTime();
		if (document.getElementsByClassName('main-content-inner')[0]) {
			document.getElementsByClassName('main-content-inner')[0].style.height = '100%';
			document.getElementsByClassName('main-content-inner')[0].style.padding = '0';
		}
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
<style scoped>
#box {
	position: relative;
}
.fullscreen-box {
	position: absolute;
	top: 10px;
	right: 20px;
	z-index: 10;
	overflow: hidden;
}
.fullscreen-btn {
	display: inline-block;
	float: right;
	width: 26px;
	height: 26px;
	background: url('~@/v2/assets/imgs/bigview/default_fullscreen.png') 100% / cover;
	cursor: pointer;
}
.fullscreen-btn.exit {
	background: url('~@/v2/assets/imgs/bigview/default_exit_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on {
	background: url('~@/v2/assets/imgs/bigview/checked_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on.exit {
	background: url('~@/v2/assets/imgs/bigview/checked_exit_fullscreen.png') 100% / cover;
}
.fullscreen-text {
	padding: 9px 12px;
	background: rgba(44, 245, 230, 0.18);
	border-radius: 2px;
	color: #38fdfb;
	display: inline-block;
	float: right;
}
/* iframe { pointer-events:none; } */
</style>
