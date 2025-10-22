<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
			@submit="handleSubmit"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="业务类型">
						<!-- 选择框 -->
						<a-select
							placeholder="请选择业务类型"
							:disabled="isOa || disabledBusinessType"
							:getPopupContainer="getPopupContainer"
							:notFoundContent="!orderBusinessTypeDescMap.length ? '暂无数据' : '加载中...'"
							@change="onBusinessType"
							v-decorator="[
								`businessType`,
								{
									rules: [
										{
											required: true,
											message: `业务类型必填`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in orderBusinessTypeDescMap.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')"
								:key="index"
								:value="items.value"
							>
								{{ items.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="煤种">
							<!-- 选择框 -->
							<a-select
								:disabled="isOa"
								placeholder="请选择煤种"
								:getPopupContainer="getPopupContainer"
								:notFoundContent="!coalTypeList.length ? '加载中...' : null"
								@change="getCoalConfig"
								v-decorator="[
									`coalType`,
									{
										rules: [
											{
												required: true,
												message: `煤种必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in coalTypeList"
									:key="index"
									:value="items.code"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="合同模板">
							<!-- 选择框 -->
							<a-select
								:disabled="isOa"
								placeholder="请选择合同模板"
								@change="contractTemplateChange"
								:getPopupContainer="getPopupContainer"
								:notFoundContent="!contractTemplateList.length ? '加载中...' : null"
								v-decorator="[
									`contractTemplateName`,
									{
										rules: [
											{
												required: true,
												message: `合同模板必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in contractTemplateList"
									:key="index"
									:value="items.code"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					class="relation-order"
				>
					<a-row
						:gutter="10"
						type="flex"
						justify="space-between"
						style="width: 364px"
					>
						<a-col
							:span="17"
							style="width: 264px"
						>
							<a-form-item
								:label="'业务线（关联' + titleDesc + '合同）'"
								:required="!form.getFieldValue('relateOrder')"
								style="width: 264px"
							>
								<a-input
									:placeholder="'请选择' + titleDesc + '合同'"
									:disabled="isOa || form.getFieldValue('relateOrder')"
									@click="showRelationOrderList"
									v-show="!relateOrderNo"
									v-decorator="[
										`relateOrderNo`,
										{
											rules: [
												{
													required: !form.getFieldValue('relateOrder'),
													message: `关联${titleDesc}合同必填`
												}
											]
										}
									]"
								/>
								<SpecialInput
									v-show="relateOrderNo"
									@openModal='showRelationOrderList'
									@send="getSelectContractNoList"
			
									:contactNos="relateOrderNo"
									:placeholder="'请选择' + titleDesc + '合同'"
									:disabled="isOa || form.getFieldValue('relateOrder')"
								></SpecialInput>
							</a-form-item>
						</a-col>
						<a-col
							:span="7"
							style="width: 100px"
						>
							<a-form-item
								label=" "
								style="width: 100px"
							>
								<a-checkbox
									@change="onChange"
									:disabled="isOa"
									v-decorator="[
										`relateOrder`,
										{
											valuePropName: 'checked',
											rules: [
												{
													required: false,
													message: `关联销售合同必填`
												}
											]
										}
									]"
									>暂不关联</a-checkbox
								>
							</a-form-item>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="合同签约地">
							<!-- 选择框 -->
							<a-select
								placeholder="请选择合同签约地"
								:getPopupContainer="getPopupContainer"
								:notFoundContent="!optionList.length ? '暂无数据' : '加载中...'"
								v-decorator="[
									`contractSignPlace`,
									{
										rules: [
											{
												required: true,
												message: `合同签约地必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in signPlaceList"
									:key="index"
									:value="items.address"
								>
									<span>
										<span>{{ items.address }}</span>
										<span v-if="items.description"> - {{ items.description }}</span>
									</span>
									<!-- <p>{{ items.description }}</p> -->
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="使用资金来源">
							<!-- 选择框 -->
							<a-select
								:disabled="isOa"
								placeholder="请选择资金来源"
								:getPopupContainer="getPopupContainer"
								:notFoundContent="!optionList.length ? '暂无数据' : '加载中...'"
								v-decorator="[
									`bankProductCode`,
									{
										rules: [
											{
												required: true,
												message: `使用资金来源必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in bankProductCodeList"
									:key="index"
									:value="items.code"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="false"
				>
					<a-form-item label="业务经理">
						<!-- 选择框 -->
						<a-select
							placeholder="请选择业务经理"
							:disabled="isOa"
							show-search
							:getPopupContainer="getPopupContainer"
							:notFoundContent="!optionList.length ? '暂无数据' : '加载中...'"
							:filter-option="filterOption"
							v-decorator="[
								`assetTeamTraderId`,
								{
									rules: [
										{
											required: true,
											message: `业务经理必填`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in assetTeamTraderList"
								:key="index"
								:value="items.userId"
							>
								{{ items.realname }},{{ items.phone }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="
						['WAREHOUSE_RECEIPTS_PLEDGE', 'DISCOUNT_WAREHOUSE_PLEDGE'].includes(form.getFieldValue('businessType')) &&
						$route.query.type === 'BUY'
					"
				>
					<a-form-item
						label="关联盯市指标"
						:class="requiredFlag ? 'special-select' : 'special-select no-required'"
					>
						<a-tree-select
							show-search
							style="width: 100%"
							:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
							placeholder="请选择通用指标"
							allow-clear
							multiple
							tree-checkable
							v-decorator="['indicatorId', { rules: [{ required: false, message: '开拓业务关联盯市指标必填' }] }]"
							tree-default-expand-all
							@search="getMarketIndicatorSelectVo"
							:filterTreeNode="filterTreeNode"
						>
							<a-tree-select-node
								v-for="item in this.indicatorSelectVo"
								:key="item.location"
								:value="item.location"
								:title="item.location"
								v-if="!(item.selectList.length === 1 && !item.selectList[0].enabled)"
							>
								<a-tree-select-node
									v-for="childItem in item.selectList"
									:key="childItem.id"
									:value="childItem.id"
									:title="childItem.title"
									v-if="childItem.enabled"
								/>
							</a-tree-select-node>
						</a-tree-select>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<relation-contract
			:type="this.$route.query.type === 'SELL' ? 'buy' : 'sell'"
			ref="RelationContract"
			@detail="getRelationOrderDetail"
			:relateOrderNo="form.getFieldValue('relateOrderNo')"
		/>
		<TipModal
			ref="delModal"
			title="提示"
			:footer='false'
		>
			<div class="del-tip">该煤种没有配置合同模版，请联系管理员</div>
		</TipModal>
	</div>
</template>

<script>
const idsMap = {
	transportModeName: 'transportMode',
	deliveryModeName: 'deliveryMode',
	settleModeName: 'settleMode',
	freightPayModeName: 'freightPayMode',
	sellerContactName: 'sellerContactsId',
	buyContactName: 'buyerContactsId',
	sellerBankNo: 'sellerBankAccountId',
	buyBankNo: 'buyerBankAccountId',
	deliveryStartDate: 'deliveryDate'
};

import { mapMutations } from 'vuex';
import RelationContract from './RelationContract.vue';
import SpecialInput from '../../../components/SpecialInput.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_CompanySignAddressSellerandbuyer } from '@/v2/api/account';
import { API_hasValidDeliverBatch, API_GETBANKPRODUCTITEM, getTraderList } from '@/v2/center/trade/api/contract';
import { getCoalType, getCoalConfigByType, API_getTempleteByCode } from '@/v2/api/diy';
import { API_GetMarketIndicatorSelectVo } from '@/v2/center/trade/api/contract';
import { mapGetters } from 'vuex';
import { cloneDeep, debounce } from 'lodash';
import TipModal from './TipModal.vue';

export default {
	props: {
		isBuyContract: {
			type: Boolean,
			default: false
		},
		orderType: {
			type: String,
			default: ''
		},
		isOa: {
			type: Boolean,
			default: false
		},
		canEdit: {
			type: Boolean,
			default: false
		},
		// 暂时用不到，后续优化会用到，代码不删
		requiredFlag: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'baseInfo' }),
			optionList: [],
			disabledRelateOrder: false,
			orderBusinessTypeDescMap: filterCodeByKey('orderBusinessTypeDescMap'),
			signPlaceList: [],
			bankProductCodeList: [],
			assetTeamTraderList: [],
			coalTypeList: [],
			contractTemplateList: [],
			productIndicatorList: [],
			templeteData: {},
			checked: false,
			replaceElem: {},
			replaceElemValue: {},
			attr: 'th:text',
			htmlStr: '',
			disabledBusinessType: false,
			hasProductIndicator: false,
			linkOrderNo: null,
			linkContractNo: null,
			paperContractNo: null,
			contractName: null,
			indicatorSelectVo: [], // 盯市指标
			value: '',
			searchValue: undefined,
			relateOrderNo: null,
			// 选择的关联的合同信息
			selectContractList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_CONTRACT_OTHER_DATA: 'VUEX_GET_CONTRACT_OTHER_DATA'
		}),
		relateOrderNoRequired() {
			return !this.VUEX_GET_CONTRACT_DATA.relateOrder;
		},
		titleDesc() {
			const titleDesc = {
				sell: '采购',
				buy: '销售'
			};
			if (this.$route.query?.type) {
				return `${titleDesc[this.$route.query?.type?.toLowerCase()]}`;
			}
			return `${titleDesc[this.orderType.toLowerCase()]}`;
		}
	},
	watch: {
		VUEX_GET_CONTRACT_DATA: {
			handler(newVal) {
				if (!Object.keys(newVal).length) return;
				// this.initFormData();
			},
			deep: true,
			immediate: true
		}
	},
	components: {
		'relation-contract': RelationContract,
		SpecialInput,
		TipModal
	},
	async mounted() {
		if (!this.isOa && !this.$route.query.id) {
			this.initFormData();
		}
	},
	beforeDestroy() {
		this.clearThymeleafHtml();
	},
	methods: {
		getPopupContainer,
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA',
			VUEX_SET_FORM_SCHEMA_INIT: 'contract/VUEX_SET_FORM_SCHEMA_INIT',
			VUEX_SET_THYMELEAF_CONTENT: 'contract/VUEX_SET_THYMELEAF_CONTENT',
			VUEX_SET_TRANSPORT_MODE: 'contract/VUEX_SET_TRANSPORT_MODE',
			VUEX_SET_PRODUCTION_INDICATOR: 'contract/VUEX_SET_PRODUCTION_INDICATOR',
			VUE_SET_OPTIONS_LIST: 'contract/VUE_SET_OPTIONS_LIST',
			VUE_SET_THYMELEAF_COMMITMENT: 'contract/VUE_SET_THYMELEAF_COMMITMENT',
			VUE_SET_HTML_REPLACE_ATTR: 'contract/VUE_SET_HTML_REPLACE_ATTR',
			VUE_SET_FORM_LIST_SORT: 'contract/VUE_SET_FORM_LIST_SORT',
			VUEX_RESET_PRODUCTION_INDICATOR: 'contract/VUEX_RESET_PRODUCTION_INDICATOR',
			VUEX_SET_CONTRACT_BOOLEAN: 'contract/VUEX_SET_CONTRACT_BOOLEAN',
			VUEX_SET_CONTRACT_DATA: 'contract/VUEX_SET_CONTRACT_DATA',
			VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR'
		}),
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		// 若当前订单已有实际的收发货（收发货状态为已发货、部分收货、已收货），则不允许修改业务类型
		hasValidBatch(businessType) {
			if (businessType == 'OTHER') {
				API_hasValidDeliverBatch({
					orderId: this.$route.query.id
				}).then(res => {
					if (res.success && res.data) {
						this.disabledBusinessType = true;
					}
				});
			}
		},
		filterTreeNode(value, node) {
			return node.componentOptions.propsData.title.toLowerCase().indexOf(value.toLowerCase()) >= 0;
		},
		// 仓押业务-关联盯市指标
		getMarketIndicatorSelectVo(keyword) {
			return API_GetMarketIndicatorSelectVo({
				marketIndexTypeEnum: 'SH_DATA_LINK',
				searchKey: keyword
			}).then(res => {
				if (res.success) {
					const list = res.result || [];
					list.forEach(el => {
						el.selectList &&
							el.selectList.forEach(el2 => {
								el2.id = `${el2.indicatorId}`;
								el2.title = `${el2.indexName} ${el2.indicatorName} ${el2.businessType}`;
							});
					});
					this.indicatorSelectVo = list || [];
					this.$forceUpdate();
				}
			});
		},
		initFormData(type) {
		
			return new Promise(async resolve => {
				this.$emit('loading', true);
				await this.getContractSignPlace();
				await this.getAssetTrader();
				await this.getCoalTypeList();
				await this.getCoalConfig(this.VUEX_GET_CONTRACT_DATA?.contract?.coalType);

				const templeteList = this.contractTemplateList.map(item => item.code);
				const templateName = this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName;
				if (templateName && templeteList.includes(templateName)) {
					await this.contractTemplateChange(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName);
				}
				// this.paperContractNo = this.VUEX_GET_CONTRACT_DATA?.contract?.paperContractNo;

	
				/** 选择的合同信息 */
				if(this.VUEX_GET_CONTRACT_DATA?.contract?.relatedContractReqList && this.VUEX_GET_CONTRACT_DATA?.contract?.relatedContractReqList.length) {
					this.selectContractList =  this.VUEX_GET_CONTRACT_DATA?.contract?.relatedContractReqList || [];
					this.selectContractList = this.selectContractList.map(el => {
						el.id = el.id || el.contractId
						if(el.paperContractNo) {
							el.id = Number(el.id)
						}
						return {
							...el,
							contractNo: el.contractNo || el.relateContractNo,
						
						}
					})
				} else {
					this.selectContractList =  this.VUEX_GET_CONTRACT_DATA?.contract?.selectContractList || [];
				}
				this.relateOrderNo = this.selectContractList.map(el =>  el.paperContractNo || el.contractNo).join(',')

 				 
				// 代表当前是复制合同 默认不关联业务线
				if (type == 1) {
	
					this.form.setFieldsValue({
						...this.VUEX_GET_CONTRACT_DATA?.contract,
						relateOrder: true,
						relateOrderNo: null,
					});
					
				this.relateOrderNo = ''
				this.selectContractList = []
				} else {
	
					this.form.setFieldsValue({
						...this.VUEX_GET_CONTRACT_DATA.contract,
						relateOrder: this.selectContractList.length ? false : true,
						relateOrderNo: this.relateOrderNo,

					});

				}

				// 复制的合同存在合同模板被删除的可能
				if (templateName && !templeteList.includes(templateName)) {
					this.form.setFieldsValue({
						contractTemplateName: undefined
					});
				}
				const oldCoalType = this.VUEX_GET_CONTRACT_DATA?.contract?.coalType;
				if (oldCoalType) {
					const temp = this.coalTypeList.filter(item => item.code === oldCoalType);
					if (!temp.length) {
						this.form.setFieldsValue({
							coalType: undefined,
							contractTemplateName: undefined
						});
					}
				}
				const signPlaceValue = this.VUEX_GET_CONTRACT_DATA?.contract?.contractSignPlace;
				if (signPlaceValue) {
					const temp = this.signPlaceList.filter(item => item.address === signPlaceValue);
					if (!temp.length) {
						this.form.setFieldsValue({
							contractSignPlace: undefined
						});
					}
				}
				if (this.$route.query.flag === 'edit') {
					this.hasValidBatch(this.VUEX_GET_CONTRACT_DATA?.contract?.businessType);
				}
				// 仓押业务-关联盯市指标
				if (
					['WAREHOUSE_RECEIPTS_PLEDGE', 'DISCOUNT_WAREHOUSE_PLEDGE'].includes(this.VUEX_GET_CONTRACT_DATA?.contract?.businessType)
				) {
					await this.getMarketIndicatorSelectVo();
					this.judgeIndex(this.VUEX_GET_CONTRACT_DATA?.contract.indicatorId);
				}
				this.resetFormValue();
				this.$emit('loading', false);
				resolve(true);
			});
		},
		// 判断指标是否禁用
		judgeIndex(indicatorId) {
			let indicatorIdArr = [];
			indicatorId.forEach(pro => {
				
				this.indicatorSelectVo.forEach(item => {
					if (item.selectList) {
						for (let i = 0; i < item.selectList.length; i++) {
							let indexObj = item.selectList[i];
							if (indexObj.indicatorId == pro) {
								if (indexObj.enabled) {
									indicatorIdArr.push(indexObj.indicatorId);
								}
							}
						}
					}
				});
			});
			this.$nextTick(() => {
				this.form.setFieldsValue({
					indicatorId: indicatorIdArr
				});
			});
		},
		onBusinessType(val) {
			this.getAssetTrader(val);
			this.form.resetFields(['assetTeamTraderId']);
			this.$emit('businessTypeChange', val);
			if (val === 'OTHER') {
				this.VUEX_SET_STEP1_CONTRACT_DATA({
					contract: {
						directorBusinessOwnershipId: null,
						terminalDirectorId: null,
						assetTeamTraderId: null,
						businessType: val
					}
				});
			}
			// 仓押业务-关联盯市指标
			if (['WAREHOUSE_RECEIPTS_PLEDGE', 'DISCOUNT_WAREHOUSE_PLEDGE'].includes(val)) {
				this.getMarketIndicatorSelectVo();
			}
		},
		resetFormValue() {
			this.$nextTick(() => {
				const assetTeamTraderIdsList = this.assetTeamTraderList?.map(item => item.userId);
				const assetTeamTraderId = this.VUEX_GET_CONTRACT_DATA?.contract?.assetTeamTraderId;
				if (!assetTeamTraderId || !assetTeamTraderIdsList.includes(assetTeamTraderId)) {
					this.form.setFieldsValue({
						assetTeamTraderId: undefined
					});
				}
			});
		},
		handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					// 关联盯市指标 required值切换，校验
					if (err && err.hasOwnProperty('indicatorId') && !this.requiredFlag) {
						delete err.indicatorId;
						if (JSON.stringify(err) === '{}') {
							err = null;
						}
					}
					if (!err) {
						let type = null;
						// if (!this.paperContractNo) {
						// 	type = 'ONLINE';
						// } else {
						// 	if (this.$route.query.type.toLowerCase() == 'buy') {
						// 		type = 'DOWN';
						// 	} else {
						// 		type = 'UP';
						// 	}
						// }
						if (this.$route.query.type?.toLowerCase() == 'buy') {
								type = 'DOWN';
							} else {
								type = 'UP';
							}
						// 复制合同时切换模版后--替换contractTemplateDesc
						let contractTemplateDesc = '';
						if (this.contractTemplateList?.length) {
							this.contractTemplateList.forEach(item => {
								if (item.code === value.contractTemplateName) {
									contractTemplateDesc = item.name;
								}
							});
						}
						this.VUEX_SET_STEP1_CONTRACT_DATA({
							contract: {
								...value,
								contractTemplateDesc: contractTemplateDesc,
								signLocation: value.contractSignPlace,
								// linkOrderNo: this.linkOrderNo,
								// linkContractNo: this.linkContractNo,
								relateOrderNo: this.VUEX_GET_CONTRACT_DATA?.contract?.relateOrderNo || this.relateOrderNo,
								selectContractList: this.selectContractList || this.VUEX_GET_CONTRACT_DATA?.contract?.selectContractList,
							

								// relateOrderType: type,
								// paperContractNo: ['DOWN', 'UP'].includes(type)
								// 	? this.VUEX_GET_CONTRACT_DATA?.contract?.paperContractNo || this.paperContractNo
								// 	: null,
								contractName: this.contractName
							}
						});
						resolve(true);
					} else {
						resolve(false);
					}
				});
			});
		},
		showRelationOrderList() {

			this.$refs.RelationContract.showRelationOrderList(this.selectContractList);
		},
		onChange(e) {
			const { checked } = e.target;
			if (checked) {
				this.disabledRelateOrder = true;
				this.selectContractList = []
				this.relateOrderNo = ''
				this.form.setFieldsValue({
					relateOrderNo: null
				});
				this.VUEX_SET_STEP1_CONTRACT_DATA({
					contract: {
						paperContractNo: '',
						relateOrderNo: null,
						relatedContractReqList: [],
						selectContractList: [],
					}
				});
				this.relateOrderNo = '';
			} else {
				this.disabledRelateOrder = false;
				this.form.setFieldsValue({
					relateOrderNo: null
				});
			}
		},
		getSelectContractNoList(list) {

			const relateOrderNo = list.join(',') || null;

			this.selectContractList = this.selectContractList.filter(el => list.includes( el.paperContractNo || el.contractNo ))



			this.relateOrderNo = relateOrderNo;
			this.VUEX_SET_STEP1_CONTRACT_DATA({
				contract: {
					relateOrderNo: relateOrderNo,
					selectContractList: this.selectContractList,
					relatedContractReqList: this.selectContractList,
				},
				
			});
			this.form.setFieldsValue({
				relateOrderNo: relateOrderNo
			});
		},
		// 关联业务线
		getRelationOrderDetail(list) {
			// console.log(item);
			this.selectContractList = list
			this.relateOrderNo = list.map(el => el.paperContractNo || el.contractNo).join(',');

			// if (item.paperContractNo) {
			// 	this.form.setFieldsValue({
			// 		relateOrderNo: item.paperContractNo
			// 	});
			// 	this.paperContractNo = item.paperContractNo;
			// 	this.linkContractNo = item.contractNo;
			// 	this.VUEX_SET_STEP1_CONTRACT_DATA({
			// 		contract: {
			// 			paperContractNo: item.paperContractNo,
			// 			relateOrderNo: item.contractNo
			// 		}
			// 	});
			// 	return;
			// }
			// this.paperContractNo = '';
			this.form.setFieldsValue({
				relateOrderNo: this.relateOrderNo
			});
			this.VUEX_SET_STEP1_CONTRACT_DATA({
				contract: {
					relateOrderNo: this.relateOrderNo,
					selectContractList: this.selectContractList,
					relatedContractReqList: this.selectContractList,
				},
			})
				
		},
		// 获取合同签约地
		getContractSignPlace() {
			return API_CompanySignAddressSellerandbuyer({
				buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				sellerUscc: ''
			}).then(res => {
				if (res.success) {
					this.signPlaceList = res.data.buyerAddress;
				}
			});
		},
		// 获取资金来源
		getBankDataList(id) {
			if (!id) return;
			return API_GETBANKPRODUCTITEM({
				filter: 1,
				coreCompanyId: this.VUEX_ST_PERSONALLINFO.curCompanyId,
				companyId: id
			}).then(res => {
				if (res.success) {
					this.bankProductCodeList = res.data;
					const bankProductCode = this.VUEX_GET_CONTRACT_DATA?.contract?.bankProductCode;
					const bankProductCodeIdsList = this.bankProductCodeList?.map(item => item.code);
					if (!bankProductCode || !bankProductCodeIdsList.includes(bankProductCode)) {
						this.form.setFieldsValue({
							bankProductCode: undefined
						});
					}
				}
			});
		},
		// 获取业务经理
		getAssetTrader(orderBusinessType = '') {
			return getTraderList({
				keyWord: '',
				orderBusinessType
			}).then(res => {
				if (res.success) {
					this.assetTeamTraderList = res.data;
				}
			});
		},
		// 查询煤种信息
		getCoalTypeList() {
			return getCoalType().then(res => {
				if (res.success) {
					this.coalTypeList = res.data;
				}
			});
		},
		// 根据煤种查询配置
		getCoalConfig(code) {
			if (!code) return;
			this.form.setFieldsValue({
				contractTemplateName: undefined
			});
			this.contractName = this.coalTypeList?.filter(item => item.code === code)[0]?.contractName;
			this.contractTemplateList = [];
			this.productIndicatorList = [];
			return getCoalConfigByType({
				coalTypeCode: code,
				types: `COMMON,${this.orderType}`,
				businessType: 'order'
			}).then(res => {
				if (res.success) {
					// 修改了煤炭种类 基准质量指标数据需要重置
					const coalTypeName = this.VUEX_GET_CONTRACT_DATA?.contract?.coalType;
					if (coalTypeName && code !== coalTypeName) {
						this.VUEX_RESET_PRODUCTION_INDICATOR();
						this.VUEX_SET_UPDATE_INDICATOR([]);
					}
					this.contractTemplateList = res.data.businessPdfTemplate || [];
					if(!this.contractTemplateList.length) {
						/** 如果当前没有合同模板 */
						this.$refs.delModal.open()
					}
				


					this.productIndicatorList = res.data.productIndicator;
					if (res.data.productIndicator) {
						this.hasProductIndicator = true;
					} else {
						this.hasProductIndicator = false;
					}
					res.data.productIndicator.forEach(item => {
						if (item.inputType == 'RANGE') {
							item.valueList = {
								[`${item.indicatorCode}_value2`]: null,
								[`${item.indicatorCode}_value1`]: null
							};
						} else {
							const value = {
								[`${item.indicatorCode}_value1`]: null
							};
							if (item.symbolList) {
								value[`${item.indicatorCode}_symbol`] = item.symbol || undefined;
							}
							item.valueList = value;
						}
					});
					this.VUEX_SET_PRODUCTION_INDICATOR(res.data.productIndicator.sort((a, b) => a.sortOrder - b.sortOrder));
				}
			});
		},
		// 存储配置文件中所有下拉选项的options
		getOptionsList(transportMode) {
			const tempArr = [];
			for (const key in this.templeteData.formList) {
				if (this.templeteData.formList[key].length) {
					this.templeteData.formList[key].forEach(item => {
						if (item.options && item.options.length) {
							tempArr.push(item.options);
						}
					});
				}
			}
			let deliveryModeList = [];
			transportMode.forEach(item => {
				if (item.deliveryMode && item.deliveryMode.length) {
					deliveryModeList = deliveryModeList.concat(item.deliveryMode);
				}
			});
			this.VUE_SET_OPTIONS_LIST(transportMode.concat(tempArr.flat()).concat(deliveryModeList));
		},
		// 清除设置的thymeleaf html节点
		clearThymeleafHtml() {
			const html = document.body;
			for (let i = 0; i < html.childNodes.length; i++) {
				if (html.childNodes[i].nodeType === 1) {
					if (html.childNodes[i].getAttribute('id')?.indexOf('thymeleaf-content-') >= 0) {
						html.childNodes[i].parentNode.removeChild(html.childNodes[i]);
					}
				}
			}
		},
		// 修改html节点属性 ${customCount+1}  ---> ${customCount_1}
		filterHtmlDomByAttr(html, attr = this.attr) {
			for (let i = 0; i < html.childNodes.length; i++) {
				if (html.childNodes[i].nodeType === 1) {
					let attrText = html.childNodes[i].getAttribute('th:text') || html.childNodes[i].getAttribute('th:utext');
					let attrIfText = '';
					if (html.childNodes[i].getAttribute('th:if')) {
						attrIfText = html.childNodes[i].getAttribute('th:if')?.replace(/\s*/g, '');
						if (attrIfText.indexOf('!=null') >= 0) {
							const indexArr = [attrIfText.indexOf('{'), attrIfText.indexOf('}')];
							const replaceAttrName = attrIfText.substring(indexArr[0] + 1, indexArr[1]);
							this.VUEX_SET_CONTRACT_BOOLEAN(replaceAttrName);
							html.childNodes[i].setAttribute('th:if', '${' + replaceAttrName + 'Boolean' + '} == true');
						}
					}
					if (attrText) {
						attrText = attrText?.replace('${', '')?.replace('}', '');
						html.childNodes[i].setAttribute('id', idsMap[attrText] || attrText);
					}
					let attrTextEach = html.childNodes[i].getAttribute('th:each');
					if (attrTextEach) {
						html.childNodes[i].setAttribute('id', 'indicatorList');
					}
					const attrFlag = html.childNodes[i].getAttribute(attr);
					if (attrFlag && attrFlag.indexOf('customCount+') >= 0) {
						const key = html.childNodes[i].getAttribute(attr);
						this.getKeyAndValue(key);
						html.childNodes[i].setAttribute(this.attr, '${' + this.replaceElem[key] + '}');
					}
					if (attrFlag && attrFlag.indexOf('customCountCn_') >= 0) {
						const key = html.childNodes[i].getAttribute(attr);
						this.getKeyAndValue(key);
						html.childNodes[i].setAttribute(this.attr, '${' + this.replaceElem[key] + '}');
					}
					if (html.childNodes[i].childNodes) {
						this.filterHtmlDomByAttr(html.childNodes[i], attr);
					}
				}
			}
		},
		// 设置属性值存储
		getKeyAndValue(str) {
			const result = str.replace('${', '').replace('}', '');
			let resultArr = null;
			if (str.indexOf('+') >= 0) {
				resultArr = result.split('+');
			}
			if (str.indexOf('_') >= 0) {
				resultArr = result.split('_');
			}
			const key = `${resultArr[0]}_${resultArr[1]}`;
			const resultElem = document.createElement('span');
			resultElem.setAttribute('th:text', '${' + key + '}');
			this.replaceElem[str] = key;
			this.replaceElemValue[key] = null;
		},
		setThymeleafHtmlContent(content, code) {
			this.clearThymeleafHtml();
			const htmlParse = new DOMParser();
			this.htmlStr = htmlParse.parseFromString(this.filterHtmlContent(content), 'text/html');
			this.filterHtmlDomByAttr(this.htmlStr, this.attr);
			const elem = document.createElement('div');
			elem.setAttribute('id', `thymeleaf-content-${code}`);
			elem.style.display = 'none';
			elem.appendChild(this.htmlStr.childNodes[0]);
			document.body.appendChild(elem);
		},
		// 设置煤种对应的配置
		contractTemplateChange(code) {
			if (!code) return;
			API_getTempleteByCode({
				templateCode: code
			}).then(res => {
				if (res.data) {
					const temp = res.data;
					const transportModeList = temp.transportMode.map(item => item.value);
					if (!transportModeList.includes(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode)) {
						this.VUEX_SET_STEP1_CONTRACT_DATA({
							contractDelivery: {
								...this.VUEX_GET_CONTRACT_DATA.contractDelivery,
								transportMode: null,
								deliveryMode: null
							}
						});
					}
					// admin端contractExtension字段是配置在富文本选项的，这里要展开
					if (temp.templateJson) {
						this.templeteData = cloneDeep(JSON.parse(temp.templateJson));

						const contractExtensionTemp = JSON.parse(res.data.templateJson)?.formList?.contractExtension;
						if (contractExtensionTemp) {
							contractExtensionTemp.forEach(item => {
								this.templeteData.formList[item.label] = [item];
								this.templeteData.mapConfig[item.label] = item.title;
							});
							delete this.templeteData.formList.contractExtension;
						}
						this.templeteData.formList.transportation.forEach(item => {
							if (item.label === 'deliveryMode') {
								const oldTransportMode = this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode;
								if (oldTransportMode) {
									item.options = temp.transportMode.filter(item => item.value === oldTransportMode)[0]?.deliveryMode;
								} else {
									item.options = [];
								}
							}
							if (item.label === 'freightPayMode') {
								item.options = item.options.filter(item => item.value != 'DOWN_STREAM');
							}
						});
					}
					const tempList = [];
					for (const key in this.templeteData.formList) {
						tempList.push(key);
					}
					if (this.$route.query.companyUserId) {
						this.templeteData.formList['transportation'].forEach(item => {
							if (item.label == 'transportMode') {
								item.disabled = true;
							}
						});
					}
					if (this.hasProductIndicator) {
						if (this.templeteData.formList) {
							this.templeteData.formList['productIndicator'] = this.productIndicatorList;
						}
						if (this.templeteData.mapConfig) {
							this.templeteData.mapConfig['productIndicator'] = '基准质量指标';
						}
					}

					// 基准价格默认复制inputType为NUMBER类型
					const qualityItem = this.templeteData.formList['quality'];
					qualityItem.forEach(item => {
						if (item.label === 'basePrice') {
							item.inputType = 'NUMBER';
						}
					});
					// 为了保证第二步form顺序
					const insertIndex = tempList.indexOf('transportation');
					if (tempList.indexOf('productIndicator') < 0) {
						tempList.splice(insertIndex + 1, 0, 'productIndicator');
					}
					this.VUE_SET_FORM_LIST_SORT(tempList);
					this.getOptionsList(temp.transportMode);
					this.VUEX_SET_FORM_SCHEMA_INIT(this.templeteData);
					this.setThymeleafHtmlContent(temp.content, code);
					this.VUEX_SET_THYMELEAF_CONTENT(document.querySelector(`#thymeleaf-content-${code}`).innerHTML);
					this.VUE_SET_HTML_REPLACE_ATTR(this.replaceElemValue);
					if (temp.commitmentContent) {
						this.VUE_SET_THYMELEAF_COMMITMENT(this.filterHtmlContent(temp.commitmentContent));
					} else {
						this.VUE_SET_THYMELEAF_COMMITMENT('');
					}
					this.VUEX_SET_TRANSPORT_MODE(temp.transportMode);

					const templeteList = this.contractTemplateList.filter(item => {
						return item.code == code;
					});
					// 改煤种是否支持单多品类切换,基准质量指标是否是多品类
					this.VUEX_SET_CONTRACT_DATA({
						field: 'contract',
						values: {
							multiGoodsNameSupportFlag: templeteList[0]?.multiGoodsNameFlag
						}
					});
					this.$emit('setTempleteJsonSuccess', true);
				}
			});
		},
		// 过滤html中特殊字符
		filterHtmlContent(content) {
			if (!content) {
				return '';
			}
			return content
				.replace(/\/n/g, '')
				.replace(/\"/g, "'")
				.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, '');
		}
	}
};
</script>

<style lang="less" scoped>
.ant-checkbox-wrapper {
	height: 32px;
	line-height: 32px;
}
.relation-order {
	/deep/ .ant-form-item-control {
		text-align: right;
	}
	/deep/ .ant-checkbox-wrapper {
		span:nth-child(2) {
			padding-right: 0;
		}
	}
	/deep/ .ant-form-explain {
		text-align: left;
	}
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
#thymeleaf-content {
	width: 0;
	height: 0;
	display: none;
}
.special-select {
	::v-deep.ant-select-dropdown .ant-select-dropdown-content .ant-select-dropdown-menu-item {
		color: rgba(0, 0, 0, 0.8) !important;
	}
	::v-deep.ant-select-dropdown .ant-select-dropdown-content .ant-select-dropdown-menu-item-group-title {
		color: rgba(0, 0, 0, 0.5) !important;
	}
	::v-deep.ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item {
		padding-left: 12px;
	}
	::v-deep.ant-select-selection {
		height: auto;
	}
}
.no-required {
	::v-deep.ant-form-explain {
		display: none;
	}
	::v-deep.ant-form-item-control.has-error .ant-select-selection {
		border-color: #e5e6eb !important;
	}
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
</style>
