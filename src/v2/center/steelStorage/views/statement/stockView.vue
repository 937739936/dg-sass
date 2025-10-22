<template>
	<div
		style="width: 100%; height: 100%"
		id="box"
		@mouseover="mouseoverFunc"
		@mouseleave="mouseleaveFunc"
		@mousemove="mousemoveFunc"
	>
		<div class="fullscreen-box">
			<!-- v-show="iconVisible" -->
			<p>
				<!-- <i class="fullscreen-btn" @click="clickFullscreen" @mouseover="textShow" @mouseleave="textHide" v-show="iconVisible"></i> -->
				<i
					class="fullscreen-btn"
					@click="refresh"
				></i>
				<i
					class="fullscreen-btn fullscreen-btn2"
					style="margin-left: 16px"
					@click="clickFullscreen"
				></i>
			</p>
			<!-- <span class="fullscreen-text" v-show="textVisible && !isFullScreen">全屏</span>
			<span class="fullscreen-text" v-show="textVisible && isFullScreen">退出全屏</span> -->
		</div>
		<template>
			<iframe
				id="iframeId"
				:src="'/bigview/kucun/fk.html?uscc=' + VUEX_ST_COMPANYSUER.companyUscc"
				frameborder="0"
				style="width: 100%; height: 100%"
			></iframe>
		</template>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			url: 'https://datav.aliyuncs.com/share/7bd19b9b5e7ea1956917dcb67a2a6509',
			isFullScreen: false,
			iconVisible: true,
			textVisible: true,
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
			// const iframeInfo = document.getElementById('iframeId').contentWindow;
			// iframeInfo.postMessage('open', '*')
			// this.refresh()
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
			// this.refresh()
			if (this.isFullScreen) {
				oBtn.classList.add('exit');
				oBtn.classList.remove('on');
				// // 全屏模式下 鼠标5秒不移动就隐藏按钮
				// let that = this
				// that.timer = window.setInterval(function() {
				// 	var now = new Date().getTime();
				// 	if(now - that.lastMove > 5000) {
				// 		that.textVisible = false
				// 		that.iconVisible = false
				// 	}
				// },1000)
			} else {
				// clearInterval(this.timer)
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
		},
		refresh() {
			document.getElementById('iframeId').contentWindow.location.reload(true);
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
	top: 20px;
	left: 20px;
	z-index: 10;
	overflow: hidden;
	p {
		overflow: hidden;
	}
}
.fullscreen-btn {
	display: inline-block;
	width: 32px;
	height: 32px;
	background: url('~@/assets/imgs/bigview/resh.png') 100% / cover;
	cursor: pointer;
	/* background: #2D3348; */
	border-radius: 8px;
}
.fullscreen-btn2 {
	display: inline-block;
	width: 32px;
	height: 32px;
	background: url('~@/assets/imgs/bigview/kucun-full.png') 100% / cover;
	cursor: pointer;
	/* background: #2D3348; */
	border-radius: 8px;
}
/* .fullscreen-btn.exit {
		background: url('~@/assets/imgs/bigview/default_exit_fullscreen.png') 100%/cover;
	}
	.fullscreen-btn.on {
		background: url('~@/assets/imgs/bigview/checked_fullscreen.png') 100%/cover;
	}
	.fullscreen-btn.on.exit {
		background: url('~@/assets/imgs/bigview/checked_exit_fullscreen.png') 100%/cover;
	} */
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
