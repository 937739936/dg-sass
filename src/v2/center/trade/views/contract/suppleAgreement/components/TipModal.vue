<template>
	<a-modal
		class="del-modal slModal"
		:visible="delVisible"
		:width="460"
		@cancel="cancel"
		title=""
		:closable="closable"
		:maskClosable="closable"
	>
		<div class="title-box">
			<ConfirmIcon></ConfirmIcon>
			<span class="title">{{ title }}</span>
		</div>

		<div
			class="tip"
			v-if="tip"
		>
			{{ tip }}
		</div>
		<div v-else>
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
				>{{ okBtnText }}</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import { ConfirmIcon } from '@sub/components/svg';
export default {
	props: {
		title: {
			default: '确认删除'
		},
		tip: {
			default: ''
		},
		cancelBtnText: {
			default: '取消'
		},
		okBtnText: {
			default: '确定'
		},
		closable: {
			default: true
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
	components: {
		ConfirmIcon
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 20px;
}
/deep/ .ant-modal-header {
	background-color: #fff;
	padding: 16px 20px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.title-box {
	display: flex;
	align-items: center;
	.icon {
		color:  @primary-color;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 14px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
	margin-top: 20px;
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
