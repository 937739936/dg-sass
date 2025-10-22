<template>
	<div>
		<div
			class="auto-list-scroll-inner"
			ref="autoInner"
		>
			<div class="message-list">
				<div
					class="message-list-item"
					v-for="(item, index) in listData"
					:key="index"
					@click="openDetail(item)"
				>
					<div
						class="one-line"
						:title="item.mainTitle"
					>
						{{ item.mainTitle }}
					</div>
					<div class="time">{{ item.shelfDate }}</div>
				</div>
			</div>
		</div>
		<a-modal
			v-model="previewVisiable"
			:title="'公告详情'"
			:width="800"
			@ok="previewVisiable = false"
			:footer="false"
		>
			<div
				v-html="templateEditorContent"
				class="rich-content"
				id="rich-notice-content"
			></div>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>
<script>
import { API_workbenchNoticeDetail } from 'api';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';

export default {
	data() {
		return {
			scrollData: [],
			scrollNum: 0,
			previewVisiable: false,
			templateEditorContent: '',
			imageUrlList: [],
			contentImages: []
		};
	},
	props: ['listData'],
	components: {
		imageViewer
	},
	mounted() {},
	methods: {
		// 获取image元素链接
		getImageUrlFormContent(htmlContent) {
			if (htmlContent && htmlContent.childNodes) {
				htmlContent.childNodes.forEach(item => {
					if (item.nodeType === 1 && item.tagName?.toUpperCase() === 'IMG') {
						this.imageUrlList.push(item.getAttribute('src'));
					}
					this.getImageUrlFormContent(item);
				});
			}
		},
		showImage() {
			filePreview(this.imageUrlList, this.$refs.imageViewer.show);
		},
		openDetail(item) {
			this.imageUrlList = [];
			this.contentImages = [];
			API_workbenchNoticeDetail({ id: item.id || 1 }).then(res => {
				this.templateEditorContent = res.data.textDetail;
				this.previewVisiable = true;
				this.$nextTick(() => {
					const htmlContent = document.querySelector('#rich-notice-content');
					this.getImageUrlFormContent(htmlContent);
					const imgs = htmlContent.getElementsByTagName('img');
					this.contentImages = [...imgs];
					this.contentImages.forEach(item => {
						item.addEventListener('click', this.showImage);
					});
				});
			});
		}
	},
	beforeCreate() {
		this.contentImages?.forEach(item => {
			item.removeEventListener(this.showImage);
		});
	}
};
</script>
<style lang="less" scoped>
.message-list-item {
	display: flex;
	position: relative;
	height: 46px;
	line-height: 46px;
	color: rgba(0, 0, 0, 0.8);
	padding: 0 19px;
	font-size: 14px;
	justify-content: space-between;
	cursor: pointer;
	.one-line {
		max-width: 80%;
	}
	&:hover {
		color: #4682f3;
		background: rgba(70, 130, 243, 0.05);
	}
}
.time {
	font-size: 14px;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.4);
}
.message-list {
	will-change: transform;
}
.auto-list-scroll-inner {
	height: 330px;
	padding-top: 4px;
	overflow: scroll;
}
.rich-content ::v-deep img {
	max-width: 100%;
}
.rich-content ::v-deep p {
	margin-top: 0;
	margin-bottom: 1em;
}
.rich-content ::v-deep dl,
.rich-content ::v-deep ol,
.rich-content ::v-deep ul {
	margin-top: 0;
	margin-bottom: 1em;
	list-style: auto;
	padding-left: 40px;
}
</style>
