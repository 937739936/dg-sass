<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>放货管理</span
				>
				<div v-auth="['dgChain:lading:release:apply', 'logisticsStorageCenter:lading:release:apply']">
					<a-button
						type="primary"
						@click="ladingApply"
					>
						<span style="font-size: 14px">新增放货指令</span>
					</a-button>
				</div>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handleSearchChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-tabs
				v-model="defaultParams.tabType"
				@change="tabTypeChange"
			>
				<a-tab-pane
					key="TAB_ALL"
					tab="全部"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_AUDITING"
					tab="审批中"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_EFFECTIVE"
					tab="生效中"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_OVER_LIMIT"
					tab="已超额"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_COMPLETED"
					tab="已完结"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_REJECT"
					tab="已驳回"
				>
				</a-tab-pane>
				<a-tab-pane
					key="TAB_CANCEL"
					tab="已作废"
				>
				</a-tab-pane>
			</a-tabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="contractNo"
						slot-scope="contractNo, record"
					>
						<a
							href="javascript:;"
							@click="goContractDetail(record)"
							>{{ record.contractNo }}</a
						>
					</template>
					<div
						slot="statusDesc"
						slot-scope="text, item"
						:class="`statusDes status-${item.status}`"
					>
						{{ text || '-' }}
					</div>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!-- 待提交 -->
						<template>
							<a-space :size="24">
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:release:detail', 'logisticsStorageCenter:lading:release:detail']"
									@click="handleViewDetail(item)"
								>
									查看
								</a>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:release:apply', 'logisticsStorageCenter:lading:release:apply']"
									@click="handleModify(item)"
									v-if="item.hasEditPermissions && (item.status == 'BUSINESS_REJECT' || item.status == 'FINANCE_REJECT')"
									>编辑</a
								>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:release:handle', 'logisticsStorageCenter:lading:release:handle']"
									@click="handleHandle(item)"
									v-if="item.hasHandleAlert && (item.status == 'EFFECTIVE_NEAR_LIMIT' || item.status == 'OVER_LIMIT')"
									>处理</a
								>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:release:completed', 'logisticsStorageCenter:lading:release:completed']"
									@click="handleCompleted(item.id)"
									v-if="item.hasEditPermissions && item.status == 'EFFECTIVE'"
									>完结</a
								>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:release:cancel', 'logisticsStorageCenter:lading:release:cancel']"
									@click="startInvalid(item.id)"
									v-if="item.hasEditPermissions && (item.status == 'BUSINESS_REJECT' || item.status == 'FINANCE_REJECT')"
									>作废</a
								>
							</a-space>
						</template>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<SelectContractModal
			ref="selectContractModal"
			:source="source"
			@confirmSelectContract="confirmSelectContract"
		/>
		<a-modal
			v-model="isShowInvalidModal"
			title="作废原因"
			@ok="confirmInvalid"
			cancelText="取消"
			okText="确定"
			@cancel="isShowInvalidModal = false"
		>
			<a-input
				v-model.trim="invalidParams.cancelReason"
				placeholder="请输入作废原因"
				:maxLength="255"
			/>
		</a-modal>
		<modalInfo
			ref="completeModalInfo"
			@verify="confirmCompleteItem"
			:title="'确认完结'"
			:tip="'确认完结该放货指令？完结后不得开启。'"
		/>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import modalInfo from '@/v2/components/modalInfo/info';
import SelectContractModal from './contractList';
import { isEqual } from 'lodash';
import { mapGetters } from 'vuex';

import {
	API_getReleaseInstructList,
	API_getStationList,
	API_invalidLading,
	API_completeLading
} from '@/v2/center/trade/api/instruct';

export default {
	mixins: [ListMixin],
	components: {
		SelectContractModal,
		modalInfo
	},
	data() {
		const sourceType = this.$route.path.includes('/logisticsPlatform/') ? 'LOGISTICS_STORAGE_CENTER' : 'DG_CHAIN';
		const stationSerchItem =
			sourceType === 'DG_CHAIN'
				? [
						{
							decorator: ['stationId'],
							addonBeforeTitle: '仓库名称',
							type: 'select',
							placeholder: '请选择仓库名称',
							options: []
						}
					]
				: [];
		const stationColumnItem =
			sourceType === 'DG_CHAIN'
				? [
						{
							title: '仓库名称',
							dataIndex: 'place'
						}
					]
				: [];

		return {
			url: {
				list: API_getReleaseInstructList
			},
			defaultParams: {
				tabType: 'TAB_ALL',
				source: sourceType
			},
			selfLoad: true,
			isShowInvalidModal: false,
			invalidParams: {
				id: '',
				cancelReason: ''
			}, // 作废信息
			completeId: '', // 删除条目id
			// 站台列表
			stationList: [],
			// 是否已经选择了站台
			isSelectStation: false,
			searchList: [
				{
					decorator: ['serialNo'],
					addonBeforeTitle: '编号',
					type: 'input',
					trimSpace: true,
					placeholder: '请输入放货指令或合同编号'
				},
				{
					decorator: ['buyerName'],
					addonBeforeTitle: '买方企业',
					type: 'input',
					placeholder: '请输入买方企业'
				},
				{
					decorator: ['signDate'],
					addonBeforeTitle: '放货日期',
					type: 'rangePicker',
					realKey: ['signDateStart', 'signDateEnd']
				},
				...stationSerchItem,
				{
					decorator: ['goodsName'],
					addonBeforeTitle: '品名',
					type: 'input',
					placeholder: '请输入品名'
				}
			],
			columns: [
				{
					title: '放货指令编号',
					dataIndex: 'releaseInstructNo',
					customRender
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					scopedSlots: { customRender: 'contractNo' }
				},
				{
					title: '卖方企业',
					dataIndex: 'sellerName',
					customRender
				},
				{
					title: '买方企业',
					dataIndex: 'buyerName',
					customRender
				},
				{
					title: '放货日期',
					dataIndex: 'releaseDateStr',
					customRender
				},
				{
					title: '放货数量（吨）',
					dataIndex: 'quantity',
					customRender
				},
				...stationColumnItem,
				{
					title: '品名',
					dataIndex: 'goodsName'
				},
				{
					title: '最新操作时间',
					dataIndex: 'updateDate'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc',
					scopedSlots: {
						customRender: 'statusDesc'
					},
					fixed: 'right'
				},
				{
					key: 'action',
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					fixed: 'right'
				}
			],
			source: sourceType
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		modulePath() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return modulePath;
		}
	},
	mounted() {
		if (this.modulePath == 'logisticsPlatform') {
			this.defaultParams.stationId = this.VUEX_CURRENT_PLATEFORM.stationId;
		}
		this.getList();
		this.initData();
	},

	methods: {
		initData() {
			this.getStationList('');
		},
		resetFunc() {},
		handleSearchChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		ladingApply() {
			// 新增放货指令
			this.$refs.selectContractModal.showModal();
			// this.confirmSelectContract({});
		},
		tabTypeChange() {
			this.resetSearchQuery();
		},
		resetSearchQuery() {
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
		},
		goContractDetail(item) {
			let type = 'sell';
			let contractType = item.contractType;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type + '/' + contractType.toLowerCase() + '/detail',
				query: {
					id: item.orderContractId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/delivery/detail`,
				query: {
					id: item.id
				}
			});
		},
		// 处理
		handleHandle(item) {
			if (!item.riskAlertId) {
				return;
			}
			let path = '/center/message/instructDetail';
			this.$router.push({
				path: path,
				query: {
					id: item.riskAlertId,
					orderType: item.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell'
				}
			});
		},
		// 编辑
		handleModify(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/delivery/edit`,
				query: {
					id: item.id,
					orderContractId: item.orderContractId,
					contractType: item.contractType
				}
			});
		},
		startInvalid(id) {
			// 开启作废
			this.isShowInvalidModal = true;
			this.invalidParams.id = id;
		},
		confirmInvalid() {
			// 确认作废
			if (!this.invalidParams.cancelReason) {
				this.$message.error('请输入作废原因！');
				return;
			}
			this.invalidParams.source = this.source;
			if (this.source == 'LOGISTICS_STORAGE_CENTER') {
				this.invalidParams.stationId = this.VUEX_CURRENT_PLATEFORM.stationId;
			}
			API_invalidLading({
				...this.invalidParams
			}).then(res => {
				this.$message.success('作废成功！');
				this.isShowInvalidModal = false;
				this.getList();
			});
		},
		// 完结
		handleCompleted(recordId) {
			this.completeId = recordId;
			this.$refs.completeModalInfo.open();
		},
		confirmCompleteItem() {
			let completeParams = {
				id: this.completeId,
				source: this.source
			};
			if (this.source == 'LOGISTICS_STORAGE_CENTER') {
				completeParams.stationId = this.VUEX_CURRENT_PLATEFORM.stationId;
			}

			API_completeLading({
				...completeParams
			}).then(res => {
				this.$refs.completeModalInfo.close();
				this.completeId = '';
				this.$message.success('完结成功！');
				this.getList();
			});
		},
		confirmSelectContract(contractInfo) {
			this.$router.push({
				path: `/center/${this.modulePath}/delivery/add`,
				query: {
					orderContractId: contractInfo.orderContractId,
					contractType: contractInfo.contractType
				}
			});
		},
		// 获取选择的站台信息
		async getStationList(name) {
			const res = await API_getStationList(name);
			this.stationList = res.data || [];
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'stationId') {
					item.options = this.stationList.map(item => {
						return { value: item.id, label: item.name };
					});
				}
			});
		}
	}
};
const customRender = text => text || '-';
const columns = [
	{
		title: '放货指令编号',
		dataIndex: 'releaseInstructNo',
		customRender
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		scopedSlots: { customRender: 'contractNo' }
	},
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		customRender
	},
	{
		title: '买方企业',
		dataIndex: 'buyerName',
		customRender
	},
	{
		title: '放货日期',
		dataIndex: 'releaseDateStr',
		customRender
	},
	{
		title: '放货数量（吨）',
		dataIndex: 'quantity',
		customRender
	},
	{
		title: '仓库名称',
		dataIndex: 'place'
	},
	{
		title: '品名',
		dataIndex: 'goodsName'
	},
	{
		title: '最新操作时间',
		dataIndex: 'updateDate'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: {
			customRender: 'statusDesc'
		},
		fixed: 'right'
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: {
			customRender: 'action'
		},
		fixed: 'right'
	}
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.export-box {
	cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: -2px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: @primary-color;
		line-height: 20px;
	}
}

.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	&.status-BUSINESS_AUDIT,
	&.status-FINANCE_AUDIT {
		background: #ffdac8;
		color: #ff7937;
	}

	&.status-OVER_LIMIT,
	&.status-BUSINESS_REJECT,
	&.status-FINANCE_REJECT {
		background: #f2d0d0;
		color: #d44;
	}

	&.status-COMPLETED,
	&.status-CANCEL {
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}

	&.status-EFFECTIVE_NEAR_LIMIT,
	&.status-EFFECTIVE {
		background: #d3dffb;
		color: #4682f3;
	}
}
</style>
