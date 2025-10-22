<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="关联业务线"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getRelationOrderListSearch"
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
					:dataSource="resultList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loadingData"
				>
					<template slot="contractType">
						<td>采购合同</td>
						<br />
						<td>销售合同</td>
					</template>
					<template
						slot="orderNo"
						slot-scope="orderNo, record"
					>
						<td style="position: relative; top: 11px">
							<!-- 线上合同走原来接口，线下走补录 -->
							<span v-if="record.buyOrder.contractType == 'UP'">{{ record.buyOrder.orderNo }}</span>
							<span
								v-else
								target="_new"
								>{{ record.buyOrder.orderNo }}</span
							>
						</td>
						<br />
						<td style="position: relative; top: 11px">
							<!-- 线上合同走原来接口，线下走补录 -->
							<span v-if="record.sellOrder.contractType == 'DOWN'">{{ record.sellOrder.orderNo }}</span>
							<span v-else>{{ record.sellOrder.orderNo }}</span>
						</td>
						<br />
					</template>
					<template
						slot="contractNo"
						slot-scope="contractNo, record"
					>
						<td style="position: relative; top: 11px">
							<!-- 线上合同走原来接口，线下走补录 -->
							<span v-if="record.buyOrder.contractType == 'UP'">{{ record.buyOrder.contractNo }}</span>
							<span v-else>{{ record.buyOrder.contractNo }}</span>
						</td>
						<br />
						<td style="position: relative; top: 11px">
							<!-- 线上合同走原来接口，线下走补录 -->
							<span v-if="record.sellOrder.contractType == 'DOWN'">{{ record.sellOrder.contractNo }}</span>
							<span v-else>{{ record.sellOrder.contractNo }}</span>
						</td>
						<br />
					</template>
					<template
						slot="companyName"
						slot-scope="companyName, record"
					>
						<td>{{ record.buyOrder.companyName }}</td>
						<br />
						<td>{{ record.sellOrder.companyName }}</td>
					</template>
					<template
						slot="quantity"
						slot-scope="quantity, record"
					>
						<td style="text-align: center">{{ record.buyOrder.quantity }}</td>
						<br />
						<td style="text-align: center">{{ record.sellOrder.quantity }}</td>
					</template>
					<template
						slot="basePrice"
						slot-scope="basePrice, record"
					>
						<td style="text-align: center">
							{{ record.buyOrder.followTheMarket ? '随行就市' : record.buyOrder.basePrice }}
						</td>
						<br />
						<td style="text-align: center">
							{{ record.sellOrder.followTheMarket ? '随行就市' : record.sellOrder.basePrice }}
						</td>
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
						class="relation-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
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
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_businessline_list } from '@/v2/center/trade/api/transportContract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
const searchListOn = [
	{
		decorator: ['businessLineNo'],
		addonBeforeTitle: '业务线编号',
		type: 'input',
		placeholder: '请输入业务线编号'
	},
	{
		decorator: ['no'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	}
];
const relationOrderListColumnsBuy = [
	{ title: '业务线号', dataIndex: 'businessLineNo', key: 'businessLineNo' },
	{ title: '关联人', dataIndex: 'associatedUser', key: 'associatedUser' },
	{
		title: '合同类型',
		dataIndex: 'contractType',
		key: 'contractType',
		align: 'center',
		scopedSlots: { customRender: 'contractType' }
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		scopedSlots: { customRender: 'contractNo' }
	},
	{
		title: '企业名称',
		dataIndex: 'companyName',
		key: 'companyName',
		sorter: true,
		scopedSlots: { customRender: 'companyName' }
	}
];
export default {
	name: 'RelationContract',
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.$forceUpdate();
					t.selected = record;
				}
			};
		},
		//电子合同，线下合同表头不同
		relationOrderListColumns() {
			let list = this.relationOrderListColumnsBuy;
			return list;
		}
	},
	props: ['type', 'businessLineId'],
	data() {
		return {
			getPopupContainer,
			relationOrderListColumnsBuy,
			signTime: null,
			typeData: filterCodeByKey('goods_type'),
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			orderRelationModal: false,
			resultList: [],
			selected: {}, // 关联合同被选中的数据
			contractType: 'on',
			searchListOn,
			searchList: [],
			loadingData: false,
			paginationRelation: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	watch: {
		type: function () {
			if (this.orderRelationModal) {
				this.resetValuesRelation();
			}
		},
		businessLineId(val) {
			if (val) {
				this.selectedRowKeys = [val];
			}
		}
	},
	created() {
		this.searchList = this.searchListOn;
	},
	methods: {
		getRelationOrderListSearch(data) {
			this.paginationRelation = {
				pageNo: 1,
				pageSize: 10
			};
			this.getRelationOrderList(data);
		},
		getRelationOrderList(data) {
			this.loadingData = true;
			this.selectedRowKeys = [];
			this.selected = {};
			this.searchModalParamsRelation = data;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation
			};
			delete params.total;
			API_businessline_list(params)
				.then(res => {
					if (res.success) {
						this.resultList = res.data.records || [];
						this.paginationRelation = {
							...this.paginationRelation,
							total: res.data.total
						};
					}
				})
				.finally(() => {
					this.loadingData = false;
				});
		},
		//外部引用方法打开弹框
		showRelationOrderList() {
			this.orderRelationModal = true;
			if (this.type) {
				this.resetValuesRelation();
			}
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.signTime = null;
			this.resultList = [];
			this.paginationRelation = {
				pageNo: 1
			};
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		handleTableSizeChange(size) {
			this.paginationRelation.pageSize = size;
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		handleTableChange(pageNo = this.pagination.pageNo, pageSize = 10, type) {
			if (type == 'size') {
				this.paginationRelation.pageNo = 1;
			} else {
				this.paginationRelation.pageNo = pageNo;
			}
			this.paginationRelation.pageSize = pageSize;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.$forceUpdate();
						this.selected = record;
					}
				}
			};
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warn('请选择要关联的业务线');
				return;
			}
			let selected = Object.assign({}, this.selected);
			this.orderRelationModal = false;
			//判断选中的合同类型UP-上游补录；DOWN-下游补录；ONLINE-电子合同
			selected[this.type + 'OrderType'] = this.contractType === 'on' ? 'ONLINE' : this.type === 'buy' ? 'UP' : 'DOWN';
			//下游没有订单号采用contractNo,orderId
			selected.orderSerialNo = selected.orderSerialNo || selected.contractNo;
			selected.orderId = selected.orderId || selected.id;
			this.$emit('detail', selected);
		},
		onClose() {
			this.orderRelationModal = false;
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
</style>
