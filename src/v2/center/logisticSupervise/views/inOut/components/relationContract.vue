<template>
	<div>
		<a-drawer
			class="slDrawer"
			title="关联运输合同"
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
				ref="slFormNew"
				@change="getRelationOrderList"
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
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
				>
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
					<!-- <a-button type="primary"  class="no-relation" @click="noRelation">暂不关联</a-button> -->
					<a-button
						type="primary"
						@click="handleSubmit"
						:disabled="!selectedRowKeys.length"
						>确定</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { API_transport_contract_list } from '@/v2/center/trade/api/transportContract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from '@sub/components/iPagination';
import { mapGetters } from 'vuex';
const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		// 火车运输/汽车运输/汽车和火车运输/船运运输”
		options: [
			{ label: '火运', value: 'TRAIN' },
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '船运', value: 'SHIP' }
		]
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	}
];
const columns = [
	{ title: '运输合同编号', dataIndex: 'paperContractNo', fixed: 'left' },
	{ title: '托运人', key: 'buyerName', dataIndex: 'buyerName' },
	{ title: '承运人', key: 'sellerName', dataIndex: 'sellerName' },
	{
		title: '合同有效期',
		key: 'execDateEnd',
		dataIndex: 'execDateEnd',
		customRender: (t, r) => `${r.execDateStart} - ${r.execDateEnd}`
	},
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{ title: '起运地', dataIndex: 'origin' },
	{ title: '目的地', dataIndex: 'destination' }
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
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		relationOrderListColumns() {
			return columns;
		}
	},
	props: ['typeRecord'], // type=IN是关联采购合同，type=OUT是关联销售合同
	data() {
		return {
			getPopupContainer,
			signTime: null,
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {
				current: 1,
				pageNo: 1,
				pageSize: 10
			},
			selected: {}, // 关联合同被选中的数据
			searchList: [],
			loading: false,
			type: null
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	watch: {},
	mounted() {
		this.searchList = searchList;
	},
	methods: {
		getRelationOrderList(data) {
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			this.selectedRowKeys = [];
			this.selected = {};
			const params = {
				...this.searchModalParamsRelation,
				pageNo: this.paginationRelation.pageNo,
				pageSize: this.paginationRelation.pageSize,
				productCode: 'LOGIC_DELIVER'
			};
      if (this.typeRecord === 'IN') {
        params.buyerUscc = this.VUEX_ST_COMPANYSUER.companyUscc;
      } else if (this.typeRecord === 'OUT') {
        params.sellerUscc = this.VUEX_ST_COMPANYSUER.companyUscc;
      }
			API_transport_contract_list(params)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.relationOrderList = result.records;
						const paginationRelation = {
							total: result.total,
							pageSize: this.paginationRelation.pageSize,
							current: this.paginationRelation.pageNo,
							pageNo: this.paginationRelation.pageNo,
							showTotal: function (total) {
								return `共${total}条记录 第${this.paginationRelation.pageNo}页 `;
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
		show(type) {
			this.type = type;
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.signTime = null;
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1,
				pageNo: 1,
				pageSize: 10
			};
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
			this.getRelationOrderList();
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
			let selected = Object.assign({}, this.selected);
			this.orderRelationModal = false;
			this.$emit('relation', selected);
		},
		noRelation() {
			this.orderRelationModal = false;
			this.$emit('relation');
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
::v-deep.ant-checkbox-wrapper {
	color: rgba(0, 0, 0, 0.8);
}
.no-relation {
	border: 1px solid @primary-color;
	background: #fff;
	color: @primary-color;
}
.alert-warning {
	background: rgba(244, 131, 13, 0.1);
	border: 1px solid #ffd5b0;
	border-radius: 4px;
	line-height: 44px;
	margin-top: 20px;
	padding-left: 14px;
	color: rgba(0, 0, 0, 0.8);

	img {
		margin-right: 12px;
		height: 16px;
		width: 16px;
		vertical-align: sub;
	}
}
</style>