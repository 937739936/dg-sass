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
			<ContractInfo
				ref="contractInfo"
				:contractVo="contractInfo"
			/>
			<!-- 业务类型为“自营”、“其他”时，不展示业务线 -->
			<template v-if="showBusinessline">
				<div class="slTitleAssis">选择业务线</div>
				<BusinessLine
					ref="businessLine"
					:businessLineVo="businessLineData"
					:contractInfo="contractInfo"
					@getReturnInfo="getReturnInfo"
				/>
			</template>
			<!-- 业务类型为“标准仓押”时展示 -->
			<template v-if="isBZCY && businessLineNo">
				<DownReturnedInfo ref="downReturnedInfo" />
			</template>
			<div class="slTitleAssis">基本信息</div>
			<BaseInfo
				ref="baseInfo"
				:contractVo="contractInfo"
				:statisticsData="statisticsData"
				:businessLineNo="businessLineNo"
				@getGoodsInfo="getGoodsInfo"
				@getInvoiceInfo="getInvoiceInfo"
				@getSettleInfo="getSettleInfo"
				@getBankPayConfig="getBankPayConfig"
				@getPaymentType="getPaymentType"
				@getPlanPayDate="getPlanPayDate"
				:showBusinessline="showBusinessline"
			/>
			<!-- 付款类型选择“预结算付款”且资金来源选择“自有资金”或“供应链资金”或“池保理”时，展示该板块 -->
			<GoodsInfo
				v-if="!isRZ && showGoods"
				ref="goodsInfo"
				@changeGoodsInfo="changeGoodsInfo"
			/>
			<!-- 选择“有票”且资金来源选择“自有资金”或“供应链资金”或“池保理”时，展示该板块 -->
			<!-- 上游发票 -->
			<InvoiceInfo
				v-if="!isRZ && showInvoice && bankPayConfig && bankPayConfig.upInvoiceConfig"
				ref="upInvoiceInfo"
				invoiceType="up"
				:orderNo="contractInfo.orderNo"
			/>
			<!-- 下游发票 -->
			<InvoiceInfo
				v-if="!isRZ && showInvoice && bankPayConfig && bankPayConfig.downInvoiceConfig"
				ref="downInvoiceInfo"
				invoiceType="down"
				:downSerialNo="downSerialNo"
				:downContractType="downContractType"
				:orderNo="contractInfo.orderNo"
			/>
			<!-- 付款类型选择“结算付款”且资金来源选择“自有资金”或“供应链资金”或“池保理”时，展示该板块 -->
			<SettleInfo
				v-if="!isRZ && showSettle && bankPayConfig && bankPayConfig.upStatementConfig"
				ref="upSettleInfo"
				settleType="up"
			/>
			<SettleInfo
				v-if="!isRZ && showSettle && bankPayConfig && bankPayConfig.downStatementConfig"
				ref="downSettleInfo"
				settleType="down"
				:downSerialNo="downOrderNo"
				:downContractType="downContractType"
			/>
			<!-- 企业配置了税务信息 -->
			<TaxInfo
				ref="taxInfo"
				type="edit"
				:date="planPayDate"
				:paymentType="paymentType"
				:count="count"
				:bankPayConfig="bankPayConfig"
				:uscc="contractInfo ? contractInfo.sellerUscc : null"
				v-if="!isRZ && bankPayConfig && (bankPayConfig.taxPaymentUpConfig || bankPayConfig.taxReturnUpConfig)"
			/>
			<!-- 附件信息 -->
			<FileInfo
				v-if="fileType.length && !isRZ"
				:list="fileType"
				ref="fileInfo"
				v-on:loading="loadingUpload"
			></FileInfo>

			<!-- 审批流程 -->
			<Relation
				v-if="!isRZ"
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
						:loading="loadingBtn"
						>取消</a-button
					>
					<a-button
						type="primary"
						:disabled="isRZ || disabledSubmit || (showBusinessline && !businessLineNo)"
						@click="handleSubmit('save')"
						:loading="loadingBtn"
						>保存</a-button
					>
					<a-button
						v-if="isRZ"
						type="primary"
						:disabled="disabledSubmit"
						@click="handleSubmit('save')"
						>前去完善资产数据</a-button
					>
					<a-button
						v-else
						type="primary"
						:disabled="disabledSubmit || (showBusinessline && !businessLineNo)"
						@click="handleSubmit('submit')"
						:loading="loadingBtn"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<!-- 付款日期校验 -->
		<a-modal
			class="slTitleConfirmModal"
			:visible="veryVisible"
			title=""
			:maskClosable="false"
			@cancel="
				() => {
					this.veryVisible = false;
				}
			"
			v-if="modalObj"
		>
			<template v-if="modalObj.modalTitle">
				<div class="title">
					{{ modalObj.modalTitle }}
				</div>
				<div class="label">
					<p>{{ modalObj.modalText }}</p>
					<p v-html="modalObj.modalTextNext"></p>
				</div>
			</template>
			<template slot="footer">
				<a-button
					@click="
						() => {
							veryVisible = false;
						}
					"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmFunc"
					>继续操作</a-button
				>
			</template>
		</a-modal>
		<!-- 提交确认 -->
		<a-modal
			class="slModal submitValidateModal"
			:visible="visible"
			title="确认"
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
					<span v-if="contractInfo">{{ contractInfo.sellerName }}</span>
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
					<span v-if="bodyObj && bodyObj.planPayDate">{{
						bodyObj.planPayDate.replace('-', '年').replace('-', '月') + '日'
					}}</span>
				</p>
			</div>
		</a-modal>
		<!-- 内容是否被修改 -->
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
					@click="saveBack"
				>
					保存后返回
				</a-button>
			</div>
		</ModalInfo>
	</div>
</template>

<script>
import moment from 'moment';
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfo from './components/ContractInfo';
import BusinessLine from './components/BusinessLine';
import DownReturnedInfo from './components/DownReturnedInfo';
import BaseInfo from './components/BaseInfo';
import GoodsInfo from './components/GoodsInfo';
import InvoiceInfo from './components/InvoiceInfo';
import SettleInfo from './components/SettleInfo';
import TaxInfo from './components/TaxInfo';
import FileInfo from './components/FileInfo.vue';
import Relation from './components/Relation.vue';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { convertCurrency, deepCompare } from '@/v2/utils/factory.js';
import ModalInfo from '@/v2/components/modalInfo/info';
import { uniq } from 'lodash';
const businessLineTypeObj = {
	ONLINE: ['ONLINE', 'ONLINE'],
	UP: ['OFFLINE', 'ONLINE'],
	DOWN: ['ONLINE', 'OFFLINE'],
	OFFLINE: ['OFFLINE', 'OFFLINE']
};
// ONLINE 电子 电子
// UP 线下 电子
// DOWN 电子 线下
// OFFLINE 线下 线下

import {
	API_PaymentCreateContract,
	API_PaymentCreateBusinessLine,
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
		ContractInfo,
		BusinessLine,
		DownReturnedInfo,
		BaseInfo,
		GoodsInfo,
		InvoiceInfo,
		SettleInfo,
		TaxInfo,
		Relation,
		ModalInfo,
		FileInfo
	},
	data() {
		return {
			businessLineTypeObj,
			filterCodeByValueName,
			convertCurrency,
			contractInfo: null, // 合同信息
			businessLineData: [], // 业务线数据
			statisticsData: null, // 统计信息
			businessLineNo: '', // 选中的业务线号
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
			fileType: [], // 附件类型
			detail: null, // 付款详情
			planPayDate: null, // 付款日期
			cacheInfo: {}, // 缓存数据
			downSerialNo: '', // 下游订单编号、合同编号
			downOrderNo: '', // 下游订单编号
			modalObj: null,
			veryVisible: false,
			back: false, // 是否保存后返回
			downContractType: null, // 下游合同类型
			loadingBtn: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 业务类型为“自营”、“其他”时，不展示业务线
		showBusinessline() {
			return !['SELF_OPERATION', 'OTHER'].includes(this.contractInfo?.businessType);
		},
		// 业务类型为“标准仓押”、
		isBZCY() {
			return this.contractInfo?.businessType === 'WAREHOUSE_RECEIPTS_PLEDGE';
		},
		count() {
			const companyType = this.contractInfo?.sellCompanyClassification;
			const result = ['CLASS_A_CUSTOMER', 'CLASS_B_CUSTOMER'].includes(companyType);
			if (result) {
				return null;
			} else {
				return 3;
			}
		},
		//付款名称
		titleName() {
			const editType = this.$route.query.id ? '编辑' : '新增';
			return `${editType}付款`;
		},
		// 是否是重新提交
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
	async mounted() {
		await this.getContractDetail();
		await this.getStatistics();
		await this.getBusinessLine();
		await this.checkOa();
		// 编辑
		if (this.$route.query.id) {
			this.getPayDetail();
		} else {
			this.$refs.baseInfo.init();
			this.cacheDetailInfo();
		}
	},
	methods: {
		loadingUpload(flag) {
			this.loadingBtn = flag;
		},
		async getPayDetail() {
			const res = await API_GetPaymentDetail({
				paymentId: this.$route.query.id
			});
			if (!res.success) return;
			this.detail = res.data;
			this.businessLineNo = this.detail?.businessLineVO?.businessLineNo;

			// 业务线数据处理
			if (this.businessLineData.length > 1) {
				this.$nextTick(() => {
					if (this.businessLineNo) {
						this.$refs.businessLine.edit(this.businessLineNo);
					}
				});
			}
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
			await this.$refs.baseInfo.edit(this.detail?.basicInfo);
			// 缓存数据
			setTimeout(() => {
				this.cacheDetailInfo();
			}, 0);
		},
		getPlanPayDate(data) {
			this.planPayDate = data;
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
		async getBusinessLine() {
			const res = await API_PaymentCreateBusinessLine({
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType
			});
			if (!res.success) return;
			this.businessLineData = res.data || [];
		},
		// 标准仓押--获取下游回款信息
		getReturnInfo(data) {
			this.businessLineNo = data.businessLineNo;
			this.downSerialNo = this.$route.query.contractType === 'ONLINE' ? data.downOrderNo : data.downOrderNo;
			this.downOrderNo = data.downOrderNo;
			this.downContractType = this.businessLineTypeObj[data.businessLineType][1];
			if (this.isBZCY) {
				setTimeout(() => {
					this.$refs.downReturnedInfo.getInfo({
						businessLineNo: this.businessLineNo,
						businessLineType: data.businessLineType
					});
				}, 0);
			}
			this.getStatistics();
		},
		async getStatistics() {
			if (!this.$route.query.serialNo || !this.$route.query.contractType) return;
			const res = await API_PaymentCreateStatistics({
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType,
				businessLineNo: this.businessLineNo
			});
			if (!res.success) return;
			this.statisticsData = res.data;
		},
		// 获取货物信息
		getGoodsInfo(data) {
			this.showGoods = data;
			if (!data) return;
			// 编辑发票
			if (this.$route.query.id) {
				this.$nextTick(() => {
					this.$refs.goodsInfo.edit(this.bankPayConfig?.payType, this.paymentType, this.detail?.deliverGoodsTransVO);
				});
			} else {
				this.$nextTick(() => {
					this.$refs.goodsInfo.init(this.bankPayConfig?.payType, this.paymentType);
				});
			}
		},
		// 选中的货物信息-获取运输方式集合 回调资金来源接口
		changeGoodsInfo(data) {
			const despatchTypeList = data.map(item => item?.despatchType || item?.transType) || [];
			this.$refs.baseInfo.getFundingSource(uniq(despatchTypeList));
		},
		getInvoiceInfo(data) {
			this.showInvoice = data;
			// data-是否展示发票
			if (!data) return;
			this.$nextTick(() => {
				if (this.$refs.upInvoiceInfo) {
					this.$refs.upInvoiceInfo.getList();
				}
				if (this.$refs.downInvoiceInfo) {
					this.$refs.downInvoiceInfo.getList();
				}
			});

			// 编辑发票
			if (this.$route.query.id) {
				this.$nextTick(() => {
					const upStreamInvoiceVO = this.detail?.upStreamInvoiceVO;
					if (this.$refs.upInvoiceInfo && upStreamInvoiceVO) {
						this.$refs.upInvoiceInfo.edit(upStreamInvoiceVO);
					}
					const downStreamInvoiceVO = this.detail?.downStreamInvoiceVO;
					if (this.$refs.downInvoiceInfo && downStreamInvoiceVO) {
						this.$refs.downInvoiceInfo.edit(downStreamInvoiceVO);
					}
				});
			}
		},
		// 获取结算单信息
		getSettleInfo(data) {
			this.showSettle = data;
			if (!data) return;
			this.$nextTick(() => {
				// 编辑结算单
				const statementVOList = this.detail?.statementVOList || [];
				const downStreamStatementVOList = this.detail?.downStreamStatementVOList || [];
				if (this.$route.query.id && this.$refs.upSettleInfo && statementVOList.length) {
					this.$refs.upSettleInfo.edit(statementVOList);
				}
				if (this.$route.query.id && this.$refs.downSettleInfo && downStreamStatementVOList.length) {
					this.$refs.downSettleInfo.edit(downStreamStatementVOList);
				} else {
					if (this.$refs.upSettleInfo) {
						this.$refs.upSettleInfo.init();
					}
					if (this.$refs.downSettleInfo) {
						this.$refs.downSettleInfo.init();
					}
				}
			});
		},
		getBankPayConfig(data) {
			this.bankPayConfig = data;
			if (this.bankPayConfig?.fileConfigList?.length) {
				this.fileType = this.bankPayConfig.fileConfigList.map(item => {
					return {
						key: item.attachType,
						label: item.attachTypeDesc,
						required: item.required,
						accept: item.attachType === 'HSB' ? '.xlsx, .xls' : '.png, .jpeg, .jpg, .gif, .pdf, .doc, .docx, .xlsx, .xls'
					};
				});

				if (this.$route.query.id) {
					this.$nextTick(() => {
						// 编辑附件
						const fileInfoList = this.detail?.fileInfoList || [];
						if (fileInfoList.length) {
							this.$refs.fileInfo?.init(fileInfoList);
						}
						// 编辑税务信息
						const taxVOList = this.detail?.taxVOList || [];
						if (taxVOList.length) {
							this.$refs.taxInfo?.edit(taxVOList);
						}
					});
				}
			} else {
				this.fileType = [];
			}
			// 是否是融资类型
			this.isRZ = ['ACCOUNTS_RECEIVABLE_LOANS', 'PRE_PAYMENT_LOANS', 'COUNTERFOIL_LOANS'].includes(
				this.bankPayConfig?.financingType
			);
		},
		validateDate() {
			this.modalObj = {};
			const planPayDate = moment(this.planPayDate);
			const currentDate = moment(new Date());
			if (this.contractInfo?.businessType === 'OTHER' && !this.VUEX_ST_COMPANYSUER.belongsShanMei) {
				if (planPayDate >= currentDate) {
					this.modalObj = {
						modalTitle: '由于当前合同的业务类型为“其他”,且您填写的付款日期≥系统日期，系统判定本次付款为正常付款申请，故：',
						modalText:
							'本次付款将推送内部审批系统，需要相应财务实际打款。如果您确认需要实际打款，请点击“继续操作”；如果您线下已付过款，本次需要补录数据，请返回修改“付款日期”。'
					};
					this.veryVisible = true;
				} else {
					this.modalObj = {
						modalTitle: '由于当前合同的业务类型为“其他”,且您填写的付款日期<系统日期，系统判定本次付款为付款数据补录流程，故：',
						modalText:
							'1.本次付款不会推送审批系统，且无需财务打款，请确保您已线下完成付款，并填写的付款日期为实际付款日期，付款金额为本笔合同所需的金额；',
						modalTextNext:
							'2.提交后，将由平台审核，审核完成后由收款方进行收款确认，对方确认后，将变成已付款状态，数据将无法修改。'
					};
					this.veryVisible = true;
				}
			} else {
				this.confirmFunc();
			}
		},
		async confirmFunc() {
			// 判断是否需要平台审核，
			if (this.bankPayConfig.payType) {
				let res = await API_COMPANplatformRiskAudit({ payType: this.bankPayConfig.payType });
				if (res.success) {
					this.platformRiskAudit = res.result;
				}
			}
			// 判断是否对接OA,初始化时已判断
			this.visible = true;
		},
		saveBack() {
			this.back = true;
			this.handleSubmit('save');
		},
		async handleSubmit(type) {
			this.saveType = type;
			// 业务线处理
			let businessLineNo = '';
			if (this.$refs.businessLine) {
				try {
					businessLineNo = await this.$refs.businessLine.save(type);
				} catch (e) {
					businessLineNo = '';
				}
				if (type !== 'save' && !businessLineNo) {
					//订单业务类型为其他(赋能业务)可以没有下游
					if (this.contractInfo?.businessType && this.contractInfo?.businessType != 'OTHER') {
						if (this.businessLineData.length) {
							this.$message.error(this.businessLineData.length ? '请选择业务线！' : '业务线不存在');
							return;
						} else {
							this.$message.error('当前合同缺少业务线，无法进行付款');
							return;
						}
					}
				}
			}

			// 基本信息校验
			this.$refs.baseInfo.save(this.isRZ ? 'submit' : 'save').then(async res => {
				if (!res) return;
				const baseInfo = res;
				// 货物信息处理 deliveryNoList, goodsTransferNoList
				let goodsTransferNoList = [];
				let deliveryNoList = [];
				let goodsvdata = null;
				if (this.$refs.goodsInfo) {
					try {
						goodsvdata = await this.$refs.goodsInfo.save(type);
						goodsTransferNoList = goodsvdata?.goodsTransferNoList || [];
						deliveryNoList = goodsvdata?.deliveryNoList || [];
					} catch (e) {
						goodsvdata = null;
					}
					if (type !== 'save' && !goodsvdata) {
						return;
					}
				}
				// 结算单信息处理
				let statementIdList = [];
				if (this.$refs.upSettleInfo) {
					statementIdList = this.$refs.upSettleInfo.save(type);
					if (type !== 'save' && !statementIdList.length && this.bankPayConfig?.upStatementRequired) {
						this.$message.error('上游结算单必填');
						return;
					}
				}
				if (this.$refs.downSettleInfo) {
					const downSettle = this.$refs.downSettleInfo.save(type);
					if (type !== 'save' && !downSettle.length && this.bankPayConfig?.downStatementRequired) {
						this.$message.error('下游结算单必填');
						return;
					}
					statementIdList = statementIdList.concat(downSettle);
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
				if (this.$refs.downInvoiceInfo) {
					const downInvoice = this.$refs.downInvoiceInfo.invoiceSelectedIds
						? this.$refs.downInvoiceInfo.invoiceSelectedIds.split(',')
						: [];
					if (type !== 'save' && !downInvoice.length && this.bankPayConfig?.downInvoiceRequired) {
						this.$message.error('下游发票必填');
						return;
					}
					invoiceIdList = invoiceIdList.concat(downInvoice);
				}

				// 税务处理
				let taxAttachmentId = [];
				if (this.$refs.taxInfo) {
					if (type !== 'save') {
						const data = this.$refs.taxInfo.taxDataSource || [];
						if (this.bankPayConfig?.taxPaymentUpRequired && this.bankPayConfig?.taxReturnUpRequired && !data?.length) {
							this.$message.error('税务凭证必填');
							return;
						}
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
					businessLineNo: businessLineNo,
					goodsTransferNoList: goodsTransferNoList,
					deliveryNoList: deliveryNoList,
					invoiceIdList: invoiceIdList,
					statementIdList: statementIdList,
					taxAttachmentId: taxAttachmentId,
					auditChainAndOperator: auditChainAndOperator,
					fileInfoList: fileInfoList,
					id: this.$route.query.id || ''
				};
				if (type === 'save') {
					this.saveData();
					return;
				}
				this.validateDate();
			});
		},
		// 接口保存
		saveData() {
			const API =
				(this.saveType === 'save' && this.isRZ && !this.back) || this.saveType === 'submit'
					? API_PaymentCreateSubmit
					: API_PaymentCreateSave;
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
						if (!this.back && this.isRZ) {
							const id = res.data?.receivableId;
							const status = res.data?.receivableStatus;
							switch (this.bankPayConfig?.financingType) {
								case 'ACCOUNTS_RECEIVABLE_LOANS':
									this.$router.push('/center/assets/payable/manage/edit?id=' + id + '&activeIndex=0&status=' + status);
									break;
								case 'PRE_PAYMENT_LOANS':
									this.$router.push('/center/assets/advance/edit?id=' + id + '&activeIndex=0');
									break;
								case 'COUNTERFOIL_LOANS':
									this.$router.push('/center/assets/payable/manage/edit?id=' + id + '&activeIndex=0&status=' + status);
									break;
								default:
									break;
							}
						} else {
							this.$router.go(-1);
						}
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
					this.$refs.modalInfoChange?.close();
				});
		},
		// 获取缓存数据
		async cacheDetailInfo() {
			let goodsTransferNoList = [];
			let deliveryNoList = [];
			let goodsvdata = this.detail?.deliverGoodsTransVO;
			goodsTransferNoList = goodsvdata?.goodsTransferRecordList
				? goodsvdata?.goodsTransferRecordList.map(i => i.goodsTransferNo)
				: [];
			deliveryNoList = goodsvdata?.deliverRecordList ? goodsvdata?.deliverRecordList.map(i => i.batchNo) : [];
			let statementIdList = [];
			let statementVOList = this.detail?.statementVOList || [];
			statementIdList = statementVOList.length ? statementVOList?.map(i => i.id) : [];
			// 发票处理
			let invoiceIdList = [];
			let downStreamInvoiceVO = this.detail?.downStreamInvoiceVO;
			let upStreamInvoiceVO = this.detail?.upStreamInvoiceVO;
			downStreamInvoiceVO?.tradeInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			downStreamInvoiceVO?.transInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			upStreamInvoiceVO?.tradeInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			upStreamInvoiceVO?.transInvoiceList?.forEach(item => {
				invoiceIdList.push(item.id);
			});
			// 税务处理
			let taxAttachmentId = [];
			let taxVOList = this.detail?.taxVOList || [];
			taxAttachmentId = taxVOList.length ? taxVOList?.map(i => i.attachmentId) : [];
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
						if (pro.type === item.attachType) {
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
				businessLineNo: this.detail?.businessLineVO?.businessLineNo || '',
				goodsTransferNoList: goodsTransferNoList,
				deliveryNoList: deliveryNoList,
				invoiceIdList: invoiceIdList,
				statementIdList: statementIdList,
				taxAttachmentId: taxAttachmentId,
				auditChainAndOperator: auditChainAndOperator,
				fileInfoList: fileInfoArr,
				id: this.$route.query.id || ''
			};
			// 针对新增=且业务线只有一条时，默认选中
			if (
				!this.$route.query.id &&
				this.showBusinessline &&
				!this.cacheInfo.businessLineNo &&
				this.businessLineData?.length === 1
			) {
				this.cacheInfo.businessLineNo = this.businessLineData[0].businessLineNo;
			}
		},
		async oldAndNew() {
			const type = 'save';
			// 业务线处理
			let businessLineNo = '';
			if (this.$refs.businessLine) {
				try {
					businessLineNo = await this.$refs.businessLine.save(type);
				} catch (e) {
					businessLineNo = '';
				}
			}

			// 基本信息校验
			this.$refs.baseInfo.save(type).then(async res => {
				if (!res) return;
				const baseInfo = res;
				// 货物信息处理 deliveryNoList, goodsTransferNoList
				let goodsTransferNoList = [];
				let deliveryNoList = [];
				let goodsvdata = null;
				if (this.$refs.goodsInfo) {
					try {
						goodsvdata = await this.$refs.goodsInfo.save(type);
						goodsTransferNoList = goodsvdata?.goodsTransferNoList || [];
						deliveryNoList = goodsvdata?.deliveryNoList || [];
					} catch (e) {
						goodsvdata = null;
					}
				}
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
				if (this.$refs.downInvoiceInfo) {
					const downInvoice = this.$refs.downInvoiceInfo.invoiceSelectedIds
						? this.$refs.downInvoiceInfo.invoiceSelectedIds.split(',')
						: [];

					invoiceIdList = invoiceIdList.concat(downInvoice);
				}

				// 税务处理
				let taxAttachmentId = [];
				if (this.$refs.taxInfo) {
					const data = this.$refs.taxInfo.taxDataSource || [];
					if (data?.length) {
						taxAttachmentId = data.map(i => i.attachmentId);
					} else {
						if (type !== 'save' && this.bankPayConfig?.taxPaymentUpRequired && this.bankPayConfig?.taxReturnUpRequired) {
							this.$message.error('税务凭证必填');
							return;
						}
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
					businessLineNo: businessLineNo,
					goodsTransferNoList: goodsTransferNoList,
					deliveryNoList: deliveryNoList,
					invoiceIdList: invoiceIdList,
					statementIdList: statementIdList,
					taxAttachmentId: taxAttachmentId,
					auditChainAndOperator: auditChainAndOperator,
					fileInfoList: fileInfoArr,
					id: this.$route.query.id || ''
				};
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
				min-width: 100px;
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
.slTitleConfirmModal {
	.title {
		font-size: 16px;
		line-height: 22px;
		padding-right: 5px;
	}
	::v-deep.ant-modal {
		width: 590px !important;
	}
}
</style>
