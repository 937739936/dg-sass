<template>
	<div>
		<a-modal
			title="修改关联业务线"
			:visible="visible"
			@ok="handleOk"
			@cancel="handleCancel"
			class="business-change-modal slModal"
		>
			<a-form
				:form="form"
				layout="vertical"
			>
				<a-form-item label="当前关联业务线号">
					<a-input
						disabled
						v-decorator="['businessLineNo', { rules: [{ required: false, message: '当前关联业务线号' }] }]"
						placeholder="当前关联业务线号"
					/>
				</a-form-item>
				<a-form-item label="修改后关联业务线号">
					<a-input
						v-decorator="[
							'businessLineNoNew',
							{
								rules: [
									{ required: true, message: '' },
									{ validator: (rule, value, callback) => validateFieldsError(rule, value, callback) }
								]
							}
						]"
						@click="relationBusinessLine"
						placeholder="请选择修改后关联业务线号"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<BusinessLine
			:type="this.$route.query.type === 'SELL' ? 'buy' : 'sell'"
			ref="businessLine"
			@detail="getRelationOrderDetail"
			:businessLineId="businessLineId"
		/>
	</div>
</template>

<script>
import BusinessLine from '../components/BusinessLine.vue';
import { API_change_businessline } from '@/v2/center/trade/api/transportContract';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'changeBusinessLine' }),
			visible: false,
			businessLineId: '',
			details: {}
		};
	},
	components: {
		BusinessLine
	},
	methods: {
		validateFieldsError(rule, value, callback) {
			if (!value) {
				callback('请选择新的关联业务线号');
				return;
			}
			if (value == this.form.getFieldValue('businessLineNo')) {
				callback('新业务线号与修改前一致，请重新选择');
				return;
			}
			callback();
		},
		relationBusinessLine() {
			this.$refs.businessLine.showRelationOrderList();
		},
		getRelationOrderDetail(item) {
			if (item.businessLineNo) {
				this.businessLineId = item.id;
				this.form.setFieldsValue({
					businessLineNoNew: item.businessLineNo
				});
			}
		},
		showModal(item) {
			this.details = item;
			this.visible = true;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					businessLineNo: item.businessLineNo
				});
			});
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_change_businessline({
						id: this.details.id,
						businessLineNo: values.businessLineNoNew
					}).then(res => {
						if (res.success) {
							this.$message.success('修改成功');
							this.visible = false;
							this.$emit('updateFunc', true);
							this.form.resetFields();
						}
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.form.resetFields();
		}
	}
};
</script>

<style lang="less" scoped>
.business-change-modal {
	/deep/ .ant-modal-header {
		background: #f3f5f6 !important;
	}
	/deep/ .ant-modal-title {
		font-size: 20px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		color: rgba(0, 0, 0, 0.8);
		line-height: 28px;
	}
	/deep/ .ant-form-item-label > label {
		color: rgba(0, 0, 0, 0.4);
	}
	/deep/ .ant-btn {
		width: 90px;
	}
	/deep/ .ant-modal-body {
		padding: 20px 30px 33px 30px;
	}
	/deep/ .ant-modal-footer {
		height: 72px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 30px;
	}
	/deep/ .ant-btn-primary {
		margin-left: 30px;
	}
}
</style>
