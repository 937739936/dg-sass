<template>
	<div>
		<div
			class="s-modal"
			v-if="visible"
			@click="visible = false"
		>
			<div
				@click.stop
				@move.stop
			>
				<a-row
					class="content"
					@click.native.stop
				>
					<a-row style="width: 100%">
						<pdf-preview
							v-if="url"
							:url="url"
							flag="1"
						></pdf-preview>
					</a-row>
					<a-row class="btn">
						<a-button
							style="margin-right: 15px; font-size: 10px"
							@click="downPdf(url)"
							v-if="url"
							type="primary"
						>
							下载
						</a-button>
						<a-button
							style="font-size: 10px"
							type="primary"
							@click="save"
							>确定</a-button
						>
					</a-row>
				</a-row>
			</div>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { API_GETCURRENTENV, API_DOWNLPREVIEWTE } from '@/v2/center/steels/api';
import comDownload from '@sub/utils/comDownload.js';
export default {
	name: 'OrderModal',
	data() {
		return {
			visible: false,
			url: '',
			API_GETCURRENTENV
		};
	},
	components: {
		PdfPreview
	},
	mounted() {},
	methods: {
		// 下载
		downPdf(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},
		save() {
			var that = this;
			this.$confirm({
				centered: true,
				title: '请确认结算单信息无误并提交审批？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					that.visible = false;
					that.$emit('save');
				},
				onCancel() {}
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
.s-modal
    width 100%
    height 100%
    position fixed
    left 0
    top 0
    background rgba(0,0,0,.4)
    z-index 100
    flex-row(center, flex-start)
    &>div
        height 100%
        flex-column(center, center)
    .content
        background #fff
        width 800px
        height auto
        max-height 750px
        overflow hidden
        overflow-y auto
        background #ffffff
        padding 0 30px
        border-radius 8px
        position relative
    .btn
        width 100%
        text-align center
        background #fff
        overflow scroll;
        margin-bottom 14px
        button
            margin 20px 0 0 0
</style>
