<template>
	<div class="detail">
		<div class="search-box">
			<div class="form-box">
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="getList"
					:isShowIcon="false"
					:isShowSearchBox="true"
					:colSpan="6"
					ref="slFormNew"
				></SlFormNew>
			</div>
			<a-button
				type="primary"
				v-if="systemCode.hylg && detailInfo.coalPlanNo && type == 'IN'"
				@click="addRecordDetail"
				style="margin-top: 20px"
				v-auth="'logisticsStorageCenter:inManage:storage:view:addDetail'"
				>新增入库明细</a-button
			>
			<a-button
				type="primary"
				v-if="systemCode.hylg && detailInfo.coalPlanNo && type == 'OUT'"
				@click="addRecordDetail"
				style="margin-top: 20px"
				v-auth="'logisticsStorageCenter:outManage:storage:view:addDetail'"
				>新增出库明细</a-button
			>
		</div>

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
				:scroll="{ x: true }"
				:dataSource="list"
				:columns="columns"
				:pagination="false"
				:rowKey="record => record.id"
				:loading="loading"
			>
				<template
					slot="storageRecordSerialNo"
					slot-scope="action, item"
				>
					<span v-if="item.storageRecordSerialNo">
						<a
							v-if="['TRAIN', 'AUTOMOBILE'].includes(item.transportMode)"
							href="javascript:;"
							@click="goInOutDetail(item)"
							>{{ item.storageRecordSerialNo }}</a
						>
						<span v-else>{{ item.storageRecordSerialNo }}</span>
					</span>

					<span v-else>-</span>
				</template>
				<template
					slot="coalPlanNo"
					slot-scope="action, item"
				>
					<a
						href="javascript:;"
						@click="goCoalplan(item)"
						v-if="item.coalPlanNo"
						>{{ item.coalPlanNo }}</a
					>
					<span v-else>-</span>
				</template>
				<template
					slot="shipperCoincide"
					slot-scope="action, item"
				>
					<span v-if="item.shipperCoincide == true">是</span>
					<span
						v-else-if="item.shipperCoincide == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>
				<template
					slot="departureCoincide"
					slot-scope="action, item"
				>
					<span v-if="item.departureCoincide == true">是</span>
					<span
						v-else-if="item.departureCoincide == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>
				<template
					slot="arriveCoincide"
					slot-scope="action, item"
				>
					<span v-if="item.arriveCoincide == true">是</span>
					<span
						v-else-if="item.arriveCoincide == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>

				<template
					slot="storageDeliverGoods"
					slot-scope="action, item"
				>
					<span v-if="item.storageDeliverGoods == true">是</span>
					<span
						v-else-if="item.storageDeliverGoods == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>
				<template
					slot="arrivedShippingAddress"
					slot-scope="action, item"
				>
					<span v-if="item.arrivedShippingAddress == true">是</span>
					<span
						v-else-if="item.arrivedShippingAddress == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>

				<template
					slot="action"
					slot-scope="action, item"
				>
					<a-space v-if="type == 'IN'">
						<a
							@click.prevent="editRecord(item.id)"
							v-auth="'logisticsStorageCenter:inManage:storage:view:modifyDetail'"
							>修改</a
						>
						<a
							@click.prevent="delRecord(item)"
							v-auth="'logisticsStorageCenter:inManage:storage:view:deleteDetail'"
							>删除</a
						>
					</a-space>
					<a-space v-if="type == 'OUT'">
						<a
							@click.prevent="editRecord(item.id)"
							v-auth="'logisticsStorageCenter:outManage:storage:view:modifyDetail'"
							>修改</a
						>
						<a
							@click.prevent="delRecord(item)"
							v-auth="'logisticsStorageCenter:outManage:storage:view:deleteDetail'"
							>删除</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			size="small"
			@change="handleTableChange"
		/>
		<DelModal
			ref="delModal"
			title="是否确认删除该入库明细"
		></DelModal>
		<a-modal
			:visible="routeListVisible"
			title="轨迹列表"
			width="900px"
			@cancel="routeListVisible = false"
		>
			<a-table
				class="new-table"
				:bordered="false"
				:scroll="{ x: true }"
				:dataSource="routeList"
				:columns="routeListColumns"
				:pagination="false"
				:rowKey="record => record.id"
				:loading="routeLoading"
			>
				<template
					slot="storageDeliverGoods"
					slot-scope="action, item"
				>
					<span v-if="item.storageDeliverGoods == true">是</span>
					<span
						v-else-if="item.storageDeliverGoods == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>
				<template
					slot="arrivedShippingAddress"
					slot-scope="action, item"
				>
					<span v-if="item.arrivedShippingAddress == true">是</span>
					<span
						v-else-if="item.arrivedShippingAddress == false"
						style="color: red"
						>否</span
					>
					<span v-else>-</span>
				</template>
				<template
					slot="action"
					slot-scope="action, item"
				>
					<a-space :size="15">
						<a
							href="javascript:;"
							@click="goRouteRecord(item)"
							>查询轨迹</a
						>
					</a-space>
				</template>
			</a-table>
			<template slot="footer">
				<a-button
					type="primary"
					ghost
					@click="routeListVisible = false"
					>关闭</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from '@sub/components/iPagination';
import { ExportIcon } from '@sub/components/svg';
import DelModal from '@sub/components/DelModal';

// { title: "文件编号", dataIndex: "no", scopedSlots: { customRender: "no" }, },

export default {
	props: {
		type: {
			default: 'IN'
		},
		// 是否展示 实际提/收货 字段
		showActualLadingUnit: {
			default: false
		},
		detailInfo: { default: () => ({}) },
		Fn: {},
		getVehicleList: {},
		transportMode: '' // 运输方式
	},
	inject: {
		addRecordDetail: { from: 'addRecordDetail', default: () => () => {} },
		systemCode: { from: 'systemCode', default: () => ({}) },
		deleteRecords: { from: 'deleteRecords', default: () => () => {} },
		editRecord: { from: 'editRecord', default: () => () => {} }
	},
	data() {
		const typestr = this.type == 'IN' ? '入' : '出';
		return {
			list: [],
			typestr,
			searchList: [
				{
					decorator: ['storageRecordSerialNo'],
					addonBeforeTitle: `${typestr}库流水号`,
					type: 'input',
					placeholder: `请输入${typestr}库流水号`
				},
				{
					decorator: ['licensePlateNumber'],
					addonBeforeTitle: '车牌号',
					type: 'input',
					placeholder: '请输入车牌号'
				}
				// {
				//   decorator: ["storageDate"],
				//   addonBeforeTitle: `${typestr}库时间`,
				//   type: "rangePicker",
				//   showTime:{ format: 'HH:mm' },
				//   format:"YYYY-MM-DD HH:mm:00",
				//   valueFormat:"YYYY-MM-DD HH:mm:00",
				//   md:9,
				//   sm:9,
				//   lg:9,
				//   rangesFormat: "YYYY-MM-DD 08:00:00",
				//   realKey: ["storageStartDate", "storageEndDate"],
				//   getCalendarContainer:()=> {
				//     return () => document.body
				//   }
				// },
			],
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			loading: false,
			routeLoading: false,
			searchParams: {},
			routeList: [],
			routeListVisible: false,
			routeListColumns: [
				{ title: '车牌号', dataIndex: 'licensePlateNumber', customRender: text => text || '-' },
				{ title: '发车时间', dataIndex: 'deliverDate', customRender: text => text || '-' },
				{ title: '是否由仓储地发货', dataIndex: 'storageDeliverGoods', scopedSlots: { customRender: 'storageDeliverGoods' } },
				{ title: '是否抵达收货地', dataIndex: 'arrivedShippingAddress', scopedSlots: { customRender: 'arrivedShippingAddress' } },
				{ title: '操作', dataIndex: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
			]
		};
	},
	computed: {
		isAdmin() {
			return process.env.VUE_APP_SYSTEM_TYPE === 'admin';
		},

		columns() {
			const txtInfo = {
				typeStr: this.type == 'IN' ? '入库' : '出库',
				coalStr: this.type == 'IN' ? '上煤' : '下煤',
				deliveryStr: this.type == 'IN' ? '发货' : '收货'
			};
			const acts = this.showActualLadingUnit
				? [
						{ title: '实际提货单位', dataIndex: 'actualLadingUnit', customRender: text => text || '-' },
						{ title: '实际收货单位', dataIndex: 'actualReceivingUnit', customRender: text => text || '-' }
				  ]
				: [];
			if (this.isAdmin) {
				let cls = [];
				if (this.transportMode === 'TRAIN') {
					// 火运
					cls = [
						{
							title: '托运人是否与合同一致',
							dataIndex: 'shipperCoincide',
							scopedSlots: { customRender: 'shipperCoincide' }
						},
						{
							title: '发站是否与合同一致',
							dataIndex: 'departureCoincide',
							scopedSlots: { customRender: 'departureCoincide' }
						},
						{
							title: '到站是否与合同一致',
							dataIndex: 'arriveCoincide',
							scopedSlots: { customRender: 'arriveCoincide' }
						}
					];
				} else if (this.transportMode === 'AUTOMOBILE') {
					// 汽运
					cls = [
						{
							title: '是否由仓储地发货',
							dataIndex: 'storageDeliverGoods',
							scopedSlots: { customRender: 'storageDeliverGoods' }
						},
						{
							title: '是否抵达收货地',
							dataIndex: 'arrivedShippingAddress',
							scopedSlots: { customRender: 'arrivedShippingAddress' }
						}
					];
				}
				return [
					{
						title: `${txtInfo.typeStr}流水号`,
						dataIndex: 'storageRecordSerialNo',
						fixed: 'left',
						scopedSlots: { customRender: 'storageRecordSerialNo' }
					},
					{ title: '品名', dataIndex: 'goodsName' },
					{ title: `${txtInfo.typeStr}日期`, dataIndex: 'storageDate' },
					{ title: `${txtInfo.typeStr}重量（吨)`, dataIndex: 'weight' },
					{ title: '矿发净重（吨）', dataIndex: 'loadingWeight', customRender: text => text || '-' },
					{ title: '亏损（吨）', dataIndex: 'lossWeight', customRender: text => text || '-' },
					{ title: '车次', dataIndex: 'carNumber', customRender: text => text || '-' },
					{ title: '车牌号', dataIndex: 'licensePlateNumber', customRender: text => text || '-' },
					{ title: '运输方式', dataIndex: 'transportModeDesc', customRender: text => text || '-' },
					{ title: '数据类型', dataIndex: 'dataSourceDesc', customRender: text => text || '-' },
					{ title: '仓房&货位', dataIndex: 'warehouseGoodsAllocationName', customRender: text => text || '-' },
					{ title: '发货单位', dataIndex: 'deliveryCompanyName', customRender: text => text || '-' },
					{ title: '收货单位', dataIndex: 'receivingCompanyName', customRender: text => text || '-' },
					...acts,
					{ title: `关联${txtInfo.coalStr}计划编号`, dataIndex: 'coalPlanNo', scopedSlots: { customRender: 'coalPlanNo' } },
					...cls,
					{ title: '操作', dataIndex: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
				];
			} else {
				const columns = [
					{
						title: `${txtInfo.typeStr}流水号`,
						dataIndex: 'storageRecordSerialNo',
						fixed: 'left',
						scopedSlots: { customRender: 'storageRecordSerialNo' }
					},
					{ title: '品名', dataIndex: 'goodsName' },
					{ title: `${txtInfo.typeStr}时间`, dataIndex: 'storageDate' },
					{ title: `${txtInfo.typeStr}重量（吨)`, dataIndex: 'weight' },
					// { title: "矿发净重（吨）", dataIndex: "loadingWeight", customRender: text => text || '-'},
					// { title: "亏损（吨）", dataIndex: "lossWeight",customRender: text => text || '-' },
					{ title: '车牌号', dataIndex: 'licensePlateNumber', customRender: text => text || '-' },
					{ title: '运输方式', dataIndex: 'transportModeDesc', customRender: text => text || '-' },
					{ title: '派车方式', dataIndex: 'generateTypeDesc', customRender: text => text || '-' },
					{ title: '仓房&货位', dataIndex: 'warehouseGoodsAllocationName', customRender: text => text || '-' },
					{ title: '发货单位', dataIndex: 'deliveryCompanyName', customRender: text => text || '-' },
					{ title: '收货单位', dataIndex: 'receivingCompanyName', customRender: text => text || '-' },
					...acts,
					{ title: `关联${txtInfo.coalStr}计划编号`, dataIndex: 'coalPlanNo', scopedSlots: { customRender: 'coalPlanNo' } }
				];
				if (this.systemCode.hylg) {
					columns.push({
						title: '操作',
						dataIndex: 'action',
						fixed: 'right',
						width: 100,
						scopedSlots: { customRender: 'action' }
					});
				}
				return columns;
			}
			
		}
	},
	mounted() {
		this.getList();
	},

	methods: {
		async getList(data) {
			this.searchParams = data || {};
			const params = {
				...this.searchParams,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				storageRecordType: this.type,
				id: this.$route.query.id
			};

			this.loading = true;
			try {
				const res = await this.Fn(params);
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
		async getRouteList(item) {
			if (!this.getVehicleList) {
				return;
			}
			this.routeListVisible = true;
			this.routeLoading = true;
			try {
				const res = await this.getVehicleList({
					storageRecordId: item.id
				});
				let result = res.result || res.data;
				this.routeList = result;
				this.routeLoading = false;
			} catch (error) {
				this.routeLoading = false;
			}
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			this.getList();
		},
		exportData() {
			const params = {
				...this.searchParams,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				storageRecordType: this.type,
				id: this.$route.query.id
			};
			this.$emit('exportDetailData', params);
		},
		goCoalplan(item) {
			this.$emit('goCoalplan', item);
		},
		goInOutDetail(item) {
			this.$emit('goInOutDetail', item);
		},
		goRouteRecord(item) {
			this.$emit('goRouteRecord', item);
		},
		startTrainQuery(item) {
			this.$emit('startTrainQuery', item);
		},
		queryTrainTrack(item) {
			this.$emit('queryTrainTrack', item);
		},
		delRecord(item) {
			this.$refs.delModal.open(async type => {
				if (type !== 'ok') {
					return;
				}
				const { success } = await this.deleteRecords(item.id);
				if (!success) {
					return;
				}
				this.$message.success('删除成功');
				this.$refs.delModal.close();
				this.getList();
			});
		}
	},
	components: {
		SlFormNew,
		iPagination,
		ExportIcon,
		DelModal
	}
};
</script>
<style lang="less" scoped>
@import url('../style/table.less');
@import url('../style/style.less');
</style>
<style scoped lang="less">
.search-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.form-box {
		flex: 1;
	}
}
.detail {
	width: 100%;
}
.tip-box {
	display: flex;
	justify-content: flex-end;
	margin-top: 30px;
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
</style>
