<template>
	<div class="background-wrapper">
		<a-card
			class="custom-card-title"
			title="合同详情"
			:bordered="false"
		>
			<a-button
				class="back"
				ghost
				type="primary"
				@click="$router.go(-1)"
			>
				返回
			</a-button>
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
					><span>合同起始日期</span>
					<span class="ellipsis">
						<a-tooltip :title="`${data.contractStartDate}~${data.contractEndDate}`">
							<div class="ellipsis value">{{ data.contractStartDate }}~{{ data.contractEndDate }}</div>
						</a-tooltip>
					</span>
				</a-col>

				<a-col :span="8"
					><span>合同状态</span>
					<span class="ellipsis">
						<a-tooltip :title="data.status.cname">
							<div
								class="ellipsis value"
								:class="setStyle(data.status.name)"
							>
								{{ data.status.cname }}
							</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>卖方</span>
					<span class="ellipsis">
						<a-tooltip :title="data.sellerName">
							<div class="ellipsis value">{{ data.sellerName }}</div>
						</a-tooltip>
					</span></a-col
				>
				<a-col :span="8"
					><span>交付日期</span>
					<span class="ellipsis">
						<a-tooltip :title="data.deliveryTime">
							<div class="ellipsis value">{{ data.deliveryTime }}</div>
						</a-tooltip>
					</span>
				</a-col>

				<a-col
					style="text-align: left"
					:span="24"
				>
					<span style="flex: 1">合同附件</span>
					<span style="flex: 8">
						<a
							class="mr16"
							@click="handlePreview(item.path)"
							:key="index"
							v-for="(item, index) in data.attachmentList"
						>
							{{ item.convertFileName }}
						</a>
					</span>
				</a-col>
			</a-row>
			<a-divider />
			<a-col
				style="display: block"
				:span="12"
			>
				<div>商品确认单结算数量合计（kg）</div>
				<div class="num">
					{{ data.confirmationSlipInfo.clearingWeightTotal && data.confirmationSlipInfo.clearingWeightTotal.toLocaleString() }}
				</div>
			</a-col>
			<a-col
				style="display: block; height: auto"
				:span="12"
			>
				<div>商品确认单结算金额合计（元）</div>
				<div class="num">
					{{ data.confirmationSlipInfo.clearingPriceTotal && data.confirmationSlipInfo.clearingPriceTotal.toLocaleString() }}
				</div>
			</a-col>
		</a-card>

		<a-card
			class="custom-card-title"
			:bordered="false"
		>
			<div
				v-for="(item, index) in data.confirmationSlipInfo.confirmationSlipList"
				:key="index"
			>
				<a-row style="margin-bottom: 10px">
					<a-col :span="12"
						><span>开具日期</span>
						<span>
							{{ item.createDate }}
						</span>
					</a-col>
					<a-col :span="12"
						><span>商品确认单编号</span>
						<span>
							<a @click="handlePreview(item.pdfUrl)">{{ item.confirmationNo }}</a>
						</span>
					</a-col>
				</a-row>
				<a-table
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="item.putInfoList"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="status"
						slot-scope="text, record"
					>
						<!-- <span class="g">执行中</span> -->
					</template>
					<template
						slot="footer"
						slot-scope="text, record"
					>
						<div class="footer">
							<span style="width: 100px">小计</span>
							<span>结算数量（KG）：{{ item.clearingWeight && item.clearingWeight.toLocaleString() }}</span>
							<span>结算金额（元）：{{ item.clearingTotalAmount && item.clearingTotalAmount.toLocaleString() }}</span>
						</div>
					</template>
				</a-table>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GrainContractDetail } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { filePreview } from '@/v2/utils/file';
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

	data() {
		return {
			columns,
			data: {
				status: {},
				confirmationSlipInfo: {
					confirmationSlipList: [
						/*{
                putInfoList:[]
              }*/
					]
				}
			},
			id: '',
			colSpan: 8,
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	components: {
		iPagination
	},

	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	},

	methods: {
		getDetail() {
			API_GrainContractDetail(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		},
		handlePreview(v) {
			filePreview(v);
		},
		setStyle(v) {
			return {
				EXECUTING: 'g',
				ARCHIVED: 'r'
			}[v];
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
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
.footer {
	span {
		display: inline-block;
		padding-right: 50px;
	}
}
.back {
	position: absolute;
	top: 12px;
	right: 24px;
}
</style>
