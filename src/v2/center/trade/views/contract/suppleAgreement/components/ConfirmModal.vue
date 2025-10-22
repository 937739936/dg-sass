<template>
	<a-modal
		class="del-modal slModal"
		:visible="delVisible"
		:width="460"
		@cancel="delVisible = false"
		:title="title"
	>
		<div class="title-box">
			<slot></slot>
		</div>

		<template slot="footer">
			<a-button
				key="back"
				@click="cancel"
				class="cancel-btn"
				>{{ cancelBtnText }}</a-button
			>
			<a-button
				type="primary"
				@click="saveDel"
				style="margin-left: 20px"
				>{{ btnTip }}</a-button
			>
		</template>
	</a-modal>
</template>

<script>
export default {
	props: {
		btnTip: {
			default: '确定'
		},
		cancelBtnText: {
			default: '取消'
		},
		title: {
			default: '下载'
		}
	},
	data() {
		return {
			delVisible: false
		};
	},
	methods: {
		open() {
			this.delVisible = true;
		},
		close() {
			this.delVisible = false;
		},
		cancel() {
			this.delVisible = false;
			this.$emit('cancel');
		},
		saveDel() {
			this.$emit('save');
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	// padding-top: 30px;
	padding: 30px;
}
/deep/ .ant-modal-header {
	// background-color: #fff;
	padding: 16px 20px;
}
.title-box {
	display: flex;
	.icon {
		color: @primary-color;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 5px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.8);
	display: flex;
	flex: 1;
	// margin-top: 20px;
}
.icon {
	width: 16px;
	height: 16px;
	img {
		width: 16px;
		height: 16px;
	}
}
</style>
