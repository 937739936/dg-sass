<template>
	<a-modal
		title=""
		:visible="visible"
		@ok="handleOk"
		@cancel="visible = false"
		class="cancel-modal slModal"
		width="490px"
		:maskClosable="false"
	>
		<p class="model-title">
			<span class="tip-wrap">
				<span>{{ title }}</span>
			</span>
			<span
				class="close-icon"
				@click="visible = false"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
				>
					<path
						d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
						fill="#C3C3C3"
					/>
				</svg>
			</span>
		</p>
		<p class="desc-tip">{{ tips }}</p>
		<a-form-model
			ref="formModel"
			:model="form"
			:rules="rules"
		>
			<a-form-model-item
				label=""
				prop="cancelReason"
			>
				<a-textarea
					:maxLength="200"
					:placeholder="'请输入' + title + '原因，最多200字'"
					class="textarea-wrap"
					v-model.trim="form.cancelReason"
				/>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>

<script>
export default {
	data() {
		return {
			form: {},
			visible: false,
			rules: {
				cancelReason: [{ required: true, message: this.title + '原因必填', trigger: ['change', 'blur'] }]
			}
		};
	},
	props: {
		tips: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '作废'
		}
	},
	methods: {
		show() {
			this.visible = true;
			this.form = {};
		},
		handleOk() {
			this.$refs.formModel.validate(valid => {
				if (valid) {
					this.visible = false;
					this.$emit('clickOk', this.form.cancelReason);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.cancel-modal {
	/deep/ .ant-modal-body {
		padding: 20px 20px 4px 20px;
	}
	/deep/ .ant-modal-close {
		display: none;
	}
	.model-title {
		width: 100%;
		height: 26px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		span {
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 500;
			line-height: 28px;
		}
	}
	.tip-wrap {
		span {
			height: 26px;
			display: inline-block;
			font-size: 18px;
			font-style: normal;
			font-weight: 500;
		}
		width: 140px;
		height: 26px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}
	.textarea-wrap {
		width: 450px;
		height: 150px;
		background: rgba(129, 145, 169, 0.1);
		resize: none;
	}
	.desc-tip {
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		color: rgba(0, 0, 0, 0.25);
		margin: 14px 0 16px 0;
	}
	/deep/.ant-modal-footer {
		border: none;
		padding: 0 20px 20px 20px;
		.ant-btn {
			width: 90px;
		}
		button + button {
			margin-left: 20px;
		}
	}
	/deep/.ant-input::placeholder {
		color: #8191a9;
	}
	form textarea.ant-input {
		margin-bottom: 0 !important;
		border: none !important;
	}
	.close-icon {
		cursor: pointer;
	}
	/deep/.ant-form {
		height: 168px;
	}
}
</style>
