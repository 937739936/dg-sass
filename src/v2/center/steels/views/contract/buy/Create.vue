<template>
	<div
		class="new-detail"
		style="width: 100%"
		:class="isOa ? 'oa-wrapper' : ''"
	>
		<div class="s-title">
			<span>{{ isOa ? '' : '创建' }}采购合同</span>
		</div>
		<!-- 应收 和 废钢不展示 -->
		<relation-order
			ref="relation"
			@detail="getRelationOrderDetail"
			type="sell"
			:oaflag="oaflag"
			:OAData="OAData"
			:isOa="isOa"
			:showRelation="!['FINISHED_STEEL_BUY_001', 'SCRAP_STEEL_001'].includes(formData.contractTemplate)"
			:resultDetail="resultDetail"
		>
		</relation-order>
		<AddForm
			:isOa="isOa"
			type="BUY"
			@form="getFormData"
			ref="addForm"
			@copy="getCopyData"
			@changeSeller="changeSeller"
			@changeAppoint="changeAppoint"
			@getBusinessType="getBusinessType"
		></AddForm>
		<!-- 采购明细表  应收-->
		<PurchaseDetails
			v-if="['STEEL_PROFILE'].includes(formData.contractTemplate)"
			ref="purchaseDetails"
			:steelType="formData.steelType"
			:appointSpec="formData.appointSpec"
			:selectedData="purchaseDetailsData"
			:editable="editable"
		/>
		<!-- 废钢采购明细表 -->
		<ScrapSteelPurchaseDetails
			v-else-if="formData.contractTemplate === 'SCRAP_STEEL_001'"
			ref="scrapSteelPurchaseDetails"
			:steelType="formData.steelType"
			:appointSpec="formData.appointSpec"
			:selectedData="purchaseDetailsData"
			:editable="editable"
		/>
		<!--    采购合同模板002-->
		<PurchaseDetailsRECEIVABLE_STEEL_BUY_002
			v-else-if="formData.contractTemplate === 'RECEIVABLE_STEEL_BUY_002'"
			ref="scrapSteelPurchaseDetails"
			:steelType="formData.steelType"
			:appointSpec="formData.appointSpec"
			:selectedData="purchaseDetailsData"
			:editable="editable"
		/>
		<!-- 成品钢02 采购明细 -->
		<PurchaseDetailsOther
			v-else
			ref="purchaseDetailsOther"
			type="buy"
			:steelType="formData.steelType || []"
			:contractTemplate="formData.contractTemplate"
			:appointSpec="formData.appointSpec"
			:selectedData="purchaseDetailsData"
			:resultDetail="resultDetail"
			:editable="editable"
		/>
		<a-form
			style="margin-top: 20px"
			v-if="['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_BUY_004'].includes(formData.contractTemplate)"
		>
			<a-form-item
				label="备注"
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 8 }"
			>
				<a-col span="24">
					<a-input
						style="width: 100%"
						v-model="remark"
						:disabled="isOa"
					/>
				</a-col>
			</a-form-item>
		</a-form>
		<!-- 银行信息 -->
		<BankForm
			ref="bankForm"
			type="BUY"
		></BankForm>
		<!-- 下游合同信息 -->
		<DownContractForm
			ref="downContractForm"
			v-if="!['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_BUY_004', 'FINISHED_STEEL_BUY_005'].includes(formData.contractTemplate)"
			:requiredFlag="businessType !== 'ACCOUNT_RECEIVABLE'"
		></DownContractForm>

		<template v-if="['STEEL_PROFILE', 'FINISHED_STEEL_BUY_004', 'RECEIVABLE_STEEL_BUY_002'].includes(formData.contractTemplate)">
			<!-- 甲方就是核心企业 -- 联系人信息 -->
			<contact-info-form
				:contractTemplate="formData.contractTemplate"
				:partyAContactId="buyerContactId"
				:partyBContactId="sellerContactId"
				:partyAWechatId="resultDetail.buyerWechatId"
				:partyBWechatId="resultDetail.sellerWechatId"
				:partyB="formData.sellCompanyId"
				:partyA="VUEX_ST_COMPANYSUER.companyId"
				ref="contactInfoForm"
				:disabled="disabled"
			/>
		</template>
		<div>
			<ContractTemplate
				v-for="item in contractTemplateList"
				:key="item.key"
				:type="item.type"
				:value="item.value"
				:disabled="disabled"
				:label="item.label"
				:required="item.required"
				:getData="getData"
				:problemList="problemList"
				:defaultValue="contractInfo[item.value]"
			/>
			<!-- 成品钢02模板  -->
			<template>
				<!-- 廉政条款 -->
				<ContractTemplate
					key="102"
					type="102"
					v-if="isShowAgainst"
					label="廉政条款"
					value="againstCorruptionTerms"
					:disabled="disabled"
					:required="['FINISHED_STEEL_BUY_004'].includes(formData.contractTemplate)"
					:getData="getData"
					:problemList="problemList"
					:defaultValue="contractInfo.againstCorruptionTerms"
				/>
			</template>
		</div>

		<template v-if="isOa && resultDetail.pdfPath">
			<h3 style="margin: 30px 0; font-size: 18px">合同附件</h3>
			<div style="width: 100px">
				<img
					class="cp"
					style="display: inline-block; width: 100%"
					src="@/assets/imgs/pdf.png"
					@click="openPdf(resultDetail.pdfPath)"
				/>
				<p class="tc mt8">钢材采购合同</p>
			</div>
		</template>

		<!-- 按钮组 -->
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-col
				span="24"
				style="text-align: center"
			>
				<a-space size="large">
					<a-button
						type="primary"
						@click.native="handleSubmit('preview')"
						:loading="loadingPreview"
						>合同预览</a-button
					>
					<a-button
						v-if="!isOa"
						type="primary"
						@click="handleSubmit('submit')"
						:loading="loadingSubmit"
						>提交</a-button
					>
					<a-button
						v-if="!isOa || isShowOaSaveBtn"
						type="primary"
						@click.native="handleSubmit('save')"
						:loading="loadingSave"
						>保存</a-button
					>
					<a-button
						v-if="!isOa"
						type="primary"
						@click.native="$router.back()"
						>取消</a-button
					>
				</a-space>
			</a-col>
		</a-row>
		<!--弹窗组-->
		<orderModal
			ref="orderModal"
			typeDesc="钢材采购合同"
		/>
		<!-- 敏感词弹窗 -->
		<SensitiveModal
			ref="sensitiveModal"
			:problemList="problemList"
			@continueNext="continueNext"
		></SensitiveModal>
		<BaseModal
			title="创建合同失败!"
			ref="baseModal"
			:reasons="reasons"
		></BaseModal>
	</div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';

import { getPersonalDetail } from '@/v2/utils/factory';
import {
	API_SteelsContractDetail,
	API_SteelsBuyContractSave,
	API_SteelsBuyContractUpdateToSave,
	API_SteelsBuyContractSubmit,
	API_SteelsBuyContractPreview,
	API_GETLOGINBYMOBILE,
	API_SteelsBuyContractUpdateToSaveOa,
	API_SteelsContractViewDetail
} from '@/v2/center/steels/api/contract.js';
import { API_COMPANYOACHECK, API_SensitiveWordsCheck } from '@/v2/center/steels/api';
import AddForm from '../components/AddForm.vue';
import BankForm from '../components/BankForm.vue';
import DownContractForm from '../components/DownContractForm.vue';
import RelationOrder from '../components/RelationOrder.vue';

import ContactInfoForm from '../components/ContactInfoForm';
import SensitiveModal from '../components/SensitiveModal.vue';

import ContractTemplate from '../components/TemplateIndex.vue';
import PurchaseDetails from './components/PurchaseDetails.vue';
import PurchaseDetailsOther from '@/v2/center/steels/components/PurchaseDetailsOther.vue';

import PurchaseDetailsRECEIVABLE_STEEL_BUY_002 from '@/v2/center/steels/components/PurchaseDetailsRECEIVABLE_STEEL_BUY_002';

import ScrapSteelPurchaseDetails from '@/v2/center/steels/components/ScrapSteelPurchaseDetails.vue';
import OrderModal from './components/OrderModal';

import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { cloneDeep } from 'lodash';
/*** 新增 特殊 品名 螺纹钢 */
import { contractTemplateInfo } from '@/v2/center/steels/config/constant.js';
import { checkCompanyChange } from '@/v2/center/trade/api/contract';
import BaseModal from '@/v2/components/signModal/BaseModal.vue';

export default {
	data() {
		return {
			businessType: '',
			curOperator: {},
			isOa: false,
			oaflag: false,
			disabled: false,
			form: this.$form.createForm(this),
			// 合同模板数据
			contractInfo: {},
			editable: true, // 采购明细表是否可编辑，默认可编辑
			bankAccountObj: null,
			contactInfoObj: null,
			buyerContactId: '',
			sellerContactId: '',
			purchaseDetailsData: [], //采购明细数据
			resultDetail: {},
			associateContract: '', // 关联的合同编号
			associateContractId: '', // 关联的合同id
			// 备注
			remark: '',
			// 需要展示廉政条款的公司
			againstCorruptionTerms: filterSteelsCodeByKey('againstCorruptionTerms') || [],
			confirmOperation: {
				continue: false,
				type: ''
			},
			problemList: [],
			loadingPreview: false,
			loadingSubmit: false,
			loadingSave: false,
			/*** 改造之后 */
			formData: {
				steelType: []
			},
			// 复制合同详情
			copyContractInfo: {},
			// 法定代表人变更
			reasons: []
		};
	},
	props: ['OAData'],
	components: {
		ContactInfoForm,
		ContractTemplate,
		PurchaseDetails,
		ScrapSteelPurchaseDetails,
		PurchaseDetailsOther,
		RelationOrder,
		AddForm,
		BankForm,
		OrderModal,
		DownContractForm,
		SensitiveModal,
		PurchaseDetailsRECEIVABLE_STEEL_BUY_002,
		BaseModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE',
			VUEX_ST_STEELSALLCODE: 'VUEX_ST_STEELSALLCODE'
		}),
		// 判断是oa 并且是 审批中的 并且是应收和仓押的才显示保存按钮
		isShowOaSaveBtn() {
			const flag = ['SELF_OPERATION', 'ACCOUNT_RECEIVABLE'].includes(this.resultDetail.businessType);
			return this.isOa && this.resultDetail.status === 'AUDITING' && flag;
		},
		/** 判断当前公司是否需要 显示廉政条款 */
		isShowAgainst() {
			const arr = this.againstCorruptionTerms.map(el => el.value);
			return arr.includes(this.VUEX_ST_COMPANYSUER.companyUscc);
		},
		contractTemplateList() {
			return contractTemplateInfo[this.formData.contractTemplate];
		}
	},
	async mounted() {
		this.isOa = this.$route.name === 'OaSteelsContractBuyDetail';
		// 更新字典
		const { contractId, companyUserId } = this.$route.query;
		if (this.isOa) {
			const res = await API_GETLOGINBYMOBILE({ contractId, companyUserId });
			this.VUEX_MU_USERTOKEN(res.token);
			getPersonalDetail(this.getOrderData);
			return;
		}
		this.getOrderData();
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		...mapActions({
			VUEX_AT_GETALLCODE_V2: 'config/VUEX_AT_GETALLCODE'
		}),
		getBusinessType(data) {
			this.businessType = data;
		},
		openPdf(url) {
			window.open(url, '_blank');
		},
		// 用户操作变更的数据
		getFormData(info) {
			this.formData = info;
		},
		// 复制的合同的数据
		getCopyData(info) {
			this.copyContractInfo = info;
			// 赋值 合同详情
			this.resultDetail = info;
			if (info.operatorName) {
				const { operatorName, operatorMobile } = info;
				this.curOperator = { operatorName, operatorMobile };
			}
			// 是否关联销售合同
			this.associateContract = info.associateContract || '';
			this.associateContractId = info.associateContractId || '';

			/** 赋值 合同模板 */
			this.contractInfo = info;
			// 赋值联系人信息
			this.buyerContactId = info.buyerContactId;
			this.sellerContactId = info.sellerContactId;

			this.purchaseDetailsData = info.contractPurchaseList;
			/** 下游合同信息 */
			const obj = {
				additionalCompanyAbbr: info.additionalCompanyAbbr || '',
				additionalCompanyName: info.additionalCompanyName || '',
				additionalContractNo: info.additionalContractNo || ''
			};

			if (this.oaflag) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
			}

			// 银行信息赋值
			this.$nextTick(() => {
				this.$refs.bankForm.copyData(info.buyBankNo, info.sellBankNo, this.VUEX_ST_COMPANYSUER.companyId, info.sellCompanyId);
				this.$refs.downContractForm && this.$refs.downContractForm.init(obj);
				this.$refs.relation &&
					this.$refs.relation.relationForm.setFieldsValue({
						contractNo: info.associateContract,
						noRelation: !info.associateContract
					});
			});
		},
		// 更换卖方
		changeSeller(info) {
			this.formData = info;
			// 赋值银行信息
			this.$refs.bankForm.changeSeller('', '', this.VUEX_ST_COMPANYSUER.companyId, info.sellCompanyId);
		},
		// 是否指定规格
		changeAppoint() {
			this.purchaseDetailsData = [];
		},
		async getOrderData() {
			if (this.$route.query.contractId) {
				// 修改合同
				this.getEditBuyContractDetail(this.$route.query.contractId);
			}
			// 判断是否有审批流
			let res = await API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc, industryType: 'STEEL' });
			this.oaflag = res.result;
			if (this.oaflag) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
			}
			if (this.resultDetail.operatorName) {
				const { operatorName, operatorMobile } = this.resultDetail;
				this.curOperator = { operatorName, operatorMobile };
			}
		},
		// 验证联系人信息
		validContactForm() {
			let result = false;
			this.$refs.contactInfoForm &&
				this.$refs.contactInfoForm.contactForm.validateFieldsAndScroll(e => {
					if (e) {
						result = false;
					} else {
						result = true;
					}
				});
			return result;
		},
		// 保存

		handleSubmit(type) {
			this.confirmOperation.type = type; // 缓存类型, 关键词时校验使用
			if (this.$refs.relation) {
				this.$refs.relation.relationForm.validateFieldsAndScroll((error, relationValues) => {
					if (!error) {
						this.confirmHandleSubmit(type);
					}
				});
			} else {
				this.confirmHandleSubmit(type);
			}
		},
		/** 关联校验 */
		async confirmHandleSubmit(type) {
			/** 开始校验 表单 */
			const addFormValues = this.$refs.addForm.save();

			if (!addFormValues) {
				return;
			}
			// 明细表校验
			if (this.$refs.purchaseDetailsOther) {
				if (!this.$refs.purchaseDetailsOther.save()) {
					return;
				}
			}

			if (this.$refs.scrapSteelPurchaseDetails) {
				if (!this.$refs.scrapSteelPurchaseDetails.save()) {
					return;
				}
			}
			if (this.$refs.purchaseDetails) {
				if (!this.$refs.purchaseDetails.save()) {
					return;
				}
			}
			/** 银行账户信息 */
			let bankFormInfo = this.$refs.bankForm.save();
			if (!bankFormInfo) {
				return;
			}
			/** 下游合同信息 */
			if (this.$refs.downContractForm) {
				if (!this.$refs.downContractForm.save()) {
					return;
				}
			}
			let downContractFormInfo = this.$refs.downContractForm ? this.$refs.downContractForm.save() : {};

			// 联系人信息

			let obj = {
				...addFormValues,
				buyCompanyId: this.VUEX_ST_COMPANYSUER.companyId, //买方企业id
				contractSignPlace: addFormValues.contractSignPlace[1], //合同签约地
				...downContractFormInfo,
				associateContract: this.associateContract,
				associateContractId: this.associateContractId,
				remark: this.remark,
				...bankFormInfo,
				auditChainAndOperator: this.$refs.relation.auditChainAndOperator
			};
			// 联系人信息处理
			if (['STEEL_PROFILE', 'FINISHED_STEEL_BUY_004', 'RECEIVABLE_STEEL_BUY_002'].includes(obj.contractTemplate)) {
				if (this.validContactForm()) {
					let contactValues = this.$refs.contactInfoForm.getFormValue();
					obj.buyerContactId = contactValues.buyerContactId;
					obj.sellerContactId = contactValues.sellerContactId;
					obj.buyerWechatId = contactValues.firstPartyWechatId;
					obj.sellerWechatId = contactValues.secondPartyWechatId;
				} else {
					return;
				}
			}
			let warehouseArr = [];
			if (this.$refs.purchaseDetails) {
				warehouseArr = cloneDeep(this.$refs.purchaseDetails.save());
			}
			if (this.$refs.scrapSteelPurchaseDetails) {
				warehouseArr = cloneDeep(this.$refs.scrapSteelPurchaseDetails.save());
			}
			if (this.$refs.purchaseDetailsOther) {
				warehouseArr = cloneDeep(this.$refs.purchaseDetailsOther.save()?.resultArr);
				obj.totalTaxAmount = this.$refs.purchaseDetailsOther.save()?.totalTaxAmount || 0;
			}
			warehouseArr.forEach(el => {
				el.taxAmount = el.test4;
				el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
				el.theoreticalWeight = el.theoreticalWeight == '/' ? '' : el.theoreticalWeight;
				el.materialName = Array.isArray(el.materialName) ? el.materialName : [el.materialName];
			});
			// 明细
			obj.contractPurchaseList = warehouseArr;
			// 合同模板数据
			const tpl = {};
			const item = this.contractTemplateList.find(el => {
				tpl[el.value] = this.contractInfo[el.value];
				if (el.required && !this.contractInfo[el.value]) {
					return true;
				}
			});
			if (item) {
				this.$message.error(`请输入${item.label}`);
				return;
			}
			// 廉政条款判断
			if (['FINISHED_STEEL_BUY_004'].includes(obj.contractTemplate)) {
				if (this.isShowAgainst && !this.contractInfo.againstCorruptionTerms) {
					this.$message.error(`请输入廉政条款`);
					return;
				}
				if (this.isShowAgainst) {
					tpl.againstCorruptionTerms = this.contractInfo.againstCorruptionTerms;
				}
			}
			obj = { ...obj, ...tpl };

			// againstCorruptionTerms
			// 检测敏感词
			let checkAry = [];
			for (const k in tpl) {
				if (tpl[k]) {
					if (typeof tpl[k] === 'string') {
						tpl[k] = tpl[k].replace(/<\/?mgc.*?>/g, '').replace(/style="background-color: rgb\(255, 255, 0\);"/g, '');
						obj[k] = tpl[k];
						checkAry.push(tpl[k]);
					}
				}
			}
			let result = await this.checkProblem(checkAry);
			if (result && result.length && !this.confirmOperation.continue && this.confirmOperation.type !== 'preview') {
				this.$refs.sensitiveModal.problemVisible = true;
				return;
			}
			/** oa流程 */
			if (this.oaflag) {
				obj = { ...obj, ...this.curOperator };
			}

			/** 判断编辑类型 */
			if (this.$route.query.contractId) {
				obj.id = this.$route.query.contractId;
				obj.contractNo = this.resultDetail.contractNo;
			}

			if (type == 'preview') {
				const res = await API_SteelsBuyContractPreview(obj);
				this.$refs.orderModal.visible = true;
				this.$refs.orderModal.url = res.data.contractPdf;
			}

			if (type == 'save') {
				let API = API_SteelsBuyContractSave;
				if (this.$route.query.contractId) {
					// 修改
					API = API_SteelsBuyContractUpdateToSave;
				}
				if (this.isOa) {
					API = API_SteelsBuyContractUpdateToSaveOa;
				}
				await API(obj);
				this.$message.success('保存成功');
				// 判断是否 oa
				if (!this.isOa) {
					this.$router.push({
						path: '/center/steels/contract/buy/list'
					});
				}
			}
			if (type == 'submit') {
				const params = {
					customerId: obj.sellCompanyId
				};
				const checkRes = await checkCompanyChange(params);
				this.reasons = checkRes.data.reasons;

				if (!checkRes.data.result) {
					this.$refs.baseModal.showModal();
					return;
				}
				this.$confirm({
					centered: true,
					title: '确定提交合同?',
					okText: '确定',
					cancelText: '取消',
					onOk: async () => {
						await API_SteelsBuyContractSubmit(obj);
						this.$router.push({
							path: '/center/steels/contract/buy/list'
						});
					},
					onCancel() {}
				});
			}
		},
		/*
		 * 获取富文本的值
		 */
		getData(data) {
			if (data.data.replace(/<[^>]+>/g, '') == '') {
				this.contractInfo[data.value] = '';
			} else {
				this.contractInfo[data.value] = data.data;
			}
		},
		// 查看合同详情
		async getEditBuyContractDetail(contractId) {
			this.contractId = contractId;
			const res = await API_SteelsContractDetail(contractId);
			this.remark = res.data.remark;

			this.$nextTick(() => {
				this.$refs.addForm.init(res.data);
			});
		},
		// 获取关联合同信息
		async getRelationOrderDetail(item) {
			this.associateContract = '';
			this.associateContractId = '';
			this.$refs.relation.relationForm.setFieldsValue({ contractNo: '' });
			/** 设置 当前合同的钢材种类 和 指定规格 */
			if (!item.contractNo) return;
			this.associateContractId = item.id;
			this.associateContract = item.contractNo || '';
			this.$refs.relation.relationForm.setFieldsValue({ contractNo: this.associateContract });
			// 补录
			if (item.generateWay == 'ARTIFICIAL_COLLECTION') {
				return;
			}
			/*** 查询选择的合同明细 */
			const res = await API_SteelsContractViewDetail(item.id);
			/** 填充数据 */
			res.data.contractPurchaseList.forEach(el => {
				el.calendar = [el.materialName, el.materialTexture, el.specs];
				if (!item.steelType.includes('SCRAP_STEEL') && item.appointSpec === 0) {
					el.calendar = [el.materialName, el.materialTexture];
				}
			});
			// 填充的数据
			const obj = {
				appointSpec: res.data.appointSpec,
				steelType: res.data.steelType
			};
			this.$refs.addForm.setForm(obj);
			this.purchaseDetailsData = res.data.contractPurchaseList;
		},

		async checkProblem(content) {
			let res = await API_SensitiveWordsCheck({ content });
			if (res.success) {
				this.problemList = res.data;
			}
			return Promise.resolve(this.problemList.sort((a, b) => b.length - a.length));
		},
		continueNext() {
			this.confirmOperation.continue = true;
			this.handleSubmit(this.confirmOperation.type);
		}
	}
};
</script>
<style lang="stylus" scoped>
.oa-wrapper{
  padding: 20px;
}
.warning-tips {
		color: #fc8002;
    padding: 0 30px 20px 30px;
		p {
			margin: 15px 0px;
		}
		ul {
			li {
				line-height: 28px;
				padding: 0 15px;
				list-style: inside;
			}
		}
	}
#orderModal {
	::v-deep.ant-modal {
		width: 80% !important;
		min-width: 800px;
		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
	}
	::v-deep.ant-table td { white-space: nowrap; }
}
::v-deep.ant-calendar-picker { width: 100% }
</style>
