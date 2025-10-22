<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="业务转移"
		width="408px"
		@cancel="close"
	>
		<p class="reminder-tips">转移后，该合同的所有权将由转移后的账号负责维护，原业务账号将无法对该合同进行查看和操作。</p>
		<a-form
			class="slFormDetail"
			:form="form"
		>
			<a-form-item label="当前业务账号：">
				<a-input
					type="text"
					disabled
					v-decorator="[`account`, { rules: [{ required: true }] }]"
				>
				</a-input>
			</a-form-item>
			<a-form-item label="转移后业务账号">
				<a-select
					:getPopupContainer="getPopupContainer"
					showSearch
					:filterOption="false"
					:defaultActiveFirstOption="false"
					v-decorator="[
						`companyUserId`,
						{
							rules: [
								{
									required: true,
									message: `请选择转移后业务账号`,
									type: 'string'
								},
								{ validator: validId }
							]
						}
					]"
				>
					<a-select-option
						v-for="(item, index) in acceptUserList"
						:key="index"
						:value="item.id"
						>{{ item.companyUserName }} - {{ item.name || '' }}
					</a-select-option>
				</a-select>
			</a-form-item>
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
				@click="handleSubmit"
			>
				提交
			</a-button>
		</template>
	</a-modal>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import {
	API_listBusinessUserAccept,
	API_getBusinessUserAcceptInfo,
	API_updateBusinessAcceptUser
} from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			getPopupContainer,
			visible: false,
			acceptUserList: [],
			form: this.$form.createForm(this),
			info: {}
		};
	},
	methods: {
		show(data) {
			this.form.resetFields();
			this.info = data;
			this.getOrderAcceptInfo();
			this.visible = true;
		},
		close() {
			this.visible = false;
		},
		validId(rule, value, callback) {
			if (value === this.info.CompanyUserId) {
				callback('转移后业务账号与修改前一致，请重新选择');
				return;
			}
			callback();
		},
		// 获取当前的业务账号
		async getOrderAcceptInfo() {
			const params = {
				orderId: this.info.id
			};
			const res = await API_getBusinessUserAcceptInfo(params);
			let companyUscc = '';
			if (this.info.type == 'BUY') {
				companyUscc = this.info.buyerUscc;
				this.form.setFieldsValue({ account: res.data.buyerCompanyUserName + '-' + (res.data.buyerUserName || '') });
				this.info.CompanyUserId = res.data.buyerCompanyUserId;
			} else {
				companyUscc = this.info.sellerUscc;
				this.form.setFieldsValue({ account: res.data.sellerCompanyUserName + '-' + (res.data.sellerUserName || '') });
				this.info.CompanyUserId = res.data.sellerCompanyUserId;
			}
			this.getAcceptUserList(companyUscc);
		},
		/** 获取转移的业务账号列表 */
		handleSubmit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					const params = {
						orderSerialNo: this.info.serialNo
					};
					if (this.info.type == 'BUY') {
						params.buyerCompanyUserId = values.companyUserId;
						params.sellerCompanyUserId = '';
					} else {
						params.sellerCompanyUserId = values.companyUserId;
						params.buyerCompanyUserId = '';
					}
					API_updateBusinessAcceptUser(params).then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							this.close();
							this.$emit('confirm', 'BusinessTransfer');
						}
					});
				}
			});
		},
		/**获取乙方业务接收人 */
		async getAcceptUserList(companyUscc) {
			const params = {
				companyUscc
			};
			const res = await API_listBusinessUserAccept(params);
			this.acceptUserList = res.data;
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
.slModal {
	.reminder-tips {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		line-height: 20px;
	}
	::v-deep.ant-modal-body {
		max-height: auto !important;
		overflow-y: inherit !important;
	}
}
</style>
