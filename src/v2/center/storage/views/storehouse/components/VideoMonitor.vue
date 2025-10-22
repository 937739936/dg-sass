<template>
	<a-row
		type="flex"
		:gutter="18"
		justify="start"
	>
		<template v-if="!loading">
			<template v-if="!isControl">
				<template v-if="warehouseCameras && warehouseCameras.length > 0">
					<div
						v-for="(item, index) in warehouseCameras"
						:key="index"
					>
						<div class="item">
							<div class="item-play"></div>
							<div class="button">
								<span
									class="fl"
									style="font-weight: bold"
									>{{ item.cameraName }}</span
								>
								<a-button
									ghost
									@click="toControl(item)"
									type="primary"
								>
									{{ item.control ? '操控' : '查看' }}
								</a-button>
							</div>
						</div>
					</div>
				</template>
				<a-col
					v-else
					:span="24"
					class="tc"
					style="line-height: 230px"
				>
					暂无数据
				</a-col>
			</template>
			<div
				style="width: 100%; position: relative"
				v-else
			>
				<a-tabs
					style="width: 300px"
					:default-active-key="1"
					@change="onChangeTab"
				>
					<a-tab-pane
						:key="item.value"
						:tab="item.label"
						v-for="item in tabList"
					></a-tab-pane>
				</a-tabs>
				<span
					class="fr"
					style="margin-right: 9px; position: absolute; right: 0; top: 10px"
				>
					<template v-if="curTab == 2">
						<a-button
							ghost
							style="margin-right: 10px"
							type="primary"
						>
							<a
								href="https://admin.shdatalink.com/VideoWebPlugin.exe"
								download="VideoWebPlugin.exe"
								>下载视频播放插件</a
							>
						</a-button>
						<a-button
							ghost
							style="margin-right: 10px"
							type="primary"
						>
							<a
								href="https://admin.shdatalink.com/webbrowserplugin_1.4.0.20191227175032.exe"
								download="webbrowserplugin.exe"
								>下载浏览器视频播放插件</a
							>
						</a-button>
					</template>
				</span>
				<div class="video-wrapper fullscreen-wrapper">
					<template v-if="curTab == 1 && cameraPreviewURLs">
						<div class="control-button">
							<p>
								<template v-if="curCameraData.control && videoLoaded">
									操作摄像头
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
										title="向下转动摄像头"
									>
										<span
											class="down"
											@click="cameraControlling('DOWN')"
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
											class="zoom-in"
											@click="cameraControlling('ZOOM_IN')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="镜头拉远"
									>
										<span
											class="zoom-out"
											@click="cameraControlling('ZOOM_OUT')"
										></span>
									</a-tooltip>
									<a-tooltip
										placement="bottom"
										title="暂停操作摄像头"
									>
										<span
											class="pause"
											@click="cameraControlling()"
										></span>
									</a-tooltip>
								</template>
								<span
									@click="exit()"
									class="back fr"
									>返回上一级</span
								>
								<span
									v-if="!getStaging()"
									@click="cameraManualCapture"
									style="margin-right: 10px"
									class="back fr"
								>
									抓拍
								</span>
							</p>
						</div>
						<VideoHls
							:customFullscreenEnter="true"
							ref="videoHls"
							:type="getStaging() ? 'video/mp4' : 'application/x-mpegURL'"
							@changeFullScreen="toggle"
							:src="cameraPreviewURLs"
							v-on:hlsPlayOk="changeHlsPlayOk"
							:key="1"
						></VideoHls>
						<div
							ref="imgContainer"
							class="img-container"
						></div>
					</template>

					<div
						style="height: 100%"
						v-if="curTab == 2"
					>
						<div
							v-if="hikvisionVideoLoaded"
							class="control-button"
							style="padding: 0"
						>
							<p>
								<span
									@click="exit()"
									class="back fr"
									>返回上一级</span
								>
							</p>
						</div>
						<HikvisionVideo
							@change="hikvisionVideoLoaded = true"
							:cameraIndexCode="cameraIndexCode"
							ref="hikvisionVideo"
							:list="curShowList"
							:playMode="curTab - 1"
							:key="curTab"
						></HikvisionVideo>
					</div>
				</div>
			</div>
		</template>
	</a-row>
</template>
<script>
import HikvisionVideo from './HikvisionVideo.vue';
import moment from 'moment';
import { API_GrainGrainSituationWarehouseCameras, API_GrainGrainCameraControlling } from '@/v2/center/storage/api';
import VideoHls from '@/v2/components/videoHls/VideoHls';
import { down } from '@/v2/utils/factory';
import { api as fullscreen } from 'vue-fullscreen';
import ENV from '@/v2/config/env';

export default {
	name: 'VideoMonitor',
	components: {
		HikvisionVideo,
		VideoHls
	},
	data() {
		return {
			ENV,
			id: '',
			loading: false,
			moment,
			date: [],
			fullscreen: false,
			curShowList: [], // 当前能显示的摄像头
			warehouseCameras: [],
			curCameraData: '',
			cameraIndexCode: '',
			cameraPreviewURLs: '',
			cameraPlaybackURLs: '',
			videoLoaded: false,
			hikvisionVideoLoaded: false,
			warehouses: {
				20: [
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG4.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/22222.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG2.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/11111.png')
					}
				],
				21: [
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG3.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/22222.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG9.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/11111.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG10.png')
					}
				],
				22: [
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG3.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG5.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/22222.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG7.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG8.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/11111.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG10.png')
					}
				],
				23: [
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/22222.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG6.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG7.png')
					},
					{
						name: '仓外',
						cover: require('@/v2/assets/imgs/storage/temp/WechatIMG8.png')
					},
					{
						name: '仓内',
						cover: require('@/v2/assets/imgs/storage/temp/11111.png')
					}
				]
			},
			colSpan: 8,
			isControl: false,
			curTab: 1,
			tabList: [
				{
					label: '预览',
					value: 1
				},
				{
					label: '回放',
					value: 2
				}
				// {
				//   label: '智能回放',
				//   value: 3
				// },
			],
			warehousesVideoList: {
				1: [
					{
						cameraName: '5号仓球机',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/9f976a3747d949dd8acc5aee8b1d290f.mp4'
					},
					{
						cameraName: '5仓西北向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/23916a37edbe4d87952c4dc4993d4b42.mp4'
					},
					{
						cameraName: '6仓西北向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210715/d739c3d9486c4ab096ad265d6cf637b2.mp4'
					},
					{
						cameraName: '地磅南',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/51fcad67aeb54c8c95aed7800e033896.mp4'
					},
					{
						cameraName: '地磅北',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/aaff3060adc841df8453479d38a6a431.mp4'
					}
				],
				2: [
					{
						cameraName: '2仓内球机',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/19a5609107e54c1b94d6045154e06347.mp4'
					},
					{
						cameraName: '2仓西北向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/802616f7453048059cdc603634839d20.mp4'
					},
					{
						cameraName: '地磅南',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/51fcad67aeb54c8c95aed7800e033896.mp4'
					},
					{
						cameraName: '地磅北',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/aaff3060adc841df8453479d38a6a431.mp4'
					}
				],
				5: [
					{
						cameraName: '6仓内球机',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/7a9859ff0a154be2b9d75fd391de1685.mp4'
					},
					{
						cameraName: '7仓西南向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/560f6d7084364b32a5f9ab4ba34e7906.mp4'
					},
					{
						cameraName: '6仓西南向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210715/d4fd4ab6972a4225ac84d972f71555b6.mp4'
					},
					{
						cameraName: '5仓西北向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/23916a37edbe4d87952c4dc4993d4b42.mp4'
					},
					{
						cameraName: '地磅南',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/51fcad67aeb54c8c95aed7800e033896.mp4'
					},
					{
						cameraName: '地磅北',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/aaff3060adc841df8453479d38a6a431.mp4'
					}
				],
				7: [
					{
						cameraName: '7仓内球机',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/9fde85c63b9d4397a5c4ef6903194f9d.mp4'
					},
					{
						cameraName: '7仓西南向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/560f6d7084364b32a5f9ab4ba34e7906.mp4'
					},
					{
						cameraName: '6仓西南向东',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210715/d4fd4ab6972a4225ac84d972f71555b6.mp4'
					},
					{
						cameraName: '地磅南',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/51fcad67aeb54c8c95aed7800e033896.mp4'
					},
					{
						cameraName: '地磅北',
						hlsUrlLow: 'https://trans.shanghaishulian.com/video-files/mp4/20210714/aaff3060adc841df8453479d38a6a431.mp4'
					}
				]
			},
			cameraManualCaptureFlag: false
		};
	},

	async mounted() {
		this.curShowList = [
			'88b1264462b24d47b71d34b042dda16f',
			'922c23133fb54cef8810f0b418906bcd',
			'674d5788aba44969b63ffef24848d82d',
			'2ead926168614d33aa2cbcae5946e621',
			'a6dbe5c74a884405903c19ee32d1ea1a',
			'c509cdb1a6e6437a9b96a90dcc121369',
			'18e892d96fd7498c8f899c9a4d6ee591',
			'5be592372de947c696ec2e3aaa5bf020',
			'e5a02704013e4a408a3d75fd1e2302fd',
			'6f2ba113a09341fd8e92374c85e96071',
			'a80494c0509d4992baebf76ca537c9bc'
		];
	},

	created() {
		this.storehouseId = this.$route.query.id;
		// this.getwarehouseCameras()
		this.getWarehouseCamerasX();
	},

	methods: {
		changeHlsPlayOk() {
			this.cameraManualCaptureFlag = true;
			this.videoLoaded = true;
		},
		getStaging() {
			return process.env.VUE_APP_BUILD_ENV === 'staging' || process.env.VUE_APP_BUILD_ENV === 'development';
		},
		toggle() {
			fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
				teleport: this.teleport,
				callback: isFullscreen => {
					this.fullscreen = isFullscreen;
				}
			});
		},

		takePhoto() {
			const video = document.querySelector('.vjs-custom-skin video');
			const scale = 1;
			const canvas = document.createElement('canvas');
			canvas.width = video.videoWidth * scale;
			if (canvas.width <= 0) {
				this.$message.error('视频未成功加载，无法抓拍。');
				return;
			}
			canvas.height = video.videoHeight * scale;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			const img = document.createElement('img');
			img.src = canvas.toDataURL('image/png');
			const imgContainer = this.$refs.imgContainer;
			imgContainer.innerHTML = '';
			img.style = 'width:100%;height:100%;';
			imgContainer.prepend(img);
			this.downloadPhoto();
		},

		downloadPhoto() {
			// const target = event.target
			const img = document.querySelector('.img-container img');
			if (!img) {
				return;
			}
			const imgSrc = img.getAttribute('src');

			if (this.browserIsIe()) {
				this.createIframe(imgSrc);
			} else {
				down(imgSrc, '抓拍图片');
			}
		},
		/*getwarehouseCameras() {
        API_GrainSituationWarehouseCameras(this.istorehouseIdd).then((res) => {
          if (res.success) {
            this.warehouseCameras = res.data
          }
        })
      },*/

		// 判断是否为Trident内核浏览器(IE等)函数
		browserIsIe() {
			if (!!window.ActiveXObject || 'ActiveXObject' in window) {
				return true;
			} else {
				return false;
			}
		},

		// 创建iframe并赋值的函数,传入参数为图片的src属性值.
		createIframe(imgSrc) {
			// 如果隐藏的iframe不存在则创建
			if (document.querySelector('#IframeReportImg').length === 0) {
				document
					.createElement(
						'<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="downloadImg();" width="0" height="0" src="about:blank"></iframe>'
					)
					.afterend('body'); // ？？？？？
			}
			// iframe的src属性如不指向图片地址,则手动修改,加载图片
			if (document.querySelector('#IframeReportImg').getAttribute('src') != imgSrc) {
				document.querySelector('#IframeReportImg').setAttribute('src', imgSrc);
			} else {
				// 如指向图片地址,直接调用下载方法
				this.downloadImg();
			}
		},
		// 下载图片的函数
		downloadImg() {
			// iframe的src属性不为空,调用execCommand(),保存图片
			if (document.querySelector('#IframeReportImg').src != 'about:blank') {
				window.frames['IframeReportImg'].document.execCommand('SaveAs');
			}
		},

		disabledDate(current) {
			return current < moment().subtract(4, 'days') || current > moment().endOf('day');
		},
		toControl(data) {
			this.curCameraData = data;
			this.cameraIndexCode = data.cameraIndexCode;
			this.isControl = true;
			this.videoLoaded = false;
			this.hikvisionVideoLoaded = false;
			this.getCameraPreviewURLs();
		},
		getCameraPreviewURLs() {
			this.cameraPreviewURLs = '';
			this.cameraPreviewURLs = this.curCameraData.hlsUrlLow;
		},
		getCameraPlaybackURLs() {
			/*this.cameraPlaybackURLs = ''
        const params = {
          cameraIndexCode: this.cameraIndexCode,
          type: 'HIGH'
        }
        if (this.date && this.date.length > 0) {
          params.beginTime = this.date[0].format('YYYY-MM-DD HH:mm:ss')
          params.endTime = this.date[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          params.beginTime = moment().format('YYYY-MM-DD HH:mm:ss')
          params.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        API_GrainGrainCameraPlaybackURLs(params).then((res) => {
          if (res.success) {
            this.cameraPreviewURLs = res.data
          }
        })*/
		},
		exit() {
			this.isControl = false;
			this.warehouseCameras = [];
			this.curTab = 1;
			this.getWarehouseCamerasX();
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
			API_GrainGrainCameraControlling(params).then(() => {});
		},
		cameraManualCapture() {
			if (!this.cameraManualCaptureFlag) {
				return;
			}
			const a = document.createElement('a');
			a.href = `${ENV.BASE_GRAIN_API}/camera/manualCapture?cameraIndexCode=${this.cameraIndexCode}`;
			a.click();
		},
		onChangeTab(v) {
			this.curTab = v;
			this.videoLoaded = false;
			this.hikvisionVideoLoaded = false;
			switch (v) {
				case 1:
					this.getCameraPreviewURLs();
					break;
				case 2:
					this.date = [moment().subtract(3, 'hour'), moment()];
					this.getCameraPlaybackURLs();
					break;
				case 3:
					break;
			}
		},

		getWarehouseCamerasX() {
			if (this.getStaging()) {
				this.warehouseCameras = this.warehousesVideoList[this.storehouseId];
				return;
			}

			this.loading = true;
			API_GrainGrainSituationWarehouseCameras(this.storehouseId)
				.then(res => {
					if (res.success) {
						this.warehouseCameras = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
img {
	display: block;
	width: 100%;
	height: 246px;
}
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
		background-image: url('~@/v2/assets/imgs/common/monitor.png');
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
			width: 16px;
			height: 16px;
			margin-left: 20px;
			display: inline-block;
			position: relative;
			top: 3px;
			cursor: pointer;
		}
		.up {
			background-image: url('~@/v2/assets/imgs/storage/turnUp.png');
			background-size: cover;
		}
		.down {
			background-image: url('~@/v2/assets/imgs/storage/turnDown.png');
			background-size: cover;
		}
		.right {
			background-image: url('~@/v2/assets/imgs/storage/turnRight.png');
			background-size: cover;
		}
		.left {
			background-image: url('~@/v2/assets/imgs/storage/turnLeft.png');
			background-size: cover;
		}
		.zoom-in {
			background-image: url('~@/v2/assets/imgs/storage/zoomIn.png');
			background-size: cover;
		}
		.zoom-out {
			background-image: url('~@/v2/assets/imgs/storage/zoomOut.png');
			background-size: cover;
		}
		.pause {
			background-image: url('~@/v2/assets/imgs/storage/pauseTurn.png');
			background-size: cover;
		}
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
