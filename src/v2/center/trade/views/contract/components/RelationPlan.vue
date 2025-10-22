<template>
	<div>
		<!-- 关联上/下煤计划弹窗 -->
		<a-drawer
			class="slDrawer"
			:title="type === 'SELL' ? '选择下煤计划' : '选择上煤计划'"
			placement="right"
			:visible="visible"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getList"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.serialNo"
					:customRow="onClickRow"
					:loading="loading"
				>
					<template slot="customTitles">
						<span v-if="type === 'SELL'">下煤计划编号</span>
						<span v-else>上煤计划编号</span>
					</template>
					<template
						slot="serialNo"
						slot-scope="text, record"
					>
						{{ record.serialNo }}</template
					>
					<template
						slot="deliveryDateEnd"
						slot-scope="deliveryDateEnd, items"
					>
						<p v-if="items.deliveryDateBegin">{{ items.deliveryDateBegin }}至{{ items.deliveryDateEnd }}</p>
						<p v-else>-</p>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>

			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="cancel-btn"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="handleSubmit"
						>确定</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { getHouseList } from '@/v2/center/logisticsPlatform/api/selectData';
import { API_updateContract } from '@/v2/center/trade/api/contract';
import { getCoalPlanList } from '@/v2/center/logisticsPlatform/api';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['house'],
		addonBeforeTitle: '仓房名称',
		type: 'select',
		placeholder: '请选择仓房名称',
		options: []
	}
];
const columns = [
	{ key: 'serialNo', slots: { title: 'customTitles' }, scopedSlots: { customRender: 'serialNo' }, fixed: 'left' },
	{ title: '发货单位', dataIndex: 'deliveryCompanyName' },
	{ title: '收货单位', dataIndex: 'receivingCompanyName' },
	{ title: '煤种', dataIndex: 'coalType' },
	{ title: '仓房名称', dataIndex: 'house' },
	{ title: '货位名称', dataIndex: 'goodsAllocation' },
	{ title: '创建时间', dataIndex: 'createdDate' }
];
export default {
	name: 'RelationContract',
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys,
				onChange: selectedRowKeys => {
					t.selectedRowKeys = selectedRowKeys;
				}
			};
		}
	},
	props: ['type'],
	data() {
		return {
			getPopupContainer,
			columns,
			searchList,
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			visible: false,
			dataSource: [],
			paginationRelation: {},
			loading: false,
			houseList: [],
			currentOBj: {}
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {
		this.columns.forEach(item => {
			if (item.dataIndex === 'contractNo') {
				item.title = this.type === 'SELL' ? '下煤计划编号' : '上煤计划编号';
			}
		});
		this.getHouseList();
	},
	methods: {
		getHouseList() {
			return getHouseList().then(res => {
				if (!res.success) {
					return;
				}
				this.houseList = res.data.map(item => {
					return {
						value: item.id,
						label: item.name
					};
				});
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'house') {
						item.options = this.houseList;
					}
				});
			});
		},
		getList(data) {
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			this.searchModalParamsRelation.relatedContract = false;
			this.searchModalParamsRelation.type = this.type === 'SELL' ? 'OUT' : 'IN';
			this.searchModalParamsRelation.status = 'UNDERWAY';
			getCoalPlanList(this.searchModalParamsRelation)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.dataSource = result.records;
						const paginationRelation = {
							total: result.total,
							pageSize: result.size,
							current: result.current,
							pageNo: result.current,
							showTotal: function (total) {
								return `共${total}条记录 第${result.current}页 `;
							}
						};
						this.paginationRelation = paginationRelation;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showModal(data) {
			this.visible = true;
			this.currentOBj = data;
			this.selectedRowKeys = [];
			this.getList();
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						let index = this.selectedRowKeys.findIndex(serialNo => {
							return serialNo === record.serialNo;
						});
						index === -1 ? this.selectedRowKeys.push(record.serialNo) : this.selectedRowKeys.splice(index, 1);
					}
				}
			};
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warn(this.type === 'SELL' ? '请选择要关联的下煤计划' : '请选择要关联的上煤计划');
				return;
			}
			const dataObj = {
				contractNo: this.currentOBj.contractNo,
				businessLineNo: this.currentOBj.businessLineNo,
				orderNo: this.currentOBj.serialNo,
				contractType: this.currentOBj.contractType,
				type: this.type === 'BUY' ? 'IN' : 'OUT',
				coalPlanNoList: this.selectedRowKeys,
				upContract: false
			};
			if (this.currentOBj.contractType === 'OFFLINE') {
				dataObj.contractNo = this.currentOBj.paperContractNo;
				dataObj.contractSerialNo = this.currentOBj.contractNo;
			}
			API_updateContract(dataObj).then(res => {
				if (res.success) {
					this.visible = false;
					this.$emit('updateFunc');
				}
			});
		},
		onClose() {
			this.visible = false;
			this.selectedRowKeys = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
.table-box {
	margin-top: 20px;
}
.slModal {
	::v-deep.ant-modal-body {
		padding-top: 10px;
	}
}
</style>
