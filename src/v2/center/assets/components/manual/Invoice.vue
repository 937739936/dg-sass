<template>
	<div class="contentBox">
		<div class="content invo-tabs">
			<p class="sub-title">
				<span style="display: inline-block; margin-right: 30px">下游发票信息</span
				><span style="font-size: 13px; color: red"
					>发票总数（张）：{{ icount }}<em style="display: inline-block; width: 25px"></em>价税合计（元）：{{ itotal
					}}<em style="display: inline-block; width: 25px"></em>归属价税合计（元）：{{ isplit }}</span
				>
			</p>
			<div
				style="text-align: right; margin-bottom: 10px"
				v-if="editFlag"
			>
				<a-space>
					<a-button
						ghost
						type="primary"
						@click="addInvo('addSell?type=sell&contractType=DOWN&contractNo=')"
						>新增贸易发票</a-button
					>
					<a-button
						v-if="!isPool"
						ghost
						type="primary"
						@click="addInvo('addFreight?type=freight&contractType=DOWN&contractNo=')"
						>新增运费发票</a-button
					>
				</a-space>
			</div>
			<a-tabs defaultActiveKey="a">
				<a-tab-pane
					key="a"
					tab="贸易发票"
					style="flex-direction: column"
					class="first-key"
				>
					<a-table
						:pagination="false"
						:columns="tradeInvoiceColumns"
						:data-source="tradeInvoiceList"
						:scroll="{ x: true }"
						rowKey="index"
					>
						<div
							slot="action"
							slot-scope="action, items, index"
						>
							<a
								href="javascript:;"
								@click="getResult(items)"
								style="margin-right: 8px"
								>查验结果</a
							>
							<a-popconfirm
								v-if="editFlag"
								title="确定删除?"
								okText="确定"
								cancelText="取消"
								@confirm="() => deleteIn(items, index, tradeInvoiceList)"
							>
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</div>
					</a-table>
				</a-tab-pane>
				<a-tab-pane
					key="b"
					tab="运费发票"
					style="flex-direction: column"
					v-if="!isPool"
				>
					<a-table
						:pagination="false"
						:columns="freightInvoiceColumns"
						:data-source="transInvoiceList"
						:scroll="{ x: true }"
						rowKey="index"
					>
						<div
							slot="action"
							slot-scope="action, items, index"
						>
							<a
								href="javascript:;"
								style="margin-right: 8px"
								@click="getResult(items)"
								>查验结果</a
							>
							<a-popconfirm
								v-if="editFlag"
								title="确定删除?"
								okText="确定"
								cancelText="取消"
								@confirm="() => deleteIn(items, index, transInvoiceList)"
							>
								<a href="javascript:;">删除</a>
							</a-popconfirm>
						</div>
					</a-table>
				</a-tab-pane>
			</a-tabs>
			<Attachment
				:list="invoiceInfo.upInvoiceDetailList"
				v-if="invoiceInfo.upInvoiceDetailList"
			></Attachment>
		</div>
		<a-modal
			:visible="visible"
			:footer="null"
			@cancel="
				() => {
					visible = false;
				}
			"
			width="80%"
		>
			<div
				class="modalContent"
				v-if="invoiceResult"
			>
				<p>{{ invoiceResult.administrativeDivisionName }}增值税专用发票</p>
				<div>
					<p>
						发票代码：<span>{{ invoiceResult.code }}</span>
					</p>
					<p>
						发票号码：<span>{{ invoiceResult.no }}</span>
					</p>
					<p>
						开票日期：<span>{{ invoiceResult.issuedDate }}</span>
					</p>
					<p>
						校验码：<span>{{ invoiceResult.checkCode }}</span>
					</p>
					<p>
						机器编号：<span>{{ invoiceResult.machineCode }}</span>
					</p>
				</div>
				<table
					cellspacing="0"
					cellpadding="0"
					class="modalTable"
					style="margin-bottom: 20px"
					:scroll="{ x: true }"
				>
					<tr>
						<td colspan="1">购买方</td>
						<td
							colspan="11"
							class="left"
						>
							<p><span>名称：</span>{{ invoiceResult.buyerName }}</p>
							<p><span>纳税人识别号：</span>{{ invoiceResult.buyerUscc }}</p>
							<p><span>地址、电话：</span>{{ invoiceResult.purchaserAddressPhone }}</p>
							<p><span>开户行及账号：</span>{{ invoiceResult.purchaserBank }}</p>
						</td>
						<td colspan="1">密码区</td>
						<td colspan="7"></td>
					</tr>
					<tr>
						<td colspan="5">
							<p>货物或应税劳务、服务名称</p>
						</td>
						<td colspan="2">
							<p>规格型号</p>
						</td>
						<td colspan="1">
							<p>单位</p>
						</td>
						<td colspan="2">
							<p>数量</p>
						</td>
						<td colspan="3">
							<p>单价</p>
						</td>
						<td colspan="3">
							<p>金额</p>
						</td>
						<td colspan="1">
							<p>税率</p>
						</td>
						<td colspan="3">
							<p>税额</p>
						</td>
					</tr>
					<tr
						v-for="(item, index) in invoiceResult.invoiceItemList"
						:key="index"
					>
						<td colspan="5">
							<p class="blue">{{ item.name }}</p>
						</td>
						<td colspan="2">
							<p class="blue">{{ item.spec }}</p>
						</td>
						<td colspan="1">
							<p class="blue">{{ item.unit }}</p>
						</td>
						<td colspan="2">
							<p class="blue">{{ item.quantity }}</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.unitPrice }}</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.amount }}</p>
						</td>
						<td colspan="1">
							<p class="blue">{{ item.taxRate * 100 }}%</p>
						</td>
						<td colspan="3">
							<p class="blue">{{ item.tax }}</p>
						</td>
					</tr>
					<tr>
						<td colspan="5">价税合计（大写）</td>
						<td
							colspan="6"
							style="border-right: 1px solid transparent"
						>
							<p
								class="blue"
								style="text-align: left; margin-left: 15px; margin-bottom: 0"
							>
								{{ invoiceResult.amountTaxCn }}
							</p>
						</td>
						<td colspan="9">
							（小写）<span
								class="blue"
								style="display: inline-block; margin-left: 20px"
								>¥{{ invoiceResult.amountTax }}</span
							>
						</td>
					</tr>
					<tr>
						<td colspan="1">销售方</td>
						<td
							colspan="9"
							class="left"
						>
							<p><span>名称：</span>{{ invoiceResult.sellerName }}</p>
							<p><span>纳税人识别号：</span>{{ invoiceResult.sellerUscc }}</p>
							<p><span>地址、电话：</span>{{ invoiceResult.salesAddressPhone }}</p>
							<p><span>开户行及账号：</span>{{ invoiceResult.salesBank }}</p>
						</td>
						<td colspan="1">备注</td>
						<td colspan="9">
							<p class="blue">{{ invoiceResult.remarks }}</p>
						</td>
					</tr>
				</table>
				<a
					href="https://etax.jiangxi.chinatax.gov.cn/fpcx/"
					style="display: block; text-align: center; text-decoration: underline"
					target="_blank"
					>本数据来源于中国国家税务局发票验证系统</a
				>
			</div>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '卖方名称', dataIndex: 'sellerName' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额(元)', dataIndex: 'taxExcludedAmount' },
	{ title: '税额(元)', dataIndex: 'taxAmount', align: 'center' },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', customRender: text => text && text.toLocaleString() }
];
import { API_GetInvoiceResult, API_InvoiceDelete } from '@/v2/center/assets/api/index.js';
import { Empty } from 'ant-design-vue';
import Attachment from '../Attachment.vue';
// import _ from 'lodash';
export default {
	name: 'Invoice',
	props: ['invoiceInfo', 'editFlag', 'lineId', 'contractInfo', 'isDai', 'isPool'],
	components: {
		Attachment
	},
	watch: {
		invoiceInfo: {
			immediate: true,
			handler() {
				this.dealEditData();
			}
		}
	},
	data() {
		return {
			tradeInvoiceColumns: [
				...columns,
				{ title: '拆分到本合同金额(元)', dataIndex: 'currentContractSplitedAmount' },
				{ title: '发票状态', dataIndex: 'statusName' },
				{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
			],
			freightInvoiceColumns: [
				...columns,
				{ title: '是否包含印花税(元)', dataIndex: 'stampTaxFlag', align: 'center', customRender: text => ['否', '是'][text - 1] },
				{ title: '印花税税额(元)', dataIndex: 'stampTaxFlagAmount', align: 'center' },
				{ title: '含印花税合计(元)', align: 'center', dataIndex: 'stampTaxFlagTotalAmount' },
				{ title: '发票状态', dataIndex: 'statusName' },
				{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
			],

			visible: false,
			invoiceResult: '',
			icount: '0',
			itotal: '0',
			isplit: '0',
			otherInvoList: [],
			transInvoiceList: [],
			tradeInvoiceList: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
		};
	},
	methods: {
		get_id() {
			return Date.now() + '_' + Math.random();
		},
		dealEditData() {
			if (!this.invoiceInfo) return;

			this.transInvoiceList = this.invoiceInfo.transInvoiceList;
			this.tradeInvoiceList = this.invoiceInfo.tradeInvoiceList;
			let list = this.transInvoiceList.concat(this.tradeInvoiceList);
			if (list && list[0]) {
				this.icount = list.length;
				this.itotal = list.reduce((pre, cur) => pre + (cur.totalAmount || 0), 0).toFixed(2);
				this.isplit = list.reduce((pre, cur) => pre + (cur.splitAmount || 0), 0).toFixed(2);
			}
		},

		addInvo(type) {
			if (this.contractInfo && this.contractInfo.contractNo && this.$route.query.id) {
				let path = '';
				if (this.isDai) {
					path = 'accountsReceivableDaiManualDetail';
				} else if (this.isPool) {
					path = 'poolAssetsEdit';
				} else {
					path = 'accountsReceivableManualEdit';
				}
				this.$router.push({
					path: '/center/invoice/' + type + this.contractInfo.paperContractNo,
					query: {
						manuaId: this.$route.query.id,
						ref: path
					}
				});
			} else {
				this.$confirm({
					centered: true,
					title: '提示',
					okText: '确定',
					content: '必须先保存资产才能上传发票，是否保存？',
					cancelText: '取消',
					onOk: () => {
						this.$emit('saveAsset');
					},
					onCancel() {}
				});
			}
		},
		deleteIn(item, _index, list) {
			API_InvoiceDelete({ id: item.id }).then(res => {
				if (res.success) {
					list.splice(_index, 1);
				}
			});
		},

		getResult(items) {
			this.visible = true;
			API_GetInvoiceResult({ invoiceId: items.id }).then(res => {
				if (res.success) {
					this.invoiceResult = res.data;
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;
	.sub-title {
		&:before {
			content: '';
			float: left;
			margin-right: 4px;
			margin-top: 3px;
			display: block;
			width: 4px;
			height: 14px;
			background: @primary-color;
		}
	}
	.content {
		padding: 0 15px;
		p {
			font-family: PingFangSC-Medium;
			color: #383a3f;
			text-align: left;
			line-height: 18px;
			margin-bottom: 15px;
		}
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.green {
		color: #00ae9d !important;
	}
	.orange {
		color: #ff9726 !important;
	}
}
.export-btn {
	text-align: right;
	margin-top: 11px;
}
.modalContent {
	color: #383a3f;
	& > p {
		text-align: center;
		font-size: 18px;
		color: @primary-color;
		margin-bottom: 15px;
	}
	& > div {
		display: flex;
		flex-decoration: row;
		justify-content: space-between;
		margin-bottom: 5px;
		span {
			color: @primary-color;
		}
	}
}
.modalTable {
	width: 100%;
	height: 100%;
	border: 1px solid #000000; /*设置边框粗细，实线，颜色*/
	text-align: center; /*文本居中*/
	border-collapse: collapse; /*边框重叠，否则你会看到双实线*/
	table-layout: fixed;
	th,
	td {
		height: 32px;
		border: 1px solid black;
		color: #000000;
		padding: 10px 6px;
	}
	.left {
		text-align: left;
		p {
			color: @primary-color;
			span {
				display: inline-block;
				width: 110px;
				color: #000000;
			}
		}
	}
	.blue {
		color: @primary-color;
		text-align: left;
	}
}
</style>
