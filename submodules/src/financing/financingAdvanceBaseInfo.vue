<template>
	<div style="width: 100%">
		<div
			class="slTitleAssis"
			style="margin-bottom: 20px"
		>
			融资信息
		</div>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item :label="amountLabel">
				<span style="color: #f46332">￥{{ formatMoney(detailData.planFinancingAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资利率">
				<span style="color: #f46332">{{ detailData.rate }}%</span>
			</a-descriptions-item>
			<a-descriptions-item label="逾期日利率（%）">{{ detailData.overdueRate }}</a-descriptions-item>

			<a-descriptions-item label="资金类型">{{ detailData.name || detailData.assetTypeDesc }}</a-descriptions-item>
			<a-descriptions-item label="开立日">{{ detailData.planPayDate }}</a-descriptions-item>
			<a-descriptions-item label="出资机构">{{ detailData.bankName }}</a-descriptions-item>
			<a-descriptions-item label="放款类型">{{ detailData.loanTypeText || detailData.loanTypeDesc }}</a-descriptions-item>
			<a-descriptions-item label="承诺付款日期">{{ detailData.promisePayDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="融资说明">{{ detailData.remark || '-' }}</a-descriptions-item>
		</a-descriptions>
		<div
			class="slTitleThird"
			v-if="detailData.acctNo"
		>
			银行账户信息
		</div>
		<div
			class="bank-account-box"
			v-if="detailData.acctNo"
		>
			<a-row type="flex">
				<a-col
					class="bank-account-item first"
					v-if="detailData.acctNo"
				>
					<p class="bank-account-title">
						<img
							src="@sub/assets/buyer_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">回款账号</span>
					</p>

					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账号：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverflow
								v-if="detailData.acctNo"
								:content="formatAccountNumber(detailData.acctNo)"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户行：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverflow
								v-if="detailData.acctBankBranch"
								:content="detailData.acctBankBranch"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户名：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverflow
								v-if="detailData.acctBankName"
								:content="detailData.acctBankName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
		</div>
		<div
			class="slTitleAssis"
			style="margin-bottom: 20px"
		>
			资产信息
		</div>

		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="预付账款流水号">
				<a
					href="javascript:;"
					v-if="type == 'rest'"
					@click="openAssets"
					>{{ detailData.receivableSerialNo }}</a
				>
				<a
					href="javascript:;"
					v-else
					@click="openAdminAssets"
					>{{ detailData.receivableSerialNo }}</a
				>

				<span
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					v-clipboard:copy="detailData.receivableSerialNo"
				>
					<Copy class="cur"></Copy>
				</span>
			</a-descriptions-item>
			<!-- <a-descriptions-item label="合同编号">
        <a href="javascript:;" @click="goContract">{{detailData.contractNo}}</a>
        <span
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          v-clipboard:copy="detailData.contractNo"
        >
          <Copy  class="cur" ></Copy>
        </span>
      </a-descriptions-item> -->
			<a-descriptions-item label="预付账款金额">￥{{ formatMoney(detailData.receivableAmount) || '-' }}</a-descriptions-item>
			<a-descriptions-item label="拟融资金额"> ￥{{ formatMoney(detailData.planFinancingAmount) }} </a-descriptions-item>

			<a-descriptions-item label="合同编号"> {{ detailData.contractNo }} </a-descriptions-item>

			<!-- <a-descriptions-item label="应收账款到期日">{{ detailData.endDate }}</a-descriptions-item> -->
			<a-descriptions-item label="买方名称">{{ detailData.buyerName }} </a-descriptions-item>
			<a-descriptions-item label="卖方名称">{{ detailData.sellerName || '-' }}</a-descriptions-item>
		</a-descriptions>

		<div
			class="file-box"
			v-if="detailData.contractList && detailData.contractList.length"
		>
			<div class="slTitleAssis">融资协议</div>
			<a-button
				type="primary"
				class="btn"
				ghost
				@click="downAll"
			>
				一键下载
			</a-button>
		</div>

		<a-row v-if="detailData.contractList && detailData.contractList.length">
			<a-table
				rowKey="name"
				class="new-table"
				:columns="fileColumns"
				:dataSource="detailData.contractList"
				:pagination="false"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
				<div
					slot="statusText"
					slot-scope="text"
				>
					<span class="status">{{ text }}</span>
				</div>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<a
							href="javascript:;"
							@click="viewPDF(record)"
							>查看</a
						>
						<a
							href="javascript:;"
							style="margin-left: 24px"
							@click="downPDF(record)"
							>下载</a
						>
					</a-space>
				</div>
			</a-table>
		</a-row>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import TextOverflow from '@sub/components/TextOverflow.vue';
import { formatAccountNumber } from '@sub/utils/factory.js';
import { Copy } from '@sub/components/svg/index';

const fileColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: '20%',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '合同名称',
		dataIndex: 'name',
		width: '35%'
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		scopedSlots: { customRender: 'statusText' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 160
	}
];
const costColumns = [
	{ title: '费用明细', dataIndex: 'feeTypeText' },
	{ title: '计息方式', dataIndex: 'feeModeText' },
	{ title: '费率(%)', dataIndex: 'rate', customRender: t => `${t}%` },
	{ title: '收取方式', dataIndex: 'collectionMethodText' },
	{ title: '是否按日计息', dataIndex: 'incomeByDayText', customRender: t => t || '-' }
];
export default {
	props: {
		handType: {
			default: 'detail'
		},
		detailData: {
			default: () => {
				return { feeList: [], contractList: [] };
			}
		},
		operatorInfo: {
			default: () => {
				return {};
			}
		},
		type: {
			default: 'rest'
		}
	},
	components: {
		TextOverflow,
		Copy
	},
	computed: {
		bankUscc() {
			return this.$route.query.bankUscc || this.detailData.bankUscc;
		},
		amountLabel() {
			return '拟融资金额';
		}
	},
	data() {
		return {
			fileColumns,
			costColumns
		};
	},
	methods: {
		formatMoney,
		formatAccountNumber,
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},
		openAssets() {
			let record = this.detailData;
			const { href } = this.$router.resolve({
				path: '/center/assets/advance/detail',
				query: {
					id: record.assetId,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		openAdminAssets() {
			let record = this.detailData;
			const { href } = this.$router.resolve({
				path: '/assets/AdvanceAuditRecord',
				query: {
					id: record.receivableId,
					activeIndex: '0'
				}
			});
			window.open(href, '_new');
			// this.$router.push({
			//     path: '/assets/AdvanceAuditRecord',
			//     query: {
			//         id: record.receivableId,
			//     },
			// })
		},
		downAll() {
			this.$emit('downAll');
		},
		downPDF(item) {
			this.$emit('downPDF', item);
		},
		// 去往合同详情
		goContract() {
			let path = `/center/contract/${this.detailData.orderType.toLowerCase()}/online/detail?id=${this.contractInfo.id}&type=${this.detailData.orderType}`;
			if (this.type == 'rest') {
				if (this.contractInfo.paperContractNo) {
					path = `/center/contract/${this.detailData.orderType.toLowerCase()}/offline/detail?id=${this.contractInfo.icontractId}&type=${this.detailData.orderType.toLowerCase()}`;
				}
			} else {
				path = `/sys/contract/online/detail?id=${this.contractInfo.contractId}`;
				if (this.contractInfo.paperContractNo) {
					path = `/sys/contract/offline/detail?id=${this.contractInfo.contractId}&contractNo=${this.contractInfo.contractNo}`;
				}
			}

			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		},

		viewPDF(item) {
			this.$emit('viewPDF', item);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: 19%;
	}
}
.trade {
	/deep/ .ant-descriptions-item-content {
		width: 40%;
	}
}
.bank-account-box {
	margin-top: 10px;
	::v-deep.ant-row-flex {
		flex-wrap: nowrap !important;
	}
	::v-deep.textOverflow {
		left: 0;
	}
	.bank-account-item {
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		border-radius: 6px;
		margin-right: 50px;
		line-height: 24px;
		width: 350px;
		.bank-account-title {
			margin-bottom: 10px;
			line-height: 22px;
		}
		.bank-account-icon {
			width: 30px;
			height: 22px;
			vertical-align: top;
		}
		::v-deep.ant-col {
			.label {
				color: rgba(0, 0, 0, 0.4);
			}
		}
		.title {
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #77889d;
			margin-left: 10px;
		}
	}
	.bank-account-item.first {
		background: #f0f8ff;
	}
	.bank-account-item.second {
		background: #fff9e9;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	// margin-left: 4px;
	background: #ffdbc8;
	color: #ff7937;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.new-table {
	/deep/ tbody {
		tr td:last-child {
			border-left: 1px solid #e5e6eb;
		}
	}
}
.cost-table {
	/deep/ .ant-table-thead {
		tr th {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb;
		}
		tr th:first-child {
			background: #f3f5f6;
			border-left: 0;
		}
	}
	/deep/ tbody {
		tr td {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb !important;
		}
		tr td:first-child {
			border-left: 0;
			background: #f3f5f6;
		}
		tr:last-child td {
			// border-bottom: 0 !important;
		}
		tr:nth-child(2n) {
			background: #fff !important;
		}
	}
}
.file-box {
	display: flex;
	margin-bottom: 20px;
	margin-top: 30px;
	align-items: center;
	.slTitleAssis {
		margin-top: 0;
		margin-right: 20px;
	}
	.btn {
		height: 28px;
		width: 88px;
	}
}
</style>
