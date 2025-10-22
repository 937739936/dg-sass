<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="page-title">
				<template v-if="VUEX_ST_COMPANYSUER.companyType === 'COAL_MINE'">
					<span
						slot="title"
						class="slTitle"
						>发运管理</span
					>
				</template>
				<div
					v-else
					class="methods-wrap"
				>
					<span
						slot="title"
						class="slTitle"
					>
						发运数据补录管理（该功能当前仅用于矿方上线时，有核心企业做发运数据补录）
					</span>
					<a-button
						type="primary"
						@click="goDeliverAdd"
						v-auth="'dgChain:recDel:terminalDeliver:new'"
					>
						<div>补录上游发运数据</div>
					</a-button>
				</div>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:bordered="false"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="tableLoading"
					class="new-table"
					:scroll="{ x: true }"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<!-- 11待确认 买方查看，卖方发运确认 -->
						<!-- 2已发货 收货确认、查看、删除 -->
						<!-- 3部分收货 收货确认、查看、撤销收货 -->
						<!-- 4已收货 查看、撤销收货 -->
						<!-- 6确认驳回 编辑、删除 -->
						<template v-if="VUEX_ST_COMPANYSUER.companyType == 'COAL_MINE'">
							<a
								v-if="record.status == 11"
								@click.prevent="goDetail(record.batchNo)"
								v-auth="'coalMineDgChain:despatch:deliver:confirm'"
								>发运确认
							</a>
							<a
								style="padding-left: 10px"
								@click.prevent="goDetail(record.batchNo)"
								v-auth="'coalMineDgChain:despatch:deliver:detail'"
								v-else
								>查看
							</a>
						</template>
						<template v-else>
							<a
								style="padding-left: 10px"
								@click.prevent="goDetailTwo(record.batchNo)"
								v-if="record.status == 11 || record.status == 2 || record.status == 3 || record.status == 4"
								v-auth="'dgChain:recDel:terminalDeliver:detail'"
								>查看
							</a>
							<a
								style="padding-left: 10px"
								@click.prevent="goDetailTwoAndConfirm(record.batchNo, 'receive')"
								v-if="record.status == 2 || record.status == 3"
								>收货确认
							</a>
							<a
								style="padding-left: 10px"
								@click.prevent="goEdit(record.batchNo)"
								v-if="record.status == 6"
								>编辑
							</a>
							<a
								style="padding-left: 10px"
								@click.prevent="getDelete(record.id)"
								v-if="record.status == 2 || record.status == 6"
								>删除
							</a>
							<!-- 非“执行中”合同不展示撤销收货 -->
							<a
								style="padding-left: 10px"
								@click.prevent="cancel(record.id)"
								v-if="(record.status == 3 || record.status == 4) && record.terminalContractStatus === 'EXECUTING'"
								>撤销收货
							</a>
						</template>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					v-show="pageSize < pagination.total"
					@change="getList"
				/>
			</div>
			<a-modal
				v-model="ifShowReceiveList"
				class="receiveCancelModal"
				title="请选择要撤销的收货记录"
				okText="确定"
				cancelText="取消"
				@cancel="handleCancelModal"
				@ok="cancelConfirm"
			>
				<a-table
					:rowSelection="{
						selectedRowKeys: receiveSelectedRowKeys,
						onChange: onSelectReceiveCancelChange
					}"
					:columns="receiveCancelColumns"
					:rowKey="record => record.receiveId"
					:dataSource="receiveCancelData"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				/>
				<a-form
					:form="form"
					style="margin-top: 24px"
				>
					<a-form-item>
						<a-textarea
							:maxLength="100"
							class="zf-textarea"
							placeholder="请输入作废原因..."
							v-decorator="['cancelReason', { rules: [{ required: true, message: '作废原因必填' }] }]"
						/>
					</a-form-item>
				</a-form>
			</a-modal>
		</a-card>
	</div>
</template>
<script lang="jsx">
import iPagination from "@sub/components/iPagination";
import { getLogisticsList, getLogisticsDelete, API_GetReceiveCancelList } from '@/v2/center/trade/api/coal';
import { API_RECEIVERECORDCANCEL } from '@/v2/center/trade/api/receive';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const columns = [
	{
		title: '发货批次号',
		key: 'batchNo',
		dataIndex: 'batchNo',
		width: 150
	},
	{
		title: '合同编号',
		key: 'paperContractNo',
		dataIndex: 'paperContractNo',
		width: 150
	},
	{
		title: '买方企业名称',
		key: 'buyerName',
		dataIndex: 'buyerName',
		width: 150
	},
	{
		title: '卖方企业名称',
		key: 'sellerName',
		dataIndex: 'sellerName',
		width: 150
	},
	{
		title: '发货日期',
		key: 'deliverDate',
		dataIndex: 'deliverDate',
		width: 150
	},
	{
		title: '发货数量（吨）',
		key: 'deliverQuantity',
		dataIndex: 'deliverQuantity',
		width: 150
	},
	{
		title: '收货日期',
		key: 'receiveDate',
		dataIndex: 'receiveDate',
		customRender: text => {
			return text || '-';
		},
		width: 150
	},
	{
		title: '收货数量（吨）',
		key: 'receiveQuantity',
		dataIndex: 'receiveQuantity',
		width: 150
	},
	{
		title: '运输方式',
		key: 'dispatchTypeDesc',
		dataIndex: 'dispatchTypeDesc',
		width: 150
	},
	{
		title: '状态',
		key: 'statusDesc',
		dataIndex: 'statusDesc',
		width: 150
	},
	{
		title: '创建人',
		key: 'createName',
		dataIndex: 'createName',
		width: 150
	},
	{
		title: '创建时间',
		key: 'createTime',
		dataIndex: 'createTime',
		width: 150
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		width: 150
	}
];

const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['batchNo'],
		addonBeforeTitle: '批次号',
		type: 'input',
		placeholder: '请输入批次号'
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发货日期',
		type: 'rangePicker',
		placeholder: '请选择发货日期',
		realKey: ['deliverDateBegin', 'deliverDateEnd']
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['dispatchType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: [
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '火运', value: 'TRAIN' },
			{ label: '船运', value: 'SHIP' }
		]
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择煤种',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: [
			{
				value: 11,
				label: '待确认'
			},
			{
				value: 2,
				label: '已发货'
			},
			{
				value: 3,
				label: '部分收货'
			},
			{
				value: 4,
				label: '已收货'
			},
			{
				value: 6,
				label: '确认驳回'
			}
		]
	}
];

export default {
	mixins: [ListMixin],
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	data() {
		return {
			searchList,
			form: this.$form.createForm(this),
			columns,
			dataSource: [],
			search: {},
			deliverDate: null,
			tableLoading: false,
			receiveSelectedRowKeys: [], //撤销收货选择
			receiveCancelColumns: [
				{
					title: '收货编号',
					dataIndex: 'receiveNo'
				},
				{
					title: '收货日期',
					dataIndex: 'receiveDate'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity'
				}
			],
			pageSize: 10,
			receiveCancelData: [], //已收货数据
			ifShowReceiveList: false
		};
	},
	created() {
		this.columns = columns.filter(item => {
			//如果是矿方展示买方，否则展示卖方
			if (this.VUEX_ST_COMPANYSUER.companyType === 'COAL_MINE') {
				//不要卖方和收货日期、收货数量
				return item.key !== 'sellerName' && item.key !== 'receiveDate' && item.key !== 'receiveQuantity';
			} else {
				return item.key !== 'buyerName';
			}
		});
	},
	mounted() {
		// this.getList();
	},
	methods: {
		resetFunc() {},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		doSearch() {
			this.getList(1);
		},
		doReset() {
			this.search = {};
			this.deliverDate = null;
			this.getList(1);
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.tableLoading = true;
			this.pageSize = pageSize;
			const params = {
				pageNo,
				pageSize,
				...this.searchParams
			};
			getLogisticsList(params).then(res => {
				let data = res.data;
				this.dataSource = data.records;
				this.pagination.total = data.total;
				this.pagination.pageNo = pageNo;
				this.tableLoading = false;
			});
		},
		dateChange(field, [start, end]) {
			this.search[`${field}Begin`] = start.format('YYYY-MM-DD');
			this.search[`${field}End`] = end.format('YYYY-MM-DD');
		},
		//发运数据补录
		goDeliverAdd() {
			this.$router.push({
				path: '/center/receive/coal/add'
			});
		},
		goDetail(batchNo) {
			this.$router.push({
				path: '/center/receive/coal/logistics/detail',
				query: { batchNo }
			});
		},
		goDetailTwoAndConfirm(batchNo, type) {
			this.$router.push({
				path: '/center/receive/coal/logistics/detail/two',
				query: { batchNo, type }
			});
		},
		//发运详情
		goDetailTwo(batchNo, type) {
			this.$router.push({
				path: '/center/receive/coal/logistics/detail',
				query: { batchNo, type }
			});
		},
		//发运修改
		goEdit(batchNo) {
			this.$router.push({
				path: '/center/receive/coal/add',
				query: { batchNo }
			});
		},
		//删除
		getDelete(id) {
			this.$confirm({
				centered: true,
				content: '确定要删除该数据吗？',
				title: '删除后，将无法恢复该数据',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					getLogisticsDelete(id).then(res => {
						if (res.success) {
							this.$message.success('操作成功');
							this.getList();
						}
					});
				},
				onCancel() {}
			});
		},
		//撤销收货
		cancel(deliverBatchId) {
			this.deliverBatchId = deliverBatchId;
			this.ifShowReceiveList = true;
			this.receiveCancelData = [];
			API_GetReceiveCancelList({ deliverBatchId }).then(res => {
				if (res.success) {
					this.receiveCancelData = res.result;
					this.receiveCancelData.forEach(item => {
						if (item.cancel == 1) {
							item.cancel = '否';
						} else {
							item.cancel = '是';
						}
					});
				}
			});
		},
		onSelectReceiveCancelChange(selectedRowKeys) {
			this.receiveSelectedRowKeys = selectedRowKeys;
		},
		cancelConfirm() {
			if (this.receiveSelectedRowKeys && this.receiveSelectedRowKeys.length > 0) {
				this.form.validateFields((err, values) => {
					if (!err) {
						API_RECEIVERECORDCANCEL({
							deliverId: this.deliverBatchId,
							receiveIds: this.receiveSelectedRowKeys,
							cancelReason: values.cancelReason
						}).then(res => {
							if (res.success) {
								this.$message.success('撤销成功！');
								this.getList();
								this.ifShowReceiveList = false;
							}
						});
					}
				});
			} else {
				this.$message.error('请选择要撤销的收货记录');
			}
		},
		handleCancelModal() {
			this.receiveSelectedRowKeys = [];
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
</style>
