<template>
	<div id="goodsTransferApplyList">
		<div class="s-title">
			<span>货转开具</span>
			<a-button
				type="primary"
				@click="$router.back()"
				><div>返回</div></a-button
			>
		</div>
		<div class="steps-wrap">
			<a-steps :current="0">
				<a-step title="选择待开具货转的合同信息" />
				<a-step title="选择对应货物信息" />
				<a-step title="完成" />
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
						label="卖方名称"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.sellCompanyName"
							placeholder="请输入"
						></a-input>
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
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同日期"
						class="order-wrap"
						:colon="false"
					>
						<a-range-picker
							:placeholder="['开始日期', '结束日期']"
							valueFormat="YYYY-MM-DD"
							v-model="deliverDate"
							format="YYYY-MM-DD"
							@change="deliverDateGetTime"
						/>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="12"	class="row">
							<a-form-item
								label="合同起始日"
								class="order-wrap"
								:colon=false>
								<a-date-picker @change="(date, dateString) => handleDateChange(date, dateString, 'start')"/>
							</a-form-item>
						</a-col>
						<a-col	:span="12"	class="row">
							<a-form-item
								label="合同截止日"
								class="order-wrap"
								:colon=false>
								<a-date-picker @change="(date, dateString) => handleDateChange(date, dateString, 'end')"/>
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
							html-type="submit"
							class="search-btn"
							@click="searchSubmit"
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
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
			>
			</a-table>
		</div>
		<div class="test">
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>

		<div class="goodsTrans-btn-wrap">
			<a-button
				type="primary"
				class="next-btn"
				@click="next()"
				:disabled="dataSource.length == 0"
				>下一步</a-button
			>
		</div>
	</div>
</template>

<script>
import { getSupplementGoodsTransfer, checkContractQuantity } from '@/v2/center/steels/api/goodsTransfer.js';
import iPagination from "@sub/components/iPagination";
export default {
	name: 'goodsTransApplyList',
	data() {
		return {
			params: {
				sellCompanyName: '',
				batchNo: '',
				contractNo: '',
				effectiveStartDate: '',
				effectiveEndDate: ''
			},
			deliverDate: [],
			selectedRowKeys: [],
			columns: [
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
				{
					title: '合同数量(吨)',
					dataIndex: 'quantity',
					width: 130,
					customRender: (text, row) => {
						return text || '-';
					}
				},
				{
					title: '已开具货转数量(吨)',
					dataIndex: 'goodsTransferQuantity',
					width: 150
				},
				{
					title: '业务类型',
					dataIndex: 'businessTypeDesc',
					width: 150
				},
				{
					title: '合同日期',
					dataIndex: 'date',
					customRender: (text, row) => {
						return `${row.effectiveStartDate || ''}-${row.effectiveEndDate || ''}`;
					},
					width: 150
				}
			],
			dataSource: [],
			id: this.$route.query.id, // 当前选中行合同编号
			currentRow: {}, // 当前选中行
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			effectiveStartDate: '', // 执行开始日期
			effectiveEndDate: '' // 执行结束日期
		};
	},
	components: {
		iPagination
	},
	mounted() {
		// 返回选中上一次所选的
		if (this.id) {
			this.selectedRowKeys = [this.$route.query.id];
		}
		this.getList();
	},
	methods: {
		// 执行开始|结束日期发生变化时
		handleDateChange(date, dateString, type) {
			switch (type) {
				case 'start':
					this.params.effectiveStartDate = dateString;
					break;
				case 'end':
					this.params.effectiveEndDate = dateString;
					break;
			}
		},
		deliverDateGetTime(value, dateString) {
			this.params.effectiveStartDate = dateString[0];
			this.params.effectiveEndDate = dateString[1];
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			const res = await getSupplementGoodsTransfer(this.params);
			this.dataSource = (res.data && res.data.records) || [];
			this.pagination.total = res.data.total || 0;
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.params = {
				sellCompanyName: '',
				batchNo: '',
				contractNo: '',
				effectiveStartDate: '',
				effectiveEndDate: ''
			};
			this.deliverDate = [];
			this.pagination.pageNo = 1;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.id = record.id;
						this.currentRow = record;
					}
				}
			};
		},
		async next() {
			if (!this.id) {
				this.$message.error('请选择需要开具货转的合同');
			} else {
				const params = {
					contractId: this.currentRow.id
				};
				await checkContractQuantity(params);
				this.$router.push({
					path: '/center/steels/goodsTransfer/godsTransferAdditional',
					query: {
						contractNo: this.currentRow.contractNo,
						contractTemplate: this.currentRow.contractTemplate,
						contractId: this.currentRow.id,
						generateWay: this.currentRow.generateWay
					}
				});
			}
		}
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
					t.id = record.id;
					t.currentRow = record;
				}
			};
		}
	}
};
</script>

<style lang="less">
#goodsTransferApplyList {
	.goodsTrans-btn-wrap {
		text-align: center;
		padding: 30px 0;
	}
}
</style>
