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
		<div class="tip">{{ tip }}</div>
		<div
			class="tipNext"
			v-if="tipNext"
		>
			{{ tipNext }}
		</div>
		<template slot="footer">
			<a-button
				key="back"
				@click="delVisible = false"
				class="cancel-btn"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="saveDel"
				style="margin-left: 20px"
				>确定</a-button
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
			default: '确认删除'
		},
		tip: {
			default: '确认要删除该附件吗，删除后无法恢复'
		},
		tipNext: {
			default: ''
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
		saveDel() {
			this.$emit('save');
		}
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 30px;
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
.tipNext {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
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
