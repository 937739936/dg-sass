<template>
	<a-modal
		width="1130px"
		:visible="visible"
		:footer="null"
		:title="null"
		centered
		@cancel="triggerVisible"
		destroyOnClose
	>
		<div class="title">选择销售合同</div>
		<div style="padding: 20px">
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				style="margin-bottom: 20px; margin-top: -20px"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<a-table
				class="new-table"
				:columns="columns"
				style="margin-bottom: 20px"
				:bordered="false"
				rowKey="orderId"
				:rowSelection="rowSelection"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:loading="loading"
			>
				<span
					slot="consigneeName"
					slot-scope="consigneeName"
				>
					{{ consigneeName || '-' }}
				</span>
				<template
					slot="zxq"
					slot-scope="text, record"
				>
					{{ record.deliveryDateBegin }}
					<span v-if="record.deliveryDateEnd">~{{ record.deliveryDateEnd }}</span>
				</template>
			</a-table>
			<i-pagination
				:pageSizeOptions="['5', '10', '20', '30', '40', '50']"
				style="margin-bottom: 30px"
				:defaultPageSize="5"
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<div class="footer">
				<a-button @click="goDeliver(0)">暂不关联</a-button>
				<a-button
					type="primary"
					@click="goDeliver(1)"
					>确认</a-button
				>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_GETDELIVERAPPLYLIST } from '@/v2/center/trade/api/receive';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '输入订单或合同编号'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方企业',
		type: 'input',
		placeholder: '输入买方企业'
	},
	{
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '输入收货人'
	}
];
// 选择合同发货弹窗
const selectContractColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', fixed: 'left' },
	{ title: '买方企业', dataIndex: 'buyerName', key: 'buyerName' },
	{
		title: '收货人',
		dataIndex: 'consigneeName',
		key: 'consigneeName',
		scopedSlots: { customRender: 'consigneeName' }
	},
	{ title: '订单数量(吨)', dataIndex: 'quantity', key: 'quantity' },
	{ title: '已发货数量(吨)', dataIndex: 'deliveryQuantity', key: 'deliveryQuantity' },
	{ title: '运输方式', dataIndex: 'transType', key: 'transType' },
	{
		title: '执行期',
		dataIndex: 'zxq',
		key: 'zxq',
		scopedSlots: { customRender: 'zxq' }
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			columns: selectContractColumns,
			visible: false,
			pageSize: 5,
			url: {},
			selectedRowKeys: []
		};
	},
	components: {},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.orderId];
				}
			};
		}
	},
	methods: {
		init() {
			this.searchParams = null;
			this.selectedRowKeys = [];
			this.url.list = API_GETDELIVERAPPLYLIST;
			this.getList(1, 5);
			this.triggerVisible();
		},
		triggerVisible() {
			this.visible = !this.visible;
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.orderId];
					}
				}
			};
		},
		goDeliver(relevance = false) {
			let orderId = null;
			if (relevance) {
				if (!this.selectedRowKeys.length) {
					this.$message.error('请选择申请发货的合同信息或"暂不关联"');
					return;
				}
				orderId = this.selectedRowKeys[0];
			}
			this.triggerVisible();
			this.$emit('ok', orderId);
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}

.footer {
	text-align: right;

	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
		height: 34px;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}
</style>
