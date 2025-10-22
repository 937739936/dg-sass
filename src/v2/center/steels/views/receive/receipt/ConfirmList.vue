<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>收货确认</span>
			<a-button
				type="primary"
				@click="$router.push('/center/steels/receive/receipt/list')"
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
			class="mt16"
			v-bind="formLayout"
		>
			<a-row>
				<a-col :span="colSpan">
					<a-form-item
						label="合同编号"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="发货数量"
						:colon="false"
					>
						<a-input-number
							:min="0"
							v-model="params.quantityLower"
							step="100"
							placeholder="请输入"
						/>
						<span class="rangetext">至</span>
						<a-input-number
							:min="params.quantityLower"
							v-model="params.quantityUpper"
							step="100"
							placeholder="请输入"
						/>
						（吨）
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="批次号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.shipmentNo"
							placeholder="请输入"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="colSpan">
					<a-form-item label="下游企业简称" :colon="false">
						<a-input v-model="params.downstreamCompanyAbbr" placeholder="请输入"></a-input>
					</a-form-item>
				</a-col> -->
				<a-col :span="colSpan">
					<a-form-item
						label="卖方名称"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.sellCompanyName"
							placeholder="请输入"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label=" "
						:colon="false"
					>
						<a-space>
							<a-button
								type="primary"
								html-type="submit"
								@click="searchSubmit"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetValues"
								>重置</a-button
							>
						</a-space>
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
				:scroll="tableWidth"
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
import { API_SteelsReceiveContractList } from '@/v2/center/steels/api/receive.js';
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
const columns = [
	{
		title: '批次号',
		dataIndex: 'shipmentNo',
		width: 135
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		width: 135
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		width: 150
	},
	// {
	//     title: '下游企业简称',
	//     dataIndex: 'downstreamCompanyAbbr',
	//     width: 150,
	// },
	{
		title: '发货数量（吨）',
		dataIndex: 'quantity',
		width: 120,
		align: 'center'
	},
	{
		title: '发货日期',
		width: 210,
		dataIndex: 'shipmentDate',
		key: 'shipmentDate'
	},
	{
		key: 'action',
		slots: { title: 'customTitle' },
		width: 50,
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'ConfirmList',
	data() {
		return {
			colSpan,
			formLayout,
			tableWidth: { x: 0 },
			steelType: '',
			currentStep: 0,
			steps: [{ title: '选择待收货的发货申请' }, { title: '填写收货信息' }, { title: '完成' }],
			columns,
			resultList: [],
			// pagination:{},
			loading: false,
			selectedRowKeys: [],
			params: {
				contractNo: '',
				sellCompanyName: '',
				quantityLower: null,
				quantityUpper: null,
				downstreamCompanyAbbr: ''
			},
			contractTemplate: '',
			pagination: {
				type: 'SteelsReceiveConfirmList',
				total: 0, // 总条数
				pageNo: 1
			},
			deliverId: ''
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
					t.deliverId = record.id;
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
			if (this.deliverId == '') {
				this.$message.error('请先选择一条行数据');
			} else {
				this.$router.push({
					path: '/center/steels/receive/receipt/receiveApply',
					query: {
						deliverId: this.deliverId,
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
						this.deliverId = record.id;
						this.steelType = record.steelType;
					}
				}
			};
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_SteelsReceiveContractList(this.params).then(res => {
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
				sellCompanyName: '',
				quantityLower: null,
				quantityUpper: null,
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
