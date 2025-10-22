<template>
	<div class="slMain">
		<a-card
			:bordered="false"
			style="padding-bottom: 70px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>预付融资申请</span>
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
				style="margin-top: 20px"
			>
				<a-descriptions-item label="预付账款流水号">
					<a
						href="javascript:;"
						@click="openAssets"
					>
						{{ receivableInfo.serialNo }}</a
					>

					<span @click="editReceivable"><Edit style="cursor: pointer"></Edit></span>
				</a-descriptions-item>
				<a-descriptions-item label="预付账款金额">￥{{ formatMoney(receivableInfo.amount) }}</a-descriptions-item>
				<a-descriptions-item label="拟融资金额">￥{{ formatMoney(receivableInfo.planFinancingAmount) }}</a-descriptions-item>
				<a-descriptions-item label="合同编号">{{ receivableInfo.contractNo || '-' }}</a-descriptions-item>
				<a-descriptions-item label="买方名称">{{ receivableInfo.buyerName || '-' }}</a-descriptions-item>
				<a-descriptions-item label="卖方名称">{{ receivableInfo.sellerName || '-' }}</a-descriptions-item>
			</a-descriptions>

			<div class="slTitleAssis">融资信息</div>

			<a-form :form="financingApplyForm">
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="资金类型">
								<a-input
									disabled
									:value="receivableInfo.name"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="出资机构">
								<a-input
									disabled
									:value="receivableInfo.bankName"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="放款类型">
								<a-input
									disabled
									:value="receivableInfo.loanTypeDesc"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="receivableInfo.loanType == 'FINANCIAL_ORDER'"
					>
						<a-row type="flex">
							<a-form-item label="开立日">
								<a-input
									disabled
									:value="receivableInfo.planPayDate"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="receivableInfo.loanType == 'FINANCIAL_ORDER'"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="承诺付款日期">
								<a-input
									disabled
									:value="receivableInfo.promisePayDate"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="融资利率（%）">
								<a-select
									v-decorator="[
										'rate',
										{
											rules: [{ required: true, message: `融资比例必填` }],
											validateTrigger: 'change'
										}
									]"
									placeholder="请选择融资利率"
								>
									<a-select-option
										v-for="(items, index) in lilvData"
										:key="index"
										:value="items.value"
										>{{ items.text }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="逾期利率（%）">
								<a-select
									v-decorator="[
										'overdueRate',
										{
											rules: [{ required: true, message: `逾期利率必填` }],
											validateTrigger: 'change'
										}
									]"
									placeholder="请选择逾期利率"
								>
									<a-select-option
										v-for="(items, index) in yuqiData"
										:key="index"
										:value="items.value"
										>{{ items.text }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="融资金额（元）">
								<a-input
									v-inputTip
									placeholder="请输入融资金额"
									prefix="￥"
									style="width: 364px"
									v-decorator="[
										`amount`,
										{
											rules: [
												{ required: true, message: `融资金额必填` },
												{
													type: 'number',
													message: `请输入数字`,
													transform: v => Number(v)
												},
												{ validator: amountvalidator }
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="回款账号">
								<a-select
									:class="financingApplyForm.getFieldValue('acctAccountId') ? 'fangkuan-select' : ''"
									v-decorator="[
										'acctAccountId',
										{
											rules: [{ required: true, message: `回款账号必填` }],
											validateTrigger: 'change'
										}
									]"
									@change="v => selectAccount('h', v)"
									placeholder="请选择回款账号"
								>
									<a-select-option
										v-for="(items, index) in huikuanAccountList"
										:key="index"
										:value="items.value"
									>
										<p>{{ items.bankName }}</p>
										<p>{{ items.bankNo }}</p>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="回款账号开户名">
								<a-input
									disabled
									:value="fangkuanData.huikuanname"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="回款账号开户行">
								<a-input
									disabled
									:value="fangkuanData.huikuanhang"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row v-if="receivableInfo.loanType != 'FINANCIAL_ORDER'">
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="放款账号">
								<a-select
									:class="financingApplyForm.getFieldValue('loanAccountId') ? 'fangkuan-select' : ''"
									v-decorator="[
										'loanAccountId',
										{
											rules: [{ required: true, message: `放款账号必填` }],
											validateTrigger: 'change'
										}
									]"
									@change="v => selectAccount('f', v)"
									placeholder="请选择放款账号"
								>
									<a-select-option
										v-for="(items, index) in fangkuanAccountList"
										:key="index"
										:value="items.value"
									>
										<p>{{ items.bankName }}</p>
										<p>{{ items.bankNo }}</p>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="放款账号开户名">
								<a-input
									disabled
									:value="fangkuanData.fangkuanname"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="放款账号开户行">
								<a-input
									disabled
									:value="fangkuanData.fangkuanhang"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-form-item
						label="融资说明"
						style="width: 100%"
					>
						<a-textarea
							style="width: 100%; height: 80px"
							placeholder="请输入融资说明(不超过100字)"
							:maxLength="100"
							v-decorator="[
								`remark`,
								{
									rules: [{ required: false, message: `` }],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-row>

				<FileList
					:list="xieyiDataSource"
					@viewPDF="viewPDF"
				></FileList>
			</a-form>
		</a-card>

		<div class="slDetailBottom">
			<div>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
					>
						返回
					</a-button>
					<a-button
						type="primary"
						class="btn"
						@click="sumbitApply"
					>
						提交
					</a-button>
				</a-space>
			</div>
		</div>
		<TipModal
			ref="tipModal"
			@ok="saveConfirm"
			title="确认提交"
		>
			<div class="tip-box">
				<p>确定要提交该笔应收融资申请吗？</p>
				<p>
					拟融资金额：<span style="margin-right: 50px">￥{{ formatMoney(cacheParameter.amount) }}元</span>
				</p>
			</div>
		</TipModal>
		<TipModal
			ref="signModal"
			@ok="confirmSign"
			@cancel="goBack"
			title="盖章"
			cancelBtnText="稍后盖章"
			okBtnText="立即盖章"
		>
			<div class="tip-box">
				<p>是否需要立即盖章？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="盖章"
		>
			<div class="tip-box">
				<p>您暂无盖章权限，请联系企业签章员或管理员进行盖章</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.signerUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
				<p
					class="tip-wrap-desc"
					v-else
				>
					管理员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
			</div>
		</TipModal>
		<FinancingAdvanceApplyDraw ref="financingApplyDraw"></FinancingAdvanceApplyDraw>
		<a-modal
			centered
			title="查看协议"
			:width="1000"
			v-model="modalPdfIsShow"
			:mask="true"
			:footer="null"
			:maskClosable="false"
			class="modal-pdf"
		>
			<pdf-preview :url="modalPdfUrl"></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import FileList from '../components/FileList.vue';
import TipModal from '@sub/components/DelModal.vue';
import FinancingAdvanceApplyDraw from '@/v2/center/financing/components/FinancingAdvanceApplyDraw.vue';
import {
	API_FinancingApplyAdvanceXieyi,
	API_COMPANYACCOUNTLIST,
	API_FinancingApplycompanyCredit,
	API_FinancingAdvanceApplyXieyiView,
	API_FinancingAdvanceApplyXieyiDown,
	API_FinancingAdvanceApplyXieyiDownAll,
	API_FinancingAdvanceApplySave
} from '@/v2/center/financing/api/index.js';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { formatMoney } from '@sub/filters';
import { Edit } from '@sub/components/svg/index';
export default {
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			receivableListVisible: false,
			sellerNameList: [],
			receivableListDataSource: [],
			receivableDataSource: [],
			modalPdfIsShow: false,
			xieyiDataSource: [],
			modalPdfUrl: '',
			fangkuanData: {},
			// biliData:[],
			lilvData: [],
			yuqiData: [],
			fangkuanAccountList: [],
			huikuanAccountList: [],
			// 判断是否有盖章需求
			isNeedSign: true,
			visibleConfirmSubmit: true,
			cacheId: {},
			roleData: {},
			cacheParameter: {},
			quantityShow: false
		};
	},
	components: {
		PdfPreview,
		Edit,
		FileList,
		FinancingAdvanceApplyDraw,
		TipModal
	},
	computed: {
		receivableInfo() {
			return this.$store.state.financing.advanceInfo;
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	watch: {
		receivableInfo: {
			handler(info) {
				this.setFormData(info);
			},
			deep: true,
			immediate: true
		}
	},

	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';

		this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		formatMoney,
		editReceivable() {
			this.$refs.financingApplyDraw.showRelationOrderList();
		},
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
		openAssets() {
			const { href } = this.$router.resolve({
				path: '/center/assets/advance/detail',
				query: {
					id: this.receivableInfo.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		changeQuantity(e) {
			let val = e.target ? e.target.value : e;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		changeQuantityFocus(e) {
			const val = e.target.value;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		computeUnit(val) {
			if (val >= 1000 && val < 10000) {
				return '千';
			} else if (val > 10000 && val <= 100000) {
				return '万';
			} else if (val > 100000 && val <= 1000000) {
				return '十万';
			} else if (val > 1000000 && val <= 10000000) {
				return '百万';
			} else {
				return '百万';
			}
		},
		getBankAccount(companyUscc, type) {
			API_COMPANYACCOUNTLIST({ uscc: companyUscc }).then(res => {
				let data = res.data || [];
				let _array = [];
				data.forEach(item => {
					_array.push({
						bankName: item.subbranchName,
						bankNo: item.accountNo,
						value: item.id,
						bankAccountName: item.accountName
					});
				});
				if (type == 'f') {
					this.fangkuanAccountList = _array;
				} else {
					this.huikuanAccountList = _array;
				}
			});
		},
		selectAccount(type, c) {
			var currentObj = {};
			if (type == 'f') {
				this.fangkuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});

				this.fangkuanData.fangkuanhang = currentObj.bankName;
				this.fangkuanData.fangkuanname = currentObj.bankAccountName;
			} else {
				this.huikuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});
				this.fangkuanData.huikuanhang = currentObj.bankName;
				this.fangkuanData.huikuanname = currentObj.bankAccountName;
			}
		},
		amountvalidator(rule, value, callback) {
			//   if (this.receivableDataSource && this.receivableDataSource.length && value > this.receivableDataSource[0].planFinancingAmount) {
			//     callback('融资金额不能大于拟融资金额')
			//     return
			//   }
			callback();
		},

		setFormData(record) {
			this.financingApplyForm.resetFields();
			// 回显预付账款数据
			this.receivableDataSource = [record];
			setTimeout(() => {
				this.financingApplyForm.setFieldsValue({
					receivableSerialNo: record.serialNo,
					amount: record.planFinancingAmount
				});
			}, 400);

			// 回显融资信息数据
			this.getRongZiDetail(record);

			this.fangkuanData = record;
			this.getBankAccount(record.bankUscc, 'h');

			// 回显融资附件列表

			this.getDetail(record.id);
		},
		viewPDF(record, type) {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.fangkuanData,
					contractType: record.contractType,
					receivableId: this.fangkuanData.id,
					...values
				};
				if (type == 'down') {
					API_FinancingAdvanceApplyXieyiDown(params).then(res => {
						comDownload(res, null, record.name + '.pdf');
					});
				} else if (type == 'view') {
					API_FinancingAdvanceApplyXieyiView(params).then(res => {
						if (res.data) {
							this.modalPdfIsShow = true;
							this.modalPdfUrl = res.data;
						}
					});
				} else {
					API_FinancingAdvanceApplyXieyiDownAll(params).then(res => {
						comDownload(res, null, '融资协议.zip');
					});
				}
			});
		},

		sumbitApply() {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.fangkuanData,
					receivableId: this.fangkuanData.id,
					...values
				};
				this.cacheParameter = params;
				this.$refs.tipModal.open();

				// this.$confirm({
				//   centered: true,
				//   content: "系统将对融资合同进行签章，请确保信息无误",
				//   okText: "确定",
				//   icon: "info-circle",
				//   title: "确认提示",
				//   closable: true,
				//   cancelText: "取消",
				//   onOk: () => {
				//     API_FinancingAdvanceApplySave(params).then((res) => {
				//       this.cacheId = res.data
				//       if (res.data) {
				//         if (  this.isSignAuth ) {
				//           this.$router.push(
				//             "/center/financing/financingAdvanceSign?id=" + res.data
				//           );
				//         } else {
				//           this.$message.success("操作成功");
				//           this.$router.push("/center/financing/financingAdvanceList");
				//         }
				//       }
				//     });
				//   },
				//   onCancel() {},
				// });
			});
		},
		openConfirm() {
			this.$refs.signNeedModal.open();
		},
		async saveConfirm() {
			const res = await API_FinancingAdvanceApplySave({ ...this.cacheParameter });
			this.cacheId = res.data.applyId;
			this.isNeedSign = res.data.sign;
			if (this.isNeedSign) {
				this.$refs.tipModal.close();
				if (this.isSignAuth) {
					this.$refs.signModal.open();
					// 无权限 但是需要盖章 提示
				} else {
					this.$refs.signNeedModal.open();
				}
			} else {
				this.goBack();
			}
		},
		confirmSign() {
			this.$router.push({
				path: '/center/financing/financingAdvanceSign',
				query: {
					id: this.cacheId
				}
			});
		},
		goBack() {
			this.$router.go(-1);
		},

		getRongZiDetail(record) {
			API_FinancingApplycompanyCredit({ receivableId: record.id }).then(res => {
				if (res.success) {
					let data = res.data || {};
					// //INVOICE(“发票结算”),PROOF(“无票结算”);
					// let bili = record.type == 'INVOICE' ? data.ticketFinancingPercentage : data.noTicketFinancingPercentage
					// this.biliData = [{
					//   text:bili,
					//   value:bili
					// }]
					this.lilvData = [
						{
							text: data.rate,
							value: data.rate
						}
					];
					this.yuqiData = [
						{
							text: data.overdueRate,
							value: data.overdueRate
						}
					];
				}
			});
		},
		getDetail(receivableId) {
			API_FinancingApplyAdvanceXieyi({ receivableId: receivableId }).then(res => {
				if (res.success) {
					this.xieyiDataSource = res.data || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	/deep/.settle-form {
		margin-top: 20px;
	}
	/deep/.ant-form-item {
		width: 364px;
		.fangkuan-select {
			.ant-select-selection {
				height: 56px;
			}
		}
	}
}
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
	}
}
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
</style>
