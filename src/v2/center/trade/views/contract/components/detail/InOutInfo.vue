<template>
	<div style="width: 100%">
		<div
			class="business-line-empty-box"
			v-if="!list.length && JSON.stringify(searchParams) == '{}'"
		>
			<div class="business-line-empty-content">
				<a-row
					type="flex"
					:gutter="30"
				>
					<a-col>
						<img
							src="@/v2/assets/imgs/contract/no_businessline_bg.png"
							alt=""
							style="width: 66px"
						/>
					</a-col>
					<a-col>
						<template
							v-if="
								allStationList.length &&
								(detailData.contract ? detailData.contract.whetherHaveStorageBoo : detailData.whetherHaveStorageBoo)
							"
						>
							<p class="label">当前合同尚未关联{{ type == 'OUT' ? '出库' : '入库' }}信息</p>
							<a-button
								type="primary"
								class="slBtn"
								@click="goInOut"
								>新增{{ type == 'OUT' ? '出库' : '入库' }}</a-button
							>
						</template>
						<p
							v-else
							class="label label2"
							style="margin-top: 25px"
						>
							当前合同尚未关联{{ type == 'OUT' ? '出库' : '入库' }}信息
						</p>
					</a-col>
				</a-row>
			</div>
		</div>
		<div
			class="detail"
			v-else
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getList"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="6"
				ref="slFormNew"
			></SlFormNew>
			<div class="tip-box">
				<div
					class="export-box"
					@click="exportData"
				>
					<ExportIcon></ExportIcon>
					<span class="export-text">数据导出</span>
				</div>
			</div>
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:dataSource="list"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
				>
					<template
						slot="action"
						slot-scope="action, item"
					>
						<a
							href="javascript:;"
							@click="goInOutDetail(item)"
							>详情</a
						>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="handleTableChange"
			/>
		</div>
	</div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from '@sub/components/iPagination';
import { ExportIcon } from '@sub/components/svg';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';

import { getInOutDetailList, exportInOutDetailList } from '@/v2/center/trade/api/contract';
// { title: "文件编号", dataIndex: "no", scopedSlots: { customRender: "no" }, },
const searchList = [
	{
		decorator: ['storageDate'],
		addonBeforeTitle: '入库日期',
		type: 'datePicker',
		placeholder: '请选择入库日期',
		allowClear: false
	},
	{
		decorator: ['goodsName'],
		addonBeforeTitle: '品名',
		type: 'input',
		placeholder: '请输入品名'
	},
	{
		decorator: ['coalPlanNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输上煤计划编号'
	}
];
const searchList2 = [
	{
		decorator: ['storageDate'],
		addonBeforeTitle: '出库日期',
		type: 'datePicker',
		placeholder: '请选择出库日期',
		allowClear: false
	},
	{
		decorator: ['goodsName'],
		addonBeforeTitle: '品名',
		type: 'input',
		placeholder: '请输入品名'
	},
	{
		decorator: ['coalPlanNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输下煤计划编号'
	}
];

export default {
	props: {
		type: {
			default: 'IN'
		},
		detailData: {
			default: () => {
				return {};
			}
		},
		contractType: {
			default: 'ONLINE'
		}
	},
	data() {
		return {
			list: [],
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			loading: false,
			searchParams: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		allStationList() {
			return this.VUEX_CURRENT_PLATEFORM.allStationList || [];
		},
		columns() {
			const txtInfo = {
				typeStr: this.type == 'IN' ? '入库' : '出库',
				coalStr: this.type == 'IN' ? '上煤' : '下煤',
				deliveryStr: this.type == 'IN' ? '发货' : '收货'
			};
			if (this.type == 'IN') {
				return [
					{ title: `${txtInfo.typeStr}日期`, dataIndex: 'storageDate' },
					{ title: '品名', dataIndex: 'goodsName' },
					{ title: '运输方式', dataIndex: 'transportModeDesc', customRender: text => text || '-' },
					{ title: `${txtInfo.typeStr}重量（吨)`, dataIndex: 'weight', customRender: text => text || '-' },
					{ title: `车数`, dataIndex: 'carsNumber', customRender: text => text || '-' },
					{ title: `${txtInfo.coalStr}计划编号`, dataIndex: 'coalPlanNo', customRender: text => text || '-' },
					{ title: '发货单位', dataIndex: 'deliveryReceiveCompanyName', customRender: text => text || '-' },
					{ title: '仓房&货位', dataIndex: 'warehouseGoodsAllocationName', customRender: text => text || '-' },
					{ title: '操作', key: '操作', dataIndex: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
				];
			}
			return [
				{ title: `${txtInfo.typeStr}日期`, dataIndex: 'storageDate' },
				{ title: '品名', dataIndex: 'goodsName' },
				{ title: '运输方式', dataIndex: 'transportModeDesc', customRender: text => text || '-' },
				{ title: `${txtInfo.typeStr}重量（吨)`, dataIndex: 'weight', customRender: text => text || '-' },
				{ title: `车数`, dataIndex: 'carsNumber', customRender: text => text || '-' },
				{ title: `${txtInfo.coalStr}计划编号`, dataIndex: 'coalPlanNo', customRender: text => text || '-' },
				{ title: '收货单位', dataIndex: 'deliveryReceiveCompanyName', customRender: text => text || '-' },
				{ title: '仓房&货位', dataIndex: 'warehouseGoodsAllocationName', customRender: text => text || '-' },
				{ title: '操作', key: '操作', dataIndex: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
			];
		},
		searchList() {
			if (this.type == 'IN') {
				return searchList;
			}
			return searchList2;
		}
	},
	mounted() {
		if (this.contractType == 'OFFLINE') {
			this.init();
		}
	},
	methods: {
		async getList(data) {
			this.searchParams = data || {};
			const params = {
				...this.searchParams,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				storageRecordType: this.type,
				contractType: this.contractType,
				// contractNo: this.detailData.contractNo,
				contractNo: this.detailData.contract ? this.detailData.contract.serialNo : this.detailData.contractNo
			};

			this.loading = true;
			try {
				const res = await getInOutDetailList(params);
				let result = res.result || res.data;
				this.list = result.records;
				const paginationRelation = {
					total: result.total,
					pageSize: result.size,
					current: result.current,
					pageNo: result.current,
					showTotal: function (total) {
						return `共${total}条记录 第${result.current}页 `;
					}
				};
				this.pagination = paginationRelation;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			this.getList();
		},
		init() {
			this.getList();
		},

		async exportData() {
			const params = {
				...this.searchParams,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				storageRecordType: this.type,
				contractType: this.contractType,
				contractNo: this.detailData.contract ? this.detailData.contract.serialNo : this.detailData.contractNo
			};
			const res = await exportInOutDetailList(params);

			const name = `${this.VUEX_ST_COMPANYSUER.companyName}-${this.type == 'IN' ? '入' : '出'}库信息-${moment().format('YYYY-MM-DD')}.xls`;
			comDownload(res.data, undefined, name);
		},
		goCoalplan(item) {
			this.$emit('goCoalplan', item);
		},
		goInOutDetail(item) {
			this.$router.push({
				path: `/center/logisticsPlatform/${this.type.toLocaleLowerCase()}/detail?id=${item.id}`
			});
		},
		// 新增出入库
		goInOut() {
			let serialNo = this.contractType == 'ONLINE' ? this.detailData.contract.serialNo : this.detailData.contractNo;
			if (this.VUEX_CURRENT_PLATEFORM?.allStationList?.length == 1) {
				window.open(
					`/center/logisticsPlatform/${this.type.toLocaleLowerCase()}/add?serialNo=${serialNo}&orderTypeEnum=${this.contractType}`,
					'_blank'
				);
			} else {
				window.open(`/center/logisticsPlatform/coalplan/IN`, '_blank');
			}
		}
	},
	components: {
		SlFormNew,
		iPagination,
		ExportIcon
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.detail {
	width: 100%;
}
.tip-box {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
	margin-bottom: 20px;
}
.export-box {
	display: flex;
	align-items: center;
	color: @primary-color;
	cursor: pointer;
	.export-text {
		margin-left: 6px;
		position: relative;
		top: 2px;
	}
}
.business-line-empty-box {
	margin-top: 20px;
	width: 100%;
	height: 88px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	text-align: center;
	.business-line-empty-content {
		width: 380px;
		margin: 11px auto;
		.label {
			line-height: 20px;
			margin-bottom: 10px;
			color: rgba(0, 0, 0, 0.6);
		}
		.slBtn {
			margin-left: 0;
			float: left;
		}
	}
	.flexStyle {
		display: flex;
		align-items: center;
	}
}
</style>
