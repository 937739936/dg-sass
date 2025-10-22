<template>
	<a-modal
		title="转移提货"
		:visible="visible"
		@ok="handleOk"
		@cancel="handleCancel"
		destroyOnClose
	>
		<p>
			<a-form
				:form="form"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 18 }"
			>
				<a-form-item label="选择业务线">
					<a-select
						@change="businessChange"
						v-decorator="[
							'businessLineFullNo',
							{
								rules: [{ required: true, message: '请选择业务线!' }]
							}
						]"
						:disabled="item.businessLineFullNo ? true : false"
					>
						<a-select-option
							class="transfer-goods-select-item"
							:value="item.relationNo"
							v-for="item in businessList"
							:key="item.relationNo"
						>
							<p class="complete-name">{{ item.companyName }}</p>
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="选择转移企业">
					<a-select
						v-decorator="[
							'companyUscc',
							{
								rules: [{ required: true, message: '请选择转移企业!' }]
							}
						]"
					>
						<a-select-option
							class="transfer-goods-select-item"
							:value="item.uscc"
							v-for="item in company"
							:key="item.uscc"
						>
							<p class="complete-name">{{ item.name }}</p>
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
		</p>
	</a-modal>
</template>

<script>
import { API_GetCompanyBusinessLineList, transferApply } from '@/v2/center/steels/api/orderApply';

export default {
	data() {
		return {
			visible: false,
			form: this.$form.createForm(this, { name: 'coordinated' }),
			businessList: [],
			company: [],
			item: {}
		};
	},
	methods: {
		businessChange(id) {
			this.company = this.businessList.filter(item => item.relationNo == id)[0]?.companyList;
		},
		showModal(item) {
			this.visible = true;
			this.item = item;
			this.getBusinessLine(item.id);
			this.$nextTick(() => {
				if (item.businessLineFullNo) {
					this.form.setFieldsValue({
						businessLineFullNo: item.businessLineFullNo
					});
				}
			});
		},
		handleOk() {
			this.form.validateFields((errors, values) => {
				if (!errors) {
					transferApply({
						id: this.item.id.toString(),
						...values
					}).then(res => {
						if (res.success) {
							this.$message.success('转移成功');
							this.visible = false;
							this.$emit('update', true);
						}
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
		getBusinessLine(id) {
			API_GetCompanyBusinessLineList({
				applyId: id
			}).then(res => {
				if (res.success) {
					this.businessList = res.data;
					if (this.businessList.length == 1) {
						this.form.setFieldsValue({
							businessLineFullNo: res.data[0].relationNo
						});
						this.businessChange(res.data[0].relationNo);
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.transfer-goods-select-item {
	.complete-name:hover {
		white-space: normal !important;
	}
}
.ant-select-disabled {
	.complete-name:hover {
		overflow-x: auto;
	}
}
</style>
