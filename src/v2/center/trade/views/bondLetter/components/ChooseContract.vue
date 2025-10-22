<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择销售合同"
			placement="right"
			:visible="visible"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<a-tabs
				v-model="currentContractType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="ONLINE"
					tab="电子销售合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="OFFLINE"
					tab="线下销售合同"
				>
				</a-tab-pane>
			</a-tabs>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getRelationOrderList"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
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
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
				>
					<template
						slot="quantity"
						slot-scope="text, items"
					>
						<p>{{ text | formatMoney(2) }}吨</p>
					</template>
					<template
						slot="basePrice"
						slot-scope="text, items"
					>
						<span v-if="items.followTheMarket">随行就市</span>
						<template v-else>
							<span v-if="text">{{ text | formatMoney(2) }}元/吨</span>
							<span v-else>{{ items.basePriceDesc }}</span>
						</template>
					</template>
					<template
						slot="deliveryStartDate"
						slot-scope="deliveryStartDate, items"
					>
						{{ items.deliveryStartDate }}至{{ items.deliveryEndDate }}
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
						:disabled="!this.selectedRowKeys.length || !Boolean(this.selected)"
						>下一步</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_GetContractPage } from '@/v2/center/trade/api/bondLetter';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
const searchList = [
	{
		decorator: ['orderContractSerialNo'],
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
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['signTime'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];
const columns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left' },
	{ title: '买方企业名称', dataIndex: 'buyerName' },
	{ title: '收货人', dataIndex: 'consigneeCompanyName' },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		key: 'deliveryStartDate',
		scopedSlots: { customRender: 'deliveryStartDate' }
	},
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{ title: '数量', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
	{ title: '基准价格', dataIndex: 'basePrice', scopedSlots: { customRender: 'basePrice' } },
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: text => {
			return text || '-';
		}
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
					if (t.type === 'ONLINE') {
						t.judgeBuyer();
					}
				}
			};
		}
	},
	props: {
		contractType: {
			default: () => {
				return 'ONLINE';
			}
		},
		id: {
			default: () => {
				return '';
			}
		},
		type: {
			default: () => {
				return '';
			}
		}
	},
	data() {
		return {
			getPopupContainer,
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			visible: false,
			dataSource: [],
			paginationRelation: {},
			selected: null, // 关联合同被选中的数据
			searchList,
			columns,
			loading: false,
			currentContractType: this.contractType
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {},
	methods: {
		getRelationOrderList(data) {
			this.searchModalParamsRelation = data || {};
			this.searchModalParamsRelation.type = this.currentContractType;
			this.loading = true;
			this.selectedRowKeys = [];
			this.selected = null;
			API_GetContractPage(this.searchModalParamsRelation)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.dataSource = result.records || [];
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
						if (this.id && this.contractType === this.currentContractType) {
							this.selectedRowKeys = [this.id];
							this.dataSource.forEach(items => {
								if (items.id == this.id) {
									this.selected = items;
								}
							});
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showModal() {
			this.visible = true;
			if (this.currentContractType) {
				this.resetValuesRelation();
			}
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.dataSource = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.$forceUpdate();
						this.selected = record;
						if (this.type === 'ONLINE') {
							this.judgeBuyer();
						}
					}
				}
			};
		},
		judgeBuyer() {
			if (!this.selected?.buyCompanySettled) {
				this.$message.error('买方未入驻平台');
				return false;
			}
			return true;
		},
		handleSubmit() {
			if (this.type === 'ONLINE' && !this.judgeBuyer()) return;
			let selected = Object.assign({}, this.selected);
			this.visible = false;
			selected.orderSerialNo = selected.orderSerialNo || selected.contractNo;
			selected.orderId = selected.orderId || selected.id;
			selected.contractType = this.currentContractType;
			this.$emit('detail', selected);
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
</style>
