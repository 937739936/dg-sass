<template>
	<a-modal
		class="slModal slModal2"
		:visible="previewVisible"
		:width="1174"
		:forceRender="true"
		:destroyOnClose="true"
		:class="{ border: !isShowFooter }"
		@cancel="previewVisible = false"
		title="仓单预览"
	>
		<div class="content">
			<pdf-preview :url="currentPdf"></pdf-preview>
			<div
				class="left-arrow"
				@click="changeLeft"
				v-if="currentIndex > 0"
			>
				<svg
					width="38"
					height="38"
					viewBox="0 0 38 38"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M19.0007 34.8346C10.2561 34.8346 3.16732 27.7458 3.16732 19.0013C3.16732 10.2568 10.2561 3.16797 19.0007 3.16797C27.7452 3.16797 34.834 10.2568 34.834 19.0013C34.834 27.7458 27.7452 34.8346 19.0007 34.8346Z"
						fill="#EDF0F5"
					/>
					<path
						d="M21.7715 13.4557L16.2298 18.9974L21.7715 24.5391"
						stroke="black"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div
				class="right-arrow"
				@click="changeRight"
				v-if="currentIndex < list.length - 1"
			>
				<svg
					width="38"
					height="38"
					viewBox="0 0 38 38"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18.9993 34.8346C27.7439 34.8346 34.8327 27.7458 34.8327 19.0013C34.8327 10.2568 27.7439 3.16797 18.9993 3.16797C10.2548 3.16797 3.16602 10.2568 3.16602 19.0013C3.16602 27.7458 10.2548 34.8346 18.9993 34.8346Z"
						fill="#EDF0F5"
					/>
					<path
						d="M16.2285 13.4557L21.7702 18.9974L16.2285 24.5391"
						stroke="black"
						stroke-opacity="0.8"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
		<template slot="footer">
			<a-button
				key="back"
				@click="cancel"
				v-show="isShowFooter"
				class="cancel-btn"
				>返回</a-button
			>
			<a-button
				type="primary"
				@click="ok"
				v-show="isShowFooter"
				style="margin-left: 20px"
				>下载</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		isShowBtn: {
			default: true
		},
		isShowFooter: {
			default: false
		}
	},
	data() {
		return {
			currentIndex: 0,
			previewVisible: false
		};
	},
	computed: {
		currentPdf() {
			const item = this.list[this.currentIndex] || {};
			return item.url || item.path;
		}
	},
	mounted() {
		this.currentIndex = this.index || 0;
	},
	methods: {
		cancel() {
			this.previewVisible = false;
		},
		open(index) {
			this.previewVisible = true;
			this.currentIndex = index;
		},
		show(index) {
			this.previewVisible = true;
			this.currentIndex = index;
		},
		changeLeft() {
			if (this.currentIndex <= 0) {
				return;
			}

			this.currentIndex--;
		},
		changeRight() {
			if (this.currentIndex >= this.list.length - 1) {
				return;
			}

			this.currentIndex++;
		},
		ok() {
			this.$emit('ok', this.list[this.currentIndex]);
		}
	},
	components: {
		PdfPreview
	}
};
</script>

<style scoped lang="less">
.slModal2 {
	/deep/ .ant-modal-body {
		max-height: inherit;
	}
	/deep/ .ant-modal-footer {
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.border {
	/deep/ .ant-modal-footer {
		border: 0;
	}
}

.content {
	position: relative;
	.left-arrow {
		position: absolute;
		top: 50%;
		left: 0%;
		transform: translateY(-50%);
		cursor: pointer;
	}
	.right-arrow {
		position: absolute;
		top: 50%;
		right: 0%;
		transform: translateY(-50%);
		cursor: pointer;
	}
}
</style>
