<template>
	<div
		style="width: 100%; overflow-x: hidden"
		class="center-user"
	>
		<div class="s-card">
			<div class="s-card-content">
				<div style="overflow: hidden">
					<div style="color: #ff4d4f">
						注：在使用电子合同时，合同中的签约地点将使用该字段，该字段的意义在于，一般交易发生纠纷时，<br />
						双方纠纷的处理地点以合同签约地为准
					</div>
					<a-button
						v-auth="'company:contract:sign:address:add'"
						type="primary"
						style="float: right"
						@click="addPlace"
						>新增合同签约地</a-button
					>
				</div>
				<a-table
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:pagination="false"
					style="margin-top: 24px"
				>
					<template
						slot="action"
						slot-scope="action, item"
					>
						<a
							v-auth="'company:contract:sign:address:edit'"
							href="javascript:;"
							@click="editPlace(item)"
							>编辑</a
						>&nbsp;
						<a
							v-auth="'company:contract:sign:address:delete'"
							href="javascript:;"
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
			:title="type == 'add' ? '新增' + '合同签约地' : '编辑' + '合同签约地'"
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
					label="企业名称"
				>
					<a-input
						v-model="form.contactName"
						disabled
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="address"
					label="合同签约地"
				>
					<a-input
						v-model="form.address"
						placeholder="请输入xx市xx区，请公司风控做好确认"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="description"
					label="备注"
				>
					<a-textarea
						v-model="form.description"
						placeholder="若有多个合同签约地，请备注使用场景说明，最多20字"
					/>
				</a-form-model-item>
			</a-form-model>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import {
	API_CompanySignAddressPage,
	API_CompanySignAddressAdd,
	API_CompanySignAddressEdit,
	API_CompanySignAddressDelete
} from '@/v2/api/account';
import { area } from '@sub/utils/area.js';
import { mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";

const columns = [
	{
		title: '合同签约地',
		dataIndex: 'address'
	},
	{
		title: '创建人',
		dataIndex: 'createdName'
	},
	{
		title: '创建时间',
		dataIndex: 'createdDate'
	},
	{
		title: '备注',
		dataIndex: 'description'
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'CompanySignPlace',

	components: {
		iPagination
	},
	data() {
		return {
			id: '',
			form: {
				contactName: '',
				address: '',
				description: ''
			},
			type: '',
			rules: {
				address: [
					{
						required: true,
						validator: this.validAddress,
						trigger: ['change']
					}
				],
				description: [
					{
						validator: this.validDescription,
						trigger: ['change']
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
				pageNo: 1,
				hideSize: true
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
		})
	},
	methods: {
		validDescription(rule, value, callback) {
			if (!value) {
				callback();
			}
			if (value.length > 20) {
				callback('备注不能超过20个字符');
			} else {
				callback();
			}
		},
		validAddress(rule, value, callback) {
			if (!value) {
				callback('请输入合同签约地');
			}
			if (value.length > 30) {
				callback('合同签约地不能超过30个字符');
			} else {
				callback();
			}
		},
		async fetchData(page, size) {
			this.pagination.pageNo = page || this.pagination.pageNo;
			this.params.uscc = this.VUEX_ST_COMPANYSUER.companyUscc;
			this.params.pageNo = this.pagination.pageNo;
			this.params.pageSize = 10;

			let res = await API_CompanySignAddressPage(this.params);
			this.dataSource = res.success ? res.data.content : [];
			this.pagination.total = res?.data?.totalElements;
		},
		async handleOk() {
			let check;
			try {
				check = await this.$refs.addForm.validate();
			} catch (e) {
				check = e;
			}

			let func = this.type == 'add' ? API_CompanySignAddressAdd : API_CompanySignAddressEdit;

			if (!check) return;
			let res = await func({
				...this.form,
				id: this.id
			});
			if (res.success) {
				this.$message.success('操作成功');
				this.visible = false;
				this.fetchData();
			}
		},
		async addPlace() {
			this.visible = true;
			this.type = 'add';
			this.form = {
				contactName: this.VUEX_ST_COMPANYSUER.companyName,
				address: '',
				description: ''
			};
		},
		editPlace(item) {
			this.visible = true;
			this.type = 'edit';
			this.form = {
				contactName: this.VUEX_ST_COMPANYSUER.companyName,
				address: item.address,
				description: item.description
			};
			this.id = item.id;
		},
		deleteContact(item) {
			this.$confirm({
				closable: true,
				content: '删除后，业务人员在合同签订时将无法选择该合同签约地点，确定要删除吗？',
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
					let res = await API_CompanySignAddressDelete(item.id);
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
</style>
