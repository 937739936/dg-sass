<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择合同"
			placement="right"
			:visible="orderRelationModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<a-tabs
				v-model="contractType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="DOWN"
					tab="线下销售合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="ONLINE"
					tab="电子销售合同"
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
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					rowKey="keyId"
					:loading="loading"
				>
					<template
						slot="quantity"
						slot-scope="text, items"
					>
						<div>
							<span>{{ text ? formatMoney(text) + '吨' : '-' }}</span>
							<template v-if="items.quantityOffset">（±{{ items.quantityOffset }}%）</template>
						</div>
					</template>
					<template
						slot="price"
						slot-scope="text, items"
					>
						<!-- 判断当前是否是线上和线下 -->
						<p>{{ items.price == '随行就市' ? items.price : `${formatMoney(items.price)}吨/元` }}</p>
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
import { formatMoney } from '@sub/filters';
import { API_GetOrderList } from '@/v2/center/assets/api/index.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";

const searchListOn = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择煤种',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '合同状态',
		type: 'select',
		placeholder: '请选择合同状态',
		options: [
			{
				value: 'AUDITING',
				label: '审批中'
			},
			{
				value: 'WAIT_SIGN_SEAL',
				label: '待签约'
			},
			{
				value: 'WAIT_CONFIRM',
				label: '待确认'
			},
			{
				value: 'CONFIRM_WAIT_SIGN_SEAL',
				label: '确认待盖章'
			},
			{
				value: 'EXECUTING',
				label: '执行中'
			}
		]
	}
];
const relationOrderListColumns = [
	{ title: '销售合同编号', dataIndex: 'contractNo', fixed: 'left' },
	{ title: '卖方名称', dataIndex: 'sellerName' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '合同数量', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
	{ title: '合同单价', dataIndex: 'price', scopedSlots: { customRender: 'price' } },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{
		title: '状态',
		dataIndex: 'signStatus',
		customRender: r => {
			if (r == 1) {
				return '单签';
			} else {
				return '双签';
			}
		}
	},
	{ title: '采购合同编号', dataIndex: 'parentContractNo' },
	{ title: '上游供应商名称', dataIndex: 'parentSellerName' },
	{ title: '创建人', dataIndex: 'createName' },
	{ title: '创建日期', dataIndex: 'createTime' }
];

export default {
	name: 'RelationContract',
	props: ['buyerUscc', 'paymentType'],
	data() {
		return {
			getPopupContainer,
			relationOrderListColumns,
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			contractType: 'DOWN',
			searchListOn,
			searchList: [],
			loading: false,
			selectedRowKeys: [],
			currentRecord: {}
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.keyId];
					t.currentRecord = record;
				}
			};
		}
	},
	created() {
		this.searchList = this.searchListOn;
	},
	methods: {
		formatMoney,
		async getRelationOrderList(data) {
			let API = API_GetOrderList;
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation,
				contractType: this.contractType,
				// status: this.contractType,
				buyerUscc: this.buyerUscc,
				paymentType: this.paymentType
			};
			delete params.showTotal;
			try {
				const res = await API(params);
				let result = res.result || res.data;
				const list = result.records || [];
				list.forEach(el => {
					el.keyId = `${el.id}-${el.parentOrderNo}`;
				});

				this.relationOrderList = list;
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
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		//外部引用方法打开弹框
		showRelationOrderList() {
			this.orderRelationModal = true;
			this.resetValuesRelation();
			this.selectedRowKeys = [];
			this.currentRecord = {};
			// 重置选择的合同
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			};
			this.getRelationOrderList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = this.paginationRelation.pageSize) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		handleSubmit(item) {
			this.orderRelationModal = false;
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择合同');
				return;
			}
			console.log(this.currentRecord);
			this.$emit('select', this.currentRecord);
		},
		onClose() {
			this.orderRelationModal = false;
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
