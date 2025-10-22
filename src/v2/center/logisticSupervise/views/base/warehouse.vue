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
					<a-button
						class="add-btn"
						type="primary"
						@click="edit(null)"
						v-auth="'logicDeliverMonitor:systemManager:warehouseManager:add'"
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
								<span>启用后，巡库任务发布频率为一天两次</span>
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
							<a
								@click.prevent="edit(record)"
								v-auth="'logicDeliverMonitor:systemManager:warehouseManager:edit'"
								>编辑</a
							>
							<a
								@click.prevent="goodsAllocationList(record)"
								v-auth="'logicDeliverMonitor:systemManager:warehouseManager:goodsSpace'"
								>货位</a
							>
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
				<a-form-item label="仓库名称">
					<a-select
						placeholder="请选择仓库名称"
						:disabled="Boolean(editForm.getFieldValue('id'))"
						v-decorator="[
							'stationId',
							{
								rules: [{ required: true, message: '请选择仓库名称' }]
							}
						]"
						:options="houseList"
					/>
				</a-form-item>
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
		<modalInfo
			ref="modalInfo"
			@verify="changeTaskStatus"
			:title="taskStatusConfigModalInfo.title"
			:tip="taskStatusConfigModalInfo.tip"
		/>
	</div>
</template>

<script>
import { changeSupervisorStatus } from '@/v2/center/logisticsPlatform/api';
import { getTransferPage, postTransferAdd } from '@/v2/center/logisticSupervise/api/base';
import { getTransferWarehouseList } from '@/v2/center/logisticSupervise/api/settle';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters } from 'vuex';
import modalInfo from '@/v2/components/modalInfo/info';

const columns = [
	{
		title: '编号',
		key: 'serialNo',
		dataIndex: 'serialNo'
	},
	{
		title: '仓库',
		dataIndex: 'stationName'
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
export default {
	mixins: [ListMixin],
	components: {
		modalInfo
	},
	data() {
		return {
			columns,
			tableLoading: false,
			houseList: [],
			editVisible: false,
			editForm: this.$form.createForm(this),
			editFormLoading: false,
			form: this.$form.createForm(this),
			searchForm: this.$form.createForm(this),
			userAddForm: this.$form.createForm(this),
			addSupervisorVisible: false,
			url: {
				list: getTransferPage
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
		},
		searchList() {
			let { houseList } = this;
			return [
				{
					decorator: ['houseName'],
					addonBeforeTitle: '仓房名称',
					type: 'input',
					placeholder: '请输入仓房名称'
				},
				{
					decorator: ['warehouseName'],
					addonBeforeTitle: '仓库名称',
					type: 'select',
					placeholder: '请选择仓库',
					options: houseList
				}
			];
		}
	},
	created() {},
	mounted() {
		this.getHouseList();
	},
	methods: {
		async getHouseList() {
			const res = await getTransferWarehouseList();
			this.houseList = res.data.map(item => {
				return {
					value: item.id,
					label: item.name
				};
			});
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		edit(data) {
			if (data) {
				this.editForm.setFieldsValue({
					id: data.id,
					houseName: data.houseName,
					stationId: data.stationId,
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
				postTransferAdd({ ...values }).then(
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
		goodsAllocationList(data) {
			this.$router.push({
				path: '/center/logisticSupervise/systemManagement/warehouse/goodsAllocation',
				query: { houseId: data.id }
			});
		},
		addSupervisor() {
			this.addSupervisorVisible = true;
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
