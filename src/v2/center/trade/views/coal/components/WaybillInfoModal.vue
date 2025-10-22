<template>
	<a-modal
		width="1000px"
		height="80%"
		title="运单信息"
		:footer="null"
		centered
		v-model="visible"
	>
		<div>
			<p style="overflow: hidden; padding-bottom: 5px">
				<span style="float: left">需求号：{{ modalInfo.demandNo }}</span
				><span style="float: right">运单号：{{ modalInfo.serialNo }}</span>
			</p>
			<table
				cellspacing="0"
				cellpadding="0"
				class="modalTable"
			>
				<tr>
					<td
						rowspan="4"
						colspan="1"
						style="padding: 5px 8px"
					>
						托运人
					</td>
					<td colspan="2">发站(公司)</td>
					<td colspan="4">{{ modalInfo.departureStation }}({{ modalInfo.departureRailwayName }})</td>
					<td colspan="2">专用线</td>
					<td colspan="6">{{ modalInfo.sendSpecialLine }}</td>
					<td colspan="2">货区</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td
						colspan="2"
						rowspan="2"
					>
						名称
					</td>
					<td
						colspan="7"
						rowspan="2"
					>
						{{ modalInfo.consignorName }}
					</td>
					<td colspan="2">经办人</td>
					<td colspan="3"></td>
					<td colspan="2">货位</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td colspan="2">手机号</td>
					<td colspan="3"></td>
					<td colspan="2">车种&nbsp;&nbsp;车号</td>
					<td colspan="6">{{ modalInfo.carType }}&nbsp;&nbsp;{{ modalInfo.carNumber }}</td>
				</tr>
				<tr>
					<td colspan="2">
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>上门取货
					</td>
					<td colspan="2">取货地址</td>
					<td colspan="5">{{ modalInfo.receiveGoodsAddress }}</td>
					<td colspan="2">联系电话</td>
					<td colspan="3"></td>
					<td colspan="2">取货里程(km)</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td
						rowspan="4"
						colspan="1"
						style="padding: 5px 8px"
					>
						收货人
					</td>
					<td colspan="2">到站(公司)</td>
					<td colspan="4">{{ modalInfo.arriveStation }}({{ modalInfo.arriveRailwayName }})</td>
					<td colspan="2">专用线</td>
					<td colspan="6">{{ modalInfo.receiveSpecialLine }}</td>
					<td colspan="2">运到期限</td>
					<td colspan="2">{{ modalInfo.transportTimeLimit }}</td>
					<td colspan="2">标重(吨)</td>
					<td colspan="2">{{ modalInfo.deliverQuantity }}</td>
				</tr>
				<tr>
					<td
						colspan="2"
						rowspan="2"
					>
						名称
					</td>
					<td
						colspan="7"
						rowspan="2"
					>
						{{ modalInfo.consigneeName }}
					</td>
					<td colspan="2">经办人</td>
					<td colspan="3"></td>
					<td colspan="2">施封号</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td colspan="2">手机号</td>
					<td colspan="3"></td>
					<td colspan="2">蓬布号</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td colspan="2">
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>上门送货
					</td>
					<td colspan="2">送货地址</td>
					<td colspan="5">{{ modalInfo.sendGoodeAddress }}</td>
					<td colspan="2">联系电话</td>
					<td colspan="3"></td>
					<td colspan="2">送货里程(km)</td>
					<td colspan="6">{{ modalInfo.transportMileage }}</td>
				</tr>
				<tr>
					<td colspan="2">付款方式</td>
					<td colspan="7">
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>现金
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>支票
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>银行卡<br />
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>预付款
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>汇总支付
					</td>
					<td colspan="2">领货方式</td>
					<td colspan="4">
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>电子领货<br />
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>纸质领货
					</td>
					<td colspan="2">装车方</td>
					<td colspan="2"></td>
					<td colspan="2">施封方</td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="3">货物名称</td>
					<td colspan="1">件数</td>
					<td colspan="1">包装</td>
					<td colspan="2">货物价格(元)</td>
					<td colspan="2">重量(吨)</td>
					<td colspan="2">箱型箱类</td>
					<td colspan="2">箱号</td>
					<td colspan="2">集装箱施封号</td>
					<td colspan="2">承运人确定重量(吨)</td>
					<td colspan="2">体积(m3)</td>
					<td colspan="2">运价号</td>
					<td colspan="2">计费重量(吨)</td>
				</tr>
				<tr>
					<td colspan="3">{{ modalInfo.productName }}</td>
					<td colspan="1"></td>
					<td colspan="1"></td>
					<td colspan="2">{{ modalInfo.valuationAmount }}</td>
					<td colspan="2">{{ modalInfo.weight }}</td>
					<td colspan="2">{{ modalInfo.boxShape }}&nbsp;&nbsp;{{ modalInfo.boxType }}</td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2">{{ modalInfo.weight }}</td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2">{{ modalInfo.weight }}</td>
				</tr>
				<tr>
					<td colspan="3">合计</td>
					<td colspan="1"></td>
					<td colspan="1"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td
						colspan="3"
						rowspan="4"
					>
						选择服务
					</td>
					<td colspan="3">
						<a-checkbox
							disabled
							:default-checked="Boolean(modalInfo.loadingToDoor)"
							style="margin-right: 5px"
						></a-checkbox
						>上门装车
					</td>
					<td colspan="3"></td>
					<td colspan="3">费目</td>
					<td colspan="2">金额(元)</td>
					<td colspan="2">税额(元)</td>
					<td colspan="3">费目</td>
					<td colspan="2">金额(元)</td>
					<td colspan="2">税额(元)</td>
				</tr>
				<tr>
					<td colspan="3">
						<a-checkbox
							disabled
							:default-checked="Boolean(modalInfo.unloadingToDoor)"
							style="margin-right: 5px"
						></a-checkbox
						>上门卸车
					</td>
					<td colspan="3"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="6">
						<a-checkbox
							disabled
							:default-checked="Boolean(modalInfo.transportSafeValue)"
							style="margin-right: 5px"
						></a-checkbox
						>保价运输
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>装载加固材料<br />
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>仓储
						<a-checkbox
							disabled
							style="margin-right: 5px"
						></a-checkbox
						>冷藏(保温)
					</td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="2">其他服务</td>
					<td colspan="4">{{ modalInfo.otherService ? '是' : '否' }}</td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td
						colspan="3"
						rowspan="3"
					>
						<span>增值税发票类型</span>
						<a-checkbox
							disabled
							:default-checked="Boolean(modalInfo.vatInvoiceType == 1)"
							style="margin-right: 5px"
						></a-checkbox
						>普通票<br />
						<a-checkbox
							disabled
							:default-checked="Boolean(modalInfo.vatInvoiceType == 2)"
							style="margin-right: 5px"
						></a-checkbox
						>专用票
					</td>
					<td
						colspan="6"
						rowspan="3"
					></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
					<td colspan="3"></td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="3">费用合计</td>
					<td colspan="2">{{ modalInfo.totalCost }}</td>
					<td colspan="2">大写:</td>
					<td colspan="7">{{ text }}</td>
				</tr>
				<tr>
					<td
						colspan="9"
						rowspan="3"
						style="height: 74px"
					>
						{{ modalInfo.shipperRemember }}
					</td>
					<td
						colspan="14"
						rowspan="3"
						style="height: 74px"
					>
						{{ modalInfo.carrierRemember }}
					</td>
				</tr>
			</table>
			<p style="text-align: right; padding: 5px">制票日期:&nbsp;{{ modalInfo.makePaperDate }}</p>
		</div>
	</a-modal>
</template>
<script>
export default {
	props: {
		modalInfo: {
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			text: ''
		};
	},
	methods: {
		show() {
			this.visible = true;
			this.text = this.smallToBig(this.modalInfo.totalCost);
		},
		close() {
			this.visible = false;
		},
		smallToBig(money) {
			//  将数字金额转换为大写金额
			var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); //汉字的数字
			var cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位
			var cnIntUnits = new Array('', '万', '亿', '兆'); //对应整数部分扩展单位
			var cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位
			var cnInteger = '整'; //整数金额时后面跟的字符
			var cnIntLast = '元'; //整数完以后的单位
			//最大处理的数字
			var maxNum = 999999999999999.9999;
			var integerNum; //金额整数部分
			var decimalNum; //金额小数部分
			//输出的中文金额字符串
			var chineseStr = '';
			if (money == '' || money == null) {
				return '';
			}
			money = parseFloat(money);
			if (money >= maxNum) {
				//超出最大处理数字
				return '超出最大处理数字';
			}
			if (money == 0) {
				chineseStr = cnNums[0] + cnIntLast + cnInteger;
				return chineseStr;
			}

			//四舍五入保留两位小数,转换为字符串
			money = Math.round(money * 100).toString();
			integerNum = money.substr(0, money.length - 2);
			decimalNum = money.substr(money.length - 2);

			//获取整型部分转换
			if (parseInt(integerNum, 10) > 0) {
				var zeroCount = 0;
				var IntLen = integerNum.length;
				for (var i = 0; i < IntLen; i++) {
					var n = integerNum.substr(i, 1);
					var p = IntLen - i - 1;
					var q = p / 4;
					var m = p % 4;
					if (n == '0') {
						zeroCount++;
					} else {
						if (zeroCount > 0) {
							chineseStr += cnNums[0];
						}
						//归零
						zeroCount = 0;
						chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
					}
					if (m == 0 && zeroCount < 4) {
						chineseStr += cnIntUnits[q];
					}
				}
				chineseStr += cnIntLast;
			}
			//小数部分
			if (decimalNum != '') {
				var decLen = decimalNum.length;
				for (let i = 0; i < decLen; i++) {
					let n = decimalNum.substr(i, 1);
					if (n != '0') {
						chineseStr += cnNums[Number(n)] + cnDecUnits[i];
					}
				}
			}
			if (chineseStr == '') {
				chineseStr += cnNums[0] + cnIntLast + cnInteger;
			} else if (decimalNum == '' || /^0*$/.test(decimalNum)) {
				chineseStr += cnInteger;
			}
			return chineseStr;
		}
	}
};
</script>
<style lang="less" scoped>
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
		padding: 5px 6px;
	}
}
.modal-train-info {
	::v-deep.ant-modal-content {
		width: 1000px !important;
		height: 100%;
		overflow-y: auto;
	}
	::v-deep label {
		width: auto;
	}
}
::v-deep.ant-modal-body {
	overflow: hidden;
}
</style>
