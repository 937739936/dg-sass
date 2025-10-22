<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<a-spin :spinning="detailLoading">
				<div class="methods-wrap">
					<span
						slot="title"
						class="slTitle"
					>
						{{ meta.title }}
					</span>
				</div>
				<div class="sub">
					<div class="slTitleAssis">合同信息</div>
					<ContractInfoView
						:loading="contractLoading"
						:contractInfo="contractInfo"
						@changeContract="changeContract"
					/>
				</div>
				<div class="sub">
					<div class="slTitleAssis">提货信息</div>
					<LadingInfoView
						ref="ladingInfoView"
						:editableLadingInfo="editableLadingInfo"
					/>
				</div>
				<div
					class="sub"
					v-if="hasCerModel"
				>
					<div class="slTitleAssis">提货单通知</div>
					<a-form
						:form="form"
						:colon="false"
						class="slFormDetail"
					>
						<a-form-item label="提货通知单开具方式">
							<a-radio-group
								@change="onChange"
								v-decorator="[
									'ladingIssueMethod',
									{
										rules: [{ required: true, message: '提货通知单开具方式必选' }],
										validateTrigger: ['change']
									}
								]"
							>
								<a-radio
									key="ONLINE_LADING"
									value="ONLINE_LADING"
									>电子通知单</a-radio
								>
								<a-radio
									key="OFFLINE_LADING"
									value="OFFLINE_LADING"
									>线下通知单</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</a-form>
				</div>
				<div class="sub">
					<div class="slTitleAssis">附件信息</div>
					<AttachmentView
						ref="file"
						:dataSource="attachmentDataSource"
						uploadModule="LADING"
					/>
				</div>
			</a-spin>
			<div class="bottom-actions">
				<a-button
					class="btn cancel-btn"
					type="primary"
					ghost
					@click="cancelBack"
				>
					取消
				</a-button>
				<a-button
					v-if="ladingIssueMethod == 'ONLINE_LADING'"
					class="btn"
					type="primary"
					ghost
					@click="previewLadingPdf"
				>
					提货通知单预览
				</a-button>
				<a-button
					v-if="ladingIssueMethod == 'ONLINE_LADING' && isSignAuth"
					class="btn ok-btn"
					type="primary"
					@click="submitAndSign"
					:loading="submitLoading"
				>
					提交并盖章
				</a-button>
				<a-button
					v-else
					class="btn ok-btn"
					type="primary"
					@click="submit"
					:loading="submitLoading"
				>
					提交
				</a-button>
			</div>
		</a-card>
		<SelectContractModal
			ref="selectContractModal"
			@confirmSelectContract="confirmSelectContract"
		/>
		<LadingPreView ref="ladingPreView" />
		<ConfirmModal
			ref="signSubmitConfirmModal"
			@confirm="onSignSubmitConfirmFunc"
		/>
		<ConfirmModal
			ref="submitConfirmModal"
			@confirm="onSubmitConfirmFunc"
		/>
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfoView from '../components/ContractInfoView';
import LadingInfoView from '../components/LadingInfoView';
import AttachmentView from '../components/AttachmentView';
import LadingPreView from '../components/LadingPreView';
import SelectContractModal from './contractList';
import {
	API_getLadingBillSave,
	API_getContractInfo,
	API_getLadingDetailInfo,
	API_ladingPreviewPdf,
	API_ladingJudgePdfParamChange,
	API_GetCompanyCertModel
} from '@/v2/center/trade/api/newLading';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import { mapGetters } from 'vuex';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';

export default {
	components: {
		breadcrumb,
		ContractInfoView,
		LadingInfoView,
		AttachmentView,
		SelectContractModal,
		LadingPreView,
		ConfirmModal
	},
	data() {
		let { meta } = this.$route;
		let form = this.$form.createForm(this);

		return {
			meta,
			form,
			detailLoading: false, // 详情信息加载loading
			submitLoading: false, // 提交信息loading
			contractLoading: false, // 合同信息加载loading
			contractInfo: {}, // 合同信息
			ladingDetailInfo: undefined, // 提货详情信息
			hasCerModel: false, // 是否开通电子签章模块
			ladingIssueMethod: undefined, // 提货通知到开具方式
			judgeSubmitAndSign: undefined
		};
	},
	mounted() {
		// 页面加载是获取已知信息（方法内部判断）
		// 加载合同如果路由参数中包含合同id信息进行加载
		let { orderContractId, contractType } = this.$route.query;
		this.getContractInfo(orderContractId, contractType);
		// 加载详情如果路由参数中包含详情id信息进行加载
		this.getLadingDetailInfo();
		this.getCompanyCertModel();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		modulePath() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return modulePath;
		},
		// 可编辑的提货信息
		editableLadingInfo: function () {
			// 先判断合同信息获取运输方式
			// 合同信息
			let contractInfo = this.contractInfo;
			let ladingDetailInfo = this.ladingDetailInfo;
			let transType = contractInfo?.transportMode;
			let beginDate = contractInfo?.startDate;
			let endDate = contractInfo?.endDate;
			if (ladingDetailInfo?.transType) {
				// 如果详情里面有运输信息优先使用详情中的
				transType = ladingDetailInfo?.transType;
			}
			let stationInfo = null;
			if (ladingDetailInfo?.stationInfo) {
				// 回显已选的站台
				stationInfo = ladingDetailInfo?.stationInfo;
			} else if (contractInfo?.relStationInfo && contractInfo?.relStationInfo.length > 0) {
				stationInfo = contractInfo?.relStationInfo[0];
			}
			if (ladingDetailInfo?.beginDate && ladingDetailInfo?.endDate) {
				beginDate = ladingDetailInfo?.beginDate;
				endDate = ladingDetailInfo?.endDate;
			}
			let contactName = ladingDetailInfo?.contactName ?? contractInfo?.contactName;
			let contactMode = ladingDetailInfo?.contactMode ?? contractInfo?.contactMode;
			let idNo = ladingDetailInfo?.idNo ?? contractInfo?.idNo;
			let warehouseToReceivable = contractInfo.warehouseToReceivable;
			let actualLadingUnit = ladingDetailInfo?.actualLadingUnit ?? contractInfo.actualLadingUnit;
			let actualReceivingUnit = ladingDetailInfo?.actualReceivingUnit ?? contractInfo.actualReceivingUnit;

			return {
				beginDate: beginDate,
				endDate: endDate,
				quantity: ladingDetailInfo?.quantity,
				stationInfo: stationInfo,
				contactName: contactName,
				contactMode: contactMode,
				idNo: idNo,
				transType: transType,
				remark: ladingDetailInfo?.remark,
				ladingTransInfoList: ladingDetailInfo?.ladingTransInfoList || [], // 运输方式信息列表
				orderContractId: contractInfo?.orderContractId,
				contractType: contractInfo?.contractType,
				warehouseToReceivable: warehouseToReceivable,
				actualLadingUnit: actualLadingUnit,
				actualReceivingUnit: actualReceivingUnit
			};
		},
		attachmentDataSource: function () {
			let ladingDetailInfo = this.ladingDetailInfo;
			let attachVOList = ladingDetailInfo?.attachVOList ?? [];
			let payAttachmentList = [];
			let goodAttachmentList = [];
			let otherAttachmentList = [];
			attachVOList.map(file => {
				let tFile = {
					...file,
					id: `${file.id}`,
					name: file.fileName,
					createTime: file.createDate,
					url: file.fileUrl
				};
				if (file.type == 'FKHD') {
					payAttachmentList.push(tFile);
				} else if (file.type == 'LADING') {
					goodAttachmentList.push(tFile);
				} else if (file.type == 'OTHER') {
					otherAttachmentList.push(tFile);
				}
			});
			let offlineLading =
				this.ladingIssueMethod == 'OFFLINE_LADING'
					? [
							{
								type: 'LADING',
								typeName: '提货通知单',
								required: true,
								acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
								maxSize: 100,
								attachmentList: goodAttachmentList
							}
						]
					: [];
			let dataSource = [
				{
					type: 'FKHD',
					typeName: '付款回单',
					required: true,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: payAttachmentList
				},
				...offlineLading,
				{
					type: 'OTHER',
					typeName: '其他凭证',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: otherAttachmentList
				}
			];
			return dataSource;
		},
		// 是否有盖章权限
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	watch: {
		ladingIssueMethod: {
			immediate: true,
			handler(value) {
				this.form.setFieldsValue({ ladingIssueMethod: value });
				// this.$nextTick(() => {
				// 	this.form.setFieldsValue({ ladingIssueMethod: value });
				// });
			}
		}
	},
	methods: {
		// 修改合同信息
		changeContract() {
			this.$refs.selectContractModal.showModal();
		},
		// 确认信息选择的合同信息
		confirmSelectContract(contractInfo) {
			this.contractInfo = contractInfo;
			this.getContractInfo(contractInfo.orderContractId, contractInfo.contractType);
		},
		// 获取合同信息根据选择的id
		getContractInfo(orderContractId, contractType) {
			let isNeed = orderContractId && contractType;
			if (!isNeed) {
				return;
			}
			this.contractLoading = true;
			API_getContractInfo({
				orderContractId: orderContractId,
				contractType: contractType
			})
				.then(res => {
					//
					if (res.success) {
						this.contractInfo = res.data;
					}
				})
				.catch(() => {
					//
				})
				.finally(() => {
					//
					this.contractLoading = false;
				});
		},
		// 获取编辑的提货详情信息
		getLadingDetailInfo() {
			let { id } = this.$route.query;
			if (!id) {
				return;
			}
			this.detailLoading = true;
			API_getLadingDetailInfo({
				id: id
			})
				.then(res => {
					//
					if (res.success) {
						if (res.data.attachVOList && res.data.ladingIssueMethod == 'ONLINE_LADING') {
							// 提货通知单开具方式为线上时, 附件不展示提货通知单
							let VOList = res.data.attachVOList.filter(item => item.type != 'LADING');
							res.data.attachVOList = VOList;
						}
						this.ladingDetailInfo = res.data;
						this.contractInfo = res.data.contractInfo;
						this.ladingIssueMethod = res.data.ladingIssueMethod;
					}
				})
				.catch(() => {
					//
				})
				.finally(() => {
					//
					this.detailLoading = false;
				});
		},
		// 获取企业是否开通电子签章模块
		getCompanyCertModel() {
			API_GetCompanyCertModel({ dontThrowEx: true }).then(res => {
				if (res.success && res.data) {
					this.hasCerModel = true;
					this.ladingIssueMethod = undefined;
				} else {
					this.hasCerModel = false;
					this.ladingIssueMethod = 'OFFLINE_LADING';
				}
			});
		},
		onChange(e) {
			this.ladingIssueMethod = e.target.value;
		},
		// 返回
		cancelBack() {
			// 取消
			this.$router.back();
		},

		async validateInputInfo() {
			return new Promise((resolve, reject) => {
				this.form.validateFieldsAndScroll((error, values) => {
					if (error) {
						reject('error');
					} else {
						resolve(values);
					}
				});
			});
		},

		// 预览提货单
		async previewLadingPdf() {
			try {
				this.detailLoading = true;
				let inputInfo = await this.$refs.ladingInfoView.onValidateInputInfo();
				let params = {
					contractType: this.contractInfo.contractType, // 合同类型
					orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
					contractNo: this.contractInfo.contractNo,
					...inputInfo
				};
				if (this.ladingDetailInfo?.id) {
					params.id = this.ladingDetailInfo?.id;
				}
				let res = await API_ladingPreviewPdf(params);
				this.detailLoading = false;
				this.$refs.ladingPreView.show(res?.data, `提货通知单-${this.contractInfo.contractNo}`);
			} catch (error) {
				this.detailLoading = false;
			}
		},
		// 提交并盖章
		async submitAndSign() {
			// 线上 & 有盖章权限
			try {
				let inputInfo = await this.$refs.ladingInfoView.onValidateInputInfo();
				await this.$refs.file.validateAttachmentFiels();
				let params = {
					contractType: this.contractInfo.contractType, // 合同类型
					orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
					contractNo: this.contractInfo.contractNo,
					...inputInfo,
					ladingIssueMethod: this.ladingIssueMethod
				};
				if (this.ladingDetailInfo?.id) {
					// id存在则为编辑
					params.id = this.ladingDetailInfo?.id;
				}
				let res = await API_ladingJudgePdfParamChange(params);
				this.judgeSubmitAndSign = res?.data == true;

				let modalObj = {
					modalTitle: '确认提交',
					modalText: this.judgeSubmitAndSign
						? '请确认提货信息是否填写正确，确认后将进入提货通知单盖章环节。'
						: '请确认提货信息是否填写正确?',
					modalTextNext: ''
				};
				this.$refs.signSubmitConfirmModal.showModal(modalObj);
			} catch (error) {}
		},
		async onSignSubmitConfirmFunc() {
			try {
				this.detailLoading = true;
				let inputInfo = await this.$refs.ladingInfoView.onValidateInputInfo();
				let attachmentList = await this.$refs.file.validateAttachmentFiels();

				let params = {
					contractType: this.contractInfo.contractType, // 合同类型
					orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
					contractNo: this.contractInfo.contractNo,
					...inputInfo,
					ladingIssueMethod: this.ladingIssueMethod,
					attachDTOList: attachmentList
				};
				if (this.ladingDetailInfo?.id) {
					// id存在则为编辑
					params.id = this.ladingDetailInfo?.id;
				}
				let res = await API_getLadingBillSave(params);
				this.detailLoading = false;
				if (res.success) {
					this.$message.success('提交成功');
					// this.$router.back();
					// 开始签章
					if (this.judgeSubmitAndSign) {
						this.$router.push({
							path: `/center/${this.modulePath}/lading/stamp`,
							query: {
								pdfUrl: res.data.sealFileUrl ?? '',
								id: res.data.id
							}
						});
					} else {
						this.$router.back();
					}
				}
			} catch (error) {
				this.detailLoading = false;
			}
		},

		// 提交信息
		async submit() {
			// 线下 | 线上无有盖章权限
			try {
				await this.$refs.ladingInfoView.onValidateInputInfo();
				await this.validateInputInfo();
				await this.$refs.file.validateAttachmentFiels();
				let modalObj = {
					modalTitle: '确认提交',
					modalText: '请确认提货信息是否填写正确？',
					modalTextNext: ''
				};
				if (this.ladingIssueMethod == 'ONLINE_LADING') {
					// 线上
					let res = await API_GET_COMPANY_ROLE_LIST();
					if (res.success) {
						this.roleData = res.data;
						modalObj = {
							modalTitle: '确认提交',
							modalText: '请确认提货信息是否填写正确？提货通知单需进行盖章操作，盖章后才可进入审批环节，请联系签章员进行盖章。',
							modalTextNext: ''
						};
						if (this.roleData.signerUserVOList.length) {
							for (var i = 0; i < this.roleData.signerUserVOList.length; i++) {
								const item = this.roleData.signerUserVOList[i];
								modalObj.modalTextNext =
									'<p>' + modalObj.modalTextNext + '签章员：' + item.personalName + '(' + item.mobile + ')</p>';
							}
						}
					}
				}
				this.$refs.submitConfirmModal.showModal(modalObj);
			} catch (error) {}
		},
		async onSubmitConfirmFunc() {
			try {
				this.detailLoading = true;
				let inputInfo = await this.$refs.ladingInfoView.onValidateInputInfo();
				let attachmentList = await this.$refs.file.validateAttachmentFiels();
				let params = {
					contractType: this.contractInfo.contractType, // 合同类型
					orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
					contractNo: this.contractInfo.contractNo,
					...inputInfo,
					ladingIssueMethod: this.ladingIssueMethod,
					attachDTOList: attachmentList
				};
				if (this.ladingDetailInfo?.id) {
					// id存在则为编辑
					params.id = this.ladingDetailInfo?.id;
				}
				let res = await API_getLadingBillSave(params);
				this.detailLoading = false;
				if (res.success) {
					this.$message.success('提交成功');
					this.$router.back();
				}
			} catch (error) {
				this.detailLoading = false;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		// margin-bottom: 30px;
	}
	.slFormDetail {
		padding-top: 0px;
	}

	.content {
		.sub {
			margin-top: 20px;
			.slTitleAssis {
				margin: 0 0 20px;
			}
		}
	}

	.bottom-actions {
		// position: sticky;
		// bottom: 0;
		margin-top: 78px;
		padding: 10px 20px;
		background: #ffffff;
		text-align: center;
		.ant-btn {
			margin: 0 15px;
			// padding: 0 30px;
			border-radius: 6px;
			height: 38px;
			border: 1px solid @primary-color;
		}
		.cancel-btn {
			width: 86px;
		}
		.ok-btn {
			width: 114px;
		}
	}
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
}
</style>
