<template>
	<div
		class="slMain"
		style="margin: 0"
	>
		<a-card
			:bordered="false"
			style="padding: 0"
		>
			<div class="task">
				<div class="top">发票四要素</div>
			</div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item
							label="发票代码"
							style="width: 364px"
						>
							<a-input
								placeholder="请输入发票代码"
								:maxLength="200"
								v-decorator="[`code`, { rules: [{ required: true, message: `发票代码必须填写`, whitespace: true }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="发票号码"
								style="width: 364px"
							>
								<a-input
									placeholder="请输入发票号码"
									:maxLength="200"
									v-decorator="[`no`, { rules: [{ required: true, message: `发票号码必须填写`, whitespace: true }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="开票日期"
								style="width: 364px"
							>
								<a-date-picker
									style="width: 100%"
									placeholder="请选择开票日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`issuedDate`,
										{
											rules: [{ required: true, message: `签订日期必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item
								label="合计金额(不含税)"
								style="width: 364px"
							>
								<a-input-number
									placeholder="请输入合计金额"
									:precision="2"
									:min="0.01"
									v-decorator="[`taxExcludedAmount`, { rules: [{ required: true, message: `合计金额必须填写` }] }]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: this.$form.createForm(this)
		};
	},
	methods: {
		save() {
			return new Promise((resolve, reject) => {
				this.form.validateFields((error, values) => {
					if (error) {
						reject(false);
						return;
					}
					resolve(values);
				});
			});
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.upload-box,
.task {
	margin-top: 30px;

	.top {
		font-family: 'PingFang SC';
		height: 32px;
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 32px;
		color: rgba(0, 0, 0, 0.8);
		position: relative;
		padding-left: 12px;

		&:before {
			content: '';
			top: 7px;
			position: absolute;
			display: block;
			width: 4px;
			height: 18px;
			left: 0;
			background: #4682f3;
		}
	}
}
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
</style>
