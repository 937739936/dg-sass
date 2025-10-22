<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ meta.title }}</span>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul class="grid-wrap">
				<li>
					<span class="label">合同编号</span>
					<span
						class="contract-number"
						@click="contractDetail"
						>{{ contractData.paperContractNo }}</span
					>
				</li>
				<li>
					<span class="label">合同有效期</span>
					<span>{{ contractData.execDateStart }} - {{ contractData.execDateEnd }}</span>
				</li>
				<li>
					<span class="label">托运人</span>
					<span>{{ VUEX_ST_COMPANYSUER.companyName }}</span>
				</li>
				<li>
					<span class="label">承运人</span>
					<span>{{ contractData.consigneeCompanyName }}</span>
				</li>
				<li>
					<span class="label">起运地点</span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>{{ contractData.origin }}</span>
						</template>
						<span>{{ contractData.origin }}</span>
					</a-tooltip>
				</li>
				<li>
					<span class="label">目的地点</span>
					<a-tooltip placement="top">
						<template slot="title">
							<span>{{ contractData.destination }}</span>
						</template>
						<span>{{ contractData.destination }}</span>
					</a-tooltip>
				</li>
			</ul>
			<div class="slTitleAssis">结算信息</div>
			<a-form-model
				class="settle-form"
				layout="vertical"
				ref="settleForm"
				:model="settleForm"
				:rules="settleRules"
			>
				<a-row>
					<a-col :span="8">
						<a-form-model-item
							ref="type"
							label="运输单号"
							prop="serialNo"
							class="settle-form-item"
						>
							<a-input
								:maxLength="50"
								placeholder="请输入"
								@blur="serialNo"
								v-model="settleForm.serialNo"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="settleAmount"
							label="结算金额"
							prop="settleAmount"
							class="settle-form-item"
						>
							<a-input-number
								:max="999999999.99"
								:min="0"
								placeholder="请输入"
								style="width: 100%"
								v-model="settleForm.settleAmount"
								@blur="countSettleAmount"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="settleQuantity"
							label="结算数量(吨)"
							prop="settleQuantity"
							class="settle-form-item"
						>
							<a-input-number
								:max="9999999999.9999"
								:min="0"
								placeholder="请输入"
								v-model="settleForm.settleQuantity"
								@blur="countSettleAmount"
								style="width: 100%"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-model-item
							ref="type"
							label="结算日期"
							prop="statementTime"
							:colon="false"
							class="settle-form-item"
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
			</a-form-model>
			<div class="slTitleAssis">附件信息</div>
			<p class="file-tips">可支持格式为pdf，jpg，jpeg，png，bmp的附件，单个附件大小不得超过100M的文件</p>
			<FileUpload
				ifEditable="true"
				@uploadFiles="getUploadFiles"
				:type="[3]"
				:fileDataSource="fileDataSource"
				tabType="settlement"
				:accetpFileFormat="['pdf', 'jpg', 'jpeg', 'png', 'bmp']"
			/>
			<div style="margin-top: 70px; text-align: center">
				<a-button
					:loading="loadingSave"
					class="method-btn method-btn-blue"
					@click="toSubmit(0)"
					style="margin-right: 20px"
					type=""
					>保存</a-button
				>
				<a-button
					:loading="loadingSubmit"
					class="method-btn"
					@click="toSubmit(1)"
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
import { API_JumpFromMonotoring } from '@/v2/center/trade/api/settle';
import FileUpload from './components/FileUpload';
import ContractList from './components/ContractListTrans';
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import {
	API_transport_settle_save,
	API_transport_settle_details,
	API_contractDetail
} from '@/v2/center/trade/api/transportContract';
import { mapGetters } from 'vuex';

export default {
	data() {
		let validatePassAmount = (rule, value, callback) => {
			// 校验结算单价、结算数量
			let regs2 = rule.point == 2 ? /^\d+(\.\d{0,2})?$/ : /^\d+(\.\d{0,4})?$/;
			if (value <= 0) {
				return callback(new Error('请输入0-999999999.99之间的数,最多两位小数'));
			}
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		let validatePass = (rule, value, callback) => {
			// 校验结算单价、结算数量
			let regs2 = rule.point == 2 ? /^\d+(\.\d{0,2})?$/ : /^\d+(\.\d{0,4})?$/;
			if (value <= 0) {
				return callback(new Error('请输入0-9999999999.9999之间的数,最多四位小数'));
			}
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		let { meta } = this.$route;
		return {
			meta, //获取title
			addRules: {
				type: [{ required: true, message: '请选择结算单类型', trigger: 'change' }],
				paperContractNo: [{ required: true, message: '请选择合同', trigger: 'change' }]
			},
			contractForm: {
				type: 'BUY',
				paperContractNo: ''
			},
			contractData: {},
			settleForm: {},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			settleRules: {
				statementTime: [{ required: true, message: '请选择结算日期', trigger: 'change' }, { validator: this.statementTime }],
				date: [{ required: true, message: '请选择供货周期', trigger: 'change' }],
				settleAmount: [
					{ required: true, message: '请输入结算金额', trigger: 'blur' },
					{
						validator: validatePassAmount,
						trigger: 'blur',
						point: 2,
						min: 0,
						max: 999999999.99,
						msg: '请输入0-999999999.99之间的数,最多两位小数'
					}
				],
				settleQuantity: [
					{ required: true, message: '请输入结算数量', trigger: 'blur' },
					{
						validator: validatePass,
						trigger: 'blur',
						min: 0,
						max: 9999999999.9999,
						point: 4,
						msg: '请输入0-9999999999.9999之间的数,最多四位小数'
					}
				]
			},
			detailData: {},
			contractDisabled: false,
			statementTimeDevMax: false, //结算日期是否大于30天
			supplyDateDevMax: false, //供货周期与系统时间是否大于60天
			supplyDateLengthMax: false, //供货周期是否大于60天
			loadingSave: false,
			loadingSubmit: false
		};
	},
	components: {
		FileUpload,
		ContractList,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	created() {},
	mounted() {
		this.getDetailsData();
		// 编辑
		if (this.$route.query.statementId) {
			this.getDetail();
		}
		if (this.$route.query.contractNo) {
			// 如果是从业务动态监控的补录结算单入口进来，则合同信息直接反显，禁止修改
			this.contractForm.type = this.$route.query.statementType;
			this.contractDisabled = true;
			this.getContractInfo();
		}
	},
	methods: {
		moment,
		getDetailsData() {
			const id = this.$route.query.contractId;
			if (!id) return;
			API_contractDetail({
				id
			}).then(res => {
				if (res.success) {
					this.contractData = res.data;
					this.contractForm = res.data;
					this.settleForm.terminalContractId = id;
				}
			});
		},
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
			API_transport_settle_details({
				statementId: this.$route.query.statementId
			}).then(res => {
				this.detailData = res.data;
				this.contractData = res.data.offlineTransportContractVO;
				this.contractData.id = res.data.terminalStatementVO.terminalContractId;
				this.contractForm.type = this.detailData.type;
				this.contractForm.paperContractNo = this.contractData.paperContractNo;
				this.settleForm = res.data.terminalStatementVO;
				const { execDateStart, execDateEnd } = res.data.offlineTransportContractVO;
				this.settleForm.terminalContractId = res.data.terminalStatementVO.terminalContractId;
				this.fileDataSource = res.data.terminalStatementVO.attachmentList;
				if (execDateStart && execDateEnd) {
					this.$set(this.settleForm, 'date', [moment(execDateStart), moment(execDateEnd)]);
				}
			});
		},
		//选择合同弹框
		showContractList() {
			this.$refs.contractSearchModal.showModel();
		},
		contractDetail() {
			let routeUrl = this.$router.resolve({
				path: `/center/contract/transport/detail`,
				query: {
					id: this.contractData.id
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
			//contractId合同ID，statementTime结算日期，serialNo结算单号，statementId结算单ID
			callback();
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
			this.$router.back();
		},
		toSubmit(type) {
			this.$refs.settleForm.validate(val => {
				if (val) {
					if (this.fileInfos.length === 0) {
						this.$message.error('请上传结算单附件');
						return;
					}
					this.settleForm.attachmentList = this.fileInfos;
					if (type == 0) {
						this.confirmSubmit(type);
						return;
					}
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
						onOk: () => this.confirmSubmit(type)
					});
				}
			});
		},
		confirmSubmit(type) {
			let dataObj = Object.assign({}, this.settleForm);
			delete dataObj.date;
			if (this.$route.query.statementId) {
				dataObj.statementId = this.$route.query.statementId;
			}
			if (type == 0) {
				this.loadingSave = true;
			} else {
				this.loadingSubmit = true;
			}
			API_transport_settle_save({
				...dataObj,
				attachmentList: this.fileInfos,
				whetherSubmit: type == 0 ? false : true
			})
				.then(res => {
					if (res.success) {
						const message = type == 0 ? '保存成功' : '提交成功';
						this.$message.success(message);
						this.$router.push('/center/settle/transport/list');
					}
				})
				.finally(() => {
					this.loadingSave = false;
					this.loadingSubmit = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/grid-wrap.less');
</style>
<style lang="less" scoped>
.slTitle {
	height: 45px;
	border-bottom: 1px solid #e5e6eb;
	box-sizing: border-box;
}
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
.custom-main-content-inner {
	margin-top: -20px;
}
.col-padding-left {
	padding-left: 80px;
}
.settle-form {
	margin-top: 20px;
}
.settle-form-item {
	width: 364px;
}
/deep/ .ant-form-item-label {
	label {
		color: rgba(0, 0, 0, 0.4);
	}
}
.contract-number {
	max-width: 500px;
	width: auto;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: @primary-color;
}
.file-tips {
	width: 100%;
	height: 12px;
	color: #77889d;
	font-size: 12px;
	line-height: 12px;
	margin: 22px 0 20px;
}
.method-btn {
	width: 114px;
}
.method-btn-blue {
	color: @primary-color;
	border-color: @primary-color;
}
</style>
