<template>
	<div
		v-show="cameraIndexCode"
		:class="['video-hover-play', cameraIndexCode ? 'show' : '']"
	>
		<VideoHls
			v-if="cameraPreviewURLs"
			:customFullscreenEnter="true"
			ref="videoHls"
			type="application/x-mpegURL"
			@change="videoStatusChange"
			@changeFullScreen="toggle"
			:src="cameraPreviewURLs"
			:key="cameraIndexCode"
			:poster="poster"
		></VideoHls>
	</div>
</template>
<script>
import VideoHls from '@/v2/components/videoHls/VideoHls.vue';
import { API_GrainGrainCameraPreviewURLs } from 'api';
// 鼠标停留时间 单位s
const retentionPeriod = 1;

export default {
	components: {
		VideoHls
	},
	data() {
		return {
			parent: null,
			playType: 'live',
			videoLoaded: false,
			cameraIndexCode: '',
			cameraPreviewURLs: '',
			poster: '',
			timer: null,
			currentTime: 0
		};
	},
	mounted() {},
	methods: {
		videoStatusChange({ status }) {
			if (status === 'init') {
				this.videoLoaded = true;
			} else if (status === 'stop') {
				this.videoLoaded = false;
			}
		},
		toggle() {},
		setPoster(url) {
			if (!url) {
				return;
			}
			this.poster = url;
		},
		getElement() {
			return document.querySelector('.video-hover-play');
		},
		blur() {
			if (this.parent) {
				this.parent.style = 'display:none;';
			}
			this.cameraIndexCode = '';
			this.cameraPreviewURLs = '';
			this.parent = null;
			clearInterval(this.timer);
			this.timer = null;
		},
		hover(cameraIndexCode, ele) {
			if (!ele) {
				return;
			}
			this.currentTime = Date.now();
			let timeStamp = 0;
			this.timer = setInterval(() => {
				timeStamp = Date.now();
				if (timeStamp - this.currentTime >= retentionPeriod * 1000) {
					this.parent = ele;
					let getElementPlay = this.getElement();
					if (getElementPlay) {
						this.parent.appendChild(getElementPlay);
					}
					clearInterval(this.timer);
					this.timer = null;
					this.cameraIndexCode = cameraIndexCode;
					this.getCameraPreviewURLs();
					ele.style = 'display:block;';
				}
			}, 1000);
		},
		getCameraPreviewURLs() {
			API_GrainGrainCameraPreviewURLs({ cameraIndexCode: this.cameraIndexCode, type: 'LOW' }).then(result => {
				if (!result.success) {
					return;
				}
				this.cameraPreviewURLs = result.data;
				this.$nextTick(() => {
					this.$refs.videoHls?.hideControlBar();
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
.video-hover-play {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	&.show {
		display: block;
		z-index: 10;
	}
}
</style>
