<template>
	<a-modal
		class="del-modal slModal"
		:visible="delVisible"
		:width="460"
		@cancel="delVisible = false"
		title=""
	>
		<div class="title-box">
			<ConfirmIcon></ConfirmIcon>
			<span class="title">{{ title }}</span>
		</div>

		<div class="tip">内容已被修改，是否要保存后再返回？</div>

		<template slot="footer">
			<a-button
				key="back"
				@click="delVisible = false"
				class="cancel-btn"
				>取消</a-button
			>
			<a-button
				style="margin: 0 20px"
				@click="goBack"
				class="cancel-btn"
				>直接返回</a-button
			>
			<a-button
				type="primary"
				@click="saveDel"
				>保存后返回</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import { ConfirmIcon } from '@sub/components/svg';
export default {
	components: {
		ConfirmIcon
	},
	props: {
		title: {
			default: '提示'
		},
		tip: {
			default: ''
		},
		cancelBtnText: {
			default: '取消'
		},
		okBtnText: {
			default: '确定'
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
		goBack() {
			this.close();
			this.$router.go(-1);
		},
		close() {
			this.delVisible = false;
		},
		saveDel() {
			this.close();
			this.$emit('save');
		}
	},
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 30px;
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
