<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>{{ this.$route.query.view === 'edit' ? $route.meta.editTitle : $route.meta.title }}</span
				>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul
				class="grid-wrap"
				v-if="contractInfo"
			>
				<li>
					<span class="label">合同编号</span>
					<span>
						<div
							style="display: inline-block"
							class="contract-box"
						>
							<TextOverFlow
								:content="orderLineType === 'ONLINE' ? contractInfo.contractNo : contractInfo.paperContractNo"
								:maxWidth="maxWidth"
								@clickFunc="viewContractDetail"
							/>
							<em @click="changeContract()">
								<Edit class="copy-icon"></Edit>
							</em>
						</div>
					</span>
				</li>
				<li>
					<span class="label">卖方企业</span>
					<TextOverFlow
						:content="contractInfo.sellerName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">买方企业</span>
					<TextOverFlow
						:content="contractInfo.buyerName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">品名</span>
					<TextOverFlow
						:content="contractInfo.goodsName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">{{ orderLineType === 'ONLINE' ? '基准价格' : '合同价格' }}</span>
					<TextOverFlow
						v-if="!contractInfo.followTheMarket && contractInfo.basePriceDesc"
						:content="contractInfo.basePriceDesc"
						:maxWidth="maxWidth"
					/>
					<span v-if="contractInfo.followTheMarket">随行就市</span>
					<span v-if="!contractInfo.followTheMarket && contractInfo.basePrice"
						>{{ contractInfo.basePrice | formatMoney(2) }}元/吨</span
					>
					<span v-if="!contractInfo.followTheMarket && !contractInfo.basePrice">-</span>
				</li>
				<li>
					<span class="label">{{ orderLineType === 'ONLINE' ? '数量' : '合同数量' }}</span>
					<span
						>{{ contractInfo.quantity | formatMoney(3) }}吨
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template>
					</span>
				</li>
				<li>
					<span class="label">交货期限</span>
					<span>{{ contractInfo.deliveryStartDate }}至{{ contractInfo.deliveryEndDate }}</span>
				</li>
				<li>
					<span class="label">运输方式</span>
					<span>{{ contractInfo.transportModeDesc || '无' }}</span>
				</li>
				<li>
					<span class="label">收货人</span>
					<TextOverFlow
						v-if="contractInfo.consigneeCompanyName"
						:content="contractInfo.consigneeCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</li>
			</ul>
			<div class="slTitleAssis">退款信息</div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item
							label="退款方"
							class="requiredItem"
						>
							<a-input
								size="large"
								disabled
								:value="contractInfo.sellerName"
								placeholder="请输入退款发起方"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							label="收款方"
							class="requiredItem"
						>
							<a-input
								size="large"
								disabled
								:value="contractInfo.buyerName"
								placeholder="请输入退款接收方"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="资金来源">
							<a-select
								size="large"
								disabled
								v-decorator="[
									'fundsSource',
									{
										initialValue: 'OWN',
										rules: [{ required: true, message: '请选择资金来源' }]
									}
								]"
								placeholder="请选择资金来源"
							>
								<a-icon
									slot="suffixIcon"
									type="caret-down"
								/>
								<a-select-option value="OWN"> 自有资金 </a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- 未注册认证 -->
					<template v-if="!contractInfo.buyerSettledFlag">
						<a-col :span="8">
							<a-form-item label="收款账号名称">
								<a-auto-complete
									placeholder="请输入收款账户名称"
									:getPopupContainer="getPopupContainer"
									@select="changeAccountName"
									v-decorator="[
										'receiveAccName',
										{
											rules: [
												{ required: true, message: '收款账号名称必填' },
												{ min: 1, max: 50, message: `长度需要在1和50之间`, trigger: 'blur' }
											]
										}
									]"
									option-label-prop="value"
								>
									<template slot="dataSource">
										<a-select-option
											v-for="item in receiveAccList"
											:key="item.no"
											:value="item.no"
										>
											<p class="optionMain">
												{{ item.accountName }} <span>({{ item.bankName }})</span>
											</p>
											<p style="color: rgba(0, 0, 0, 0.4); fontsize: 12px">{{ item.no }}</p>
										</a-select-option>
									</template>
								</a-auto-complete>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收款账号开户行">
								<a-input
									placeholder="请输入收款账号开户行"
									autoComplete="off"
									v-decorator="[
										'receiveAccBank',
										{
											rules: [
												{ required: true, message: '收款账号开户行必填' },
												{ min: 1, max: 50, message: `长度需要在1和50之间`, trigger: 'change' }
											]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收款账号">
								<a-tooltip
									:trigger="['focus']"
									placement="topLeft"
								>
									<template
										v-if="form.getFieldValue('receiveAccNo')"
										#title
									>
										<span>
											{{ formatValue }}
										</span>
									</template>
									<a-input
										placeholder="请输入收款账号"
										@blur="formateBankNo"
										onkeyup="value=value.replace(/[^0-9且或()]/g, '')"
										autoComplete="off"
										v-decorator="[
											'receiveAccNo',
											{
												rules: [
													{ required: true, message: '收款账号必填' },
													{ min: 5, max: 30, message: `长度需要在5和30之间`, trigger: 'change' }
												]
											}
										]"
									>
									</a-input>
								</a-tooltip>
							</a-form-item>
						</a-col>
					</template>
					<template v-else>
						<a-col :span="8">
							<a-form-item label="收款账号名称">
								<a-select
									size="large"
									:getPopupContainer="getPopupContainer"
									:disabled="disabled"
									@change="changeAccountName"
									v-decorator="[
										'receiveAccName',
										{
											rules: [{ required: true, message: '请选择收款账号名称' }]
										}
									]"
									placeholder="请选择收款账号"
								>
									<a-icon
										slot="suffixIcon"
										type="caret-down"
									/>
									<a-select-option
										v-for="item in receiveAccList"
										:key="item.no"
										:value="item.no"
									>
										<p class="optionMain">
											{{ item.accountName }} <span>({{ item.bankName }})</span>
										</p>
										<p style="color: rgba(0, 0, 0, 0.4); fontsize: 12px">{{ item.no }}</p>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
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
						</a-col>
						<a-col :span="8">
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
						</a-col>
					</template>

					<a-col :span="8">
						<a-form-item
							label="退款方式"
							style="position: relative"
						>
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'method',
									{
										rules: [{ required: true, message: '退款方式必填' }]
									}
								]"
								placeholder="请选择退款方式"
							>
								<a-select-option
									v-for="(items, index) in paymentMethod"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="退款金额(元)">
							<a-input-number
								placeholder="请输入退款金额"
								:formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
								:precision="2"
								v-decorator="[
									'refundAmount',
									{ rules: [{ required: true, message: '退款金额必填' }, { validator: validAmount }] }
								]"
								:step="0.01"
								:parser="value => value.replace(/\￥\s?|(,*)/g, '')"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="退款日期">
							<a-date-picker
								placeholder="请选择退款日期"
								:disabled-date="disabledDate"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								v-decorator="[
									`refundDate`,
									{
										rules: [{ required: true, message: `退款日期必填` }, { validator: validateDate }]
									}
								]"
							>
							</a-date-picker>
							<span
								v-if="wrongTips"
								class="fz12 gray"
								>{{ wrongTips }}</span
							>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="退款类型">
							<a-radio-group
								class="refundTypeItem"
								v-decorator="[
									'refundType',
									{
										rules: [{ required: true, message: `退款类型必填` }]
									}
								]"
							>
								<a-radio
									v-for="(item, index) in typeData"
									:value="item.value"
									:key="index"
									>{{ item.text }}</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<a-col
						:span="24"
						class="specialItem"
					>
						<a-form-item label="退款原因">
							<a-textarea
								class="textarea-wrap"
								placeholder="请输入退款原因，最多500字"
								v-decorator="[
									'refundReason',
									{
										rules: [{ required: false }, { max: 500, message: '退款原因不能超过500个字' }],
										validateTrigger: 'blur'
									}
								]"
							>
							</a-textarea>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="slTitleAssis">附件</div>
			<span></span>
			<AttachmentUpload
				@beginUpload="getBeginUpload"
				:dataSource="fileList"
				ref="attachmentUpload"
				accept=".jpg,.jpeg,.png,.pdf,.docx,.doc,.xls,.xlsx"
				tips="退款凭证：可支持格式为jpg，jpeg，png，pdf，docx，doc，xls，xlsx的附件，单个附件大小不得超过100M的文件。"
				:actionReturnId="true"
			/>
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
						:loading="loadingSubmit"
						:disabled="disabled"
						@click="submit"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<a-modal
			class="slModal submitValidateModal"
			:visible="visible"
			title="确认"
			@cancel="
				() => {
					this.visible = false;
				}
			"
			@ok="submitData"
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
					<span class="label">打款方：</span>
					<span v-if="contractInfo">{{ contractInfo.sellerName }}</span>
				</p>
				<p>
					<span class="label"> 退款类型：</span>
					<span v-if="dataObj">{{ filterCodeByValueName(dataObj.refundType, 'refundTypeEnum') }}</span>
				</p>
				<p>
					<span class="label"> 资金来源：</span>
					<span v-if="dataObj">{{ filterCodeByValueName(dataObj.fundsSource, 'bankProductItemEnums') }}</span>
				</p>
				<p>
					<span class="label"> 退款金额：</span>
					<span
						v-if="dataObj"
						style="color: red"
						>{{ dataObj.refundAmount | formatMoney }}（{{ convertCurrency(dataObj.refundAmount) }}）</span
					>
				</p>
				<p>
					<span class="label"> 退款日期：</span>
					<span v-if="dataObj && dataObj.refundDate">{{ dataObj.refundDate.replace('-', '年').replace('-', '月') + '日' }}</span>
				</p>
			</div>
		</a-modal>
		<ChooseContract
			:type="$route.query.type"
			:orderLineType="orderLineType"
			ref="chooseContract"
			@detail="getContractDetail"
			:orderId="orderId"
			confirmText="确定"
		/>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
		<UpdateApprovalProcess
			ref="updateApprovalProcess"
			@updateFunc="confirmFunc"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import AttachmentUpload from '@/v2/components/upload/AttachmentUpload';
import ChooseContract from './components/ChooseContract';
import UpdateApprovalProcess from './components/UpdateApprovalProcess';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import {
	API_REFUNDSUBMIT,
	API_REFUNDDETAIL,
	API_REFUNDREMPLATE,
	API_RefundSubmitValid,
	API_RefundReceiveAccount,
	API_COMPANplatformRiskAudit,
	API_COMPANYOACHECK
} from '@/v2/center/trade/api/pay';
import { mapGetters } from 'vuex';
import { GetCurrentDateFormat } from '@/v2/utils/factory';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { filterCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { handleScroll, convertCurrency } from '@/v2/utils/factory.js';
import { Edit } from '@sub/components/svg';
export default {
	name: 'Detail',
	data() {
		return {
			receiveAccList: [],
			getPopupContainer,
			convertCurrency,
			filterCodeByValueName,
			loadingSubmit: false,
			form: this.$form.createForm(this),
			refundData: {}, //退款信息
			contractInfo: {}, //合同信息,
			attachments: [], //附件信息
			fileList: [{ type: 'OTEHR', id: '', fileList: [], typeName: '退款凭证' }],
			orderId: this.$route.query.orderId,
			orderType: this.$route.query.orderType,
			formValue: {},
			dataObj: {},
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸
			disabled: false,
			payBankInfo: [],
			paymentMethod: [
				{ value: '1', text: '银行存款' },
				{ value: '2', text: '银行承兑汇票' },
				{ value: '3', text: '商业承兑汇票' },
				{ value: '4', text: '信用证' },
				{ value: '5', text: '现金' },
				{ value: '6', text: '银行汇票' },
				{ value: '7', text: 'T/T' },
				{ value: '8', text: '支票' },
				{ value: '9', text: '其他' }
			],
			wrongTips: '',
			orderLineType: this.$route.query.orderLineType,
			auditChainAndOperator: null,
			formatValue: '',
			paidAmount: this.$route.query.paidAmount || null,
			typeData: filterCodeByKey('refundTypeEnum'),
			visible: false,
			platformRiskAudit: true, // 判断是否需要平台风控审核
			needPushOa: true,
			oaflag: false
		};
	},
	components: {
		Breadcrumb,
		AttachmentUpload,
		ChooseContract,
		ConfirmModal,
		TextOverFlow,
		UpdateApprovalProcess,
		Edit
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		isCreator() {
			return this.VUEX_ST_COMPANYSUER.company.uscc === this.contractInfo.sellerUscc;
		},
		payBankInfoHasId() {
			return this.payBankInfo.filter(item => {
				return item.id;
			});
		},
		// 判断是否展示推送OA
		needPushOaShow() {
			// 不需平台风控审核，切对接OA的情况下展示
			// 陕煤系企业无论后端配置什么，都跳过平台风控审核
			return (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) && this.oaflag;
		}
	},
	async created() {
		let { id, orderId, orderLineType } = this.$route.query;
		await this.getTemplate({
			orderId,
			orderLineType
		});
		if (id) {
			this.getDetail();
		}
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		handleScroll(); // 页面底部按钮区域fixed随页面滚动
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		formateBankNo(e) {
			let result = '';
			let value = e?.target?._value;
			if (value.length) {
				value = value.replace(/\s+/g, '');
				for (let i = 0; i < value.length; i++) {
					if (i % 4 == 0 && i != 0) {
						result += ' ' + value[i];
					} else {
						result += value[i];
					}
				}
			}
			this.formatValue = result;
		},
		//根据合同号获取退款模板信息
		getTemplate(data) {
			API_REFUNDREMPLATE(data).then(res => {
				if (res.success) {
					this.auditChainAndOperator = res.data.auditChainAndOperator;
					//渲染数据
					if (this.$route.query.view !== 'edit') {
						this.drawingData(res.data);
					}
				}
			});
		},
		getAccountInfo() {
			API_RefundReceiveAccount({
				uscc: this.contractInfo.buyerUscc
			}).then(res => {
				if (res.success) {
					this.receiveAccList = res.data || [];
				}
			});
		},
		getBeginUpload(val) {
			this.disabled = val;
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			} else {
				this.maxWidth = 350;
			}
		},
		getDetail() {
			API_REFUNDDETAIL({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.drawingData(res.data);
				}
			});
		},
		//渲染数据
		async drawingData(data) {
			if (data.attachments?.length) {
				//附件列表
				this.attachments = data.attachments;
				this.fileList[0].fileList = data.attachments;
				if (this.$route.query.view === 'edit') {
					this.$refs.attachmentUpload.init(this.attachments);
				}
				delete data.attachments;
			}
			if (data.operateLog?.length) {
				//操作记录
				this.operateLog = data.operateLog;
				delete data.operateLog;
			}
			if (data.contractInfo) {
				//合同信息
				this.contractInfo = data.contractInfo;
				delete data.contractInfo;
				//收款账号
				await this.getAccountInfo();
			}
			this.orderId = data.orderId;
			this.orderLineType = data.orderLineType;
			this.refundData = data;
			if (data.paidAmount != null) {
				this.paidAmount = data.paidAmount;
			}
			//渲染表单
			let keys = Object.keys(data);
			this.$nextTick(() => {
				keys.map(key => {
					if (data[key]) {
						let val = {};
						val[key] = String(data[key]);
						this.form.setFieldsValue(val);
					}
				});
			});
		},
		// 收款账号
		changeAccountName(val) {
			/** 获取收款数据 */
			const item = this.receiveAccList.find(el => val == el.no) || {};
			this.$nextTick(() => {
				this.form.setFieldsValue({
					receiveAccBank: item.bankName,
					receiveAccNo: item.no,
					receiveAccName: item.accountName
				});
			});
		},
		cancel() {
			this.$router.push({
				path: '/center/fund/refund/list'
			});
		},
		formateFileData(data) {
			if (data) {
				var arr = [];
				data[0].fileList.forEach(item => {
					if (item.attachmentId) {
						arr.push(item.attachmentId);
					} else {
						arr.push(item.id);
					}
				});
				return arr;
			}
		},
		validateFile() {
			const files = this.$refs.attachmentUpload.dataSource;
			if (!files.length || (files.length && !files[0].fileList.length)) {
				this.$message.error('请上传退款凭证');
				return false;
			}
			return true;
		},
		//组装提交对象
		regroup(values) {
			//如果有收款账户ID,获取银行账号,银行信息
			if (values.receiveAccId) {
				let receiveAcc = this.receiveAccList.find(item => {
					return item.id == values.receiveAccId;
				});
				if (receiveAcc) {
					values.receiveAccNo = receiveAcc.no;
					values.receiveAccBank = receiveAcc.bankName;
					values.receiveAccName = receiveAcc.name;
				}
			}
			values.orderLineType = this.orderLineType;
			//有id的拼接id
			if (this.$route.query.id) {
				values.id = this.$route.query.id;
			}
			//合同编号
			values.orderId = this.orderId;
			//附件信息
			const attachmentInfo = this.formateFileData(this.$refs.attachmentUpload.dataSource);
			values.attachments = attachmentInfo;
			return values;
		},
		submit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					if (!this.validateFile()) return;
					this.dataObj = this.regroup(values);
					const res = await API_RefundSubmitValid(this.dataObj);
					if (res.success) {
						// ● 对采购合同退款，弹窗提示语改为“提交后，退款流程结束，退款完成。确认提交吗？”确定后，退款状态变更为“退款完成”
						// ● 对销售合同退款，退款申请提交后，跳过运营初审；
						if (this.auditChainAndOperator?.needPushOA) {
							this.$refs.updateApprovalProcess.show({
								orderNo: this.orderLineType === 'ONLINE' ? this.contractInfo.orderNo : this.contractInfo.contractNo
							});
						} else if (this.isCreator) {
							this.confirmFunc();
						} else {
							const modalObj = {
								modalTitle: '提交',
								modalText: this.VUEX_ST_COMPANYSUER.belongsShanMei ? '确认提交吗？' : (res.data || '提交后，退款流程结束，退款完成。确认提交吗？')
							};
							this.$refs.confirmModal.showModal(modalObj);
						}
					}
				}
			});
		},
		async confirmFunc(auditChainAndOperator) {
			if (auditChainAndOperator) {
				auditChainAndOperator.oaOpenFlag = auditChainAndOperator.needPushOA;
				this.dataObj.auditChainAndOperator = auditChainAndOperator;
			}
			// 判断是否需要平台审核，
			let res = await API_COMPANplatformRiskAudit({ payType: '0' });
			if (res.success) {
				this.platformRiskAudit = res.result;
			}
			// 如果不需要平台审核，判断是否对接OA,
			// 陕煤系企业无论后端配置什么，都跳过平台审核
			if (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) {
				let res = await API_COMPANYOACHECK({
					orderNo: this.orderLineType === 'ONLINE' ? this.contractInfo.orderNo : this.contractInfo.contractNo,
					bizType: 'REFUND'
				});
				if (res.success) {
					this.oaflag = res.result;
				}
			}
			this.visible = true;
		},
		submitData() {
			// 是否需要推送OA
			if (this.needPushOaShow) {
				this.dataObj.needPushOa = this.needPushOa;
			}
			this.visible = false;
			this.loadingSubmit = true;
			API_REFUNDSUBMIT(this.dataObj)
				.then(res => {
					if (res.success && res.data) {
						this.$message.success('退款申请提交成功');
						this.$router.push('/center/fund/refund/list');
						this.loadingSubmit = false;
					}
				})
				.finally(() => {
					this.loadingSubmit = false;
				});
		},
		disabledDate(current) {
			return current > moment().endOf('day') || current < moment(this.contractInfo.signTime);
		},
		validateDate(rule, value, callback) {
			let current = GetCurrentDateFormat();
			let rangeDays = Math.abs(moment(current).diff(moment(value), 'days'));
			if (rangeDays > 30) {
				this.wrongTips = '退款日期与当前日期偏差较多，如果实际如此，请忽略提示';
			} else {
				this.wrongTips = '';
			}
			callback();
		},
		// 校验身份证
		validAmount(rule, value, callback) {
			if (value > this.paidAmount) {
				callback('退款金额不能大于当前合同的累计付款金额，累计付款金额为：' + this.paidAmount + '元');
				return;
			}
			if (value <= 0) {
				callback('退款金额需大于0');
				return;
			}
			callback();
		},
		changeContract() {
			this.$refs.chooseContract.showModal();
		},
		getContractDetail(data) {
			this.orderId = data.orderId;
			this.orderLineType = data.orderLineType;
			this.paidAmount = data.paidAmount;
			this.getTemplate({
				orderId: data.orderId,
				orderLineType: data.orderLineType
			});
		},
		viewContractDetail() {
			let type = this.isCreator ? 'SELL' : 'BUY';
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + this.orderLineType.toLowerCase() + '/detail',
				query: {
					id: this.orderId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	/deep/.ant-card {
		padding-bottom: 48px;
		/deep/.ant-card-body {
			position: relative;
		}
	}
	.slTitleAssis {
		margin-top: 30px;
	}
	.grid-wrap {
		margin: 30px 0 50px 0;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;
		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;
			span,
			.textOverflow {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
			}
			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}
			.label {
				width: 120px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}
			span:last-child {
				width: 100%;
				padding-left: 132px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.textOverflow {
				left: 132px;
				padding: 0;
			}
			.contract-box {
				color: @primary-color;
			}
		}
		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}
		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}
		li:last-child {
			border-radius: 0 0 3px 0;
		}
		li.special {
			border-radius: 0 3px 3px 0;
		}
	}
	.contract-box {
		position: relative;
		.textOverflow {
			left: 0 !important;
			position: relative;
		}
		.copy-icon {
			margin-left: 12px;
			cursor: pointer;
			width: 14px;
			height: 14px;
			vertical-align: baseline;
			margin-bottom: 17px;
		}
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
	.slFormDetail {
		padding-bottom: 0;
		padding-top: 30px;
		.ant-col {
			height: 92px;
		}
		.ant-form-item {
			width: 364px;
			margin-bottom: 0;
		}
		.specialItem {
			height: 146px;
			::v-deep.ant-form-item {
				width: 100%;
			}
			textarea.ant-input {
				margin-bottom: 0;
			}
		}
	}
	.table-box {
		padding-bottom: 20px;
		margin-top: 20px;
		.new-table {
			max-height: 268px;
			overflow: hidden;
			/deep/.ant-table-body {
				max-height: 268px;
				overflow-y: scroll;
			}
		}
	}
	.textarea-wrap {
		width: 100%;
		height: 96px;
		resize: none;
	}
	.gray {
		color: gray;
	}
	.fz12 {
		font-size: 14px;
		zoom: 0.86;
	}
	.requiredItem {
		::v-deep.ant-form-item-label {
			label::before {
				display: inline-block;
				margin-right: 4px;
				color: #f5222d;
				font-size: 14px;
				font-family: SimSun, sans-serif;
				line-height: 1;
				content: '*';
				vertical-align: middle;
			}
		}
	}
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
.attachment {
	margin-bottom: 60px;
}
.optionMain {
	display: inline-block;
	width: 100%;
	// max-width: calc(100% - 20px);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.refundTypeItem {
	::v-deep.ant-radio-wrapper:first-child {
		margin-right: 40px !important;
	}
}
</style>
