<template>
	<div class="contentBox">
		<div class="content invo-tabs">
			<p class="title">下游发票信息</p>
			<!-- <p class="sub-title"><span style="display: inline-block;margin-right:30px;">
                下游发票信息</span>
            </p> -->
			<div
				style="text-align: right; margin-bottom: 10px"
				v-if="editFlag"
			>
				<a-space>
					<a-button
						ghost
						type="primary"
						@click="addInvo()"
						>关联发票</a-button
					>
					<a-button
						ghost
						type="primary"
						@click="exportInvoice"
						>数据导出</a-button
					>
				</a-space>
			</div>
			<a-table
				:pagination="false"
				:columns="tradeInvoiceColumns"
				:data-source="list"
				:scroll="{ x: true }"
				rowKey="index"
			>
				<template
					slot="fileName"
					slot-scope="fileName, items"
				>
					<a
						:href="items.attachment"
						target="_blank"
						>{{ fileName }}</a
					>
				</template>
				<template
					slot="hasAttach"
					slot-scope="hasAttach"
				>
					<span
						class="green"
						v-if="hasAttach"
						>有</span
					>
					<span
						class="orange"
						v-if="!hasAttach"
						>无</span
					>
				</template>
				<div
					slot="action"
					slot-scope="action, items"
				>
					<a
						href="javascript:;"
						@click="getResult(items)"
						style="margin-right: 8px"
						>查验结果</a
					>
				</div>
			</a-table>
			<div>
				<span style="font-size: 13px"
					>发票总数（张）：{{ list.length }} <em style="display: inline-block; width: 25px"></em>价税合计（元）：{{ itotal }}
					<em style="display: inline-block; width: 25px"></em>归属价税合计（元）：{{ isplit }}</span
				>
			</div>
		</div>
		<Attachment
			ref="attachment"
			v-if="paymentType == 'receivable-shanmei-down' && !isJr"
		></Attachment>
		<JrAttachment
			style="margin-left: 15px"
			:list="invoiceInfo.upInvoiceDetailList"
			v-if="paymentType == 'receivable-shanmei-down' && isJr"
		></JrAttachment>
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
		<ChooseInvoice
			ref="ChooseInvoice"
			@chooseFinInvo="chooseFinInvo"
			:selectFinancedInvoice="selectFinancedInvoice"
			source="receivable"
		/>
	</div>
</template>
<script>
import ENV from '@/v2/config/env';
import { API_GetInvoiceResult, exportReceivableInvoice, API_GetReceivableInvoListPool } from '@/v2/center/assets/api/index.js';
import comDownload from '@sub/utils/comDownload.js';
// import ChooseInvoice from '../../../components/pool/ChooseInvoice.vue';
import ChooseInvoice from '@sub/componentsAssets/components/ChooseInvoice.vue';
import Attachment from './Attachment.vue';
import { Empty } from 'ant-design-vue';
import { mapGetters } from 'vuex';

import JrAttachment from '@/v2/center/assets/components/Attachment.vue';
export default {
	name: 'Invoice',
	props: [
		'invoiceInfo',
		'editFlag',
		'paymentType',
		'type',
		'isJr',
		'amount',
		'buyerName',
		'endDate',
		'contractInfo',
		'selectFinancedInvoice'
	],
	components: {
		ChooseInvoice,
		Attachment,
		JrAttachment
	},
	watch: {
		invoiceInfo: {
			immediate: true,
			handler(v) {
				this.dealEditData();
			}
		}
	},
	provide() {
		return {
			getInvoiceListParent: this.getInvoiceList,
			orderNo: this.VUEX_POOL_ASSET_OBJ.serialNo
		};
	},
	computed: {
		...mapGetters('business', {
			VUEX_POOL_ASSET_OBJ: 'VUEX_POOL_ASSET_OBJ'
		}),
		itotal() {
			return this.list.reduce((pre, cur) => pre + (Number(cur.totalAmount) || 0), 0).toFixed(2);
		},
		isplit() {
			return this.list
				.reduce((pre, cur) => pre + (Number(cur.currentContractSplitedAmount || cur.splitAmount) || 0), 0)
				.toFixed(2);
		}
	},
	data() {
		return {
			tradeInvoiceColumns: [
				{ title: '发票代码', dataIndex: 'code', key: 'code' },
				{ title: '发票号码', dataIndex: 'no', key: 'no' },
				{ title: '开票日期', dataIndex: 'issuedDate', key: 'issuedDate' },
				{ title: '价税合计(元)', dataIndex: 'totalAmount', key: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
				{
					title: '贸易合同编号',
					dataIndex: 'contractNo',
					key: 'contractNo',
					customRender: (t, r) => r.paperContractNo || r.contractNo
				},
				{
					title: '归属价税合计(元)',
					dataIndex: 'splitAmount',
					key: 'splitAmount',
					customRender: (t, r) => r.currentContractSplitedAmount || r.splitAmount
				},
				{ title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
			],
			visible: false,
			invoiceResult: '',
			list: [],
			keys: [],
			BASE_NET: ENV.BASE_NET,
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			newInvoiceInfo: {}
		};
	},
	methods: {
		get_id() {
			return Date.now() + '_' + Math.random();
		},
		dealEditData() {
			if (!this.invoiceInfo) return;
			let list = this.invoiceInfo.list || this.invoiceInfo.tradeInvoiceList || [];
			this.list = list;
			this.$nextTick(() => {
				this.$refs.attachment && this.$refs.attachment.init(this.invoiceInfo);
			});
		},

		// 查询资产发票信息
		getInvoiceList(params) {
			return new Promise(resolve => {
				API_GetReceivableInvoListPool({
					contractId: this.VUEX_POOL_ASSET_OBJ.contractId,
					contractType: this.VUEX_POOL_ASSET_OBJ.contractType,
					pageNo: 1,
					pageSize: 100,
					...params
				}).then(res => {
					if (res.success) {
						resolve(res.data.records);
					}
				});
			});
		},
		addInvo(type) {
			if (!this.VUEX_POOL_ASSET_OBJ.contractId) {
				this.$message.info('请先选择合同');
				return;
			}
			this.$refs.ChooseInvoice.show({ selectedRowKeys: this.list });
		},
		// 导出发票
		async exportInvoice() {
			if (!this.list.length) {
				this.$message.error('请关联发票');
				return;
			}

			const params = {
				type: 1,
				invoiceIds: this.list.map(i => i.id).join(','),
				amount: this.amount,
				endDate: this.endDate,
				buyerName: this.buyerName,
				contractNo: this.contractInfo.contractNo,
				assetId: this.$route.query.id
			};
			const res = await exportReceivableInvoice(params);
			comDownload(res, undefined, `发票信息.xls`);
		},
		chooseFinInvo(data) {
			this.list = data;
			if (this.list.length) {
				this.keys = this.list.map(i => i.id);
			}
		},
		getResult(items) {
			this.visible = true;
			API_GetInvoiceResult({ invoiceId: items.id, t: Date.now() }).then(res => {
				if (res.success) {
					this.invoiceResult = res.data;
				}
			});
		},
		onSubmit() {
			if (this.list.length) {
				this.keys = this.list.map(i => i.id);
			}
			let upInvoiceDetailList = [];
			if (this.paymentType == 'receivable-shanmei-down' && this.type == 'INVOICE') {
				upInvoiceDetailList = this.$refs.attachment.save();
				if (!upInvoiceDetailList) {
					this.$message.error('请上传发票附件');
					return false;
				}
			}

			return {
				keys: this.keys.join(','),
				upInvoiceDetailList
			};
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
.title {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
	margin-bottom: 20px;
	color: #000;
	line-height: 40px !important;
}
</style>
