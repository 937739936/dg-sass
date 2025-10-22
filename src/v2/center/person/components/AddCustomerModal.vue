<template>
	<a-modal
		title="新增客户"
		:visible="visible"
		:maskClosable="false"
		width="700px"
		@ok="handleOk"
		@cancel="handleCancel"
		class="slModal"
	>
		<template #footer>
			<a-button @click="handleCancel">取消</a-button>
			<a-button
				type="primary"
				@click="handleOk"
				:loading="saveLoading"
				>确定</a-button
			>
		</template>
		<a-form-model
			:model="formData"
			ref="formData"
			:rules="rules"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 14 }"
		>
			<a-form-model-item
				label="企业名称"
				prop="name"
			>
				<a-input
					:maxLength="1000"
					v-model="formData.name"
					placeholder="请输入企业名称"
				/>
			</a-form-model-item>
			<a-form-model-item label="社会统一信用代码">
				{{ formData.creditCode }}
			</a-form-model-item>
			<a-form-model-item label="法定代表人">
				{{ formData.legalPersonName }}
			</a-form-model-item>
			<a-form-model-item label="成立日期">
				{{ formData.establishDate }}
			</a-form-model-item>
			<a-form-model-item label="注册地址">
				{{ formData.address }}
			</a-form-model-item>
			<a-form-model-item label="经营期限(止)">
				{{ formData.termEndDateIsLongValid ? '长期有效' : formData.termEndDate }}
			</a-form-model-item>
			<a-form-model-item label="企业简称">
				<a-input
					:maxLength="20"
					v-model="formData.abbreviation"
					placeholder="请输入企业简称"
				/>
			</a-form-model-item>
			<a-form-model-item
				label="客户类别"
				prop="type"
			>
				<a-auto-complete
					v-model="formData.type"
					:data-source="typeList"
					placeholder="请输入客户类别"
				/>
			</a-form-model-item>
			<a-form-model-item
				label="联系人姓名"
				prop="linkmanName"
			>
				<a-input
					:maxLength="50"
					v-model="formData.linkmanName"
					placeholder="请输入联系人姓名"
				/>
			</a-form-model-item>
			<a-form-model-item
				label="联系人电话"
				prop="linkmanMobile"
			>
				<a-input
					:maxLength="13"
					v-model="formData.linkmanMobile"
					placeholder="请输入联系人电话"
				/>
			</a-form-model-item>
			<a-form-model-item label="负责人姓名">
				<a-select
					v-model="formData.headName"
					placeholder="请选择负责人"
					allowClear
					@change="principalChange"
				>
					<a-select-option
						v-for="items in principalList"
						:key="items.id"
						:value="items.name"
					>
						{{ items.name }}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="负责人电话">
				<a-input
					v-model="formData.headMobile"
					disabled
					placeholder="负责人电话"
				/>
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import { API_COMPANYCUSTOMERTYPEADD, API_COMPANYUSERLIST } from 'api/account';
import { API_TianYanCha } from '@/v2/center/person/api';
import moment from 'moment';
export default {
	props: {
		visible: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		typeList: {
			type: Array,
			default: () => []
		},
		ok: {
			type: Function,
			default: () => {
				return () => {};
			}
		},
		cancel: {
			type: Function,
			default: () => {
				return () => {};
			}
		}
	},
	data() {
		return {
			formData: {
				name: '',
				creditCode: '',
				legalPersonName: '',
				establishDate: '',
				address: '',
				termEndDate: '',
				abbreviation: '',
				type: undefined,
				linkmanName: '',
				linkmanMobile: ''
			},
			principalList: [], //负责人信息
			saveLoading: false,
			rules: {
				name: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
					{ validator: this.getValid('name'), trigger: 'blur' }
				],
				type: {
					required: true,
					whitespace: true,
					message: '请选择客户类别',
					trigger: 'change'
				},
				linkmanName: {
					required: false,
					message: '请输入联系人名称',
					whitespace: true,
					trigger: 'blur'
				},
				linkmanMobile: {
					required: false,
					message: '请输入正确的联系人电话',
					pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
					trigger: 'blur'
				}
			}
		};
	},
	mounted() {
		this.getCompanyPersonalUserList();
	},
	methods: {
		handleOk() {
			this.$refs.formData.validate(valid => {
				if (!valid) {
					return false;
				}
				if (!this.formData.establishDate) {
					this.$message.error('成立日期不允许为空');
					return false;
				}
				this.saveLoading = true;
				API_COMPANYCUSTOMERTYPEADD(this.formData)
					.then(res => {
						this.saveLoading = false;
						if (res.success && res.data) {
							this.$message.success('添加成功');
							this.resetModal();
							this.ok();
						}
					})
					.finally(() => {
						this.saveLoading = false;
					});
			});
		},
		resetModal() {
			this.formData = {
				name: '',
				creditCode: '',
				legalPersonName: '',
				establishDate: '',
				address: '',
				termEndDate: '',
				abbreviation: '',
				type: undefined,
				linkmanName: '',
				linkmanMobile: ''
			};
			this.$nextTick(() => {
				this.$refs.formData.resetFields();
			});
		},
		handleCancel() {
			this.resetModal();
			this.cancel();
		},
		getValid(v) {
			const valids = {
				linkmanMobile: this.checkMobile,
				name: this.validateName
			};
			return valids[v] || '';
		},
		checkMobile(rule, value, callback) {
			if (!value) {
				callback();
			}
			if (!/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/.test(value)) {
				callback('电话格式不正确');
			}
		},
		//企业名称校验
		validateName(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			this.formData.creditCode = '';
			this.formData.legalPersonName = '';
			this.formData.establishDate = '';
			this.formData.address = '';
			this.formData.termEndDate = '';
			API_TianYanCha({ keyword: value })
				.then(res => {
					if (res.success) {
						let data = res.data;
						if (data && data.creditCode) {
							let formData = this.formData;
							formData.establishDate = moment(data.estiblishTime).format('YYYY-MM-DD');
							formData.creditCode = data.creditCode || '';
							formData.legalPersonName = data.legalPersonName || '';
							formData.address = data.regLocation || '';
							formData.termEndDateIsLongValid = data.toTime ? false : true;
							formData.termEndDate = '';
							formData.abbreviation = data.alias;
							if (data.toTime) {
								formData.termEndDate = moment(data.toTime).format('YYYY-MM-DD');
							}
							callback();
						} else {
							callback('请仔细确认企业名称。');
						}
					} else {
						callback('请仔细确认企业名称。');
					}
				})
				.catch(() => {
					callback('请仔细确认企业名称。');
				});
		},
		//负责任人变化
		principalChange(value) {
			let obj = this.principalList.find(item => {
				return item.name == value;
			});
			if (obj) {
				this.formData.headMobile = obj.mobile;
			} else {
				this.formData.headMobile = '';
			}
		},
		//获取负责人列表，取值范围为为当前登录企业的用户列表；
		getCompanyPersonalUserList() {
			API_COMPANYUSERLIST().then(res => {
				if (res.success) {
					this.principalList = res.data.map(item => {
						const { mobile, name } = item.personal;
						return {
							id: item.id,
							mobile,
							name
						};
					});
				}
			});
		}
	}
};
</script>
