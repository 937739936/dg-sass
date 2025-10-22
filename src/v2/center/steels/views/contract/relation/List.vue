<template>
	<div
		style="width: 100%"
		class="slMain"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>采销关联管理</span
				>
				<a-button
					type="primary"
					v-auth="'steel:contract:contractRelation:operate'"
					@click="createContract"
				>
					<span style="font-size: 14px">新增采销合同关联</span>
				</a-button>
			</div>
			<SlForm
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetFunc"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlForm>
			<div
				class="s-list"
				style="margin-top: 30px"
			>
				<a-table
					:pagination="false"
					:columns="columns"
					class="new-table"
					:data-source="resultList"
					:scroll="{ x: true }"
					:loading="loading"
					rowKey="id"
				>
					<template slot="contractType">
						<td>采购合同</td>
						<br />
						<td>销售合同</td>
					</template>
					<template
						slot="contractNo"
						slot-scope="contractNo, record"
					>
						<td
							style="position: relative; top: 11px"
							v-if="record.purchaseContract.generateWay == 'ARTIFICIAL_COLLECTION'"
						>
							<a
								:href="
									'/center/steels/contract/buy/Supplement?&type=detail&flag=buy&contractId=' + record.purchaseContract.contractId
								"
								target="_new"
							>
								{{ record.purchaseContract.contractNo }}</a
							>
						</td>
						<br />
						<td
							style="position: relative; top: 11px"
							v-if="record.purchaseContract.generateWay == 'SYSTEM_COLLECTION'"
						>
							<a
								:href="
									'/center/steels/contract/buy/detail?&type=detail&flag=buy&contractId=' + record.purchaseContract.contractId
								"
								target="_new"
							>
								{{ record.purchaseContract.contractNo }}</a
							>
						</td>
						<br />
						<!-- 销售合同 生成方式 -->
						<td
							style="position: relative; top: 11px"
							v-if="record.salesContract.generateWay == 'ARTIFICIAL_COLLECTION'"
						>
							<a
								:href="'/center/steels/contract/sell/supplement?type=detail&contractId=' + record.salesContract.contractId"
								target="_new"
							>
								{{ record.salesContract.contractNo }}
							</a>
						</td>
						<br />
						<td
							style="position: relative; top: 11px"
							v-if="record.salesContract.generateWay == 'SYSTEM_COLLECTION'"
						>
							<a
								:href="'/center/steels/contract/buy/detail?&type=detail&flag=sell&contractId=' + record.salesContract.contractId"
								target="_new"
							>
								{{ record.salesContract.contractNo }}
							</a>
						</td>
						<br />
					</template>
					<template
						slot="companyName"
						slot-scope="companyName, record"
					>
						<td>{{ record.purchaseContract.companyName }}</td>
						<br />
						<td>{{ record.salesContract.companyName }}</td>
					</template>
					<template
						slot="quantity"
						slot-scope="quantity, record"
					>
						<td>{{ record.purchaseContract.quantity || '-' }}</td>
						<br />
						<td>{{ record.salesContract.quantity || '-' }}</td>
					</template>
					<template
						slot="transportModeDesc"
						slot-scope="transportModeDesc, record"
					>
						<td>{{ record.purchaseContract.transportModeDesc }}</td>
						<br />
						<td>{{ record.salesContract.transportModeDesc }}</td>
					</template>
					<template
						slot="deliveryDateEnd"
						slot-scope="deliveryDateEnd, record"
					>
						<td v-if="record.purchaseContract.effectiveStartDate">
							{{ record.purchaseContract.effectiveStartDate }}～{{ record.purchaseContract.effectiveEndDate }}
						</td>
						<br />
						<td v-if="record.salesContract.effectiveStartDate">
							{{ record.salesContract.effectiveStartDate }}～{{ record.salesContract.effectiveEndDate }}
						</td>
					</template>
					<template
						slot="contractSignDate"
						slot-scope="contractSignDate, record"
					>
						<td>{{ record.purchaseContract.contractSignDate }}</td>
						<br />
						<td>{{ record.salesContract.contractSignDate }}</td>
					</template>
					<div
						slot="action"
						slot-scope="action, items"
					>
						<a
							v-auth="'steel:contract:contractRelation:view'"
							@click="detail(items)"
							>查看</a
						>
						<a
							v-if="items.canRemoveRelation"
							@click="relieve(items)"
							>解除关联关系</a
						>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getOrderList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_SteelsRelationContractList, API_SteelsRelieveRelationContract } from '@/v2/center/steels/api/contract.js';
import { mapMutations, mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { Modal } from 'ant-design-vue';
// import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const columns = [
	{ title: '采销关联编号', dataIndex: 'relationNo', key: 'relationNo' },
	{ title: '关联人', dataIndex: 'createdName', key: 'createdName' },
	{ title: '关联时间', dataIndex: 'createdDate', key: 'createdDate', align: 'center' },
	{ title: '合同类型', dataIndex: 'contractType', key: 'contractType', scopedSlots: { customRender: 'contractType' } },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', scopedSlots: { customRender: 'contractNo' } },
	{ title: '企业名称', dataIndex: 'companyName', key: 'companyName', scopedSlots: { customRender: 'companyName' } },
	{ title: '合同总数量（吨）', dataIndex: 'quantity', key: 'quantity', scopedSlots: { customRender: 'quantity' } },
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		key: 'transportModeDesc',
		scopedSlots: { customRender: 'transportModeDesc' }
	},
	{ title: '合同期限', dataIndex: 'deliveryDateEnd', key: 'deliveryDateEnd', scopedSlots: { customRender: 'deliveryDateEnd' } },
	{
		title: '合同签订日期',
		dataIndex: 'contractSignDate',
		key: 'contractSignDate',
		scopedSlots: { customRender: 'contractSignDate' }
	},
	{ key: 'action', fixed: 'right', title: '操作', width: 140, scopedSlots: { customRender: 'action' } }
];
import SlForm from '@sub/components/ui-new/Form/sl-form';
const searchList = [
	{
		decorator: ['relationNo'],
		addonBeforeTitle: '采销关联编号',
		type: 'input',
		placeholder: '请输入采销关联编号',
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
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称',
		allowClear: true
	}
];
export default {
	data() {
		return {
			colSpan,
			formLayout,
			searchList,
			flag: false,
			sortArr: [],
			menuType: '',
			columns: [...columns],
			params: {
				relationNo: '',
				contractNo: '',
				companyName: '',
				pageSize: 10,
				pageNo: 1
			},
			resultList: [],
			pagination: {
				type: 'contract',
				total: 0, // 总条数
				pageNo: 1
			},
			orderSerialNo: '', // orderSerialNo订单编号
			loading: false
		};
	},
	components: {
		iPagination,
		SlForm
	},
	mounted() {
		this.$nextTick(() => {
			let listParmas = this.listParmas;
			if (listParmas.type == this.pagination.type) {
				this.getOrderList(listParmas.pageNo);
				this.VUEX_initListParmas();
			} else {
				this.getOrderList();
			}
		});
	},
	computed: {
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		})
	},
	methods: {
		...mapMutations({
			VUEX_initListParmas: 'pagination/VUEX_initListParmas',
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		resetValues() {
			(this.params = {
				relationNo: '',
				contractNo: '',
				companyName: '',
				pageSize: 10,
				pageNo: 1
			}),
				(this.pagination.pageNo = 1);
			this.getOrderList();
		},
		resetFunc() {},
		changeSearch(info) {
			this.params = info;
			this.pagination.pageNo = 1;
			this.getOrderList();
		},
		// 查询按钮
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getOrderList();
		},
		// 获取订单列表
		getOrderList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loading = true;
			API_SteelsRelationContractList(this.params)
				.then(res => {
					if (res.success) {
						this.resultList = res.data.records;
						this.pagination.total = res.data.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		detail(items) {
			// 查看详情跳转到业务监控详情
			this.$router.push({
				path: '/center/steels/relation/detail',
				query: {
					contractType: 0, // 0上游 1下游
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					id: items.id
				}
			});
		},
		// 新增采销合同关联
		createContract() {
			this.$router.push({
				path: '/center/steels/relation/create'
			});
		},
		// 解除关联关系
		relieve(item) {
			Modal.confirm({
				title: '确定要解除该条采销合同的关联吗？',
				content: '解除后，可能会影响业务线无法串联起来，进而导致付款申请受到影响，如果采销合同关联错误，请及时进行正确的关联',
				okText: '确认',
				cancelText: '取消',
				onOk: async () => {
					const params = {
						id: item.id
					};
					const res = await API_SteelsRelieveRelationContract(params);
					this.$message.success('操作成功');
					this.searchSubmit();
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="stylus" scoped>
.slMain {
  margin-top: -10px;
}
#modal {
	.ant-modal {
		width: 80% !important;
		min-width: 800px;

		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
		.search-wrap {
			.order-wrap {
				.ant-form-item-children > input {
					width: 200px;
				}
				.ant-select {
					width: 200px;
				}
				.ant-calendar-picker-input input {
					width: 85px;
				}
			}
		}
	}
}
</style>
