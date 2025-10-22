<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-row class="slMainFlex">
			<a-col class="slMainLeft">
				<div :class="[contractFixedVisible ? 'contract-create-preview-fixed' : 'contract-create-preview']">
					<a-card :bordered="false">
						<div
							slot="title"
							class="slTitle"
						>
							<span>{{ $route.query.flag === 'edit' ? '编辑' : '新增' }}电子补充协议</span>
						</div>
						<!-- tabs -->
						<a-tabs :defaultActiveKey="1">
							<a-tab-pane
								:key="1"
								tab="补充协议"
							>
								<div class="preview-wrap">
									<SupplePdf :contractData="contractData"></SupplePdf>
								</div>
							</a-tab-pane>
							<a-tab-pane
								:key="2"
								tab="原合同"
							>
								<div class="preview-wrap">
									<ContractPdf :url="contractData.contractPdfUrl"></ContractPdf>
								</div>
							</a-tab-pane>
							<div
								slot="tabBarExtraContent"
								@click="fullScreenView"
							>
								<FullScreenIcon class="fullScreenIcon"></FullScreenIcon>
								<span class="blue">全屏预览</span>
							</div>
						</a-tabs>
					</a-card>
				</div>

				<a-card
					:bordered="false"
					class="'contract-create-form chang-box"
					:class="[contractFixedVisible ? 'contract-create-form-fixed' : 'contract-create-form']"
				>
					<!-- 二级标题 -->
					<ChangeItemList
						ref="changeItemList"
						@send="getSensibilityList"
					></ChangeItemList>
				</a-card>
			</a-col>
		</a-row>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="saveModel"
					:loading="disabled"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					:loading="disabled"
					>提交</a-button
				>
			</a-space>
		</div>

		<PreviewModal
			ref="previewModal"
			:contractData="contractData"
		/>
		<BackModal
			ref="backModal"
			@save="saveModel"
		></BackModal>
		<ConfirmModal
			ref="confirmModal"
			title="敏感词提示"
			cancelBtnText="继续执行下一步"
			btnTip="返回修改"
			@cancel="executeNext"
			@save="backEdit"
		>
			<div class="sensibility">
				<p class="sensibility-tip1">
					您提交的数据中存在以下敏感词，建议您进行修改，如不修改，可能影响您合同后续的执行或融资，建议您线下先和平台运营或风控做好确认。
				</p>
				<p class="sensibility-tip2">敏感词列表</p>
				<div class="sensibility-content">
					{{ sensitiveWordsList }}
				</div>
			</div>
		</ConfirmModal>
		<TipModal
			ref="saveModal"
			title="确认提交"
			tip="提交后，请对补协进行盖章，盖章后将由对方进行确认盖章，双方盖章后，补协将生效，确认提交吗？"
			@save="saveSubmit"
		></TipModal>
		<!-- 审批流 -->
		<SelectApprovalProcess
			ref="selectApprovalProcess"
			@updateFunc="getApproval"
		></SelectApprovalProcess>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters, mapMutations } from 'vuex';
import SelectApprovalProcess from './components/SelectApprovalProcess.vue';
import breadcrumb from '@/v2/components/breadcrumb/index';

import ContractPdf from './components/pdf/Contract.vue';
import SupplePdf from './components/pdf/Supple.vue';
import BackModal from './components/BackModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import TipModal from './components/TipModal.vue';

import ChangeItemList from './components/ChangeItemList.vue';

import ContractPdfModal from '../components/ContractPdfModal.vue';
import PreviewModal from './components/PreviewModal.vue';

import { cloneDeep, throttle } from 'lodash';

import { API_getOrderContractDetailById } from '@/v2/center/trade/api/contract';

import { saveDraft, getOnlineSuppleDetail, submit } from '@/v2/center/trade/api/suppleAgreement';

import { API_SensitiveWordsCheck, API_COMPANYOACHECK } from '@/v2/center/trade/api/contract';
import { FlateStream } from 'pdfjs-sig/build/pdf.worker';
import { FullScreenIcon } from '@sub/components/svg';

export default {
	name: 'ContractOnLineAddTwo',

	data() {
		return {
			getPopupContainer,

			contractType: this.$route.query.type, //
			tabsData: [
				{
					name: '合同预览',
					key: 1
				},
				{
					name: '承诺函预览',
					key: 2
				}
			],
			contractFixedVisible: false,
			// 合同详情 包含所有
			contractData: {
				contract: {}
			},
			// 大部分合同信息
			contractInfo: {},
			completedSuppleAgreement: [],
			// 补协详情
			suppleDetail: {},
			cacheInfo: {},
			disabled: false,
			sensitiveWordsList: '',
			isOa: false,
			// 审批流信息
			auditChainInfo: {}
		};
	},
	components: {
		breadcrumb,
		ContractPdf,
		SupplePdf,
		ChangeItemList,
		PreviewModal,
		BackModal,
		ConfirmModal,
		TipModal,
		SelectApprovalProcess,
		FullScreenIcon
	},
	computed: {
		signDate() {
			return this.$store.state.supple.signDate;
		},
		changeData() {
			return this.$store.state.supple.changeData;
		},
		signContent() {
			return this.$store.state.supple.signContent;
		},
		oldDeliveryModeItem() {
			return this.$store.state.supple.oldDeliveryModeItem;
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 审批流程 判断 当前企业 在合同中 是否是发起方
		auditChainAndOperator() {
			if (this.VUEX_ST_COMPANYSUER.companyUscc == this.contractInfo.initiatorUscc) {
				return this.contractInfo.auditChainAndOperator;
			}
			return this.contractInfo.receiveAuditChainAndOperator;
		}
	},
	async created() {
		this.handleScroll();
	},
	mounted() {
		this.getContractData();
		this.checkIsOa();
		this.$store.commit('supple/updateSignDate', '');
		this.$store.commit('supple/updateChangeData', []);
		this.$store.commit('supple/updateSignContent', '');
	},
	// 路由跳转之前恢复样式
	beforeRouteLeave(to, from, next) {
		var bread = document.querySelector('.breadcrumb-wrap');
		var head = document.querySelector('Header');
		var lw = document.querySelector('#mainContent');
		var sideMenu = document.querySelector('.side-menu');
		bread.style.display = 'block';
		head.style.display = 'block';
		lw.style.height = '100%';
		sideMenu.style.height = '100%';
		next();
	},
	methods: {
		/** 获取合同详情 */
		async getContractData() {
			const params = {
				orderId: this.$route.query.orderId
			};
			const res = await API_getOrderContractDetailById(params);
			this.contractData = res.data;
			this.contractInfo = { ...res.data.contract, ...res.data.contractDelivery, contractPdfUrl: res.data.contractPdfUrl };
			await this.getOnlineSuppleDetail();
			this.$nextTick(() => {
				this.$refs.changeItemList.API_getTempleteByCode(this.contractInfo, this.suppleDetail);
			});
		},
		async getOnlineSuppleDetail() {
			if (!this.$route.query.id) {
				return;
			}
			const params = {
				id: this.$route.query.id
			};
			const res = await getOnlineSuppleDetail(params);

			this.suppleDetail = res.data;
			this.cacheInfo = cloneDeep(this.suppleDetail);
			this.$store.commit('supple/updateContractTermType', this.suppleDetail.contractTermType);
			return res.data;
		},
		fullScreenView() {
			this.$refs.previewModal.showModal();
		},
		goBack() {
			// 判断是新增
			if (this.$route.query.id) {
				const oldChangeItems = this.cacheInfo.changeItems.map(el => {
					return {
						description: el.description,
						regulation: el.regulation,
						itemDetails: el.itemDetails.map(el2 => {
							return {
								value: el2.value
							};
						})
					};
				});

				let newChangeItems = this.changeData.map(el => el.changeItem);
				newChangeItems = newChangeItems.map(el => {
					el.itemDetails = el.itemDetails || [];
					return {
						description: el.description,
						regulation: el.regulation,
						itemDetails: el.itemDetails.map(el2 => {
							return {
								value: el2.value
							};
						})
					};
				});

				if (
					JSON.stringify(oldChangeItems) == JSON.stringify(newChangeItems) &&
					this.signDate == this.cacheInfo.signDate &&
					this.signContent == this.cacheInfo.signContent
				) {
					this.$router.go(-1);
				} else {
					this.$refs.backModal.open(true);
				}
			} else {
				if (this.signContent || this.changeData.length || this.signDate) {
					this.$refs.backModal.open(true);
				} else {
					this.$router.go(-1);
				}
			}
		},
		// 获取敏感词
		getSensibilityList(str) {
			this.sensitiveWordsList = str;
		},
		async submit() {
			const flag = await this.$refs.changeItemList.save();

			if (!flag) {
				return;
			}

			if (!this.signContent && !this.changeData.length) {
				this.$message.error('请至少选择一个补充约定');
				return;
			}
			/** 判断是否有敏感词 */

			let list = [];
			if (this.signContent) {
				const params = {
					content: this.signContent.split(',')
				};
				const res = await API_SensitiveWordsCheck(params);
				list = res.data;
				this.sensitiveWordsList = list.join('，');
			}

			if (list.length) {
				this.$refs.confirmModal.open();
			} else {
				/** 判断 是否需要oa */

				if (this.isOa) {
					this.$refs.selectApprovalProcess.show({}, this.auditChainAndOperator);
				} else {
					this.openSubmit();
				}
			}
		},
		backEdit() {
			this.$refs.confirmModal.close();
		},
		executeNext() {
			if (this.isOa) {
				this.$refs.selectApprovalProcess.show({}, this.auditChainAndOperator);
			} else {
				this.openSubmit();
			}
		},
		openSubmit() {
			this.$refs.confirmModal.close();
			this.$refs.saveModal.open();
		},
		async checkIsOa() {
			const res = await API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc });
			this.isOa = res.result;
		},
		// saveOaCheck() {
		//   this.$refs.selectApprovalProcess.show()
		// },
		// 获取审批流
		getApproval(info) {
			this.auditChainInfo = info;
			this.saveSubmit();
		},
		async saveSubmit() {
			const commonParams = this.assemblyParams();

			commonParams.changeItems.forEach(el => {
				if (el.fieldName == 'basePriceDesc') {
					el.fieldName = 'basePrice';
					el.itemDetails = el.itemDetails || [];
					el.itemDetails.forEach(el2 => {
						if (el2.itemName == 'basePriceDesc') {
							el2.itemName = 'basePrice';
						}
					});
				}
			});
			const params = {
				...commonParams,

				orderParamRequest: {
					contract: this.contractData.contract,
					contractDelivery: this.contractData.contractDelivery
				}
			};
			// 审批流信息
			if (this.auditChainInfo.chainCode) {
				params.initiatorAuditChainAndOperator = this.auditChainInfo;
			}

			if (this.disabled) {
				return;
			}
			this.disabled = true;
			try {
				const res = await submit(params);
				this.disabled = false;
				this.$refs.saveModal.close();
				this.$message.success('提交成功');
				this.$router.go(-1);
			} catch (error) {
				this.disabled = false;
			}
		},
		handleScroll() {
			this.$nextTick(() => {
				var bread = document.querySelector('.breadcrumb-wrap');
				var head = document.querySelector('Header');
				// var flexRight = document.querySelector(".slMainRight")
				var lw = document.querySelector('#mainContent');
				var sideMenu = document.querySelector('.side-menu');
				this.scroll_ = () => {
					clearTimeout(this.interval);
					this.topValue1 = lw.scrollTop;
					if (lw.scrollTop === 0) {
						bread.style.display = 'block';
						head.style.display = 'block';
						// flexRight.style.top = -50;
						this.contractFixedVisible = false;
						lw.style.height = '100%';
						sideMenu.style.height = '100%';
					} else {
						bread.style.display = 'none';
						head.style.display = 'none';
						// flexRight.style.top = 0;
						this.contractFixedVisible = true;
						lw.style.height = '100vh';
						sideMenu.style.height = '100vh';
					}
				};
				lw.addEventListener('scroll', this.scroll_);
			});
		},
		// 拼装参数
		assemblyParams() {
			let changeItems = this.changeData.map(el => el.changeItem);

			changeItems.forEach((el, i) => {
				el.changeItemStr = this.changeData[i].des;
				if (el.fieldName == 'quantity') {
					el.changeItemStr = el.changeItemStr.replace(/%/g, '&&');
				}
				if (el.fieldName == 'transportMode') {
					el.oldFileValue = this.oldDeliveryModeItem.map(el => `${el.title}：${el.value}`);
				}

				el.itemDetails = el.itemDetails || [];
				el.itemDetails.forEach(el2 => {
					if (Array.isArray(el2.value)) {
						el2.value = el2.value.join(',');
					}
				});
			});

			const params = {
				contractNo: this.contractData.contractNo,
				id: this.$route.query.id,
				changeItems,
				signContent: this.signContent,
				signDate: this.signDate,
				contractTermType: this.$store.state.supple.contractTermType
				// changeItemStrList: this.changeData.map(el => el.des),
			};
			return params;
		},

		// 保存
		async saveModel() {
			const flag = await this.$refs.changeItemList.save();

			if (!flag) {
				var lw = document.querySelector('#mainContent');

				if (!this.signDate) {
					lw.scrollTo(0, 0);
				}
				return;
			}

			if (!this.signContent && !this.changeData.length) {
				this.$message.error('请至少选择一个补充约定');
				return;
			}

			if (this.disabled) {
				return;
			}
			this.disabled = true;
			try {
				const res = await saveDraft(this.assemblyParams());
				this.disabled = false;
				this.$message.success('保存成功');
				this.$router.go(-1);
			} catch (error) {
				this.disabled = false;
			}
		}
	},
	// 清除scroll事件
	destroyed() {
		var lw = document.querySelector('#mainContent');
		lw.removeEventListener('scroll', this.scroll_);
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-bottom: -40px;
}
// 右侧无圆角
.noRightBorderRadius {
	border-radius: 4px 0 0 4px;
}
// 输入框后跟图标
.inputsuffixIcon {
	display: inline-block;
	width: 32px;
	height: 32px;
	background: #f3f5f6;
	border-radius: 0px 4px 4px 0px;
	border: 1px solid #e5e6eb;
	border-left: none;
	line-height: 32px !important;
	text-align: center;
}
// 交货方式下拉选择框样式
.ant-select-dropdown-menu-item {
	white-space: wrap;
	padding: 9px 12px;
	.tips {
		font-size: 12px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.25);
		line-height: 17px;
		margin-top: 8px;
	}
}

.mb0 {
	margin-bottom: 0;
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 916px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 9;
}
.slMain {
	position: relative;
	.slMainFlex {
		width: 100%;
		display: flex;
		.slMainLeft,
		.contract-create-preview,
		.contract-create-preview-fixed {
			width: 100%;
			// min-width: 916px;
			overflow: hidden;
			position: relative;
			.ant-card {
				margin-bottom: 20px;
			}
			.ant-card:last-child {
				margin-bottom: 0;
			}
		}
		.contract-create-preview {
			padding-bottom: 0;
			.ant-card:last-child {
				margin-bottom: 20px;
			}
		}
	}
	.formItemFlex {
		::v-deep.ant-form-item-children {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
		}
		.flexRight {
			width: 32px;
		}
	}
	.ant-tabs {
		margin-bottom: 0;
	}
}
.red {
	color: #dd4444;
}
.error-tip {
	padding-left: 20px;
	zoom: 0.85;
}
.blue {
	color: @primary-color;
	.dot {
		background-color: @primary-color;
	}
}
::v-deep.ant-tabs {
	margin-bottom: 30px;
	.ant-tabs-extra-content {
		cursor: pointer;
		.fullScreenIcon {
			display: inline-block;
			margin-right: 3px;
			position: relative;
			top: 2px;
		}
	}
}
::v-deep.ant-tabs-tabpane {
	height: 168px;
}
.slSpace {
	width: 20px;
	height: 100%;
	background: #f3f5f6;
}

.slModal.submitValidateModal {
	min-width: 408px;
	.infoBox {
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 32px;
		margin-top: 10px;
		p {
			padding-left: 13px;
			.label {
				display: inline-block;
				width: 70px;
				text-align: right;
			}
		}
		p:nth-child(2n) {
			background: #f3f5f6;
		}
	}
	.label {
		color: rgba(0, 0, 0, 0.4);
	}
}
.preview-wrap {
	height: 168px;
	width: 100%;
	border: 1px solid #eaebed;
	overflow: hidden;
	border-top: 0;
}
.contract-create-form {
}
.contract-create-form-fixed {
	position: relative;
	top: 345px;
	padding-bottom: 345px;
	box-sizing: border-box;
}
.contract-create-preview-fixed {
	// display: none;
	position: fixed !important;
	top: 0;
	z-index: 999;
	padding-bottom: 20px;
	background: #f3f5f6;
	padding-right: 255px;
}

// 小于1660为准
@media screen and (max-width: 1599px) {
	.anchorPointItem {
		padding-left: 16px !important;
	}
	.slMainLeft,
	.contract-create-preview,
	.contract-create-preview-fixed {
		// width: calc(100%)!important;
		// min-width: 1022px!important;
	}
}
.sensibility {
	&-tip1 {
		color: rgba(0, 0, 0, 0.4);
	}
	&-tip2 {
		color: rgba(0, 0, 0, 0.4);
		margin-top: 20px;
		margin-bottom: 10px;
	}
	&-content {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		background: #f3f5f6;
		min-height: 104px;
		padding: 12px;
		color: #d44;
	}
}
</style>
