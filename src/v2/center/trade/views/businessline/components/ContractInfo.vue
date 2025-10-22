<template>
	<div class="contract-info">
		<ul class="grid-wrap transportBox">
			<li>
				<span class="label"><i style="color:red">*</i> 合同编号</span>
				<span		>
					<a-tooltip>
						<template slot="title">
							{{ contractInfo.paperContractNo ||  contractInfo.contractNo}}
						</template>
						<a
							href="javascript:;"
							class="omit"
							@click="goContractDetail"
							> {{ contractInfo.paperContractNo 
							||  contractInfo.contractNo }}</a
						>
					</a-tooltip>
				<a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm.stop="confirmDel" overlayClassName="confirm-del" >
					<template slot="title">
						<div class="ant-popover-tip">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z" fill="#4682F3"/>
							</svg>
							<span >确认删除？</span>
						</div>

					</template>
					<i
						class="curp"
						v-if="isCurrentSelect"
					>
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">

							<path class="old" fill="#A2ACB8" d="M9.75 3.4974H12.6667V4.66406H11.5V12.2474C11.5 12.5696 11.2388 12.8307 10.9167 12.8307H2.75C2.42784 12.8307 2.16667 12.5696 2.16667 12.2474V4.66406H1V3.4974H3.91667V1.7474C3.91667 1.42523 4.17784 1.16406 4.5 1.16406H9.16667C9.48884 1.16406 9.75 1.42523 9.75 1.7474V3.4974ZM10.3333 4.66406H3.33333V11.6641H10.3333V4.66406ZM7.65828 8.16389L8.6895 9.1951L7.86455 10.0201L6.83333 8.98884L5.80212 10.0201L4.97718 9.1951L6.00838 8.16389L4.97718 7.13273L5.80212 6.30778L6.83333 7.33894L7.86455 6.30778L8.6895 7.13273L7.65828 8.16389ZM5.08333 2.33073V3.4974H8.58333V2.33073H5.08333Z" />
							<path  class='new' fill="#4682F3" d="M9.75 3.4974H12.6667V4.66406H11.5V12.2474C11.5 12.5696 11.2388 12.8307 10.9167 12.8307H2.75C2.42784 12.8307 2.16667 12.5696 2.16667 12.2474V4.66406H1V3.4974H3.91667V1.7474C3.91667 1.42523 4.17784 1.16406 4.5 1.16406H9.16667C9.48884 1.16406 9.75 1.42523 9.75 1.7474V3.4974ZM10.3333 4.66406H3.33333V11.6641H10.3333V4.66406ZM7.65828 8.16389L8.6895 9.1951L7.86455 10.0201L6.83333 8.98884L5.80212 10.0201L4.97718 9.1951L6.00838 8.16389L4.97718 7.13273L5.80212 6.30778L6.83333 7.33894L7.86455 6.30778L8.6895 7.13273L7.65828 8.16389ZM5.08333 2.33073V3.4974H8.58333V2.33073H5.08333Z" />

						</svg>

					</i>
				</a-popconfirm>
				</span>
			</li>
			<li>
				<span class="label">卖方企业</span>
				<a-tooltip>
					<template slot="title">
						<span v-if="!contractInfo.paperContractNo">{{
							contractInfo.sellCompany || contractInfo.sellerName || contractInfo.sellerCompanyName
						}}</span>
						<span v-else>{{ contractInfo.sellerName }}</span>
					</template>
					<span v-if="!contractInfo.paperContractNo">{{
						contractInfo.sellCompany || contractInfo.sellerName || contractInfo.sellerCompanyName
					}}</span>
					<span v-else>{{ contractInfo.sellerName }}</span>
				</a-tooltip>
			</li>
			<li>
				<span class="label">买方企业</span>
				<a-tooltip>
					<template slot="title">
						<span v-if="!contractInfo.paperContractNo">{{
							contractInfo.buyCompany || contractInfo.buyerName || contractInfo.buyerCompanyName
						}}</span>
						<span v-else>{{ contractInfo.buyerName }}</span>
					</template>
					<span v-if="!contractInfo.paperContractNo">{{
						contractInfo.buyCompany || contractInfo.buyerName || contractInfo.buyerCompanyName
					}}</span>
					<span v-else>{{ contractInfo.buyerName }}</span>
				</a-tooltip>
			</li>
			<li>
				<span class="label">品名</span>
				<span>{{ contractInfo.goodsName || '-' }}</span>
			</li>
			<li>
				<span
					v-if="!contractInfo.paperContractNo"
					class="label"
					>基准价格</span
				>
				<span
					v-else
					class="label"
					>合同单价</span
				>
				<!-- 判断当前是否是从未关联业务线合同进来的 -->
				<template v-if="contractInfo.source == 'noLinkContract'">
					<span>{{	contractInfo.basePrice == '随行就市' ? contractInfo.basePrice  : (contractInfo.basePrice != 0) ?  `${formatMoney(contractInfo.basePrice)}元/吨` : '随行就市'}}</span>
					<!-- <span v-if="contractInfo.basePrice == '随行就市'">随行就市</span>
					<span v-else>
						<span v-if="contractInfo.basePrice != 0">{{formatMoney(contractInfo.basePrice)}}元/吨</span>
						<span v-else>随行就市</span>
					</span> -->
				</template>

				<template v-else>
					<span v-if="!contractInfo.paperContractNo">{{
						contractInfo.followTheMarket
							? '随行就市'
							: contractInfo.basicPrice || contractInfo.basePrice
								? formatMoney(contractInfo.basicPrice || contractInfo.basePrice) + '元/吨'
								: contractInfo.basicPriceDesc || contractInfo.basePriceDesc || '-'
					}}</span>

					<span v-else>{{
						contractInfo.followTheMarket
							? '随行就市'
							: contractInfo.contractPrice
								? formatMoney(contractInfo.contractPrice) + '元/吨'
								: '-'
					}}</span>
				</template>
			</li>
			<li>
				<span
					v-if="!contractInfo.paperContractNo"
					class="label"
					>数量</span
				>
				<span
					v-else
					class="label"
					>合同数量</span
				>
				<!-- 判断当前是否是从未关联业务线合同进来的 -->
				<template v-if="contractInfo.source == 'noLinkContract'">
					<span
						>{{ contractInfo.quantity ? formatMoney(contractInfo.quantity) + '吨' : '-' }}
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template></span
					>
				</template>

				<template v-else>
					<span v-if="!contractInfo.paperContractNo"
						>{{ contractInfo.quantity ? formatMoney(contractInfo.quantity) + '吨' : '-' }}
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template></span
					>
					<span v-else
						>{{ contractInfo.contractQuantity ? formatMoney(contractInfo.contractQuantity) + '吨' : '-' }}
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template></span
					>
				</template>
			</li>
			<li>
				<span class="label">交货期限</span>
				<!-- 判断当前是否是从未关联业务线合同进来的 -->
				<template v-if="contractInfo.source == 'noLinkContract'">
					<span>{{ contractInfo.deliveryDateStart }}至{{ contractInfo.deliveryDateEnd }}</span>
				</template>

				<template v-else>
					<span v-if="!contractInfo.paperContractNo && contractInfo.deliveryDateBegin"
						>{{ contractInfo.deliveryDateBegin }}至{{ contractInfo.deliveryDateEnd }}</span
					>
					<span v-else-if="contractInfo.paperContractNo && contractInfo.execDateStart"
						>{{ contractInfo.execDateStart }}至{{ contractInfo.execDateEnd }}</span
					>
					<span v-else>-</span>
				</template>
			</li>
			<li>
				<span class="label">运输方式</span>
				<span>{{
					contractInfo.transTypeDesc ||
					filterCodeByValueName(contractInfo.transType, 'despatchTypeDict') ||
					(contractInfo.terminalDelivery ? contractInfo.terminalDelivery.transportModeDesc : '-') ||
					'-'
				}}</span>
			</li>
			<li>
				<span class="label">收货人</span>
				<span>{{
					contractInfo.consigneeCompanyName ||
					contractInfo.receiverName ||
					(contractInfo.terminalDelivery ? contractInfo.terminalDelivery.consigneeCompanyName : '-') ||
					'-'
				}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { Edit } from '@sub/components/svg';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { formatMoney } from '@sub/filters';

export default {
	props: {
		contractInfo: {
			default: () => {
				return {};
			}
		},
		isCurrentSelect: {
			default: false
		}
	},
	data() {
		return {};
	},
	methods: {
		filterCodeByValueName,
		formatMoney,
		goContractDetail() {
			this.$emit('goContractDetail', this.contractInfo);
		},
		open() {
			this.$emit('open');
		},
		confirmDel() {
			this.$emit('confirmDel', this.contractInfo)
		}
	},
	components: {
		Edit
	}
};
</script>
<style lang="less">
.confirm-del {
	.anticon {
		display: none;
	}
	.ant-popover-buttons {

		button:first-child {
			margin-left: 0;
			margin-right: 20px;
			border: 1px solid #C3C3C3;
			color: rgba(#000, 0.4)
		}
		button:last-child {
			box-shadow: none;
			// margin-left: 0;
			// margin-right: 20px;
			// border: 1px solid #C3C3C3;
			// color: rgba(#000, 0.4)
		}
	}
	.ant-popover-message-title {
		padding-left: 0;
	}

	
}
</style>
<style scoped lang="less">
.grid-wrap {
	margin-top: 10px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
.transportBox {
	.textOverflow {
		height: 48px;
		line-height: 48px;
		left: 160px;
		padding: 0 10px;
	}
}
.ant-popover-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8px;

	span {
		margin-left:14px;
		font-weight:600;
		font-size: 18px;
	}
}

.curp {
	cursor: pointer;
	position: absolute;
	top: 12px;
	right: 12px;
	width: 22px;
	height: 22px;
	background-color: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	.old {
		display: inline-block;
	}
	.new {
		display: none;
	}
	&:hover {
		background-color: rgba(#77889D, 0.1);

		.old {
			display: none;
		}
		.new {
			display: inline;
		}
	}
}
.omit {
	max-width: 85%;
	overflow: hidden;

	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
}
</style>
