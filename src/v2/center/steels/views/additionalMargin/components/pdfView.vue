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
							type="base64"
						></pdf-preview>
					</a-row>
					<a-row class="btn">
						<a-button
							style="margin-right: 15px; font-size: 10px"
							v-if="url"
							type="primary"
							@click="download"
						>
							<a href="javascript:;">下载</a>
						</a-button>
						<a-button
							style="font-size: 10px"
							type="primary"
							@click="visible = false"
							>返回</a-button
						>
					</a-row>
				</a-row>
			</div>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { API_GETCURRENTENV } from '@/v2/center/steels/api';
export default {
	name: 'OrderModal',
	props: {
		typeDesc: {
			default: '追'
		}
	},
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
		show(url) {
			this.visible = true;
			this.url = url;
		},
		// 合同下载
		async download() {
			let URL = this.dataURLtoBlob(this.url);
			var reader = new FileReader();
			reader.readAsDataURL(URL);
			reader.onload = function (e) {
				// 兼容IE
				if (window.navigator.msSaveOrOpenBlob) {
					var bstr = atob(e.target.result.split(',')[1]);
					var n = bstr.length;
					var u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					var blob = new Blob([u8arr]);
					window.navigator.msSaveOrOpenBlob(blob, '追保函.pdf');
				} else {
					// 转换完成，创建一个a标签用于下载
					const a = document.createElement('a');
					a.download = '追保函.pdf'; // 这里写你的文件名
					a.href = e.target.result;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}
			};
		},
		dataURLtoBlob(dataurl) {
			var bstr = atob(dataurl);
			var n = bstr.length;
			var u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], { type: 'pdf' });
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
