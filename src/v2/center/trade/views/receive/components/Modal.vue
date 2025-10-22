<template>
	<a-modal
		:visible="visible"
		:confirm-loading="confirmLoading"
		:footer="null"
		:width="width"
		@cancel="handleCancel"
		:title="null"
	>
		<div class="title">
			{{ title }}
		</div>
		<div style="padding: 20px">
			<slot></slot>
			<div class="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button
					type="primary"
					@click="handleOk"
					>确定</a-button
				>
			</div>
		</div>
	</a-modal>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			visible: false,
			confirmLoading: false
		};
	},
	components: {},
	mounted() {},
	methods: {
		handleOk() {},
		handleCancel() {
			this.visible = false;
		},
		showModal() {
			this.visible = true;
		}
	}
};
</script>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 20px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
}
/deep/ .ant-modal-body {
	padding: 0;
}
.footer {
	text-align: right;
	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
		height: 34px;
	}
	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}
</style>
