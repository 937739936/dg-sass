<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="查看未关联业务线的合同"
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
					key="buy"
					tab="采购合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="sell"
					tab="销售合同"
				>
				</a-tab-pane>
			</a-tabs>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="onSearch"
				@resetFunc="resetFunc"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
			></SlFormNew>
			<!-- 表格 -->
			<div>
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
				>
					<span slot="customTitles1">
						<span v-if="contractType == 'sell'">买方企业名称</span>
						<span v-else>卖方企业名称</span>
					</span>
					<template
						slot="companyName"
						slot-scope="text, items"
					>
						<p>{{ contractType === 'sell' ? items.buyerName : items.sellerName }}</p>
					</template>
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
						slot="basePrice"
						slot-scope="text, items"
					>
						<!-- 判断当前是否是线上和线下 -->
						<!-- <p v-if="!items.paperContractNo">{{ items.followTheMarket ? "随行就市" : (text? text+"元/吨" : (items.basicPriceDesc || '-') ) }}</p> -->
						<p>{{ items.basePrice == '随行就市' ? items.basePrice : `${formatMoney(items.basePrice)}元/吨` }}</p>
					</template>
					<template
						slot="deliveryDateStart"
						slot-scope="deliveryDateStart, items"
					>
						<p v-if="items.deliveryDateStart">{{ items.deliveryDateStart }}至{{ items.deliveryDateEnd }}</p>
						<p v-else>-</p>
					</template>
					<template
						slot="action"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							v-if="contractType == 'buy'"
							@click="selectContract(items)"
							>关联销售合同</a
						>
						<a
							href="javascript:;"
							v-else
							@click="selectContract(items)"
							>关联采购合同</a
						>
						<a
							href="javascript:;"
							style="margin-left: 20px"
							@click="stopContract(items)"
							v-if="items.terminateButtonShow"
							>合同终止</a
						>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<!-- <div class="footer">
        <a-space :size="30">
          <a-button class="relation-contract-modal-btn" style="margin-right: 8px" @click="onClose">取消</a-button>
          <a-button class="relation-contract-modal-btn" type="primary" @click="handleSubmit">确定</a-button>
        </a-space>
      </div> -->
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_BUYCONTRACTLIST, API_SELLCONTRACTLIST } from '@/v2/center/trade/api/contract';
import { getNoLinkBusinessContractList } from '@/v2/center/trade/api/businessLine';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { formatMoney } from '@sub/filters';

const searchListOn = [
	{
		decorator: ['keyNo'],
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
		placeholder: '请输入收货人'
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
		realKey: ['contractSignDateBegin', 'contractSignDateEnd']
	}
];
const relationOrderListColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left' },
	{ slots: { title: 'customTitles1' }, dataIndex: 'companyName', scopedSlots: { customRender: 'companyName' } },
	{ title: '收货人', dataIndex: 'receiverName', customRender: txt => txt || '-' },
	{
		title: '交货期限',
		dataIndex: 'deliveryDateStart',
		key: 'deliveryDateStart',
		scopedSlots: { customRender: 'deliveryDateStart' }
	},
	{ title: '签订日期', dataIndex: 'contractSignDate' },
	{ title: '运输方式', dataIndex: 'transTypeDesc' },
	{ title: '数量', dataIndex: 'quantity', align: 'center', scopedSlots: { customRender: 'quantity' } },
	{ title: '基准价格', dataIndex: 'basePrice', align: 'center', scopedSlots: { customRender: 'basePrice' } },
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: text => {
			return text || '-';
		}
	},
	{ title: '煤种', dataIndex: 'coalTypeDesc', customRender: txt => txt || '-' },
	{ title: '操作', dataIndex: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'RelationContract',
	props: ['relateOrderNo'], // type=buy是关联采购合同，type=sell是关联销售合同
	data() {
		return {
			getPopupContainer,
			relationOrderListColumns,
			signTime: null,
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			contractType: 'buy', //合同类型，采购buy,销售sell
			searchListOn,
			searchList: [],
			loading: false
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {
		this.searchList = this.searchListOn;
	},
	methods: {
		formatMoney,
		resetFunc() {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
		},
		onSearch(data) {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList(data);
		},
		async getRelationOrderList(data) {
			let API = getNoLinkBusinessContractList;
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation,
				orderType: this.contractType.toUpperCase()
			};
			delete params.showTotal;
			try {
				const res = await API(params);
				let result = res.result || res.data;
				const list = result.records || [];
				list.forEach(el => {
					// 主要是用来在关联合同判断来源
					el.source = 'noLinkContract';
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
			// 重置选择的合同
			this.$store.commit('businessLine/updateBuyContract', {});
			this.$store.commit('businessLine/updateSellContract', {});
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
		selectContract(item) {
			this.orderRelationModal = false;


			this.$store.commit('business/VUEX_setRelationContract', item);

			this.$router.push(`/center/businessline/addAssociation?type=${this.contractType}`);
		},
		// 终止合同
		stopContract(item) {
			// 订单创建人或该创建人对应企业管理员，且订单下无非作废状态的发货记录可以终止订单
			let { serialNo, director, directorMobile, initiatorUscc, status } = item;
			this.$router.push({
				path: '/center/contract/' + this.contractType.toLowerCase() + '/stop',
				query: {
					id: item.orderId,
					// orderId: item.orderId,
					serialNo: item.orderNo,
					type: this.contractType.toUpperCase(),
					initiatorUscc
				}
			});
		},
		onClose() {
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.body.style.height = '';
			document.removeEventListener('touchmove', m, { passive: true });
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
