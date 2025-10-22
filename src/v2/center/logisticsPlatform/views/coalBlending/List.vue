<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>配煤列表</span
				>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handelChangeSearch"
			></SlFormNew>
			<div
				class="actions-box"
				v-auth="'logisticsStorageCenter:blendingManage:blendingCoal:add'"
			>
				<a-button
					type="primary"
					ghost
					@click="addNewCoalBlending"
				>
					<a-icon type="plus" style="color: var(--primary-color);font-size: 16px;"/>
					新增配煤记录</a-button
				>
			</div>
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
						slot="index"
						slot-scope="text, record, index"
					>
						<span>{{ (pagination.pageNo - 1) * pagination.pageSize + Number(index) + 1 }}</span>
					</template>
					<template
						slot="colList"
						slot-scope="text"
					>
						<div>
							<div
								v-for="(item, index) in text || []"
								:key="index"
							>
								{{ item }}
							</div>
						</div>
					</template>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a
								v-auth="'logisticsStorageCenter:blendingManage:blendingCoal:view'"
								@click="pushToDetail(record)"
								>详情</a
							>
							<a
								v-if="record.status !== 'CANCEL'"
								v-auth="'logisticsStorageCenter:blendingManage:blendingCoal:edit'"
								@click="pushToEdit(record)"
								>编辑</a
							>
							<a
								v-if="record.status !== 'CANCEL'"
								v-auth="'logisticsStorageCenter:blendingManage:blendingCoal:edit'"
								@click="recordInvalid(record)"
								>作废</a
							>
						</a-space>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
		<BusinessLineSelectModel
			ref="businessLineSelectModel"
			@handleBusinessLineSelect="handleBusinessLineSelect"
		/>
		<ConfirmModal ref="confirmModal"></ConfirmModal>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import BusinessLineSelectModel from '@/v2/center/logisticsPlatform/views/coalBlending/models/BusinessLineSelectModel';
import {
	getCoalBlendingSearchParams,
	getCoalBlendingPage,
	invalidCoalBlendingRecord
} from '@/v2/center/logisticsPlatform/api/coalBlending';
import ConfirmModal from 'v2/components/modal/ConfirmModal';
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
	mixins: [ListMixin],
	components: {
		BusinessLineSelectModel,
		ConfirmModal
	},
	data() {
		return {
			// searchList: SearchList,
			searchParamsObj: {},

			url: {
				list: getCoalBlendingPage
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		searchList() {
			let list = [...SearchList];
			if (this.isManager) {
				let item = {
					decorator: ['ownerCompanyUscc'],
					addonBeforeTitle: '货主	',
					type: 'select',
					placeholder: '请选择货主',
					options: []
				};
				list.push(item);
			}
			return [...list];
		},
		columns() {
			let list = columns;
			if (!this.isManager) {
				list = list.filter(item => {
					return item.dataIndex !== 'ownerCompanyName';
				});
			}
			return list;
		}
	},
	mounted() {
		this.getSearchParams();
	},
	methods: {
		// 获取查询参数
		getSearchParams() {
			getCoalBlendingSearchParams()
				.then(res => {
					if (!res.success) {
						return;
					}
					this.configSearchOptions(res.data);
				})
				.catch(() => {})
				.finally(() => {});
		},
		// 配置搜索表单选项
		configSearchOptions(data) {
			let searchParamsObj = data || {};
			this.searchParamsObj = searchParamsObj;
			// 配煤类型
			let typeList = searchParamsObj.typeList || [];
			let typeOptions = typeList.map(item => {
				return {
					value: item.value,
					label: item.name
				};
			});
			// 出煤品名
			let goodsNameList = searchParamsObj.goodsNameList || [];
			let goodsNameOptions = goodsNameList.map(item => {
				return {
					value: item.value,
					label: item.name
				};
			});
			// 仓房
			let houseNameList = searchParamsObj.houseNameList || [];
			let houseNameOptions = houseNameList.map(item => {
				return {
					value: item.value,
					label: item.name
				};
			});
			// // 货位
			// let goodsAllocationNameList = searchParamsObj.goodsAllocationNameList || [];
			// let goodsAllocationNameOptions = goodsAllocationNameList.map(item => {
			// 	return {
			// 		value: item.value,
			// 		label: item.name
			// 	};
			// });
			let companyNameList = searchParamsObj.companyNameList || [];
			let companyNameOptions = companyNameList.map(item => {
				return {
					value: item.value,
					label: item.name
				};
			});
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'type') {
					item.options = typeOptions;
				} else if (item.decorator[0] === 'coalType') {
					item.options = goodsNameOptions;
				} else if (item.decorator[0] === 'houseId') {
					item.options = houseNameOptions;
				} else if (item.decorator[0] === 'goodsAllocationId') {
					item.options = [];
				} else if (item.decorator[0] === 'ownerCompanyUscc') {
					item.options = companyNameOptions;
				}
			});
		},
		configSearchGoodsNameOptions(value) {
			let searchParamsObj = this.searchParamsObj || {};
			let houseNameList = searchParamsObj.houseNameList || [];
			let item = _.find(houseNameList, item => {
				return item.value === value;
			});
			let goodsAllocationNameOptions = [];
			if (item) {
				let childList = item.childList || [];
				goodsAllocationNameOptions = childList.map(item => {
					return {
						value: item.value,
						label: item.name
					};
				});
			}
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'goodsAllocationId') {
					item.options = goodsAllocationNameOptions;
				}
			});
		},
		handelChangeSearch(data) {
			if (data.houseId != this.searchParams.houseId) {
				this.configSearchGoodsNameOptions(data.houseId);
				if (data.goodsAllocationId) {
					// 这里会重新执行handleFilterChange
					this.$refs.searchForm.deleteSearchItemByKey('goodsAllocationId');
					return;
				}
			}
			this.changeSearch(data);
		},
		addNewCoalBlending() {
			if (this.isManager) {
				this.pushToAddNewRecord({});
			} else {
				this.$refs.businessLineSelectModel.showModal();
			}
		},
		handleBusinessLineSelect(obj) {
			let { businessLineNo } = obj;
			this.pushToAddNewRecord({ businessLineNo });
		},
		pushToAddNewRecord(query) {
			this.$router.push({
				path: '/center/logisticsPlatform/coalBlending/add',
				query: {
					...query
				}
			});
		},
		// 详情
		pushToDetail(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/coalBlending/detail',
				query: {
					id: record.id // 配煤记录id
				}
			});
		},
		pushToEdit(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/coalBlending/edit',
				query: {
					id: record.id // 配煤记录id
				}
			});
		},
		// 作废
		recordInvalid(record) {
			this.$refs.confirmModal.showModal({
				modalTitle: '确认作废',
				modalText: '是否确认作废当前有效数据?',
				confirm: () => {
					invalidCoalBlendingRecord(record.id).then(res => {
						if (res.success) {
							this.$message.success('已作废');
							this.getList();
						}
					});
				}
			});
		}
	}
};

// 默认搜索表单数据
const SearchList = [
	{
		decorator: ['type'],
		addonBeforeTitle: '配煤类型',
		type: 'select',
		placeholder: '请选择配煤类型',
		options: []
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '出煤品名',
		type: 'select',
		placeholder: '请选择出煤品名',
		options: []
	},
	{
		decorator: ['blendingDate'],
		addonBeforeTitle: '配煤日期',
		type: 'datePicker',
		placeholder: '请选择配煤日期',
		allowClear: false
	},
	{
		decorator: ['houseId'],
		addonBeforeTitle: '仓房',
		type: 'select',
		placeholder: '请选择仓房',
		options: []
	},
	{
		decorator: ['goodsAllocationId'],
		addonBeforeTitle: '货位',
		type: 'select',
		placeholder: '请选择货位',
		options: []
	}
];

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '配煤编号',
		dataIndex: 'serialNo',
		customRender
	},
	{
		title: '配煤日期',
		dataIndex: 'blendingDate',
		customRender
	},
	{
		title: '配煤类型',
		dataIndex: 'typeDesc',
		customRender
	},
	{
		title: '出煤品名',
		dataIndex: 'goodsNameList',
		scopedSlots: { customRender: 'colList' }
	},
	{
		title: '配煤原料',
		dataIndex: 'rawMaterial',
		customRender
	},
	{
		title: '出煤总量（吨）',
		dataIndex: 'coalTotalQuantity',
		customRender
	},
	{
		title: '出煤量（吨）',
		dataIndex: 'coalQuantityList',
		scopedSlots: { customRender: 'colList' }
	},
	{
		title: '仓房&货位',
		dataIndex: 'houseAndGoodsAllocationList',
		scopedSlots: { customRender: 'colList' }
	},
	{
		title: '货主',
		dataIndex: 'ownerCompanyName',
		customRender
	},
	{
		title: '操作人',
		dataIndex: 'lastModifiedName',
		customRender
	},
	{
		title: '操作时间',
		dataIndex: 'lastModifiedDate',
		customRender
	},
	{
		key: 'action',
		title: '操作',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.actions-box {
		text-align: right;
		margin-top: 50px;
		.add-icon {
			width: 12px;
			height: 12px;
			margin-right: 2px;
			margin-bottom: 2px;
		}
	}
	.new-table {
		// 提示列 提示图片
		.tip-icon {
			width: 12px;
			height: 12px;
			margin-right: 5px;
			margin-bottom: 4px;
		}
	}
	.actionDisabled {
		color: gray; /* 设置为灰色 */
		pointer-events: none; /* 阻止鼠标事件，但不影响样式 */
		cursor: default; /* 改变鼠标悬停时的光标样式，表明不可点击 */
	}
}
</style>