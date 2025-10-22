<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>发货申请</span>
			<a-button
				type="primary"
				@click="$router.push('/center/steels/receive/deliver/list')"
				><div>返回</div></a-button
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
		<a-form
			layout="inline"
			class="search-wrap"
		>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="买方名称"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.buyCompanyName"
							placeholder="请输入"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同总数量"
						class="order-wrap range-input"
						:colon="false"
					>
						<a-input
							v-model="params.quantityLower"
							placeholder="请输入"
						>
						</a-input>
						<span class="range-text">至</span>
						<a-input
							v-model="params.quantityUpper"
							placeholder="请输入"
						>
						</a-input>
						<span class="range-text">吨</span>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同编号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
							placeholder="请输入"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="12" class="row">
                    <a-form-item label="下游企业简称" class="order-wrap" :colon=false>
                        <a-input v-model="params.downstreamCompanyAbbr" placeholder="请输入"></a-input>
                    </a-form-item>
                </a-col> -->
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label=" "
						class="order-wrap"
						:colon="false"
					>
						<a-button
							type="primary"
							@click="searchSubmit"
							class="search-btn"
						>
							查询
						</a-button>
						<a-button
							html-type="reset"
							@click="resetValues"
						>
							重置
						</a-button>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="resultList"
				:pagination="false"
				:loading="loading"
				:customRow="onClickRow"
				:scroll="{ x: true }"
			>
				<span
					slot="downstreamCompanyAbbr"
					slot-scope="downstreamCompanyAbbr"
				>
					{{ downstreamCompanyAbbr || '-' }}
				</span>
				<span
					slot="deliveryDateEnd"
					slot-scope="deliveryType, items"
				>
					<p v-if="items.effectiveEndDate">{{ items.effectiveStartDate }}～{{ items.effectiveEndDate }}</p>
				</span>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
		<div class="receive-btn-wrap">
			<a-button
				type="primary"
				class="next-btn"
				@click="next()"
				:disabled="resultList.length == 0"
				>下一步</a-button
			>
		</div>
	</div>
</template>

<script>
import { API_SteelsDeliverContractList } from '@/v2/center/steels/api/receive.js';

import iPagination from "@sub/components/iPagination";
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		fixed: 'left'
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName'
	},
	// {
	//     title: '下游企业简称',
	//     dataIndex: 'downstreamCompanyAbbr',
	// },
	{
		title: '合同总数量(吨)',
		dataIndex: 'quantity',
		align: 'center',
		customRender: text => text || '-'
	},
	{
		title: '已发货数量(吨)',
		dataIndex: 'deliveredQuantity',
		align: 'center'
	},
	{
		title: '合同期限',
		dataIndex: 'deliveryDateEnd',
		key: 'deliveryDateEnd',
		scopedSlots: {
			customRender: 'deliveryDateEnd'
		}
	}
];
export default {
	name: 'ApplyList',
	data() {
		return {
			steelType: '',
			tableWidth: { x: 0 },
			currentStep: 0,
			steps: [{ title: '选择销售合同' }, { title: '填写发货信息' }, { title: '完成' }],
			columns,
			resultList: [],
			loading: false,
			selectedRowKeys: [],
			contractId: '',
			params: {
				contractNo: '',
				buyCompanyName: '',
				quantityLower: '',
				quantityUpper: '',
				downstreamCompanyAbbr: ''
			},
			pagination: {
				type: 'SteelsDeliverApplyList',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		iPagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.contractId = record.id;
					t.steelType = record.steelType;
				}
			};
		}
	},
	mounted() {
		this.getList();
		let that = this;
		setTimeout(function () {
			that.tableWidth.x = document.getElementsByClassName('ant-table-thead')[0].offsetWidth;
		}, 0);
	},
	methods: {
		next() {
			if (this.contractId == '') {
				this.$message.error('请先选择一条行数据');
			} else {
				this.$router.push({
					path: '/center/steels/receive/deliver/releaseApply',
					query: {
						contractId: this.contractId,
						flag: 'add',
						steelType: this.steelType
					}
				});
			}
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.contractId = record.id;
						this.steelType = record.steelType;
					}
				}
			};
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_SteelsDeliverContractList(this.params).then(res => {
				if (res.success) {
					this.resultList = res.data.records;
					this.pagination.total = res.data.total;
				}
			});
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.params = {
				contractNo: '',
				buyCompanyName: '',
				contractQuantity: '',
				quantityLower: '',
				quantityUpper: '',
				deliverDateBegin: '',
				deliverDateEnd: '',
				downstreamCompanyAbbr: ''
			};
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>

<style lang="less">
.release-applylist {
	.search-wrap {
		.order-wrap {
			label {
				width: 84px;
			}
		}
	}
	.table-wrap {
		.ant-table-placeholder {
			border-bottom: none;
		}
	}
	.receive-btn-wrap {
		text-align: center;
		padding: 30px 0;
	}
	td {
		word-break: break-all;
	}
	.receive-btn-wrap {
		.ant-btn {
			width: 96px;
			height: 34px;
		}
	}
}
</style>
