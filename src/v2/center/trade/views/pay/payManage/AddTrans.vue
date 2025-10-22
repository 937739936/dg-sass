<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>{{ this.titleName }}</span
				>
			</div>
			<div
				class="slTitleAssis"
				style="margin-top: 30px"
			>
				合同信息
			</div>
			<ContractInfoTrans
				ref="contractInfo"
				:contractVo="contractInfo"
			/>
			<div class="slTitleAssis">基本信息</div>
			<BaseInfoTrans
				ref="baseInfo"
				:contractVo="contractInfo"
				:statisticsData="statisticsData"
				@getInvoiceInfo="getInvoiceInfo"
				@getSettleInfo="getSettleInfo"
				@getBankPayConfig="getBankPayConfig"
				@getPaymentType="getPaymentType"
			/>
			<!-- 选择“有票”且资金来源选择“自有资金”或“供应链资金”或“池保理”时，展示该板块 -->
			<!-- 上游发票 -->
			<InvoiceInfoTrans
				v-if="showInvoice && bankPayConfig && bankPayConfig.upInvoiceConfig"
				ref="upInvoiceInfo"
				invoiceType="up"
				:orderNo="contractInfo.orderNo"
			/>
			<!-- 付款类型选择“结算付款”且资金来源选择“自有资金”或“供应链资金”或“池保理”时，展示该板块 -->
			<SettleInfo
				v-if="showSettle && bankPayConfig && bankPayConfig.upStatementConfig"
				ref="settleInfo"
				settleType="up"
			/>
			<!-- 附件信息 -->
			<FileInfo
				v-if="fileType.length"
				:list="fileType"
				ref="fileInfo"
			></FileInfo>
			<!-- 审批流程 -->
			<Relation
				ref="relation"
				type="sell"
				:oaflag="oaflag"
			>
			</Relation>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						type="primary"
						:disabled="disabledSubmit"
						@click="handleSubmit('save')"
						>保存</a-button
					>
					<a-button
						type="primary"
						:disabled="disabledSubmit"
						@click="handleSubmit('submit')"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<a-modal
			class="slModal submitValidateModal"
			:visible="visible"
			title="提交确认"
			@cancel="
				() => {
					this.visible = false;
				}
			"
			@ok="saveData"
		>
			<p class="label">请确认以下信息是否有误：</p>
			<div class="infoBox">
				<p v-if="needPushOaShow">
					<span class="label required">是否推送OA：</span>
					<a-radio-group
						name="radioGroup"
						v-model="needPushOa"
					>
						<a-radio :value="true"> 推送 </a-radio>
						<a-radio :value="false"> 不推送 </a-radio>
					</a-radio-group>
				</p>
				<p>
					<span class="label">收款方：</span>
					<span v-if="contractInfo">{{ contractInfo.consigneeCompanyName || contractInfo.sellerName }}</span>
				</p>
				<p>
					<span class="label"> 付款类型：</span>
					<span v-if="bodyObj">{{ filterCodeByValueName(bodyObj.paymentType, 'payment_type') }}</span>
				</p>
				<p>
					<span class="label"> 资金来源：</span>
					<span v-if="bankPayConfig">{{ bankPayConfig.payTypeName }}</span>
				</p>
				<p>
					<span class="label"> 付款金额：</span>
					<span
						v-if="bodyObj"
						style="color: red"
						>{{ bodyObj.payAmount | formatMoney }}（{{ convertCurrency(bodyObj.payAmount) }}）</span
					>
				</p>
				<p>
					<span class="label"> 付款日期：</span>
					<span v-if="bodyObj">{{ bodyObj.planPayDate.replace('-', '年').replace('-', '月') + '日' }}</span>
				</p>
			</div>
		</a-modal>
		<ModalInfo
			ref="modalInfoChange"
			title="提示"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="forceBack"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="handleSubmit('save')"
				>
					保存后返回
				</a-button>
			</div>
		</ModalInfo>
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfoTrans from './components/ContractInfoTrans';
import BaseInfoTrans from './components/BaseInfoTrans';
import InvoiceInfoTrans from './components/InvoiceInfoTrans';
import SettleInfo from './components/SettleInfo';
import FileInfo from './components/FileInfo';
import Relation from './components/Relation.vue';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { convertCurrency } from '@/v2/utils/factory.js';
import ModalInfo from '@/v2/components/modalInfo/info';
import { deepCompare } from '@/v2/utils/factory';
import {
	API_PaymentCreateContract,
	API_PaymentCreateStatistics,
	API_COMPANplatformRiskAudit,
	API_COMPANYOACHECK,
	API_GETORDERAUDITChAINANOPERATORBYORdERNO,
	API_PaymentCreateSubmit,
	API_PaymentCreateSave,
	API_GetPaymentDetail
} from '@/v2/center/trade/api/pay';
import { mapGetters } from 'vuex';
export default {
	components: {
		breadcrumb,
		ContractInfoTrans,
		BaseInfoTrans,
		InvoiceInfoTrans,
		SettleInfo,
		FileInfo,
		Relation,
		ModalInfo
	},
	data() {
		return {
			filterCodeByValueName,
			convertCurrency,
			contractInfo: null, // 合同信息
			statisticsData: null, // 统计信息
			invoiceInfo: null, // 发票信息
			showGoods: false,
			showSettle: false,
			bankPayConfig: null, // 企业相关配置
			showInvoice: false, // 是否展示发票
			platformRiskAudit: true, // 判断是否需要平台风控审核
			needPushOa: true,
			oaflag: false,
			paymentType: '', // 付款类型
			isRZ: false, // 资金来源是否是融资类型
			saveType: '', //'save','submit' 保存或者提交
			bodyObj: null, // 保存的付款申请数据
			disabledSubmit: false,
			visible: false,
			fileType: [],
			detail: null, // 付款详情
			cacheInfo: {} // 缓存数据
		};
	},
	async mounted() {
		await this.getContractDetail();
		await this.getStatistics();
		await this.checkOa();
		// 编辑
		if (this.$route.query.id) {
			this.getPayDetail();
		} else {
			this.$refs.baseInfo.init();
			this.cacheDetailInfo();
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		//付款名称
		titleName() {
			const editType = this.$route.query.id ? '编辑' : '新增';
			return `${editType}付款`;
		},
		isReSubmit() {
			const actionType = this.$route.query.actionType;
			return actionType === 'RESUBMIT_PAYMENT';
		},
		// 判断是否展示推送OA
		needPushOaShow() {
			// 不需平台风控审核，切对接OA的情况下展示
			// 陕煤系企业无论后端配置什么，都跳过平台风控审核
			return (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) && this.oaflag;
		}
	},
	methods: {
		async getPayDetail() {
			const res = await API_GetPaymentDetail({
				paymentId: this.$route.query.id
			});
			if (!res.success) return;
			this.detail = res.data;
			await this.$refs.baseInfo.edit(this.detail?.basicInfo);

			// 业务流程
			if (this.$refs.relation) {
				const auditChainAndOperator = this.detail?.auditChainAndOperator;
				if (auditChainAndOperator) {
					this.$refs.relation.detailAuditChainAndOperator = auditChainAndOperator;
					this.$refs.relation.setDefaultValue(auditChainAndOperator);
					setTimeout(() => {
						this.$refs.relation.setFieldsValue();
					}, 300);
				}
			}
			// 缓存数据
			setTimeout(() => {
				this.cacheDetailInfo();
			}, 0);
		},
		getPaymentType(data) {
			this.paymentType = data;
		},
		async checkOa() {
			await API_COMPANYOACHECK({ orderNo: this.$route.query.serialNo, bizType: 'PAYMENT' }).then(async res => {
				if (res.success) {
					this.oaflag = res.result;
					if (this.oaflag && this.$refs.relation) {
						this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
						await API_GETORDERAUDITChAINANOPERATORBYORdERNO({ orderNo: this.$route.query.serialNo }).then(res => {
							if (res.success) {
								this.$refs.relation.detailAuditChainAndOperator = res.data;
								this.$refs.relation.setDefaultValue(res.data);
								this.$refs.relation.setFieldsValue();
							}
						});
					}
				}
			});
		},
		async getContractDetail() {
			const res = await API_PaymentCreateContract({
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType
			});
			if (!res.success) return;
			this.contractInfo = res.data || null;
		},
		async getStatistics() {
			const res = await API_PaymentCreateStatistics({
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType
			});
			if (!res.success) return;
			this.statisticsData = res.data;
		},

		getInvoiceInfo(data) {
			this.showInvoice = data;
			// data-是否展示发票
			// 编辑
			if (!data) return;
			if (this.$route.query.id) {
				this.$nextTick(() => {
					const upStreamInvoiceVO = this.detail?.upStreamInvoiceVO?.transInvoiceList || [];
					if (this.$refs.upInvoiceInfo && upStreamInvoiceVO.length) {
						this.$refs.upInvoiceInfo.edit(upStreamInvoiceVO);
					}
				});
			}
		},
		// 获取结算单信息
		getSettleInfo(data) {
			this.showSettle = data;
			if (!data) return;
			this.$nextTick(() => {
				if (this.$route.query.id) {
					// 编辑结算单
					const statementVOList = this.detail?.statementVOList || [];
					if (statementVOList.length) {
						this.$refs.settleInfo.edit(statementVOList);
					} else {
						this.$refs.settleInfo.init();
					}
				} else {
					this.$refs.settleInfo.init();
				}
			});
		},
		getBankPayConfig(data) {
			this.bankPayConfig = {
				...data,
				// 附件类型写死
				fileConfigList: [
					{
						required: true,
						type: 'DCBD',
						typeDesc: '到厂磅单'
					},
					{
						required: true,
						type: 'BZJPZ',
						typeDesc: '保证金凭证'
					},
					{
						required: false,
						type: 'CKBD',
						typeDesc: '出库磅单'
					},
					{
						required: false,
						type: 'OTHER',
						typeDesc: '其他凭证'
					}
				]
			};
			if (this.bankPayConfig?.fileConfigList?.length) {
				this.fileType = this.bankPayConfig.fileConfigList.map(item => {
					return {
						key: item.type,
						label: item.typeDesc,
						required: item.required,
						accept: '.png, .jpeg, .jpg, .gif, .pdf, .doc, .docx, .xlsx, .xls'
					};
				});
				// 编辑附件
				if (this.$route.query.id) {
					this.$nextTick(() => {
						const fileInfoList = this.detail?.fileInfoList || [];
						if (fileInfoList.length) {
							this.$refs.fileInfo?.init(fileInfoList);
						}
					});
				}
			} else {
				this.fileType = [];
			}
		},
		async handleSubmit(type) {
			// type -save不校验必填 submit校验必填
			this.visible = false;
			this.saveType = type;

			// 基本信息校验
			this.$refs.baseInfo.save(type).then(async res => {
				if (!res) return;
				const baseInfo = res;

				// 结算单信息处理
				let statementIdList = [];
				if (this.$refs.settleInfo) {
					statementIdList = this.$refs.settleInfo.save(type);
					if (type !== 'save' && !statementIdList.length && this.bankPayConfig?.upStatementRequired) {
						this.$message.error('上游结算单必填');
						return;
					}
				}

				// 发票处理
				let invoiceIdList = [];
				if (this.$refs.upInvoiceInfo) {
					invoiceIdList = this.$refs.upInvoiceInfo.invoiceSelectedIds
						? this.$refs.upInvoiceInfo.invoiceSelectedIds.split(',')
						: [];
					if (type !== 'save' && !invoiceIdList.length && this.bankPayConfig?.upInvoiceRequired) {
						this.$message.error('上游发票必填');
						return;
					}
				}

				//审批流处理
				let auditChainAndOperator = null;
				if (this.oaflag && this.$refs.relation) {
					this.$refs.relation.relationForm.validateFieldsAndScroll(() => {
						auditChainAndOperator =
							JSON.stringify(this.$refs.relation.auditChainAndOperator) == '{}'
								? null
								: this.$refs.relation.auditChainAndOperator;
					});
				}
				if (type !== 'save' && this.oaflag && !auditChainAndOperator) {
					return;
				}

				// 附件处理
				let fileInfoList = [];
				if (this.$refs.fileInfo) {
					fileInfoList = this.$refs.fileInfo?.save(type);
					if (type !== 'save' && !fileInfoList) {
						return;
					}
				}

				this.bodyObj = {
					...baseInfo,
					contractType: this.$route.query.contractType,
					serialNo: this.$route.query.serialNo,
					invoiceIdList: invoiceIdList,
					statementIdList: statementIdList,
					auditChainAndOperator: auditChainAndOperator,
					fileInfoList: fileInfoList,
					id: this.$route.query.id || ''
				};
				if (type === 'save') {
					this.saveData();
					return;
				}
				this.confirmFunc();
			});
		},
		async confirmFunc() {
			// 判断是否需要平台审核，
			if (bankPayConfig.payType) {
				let res = await API_COMPANplatformRiskAudit({ payType: bankPayConfig.payType });
				if (res.success) {
					this.platformRiskAudit = res.result;
				}
			}
			this.visible = true;
		},
		// 接口保存
		saveData() {
			const API = this.saveType === 'save' ? API_PaymentCreateSave : API_PaymentCreateSubmit;
			this.disabledSubmit = true;
			let params = {
				...this.bodyObj,
				repeatSubmitFlag: this.isReSubmit
			};
			// 是否需要推送OA
			if (this.saveType === 'submit' && this.needPushOaShow) {
				params.needPushOa = this.needPushOa;
			}
			this.visible = false;
			API(params)
				.then(res => {
					if (res.success) {
						this.$message.success(this.saveType === 'save' ? '保存成功' : '提交成功');
						this.$router.push('/center/fund/pay/record/list');
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
					this.$refs.modalInfoChange?.close();
				});
		},
		// 获取缓存数据
		async cacheDetailInfo() {
			let statementIdList = [];
			let statementVOList = this.detail?.statementVOList || [];
			statementIdList = statementVOList.length ? statementVOList?.map(i => i.id) : [];
			// 发票处理
			let invoiceIdList = [];
			let upStreamInvoiceVO = this.detail?.upStreamInvoiceVO;
			upStreamInvoiceVO?.tradeInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			upStreamInvoiceVO?.transInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			// 附件处理
			let fileInfoList = this.detail?.fileInfoList.map(item => {
				return {
					type: item.type,
					url: item.url,
					name: item.name,
					uploadTime: item.uploadTime,
					dataSource: item.dataSource,
					md5Hex: item.md5Hex,
					id: item.id || undefined
				};
			});
			let fileInfoArr = [];
			if (this.bankPayConfig?.fileConfigList?.length) {
				this.bankPayConfig?.fileConfigList.forEach(item => {
					fileInfoList?.forEach(pro => {
						if (pro.type === item.type) {
							fileInfoArr.push(pro);
						}
					});
				});
			}

			//审批流处理
			let auditChainAndOperator = this.detail?.auditChainAndOperator || null;
			if (this.oaflag && !this.detail?.auditChainAndOperator && this.$refs.relation) {
				this.$refs.relation.relationForm.validateFieldsAndScroll(() => {
					auditChainAndOperator =
						JSON.stringify(this.$refs.relation.auditChainAndOperator) == '{}' ? null : this.$refs.relation.auditChainAndOperator;
				});
			}
			this.cacheInfo = {
				comments: this.detail?.basicInfo.comments,
				hasInvoice: this.detail?.basicInfo.hasInvoice,
				paymentMethod: this.detail?.basicInfo.paymentMethod || undefined,
				paymentType: this.detail?.basicInfo.paymentType,
				payAmount: this.detail?.basicInfo.payAmount || undefined,
				planPayDate: this.detail?.basicInfo.planPayDate || undefined,
				receiveAccName: this.detail?.basicInfo.receiveAccName || undefined,
				receiveAccNo: this.detail?.basicInfo.receiveAccNo || undefined,
				receiveAccBank: this.detail?.basicInfo.receiveAccBank,
				sellerBankAccountId: this.detail?.basicInfo.receiveId || undefined,
				payType: this.detail?.basicInfo.payType || undefined,
				contractType: this.$route.query.contractType,
				serialNo: this.$route.query.serialNo,
				invoiceIdList: invoiceIdList,
				statementIdList: statementIdList,
				auditChainAndOperator: auditChainAndOperator,
				fileInfoList: fileInfoArr,
				id: this.$route.query.id || ''
			};
		},
		async oldAndNew() {
			const type = 'save';

			// 基本信息校验
			this.$refs.baseInfo.save(type).then(async res => {
				if (!res) return;
				const baseInfo = res;
				// 结算单信息处理
				let statementIdList = [];
				if (this.$refs.settleInfo) {
					try {
						statementIdList = this.$refs.settleInfo.save(type);
					} catch (e) {
						statementIdList = null;
					}
				}

				// 发票处理
				let invoiceIdList = [];
				if (this.$refs.upInvoiceInfo) {
					invoiceIdList = this.$refs.upInvoiceInfo.invoiceSelectedIds
						? this.$refs.upInvoiceInfo.invoiceSelectedIds.split(',')
						: [];
				}

				//审批流处理
				let auditChainAndOperator = null;
				if (this.oaflag && this.$refs.relation) {
					this.$refs.relation.relationForm.validateFieldsAndScroll(() => {
						auditChainAndOperator =
							JSON.stringify(this.$refs.relation.auditChainAndOperator) == '{}'
								? null
								: this.$refs.relation.auditChainAndOperator;
					});
				}

				// 附件处理
				const fileInfoList = this.$refs.fileInfo?.save(type);
				let fileInfoArr = [];
				if (this.bankPayConfig?.fileConfigList?.length) {
					this.bankPayConfig?.fileConfigList.forEach(item => {
						fileInfoList?.forEach(pro => {
							if (pro.type === item.attachType) {
								fileInfoArr.push(pro);
							}
						});
					});
				}

				this.bodyObj = {
					...baseInfo,
					planPayDate: baseInfo.planPayDate || undefined,
					payAmount: baseInfo.payAmount || undefined,
					contractType: this.$route.query.contractType,
					serialNo: this.$route.query.serialNo,
					invoiceIdList: invoiceIdList,
					statementIdList: statementIdList,
					auditChainAndOperator: auditChainAndOperator,
					fileInfoList: fileInfoList,
					id: this.$route.query.id || ''
				};
				console.log('this.cacheInfo', this.cacheInfo);
				console.log('this.bodyObj', this.bodyObj);
				if (!deepCompare(this.cacheInfo, this.bodyObj)) {
					this.$refs.modalInfoChange?.open();
				} else {
					this.forceBack();
				}
			});
		},
		cancel() {
			this.oldAndNew();
		},
		forceBack() {
			this.$refs.modalInfoChange?.close();
			this.$router.go(-1);
		}
	}
};
</script>

<style lang="less" scoped>
.slTitleAssis {
	margin-top: 50px;
	margin-bottom: 20px;
}
.content {
	padding-bottom: 70px;
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
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
				min-width: 90px;
				text-align: right;
				&.required {
					position: relative;
					&::after {
						content: '*';
						color: #f5222d;
						position: absolute;
						left: 0px;
					}
				}
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
</style>
