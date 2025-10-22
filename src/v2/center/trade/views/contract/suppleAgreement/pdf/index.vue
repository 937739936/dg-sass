<template>
	<div
		class="wrap"
		v-if="url"
		:style="{ height: flag === 100 ? '100%' : '600px' }"
	>
		<!-- <a-spin tip="Loading..." v-if="loading" wrapperClassName="wrap"> </a-spin> -->

		<div class="cover">
			<div class="cover-inner"></div>
			<canvas
				style="width: 100%"
				v-for="page in pages"
				:id="'the-canvas' + page + id"
				:key="page"
			></canvas>
		</div>
	</div>
</template>
<script>
import ENV from '@/v2/config/env';
import PDFJS from 'pdfjs-sig';
import PDFLIB from 'pdfjs-sig/build/pdf.worker.entry';
export default {
	data() {
		return {
			pages: 1,
			loading: true
		};
	},
	props: {
		url: {
			type: String,
			default: ''
		},
		flag: {
			type: [String, Number],
			default: ''
		},
		id: {
			type: [String, Number],
			default: ''
		},
		type: {
			type: String,
			default: ''
		}
	},
	watch: {
		async url() {
			this.loading = true;
			this.pages = 0;
			if (this.type === 'base64') {
				this._loadFile(this.url);
				return;
			}
			this._loadFile(`${this.url}`);
		}
	},
	async mounted() {
		if (this.type === 'base64') {
			this._loadFile(this.url);
			return;
		}
		this._loadFile(`${this.url}`);
	},
	methods: {
		_renderPage(num) {
			this.pdfDoc.getPage(num).then(page => {
				var scale = 1.5;
				var viewport = page.getViewport({ scale: scale });

				var canvas = document.getElementById('the-canvas' + num + this.id);
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				page.render(renderContext);
				// TODO:这个地方只能渲染两页？？？
				if (this.pages > num) {
					this._renderPage(num + 1);
				} else {
					this.loading = false;
				}
			});
		},
		convertDataURIToBinary(dataURI) {
			// base64二进制流预览转换
			var raw = window.atob(dataURI.replace('data:application/pdf;base64,', ''));
			var rawLength = raw.length;
			var array = new Uint8Array(new ArrayBuffer(rawLength));
			for (var i = 0; i < rawLength; i++) {
				array[i] = raw.charCodeAt(i);
			}
			return array;
		},
		async _loadFile(url) {
			PDFJS.GlobalWorkerOptions.workerSrc = PDFLIB;
			const signUrl = await this.$RsaDecrypt.generateFileUrl(this.url);
			const finalUrl = this.type == 'base64' ? this.convertDataURIToBinary(url) : signUrl;

			PDFJS.getDocument(finalUrl).promise.then(pdf => {
				this.pdfDoc = pdf;
				this.pages = this.pdfDoc.numPages;
				this.$nextTick(() => {
					this._renderPage(1);
				});
			});
		}
	}
};
</script>
<style lang="stylus" scoped>
.cover {
  position: relative;
}
.cover-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
  /* background-image: url("./wm.png"); */
}
.wrap {
  max-width: 1200px;
  height: auto!important;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  .ant-spin-spinning {
    position: absolute;
    left: 0;
  }
}
.ant-spin {
  width: 100%;
  height: 100%;
  flex-row(center, center)
}
</style>
