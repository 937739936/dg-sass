<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>补录线下结算单</span>
		</div>
		<a-card title="选择合同(只有补录的合同才可以上传线下开具的结算单)">
			<a-form-model
				ref="contractForm"
				:model="contractForm"
				:rules="addRules"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="type"
							label="结算单类型"
							prop="type"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 18 }"
						>
							<a-radio-group
								v-model="contractForm.type"
								:disabled="contractDisabled"
							>
								<a-radio value="BUY">采购结算单</a-radio>
								<a-radio value="SELL">销售结算单</a-radio>
							</a-radio-group>
						</a-form-model-item>

						<a-form-model-item
							ref="type"
							label="选择合同"
							prop="paperContractNo"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 18 }"
						>
							<a-input
								readOnly
								:disabled="contractDisabled"
								@click="showContractList"
								v-model="contractForm.paperContractNo"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>
				<div
					class="contract-detail"
					v-if="contractData"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							合同编号：<a @click.prevent="contractDetail">{{ contractData.paperContractNo }}</a>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							签订日期：{{ contractData.contractSignTime }}
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							买方企业：{{ contractData.buyerName }}
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							卖方企业：{{ contractData.sellerName }}
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							煤种：{{ contractData.coalTypeDesc }}
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							品名：{{ contractData.goodsName }}
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<template v-if="contractData.followTheMarket && contractForm.type === 'BUY'">基准价格：随行就市</template>
							<template v-else>
								基准价格：{{ contractData.contractPrice }}
								<span v-if="contractData.contractPrice"> 元/吨 </span>
							</template>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							数量：{{ contractData.contractQuantity }}吨
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<template v-if="contractData.execDateStart">
								交货期限：{{ contractData.execDateStart }}至{{ contractData.execDateEnd }}
							</template>
							<template v-else> 交货期限： </template>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							运输方式：{{ contractData.transTypeDesc }}
						</a-col>
					</a-row>
				</div>
			</a-form-model>
		</a-card>
		<a-card title="结算单信息">
			<a-form-model
				ref="settleForm"
				:model="settleForm"
				:rules="settleRules"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="type"
							label="结算单号"
							prop="serialNo"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-input
								:maxLength="50"
								placeholder="请输入"
								@blur="serialNo"
								v-model="settleForm.serialNo"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="type"
							label="结算日期"
							prop="statementTime"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-date-picker
								placeholder="请选择"
								valueFormat="YYYY-MM-DD"
								v-model="settleForm.statementTime"
								@change="getStatementTime"
								:disabled-date="disabledDate"
							>
							</a-date-picker>
							<span
								slot="extra"
								v-if="statementTimeDevMax"
							>
								结算日期与当前系统日期偏差较大，请确认结算单日期是否无误，如果正确，请忽略提示。
							</span>
						</a-form-model-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="date"
							label="供货周期"
							prop="date"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-range-picker
								v-model="settleForm.date"
								type="date"
								valueFormat="YYYY-MM-DD"
								:placeholder="['开始日期', '结束日期']"
								@change="getSupplyDate"
							/>
							<span
								slot="extra"
								v-if="supplyDateDevMax || supplyDateLengthMax"
							>
								<span v-if="supplyDateDevMax">
									供货期与当前系统日期偏差较大，请确认供货周期是否无误，如果正确，请忽略提示。
								</span>
								<span v-if="supplyDateLengthMax"> 供货周期较长，请确定是否填写无误，如果正确，请忽略提示。 </span>
							</span>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="结算单价"
							prop="settleUnitPrice"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-input
								placeholder="请输入"
								disabled
								v-model="settleForm.settleUnitPrice"
							/>
							<span style="position: absolute; right: -45px">元/吨</span>
						</a-form-model-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="settleQuantity"
							label="结算数量"
							prop="settleQuantity"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-input-number
								placeholder="请输入"
								v-model="settleForm.settleQuantity"
								@blur="countSettleAmount"
								style="width: 100%"
							/>
							<span style="position: absolute; right: -20px">吨</span>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="settleAmount"
							label="结算金额"
							prop="settleAmount"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-input-number
								placeholder="请输入"
								style="width: 100%"
								v-model="settleForm.settleAmount"
								@blur="countSettleAmount"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							ref="remark"
							label="备注"
							prop="remark"
							:colon="false"
							:label-col="{ span: 5 }"
							:wrapper-col="{ span: 12 }"
						>
							<a-textarea
								placeholder="请输入"
								v-model="settleForm.remark"
								style="resize: none"
								:maxLength="1000"
								:auto-size="{ minRows: 4, maxRows: 6 }"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>
			</a-form-model>
		</a-card>
		<a-card title="上传附件">
			<FileUpload
				ifEditable="true"
				@uploadFiles="getUploadFiles"
				:type="[3]"
				:fileDataSource="fileDataSource"
				tabType="settlement"
			/>
			<div style="margin-top: 20px; text-align: center">
				<a-button
					@click="goback"
					type="primary"
					style="margin-right: 20px"
					ghost
					>取消</a-button
				>
				<a-button
					@click="toSubmit"
					type="primary"
					>提交</a-button
				>
			</div>
		</a-card>
		<ContractList
			ref="contractSearchModal"
			@validateContract="validateContract"
			:contractForm="contractForm"
		/>
	</div>
</template>
<script lang="jsx">
import {
	API_JudgeStatementDate,
	API_JudgeNeedConfirm,
	API_OffinleSettleSave,
	API_OffinleStatementDetail,
	API_JumpFromMonotoring
} from '@/v2/center/trade/api/settle';
import FileUpload from './components/FileUpload';
import ContractList from './components/ContractList';
import moment from 'moment';

export default {
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验结算单价、结算数量
			let regs2 = rule.point == 2 ? /^\d+(\.\d{0,2})?$/ : /^\d+(\.\d{0,4})?$/;
			if (value <= 0) {
				return callback(new Error('数值不能为0'));
			}
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};

		return {
			addRules: {
				type: [{ required: true, message: '请选择结算单类型', trigger: 'change' }],
				paperContractNo: [{ required: true, message: '请选择合同', trigger: 'change' }]
			},
			contractForm: {
				type: 'BUY',
				paperContractNo: ''
			},
			contractData: null,
			settleForm: {},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			settleRules: {
				statementTime: [{ required: true, message: '请选择结算日期', trigger: 'change' }, { validator: this.statementTime }],
				date: [{ required: true, message: '请选择供货周期', trigger: 'change' }],
				settleAmount: [
					{ required: true, message: '请输入结算金额', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						point: 2,
						msg: '请输入最多两位小数'
					}
				],
				settleQuantity: [
					{ required: true, message: '请输入结算数量', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						max: 1000000000,
						point: 4,
						msg: '请输入大于0小于999999999.9999的数,最多四位小数'
					}
				]
			},
			detailData: {},
			contractDisabled: false,
			statementTimeDevMax: false, //结算日期是否大于30天
			supplyDateDevMax: false, //供货周期与系统时间是否大于60天
			supplyDateLengthMax: false //供货周期是否大于60天
		};
	},
	components: {
		FileUpload,
		ContractList
	},

	created() {},
	mounted() {
		// 编辑
		if (this.$route.query.statementId) {
			this.getDetail();
		}
		//
		if (this.$route.query.contractNo) {
			// 如果是从业务动态监控的补录结算单入口进来，则合同信息直接反显，禁止修改
			this.contractForm.type = this.$route.query.statementType;
			this.contractDisabled = true;
			this.getContractInfo();
		}
	},
	methods: {
		moment,
		getContractInfo() {
			// 如果是从业务动态监控的补录结算单入口进来，则合同信息直接反显，禁止修改

			API_JumpFromMonotoring({ contractNo: this.$route.query.contractNo }).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.contractData = this.detailData;
					this.contractData.id = this.detailData.id;
					this.contractForm.paperContractNo = this.detailData.paperContractNo;
					this.settleForm.terminalContractId = this.detailData.id;
				}
			});
		},
		getDetail() {
			API_OffinleStatementDetail({
				statementId: this.$route.query.statementId
			}).then(res => {
				this.detailData = res.data;
				this.contractData = this.detailData;
				this.contractData.id = this.detailData.terminalContractId;
				this.contractForm.type = this.detailData.type;
				this.contractForm.paperContractNo = this.detailData.paperContractNo;
				this.settleForm = this.detailData;
				this.fileDataSource = this.detailData.attachmentList;
				if (this.detailData.supplyDateStart && this.detailData.supplyDateEnd) {
					this.$set(this.settleForm, 'date', [moment(this.detailData.supplyDateStart), moment(this.detailData.supplyDateEnd)]);
				}
			});
		},
		//选择合同弹框
		showContractList() {
			this.$refs.contractSearchModal.showModel();
		},
		contractDetail() {
			const type = this.contractForm.type == 'SELL' ? 'sell' : 'buy';
			let routeUrl = this.$router.resolve({
				path: `/center/contract/${type}/offline/detail`,
				query: {
					id: this.contractData.id,
					type: type
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		validateContract(key, data) {
			// 校验合同
			if (key.length === 0) {
				this.$message.error('请选择合同！');
				return;
			}
			this.contractData = Object.assign({}, data);
			this.contractForm.paperContractNo = this.contractData.paperContractNo;
			this.settleForm.terminalContractId = this.contractData.id;
			//如果有结算日期进行校验
			let statementTime = this.settleForm.statementTime;
			if (statementTime) {
				this.$refs.settleForm.validateField(['statementTime'], () => {});
			}
		},
		getSupplyDate(value, dateString) {
			// 供货周期区间
			this.settleForm.supplyDateStart = dateString[0];
			this.settleForm.supplyDateEnd = dateString[1];
			if (Math.abs(moment(value[0]).diff(moment(), 'days')) > 60 || Math.abs(moment(value[1]).diff(moment(), 'days')) > 60) {
				this.supplyDateDevMax = true;
			} else {
				this.supplyDateDevMax = false;
			}
			if (moment(value[1]).diff(moment(value[0]), 'days') > 60) {
				this.supplyDateLengthMax = true;
			} else {
				this.supplyDateLengthMax = false;
			}
		},
		countSettleAmount() {
			// 计算结算金额
			if (this.settleForm.settleAmount && this.settleForm.settleQuantity) {
				let amount = (this.settleForm.settleAmount / this.settleForm.settleQuantity).toFixed(2);
				this.$set(this.settleForm, 'settleUnitPrice', amount);
			}
		},
		//结算单号校验
		serialNo() {
			let statementTime = this.settleForm.statementTime;
			if (statementTime) {
				this.$refs.settleForm.validateField(['statementTime'], () => {});
			}
		},
		//结算日期校验
		statementTime(rule, value, callback) {
			let statementTime = this.settleForm.statementTime,
				serialNo = this.settleForm.serialNo,
				contractId = this.contractData && this.contractData.id,
				statementId = this.$route.query.statementId;
			//contractId合同ID，statementTime结算日期，serialNo结算单号，statementId结算单ID
			if (contractId && statementTime) {
				API_JudgeStatementDate({
					contractId,
					statementTime,
					serialNo,
					statementId
				}).then(res => {
					if (res.success && res.data) {
						callback('该合同已存在此结算日期的结算单');
					} else {
						callback();
					}
				});
			} else {
				callback();
			}
		},
		getStatementTime(value) {
			// 结算日期
			if (Math.abs(moment(value).diff(moment(), 'days')) > 30) {
				this.statementTimeDevMax = true;
			} else {
				this.statementTimeDevMax = false;
			}
			return;
		},
		disabledDate(current) {
			// 结算日起不可选未来日期
			return current && current > moment().endOf('day');
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		goback() {
			this.$router.go(-1);
		},
		toSubmit() {
			this.$refs.contractForm.validate(valid => {
				if (valid) {
					this.$refs.settleForm.validate(val => {
						if (val) {
							if (this.fileInfos.length === 0) {
								this.$message.error('请上传结算单附件');
								return;
							}
							this.settleForm.attachmentList = this.fileInfos;
							// 对手方uscc
							API_JudgeNeedConfirm({
								uscc: this.contractForm.type == 'BUY' ? this.contractData.sellerBizNo : this.contractData.buyerBizNo
							}).then(res => {
								if (res.success) {
									if (res.data) {
										this.$confirm({
											centered: true,
											title: `请确认信息填写完成并提交？`,
											okText: '确定',
											content: '提交后，结算单将推送给对方，由对方进行确认，对方确认后，结算单将变成已确认。',
											cancelText: '取消',
											icon: () => (
												<a-icon
													type="exclamation-circle"
													theme="filled"
												/>
											),
											onOk: () => this.confirmSubmit()
										});
									} else {
										this.$confirm({
											centered: true,
											title: `请确认信息填写完成并提交？`,
											okText: '确定',
											content: '提交后，结算单将变成已确认。',
											cancelText: '取消',
											icon: () => (
												<a-icon
													type="exclamation-circle"
													theme="filled"
												/>
											),
											onOk: () => this.confirmSubmit()
										});
									}
								}
							});
						}
					});
				}
			});
		},
		confirmSubmit() {
			let dataObj = Object.assign({}, this.settleForm);
			delete dataObj.date;
			if (this.$route.query.statementId) {
				dataObj.statementId = this.$route.query.statementId;
			}
			API_OffinleSettleSave(dataObj).then(res => {
				if (res.success) {
					this.$message.success('提交成功！');
					this.$router.go(-1);
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.ant-card-bordered {
	border: none;
}

.contract-detail {
	padding: 0 20px;
	.ant-col {
		margin-bottom: 15px;
	}
}
.ant-calendar-picker {
	width: 100%;
}
.order-wrap {
	::v-deep.ant-calendar-picker {
		width: auto;
	}
}
</style>
