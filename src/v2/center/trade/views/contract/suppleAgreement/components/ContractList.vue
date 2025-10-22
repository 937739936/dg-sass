<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择合同"
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
				@change="changeData"
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
					:dataSource="relationOrderList"
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
						<p v-if="contractType === 'on'">{{ text | formatMoney(3) }}吨</p>
						<p v-else>{{ items.contractQuantity | formatMoney(3) }}吨</p>
					</template>
					<template
						slot="basicPrice"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">
							<span v-if="items.followTheMarket">随行就市</span>
							<span v-else-if="text">{{ text | formatMoney(3) }}元/吨</span>
							<span v-else> -</span>
						</p>
						<p v-else>
							<span v-if="items.followTheMarket">随行就市</span>
							<span v-else-if="items.contractPrice">{{ items.contractPrice | formatMoney(3) }}元/吨</span>
							<span v-else> -</span>
						</p>
					</template>
					<template
						slot="deliveryDateEnd"
						slot-scope="deliveryDateEnd, items"
					>
						<p v-if="contractType === 'on' && items.deliveryDateBegin">
							{{ items.deliveryDateBegin }}至{{ items.deliveryDateEnd }}
						</p>
						<p v-else-if="contractType === 'off' && items.execDateStart">{{ items.execDateStart }}至{{ items.execDateEnd }}</p>
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
						class="relation-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						:class="{ disabled: !selectedRowKeys.length }"
						:disabled="!selectedRowKeys.length"
						type="primary"
						@click="handleSubmit"
						>下一步</a-button
					>
				</a-space>
			</div>
		</a-drawer>
		<TipModal
			title="提示"
			ref="tipModal"
			okBtnText="查看补协"
			@save="goSupple"
		>
			<div class="tip-modal">
				<p>当前合同有正在进行中的补协，只有将此补协作废、删除、或者双签完成才能发起新的补充协议。</p>
				<p>补协编号：{{ contractInfo.supplementalAgreementNo }}</p>
			</div>
		</TipModal>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getOfflineContract, getOnlineContract, getSuppleLatest } from '@/v2/center/trade/api/suppleAgreement';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import TipModal from './TipModal.vue';
import contract from '@/v2/center/steels/mixins/contract';

const searchListOn = [
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
		realKey: ['minSignDate', 'maxSignDate']
	}
];
const searchListOff = [
	{
		decorator: ['paperContractNo'],
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
		decorator: ['offlineTransType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['contractBusinessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => !['LOGISTICS', 'DISCOUNT_WAREHOUSE_PLEDGE'].includes(item.value))
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['minSignDate', 'maxSignDate']
	}
];
const onColumns = [
	{ title: '', dataIndex: 'test', fixed: 'left' },
	{
		title: '合同类型',
		dataIndex: 'orderType',
		customRender: (text, record) => (record.orderType == 'buy' ? '采购合同' : '销售合同')
	},
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '卖方企业名称', dataIndex: 'sellCompany' },
	{ title: '买方企业名称', dataIndex: 'buyCompany' },
	{ title: '收货人', dataIndex: 'receiverName' },

	{
		title: '交货期限',
		dataIndex: 'deliveryDateBegin',
		key: 'deliveryDateBegin',
		scopedSlots: { customRender: 'deliveryDateEnd' }
	},
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '运输方式', dataIndex: 'transTypeDesc' },
	{ title: '数量(吨)', dataIndex: 'quantity', align: 'center', scopedSlots: { customRender: 'quantity' } },
	{ title: '基准价格(元/吨)', dataIndex: 'basicPrice', align: 'center', scopedSlots: { customRender: 'basicPrice' } },
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: text => {
			return text || '-';
		}
	},
	{ title: '煤种', dataIndex: 'coalTypeDesc' },

	{ title: '订单编号', dataIndex: 'orderSerialNo' }
];
const offColumns = [
	{ title: '', dataIndex: 'test', fixed: 'left' },
	{ title: '合同类型', dataIndex: 'contractTypeDesc' },
	{ title: '合同编号', dataIndex: 'paperContractNo' },
	{ title: '卖方企业名称', dataIndex: 'sellerName' },
	{ title: '买方企业名称', dataIndex: 'buyerName' },
	{ title: '收货人', dataIndex: 'receiverName' },
	{
		title: '交货期限',
		dataIndex: 'deliveryDateBegin',
		key: 'deliveryDateBegin',
		scopedSlots: { customRender: 'deliveryDateEnd' }
	},
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{ title: '运输方式', dataIndex: 'transTypeDesc' },
	{ title: '合同数量(吨)', dataIndex: 'quantity', align: 'center', scopedSlots: { customRender: 'quantity' } },
	{ title: '合同价格(元/吨)', dataIndex: 'basicPrice', align: 'center', scopedSlots: { customRender: 'basicPrice' } },
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
	data() {
		return {
			getPopupContainer,
			signTime: null,
			typeData: filterCodeByKey('goods_type'),
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			selected: {}, // 关联合同被选中的数据
			contractType: 'on', //合同类型，电子on,线下off
			searchListOn,
			searchListOff,
			loading: false,
			contractType: 'online',
			// 已经开具的补协的合同
			contractInfo: {}
		};
	},
	components: {
		SlFormNew,
		iPagination,
		TipModal
	},
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
		searchList() {
			if (this.contractType == 'on') {
				return searchListOn;
			}
			return searchListOff;
		},
		columns() {
			if (this.contractType == 'on') {
				return onColumns;
			}
			return offColumns;
		}
	},
	methods: {
		changeData(data) {
			this.searchModalParamsRelation = data || {};
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList();
		},
		getRelationOrderList() {
			//contractType=on是电子合同，off是线下合同
			// type是BUY关联采购合同，type==SELL是关联销售合同
			this.loading = true;
			this.selectedRowKeys = [];
			this.selected = {};

			const Api = this.contractType == 'on' ? getOnlineContract : getOfflineContract;

			const params = {
				...this.searchModalParamsRelation,
				pageNo: this.paginationRelation.pageNo,
				pageSize: this.paginationRelation.pageSize
			};

			Api(params)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.relationOrderList = result.records;
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
		showRelationOrderList(contractType) {
			this.orderRelationModal = true;
			this.contractType = contractType;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.signTime = null;
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getRelationOrderList();
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
		selectHandle(data) {
			this.selectedRowKeys = [data.id];
			this.selected = data;
			this.handleSubmit();
		},
		async handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warn('请选择合同');
				return;
			}
			const params = {
				contractNo: this.selected.contractNo
			};
			if (this.contractType == 'on') {
				const res = await getSuppleLatest(params);
				if (res.data) {
					this.$refs.tipModal.open();
					this.contractInfo = res.data;
					return;
				}
			}

			let selected = Object.assign({}, this.selected);
			this.orderRelationModal = false;
			//判断选中的合同类型UP-上游补录；DOWN-下游补录；ONLINE-电子合同
			// selected[this.type + "OrderType"] = this.contractType === "on" ? "ONLINE" : this.type === "buy" ? "UP" : "DOWN";
			//下游没有订单号采用contractNo,orderId
			selected.orderSerialNo = selected.orderSerialNo || selected.contractNo;
			selected.orderId = selected.orderId || selected.id;

			this.$emit('detail', selected);
			if (this.contractType == 'on') {
				this.$router.push({
					path: '/center/contract/agreement/add',
					query: {
						type: selected.orderType,
						contractId: selected.id,
						contractNo: selected.contractNo,
						orderSerialNo: selected.orderSerialNo,
						orderId: selected.orderId
					}
				});
			} else {
				const type = selected.contractTypeDesc == '销售合同' ? 'sell' : 'buy';
				this.$router.push({
					path: `/center/contract/${type}/offline/add`,
					query: {
						type: selected.orderType,
						contractId: selected.id,
						type,
						contractNo: selected.contractNo,
						orderSerialNo: selected.orderSerialNo,
						id: selected.orderId,
						whetherEditAllBoo: type === 'sell' ? selected.whetherEditAllBoo : undefined,
						whetherHaveRelAuditBoo: type === 'sell' ? selected.whetherHaveRelAuditBoo : undefined
					}
				});
			}
		},
		// 查看补协
		goSupple() {
			this.$refs.tipModal.close();
			this.onClose();
			this.$emit('searchSupple', this.contractInfo.supplementalAgreementNo);
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
.tip-modal {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	p:last-child {
		margin-top: 20px;
	}
}
.ant-btn-primary.disabled {
	background: #e5e6eb;
	border: 0;
}
</style>
