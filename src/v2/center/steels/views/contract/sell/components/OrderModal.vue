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
					<a-tabs
						default-active-key="1"
						@change="changeUrl"
					>
						<a-tab-pane
							:key="item.value"
							:tab="item.label"
							v-for="item in tabList"
						></a-tab-pane>
					</a-tabs>
					<a-row style="width: 100%">
						<pdf-preview
							v-if="url"
							:url="url"
							flag="1"
						></pdf-preview>
					</a-row>
					<a-row class="btn">
						<a-button
							style="margin: 0 15px; font-size: 10px"
							v-if="url"
							type="primary"
							><a
								:href="API_GETCURRENTENV(url)"
								download=""
								target="_new"
								>下载</a
							></a-button
						>
						<a-button
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
	data() {
		return {
			visible: false,
			API_GETCURRENTENV,
			previewUrl: '',
			contractUrl: '',
			// 两方协议
			bothSidesAgreementPdf: '',
			type: 1
		};
	},
	components: {
		PdfPreview
	},
	computed: {
		url() {
			if (this.type == 1) {
				return this.contractUrl;
			}
			if (this.type == 2) {
				return this.previewUrl;
			}
			return this.bothSidesAgreementPdf;
		},
		// tab列表
		tabList() {
			const list = [];
			// 合同
			if (this.contractUrl) {
				list.push({
					label: '钢材买卖合同',
					value: '1'
				});
			}
			// 承诺函
			if (this.previewUrl) {
				list.push({
					label: '承诺函',
					value: '2'
				});
			}
			if (this.bothSidesAgreementPdf) {
				list.push({
					label: '两方协议',
					value: '3'
				});
			}
			return list;
		}
	},

	mounted() {},
	methods: {
		changeUrl(value) {
			this.type = value;
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
