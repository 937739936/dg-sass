<template>
	<div class="wrapper">
		<a-card
			title="签章续期"
			:bordered="false"
		>
			<a-form
				:form="form"
				v-bind="formLayout"
			>
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col span="24">
						<a-form-item label="证书有效期">
							<p
								v-for="(item, index) in certInfo.certList"
								:key="index"
							>
								{{ item.certToSealTypeText }}有效期：{{ item.startTime }}～{{ item.slEndTime }}
							</p>
						</a-form-item>
					</a-col>
					<a-col span="24">
						<a-form-item label="续期周期">5年</a-form-item>
					</a-col>
					<a-col span="24">
						<a-form-item label="说明"
							>电子签章开通后，如您长时间不使用，数链平台将暂停您的电子签章服务，暂停后您可以重新申请使用。</a-form-item
						>
					</a-col>
					<template v-if="certInfo.ukeyRenewalBoo">
						<p class="title">电子证书接收人信息</p>
						<a-col span="24">
							<a-row>
								<a-col span="12">
									<a-form-item
										label="联系人姓名"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-input
											placeholder="请输入联系人姓名"
											:maxLength="20"
											v-decorator="[
												'linkman',
												{
													rules: [
														{
															required: true,
															message: '联系人姓名必填',
															whitespace: true
														}
													]
												}
											]"
										/>
									</a-form-item>
									<a-form-item
										label="联系人手机号"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 15 }"
									>
										<a-input
											placeholder="请输入联系人手机号"
											v-decorator="[
												'linkmanMobile',
												{
													rules: [
														{
															required: true,
															message: '联系人手机号必填',
															whitespace: true
														},
														{
															pattern: /^1[3456789]\d{9}$/,
															message: '手机号格式不正确'
														}
													]
												}
											]"
										/>
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
						<a-col span="24">
							<a-col :span="12">
								<a-form-item
									label="邮寄地址"
									:label-col="{ span: 6 }"
									:wrapper-col="{ span: 15 }"
								>
									<a-cascader
										:getPopupContainer="getPopupContainer"
										:options="residences"
										placeholder="请选择城市"
										:maxLength="100"
										v-decorator="[
											'linkmanArea',
											{
												rules: [
													{
														type: 'array',
														required: true,
														message: '城市必填'
													}
												]
											}
										]"
									/>
								</a-form-item>
							</a-col>
							<a-col
								:span="12"
								style="position: relative; left: -25px"
							>
								<a-form-item
									required
									label=""
								>
									<a-input
										name="userName"
										placeholder="请输入详细地址"
										:maxLength="100"
										v-decorator="[
											'linkmanAddress',
											{
												rules: [
													{
														required: true,
														message: '详细地址必填',
														whitespace: true
													}
												]
											}
										]"
									/>
								</a-form-item>
							</a-col>
						</a-col>
					</template>
					<a-col
						span="24"
						v-if="!dqFlag"
					>
						<a-form-item label="续期申请上传方式">
							<a-radio-group v-decorator="['renewalApplyWay', { initialValue: 'online' }]">
								<a-radio value="online">线上盖章</a-radio>
								<a-radio
									value="offline"
									style="margin-left: 100px"
									>线下上传</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<a-col
						v-if="dqFlag || (!dqFlag && form.getFieldValue('renewalApplyWay') === 'offline')"
						span="24"
						style="padding-left: 30px"
					>
						<a-form-item
							class="upload-box"
							label="上传数字证书续期（换发）申请书（需加盖公章）"
							:colon="false"
							:label-col="{ span: 24 }"
							:wrapper-col="{ span: 24 }"
						>
							<i-upload
								:action="action"
								:accept="accept"
								list-type="picture-card"
								:showDesc="false"
								:showUploadList="true"
								:limit="true"
								:defaultFileList="fileListrenewalImg"
								v-decorator="['renewalImg', { rules: [{ required: true, message: '上传数字证书续期（换发）申请书' }] }]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>

							<p class="example">
								<a
									class="fl"
									@click="handlePreview('renewalImgExample')"
									>示例</a
								>
								<a
									class="fr"
									@click="downloadTemplate"
									>下载模版</a
								>
							</p>
						</a-form-item>
					</a-col>
					<a-col
						span="24"
						class="tipsText"
					>
						<p v-if="form.getFieldValue('renewalApplyWay') === 'offline' || dqFlag">
							1、支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M
						</p>
						<p>
							<span v-if="form.getFieldValue('renewalApplyWay') === 'offline' || dqFlag">2、</span>
							<span v-else>1、</span>
							数字证书到期后，您可以申请证书续期，也可以更换签章方式，两种方式均需经过数链平台审核
						</p>
						<p v-if="certInfo.ukeyRenewalBoo">
							<span v-if="form.getFieldValue('renewalApplyWay') === 'offline' || dqFlag">3、</span>
							<span v-else>2、</span>
							申请新的ukey后，您需要将原来的实体ukey寄回，收件地址：河南省郑州市金水区中华保险大厦21楼数链科技{{
								systemConfig.name
							}}；收件人：数科认证部；联系电话：13676976042
						</p>
					</a-col>
				</a-row>
				<div
					v-if="!dqFlag && form.getFieldValue('renewalApplyWay') === 'online'"
					style="margin-top: 20px"
				>
					<pdf-preview
						v-if="pdfUrl"
						:url="pdfUrl"
					></pdf-preview>
				</div>
				<a-col
					span="24"
					class="agree"
				>
					<a-form-item
						:label="false"
						:colon="false"
						:wrapper-col="{ span: 22 }"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-button
								v-if="!dqFlag && form.getFieldValue('renewalApplyWay') === 'online'"
								type="primary"
								@click="sign()"
								style="margin-right: 20px"
							>
								盖章并提交
							</a-button>
							<a-button
								type="primary"
								ghost
								@click="
									() => {
										this.$router.go(-1);
									}
								"
							>
								返回
							</a-button>
							<a-button
								v-if="dqFlag || (!dqFlag && form.getFieldValue('renewalApplyWay') === 'offline')"
								type="primary"
								@click="save"
								style="margin-left: 20px"
							>
								提交
							</a-button>
						</a-row>
					</a-form-item>
				</a-col>
			</a-form>
		</a-card>
		<image-viewer ref="imageViewer" />
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_DownloadCertRenewal,
	API_CertRenewalApplySubmit,
	API_CertRenewalAutoSignature,
	API_CertRenewalGetToSignList,
	API_CertInfo,
	API_GetCertRenewalPdf,
	API_CertApplyInfo
} from '@/v2/api/account';
import comDownload from '@sub/utils/comDownload.js';
import { filePreview } from '@/v2/utils/file';
import iUpload from '@/v2/components/upload';
import imageViewer from '@/v2/components/imageViewer.vue';
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import { getPopupContainer } from '@/v2/utils/factory';
import { area } from '@sub/utils/area.js';
import systemConfig from '@/v2/config/common';

export default {
	name: 'ConfigSignature',
	data() {
		return {
			getPopupContainer,
			renewalImgExample: systemConfig.accountInfo.renewalImgExample,
			fileListrenewalImg: [],
			fileListauthorizedLetterImg: [],
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: {
					span: 3
				},
				wrapperCol: {
					span: 21
				}
			},
			action: API_UPLOAD,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			businessSealData: [],
			authorizationSealData: [],
			certInfo: {},
			pdfUrl: '',
			dqFlag: this.$route.query.flag === 'ydq',
			residences: area,
			applyInfo: '',
			systemConfig
		};
	},
	components: {
		iUpload,
		imageViewer,
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	created() {
		this.getCertList();
		this.getPdf();
	},
	watch: {
		pdfUrl: function (data) {
			this.pdfUrl = data;
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		async getInfo() {
			this.loading = false;
			let res = await API_CertApplyInfo(); // 获取证书申请信息
			if (!res.success) return;
			this.applyInfo = res.data;
			let receiverInfo = {};
			receiverInfo = this.applyInfo.cfcaCertRenewalApply || this.applyInfo;
			this.$nextTick(() => {
				setTimeout(() => {
					this.form.setFieldsValue({
						linkman: receiverInfo.linkman,
						linkmanMobile: receiverInfo.linkmanMobile,
						linkmanArea: receiverInfo.linkmanArea.split('/'),
						linkmanAddress: receiverInfo.linkmanAddress
					});
				}, 500);
			});
		},
		getPdf() {
			API_GetCertRenewalPdf().then(res => {
				if (res.success) {
					this.pdfUrl = res.data.renewalImg;
				}
			});
		},
		getCertList() {
			API_CertInfo().then(res => {
				if (res.success) {
					this.certInfo = res.data;
					if (this.certInfo?.ukeyRenewalBoo) {
						this.getInfo();
					}
				}
			});
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},
		downloadTemplate() {
			API_DownloadCertRenewal().then(res => {
				comDownload(res, undefined, '数字证书续期（换发）申请书.pdf');
			});
		},
		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					if (values.renewalApplyWay === 'online') {
						values.renewalImg = this.pdfUrl;
					}
					if (this.dqFlag) {
						values.renewalApplyWay = 'offline';
					}
					if (this.$route.query.bid) {
						values.bid = this.$route.query.bid;
					}
					if (values.linkmanArea) {
						values.linkmanArea = values.linkmanArea.join('/');
					}
					API_CertRenewalApplySubmit(values).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success({
									content: '操作成功，平台审核中',
									duration: 5
								});
								this.$router.push('/center/account/company/info');
							}
						} else {
							this.$message.error(res.error.message || '操作失败');
						}
					});
				}
			});
		},
		sign() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 确认订单
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, '', isOrderModule);
				// 盖章完成刷新页面
			}
		},
		// 盖章
		step1(obj) {
			return API_CertRenewalGetToSignList({
				renewalImg: this.pdfUrl,
				companyCreditCode: this.VUEX_ST_COMPANYSUER.companyUscc,
				cert: obj.cert
			});
		},
		// 修改状态
		step2() {
			this.save();
		},
		// 自动盖章
		autoSignature() {
			this.signLoading = true;
			API_CertRenewalAutoSignature({
				renewalImg: this.pdfUrl,
				companyCreditCode: this.VUEX_ST_COMPANYSUER.companyUscc
			})
				.then(res => {
					if (res.success) {
						this.step2();
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.ant-checkbox-group {
		width: 100%;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-card-head-title:before {
		position: absolute;
		content: '';
		display: block;
		width: 2px;
		height: 15px;
		background: @primary-color;
		top: 21px;
		left: 0;
	}
}
.tc {
	text-align: center;
}
.pd20 {
	padding: 20px;
}
.title {
	font-size: 14px;
	font-weight: bold;
	color: #383a3f;
	text-align: left;
	line-height: 32px;
	margin-bottom: 15px;
	font-weight: 600;
}

.wrapper {
	background-color: #f4f5f8;
	margin: -10px -20px;
}
.agree {
	margin-top: 20px;
}
.tipsText {
	width: 886px;
	line-height: 24px;
	padding-left: 40px;
	color: #9ba0aa;
}
.redItem {
	::v-deep.ant-form-item-label {
		label {
			color: #f24e4d;
		}
	}
}
</style>
