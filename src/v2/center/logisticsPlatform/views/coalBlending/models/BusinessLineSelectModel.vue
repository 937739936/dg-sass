<template>
	<div>
		<a-drawer
			class="slDrawer"
			placement="right"
			:forceRender="true"
			:destroyOnClose="true"
			:title="drawerTitle"
			:visible="isShowModal"
			:footer="null"
			@close="onClose()"
		>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<div class="table-box">
				<a-table
					class="new-table"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => rowKey(record)"
					:loading="loading"
					:customRow="onClickRow"
				>
					<template
						slot="businessLineName"
						slot-scope="text"
					>
						<div class="businessLineName-column-container">
							<TextOverflowTooltip :tipText="text">
								<span>{{ text }}</span>
							</TextOverflowTooltip>
						</div>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
			<div class="footer">
				<a-space :size="20">
					<a-button
						class="footer-btn cancel-btn"
						@click="onClose"
					>
						取消
					</a-button>
					<a-button
						class="footer-btn"
						type="primary"
						ghost
						@click="handleSubmit(true)"
					>
						暂不关联
					</a-button>
					<a-button
						class="footer-btn"
						type="primary"
						:disabled="!(selectedRowKeys && selectedRowKeys.length)"
						@click="handleSubmit(false)"
					>
						确定
					</a-button>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { getBusinessLinePage } from '@/v2/center/logisticsPlatform/api/coalBlending';
import TextOverflowTooltip from '@sub/components/base/TextOverflowTooltip';

export default {
	name: 'BusinessLineSelectModel',
	mixins: [ListMixin],
	components: { TextOverflowTooltip },
	data() {
		return {
			drawerTitle: '选择关联业务线',
			isShowModal: false,
			defaultParams: {},
			selectedRowKeys: [], // 当前选中的行 rowkeys
			selectedRows: [], // 当前选中的行
			url: {
				list: getBusinessLinePage
			},
			selfLoad: true,
			searchList: SearchList,
			columns: Columns(this)
		};
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRowKeys = [];
			this.sel = [];
		}
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					t.selectedRowKeys = selectedRowKeys;
					t.selectedRows = selectedRows;
				}
			};
		}
	},
	mounted() {},
	methods: {
		rowKey(record) {
			let key = record.businessLineNo;
			return key;
		},
		onInitConfig() {
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.defaultParams = {};
			this.resetSearchQuery();
		},
		resetSearchQuery() {
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
		},
		closeModal() {
			this.isShowModal = false;
			this.onInitConfig();
		},
		onClose() {
			this.$emit('onCancel');
			this.closeModal();
		},
		showModal() {
			this.isShowModal = true;
			this.getList();
		},
		handleSubmit(isSkip = false) {
			let businessLineNo;
			if (!isSkip) {
				if (this.selectedRows.length > 0) {
					let selectContract = this.selectedRows[0];
					businessLineNo = selectContract.businessLineNo;
				}
			}
			this.$emit('handleBusinessLineSelect', { businessLineNo: businessLineNo });
			this.closeModal();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [this.rowKey(record)];
						this.selectedRows = [record];
						this.$forceUpdate();
					}
				}
			};
		}
	}
};
// 默认搜索表单数据
const SearchList = [
	{
		decorator: ['businessLineNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入业务线号或合同编号'
	},
	{
		decorator: ['businessLineName'],
		addonBeforeTitle: '业务线名称',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入业务线名称'
	},
	{
		decorator: ['consigneeCompany'],
		addonBeforeTitle: '收货人',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入收货人'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: [
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '火运', value: 'TRAIN' },
			{ label: '船运', value: 'SHIP' }
		]
	},
	{
		decorator: ['createdDate'],
		addonBeforeTitle: '创建日期',
		type: 'datePicker',
		placeholder: '请选择创建日期',
		allowClear: false
	}
];

// 数据为空时，显示的表头
const customRender = text => text || '-';
const Columns = function () {
	return [
		{
			title: '业务线号',
			dataIndex: 'businessLineNo',
			fixed: 'left',
			customRender
		},
		{
			title: '业务线名称',
			dataIndex: 'businessLineName',
			scopedSlots: {
				customRender: 'businessLineName'
			}
		},
		{
			title: '收货人',
			dataIndex: 'consigneeCompanyName',
			customRender
		},
		{
			title: '采购合同号',
			dataIndex: 'buyerContractNo',
			customRender
		},
		{
			title: '采购合同名',
			dataIndex: 'upStreamGoodsName',
			customRender
		},
		{
			title: '采购合同单价',
			dataIndex: 'buyerContractUnitPrice',
			customRender: text => {
				if (text == 0 || text == '0') {
					return '随行就市';
				}
				if (!text) {
					return '-';
				}
				return `¥${text}/吨`;
			}
		},
		{
			title: '销售合同号',
			dataIndex: 'sellerContractNo',
			customRender
		},
		{
			title: '销售合同品名',
			dataIndex: 'downStreamGoodsName',
			customRender
		},
		{
			title: '销售合同单价',
			dataIndex: 'sellerContractUnitPrice',
			customRender: text => {
				if (text == 0 || text == '0') {
					return '随行就市';
				}
				if (!text) {
					return '-';
				}
				return `¥${text}/吨`;
			}
		},
		{
			title: '运输方式',
			dataIndex: 'transTypeDesc',
			customRender
		},
		{
			title: '创建时间',
			dataIndex: 'createdDate',
			customRender
		}
	];
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slDrawer {
	.table-box {
		margin-top: 50px;
		.businessLineName-column-container {
			max-width: 300px;
			text-overflow: ellipsis;
			overflow: hidden;
			word-wrap: break-word;
			word-break: break-all;
			white-space: nowrap;
		}
	}
	.footer {
		.footer-btn {
			height: 32px;
			min-width: 90px;
			line-height: 32px;
			// padding: 0 24px;
			padding: 0 24px !important;
		}
		.cancel-btn {
			border-color: #c3c3c3;
		}
		.cancel-btn:hover {
			color: @primary-color;
			border-color: @primary-color;
		}
	}
}
</style>
