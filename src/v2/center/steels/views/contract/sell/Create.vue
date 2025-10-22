<template>
	<div
		style="width: 100%"
		:class="isOa ? 'oa-wrapper' : ''"
	>
		<div class="s-title">
			<span>{{ isOa ? '' : '创建' }}销售合同</span>
		</div>
		<div>
			<relation-order
				ref="relation"
				@detail="getRelationOrderDetail"
				type="buy"
				:oaflag="oaflag"
				:OAData="OAData"
				:showRelation="true"
				:isOa="isOa"
				:resultDetail="resultDetail"
			>
			</relation-order>
		</div>
		<AddFrom
			type="SELL"
			:isOa="isOa"
			@form="getFormData"
			ref="addForm"
			@copy="getCopyData"
			@changeSeller="changeSeller"
			@changeAppoint="changeAppoint"
		></AddFrom>

		<PurchaseDetailsOther
			ref="purchaseDetailsOther"
			type="sell"
			:steelType="formData.steelType"
			@sendData="getPurchaseDetailsData"
			:contractTemplate="formData.contractTemplate"
			:appointSpec="formData.appointSpec"
			:selectedData="purchaseDetailsData"
			:editable="editable"
			:resultDetail="resultDetail"
		/>
		<a-form style="margin-top: 20px">
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
			type="SELL"
		/>
		<!-- 业务类型为代采、仓押、代采+仓押类型的合同； -->

		<!-- 合同模板005 -->
		<template v-if="formData.contractTemplate == 'FINISHED_STEEL_SELL_005'">
			<contact-info-form
				:contractTemplate="formData.contractTemplate"
				:partyAContactId="sellerContactId"
				:partyBContactId="buyerContactId"
				:partyAWechatId="resultDetail.sellerWechatId"
				:partyBWechatId="resultDetail.buyerWechatId"
				:partyA="VUEX_ST_COMPANYSUER.companyId"
				:partyB="formData.buyCompanyId"
				ref="contactInfoForm"
				:disabled="disabled"
			/>
		</template>
		<div v-if="formData.contractTemplate == 'FINISHED_STEEL_SELL_005'">
			<ContractTemplate
				v-for="item in sellContractTemplateInfo.FINISHED_STEEL_SELL_005_1"
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
			<!-- 追保保证金 -->
			<MarginCall
				:selectedData="selectedData"
				ref="marginCall"
				@sendText="getText"
			></MarginCall>
			<ContractTemplate2
				v-for="item in sellContractTemplateInfo.FINISHED_STEEL_SELL_005_2"
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
			<ContractTemplate
				v-for="item in sellContractTemplateInfo.FINISHED_STEEL_SELL_005_3"
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
		</div>

		<div v-else>
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
		</div>

		<!-- 廉政条款 -->
		<ContractTemplate
			key="102"
			type="102"
			label="廉政条款"
			v-if="isShowAgainst"
			value="againstCorruptionTerms"
			:disabled="disabled"
			:getData="getData"
			:required="false"
			:contractTemplate="formData.contractTemplate"
			:problemList="problemList"
			:defaultValue="contractInfo.againstCorruptionTerms"
		/>

		<template v-if="isOa">
			<h3
				style="margin: 30px 0; font-size: 18px"
				v-if="resultDetail.pdfPath || resultDetail.commitmentLetterPdfPath || resultDetail.bothSidesAgreementPdf"
			>
				合同附件
			</h3>
			<div
				style="width: 100px"
				v-if="resultDetail.pdfPath"
			>
				<img
					class="cp"
					style="display: inline-block; width: 100%"
					src="@/assets/imgs/pdf.png"
					@click="openPdf(resultDetail.pdfPath)"
				/>
				<p class="tc mt8">钢材销售合同</p>
			</div>
			<div
				style="width: 100px"
				v-if="resultDetail.commitmentLetterPdfPath"
			>
				<img
					class="cp"
					style="display: inline-block; width: 100%"
					src="@/assets/imgs/pdf.png"
					@click="openPdf(resultDetail.commitmentLetterPdfPath)"
				/>
				<p class="tc mt8">承诺函</p>
			</div>
			<div
				style="width: 100px"
				v-if="resultDetail.bothSidesAgreementPdf"
			>
				<img
					class="cp"
					style="display: inline-block; width: 100%"
					src="@/assets/imgs/pdf.png"
					@click="openPdf(resultDetail.bothSidesAgreementPdf)"
				/>
				<p class="tc mt8">双方协议</p>
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
		<orderModal ref="orderModal" />
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

import AddFrom from '../components/AddForm.vue';
import BankForm from '../components/BankForm.vue';
import ContactInfoForm from '../components/ContactInfoForm';
import ContractTemplate from '../components/TemplateIndex.vue';
import ContractTemplate2 from '../components/NewTemplateIndex.vue';

import SensitiveModal from '../components/SensitiveModal.vue';
import PurchaseDetailsOther from '@/v2/center/steels/components/PurchaseDetailsOther.vue';
import MarginCall from './components/MarginCall.vue';
import OrderModal from './components/OrderModal';
import RelationOrder from '../components/RelationOrder.vue';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { cloneDeep } from 'lodash';
import { sellContractTemplateInfo } from '@/v2/center/steels/config/constant.js';
import { checkCompanyChange } from '@/v2/center/trade/api/contract';
import BaseModal from '@/v2/components/signModal/BaseModal.vue';

export default {
	data() {
		return {
			curOperator: {},
			isOa: false,
			oaflag: false,
			disabled: false,
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
			associateContractId: '',

			// 备注
			remark: '',
			// 需要展示廉政条款的公司
			againstCorruptionTerms: filterSteelsCodeByKey('againstCorruptionTerms') || [],
			loadingSubmit: false,
			loadingSave: false,
			loadingPreview: false,
			/*** 改造之后 */
			formData: {
				steelType: ['FINISHED_STEEL']
			},
			// 复制合同详情
			copyContractInfo: {},
			// 敏感词
			confirmOperation: {
				continue: false,
				type: ''
			},
			problemList: [],
			// 素材数据 不准确 主要是用来获取 保证金金额
			selectedData: [],
			sellContractTemplateInfo,
			reasons: []
		};
	},
	props: ['OAData'],
	components: {
		AddFrom,
		BankForm,
		ContactInfoForm,
		ContractTemplate,
		OrderModal,
		RelationOrder,
		PurchaseDetailsOther,
		SensitiveModal,
		MarginCall,
		ContractTemplate2,
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
			return sellContractTemplateInfo[this.formData.contractTemplate];
		}
	},
	async mounted() {
		this.isOa = this.$route.name === 'OaSteelsContractBuyDetail';
		const { contractId, companyUserId } = this.$route.query;
		this.VUEX_AT_GETALLCODE_V2();
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

			if (this.oaflag) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
			}

			// 银行信息赋值
			this.$nextTick(() => {
				// 销售合同 和 采购合同 买卖双方 是相反的
				this.$refs.bankForm.copyData(info.sellBankNo, info.buyBankNo, info.sellCompanyId, info.buyCompanyId);
				this.$refs.relation &&
					this.$refs.relation.relationForm.setFieldsValue({
						contractNo: info.associateContract,
						noRelation: !info.associateContract
					});
				// 追保函赋值
				this.$refs.marginCall && this.$refs.marginCall.init(info.bondLetterSettings || {});
			});
		},
		// 更换卖方
		changeSeller(info) {
			this.formData = info;
			// 赋值银行信息
			this.$refs.bankForm.changeSeller('', '', this.VUEX_ST_COMPANYSUER.companyId, info.buyCompanyId);
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
			const res = await API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc, industryType: 'STEEL' });
			this.oaflag = res.result;
			if (this.oaflag) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
			}
			if (this.resultDetail.operatorName) {
				const { operatorName, operatorMobile } = this.resultDetail;
				this.curOperator = { operatorName, operatorMobile };
			}
		},
		// 获取关联合同信息
		async getRelationOrderDetail(item) {
			this.associateContract = '';
			this.associateContractId = '';
			this.$refs.relation.relationForm.setFieldsValue({ contractNo: '' });
			if (item.contractNo) {
				this.associateContract = item.contractNo;
				this.associateContractId = item.id;
				this.$refs.relation.relationForm.setFieldsValue({ contractNo: this.associateContract });
				/*** 查询选择的合同明细 */
				// 销售没有废钢
				if (item.steelType.includes('SCRAP_STEEL')) return;
				// 合同模板001
				if (item.contractTemplate == 'STEEL_PROFILE') return;

				if (item.generateWay == 'ARTIFICIAL_COLLECTION') return;

				const res = await API_SteelsContractViewDetail(item.id);
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
			}
		},
		// 验证联系人信息
		validContactForm() {
			let result = false;
			this.$refs.contactInfoForm.contactForm.validateFieldsAndScroll(e => {
				if (e) {
					result = false;
				} else {
					result = true;
				}
			});
			return result;
		},
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
		async confirmHandleSubmit(type) {
			/** 开始校验 表单 */
			const addFormValues = this.$refs.addForm.save();
			if (!addFormValues) {
				return;
			}
			// 明细表
			if (!this.$refs.purchaseDetailsOther.save()) {
				return;
			}
			/** 银行账户信息 */
			let bankFormInfo = this.$refs.bankForm.save();
			if (!bankFormInfo) {
				return;
			}

			let obj = {
				...addFormValues,
				sellCompanyId: this.VUEX_ST_COMPANYSUER.companyId, //买方企业id
				contractSignPlace: addFormValues.contractSignPlace[1], //合同签约地
				associateContract: this.associateContract,
				associateContractId: this.associateContractId,
				remark: this.remark,
				...bankFormInfo,
				auditChainAndOperator: this.$refs.relation.auditChainAndOperator
			};
			let warehouseArr = null;
			warehouseArr = cloneDeep(this.$refs.purchaseDetailsOther.save()?.resultArr);
			obj.totalTaxAmount = this.$refs.purchaseDetailsOther.save()?.totalTaxAmount || 0;
			warehouseArr.forEach(el => {
				el.taxAmount = el.test4;
				el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
				el.theoreticalWeight = el.theoreticalWeight == '/' ? '' : el.theoreticalWeight;
				el.materialName = Array.isArray(el.materialName) ? el.materialName : [el.materialName];
			});

			obj.contractPurchaseList = warehouseArr;
			/** 追保函 */
			if (obj.contractTemplate == 'FINISHED_STEEL_SELL_005') {
				if (!this.$refs.marginCall.save()) {
					return;
				}
				obj.bondLetterSettings = this.$refs.marginCall.save();
			}
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
			if (this.isShowAgainst) {
				tpl.againstCorruptionTerms = this.contractInfo.againstCorruptionTerms;
			}
			obj = { ...obj, ...tpl };
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
			if (this.oaflag) {
				obj = { ...obj, ...this.curOperator };
			}
			// 联系人信息处理
			if (obj.contractTemplate == 'FINISHED_STEEL_SELL_005') {
				if (this.validContactForm()) {
					let contactValues = this.$refs.contactInfoForm.getFormValue();
					obj.sellerContactId = contactValues.buyerContactId;
					obj.buyerContactId = contactValues.sellerContactId;
					obj.buyerWechatId = contactValues.secondPartyWechatId;
					obj.sellerWechatId = contactValues.firstPartyWechatId;
				} else {
					return;
				}
			}

			if (this.$route.query.contractId) {
				// 修改
				obj.contractNo = this.resultDetail.contractNo;
				obj.id = this.$route.query.contractId;
			}
			let res = {};
			if (type === 'preview') {
				res = await API_SteelsBuyContractPreview(obj);
				this.$refs.orderModal.visible = true;
				this.$refs.orderModal.contractUrl = res.data.contractPdf;
				this.$refs.orderModal.previewUrl = res.data.commitmentLetterPdf;
				this.$refs.orderModal.bothSidesAgreementPdf = res.data.bothSidesAgreementPdf;
			}
			if (type == 'save') {
				let API = this.$route.query.contractId ? API_SteelsBuyContractUpdateToSave : API_SteelsBuyContractSave;
				if (this.isOa) {
					API = API_SteelsBuyContractUpdateToSaveOa;
				}
				await API(obj);
				this.$message.success('保存成功');
				if (!this.isOa) {
					this.$router.push({
						path: '/center/steels/contract/sell/list'
					});
				}
			}
			if (type == 'submit') {
				const params = {
					customerId: obj.buyCompanyId
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
						this.$message.success('提交成功');
						this.$router.go(-1);
					},
					onCancel() {}
				});
			}
		},
		/*
		 * 获取富文本的值
		 */
		getData(data) {
			this.$set(this.contractInfo, data.value, data.data);
			// if(!data.data && data.value) {
			// 	this.contractInfo[data.value] = "";
			// 	return
			// }
			// if (data.data.replace(/<[^>]+>/g, "") == "") {
			// 	this.contractInfo[data.value] = "";
			// } else {
			// 	this.contractInfo[data.value] = data.data;
			// }
		},
		// 查看合同详情
		async getEditBuyContractDetail(contractId, from, isOaSave) {
			this.contractId = contractId;
			const res = await API_SteelsContractDetail(contractId);
			this.remark = res.data.remark;
			this.$nextTick(() => {
				this.$refs.addForm.init(res.data);
			});
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
		},
		// 获取编辑的明细数据 主要是用来获取保证金金额
		getPurchaseDetailsData(list) {
			this.selectedData = list;
		},
		// 更新履约保证金内容
		getText(val) {
			this.contractInfo.performanceBond = val;
			this.$forceUpdate();
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
