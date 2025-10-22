<template>
	<div class="slMain mt-10">
		<a-card
			:bordered="false"
			class="a-card-border-bottom"
		>
			<span
				slot="title"
				class="slTitle"
			>
				发货计划
				<a-button
					type="primary"
					class="add-btn"
					@click="add"
					v-auth="'steel:shipmentPlan:list:add'"
				>
					创建发货计划
				</a-button>
			</span>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>

			<!-- 表格 -->
			<div class="table-box">
				<p class="table-sum-text">已完结发货总重量{{ totalWeight }}（吨）</p>
				<a-table
					class="new-table"
					:columns="columns"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="arriveStatusDesc"
						slot-scope="text, items"
					>
						<span :class="'status ' + items.arriveStatus">{{ text || '-' }}</span>
					</template>
					<template
						slot="statusDesc"
						slot-scope="text, items"
					>
						<span :class="'status ' + items.status">{{ text }}</span>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					@change="getList"
					from="deliverPlan"
				/>
			</div>
		</a-card>

		<a-modal
			class="slTitleConfirmModal"
			:visible="visible"
			title=""
			@cancel="hideModal"
			@ok="confirmFunc"
		>
			<div class="title">
				<a-icon
					type="exclamation-circle"
					theme="filled"
				/>{{ modalObj.modalTitle }}
			</div>
			<p class="label">{{ modalObj.modalText }}</p>
			<template slot="footer">
				<a-button @click="hideModal">取消</a-button>
				<a-button
					type="primary"
					@click="confirmFunc"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_ShipmentPlanList,
	API_ShipmentPlanCancel,
	API_ShipmentPlanComplete,
	API_ShipmentPlanDelete,
	API_ShipmentPlanTotal
} from '@/v2/center/steels/api/deliverPlan.js';
import { isEqual } from 'lodash';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

const searchList = [
	{
		decorator: ['sellCompanyName'],
		addonBeforeTitle: '发货企业',
		type: 'input',
		placeholder: '请输入发货企业'
	},
	{
		decorator: ['warehouseName'],
		addonBeforeTitle: '收货仓库',
		type: 'input',
		placeholder: '请输入收货仓库'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterSteelsCodeByKey('shipmentPlanTransportMode')
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: filterSteelsCodeByKey('shipmentPlanStatus')
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '上游合同',
		type: 'input',
		placeholder: '请输入上游合同号码'
	},
	{
		decorator: ['arriveStatus'],
		addonBeforeTitle: '到库状态',
		type: 'select',
		placeholder: '请选择到库状态',
		options: filterSteelsCodeByKey('shipmentPlanArriveStatus')
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '创建日期',
		type: 'rangePicker',
		realKey: ['createdDateStart', 'createdDateEnd']
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns: [
				{ title: '发货企业', dataIndex: 'sellCompanyName' },
				{ title: '收货仓库', dataIndex: 'warehouseAbbreviation' },
				{ title: '货主企业', dataIndex: 'buyCompanyName' },
				{ title: '运输方式', dataIndex: 'transportModeDesc' },
				{ title: '品名', dataIndex: 'materialName' },
				{ title: '发货重量(吨)', dataIndex: 'shipmentQuantity' },
				{ title: '上游合同号', dataIndex: 'contractNo' },
				{ title: '到库状态', dataIndex: 'arriveStatusDesc', scopedSlots: { customRender: 'arriveStatusDesc' } },
				{ title: '状态', dataIndex: 'statusDesc', scopedSlots: { customRender: 'statusDesc' } },
				{ title: '创建时间', dataIndex: 'createdDate' },
				{
					title: '操作',
					key: 'action',
					fixed: 'right',
					customRender: (text, items) => {
						return this.actionDiv(items);
					}
				}
			],
			searchList,
			dataSource: [],
			getPopupContainer,
			url: {
				list: API_ShipmentPlanList
			},
			visible: false,
			target: null,
			totalWeight: 0,
			modalObj: {}
		};
	},
	mounted() {
		this.getTotal();
	},
	methods: {
		actionDiv(items) {
			let t = this;
			let actionList = [
				// 待提交状态下---修改、取消
				{
					text: '修改',
					auth: 'steel:shipmentPlan:list:add',
					condition: items.status === 'WAIT_CONFIRM',
					incident: () => {
						t.handleModify(items);
					}
				},
				{
					text: '取消',
					auth: 'steel:shipmentPlan:list:completed',
					condition: items.status === 'WAIT_CONFIRM',
					incident: () => {
						t.showModal(items, 'delete');
					}
				},
				// 非待提交状态下---查看
				{
					text: '查看',
					auth: 'steel:shipmentPlan:list:view',
					condition: items.status !== 'WAIT_CONFIRM',
					incident: () => {
						t.handleView(items);
					}
				},
				// 执行中状态下 火运：查看、作废、完结；汽运：查看、调整、作废、完结、
				// 汽运、执行中、到库状态为部分到库 展示调整按钮
				{
					text: '调整',
					auth: 'steel:shipmentPlan:list:add',
					condition: items.status == 'IN_EXECUTION' && items.transportMode === 'TRUCKS' && items.arriveStatus === 'PART_ARRIVED',
					incident: () => {
						t.toAdjust(items);
					}
				},
				{
					text: '作废',
					auth: 'steel:shipmentPlan:list:completed',
					condition: items.status == 'IN_EXECUTION',
					incident: () => {
						t.showModal(items, 'cancel');
					}
				},
				{
					text: '完结',
					auth: 'steel:shipmentPlan:list:completed',
					condition: items.status == 'IN_EXECUTION',
					incident: () => {
						t.showModal(items, 'complete');
					}
				}
			];
			let action = actionList.filter(item => {
				return item.condition && item.auth;
			});
			let actionVnode = [],
				dropdownList = [];
			let h = t.$createElement;
			action.map((item, index) => {
				let aVnode = h('a', {
					domProps: {
						innerHTML: item.text
					},
					on: {
						click: function () {
							item.incident();
						}
					},
					style: {
						marginRight: '12px'
					}
				});
				if (action.length > 3 && index >= 2) {
					dropdownList.push(h('a-menu-item', null, [aVnode]));
				} else {
					actionVnode.push(aVnode);
				}
			});
			if (dropdownList.length) {
				actionVnode.push(
					h(
						'a-dropdown',
						{
							attrs: {
								getPopupContainer: getPopupContainer
							}
						},
						[
							h(
								'a',
								{
									class: 'ant-dropdown-link',
									on: {
										click: function (e) {
											e.preventDefault();
										}
									}
								},
								[h('span', {}, '更多'), h('a-icon', { props: { type: 'down' } })]
							),
							h('a-menu', { slot: 'overlay' }, dropdownList)
						]
					)
				);
			}
			return h('div', actionVnode);
		},
		getTotal() {
			API_ShipmentPlanTotal(this.searchParams).then(res => {
				if (res.success) {
					this.totalWeight = Number(res.data.shipmentCompletedQuantity).toFixed(4);
				}
			});
		},
		add() {
			this.$router.push({
				path: '/center/steels/deliverPlan/add'
			});
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getTotal();
			this.changeSearch(data);
		},
		showModal(item, type) {
			this.target = item;
			this.visible = true;
			this.modalObj = {};
			switch (type) {
				case 'cancel': // 作废
					this.modalObj.api = API_ShipmentPlanCancel;
					this.modalObj.modalTitle = '您确定要作废该笔发货计划吗？';
					this.modalObj.modalText = '作废后将不会恢复';
					break;
				case 'complete': // 完结
					this.modalObj.api = API_ShipmentPlanComplete;
					this.modalObj.modalTitle = '您确定要完结该笔发货计划吗？';
					this.modalObj.modalText = '完结后，该发货计划的到库状态会置为已到库状态';
					break;
				case 'delete': // 删除
					this.modalObj.api = API_ShipmentPlanDelete;
					this.modalObj.modalTitle = '您确定要取消该笔发货计划吗？';
					this.modalObj.modalText = '取消后数据将会消失';
					break;
			}
		},
		hideModal() {
			this.visible = false;
		},
		confirmFunc() {
			this.modalObj.api({ id: this.target.id }).then(res => {
				if (res.success && res.data) {
					this.visible = false;
					this.target = null;
					this.modalObj = {};
					this.$message.success('提交成功');
					this.searchSubmit();
				}
			});
		},
		// 回调查询
		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
		},
		handleView(item) {
			this.$router.push({
				path: '/center/steels/deliverPlan/detail',
				query: {
					id: item.id
				}
			});
		},
		handleModify(item) {
			this.$router.push({
				path: '/center/steels/deliverPlan/add',
				query: {
					id: item.id
				}
			});
		},
		toAdjust(item) {
			this.$router.push({
				path: '/center/steels/deliverPlan/update',
				query: {
					id: item.id
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.add-btn {
	float: right;
}
.new-table {
	overflow: hidden;
}
.table-box {
	.table-sum-text {
		margin: 30px 0 16px 0;
		color: rgba(0, 0, 0, 0.8);
	}
}
.status {
	padding: 3px 5px;
	height: 20px;
	line-height: 20px;
	border-radius: 4px;
	font-size: 14px;
	zoom: 0.85;
}
.WAIT_CONFIRM {
	background: #f8dde8;
	color: #db81a5;
}
.IN_EXECUTION {
	background: #ffdbc8;
	color: #ff7937;
}
.COMPLETED,
.CANCELED {
	background: #e0e0e0;
	color: #a8a8a8;
}
.ARRIVED {
	background: #c5ecdd;
	color: #3eb384;
}
.NOT_ARRIVED {
	background: #c9daff;
	color: #596fa0;
}
.PART_ARRIVED {
	background: #c1d7ff;
	color: #4682f3;
}
/deep/.ant-table-fixed tr td > div > a {
	margin-right: 24px;
}
/deep/.ant-table-fixed tr td > div > a:nth-child(3) {
	margin-right: 0 !important;
}
/deep/.ant-dropdown-menu-item a {
	color: @primary-color;
	padding: 5px 0 !important;
	margin: -5px 0 !important;
}
// <=1560
@media screen and (max-width: 1919px) {
	/deep/.ant-table-fixed tr td > div > a {
		margin-right: 15px !important;
	}
}
</style>
