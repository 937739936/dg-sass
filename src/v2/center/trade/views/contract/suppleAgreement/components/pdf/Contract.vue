<template>
	<div>
		<pdf-preview :url="realUrl"></pdf-preview>
	</div>
</template>

<script>
import PdfPreview from '../../pdf/index.vue';
import ENV from '@/v2/config/env';
export default {
	props: {
		url: {
			default: ''
		}
	},
	computed: {
		realUrl() {
			return this.url;
		}
	},
	data() {
		return {};
	},
	methods: {},
	components: {
		PdfPreview
	}
};
</script>

<style scoped lang="less">
/deep/ .wrap {
	height: 168px !important;
	max-width: 100%;
}
/deep/ .preview-wrap {
	width: 100%;
}
</style>
