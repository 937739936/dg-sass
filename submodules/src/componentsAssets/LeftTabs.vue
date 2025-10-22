<template>
	<div>
		<div
			class="coal-tab"
			ref="tabBar"
		>
			<div
				class="tabs-bar"
				:class="{ 'hidden-text': !toolTipVisible }"
			>
				<div
					class="tabs-text"
					@click="tabChange(0)"
					v-if="secondaryMenu['contract'].length"
				>
					<div :class="{ blue: myactiveIndex == 0, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/contract.png"
								alt=""
							/>
							<span>合同</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.contract"
							v-mainTip="`${assetValidateList.contract}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.contract }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['contract']">
						<div
							:key="index"
							class="contract-item"
							v-if="
								(item.children && item.children.length && downContractStatus == 1 && !item.label.includes('双签')) ||
								(downContractStatus == 2 && !item.label.includes('单签'))
							"
						>
							<div class="contract-item-title">{{ item.label }}</div>
							<template v-for="(i, is) in item.children">
								<div
									:class="{ 'contract-subitem': true, required: i.required }"
									:key="is"
									v-if="
										(downContractStatus == 1 && !i.itemDesc.includes('双签')) ||
										(downContractStatus == 2 && !i.itemDesc.includes('单签'))
									"
								>
									{{ i.itemDesc.replace('上传', '') }}
									<a-tooltip v-if="i.conditionDesc">
										<template slot="title">
											{{ i.conditionDesc }}
										</template>
										<a-icon type="question-circle" />
									</a-tooltip>
								</div>
							</template>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(1)"
					v-if="secondaryMenu['transportDocument'].length"
				>
					<div :class="{ blue: myactiveIndex == 1, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/delivery.png"
								alt=""
							/>
							<span>运输凭证</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.transportDocument"
							v-mainTip="`${assetValidateList.transportDocument}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.transportDocument }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['transportDocument']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(2)"
					v-if="secondaryMenu['qualityDocument'].length"
				>
					<div :class="{ blue: myactiveIndex == 2, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/test.png"
								alt=""
							/>
							<span>数质量凭证</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.qualityDocument"
							v-mainTip="`${assetValidateList.qualityDocument}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.qualityDocument }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['qualityDocument']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(3)"
					v-if="secondaryMenu['goodsTransferDocument'].length"
				>
					<div :class="{ blue: myactiveIndex == 3, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/goodsTransfer.png"
								alt=""
							/>
							<span>货转凭证</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.goodsTransferDocument"
							v-mainTip="`${assetValidateList.goodsTransferDocument}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.goodsTransferDocument }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['goodsTransferDocument']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.secondaryCategoryDesc }}-{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(4)"
					v-if="secondaryMenu['accountsTable'].length"
				>
					<div :class="{ blue: myactiveIndex == 4, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/accounts.png"
								alt=""
							/>
							<span>核算表</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.accountsTable"
							v-mainTip="`${assetValidateList.accountsTable}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.accountsTable }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['accountsTable']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(5)"
					v-if="secondaryMenu['confirmLetter'].length"
				>
					<div :class="{ blue: myactiveIndex == 5, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/confirm.png"
								alt=""
							/>
							<span>确认函</span>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['confirmLetter']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(8)"
					v-if="secondaryMenu['settlesFiles'].length"
				>
					<div :class="{ blue: myactiveIndex == 8, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/contract.png"
								alt=""
							/>
							<span>结算单</span>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['settlesFiles']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(6)"
					v-if="secondaryMenu['invoice'].length"
				>
					<div :class="{ blue: myactiveIndex == 6, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/invoice.png"
								alt=""
							/>
							<span>发票</span>
						</div>
						<div
							class="validate"
							v-if="assetValidateList.invoice"
							v-mainTip="`${assetValidateList.invoice}项错误`"
						>
							<div class="ellipsis">·{{ assetValidateList.invoice }}项错误</div>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['invoice']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
				<div
					class="tabs-text"
					@click="tabChange(7)"
					v-if="secondaryMenu['otherFiles'].length"
				>
					<div :class="{ blue: myactiveIndex == 7, 'tabs-text-title': true }">
						<div class="tabs-text-title-main">
							<img
								src="@sub/assets/imgs/assets/file.png"
								alt=""
							/>
							<span>其他材料</span>
						</div>
					</div>
					<template v-for="(item, index) in secondaryMenu['otherFiles']">
						<div
							v-if="item.status == 1"
							:key="index"
							:class="{ 'contract-subitem': true, required: item.required }"
						>
							{{ item.itemDesc.replace('上传', '') }}
							<a-tooltip v-if="item.conditionDesc">
								<template slot="title">
									{{ item.conditionDesc }}
								</template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
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

export default {
	name: 'LeftTabs',
	props: {
		detailData: {
			type: Object,
			default: () => null
		},
		audit: {
			type: Boolean,
			default: false
		},
		isBank: {
			type: Boolean,
			default: false
		},
		toolTipVisible: {
			type: Boolean,
			default: false
		},
		activeIndex: {
			type: [String, Number],
			default: '0'
		}
	},
	components: {},
	data() {
		return {
			tabs: [],
			myactiveIndex: this.activeIndex,
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
					label: '下游合同信息(双签)',
					value: 'CONTRACT_DOWN_DSIGN',
					children: []
				},
				{
					label: '下游合同信息(单签)',
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
			downContractStatus: 1
		};
	},
	watch: {
		detailData: {
			immediate: true,
			deep: true,
			handler(val) {
				this.downContractStatus =
					this.detailData?.contractInfo?.isOnlineContract == 1
						? this.detailData?.contractInfo?.downOnlineContract?.signStatus
						: this.detailData?.contractInfo?.downContract.status;
				this.setLeftMenus();
			}
		},
		activeIndex(data) {
			this.myactiveIndex = data;
		}
	},
	mounted() {},
	computed: {
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		assetValidateList() {
			if (this.type !== 'admin' || !this.audit) {
				return {};
			}
			let assetValidateList = {};
			[
				'contract',
				'transportDocument',
				'qualityDocument',
				'goodsTransferDocument',
				'accountsTable',
				'confirmLetter',
				'invoice',
				'otherFiles'
			].forEach(item => {
				let _list = this.detailData[menuMap[item]]?.assetValidateList || this.detailData[menuMap[item]]?.paymentValidates;
				assetValidateList[item] = _list?.length || 0;
			});
			return assetValidateList;
		}
	},
	methods: {
		setLeftMenus() {
			[
				'contract',
				'transportDocument',
				'qualityDocument',
				'goodsTransferDocument',
				'accountsTable',
				'confirmLetter',
				'invoice',
				'otherFiles'
			].map(i => this.checkMenuShow(i));
		},
		tabChange(index) {
			this.myactiveIndex = index;
			this.$emit('tabChange', index);
			this.$refs.tabBar.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
		},
		checkMenuShow(type) {
			let detailData = this.detailData;
			let _list = detailData[menuMap[type]]?.bankProductAssetConfigList || [];
			_list = _list.filter(i => i.status == 1);
			this.secondaryMenu[type] = _list || [];
			// 如果是金融机构，文件数据为空也不展示
			// 核算表，确认函，其他附件
			if (this.isBank) {
				if (['accountsTable', 'confirmLetter', 'otherFiles'].includes(type) && !detailData[menuMap[type]]?.list?.length)
					this.secondaryMenu[type] = [];
			}
			if (type == 'contract') {
				// 重置值
				this.contractSecondAry = this.contractSecondAry.map(i => {
					return {
						...i,
						children: []
					};
				});
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
				if (detailData.receivalVO?.type == 'PROOF') {
					this.secondaryMenu[type] = [];
					return false;
				}
			}
			// 没有bankProductAssetConfigList 直接不显示
			if (!_list?.length) return false;
			return true;
		}
	}
};
</script>
<style lang="less" scoped>
.coal-tab {
	.tabs-bar {
		position: relative;
		display: flex;
		flex-direction: column;
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
	.tabs-bar .tabs-text {
		cursor: pointer;
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
		.tabs-text-title {
			font-family: PingFang SC;
			padding: 14px 0;
			display: flex;
			color: rgba(0, 0, 0, 0.8);
			.tabs-text-title-main {
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
			.validate {
				flex: auto;
				text-align: right;
				margin-left: 4px;
				.ellipsis {
					color: #dd4444;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			&.blue {
				.tabs-text-title-main {
					color: @primary-color;
					font-weight: 500;
					img {
						filter: brightness(150%);
					}
				}
			}
		}
		.contract-item {
			line-height: 20px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.4);
			.contract-item-title {
				padding: 11px 0;
			}
		}
		.contract-subitem {
			padding: 11px 0 11px 12px;
			color: rgba(0, 0, 0, 0.8);
			&.required {
				position: relative;
				&::before {
					display: inline-block;
					color: #ea5530;
					font-size: 14px;
					font-family: SimSun, sans-serif;
					line-height: 1;
					content: '*';
					vertical-align: middle;
					position: absolute;
					top: 50%;
					bottom: 50%;
					margin: auto;
					left: 0;
					height: 12px;
				}
			}
		}
	}
	.hidden-text .tabs-text {
		.contract-item,
		.contract-subitem {
			display: none;
		}
	}
}
</style>
