<template>
	<a-modal
		width="1130px"
		:visible="visible"
		:title="null"
		centered
		@cancel="triggerVisible"
		@ok="goDeliver"
		okText="下一步"
		destroyOnClose
	>
		<div class="title">选择运输合同</div>
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
				rowKey="id"
				:rowSelection="rowSelection"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:loading="loading"
			>
				<template
					slot="zxq"
					slot-scope="text, record"
				>
					{{ record.execDateStart }}
					<span v-if="record.execDateStart">~{{ record.execDateEnd }}</span>
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
		</div>
	</a-modal>
</template>
<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_pageOfflineContract } from '@/v2/center/logisticSupervise/api/receive';

const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '输入运输合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: [
			{
				label: '火运',
				value: 'TRAIN'
			},
			{
				label: '汽运',
				value: 'AUTOMOBILE'
			},
			{
				label: '船运',
				value: 'SHIP'
			}
		]
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	}
];
// 选择合同发货弹窗
const selectContractColumns = [
	{ title: '运输合同编号', dataIndex: 'paperContractNo', fixed: 'left' },
	{ title: '承运人', dataIndex: 'sellerName' },
	{ title: '托运人', dataIndex: 'buyerName' },
	{ title: '合同有效期', dataIndex: 'zxq', scopedSlots: { customRender: 'zxq' } },
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{ title: '起运地', dataIndex: 'origin' },
	{ title: '目的地', dataIndex: 'destination' }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			columns: selectContractColumns,
			visible: false,
			defaultParams: {
				productCode: 'LOGIC_DELIVER',
				deliveryDespatchType: null
			},
			pageSize: 5,
			url: {
				list: API_pageOfflineContract
			},
			selfLoad: true,
			selectedRowKeys: ''
		};
	},
	components: {},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: [selectedRowKeys],
				getCheckboxProps: record => ({
					props: {
						disabled: record.transportMode === 'AUTOMOBILE' // 运输方式是汽运是禁止选择
					}
				}),
				onSelect: selectRow => {
					t.selectedRowKeys = selectRow.id;
				}
			};
		}
	},
	methods: {
		// 外部打开调用
		init(type) {
			this.defaultParams.deliveryDespatchType = type;
			this.searchParams = null;
			this.selectedRowKeys = '';
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
						// 运输方式是汽运是禁止选择
						if (record.transportMode === 'AUTOMOBILE') {
							return;
						}
						this.selectedRowKeys = record.id;
					}
				}
			};
		},
		goDeliver() {
			let orderId = null;
			if (!this.selectedRowKeys) {
				this.$message.error('请选择申请发货的合同信息');
				return;
			}
			orderId = this.selectedRowKeys;
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
