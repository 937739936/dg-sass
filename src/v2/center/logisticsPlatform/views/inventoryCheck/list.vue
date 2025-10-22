<template>
	<div class="slMain">
		<a-card
			class="custom-card"
			:bordered="false"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>盘库管理</span
				>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handleFilterChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<div class="table-actions-box">
					<a-tooltip placement="topLeft">
						<template slot="title">
							<span> 支持对货位进行盘库，单次盘库耗时30分钟左右 </span>
						</template>
						<div
							class="check-action"
							@click="manualInventoryCheck()"
						>
							手动盘库
						</div>
					</a-tooltip>
					<ConfigProvider :autoInsertSpaceInButton="false">
						<a-button
							class="export-action"
							type="primary"
							:loading="exportLoading"
							ghost
							@click="exportExcel()"
							>导出
						</a-button>
					</ConfigProvider>
				</div>
				<a-table
					class="new-table"
					:bordered="false"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="false"
					:scroll="{ x: true }"
				>
					<template
						slot="coalType"
						slot-scope="text"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="isNeedShowCoalTypeTooltip(text)"
								slot="title"
							>
								<span>
									{{ text }}
								</span>
							</template>
							<span class="coalType">{{ text || '-' }}</span>
						</a-tooltip>
					</template>
					<div
						slot="statusText"
						slot-scope="text, item"
						:class="`statusDes status-${item.status}`"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="item.status == 'PROCESSING'"
								slot="title"
							>
								<span> 正在进行盘库计算处理，预计用时30分钟，盘库完成后显示盘库结果 </span>
							</template>
							<span>{{ text || '-' }}</span>
						</a-tooltip>
					</div>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a
								@click.prevent="pushToDetail(record)"
								style="padding-right: 10px"
								>详情</a
							>
						</a-space>
					</div>
				</a-table>

				<i-pagination
					:pagination="pagination"
					size="small"
					:pageSizeOptions="['10', '50', '100', '150', '200']"
					:defaultPageSize="10"
					@change="getList"
				/>
			</div>
			<div class="hw-banner">
				<img
					src="@/v2/assets/imgs/logisticsPlatform/hw-logo.png"
					alt=""
				/>
				<div class="hw-banner-line"></div>
				<div class="hw-banner-des">
					联合华为<span class="hw-banner-des-light">激光雷达+三维重建算法(室内)、无人机+三维重建算法(室外)</span
					>，对站台进行智能建模，计算货物体积和重量。
				</div>
			</div>
		</a-card>

		<ManualInventoryModal
			ref="manualInventoryModal"
			@startNewAutoCheck="startNewAutoCheck"
		/>
	</div>
</template>

<script>
import { getHouseListNew } from '../../api/selectData';
import iPagination from "@sub/components/iPagination";
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import ManualInventoryModal from './components/ManualInventoryModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import { getInventoryTaskList, exportInventoryTaskList } from '../../api';
import { isEqual } from 'lodash';
import { ConfigProvider } from 'ant-design-vue';
import { mapGetters } from 'vuex';
export default {
	mixins: [ListMixin],
	components: {
		iPagination,
		ManualInventoryModal,
		ConfigProvider
	},
	data() {
		return {
			searchList: DefaultSearchList,
			columns: Columns,
			exportLoading: false,
			url: {
				list: getInventoryTaskList
			},
			houseList: [] // 仓房列表{value,lable,goodsAllocations}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否是仓储企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		}
	},
	mounted() {
		if (!this.isCoreCompany) {
			this.searchList.unshift({
				decorator: ['goodsOwnerCompanyName'],
				addonBeforeTitle: '货主',
				type: 'input',
				placeholder: '请选择货主'
			});
		}
		this.initData();
	},
	methods: {
		handleFilterChange(data) {
			let searchParams = { ...data };
			// 处理筛选条件变化
			if (isEqual(searchParams, this.searchParams)) {
				return;
			}
			if (searchParams.houseId != this.searchParams.houseId) {
				this.configGoodsAllocationList(searchParams.houseId);
				if (searchParams.goodsAllocationId) {
					// 这里会重新执行handleFilterChange
					this.$refs.searchForm.deleteSearchItemByKey('goodsAllocationId');
					return;
				}
			}
			this.searchParams = searchParams;
			this.changeSearch(searchParams);
		},
		// 初始化数据
		initData() {
			this.requestHouseList();
		},
		// 获取仓房列表
		requestHouseList() {
			getHouseListNew().then(res => {
				if (!res.success) {
					return;
				}
				let houseList = res.data ?? [];
				houseList = houseList.map(item => {
					let itemGoodsAllocations = item.goodsAllocations ?? [];
					const goodsAllocations = itemGoodsAllocations.map(good => {
						return { value: good.id, label: good.name };
					});
					return {
						value: item.id,
						label: item.name,
						goodsAllocations: goodsAllocations
					};
				});
				this.houseList = houseList;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'houseId') {
						item.options = houseList;
					}
				});
			});
		},
		// 获取货位名称列表
		configGoodsAllocationList(houseId) {
			let goodsAllocations = [];
			if (houseId) {
				// 当前选中的仓房对象
				const selectHouseItem = this.houseList.find(houseItem => houseItem.value == houseId);
				goodsAllocations = selectHouseItem?.goodsAllocations ?? [];
			}
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'goodsAllocationId') {
					item.options = goodsAllocations;
				}
			});
		},
		// 手动盘库
		manualInventoryCheck() {
			this.$refs.manualInventoryModal.show();
		},
		exportExcel() {
			// 下载报告
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				...this.pageSize
			};
			this.exportLoading = true;
			exportInventoryTaskList(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.exportLoading = false;
				});
		},
		// 跳转到详情
		pushToDetail(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/inventoryCheck/detail',
				query: {
					id: record.id
				}
			});
		},
		// 是否需要显示煤种tooltip
		isNeedShowCoalTypeTooltip(text) {
			let coalType = text ?? '';
			coalType = coalType.replace('，', ',');
			let coalTypeList = coalType.split(',');
			if (coalTypeList.length > 1) {
				return true;
			}
			return false;
		},
		startNewAutoCheck() {
			this.getList();
		}
	}
};

// 默认搜索表单数据
const DefaultSearchList = [
	{
		decorator: ['houseId'],
		addonBeforeTitle: '仓房名称',
		type: 'select',
		placeholder: '请选择仓房名称',
		options: []
	},
	{
		decorator: ['goodsAllocationId'],
		addonBeforeTitle: '货位名称',
		type: 'select',
		placeholder: '请选择货位名称',
		options: []
	},
	{
		decorator: ['inventoryDate'],
		addonBeforeTitle: '盘库时间',
		type: 'rangePicker',
		realKey: ['inventoryDateStart', 'inventoryDateEnd']
	},
	{
		decorator: ['inventoryType'],
		addonBeforeTitle: '盘库类型',
		type: 'select',
		placeholder: '请选择盘库类型',
		options: [
			{
				value: 'MANUAL',
				label: '手动盘库'
			},
			{
				value: 'AUTO',
				label: '定时盘库'
			}
		]
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '盘库状态',
		type: 'select',
		placeholder: '请选择盘库状态',
		options: [
			{
				value: 'PROCESSING',
				label: '盘库中'
			},
			{
				value: 'COMPLETED',
				label: '已完成'
			}
		]
	}
];
const customRender = text => {
	if (text == 0) {
		return '0';
	}
	return text || '-';
};
const Columns = [
	{ title: '仓房名称', dataIndex: 'houseName', key: 'houseName', customRender },
	{
		title: '货位名称',
		dataIndex: 'goodsAllocationName',
		key: 'goodsAllocationName',
		customRender
	},
	{
		title: '所属货主',
		dataIndex: 'goodsOwnerCompanyName',
		key: 'goodsOwnerCompanyName',
		customRender
	},
	{
		title: '盘库时间',
		dataIndex: 'inventoryDate',
		key: 'inventoryDate',
		customRender
	},
	{
		title: '煤种',
		dataIndex: 'coalType',
		key: 'coalType',
		scopedSlots: { customRender: 'coalType' }
	},
	{
		title: '体积(m³)',
		dataIndex: 'volume',
		key: 'volume',
		customRender
	},
	{
		title: '密度(吨/m³)',
		dataIndex: 'density',
		key: 'density',
		customRender
	},
	{
		title: '重量(吨)',
		dataIndex: 'weight',
		key: 'weight',
		customRender
	},
	{
		title: '盘库类型',
		dataIndex: 'inventoryTypeText',
		key: 'inventoryTypeText',
		customRender
	},
	{
		title: '盘库状态',
		dataIndex: 'statusText',
		key: 'statusText',
		scopedSlots: { customRender: 'statusText' },
		fixed: 'right'
	},
	{
		title: '操作',
		dataIndex: '操作',
		key: '操作',
		scopedSlots: { customRender: 'action' },
		fixed: 'right'
	}
];
</script>



<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	height: calc(100vh - 84px);
	margin-top: -10px;
	.custom-card {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: 52px;
	}
	/deep/.ant-card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.table-box {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.table-actions-box {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		// border: 1px solid red;
		margin-bottom: 20px;
		.check-action {
			padding-left: 30px;
			padding-right: 30px;
			height: 32px;
			border-radius: 4px;
			background: @primary-color;
			color: #fff;
			font-size: 14px;
			display: flex;
			align-items: center;
			cursor: pointer;
		}
		.export-action {
			margin-left: 30px;
			padding-left: 30px;
			padding-right: 30px;
			height: 32px;
			border-radius: 4px;
			border: 1px solid @primary-color;
			background: #fff;
			color: @primary-color;
			font-size: 14px;
			display: flex;
			align-items: center;
			cursor: pointer;
		}
	}
	.hw-banner {
		// position: sticky;
		// bottom: 0;
		margin-top: 30px;
		width: 100%;
		max-height: 100px;
		aspect-ratio: 1612/100;
		background: url(~@/v2/assets/imgs/logisticsPlatform/hw-bg.png) 100% 100%;
		background-size: 100% 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 20px;
		img {
			// width: 148.017px;
			height: 28%;
		}
		.hw-banner-line {
			width: 2px;
			height: 24px;
			background: #cee3e8;
			margin: 0 20px;
		}
		.hw-banner-des {
			font-size: 16px;
			font-weight: 500;
			color: #000000cc;
		}
		.hw-banner-des-light {
			color: @primary-color;
		}
	}
	.coalType {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 200px;
		display: block;
	}
	.statusDes {
		display: inline-block;
		padding: 0px 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 20px;
		background: #ffdac8;
		color: #ff7937;
		cursor: pointer;
		&.status-PROCESSING {
			// 业务审批中 财务审批中
			background: #ffdac8;
			color: #ff7937;
		}
		&.status-COMPLETED {
			// 业务驳回 财务驳回
			background: #e0e0e0;
			color: #00000040;
		}
	}
}
</style>