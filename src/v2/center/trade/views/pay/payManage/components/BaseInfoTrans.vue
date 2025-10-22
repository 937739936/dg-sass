<template>
	<div>
		<div
			class="money-box"
			v-if="statisticsData"
		>
			<div class="money-box-item">
				<p>已付款金额(元)</p>
				<p>{{ statisticsData.paymentAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #fff9f0"
			>
				<p>已结算金额(元)</p>
				<p>{{ statisticsData.settleAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="money-box-item"
				style="background: #ebfaef"
			>
				<p>已开票金额(元)</p>
				<p>{{ statisticsData.invoiceAmount | formatMoney(2) }}</p>
			</div>
		</div>
		<a-form
			:form="payApplyForm"
			class="slFormDetail"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="付款类型">
						<a-radio-group
							@change="paymentTypeChange"
							v-decorator="[
								'paymentType',
								{
									rules: [{ required: true, message: '付款类型必填' }]
								}
							]"
						>
							<!-- SETTLEMENT(1, "结算付款"),
							PRE_SETTLEMENT(2, "预结算付款"),
							FINANCING_REPAY(3, "融资还款"-不展示),
							PRE_PAYMENT(4, "预付款"),
							REFUND(5, "退款");-不展示 -->
							<template v-for="(items, index) in paymentTypeList">
								<a-radio
									style="margin-right: 30px"
									:key="index"
									:value="items.value"
									:disabled="items.value === 'PRE_SETTLEMENT' && $route.query.contractType === 'OFFLINE'"
									v-if="items.value !== 'FINANCING_REPAY' && items.value !== 'REFUND'"
									>{{ items.text }}</a-radio
								>
							</template>
						</a-radio-group>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="是否有票">
							<a-radio-group
								@change="invoiceChange"
								v-decorator="[
									'hasInvoice',
									{
										rules: [{ required: true, message: '是否有票必填' }]
									}
								]"
							>
								<a-radio
									value="NOINVOICE"
									style="margin-right: 40px"
									>无票</a-radio
								>
								<a-radio value="INVOICE">有票</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="付款方式">
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'paymentMethod',
									{
										rules: [{ required: true, message: '付款方式必填' }]
									}
								]"
								placeholder="请选择付款方式"
							>
								<a-select-option
									v-for="(items, index) in paymentMethodList"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<template v-if="contractInfo && contractInfo.receiveCompanyIsSettle">
					<a-col :span="8">
						<a-form-item
							label="收款账号名称"
							style="position: relative"
							class="border"
						>
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'sellerBankAccountId',
									{
										rules: [{ required: true, message: '收款账号必填' }]
									}
								]"
								@change="receiveBankChange"
								placeholder="收款账号名称"
								option-label-prop="label"
							>
								<a-select-option
									v-for="(items, index) in receiveBankInfo"
									:key="index"
									:value="items.id"
									:label="items.name"
								>
									<div class="omit">
										<p>账号名称：{{ items.accountName }}</p>
										<p>开户银行：{{ items.subbranchName }}</p>
										<p>银行账号：{{ formateBankNo(items.no) }}</p>
										<p>账户类型：{{ items.accountTypeDesc }}</p>
										<p v-if="items.remark">备注：{{ items.remark }}</p>
									</div>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="收款账号开户行">
								<a-input
									disabled
									v-decorator="[
										'receiveAccBank',
										{
											rules: [{ required: true, message: '收款账号开户行必填' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="收款账号">
								<a-input
									disabled
									v-decorator="[
										'receiveAccNo',
										{
											rules: [{ required: true, message: '收款账号必填' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<template v-else>
					<a-col :span="8">
						<a-form-item
							label="收款账号名称"
							class="border"
						>
							<a-auto-complete
								placeholder="请输入收款账号名称"
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'receiveAccName',
									{
										rules: [{ required: true, message: '收款账号名称必填' }]
									}
								]"
								option-label-prop="value"
								@select="receiveBankChange"
								@change="inputChange"
							>
								<template slot="dataSource">
									<a-select-option
										v-for="items in receiveBankInfo"
										:key="items.id"
										:value="items.id"
									>
										<div class="receiveOption">
											<span class="optionMain">
												<div class="omit">
													<p>账号名称：{{ items.accountName }}</p>
													<p>开户银行：{{ items.subbranchName }}</p>
													<p>银行账号：{{ formateBankNo(items.no) }}</p>
												</div>
											</span>
											<span
												v-if="items.paymentAccountSource"
												class="optionIcon"
												@click.stop="accountDeleteVisible(items)"
											></span>
										</div>
									</a-select-option>
								</template>
							</a-auto-complete>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="收款账号开户行"
								class="border"
							>
								<a-auto-complete
									:maxLength="200"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'receiveAccBank',
										{
											rules: [{ required: true, message: '收款银行必填' }]
										}
									]"
									placeholder="请输入收款方银行"
									option-label-prop="value"
									@select="receiveBankChange"
									@change="inputChange"
								>
									<template slot="dataSource">
										<a-select-option
											v-for="items in receiveBankInfo"
											:key="items.id"
											:value="items.id"
										>
											<div class="receiveOption">
												<span class="optionMain">
													<div class="omit">
														<p>账号名称：{{ items.accountName }}</p>
														<p>开户行：{{ items.subbranchName }}</p>
														<p>银行账号：{{ formateBankNo(items.no) }}</p>
														<p>账户类型：{{ items.accountTypeDesc }}</p>
														<p v-if="items.remark">备注：{{ items.remark }}</p>
													</div>
												</span>
												<span
													v-if="items.paymentAccountSource"
													class="optionIcon"
													@click.stop="accountDeleteVisible(items)"
												></span>
											</div>
										</a-select-option>
									</template>
								</a-auto-complete>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="收款账号"
								class="border"
							>
								<a-auto-complete
									placeholder="请输入收款账号"
									:getPopupContainer="getPopupContainer"
									v-decorator="[
										'receiveAccNo',
										{
											rules: [
												{ required: true, message: '收款账号必填' },
												{ min: 1, max: 32, message: `长度需要在1和32之间`, trigger: 'change' }
											]
										}
									]"
									option-label-prop="value"
									@select="receiveBankChange"
									@change="inputChange"
								>
									<template slot="dataSource">
										<a-select-option
											v-for="items in receiveBankInfo"
											:key="items.id"
											:value="items.id"
										>
											<div class="receiveOption">
												<span class="optionMain">
													<div class="omit">
														<p>账号名称：{{ items.accountName }}</p>
														<p>开户行：{{ items.subbranchName }}</p>
														<p>银行账号：{{ formateBankNo(items.no) }}</p>
														<p>账户类型：{{ items.accountTypeDesc }}</p>
														<p v-if="items.remark">备注：{{ items.remark }}</p>
													</div>
												</span>
												<span
													v-if="items.paymentAccountSource"
													class="optionIcon"
													@click.stop="accountDeleteVisible(items)"
												></span>
											</div>
										</a-select-option>
									</template>
								</a-auto-complete>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<a-col :span="8">
					<a-form-item label="资金来源">
						<a-select
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								'payType',
								{
									rules: [{ required: true, message: '资金来源必填' }]
								}
							]"
							@change="fundingSourceChange"
							placeholder="请选择资金来源"
							option-label-prop="label"
						>
							<a-select-option
								:class="(items.creditType === 'FINANCING_COMPANY_QUOTA' && items.remainingAmount !== null && Number(items.remainingAmount) <= 0) ? 'disabledChoose' : ''"
								v-for="(items, index) in fundingSourceList"
								:key="index"
								:data="items"
								:label="items.payTypeName"
								:value="items.payType"
								:disabled="items.creditType === 'FINANCING_COMPANY_QUOTA' && items.remainingAmount !== null && Number(items.remainingAmount) <= 0"
							>
								<a-tooltip>
									<template slot="title">
										<p>{{ items.payTypeName }}</p>
										<template v-if="items.creditType">
											<!-- 授信类型：核心企业额度、融资企业额度 -->
											<p class="lastp" v-if="items.creditType === 'CORE_COMPANY_QUOTA'">
												可用额度：{{ items.availableAmount | formatMoney(2) }}元
											</p>
											<p class="lastp" v-if="items.creditType === 'FINANCING_COMPANY_QUOTA'">
												客户可用额度：{{ items.availableAmount | formatMoney(2) }}元
											</p>
											<p class="lastp" v-if="items.creditType === 'FINANCING_COMPANY_QUOTA'">
												剩余总额度：{{ (items.remainingAmount || 0) | formatMoney(2)}}元
											</p>
										</template>
									</template>
									<div class="omit omitPay">
										<p :class="items.availableAmount || items.remainingAmount ? '' : 'lh52'">{{ items.payTypeName }}</p>
										<template v-if="items.creditType">
											<!-- 授信类型：核心企业额度、融资企业额度 -->
											<p class="lastp" v-if="items.creditType === 'CORE_COMPANY_QUOTA'">
												可用额度：{{ items.availableAmount | formatMoney(2) }}元
											</p>
											<p class="lastp" v-if="items.creditType === 'FINANCING_COMPANY_QUOTA'">
												客户可用额度：{{ items.availableAmount | formatMoney(2) }}元&nbsp;&nbsp;&nbsp;
											</p>
											<p class="lastp" v-if="items.creditType === 'FINANCING_COMPANY_QUOTA'">
												剩余总额度：{{ (items.remainingAmount || 0) | formatMoney(2)}}元
											</p>
										</template>
									</div>
								</a-tooltip>
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="showGoods"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="付款金额">
							<a-input
								v-inputTip
								v-decorator="[
									'payAmount',
									{
										rules: [
											{ required: true, message: '付款金额必填' },
											{ validator: validMoney },
											{
												pattern: /^\d+(\.\d{0,2})?$/,
												message: '请填写0-9999999999之间的数，最多2位小数'
											}
										]
									}
								]"
								placeholder="请输入付款金额"
							>
							</a-input>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="showGoods"
				>
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="付款日期">
							<a-date-picker
								placeholder="请选择付款日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								:allowClear="false"
								v-decorator="[
									'planPayDate',
									{
										rules: [{ required: true, message: '付款日期必填' }]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="24">
					<a-form-item
						label="备注"
						class="textarea-wrap"
					>
						<a-textarea
							v-decorator="['comments']"
							:autoSize="false"
							:maxLength="300"
							placeholder="请输入备注"
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import {
	API_PaymentCreateReceiveAccount,
	API_PaymentCreateBankProductItem,
	API_GetAccountDelete,
	API_PaymentCreateInvoice
} from '@/v2/center/trade/api/pay';
import { formateBankNo } from '@/v2/utils/factory.js';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import { isNumber } from "@/v2/utils/validForm";
export default {
	props: {
		contractVo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		statisticsData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {
		ConfirmModal
	},
	data() {
		return {
			isNumber,
			formateBankNo,
			getPopupContainer,
			contractInfo: {},
			payApplyForm: this.$form.createForm(this),
			paymentTypeList: filterCodeByKey('payment_type'),
			paymentMethodList: filterCodeByKey('payment_method'),
			fundingSourceList: [],
			receiveBankInfo: [],
			selectBankInfo: '', // 选中的收款账号信息
			accountDeleteId: '',
			showGoods: false, // 资金来源选择“自有资金”、“供应链资金”、“池保理”时，
			selectFundingSource: '', // 选中的资金来源
			paymentType: '', // 付款类型
			hasInvoice: '', // 是否有票
			invoiceInfo: null, // 发票数据
			paymentAccountSource: '', // 收款账号来源
			sellerBankAccountId: '',
		};
	},
	watch: {
		contractVo(data) {
			this.contractInfo = data;
		}
	},
	mounted() {},
	methods: {
		init() {
			this.getBankInfo();
		},
		async edit(data) {
			await this.getBankInfo();
			if (data) {
				await this.paymentTypeChange(data.paymentType);
				await this.fundingSourceChange(data.payType);
				await this.invoiceChange(data.hasInvoice);
				await this.receiveBankChange(data.receiveId);
				this.$nextTick(() => {
					this.payApplyForm.setFieldsValue({
						paymentType: data.paymentType
					});
					let that = this;
					setTimeout(() => {
						that.payApplyForm.setFieldsValue({
							comments: data.comments,
							hasInvoice: data.hasInvoice,
							paymentMethod: data.paymentMethod || undefined,
							payAmount: data.payAmount,
							planPayDate: data.planPayDate,
							receiveAccName: data.receiveAccName || undefined,
							receiveAccNo: data.receiveAccNo,
							receiveAccBank: data.receiveAccBank,
							sellerBankAccountId: data.receiveId || undefined
						});
						// 防止出现赋值资金来源无对应的下拉选项
						if (this.selectFundingSource) {
							that.payApplyForm.setFieldsValue({
								payType: data.payType || undefined,
							});
						}
					}, 0);
				});
			}
		},
		// 获取资金来源
		async getFundingSource() {
			return new Promise(async (resolve, reject) => {
				if (!this.paymentType) {
					reject(false);
				}
				const res = await API_PaymentCreateBankProductItem({
					contractType: this.$route.query.contractType,
					serialNo:  this.$route.query.serialNo,
					paymentType: this.paymentType || null,
					payType: this.selectFundingSource?.payType
				})
				if (!res.success) {
					reject(false);
				}
				this.fundingSourceList = res.data || [];
				resolve()
			})
		},
		// 资金来源改变
		fundingSourceChange(value) {
			return new Promise((resolve, reject) => {
				if (!this.fundingSourceList?.length) {
					reject(false)
				}
				this.fundingSourceList.forEach(item => {
					if (item.payType == value) {
						this.selectFundingSource = item;
					}
				});
				// 选择“自有资金”、“供应链资金”、“池保理”时，展示“付款金额”、"付款日期"字段；
				this.showGoods =
					['0', 'product-supply-chain'].includes(value) ||
					['POOL_FACTORING_LOANS'].includes(this.selectFundingSource?.financingType);
				this.fundingSourceOrPayTypeChange();
				this.fundingSourceOrInvoiceChange();
				this.$emit('getBankPayConfig', this.selectFundingSource);
				resolve()
			})
		},
		// 付款类型更改
		async paymentTypeChange(e) {
			return new Promise(async resolve => {
				const value = e?.target?.value || e;
				this.paymentType = value;
				this.$emit('getPaymentType', this.paymentType);
				this.$nextTick(()=>{
					this.payApplyForm.setFieldsValue({
						payType: undefined
					})
					this.selectFundingSource = ''
				})
				await this.getFundingSource();
				this.fundingSourceOrPayTypeChange();
				resolve()
			})
		},
		// 资金来源\付款类型改变
		fundingSourceOrPayTypeChange() {
			const paymentType = this.paymentType;
			const fundingSource = this.selectFundingSource?.payType;
			const hasPayType = typeof paymentType !== 'undefined' && paymentType !== null;
			const hasFundingSource = typeof fundingSource !== 'undefined' && fundingSource !== null;
			// 付款类型选择-结算付款”且资金来源选择“自有资金”或“供应链资金”或“池保理”时,展示对应的上游结算单
			const showSettle = hasPayType && hasFundingSource && paymentType == 'SETTLEMENT' && this.showGoods;
			this.$emit('getSettleInfo', showSettle);
		},
		//校验付款金额 应付账款金额
		validMoney(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 9999999999 || value <= 0) {
				callback('请填写0-9999999999之间的数，最多2位小数');
			}
			callback();
		},
		async checkInvoice() {
			const res = await API_PaymentCreateInvoice({
			  serialNo: this.$route.query.serialNo,
			  contractType:  this.$route.query.contractType,
			  payType:  this.selectFundingSource?.payType,
			})
			if (!res.success) return
			this.invoiceInfo = res.data
		},
		async invoiceChange(e) {
			// 如果未关联任何发票,不支持选中“有票”
			const val = this.payApplyForm.getFieldValue('hasInvoice');
			this.hasInvoice = e?.target?.value || e;
			if (this.hasInvoice === 'INVOICE') {
				await this.checkInvoice();
				if (
					!(
						this.invoiceInfo &&
						((this.invoiceInfo.tradeInvoiceList && this.invoiceInfo.tradeInvoiceList.length) ||
							(this.invoiceInfo.transInvoiceList && this.invoiceInfo.transInvoiceList.length))
					)
				) {
					this.$message.error('当前合同未开票或发票未上传');
					this.$nextTick(() => {
						this.payApplyForm.setFieldsValue({
							hasInvoice: val !== undefined ? val : ''
						});
						this.hasInvoice = val !== undefined ? val : '';
					});
				} else {
					this.fundingSourceOrInvoiceChange();
				}
			} else {
				this.fundingSourceOrInvoiceChange();
			}
		},
		// 资金来源\发票类型改变
		fundingSourceOrInvoiceChange() {
			// 发票选择-有票”且资金来源选择“自有资金”或“供应链资金”或“池保理”时,展示对应的发票信息
			const invoice = this.hasInvoice;
			const fundingSource = this.selectFundingSource?.payType;
			const hasInvoice = typeof invoice !== 'undefined' && invoice !== null;
			const hasFundingSource = typeof fundingSource !== 'undefined' && fundingSource !== null;
			const showInvoice = hasInvoice && hasFundingSource && invoice === 'INVOICE' && this.showGoods;
			this.$emit('getInvoiceInfo', showInvoice);
		},
		async getBankInfo() {
			const res = await API_PaymentCreateReceiveAccount({
				uscc: this.contractInfo.consigneeCompanyUscc
			})
			if (!res.success) return
			this.receiveBankInfo = res.data || []
		},
		inputChange() {
			this.sellerBankAccountId = ''
		},
		async receiveBankChange(value) {
			//遍历receiveBankInfo数组，根据id获取name
			return new Promise((resolve, reject) => {
				if (!this.receiveBankInfo?.length) {
					reject(false)
				};
				this.receiveBankInfo.forEach(item => {
					if (item.id == value) {
						this.selectBankInfo = item;
						this.sellerBankAccountId = value
						this.payApplyForm.setFieldsValue({
							receiveAccName: item.accountName,
							receiveAccBank: item.subbranchName,
							receiveAccNo: this.formateBankNo(item.no)
						});
					}
				});
				resolve()
			})
		},
		//删除终端账号
		accountDeleteVisible(items) {
			this.accountDeleteId = items.id; //要删除付款账号的id
			this.paymentAccountSource = items.paymentAccountSource; //要删除付款账号的id
			const modalObj = {
				modalTitle: '确认删除',
				modalText: '确认要删除该收款账号吗？'
			};
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			let id = this.accountDeleteId;
			API_GetAccountDelete({
				accountId : id,
				paymentAccountSource: this.paymentAccountSource
			}).then(res => {
				if (res.success) {
					this.receiveBankInfo = this.receiveBankInfo.filter(item => {
						return item.id != id;
					});
					this.$message.success('删除成功');
					this.deleteVisible = false; //删除付款账号弹框
				}
			});
			return;
		},
		save(type) {
			return new Promise((resolve, reject) => {
				// 保存不做必填校验
				if (type === 'save') {
					const val = this.payApplyForm.getFieldsValue()
					if (!val.hasOwnProperty('receiveAccName')) {
						val.receiveAccName = this.selectBankInfo?.accountName
					}
					if (!val.hasOwnProperty('sellerBankAccountId')) {
						val.sellerBankAccountId = this.sellerBankAccountId
					}
					val.receiveAccNo = val.receiveAccNo?.replace(/\s/g,"")
					resolve({
						...val,
					});
					return;
				}
				this.payApplyForm.validateFieldsAndScroll((error, values) => {
					if (error) {
						resolve(false);
						return;
					}
					if (!values.hasOwnProperty('receiveAccName')) {
						values.receiveAccName = this.selectBankInfo?.accountName
					}
					if (!values.hasOwnProperty('sellerBankAccountId')) {
						values.sellerBankAccountId = this.sellerBankAccountId
					}
					values.receiveAccNo = values.receiveAccNo?.replace(/\s/g,"")
					resolve({
						...values,
					});
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
.money-box {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30px;
	&-item {
		width: 25%;
		height: 88px;
		flex-shrink: 0;
		border-radius: 6px;
		background: #f0f8ff;
		padding: 14px 0;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		p:last-child {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
.slFormDetail {
	::v-deep.ant-form-item {
		width: 364px;
	}
}
.omit {
	border-bottom: 1px solid rgba(243, 245, 246, 1);
	p {
		white-space: wrap;
		overflow: hidden;
		vertical-align: bottom;
		width: 348px;
		line-height: 34px;
		color: rgba(0, 0, 0, 0.4);
		&:first-child {
			color: rgba(0, 0, 0, 0.8);
		}
	}
}
.disabledChoose {
	.omit {
		p {
			color: rgba(0, 0, 0, 0.4);
		}
	}
}
.border {
	::v-deep.ant-select-dropdown-menu-item:last-child {
		.omit {
			border-bottom: none;
		}
	}
	::v-deep.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
		background-color: #fff!important;
	}
}
.omitPay {
	border-bottom: none;
	min-height: 52px;
	& > p {
		line-height: 26px;
	}
	.lastp {
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		zoom: 0.85;
		display: block;
		width: 348px;
		white-space: wrap;
	}
	.lh52 {
		line-height: 52px;
	}
}
.receiveOption {
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	.optionMain {
		display: inline-block;
		max-width: calc(100% - 20px);
		white-space: wrap;
	}
	.optionIcon {
		display: inline-block;
		width: 24px;
		height: 24px;
		margin-top: 5px;
		background: url('~@/v2/assets/imgs/pay/del_icon.png') no-repeat 100% / cover;
		background-size: 14px 14px;
	}
}
.textarea-wrap {
	width: 100% !important;
	textarea {
		resize: none;
		width: 100%;
		height: 96px;
	}
}
</style>
