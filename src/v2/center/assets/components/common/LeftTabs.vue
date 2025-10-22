<template>
	<div class="tabs-bar">
		<div
			:class="myactiveIndex == 0 ? 'blue' : ''"
			@click="tabChange(0)"
			v-if="tabs.indexOf('contract') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/contract.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 0 ? 'blue' : ''">合同</p>
			</div>
			<i :class="judgeColor(0)"></i>
		</div>
		<div
			:class="myactiveIndex == 1 ? 'blue' : ''"
			@click="tabChange(1)"
			v-if="tabs.indexOf('transportDocument') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/delivery.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 1 ? 'blue' : ''">运输凭证</p>
			</div>
			<i :class="judgeColor(1)"></i>
		</div>
		<div
			:class="myactiveIndex == 2 ? 'blue' : ''"
			@click="tabChange(2)"
			v-if="tabs.indexOf('qualityDocument') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/test.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 2 ? 'blue' : ''">数质量凭证</p>
			</div>
			<i :class="judgeColor(2)"></i>
		</div>
		<div
			:class="myactiveIndex == 3 ? 'blue' : ''"
			@click="tabChange(3)"
			v-if="tabs.indexOf('goodsTransferDocument') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/goodsTransfer.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 3 ? 'blue' : ''">货转凭证</p>
			</div>
			<i :class="judgeColor(3)"></i>
		</div>
		<div
			:class="myactiveIndex == 4 ? 'blue' : ''"
			@click="tabChange(4)"
			v-if="tabs.indexOf('accountsTable') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/accounts.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 4 ? 'blue' : ''">核算表</p>
			</div>
			<i :class="judgeColor(4)"></i>
		</div>
		<div
			:class="myactiveIndex == 5 ? 'blue' : ''"
			@click="tabChange(5)"
			v-if="tabs.indexOf('confirmLetter') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/confirm.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 5 ? 'blue' : ''">确认函</p>
			</div>
			<i :class="judgeColor(5)"></i>
		</div>
		<div
			:class="myactiveIndex == 8 ? 'blue' : ''"
			@click="tabChange(8)"
			v-if="tabs.indexOf('settlesFiles') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/file.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 8 ? 'blue' : ''">结算单</p>
			</div>
			<i :class="judgeColor(8)"></i>
		</div>
		<div
			:class="myactiveIndex == 6 ? 'blue' : ''"
			@click="tabChange(6)"
			v-if="tabs.indexOf('invoice') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/invoice.png"
					alt=""
				/>
				<em></em>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 6 ? 'blue' : ''">发票</p>
			</div>
			<i :class="judgeColor(6)"></i>
		</div>
		<div
			:class="myactiveIndex == 7 ? 'blue' : ''"
			@click="tabChange(7)"
			v-if="tabs.indexOf('otherFiles') > -1"
		>
			<div class="tabs-icon">
				<img
					src="@sub/assets/imgs/assets/file.png"
					alt=""
				/>
			</div>
			<div class="tabs-text">
				<p :class="myactiveIndex == 7 ? 'blue' : ''">其他材料</p>
			</div>
			<i :class="judgeColor(7)"></i>
		</div>
	</div>
</template>
<script>
const menuMap = {
	contract: 'contractInfo',
	transportDocument: 'deliverInfo',
	qualityDocument: 'recvInfo',
	goodsTransferDocument: 'goodTransferInfo',
	accountsTable: 'accountInfo',
	confirmLetter: 'confirmLetterInfo',
	invoice: 'invoiceInfo',
	otherFiles: 'otherInfo',
	settlesFiles: 'settlementInfo'
};

const steelTabs = ['contract', 'transportDocument', 'qualityDocument', 'settlesFiles', 'invoice', 'otherFiles'];

export const checkMenuShow = (type, detailData) => {
	var industryType = detailData.receivalVO.industryType;
	if (industryType == 'STEEL') {
		return steelTabs.includes(type);
	}
	var _list = (detailData[menuMap[type]] || {}).bankProductAssetConfigList;
	// 合同比展示
	if (type == 'contract') return true;
	// 发票单独判断
	if (type == 'invoice') {
		if (detailData.receivalVO.hasInvoice == 0) {
			return false;
		}
	}

	// 没有bankProductAssetConfigList 直接不显示
	if (!_list || (_list && _list.length == 0)) return false;

	return _list.some(i => {
		return i.status == 1;
	});
};

export default {
	name: 'LeftTabs',
	props: {
		detailData: {
			type: Object,
			default: () => null
		},
		activeIndex: {
			type: String,
			default: '1'
		}
	},
	components: {
		// AssetsCompanyRelationChainModal
	},
	data() {
		return {
			tabs: [],

			myactiveIndex: this.activeIndex
		};
	},
	mounted() {
		var industryType = this.detailData.receivalVO.industryType;
		var arr = [];
		if (industryType != 'STEEL') {
			arr = [
				'transportDocument',
				'qualityDocument',
				'goodsTransferDocument',
				'accountsTable',
				'confirmLetter',
				'invoice',
				'otherFiles'
			].filter(i => checkMenuShow(i, this.detailData));
			this.tabs = ['contract', ...arr];
		} else {
			this.tabs = steelTabs;
		}
	},

	methods: {
		tabChange(index) {
			this.myactiveIndex = index;
			this.$emit('tabChange', index);
		},
		getTabs() {
			return this.tabs;
		},
		judgeColor(index) {
			// 项下各必备附件存在数据时，标记绿色
			// 项下附件存在数据时，标记桔色
			// 项下附件无数据时，标记红色
			//0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
			if (!this.detailData) return;
			if (index == 0) {
				// 合同
				if (
					(this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length > 0) ||
					(this.detailData.contractInfo.tradeContract && this.detailData.contractInfo.tradeContract.list.length > 0) ||
					(this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length > 0)
				) {
					if (
						this.detailData.contractInfo.downContract &&
						this.detailData.contractInfo.downContract.list.length > 0 &&
						this.detailData.contractInfo.upContract &&
						this.detailData.contractInfo.upContract.list.length > 0
					) {
						return 'green';
					} else {
						return 'orange';
					}
				} else {
					return 'red';
				}
			} else if (index == 1) {
				// 运输凭证
				if (this.detailData.deliverInfo.attachList && this.detailData.deliverInfo.attachList.length > 0) {
					return 'green';
				} else {
					return 'red';
				}
			} else if (index == 2) {
				// 数质量凭证
				if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length > 0) {
					return 'green';
				} else {
					return 'red';
				}
			} else if (index == 3) {
				// 货转凭证
				if (this.detailData.goodTransferInfo.list && this.detailData.goodTransferInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 4) {
				// 核算表凭证
				if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length > 0) {
					return 'green';
				} else {
					return 'red';
				}
			} else if (index == 5) {
				// 确认函
				if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 6) {
				// 发票
				if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 7) {
				// 其他材料
				if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 8) {
				// 结算单
				if (
					this.detailData.settlementInfo &&
					this.detailData.settlementInfo.list &&
					this.detailData.settlementInfo.list.length > 0
				) {
					return 'orange';
				} else {
					return 'red';
				}
			}
		}
	}
};
</script>
<style lang="less" scoped>
.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
	> div:last-child {
		em {
			display: none;
		}
	}
}
.tabs-bar i {
	display: inline-block;
	width: 10px;
	height: 10px;
	float: right;
	background: red;
	border-radius: 50%;
	margin-top: 8px;
	margin-right: 10px;
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
		color: #383a3f;
		line-height: 22px;
	}
	.blue {
		color: @primary-color;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}
.red {
	color: #f24e4d !important;
}
.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.contentBox {
	font-family: PingFangSC-Regular;
}
.green {
	background: #00ae9d !important;
}
.orange {
	background: #ff9726 !important;
}
.red_bg {
	background: #f24e4d !important;
}
</style>
