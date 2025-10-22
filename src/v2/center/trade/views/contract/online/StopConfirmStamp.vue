<template>
	<div class="slMain">
		<a-row>
			<Breadcrumb />
			<a-card
				:bordered="false"
				class="content"
				style="min-height: calc(100vh - 70px)"
			>
				<span
					slot="title"
					class="slTitle gird-line"
					>合同终止确认</span
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
						<span v-else></span>
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
				<a-row>
					<a-col :span="8">
						<p class="terminate-title">终止类型</p>
						<p>{{ contractStopDetail.typeDesc }}</p>
					</a-col>
					<a-col :span="8">
						<p class="terminate-title">发起时间</p>
						<p>{{ contractStopDetail.applyTime }}</p>
					</a-col>
				</a-row>
				<a-row>
					<p class="terminate-title">终止原因</p>
					<a-textarea
						class="textarea"
						v-model="contractStopDetail.terminateReason"
						disabled
					></a-textarea>
				</a-row>
				<a-row></a-row>
				<div>
					<div class="file-title-wrap">
						<div class="slTitleAssis">附件信息</div>
						<a-table
							bordered
							:dataSource="dataSource"
							:columns="supplementalColumns"
							:pagination="false"
							:scroll="{ x: true }"
							style="margin-top: 20px"
						>
							<template
								slot="name"
								slot-scope="text, items"
							>
								<a-space :size="20">
									<a
										href="javascript:;"
										@click="viewContractDetail(items)"
										>{{ items.name }}</a
									>
								</a-space>
							</template>
						</a-table>
					</div>
				</div>
				<!-- <pdf-preview v-if="showPdfPreview == 1 && relieveContractPdfPath" :url="relieveContractPdfPath"></pdf-preview> -->
				<image-viewer ref="imageViewer" />
				<!-- 确认提交弹窗-->
				<a-modal
					title="操作确认"
					:maskClosable="false"
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
							: '提交后，合同将进入“冻结中”状态，无法进行其他业务操作，同时推 送平台审核，平台审核通过后，完成合同终止，确认提交吗？'}}
						</div>
					</template>
					<template v-else>
						<div
							style="padding: 18px 0; display: flex"
							v-if="isOa"
						>
							<div>
								你的企业已对接OA，请确认流程发起人，提交后将推送OA审核。审核通过后，将由对方进行确认盖章，然后由你方进行盖章，双方盖章后，合同终止完成。
							</div>
						</div>
						<div
							style="padding: 18px 0; display: flex"
							v-else
						>
							<div>
								提交后，终止协议将推送给对方，由对方进行确认盖章，然后由你方进行盖章，双方盖章后，完成合同终止，确认提交吗？
							</div>
						</div>
					</template>
				</a-modal>
				<!--签章员盖章弹窗-->
				<a-modal
					title="确认提交"
					:maskClosable="false"
					:visible="visibleSigner"
					:confirm-loading="confirmLoading"
					@ok="goStamp"
					okText="立即盖章"
					cancelText="稍后盖章"
					@cancel="returnPage"
					class="visible-signer-modal"
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
							<span>确认提交</span>
						</span>
						<span
							class="close-icon"
							@click="visibleSigner = false"
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
					<p class="tips">合同终止已确认，需要对合同终止协议进行盖章，是否现在进行盖章？</p>
				</a-modal>
				<a-row
					type="flex"
					justify="center"
					style="margin: 50px 0"
				>
					<a-space size="large">
						<a-button
							type=""
							@click.native="$router.go(-1)"
							>返回</a-button
						>
						<a-button
							type="primary"
							@click.native="rejectReasonModal = true"
							>驳回</a-button
						>
						<a-button
							type="primary"
							@click.native="visibleConfirm = true"
							>确认</a-button
						>
					</a-space>
				</a-row>
			</a-card>
			<!-- 终止原因 -->
			<a-modal
				:maskClosable="false"
				:visible="rejectReasonModal"
				okText="确定"
				cancelText="取消"
				width="490px"
				@ok="rejectContract"
				class="reject-modal"
				@cancel="
					() => {
						rejectReasonModal = false;
					}
				"
			>
				<p class="model-title">
					<span class="tip-wrap">
						<span>请输入驳回原因</span>
					</span>
					<span
						class="close-icon"
						@click="rejectReasonModal = false"
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
				<p class="reject-tips">驳回后，如再需终止合同则需要重新走流程，如确需驳回，请继续操作！</p>
				<a-textarea
					class="reject-textarea"
					v-model="rejectReason"
					placeholder="请输入驳回原因..."
				></a-textarea>
			</a-modal>
			<!-- 终止确认 -->
			<a-modal
				:maskClosable="false"
				title="合同终止"
				:visible="visibleConfirm"
				@ok="handleContractStopOk"
				@cancel="visibleConfirm = false"
				class="contract-stop"
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
						<span>合同终止</span>
					</span>
					<span
						class="close-icon"
						@click="visibleConfirm = false"
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
				<p class="tip-wrap-desc">您确定要进行合同终止吗？</p>
			</a-modal>
			<!-- 确认提交 -->
			<a-modal
				:maskClosable="false"
				title=""
				:visible="visibleConfirmSubmit"
				@ok="handleContractStopSubmit"
				@cancel="visibleConfirmSubmit = false"
				class="contract-stop"
				:closable="false"
				width="460px"
				:footer="null"
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
						<span>确认提交</span>
					</span>
					<span
						class="close-icon"
						@click="handleContractStopSubmit"
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
				<p class="tip-wrap-desc">合同终止已确认，请联系签章员对合同终止进行盖章</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
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
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
			</a-modal>
		</a-row>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
		<WorkFlowModal
			desc="你的企业已对接OA，请确认流程发起人，提交后将推送OA审核。"
			ref="workFlowModal"
			v-on:submit="submitOa"
			:orderId="$route.query.id"
			:auditChainAndOperator="auditChainAndOperator"
			:showTip="true"
		/>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_STOPSELLORDERGETTOSUBMITSIGLIST,
	API_SUBMITTOCONFIRMSTOPSELLORDER,
	API_STOPSELLORDERREJECT,
	API_CfcaStopOrderAutoSignature,
	API_getOrderContractDetailById,
	API_listOrderTerminateLog,
	API_CONTRACT_TERMINATE_LIST,
	API_CONTRACT_TERMINATE_CONFIRM,
	API_COMPANYOACHECK
} from '@/v2/center/trade/api/contract';
import { API_getTempleteByCode } from '@/v2/api/diy';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			autoFocus: false,
			commitChecked: false,
			agreementChecked: false,
			bipartiteAgreementChecked: false,
			buyBipartiteAgreementChecked: false,
			sellBipartiteAgreementChecked: false,
			rejectReason: '',
			visible: false,
			disabled: false,
			signLoading: false,
			relieveContractPdfPath: '',
			cfcaSealList: [], // 印模集合
			contractInfo: {},
			visibleSigner: false,
			confirmLoading: false,
			rejectReasonModal: false,
			supplementalColumns: [
				{
					title: '单据类型',
					dataIndex: 'typeName',
					key: 'typeName',
					width: 210,
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeNameRowSpan
							}
						};
					}
				},
				{
					title: '文件名',
					dataIndex: 'name',
					key: 'name',
					scopedSlots: { customRender: 'name' }
				}
			],
			dataSource: [],
			contractTerminateDetail: {},
			transportModeList: [],
			visibleConfirm: false,
			isOa: false,
			visibleConfirmSubmit: false,
			contractStopDetail: {},
			terminateTypeList: filterCodeByKey('contractTerminateTypeEnumDict'),
			showPdfPreview: -1,
			logId: null,
			roleData: {}
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp,
		Breadcrumb,
		imageViewer,
		WorkFlowModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == this.$route.query.terminalContractInitiatorUscc;
		},
		auditChainAndOperator() {
			if (this.isContractinitiator) {
				return this.contractInfo?.auditChainAndOperator || {};
			}
			return this.contractInfo?.receiveAuditChainAndOperator || {};
		},
		// 合同发起方和中止发起方是否是同一家企业
		isContractinitiator() {
			return this.contractInfo.initiatorUscc == this.VUEX_ST_COMPANYSUER.companyUscc;
		}
	},
	mounted() {
		this.getContractDetails();
		this.checkIsOa();
		this.getCurrentCompanyRolesInfo();
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
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
		handleContractStopSubmit() {
			const type = this.$route.query.type.toLowerCase();
			this.visibleConfirmSubmit = false;
			this.$router.replace({
				path: `/center/contract/${type}/list`
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
		submitOa(oaConfig) {
			this.confirmToStopContract(oaConfig);
		},
		confirmToStopContract(config) {
			const rolesList = this.VUEX_ST_COMPANYSUER.roles.map(item => item.code);
			API_CONTRACT_TERMINATE_CONFIRM({
				orderId: this.$route.query.id,
				logId: this.contractTerminateDetail.pop()?.id,
				auditChainAndOperator: config,
				offlineApproval: this.$refs?.workFlowModal?.form?.getFieldValue('offlineApproval') || false
			}).then(res => {
				if (res.success) {
					const type = this.$route.query.type.toLowerCase();
					this.$message.success('提交成功');
					// 如果对接了oa，直接跳转合同列表
					if (this.isOa) {
						this.$router.replace({
							path: `/center/contract/${type}/list`
						});
						return;
					}
					// 如果没有对接oa
					if (rolesList.includes('ADMIN') || rolesList.includes('SIGNER')) {
						// 如果有签章员
						this.visibleSigner = true;
					} else {
						// 如果没有签章员
						this.visibleConfirmSubmit = true;
					}
				}
			});
		},
		handleContractStopOk() {
			if (this.isOa) {
				this.$refs.workFlowModal.showModal();
				this.visibleConfirm = false;
				return;
			}
			this.confirmToStopContract(null);
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
		// 合同终止详情
		getContractTerminateDetail() {
			API_listOrderTerminateLog({
				orderId: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.contractTerminateDetail = Object.assign([], res.data);
					this.logId = res.data.shift().id;
				}
			});
			API_CONTRACT_TERMINATE_LIST({
				orderId: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.contractStopDetail = {
						...res.data.list[0],
						typeDesc: this.terminateTypeList.filter(item => item.value == res.data.list[0].terminateType)[0]?.text
					};
					if (res.data.list[0].terminateType == 'RESCISSION_OF_AGREEMENT') {
						this.dataSource.push({
							id: 1,
							typeName: '终止协议',
							name: this.relieveContractPdfPath.split('/').pop(),
							url: this.relieveContractPdfPath
						});
						this.showPdfPreview = 1;
					} else {
						this.showPdfPreview = 0;
					}
				}
			});
		},
		// 获取合同详情
		getContractDetails() {
			API_getOrderContractDetailById({
				orderId: this.$route.query.id
			})
				.then(res => {
					if (res.success) {
						this.contractInfo = {
							...res.data.contract,
							...res.data.contractDelivery
						};
						this.relieveContractPdfPath = res.data.terminatePdfPath;
						this.getTransportModeByTemplateType(res.data.contract.contractTemplateName);
					}
				})
				.finally(() => {
					this.getContractTerminateDetail();
				});
		},
		viewContractDetail(item) {
			filePreview(item.url, this.$refs.imageViewer.show);
		},
		returnPage() {
			this.$router.back();
		},
		goStamp() {
			const type = this.$route.query.type.toLowerCase();
			this.$router.push({
				path: `/center/contract/${type}/termination/stamp`,
				query: {
					...this.$route.query,
					logId: this.logId
				}
			});
		},
		handleOk() {},
		getRouterType(buyRouter) {
			return buyRouter;
		},
		autoSignature() {
			this.signLoading = true;
			API_CfcaStopOrderAutoSignature({
				orderSerialNo: this.$route.query.serialNo,
				terminalContractZzLogId: this.logId,
				ccsFlag: this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY',
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success({
									content: '盖章完成',
									duration: 5
								});
								const type = this.$route.query.type.toLowerCase();
								this.$router.replace({
									path: `/center/contract/${type}/list`
								});
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		sign() {
			let obj = {
				industryType: 'COAL', // 行业 COAL代表煤块
				moduleSealType: 3, //模块编码 3代表合同终止模块
				moduleSealTypeDetail: 2 //1盖章 2确定盖章
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				var that = this;
				const isOrderModule = true;
				that.$confirm({
					centered: true,
					title: '请确认合同信息无误并进行盖章？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						sign.call(
							that,
							that.step1,
							that.step2,
							that.completedRoute, // 盖章后回调router
							isOrderModule
						);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return this.getRouterType(API_STOPSELLORDERGETTOSUBMITSIGLIST)(
				Object.assign(
					{
						orderId: this.$route.query.orderId,
						cert: obj.cert,
						terminalContractZzLogId: this.logId,
						cfcaSealList: this.cfcaSealList
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(API_SUBMITTOCONFIRMSTOPSELLORDER)(
				Object.assign(
					{
						orderId: this.$route.query.orderId,
						logId: this.logId
					},
					obj
				)
			);
		},
		// 驳回合同
		rejectContract() {
			this.getRouterType(API_STOPSELLORDERREJECT)({
				orderId: this.$route.query.id,
				logId: this.logId,
				rejectReason: this.rejectReason
			}).then(res => {
				if (res.success) {
					this.$message.success('操作成功').then(() => {
						this.$router.go(-1);
					});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.name-items {
	width: 100%;
	height: 40px;
}

.name {
	font-size: 16px;
	color: #333;
	margin-left: 20px;
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
.textarea {
	width: 760px;
	height: 160px;
	resize: none;
}
.terminate-title {
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.4);
	margin: 20px 0 13px 0;
}
.gird-line {
	width: 100%;
	padding-bottom: 20px;
	display: inline-block;
	border-bottom: 1px solid #e5e6eb;
}
.reject-modal,
.contract-stop,
.visible-signer-modal {
	/deep/ .ant-modal-header {
		display: none;
	}
	/deep/.ant-modal-close {
		display: none;
	}
	/deep/ .ant-modal-body {
		padding: 20px;
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
		span {
			height: 26px;
			display: inline-block;
			font-size: 18px;
			font-style: normal;
			font-weight: 500;
		}
		width: 140px;
		height: 26px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}
}
.reject-tips {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	margin-top: 14px;
}
.reject-textarea {
	width: 450px;
	height: 150px;
	resize: none;
	margin-top: 14px;
	background: rgba(129, 145, 169, 0.1);
}
.contract-stop {
	.tip-wrap {
		width: 100px;
	}
	.tip-wrap-desc {
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 22px;
		color: rgba(0, 0, 0, 0.5);
		margin-top: 19px;
	}
}
.visible-signer-modal {
	.tip-wrap {
		width: 106px;
	}
	.tips {
		width: 406px;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
		color: rgba(0, 0, 0, 0.5);
		margin-top: 18px;
	}
}
</style>
