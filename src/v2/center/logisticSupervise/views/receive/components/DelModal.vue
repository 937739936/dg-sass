<template>
	<div
		class="del-modal slModal"
		v-if="delVisible"
	>
		<div class="mask">
			<div class="content">
				<span
					class="ant-modal-close-x del-icon"
					@click="delVisible = false"
				></span>
				<div class="title-box">
					<img
						src="@sub/assets/imgs/trade/warning.png"
						style="width: 20px"
						alt=""
					/>
					<span class="title">确认删除</span>
				</div>
				<div class="tip">{{ tip }}</div>
				<div class="footer">
					<a-button
						key="back"
						@click="cancel"
						class="cancel-btn"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="saveDel"
						style="margin-left: 20px"
						>确定</a-button
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		tip: {
			default: '确认要删除该附件吗，删除后无法恢复'
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
			this.$emit('ok');
		},
		cancel() {
			this.$emit('cancel');
			this.close();
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.del-modal {
	position: relative;
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}
	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		background: #fff;
		transform: translateX(-50%) translateY(-50%);
		width: 460px;
		border: 0;
		border-radius: 4px;
		padding: 20px;
		padding-top: 30px;
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			cursor: pointer;
		}
		.footer {
			margin-top: 20px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
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
	vertical-align: sub;
	img {
		width: 16px;
		height: 16px;
	}
}
</style>
