<template>
	<a-modal
		:visible="visible"
		:footer="null"
		centered
		@cancel="
			() => {
				visible = false;
			}
		"
		width="80%"
	>
		<div class="modalContent">
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
</template>

<script>
export default {
	props: {},
	inject: {
		getInvoiceResultParent: { form: 'getInvoiceResultParent', default: null }
	},
	data() {
		return {
			visible: false,
			invoiceResult: {}
		};
	},

	computed: {
		// API_GetInvoiceResult: () => {
		// 	let API_GetInvoiceResult;
		// 	let type = process.env.VUE_APP_SYSTEM_TYPE;
		// 	if (type === 'rest') {
		// 		let path = '/v2/center/assets/api/index.js';
		// 		API_GetInvoiceResult = require(`@${path}`).API_GetInvoiceResult;
		// 	} else if (type === 'admin') {
		// 		let path = 'manage';
		// 		// import { getAction } from '@/api/manage'
		// 		let { getAction } = require(`@/api/${path}`);
		// 		API_GetInvoiceResult = params => {
		// 			return getAction('/sys/asset/audit/getInvoicePdfInfo', params);
		// 		};
		// 	}
		// 	return API_GetInvoiceResult;
		// }
	},
	methods: {
		// 查询发票详情
		async showModal(id) {
			if (this.getInvoiceResultParent) {
				this.getInvoiceResultParent({ invoiceId: id, industryType: 'COAL' }).then(res => {
					this.invoiceResult = res;
					this.visible = true;
				});
			} else {
				this.$message.warning('数据异常');
			}
		}
	}
};
</script>

<style lang="less" scoped>
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
		color:  @primary-color;
		text-align: left;
	}
}
</style>
