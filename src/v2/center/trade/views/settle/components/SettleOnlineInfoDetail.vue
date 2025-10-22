<template>
	<div class="main">
		<div
			class="mainCon"
			ref="table"
		>
			<div>
				<table
					class="new-table"
					border="2"
					rules="all"
					cellpadding="0"
				>
					<tr>
						<th colspan="3">贸易结算单</th>
					</tr>
					<tr>
						<td align="left">
							<a-space :size="10">
								<span class="title">合同编号</span>
								<span>{{ contractInfo.contractNo }}</span>
							</a-space>
						</td>
						<td
							align="left"
							style="width: 33.333%"
						>
							<a-space :size="10">
								<span class="title">供货周期</span>
								<span>{{ contractInfo.deliveryStartDate }}~{{ contractInfo.deliveryEndDate }}</span>
							</a-space>
						</td>
						<td
							align="left"
							style="width: 33.333%"
						>
							<a-space :size="10">
								<span class="title">结算日期</span>
								<span>{{ saveReq.settleTime }}</span>
							</a-space>
						</td>
					</tr>
					<tr>
						<td align="left">
							<a-space :size="10">
								<span class="title">品名</span>
								<span>{{ statementInfo.goodsName }}</span>
							</a-space>
						</td>
						<td
							align="left"
							colspan="2"
						>
							<!-- 运输方式特殊处理，展示运输内容，内容外部决定 -->
							<table
								border="0"
								cellpadding="0"
								class="transTypeMain"
							>
								<template v-for="key in Object.keys(transType).filter(item => item != 'ships')">
									<template v-if="transType[key] && transType[key].length">
										<template v-for="(item, index) in transType[key]">
											<tr :key="key + index">
												<td
													v-for="(items, indexs) in item"
													:key="indexs"
													:colspan="indexs == item.length - 1 ? 5 - indexs : 1"
												>
													<span class="title">{{ items.name }}</span>
													<template v-if="items.type == 'number'">
														{{ items.value | formatMoney(4) }}
													</template>
													<template v-else>
														{{ items.value }}
													</template>
												</td>
											</tr>
										</template>
									</template>
								</template>
							</table>
							<!-- 船运信息展示 -->
							<div
								v-for="(key, i) in Object.keys(transType).filter(item => item == 'ships')"
								:key="i"
							>
								<template v-if="transType[key] && transType[key].length">
									<div
										v-for="(item, index) in transType[key]"
										:key="index"
										class="transTypeMain"
									>
										<a-space
											:size="10"
											v-for="items in item"
											:key="items.name"
										>
											<span class="title">{{ items.name }}</span>
											<span>
												<template v-if="items.type == 'number'">
													{{ items.value | formatMoney(4) }}
												</template>
												<template v-else>
													{{ items.value }}
												</template>
											</span>
										</a-space>
									</div>
								</template>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div
				class="tablex"
				v-if="saveReq.receiveIndicators && saveReq.receiveIndicators.length"
			>
				<table
					class="new-table"
					border="2"
					rules="all"
					cellpadding="0"
				>
					<tr>
						<td
							:rowspan="
								5 -
								(hiddenRowKey('INDICATOR_CURRENT_SETTLE_AMOUNT') ? 0 : 1) -
								(hiddenRowKey('INDICATOR_CURRENT_REWARD_AMOUNT') ? 0 : 2)
							"
							style="border-bottom: 0; border-left: 0; width: 60px"
						>
							<span class="title"> 指标信息 </span>
						</td>
						<td>
							<span class="title">指标名</span>
						</td>
						<template v-if="saveReq.receiveIndicators">
							<td
								v-for="(item, index) in saveReq.receiveIndicators"
								:key="item.indicatorCode"
								:colspan="saveReq.receiveIndicators.length > 1 ? 1 : 2"
								:style="index == saveReq.receiveIndicators.length - 1 ? 'borderRight: 0' : ''"
							>
								<a-space :size="4">
									<span class="title">
										{{ item.indicatorName }}
									</span>
								</a-space>
							</td>
						</template>
						<td
							rowspan="4"
							v-else
						>
							请选择收指标信息
						</td>
					</tr>
					<tr>
						<td>
							<span class="title"> 合同基准值 </span>
						</td>
						<td
							v-for="(item, index) in saveReq.receiveIndicators"
							:key="item.indicatorCode"
							:colspan="saveReq.receiveIndicators.length > 1 ? 1 : 2"
							:style="index == saveReq.receiveIndicators.length - 1 ? 'borderRight: 0' : ''"
						>
							<span>{{ receiveIndicatorsFind(item.indicatorCode) }}</span>
						</td>
					</tr>
					<tr v-if="hiddenRowKey('INDICATOR_CURRENT_SETTLE_AMOUNT')">
						<td>
							<span class="title"> 本次结算值 </span>
						</td>
						<td
							v-for="(item, index) in saveReq.receiveIndicators"
							:key="item.indicatorCode"
							:colspan="saveReq.receiveIndicators.length > 1 ? 1 : 2"
							:style="index == saveReq.receiveIndicators.length - 1 ? 'borderRight: 0' : ''"
						>
							{{ item.settleValue | formatMoney(item.length) }}
						</td>
					</tr>
					<template v-if="hiddenRowKey('INDICATOR_CURRENT_REWARD_AMOUNT')">
						<tr>
							<td>
								<span class="title"> 本次奖罚值(元/吨) </span>
							</td>
							<td
								v-for="(item, index) in saveReq.receiveIndicators"
								:key="item.indicatorCode"
								:colspan="saveReq.receiveIndicators.length > 1 ? 1 : 2"
								:style="index == saveReq.receiveIndicators.length - 1 ? 'borderRight: 0' : ''"
							>
								{{ item.rewardValue | formatMoney(4) }}
							</td>
						</tr>
						<tr>
							<td>
								<span class="title"> 本次其他奖罚(元/吨) </span>
							</td>
							<td :colspan="Math.floor(saveReq.receiveIndicators && saveReq.receiveIndicators.length / 2) || 1">
								{{ saveReq.offsetOther | formatMoney(4) }}
							</td>
							<td
								align="left"
								:colspan="Math.ceil(saveReq.receiveIndicators && saveReq.receiveIndicators.length / 2)"
								style="border-right: 0"
							>
								<a-space :size="10">
									<span class="title">奖罚合计（元/吨）</span>
									<span>
										<template v-if="saveReqTotal > 0">+</template>
										{{ saveReqTotal | formatMoney(4) }}
									</span>
								</a-space>
							</td>
						</tr>
					</template>
				</table>
			</div>
			<div class="tablex">
				<table
					class="new-table"
					border="2"
					rules="all"
					cellpadding="0"
				>
					<tr>
						<td
							colspan="4"
							style="border-left: 0"
						>
							<span class="title">结算信息</span>
						</td>
						<td
							colspan="2"
							style="border-right: 0"
						>
							<span class="title">开票信息</span>
						</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次结算数量(吨) </span>
						</td>
						<td width="346">
							{{ saveReq.currentSettleQuantity | formatMoney(4) }}
						</td>
						<td>
							<span class="title"> 合同数量(吨) </span>
						</td>
						<td width="346">
							{{ contractInfo.quantity | formatMoney(4) }}
						</td>
						<td
							colspan="2"
							rowspan="6"
							style="border-right: 0"
						>
							<div class="infoMain">
								<div class="info">
									<span class="title"> 单位名称</span>
									<span> {{ invoice.companyName }} </span>
								</div>
								<div class="info">
									<span class="title"> 纳税人识别号</span>
									<span> {{ invoice.companyUscc }} </span>
								</div>
								<div class="info">
									<span class="title"> 地址</span>
									<span> {{ invoice.address }} </span>
								</div>
								<div class="info">
									<span class="title"> 电话</span>
									<span> {{ invoice.contactPhone }} </span>
								</div>
								<div class="info">
									<span class="title"> 开户行</span>
									<span> {{ invoice.subbranchName }} </span>
								</div>
								<div class="info">
									<span class="title"> 银行账号</span>
									<span> {{ invoice.accountNo }} </span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次结算单价(元/吨) </span>
						</td>
						<td>
							<span>
								{{ (saveReq.settleTotalPrice / saveReq.currentSettleQuantity) | formatMoney(2) }}
							</span>
						</td>
						<td>
							<span class="title"> 已结算数量(吨) </span>
						</td>
						<td>{{ statementInfo.finishSettleQuantity | formatMoney(4) }}</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次货款价税合计(元) </span>
						</td>
						<td>{{ saveReq.settleTotalPrice | formatMoney }}</td>
						<td>
							<span class="title"> 总结算数量(吨) </span>
						</td>
						<td>
							{{
								((Number(saveReq.currentSettleQuantity) || 0) + (Number(statementInfo.finishSettleQuantity) || 0))
									| formatMoney(4)
							}}
						</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次其他扣款(元) </span>
						</td>
						<td>
							{{ saveReq.settleOtherPart1 | formatMoney }}
						</td>
						<td>
							<span class="title"> 已结算金额(元) </span>
						</td>
						<td>{{ statementInfo.settledAmount | formatMoney }}</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次代收代垫(元) </span>
						</td>
						<td>
							{{ saveReq.settleOtherPart2 | formatMoney }}
						</td>
						<td>
							<span class="title"> 总结算金额(元) </span>
						</td>
						<td>
							{{
								((Number((saveReq.settleTotalPrice || 0) - (saveReq.settleOtherPart1 || 0) + (saveReq.settleOtherPart2 || 0)) ||
									0) +
									(Number(statementInfo.settledAmount) || 0))
									| formatMoney
							}}
						</td>
					</tr>
					<tr>
						<td style="border-left: 0">
							<span class="title"> 本次结算金额(元) </span>
						</td>
						<td colspan="3">
							<span class="sum">{{
								((saveReq.settleTotalPrice || 0) - (saveReq.settleOtherPart1 || 0) + (saveReq.settleOtherPart2 || 0))
									| formatMoney
							}}</span>
						</td>
					</tr>
					<tr>
						<td style="border-left: 0; width: 16.6667%">
							<span class="title"> 备注 </span>
						</td>
						<td
							align="left"
							colspan="5"
							style="border-right: 0"
						>
							{{ saveReq.comments }}
						</td>
					</tr>
					<tr>
						<td
							align="left"
							colspan="3"
							style="border-left: 0; width: 50%; padding: 46px 30px"
						>
							<a-space :size="10">
								<span class="title">卖方单位</span>
								<span>{{ statementInfo.sellerName }}</span>
							</a-space>
						</td>
						<td
							align="left"
							colspan="3"
							style="border-right: 0; width: 50%; padding: 46px 30px"
						>
							<a-space :size="10">
								<span class="title">买方单位</span>
								<span>{{ statementInfo.buyerName }}</span>
							</a-space>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	components: {},
	props: {
		info: {
			type: Object,
			default: () => {
				//contractInfo合同信息,invoice开票信息,statementInfo结算单信息,transType结算单中运输信息部分,saveReq提交填写的信息
				return {
					contractInfo: {},
					invoice: {},
					statementInfo: {},
					transType: {},
					saveReq: {}
				};
			}
		}
	},
	data() {
		return {};
	},
	computed: {
		//合同信息
		contractInfo() {
			let { contractInfo = {} } = this.info;
			return contractInfo;
		},
		//选择的指标信息
		receiveIndicators() {
			let { receiveIndicators = [] } = this.saveReq;
			return receiveIndicators;
		},
		//企业开票信息
		invoice() {
			let { invoice = {} } = this.info;
			return invoice;
		},
		//结算单信息
		statementInfo() {
			let { statementInfo = {} } = this.info;
			return statementInfo;
		},
		//结算单信息
		transType() {
			let { transType = {} } = this.info;
			return transType;
		},
		//保存时提交的信息
		saveReq() {
			let { saveReq = {} } = this.info;
			return saveReq;
		},
		//选中保存值合计
		saveReqTotal() {
			// 判断本次奖罚值是否禁用，不禁用加载
			let total = 0;
			let saveReq = this.saveReq;
			saveReq.receiveIndicators?.map(item => {
				total += item.rewardValue || 0;
			});
			//本次其他奖罚
			total += saveReq.offsetOther || 0;
			return total;
		}
	},
	watch: {},
	filters: {},
	mounted() {},
	methods: {
		//判断此行是否禁用
		hiddenRowKey(key) {
			let saveReq = this.saveReq;
			return !(saveReq.hiddenRow && saveReq.hiddenRow.includes(key));
		},
		//筛选合同基准值
		receiveIndicatorsFind(code) {
			let data = this.receiveIndicators.find(item => item.indicatorCode == code);
			let str = '-';
			if (data) {
				//判断基准值类型
				switch (data.inputType) {
					case 'SINGLE':
						//单区间
						if (data.value1) {
							str = `${data.symbol == '无符号' ? '' : data.symbol}${data.value1}`;
						}
						break;
					case 'RANGE':
						//区间范围
						if (data.value1 || data.value2) {
							if (data.value1 !== null && data.value2 !== null) {
								str = `${data.value1 || ''}~${data.value2 || ''}`;
							} else {
								str = `${data.value1 || ''}${data.value2 || ''}`;
							}
						}
						break;
				}
			}
			return str;
		}
	}
};
</script>
<style lang="less" scoped>
.main {
	width: 100%;
	.mainCon {
		width: 100%;
		border-bottom: 1px solid rgba(0, 0, 0, 0.8);
		.tablex {
			overflow-x: scroll;
			border-left: 1px solid rgba(0, 0, 0, 0.8);
			border-right: 1px solid rgba(0, 0, 0, 0.8);
			&::-webkit-scrollbar {
				height: 6px;
			}
			&::-webkit-scrollbar-thumb {
				background: rgba(147, 158, 175, 0.5);
			}
		}
	}
	.new-table {
		width: 100%;
		font-family: PingFang SC;
		text-align: center;
		color: rgba(119, 136, 157, 1);
		border-color: rgba(0, 0, 0, 0.8);
		border: 0px;
		tr:last-child {
			td {
				border-bottom-width: 0px;
			}
		}
		th,
		td {
			border-color: rgba(0, 0, 0, 0.8);
			white-space: nowrap;
			&.disabled {
				background: #f3f5f6;
			}
		}
		th {
			font-size: 18px;
			font-weight: 500;
			line-height: 25px;
			letter-spacing: 0px;
			padding: 14px;
		}
		td {
			color: rgba(0, 0, 0, 0.8);
			font-family: PingFang SC;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			padding: 4px 20px;
			height: 50px;
			.iconfont,
			.anticon {
				margin-left: 4px;
				vertical-align: middle;
				cursor: pointer;
				&:hover {
					color: @primary-color;
				}
			}
			.sum {
				font-size: 18px;
				font-weight: 600;
			}
			.title {
				font-size: 14px;
				color: #77889d;
			}
			table.transTypeMain {
				td {
					white-space: normal;
					min-width: 140px;
					height: 34px;
					.title {
						margin-right: 10px;
					}
				}
			}
			div.transTypeMain {
				display: -webkit-box;
				display: -webkit-flex;
				display: -ms-flexbox;
				display: flex;
				flex-wrap: wrap;
				& > div {
					margin-right: 60px;
					padding: 6px 0;
					&:last-child {
						margin: 0;
					}
				}
			}
			a {
				display: inline-block;
				white-space: normal;
				color: @primary-color;
			}
			.infoMain {
				padding: 10px 0;
				line-height: 22px;
				.info {
					padding: 6px 0px;
					text-align: left;
					.title {
						display: inline-block;
						width: 138px;
					}
				}
			}
			/deep/.ant-descriptions {
				padding-top: 10px;
				.ant-descriptions-item:has(.ant-descriptions-item-content) {
					padding-bottom: 14px;
				}
			}
		}
	}
}
</style>
