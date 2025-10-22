<template>
	<div class="background-wrapper">
		<a-card
			class="custom-card-title"
			title="确认单开具"
			:bordered="false"
		>
			<a-row>
				<a-col :span="8"
					><span>合同编号</span>
					<span class="ellipsis">
						<a-tooltip :title="data.contractNo">
							<div class="ellipsis value">{{ data.contractNo }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>买方</span>
					<span class="ellipsis">
						<a-tooltip :title="data.buyerName">
							<div class="ellipsis value">{{ data.buyerName }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>卖方</span>
					<span class="ellipsis">
						<a-tooltip :title="data.sellerName">
							<div class="ellipsis value">{{ data.sellerName }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>合同起始日期</span>
					<span class="ellipsis">
						<a-tooltip :title="`${data.contractStartDate}~${data.contractEndDate}`">
							<div class="ellipsis value">{{ data.contractStartDate }}~{{ data.contractEndDate }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>交付日期</span>
					<span class="ellipsis">
						<a-tooltip :title="data.deliveryTime">
							<div class="ellipsis value">{{ data.deliveryTime }}</div>
						</a-tooltip>
					</span>
				</a-col>
			</a-row>
		</a-card>

		<a-card
			:bordered="false"
			class="mb16"
		>
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:scroll="{ x: true }"
				:pagination="false"
			>
				<template
					slot="footer"
					slot-scope="text, record"
				>
					<div class="footer">
						<span style="width: 100px">小计</span>
						<span>结算数量（KG）：{{ clearingWeight && clearingWeight.toLocaleString() }}</span>
						<span>结算金额（元）：{{ clearingTotalAmount && clearingTotalAmount.toLocaleString() }}</span>
					</div>
				</template>
			</a-table>
		</a-card>

		<a-card
			class="tc"
			:bordered="false"
		>
			<a-button
				style="margin-right: 24px"
				@click="$router.go(-1)"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="save"
				:disabled="selectedRowKeys.length <= 0"
				>提交</a-button
			>
		</a-card>
	</div>
</template>

<script>
import { API_GrainContractDetail, API_GrainGetListByStorageCompany, API_GrainConfirmationShipAdd } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";

const columns = [
	{
		title: '库点',
		fixed: 'left',
		dataIndex: 'depotPoint'
	},
	{
		title: '仓房',
		dataIndex: 'storehouse'
	},
	{
		title: '入库流水号',
		dataIndex: 'serialNumber'
	},
	{
		title: '入库时间',
		dataIndex: 'storageTime'
	},
	{
		title: '商品名称',
		dataIndex: 'grainName'
	},
	{
		title: '等级',
		dataIndex: 'grainLevel'
	},
	{
		title: '结算数量（KG）',
		dataIndex: 'clearingWeight',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '结算单价（元/KG）',
		dataIndex: 'clearingUnitPrice',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '结算金额（元）',
		dataIndex: 'clearingPrice',
		customRender: text => {
			return text && text.toLocaleString();
		}
	}
];

export default {
	name: 'storageCenterContractList',

	components: {
		iPagination
	},
	data() {
		return {
			columns,
			dataSource: [],
			lineData: [],
			selectedRowKeys: [],
			data: {},
			clearingWeight: 0,
			clearingTotalAmount: 0,
			id: '',
			colSpan: 8,
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const itSelf = this;
			return {
				type: 'checkbox',
				selectedRowKeys: selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					itSelf.selectedRowKeys = selectedRowKeys;
					itSelf.clearingWeight = selectedRows.reduce((pre, cur, index, arr) => {
						return (pre * 100 + cur.clearingWeight * 100) / 100;
					}, 0);
					itSelf.clearingTotalAmount = selectedRows.reduce((pre, cur, index, arr) => {
						return (pre * 100 + cur.clearingPrice * 100) / 100;
					}, 0);
				}
			};
		}
	},

	methods: {
		getDetail() {
			API_GrainContractDetail(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
					this.getListByStorageCompany({ storageCompanyUscc: this.data.sellerUscc });
				}
			});
		},

		getListByStorageCompany(params) {
			API_GrainGetListByStorageCompany(params).then(res => {
				if (res.success) {
					this.dataSource = res.data;
				}
			});
		},

		save() {
			const params = {
				contractId: this.id,
				putInfoIdList: this.selectedRowKeys
			};
			API_GrainConfirmationShipAdd(params).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('保存成功');
						this.$router.push({
							path: '/center/storageCenter/contract'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	display: flex;
	line-height: 32px;
	height: 32px;
	margin-bottom: 3px;
	/* border: 1px solid red; */
	span {
		display: inline-block;
		flex: 3;
	}
	span:nth-of-type(2) {
		flex: 6;
		padding-right: 5px;
	}
	.value {
		display: inline-block;
		max-width: 100%;
	}
	.num {
		font-size: 20px;
	}
}
::v-deep {
	.ant-table-footer {
		border: 1px solid #eef0f2;
	}
	.ant-table-body > table,
	.ant-table-fixed-left table,
	.ant-table-fixed-right table {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
}
.footer {
	span {
		display: inline-block;
		padding-right: 50px;
	}
}
</style>
