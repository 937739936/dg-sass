<template>
	<div>
		<a-row :gutter="[10, 0]">
			<a-col
				:span="24"
				class="tiem-title"
				:style="{ color: titleColor }"
				>{{ title }}:
			</a-col>
			<a-col
				:span="24"
				v-if="(imageList && imageList.length > 0) || (videoList && videoList.length > 0)"
			>
				<a-row
					v-if="mediaType == 'IMAGE'"
					:gutter="[20, 20]"
					type="flex"
				>
					<a-col
						v-for="(goodsImage, index) in imageList"
						:key="index"
					>
						<div class="media-item">
							<img
								:src="goodsImage"
								alt=""
								class="media-bg"
								v-viewer
							/>
						</div>
					</a-col>
				</a-row>
				<a-row
					v-if="mediaType == 'VIDEO'"
					:gutter="[20, 20]"
					type="flex"
				>
					<a-col
						v-for="(goodsVideo, index) in videoList"
						:key="index"
					>
						<div
							class="video-item"
							@click="playVideo(goodsVideo.url)"
						>
							<img
								:src="goodsVideo.previewUrl"
								alt=""
								class="media-bg"
							/>
							<div class="video-cover"></div>
							<img
								src="@/v2/assets/imgs/logisticsPlatform/video_play.png"
								alt=""
								class="video-play"
							/>
							<span class="video-duration">{{ goodsVideo.duration }}</span>
						</div>
					</a-col>
				</a-row>
				<div v-else></div>
			</a-col>
			<a-col
				:span="24"
				v-else
			>
				<span>-</span>
			</a-col>
		</a-row>
		<InspectVideoPlayer ref="inspectVideoPlayer" />
	</div>
</template>

<script>
import InspectVideoPlayer from './InspectVideoPlayer.vue';

export default {
	name: 'InspectMediaListView',
	components: {
		InspectVideoPlayer
	},
	props: {
		title: String, // 标题
		mediaType: String, // IMAGE、VIDEO
		// marginBottom: 10px;
		titleColor: {
			type: String,
			default: '#000000cc'
		},
		imageList: {
			type: Array
		},
		videoList: {
			type: Array
		}
	},
	data() {
		return {};
	},
	methods: {
		// 播放视频
		playVideo(src) {
			// 查看视频
			// window.open(src);
			// this.$refs.inspectVideoPlayer.showModal('http://vjs.zencdn.net/v/oceans.mp4');
			this.$refs.inspectVideoPlayer.showModal(src);
		}
	}
};
</script>

<style lang="less" scoped>
.tiem-title {
	font-size: 14px;
	color: #000000cc;
	margin-bottom: 10px;
}
.media-item {
	height: 80px;
	width: 144px;
	border-radius: 4px;
	overflow: clip;
	cursor: pointer;
}
.media-bg {
	position: absolute;
	top: 10px;
	left: 10px;
	height: 80px;
	width: 144px;
	border-radius: 4px;
	z-index: 1;
	object-fit: cover;
}

.video-item {
	height: 80px;
	width: 144px;
	border-radius: 4px;
	overflow: clip;
	cursor: pointer;
	.video-cover {
		position: absolute;
		border-radius: 4px;
		left: 10px;
		right: 10px;
		top: 10px;
		bottom: 10px;
		z-index: 2;
		background-color: #16171b;
		opacity: 0.3;
	}
	.video-play {
		position: absolute;
		width: 24px;
		height: 24px;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		z-index: 2;
	}
	.video-duration {
		position: absolute;
		right: 18px;
		bottom: 12px;
		font-size: 14px;
		color: #fff;
		text-align: left;
		z-index: 3;
	}
}
</style>