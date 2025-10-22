<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择合同"
			placement="right"
			:visible="orderSearchModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.contractNo"
					:customRow="onClickRow"
					:loading="loading"
				>
					<span
						slot="Amount"
						slot-scope="text"
					>
						{{ text | formatMoney }}
					</span>
					<span
						slot="Quantity"
						slot-scope="text"
					>
						{{ text | formatMoney(4) }}
					</span>
					<span
						slot="contractPrice"
						slot-scope="text"
					>
						<template v-if="text == '随行就市'">
							{{ text }}
						</template>
						<template v-else> {{ text | formatMoney(2) }}元/吨 </template>
					</span>
					<template
						slot="deliveryStartDate"
						slot-scope="text, items"
					>
						<p v-if="items.execDateStart">{{ items.execDateStart }}至{{ items.execDateEnd }}</p>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="20">
					<a-button
						class="copy-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
					>
						取消
					</a-button>
					<a-button
						class="copy-contract-modal-btn"
						type="primary"
						:disabled="!(selectedRowKeys && selectedRowKeys.length)"
						@click="handleSubmit"
					>
						下一步
					</a-button>
				</a-space>
			</div>
		</a-drawer>
		<modalInfo
			ref="modalInfoOk"
			title="提示"
			:tip="tip"
			:footer="false"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import modalInfo from '@/v2/components/modalInfo/info';
import { API_TerminalContractList } from '@/v2/center/trade/api/settle';
import { selectOfflineContractColumns } from '../columns/columns.js';

const searchList = [
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
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict')
	},
	{
		decorator: ['orderBusinessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap').filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['contractSignTimeBegin', 'contractSignTimeEnd']
	}
];
export default {
	name: 'SelectContract',
	mixins: [ListMixin],
	components: { modalInfo },
	data() {
		let { meta } = this.$route;
		return {
			meta,
			orderSearchModal: false,
			selectedRowKeys: [],
			loading: false,
			searchList,
			url: {
				list: API_TerminalContractList
			},
			selfLoad: true, //打开弹框时再加载
			tip: '' //合同选择判断异常提示
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.contractNo];
				}
			};
		},
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		}),
		//查询类型字段，需大写
		orderType() {
			return this.type.toUpperCase();
		},
		//表格头部筛选，采购结算单不展示买方企业，销售结算单不展示卖方企业
		columns() {
			let columns = selectOfflineContractColumns;
			let dataIndex = '';
			switch (this.type) {
				case 'buy':
					dataIndex = 'buyerName';
					break;
				case 'sell':
					dataIndex = 'sellerName';
					break;
			}
			return columns.filter(item => {
				return item.dataIndex !== dataIndex;
			});
		}
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRowKeys = [];
		}
	},
	created() {
		this.defaultParams.type = this.orderType;
	},
	methods: {
		async handleSubmit() {
			if (!this.selectedRowKeys.length) {
				this.$message.warn('请选择合同');
				return;
			}
			let contractNo = this.selectedRowKeys[0];
			//选中合同校验合同是否可结算
			this.$router.push({
				path: `/center/settle/${this.type}/offlineadd`,
				query: {
					contractNo
				}
			});
		},
		showModal() {
			this.orderSearchModal = true;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.contractNo];
					}
				}
			};
		},
		onClose() {
			this.orderSearchModal = false;
			this.searchParams = {};
			this.selectedRowKeys = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
/deep/.ant-drawer-title {
	line-height: 26px;
	font-weight: 600;
}
.copy-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
</style>
