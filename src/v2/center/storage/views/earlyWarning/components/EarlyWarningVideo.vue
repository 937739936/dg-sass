<template>
	<a-modal
		title="预警视频"
		width="700px"
		destroyOnClose
		v-model="visible"
	>
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
import VideoHls from '@/v2/components/videoHls/VideoHls';
import moment from 'moment';

export default {
	name: 'EarlyWarningVideo',

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
.content {
	height: 500px;
	overflow: auto;
}
</style>
