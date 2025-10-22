<template>
	<div
		style="width: 100%; overflow-x: hidden"
		class="center-user"
	>
		<div class="s-card">
			<div class="s-card-title">联系人管理</div>
			<div class="s-card-content">
				<div style="overflow: hidden">
					<a-button
						type="primary"
						style="float: right; margin-bottom: 20px"
						@click="addContact"
						>新增联系人</a-button
					>
				</div>
				<a-table
					:columns="columns"
					:data-source="templateContactList"
					:scroll="{ x: true }"
					rowKey="id"
					:pagination="false"
				>
					<span
						slot="contactArea"
						slot-scope="contactArea, items"
					>
						<span>{{ contactArea.join('/') }}</span>
					</span>

					<span slot="customTitle"> 操作 </span>
					<template
						slot="action"
						slot-scope="action, item"
					>
						<a
							href="javascript:;"
							@click="editContact(item)"
							>修改</a
						>&nbsp;
						<a
							href="javascript:;"
							@click="deleteContact(item)"
							>删除</a
						>
					</template>
				</a-table>
			</div>
		</div>
		<a-modal
			class="contact-model"
			v-model="visible"
			:title="type == 'add' ? '新增' : '修改' + '联系人信息'"
			okText="保存"
			@ok="handleOk"
			@cancel="visible = false"
			:width="660"
		>
			<a-form-model
				v-if="visible"
				ref="addForm"
				:model="form"
				:rules="rules"
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
			>
				<a-form-model-item
					prop="contactName"
					label="联系人姓名"
				>
					<a-input
						v-model="form.contactName"
						placeholder="请输入联系人姓名"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactPhone"
					label="联系人手机号"
				>
					<a-input
						v-model="form.contactPhone"
						placeholder="请输入联系人手机号"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactArea"
					label="联系人所在区"
				>
					<a-cascader
						v-model="form.contactArea"
						placeholder="请选择联系人所在区"
						:options="area"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactAddress"
					label="联系人详细地址"
				>
					<a-input
						v-model="form.contactAddress"
						placeholder="请输入联系人详细地址"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactEmail"
					label="联系人电子邮箱"
				>
					<a-input
						v-model="form.contactEmail"
						placeholder="请输入联系人电子邮箱"
					/>
				</a-form-model-item>
			</a-form-model>
		</a-modal>
	</div>
</template>

<script>
const columns = [
	{
		title: '联系人姓名',
		dataIndex: 'contactName',
		key: 'contactName',
		width: 150
	},
	{
		title: '联系人手机号',
		dataIndex: 'contactPhone',
		key: 'contactPhone',
		width: 150
	},
	{
		title: '联系人所在区',
		dataIndex: 'contactArea',
		key: 'contactArea',
		scopedSlots: { customRender: 'contactArea' },
		width: 200
	},
	{
		title: '联系人详细地址',
		dataIndex: 'contactAddress',
		key: 'contactAddress',
		width: 200
	},
	{
		title: '联系人电子邮箱',
		dataIndex: 'contactEmail',
		key: 'contactEmail',
		width: 200
	},
	{
		key: 'action',
		fixed: 'right',
		slots: { title: 'customTitle' },
		width: 120,
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
import { area } from '@sub/utils/area.js';
import {
	API_COMPANYCONTACTLIST,
	API_COMPANYCONTACTADD,
	API_COMPANYCONTACTMODIFY,
	API_COMPANYCONTACTDELETE
} from '@/v2/center/person/api';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			form: {
				contactName: '',
				contactPhone: '',
				contactAddress: '',
				contactArea: [],
				contactEmail: ''
			},
			type: '',
			rules: {
				contactName: [
					{
						required: true,
						message: '请输入联系人姓名',
						trigger: ['blur', 'change']
					}
				],
				contactPhone: [
					{
						required: true,
						pattern: /^1[3456789]\d{9}$/,
						message: '请输入联系人手机号',
						trigger: ['blur', 'change']
					}
				],
				contactAddress: [
					{
						required: true,
						message: '请输入联系人详细地址',
						trigger: ['blur', 'change']
					}
				],
				contactArea: [
					{
						required: true,
						type: 'array',
						message: '请输入联系人所在区',
						trigger: ['blur', 'change']
					}
				],
				contactEmail: [
					{
						required: true,
						type: 'email',
						message: '请输入联系人电子邮箱',
						trigger: ['blur', 'change']
					}
				]
			},
			visible: false,
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			columns: columns,
			area,
			templateContactList: [
				{
					id: '23123123123',
					companyId: '23123123123',
					contactName: '杨帆',
					contactPhone: '188666633333',
					contactArea: ['北京市', '北京市', '东城区'],
					contactAddress: '北京市西城区宣武门外大街10号庄胜广场中央办公楼南翼19楼',
					contactEmail: 'qq@com'
				}
			]
		};
	},
	created() {
		this.fetchData();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		async fetchData() {
			let res = await API_COMPANYCONTACTLIST();
			this.templateContactList = res.success ? res.result : [];
		},
		async handleOk() {
			let check;
			try {
				check = await this.$refs.addForm.validate();
			} catch (e) {
				check = e;
			}
			let func = this.type == 'add' ? API_COMPANYCONTACTADD : API_COMPANYCONTACTMODIFY;

			if (!check) return;
			let res = await func({
				companyId: this.VUEX_ST_COMPANYSUER.companyId,
				...this.form
			});
			if (res.success) {
				this.$message.success('操作成功');
				this.visible = false;
				this.fetchData();
			}
		},
		async addContact() {
			this.visible = true;
			this.type = 'add';
			this.form = {
				contactName: '',
				contactPhone: '',
				contactAddress: '',
				contactArea: [],
				contactEmail: ''
			};
		},
		editContact(item) {
			this.visible = true;
			this.type = 'edit';
			this.form = {
				...item
			};
		},
		deleteContact(item) {
			this.$confirm({
				closable: true,
				content: '确认删除联系人信息？',
				okText: '确认',
				onOk: async () => {
					let res = await API_COMPANYCONTACTDELETE(item);
					if (res.success) {
						this.$message.success('操作成功');
						this.fetchData();
					}
				},
				cancelText: '取消',
				onCancel() {}
			});
		}
	}
};
</script>

<style lang="less">
.center-user {
	.control-wrap {
		a {
			display: inline-block;
			padding: 0 6px;
		}
	}
	.ant-table-wrapper {
		width: 100%;
	}
}
</style>
