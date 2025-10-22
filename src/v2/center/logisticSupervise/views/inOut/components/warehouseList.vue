<template>
	<a-card :bordered="false">
		<span
			slot="title"
			class="slTitle"
			><span>{{ type == 'in' ? '入' : '出' }}库记录</span></span
		>
		<div class="tabs-box">
			<a-tabs
				v-model="activeTab"
				@change="tabChange"
			>
				<a-tab-pane
					v-for="item in tabList"
					:key="item.value"
				>
					<span slot="tab">
						{{ item.label }}
					</span>
				</a-tab-pane>
			</a-tabs>
			<div
				class="right-box"
				v-if="source != 'admin'"
			>
				<a-tooltip
					placement="bottomRight"
					trigger="hover"
					overlayClassName="add-logistic-in-out-tooltips"
					:getPopupContainer="getPopupContainer"
				>
					<template slot="title">
						<div class="btn-box-menu">
							<div
								class="btn-box-menu-item"
								@click="add('0', iconList[type]['0']['type'])"
								@mouseover="mouseOver($event)"
								@mouseleave="mouseLeave($event)"
							>
								<div class="btn-box-menu-icon">
									<img
										class="icon-left"
										:src="iconList[type]['0']['icon']"
										alt=""
									/>
									<p class="btn-box-menu-item-title">{{ type === 'in' ? '采购入库' : '销售出库' }}</p>
								</div>
								<img
									class="icon-right"
									src="@/v2/assets/imgs/contract/right_arrow_icon.png"
									alt=""
								/>
							</div>
							<div
								class="btn-box-menu-item"
								@click="add('1', iconList[type]['1']['type'])"
								@mouseover="mouseOver($event)"
								@mouseleave="mouseLeave($event)"
							>
								<div class="btn-box-menu-icon">
									<img
										class="icon-left"
										:src="iconList[type]['1']['icon']"
										alt=""
									/>
									<p class="btn-box-menu-item-title">{{ type === 'in' ? '盘盈入库' : '盘亏出库' }}</p>
								</div>
								<img
									class="icon-right"
									src="@/v2/assets/imgs/contract/right_arrow_icon.png"
									alt=""
								/>
							</div>
						</div>
					</template>
					<div>
						<a-button
							type="primary"
							class="add"
							v-if="type == 'in'"
							v-auth="auth"
						>
							<span>新增入库</span>
						</a-button>
						<a-button
							type="primary"
							class="add"
							v-if="type == 'out'"
							v-auth="auth"
						>
							<span>新增出库</span>
						</a-button>
					</div>
				</a-tooltip>
			</div>
		</div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			:isShowIcon="false"
			:isShowSearchBox="true"
			:colSpan="6"
			@resetFunc="resetFunc"
			ref="slFormNew"
		></SlFormNew>
		<div class="tip-box">
			<div style="color: var(--text-80, rgba(0, 0, 0, 0.8))">
				<span> 今日{{ type == 'in' ? '入' : '出' }}库量 {{ statisticsInfo.todayWeight }}（吨）</span>
				<span style="margin-left: 30px"
					>本月累计{{ type == 'in' ? '入' : '出' }}库量：{{ statisticsInfo.currentMonthWeight }}（吨）</span
				>
			</div>
			<div
				class="export-box"
				@click="exportData"
			>
				<ExportIcon></ExportIcon>
				<span class="export-text">数据导出</span>
			</div>
		</div>
		<!-- 表格 -->
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
					slot="warehouseName"
					slot-scope="text"
				>
					<span v-if="!text">-</span>
					<a-tooltip v-else-if="text.length > 1">
						<template slot="title">{{ text.join(',') }}</template>
						{{ text[0] }}...
					</a-tooltip>
					<span v-else-if="text.length == 1">{{ text[0] }}</span>
					<span v-else>-</span>
				</template>
				<template
					slot="goodsAllocationName"
					slot-scope="text"
				>
					<span v-if="!text">-</span>
					<a-tooltip v-else-if="text.length > 1">
						<template slot="title">{{ text.join(',') }}</template>
						{{ text[0] }}...
					</a-tooltip>
					<span v-else-if="text.length == 1">{{ text[0] }}</span>
					<span v-else>-</span>
				</template>
				<template
					slot="deliveryReceiveCompanyName"
					slot-scope="text"
				>
					<a-tooltip v-if="text">
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text }}</p>
					</a-tooltip>
					<span v-else>-</span>
				</template>
				<template
					slot="deliveryCompanyName"
					slot-scope="text"
				>
					<a-tooltip>
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text }}</p>
					</a-tooltip>
				</template>
				<template
					slot="receivingCompanyName"
					slot-scope="text"
				>
					<a-tooltip>
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text }}</p>
					</a-tooltip>
				</template>
				<template
					slot="warehouseGoodsAllocationName"
					slot-scope="text"
				>
					<a-tooltip v-if="text">
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text || '-' }}</p>
					</a-tooltip>
					<span v-else>-</span>
				</template>
				<template
					slot="goodsName"
					slot-scope="text"
				>
					<a-tooltip v-if="text">
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text || '-' }}</p>
					</a-tooltip>
					<span v-else>-</span>
				</template>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<template>
							<!-- <a @click.prevent="edit(record)">编辑</a> -->
							<a @click.prevent="detail(record)">详情</a>
							<a
								@click.prevent="del(record)"
								v-if="source != 'admin' && record.sourceType == 'MANUAL_ADD'"
								v-auth="auth"
								>删除</a
							>
						</template>
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
			@ok="confirmDel"
		>
			<p style="margin-top: 18px; color: rgba(0, 0, 0, 0.5)">
				该{{ type == 'in' ? '入' : '出' }}库管理信息{{ type == 'in' ? '入' : '出' }}库数量共：{{ currentItem.weight }}吨
			</p>
			<p style="color: rgba(0, 0, 0, 0.5)">确定删除后，数据无法恢复。</p>
		</DelModal>
		<!-- 关联合同 -->
	</a-card>
</template>

<script>
const iconList = {
	in: {
		0: {
			icon: require('@/v2/assets/imgs/warehouse/icon-in-buy.png'),
			type: 'PURCHASE_IN'
		},
		1: {
			icon: require('@/v2/assets/imgs/warehouse/icon-in-inventory.png'),
			type: 'PROFIT_IN'
		}
	},
	out: {
		0: {
			icon: require('@/v2/assets/imgs/warehouse/icon-out-sell.png'),
			type: 'SALE_OUT'
		},
		1: {
			icon: require('@/v2/assets/imgs/warehouse/icon-out-inventory.png'),
			type: 'LOSS_OUT'
		}
	}
};
import DelModal from '@sub/components/DelModal.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from '@sub/components/iPagination';
import { getPopupContainer } from '@/v2/utils/factory.js';
import moment from 'moment';
import { ExportIcon } from '@sub/components/svg';
import { getTransferWarehouseList } from '@/v2/center/logisticSupervise/api/settle';

const renderSearchList = (type, source, isAUTOMOBILE, isManager) => {
	const str = type == 'in' ? '入' : '出';
	const str2 = type == 'in' ? '发' : '收';
	const str3 = type == 'in' ? '上' : '下';

	let searchList = [
		{
			decorator: ['no'],
			addonBeforeTitle: '编号',
			type: 'input',
			placeholder: `请输入合同编号、${str}库编号`
		},
		{
			decorator: ['deliveryReceiveCompanyName'],
			addonBeforeTitle: `${str2}货单位`,
			type: 'input',
			placeholder: `请输入${str2}货单位`
		},
		{
			decorator: ['storageDate'],
			addonBeforeTitle: `${str}库日期`,
			type: 'rangePicker',
			realKey: ['storageStartDate', 'storageEndDate']
		},
		{
			decorator: ['goodsName'],
			addonBeforeTitle: '品名',
			type: 'input',
			placeholder: '请输入品名'
		},
		{
			decorator: ['stationId'],
			addonBeforeTitle: '仓库名称',
			type: 'select',
			placeholder: '请选择仓库',
			options: []
		},
		{
			decorator: ['storageType'],
			addonBeforeTitle: `${str}库类型`,
			type: 'select',
			placeholder: `请选择${str}库类型`,
			options:
				type == 'in'
					? [
							{
								label: '采购入库',
								value: 'PURCHASE_IN'
							},
							{
								label: '盘盈入库',
								value: 'PROFIT_IN'
							}
					  ]
					: [
							{
								label: '销售出库',
								value: 'SALE_OUT'
							},
							{
								label: '盘亏出库',
								value: 'LOSS_OUT'
							}
					  ]
		}
	];
	if (source == 'rest') {
		if (isManager) {
			searchList[0].placeholder = `请输入${str}库编号`;
			let index = searchList.findIndex(item => item.decorator[0] == 'deliveryReceiveCompanyName');
			searchList.splice(
				index,
				1,
				{
					decorator: ['deliveryCompanyName'],
					addonBeforeTitle: '发货单位',
					type: 'input',
					placeholder: '请输入发货单位'
				},
				{
					decorator: ['receivingCompanyName'],
					addonBeforeTitle: '收货单位',
					type: 'input',
					placeholder: '请输入收货单位'
				}
			);
			let excludes = ['hasBusinessLine', 'businessLineNo'];
			searchList = searchList.filter(item => !excludes.includes(item.decorator[0]));
		}
		return searchList;
	}
};

export default {
	props: {
		// 类型
		type: { default: 'in' },
		//列表 接口api
		listFn: {},
		// 仓房接口api
		houseApi: {},
		// 统计api
		statisticsApi: {},
		// 站台
		stationListApi: {},
		delApi: {},
		// 是不是核心企业
		isCoreCompany: {
			type: Boolean,
			default: () => true
		},
		//是不是物流站台管理服务
		isManager: {
			type: Boolean,
			default: () => true
		},
		auth: {
			default: ''
		}
	},
	data() {
		return {
			iconList,
			searchList: [],
			list: [],
			searchParams: {},
			pagination: {
				pageNo: 1,
				total: 10,
				pageSize: 10
			},
			loading: false,
			// 仓房列表
			houseList: [],
			stationList: [],
			tabList: [
				{ value: '', label: '全部' },
				{ value: 'AUTOMOBILE', label: '汽运' },
				{ value: 'TRAIN', label: '火运' },
				{ value: 'SHIP', label: '船运' }
			],
			activeTab: '',
			// 统计数据
			statisticsInfo: {},
			// 当前操作的像
			currentItem: {},
			source: 'rest',
			productCode: 'LOGIC_DELIVER'
		};
	},
	computed: {
		columns() {
			const txtInfo = {
				typeStr: this.type == 'in' ? '入库' : '出库',
				coalStr: this.type == 'in' ? '上煤' : '下煤',
				deliveryStr: this.type == 'in' ? '发货' : '收货'
			};
			if (this.source == 'admin') {
				return [
					{ title: `站台`, key: 'stationName', dataIndex: 'stationName' },
					{ title: `${txtInfo.typeStr}日期`, key: 'storageDate', dataIndex: 'storageDate' },
					{ title: `品名`, key: 'goodsName', dataIndex: 'goodsName', scopedSlots: { customRender: 'goodsName' } },
					{ title: `${txtInfo.typeStr}数量(吨)`, key: 'weight', dataIndex: 'weight' },
					{ title: `车数`, key: 'carsNumber', dataIndex: 'carsNumber', customRender: t => t || '-' },
					{ title: `合同编号`, key: 'contractNo', dataIndex: 'contractNo', customRender: t => t || '-' },
					{ title: `业务线号`, key: 'businessLineNo', dataIndex: 'businessLineNo', customRender: t => t || '-' },
					{ title: `${txtInfo.coalStr}计划`, key: 'coalPlanNo', dataIndex: 'coalPlanNo', customRender: t => t || '-' },
					{
						title: `发货单位`,
						key: 'deliveryCompanyName',
						dataIndex: 'deliveryCompanyName',
						scopedSlots: { customRender: 'deliveryCompanyName' }
					},
					{
						title: `收货单位`,
						key: 'receivingCompanyName',
						dataIndex: 'receivingCompanyName',
						scopedSlots: { customRender: 'receivingCompanyName' }
					},
					{
						title: `仓房-货位`,
						key: 'warehouseGoodsAllocationName',
						dataIndex: 'warehouseGoodsAllocationName',
						scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
					},
					{ title: `数据类型`, key: 'sourceTypeText', dataIndex: 'sourceTypeText', customRender: t => t || '-' },
					{ title: '操作', key: '操作', dataIndex: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
				];
			}
			let restColumn = [
				{ title: `${txtInfo.typeStr}日期`, key: 'storageDate', dataIndex: 'storageDate' },
				{ title: `品名`, key: 'goodsName', dataIndex: 'goodsName', scopedSlots: { customRender: 'goodsName' } },
				{ title: `${txtInfo.typeStr}数量(吨)`, key: 'weight', dataIndex: 'weight' },
				{ title: `车数`, key: 'carsNumber', dataIndex: 'carsNumber', customRender: t => t || '-' },
				{ title: `运输合同编号`, key: 'contractNo', dataIndex: 'contractNo', customRender: t => t || '-' },
				{ title: `仓库`, key: 'stationName', dataIndex: 'stationName', customRender: t => t || '-' },
				{ title: `${txtInfo.typeStr}类型`, key: 'storageTypeText', dataIndex: 'storageTypeText', customRender: t => t || '-' },
				{
					title: `${txtInfo.deliveryStr}单位`,
					key: 'deliveryReceiveCompanyName',
					dataIndex: 'deliveryReceiveCompanyName',
					scopedSlots: { customRender: 'deliveryReceiveCompanyName' }
				},

				{ title: `数据类型`, key: 'sourceTypeText', dataIndex: 'sourceTypeText', customRender: t => t || '-' },
				{ title: '操作', key: '操作', dataIndex: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
			];
			if (this.isManager) {
				let index = restColumn.findIndex(item => item.key == 'deliveryReceiveCompanyName');
				restColumn.splice(
					index,
					1,
					{
						title: '发货单位',
						key: 'deliveryCompanyName',
						dataIndex: 'deliveryCompanyName',
						scopedSlots: { customRender: 'deliveryCompanyName' }
					},
					{
						title: '收货单位',
						key: 'receivingCompanyName',
						dataIndex: 'receivingCompanyName',
						scopedSlots: { customRender: 'receivingCompanyName' }
					}
				);
				let excludes = ['contractNo', 'businessLineNo'];
				restColumn = restColumn.filter(item => !excludes.includes(item.key));
			}
			return restColumn;
		}
	},
	created() {
		this.searchList = renderSearchList(this.type, this.source, this.activeTab === '汽运', this.isManager);
	},
	mounted() {
		this.getSubsystemOptions();
		if (Object.keys(this.$route.query).length == 0) {
			this.getList();
			return;
		}
		this.initData();
	},

	methods: {
		getPopupContainer,
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		initData() {
			return new Promise(async resolve => {
				let {
					stationId,
					coalType,
					houseId,
					goodsAllocationId,
					storageDate,
					storageStartDate,
					storageEndDate,
					businessLineNo,
					deliveryReceiveCompanyName,
					deliveryCompanyName,
					receivingCompanyName
				} = this.$route.query || {};
				let search = {
					coalType,
					houseId,
					goodsAllocationId,
					storageStartDate,
					storageEndDate,
					businessLineNo
				};

				if (deliveryReceiveCompanyName) {
					search.deliveryReceiveCompanyName = deliveryReceiveCompanyName;
				}
				if (receivingCompanyName) {
					search.receivingCompanyName = receivingCompanyName;
				}
				if (deliveryCompanyName) {
					search.deliveryCompanyName = deliveryCompanyName;
				}

				if (storageDate) {
					search.storageDate = [moment(), moment()];
					search.storageStartDate = moment().format('YYYY-MM-DD');
					search.storageEndDate = moment().format('YYYY-MM-DD');
				} else if (storageStartDate && storageEndDate) {
					search.storageDate = [moment(storageStartDate), moment(storageEndDate)];
				}

				this.$nextTick(() => {
					Object.keys(search).forEach(key => {
						if (!search[key]) {
							delete search[key];
						}
					});
					this.$refs.slFormNew.initData(search);
					delete search.storageDate;
					delete search.coalType;
					delete search.houseId;
					delete search.goodsAllocationId;
					this.handleChange(search);
					resolve(true);
				});
			});
		},
		async getSubsystemOptions() {
			const res = await getTransferWarehouseList();
			this.warehouseList = res.data;
			this.searchList[4].options = res.data.map(el => {
				return {
					...el,
					value: el.id,
					label: el.name
				};
			});
		},
		handleChange(data) {
			this.searchParams = data;
			this.getList();
		},
		async getList() {
			this.loading = true;
			const params = {
				...this.searchParams,
				...this.pagination,
				type: this.type.toUpperCase(),
				storageRecordType: this.type.toUpperCase(),
				transportMode: this.activeTab || null,
				source: this.productCode
			};
			try {
				const res = await this.listFn(params);
				this.list = res.data.records || [];
				this.pagination.total = res.data.total || 0;
				this.loading = false;
				this.getStatisticsApi();
			} catch (error) {
				this.loading = false;
			}
		},
		tabChange() {
			this.searchList = renderSearchList(this.type, this.source, this.activeTab === 'AUTOMOBILE', this.isManager);
			this.getList();
			this.getSubsystemOptions();
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			this.getList();
		},
		// 获取站台列表
		async getStationList() {
			const res = await this.stationListApi();
			this.stationList = res.data;
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'stationId') {
					item.options = this.stationList.map(item => {
						return { value: item.key, label: item.value };
					});
				}
			});
		},
		// 重置
		resetFunc() {
			this.searchParams = {};
			this.getList();
		},
		async getStatisticsApi() {
			const params = {
				...this.searchParams,
				...this.pagination,
				type: this.type.toUpperCase(),
				storageRecordType: this.type.toUpperCase(),
				transportMode: this.activeTab || null,
				source: this.productCode
			};
			const res = await this.statisticsApi(params);
			this.statisticsInfo = res.data;
		},
		del(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		// 确认删除
		async confirmDel() {
			const params = {
				id: this.currentItem.id,
				source: this.productCode
			};
			await this.delApi(params);
			this.$message.success('删除成功');
			this.$refs.delModal.close();
			this.getList();
		},
		detail(item) {
			this.$emit('detail', item);
		},
		edit(item) {
			this.$emit('edit', item);
		},
		// 新增
		add(type, typeRecord) {
			this.$emit('add', type, typeRecord);
		},
		exportData() {
			const params = {
				...this.searchParams,
				...this.pagination,
				type: this.type.toUpperCase(),
				storageRecordType: this.type.toUpperCase(),
				transportMode: this.activeTab || null
			};
			this.$emit('export', params);
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
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.tabs-box {
	position: relative;

	.right-box {
		position: absolute;
		right: 0;
		top: 10px;
		// text-align: right;
		cursor: pointer;
		z-index: 10;
		display: flex;
		align-items: center;
	}

	.oa-box {
		display: flex;
		align-items: center;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
	}

	.line {
		width: 1px;
		height: 13px;
		background: #e5e6eb;
		margin: 0 20px;
	}
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

.add {
	border-radius: 4px;
	border: 0px solid @primary-color;
	display: inline-flex;
	padding: 5px 14px;
	align-items: center;
	gap: 4px;
	background: @primary-color;
}

.tip-box {
	display: flex;
	justify-content: space-between;
	margin-top: 50px;
	margin-bottom: 20px;
}

.omit {
	max-width: 250px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin: 0;
}

.btn-box-menu {
	.btn-box-menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		height: 64px;
		margin-bottom: 8px;
		padding: 0 3px 0 12px;
		border-radius: 4px;
		width: 254px;

		.icon-left {
			width: 40px;
			height: 40px;
		}

		.icon-right {
			width: 14px;
			height: 14px;
			vertical-align: middle;
		}

		.btn-box-menu-item-title {
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 22px;
			margin-left: 20px;
		}

		.btn-box-menu-item-tips {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #77889d;
			line-height: 20px;
		}
	}

	.btn-box-menu-item:first-child {
		position: relative;

		& > ::after {
			content: '';
			width: 250px;
			height: 1px;
			background: #e5e6eb;
			position: absolute;
			right: -8px;
			bottom: -8px;
		}
	}

	.btn-box-menu-item:last-child {
		margin-top: 16px;
		margin-bottom: 0;
	}

	.btn-box-menu-item.hover {
		background: #e4ebf4;
	}

	.btn-box-menu-icon {
		display: flex;
		align-items: center;
	}
}
</style>
<style lang="less">
.add-logistic-in-out-tooltips {
	z-index: 100;

	.ant-tooltip-arrow {
		display: none;
	}

	.ant-tooltip-inner {
		width: 270px;
		height: 161px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		right: 22px;
		z-index: 1000;
	}
}
</style>