<template>
	<a-row
		:gutter="24"
		style="min-height: 260px"
	>
		<div
			v-if="loading"
			key="1"
		>
			<a-steps
				:current="stepsInfo.current"
				class="steps-tool"
				v-if="stepsInfo.current != 3"
			>
				<a-step
					v-for="item in stepsInfo.steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
			<div
				class="tipsBox"
				v-if="renewalCertMsg && renewalCertMsg.msgType !== 'normal' && renewalCertMsg.msgType !== 'notNormal'"
			>
				<a-icon
					type="exclamation-circle"
					theme="filled"
				/>
				<span>{{ renewalCertMsg.msg }}</span>
				<p
					v-for="(item, index) in this.renewalCertMsg.msgDetailList"
					:key="index"
				>
					{{ item }}
				</p>
			</div>
			<!-- 状态字典（WAIT_AUDIT：待审核；SUCCESS：审核通过；EDIT：退回修改；MAKE：已制证；WAIT_ACTIVATE：待激活；ACTIVATED：已激活） -->
			<div class="steps-content">
				<template v-if="stepsInfo.current == 0">
					<div
						class="tc no-cert"
						v-if="!certStatus"
					>
						<p>该企业尚未开通电子签章服务,开通后可使用电子签章相关服务</p>
						<a-button
							v-auth="'company:certApply'"
							class="button"
							type="primary"
							@click="$router.push('/center/account/company/info/openSignature')"
							>申请开通电子签章服务</a-button
						>
					</div>
					<div
						class="tc no-cert"
						v-if="certStatus === 'EDIT'"
					>
						<p>你的电子签章服务审核未通过</p>
						<span>原因：{{ applyInfo.auditOpinion }}</span>
						<div>
							<a-button
								v-auth="'company:certApply'"
								class="button"
								type="primary"
								@click="$router.push('/center/account/company/info/openSignature?type=edit')"
								>申请开通电子签章服务</a-button
							>
						</div>
					</div>
				</template>
				<template v-if="stepsInfo.current == 1 && !applyInfo.cfcaCertModelAddApply">
					<div class="tc no-cert">
						<p>你的电子签章服务正在审核中</p>
					</div>
				</template>
				<template
					v-if="(stepsInfo.current == 1 && applyInfo.cfcaCertModelAddApply) || stepsInfo.current == 2 || stepsInfo.current == 3"
				>
					<div
						style="width: 70%"
						v-if="this.applyInfo && this.model"
					>
						<div class="item">
							<div
								class="renewalBox"
								v-if="this.applyInfo.cfcaCertRenewalApply"
							>
								<span>证书续期：{{ this.applyInfo.cfcaCertRenewalApply.statusText }}</span>
								<div v-if="this.applyInfo.cfcaCertRenewalApply.status === 'REJECT'">
									<a-tooltip placement="rightTop">
										<template slot="title">
											<p>驳回时间：{{ this.applyInfo.cfcaCertRenewalApply.auditTime }}</p>
											<p>驳回原因：{{ this.applyInfo.cfcaCertRenewalApply.auditOpinion }}</p>
										</template>
										<a-icon
											type="question-circle"
											theme="filled"
										/>
									</a-tooltip>
								</div>
							</div>
							<div class="info">
								<a-row
									type="flex"
									justify="space-between"
								>
									<a-col>
										<img
											src="~imgs/cfcaLogo.png"
											alt=""
										/>
									</a-col>
									<a-col class="flex-1">
										<a-row
											type="flex"
											justify="space-between"
										>
											<span class="name">中国金融认证中心CFCA</span>
										</a-row>
										<div>
											<a-row
												class="tipText"
												v-if="applyInfo.boo && applyInfo.cfcaCertChangeApply"
											>
												<span
													class="name"
													style="color: var(--primary-color)"
													>新增印模：{{ applyInfo.cfcaCertChangeApply.statusText
													}}<span v-if="applyInfo.cfcaCertChangeApply.status === 'EDIT'"
														>-{{ applyInfo.cfcaCertChangeApply.auditOpinion }}</span
													></span
												>
											</a-row>
											<a-row
												class="tipText"
												v-if="
													applyInfo.cfcaCertModelAddApplyBoo &&
													applyInfo.cfcaCertModelAddApply &&
													certModelStatusArr.includes(applyInfo.cfcaCertModelAddApply.status)
												"
											>
												<span
													class="name"
													style="color: var(--primary-color)"
													>新增签章方式：{{
														certModelStatusTextArr.includes(applyInfo.cfcaCertModelAddApply.status)
															? '审核通过'
															: applyInfo.cfcaCertModelAddApply.statusText
													}}
													<template v-if="applyInfo.cfcaCertModelAddApply.status === 'EDIT'"
														>：{{ applyInfo.cfcaCertModelAddApply.auditTime }}，{{
															applyInfo.cfcaCertModelAddApply.auditOpinion
														}}</template
													>
												</span>
											</a-row>
											<div class="textTime">
												<template
													v-if="renewalCertMsg && renewalCertMsg.msgType !== 'normal' && renewalCertMsg.msgType !== 'notNormal'"
												>
													<template v-if="applyInfo.certDTOList && applyInfo.certDTOList.length > 2">
														<a-tooltip
															placement="topLeft"
															overlayClassName="bgc_tooltip"
														>
															<template #title>
																<div
																	v-for="(item, index) in applyInfo.certDTOList"
																	:key="index"
																>
																	{{ item.certToSealTypeText }}有效期：{{ item.startTime }}～{{ item.slEndTime }}
																</div>
															</template>
															<div
																class="red"
																v-for="(item, index) in applyInfo.certDTOList"
																:key="index"
																v-if="index < 2"
															>
																{{ item.certToSealTypeText }}有效期：{{ item.startTime }}～{{ item.slEndTime }}
															</div>
														</a-tooltip>
													</template>
													<template v-else>
														<div
															class="red"
															v-for="(item, index) in applyInfo.certDTOList"
															:key="index"
														>
															{{ item.certToSealTypeText }}有效期：{{ item.startTime }}～{{ item.slEndTime }}
														</div>
													</template>
												</template>
												<div>
													<span>签章员：</span>
													<span>{{ model.signerName || applyInfo.signerName }} </span>
												</div>
											</div>
										</div>
									</a-col>
								</a-row>
							</div>
							<a-row
								type="flex"
								justify="space-between"
								style="border-top: 1px solid #eef0f2"
							>
								<!-- 第一次开通电子签章，电子签章申请->审核中->审核通过，激活按钮展示 -->
								<a-col class="tc button">
									<span @click="detail(model)"> 查看 </span>
								</a-col>
								<a-col
									class="tc button"
									v-if="certStatus === 'WAIT_ACTIVATE'"
									v-auth="'company:certApply:jh'"
								>
									<span @click="activate(applyInfo)"> 激活 </span>
								</a-col>
								<a-col
									class="tc button"
									v-if="certStatus === 'ACTIVATED' && (model.frozenFlag === null || model.frozenFlag)"
								>
									<span @click="$router.push('/center/account/company/info/configSignature')"> 签章配置 </span>
								</a-col>
								<a-col
									class="tc button"
									v-if="certStatus === 'ACTIVATED' && (model.frozenFlag === null || model.frozenFlag) && showRenewalCertBtn"
									v-auth="'company:certApply:zsxq'"
								>
									<span @click="checkBeforeEachApply('renewal')"> 证书续期 </span>
								</a-col>
								<a-col
									class="tc button"
									v-if="moreBtnShow"
								>
									<a-dropdown>
										<a
											class="ant-dropdown-link button"
											@click="e => e.preventDefault()"
										>
											更多<a-icon type="down" />
										</a>
										<a-menu slot="overlay">
											<template v-if="model.frozenFlag !== null">
												<a-menu-item
													v-if="!model.frozenFlag"
													v-auth="'company:sealState'"
												>
													<a-col class="tc button">
														<p @click="checkBeforeEachApply('unfrozen', applyInfo.id)">解冻</p>
													</a-col>
												</a-menu-item>
												<a-menu-item
													v-if="model.frozenFlag"
													v-auth="'company:sealState'"
												>
													<a-col class="tc button">
														<p @click="checkBeforeEachApply('frozen', applyInfo.id)">冻结</p>
													</a-col>
												</a-menu-item>
											</template>

											<template v-if="model.frozenFlag === null || model.frozenFlag">
												<a-menu-item v-auth="'company:certApply:xzqz'">
													<a-col class="tc button">
														<p @click="checkBeforeEachApply('addSeal')">新增印模</p>
													</a-col>
												</a-menu-item>
											</template>
											<a-menu-item
												v-auth="'company:certApply:xzqzfs'"
												v-if="showAddSealMethodBtn"
											>
												<a-col class="tc button">
													<p @click="checkBeforeEachApply('addCertModel')">新增签章方式</p>
												</a-col>
											</a-menu-item>
											<template v-if="model.frozenFlag === null || model.frozenFlag">
												<a-menu-item v-auth="'company:signerEdit'">
													<a-col class="tc button">
														<p @click="checkBeforeEachApply('changeSigner', applyInfo.id)">更换签章员</p>
													</a-col>
												</a-menu-item>
												<a-menu-item v-auth="'company:signerMobileEdit'">
													<a-col class="tc button">
														<p @click="checkBeforeEachApply('changeSignerMobile', applyInfo.id)">修改签章员手机号</p>
													</a-col>
												</a-menu-item>
											</template>
										</a-menu>
									</a-dropdown>
								</a-col>
							</a-row>
						</div>
					</div>

					<a-col
						:span="24"
						v-if="certStatus === 'SUCCESS' || certStatus === 'WAIT_ACTIVATE'"
					>
						<p style="line-height: 28x">
							*&nbsp;电子签章激活方式：当前电子签章为冻结状态，请完成短信验证，激活电子签章（注意：电子签章未激活，不可使用）
						</p>
						<p style="line-height: 28px">*&nbsp;电子签章快递信息：请及时查收短信（含快递公司和快递单号），自查签章物流信息</p>
					</a-col>
				</template>
			</div>
		</div>
		<CertDetail ref="certDetail"></CertDetail>
		<ActivateCert
			ref="activateCert"
			@success="getInfo"
		></ActivateCert>
		<!-- 错误信息提示 -->
		<div
			class="ant-message"
			v-if="messageVisible"
		>
			<span>
				<div class="ant-message-notice">
					<div class="ant-message-notice-content">
						<div class="ant-message-custom-content ant-message-info">
							<a-icon
								type="exclamation-circle"
								theme="filled"
							/>
							<span>{{ messageContent }}</span>
							<a-icon
								type="close"
								@click="
									() => {
										messageVisible = false;
									}
								"
							/>
						</div>
					</div>
				</div>
			</span>
		</div>
	</a-row>
</template>
<script lang="jsx">
import {
	API_CertApplyInfo,
	API_CertInfo,
	API_CertFrozen,
	API_CertUnfrozen,
	API_CertRenewalMsg,
	API_CheckBeforeEachApply
} from '@/v2/api/account';
import CertDetail from './CertDetail.vue';
import ActivateCert from './ActivateSeal.vue';
import { mapGetters } from 'vuex';

export default {
	name: 'CertCard',
	components: {
		CertDetail,
		ActivateCert
	},
	data() {
		return {
			showButton: false,
			loading: true,
			certStatus: '',
			model: {}, // 证书申请成功后的信息
			applyInfo: {}, // 证书申请的信息
			stepsInfo: {
				current: 0,
				steps: [
					{
						title: '电子签章申请'
					},
					{
						title: '审核中'
					},
					{
						title: '审核通过，请激活'
					},
					{
						title: '激活成功'
					}
				]
			},
			renewalCertMsg: '',
			messageVisible: false,
			messageContent: '',
			moreBtnShow: false,
			showRenewalCertBtn: false,
			showAddSealMethodBtn: false,
			certModelStatusArr: ['EDIT', 'WAIT_AUDIT', 'SUCCESS', 'WAIT_ACTIVATE', 'ACTIVATED', 'MAKE'],
			certModelStatusTextArr: ['SUCCESS', 'WAIT_ACTIVATE', 'ACTIVATED', 'MAKE'] // 签章方式的审核通过文案代表审核通过、待激活、已激活、已制证的接口状态
		};
	},
	created() {
		this.getInfo();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		loading: function (data) {
			this.loading = data;
		}
	},
	methods: {
		async getInfo() {
			this.loading = false;
			let res = await API_CertApplyInfo(); // 获取证书申请信息
			if (!res.success) return;
			this.applyInfo = res.data;
			if (res.data?.cfcaCertModelAddApply?.status === 'WAIT_ACTIVATE') {
				// 新增签章方式待激活状态
				this.certStatus = res.data?.cfcaCertModelAddApply?.status;
			} else {
				this.certStatus = res.data?.status;
			}
			if (this.certStatus && this.certStatus !== 'EDIT' && this.certStatus !== 'WAIT_AUDIT') {
				//展示电子签章信息
				let pro = await API_CertInfo(); // 获取证书详情信息
				if (!pro.success) return;
				this.model = pro.data;
			}
			let renewalRes = await API_CertRenewalMsg(); // 判断证书是否过期
			if (!renewalRes.success) return;
			this.renewalCertMsg = renewalRes.data;
			this.showRenewalCertBtn = this.renewalCertMsg?.msgType !== 'normal' && this.renewalCertMsg?.msgType !== 'notNormal';
			this.moreBtnShow =
				(this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer') ||
					this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin')) &&
				this.certStatus === 'ACTIVATED';
			this.showAddSealMethodBtn =
				this.certStatus === 'ACTIVATED' && this.applyInfo?.currentCompanyCertModel?.split(',').length !== 2;
			switch (this.certStatus) {
				case 'EDIT':
					this.stepsInfo.current = 0;
					break;
				case 'WAIT_AUDIT':
					this.stepsInfo.current = 1;
					break;
				case 'SUCCESS':
					this.stepsInfo.current = 2;
					break;
				case 'MAKE':
					this.stepsInfo.current = 2;
					break;
				case 'WAIT_ACTIVATE':
					this.stepsInfo.current = 2;
					break;
				case 'ACTIVATED':
					this.stepsInfo.current = 3;
					break;
				default:
					this.stepsInfo.current = 0;
			}
			// 新增签章方式平台审核中,要展示卡片
			let arrAudit = ['WAIT_AUDIT'];
			let arrJH = ['SUCCESS', 'MAKE'];
			if (this.applyInfo?.cfcaCertModelAddApply?.status && arrAudit.includes(this.applyInfo.cfcaCertModelAddApply.status)) {
				this.stepsInfo.current = 1;
			}
			if (this.applyInfo?.cfcaCertModelAddApply?.status && arrJH.includes(this.applyInfo.cfcaCertModelAddApply.status)) {
				this.stepsInfo.current = 2;
			}
			this.loading = true;
		},

		changeSigner(id) {
			this.$router.push({
				path: '/center/account/company/info/changeSigner',
				query: {
					id
				}
			});
		},
		changeSignerMobile(id) {
			this.$router.push({
				path: '/center/account/company/info/changeSignerMobile',
				query: {
					id
				}
			});
		},
		// 冻结证书
		frozen(id) {
			this.$confirm({
				centered: true,
				title: '确认冻结证书吗?',
				content: '冻结后将无法使用',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_CertFrozen({ certApplyId: id }).then(res => {
						if (!res.success) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.getInfo();
					});
				},
				onCancel() {}
			});
		},
		// 解冻证书
		unfrozen(id) {
			this.$confirm({
				centered: true,
				title: '确认解冻证书吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_CertUnfrozen({ certApplyId: id }).then(res => {
						if (!res.success) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.getInfo();
					});
				},
				onCancel() {}
			});
		},

		detail(data) {
			this.$refs.certDetail.showModal(data);
		},

		// 激活签章
		activate(record) {
			this.$refs.activateCert.showModal(record);
		},
		addSeal() {
			// 新增印模
			this.$router.push({
				path: '/center/account/company/info/addSeal',
				query: {
					certModel: this.applyInfo?.currentCompanyCertModel || this.applyInfo?.certModel,
					type: this.applyInfo?.cfcaCertChangeApply?.status === 'EDIT' ? 'edit' : 'add',
					bid: this.applyInfo?.cfcaCertChangeApply?.status === 'EDIT' ? this.applyInfo?.cfcaCertChangeApply?.bid : ''
				}
			});
		},
		renewal() {
			// 证书续期
			this.$router.push({
				path: '/center/account/company/info/certRenewal',
				query: {
					certModel: this.applyInfo?.currentCompanyCertModel || this.applyInfo?.certModel,
					bid: this.applyInfo?.cfcaCertRenewalApply?.status === 'REJECT' ? this.applyInfo?.cfcaCertChangeApply?.bid : '',
					flag: this.renewalCertMsg?.msgType
				}
			});
		},
		addCertModel() {
			// 新增签章方式
			this.$router.push({
				path: '/center/account/company/info/addCertModel',
				query: {
					certModel: this.applyInfo?.currentCompanyCertModel || this.applyInfo?.certModel,
					bid: this.applyInfo?.cfcaCertModelAddApply?.status === 'EDIT' ? this.applyInfo?.cfcaCertModelAddApply?.bid : '',
					type: this.applyInfo?.cfcaCertModelAddApply?.status === 'EDIT' ? 'edit' : 'add'
				}
			});
		},
		async checkBeforeEachApply(type, data) {
			// 判断是否有待审核的流程
			let res = await API_CheckBeforeEachApply();
			if (res.data.boo) {
				switch (type) {
					case 'addSeal': // 新增印模
						this.addSeal();
						break;
					case 'addCertModel': // 新增签章方式
						this.addCertModel();
						break;
					case 'renewal': // 证书续期
						this.renewal();
						break;
					case 'changeSigner': // 变更签章员
						this.changeSigner(data);
						break;
					case 'changeSignerMobile': // 变更签章员手机号
						this.changeSignerMobile(data);
						break;
					case 'frozen': // 变更签章员
						this.frozen(data);
						break;
					case 'unfrozen': // 变更签章员
						this.unfrozen(data);
						break;
				}
			} else {
				this.messageVisible = true;
				this.messageContent = res.data.msg;
				setTimeout(() => {
					this.messageVisible = false;
				}, 5000);
			}
		}
	}
};
</script>
<style lang="less" scoped>
.tc {
	text-align: center;
}
.no-cert {
	padding-top: 100px;
	padding-bottom: 150px;
	.button {
		margin-top: 15px;
		padding: 0 30px;
	}
}
.add {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: #383a3f;
	line-height: 22px;
	cursor: pointer;
}
.item {
	background: #ffffff;
	border: 1px solid #eef0f2;
	border-radius: 8px;
	margin-bottom: 24px;
	position: relative;
	.add-icon {
		width: 100px;
		height: 100px;
		margin-right: 20px;
	}
	.info {
		padding: 18px;
		img {
			width: 136px;
			height: 100%;
			min-height: 136px;
			margin-right: 18px;
		}
		.flex-1 {
			flex: 1;
		}
		.name {
			font-size: 14px;
			color: #383a3f;
		}
		span {
			height: 22px;
			line-height: 22px;
		}
		.status {
			padding: 0 20px;
			background: #f8f9fc;
			border-radius: 27px;
			position: relative;
		}
		.status:before {
			content: '';
			position: absolute;
			width: 8px;
			height: 8px;
			left: 8px;
			top: 7.5px;
			background: #ee7149;
			border-radius: 50%;
		}
		.active:before {
			background: #00ae9d;
		}
		.textTime {
			color: #9ba0aa;
			letter-spacing: 0;
			line-height: 20px;
			div {
				margin-top: 5px;
			}
			.red {
				margin-top: 0;
			}
		}
	}
	.button {
		line-height: 40px;
		color: @primary-color;
		span {
			display: inline-block;
			height: 100%;
			padding: 0 10px;
			cursor: pointer;
		}
	}
}
.steps-tool {
	padding-left: 10px;
	padding-right: 80px;
	margin: 20px 0;
}
.flex-1 {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.tipsBox {
	color: #666;
	margin: 10px 0 20px;
	padding: 10px 8px;
	border: 1px solid #f3b37f;
	border-radius: 5px;
	background-color: #fff5ed;
	.anticon {
		margin-right: 5px;
		color: #f9a100;
	}
	p {
		margin-left: 20px;
	}
}
.red {
	color: red;
}
.renewalBox {
	position: absolute;
	right: 15px;
	top: 10px;
	span {
		display: inline-block;
		padding: 5px;
		color: #fff;
		background: @primary-color;
		border-radius: 5px;
	}
	.anticon {
		position: absolute;
		top: -5px;
		right: -15px;
		font-size: 16px;
	}
}
.ant-dropdown-link {
	margin-right: 10px;
}
.tipText {
	margin-bottom: 5px;
}
.ant-message {
	z-index: 10000;
}
.ant-message-notice-content {
	background: #e7f0ff;
	border: 1px solid #d1e1fb;
	padding: 8px 15px;
}
.ant-message-info .anticon-close {
	color: #999;
	display: inline-block;
	margin-left: 10px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	margin-right: 0;
}
.ant-message-info .anticon-exclamation-circle {
	margin-right: 0;
}
</style>
<style lang="less">
.bgc_tooltip.ant-tooltip {
	max-width: none !important;
}
</style>
