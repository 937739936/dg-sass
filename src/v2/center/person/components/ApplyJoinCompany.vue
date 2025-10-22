<template>
	<a-modal
		v-model="visible"
		destroyOnClose
		title="申请加入企业"
		okText="申请加入"
		@ok="handleOk"
		@cancel="visible = false"
	>
		<div
			v-if="isGroup"
			class="mb8"
		>
			申请加入后，企业管理员将收到加入通知，审核通过后，您将成为企业员工，您只可以同时加入归属同一个集团的公司
		</div>
		<div
			v-else
			class="mb8"
		>
			申请加入后，企业管理员将收到加入通知，审核通过后，您将成为企业员工
		</div>

		<div
			class="mt8 mb8"
			v-if="isGroup && canNotJoinCompanyList.length > 0"
		>
			注：<template v-if="underApprovalCompanyList.length > 0"
				>{{ underApprovalCompanyList.join('、') }}正在认证审批中，审批通过后可以加入；</template
			>
			<template
				v-if="notCertifiedCompanyList.length > 0"
				style="text-indent: 2em"
				>{{ notCertifiedCompanyList.join('、') }}尚未认证，认证后可以加入</template
			>
		</div>
		<a-form
			:form="form"
			v-bind="formLayout"
		>
			<a-form-item
				v-if="isGroup"
				label="公司名称"
				:colon="false"
			>
				<a-select
					style="width: 300px"
					placeholder="请选择要申请加入的企业"
					:options="companyList"
					v-decorator="[
						'companyName',
						{
							rules: [{ required: true, message: '公司名称必填' }],
							validateTrigger: 'blur'
						}
					]"
				>
				</a-select>
			</a-form-item>

			<a-form-item
				v-if="!isGroup"
				label="公司名称"
				:colon="false"
			>
				<a-input
					style="width: 300px"
					placeholder="请输入公司名称"
					v-decorator="[
						'companyName',
						{
							rules: [{ required: true, message: '公司名称必填' }],
							validateTrigger: 'blur'
						}
					]"
				>
				</a-input>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import { API_COMPANYGROUPCANAPPLYLIST, API_COMPANYGROUPCANNOTAPPLYLIST, API_COMPANYUSERAPPLY } from '@/v2/api/account';

export default {
	name: 'ApplyJoinCompany',

	props: {
		isGroup: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			visible: false,
			notCertifiedCompanyList: [],
			underApprovalCompanyList: [],
			companyList: [],
			canNotJoinCompanyList: [],
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: { span: 5 },
				wrapperCol: { span: 10 }
			}
		};
	},

	methods: {
		showModal() {
			this.visible = true;
			if (this.isGroup) {
				API_COMPANYGROUPCANAPPLYLIST().then(res => {
					if (res.success) {
						this.companyList = res.data.map(item => {
							return {
								label: item.name,
								value: item.name
							};
						});
					}
				});

				API_COMPANYGROUPCANNOTAPPLYLIST().then(res => {
					if (res.success) {
						this.canNotJoinCompanyList = res.data;
						this.notCertifiedCompanyList = [];
						this.underApprovalCompanyList = [];
						this.canNotJoinCompanyList.forEach(item => {
							if (item.status === 'CERTIFICATION_APPROVAL') {
								this.underApprovalCompanyList = [...this.underApprovalCompanyList, item.name];
							}
							if (item.status === 'UNAUTHORIZED') {
								this.notCertifiedCompanyList = [...this.notCertifiedCompanyList, item.name];
							}
						});
					}
				});
			}
		},
		// 企业名称加入
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					// if(this.joinedCompany()){
					//   return
					// }
					API_COMPANYUSERAPPLY({ companyName: values.companyName }).then(res => {
						if (res.success) {
							this.$message.success('申请成功，请耐心等待企业管理员审核');
							this.visible = false;
							this.$emit('refresh');
						}
					});

					// API_SEACHCOMPANYLIST({
					//   searchKeys: encodeURIComponent(values.companyName)
					// }).then(res=>{
					//   if(res.code != 200){
					//     this.$message.error(res.message)
					//     return
					//   }
					//   if(!res.result || !res.result.length) {
					//     this.$message.error('没有找到对应企业，请确认企业名是否存在')
					//     return
					//   }
					//   API_JOINCOMPANYBYAPPLY({ companyName: values.companyName }).then(res=>{
					//     if(!res.success){
					//       this.$message.error(res.message)
					//       return
					//     }
					//   })
					// })
				}
			});
		}
	}
};
</script>
