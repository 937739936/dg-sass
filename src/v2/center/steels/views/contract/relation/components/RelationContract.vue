<template>
	<div>
		<a-row>
			<a-col span="6">
				<div class="tabs-bar">
					<div
						v-for="(item, index) in sideTabList"
						:key="index"
						@click="contentChange(item.name)"
						:class="item.name === contractContentActiveIndex ? 'blue' : ''"
					>
						<div class="tabs-icon">
							<img :src="item.icon" />
							<em v-if="index < sideTabList.length - 1"></em>
						</div>
						<div class="tabs-text">
							<p>{{ item.label }}</p>
							<span v-if="relationContractDetail.signDate && index == 0"> 签订日期：{{ relationContractDetail.signDate }} </span>
						</div>
						<img
							src="@/assets/imgs/monitoring/arrow.png"
							class="arrow"
							v-show="contractContentActiveIndex == index"
						/>
					</div>
				</div>
			</a-col>
			<!-- 右侧数据展示模块 -->
			<a-col span="18">
				<!-- 合同签订-->
				<template v-if="contractContentActiveIndex == 'contract'">
					<!-- 判断上游合同 和上游合同补录 -->
					<template v-if="contractType == 0">
						<SupplementContract
							v-if="relationContractDetail.generateWay == 'ARTIFICIAL_COLLECTION'"
							:contractType="contractType"
							:contractData="relationContractDetail"
						/>
						<ElectronicContract
							v-else
							:contractType="contractType"
							:contractData="relationContractDetail"
						/>
					</template>

					<!-- 判断是下游补录合同 还是 系统生成 -->
					<template v-else>
						<SupplementContract
							v-if="relationContractDetail.generateWay == 'ARTIFICIAL_COLLECTION'"
							:contractType="contractType"
							:contractData="relationContractDetail"
						/>
						<ElectronicContract
							v-else
							:contractType="contractType"
							:contractData="relationContractDetail"
						/>
					</template>
				</template>

				<!-- 货物运输-->
				<template v-if="contractContentActiveIndex == 'delivery'">
					<ElectronicContractGoodsDelivery
						:contractType="contractType"
						:handleType="handleType"
						:contractData="relationContractDetail"
					/>
				</template>
				<!-- 资金流水 -->
				<template v-if="contractContentActiveIndex == 'payment' && contractType == 0">
					<CapitalFlow :contractData="relationContractDetail" />
				</template>
				<template v-if="contractContentActiveIndex == 'payment' && contractType == 1">
					<DownStreamSupplementCapitalFlow :contractData="relationContractDetail" />
				</template>

				<!-- 发票信息 -->
				<template v-if="contractContentActiveIndex == 'invoice'">
					<InvoiceList :contractData="relationContractDetail" />
				</template>
				<template v-if="contractContentActiveIndex == 'settlement'">
					<StatementList
						:contractData="relationContractDetail"
						v-if="contractType == 0"
					></StatementList>
					<DownStatementList
						:contractData="relationContractDetail"
						v-if="contractType == 1"
					></DownStatementList>
				</template>
				<!-- 其他附件 -->
				<template v-if="contractContentActiveIndex == 'file'">
					<FileList :contractData="relationContractDetail" />
				</template>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import SupplementContract from './SupplementContract';
import InvoiceList from './InvoiceList';
import CapitalFlow from './CapitalFlow';
import DownStreamSupplementCapitalFlow from './DownStreamSupplementCapitalFlow';
import FileList from './FileList';
import StatementList from './StatementList';
import DownStatementList from './DownStatementList.vue';

import ElectronicContract from './ElectronicContract';
import ElectronicContractGoodsDelivery from './ElectronicContractGoodsDelivery';
import contract from '@sub/assets/imgs/assets/contract.png';
import delivery from '@sub/assets/imgs/assets/delivery.png';
import payment from '@sub/assets/imgs/assets/goodsTransfer.png';
import invoice from '@sub/assets/imgs/assets/invoice.png';
import file from '@sub/assets/imgs/assets/file.png';
import settlement from '@sub/assets/imgs/assets/confirm.png';
// 应收
const sideTabListUp = [
	{ label: '合同签订', icon: contract, name: 'contract' },
	{ label: '货物运输', icon: delivery, name: 'delivery' },
	{ label: '资金流水', icon: payment, name: 'payment' },
	{ label: '发票', icon: invoice, name: 'invoice' },
	{ label: '结算单', icon: settlement, name: 'settlement' },
	{ label: '其他附件', icon: file, name: 'file' }
];
// 代采 代采+ 仓押
const sideTabListUp2 = [
	{ label: '合同签订', icon: contract, name: 'contract' },
	{ label: '货物运输', icon: delivery, name: 'delivery' },
	{ label: '资金流水', icon: payment, name: 'payment' },
	{ label: '发票', icon: invoice, name: 'invoice' },
	{ label: '其他附件', icon: file, name: 'file' }
];
// 仓押
const sideTabListDown = [
	{ label: '合同签订', icon: contract, name: 'contract' },
	{ label: '发票', icon: invoice, name: 'invoice' },
	{ label: '回款', icon: payment, name: 'payment' },
	{ label: '其他附件', icon: file, name: 'file' }
];
const sideTabListDown2 = [
	{ label: '合同签订', icon: contract, name: 'contract' },
	{ label: '发票', icon: invoice, name: 'invoice' },
	{ label: '回款', icon: payment, name: 'payment' },
	{ label: '结算单', icon: settlement, name: 'settlement' },
	{ label: '其他附件', icon: file, name: 'file' }
];

export default {
	name: 'RelationContract',
	components: {
		SupplementContract,
		InvoiceList,
		CapitalFlow,
		FileList,
		ElectronicContract,
		ElectronicContractGoodsDelivery,
		DownStreamSupplementCapitalFlow,
		StatementList,
		DownStatementList
	},
	props: [
		'relationContractDetail',
		'contractType' // 0-上游合同 1-下游合同
	],
	watch: {
		relationContractDetail: {
			handler() {
				// 判断业务类型
				// 代采  代采+ 仓押
				if (
					[
						'SOURCING_AGENT',
						'SOURCING_AGENT_OTHER',
						'SOURCING_AGENT_WAREHOUSE_PLEDGE',
						'SOURCING_AGENT_WAREHOUSE_PLEDGE_OTHER'
					].includes(this.relationContractDetail.businessType)
				) {
					this.sideTabListUp = sideTabListUp2;
					this.sideTabListDown = sideTabListDown2;
					this.handleType = 3;
				} else if (
					['WAREHOUSE_RECEIPTS_PLEDGE', 'WAREHOUSE_RECEIPTS_PLEDGE_OTHER'].includes(this.relationContractDetail.businessType)
				) {
					//  仓押
					this.sideTabListUp = sideTabListUp2;
					this.sideTabListDown = sideTabListDown2;
					this.handleType = 2;
				} else {
					// 其他业务
					this.sideTabListUp = sideTabListUp;
					this.sideTabListDown = sideTabListDown;
					this.handleType = 1;
				}

				this.handleSideTabList();
				this.$forceUpdate();
			},
			deep: true,
			immediate: true
		}
	},
	computed: {},
	data() {
		return {
			sideTabListUp: sideTabListUp,
			sideTabListDown: sideTabListDown,
			sideTabList: [],
			contractContentActiveIndex: 'contract',
			cashTabIndex: this.$route.query.cashTabIndex || 0,
			handleType: ''
		};
	},

	created() {
		this.contentChange(this.contractContentActiveIndex);
		this.handleSideTabList();
	},

	methods: {
		handleSideTabList() {
			this.sideTabList = this.contractType == 0 ? this.sideTabListUp : this.sideTabListDown;
		},
		// 下游数据tabs切换
		contentChange(name) {
			// const path = '/center/steels/relation/detail';
			this.contractContentActiveIndex = name;
			//   this.$router.push({
			//     path,
			//     query: {
			//       ...this.$route.query,
			//       contractContentActiveIndex: index,
			//     },
			//   });
		}
	}
};
</script>

<style lang="less" scoped>
.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar .arrow {
	width: 16px;
	height: 16px;
	float: right;
	margin: 2px 12px 0 0;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar > div {
	padding: 14px 0;
		.tabs-icon {
			flex: none;
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
		img {
			width: 18px;
			height: 18px;
			margin-right: 10px;
		}
		span,
		img {
			vertical-align: middle;
		}
	}
}
.tabs-bar > div.blue {
	img {
		filter: brightness(150%);
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		font-size: 12px;
		color: #383a3f;
		line-height: 22px;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}
::v-deep.slick-list {
	padding-left: 20px;
	position: relative;
	top: -5px;
}
::v-deep.slick-slide {
	padding-right: 20px;
}
::v-deep.slick-dots {
	display: none !important;
}
::v-deep.ant-form-item {
	margin-bottom: 0;
	display: block;
}
::v-deep.ant-form-item-label > label {
	color: #6b6f76;
}
::v-deep.ant-form-item-children {
	color: #383a3f;
	display: inline-block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
</style>
