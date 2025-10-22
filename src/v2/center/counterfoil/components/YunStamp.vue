<template>
	<div
		class="yun-stamp"
		v-if="assetBillVO"
	>
		<table style="text-align: center">
			<tbody>
				<tr style="border-top: none">
					<td
						style="border-top: none"
						colspan="14"
						widths="1648"
					>
						<p><strong>云票</strong></p>
					</td>
				</tr>
				<tr>
					<td widths="325">
						<p class="yun-label">开立日期</p>
					</td>
					<td widths="401">
						<p>{{ assetBillVO.issueDate }}</p>
					</td>
					<td
						colspan="4"
						widths="370"
					>
						<p class="yun-label">云票编号</p>
					</td>
					<td
						colspan="8"
						widths="550"
					>
						<p>{{ assetBillVO.serialNo }}</p>
					</td>
				</tr>
				<tr>
					<td widths="325">
						<p class="yun-label">云票开立方</p>
					</td>
					<td widths="401">
						<p>{{ assetBillVO.issuerName }}</p>
					</td>
					<td
						colspan="4"
						widths="370"
					>
						<p class="yun-label">统一社会信用代码</p>
					</td>
					<td
						colspan="8"
						widths="550"
					>
						<p>{{ assetBillVO.issuerUscc }}</p>
					</td>
				</tr>
				<tr>
					<td widths="325">
						<p class="yun-label">云票转让方</p>
					</td>
					<td widths="401">
						<p>{{ assetBillVO.issuerName }}</p>
					</td>
					<td
						colspan="4"
						widths="370"
					>
						<p class="yun-label">统一社会信用代码</p>
					</td>
					<td
						colspan="8"
						widths="550"
					>
						<p>{{ assetBillVO.issuerUscc }}</p>
					</td>
				</tr>
				<tr>
					<td widths="325">
						<p class="yun-label">云票接收方</p>
					</td>
					<td widths="401">
						<p>{{ assetBillVO.receiverName }}</p>
					</td>
					<td
						colspan="4"
						widths="370"
					>
						<p class="yun-label">统一社会信用代码</p>
					</td>
					<td
						colspan="8"
						widths="550"
					>
						<p>{{ assetBillVO.receiverUscc }}</p>
					</td>
				</tr>
				<tr style="text-align: right">
					<td
						rowspan="2"
						widths="325"
						style="text-align: center"
					>
						<p class="yun-label">云票金额（人民币）</p>
					</td>
					<td
						rowspan="2"
						widths="401"
						style="text-align: center"
					>
						<p>（大写）{{ assetBillVO.billAmountCapital }}元整</p>
					</td>
					<td widths="94">
						<p class="yun-label">十</p>
					</td>
					<td widths="91">
						<p class="yun-label">亿</p>
					</td>
					<td widths="92">
						<p class="yun-label">千</p>
					</td>
					<td widths="93">
						<p class="yun-label">百</p>
					</td>
					<td widths="92">
						<p class="yun-label">十</p>
					</td>
					<td widths="64">
						<p class="yun-label">万</p>
					</td>
					<td widths="55">
						<p class="yun-label">千</p>
					</td>
					<td widths="62">
						<p class="yun-label">百</p>
					</td>
					<td widths="56">
						<p class="yun-label">十</p>
					</td>
					<td widths="61">
						<p class="yun-label">元</p>
					</td>
					<td widths="55">
						<p class="yun-label">角</p>
					</td>
					<td widths="104">
						<p class="yun-label">分</p>
					</td>
				</tr>
				<tr
					style="text-align: right"
					class="cash"
				>
					<td
						v-for="(item, index) in assetBillVO.billAmountList || []"
						:key="index"
					>
						<p>{{ item }}</p>
					</td>
				</tr>
				<tr>
					<td widths="325">
						<p class="yun-label">承诺付款日</p>
					</td>
					<td
						colspan="13"
						widths="1322"
					>
						<p>{{ assetBillVO.acceptanceDate }}</p>
					</td>
				</tr>
				<tr>
					<td
						colspan="14"
						widths="1648"
					>
						<p
							class="yun-label"
							style="text-align: left"
						>
							<strong>开立方承诺：本云票到期无条件支付。</strong>
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
import PdfPreview from '@sub/components/pdf/index.vue';

export default {
	data() {
		return {};
	},
	props: ['assetBillVO'],
	components: {},
	watch: {
		assetBillVO() {
			if (this.assetBillVO && this.assetBillVO.billAmountList) {
				for (var i = this.assetBillVO.billAmountList.length - 1; i >= 0; i--) {
					if (this.assetBillVO.billAmountList[i] === null) {
						this.assetBillVO.billAmountList[i] = '¥';
						break;
					}
				}
			}
		}
	},
	computed: {},
	mounted() {},
	methods: {}
};
</script>
<style lang="less" scoped>
.yun-stamp {
	td p {
		padding: 15px;
	}

	table {
		border: 1.5px solid #000000;
	}
	td {
		border-top: 1.5px solid #000000;
		text-align: center;
	}
	th,
	td {
		border-right: 1.5px solid #000000;
	}
	th:last-child,
	td:last-child {
		border-right-color: transparent;
	}
	.cash p {
		font-weight: 600;
	}

	table {
		border-collapse: separate;
		border-spacing: 0;
		background-color: #fff;
		width: 100%;
		border-spacing: 0;
		border-radius: inherit;
		border-radius: 10px;
	}
	.yun-label {
		color: rgba(0, 0, 0, 0.65);
	}
}
</style>
