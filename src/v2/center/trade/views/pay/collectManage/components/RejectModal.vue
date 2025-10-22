<template>
	<a-modal
		class="del-modal slModal"
		:visible="visible"
		:width="490"
		@cancel="close"
		:forceRender="true"
		:destroyOnClose="true"
		title="驳回"
	>
		<a-form :form="form">
			<a-form-item>
				<a-input
					:placeholder="placeholder"
					type="textarea"
					class="textarea"
					:maxLength="200"
					v-decorator="[
						'rejectReason',
						{
							rules: [{ required: true, message: '驳回原因必填' }]
						}
					]"
				></a-input>
			</a-form-item>
		</a-form>
		<template slot="footer">
			<a-button
				key="back"
				@click="visible = false"
				class="cancel-btn"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="save"
				style="margin-left: 20px"
				>确定</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import { API_ConllectConfirmOrReject } from '@/v2/center/trade/api/pay';

export default {
	name: 'RejectModal',
	props: {},
	computed: {},
	data() {
		return {
			form: this.$form.createForm(this),
			visible: false,
			placeholder: '请输入驳回原因，如付款金额错误、付款日期错误等，最多200字...',
			rejectReason: '',
			paymentNo: ''
		};
	},
	methods: {
		showModal(paymentNo) {
			this.paymentNo = paymentNo;
			this.visible = true;
		},
		close() {
			this.paymentNo = '';
			this.visible = false;
		},
		save() {
			this.form.validateFields((err, values) => {
				if (err) {
					return;
				}
				let { rejectReason } = values;
				this.rejectSubmit(rejectReason);
			});
		},
		rejectSubmit(rejectReason) {
			API_ConllectConfirmOrReject({
				paymentNo: this.paymentNo,
				confirmResult: false,
				rejectReason: rejectReason
			})
				.then(res => {
					if (res.success) {
						this.$message.success('收款已驳回');
						this.visible = false;
						this.$router.back();
					} else {
						this.$message.error('驳回失败');
					}
				})
				.catch(() => {
					this.$message.error('驳回失败');
				});
		}
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 0px;
	padding: 0px 20px;
}
/deep/ .ant-modal-header {
	background-color: #fff;
	padding: 16px 20px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}

.textarea {
	height: 150px;
	flex-shrink: 0;
	border-radius: 4px;
	background: rgba(129, 145, 169, 0.1);
	margin-top: 14px;
	margin-bottom: 20px;
	/deep/ .ant-input {
		height: 100%;
	}
}
</style>
