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
							<span>{{ $route.query.flag === 'edit' ? '编辑' : '新增' }}电子{{ this.typeName }}合同</span>
						</div>
						<!-- tabs -->
						<a-tabs :defaultActiveKey="1">
							<a-tab-pane
								:key="1"
								tab="合同预览"
							>
								<div class="preview-wrap">
									<Thymeleaf
										ref="thymeleafContract"
										:content="VUEX_GET_THYMELEAF_CONTENT"
										:multiGoodsNameFlag="multiGoodsNameFlag"
									/>
								</div>
							</a-tab-pane>
							<a-tab-pane
								:key="2"
								tab="承诺函预览"
								v-if="VUE_GET_THYMELEAF_COMMITMENT"
							>
								<div class="preview-wrap">
									<Thymeleaf
										ref="thymeleafCommit"
										:content="VUE_GET_THYMELEAF_COMMITMENT"
										:showCoalTitle="false"
										:multiGoodsNameFlag="multiGoodsNameFlag"
									/>
								</div>
							</a-tab-pane>
							<div
								slot="tabBarExtraContent"
								@click="fullScreenView()"
							>
								<FullScreenIcon class="fullScreenIcon"></FullScreenIcon>
								<span class="blue">全屏预览</span>
							</div>
						</a-tabs>
					</a-card>
				</div>

				<a-card
					:bordered="false"
					:class="[contractFixedVisible ? 'contract-create-form-fixed' : 'contract-create-form']"
				>
					<!-- 二级标题 -->
					<DiyForm
						v-on:clickItem="getClickItem"
						v-on:change="getChangeValue"
						:formSchema="VUEX_GET_FORM_SCHEMA"
						ref="diyForm"
					/>
				</a-card>
			</a-col>
			<a-col class="slMainRight">
				<div class="slMainRightBg">
					<p class="textLarge">填写助手</p>
					<p class="textNormal">完成必填项即可提交</p>
				</div>
				<div class="anchorPointBox">
					<template v-for="(item, index) in tipList">
						<div
							class="anchorPointItem"
							:key="index"
						>
							<AnchorIcon v-if="index == active" class="anchorPointIcon"></AnchorIcon>
							<p
								:class="index == active ? 'blue' : ''"
								@click="scrollCurrentForm(item, index)"
							>
								<span class="dot-wrap"><em class="dot"></em></span>
								<span class="dot-title">{{ tipListMap[item] }}</span>
							</p>
							<p
								class="red error-tip"
								v-if="setErrorLength(item) > 0"
							>
								{{ setErrorLength(item) }}项错误
							</p>
						</div>
					</template>
				</div>
			</a-col>
		</a-row>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="pre"
					>上一步</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="saveModel(false)"
					:loading="loadingSave"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="saveModel(true)"
					:loading="loadingSubmit"
					>提交</a-button
				>
			</a-space>
		</div>
		<ContractPdfModal
			ref="contractPdfModal"
			:multiGoodsNameFlag="multiGoodsNameFlag"
		/>
		<!-- 提交提示语弹窗 -->
		<a-modal
			class="slModal submitValidateModal"
			:visible="visible"
			title="提交"
			@cancel="
				() => {
					this.visible = false;
				}
			"
			@ok="submitMethod"
		>
			<p class="label">请确认以下信息是否有误：</p>
			<div class="infoBox">
				<p>
					<span class="label">{{ modelTitle }}企业：</span>
					<span v-if="VUEX_GET_CONTRACT_DATA.contract">{{ modelCompanyName }}</span>
				</p>
				<p>
					<span class="label"> 数量：</span>
					<span v-if="VUEX_GET_CONTRACT_DATA.contract && VUEX_GET_CONTRACT_DATA.contract.quantity">{{
						VUEX_GET_CONTRACT_DATA.contract.quantity | formatMoney(2)
					}}</span>
					<span v-if="VUEX_GET_CONTRACT_DATA.contract.quantityOffset"
						>（±{{ VUEX_GET_CONTRACT_DATA.contract.quantityOffset }}%）</span
					>
					吨
				</p>
				<p>
					<span class="label">基准价格： </span>
					<span class="red">
						<span v-if="VUEX_GET_CONTRACT_DATA.contract && VUEX_GET_CONTRACT_DATA.contract.basePrice"
							>{{ VUEX_GET_CONTRACT_DATA.contract.basePrice | formatMoney(2) }}元/吨</span
						>
						<span v-if="VUEX_GET_CONTRACT_DATA.contract && VUEX_GET_CONTRACT_DATA.contract.basePriceDesc">{{
							VUEX_GET_CONTRACT_DATA.contract.basePriceDesc
						}}</span>
					</span>
				</p>
				<p>
					<span class="label">运输方式： </span>
					{{ getTransportModeText() }}
				</p>
				<p v-if="consigneeCompanyName">
					<span class="label">收货人： </span>
					<span v-if="VUEX_GET_CONTRACT_DATA.contractDelivery">{{ consigneeCompanyName }}</span>
				</p>
			</div>
		</a-modal>
		<!-- 合同重复提示 -->
		<a-modal
			class="slModal"
			title="合同重复提示"
			:visible="visibleOrderInfo"
			@ok="handleOkOrderInfo"
			@cancel="handleCancelOrderInfo"
			cancelText="继续执行下一步"
			okText="返回修改"
			width="408px"
		>
			<p class="label">您与 #{{ companyName }}# 本月已创建过合同，存在重复创建风险，以下为已创建过的合同编号，可点击查看：</p>
			<p
				style="line-height: 24px"
				v-for="item in infoOrderList"
				:key="item.id"
			>
				<a @click="openOrderDetail(item.id)">{{ item.contractNo }}</a
				>;
			</p>
			<p class="label">如果您确定非重复创建，请点击"继续执行下一步"</p>
		</a-modal>
		<!-- 敏感词提示 -->
		<a-modal
			class="slModal"
			title="敏感词提示"
			:visible="visibleSensitiveWords"
			@ok="handleOkSensitive"
			@cancel="handleCancelSensitive"
			cancelText="继续执行下一步"
			okText="返回修改"
			width="408px"
		>
			<p class="label">
				您提交的数据中存在以下敏感词，建议您进行修改，如不修改，可能影响您合同后续的执行或融资，建议您线下先和平台运营或风控做好确认。
			</p>
			<p>敏感词列表：</p>
			<p>
				<span
					v-for="(item, index) in sensitiveWordsList"
					:key="index"
					>{{ item }}</span
				>
			</p>
		</a-modal>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters, mapMutations } from 'vuex';
import breadcrumb from '@/v2/components/breadcrumb/index';
import Thymeleaf from '@/v2/center/trade/views/contract/diy/components/Thymeleaf.vue';
import DiyForm from '@/v2/center/trade/views/contract/diy/diyForm.vue';
import ContractPdfModal from '@/v2/center/trade/views/contract/components/ContractPdfModal.vue';
import getConfigData from '@/v2/center/trade/views/contract/diy/api';
import { API_SAVESELLORDER, checkOrderInfo, API_SAVEBUYORDER } from '@/v2/center/trade/api/contract';
import { cloneDeep } from 'lodash';
import contractMixin from '@/v2/center/trade/views/contract/mixin/index';
import { FullScreenIcon, AnchorIcon } from '@sub/components/svg';

export default {
	name: 'ContractOnLineAddTwo',
	mixins: [contractMixin],
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			contractType: this.$route.query.type, //补录合同类型，
			editorContent: '',
			editor: '',
			typeText: '',
			value: '',
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
			key: 0,
			visible: false,
			visibleOrderInfo: false,
			infoOrderList: [],
			infoSeller: [],
			loadingSave: false,
			loadingSubmit: false,
			submitType: null,
			active: 0,
			companyName: '',
			apiConfigList: [
				{
					field: 'bankInfo',
					label: 'sellerBankAccountId'
				},
				{
					field: 'bankInfo',
					label: 'buyerBankAccountId'
				},
				{
					field: 'contacts',
					label: 'buyerContactsId'
				},
				{
					field: 'contacts',
					label: 'sellerContactsId'
				}
			],
			visibleSensitiveWords: false,
			sensitiveWordsList: [],
			formContentHeight: [],
			formContentScrollHeight: [],
			topValue1: 0,
			topValue2: 0,
			interval: null,
			contractFixedVisible: false
		};
	},
	components: {
		breadcrumb,
		Thymeleaf,
		DiyForm,
		ContractPdfModal,
		FullScreenIcon,
		AnchorIcon
	},
	async created() {
		this.handleScroll();
	},
	mounted() {
		this.initBankAndContactsData();
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA',
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_FORM_ERRORS: 'VUEX_GET_FORM_ERRORS',
			VUEX_GET_TRANSPORT_MODE: 'VUEX_GET_TRANSPORT_MODE',
			VUEX_GET_THYMELEAF_CONTENT: 'VUEX_GET_THYMELEAF_CONTENT',
			VUE_GET_THYMELEAF_COMMITMENT: 'VUE_GET_THYMELEAF_COMMITMENT',
			VUE_SET_FORM_LIST_SORT: 'VUE_SET_FORM_LIST_SORT',
			VUEX_GET_BANK_CONTACTS: 'VUEX_GET_BANK_CONTACTS'
		}),
		formShowItemList() {
			const result = [];
			const { formList } = this.VUEX_GET_FORM_SCHEMA;
			for (const key in formList) {
				if (!['productIndicator'].includes(key)) {
					formList[key].forEach(item => {
						if (
							(item.style.display == 'block' && item.widget == 'editor') ||
							[
								'downstreamSignCompanyName',
								'upstreamSignCompanyName',
								'shipTransportCompanyName',
								'shipTransportProtocolNo'
							].includes(item.label)
						) {
							result.push(item.label);
						}
					});
				}
			}
			return result;
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		//合同名称
		typeName() {
			return this.contractType?.toUpperCase() === 'BUY' ? '采购' : '销售';
		},
		consigneeCompanyName() {
			if (this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName) {
				if (Array.isArray(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName)) {
					return this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName?.join(',');
				} else {
					return this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName;
				}
			}
			return '';
		},
		contractRouterType() {
			return this.$route.query.type || '';
		},
		modelTitle() {
			const type = {
				sell: '买方',
				buy: '卖方'
			};
			return type[this.$route?.query?.type?.toLowerCase()];
		},
		modelCompanyName() {
			const type = this.$route?.query?.type?.toLowerCase();
			if (type == 'sell') {
				return this.VUEX_GET_CONTRACT_DATA.contract.buyerCompanyName;
			}
			return this.VUEX_GET_CONTRACT_DATA.contract.sellerCompanyName;
		},
		multiGoodsNameFlag() {
			return this.VUEX_GET_CONTRACT_DATA.contract?.multiGoodsNameFlag ? 1 : 0;
		}
	},
	watch: {
		VUEX_GET_CONTRACT_DATA: {
			handler() {
				this.$nextTick(() => {
					this.getFormContentHeight();
				});
			},
			deep: true,
			immediate: true
		}
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
		...mapMutations({
			VUE_SET_CLEAR_FORM_ERROR: 'contract/VUE_SET_CLEAR_FORM_ERROR',
			VUEX_SET_CONTRACT_OTHER_DATA: 'contract/VUEX_SET_CONTRACT_OTHER_DATA'
		}),
		filterContractData() {
			let cloneResult = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			// for(const key in cloneResult) {
			//   if(['contractExtension'].includes(key)) {
			//     for(const label in cloneResult[key]) {
			//       if(!this.formShowItemList.includes(label) && !['id'].includes(label)) {
			//         delete cloneResult[key][label];
			//       }
			//     }
			//   }
			// }
			return cloneResult;
		},
		getFormContentHeight() {
			const result = [];
			const tempList = [];
			const tempScrollList = [];
			this.tipList.forEach(item => {
				result.push(document.querySelector(`#${item}Form`).clientHeight);
			});
			for (let i = 0; i < result.length; i++) {
				if (i == 0) {
					tempList.push(result[0] / 2);
				} else {
					tempList.push(result.slice(0, i).reduce((pre, cur) => pre + cur, result[i] / 2));
				}
			}
			for (let i = 0; i < result.length; i++) {
				tempScrollList.push(result.slice(0, i + 1).reduce((pre, cur) => pre + cur, 0));
			}
			this.formContentHeight = tempList;
			this.formContentScrollHeight = tempScrollList;
		},
		scrollAndSetCurrentActive(height) {
			if (height < this.formContentHeight[0]) {
				this.active = 0;
				return;
			}
			for (let i = 0; i < this.formContentHeight.length; i++) {
				if (height >= this.formContentHeight[i] && height < this.formContentHeight[i + 1]) {
					this.active = ++i;
				}
			}
		},
		setScrollActiveIndex(height) {
			this.topValue2 = height;
			if (this.topValue1 == this.topValue2) {
				this.scrollAndSetCurrentActive(height);
			}
		},
		handleOkSensitive() {
			this.visibleSensitiveWords = false;
		},
		handleCancelSensitive() {
			this.visibleSensitiveWords = false;
			if (this.submitType) {
				this.confirm();
			} else {
				this.submitMethod();
			}
		},
		initBankAndContactsData() {
			const promiseList = [];
			this.apiConfigList.forEach(item => {
				promiseList.push(getConfigData(item));
			});
			Promise.all(promiseList).then(res => {
				this.updateBankAndContactsInfo();
			});
		},
		updateBankAndContactsInfo() {
			try {
				if (!Object.keys(this.VUEX_GET_CONTRACT_DATA?.contract)?.length) return;

				const clone_VUEX_GET_CONTRACT_DATA = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
				const { buyerBankAccountId, sellerBankAccountId, buyerContactsId, sellerContactsId } =
					this.VUEX_GET_CONTRACT_DATA.contract;
				const listBank = this.VUEX_GET_FORM_SCHEMA.formList.bankInfo.map(item => item.optionsBank).flat();
				const listContacts = this.VUEX_GET_FORM_SCHEMA.formList.contacts.map(item => item.options).flat();
				const listBankIds = listBank.map(item => item?.id).filter(item => item);
				const listContactsIds = listContacts.map(item => item?.id).filter(item => item);
				if (!listBankIds.includes(buyerBankAccountId)) {
					clone_VUEX_GET_CONTRACT_DATA.contract.buyerBankAccountId = undefined;
					this.$nextTick(() => {
						this.$refs?.diyForm?.resetFormValueByName('bankInfo', 'buyerBankAccountId');
					});
				}
				if (!listBankIds.includes(sellerBankAccountId)) {
					clone_VUEX_GET_CONTRACT_DATA.contract.sellerBankAccountId = undefined;
					this.$nextTick(() => {
						this.$refs?.diyForm?.resetFormValueByName('bankInfo', 'sellerBankAccountId');
					});
				}
				if (!listContactsIds.includes(buyerContactsId)) {
					clone_VUEX_GET_CONTRACT_DATA.contract.buyerContactsId = undefined;
					this.$nextTick(() => {
						this.$refs?.diyForm?.resetFormValueByName('contacts', 'buyerContactsId');
					});
				}
				if (!listContactsIds.includes(sellerContactsId)) {
					clone_VUEX_GET_CONTRACT_DATA.contract.sellerContactsId = undefined;
					this.$nextTick(() => {
						this.$refs?.diyForm?.resetFormValueByName('contacts', 'sellerContactsId');
					});
				}
				this.VUEX_SET_CONTRACT_OTHER_DATA(clone_VUEX_GET_CONTRACT_DATA);
			} catch (error) {
				console.error(error);
			}
		},
		handleOkOrderInfo() {
			this.visibleOrderInfo = false;
		},
		handleCancelOrderInfo() {
			this.visibleOrderInfo = false;
			this.visible = true;
		},
		openOrderDetail(item) {
			window.open(
				`/center/contract/${this.contractRouterType?.toLowerCase()}/online/detail?id=${item}&type=${this.contractRouterType}`,
				'_blank'
			);
		},
		getTransportModeText() {
			const type = this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode;
			if (type) {
				return this.VUEX_GET_TRANSPORT_MODE.filter(item => item.value === type)[0]?.label;
			}
		},
		scrollCurrentForm(key, index) {
			this.active = index;
			document.querySelector('#mainContent').scrollTo({
				top: this.formContentScrollHeight[index - 1] + 30,
				behavior: 'smooth'
			});
			// this.$refs.diyForm.scrollCurrentView(key);
		},
		setErrorLength(key) {
			if (this.VUEX_GET_FORM_ERRORS[key]) {
				// 基准质量指标特殊处理
				if (key === 'productIndicator') {
					let length = 0;
					for (const item in this.VUEX_GET_FORM_ERRORS[key]) {
						if (this.VUEX_GET_FORM_ERRORS[key][item]) {
							length = length + Object.keys(this.VUEX_GET_FORM_ERRORS[key][item]).length;
						}
					}
					return length;
				} else {
					return Object.keys(this.VUEX_GET_FORM_ERRORS[key]).length;
				}
			}
			return 0;
		},
		async getClickItem(item) {
			if (['departureStation', 'trainSendStationName', 'trainArriveStationName'].includes(item.label)) {
				await getConfigData(item);
				this.$refs.diyForm.setContractFormData();
			}
		},
		getChangeValue(value) {
			const key = Object.keys(value.values)[0];
			if (key) {
				this.$refs.thymeleafContract.scrollIntoView(key);
			}
		},
		//表单数据变化
		onValuesChange(props, values) {
			console.error(props, values);
		},
		submit() {
			this.visible = false;
		},
		// 确定提交
		confirm() {
			// 订单风险提示校验
			this.visible = false;
			const date =
				this.VUEX_GET_CONTRACT_DATA.contract?.deliveryStartDate ||
				this.VUEX_GET_CONTRACT_DATA.contractDelivery?.deliveryStartDate;
			let uscc = '';
			if (this.$route.query.type == 'BUY') {
				uscc = this.VUEX_GET_CONTRACT_DATA?.contract?.sellerCompanyUscc || this.VUEX_GET_CONTRACT_DATA?.contract?.sellerUscc;
				this.companyName = this.VUEX_GET_CONTRACT_DATA.contract.sellerCompanyName;
			} else {
				uscc = this.VUEX_GET_CONTRACT_DATA?.contract?.buyCompanyUscc || this.VUEX_GET_CONTRACT_DATA?.contract?.buyerUscc;
				this.companyName = this.VUEX_GET_CONTRACT_DATA.contract.buyerCompanyName;
			}
			checkOrderInfo({
				uscc: uscc,
				serialNo: this.$route.query.serialNo || '',
				startDate: date
			}).then(res => {
				if (res.success) {
					if (res.data?.length) {
						this.infoOrderList = res.data;
						this.visibleOrderInfo = true;
					} else {
						this.visible = true;
					}
				}
			});
		},
		saveModel(type) {
			this.$refs.diyForm.submit().then(res => {
				if (!res.includes(false)) {
					this.submitType = type;
					if (type) {
						// 提交
						this.checkSensitiveWordsList(type);
						if (!this.sensitiveWordsList.length) {
							this.confirm();
						}
					} else {
						// 保存
						this.save();
					}
				}
			});
		},
		formatArrayToString(obj) {
			for (const key in obj) {
				if (obj[key] && Array.isArray(obj[key])) {
					obj[key] = obj[key].join(',');
				}
			}
		},
		checkSensitiveWordsList() {
			const list = this.$refs.diyForm.sensitiveWordsList;
			const arr = [];
			for (const key in list) {
				arr.push(list[key]);
			}
			this.sensitiveWordsList = arr;
			if (arr.length) {
				this.visibleSensitiveWords = true;
			}
		},
		save() {
			this.checkSensitiveWordsList();
			if (this.sensitiveWordsList.length) return;
			this.submitMethod();
		},
		formateOrderIndicators(orderIndicators) {
			let cloneObj = cloneDeep(orderIndicators);
			cloneObj?.forEach(item => {
				if (item.productIndicatorList) {
					item.productIndicatorList.forEach(items => {
						if (items.inputType == 'RANGE') {
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
							items.value2 = items.valueList[items.indicatorCode + '_value2'];
						} else {
							// items.value2 = items.symbol == '无符号' ? null : items.symbol;
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
						}
					});
				}
			});
			return cloneObj;
		},
		submitMethod() {
			if (this.submitType) {
				this.loadingSubmit = true;
			} else {
				this.loadingSave = true;
			}
			this.visibleOrderInfo = false;
			this.visible = false;
			const API = this.contractType === 'BUY' ? API_SAVEBUYORDER : API_SAVESELLORDER;
			let cloneResult = cloneDeep(this.filterContractData());
			this.formatArrayToString(cloneResult.contractDelivery);
			// 如果未true 代表不关联合同 需要清除关联业务线线的信息
			if (cloneResult.contract.relateOrder) {
				cloneResult.contract.relateOrderNo = '';
				cloneResult.contract.relateOrderType = '';
			}

			API({
				submit: this.submitType,
				acceptUser: cloneResult.acceptUser,
				contract: {
					orderType: this.$route.query.type,
					...cloneResult.contract,
					downstreamSignCompanyName:
						cloneResult.contractExtension.downstreamSignCompanyName || cloneResult.contractExtension.upstreamSignCompanyName,
						relatedContractReqList: cloneResult.contract.selectContractList.map(el => {
							return {
								relateContractNo: el.contractNo,
								onlineFlag: el.paperContractNo ? false : true,
							}
						})
				},
				contractDelivery: {
					...cloneResult.contract,
					...cloneResult.contractDelivery,
					shipTransportCompanyName:
						cloneResult.contractExtension?.shipTransportCompanyName || cloneResult?.contractDelivery?.shipTransportCompanyName,
					shipTransportProtocolNo:
						cloneResult.contractExtension?.shipTransportProtocolNo || cloneResult?.contractDelivery?.shipTransportProtocolNo
				},
				contractExtension: cloneResult.contractExtension,
				orderIndicators: this.formateOrderIndicators(cloneResult.orderIndicators)
			})
				.then(res => {
					if (res.success) {
						this.$message.success({
							content: '操作成功',
							onClose: () => {
								if (this.contractType === 'BUY') {
									this.$router.replace('/center/contract/buy/list');
								} else {
									this.$router.replace('/center/contract/sell/list');
								}
							}
						});
					}
				})
				.finally(() => {
					this.loadingSave = false;
					this.loadingSubmit = false;
				});
		},
		pre() {
			this.$router.replace({
				path: `/center/contract/${this.$route.query?.type?.toLowerCase()}/online/add/step1`,
				query: {
					...this.$route.query,
					back: 1
				}
			});
			this.VUE_SET_CLEAR_FORM_ERROR();
		},
		fullScreenView() {
			let cloneResult = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			this.$refs.contractPdfModal.showModal(cloneResult.orderIndicators);
		},
		// 添加scroll事件
		handleScroll() {
			this.$nextTick(() => {
				var bread = document.querySelector('.breadcrumb-wrap');
				var head = document.querySelector('Header');
				var flexRight = document.querySelector('.slMainRight');
				var lw = document.querySelector('#mainContent');
				var sideMenu = document.querySelector('.side-menu');
				this.scroll_ = () => {
					clearTimeout(this.interval);
					this.topValue1 = lw.scrollTop;
					this.interval = setTimeout(() => {
						this.setScrollActiveIndex(lw.scrollTop);
					}, 300);
					if (lw.scrollTop === 0) {
						bread.style.display = 'block';
						head.style.display = 'block';
						flexRight.style.top = -50;
						this.contractFixedVisible = false;
						lw.style.height = '100%';
						sideMenu.style.height = '100%';
					} else {
						bread.style.display = 'none';
						head.style.display = 'none';
						flexRight.style.top = 0;
						this.contractFixedVisible = true;
						lw.style.height = '100vh';
						sideMenu.style.height = '100vh';
					}
				};
				lw.addEventListener('scroll', this.scroll_);
			});
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
	width: calc(100vw - 530px);
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
			width: calc(100vw - 530px);
			min-width: 916px;
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
		.slMainRight {
			width: 256px;
			margin: 0 0 0 20px;
			background: #fff;
			height: 608px;
			position: sticky;
			top: 50px;
			border-radius: 4px;
			.slMainRightBg {
				width: 100%;
				height: 80px;
				background: url('~@/v2/assets/imgs/contract/fill_in_bg.png') no-repeat 100% / contain;
				background-size: 256px 80px;
				color: #fff;
				overflow: hidden;
				border-radius: 4px 4px 0 0;
				.textLarge {
					font-size: 20px;
					margin: 14px 0 5px 14px;
				}
				.textNormal {
					font-size: 14px;
					margin-left: 14px;
				}
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
.anchorPointBox {
	width: 256px;
	height: 500px;
	overflow: hidden;
	overflow-y: auto;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #77889d;
	line-height: 20px;
	margin: 27px 0;

	.anchorPointItem {
		min-height: 38px;
		padding-left: 28px;
		position: relative;
		line-height: 20px;
		margin-bottom: 10px;
		cursor: pointer;
		.anchorPointIcon {
			width: 8px;
			height: 12px;
			position: absolute;
			left: 0;
			top: 5px;
		}
		& > p {
			width: 100%;
			height: 100%;
			position: relative;
			display: flex;
			& > span {
				// display: inline-block;
				// position: absolute;
				// left: 14px;
				// top: 0;
			}
		}
	}
	.dot-wrap {
		width: 14px;
		height: 100%;
		display: inline-block;
	}
	.dot-title {
		// margin-left: 6px;
		padding-left: 6px;
	}
	.dot {
		display: inline-block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #77889d;
		// margin-right: 3px;
		position: relative;
		top: -2px;
	}
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
				width: 72px;
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
	width: 100%;
	height: 168px;
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
}

// 小于1660为准
@media screen and (max-width: 1599px) {
	.anchorPointItem {
		padding-left: 16px !important;
	}
	.slMainLeft,
	.contract-create-preview,
	.contract-create-preview-fixed {
		width: calc(100vw - 418px) !important;
		min-width: 1022px !important;
	}

	.slMainRight {
		width: 150px !important;
		.slMainRightBg {
			background: url('~@/v2/assets/imgs/contract/fill_in_bg_small.png') no-repeat 100% / contain !important;
			background-size: 150px 80px !important;
			.textLarge {
				font-size: 16px !important;
				margin: 10px 0 5px 14px !important;
			}
			.textNormal {
				width: 70px !important;
				font-size: 12px !important;
				zoom: 0.85 !important;
				margin-left: 16px !important;
			}
		}
		.anchorPointBox {
			width: 150px !important;
		}
	}
	.slDetailBottom {
		width: calc(100vw - 418px) !important;
		min-width: 1022px !important;
	}
}
</style>
