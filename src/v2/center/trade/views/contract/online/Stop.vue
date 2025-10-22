<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			class="content"
			style="min-height: calc(100vh - 70px)"
		>
			<span
				slot="title"
				class="slTitle gird-line"
				>发起合同终止</span
			>
			<div class="slTitleAssis">合同信息</div>
			<ul class="grid-wrap transportBox">
				<li>
					<span class="label">合同编号</span>
					<span>
						<a @click="jumpContractDetail">{{ contractInfo.contractNo }}</a>
					</span>
				</li>
				<li>
					<span class="label">卖方企业</span>
					<span>{{ contractInfo.sellerCompanyName }}</span>
				</li>
				<li>
					<span class="label">买方企业</span>
					<span>{{ contractInfo.buyerCompanyName }}</span>
				</li>
				<li>
					<span class="label">品名</span>
					<span>{{ contractInfo.goodsName }}</span>
				</li>
				<li>
					<span class="label">基准价格</span>
					<span v-if="contractInfo.basePrice">{{ contractInfo.basePrice.toLocaleString() }}元/吨</span>
					<span v-else>{{ contractInfo.basePriceDesc }}</span>
				</li>
				<li>
					<span class="label">数量</span>
					<span>
						{{ contractInfo.quantity }}吨
						<template v-if="contractInfo.quantityOffset">(±{{ contractInfo.quantityOffset }}%)</template>
					</span>
				</li>
				<li>
					<span class="label">交货期限</span>
					<span>{{ contractInfo.deliveryStartDate }} - {{ contractInfo.deliveryEndDate }}</span>
				</li>
				<li>
					<span class="label">运输方式</span>
					<span>{{ getTransportType(contractInfo.transportMode) }}</span>
				</li>
				<li>
					<span class="label">收货人</span>
					<span>{{ contractInfo.consigneeCompanyName }}</span>
				</li>
			</ul>
			<div class="slTitleAssis margin-top-50px">合同终止</div>
			<a-form
				:form="form"
				layout="vertical"
			>
				<a-row style="padding-top: 0">
					<a-row>
						<a-col :span="24">
							<a-form-item
								label="终止类型"
								:wrapper-col="{ span: 24 }"
							>
								<a-radio-group
									v-decorator="[
										'terminateType',
										{
											rules: [{ required: true, message: '终止类型必选' }]
										}
									]"
								>
									<template v-for="item in terminateTypeList">
										<a-radio
											:value="item.value"
											:key="item.value"
											style="margin-right: 36px; margin-bottom: 8px"
										>
											{{ item.text }}
											<a-tooltip
												:title="
													item.value === 'RESCISSION_OF_AGREEMENT'
														? '提交该申请，后续流程需贸易双方盖章确认'
														: '提交该终止申请，会进入平台审核流程'
												"
											>
												<a-icon
													type="question-circle"
													theme="filled"
												/>
											</a-tooltip>
										</a-radio>
									</template>
								</a-radio-group>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-row type="flex">
								<a-form-item
									class="contacts-item-wrap"
									label="业务联系人"
									style="width: 140px"
									:wrapper-col="{ span: 8 }"
								>
									<a-input
										style="width: 140px"
										v-decorator="[
											'contacts',
											{
												rules: [{ required: true, message: '请填写业务联系人姓名' }]
											}
										]"
										placeholder="业务联系人姓名"
									>
									</a-input>
								</a-form-item>
								<a-form-item
									class="phone-number-wrap"
									label="手机号"
									:wrapper-col="{ span: 8 }"
								>
									<a-input
										style="width: 200px; margin-left: 12px"
										v-decorator="[
											'contactsMobile',
											{
												rules: [
													{ required: true, message: '请填写业务联系人手机号' },
													{ pattern: /^1[3456789]\d{9}$/, message: '请填写正确的手机号' }
												],
												validateTrigger: 'blur'
											}
										]"
										placeholder="业务联系人手机号"
									>
									</a-input>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="终止原因"
								:wrapper-col="{ span: 16 }"
							>
								<a-textarea
									class="textarea"
									placeholder="请输入终止原因，最多200字"
									v-decorator="[
										'terminateReason',
										{
											rules: [
												{ required: true, message: '终止原因必填' },
												{ max: 200, message: '终止原因不能超过200个字' }
											],
											validateTrigger: 'change'
										}
									]"
								>
								</a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</a-row>
			</a-form>
			<div v-if="form.getFieldValue('terminateType') && form.getFieldValue('terminateType') != 'RESCISSION_OF_AGREEMENT'">
				<div class="file-title-wrap">
					<div class="slTitleAssis">附件信息</div>
					<!-- <a-button type="primary" @click="addContractFiles">新增</a-button> -->
				</div>
				<div class="file-tips">
					请上传相关合同自然完结的证明材料，包括但不限于聊天截图、协议文件、保证金扣罚说明、解释说明函等，支持pdf和图片，可上传多份，单个文件大小不得超过100M
				</div>
				<FileUploadTable ref="fileUploadTable" />
			</div>
			<pdf-preview
				:url="relieveContractPdfPath"
				v-if="form.getFieldValue('terminateType') == 'RESCISSION_OF_AGREEMENT'"
			></pdf-preview>
			<image-viewer ref="imageViewer" />
			<a-row class="operation">
				<a-col
					:span="24"
					style="text-align: center"
				>
					<a-button
						style="margin-right: 48px"
						@click="returnPage"
					>
						取消
					</a-button>
					<a-button
						type="primary"
						@click="confirmOk"
					>
						提交
					</a-button>
				</a-col>
			</a-row>

			<!--确认提交弹窗-->
			<a-modal
				title="操作确认"
				:visible="visible"
				@ok="handleOk"
				@cancel="visible = false"
				class="confirm-modal"
				:closable="false"
				width="460px"
			>
				<p class="model-title">
					<span class="tip-wrap">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
								fill="var(--primary-color)"
							/>
						</svg>
						<span>操作确认</span>
					</span>
					<span
						class="close-icon"
						@click="visible = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="22"
							height="22"
							viewBox="0 0 22 22"
							fill="none"
						>
							<path
								d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
								fill="#C3C3C3"
							/>
						</svg>
					</span>
				</p>
				<!--需要签订解除协议时的文案-->
				<template v-if="form.getFieldValue('terminateType') !== 'RESCISSION_OF_AGREEMENT'">
					<div style="padding: 18px 0; display: flex">
						{{VUEX_ST_COMPANYSUER.belongsShanMei ? 
						'提交后，合同将进入“冻结中”状态，无法进行其他业务操作，确认提交吗？' 
						: '提交后，合同将进入“冻结中”状态，无法进行其他业务操作，同时推送平台审核，平台审核通过后，完成合同终止，确认提交吗？'}}
					</div>
				</template>
				<template v-else>
					<div
						style="padding: 18px 0; display: flex"
						v-if="isOa"
					>
						<div>
							你的企业已对接OA，请确认流程发起人，提交后将推送OA审核。审核通过后可以进行盖章，然后由对方进行确认盖章，双方盖章后，合同将终止完成。
						</div>
					</div>
					<div
						style="padding: 18px 0; display: flex"
						v-else
					>
						<div>提交后，请对终止协议进行盖章，盖章后将由对方进行确认盖章，双方盖章后，合同将终止完成，确认提交吗？</div>
					</div>
				</template>
			</a-modal>
			<!--    签章员盖章弹窗-->
			<a-modal
				title="操作确认"
				:visible="visibleSigner"
				:confirm-loading="confirmLoading"
				@ok="goStamp"
				okText="去盖章"
				@cancel="returnPage"
			>
				<template>
					<div style="padding: 18px 0; display: flex">
						<a-icon
							type="question-circle"
							style="color: rgb(243, 170, 74); font-size: 24px; vertical-align: bottom; margin-right: 12px"
						/>
						<div>终止协议已生成，是否立即盖章？</div>
					</div>
				</template>
			</a-modal>
		</a-card>
		<WorkFlowModal
			v-if="isOa"
			ref="workFlowModal"
			:orderId="$route.query.id"
			v-on:submit="submitOA"
			:auditChainAndOperator="auditChainAndOperator"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_saveTerminalContract,
	API_getPreviewTerminalContract,
	API_getOrderContractDetailById,
	API_listOrderTerminateLog,
	API_COMPANYOACHECK
} from '@/v2/center/trade/api/contract';
import { API_GET_USER_MOBILE_BY_ID } from '@/v2/api/common';
import { API_UPLOAD_FILE } from '@/v2/center/person/api';
import iUpload from '@/v2/components/upload.vue';
import imageViewer from '@/v2/components/imageViewer.vue';
import { mapGetters } from 'vuex';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import OfflineContractFilesUpload from '@/v2/center/trade/views/contract/components/OfflineContractFilesUpload'; // 合同附件上传
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
import { API_getTempleteByCode } from '@/v2/api/diy';
import { cloneDeep } from 'lodash';
import FileUploadTable from '@/v2/center/trade/components/fileUploadTable.vue';

export default {
	name: 'StopOrderForm',
	data() {
		return {
			form: this.$form.createForm(this),
			visible: false, //确认弹窗
			visibleSigner: false, // 签章员弹窗
			orderId: this.$route.query.id, // 订单id
			serialNo: this.$route.query.serialNo, // 订单编号
			relieveContractPdfPath: '', // 解除合同协议url
			action: API_UPLOAD_FILE,
			contacts: '',
			confirmLoading: false,
			myallowFormat: '.bmp,.jpg,.png,.gif,.pdf',
			terminateTypeList: filterCodeByKey('contractTerminateTypeEnumDict'),
			isOa: false,
			attachList: [],
			offlinefileDataSource: {},
			uploadFileList: [
				{
					value: '35',
					label: '合同终止'
				}
			],
			contractDetail: {},
			transportModeList: []
		};
	},
	components: {
		PdfPreview,
		iUpload,
		imageViewer,
		Breadcrumb,
		OfflineContractFilesUpload,
		WorkFlowModal,
		FileUploadTable
	},
	mounted() {
		this.init();
		this.getContractDetails();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		auditChainAndOperator() {
			if (this.isContractinitiator) {
				return this.contractDetail?.contract?.auditChainAndOperator || {};
			}
			return this.contractDetail?.contract?.receiveAuditChainAndOperator || {};
		},
		isContractinitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == this.$route.query.initiatorUscc;
		},
		contractInfo() {
			return {
				...this.contractDetail.contract,
				...this.contractDetail.contractDelivery
			};
		},
		// 上游负责人
		directorBusiness() {
			let contract = this.contractDetail.contract;
			if (contract) {
				let { director, directorMobile, directorBusinessOwnershipId } = contract;
				return {
					contacts: director || '',
					contactsMobile: directorMobile || '',
					id: directorBusinessOwnershipId
				};
			} else {
				return {
					contacts: '',
					contactsMobile: '',
					id: ''
				};
			}
		},
		// 下游负责人
		terminalDirectorBusiness() {
			let contract = this.contractDetail.contract;
			if (contract) {
				let { terminalDirectorName, terminalDirectorMobile, terminalDirectorId } = contract;
				return {
					contacts: terminalDirectorName || '',
					contactsMobile: terminalDirectorMobile || '',
					id: terminalDirectorId
				};
			} else {
				return {
					contacts: '',
					contactsMobile: '',
					id: ''
				};
			}
		}
	},
	methods: {
		jumpContractDetail() {
			const type = this.$route.query.type.toLowerCase();
			const { href } = this.$router.resolve({
				path: `/center/contract/${type}/online/detail`,
				query: {
					...this.$route.query
				}
			});
			window.open(href);
		},
		submitOA(data) {
			this.handleOk(data);
		},
		getTransportType(type) {
			return this.transportModeList.filter(item => item.value == type)[0]?.label;
		},
		// 根据合同模板获取运输方式
		getTransportModeByTemplateType(type) {
			API_getTempleteByCode({
				templateCode: type
			}).then(res => {
				if (res.success) {
					this.transportModeList = res.data.transportMode;
				}
			});
		},
		// 获取合同详情
		getContractDetails() {
			API_getOrderContractDetailById({
				orderId: this.$route.query.id
			}).then(async res => {
				if (res.success) {
					this.contractDetail = res.data;
					this.getTransportModeByTemplateType(res.data.contract.contractTemplateName);
					const info = this.$route.query.type.toLowerCase() == 'buy' ? this.directorBusiness : this.terminalDirectorBusiness;
					let result = null;
					if (info.id) {
						result = await API_GET_USER_MOBILE_BY_ID({ id: info.id });
					}
					this.$nextTick(() => {
						this.form.setFieldsValue({
							...info,
							contactsMobile: result?.data?.memberMobile || ''
						});
					});
				}
			});
		},
		// 新增合同附件
		addContractFiles() {
			this.$refs.OfflineContractFilesDrawer.addFileType();
		},
		getUploadFilesJudge(data, type) {
			let data1 = data.filter(item => {
				return item.type == type;
			});
			if (
				data1.length > 1 &&
				data1.some(item => {
					let ext = item.url.substr(item.url.lastIndexOf('.') + 1);
					return ['pdf'].indexOf(ext.toLowerCase()) !== -1;
				})
			) {
				return true;
			} else {
				return true;
			}
		},
		getUploadFiles(data) {
			let tempFileArr = cloneDeep(data[0]);
			tempFileArr.forEach(item => {
				item.fileName = item.name;
				item.fileUrl = item.url;
			});
			this.attachList = tempFileArr;
		},
		init() {
			API_getPreviewTerminalContract({
				orderId: this.orderId,
				serialNo: this.serialNo,
				terminateType: 'RESCISSION_OF_AGREEMENT'
			}).then(res => {
				// 获取解除合同协议
				if (res.success) {
					this.relieveContractPdfPath = res.data;
				}
			});
			this.checkIsOa(); //判断是否需要对接OA
		},
		confirmOk() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.fileListFileUpload();
					if (values.terminateType !== 'RESCISSION_OF_AGREEMENT' && !this.attachList.length) {
						this.$message.error('终止附件不能为空');
						return;
					}
					if (values.terminateType == 'RESCISSION_OF_AGREEMENT') {
						if (this.isOa) {
							this.$refs.workFlowModal.showModal();
						} else {
							this.visible = true;
						}
					} else {
						this.visible = true;
					}
				}
			});
		},
		handleOk(data) {
			// 提交终止请求
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const cloneValues = cloneDeep(values);
					cloneValues.contacts = `${cloneValues.contacts},${cloneValues.contactsMobile}`;
					API_saveTerminalContract({
						auditChainAndOperator: data,
						terminateReason: values.terminateReason,
						orderId: this.orderId,
						serialNo: this.serialNo,
						terminateType: values.terminateType,
						contacts: cloneValues.contacts,
						attachList: values.terminateType !== 'RESCISSION_OF_AGREEMENT' ? this.attachList : null
					}).then(res => {
						if (res.success) {
							this.$message.success('操作成功');
							this.returnPage();
						}
					});
				}
			});
		},
		fileListFileUpload() {
			const file = this.$refs.fileUploadTable?.getFileList() || [];
			file.forEach(item => {
				this.attachList.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		},
		// 判断是否需要对接OA，文案不同
		checkIsOa() {
			API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		returnPage() {
			this.$router.go(-1);
		},
		goStamp() {
			this.confirmLoading = true;
			API_getOrderContractDetailById({
				orderId: this.orderId
			})
				.then(resp => {
					if (resp.success) {
						let logId = null;
						API_listOrderTerminateLog({ orderId: this.orderId }).then(res => {
							if (res.success) {
								this.visibleSigner = false;
								this.visible = false;
								res.data?.map(item => {
									if (item.status === 'WAIT_SIGN_SEAL') {
										logId = item.id;
									}
								});
								this.$router.push({
									path: '/center/contract/' + this.$route.query.type.toLowerCase() + '/termination/stamp',
									query: {
										orderId: this.orderId,
										logId,
										serialNo: this.serialNo,
										relieveContractPdfPath: resp.data.terminatePdfPath,
										type: this.$route.query.type
									}
								});
							}
						});
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.slTitle {
	margin-bottom: 30px;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
.ant-btn {
	width: 96px;
	height: 34px;
}
.content {
	padding-bottom: 100px;
}
.operation {
	position: fixed;
	bottom: 0;
	background-color: #ffffff;
	width: calc(100vw - 262px);
	left: 229px;
	padding: 18px 0 18px 0;
	z-index: 99;
}
.grid-wrap {
	margin-top: 10px;
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
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
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
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
.file-tips {
	width: 100%;
	height: 44px;
	line-height: 44px;
	background: #e1eafe;
	padding-left: 12px;
	border: 1px solid #d0dfff;
	border-radius: 4px;
	margin-top: 20px;
}
.gird-line {
	width: 100%;
	padding-bottom: 20px;
	display: inline-block;
	border-bottom: 1px solid #e5e6eb;
}
.slTitleAssis {
	margin-top: 0;
}
.margin-top-50px {
	margin-top: 50px;
	margin-bottom: 20px;
}
.phone-number-wrap {
	/deep/ .ant-form-item-label {
		opacity: 0;
	}
	/deep/ .ant-col-8 {
		width: 100%;
	}
	/deep/ .ant-form-explain {
		padding-left: 15px;
	}
}
.textarea {
	width: 760px;
	height: 160px;
	resize: none;
}
.file-upload-wrap {
	margin-top: 20px;
}
.file-title-wrap {
	width: 100%;
	height: 32px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.contacts-item-wrap {
	/deep/.ant-form-item-control-wrapper {
		width: 100%;
	}
}
.confirm-modal {
	/deep/.ant-modal-header {
		display: none;
	}
	.model-title {
		width: 100%;
		height: 26px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		span {
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 500;
			line-height: 28px;
		}
	}
	/deep/.ant-modal-footer {
		border-top: none;
		.ant-btn {
			width: 88px;
		}
	}
	.close-icon {
		width: 22px;
		height: 22px;
		display: inline-block;
		cursor: pointer;
	}
	.tip-wrap {
		width: 106px;
		height: 26px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}
}
</style>
