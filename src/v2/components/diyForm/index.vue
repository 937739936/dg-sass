<template>
	<div style="padding-top: 100px">
		<a-form
			:form="form"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
			@submit="handleSubmit"
		>
			<a-form-item label="Note">
				<span v-mainTip="form.getFieldValue('note')">第一种测试，展示下面输入框内容</span>
				<span v-mainTip="{ value: form.getFieldValue('note'), position: 'left' }">第二种测试，展示对象</span>
				<span v-mainTip="{ val: form.getFieldValue('note'), position: 'left' }">第三种测试，展示错误对象</span>
				<span v-mainTip="[form.getFieldValue('note')]">第四种测试，展示数组</span>
			</a-form-item>
			<a-form-item label="Note">
				<a-input
					v-inputTip
					v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
				/>
			</a-form-item>
			<a-form-item label="Gender">
				<a-select
					v-decorator="['gender', { rules: [{ required: true, message: 'Please select your gender!' }] }]"
					placeholder="Select a option and change input text above"
					@change="handleSelectChange"
				>
					<a-select-option value="male"> male </a-select-option>
					<a-select-option value="female"> female </a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-button
					type="primary"
					html-type="submit"
				>
					Submit
				</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated' })
		};
	},
	methods: {
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
				}
			});
		},
		handleSelectChange(value) {
			console.log(value);
			this.form.setFieldsValue({
				note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
			});
		}
	}
};
</script>
