<template>
	<div style="width: 100%">
		<div
			class="slTitleAssis"
			style="margin-bottom: 20px"
		>
			融资信息
		</div>

		<!-- 华能云成商业保理 -->
		<!-- 91120118MA06DFA24M -->
		<!-- v-if="bankUscc == '91120118MA06DFA24M'" -->
		<a-descriptions
			bordered
			:column="3"
			size="middle"
			v-if="bankUscc == '91120118MA06DFA24M'"
		>
			<a-descriptions-item label="拟融资金额">
				<span style="color: #f46332">￥{{ formatMoney(detailData.planFinancingAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="放款金额"
				v-if="detailData.finAmount"
			>
				<span style="color: #f46332">￥{{ formatMoney(detailData.finAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资利率">
				<span style="color: #f46332">{{ detailData.rate }}%</span>
			</a-descriptions-item>
			<a-descriptions-item label="资金类型">{{ detailData.name }} </a-descriptions-item>
			<a-descriptions-item label="出资机构"> {{ detailData.bankName }} </a-descriptions-item>
			<a-descriptions-item label="逾期利率">{{ detailData.overdueRate }} %</a-descriptions-item>
			<a-descriptions-item label="预计融资起息日期">{{ detailData.applyBeginDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="可提前还款日期">{{ detailData.prepaymentDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="计息规则">{{ detailData.incomeRuleTypeText || '-' }}</a-descriptions-item>
			<a-descriptions-item label="预计融资到期日期">{{ detailData.applyEndDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="利息收取方式">{{ detailData.incomeChargeTypeText || '-' }}</a-descriptions-item>

			<a-descriptions-item label="融资说明">{{ detailData.remark || '-' }}</a-descriptions-item>
		</a-descriptions>

		<!-- 中航租赁 -->
		<!-- 91120118MA07GD9T0P -->
		<a-descriptions
			bordered
			:column="3"
			size="middle"
			v-else-if="bankUscc == '91120118MA07GD9T0P'"
		>
			<a-descriptions-item label="拟融资金额">
				<span style="color: #f46332">￥{{ formatMoney(detailData.planFinancingAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="放款金额"
				v-if="detailData.finAmount"
			>
				<span style="color: #f46332">￥{{ formatMoney(detailData.finAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资利率">
				<span style="color: #f46332">{{ detailData.rate }}%</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资比例"> {{ detailData.financingRatio }}% </a-descriptions-item>
			<a-descriptions-item label="逾期日利率">{{ detailData.overdueRate }}%</a-descriptions-item>
			<a-descriptions-item label="线下主合同编号">{{ detailData.offlineContractNo || '-' }}</a-descriptions-item>
			<a-descriptions-item label="线下主合同签订日">{{ detailData.offlineSignDate || '-' }}</a-descriptions-item>
			<a-descriptions-item label="融资方">{{ detailData.financier }} </a-descriptions-item>
			<a-descriptions-item label="融资说明">{{ detailData.remark || '-' }}</a-descriptions-item>
		</a-descriptions>
		<!-- 华夏银行 -->
		<!-- 91410000594878354X -->
		<a-descriptions
			bordered
			:column="3"
			size="middle"
			v-else-if="bankUscc == '91410000594878354X'"
		>
			<a-descriptions-item label="拟融资金额">
				<span style="color: #f46332">￥{{ formatMoney(detailData.planFinancingAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="放款金额"
				v-if="detailData.finAmount"
			>
				<span style="color: #f46332">￥{{ formatMoney(detailData.finAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资利率">
				<span style="color: #f46332">{{ detailData.rate }}%</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资比例"> {{ detailData.financingRatio }}% </a-descriptions-item>
			<a-descriptions-item label="逾期日利率">{{ detailData.overdueRate }}%</a-descriptions-item>
			<a-descriptions-item label="融资方">{{ detailData.financier }} </a-descriptions-item>

			<a-descriptions-item label="融资说明">{{ detailData.remark || '-' }}</a-descriptions-item>
		</a-descriptions>

		<!-- 万物易联保理 -->
		<!-- 91654004MACNA8B65D -->
		<!-- 其他 -->
		<!-- 上海银行 -->
		<a-descriptions
			bordered
			:column="3"
			size="middle"
			v-else
		>
			<a-descriptions-item label="拟融资金额">
				<span style="color: #f46332">￥{{ formatMoney(detailData.planFinancingAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item
				label="放款金额"
				v-if="detailData.finAmount"
			>
				<span style="color: #f46332">￥{{ formatMoney(detailData.finAmount) }}</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资利率">
				<span style="color: #f46332">{{ detailData.rate }}%</span>
			</a-descriptions-item>
			<a-descriptions-item label="融资比例">{{ detailData.financingRatio }}%</a-descriptions-item>
			<a-descriptions-item label="融资方">
				{{ detailData.financier }}
			</a-descriptions-item>
			<a-descriptions-item label="逾期日利率">{{ detailData.overdueRate }}%</a-descriptions-item>
			<a-descriptions-item
				v-if="detailData.postponement !== undefined && detailData.postponement !== null"
				label="是否出具《延期情况说明》"
			>
				{{ detailData.postponement == 0 ? '否' : '是' }}
			</a-descriptions-item>
			<a-descriptions-item
				label="利息支付方式"
				v-if="detailData.interestPayType"
				>{{ detailData.interestPayType }}</a-descriptions-item
			>
			<template v-if="bankUscc === '91654004MACNA8B65D' && detailData.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
				<a-descriptions-item label="资金监管账号">{{ detailData.fundNo || '-' }}</a-descriptions-item>
				<a-descriptions-item label="资金监管账号开户名">{{ detailData.fundBankName || '-' }}</a-descriptions-item>
				<a-descriptions-item label="资金监管账号开户行">{{ detailData.fundBankBranch || '-' }}</a-descriptions-item>
			</template>
			<a-descriptions-item
				label="麦数审批人"
				v-if="operatorInfo.operatorName"
			>
				{{ operatorInfo.operatorName }} - {{ operatorInfo.operatorMobile }}</a-descriptions-item
			>
			<a-descriptions-item
				label="融资说明"
				v-if="detailData.remark"
				>{{ detailData.remark || '-' }}</a-descriptions-item
			>
		</a-descriptions>

		<template v-if="detailData.feeList && detailData.feeList.length">
			<div class="slTitleThird">费用明细</div>
			<a-table
				rowKey="name"
				class="new-table cost-table"
				style="margin-top: 20px"
				:columns="costColumns"
				:dataSource="detailData.feeList"
				:pagination="false"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
		</template>

		<div
			class="slTitleThird"
			v-if="detailData.loanNo || detailData.acctNo"
		>
			银行账户信息
		</div>
		<div
			class="bank-account-box"
			v-if="detailData.loanNo || detailData.acctNo"
		>
			<a-row type="flex">
				<a-col
					class="bank-account-item first"
					v-if="detailData.loanNo"
				>
					<p class="bank-account-title">
						<img
							src="@sub/assets/buyer_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">{{ bankInfo.firstName }}</span>
					</p>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账号：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverflow
								v-if="detailData.loanNo"
								:content="formatAccountNumber(detailData.loanNo)"
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
								v-if="detailData.loanBankBranch"
								:content="detailData.loanBankBranch"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户名：</span>
						</a-col>
						<a-col flex="1">
							<TextOverflow
								v-if="detailData.loanBankName"
								:content="detailData.loanBankName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
				</a-col>
				<a-col
					class="bank-account-item second"
					v-if="detailData.acctNo"
				>
					<p class="bank-account-title">
						<img
							src="@sub/assets/seller_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">{{ bankInfo.secondName }}</span>
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
				<!-- 只有华能云成有 -->
				<a-col
					class="bank-account-item first"
					v-if="detailData.fundNo"
				>
					<p class="bank-account-title">
						<img
							src="@sub/assets/buyer_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">资金监管账号</span>
					</p>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账号：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverflow
								v-if="detailData.fundNo"
								:content="formatAccountNumber(detailData.fundNo)"
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
								v-if="detailData.fundBankBranch"
								:content="detailData.fundBankBranch"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户名：</span>
						</a-col>
						<a-col flex="1">
							<TextOverflow
								v-if="detailData.fundBankName"
								:content="detailData.fundBankName"
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
			:column="2"
			size="middle"
			class="trade"
		>
			<a-descriptions-item label="应收账款流水号">
				<a
					href="javascript:;"
					@click="openAssets"
					v-if="type == 'rest'"
					>{{ detailData.receivableSerialNo }}</a
				>
				<a
					href="javascript:;"
					@click="openAdminAssets"
					v-else
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
			<a-descriptions-item label="合同编号">
				<a
					v-if="!isBank"
					href="javascript:;"
					@click="goContract"
					>{{ detailData.contractNo }}</a
				>
				<span v-else> {{ detailData.contractNo }}</span>
				<span
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
					v-clipboard:copy="detailData.contractNo"
				>
					<Copy class="cur"></Copy>
				</span>
			</a-descriptions-item>
			<a-descriptions-item label="应收账款起始日"> {{ detailData.beginDate }} </a-descriptions-item>
			<a-descriptions-item label="应收账款到期日">{{ detailData.endDate }}</a-descriptions-item>
			<a-descriptions-item label="买方名称">{{ detailData.buyerName }} </a-descriptions-item>
			<a-descriptions-item label="卖方名称">{{ detailData.sellerName || '-' }}</a-descriptions-item>
			<a-descriptions-item label="应收账款金额">￥{{ formatMoney(detailData.receivableAmount) || '-' }}</a-descriptions-item>
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

const info = {
	// 华能云成商业保理
	'91120118MA06DFA24M': {
		firstName: '融资收款账号',
		secondName: '资金方收款账号'
	},
	// 华夏银行
	'91410000594878354X': {
		firstName: '放款账号',
		secondName: '融资还款账号'
	},
	// 万物
	'91654004MACNA8B65D': {
		firstName: '放款账号',
		secondName: '资金方收款账号'
	},
	// 中航
	'91120118MA07GD9T0P': {
		firstName: '放款账号',
		secondName: '回款账号'
	}
};
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
		width: 160,
		scopedSlots: { customRender: 'action' }
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
		// 银行账户信息
		bankInfo() {
			return (
				info[this.bankUscc] || {
					firstName: '放款账号',
					secondName: '融资还款账号'
				}
			);
		},
		amountLabel() {
			return '拟融资金额';
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		//    ...mapGetters("user", {
		//   VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
		// }),
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
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
			let path = '/center/assets/receivable/detail';
			if (this.isBank) {
				path = '/center/assets/receivable/JR/detail';
			}
			let activeIndex = 0;
			if (this.detailData.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL') {
				// 补录资产
				path = '/center/assets/receivable/manual/detail';
			} else if (this.detailData.assetType === 'ACCOUNTS_RECEIVABLE_MODIFY') {
				// 变更资产
				// 判断核心企业还是金融机构,不同的页面
				if (this.isBank) {
					path = '/center/assets/receivable/change/detailJR';
				} else {
					path = '/center/assets/payable/change/detail';
				}
				activeIndex = 2;
			}
			const { href } = this.$router.resolve({
				path,
				query: {
					id: this.detailData.assetId,
					activeIndex
				}
			});
			window.open(href, '_new');
		},
		openAdminAssets() {
			let record = this.detailData;

			if (record.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL') {
				this.$router.push('/assets/AssetsManualAudit?id=' + record.receivableId);
			} else {
				if (record.originalId) {
					this.$router.push('/assets/AccountsPayableChangeDetail?id=' + record.receivableId);
				} else {
					this.$router.push('/assets/AssetsAuditRecord?id=' + record.receivableId);
				}
			}
		},
		downAll() {
			this.$emit('downAll');
		},
		downPDF(item) {
			this.$emit('downPDF', item);
		},
		// 去往合同详情
		goContract() {
			let path;
			if (this.type == 'rest') {
				path = `/center/contract/${this.detailData.orderType.toLowerCase()}/online/detail?id=${this.detailData.contractId}&type=${this.detailData.orderType}`;
				if (this.detailData.contractType == 'DOWN') {
					path = `/center/contract/${this.detailData.orderType.toLowerCase()}/offline/detail?id=${this.detailData.contractId}&type=${this.detailData.orderType.toLowerCase()}`;
				}
			} else {
				path = `/sys/contract/online/detail?id=${this.detailData.contractId}`;
				if (this.detailData.contractType == 'DOWN') {
					path = `/sys/contract/offline/detail?id=${this.detailData.contractId}&contractNo=${this.detailData.contractNo}`;
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
			color: #77889d;
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
