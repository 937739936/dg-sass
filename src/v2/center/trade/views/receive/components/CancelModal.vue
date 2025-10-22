<template>
	<a-modal
		:visible="visible"
		:footer="null"
		centered
		width="490px"
		@cancel="handleCancel"
		:title="null"
		:destroyOnClose="true"
	>
		<div class="title">确认作废该发货批次?</div>
		<div style="padding: 0 20px 20px">
			<a-form
				:form="form"
				@submit="handleSubmit"
			>
				<a-form-item>
					<a-textarea
						:maxLength="100"
						class="zf-textarea"
						placeholder="请输入作废原因..."
						v-decorator="['cancelReason', { rules: [{ required: true, message: '作废原因必填' }] }]"
					/>
				</a-form-item>
			</a-form>
			<div class="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button
					type="primary"
					@click="handleSubmit"
					>确定</a-button
				>
			</div>
		</div>
	</a-modal>
</template>

<script>
import { API_getCancelRecord } from '@/v2/center/trade/api/receive';

export default {
	data() {
		return {
			visible: false,
			deliverId: '',
			form: this.$form.createForm(this)
		};
	},
	methods: {
		init(deliverId) {
			this.deliverId = deliverId;
			this.visible = true;
		},
		handleCancel() {
			this.visible = false;
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					API_getCancelRecord({
						deliverId: this.deliverId,
						cancelReason: values.cancelReason
					}).then(res => {
						this.visible = false;
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.$emit('ok');
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	padding-left: 20px;
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}
.footer {
	text-align: right;

	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}

.zf-textarea {
	width: 450px;
	height: 150px !important;
	font-size: 14px;
	line-height: 20px;
	padding: 16px 14px;
	background: #f3f5f6;
	color: rgba(0, 0, 0, 0.8);

	&::-webkit-input-placeholder {
		color: #8191a9;
	}
}
/deep/ .ant-modal-content {
	border-radius: 10px;
}
</style>
