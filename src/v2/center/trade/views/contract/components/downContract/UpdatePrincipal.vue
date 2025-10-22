<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="修改业务负责人"
		:width="400"
		@cancel="close"
	>
		<a-form
			class="slFormDetail"
			:form="form"
		>
			<a-row :gutter="24">
				<a-col :span="24">
					<a-form-item label="当前业务实际游负责人">
						<a-input
							type="text"
							disabled
							:value="terminalDirectorBusiness"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="24">
					<a-form-item label="修改业务实际游负责">
						<a-select
							placeholder="请选择新的业务实际负责人"
							showSearch
							:notFoundContent="!upDownUserList.length ? '加载中...' : null"
							:filterOption="filterOption"
							:defaultActiveFirstOption="false"
							:dropdownMatchSelectWidth="false"
							v-decorator="[
								`businessOwnershipTeamConfigId`,
								{
									rules: [
										{
											required: true,
											message: `请选择新的业务实际负责人`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in upDownUserList"
								:key="index"
								:value="items.id"
							>
								{{ items.businessUnitName }}-{{ items.department }}-{{ items.memberName }}-{{ items.memberMobile }}
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
import { API_listTerminalDirector } from '@/v2/center/trade/api/contract';
import {
	saveOfflineContractDirector,
	getBuyDownContractDetail,
	getSellDownContractDetail
} from '@/v2/center/trade/api/downcontract';

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			visible: false,
			upDownUserList: [], // 负责人列表
			info: {},
			terminalDirectorBusiness: ''
		};
	},
	computed: {},
	methods: {
		filterOption,
		// 获取上下游业务负责人
		async getUpDownUserList() {
			const res = await API_listTerminalDirector();
			this.upDownUserList = res.data;
		},
		async show(data, type) {
			this.form.resetFields();
			const Fn = type == 'BUY' ? getBuyDownContractDetail : getSellDownContractDetail;
			const res = await Fn({ id: data.id });
			this.info = res.data;
			if (res.data.businessOwnershipTeamConfig) {
				const businessOwnershipTeamConfig = this.info.businessOwnershipTeamConfig || {};
				const { businessUnitName, memberName, memberMobile } = businessOwnershipTeamConfig;
				this.terminalDirectorBusiness = `${businessUnitName ? businessUnitName + '-' : ''}${memberName ? memberName + '-' : ''}${memberMobile || ''}`;
			}

			this.visible = true;
			this.getUpDownUserList();
		},
		close() {
			this.visible = false;
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					saveOfflineContractDirector({
						contractNo: this.info.contractNo,
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
