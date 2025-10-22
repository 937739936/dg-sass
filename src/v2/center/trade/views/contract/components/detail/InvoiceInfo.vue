<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="20"
		>
			<a-col span="21">
				<div class="title-data-box">
					<div class="title-data-btn">
						<span class="slTitleAssis">发票统计</span>
						<a-space :size="30">
							<a-button
								type="primary"
								@click="exportAllFiles"
								:disabled="
									detail &&
									detail.tradeInvoiceList &&
									detail.deliverInvoiceList &&
									!detail.tradeInvoiceList.length &&
									!detail.deliverInvoiceList.length
								"
								>导出全部发票附件</a-button
							>
							<a-button
								type="primary"
								ghost
								@click="exportAllExcel"
								:disabled="
									detail &&
									detail.tradeInvoiceList &&
									detail.deliverInvoiceList &&
									!detail.tradeInvoiceList.length &&
									!detail.deliverInvoiceList.length
								"
								>导出全部发票Excel</a-button
							>
						</a-space>
					</div>
					<a-row
						type="flex"
						v-if="detail.invoiceStatisticVO"
					>
						<a-col>
							<p>发票数量/张</p>
							<span>{{ detail.invoiceStatisticVO.invoiceCount | formatMoney(2) }}张</span>
						</a-col>
						<a-col>
							<p>发票金额合计（不含税）/元</p>
							<span>{{ detail.invoiceStatisticVO.invoicedTaxExcludedAmount | formatMoney(2) }}元</span>
						</a-col>
						<a-col>
							<p>价税合计（含税）/元</p>
							<span>{{ detail.invoiceStatisticVO.invoicedTotalAmount | formatMoney(2) }}元 </span>
						</a-col>
						<a-col>
							<p>拆分至该合同金额（含税）/元</p>
							<span>{{ detail.invoiceStatisticVO.currentInvoiceAmount | formatMoney(2) }}元 </span>
						</a-col>
					</a-row>
				</div>
				<div id="trade">
					<div class="slTitleAssis">贸易发票</div>
					<div class="table-box">
						<a-table
							:columns="tradeColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.tradeInvoiceList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="taxExcludedAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="taxAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="totalAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="splitAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a @click="viewDetail(items, type === 'SELL' ? 'OUTPUT' : 'INPUT')">详情</a>
							</template>
						</a-table>
					</div>
				</div>
				<div id="transType">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">运费发票</div>
						</a-col>
					</a-row>
					<div class="table-box">
						<a-table
							:columns="transTypeColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.deliverInvoiceList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="taxExcludedAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="taxAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="totalAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="stampTaxFlagAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="stampTaxFlagTotalAmount"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span> </template
							>]
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a @click="viewDetail(items, 'DELIVER')">详情</a>
							</template>
						</a-table>
					</div>
				</div>
			</a-col>
			<a-col span="3">
				<div class="anchorPointBox">
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#trade'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#trade' ? 'blue' : ''"
							@click.stop="goAnchor('#trade')"
						>
							<em class="dot"></em>
							贸易发票
						</p>
					</div>
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#transType'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#transType' ? 'blue' : ''"
							@click.stop="goAnchor('#transType')"
						>
							<em class="dot"></em>
							运费发票
						</p>
					</div>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
const tradeColumns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额（元）', dataIndex: 'taxExcludedAmount', scopedSlots: { customRender: 'taxExcludedAmount' } },
	{ title: '税额（元）', dataIndex: 'taxAmount', scopedSlots: { customRender: 'taxAmount' } },
	{ title: '价税合计（元）', dataIndex: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
	{ title: '拆分到本合同金额（元）', dataIndex: 'splitAmount', scopedSlots: { customRender: 'splitAmount' } },
	{ title: '销售方', dataIndex: 'sellerName' },
	{ title: '购买方', dataIndex: 'buyerName' },
	{ title: '发票状态', dataIndex: 'stateDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 80, fixed: 'right' }
];
const transTypeColumns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额（元）', dataIndex: 'taxExcludedAmount', scopedSlots: { customRender: 'taxExcludedAmount' } },
	{ title: '税额（元）', dataIndex: 'taxAmount', scopedSlots: { customRender: 'taxAmount' } },
	{ title: '价税合计（元）', dataIndex: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
	{
		title: '是否包含印花税',
		dataIndex: 'stampTaxFlag',
		customRender: text => {
			return text == 2 ? '是' : '否';
		}
	},
	{ title: '印花税税额（元）', dataIndex: 'stampTaxFlagAmount', scopedSlots: { customRender: 'stampTaxFlagAmount' } },
	{ title: '含印花税合计（元）', dataIndex: 'stampTaxFlagTotalAmount', scopedSlots: { customRender: 'stampTaxFlagTotalAmount' } },
	{ title: '销售方', dataIndex: 'sellerName' },
	{ title: '购买方', dataIndex: 'buyerName' },
	{ title: '发票状态', dataIndex: 'stateDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 80, fixed: 'right' }
];
import { API_getOrderInvoiceInfoResp, API_DownloadFiles, API_DownloadExcel } from '@/v2/center/trade/api/contract';
import comDownload from '@sub/utils/comDownload.js';
import { AnchorIcon } from '@sub/components/svg';
const pathCoalInfo = {
	INPUT: {
		detail: '/center/invoice/buy/detail',
		list: '/center/invoice/buy/list'
	},
	OUTPUT: {
		detail: '/center/invoice/sell/detail',
		list: '/center/invoice/sell/list'
	},
	DELIVER: {
		detail: '/center/invoice/freight/detail',
		list: '/center/invoice/freight/list'
	}
};
export default {
	data() {
		return {
			tradeColumns,
			transTypeColumns,
			detail: {},
			anchor: '#trade',
			pathCoalInfo
		};
	},
	props: ['data', 'type'],
	components: {
		AnchorIcon
	},
	methods: {
		init() {
			API_getOrderInvoiceInfoResp({ orderId: this.data.contract.id }).then(res => {
				if (res.success) {
					this.detail = res.data;
				}
			});
		},
		viewDetail(items, type) {
			let routerData = this.$router.resolve({
				path: this.pathCoalInfo[type].detail,
				query: {
					id: items.id,
					no: items.no,
					type: 'detail',
					invoiceType: type,
					industryType: 'COAL'
				}
			});
			window.open(routerData.href, '_blank');
		},
		goAnchor(selector) {
			/*参数selector是id选择器（#anchor14）*/
			this.anchor = selector;
			this.$nextTick(() => {
				setTimeout(() => {
					document.querySelector(selector).scrollIntoView({
						behavior: 'smooth'
					});
				});
			});
		},
		exportAllFiles() {
			const name =
				'发票附件-' +
				this.data.contract.sellerCompanyName +
				'-' +
				this.data.contract.buyerCompanyName +
				'-' +
				this.data.contract.contractNo +
				'.zip';
			API_DownloadFiles({
				orderId: this.data.contract.id
			})
				.then(res => {
					comDownload(res, undefined, name);
				})
				.finally(() => {});
		},
		exportAllExcel() {
			const name =
				'发票信息-' +
				this.data.contract.sellerCompanyName +
				'-' +
				this.data.contract.buyerCompanyName +
				'-' +
				this.data.contract.contractNo +
				'.xls';
			API_DownloadExcel({
				orderId: this.data.contract.id
			})
				.then(res => {
					comDownload(res, undefined, name);
				})
				.finally(() => {});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.title-data-box {
	.title-data-btn {
		.slTitleAssis {
			display: inline-block;
			margin-right: 30px;
			margin-bottom: 30px;
		}
		::v-deep.ant-space {
			position: relative;
			top: -2px;
		}
	}
	.ant-row-flex {
		justify-content: space-between;
		.ant-col {
			height: 100px;
			width: 24%;
			background: #f0f8ff;
			border-radius: 6px;
			padding: 20px;
			span {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 20px;
				line-height: 28px;
				color: rgba(0, 0, 0, 0.8);
			}
			p {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 14px;
				line-height: 20px;
				color: rgba(0, 0, 0, 0.4);
				margin-bottom: 11px;
			}
		}
		.ant-col:nth-child(2),
		.ant-col:nth-child(4) {
			background: #fff9e9;
		}
		.ant-col:nth-child(4) {
			margin-right: 0px;
		}
	}
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.anchorPointBox {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #77889d;
	line-height: 20px;
	margin: 27px 0;
	border-left: 1px solid #e9effc;
	cursor: pointer;
	.anchorPointItem {
		height: 48px;
		padding-left: 20px;
		position: relative;
		line-height: 20px;
		.anchorPointIcon {
			width: 8px;
			height: 12px;
			position: absolute;
			left: 0;
			top: 4px;
		}
	}
	.blue {
		color: @primary-color;
		.dot {
			background-color: @primary-color;
		}
	}
	.dot {
		display: inline-block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #77889d;
		margin-right: 3px;
		position: relative;
		top: -2px;
	}
}
.mt32 {
	margin-top: 32px;
}
::v-deep.ant-btn {
	line-height: 30px;
}
::v-deep.ant-btn-background-ghost.ant-btn-primary[disabled] {
	background-color: #f5f5f5 !important;
	color: rgba(0, 0, 0, 0.25) !important;
	border-color: #d9d9d9 !important;
}
</style>
