<template>
	<div>
		<image-viewer ref="imageViewer" />
		<a-modal
			:visible="videoVisible"
			:footer="null"
			wrapClassName="modal-none-padding"
			destroyOnClose
			width="520px"
			@cancel="videoVisible = false"
		>
			<video
				width="520"
				controls
				autoplay
			>
				<source
					:src="encodeURI(previewurl)"
					type="video/ogg"
				/>
				<source
					:src="encodeURI(previewurl)"
					type="video/mp4"
				/>
				<source
					:src="encodeURI(previewurl)"
					type="video/webm"
				/>
				<object data="movie.mp4">
					<embed
						width="520"
						:src="encodeURI(previewurl)"
					/>
				</object>
				您的浏览器不支持 video 标签,请下载观看。
			</video>
		</a-modal>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import { API_GetDownloadRAR, API_DOWNLPREVIEWTE } from '@/v2/api/upload';
function fileUrl(data) {
	let url = '';
	if (typeof data == 'string') {
		url = data;
	} else if (data.response) {
		url = data.response.data.fileUrl;
	} else {
		url = data.url || data.path || data.fileUrl || data.filePath;
	}
	return url;
}
export default {
	components: {
		imageViewer
	},
	data() {
		return {
			videoVisible: false,
			previewurl: ''
		};
	},
	methods: {
		//查看附件
		fileLook(data) {
			let url = fileUrl(data);
			if (!url) {
				return;
			}
			let front_url = url?.split('?')[0];
			let ext = front_url.split('.')[front_url.split('.').length - 1].toLowerCase();
			if (ext == 'rar' || ext == 'zip') {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(url, '_blank');
				}
				return;
			}
			//判断视频
			if (ext == 'avi' || ext == '3gp' || ext == 'mp4' || ext == 'mkv') {
				this.previewurl = url;
				this.videoVisible = true;
				return;
			}
			filePreview(url, this.$refs.imageViewer.show);
		},
		//下载
		fileDown(data) {
			let url = fileUrl(data);
			if (!url) {
				return;
			}
			if (url) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url, data.name);
				});
			}
		}
	}
};
</script>

<style lang="less" scoped></style>
