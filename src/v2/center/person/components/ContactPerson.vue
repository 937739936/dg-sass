<template>
	<div
		style="width: 100%; overflow-x: hidden"
		class="center-user"
	>
		<div class="s-card">
			<div class="s-card-content">
				<div style="overflow: hidden">
					<a-form layout="inline">
						<a-form-item :label="false">
							<a-button
								type="primary"
								ghost
								@click="addContact"
								style="margin-right: 20px"
							>
								新增联系人
							</a-button>
							<a-input
								placeholder="请输入联系人姓名或手机号"
								v-model="params.keyword"
								style="width: 300px; margin-right: 20px"
							></a-input>
							<a-space>
								<a-button
									type="primary"
									@click="fetchData()"
									>搜索</a-button
								>
								<a-button
									type="primary"
									@click="reset()"
									>重置</a-button
								>
							</a-space>
						</a-form-item>
					</a-form>
					<span style="float: right; margin-bottom: 20px">注：主要用于合同中的联系人信息和提单中的制单员</span>
				</div>
				<a-table
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:pagination="false"
				>
					<span
						slot="contactName"
						slot-scope="contactName, items"
					>
						<a-tooltip placement="top">
							<template slot="title">
								<span>{{ contactName }}</span>
							</template>
							<span>{{ contactName }}</span>
						</a-tooltip>
					</span>
					<span
						slot="contactAreaArr"
						slot-scope="contactAreaArr, items"
					>
						<span>{{ contactAreaArr }}</span>
					</span>

					<span slot="customTitle">操作</span>
					<template
						slot="action"
						slot-scope="action, item"
					>
						<a
							href="javascript:;"
							v-if="item.isCreator || isAdminRole"
							@click="editContact(item)"
							>编辑</a
						>&nbsp;
						<a
							href="javascript:;"
							v-if="item.isCreator || isAdminRole"
							@click="deleteContact(item)"
							>删除</a
						>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="fetchData"
				/>
			</div>
		</div>
		<a-modal
			class="contact-model"
			v-model="visible"
			destroyOnClose
			:title="type == 'add' ? '新增' : '编辑' + '联系人信息'"
			okText="保存"
			@ok="handleOk"
			@cancel="visible = false"
			:width="660"
		>
			<a-form-model
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
					label="联系电话"
				>
					<a-input
						v-model="form.contactPhone"
						placeholder="请输入联系电话"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactIdCard"
					label="联系人身份证号"
				>
					<a-input
						v-model="form.contactIdCard"
						placeholder="请输入联系人身份证号"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="contactAreaArr"
					label="联系人所在区"
				>
					<a-cascader
						:getPopupContainer="getPopupContainer"
						v-model="form.contactAreaArr"
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
					<p class="tip">联系人详细地址无需输入省市区</p>
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

<script lang="jsx">
import {
	API_COMPANYLINKMANPAGE,
	API_COMPANYACCOUNTLISTBANKADD,
	API_COMPANYACCOUNTLISTBANKEDIT,
	API_COMPANYACCOUNTLISTBANKDETAIL,
	API_COMPANYLINKMANDELETE
} from '@/v2/api/account';
import { area } from '@sub/utils/area.js';
import { mapGetters } from 'vuex';
import { checkID, getPopupContainer } from '@/v2/utils/factory';
import iPagination from "@sub/components/iPagination";
import omit from 'lodash/omit';
const columns = [
	{
		title: '姓名',
		fixed: 'left',
		dataIndex: 'contactName',
		width: 200,
		scopedSlots: { customRender: 'contactName' },
		ellipsis: true
	},
	{
		title: '手机号',
		dataIndex: 'contactPhone',
		width: 150
	},
	{
		title: '身份证号',
		dataIndex: 'contactIdCard',
		width: 150
	},
	{
		title: '联系人所在区',
		dataIndex: 'contactArea',
		scopedSlots: { customRender: 'contactAreaArr' },
		width: 200
	},
	{
		title: '联系人详细地址',
		dataIndex: 'contactAddress',
		width: 200
	},
	{
		title: '联系人电子邮箱',
		dataIndex: 'contactEmail',
		width: 200
	},
	{
		key: 'action',
		fixed: 'right',
		slots: { title: 'customTitle' },
		width: 120,
		scopedSlots: { customRender: 'action' }
		// align: 'center'
	}
];

export default {
	name: 'ContactPerson',

	components: {
		iPagination
	},
	data() {
		return {
			getPopupContainer,
			id: '',
			form: {
				contactName: '',
				contactPhone: '',
				contactAddress: '',
				contactAreaArr: [],
				contactEmail: '',
				contactIdCard: ''
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
						message: '请输入联系电话',
						trigger: ['blur', 'change']
					},
					{
						validator: this.validIdTel,
						trigger: ['blur']
					}
				],
				contactAddress: [
					{
						required: true,
						message: '请输入联系人详细地址',
						trigger: ['blur', 'change']
					}
				],
				contactAreaArr: [
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
						message: '请输入联系人电子邮箱',
						trigger: ['blur', 'change']
					},
					{
						type: 'email',
						message: '电子邮箱格式不正确',
						trigger: ['blur']
					}
				],
				contactIdCard: [
					{
						required: false,
						message: '请输入联系人身份证号',
						trigger: ['blur', 'change']
					},
					{
						validator: this.validIdCard,
						// message: '身份证号格式不正确',
						trigger: ['blur']
					}
				]
			},
			visible: false,
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			columns: columns,
			area,
			pagination: {
				type: 'mySettleList',
				total: 0, // 总条数
				pageNo: 1
			},
			dataSource: [],
			params: {}
		};
	},
	created() {
		this.fetchData();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isAdminRole() {
			return this.VUEX_ST_COMPANYSUER.roles?.map(item => item.code)?.includes('ADMIN');
		}
	},
	methods: {
		// 校验注册电话
		validIdTel(rule, value, callback) {
			var isMobilePhone = /1[0-9][0-9]{9}$/;
			// var isFixMob= /^(\(\d{3,4}\))\d{7,9}$/

			const isFixMob1 = /0\d{2,3}-[1-9]\d{6,7}$/; //-连接
			const isFixMob2 = /\(0\d{2,3}\)[1-9]\d{6,7}$/; //英文括号
			const isFixMob3 = /（0\d{2,3}）[1-9]\d{6,7}$/; //中文括号
			const isFixMob4 = /0\d{2,3}-[1-9]\d{6,7}-[0-9]\d{2,3}$/; //-带分机
			const isFixMob5 = /\(0\d{2,3}\)[1-9]\d{6,7}\([0-9]\d{2,3}\)$/; //英文括号带分机
			const isFixMob6 = /（0\d{2,3}）[1-9]\d{6,7}（[0-9]\d{2,3}）$/; //中文括号带分机

			if (value.length > 0) {
				if (
					isMobilePhone.test(value) ||
					isFixMob1.test(value) ||
					isFixMob2.test(value) ||
					isFixMob3.test(value) ||
					isFixMob4.test(value) ||
					isFixMob5.test(value) ||
					isFixMob6.test(value)
				) {
					callback();
				} else {
					callback('联系电话格式不正确');
				}
			} else {
				callback();
			}
		},
		// 校验身份证
		validIdCard(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (!checkID(value)) {
				callback('请输入有效的身份证号');
			}
			callback();
		},
		async fetchData(page, size) {
			this.pagination.pageNo = page || this.pagination.pageNo;
			this.pagination.pageSize = size;

			(this.params.pageNo = this.pagination.pageNo), (this.params.pageSize = this.pagination.pageSize);

			let res = await API_COMPANYLINKMANPAGE(this.params);
			this.dataSource = res.success ? res.data.content : [];
			this.pagination.total = res?.data?.totalElements;
		},
		reset() {
			this.params = {};
			this.fetchData();
		},
		async handleOk() {
			let check;
			try {
				check = await this.$refs.addForm.validate();
			} catch (e) {
				check = e;
			}

			let func = this.type == 'add' ? API_COMPANYACCOUNTLISTBANKADD : API_COMPANYACCOUNTLISTBANKEDIT;

			if (!check) return;
			let res = await func(omit(this.form, ['id', 'isCreator', 'contactArea']), this.id);
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
				contactAreaArr: [],
				contactEmail: '',
				contactIdCard: ''
			};
		},
		editContact(item) {
			this.visible = true;
			this.type = 'edit';
			this.form = {
				contactName: '',
				contactPhone: '',
				contactAddress: '',
				contactAreaArr: [],
				contactEmail: '',
				contactIdCard: ''
			};
			this.id = item.id;
			API_COMPANYACCOUNTLISTBANKDETAIL(item.id).then(res => {
				if (res.success) {
					this.form = { ...res.data, contactAreaArr: res.data.contactArea.split('/') };
				}
			});
		},
		deleteContact(item) {
			this.$confirm({
				closable: true,
				content: '删除后，业务人员在合同签订时将无法选择该联系人，确定要删除吗？',
				okText: '确认',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: async () => {
					let res = await API_COMPANYLINKMANDELETE(item.id);
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

<style lang="less" scoped>
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
.tip {
	color: #f5222d;
}
</style>
