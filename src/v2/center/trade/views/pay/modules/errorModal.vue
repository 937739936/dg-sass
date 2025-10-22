<template>
	<!-- 删除弹窗 -->
	<a-modal
		v-model="delVisible"
		centered
		title=""
		wrapClassName="invoice-box"
	>
		<div class="title">
			<i
				style="color: #f88420; vertical-align: middle; fontsize: 16px"
				class="icon-danchuang-jinggaoicon iconfont"
			></i>
			<span style="margin-left: 12px">{{ tip }}</span>
		</div>
		<div slot="closeIcon">
			<i
				class="icon-danchuang-closeicon iconfont"
				style="fontsize: 25px"
			></i>
		</div>
		<slot class="tip"></slot>
		<template slot="footer">
			<!-- <a-button key="back" style="width:90px;line-height: initial;" @click="delVisible=false"> 取消 </a-button> -->
			<a-button
				key="submit"
				style="margin-left: 18px; width: 90px; line-height: initial"
				type="primary"
				@click="close"
			>
				我知道了</a-button
			>
		</template>
	</a-modal>
</template>

<script>
export default {
	props: {
		tip: {
			default: '发票无法保存'
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
		send() {
			this.$emit('confirm');
		}
	},
	components: {}
};
</script>

<style lang="less">
/* 发票上传样式优化 */
.invoice-box {
	.ant-modal {
		width: 490px !important;
	}
	.ant-modal-content {
		border-radius: 6px;
	}
	.title {
		font-size: 20px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		padding-top: 20px;
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	.tip {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
	}
	.ant-modal-close-x {
		width: 34px;
		height: 34px;
		// background: #D8D8D8;
		line-height: 34px;
		border-radius: 4px;
	}
	.ant-modal-close {
		top: 14px;
		right: 14px;
	}
	.ant-modal-header {
		border-bottom: 0;
		padding-top: 30px;
		padding-bottom: 20px;
		.ant-modal-title {
			font-weight: 500;
			font-size: 20px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.ant-modal-body {
		padding-top: 0;
		padding-bottom: 0;
	}
	.ant-modal-footer {
		padding-top: 20px;
		padding-bottom: 20px;
		border-top: 0;
	}
	.footer-box {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.footer-btn1 {
			color: #4682f3;
			border: 1px solid #4682f3;
			background: #fff;
			width: 90px;
			height: 34px;
			border-radius: 6px;
			font-size: 14px;
		}
		.footer-btn {
			width: 90px;
			height: 34px;
			background: #4682f3;
			border-radius: 6px;
		}
	}
}
</style>
