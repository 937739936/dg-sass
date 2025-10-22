<template>
	<div
		class="settleApplyList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>结算单开具</span
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
				ref="SlFormNew"
			></SlFormNew>

			<div style="width: 100%">
				<a-tabs @change="onChangeTab">
					<a-tab-pane
						:key="item.value"
						:tab="item.label"
						v-for="item in contractList"
					></a-tab-pane>
				</a-tabs>
				<div
					class="table-wrap"
					style="margin-top: 30px"
				>
					<a-table
						:rowSelection="rowSelection"
						:columns="columns"
						class="new-table"
						:rowKey="record => record.id"
						:dataSource="dataSource"
						:pagination="false"
						:scroll="{ x: true }"
						:customRow="onClickRow"
						@change="handleTableSort"
						:loading="loading"
					>
					</a-table>
				</div>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
			<div class="settle-btn-wrap">
				<a-button
					type="primary"
					class="next-btn"
					@click="next"
					:disabled="dataSource.length == 0"
					>下一步</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_SteelsStatementContractPage, getStatementSellContractPage } from '@/v2/center/steels/api/settle.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { steelTypeOpt } from './constant.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称',
		allowClear: true
	},
	{
		decorator: ['steelType'],
		addonBeforeTitle: '钢材种类',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('steelType')
	}
];
export default {
	name: 'SteelSettleApplyList',
	mixins: [ListMixin],
	data() {
		return {
			colSpan,
			formLayout,
			searchList,
			flag: false,
			sortArr: [],
			menuType: '',
			currentStep: 0,
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写结算信息'
				},
				{
					title: '完成'
				}
			],
			//合同类型
			contractList: [
				{
					label: '采购合同',
					value: 'BUY'
				},
				{
					label: '销售合同',
					value: 'SELL'
				}
			],
			params: {
				contractNo: '',
				buyCompanyName: '',
				orderNo: '',
				downstreamCompanyAbbr: '',
				orderType: 'BUY'
			},
			data: [],
			/** 业务类型字典 */
			contractBusinessData: filterSteelsCodeByKey('contractBusinessType') || [],
			columns: [
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 250,
					fixed: 'left'
				},
				{
					title: '卖方名称',
					dataIndex: 'sellCompanyName'
					// sorter: true
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
					// sorter: true
				},
				// {
				//   title: '收货人简称',
				//   dataIndex: 'downstreamCompanyAbbr',
				//   width: 130,
				// },
				{
					title: '已发货数量(吨)',
					dataIndex: 'deliveredQuantity',
					customRender: text => {
						return text || '-';
					},
					align: 'center'
				},
				{
					title: '合同数量(吨)',
					dataIndex: 'quantity',

					customRender: text => {
						return text || '-';
					},
					align: 'center'
				},
				{
					title: '已付款金额',
					dataIndex: 'accountPaidAmount',
					customRender: text => {
						return text || '-';
					}
				},
				{
					title: '钢材种类',
					dataIndex: 'steelTypeDesc'
				},
				{
					title: '业务类型',
					dataIndex: 'businessTypeDesc',
					fixed: 'right'
				}
			],
			steelType: steelTypeOpt,
			selectedRowKeys: [],
			itemInfo: {},
			contractId: '',
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false,
			defaultParams: {
				orderType: 'BUY'
			},
			selfLoad: true
		};
	},
	components: {},
	mounted() {
		this.getList();
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
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
		onChangeTab(value) {
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1,
				type: ''
			};
			if (this.$refs.SlFormNew) {
				this.$refs.SlFormNew.resetSearchQuery();
			}
			this.dataSource = [];
			this.selectedRowKeys = [];
			this.contractId = '';
			this.searchParams = {};
			this.defaultParams.orderType = value;
			this.params.orderType = value;
			this.getList();
		},
		handleTableSort(pagination, filters, sorter, { currentDataSource }) {
			// 名称字段排序
			this.params.field = sorter.field;
			this.params.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.isorter,
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			delete params.issuedDate;
			this.loading = true;
			try {
				const Fn = this.defaultParams.orderType == 'SELL' ? getStatementSellContractPage : API_SteelsStatementContractPage;
				const res = await Fn(params);
				this.dataSource = res.data ? res.data.records : res.result.records;
				this.pagination.total = res.data ? res.data.total : res.result.total;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		next() {
			if (!this.contractId) {
				this.$message.error('请选择开具结算单的合同');
				return;
			}
			const query = {
				contractId: this.contractId,
				contractTemplate: this.itemInfo.contractTemplate,
				accountPaidAmount: this.itemInfo.accountPaidAmount || 0,
				steelType: this.itemInfo.steelType,
				contractType: this.params.orderType,
				generateWay: this.itemInfo.generateWay,
				businessType: this.itemInfo.businessType,
				contractNo: this.itemInfo.contractNo,
				type: 'add'
			};

			// 采购合同 --业务类型代采、联营（厂提）依据采购合同的货物明细补录结算单--补录结算单
			if (
				(query.businessType == 'SOURCING_AGENT' ||
					(query.businessType == 'AFFILIATED_BUSINESS' && this.itemInfo.deliveryMode == 'FACTORY_MENTION')) &&
				query.contractType == 'BUY'
			) {
				this.$router.push({
					path: '/center/steels/settle/additional',
					query
				});
				return;
			} else if (
				(this.itemInfo.businessType == 'ACCOUNT_RECEIVABLE' && this.itemInfo.contractType == 'SELL') ||
				(query.generateWay == 'ARTIFICIAL_COLLECTION' && this.itemInfo.contractType == 'SELL')
			) {
				// 业务类型为应收时，通过补录方式开具结算单--补录结算单
				// 销售合同补录生成时，无论业务类型，通过补录方式开具结算单--补录结算单
				this.$router.push({
					path: 'settleApplybl',
					query
				});
				return;
			}
			// 采购-应收（废钢）--依据货转开具结算单--线上结算单
			// 采购-业务类型为应收（非废钢）、代采+仓押、仓押、联营（“是否入库”选择为入库）时，依据货转开具结算单--补录结算单
			// 采购-应收（榆神）--依据货转开具结算单，和依据代采+仓押业务开具结算单页面类似，无结算金额字段--电子结算单
			// 采购-业务类型为其他（中间）--依据放货通知单开具结算单--电子结算单
			// 销售-线上合同&业务类型为其他（中间），依据放货通知单开具结算单
			// 销售--线上合同&业务类型为"代采+仓押、仓押、代采"，依据提单开具结算单 线上合同&业务类型为购销时，提单信息栏目展示字段、交互方式参考系统中现有依据提单开具结算单保持

			// 其他全走线上结算单

			this.$router.push({
				path: 'settleApply',
				query
			});
			// 代采+仓押、仓押、联营（入库） 采购合同  按照榆神开发 线上结算单
			//  if((['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(query.businessType) || (query.businessType == 'AFFILIATED_BUSINESS' && this.itemInfo.deliveryMode == 'WAREHOUSING')) && query.contractType == 'BUY' ) {
			//   this.$router.push({
			//     path: "settleApply",
			//     query,
			//   })
			//   return
			// }

			// if(specialSettleArr.includes(query.businessType) && query.contractType == 'BUY' ) {
			//     this.$router.push({
			//     path: '/center/steels/settle/additional',
			//     query,
			//   })
			// } else {
			//   this.$router.push({
			//     path: "settleApply?contractId=" + this.contractId,
			//     query,
			//   })
			// }
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.itemInfo = record;
						this.contractId = record.id;
					}
				}
			};
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less">
.settleApplyList {
	.settle-btn-wrap {
		text-align: center;
		padding: 30px 0;
	}

	td {
		word-break: break-all;
	}
}

::v-deep .table-wrap {
	width: 100%;
}

::v-deep .ant-tabs-tabpane {
	display: block !important;
}

::v-deep .ant-table td {
	white-space: nowrap;
}
</style>
