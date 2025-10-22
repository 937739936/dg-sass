<template>
	<a-modal
		width="700px"
		class="slModal"
		destroyOnClose
		v-model="visible"
	>
		<template slot="title">
			<div class="title">
				<div class="name">巡库视频</div>
			</div>
		</template>
		<template slot="footer">
			<a-button @click="handleCancel">关闭</a-button>
		</template>
		<div class="content">
			<VideoHls
				ref="videoHls"
				type="video/mp4"
				:progressControl="true"
				:durationDisplay="true"
				:currentTimeDisplay="true"
				:timeDivider="true"
				:src="src"
			></VideoHls>
		</div>
	</a-modal>
</template>

<script>
import moment from 'moment';
import VideoHls from '@/v2/components/videoHls/VideoHls';

export default {
	name: 'InspectVideoPlayer',

	components: {
		VideoHls
	},

	data() {
		return {
			moment,
			visible: false,
			form: this.$form.createForm(this),
			src: ''
		};
	},
	methods: {
		showModal(src) {
			this.visible = true;
			this.src = src;
		},

		handleCancel() {
			this.visible = false;
		}
	}
};
</script>

<style lang="less" scoped>
.slModal {
	.closeIcon {
		width: 22px;
		height: 22px;
	}
	::v-deep {
		.ant-modal-mask,
		.ant-modal-wrap {
			z-index: 1002;
		}
		.ant-modal-header {
			padding: 0 20px;
			height: 58px;
			background-color: #f3f5f6;
			.ant-modal-title {
				height: 100%;
			}
		}
		.ant-modal-body {
			padding: 0px;
		}
		.ant-modal-footer {
			padding: 16px 20px;
		}
	}
	.title {
		display: flex;
		align-items: center;
		height: 100%;
		.name {
			font-size: 18px;
			color: rgba(#000, 0.8);
			font-weight: 500;
		}
	}
	.content {
		height: 400px;
		overflow: auto;
	}
}
</style>