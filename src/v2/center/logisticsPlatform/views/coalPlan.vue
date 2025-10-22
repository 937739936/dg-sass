<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>汽运{{ type == 'IN' ? '上煤' : '下煤' }}计划</span
				>
				<a-button
					class="add-btn"
					type="primary"
					v-if="type == 'IN'"
					@click.prevent="showContract"
					v-auth="'logisticsStorageCenter:inManage:inCoalPlan:add'"
					:loading="createLoading"
					>创建上煤计划</a-button
				>
				<a-button
					class="add-btn"
					type="primary"
					v-if="type == 'OUT'"
					v-auth="'logisticsStorageCenter:outManage:outCoalPlan:add'"
					@click.prevent="showContract"
					:loading="createLoading"
					>创建下煤计划</a-button
				>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
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
					:loading="loading"
					:scroll="{ x: true }"
				>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<a-modal
			class="slModal"
			:visible="ewmVisible"
			:title="type == 'IN' ? '上煤详情' : '下煤详情'"
			width="348px"
			@ok="sendSms"
			@cancel="closeEwmModal"
		>
			<template #footer>
				<a-button @click="closeEwmModal">取消</a-button>
				<a-button
					@click="sendSms"
					:loading="sendLoading"
					>发送短信</a-button
				>
				<a-button
					@click="copyEwm"
					type="primary"
					>复制图片</a-button
				>
			</template>
			<ShareCard :id="ewmId" ref="shareCard" />
		</a-modal>

		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
		<RelationContract
			ref="relationContract"
			@relation="goCreate"
			source="list"
			:type="type"
			:tipMessage="type == 'OUT' ? '注：无生效中放货指令的标准仓押合同，无法进行下煤计划放货' : null"
			:operationType="type == 'OUT' ? 'ADD_OUT_COAL_PLAN' : null"
			querySource="COAL_PALN"
		/>
	</div>
</template>
<script>
import {getCoalPlanList,coalPlanStatusEdit,coalPlanSendSms} from "../api";
import {existRelOrder} from "../api/inout";
import iPagination from "@sub/components/iPagination";
import ShareCard from "./inOut/records/ShareCard";
import { mapGetters } from "vuex"
import { ListMixin } from "@/v2/components/mixin/ListMixin";
import { getPopupContainer } from "@/v2/utils/factory.js";
import ConfirmModal from "@/v2/components/modal/ConfirmModal";
import RelationContract from "./inOut/components/relationContract.vue";
import {  API_USERCOMPANYSERVICE } from '@/v2/api/account';

export default {
	mixins: [ListMixin],
	components: {
		ShareCard,
		ConfirmModal,
		RelationContract
	},
	// VUEX_ST_STATIONALLCODE
	data() {
		let { type } = this.$route.params;
		type = type?.toUpperCase();
		return {
			createLoading: false,
			type,
			getPopupContainer,
			searchList: [],
			columns: [],
			dataSource: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			searchForm: this.$form.createForm(this),
			coalPlanStatusList: [],
			ewmVisible: false,
			sendLoading: false,
			ewmId: '',
			updateRowInfo: '',
			url: {
				list: getCoalPlanList
			},
			defaultParams: {
				type: type
			},
			confirmObj: ''
		};
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_STATIONALLCODE: 'VUEX_ST_STATIONALLCODE'
		}),
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.companyType == 'CORE_COMPANY';
		},
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		}
	},
	watch: {
		$route(to) {
			this.type = to.params.type?.toUpperCase();
			this.columns = renderColumn(this.type, this);
			this.searchList = renderType(this.type, this);
			this.defaultParams.type = this.type;
			this.getStatusData();
			this.$forceUpdate();
		}
	},
	created() {
		(this.searchList = renderType(this.type, this)), (this.columns = renderColumn(this.type, this)), this.getStatusData();
		this.defaultParams.type = this.type;
	},
	methods: {
		getStatusData() {
			let coalPlanStatusDict = this.VUEX_ST_STATIONALLCODE.coalPlanStatusDict;
			if (coalPlanStatusDict) {
				this.coalPlanStatusList = Object.keys(coalPlanStatusDict).map(key => {
					return { label: coalPlanStatusDict[key], value: key };
				});
			}
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'status') {
					item.options = this.coalPlanStatusList;
				}
			});
		},
		copyEwm() {
			this.$refs.shareCard.copy();
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		async planStatusEdit(id, opened) {
			this.confirmObj = {
				id,
				opened
			};
			const modalObj = {
				modalTitle: '',
				modalText: opened ? '打开上煤计划后，能继续派车，确认打开？' : '关闭上煤计划后，将不能派车，确认关闭？'
			};
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			coalPlanStatusEdit(this.confirmObj).then(result => {
				if (!result.success) {
					return;
				}
				this.$message.success('操作成功');
				this.getList();
			});
		},
		detail(items) {
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/detail`,
				query: {
					id: items.id,
					contractType: items.contractType
				}
			});
		},
		viewEwmModal(id) {
			this.ewmVisible = true;
			this.ewmId = id;
		},
		closeEwmModal() {
			this.ewmVisible = false;
			this.ewmId = '';
		},
		sendSms() {
			this.sendLoading = true;
			coalPlanSendSms({ id: this.ewmId }).then(result => {
				this.sendLoading = false;
				if (!result.success) {
					return;
				}
				this.$message.success('操作成功');
				this.closeEwmModal();
			});
		},
		showContract() {
			if (this.isManager) {
				this.goCreate();
				return;
			}
			this.createLoading = true;
			const params = {
				stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
				inOutTypeEnum: this.type,
				querySource: 'COAL_PALN'
			};
			existRelOrder(params)
				.then(({ success, data }) => {
					this.createLoading = false;
					if (!success) {
						return;
					}
					if (data === true) {
						this.$refs.relationContract.show();
						return;
					}
					this.goCreate();
				})
				.catch(() => {
					this.createLoading = false;
				});
		},
		goCreate(selected) {
			const query = {};
			if (selected) {
				query.serialNo = selected.serialNo;
				query.orderTypeEnum = selected.contractType;
			}
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/create`,
				query
			});
		},
		isAsync(fn) {
			return new Promise(fn);
		},
		actionDiv(items) {
			let t = this;
			let actionList = [
				{
					text: '派车',
					auth:
						this.type === 'IN'
							? 'logisticsStorageCenter:inManage:inCoalPlan:view'
							: 'logisticsStorageCenter:outManage:outCoalPlan:view',
					condition: items.status != 'FINISHED',
					incident: () => {
						t.dispatchCar(items);
					}
				},
				{
					text: '查看',
					auth:
						this.type === 'IN'
							? 'logisticsStorageCenter:inManage:inCoalPlan:view'
							: 'logisticsStorageCenter:outManage:outCoalPlan:view',
					condition: true,
					incident: () => {
						t.detail(items);
					}
				},
				{
					text: items.status === 'UNDERWAY' ? '关闭' : '开启',
					auth:
						this.type === 'IN'
							? 'logisticsStorageCenter:inManage:inCoalPlan:add'
							: 'logisticsStorageCenter:outManage:outCoalPlan:add',
					condition: items.status === 'UNDERWAY' || items.status === 'FINISHED',
					incident: () => {
						t.planStatusEdit(items.id, items.status === 'FINISHED');
					}
				},
				{
					text: '查看二维码',
					auth:
						this.type === 'IN'
							? 'logisticsStorageCenter:inManage:inCoalPlan:qrcode'
							: 'logisticsStorageCenter:outManage:outCoalPlan:qrcode',
					condition: items.status != 'FINISHED',
					incident: () => {
						t.viewEwmModal(items.id);
					}
				},
				{
					text: '编辑',
					auth:
						this.type === 'IN' ? 'logisticsStorageCenter:inManage:inCoalPlan' : 'logisticsStorageCenter:outManage:outCoalPlan',
					condition: items.status != 'FINISHED' && this.isCoreCompany && !items.releaseInstructId,
					incident: () => {
						t.edit(items);
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
					style: {
						marginRight: '10px'
					},
					domProps: {
						innerHTML: item.text
					},
					on: {
						click: function () {
							item.incident();
						}
					}
				});
				if (action.length > 4 && index >= 3) {
					dropdownList.push(h('a-menu-item', null, [aVnode]));
				} else {
					actionVnode.push(aVnode);
				}
			});
			if (dropdownList.length) {
				actionVnode.push(
					h('a-dropdown', {}, [
						h(
							'a',
							{
								// domProps: {
								//   innerHTML: '更多'
								// },
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
					])
				);
			}
			return h('div', actionVnode);
		},
		dispatchCar(items) {
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/dispatchCarInput`,
				query: {
					coalplanId: items.id,
					contractType: items.contractType
				}
			});
		},
		edit(data) {
			const query = { id: data.id };
			if (data.contractSerialNo) {
				query.orderTypeEnum = data.contractType;
				if (data.contractType == 'ONLINE') {
					query.serialNo = data.orderNo;
				} else {
					query.serialNo = data.contractSerialNo;
				}
			}
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/edit`,
				query
			});
		},
		getRefreshData() {
			this.getList();
		}
	}
};
function renderColumn(type, t) {
	const column = [
		{
			title: '编号',
			key: 'serialNo',
			dataIndex: 'serialNo'
		},
		{
			title: '归属合同',
			key: 'contractNo',
			dataIndex: 'contractNo',
			customRender: text => {
				return text || '-';
			}
		},
		{
			title: '发货单位',
			key: 'deliveryCompanyName',
			dataIndex: 'deliveryCompanyName'
		},
		{
			title: '收货单位',
			key: 'receivingCompanyName',
			dataIndex: 'receivingCompanyName'
		},
		{
			title: '煤种',
			key: 'coalType',
			dataIndex: 'coalType'
		},
		{
			title: '仓房名称',
			key: 'house',
			dataIndex: 'house'
		},
		{
			title: '货位名称',
			key: 'goodsAllocation',
			dataIndex: 'goodsAllocation'
		},
		{
			title: type == 'IN' ? '发站' : '到站',
			key: 'sendStation',
			dataIndex: 'sendStation'
		},
		{
			title: '计划吨数(吨)',
			key: 'planWeight',
			dataIndex: 'planWeight'
		},
		{
			title: '送达吨数(吨)',
			key: 'deliveryWeight',
			dataIndex: 'deliveryWeight'
		},
		{
			title: '已派车数(辆)',
			key: 'sendCarNum',
			dataIndex: 'sendCarNum'
		},
		{
			title: '已送达车数(辆)',
			key: 'arriveCarNum',
			dataIndex: 'arriveCarNum'
		},
		// {
		//   title: "派车数量上限(辆)",
		//   key: "dispatchLimit",
		//   dataIndex: "dispatchLimit",
		// },
		{
			title: '状态',
			key: 'statusText',
			dataIndex: 'statusText'
		},
		{
			title: '创建时间',
			key: 'createdDate',
			dataIndex: 'createdDate'
		},
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			customRender: (text, items) => {
				return t.actionDiv(items);
			}
		}
	];
	if (t.isManager) {
		column.splice(1, 1);
	}
	return column;
}
function renderType(type, t) {
	const list = [
		{
			decorator: ['createdDate'],
			addonBeforeTitle: '创建日期',
			type: 'rangePicker',
			realKey: ['createdDateStart', 'createdDateEnd']
		},
		{
			decorator: ['status'],
			addonBeforeTitle: '状态',
			type: 'select',
			placeholder: '请选择',
			options: []
		}
	];
	if (type === 'IN') {
		list.unshift({
			decorator: ['deliveryCompanyName'],
			addonBeforeTitle: '发货单位',
			type: 'input',
			placeholder: '请输入发货单位'
		});
	} else {
		list.unshift({
			decorator: ['receivingCompanyName'],
			addonBeforeTitle: '收货单位',
			type: 'input',
			placeholder: '请输入收货单位'
		});
	}
	if (!t.isManager) {
		list.push({
			decorator: ['belongTo'],
			addonBeforeTitle: '归属合同',
			type: 'input',
			placeholder: '请输入归属合同'
		});
	} else {
		list.splice(
			0,
			1,
			{
				decorator: ['deliveryCompanyName'],
				addonBeforeTitle: '发货单位',
				type: 'input',
				placeholder: '请输入发货单位',
				isShow: true
			},
			{
				decorator: ['receivingCompanyName'],
				addonBeforeTitle: '收货单位',
				type: 'input',
				placeholder: '请输入收货单位',
				isShow: true
			}
		);
	}
	return list;
}
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
</style>
