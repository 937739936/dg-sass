<template>
	<div class="background-wrapper">
		<ReceiptInfo
			title="出仓单作废"
			:showNum="false"
		></ReceiptInfo>

		<a-card :bordered="false">
			<a-form
				:form="form"
				v-bind="formLayout"
			>
				<a-form-item
					:label-col="{ span: 3 }"
					:wrapper-col="{ span: 19 }"
					label="作废事由"
					:colon="false"
				>
					<a-textarea
						placeholder="请输入作废事由"
						v-decorator="[
							'cancelCause',
							{
								rules: [
									{ required: true, message: '请输入作废事由' },
									{ max: 200, message: `作废事由长度不能超过200个字符` }
								],
								validateTrigger: 'change'
							}
						]"
					></a-textarea>
				</a-form-item>
			</a-form>
			<div
				class="tc"
				:span="24"
				style="margin-top: 16px"
			>
				<a-button
					style="margin: 0px 50px"
					@click="$router.go(-1)"
					>取消</a-button
				>
				<a-button
					type="primary"
					:disabled="loading"
					@click="save"
					>确认作废</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_OutWarehouseReceiptCancel } from '@/v2/center/storage/api';
import ReceiptInfo from './components/ReceiptInfo.vue';

export default {
	name: 'storageCenterOutReceiptVoid',
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
			}
		};
	},

	methods: {
		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const params = {
						...values,
						...this.$route.query
					};
					this.loading = true;
					API_OutWarehouseReceiptCancel(params)
						.then(res => {
							if (res.success) {
								this.$message.success('作废成功');
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
