<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			:title="type === 'buy' ? '选择采购合同' : '选择销售合同'"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<div class="select-box" v-if="selectedRowKeys.length">
			
				<span class="select-box-title">已选择{{type === 'buy' ? '采购合同' : '销售合同'}}</span>
				<span v-for="item in currentSelectContractList" :key="item.id" class="select-box-item">
					<span>{{item.paperContractNo || item.contractNo}}</span>
					<span class="del" @click="del(item)">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM8.41423 4.17195C8.80476 3.78143 9.43792 3.78143 9.82844 4.17195C10.219 4.56247 10.219 5.19564 9.82844 5.58616L8.41458 7.00003L9.82854 8.41399C10.2191 8.80451 10.2191 9.43768 9.82854 9.8282C9.43801 10.2187 8.80485 10.2187 8.41432 9.8282L7.00037 8.41424L5.5858 9.8288C5.19528 10.2193 4.56211 10.2193 4.17159 9.8288C3.78107 9.43828 3.78107 8.80512 4.17159 8.41459L5.58615 7.00003L4.17168 5.58556C3.78116 5.19504 3.78116 4.56187 4.17168 4.17135C4.56221 3.78082 5.19537 3.78082 5.5859 4.17135L7.00037 5.58582L8.41423 4.17195Z" fill="#8495AA"/>
						</svg>
					</span>
				</span>
				
			</div>
			<a-tabs
				v-model="contractType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="on"
					tab="电子合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="off"
					tab="线下合同"
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
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
				>
					<span slot="customTitles1">
						<span v-if="contractType == 'on'">数量</span>
						<span v-else>合同数量</span>
					</span>
					<span slot="customTitles2">
						<span v-if="contractType == 'on'">基准价格</span>
						<span v-else>合同价格</span>
					</span>
					<template
						slot="contractNo"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">{{ text }}</p>
						<p v-else>{{ items.paperContractNo }}</p>
					</template>
					<template
						slot="companyName"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">{{ type === 'sell' ? items.buyCompany : items.sellCompany }}</p>
						<p v-else>{{ type === 'sell' ? items.buyerName : items.sellerName }}</p>
					</template>
					<template
						slot="receiverName"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">{{ text || '-' }}</p>
						<p v-else>{{ items.consigneeCompanyName || '-' }}</p>
					</template>
					<template
						slot="quantity"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">{{ text ? formatMoney(text) + '吨' : '-' }}</p>
						<p v-else>{{ items.contractQuantity ? formatMoney(items.contractQuantity) + '吨' : '-' }}</p>
					</template>
					<template
						slot="basicPrice"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">
							{{
								items.followTheMarket ? '随行就市' : text ? formatMoney(text) + '元/吨' : formatMoney(items.basicPriceDesc) || '-'
							}}
						</p>
						<p v-else>
							<!-- <span v-if="items.followTheMarket ">随行就市</span>
              <span v-if="!items.followTheMarket && items.contractPrice && items.contractPrice != 0 ">{{formatMoney(items.contractPrice)+"元/吨"}}</span> -->

							{{
								items.followTheMarket
									? '随行就市'
									: items.contractPrice && items.contractPrice != 0
										? formatMoney(items.contractPrice) + '元/吨'
										: '-'
							}}
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
					<template
						slot="signTime"
						slot-scope="text, items"
					>
						<p v-if="contractType === 'on'">{{ text || '-' }}</p>
						<p v-else>{{ items.contractSignTime || '-' }}</p>
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
import {
	API_BUYCONTRACTLIST,
	API_SELLCONTRACTLIST,
	API_OFFLINEBUYERORDERLINKLIST,
	API_OFFLINESELLERORDERLINKLIST
} from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";

import { cloneDeep } from 'lodash';
import { formatMoney } from '@sub/filters';
import slSelectVue from '@sub/components/ui-new/Form/sl-select.vue';
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
	// {
	//   decorator: ["orderStatus"],
	//   addonBeforeTitle: "合同状态",
	//   type: "select",
	//   placeholder: "请选择合同状态",
	//   options: [
	//     {
	//       value: "AUDITING",
	//       label: '审批中'
	//     },
	//     {
	//       value: "WAIT_SIGN_SEAL",
	//       label: '待签约'
	//     },
	//     {
	//       value: "WAIT_CONFIRM",
	//       label: '待确认'
	//     },
	//     {
	//       value: "CONFIRM_WAIT_SIGN_SEAL",
	//       label: '确认待盖章'
	//     },
	//     {
	//       value: "EXECUTING",
	//       label: '执行中'
	//     }
	//   ]
	// },
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
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
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
	}
];
const relationOrderListColumnsBuy = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', scopedSlots: { customRender: 'contractNo' } },
	{ title: '卖方企业名称', dataIndex: 'companyName', scopedSlots: { customRender: 'companyName' } },
	{ title: '收货人', dataIndex: 'receiverName', scopedSlots: { customRender: 'receiverName' } },
	{
		title: '交货期限',
		dataIndex: 'deliveryDateBegin',
		key: 'deliveryDateBegin',
		scopedSlots: { customRender: 'deliveryDateEnd' }
	},
	{ title: '签订日期', dataIndex: 'signTime', scopedSlots: { customRender: 'signTime' } },
	{ title: '运输方式', dataIndex: 'transTypeDesc', customRender: t => t || '-' },
	{ slots: { title: 'customTitles1' }, dataIndex: 'quantity', align: 'center', scopedSlots: { customRender: 'quantity' } },
	{ slots: { title: 'customTitles2' }, dataIndex: 'basicPrice', align: 'center', scopedSlots: { customRender: 'basicPrice' } },
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: text => {
			return text || '-';
		}
	},
	{ title: '煤种', dataIndex: 'coalTypeDesc' }
];
export default {
	name: 'RelationContract',
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				// type: 'radio',
				selectedRowKeys,
				// onChange: (record, ) => {
				// 	// t.selectedRowKeys = [record.id];
				// 	// t.$forceUpdate();
				// 	// t.selected = record;
				// },
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys;
					this.selected = selectedRows[0];
				}
			};
		},
		//电子合同，线下合同表头不同
		relationOrderListColumns() {
			let list = cloneDeep(relationOrderListColumnsBuy);
			let flag = false;
			list.forEach(item => {
				if (item.dataIndex === 'companyName') {
					item.title = this.type === 'sell' ? '买方企业名称' : '卖方企业名称';
				}
				flag = item.dataIndex === 'orderSerialNo';
			});

			if (this.contractType === 'on' && !flag) {
				list.push({ title: '订单编号', dataIndex: 'orderSerialNo' });
			} else if (this.contractType === 'off' && flag) {
				list.pop();
			}
			/** 如果当前是线下合同 删除煤种 */
			if (this.contractType === 'off') {
				list = list.filter(el => el.dataIndex != 'coalTypeDesc');
			}
			return list;
		},
		// 判断当前是不是在关联合同页面引用的
		isBusiness() {
			return this.source == 'business';
		},
	},
	// type=buy是关联采购合同，type=sell是关联销售合同 relCompanyUscc管理的合同过滤 source引用的模块
	props: ['type', 'relateOrderNo', 'relCompanyUscc', 'source'],

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
			searchList: [],
			loading: false,
			currentSelectContractList: [],
			isFirst: false,
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
		selectedRowKeys: {
			handler(list) {
				this.relationOrderList.forEach(el => {
				
					if(list.includes(el.id) ) {
						const item  = this.currentSelectContractList.find(el2 => el2.id == el.id);
						if(!item) {
							this.currentSelectContractList.push(el)
						}
					}

				})
				this.currentSelectContractList =  this.currentSelectContractList.filter(el2 => this.selectedRowKeys.includes(el2.id))
			},
			deep: true,
			immediate: true,
		}
	},
	created() {
		const list = cloneDeep(searchListOn);
		if (this.isBusiness) {
			this.searchList = list.filter(el => el.addonBeforeTitle != '合同状态');
		}
	},
	methods: {
		formatMoney,
		getRelationOrderList(data) {
			//contractType=on是电子合同，off是线下合同
			// type是BUY关联采购合同，type==SELL是关联销售合同
			const API =
				this.contractType === 'on'
					? this.type === 'buy'
						? API_BUYCONTRACTLIST
						: API_SELLCONTRACTLIST
					: this.type === 'sell'
						? API_OFFLINEBUYERORDERLINKLIST
						: API_OFFLINESELLERORDERLINKLIST;
			this.searchModalParamsRelation = data || {};
			if (this.searchModalParamsRelation.contractSignTimeStart && this.searchModalParamsRelation.contractSignTimeEnd) {
				this.searchModalParamsRelation.contractSignTimeStart = this.searchModalParamsRelation.contractSignTimeStart;
				this.searchModalParamsRelation.contractSignTimeEnd = this.searchModalParamsRelation.contractSignTimeEnd;
			}
			this.loading = true;
			// this.selectedRowKeys = [];
			// this.selected = {};
			const params = {
				...this.searchModalParamsRelation,
				relCompanyUscc: this.relCompanyUscc || null
			};
			if(this.isBusiness && this.contractType === 'on') {
				params.orderStatus= 'EXECUTING'
			}
			API(params)
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

						if(!this.relateOrderNo) {
							
							if(this.isFirst) {
								this.selectedRowKeys = []
							}
							this.isFirst = false
							
						}
						if (this.relateOrderNo) {
							
							
							if(!this.isFirst) return
							this.isFirst = false

						
							const contractNoList = this.relateOrderNo.split(',')
							const  contractList = this.currentSelectContractList.filter(item => contractNoList.includes(item.paperContractNo || item.contractNo));

							this.selectedRowKeys = contractList.map(el => el.id);
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showRelationOrderList(selectList) {
			
			if(selectList) {
				this.currentSelectContractList = selectList || []
			}
			
			/** 接受d */
			this.isFirst = true
			this.orderRelationModal = true;
			if (this.type) {
				this.resetValuesRelation();
			}
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
			this.searchList = this.contractType === 'on' ? cloneDeep(searchListOn) : cloneDeep(searchListOff);
			// 兼容从关联合同模块 引入的数据
			if (this.isBusiness) {
				if (this.contractType === 'on') {
					this.searchList = cloneDeep(searchListOn).filter(el => el.addonBeforeTitle != '合同状态');
				} else {
					this.searchList = cloneDeep(searchListOff).filter(el => el.addonBeforeTitle != '收货人');
				}
			}

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
					}
				}
			};
		},
		selectHandle(data) {
			this.selectedRowKeys = [data.id];
			this.selected = data;
			this.handleSubmit();
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.warn('请选择要关联的合同');
				return;
			}
			// let selected = Object.assign({}, this.selected);
			this.orderRelationModal = false;

			this.currentSelectContractList.forEach(selected => {
					//判断选中的合同类型UP-上游补录；DOWN-下游补录；ONLINE-电子合同
					selected[this.type + 'OrderType'] = this.contractType === 'on' ? 'ONLINE' : this.type === 'buy' ? 'UP' : 'DOWN';
					//下游没有订单号采用contractNo,orderId
					selected.orderSerialNo = selected.orderSerialNo || selected.contractNo;
					selected.orderId = selected.orderId || selected.id;
			})

			this.$emit('detail', this.currentSelectContractList);

		},
		// 删除选择的合同
		del(item) {
			this.selectedRowKeys = this.selectedRowKeys.filter(el => el != item.id)
		},
		onClose() {
			this.orderRelationModal = false;
			this.selectedRowKeys = [];
			this.currentSelectContractList = []
			
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
.select-box {
	font-size: 14px;
	margin-top: 25px;
	margin-bottom: 10px;
	&-title {
		color: #8495AA;
		margin-right: 12px;
	}
	&-item {
		height:32px;
		padding:0 12px ;
		background: #F3F5F6;
		border-radius: 4px;
		display: inline-block;
		line-height: 32px;
		margin-right: 12px;
		margin-bottom: 10px;
		.del {
			margin-left: 10px;
			position: relative;
			top: 2px;
			cursor: pointer;
		}
	}
}
</style>
