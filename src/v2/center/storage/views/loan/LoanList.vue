<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>放还款管理</span
				>
				<a-button
					type="primary"
					v-auth="'warehouse:financeLoanRepay:financeLoanRepay:loanRegister'"
					@click="goFang"
				>
					放款登记
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="orderNumber"
					style="margin-top: 22px"
				>
					<div
						slot="action"
						slot-scope="text, record"
						class="opera-content"
					>
						<a
							v-auth="'warehouse:financeLoanRepay:financeLoanRepay:detail'"
							href="javascript:;"
							@click="goToDetail(record)"
							>查看</a
						>
						<a
							v-if="record.status == 'LOANED' || record.status == 'PART_REPAY'"
							href="javascript:;"
							v-auth="'warehouse:financeLoanRepay:financeLoanRepay:repayRegister'"
							@click="goHuan(record)"
							>还款登记</a
						>
					</div>
					<div
						slot="loanSerialNo"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="goToDetail(record)"
							v-if="hasAuth('warehouse:financeLoanRepay:financeLoanRepay:detail')"
							>{{ text }}</a
						>
						<span v-else>{{ text }}</span>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>
<script>
const columns = [
	{
		title: '放款编号',
		dataIndex: 'loanSerialNo',
		key: 'loanSerialNo',
		scopedSlots: { customRender: 'loanSerialNo' }
	},
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' },
	{
		title: '买方企业',
		dataIndex: 'buyerName',
		key: 'buyerName',
		align: 'right'
	},
	{ title: '放款金额（元）', dataIndex: 'finAmount', key: 'finAmount' },
	{ title: '放款日期', dataIndex: 'loanDate', key: 'loanDate' },
	{ title: '到期日', dataIndex: 'endDate', key: 'endDate' },
	{ title: '最近还款日期', dataIndex: 'repayDate', key: 'repayDate' },
	{ title: '还款总额（元）', dataIndex: 'repayAmount', key: 'repayAmount' },
	{
		title: '还款本金（元）',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal'
	},
	{ title: '还款利息（元）', dataIndex: 'repayInterest', key: 'repayInterest' },
	{ title: '状态', dataIndex: 'statusText', key: 'statusText', fixed: 'right' },
	{
		title: '操作',
		width: 150,
		fixed: 'right',
		key: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
const searchList = [
	{
		decorator: ['loanSerialNo'],
		addonBeforeTitle: '放款编号',
		type: 'input',
		placeholder: '请输入放款编号'
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['loanDate'],
		addonBeforeTitle: '放款日期',
		type: 'rangePicker',
		realKey: ['loanDateStart', 'loanDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择品种',
		options: [
			{
				label: '已结清',
				value: 'CLEARED'
			},
			{
				label: '已放款',
				value: 'LOANED'
			},
			{
				label: '部分还款',
				value: 'PART_REPAY'
			}
		]
	},
	{
		decorator: ['name'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	}
];
import { API_GrainGetLoanList, API_LoanZuofei } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/v2/utils/factory';
import constants from '@sub/utils/constants';
import { hasAuth } from '@/v2/utils/checkAuth';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	data() {
		return {
			constants,
			getPopupContainer,
			hasAuth: hasAuth,
			columns,
			searchList,
			url: {
				list: API_GrainGetLoanList
			}
		};
	},
	components: {
		iPagination
	},
	computed: {},
	methods: {
		goToDetail(item) {
			if (item.id) {
				this.$router.push('/center/storageCenter/loan/loanDetail?id=' + item.id);
			}
		},
		goHuan(record) {
			const path = '/center/storageCenter/loan/loanHuan';
			this.$router.push(`${path}?id=` + record.id);
		},
		goFang() {
			const path = '/center/storageCenter/loan/loanFangList';
			this.$router.push(path);
		},
		zuofei(record) {
			this.$confirm({
				centered: true,
				title: '是否确认作废该笔放款记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_LoanZuofei({ loanId: record.id }).then(res => {
						if (res.data) {
							this.$message.success('作废成功');
							this.getList();
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
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
::v-deep .opera-content {
	a {
		float: left;
		margin-right: 10px;
	}
}
</style>
