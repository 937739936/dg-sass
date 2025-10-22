<template>
	<div>
		<div
			class="coal-tab"
			v-if="industryType === 'COAL'"
		>
			<div
				class="tabs-bar"
				:class="{ 'hidden-text': !toolTipVisible }"
				id="tab-bar"
			>
				<div class="s-card-title dj-info">
					单据信息
					<a-switch
						style="margin-left: 15%"
						v-model="toolTipVisible"
						size="small"
						@change="changeToolTipVisible"
					/>
				</div>
				<div
					@click="tabChange(0)"
					v-if="secondaryMenu['contract'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 0 ? 'blue' : ''">合同</p>
						<div
							v-for="item in secondaryMenu['contract']"
							v-if="item.children && item.children.length"
							class="contract-item"
							v-show="
								(downContractStatus == 1 && !item.label.includes('双签')) ||
								(downContractStatus == 2 && !item.label.includes('单签'))
							"
						>
							{{ item.label }}
							<div
								v-for="i in item.children"
								class="contract-subitem"
								v-show="
									(downContractStatus == 1 && !i.itemDesc.includes('双签')) ||
									(downContractStatus == 2 && !i.itemDesc.includes('单签'))
								"
							>
								<span v-if="i.required">*</span>
								{{ i.itemDesc.replace('上传', '') }}
								<a-tooltip v-if="i.conditionDesc">
									<template slot="title">
										{{ i.conditionDesc }}
									</template>
									<a-icon type="question-circle" />
								</a-tooltip>
							</div>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(1)"
					v-if="secondaryMenu['transportDocument'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 1 ? 'blue' : ''">运输凭证</p>
						<div
							v-for="item in secondaryMenu['transportDocument']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(2)"
					v-if="secondaryMenu['qualityDocument'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 2 ? 'blue' : ''">数质量凭证</p>
						<div
							v-for="item in secondaryMenu['qualityDocument']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(3)"
					v-if="secondaryMenu['goodsTransferDocument'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 3 ? 'blue' : ''">货转凭证</p>
						<div
							v-for="item in secondaryMenu['goodsTransferDocument']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(4)"
					v-if="secondaryMenu['accountsTable'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 4 ? 'blue' : ''">核算表</p>
						<div
							v-for="item in secondaryMenu['accountsTable']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(5)"
					v-if="secondaryMenu['confirmLetter'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 5 ? 'blue' : ''">确认函</p>
						<div
							v-for="item in secondaryMenu['confirmLetter']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(8)"
					v-if="secondaryMenu['settlesFiles'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 8 ? 'blue' : ''">结算单</p>
						<div
							v-for="item in secondaryMenu['settlesFiles']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(6)"
					v-if="secondaryMenu['invoice'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 6 ? 'blue' : ''">发票</p>
						<div
							v-for="item in secondaryMenu['invoice']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(7)"
					v-if="secondaryMenu['otherFiles'].length"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 7 ? 'blue' : ''">其他材料</p>
						<div
							v-for="item in secondaryMenu['otherFiles']"
							v-if="item.status == 1"
						>
							<span v-if="item.required">*</span>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</div>
				</div>
				<div
					@click="tabChange(9)"
					v-if="detailData.receivalVO.assetSellerSign == 1"
				>
					<div class="tabs-text">
						<p :class="myactiveIndex == 9 ? 'blue' : ''">供应商盖章版材料</p>
					</div>
				</div>
			</div>
		</div>
		<div
			class="steel-tab"
			v-else
		>
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
		</div>
	</div>
</template>
<script>
import { getPopupContainer } from '@/untils/factory.js';
import Cookies from 'js-cookie';
import { uniqBy } from 'lodash';
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
let steelTabs = [
	'contract',
	'transportDocument',
	'qualityDocument',
	'goodsTransferDocument',
	'accountsTable',
	'confirmLetter',
	'invoice',
	'otherFiles'
];
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
			getPopupContainer,
			tabs: [],
			myactiveIndex: this.activeIndex,
			toolTipVisible: false, // 开关
			toolTipVisible1: false, //是否第一次进入这个页面，第一次显示文字提示，以后不展示 存入cookie
			secondaryMenu: {
				contract: [],
				transportDocument: [],
				qualityDocument: [],
				goodsTransferDocument: [],
				accountsTable: [],
				confirmLetter: [],
				invoice: [],
				settlesFiles: [],
				otherFiles: []
			},
			contractSecondAry: [
				{
					label: '上游合同信息',
					value: 'CONTRACT_UP',
					children: []
				},
				{
					label: '下游合同信息',
					value: 'CONTRACT_DOWN_D',
					children: []
				},
				{
					label: '下游合同信息（双签）',
					value: 'CONTRACT_DOWN_DSIGN',
					children: []
				},
				{
					label: '下游合同信息（单签）',
					value: 'CONTRACT_DOWN_SSIGN',
					children: []
				},
				{
					label: '贸易背景合同信息',
					value: 'CONTRACT_TRADE',
					children: []
				},
				{
					label: '业务线其他合同信息',
					value: 'CONTRACT_BUSINESSLINE',
					children: []
				}
			],
			downContractStatus: 1,
			industryType: '',
			isPzjs: ''
		};
	},
	mounted() {
		this.industryType = this.detailData.receivalVO.industryType;
		this.isPzjs = this.detailData.receivalVO.type == 'PROOF';
		this.downContractStatus =
			this.detailData.contractInfo?.isOnlineContract == 1
				? this.detailData.contractInfo.downOnlineContract.signStatus
				: this.detailData.contractInfo.downContract.status;
		this.setLeftMenus();
		if (!Cookies.get('assets-tooltip-1')) {
			this.toolTipVisible = true;
			this.$nextTick(() => {
				this.toolTipVisible1 = true;
			});
		} else {
			this.toolTipVisible1 = false;
		}
		this.toolTipVisible = Cookies.get('assets-tooltip') === 'false' ? false : true;
	},

	methods: {
		toolTipAleady() {
			Cookies.set('assets-tooltip-1', 1, { expires: 99999 });
			this.toolTipVisible1 = false;
		},
		setLeftMenus() {
			var arr = [];
			if (this.industryType != 'STEEL') {
				arr = [
					'contract',
					'transportDocument',
					'qualityDocument',
					'goodsTransferDocument',
					'accountsTable',
					'confirmLetter',
					'invoice',
					'otherFiles'
				].filter(i => this.checkMenuShow(i, this.detailData));
			} else {
				if (this.isPzjs) {
					steelTabs = steelTabs.filter(i => i !== 'invoice');
				}
				if (
					this.detailData.receivalVO.paymentType === 'receivable-ICBC-steel' &&
					this.detailData.receivalVO.generateAssetType == 1
				) {
					steelTabs = ['contract', 'goodsTransferDocument', 'invoice', 'otherFiles'];
					if (this.isPzjs) {
						steelTabs = steelTabs.filter(i => i !== 'invoice');
					}
				}

				this.tabs = steelTabs;
			}
		},
		tabChange(index) {
			this.myactiveIndex = index;
			this.$emit('tabChange', index);
			// document.querySelector('#tab-bar').scrollIntoView()
		},
		checkMenuShow(type, detailData) {
			var _list = detailData[menuMap[type]].bankProductAssetConfigList;
			this.secondaryMenu[type] = _list || [];
			if (type == 'contract') {
				_list.map(item => {
					this.contractSecondAry.map(i => {
						if (i.label == item.secondaryCategoryDesc && item.status == 1) {
							i.children.push(item);
							uniqBy(i.children, 'itemDesc');
						}
					});
				});
				this.secondaryMenu[type] = this.contractSecondAry;
			}

			if (type == 'contract') return true;
			// 发票单独判断
			if (type == 'invoice') {
				if (detailData.receivalVO.hasInvoice == 0) {
					return false;
				}
			}
			// 没有bankProductAssetConfigList 直接不显示
			if (!_list?.length) return false;
			return _list.some(i => {
				return i.status == 1;
			});
		},
		changeToolTipVisible(e) {
			Cookies.set('assets-tooltip', e, { expires: 99999 });
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
.coal-tab {
	.dj-info {
		color: #141517;
		margin-left: 0;
		font-weight: bold;
		margin-top: 0;
		position: relative;
		i {
			position: absolute;
			left: 130px;
			top: 3px;
			cursor: pointer;
		}
	}
	.tabs-bar {
		position: relative;
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
		color: #8495aa;
		margin-left: 10px;
	}
	.tabs-bar > div {
		float: left;
		width: 100%;
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
	.tabs-bar .tabs-icon {
		margin-right: 10px;
		em {
			display: block;
			width: 1px;
			height: 36px;
			background:  @primary-color;
			border-radius: 1.5px 1.5px 0 0;
			margin: 5px 0 5px 6px;
		}
		img {
			width: 24px;
			height: 24px;
			margin-left: -5px;
		}
	}
	.tabs-bar .tabs-text {
		p {
			font-family: PingFangSC-Medium;
			color: #383a3f;
			line-height: 22px;
			width: 100%;
			padding-bottom: 9px;
			margin-bottom: 11px;
			position: relative;
			font-weight: 400;
		}
		.blue {
			border-bottom: 2px solid @primary-color;
			font-weight: bold;
		}
		div {
			line-height: 22px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.8);
			padding-left: 22px;
			margin-bottom: 22px;
			position: relative;
		}
		.contract-item {
			line-height: 22px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			color: #77889d;
			padding-left: 0;
			margin-top: 16px;
			margin-bottom: 0;
			.contract-subitem {
				margin-bottom: 16px;
				&:nth-child(1) {
					margin-top: 16px;
				}
			}
		}
		span {
			color: #ea5530;
			position: absolute;
			left: 10px;
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
	.hidden-text .tabs-text {
		div {
			display: none !important;
		}
	}
	/deep/ .ant-popover-inner-content {
		background: #4089f8;
		width: 280px;
		border-radius: 6px;
		height: 146px;
		padding: 17px 20px;
		color: #ffffff;
		.pop-title {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 18px;
			line-height: 18px;
			margin-bottom: 14px;
			img {
				width: 18px;
				height: 18px;
				margin-left: 4px;
			}
		}
		.pop-desc {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 22px;
		}
		.button {
			float: right;
			margin-top: 7px;
			width: 88px;
			height: 32px;
			background: #ffffff;
			border-radius: 4px;
			color: #4089f8;
			cursor: pointer;
			text-align: center;
			line-height: 32px;
		}
	}
	/deep/ .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow,
	.ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow,
	.ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
		border-right-color: #4089f8;
		border-bottom-color: #4089f8;
	}
}
.steel-tab {
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
	.tabs-bar .tabs-icon {
		margin-right: 10px;
		em {
			display: block;
			width: 1px;
			height: 36px;
			background: @primary-color;
			border-radius: 1.5px 1.5px 0 0;
			margin: 5px 0 5px 11px;
		}
		img {
			width: 24px;
			height: 24px;
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
}
</style>
