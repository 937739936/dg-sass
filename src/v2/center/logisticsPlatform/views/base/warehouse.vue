<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>仓房管理</span
				>
				<div>
					<!-- <a-button
						class="add-btn"
						type="primary"
						ghost
						@click="addSupervisor"
						style="margin-right: 10px"
						>新增巡库员</a-button
					> -->
					<a-button
						class="add-btn"
						type="primary"
						@click="edit(null)"
						>新增仓房</a-button
					>
				</div>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				ref="slform"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:bordered="false"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="tableLoading"
					:scroll="{ x: true }"
				>
					<template
						slot="remark"
						slot-scope="remark"
					>
						<a-tooltip>
							{{ (remark || '').substr(0, 20) }}
							<template
								slot="title"
								v-if="(remark || '').length > 20"
								>{{ remark }}</template
							>
							<template v-if="(remark || '').length > 20">....</template>
						</a-tooltip>
					</template>
					<template slot="openSupervisor">
						<span>巡库任务 </span>
						<a-tooltip placement="top">
							<template slot="title">
								<span>启用后，巡库任务发布频率为一天三次</span>
							</template>
							<a-icon type="question-circle" />
						</a-tooltip>
					</template>
					<template
						slot="openSupervisor"
						slot-scope="openSupervisor, record"
					>
						<a-switch
							:disabled="!isCoreCompany"
							:checked="openSupervisor"
							@click="showTaskOpenModal(record)"
						/>
					</template>
					<template
						slot="no"
						slot-scope="text, record, index"
					>
						{{ index + 1 }}
					</template>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<a-space>
							<a @click.prevent="edit(record)">编辑</a>
							<a @click.prevent="goodsAllocationList(record)">货位</a>
							<a
								v-if="VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE'"
								@click.prevent="openOwner(record)"
								v-auth="'logisticsStorageCenter:sysManage:houseManage:assignShipper'"
								>分配货主</a
							>
							<!-- <a @click.prevent="supervisorsDetail(record)">巡库员</a> -->
						</a-space>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<a-modal
			v-model="editVisible"
			:title="editForm.getFieldValue('id') ? '编辑' : '新增'"
			@ok="editSave"
			@cancel="editCancel"
			:forceRender="true"
			class="slModal"
			width="408px"
		>
			<template #footer>
				<a-button @click="editCancel">取消</a-button>
				<a-button
					type="primary"
					@click="editSave"
					:loading="editFormLoading"
					>确定</a-button
				>
			</template>
			<a-form
				:form="editForm"
				class="slFormDetail"
			>
				<div style="display: none">
					<a-form-item label="id">
						<a-input v-decorator="['id']" />
					</a-form-item>
				</div>
				<a-form-item label="仓房名称">
					<a-input
						placeholder="请输入仓房名称"
						v-decorator="[
							'houseName',
							{
								rules: [
									{ required: true, message: '请输入仓房名称' },
									{ max: 30, message: '仓房名称最多30个字符' }
								]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="备注">
					<a-input
						placeholder="请输入备注"
						v-decorator="[
							'remark',
							{
								rules: [
									{
										validator: (rule, value, callback) => {
											if (!value) {
												callback();
												return;
											}
											if (value.length > 100) {
												callback('最多100个字符');
												return;
											}
											callback();
										}
									}
								]
							}
						]"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			v-model="ownerVisible"
			title="分配货主"
			@ok="ownerSave"
			@cancel="ownerCancel"
			:forceRender="true"
			class="slModal"
			width="408px"
		>
			<a-form
				:form="form"
				class="slFormDetail"
			>
				<div style="display: none">
					<a-form-item label="仓房ID">
						<a-input v-decorator="['houseId']" />
					</a-form-item>
				</div>
				<a-form-item label="货主名称">
					<a-select
						placeholder="请选择货主"
						v-decorator="['shipperCreditCode', { rules: [{ required: false }] }]"
					>
						<a-select-option
							v-for="item in shipperList"
							:value="item.companyUscc"
							:key="item.companyUscc"
							>{{ item.companyName }}</a-select-option
						>
					</a-select>
				</a-form-item>
			</a-form>
		</a-modal>
		<modalInfo
			ref="modalInfo"
			@verify="changeTaskStatus"
			:title="taskStatusConfigModalInfo.title"
			:tip="taskStatusConfigModalInfo.tip"
		/>
	</div>
</template>

<script>
import {
	getStationHouseList,
	stationHouseAdd,
	stationHouseEdit,
	getShipperList,
	shipperSave,
	changeSupervisorStatus
} from '../../api';
import iPagination from "@sub/components/iPagination";
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters } from 'vuex';
import modalInfo from '@/v2/components/modalInfo/info';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const columns = [
	{
		title: '编号',
		key: 'serialNo',
		dataIndex: 'serialNo'
	},
	{
		title: '仓房名称',
		key: 'houseName',
		dataIndex: 'houseName'
	},
	{
		title: '所属货主',
		key: 'shipperName',
		dataIndex: 'shipperName'
	},
	{
		title: '备注',
		key: 'remark',
		dataIndex: 'remark',
		scopedSlots: { customRender: 'remark' },
		width: '18%'
	},
	{
		// title: '巡库任务',
		key: 'openSupervisor',
		dataIndex: 'openSupervisor',
		slots: { title: 'openSupervisor' },
		scopedSlots: { customRender: 'openSupervisor' }
	},
	{
		title: '操作',
		key: '操作',
		dataIndex: '操作',
		scopedSlots: { customRender: 'action' },
		fixed: 'right'
	}
];
const editRules = {
	warehouse: [{ required: true, message: '请输入仓房名称', trigger: 'blur' }]
};
const searchList = [
	{
		decorator: ['houseName'],
		addonBeforeTitle: '仓房名称',
		type: 'input',
		placeholder: '请输入仓房名称'
	},
	{
		decorator: ['shipperName'],
		addonBeforeTitle: '货主名称',
		type: 'input',
		placeholder: '请输入货主名称'
	}
];
export default {
	mixins: [ListMixin],
	components: {
		iPagination,
		modalInfo
	},
	data() {
		return {
			plainOptions,
			columns,
			tableLoading: false,
			dataSource: [],
			searchList,
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			shipperList: [], //可分配货主名单
			editRules,
			editVisible: false,
			editForm: this.$form.createForm(this),
			editFormLoading: false,
			ownerVisible: false,
			form: this.$form.createForm(this),
			searchForm: this.$form.createForm(this),
			userAddForm: this.$form.createForm(this),
			addSupervisorVisible: false,
			selfLoad: true,
			url: {
				list: getStationHouseList
			},
			taskStatusConfigModalInfo: {
				title: '',
				tip: '',
				id: 0
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		}
	},
	created() {
		if (this.VUEX_ST_COMPANYSUER.companyType != 'WAREHOUSE') {
			this.searchList.splice(1, 1);
		}
	},
	mounted() {
		this.getList();
		this.getShipperList();
	},
	methods: {
		onChange() {},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		//获取可分配货主的列表
		getShipperList() {
			getShipperList().then(result => {
				if (!result.success) {
					return;
				}
				this.shipperList = result.data;
			});
		},
		edit(data) {
			if (data) {
				this.editForm.setFieldsValue({
					id: data.id,
					houseName: data.houseName,
					remark: data.remark
				});
			}
			this.editVisible = true;
		},
		editSave() {
			this.editForm.validateFields((error, values) => {
				if (error) {
					return;
				}
				this.editFormLoading = true;
				let save;
				if (values.id) {
					save = stationHouseEdit;
				} else {
					save = stationHouseAdd;
				}
				save({ ...values }).then(
					({ success }) => {
						this.editFormLoading = false;
						if (!success) {
							return;
						}
						this.$message.success('操作成功');
						this.editCancel();
						if (values.id) {
							this.getList();
						} else {
							this.getList(1);
						}
					},
					() => {
						this.editFormLoading = false;
					}
				);
			});
		},
		editCancel() {
			this.editVisible = false;
			this.editFormLoading = false;
			this.editForm.resetFields();
		},
		openOwner(data) {
			this.form.setFieldsValue({
				houseId: data.id,
				shipperCreditCode: data.shipperCreditCode || undefined
			});
			this.ownerVisible = true;
		},
		ownerSave() {
			let data = this.form.getFieldsValue();
			let shipperName = this.shipperList.filter(item => item.companyUscc == data.shipperCreditCode)[0]?.companyName;
			shipperSave({ ...data, shipperName }).then(result => {
				if (!result.success) {
					return;
				}
				this.$message.success('操作成功');
				this.ownerCancel();
				this.getList();
			});
		},
		ownerCancel() {
			this.ownerVisible = false;
			this.form.resetFields();
		},
		goodsAllocationList(data) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouse/goodsAllocation',
				query: { houseId: data.id }
			});
		},
		addSupervisor() {
			this.addSupervisorVisible = true;
		},
		supervisorsDetail(data) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouse/supervisorsDetail',
				query: { houseId: data.id }
			});
		},
		// 显示任务开启确认弹窗
		showTaskOpenModal(record) {
			let openSupervisor = record?.openSupervisor ?? false;
			let title = '开启巡库';
			let message = '将开启移动端巡库任务发布，是否确认进行开启操作？';
			if (openSupervisor == true) {
				// 当前是开启需要关闭--关闭确认
				title = '关闭巡库';
				message = '将关闭移动端巡库任务发布，是否确认进行关闭操作？';
			}
			let tip = record.houseName + message;
			this.taskStatusConfigModalInfo = {
				title: title,
				tip: tip,
				id: record.id,
				openSupervisor: record.openSupervisor
			};
			this.$refs.modalInfo.open();
		},
		// 修改任务状态
		changeTaskStatus() {
			this.spinning = true;
			let { id, openSupervisor } = this.taskStatusConfigModalInfo;

			changeSupervisorStatus({
				id: id,
				open: !openSupervisor
			})
				.then(res => {
					if (!res.success) {
						return;
					}
				})
				.catch(() => {})
				.finally(() => {
					this.spinning = false;
					this.$refs.modalInfo.close();
					this.getList();
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
	::v-deep.ant-switch {
		background-color: #c5c8ce;
		height: 20px;
		width: 34px;
		min-width: 34px;
		margin: 4px 0 4px;
		box-sizing: border-box;
		.ant-switch-inner {
			position: relative;
			top: -1px;
			margin-left: 20px;
			font-size: 14px;
			zoom: 0.85;
			line-height: 20px;
		}
	}
	::v-deep.ant-switch-checked {
		background-color: @primary-color;
		.ant-switch-inner {
			margin-right: 20px;
			margin-left: 8px;
		}
	}
	::v-deep.ant-switch-loading-icon,
	.ant-switch::after {
		width: 14px;
		height: 14px;
		top: 2px;
	}
}
.slModal {
	.slFormDetail {
		padding: 0;
	}
}
</style>