<template>
	<div class="background-wrapper">
		<ReceiptInfo title="出仓单开具审核"></ReceiptInfo>
		<a-card :bordered="false">
			<a-form
				:form="form"
				v-bind="formLayout"
			>
				<a-col :span="24">
					<a-form-item
						:label-col="{ span: 3 }"
						:wrapper-col="{ span: 19 }"
						label="审批意见"
						:colon="false"
					>
						<a-textarea
							placeholder="请输入审批意见"
							v-decorator="[
								'auditOpinion',
								{
									rules: [
										{ required: true, message: '请输入审批意见' },
										{ max: 500, message: `审批意见长度不能超过500个字符` }
									],
									validateTrigger: 'change'
								}
							]"
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-form>
			<div class="tc">
				<a-button
					type="primary"
					style="margin: 0px 50px"
					:disabled="loading"
					@click="audit(false)"
					>拒绝</a-button
				>
				<a-button
					type="primary"
					@click="audit(true)"
					:disabled="loading"
					>审批通过</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import ReceiptInfo from './components/ReceiptInfo.vue';
import { API_OutWarehouseReceiptAudit } from '@/v2/center/storage/api';

export default {
	name: 'storageCenterOutAudit',
	components: {
		ReceiptInfo
	},

	data() {
		return {
			form: this.$form.createForm(this),
			loading: false,
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 14
				}
			},
			url: []
		};
	},
	methods: {
		audit(auditResult) {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const params = {
						...values,
						auditResult,
						id: this.$route.query.id
					};
					this.loading = true;
					API_OutWarehouseReceiptAudit(params)
						.then(res => {
							if (res.success) {
								this.$message.success('审批成功');
								this.$router.push({
									path: '/center/storageCenter/out/receipt'
								});
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
</style>
