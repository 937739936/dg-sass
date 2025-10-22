<template>
	<div
		class="mySettleList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>结算单确认</span
				>
			</div>
			<div class="steps-wrap">
				<a-steps :current="currentStep">
					<a-step
						v-for="item in steps"
						:key="item.title"
						:title="item.title"
					/>
				</a-steps>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<div
				class="settle-confirm-list"
				style="margin-top: 30px"
			>
				<div class="table-wrap new-table">
					<a-table
						:rowSelection="rowSelection"
						:columns="columns"
						:rowKey="record => record.statement.id"
						:dataSource="data"
						:pagination="false"
						:loading="loading"
						:customRow="onClickRow"
						@change="handleTableSort"
						:scroll="tableWidth"
					>
						<span
							slot="settleAmount"
							slot-scope="settleAmount, item"
						>
							{{ item.settleAmount.toLocaleString() }}
						</span>
					</a-table>
				</div>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>

				<div class="btn-wrap">
					<a-button
						type="primary"
						class="next-btn"
						@click="next()"
						:disabled="this.data.length == 0"
						>下一步
					</a-button>
				</div>
			</div>
		</a-card>
		<sort-field
			:flag="flag"
			:arr="sortArr"
			@cancel="cancel"
			:menuType="menuType"
			@reload="reload"
		></sort-field>
	</div>
</template>

<script>
import { API_GetTableSorter } from '@/v2/api';
import { API_SteelsStatementConfirmStatementList } from '@/v2/center/steels/api/settle.js';
import SortField from '@/v2/components/SortField';
import { mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';

import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['statementNo'],
		addonBeforeTitle: '结算单编号',
		type: 'input',
		placeholder: '请输入结算单编号',
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
		decorator: ['sellCompanyName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称',
		allowClear: true
	},
	{
		decorator: ['buyCompanyName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称',
		allowClear: true
	},

	{
		decorator: ['payAmount'],
		addonBeforeTitle: '结算数量',
		type: 'input-group',
		placeholder: '请输入结算数量',
		realKey: ['settleQuantityMin', 'settleQuantityMax'],
		children: [
			{
				decorator: ['settleQuantityMin'],
				addonBeforeTitle: '结算数量',
				type: 'input',
				placeholder: '最小值'
			},
			{
				decorator: ['settleQuantityMax'],
				addonBeforeTitle: '结算数量',
				type: 'input',
				placeholder: '最大值'
			}
		]
	}
];
export default {
	mixins: [ListMixin],
	name: 'SettleConfirmList',
	data() {
		return {
			searchList,
			colSpan,
			formLayout,
			tableWidth: {
				x: 0
			},
			flag: false,
			sortArr: [],
			menuType: '',
			currentStep: 0,
			steps: [
				{
					title: '选择待确认的结算单'
				},
				{
					title: '进行结算单确认'
				},
				{
					title: '完成'
				}
			],
			params: {
				statementNo: '',
				contractNo: '',
				downstreamCompanyAbbr: '',
				buyerName: '',
				sellerName: '',
				settleQuantityMin: '',
				settleQuantityMax: ''
			},
			columns: [
				{
					title: '结算单编号',
					dataIndex: 'statement.statementNo',
					width: 210
				},
				{
					title: '合同编号',
					dataIndex: 'statement.contractNo',
					width: 200
				},
				{
					title: '结算数量(吨)',
					dataIndex: 'statement.particularQuantity'
				},
				{
					title: '结算金额(元)',
					dataIndex: 'statement.settleAmount'
				},
				{
					title: '买方名称',
					dataIndex: 'statement.buyCompanyName'
					// sorter: true
				},
				{
					title: '卖方名称',
					dataIndex: 'statement.sellCompanyName'
					// sorter: true
				}
			],
			data: [],
			url: {
				list: API_SteelsStatementConfirmStatementList
			},
			selectedRowKeys: [],
			loading: false,
			id: '',
			orderId: '',
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		SortField,
		iPagination
	},
	mounted() {
		let arr = window.location.pathname.split('/');
		this.menuType = arr[arr.length - 1];
		this.oldColumns = this.columns;
		this.getOrder({
			menuType: this.menuType,
			companyId: this.VUEX_ST_COMPANYSUER.companyId
		});
		this.getList();
		let that = this;
		setTimeout(function () {
			that.tableWidth.x = document.getElementsByClassName('ant-table-thead')[0].offsetWidth;
		}, 0);
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: (record, selected, selectsedRows) => {
					t.selectedRowKeys = [record.statement.id];
					t.id = record.statement.id;
				}
			};
		}
	},
	methods: {
		handleTableSort(pagination, filters, sorter, { currentDataSource }) {
			// 名称字段排序
			this.params.field = sorter.field;
			this.params.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		getOrder(data) {
			API_GetTableSorter(data).then(res => {
				if (res.success) {
					if (res.result != null) {
						this.reload(res.result.selected);
					}
				} else {
					this.$message.error('网络异常，请稍后重试！');
				}
			});
		},
		reload(data) {
			let newArr = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				for (let j = 0; j < this.oldColumns.length; j++) {
					if (item.key == this.oldColumns[j].dataIndex) {
						newArr.push(this.oldColumns[j]);
					}
					if (newArr.length == data.length) {
						newArr.push(this.oldColumns[this.oldColumns.length - 1]);
						this.columns = newArr;
						this.getList();
						return;
					}
				}
			}
		},
		sortVal() {
			this.sortArr = [];
			this.flag = true;
			for (let i = 0; i < this.columns.length; i++) {
				if (i < this.columns.length - 1) {
					let item = this.columns[i];
					let obj = {};
					obj.title = item.title;
					obj.key = item.dataIndex;
					if (this.sortArr.indexOf(obj) == '-1') {
						this.sortArr.push(obj);
					}
				}
			}
		},
		cancel() {
			this.flag = false;
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			// this.params = {
			//   contractNo: '',
			//   buyerName: '',
			//   statementNo: '',
			//   downstreamCompanyAbbr: '',
			//   sellerName: '',
			//   settleQuantityMin: '',
			//   settleQuantityMax: '',
			// };
			this.pagination.pageNo = 1;
			// this.getList();
		},
		// getList(pageNo = this.pagination.pageNo, pageSize = 10) {
		//   this.pagination.pageNo = pageNo
		//   this.params.pageNo = pageNo
		//   this.params.pageSize = pageSize
		//   for (const k in this.params) {
		//     if (!this.params[k]) {
		//       delete this.params[k]
		//     }
		//   }
		//   API_SteelsStatementConfirmStatementList(this.params).then(res => {
		//     if (res.success) {
		//       this.data = res.data.records;
		//       this.pagination.total = res.data.total
		//     }
		//   })
		// },
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.statement.id];
						this.id = record.statement.id;
					}
				}
			};
		},
		next() {
			if (!this.id && !this.orderId) {
				this.$message.error('请先选择一条行数据');
			} else {
				this.$router.push({
					path: 'settleConfirmDetail?id=' + this.id + '&type=' + 'confirm',
					query: {
						statementId: this.id
					}
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less">
.settle-confirm-list {
	.ant-table-tbody > tr > td {
		max-width: 110px;
		border-bottom: 0;
		word-break: break-all;
	}

	.btn-wrap {
		text-align: center;
		padding: 30px 0;

		.ant-btn {
			margin-right: 0;
		}
	}
}
</style>
