<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="操作提示"
		width="490px"
		height="377px"
		@cancel="close"
	>
		<p class="reminder-tips">驳回后，如再需终止合同，则需要重新走流程，如确需驳回，请继续操作。</p>
		<a-form
			class="slFormDetail"
			:form="form"
		>
			<a-form-item label="请输入驳回原因">
				<a-textarea
					placeholder="请输入驳回原因，最多200字"
					:maxLength="200"
					v-decorator="[
						'rejectReason',
						{
							rules: [
								{
									required: true,
									message: '请输入驳回原因'
								}
							]
						}
					]"
				/>
			</a-form-item>
		</a-form>
		<template slot="footer">
			<a-button
				key="back"
				@click="visible = false"
				class="cancel-btn"
			>
				取消
			</a-button>
			<a-button
				key="submit"
				type="primary"
				@click="submit"
			>
				提交
			</a-button>
		</template>
	</a-modal>
</template>

<script>
import { API_orderConfirmReject } from '@/v2/center/trade/api/contract';
export default {
	data() {
		return {
			visible: false,
			info: {},
			form: this.$form.createForm(this)
		};
	},
	methods: {
		show(info) {
			this.info = info;
			this.visible = true;
		},
		close() {
			this.visible = false;
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_orderConfirmReject({
						orderId: this.info.id,
						rejectReason: values.rejectReason
					}).then(res => {
						if (res.success) {
							this.close();
							this.$emit('confirm');
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slModal {
	.reminder-tips {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		line-height: 20px;
		padding-bottom: 20px;
	}
	.slFormDetail {
		padding: 0;
	}
	::v-deep.ant-modal-body {
		height: 254px !important;
		max-height: auto !important;
	}
	textarea {
		height: 104px;
		resize: none;
	}
}
</style>
