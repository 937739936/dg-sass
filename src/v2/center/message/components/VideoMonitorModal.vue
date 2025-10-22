<template>
	<a-modal
		:visible="visible"
		@cancel="close"
		width="731px"
		:footer="false"
		:forceRender="true"
	>
		<template slot="title">
			<img
				src="@/assets/imgs/warning/camera_min_icon.png"
				alt=""
				style="width: 16px"
			/>
			{{ name }}
		</template>
		<div>
			<div style="width: 100%; position: relative">
				<div class="video-wrapper fullscreen-wrapper">
					<template>
						<div class="control-button">
							<p>
								<template v-if="curCameraData.control && videoLoaded">
									操作摄像头
									<a-tooltip
										placement="bottom"
										title="向下转动摄像头"
									>
										<span
											class="down"
											@click="cameraControlling('DOWN')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="向上转动摄像头"
									>
										<span
											class="up"
											@click="cameraControlling('UP')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="向左转动摄像头"
									>
										<span
											class="left"
											@click="cameraControlling('LEFT')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="向右转动摄像头"
									>
										<span
											class="right"
											@click="cameraControlling('RIGHT')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="镜头拉近"
									>
										<span
											class="zoom-out"
											@click="cameraControlling('ZOOM_OUT')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="镜头拉远"
									>
										<span
											class="zoom-in"
											@click="cameraControlling('ZOOM_IN')"
										></span>
									</a-tooltip>
									<!--                  <a-tooltip placement="bottom" title="暂停操作摄像头">-->
									<!--                    <span class="pause" @click="cameraControlling()"></span>-->
									<!--                  </a-tooltip>-->
								</template>
							</p>
						</div>
						<VideoHls
							v-if="cameraPreviewURLs"
							:customFullscreenEnter="true"
							ref="videoHls"
							:type="getStaging() ? 'video/mp4' : 'application/x-mpegURL'"
							@change="videoLoaded = true"
							@changeFullScreen="toggle"
							:src="cameraPreviewURLs"
							:key="1"
						></VideoHls>
						<div
							ref="imgContainer"
							class="img-container"
						></div>
					</template>
				</div>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { API_GrainGrainCameraPreviewURLs } from '@/v2/api';
import VideoHls from '@/v2/components/videoHls/VideoHls.vue';
import { api as fullscreen } from 'vue-fullscreen';

// import { getAction, postAction,httpAction, downFile,downFilePost } from '@/api/manage'

export default {
	name: 'VideoMonitor',

	props: {
		coreCompanyId: {
			type: String,
			default: ''
		}
	},
	components: {
		VideoHls
	},
	data() {
		return {
			// ENV,
			id: '',
			loading: false,
			name: '',
			visible: false,
			fullscreen: false,
			curCameraData: {},
			cameraIndexCode: '',
			cameraPreviewURLs: '',
			videoLoaded: false,
			colSpan: 8,
			isControl: false
		};
	},
	mounted() {},
	methods: {
		getStaging() {
			return process.env.VUE_APP_CURRENTMODE === 'staging' || process.env.VUE_APP_CURRENTMODE === 'dev';
		},
		toggle() {
			fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
				teleport: this.teleport,
				callback: isFullscreen => {
					this.fullscreen = isFullscreen;
				}
			});
		},
		toControl(data) {
			this.visible = true;
			this.curCameraData = data;
			this.cameraIndexCode = data.cameraIndexCode;
			this.name = data.cameraName;
			this.isControl = data.control;
			this.videoLoaded = false;
			this.getCameraPreviewURLs();
		},
		close() {
			this.visible = false;
			this.curCameraData = {};
			this.cameraIndexCode = '';
			this.name = '';
			this.isControl = false;
			this.videoLoaded = true;
			this.cameraPreviewURLs = null;
		},
		async getCameraPreviewURLs() {
			const res = await API_GrainGrainCameraPreviewURLs({ cameraIndexCode: this.cameraIndexCode, type: 'LOW' });
			this.cameraPreviewURLs = res.data;
		},

		cameraControlling(v) {
			let params = {};
			if (v) {
				params = {
					cameraIndexCode: this.cameraIndexCode,
					action: 0,
					command: v
				};
			} else {
				params = {
					cameraIndexCode: this.cameraIndexCode,
					action: 1,
					command: 'LEFT'
				};
			}
			// API_GrainGrainCameraControlling(params)
		}
	}
};
</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
	padding: 16px;
}

//img{
//  display: block;
//  width: 100%;
//  height: 246px;
//}
.button {
	padding: 10px;
	text-align: right;
	span {
		line-height: 32px;
	}
}
.item {
	border: 1px solid #eef0f2;
	border-radius: 4px;
	margin-bottom: 16px;
	margin-left: 10px;
	.item-play {
		width: 250px;
		height: 250px;
		background-image: url('~@/assets/imgs/monitor.png');
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}
}
.video-wrapper {
	width: 100%;
	max-width: 800px;
	height: 530px;
	overflow: hidden;
	margin: 0 auto;
	position: relative;
	padding-top: 37px;
	.control-button {
		width: 100%;
		padding: 0 3px;
		position: absolute;
		text-align: right;
		top: 0;
		z-index: 1;
		p {
			padding: 0 16px;
			width: 100%;
			color: #ffffff;
			line-height: 40px;
			height: 40px;
			background: #000000;
			overflow: hidden;
		}
		.up,
		.down,
		.right,
		.left,
		.zoom-in,
		.zoom-out,
		.pause {
			width: 20px;
			height: 20px;
			margin-left: 16px;
			display: inline-block;
			position: relative;
			top: 3px;
			cursor: pointer;
		}
		.up {
			background-image: url('~@/assets/imgs/warning/turnUp.png');
			background-size: cover;
		}
		.down {
			background-image: url('~@/assets/imgs/warning/turnDown.png');
			background-size: cover;
		}
		.right {
			background-image: url('~@/assets/imgs/warning/turnRight.png');
			background-size: cover;
		}
		.left {
			background-image: url('~@/assets/imgs/warning/turnLeft.png');
			background-size: cover;
		}
		.zoom-in {
			background-image: url('~@/assets/imgs/warning/zoomOut.png');

			background-size: cover;
		}
		.zoom-out {
			background-image: url('~@/assets/imgs/warning/zoomIn.png');
			background-size: cover;
		}
		//.pause{
		//  background-image: url("../../../assets/imgs/warning/pauseTurn.png");
		//  background-size: cover;
		//}
		.back {
			line-height: 25px;
			padding: 0 18px;
			color: rgba(255, 255, 255, 0.65);
			border: 1px solid rgba(255, 255, 255, 0.65);
			border-radius: 4px;
			position: relative;
			top: 6px;
			cursor: pointer;
			a {
				color: rgba(255, 255, 255, 0.65);
			}
		}
	}
}
.control {
	display: inline-block;
	width: 30px;
	height: 30px;
	position: relative;
	span {
		width: 0px;
		height: 0px;
		border-width: 15px;
		border-style: solid;
		position: absolute;
	}
}
.arrow {
	display: inline-block;
	width: 32px;
	height: 15px;
	font-size: 30px;
	position: relative;
	top: -3px;
	.pause {
		position: absolute;
		top: 5px;
		left: 6px;
		display: inline-block;
		width: 20px;
		height: 20px;
		background: #595959;
	}
	.up {
		position: absolute;
		top: -20px;
	}
	.down {
		position: absolute;
		bottom: -35px;
	}
	.left {
		position: absolute;
		left: -20px;
	}
	.right {
		position: absolute;
		right: -20px;
	}
}
</style>
