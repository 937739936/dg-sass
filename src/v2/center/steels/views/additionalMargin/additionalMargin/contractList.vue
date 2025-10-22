<template>
	<div >
		<div class="top-box">
			<div class="page-title">新增追保函</div>
		</div>
		<div class="divider"></div>
		<div class="steps-wrap">
			<SlStep
				:currentStep="0"
				:list="steps"
			></SlStep>
		</div>
		<SlForm
			:list="searchList"
			layout="inline"
			@change="changeSearch"

		></SlForm>
		<div style="width: 100%; margin-top: 40px">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				:customRow="clickCustomRow"
				:rowClassName="record => (record.inWarning ? 'highlight' : '')"
				class="new-table"
				rowKey="id"
				:dataSource="data"
				:pagination="false"
				:scroll="{ x: true }"
				:loading="loading"
			>
			</a-table>
			<i-pagination
				:pagination="pagination"
				v-if="isShowPagination"
				@change="getList"
			/>
		</div>
		<div>
			<div class="settle-btn-wrap">
				<a-button
					class="btn"
					@click.native="$router.back()"
					style="margin-right: 50px"
					>取消</a-button
				>
				<a-button
					type="primary"
					class="btn btn1"
					@click="next"
					>下一步</a-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import { getMaterialContractList } from '@/v2/center/steels/api/additionalMargin.js';
import iPagination from "@sub/components/iPagination";
import SlForm from '@sub/components/ui-new/Form/sl-form.vue';
import SlStep from '@sub/components/ui-new/sl-step.vue';
export default {
	name: 'SteelSettleApplyList',
	data() {
		return {
			flag: false,
			searchList: [
				{
					decorator: ['buyCompanyName'],
					addonBeforeTitle: '买方名称',
					type: 'input',
					placeholder: '请输入买方名称',
					allowClear: true
				},
				{
					decorator: ['contractNo'],
					addonBeforeTitle: '合同编号',
					type: 'input',
					placeholder: '请输入合同编号',
					allowClear: true
				},
				{
					decorator: ['riskRatio'],
					addonBeforeTitle: '风险抓手占比',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [
						{ value: '', label: '全部' },
						{ value: '-1', label: '低于合同约定保证金比例' },
						{ value: '0', label: '等于合同约定保证金比例' },
						{ value: '1', label: '高于合同约定保证金比例' }
					]
				},
				{
					decorator: ['marketPriceFloat'],
					addonBeforeTitle: '市场价格涨跌幅度',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [
						{ value: '', label: '全部' },
						{ value: '0', label: '跌幅未超过合同约定下跌比例' },
						{ value: '1', label: '跌幅超过合同约定下跌比例' }
					]
				}
			],
			searchParams: {},
			steps: [
				{
					title: '选择合同信息'
				},
				{
					title: '填写追保信息'
				},
				{
					title: '完成'
				}
			],
			data: [],
			columns: [
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 150
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
				},
				{
					title: '保证金比例(%)',
					dataIndex: 'bondRatio',
					customRender: text => `${text || 0}%`
				},
				{
					title: '保证金金额(元)',
					dataIndex: 'bondAmount',
					customRender: text => {
						return text || '-';
					}
				},
				{
					title: '市场价格下跌幅度设置(%)',
					dataIndex: 'marketPriceDownRatio',
					customRender: text => `${text || '-'}`
				},
				{
					title: '基准价格(元/吨)',
					dataIndex: 'baseUnitPrice',
					customRender: text => `${text || '-'}`
				},
				{
					title: '当前市场价格(元/吨)',
					dataIndex: 'marketPrice',
					customRender: text => `${text || '-'}`
				},
				{
					title: '合同数量(吨)',
					dataIndex: 'quantity'
				},
				{
					title: '业务类型',
					dataIndex: 'businessTypeDesc'
				},
				{
					title: '网价参考来源',
					dataIndex: 'marketPriceSourceDesc'
				},
				{
					title: '风险抓手占比(%)',
					dataIndex: 'riskRatio',
					customRender: text => `${text || text === 0 ? text + '%' : '-'}`,
					fixed: 'right'
				},
				{
					title: '市场价格涨跌幅度(%)',
					dataIndex: 'marketPriceRaise',
					customRender: text => `${text || text === 0 ? text + '%' : '-'}`,
					fixed: 'right'
				}
			],
			isShowPagination: true,
			selectedRowKeys: [],
			itemInfo: {},
			contractId: '',
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false,
			visible: false,
			marketPriceSource: 'MYSTEEL_COM'
		};
	},
	components: {
		iPagination,
		SlForm,
		SlStep
	},

	mounted() {
		this.getList();
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				fixed: true,
				selectedRowKeys: selectedRowKeys,
				onChange: (record, itemList) => {
					this.itemInfo = itemList[0];
					t.selectedRowKeys = record;
					t.contractId = record[0];
				}
			};
		}
	},
	methods: {
		clickCustomRow(record, index) {
			return {
				on: {
					click: () => {
						this.itemInfo = record;
						this.selectedRowKeys = [record.id];
						this.contractId = record.id;
					}
				}
			};
		},
		changeSearch(info) {
			this.searchParams = info;
			this.pagination.pageNo = 1;
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			const params = {
				pageNo: pageNo,
				pageSize: pageSize,
				...this.searchParams
			};

			this.loading = true;
			try {
				const res = await getMaterialContractList(params);
				this.data = res.data.records;
				this.pagination.total = res.data.total;
				this.isShowPagination = res.data.total > res.data.size;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		next() {
			if (!this.contractId) {
				this.$message.error('请选择合同');
				return;
			}
			const query = {
				contractId: this.contractId,
				marketPriceSource: this.itemInfo.marketPriceSource,
				type: 'add'
			};
			this.$router.push({
				path: '/center/steels/additionalMargin/additionalMargin/add',
				query
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
/deep/ .ant-table-column-title {
	font-weight: 600;
}
/deep/ .highlight td {
	color: red !important;
}
/deep/ td.ant-table-fixed-columns-in-body {
	color: transparent !important;
}
.settle-btn-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 40px;
}
.btn {
	width: 126px;
	height: 44px;
	background: #ffffff;
	border-radius: 6px;
	border: 1px solid @primary-color;
	color: @primary-color;
}
.btn1 {
	background: @primary-color;
	color: #fff;
}
/deep/ .steps-wrap {
	padding-bottom: 20px;
	padding-top: 30px;
	width: 100%;
}
</style>
