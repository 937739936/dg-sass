<template>
	<div style="width: 100%">
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			ref="SlFormNew"
		></SlFormNew>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				class="new-table"
				:pagination="false"
				:columns="columns"
				:data-source="dataSource"
				:scroll="{ x: true }"
				rowKey="serialNo"
				:loading="loading"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="$router.push('/center/counterfoil/record/rongDetail?id=' + record.id)"
						>查看</a
					>
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</div>
</template>
<script>
const columns = [
	{ title: '票据号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '票据类型', dataIndex: 'billTypeDesc', key: 'billTypeDesc' },
	{ title: '单据号', dataIndex: 'bankBillNo', key: 'bankBillNo' },
	{ title: '票据状态', dataIndex: 'statusDesc', key: 'statusDesc' },
	{ title: '票据开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{ title: '票据接收方', dataIndex: 'receiverName', key: 'receiverName' },
	{ title: '票据金额（元）', dataIndex: 'billAmount', key: 'billAmount' },
	{ title: '开立日期', dataIndex: 'issueDate', key: 'issueDate' },
	{ title: '承诺付款日', dataIndex: 'acceptanceDate', key: 'acceptanceDate' },
	// { title: '开立人', dataIndex: 'createName', key: 'createName'},
	{ title: '当前持有方', dataIndex: 'billOwner', key: 'billOwner' },
	{ title: '备注', dataIndex: 'remark', key: 'remark' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '票据号',
		type: 'input',
		placeholder: '请输入票据号'
	},
	{
		decorator: ['billType'],
		addonBeforeTitle: '票据类型',
		type: 'select',
		placeholder: '请选择票据类型',
		options: [
			{ label: '银行承兑', value: 1 },
			{ label: '商业承兑', value: 2 },
			{ label: '融单', value: 3 }
		]
	},
	{
		decorator: ['bankBillNo'],
		addonBeforeTitle: '单据号',
		type: 'input',
		placeholder: '请输入单据号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '票据状态',
		type: 'select',
		placeholder: '请选择票据状态',
		options: [
			{
				value: '1',
				label: '已出票'
			},
			{
				value: '2',
				label: '已签收'
			},
			{
				value: '3',
				label: '已贴现'
			},
			{
				value: '4',
				label: '已还款'
			}
		]
	},
	{
		decorator: ['issuerName'],
		addonBeforeTitle: '票据开立方',
		type: 'input',
		placeholder: '请输入票据开立方'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '票据接收方',
		type: 'input',
		placeholder: '请输入票据接收方'
	},
	{
		decorator: ['issueDate'],
		addonBeforeTitle: '开立日期',
		type: 'rangePicker',
		realKey: ['issueDateStart', 'issueDateEnd']
	},
	{
		decorator: ['acceptanceDate'],
		addonBeforeTitle: '承诺付款日',
		type: 'rangePicker',
		realKey: ['acceptanceDateStart', 'acceptanceDateEnd']
	}
];
import { API_GetCounterfoilList } from '@/v2/center/counterfoil/api/index.js';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/untils/factory.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			columns,
			searchList,
			selfLoad: true,
			status: '',
			url: {
				list: API_GetCounterfoilList
			},
			defaultParams: {
				status: ''
			}
		};
	},
	components: {
		iPagination
	},
	mounted() {
		this.initData();
	},
	methods: {
		async initData() {
			return new Promise(async resolve => {
				this.getList();
				resolve(true);
			});
		},
		handleChange(data) {
			this.changeSearch(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.top-nav {
	width: 100%;
	display: flex;
	background-color: #fff;
	height: 50px;
	justify-content: flex-start;
	margin-bottom: -10px;
	margin-top: 10px;
	font-size: 14px;
	border-bottom: 1px solid #f0f0f0;
}

.nav-item {
	text-align: center;
	line-height: 50px;
	position: relative;
	cursor: pointer;
	font-family: PingFang SC;
	color: rgba(0, 0, 0, 0.4);
	margin-right: 40px;
	&.active {
		color: @primary-color;
		font-family: PingFangSC-Medium;
		font-weight: 500;
	}
	&.active:after {
		content: '';
		width: 100%;
		height: 2px;
		position: absolute;
		background-color: @primary-color;
		bottom: 0;
		left: 0;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.s-card-title {
	margin-top: 10px;
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
::v-deep.ant-space {
	.ant-space-item:first-child {
		margin-left: 0 !important;
	}
}
</style>
