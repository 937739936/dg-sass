<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="修改实际负责人"
		@cancel="close"
	>
		<p class="reminder-tips">修改后，该合同对应的上下游数据将由修改后的账号进行维护。</p>
		<a-form
			class="slFormDetail"
			:form="form"
		>
			<a-row :gutter="24">
				<a-col :span="12">
					<a-form-item label="当前上游负责人">
						<a-input
							type="text"
							disabled
							:value="directorBusiness"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="修改后上游负责人">
						<a-select
							placeholder="请选择新的上游实际负责人"
							showSearch
							:notFoundContent="!terminalDirector.length ? '加载中...' : null"
							:filterOption="filterOption"
							:defaultActiveFirstOption="false"
							:dropdownMatchSelectWidth="false"
							v-decorator="[
								`directorBusinessOwnershipId`,
								{
									rules: [
										{
											required: true,
											message: `请选择新的上游实际负责人`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in terminalDirector"
								:key="index"
								:value="items.id"
							>
								{{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="当前下游负责人">
						<a-input
							type="text"
							disabled
							:value="terminalDirectorBusiness"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="修改后下游负责人">
						<a-select
							placeholder="请选择新的下游实际负责人"
							showSearch
							:notFoundContent="!terminalDirector.length ? '加载中...' : null"
							:filterOption="filterOption"
							:defaultActiveFirstOption="false"
							:dropdownMatchSelectWidth="false"
							v-decorator="[
								`terminalDirectorId`,
								{
									rules: [
										{
											required: true,
											message: `请选择新的下游实际负责人`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in terminalDirector"
								:key="index"
								:value="items.id"
							>
								{{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
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
import { filterOption } from '@/v2/utils/factory.js';
import { API_listTerminalDirector, API_updateTerminalDirector } from '@/v2/center/trade/api/contract';
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			visible: false,
			terminalDirector: [], // 负责人列表
			info: {}
		};
	},
	computed: {
		//上游负责人
		directorBusiness() {
			let { directorBusinessUnitName, director, directorMobile } = this.info;
			return `${
				directorBusinessUnitName ? directorBusinessUnitName + '-' : ''
			}${director ? director + '-' : ''}${directorMobile || ''}`;
		},
		//下游负责人
		terminalDirectorBusiness() {
			let { terminalDirectorBusinessUnitName, terminalDirector, terminalDirectorMobile } = this.info;
			return `${
				terminalDirectorBusinessUnitName ? terminalDirectorBusinessUnitName + '-' : ''
			}${terminalDirector ? terminalDirector + '-' : ''}${terminalDirectorMobile || ''}`;
		}
	},
	methods: {
		filterOption,
		show(data) {
			this.form.resetFields();
			this.info = data;
			this.visible = true;
			API_listTerminalDirector().then(res => {
				this.terminalDirector = res.data;
				this.form.setFieldsValue({ terminalDirectorIdOri: this.info.terminalDirector + ' ' + this.info.terminalDirectorMobile });
			});
		},
		close() {
			this.visible = false;
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_updateTerminalDirector({
						orderId: this.info.id,
						...values
					}).then(res => {
						if (res.success) {
							this.visible = false;
							this.$message.success('修改成功！');
							this.$emit('updateFunc');
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
	/deep/.ant-modal-body {
		padding: 10px 20px;
	}
	/deep/.ant-modal-footer {
		padding: 16px 20px;
	}
	.reminder-tips {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		line-height: 20px;
	}
}
</style>
