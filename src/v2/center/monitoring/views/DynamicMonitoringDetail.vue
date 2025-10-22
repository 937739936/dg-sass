<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">业务动态监控详情</span>
				<a-button
					class="add-btn"
					@click="goBack()"
					>返回</a-button
				>
			</div>
			<div>
				<div class="card-title">
					<a-button
						type="primary"
						ghost
						@click="() => (visible = true)"
					>
						下载附件
					</a-button>
				</div>
				<div class="s-card-content">
					<a-row
						v-if="dynamicMonitoringDetail"
						style="position: relative"
						type="flex"
						align="middle"
					>
						<a-col
							:span="10"
							class="mt8 df"
						>
							<div>
								<div
									:class="contractType === 0 ? 'active' : ''"
									@click="changeContractType(0)"
									v-if="curUpstream"
								>
									<div class="upstream stream">
										<strong :class="dynamicMonitoringDetail.upContractTermType === 'LONG_TERM_CONTRACT' ? 'long' : ''"></strong>
										<a-dropdown
											v-if="dynamicMonitoringDetail.upContractRelList && dynamicMonitoringDetail.upContractRelList.length > 0"
											:trigger="['click']"
										>
											<a
												class="ant-dropdown-link"
												style="display: inline-block; width: calc(100% - 50px)"
												@click.prevent
											>
												<a-tooltip v-if="dynamicMonitoringDetail.upstreamSellerCompany">
													<template slot="title">
														<p>{{ curUpstream.upstreamCompanyName }}</p>
													</template>
													<span
														class="ellipsis"
														style="width: calc(100% - 13px)"
													>
														{{ curUpstream.upstreamCompanyName }}
													</span>
												</a-tooltip>
												<a-icon type="down" />
											</a>
											<template #overlay>
												<a-menu>
													<a-menu-item
														@click="selectUpStreamContract(item)"
														:key="item.upOrderNo"
														v-for="item in dynamicMonitoringDetail.upContractRelList"
													>
														<a href="javascript:;">{{ item.upstreamCompanyName }}</a>
													</a-menu-item>
												</a-menu>
											</template>
										</a-dropdown>
										<template v-else>
											<a-tooltip v-if="curUpstream">
												<template slot="title">
													<p>
														{{ curUpstream.upstreamCompanyName }}
													</p>
												</template>
												<div
													class="ellipsis"
													style="font-family: PingFangSC-Medium; width: calc(100% - 42px)"
												>
													{{ curUpstream.upstreamCompanyName }}
												</div>
											</a-tooltip>
										</template>
										<p v-if="dynamicMonitoringDetail.upstreamDataStatus">
											{{ dynamicMonitoringDetail.upstreamDataStatus.cnname }}
										</p>
									</div>
								</div>
								<div
									:class="contractType === 0 ? 'active' : ''"
									@click="addUpOffLine"
									v-else
								>
									<div class="upstream stream">
										<strong :class="dynamicMonitoringDetail.upContractTermType === 'LONG_TERM_CONTRACT' ? 'long' : ''"></strong>
										<span>未完善</span>
									</div>
								</div>
								<div class="stream">
									<i class="line"></i>
									<a-tooltip>
										<template slot="title">{{ dynamicMonitoringDetail.coreCompany }}</template>
										<em :class="[relationTransportContract ? 'relate-order-line' : '']">{{
											dynamicMonitoringDetail.coreCompany
										}}</em>
									</a-tooltip>
								</div>
								<div
									:class="contractType === 1 ? 'active' : ''"
									@click="changeContractType(1)"
									v-if="dynamicMonitoringDetail.downstreamBuyerCompany"
								>
									<div class="downstream stream">
										<strong :class="dynamicMonitoringDetail.downContractTermType === 'LONG_TERM_CONTRACT' ? 'long' : ''"></strong>
										<a-tooltip v-if="dynamicMonitoringDetail.downstreamBuyerCompany">
											<template slot="title">
												{{ dynamicMonitoringDetail.downstreamBuyerCompany }}
											</template>
											<div
												class="ellipsis"
												style="font-family: PingFangSC-Medium; width: calc(100% - 42px)"
											>
												{{ dynamicMonitoringDetail.downstreamBuyerCompany }}
											</div>
										</a-tooltip>
										<p v-if="dynamicMonitoringDetail.downstreamDataStatus">
											{{ dynamicMonitoringDetail.downstreamDataStatus.cnname }}
										</p>
									</div>
								</div>
								<div
									:class="contractType === 1 ? 'active' : ''"
									@click="addDownOffLine"
									v-if="!dynamicMonitoringDetail.downstreamBuyerCompany"
								>
									<div class="downstream stream">
										<strong :class="dynamicMonitoringDetail.downContractTermType === 'LONG_TERM_CONTRACT' ? 'long' : ''"></strong>
										<span>未完善</span>
									</div>
								</div>
							</div>
							<div v-if="transportContract">
								<a-tooltip placement="top">
									<template slot="title">
										<span>{{ transportContract.consigneeCompanyName }}</span>
									</template>
									<a-row
										type="flex"
										justify="center"
									>
										<div
											class="trans-company-info"
											:class="contractType === 5 ? 'active-company' : ''"
											@click="changeContractType(5)"
										>
											<div class="type-info">运输</div>
											<div class="type-info-desc">
												<span class="company-name">{{ transportContract.consigneeCompanyName }}</span>
												<!-- <span class="status">未开始</span> -->
											</div>
										</div>
									</a-row>
								</a-tooltip>
							</div>
						</a-col>
						<a-col
							:span="14"
							v-if="contractType != 5"
						>
							<a-row
								type="flex"
								justify="space-between"
								align="middle"
							>
								<a-col :span="6">
									<div class="stream-info">
										<span>已发货(吨)</span>
										<p>
											{{ dynamicMonitoringDetail.deliveryQuantity && dynamicMonitoringDetail.deliveryQuantity.toFixed(2) }}
										</p>
									</div>
									<div
										class="stream-info"
										v-if="businessLineType === 'OFFLINE'"
									>
										<span>上游开票金额</span>
										<p>
											{{ dynamicMonitoringDetail.upInvoiceAmount && dynamicMonitoringDetail.upInvoiceAmount.toFixed(2) }}
										</p>
									</div>
									<div
										class="stream-info"
										v-else
									>
										<span>已融资(元)</span>
										<p>
											{{ dynamicMonitoringDetail.financeAmount && dynamicMonitoringDetail.financeAmount.toFixed(2) }}
										</p>
									</div>
								</a-col>
								<a-col :span="6">
									<div class="stream-info">
										<span>实际付款(元)</span>
										<div class="stream-info-aff">
											<p>
												{{
													dynamicMonitoringDetail.payAmount &&
													(dynamicMonitoringDetail.payAmount - dynamicMonitoringDetail.refundAmount).toFixed(2)
												}}
											</p>
											<!-- 该企业存在退款时展示，否则不展示 -->
											<div
												class="stream-info-aff-main"
												v-if="dynamicMonitoringDetail.refundAmount"
											>
												<div class="span">
													已付款： {{ dynamicMonitoringDetail.payAmount && dynamicMonitoringDetail.payAmount.toFixed(2) }}元
												</div>
												<div class="span">
													已退款： {{ dynamicMonitoringDetail.refundAmount && dynamicMonitoringDetail.refundAmount.toFixed(2) }}元
												</div>
											</div>
										</div>
									</div>
									<div
										class="stream-info"
										v-if="businessLineType === 'OFFLINE'"
									>
										<span>上游结算金额</span>
										<p>
											{{ dynamicMonitoringDetail.upSettleAmount && dynamicMonitoringDetail.upSettleAmount.toFixed(2) }}
										</p>
									</div>
									<div
										class="stream-info"
										v-else
									>
										<span>已还款(元)</span>
										<p>
											{{ dynamicMonitoringDetail.repaymentAmount && dynamicMonitoringDetail.repaymentAmount.toFixed(2) }}
										</p>
									</div>
								</a-col>
								<a-col :span="8">
									<div class="stream-info">
										<span>下游已回款(元)</span>
										<p>
											{{ dynamicMonitoringDetail.receiveAmount && dynamicMonitoringDetail.receiveAmount.toFixed(2) }}
										</p>
									</div>
									<div class="stream-info">
										<span>下游结算金额(元)</span>
										<p>
											{{
												dynamicMonitoringDetail.downstreamSettleAmount &&
												dynamicMonitoringDetail.downstreamSettleAmount.toFixed(2)
											}}
										</p>
									</div>
								</a-col>
							</a-row>
						</a-col>
						<a-col
							:span="12"
							v-if="contractType == 5"
						>
							<a-row
								type="flex"
								justify="space-between"
								align="middle"
							>
								<a-col :span="6">
									<div class="stream-info">
										<span>已发货(吨)</span>
										<p>
											{{
												dynamicMonitoringTransDetail.deliverQuantity && dynamicMonitoringTransDetail.deliverQuantity.toFixed(2)
											}}
										</p>
									</div>
								</a-col>
								<a-col :span="6">
									<div class="stream-info">
										<span>实际付款(元)</span>
										<p>
											{{ dynamicMonitoringTransDetail.payAmount && dynamicMonitoringTransDetail.payAmount.toFixed(2) }}
										</p>
									</div>
								</a-col>
								<a-col :span="8">
									<div class="stream-info">
										<span>运输结算金额(元)</span>
										<p style="word-break: break-all">
											{{ dynamicMonitoringTransDetail.stateAmount && dynamicMonitoringTransDetail.stateAmount.toFixed(2) }}
										</p>
									</div>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="bottom-box">
				<a-tabs :activeKey="contractType">
					<a-tab-pane
						:key="0"
						:tab="0"
					>
						<div class="upstream-content">
							<BusinessLineContract
								:key="0"
								v-if="dynamicMonitoringDetail"
								:belongContractType="0"
								:contractType="contractType"
								:dynamicMonitoringDetail="dynamicMonitoringDetail"
								:dynamicMonitoringTransDetail="dynamicMonitoringTransDetail"
								:canSubmitAudit="canSubmitAudit"
								:curUpstream="curUpstream"
								:transContractNo="transContractNo"
								@refresh="refresh"
								:downOrderId="downOrderId"
								:contractSerialNo="contractSerialNo"
								ref="upstreamBusinessLineContract"
							>
							</BusinessLineContract>
						</div>
					</a-tab-pane>
					<a-tab-pane
						:key="1"
						:tab="1"
					>
						<div
							class="downstream-content"
							:key="1"
						>
							<!--合同未完善--当前用户为下游负责人或者管理员，可完善
                合同已完善--当前用户为下游负责人或管理员，可修改、查看
                合同已完善--当前用户不是下游负责人或管理员，只可查看-->
							<template v-if="!hideDownstream">
								<BusinessLineContract
									:key="1"
									v-if="dynamicMonitoringDetail"
									:belongContractType="1"
									:contractType="contractType"
									:dynamicMonitoringDetail="dynamicMonitoringDetail"
									:canSubmitAudit="canSubmitAudit"
									:curUpstream="curUpstream"
									@refresh="refresh"
									:contractSerialNo="contractSerialNo"
									ref="downStreamContent"
								>
								</BusinessLineContract>
							</template>
							<!-- 合同未完善--当前用户不是下游负责人，显示暂无数据 或者老数据无下游负责人-->
							<template v-else>
								<a-table
									:columns="columns"
									:data-source="[]"
								></a-table>
							</template>
						</div>
					</a-tab-pane>
					<a-tab-pane
						:key="5"
						:tab="5"
					>
						<div
							class="downstream-content"
							:key="2"
						>
							<template v-if="dynamicMonitoringTransDetail">
								<BusinessLineContractTrans
									:key="1"
									v-if="dynamicMonitoringDetail"
									:belongContractType="1"
									:contractType="contractType"
									:transContractNo="transContractNo"
									:dynamicMonitoringDetail="dynamicMonitoringDetail"
									:canSubmitAudit="canSubmitAudit"
									:curUpstream="curUpstream"
									@refresh="refresh"
									:contractSerialNo="contractSerialNo"
									:dynamicMonitoringTransDetail="dynamicMonitoringTransDetail"
									ref="downStreamContent"
								>
								</BusinessLineContractTrans>
							</template>
							<!-- 合同未完善--当前用户不是下游负责人，显示暂无数据 或者老数据无下游负责人-->
							<template v-else>
								<a-table
									:columns="columns"
									:data-source="[]"
								></a-table>
							</template>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
			<!-- 有回款、核心企业 当前企业为上游企业 -->
			<div
				style="width: 100%; height: 8px; background-color: #f4f5f8"
				v-if="
					(VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' &&
						canSubmitAudit &&
						contractType == 0 &&
						(dynamicMonitoringDetail.orderCreateBy == VUEX_ST_COMPANYSUER.companyUserId ||
							VUEX_ST_COMPANYSUER.companyUserRoles.indexOf('admin') != -1)) ||
					(VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' && canSubmitAudit && dynamicMonitoringDetail && contractType == 1)
				"
			></div>
			<div
				v-if="
					VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' &&
					canSubmitAudit &&
					contractType == 0 &&
					(dynamicMonitoringDetail.orderCreateBy == VUEX_ST_COMPANYSUER.companyUserId ||
						VUEX_ST_COMPANYSUER.companyUserRoles.indexOf('admin') != -1)
				"
				v-auth="'monitor:dynamic:dataPerfect:submit'"
				style="background: #fff; padding: 24px; border-radius: 8px"
			>
				<!-- 能发起完结--并且为订单创建人或管理员 -->
				<p style="text-align: right">
					<a-button
						type="primary"
						@click="submitAudit()"
						:disabled="upstreamDisabled"
					>
						{{ upstreamBtnText }}
					</a-button>
				</p>
				<div
					v-if="
						dynamicMonitoringDetail &&
						dynamicMonitoringDetail.upstreamDataStatus.cnname == '平台驳回' &&
						dynamicMonitoringDetail.upstreamRejectReason
					"
					class="rejectBox"
				>
					<p>审批结果：{{ dynamicMonitoringDetail.upstreamDataStatus.cnname }}</p>
					<p>驳回原因：{{ dynamicMonitoringDetail.upstreamRejectReason }}</p>
					<p>审批时间：{{ dynamicMonitoringDetail.upstreamRejectTime }}</p>
				</div>
			</div>
			<!-- 能发起完结--并且为下游负责人或管理员 -->
			<div
				v-if="
					VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' && canSubmitAudit && dynamicMonitoringDetail && contractType == 1
				"
				v-auth="'monitor:dynamic:dataPerfect:submit'"
				style="background: #fff; padding: 24px; border-radius: 8px"
			>
				<p style="text-align: right">
					<a-button
						type="primary"
						@click="submitAudit()"
						:disabled="downstreamDisabled"
					>
						{{ downstreamBtnText }}
					</a-button>
				</p>
				<div
					v-if="
						dynamicMonitoringDetail &&
						dynamicMonitoringDetail.downstreamDataStatus.cnname == '平台驳回' &&
						dynamicMonitoringDetail.downstreamRejectReason
					"
					class="rejectBox"
				>
					<p>审批结果：{{ dynamicMonitoringDetail.downstreamDataStatus.cnname }}</p>
					<p>驳回原因：{{ dynamicMonitoringDetail.downstreamRejectReason }}</p>
					<p>审批时间：{{ dynamicMonitoringDetail.downstreamRejectTime }}</p>
				</div>
			</div>
		</a-card>

		<a-modal
			centered
			title="提示"
			:visible="visible"
			:width="420"
			@ok="downloadAttachment()"
			@cancel="() => (visible = false)"
		>
			<p class="mb8">请选择下载附件范围：</p>
			<a-button-group>
				<a-button
					v-for="item in fileTab"
					:key="item.value"
					@click="typeIndex = item.value"
					:type="item.value === typeIndex ? 'primary' : 'default'"
				>
					{{ item.label }}
				</a-button>
			</a-button-group>
		</a-modal>
	</div>
</template>
<script>
import {
	API_DownstreamSubmitAudit,
	API_UpstreamSubmitAudit,
	API_BusinessMonitoringCoreCompanyDetail,
	API_BusinessMonitoringUpstreamChangeContractDetail,
	API_BusinessMonitoringCanSellerSubmitAudit,
	API_BusinessMonitoringCanBuyerSubmitAudit,
	API_BusinessMonitoringDownstreamContractDetail,
	API_BUSINESSMONITORINGDOWANATTACH
} from '@/v2/center/monitoring/api/index';
import comDownload from '@sub/utils/comDownload.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';

import BusinessLineContract from '@/v2/center/monitoring/components/BusinessLineContract.vue';
import BusinessLineContractTrans from '@/v2/center/monitoring/components/BusinessLineContractTrans.vue';
import { mapGetters } from 'vuex';
import { omit } from 'lodash';
import { API_LogisticsContract } from '@/v2/center/monitoring/api/transportBusiness';

export default {
	name: 'MonitoringDynamicMonitoringDetail',
	components: {
		BusinessLineContract,
		BusinessLineContractTrans,
		Breadcrumb
	},

	data() {
		return {
			typeIndex: 1,
			visible: false,
			activeKey: 0,
			curUpstreamId: '',
			contractType: +this.$route.query.contractType,
			businessLineType: '',
			dynamicMonitoringDetail: '', // 详情信息
			canSubmitAudit: false, // 提交审核按钮是否展示
			// data: [],
			columns: [],
			hideDownstream: true,
			upstreamBtnText: '发起审核',
			downstreamBtnText: '发起审核',
			upstreamDisabled: false,
			downstreamDisabled: false,
			contractSerialNo: '', // 下游合同编号
			// 当前选择的上游
			curUpstream: '',
			downOrderId: '',
			fromPath: '',
			relationTransportContract: false,
			transportContract: null,
			transContractNo: '',
			dynamicMonitoringTransDetail: {},
			fileTab: [
				{ label: '上下游附件', value: 1 },
				{ label: '上游附件', value: 2 },
				{ label: '下游附件', value: 3 }
			]
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.fromPath = from.path;
		});
	},
	created() {
		// 0,1,2,3,4代表核心企业  21，22，23，24代表资方
		// this.isCoreCompany = [0, 1, 2, 3, 4].includes(+this.VUEX_ST_COMPANYSUER.coreCompanyType);
		// this.isFinanceCompany = [21, 22, 23, 24].includes(+this.VUEX_ST_COMPANYSUER.coreCompanyType);

		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.isCoreCompany = companyType == 'CORE_COMPANY';
		this.isFinanceCompany = companyType == 'FINANCIAL_ORG';

		this.businessLineType = this.$route.query.businessLineType;
		this.curUpstreamId = this.$route.query.curUpstreamId;
		this.getBusinessLineDetail();
	},
	methods: {
		downloadAttachment() {
			const { upOrderNo, downOrderNo, businessLineType } = this.$route.query;
			const params = {
				businessLineNo: this.dynamicMonitoringDetail.businessLineNo,
				upOrderNo,
				downOrderNo,
				businessLineType,
				downType: ['ALL', 'UP', 'DOWN', 'TRANS'][this.typeIndex - 1],
				transContractNo: this.transContractNo
			};
			API_BUSINESSMONITORINGDOWANATTACH(params)
				.then(res => {
					comDownload(res.data, '', `${res.name}`);
				})
				.finally(() => {
					this.visible = false;
				});
		},
		refresh(data) {
			if (data) {
				const { upOrderNo, downOrderNo } = data;
				if (this.contractType === 0 && upOrderNo !== this.$route.query.upOrderNo) {
					this.$router.replace({
						path: '/center/monitoring/dynamicMonitoring/detail',
						query: {
							...this.$route.query,
							upOrderNo
						}
					});
				}
				if (this.contractType === 1 && downOrderNo !== this.$route.query.downOrderNo) {
					this.$router.replace({
						path: '/center/monitoring/dynamicMonitoring/detail',
						query: {
							...this.$route.query,
							downOrderNo
						}
					});
				}
			}
			this.getBusinessLineDetail();
		},
		// 物流合同详情
		getLogisticsContractDetails(no, type = -1) {
			API_LogisticsContract({
				contractNo: no
			}).then(res => {
				if (res.success) {
					this.transportContract = res.data.terminalDeliveryVO;
					if (type == 5) {
						this.dynamicMonitoringTransDetail = res.data;
					}
				}
			});
		},
		// 获取业务线详情数据
		getBusinessLineDetail() {
			const { upOrderNo, downOrderNo } = this.$route.query;
			const params = {
				upOrderNo: upOrderNo || '',
				downOrderNo: downOrderNo || '',
				businessLineType: this.businessLineType
			};
			// if (!this.isCoreCompany && !this.isFinanceCompany) {
			//   return;
			// }
			let fct = API_BusinessMonitoringCoreCompanyDetail;
			// if (this.isFinanceCompany) {
			//   fct = API_BusinessMonitoringBankDetail;
			// }
			fct(params).then(res => {
				if (res.success) {
					// this.curUpstream = this.curUpstream ? this.curUpstream
					//   : (res.data.upContractRelList && res.data.upContractRelList[0]) || '';

					// const tempCurUpstream = { ...this.curUpstream };
					// 编辑上游后或者返回本页面时保持上次选中的上游合同
					this.curUpstreamId = this.curUpstream.id || this.$route.query.curUpstreamId;
					const upContractRelList = res.data.upContractRelList || [];
					this.downOrderId = res.data.downOrderId;
					this.curUpstream = upContractRelList[0] || '';
					upContractRelList.forEach(item => {
						if (+this.curUpstreamId === +item.id) {
							this.curUpstream = item;
						}
					});
					//如果缺少上游信息，并且又有上游单号
					if (!this.curUpstream && res.data.upOrderNo) {
						// if (!res.data.upContractRelList) {
						this.curUpstream = {
							upOrderNo: res.data.upOrderNo,
							upstreamCompanyName: res.data.upstreamSellerCompany,
							upstreamCompanyUscc: res.data.upstreamCompanyUscc,
							upOrderId: res.data.upOrderId
						};
					}
					// upContractRelList有值则认为上游补录业务线
					// if (this.businessLineType === 'UP' && this.curUpstream) {
					//存在上游需要补录的情况，此时默认展示下游
					// if (this.businessLineType === "UP") {
					//   this.upstreamChangeGetBusinessLineDetail(res.data.downOrderNo);
					//   return;
					// }
					if (res.data.transContractNo) {
						this.relationTransportContract = true;
						this.transContractNo = res.data.transContractNo;
						this.fileTab = [
							{ label: '上下游附件', value: 1 },
							{ label: '上游附件', value: 2 },
							{ label: '下游附件', value: 3 },
							{ label: '运输附件', value: 4 }
						];
						this.getLogisticsContractDetails(this.transContractNo);
					}
					this.handleContractDetail(res);
				}
			});
		},
		// 切换上游获取业务线详情
		upstreamChangeGetBusinessLineDetail(downOrderNo) {
			const params = {
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: downOrderNo || this.dynamicMonitoringDetail.downOrderNo || '',
				businessLineType: this.businessLineType
			};
			API_BusinessMonitoringUpstreamChangeContractDetail(params).then(res => {
				// 获取详情
				if (res.success) {
					this.dynamicMonitoringDetail = res.data;
					this.handleContractDetail(res);
				}
			});
		},
		// 获取并处理业务线上游合同详情数据
		handleContractDetail(res) {
			this.dynamicMonitoringDetail = res.data;
			// 上下游按钮状态
			this.upstreamBtnText =
				this.dynamicMonitoringDetail.upstreamDataStatus.cnname == '待审核'
					? '审核中'
					: this.dynamicMonitoringDetail.upstreamDataStatus.cnname == '已完结'
						? '已完结'
						: '发起审核';

			this.downstreamBtnText =
				this.dynamicMonitoringDetail.downstreamDataStatus.cnname == '待审核'
					? '审核中'
					: this.dynamicMonitoringDetail.downstreamDataStatus.cnname == '已完结'
						? '已完结'
						: '发起审核';

			this.upstreamDisabled =
				this.dynamicMonitoringDetail.upstreamDataStatus.cnname == '待审核' ||
				this.dynamicMonitoringDetail.upstreamDataStatus.cnname == '已完结';

			this.downstreamDisabled =
				this.dynamicMonitoringDetail.downstreamDataStatus.cnname == '待审核' ||
				this.dynamicMonitoringDetail.downstreamDataStatus.cnname == '已完结';
			// this.handleAuditShowOrHidden();
			this.changeContractType(this.$route.query.contractType);
		},
		// // 判断是否有回款，有回款才能显示“提交审核”按钮
		// 判断是否显示提交审核模块
		handleAuditShowOrHidden() {
			const params = {
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.dynamicMonitoringDetail.downOrderNo || '',
				businessLineType: this.businessLineType
			};
			if (+this.contractType === 0) {
				API_BusinessMonitoringCanBuyerSubmitAudit(params).then(res => {
					if (res.success) {
						this.canSubmitAudit = res.data;
					}
				});
				return;
			}
			if (+this.contractType === 1) {
				API_BusinessMonitoringCanSellerSubmitAudit(params).then(res => {
					if (res.success) {
						this.canSubmitAudit = res.data;
					}
				});
			}
			if (+this.contractType === 5) {
			}

			// API_JudgeCanSubmitAudit({ orderNo: this.$route.query.orderNo }).then(res => {
			//   if (res.success) {
			//     this.canSubmitAudit = res.data;
			//   }
			// });
		},
		// 获取下游合同信息
		getDownstreamContractInfo() {
			const params = {
				// orderNo: this.orderNo,
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.dynamicMonitoringDetail.downOrderNo,
				businessLineType: this.businessLineType,
				t: new Date().getTime() + 1
			};
			if (!this.dynamicMonitoringDetail.downOrderNo) {
				this.hideDownstream = false;
				return;
			}
			API_BusinessMonitoringDownstreamContractDetail(params).then(res => {
				if (!res.success) {
					this.hideDownstream = true; // 从sap获取暂无详情 则不展示下游
				} else {
					this.hideDownstream = false; // 从sap获取详情 则展示下游
					this.contractSerialNo = res.data.contractNo;
				}
			});
		},
		judgeDownstreamIsShow() {
			// 校验下游合同是哪种模式
			this.bingTerminalContract = Number(this.dynamicMonitoringDetail.bingTerminalContract);
			this.orderSerialNo = this.dynamicMonitoringDetail.orderNo;
			this.terminalModel = this.dynamicMonitoringDetail.terminalModel;
			if (this.dynamicMonitoringDetail.terminalModel == 1) {
				// 模式1 从SAP获取直接跳转到详情
				this.getDownstreamContractInfo();
			} else if (this.dynamicMonitoringDetail.terminalModel == 3 || !this.dynamicMonitoringDetail.terminalModel) {
				// 模式3 已完善到详情-未完善调弹窗去编辑
				this.terminalDirectorId = this.dynamicMonitoringDetail.terminalDirectorId;
				this.hideDownstream = false;
				if (!this.dynamicMonitoringDetail.downstreamBuyerCompany) {
					this.$message.error('非下游负责人、非管理员没有权限完善合同');
				}
			}
		},
		// 切换合同类型
		changeContractType(type) {
			// this.$refs.streamCarousel.goTo(index);
			this.contractType = type;
			if (type == 5) {
				this.getLogisticsContractDetails(this.transContractNo, type);
				return;
			}
			if (+type === 1) {
				// 切换到下游需判断
				this.judgeDownstreamIsShow();
			}
			if (this.contractType === +type && +this.curUpstreamId === +this.$route.query.curUpstreamId) {
				return;
			}

			this.contractType = +type;
			this.$router.replace({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					...omit(this.$route.query, 'addUpstream'),
					downOrderNo: this.$route.query.downOrderNo || this.dynamicMonitoringDetail.downOrderNo,
					contractType: type,
					curUpstreamId: this.curUpstream.id
				}
			});
			this.handleAuditShowOrHidden();
		},
		// 发起审核
		submitAudit() {
			// 下游提交业务审核
			const params = {
				upOrderNo: this.curUpstream.upOrderNo,
				downOrderNo: this.dynamicMonitoringDetail.downOrderNo || '',
				businessLineType: this.businessLineType
			};
			if (+this.contractType === 0) {
				// 上游提交业务审核
				API_UpstreamSubmitAudit(params).then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.upstreamDisabled = true;
						this.upstreamBtnText = '审核中';
						this.getBusinessLineDetail();
					}
				});
				return;
			}
			API_DownstreamSubmitAudit(params).then(r => {
				if (r.success) {
					this.$message.success('提交成功');
					this.downstreamDisabled = true;
					this.downstreamBtnText = '审核中';
					this.getBusinessLineDetail();
				}
			});
		},

		selectUpStreamContract(value) {
			this.curUpstream = value;
			this.curUpstreamId = value.id;
			this.changeContractType(0);
			this.upstreamChangeGetBusinessLineDetail();
		},
		//补录下游合同
		addDownOffLine() {
			this.$router.push({
				path: '/center/contract/sell/offline/add',
				query: {
					type: 'sell',
					disabled: true,
					linkOrderNo: this.$route.query.upOrderNo,
					linkContractNo: this.dynamicMonitoringDetail.upContractNo,
					linkOrderType: 'ONLINE'
				}
			});
		},
		//补录上游合同
		addUpOffLine() {
			this.$router.push({
				path: '/center/contract/buy/offline/add',
				query: {
					type: 'buy',
					disabled: true,
					linkOrderNo: this.$route.query.downOrderNo,
					linkContractNo: this.dynamicMonitoringDetail.downContractNo,
					linkOrderType: 'ONLINE'
				}
			});
		},
		goBack() {
			// 返回按钮的逻辑改为：如果可以找到上一级页面，则返回到上一级页面；
			// 如果找不到上一级页面，核心企业则返回到业务动态监控的列表页，一般贸易商返回业务线管理的列表页
			if (this.fromPath === '/') {
				if (this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY') {
					this.$router.push('/center/monitoring/dynamicMonitoring/list');
				}
				if (this.VUEX_ST_COMPANYSUER.companyType === 'TRADER') {
					this.$router.push('/center/businessline/list');
				}
			} else {
				this.$router.push({
					path: '/center/monitoring/dynamicMonitoring/list',
					query: {
						id: this.$route.query.id
					}
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
.bottom-box {
	::v-deep > div.ant-tabs > div.ant-tabs-top-bar {
		display: none;
	}
}
.s-card {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #141517;
}
.card-title {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-top: 14px;
}
.top-box .s-card-content {
	border-top: 1px solid #eef0f2;
}
.s-card-content {
	padding-bottom: 14px;
}
.top-box .ant-row {
	padding: 12px 25px;
}
.stream {
	padding: 10px;
	border: 1px solid transparent;
	cursor: pointer;
	display: flex;
	position: relative;
}
.stream .line {
	display: inline-block;
	width: 1px;
	height: 32px;
	background: #0053db;
	margin: 0 22px 0 14px;
}
.stream em {
	font-style: normal;
	color: #9ba0aa;
	position: relative;
	width: 100%;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 32px;
	font-size: 14px;
}
.stream span {
	font-family: PingFangSC-Medium;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 38px 1;
	margin-top: -2px;
	font-size: 12px;
}
.stream p {
	font-size: 14px;
	color: #9ba0aa;
	position: absolute;
	top: 37px;
	left: 71px;
}
.active .stream {
	border-color: hsla(0, 0%, 91%, 1);
	border-radius: 8px;
}
.active .stream span {
	color: #0053db;
}
.anticon-down {
	position: relative;
	top: -3px;
}
.stream-info {
	padding: 16px;
	text-align: center;
}
.stream-info span {
	font-size: 16px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 24px;
}
.stream-info p {
	font-family: Rubik-Medium;
	font-size: 30px;
	color: #f24e4d;
	letter-spacing: 0;
}
.stream-info-aff {
	p {
		display: inline-block;
	}
	.stream-info-aff-main {
		padding-left: 8px;
		display: inline-block;
		text-align: left;
		.span {
			font-size: 12px;
			line-height: 14px;
			color: #383a3f;
		}
	}
}
.bottom-box {
	width: 100%;
	background-color: #fff;
	border-radius: 8px;
	margin-top: 8px;
}
.bottom-box > div {
	width: 100%;
}
.bottom-box .upstream-content,
.bottom-box .downstream-content {
	width: 100%;
	padding: 24px 16px 24px 25px;
}
.rejectBox p {
	margin-bottom: 8px;
	font-size: 14px;
}
.upstream > strong {
	display: inline-block;
	width: 52px;
	height: 52px;
	background-image: url('../../../assets/imgs/monitoring/up_stream.png');
}
.upstream > strong.long {
	background-image: url('../../../assets/imgs/monitoring/up_stream_long.png');
}
.downstream > strong {
	display: inline-block;
	width: 52px;
	height: 52px;
	background-image: url('../../../assets/imgs/monitoring/down_stream.png');
}
.downstream > strong.long {
	background-image: url('../../../assets/imgs/monitoring/down_stream_long.png');
}
.ellipsis {
	padding-top: 2px;
	padding-left: 10px;
	font-size: 16px;
}
.trans-company-info {
	width: 74px;
	height: 270px;
	box-sizing: border-box;
	margin-top: -12px;
	padding: 10px;
	margin-left: 120px;
	overflow: hidden;
	cursor: pointer;
	border: 1px solid transparent;
	.type-info {
		width: 52px;
		height: 52px;
		text-align: center;
		line-height: 54px;
		background: #faad14;
		color: #fff;
		border-radius: 10px;
	}
	.type-info-desc {
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		span {
			width: 50%;
			height: 190px;
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			writing-mode: vertical-lr;
			letter-spacing: 2px;
		}
		.company-name {
			font-family: PingFangSC-Medium;
			font-size: 16px;
		}
		.status {
			font-size: 14px;
			color: #9ba0aa;
			text-align: left;
		}
	}
}
.stream-info-trans {
	height: 320px;
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.trans-company-info::before {
	content: '';
	display: inline-block;
	width: 130px;
	height: 1px;
	background: hsl(0, 0%, 91%);
	position: absolute;
	top: 100px;
	left: 280px;
}
.active-company {
	border: 1px solid hsla(0, 0%, 91%, 1);
	border-radius: 8px;
	&::before {
		// left: -10px;
	}
}
.df {
	display: flex;
	// align-items: center;
	// justify-content: space-between;
}
.slMain {
	::v-deep.ant-tabs-bar {
		margin: 0 0 16px 0 !important;
	}
}
</style>
