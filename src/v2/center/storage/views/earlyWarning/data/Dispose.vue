<template>
	<div class="background-wrapper">
		<EarlyWarningInfo
			title="预警数据 - 跟踪处理"
			:frequency="frequency"
		/>
		<a-card :bordered="false">
			<a-form-model
				:model="form"
				ref="form"
				:label-col="{ span: 4 }"
				:rules="rules"
				:wrapper-col="{ span: 14 }"
			>
				<a-form-model-item
					label="补充跟踪记录"
					prop="content"
				>
					<a-textarea
						:maxLength="200"
						v-model="form.content"
					/>
				</a-form-model-item>
				<a-form-model-item
					label="处理人"
					prop="manager"
				>
					<a-input
						:maxLength="10"
						v-model="form.manager"
					/>
				</a-form-model-item>
				<a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
					<a-button
						type="primary"
						@click="onSubmit"
						:disabled="disabled"
					>
						保存
					</a-button>
				</a-form-model-item>
			</a-form-model>
		</a-card>
	</div>
</template>

<script>
import { API_GrainSituationSaveWarningTracking } from '@/v2/center/storage/api';
import EarlyWarningInfo from './components/EarlyWarningInfo.vue';

export default {
	name: 'earlyWarningDataDispose',
	components: {
		EarlyWarningInfo
	},
	created() {
		this.id = this.$route.query.id;
	},
	data() {
		return {
			id: '',
			frequency: 1, //请求次数，保存成功后增加一次请求次数
			form: {
				content: '',
				manager: ''
			},
			rules: {
				content: [
					{
						required: true,
						whitespace: true,
						message: '请补充跟踪记录',
						trigger: ['blur', 'change']
					},
					{
						max: 200,
						message: '跟踪记录最多200字节',
						trigger: ['blur', 'change']
					}
				],
				manager: [
					{
						required: true,
						whitespace: true,
						message: '请填写处理人',
						trigger: ['blur', 'change']
					},
					{
						max: 10,
						message: '处理人最多10字节',
						trigger: ['blur', 'change']
					}
				]
			},
			disabled: false //保持按钮是否禁用，提交时禁用
		};
	},
	methods: {
		onSubmit() {
			//如果补充跟踪记录和处理人都为空，返回上一级
			if (!this.form.content && !this.form.manager) {
				this.$router.go(-1);
				return;
			}
			this.$refs.form.validate(async valid => {
				if (valid) {
					// 验证成功，提交数据
					let form = { ...this.form };
					form.warningId = this.id;
					this.disabled = true;
					let res = await API_GrainSituationSaveWarningTracking(form);
					this.disabled = false;
					if (res.success) {
						//保存成功，清空表格刷新详情
						this.$message.success('保存成功！');
						this.$refs.form.resetFields();
						this.frequency += 1;
					} else {
						this.$message.error('保存失败，请联系管理员！');
					}
				} else {
					return false;
				}
			});
		}
	}
};
</script>
