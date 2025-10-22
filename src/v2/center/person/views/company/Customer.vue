<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>客户信息管理</span
				>
				<span>
					<a-button
						type="primary"
						html-type="submit"
						class="search-btn"
						@click="getExport"
					>
						导出
					</a-button>
					<a-button
						type="primary"
						v-auth="'company:customer:add'"
						html-type="submit"
						@click="showModal"
					>
						新增客户
					</a-button>
				</span>
			</div>
			<div class="s-card-content companyAccount">
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
					@resetFunc="resetFunc"
				></SlFormNew>
				<div :class="'table-box ' + (customerListpagination.total > 10 ? 'fixedBottom' : '')">
					<a-table
						class="new-table"
						rowKey="id"
						:scroll="{ x: true }"
						:columns="customerListColumn"
						:pagination="false"
						:dataSource="customerListData"
						:locale="{ emptyText: '暂无数据' }"
						:loading="loading"
					>
						<template
							slot="operation"
							class="table-operation"
							slot-scope="record"
						>
							<a-space :size="10">
								<a
									v-auth="'company:customer:view'"
									@click="
										jumpPage('/center/account/company/customer/detail', {
											id: record.id
										})
									"
									>查看</a
								>
								<!-- canOperate 能否操作 -->
								<a
									v-if="record.canOperate"
									v-auth="'company:customer:edit'"
									@click="
										jumpPage('/center/account/company/customer/edit', {
											id: record.id
										})
									"
									>编辑</a
								>
								<!-- 数据来源（SYS-系统生成；MANUAL-手动）系统生成不可删除 -->
								<a
									v-auth="'company:customer:del'"
									v-if="record.canOperate && record.dataSource != 'SYS'"
									@click="deleteCustomer(record.id)"
									>删除</a
								>
							</a-space>
						</template>
					</a-table>
					<i-pagination
						:pagination="customerListpagination"
						size="small"
						v-show="pageSize < pagination.total"
						@change="getList"
					/>
				</div>
			</div>
		</a-card>
		<AddCustomerModal
			:visible="visible"
			:typeList="typeList"
			:ok="addCustomerOk"
			:cancel="addCustomerCancel"
		/>
	</div>
</template>

<script>
import { API_COMPANYCUSTOMER, API_COMPANYCUSTOMERTYPE, API_COMPANYCUSTOMERDELETE, API_COMPANYCUSTOMERExport } from 'api/account';
import AddCustomerModal from '../../components/AddCustomerModal.vue';
import { colSpan } from '@/v2/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import iPagination from "@sub/components/iPagination";

const searchList = [
	{
		decorator: ['name'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['creditCode'],
		addonBeforeTitle: '统一社会信用代码',
		type: 'input',
		placeholder: '请输入统一社会信用代码'
	},
	{
		decorator: ['abbreviation'],
		addonBeforeTitle: '企业简称',
		type: 'input',
		placeholder: '请输入企业简称'
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '客户类别',
		type: 'select',
		placeholder: '请选择客户类别',
		options: []
	},
	{
		decorator: ['legalPersonName'],
		addonBeforeTitle: '法定代表人',
		type: 'input',
		placeholder: '请输入法定代表人'
	},
	{
		decorator: ['area'],
		addonBeforeTitle: '所属地区',
		type: 'input',
		placeholder: '请输入所属地区'
	},
	{
		decorator: ['linkmanName'],
		addonBeforeTitle: '联系人姓名',
		type: 'input',
		placeholder: '请输入联系人姓名'
	},
	{
		decorator: ['linkmanMobile'],
		addonBeforeTitle: '联系人电话',
		type: 'input',
		placeholder: '请输入联系人电话'
	}
];

export default {
	mixins: [ListMixin],
	components: {
		AddCustomerModal,
		iPagination
	},
	data() {
		return {
			searchList,
			customerListColumn: [
				{
					title: '企业名称',
					dataIndex: 'name',
					key: 'name'
				},
				{
					title: '统一社会信用代码',
					dataIndex: 'creditCode',
					key: 'creditCode'
				},
				{
					title: '企业简称',
					dataIndex: 'abbreviation',
					key: 'abbreviation'
				},
				{
					title: '客户类别',
					dataIndex: 'type',
					key: 'type'
				},
				{
					title: '法定代表人',
					dataIndex: 'legalPersonName',
					key: 'legalPersonName'
				},
				{
					title: '注册资本（万元）',
					dataIndex: 'registerCap',
					key: 'registerCap'
				},
				{
					title: '所属地区',
					dataIndex: 'area',
					key: 'area	'
				},
				{
					title: '负责人',
					dataIndex: 'headName',
					key: 'headName'
				},
				{
					title: '负责人电话',
					dataIndex: 'headMobile',
					key: 'headMobile'
				},
				{
					title: '联系人姓名',
					dataIndex: 'linkmanName',
					key: 'linkmanName'
				},
				{
					title: '联系人电话',
					dataIndex: 'linkmanMobile',
					key: 'linkmanMobile'
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					width: 150,
					align: 'center',
					fixed: 'right'
				}
			],
			colSpan,
			formLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			customerListData: null,
			customerListpagination: {
				total: 0,
				pageNo: 1,
				pageSize: 10
			},
			visible: false,
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
			customerListParams: {
				// 客户列表查询字段
				name: '',
				abbreviation: '',
				type: undefined,
				linkmanName: '',
				linkmanMobile: ''
			},
			typeList: [], //客户类别
			loading: false
		};
	},
	created() {
		this.getType();
	},
	methods: {
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		resetFunc() {},
		addCustomerOk() {
			this.visible = false;
			this.getList();
			this.getType();
		},
		addCustomerCancel() {
			this.visible = false;
		},
		showModal() {
			this.visible = true;
		},
		//页面跳转
		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},
		// 列表
		getList(pageNo = this.customerListpagination.pageNo, pageSize = 10) {
			this.customerListpagination.pageNo = pageNo;
			this.customerListpagination.pageSize = pageSize;
			this.loading = true;
			API_COMPANYCUSTOMER({
				...this.searchParams,
				...this.customerListpagination
			})
				.then(res => {
					if (res.success) {
						this.customerListData = res.data.content;
						this.customerListpagination.total = res.data.totalElements;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//客户类型
		getType() {
			API_COMPANYCUSTOMERTYPE().then(res => {
				let data = res.data;
				this.typeList = data;
				const tempArr = [];
				this.typeList.forEach(item => {
					tempArr.push({
						label: item,
						value: item
					});
				});
				this.searchList.forEach((item, index) => {
					if (item.decorator[0] == 'type') {
						item.options = tempArr;
					}
				});
			});
		},

		// 列表 删除
		deleteCustomer(id) {
			const that = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除该条客户信息么？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_COMPANYCUSTOMERDELETE(id).then(res => {
						if (res.success && res.data) {
							that.$message.success('操作成功');
						} else {
							that.$message.error(res.message || '数据异常');
						}
						that.getList();
						that.getType();
					});
				}
			});
		},
		//导出
		getExport() {
			API_COMPANYCUSTOMERExport({
				...this.searchParams,
				...this.customerListpagination
			}).then(res => {
				comDownload(res, undefined, '客户信息.xls');
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.center-user {
	.control-wrap {
		a {
			display: inline-block;
			padding: 0 6px;
		}
	}
	.search-wrap {
		padding: 0 0 16px 0;
		.ant-select {
			width: 100%;
		}
	}
	.s-card-title {
		margin: 6px 0 16px;
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #141517;
		letter-spacing: 0;
		line-height: 24px;
	}
	.s-card-content {
		border-top: 1px solid#EEF0F2;
		padding-left: 0;
		padding-right: 0;
	}
	.order-wrap {
		button {
			width: 104px;
		}
	}
}
::v-deep .ant-checkbox-group {
	width: 100%;
}
::v-deep.ant-table-wrapper {
	width: 100%;
}
::v-deep.ant-tabs-tabpane {
	display: block !important;
}
::v-deep.ant-tabs-bar {
	border: none;
}
::v-deep.ant-form-item {
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
::v-deep.ant-modal-body {
	padding: 20px 32px 12px 20px;
}
::v-deep.ant-modal-title {
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 24px;
}
.search-btn {
	margin-right: 35px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
.s-card-content {
	padding-left: 0;
	padding-right: 0;
}
</style>
