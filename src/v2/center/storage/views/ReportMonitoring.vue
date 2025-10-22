<template>
	<div style="width: 100%; height: 100%">
		<a-card
			class="custom-card-title"
			title="仓储动态监控"
			:bordered="false"
		>
		</a-card>
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
						v-show="iconVisible"
					></i>
				</p>
			</div>
			<iframe
				:src="'/bigview/nongkai/monitoring.html'"
				frameborder="0"
				style="width: 100%; height: 100%"
			></iframe>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ReportDetail',

	components: {},

	data() {
		return {
			isFullScreen: false,
			iconVisible: false
		};
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
	computed: {},

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
<style lang="less" scoped>
.custom-card-title {
	/deep/.ant-card-head-title {
		font-size: 20px !important;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
	}
}
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
	background: url('../../../../assets/imgs/bigview/nk-default_fullscreen.png') 100% / cover;
	cursor: pointer;
}
.fullscreen-btn.exit {
	background: url('../../../../assets/imgs/bigview/nk-default_exit_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on {
	background: url('../../../../assets/imgs/bigview/nk-default_fullscreen.png') 100% / cover;
}
.fullscreen-btn.on.exit {
	background: url('../../../../assets/imgs/bigview/nk-default_exit_fullscreen.png') 100% / cover;
}
</style>
