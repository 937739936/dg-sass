<template>
	<div class="business-line-detail-header">
		<div class="business-line-top-contain">
			<div class="business-line-title-contain">
				<div class="slTitle">
					<span>业务线详情</span>
				</div>
				<a-tooltip>
					<template
						slot="title"
						v-if="rejectStatusList.includes(detailDataNotEmpty.businessLineDisplayStatus)"
					>
						<p v-if="detailDataNotEmpty.upStreamRejectReason">上游驳回：{{ detailDataNotEmpty.upStreamRejectReason }}</p>
						<p v-if="detailDataNotEmpty.downStreamRejectReason">下游驳回：{{ detailDataNotEmpty.downStreamRejectReason }}</p>
					</template>
					<span
						class="text status"
						:class="detailDataNotEmpty.businessLineDisplayStatus"
						>{{ detailDataNotEmpty.businessLineDisplayStatusDesc }}</span
					>
				</a-tooltip>
			</div>
			<slot name="businessLineHeaderExtra"></slot>
		</div>
		<div class="business-line-chain-contain-wrap">
		<div
			ref="chainScrollWrap"
			class="business-line-chain-contain"
			:class="isShowFixedTitle ? (platformType === 'REST' ? 'fixed' : 'fixed_admin') : ''"
		>
			<template v-if="isNeedScroll">
				<div
					class="chain-left-arrow"
					@click="slide('left')"
				></div>
				<div
					class="chain-left-cover"
					v-show="isShowLeftCover"
				></div>
			</template>
			<div
				class="business-line-chain"
				ref="chainContainer"
			>
				<div
					v-for="(item, index) in businessLineChain"
					:key="index"
					class="business-line-chain-item"
				>
					<div
						:class="`business-line-chain-company business-line-item-${item.key} type-${item.type} company-${
							item.key === selectCompanyKey ? 'slected' : 'normal'
						}`"
						@click="handleClickCompany(item)"
					>
						<span>{{ item.companyName }}</span>
						<div
							class="company-mark"
							v-if="item.key === selectCompanyKey"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								fill="none"
								style="vertical-align: top"
							>
								<path
									d="M0 4C0 1.79086 1.79086 0 4 0H14V12C14 13.1046 13.1046 14 12 14H0V4Z"
									:fill="companyMarkFillColor(item.type)"
								/>
								<path
									d="M11.3159 5.23242L6.72574 9.442L4.23242 6.94531"
									stroke="white"
									stroke-width="1.6"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</div>
					<p
						v-if="index !== businessLineChain.length - 1"
						style="margin: 0 12px"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="14"
							viewBox="0 0 16 14"
							fill="none"
						>
							<path
								d="M7 12.9777C7 13.3938 7.47854 13.6278 7.80697 13.3724L15.4926 7.39468C15.7499 7.1945 15.7499 6.8055 15.4926 6.60532L7.80697 0.627643C7.47854 0.372199 7 0.606245 7 1.02232L7 4H0.5C0.223858 4 0 4.22386 0 4.5V9.5C0 9.77614 0.223858 10 0.5 10H7V12.9777Z"
								fill="#9AB5D7"
							/>
						</svg>
					</p>
				</div>
			</div>
			<template v-if="isNeedScroll">
				<div v-show="isShowRightCover" class="chain-right-cover"></div>
				<div
					class="chain-right-arrow"
					@click="slide('right')"
				></div>
			</template>
		</div>
		</div>
	</div>
</template>

<script>
import { max } from 'moment';
export default {
	name: 'DetailHeader',
	props: {
		title: {
			type: String,
			default: ''
		},
		detailData: {
			type: Object,
			default: () => ({})
		},
		platformType: {
			type: String,
			default: 'REST'
		}
	},
	data() {
		return {
			selectCompanyKey: 'buy',
			chainMaxScrollLeft: 0, // 最大滚动距离
			slideStep: 100, // 滑动步长
			isNeedScroll: false, // 是否需要滚动
			isShowLeftCover: false, // 是否显示左侧覆盖
			isShowRightCover: false, // 是否显示右侧覆盖
		};
	},
	mounted() {
		// this.selectCompanyKey = 'buy';
		this.businessLineChainConfig();
	},
	watch: {
		// 监听业务线链变化
		businessLineChain: {
			deep: true,
			handler(newVal, oldVal) {
				this.businessLineChainConfig();
			}
		}
	},
	computed: {
		detailDataNotEmpty() {
			return this.detailData || {};
		},
		rejectStatusList() {
			return [
				'COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING',
				'UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT'
			];
		},
		// 核心链
		coreChainList() {
			let detailData = this.detailDataNotEmpty;
			if (!detailData.upStreamSellerCompany) {
				return [];
			}
			let coreChain = [
				{ companyName: '上游：' + detailData.upStreamSellerCompany, type: 'DIRECTLY_UPDOWN', key: 'buy' },
				{ companyName: detailData.coreCompany, type: 'CORE', key: 'core' },
				{ companyName: '下游：' + detailData.downStreamBuyerCompany, type: 'DIRECTLY_UPDOWN', key: 'sell' }
			];
			return coreChain;
		},
		// 全业务线链
		businessLineChain() {
			let detailData = this.detailDataNotEmpty;
			if (!detailData.upStreamSellerCompany) {
				return [];
			}
			let coreChain = [...this.coreChainList];
			let upContractVOList = detailData.upContractVOList || [];
			let upupList = [];
			upContractVOList.forEach(item => {
				upupList.push({ companyName: item.sellerCompanyName, type: 'OTHER', key: 'upup' + item.id, contractInfo: item });
			});
			let downContractVOList = detailData.downContractVOList || [];
			let downdownList = [];
			downContractVOList.forEach(item => {
				downdownList.push({ companyName: item.buyerCompanyName, type: 'OTHER', key: 'downdown' + item.id, contractInfo: item });
			});
			let chain = upupList.concat(coreChain).concat(downdownList);
			return chain;
		},
		isShowFixedTitle() {
			if (this.platformType == 'REST') {
				return this.$store.state.scroll.scrollDistance >= 108;
			}
			return this.$store.state.scroll.scrollDistance >= 72;
		},
	},
	methods: {
		handleClick() {
			this.$emit('click');
		},
		companyMarkFillColor(type) {
			if (type === 'DIRECTLY_UPDOWN') {
				return 'var(--primary-color)';
			} else if (type === 'OTHER') {
				return '#77889D';
			} else {
				return '#fff';
			}
		},
		// 响应点击企业事件
		handleClickCompany(item) {
			if (item.type === 'CORE') {
				// 核心企业不响应点击事件
				return;
			}
			this.$emit('changeSelectCompany', item);
			this.changeSelectCompanyKey(item.key);
			this.scrollToSelectCompany(item);
		},
		changeSelectCompanyKey(key) {
			this.selectCompanyKey = key;
		},
		// 业务线链滚动条距离左侧距离
		chainScrollLeft() {
			const chainContainer = this.$refs.chainContainer;
			return chainContainer.scrollLeft || 0;
		},
		// 滚动到选中的企业
		scrollToSelectCompany(item){
			if (!this.isNeedScroll) {
				return;
			}
			const className = `business-line-item-${item.key}`
			const elements = document.getElementsByClassName(className); 
			if (elements.length === 0) {
				return;
			}
			let element = elements[0];
			// 减去30是避免遮挡
			let leftPosition = element.offsetLeft - 30; 
			console.log('当前企业offsetLeft: ', element.offsetLeft, 'leftPosition: ', leftPosition);
			this.chainContainerScrollToLeft(leftPosition);
		},
		// 点击滑动业务线链
		slide(direction) {
			const step = this.slideStep;
			let left = this.chainScrollLeft();
			if (direction === 'left') {
				left -= step;
			} else {
				left += step;
			}
			this.chainContainerScrollToLeft(left);
		},
		chainContainerScrollToLeft(left) {
			const chainContainer = this.$refs.chainContainer;
			if (!chainContainer) {
				return;
			}
			console.log('chainContainerScrollToLeft  current: ', chainContainer.scrollLeft,'new: ',left);
			chainContainer.scrollTo({
				top: 0,
				left: left,
				behavior: 'smooth'
			});
			this.$nextTick(() => {
				this.isShowLeftCover = left > 0
				this.isShowRightCover = left < this.chainMaxScrollLeft
			});
		},
		// 流程链配置
		businessLineChainConfig() {
			// 使用 $nextTick 确保 DOM 更新完成
			this.$nextTick(() => {
				const element = this.$refs.chainContainer;
				if (element) {
					// 配置是否需要滑动（检查 scrollWidth 是否大于 offsetWidth）
					this.isNeedScroll = element.scrollWidth > element.offsetWidth;
					// 计算最大滚动距离其实是其父视图再去掉两边的距离56
					this.chainMaxScrollLeft = element.scrollWidth - element.clientWidth + 56;
					this.slideStep = Math.ceil(element.scrollWidth / this.businessLineChain.length);
					// 配置滑动到直接上游企业
					if(this.coreChainList.length > 0){
						this.$nextTick(() => {
							this.handleClickCompany(this.coreChainList[0]);
						});
					}
				}
			});
		},
	}
};
</script>

<style lang="less" scoped>
.business-line-detail-header {
	border-radius: 4px;
	// padding: 20px 0 30px 30px;
	background-color: #fff;
	.business-line-top-contain {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.business-line-title-contain {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.status {
			display: inline-block;
			padding: 3px 6px;
			align-items: flex-start;
			gap: 10px;
			border-radius: 4px;
			font-family: PingFang SC;
			font-size: 12px;
			margin-left: 4px;
			background: #ffdac8;
			color: #ff7937;
			margin-left: 20px;
			cursor: pointer;
			text-align: center;
		}
		.COMPLETED_AUDIT_REJECT,
		.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING,
		.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS,
		.UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING,
		.UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT {
			background: #f2d0d0;
			color: #d44;
		}
		.EXECUTING {
			background: #c1d7ff;
			color: var(--VI-, #4682f3);
		}
	}
	.business-line-chain-contain-wrap {
		margin-top: 20px;
		height: 36px;
	}
	.business-line-chain-contain {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-top: 20px;
		overflow-x: hidden;
		.business-line-chain {
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			overflow-x: hidden;
			overflow-y: hidden;
			-webkit-scrollbar {
				display: none;
			}
			white-space: nowrap;
			min-height: 36px;
			&.fixed {
				position: fixed;
				top: 63px;
				left: 208px;
				z-index: 1000;
				margin-left: 20px;
			}
			.business-line-chain-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.business-line-chain-company {
					position: relative;
					min-height: 36px;
					padding: 0 12px;
					border-radius: 4px;
					border: 1px solid @primary-color;
					font-family: 'PingFang SC';
					font-size: 16px;
					color: @primary-color;
					font-weight: 500;
					text-align: center;
					line-height: 34px;
					padding-right: 12px;

					.company-mark {
						position: absolute;
						bottom: 0;
						right: 0;
						font-size: 0;
						width: 14px;
						height: 14px;
					}
					&.company-slected {
						padding-right: 20px;
					}
					&.company-normal {
						padding-right: 12px;
					}
					&.type-CORE {
						background: @primary-color;
						color: #fff;
						cursor: default;
					}
					&.type-DIRECTLY_UPDOWN {
						background: var(--VI-, #fff);
						border: 1px solid @primary-color;
						color: @primary-color;
						cursor: pointer;
					}
					&.type-OTHER {
						background: var(--VI-, #fff);
						border: 1px solid #77889d;
						color: #77889d;
						cursor: pointer;
					}
				}
			}
		}
	}
	.chain-left-arrow {
		flex-shrink: 0;
		padding-right: 16px;
		width: 28px;
		min-height: 36px;
		background: url(~@sub/assets/imgs/common/left_arrow_normal.png) no-repeat left;
		background-size: 12px 12px;
		cursor: pointer;
	}
	.chain-left-arrow:hover {
		background: url(~@sub/assets/imgs/common/left_arrow_active.png) no-repeat left;
		background-size: 12px 12px;
	}
	.chain-right-arrow {
		flex-shrink: 0;
		padding-left: 16px;
		width: 28px;
		min-height: 36px;
		background: url(~@sub/assets/imgs/common/right_arrow_normal.png) no-repeat right;
		background-size: 12px 12px;
		cursor: pointer;
	}
	.chain-right-arrow:hover {
		background: url(~@sub/assets/imgs/common/right_arrow_active.png) no-repeat right;
		background-size: 12px 12px;
	}
	.chain-left-cover {
		position: absolute;
		top: 0;
		left: 28px;
		width: 30px;
		height: 100%;
		// background: #d44;
		z-index: 99;
		background: linear-gradient(-90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}
	.chain-right-cover {
		position: absolute;
		top: 0;
		right: 28px;
		width: 30px;
		height: 100%;
		z-index: 99;
		// background: #d44;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}
	.fixed,
	.fixed_admin {
		height: 64px;
		background: #f8fcfe;
		padding: 0 30px;
		position: fixed;
		top: 64px;
		left: 208px;
		z-index: 1000;
		margin-left: 20px;
		margin-top: 0;
		width: calc(100% - 254px);
		border: 1px solid #e5e6eb;
		border-left: 0;
		border-right: 0;
		.chain-left-cover {
			left: 58px;
		}
		.chain-right-cover {
			right: 58px;
		}
	}
	.fixed_admin {
		padding: 0 20px;
		margin-left: 4px;
		width: calc(100% - 230px);
		top: 110px;
		.chain-left-cover {
			left: 48px;
		}
		.chain-right-cover {
			right: 48px;
		}
		// padding-top: 15px;
	}
}
</style>