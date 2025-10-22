<template>
	<div class="wrapper">
		<a-card
			title="新增签章方式"
			:bordered="false"
		>
		</a-card>
		<div class="info">
			<a-alert
				class="a-alert"
				type="info"
				show-icon
			>
				<template slot="message">
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col> 电子签章服务由中国金融认证中心（CFCA）提供，符合中国法律及其相关法规，电子签章与实体印章具有同等效力 </a-col>
					</a-row>
				</template>
			</a-alert>
		</div>

		<div class="info pd20">
			<p class="title">基本信息</p>
			<a-row class="row">
				<a-col
					class="flex-box"
					:span="12"
				>
					<div class="name">企业名称</div>
					<div class="value">
						{{ companyInfo.name }}
					</div>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<div class="name">法定代表人</div>
					<div class="value">
						{{ companyInfo.legalPersonName }}
					</div>
				</a-col>
			</a-row>

			<a-row class="row">
				<a-col
					class="flex-box"
					:span="12"
				>
					<div class="name">统一社会信用代码</div>
					<div class="value">
						{{ companyInfo.uscc }}
					</div>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<div class="name">注册地址</div>
					<div class="value">{{ companyInfo.area }} {{ companyInfo.address }}</div>
				</a-col>
			</a-row>
		</div>
		<a-form
			:form="form"
			v-bind="formLayout"
		>
			<a-row class="signer pd20">
				<a-col
					:span="12"
					align="left"
				>
					<p class="title">选择签章员</p>
					<a-form-item
						label="选择签章员"
						:colon="false"
					>
						<a-select
							disabled
							v-decorator="['companyUserId']"
						>
							<a-select-option
								v-for="(item, index) in companyPersonalUserList"
								:key="index"
								:value="item.id"
							>
								{{ item.personalUserName }}
							</a-select-option>
						</a-select>
					</a-form-item>

					<template>
						<a-form-item
							label="姓名"
							:colon="false"
							style="margin-top: 10px"
						>
							<a-input
								v-decorator="['signerName']"
								disabled
							/>
						</a-form-item>
						<a-form-item
							label="手机号"
							:colon="false"
						>
							<a-input
								v-decorator="['signerMobile']"
								disabled
							/>
						</a-form-item>
						<a-form-item
							label="身份证号"
							:colon="false"
						>
							<a-input
								v-decorator="['signerIdCard']"
								disabled
							/>
						</a-form-item>
					</template>
				</a-col>
			</a-row>
			<div class="recipient pd20">
				<a-row>
					<p class="title">印模类型</p>
					<a-alert
						class="a-alert special"
						type="info"
						show-icon
					>
						<template slot="message">
							<a-row>
								<a-col> 系统默认开通公章和法定代表人印章，如有管理要求，可按需开通其他印模 </a-col>
							</a-row>
						</template>
					</a-alert>
					<a-col
						:span="24"
						style="padding-left: 40px"
					>
						<a-form-item
							style="width: 100%; margin-bottom: 10px"
							:wrapper-col="{ span: 24 }"
						>
							<a-row type="flex">
								<p style="margin-right: 26px">默认开通印模</p>
								<a-checkbox-group v-model:value="checkedList">
									<a-checkbox
										value="COMPANY"
										disabled
										>企业用章</a-checkbox
									>
									<a-checkbox
										value="LEGALPERSION"
										disabled
										>法定代表人印章</a-checkbox
									>
								</a-checkbox-group>
							</a-row>
							<a-row type="flex">
								<p style="margin-right: 26px">开通其他印模</p>
								<a-checkbox
									v-model:value="contractSealBoo"
									disabled
									>合同专用章</a-checkbox
								>
							</a-row>
							<a-row style="margin-left: 110px">
								<a-checkbox-group v-model:value="businessSealChecked">
									<a-checkbox
										value="PICKUP_GOODS_SEAL"
										disabled
										>业务章</a-checkbox
									>
								</a-checkbox-group>
								<span style="color: rgba(0, 0, 0, 0.25)">{{ this.businessSealData }}</span>
							</a-row>
							<a-row style="margin-left: 110px">
								<a-checkbox-group v-model:value="authorizationSealChecked">
									<a-checkbox
										value="AUTHORIZED_PERSON_SEAL"
										disabled
										>授权代表专用章</a-checkbox
									>
								</a-checkbox-group>
								<span style="color: rgba(0, 0, 0, 0.25)">{{ this.authorizationSealData }}</span>
							</a-row>
						</a-form-item>
					</a-col>
				</a-row>
			</div>
			<div class="recipient pd20">
				<a-row
					type="flex"
					justify="space-between"
				>
					<p class="title">选择签章方式</p>
					<a-col
						:span="24"
						style="margin-left: 80px"
					>
						<a-form-item
							style="width: 100%; margin-bottom: 10px"
							:wrapper-col="{ span: 24 }"
						>
							<a-row type="flex">
								<template v-if="this.$route.query.certModel === 'TRUST'">
									<a-checkbox
										value="TRUST"
										disabled
										checked
										>证书托管</a-checkbox
									>
									<a-checkbox-group v-decorator="['certModel', { rules: [{ required: true, message: '签章方式必填' }] }]">
										<a-checkbox
											value="UKEY"
											style="margin-left: 100px"
											>Ukey</a-checkbox
										>
									</a-checkbox-group>
								</template>
								<template v-else>
									<a-checkbox-group v-decorator="['certModel', { rules: [{ required: true, message: '签章方式必填' }] }]">
										<a-checkbox value="证书托管">证书托管</a-checkbox>
									</a-checkbox-group>
									<a-checkbox
										value="UKEY"
										style="margin-left: 100px"
										disabled
										checked
										>Ukey</a-checkbox
									>
								</template>
							</a-row>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<ul class="tipsUl">
							<li>
								<span
									>证书托管：证书托管是一种电子文档，是由CFCA认证颁发的权威且公正的证书，CFCA可对线上数字信息进行加密、签名认证等处理，证书托管可在移动端进行盖章；</span
								>
							</li>
							<li>
								<span
									>UKey：UKey是一种实体的USB接口硬件设备，其中含有专门安全区保护证书私钥，若选择该种方式，需将UKey设备线下邮寄给您，Ukey无法在移动端进行盖章；</span
								>
							</li>
							<li><span>支持同时申请【证书托管+Ukey】两种签章方式；</span></li>
							<li><span>以上两种托管方式均可保证您的数据安全，但请您慎重选择，后续如需变更，需重新提交审核；</span></li>
							<li><span>电子签章开通后，如您长时间不使用，数链平台将暂停您的电子签章服务，暂停后您可以重新申请使用。</span></li>
						</ul>
					</a-col>
				</a-row>
			</div>
			<div class="recipient pd20">
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col span="12">
						<p class="title">电子证书接收人信息</p>
						<a-form-item label="联系人姓名">
							<a-input
								placeholder="请输入联系人姓名"
								v-decorator="[
									'linkName',
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
						<a-form-item label="联系人手机号">
							<a-input
								placeholder="请输入联系人手机号"
								v-decorator="[
									'linkPhone',
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
					<a-col :span="24">
						<a-col :span="12">
							<a-form-item label="邮寄地址">
								<a-cascader
									:getPopupContainer="getPopupContainer"
									:options="residences"
									placeholder="请选择城市"
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
				</a-row>
			</div>
			<div class="stuff pd20">
				<p class="title">上传相关材料</p>
				<a-row>
					<a-col
						:span="12"
						align="left"
					>
						<a-form-item
							label="数字证书申请表上传方式"
							:labelCol="{ span: 8 }"
							:wrapperCol="{ span: 13 }"
						>
							<a-radio-group
								v-decorator="['applyWay', { rules: [{ required: true, message: '数字证书申请表上传方式必填' }] }]"
								@change="handleChange"
							>
								<a-radio value="online">线上盖章</a-radio>
								<a-radio
									value="offline"
									style="margin-left: 40px"
									>线下上传</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</a-col>
				</a-row>

				<div
					v-if="form.getFieldValue('applyWay') === 'online'"
					style="margin-top: 20px"
				>
					<pdf-preview
						v-if="pdfUrl"
						:url="pdfUrl"
					></pdf-preview>
				</div>

				<div
					v-if="form.getFieldValue('applyWay') === 'offline'"
					style="margin-top: 20px"
				>
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col span="12">
							<a-form-item
								class="upload-box"
								label="上传数字证书申请表（需加盖公章）"
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
									:defaultFileList="fileListcertApplyImg"
									v-decorator="[uploadKeyList[0], { rules: [{ required: true, message: '上传数字证书申请表' }] }]"
								>
									<div>
										<a-icon type="plus" />
									</div>
								</i-upload>
								<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
								<p class="example">
									<a
										class="fl"
										@click="handlePreview('applyImgExample')"
										>示例</a
									>
									<a
										class="fr"
										@click="downloadTemplate('CERT_APPLY')"
										>下载模版</a
									>
								</p>
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<a-row>
					<a-col
						span="24"
						class="agree"
					>
						<a-form-item
							:label="false"
							:colon="false"
							:wrapper-col="{ span: 22 }"
						>
							<a-checkbox v-decorator="['agree', { rules: [{ required: false }], valuePropName: 'checked' }]">
								我方已认真阅读并同意遵守
							</a-checkbox>
							<!-- <a href="https://www.cfca.com.cn/20150811/101230094.html" target="_blank">《CFCA数字证书服务协议》</a> -->
							<a
								href="javascript:;"
								@click.stop="$refs.agreeModal.showModal('cfcaAgree')"
								>《CFCA数字证书服务协议》</a
							>
							<a
								href="javascript:;"
								@click.stop="$refs.agreeModal.showModal('certificateAgree')"
								>{{ systemConfig.signPage.digitalCertificateServiceAgreement }}</a
							>
							<a
								href="javascript:;"
								@click.stop="$refs.agreeModal.showModal('declarationAgree')"
								>《声明函》</a
							>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row
					type="flex"
					justify="center"
					style="margin-top: 20px"
				>
					<a-button @click="$router.go(-1)"> 返回上一步 </a-button>
					<a-button
						v-if="!form.getFieldValue('applyWay') || form.getFieldValue('applyWay') === 'offline'"
						type="primary"
						style="margin-left: 20px"
						:disabled="!form.getFieldValue('agree')"
						@click="save"
						>提交</a-button
					>
					<a-button
						v-if="form.getFieldValue('applyWay') === 'online'"
						type="primary"
						style="margin-left: 20px"
						:disabled="!form.getFieldValue('agree')"
						@click="seal"
						>盖章并提交</a-button
					>
				</a-row>
			</div>
		</a-form>
		<image-viewer ref="imageViewer" />
		<AgreeModal ref="agreeModal"></AgreeModal>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>
<script lang="jsx">
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_COMPANYDETAIL,
	API_COMPANYUSERLIST,
	API_CertApplyInfo,
	API_DownloadCertApplyTemplate,
	API_GetAddCertModelPdf,
	API_CertModelAddApplySubmit,
	API_CertModelAddAutoSignature,
	API_CertModelAddGetToSigList
} from '@/v2/api/account';
import { API_GetCompanyCertModel } from '@/v2/api/sign';
import { area } from '@sub/utils/area.js';
import { beforeUpload } from '@/v2/utils/factory';
import { mapMutations, mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import AgreeModal from '@/v2/components/modal/index.vue';
import iUpload from '@/v2/components/upload';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { getPopupContainer } from '@/v2/utils/factory';
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import systemConfig from '@/v2/config/common';

// 关联企业详情
export default {
	name: 'AddCertModel',

	components: {
		AgreeModal,
		iUpload,
		imageViewer,
		PdfPreview,
		SignModal
	},
	data() {
		return {
			applyImgExample: systemConfig.accountInfo.applyImgExample,
			companyInfo: {},
			operator: {},
			previewImg: systemConfig.accountInfo.certPreviewImage,
			companyPersonalUserList: [],
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			hasChangeOperatorSelectName: false,
			uploadKeyList: ['certApplyImg'],
			residences: area,
			form: this.$form.createForm(this),
			action: API_UPLOAD,
			maxLength: 200,
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 15
				}
			},
			loading: false,
			isRequire: true, //认证材料是否必须，校验
			fileListcertApplyImg: [],
			getPopupContainer,
			businessSealTypeColumns: [
				// 业务章类型数据表头
				{ title: '业务章场景', dataIndex: 'scene', key: 'scene' },
				{ title: '业务章名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } }
			],
			businessSealForm: this.$form.createForm(this), // 业务章名称数据form表单
			validateData: [], // 业务章名称数据校验
			checkedList: ['COMPANY', 'LEGALPERSION'],
			businessSealChecked: [], // 业务章是否被选中
			passFlag: true,
			certApplyInfo: {}, // 电子签章申请证书信息
			authorizationSealChecked: [], // 授权代表章是否被选中
			businessSealData: '',
			authorizationSealData: '',
			pdfUrl: '',
			contractSealBoo: false, // 合同专用章是否被选中
			systemConfig
		};
	},
	created() {
		// 设置上传相关字段及方法
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});
		this.getCompanyInfo();
		this.getCompanyPersonalUserList();
		this.getCertApplyInfo();
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_COMPANYRELEVANCE: 'user/VUEX_MU_COMPANYRELEVANCE'
		}),
		getCertApplyInfo() {
			// 审核驳回后重新申请回显数据
			API_CertApplyInfo().then(res => {
				if (res.data) {
					this.certApplyInfo = res.data;
					// 签章类型数据回显
					this.contractSealBoo = this.certApplyInfo.contractSealBoo || false;
					this.businessSealChecked =
						this.certApplyInfo.authorizedRepresentativeSealList && this.certApplyInfo.businessSealList.length > 0
							? ['PICKUP_GOODS_SEAL']
							: [];
					this.authorizationSealChecked =
						this.certApplyInfo.authorizedRepresentativeSealList && this.certApplyInfo.authorizedRepresentativeSealList.length > 0
							? ['AUTHORIZED_PERSON_SEAL']
							: [];
					if (this.certApplyInfo.businessSealList.length) {
						this.businessSealData = '(';
						this.certApplyInfo.businessSealList.forEach((element, index) => {
							if (index === this.certApplyInfo.businessSealList.length - 1) {
								this.businessSealData = this.businessSealData + element.name + ')';
							} else {
								if (element) {
									this.businessSealData = this.businessSealData + element.name + '，';
								}
							}
						});
					}
					if (this.certApplyInfo.authorizedRepresentativeSealList.length) {
						this.authorizationSealData = '(';
						this.certApplyInfo.authorizedRepresentativeSealList.forEach((element, index) => {
							if (index === this.certApplyInfo.authorizedRepresentativeSealList.length - 1) {
								this.authorizationSealData = this.authorizationSealData + element.name + ')';
							} else {
								if (element) {
									this.authorizationSealData = this.authorizationSealData + element.name + '，';
								}
							}
						});
					}
					this.$nextTick(() => {
						setTimeout(() => {
							this.form.setFieldsValue({
								companyUserId: this.certApplyInfo.signerCompanyUserId,
								linkName: this.certApplyInfo.linkman,
								linkPhone: this.certApplyInfo.linkmanMobile,
								signerName: this.certApplyInfo.signerName,
								signerMobile: this.certApplyInfo.signerMobile,
								signerIdCard: this.certApplyInfo.signerIdCard
							});
						}, 500);
						setTimeout(() => {
							this.form.setFieldsValue({
								linkmanArea: this.certApplyInfo.linkmanArea?.split('/'),
								linkmanAddress: this.certApplyInfo.linkmanAddress
							});
						}, 1000);
						if (this.certApplyInfo.linkmanArea && this.certApplyInfo.linkmanAddress) {
							this.getPdf();
						}
					});
				}
			});
		},
		getCompanyInfo() {
			API_COMPANYDETAIL().then(res => {
				this.companyInfo = res.data;
			});
		},

		getCompanyPersonalUserList() {
			API_COMPANYUSERLIST().then(res => {
				if (res.success) {
					this.companyPersonalUserList = res.data.map(item => {
						const { address, area, idCard, mobile, name } = item.personal;
						return {
							address,
							area,
							id: item.id,
							personalUserIdcard: idCard,
							personalUserMobile: mobile,
							personalUserName: name
						};
					});

					if (this.$route.query.type === 'edit') {
						this.companyPersonalUserList.forEach(item => {
							if (this.certApplyInfo.signerCompanyUserId === item.id) {
								this.operator = item;
							}
						});
					}
				}
			});
		},

		beforeUpload(file) {
			return beforeUpload(file);
		},

		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},

		downloadTemplate(type) {
			const fields = {
				CERT_APPLY: ['companyUserId', 'linkName', 'linkPhone', 'linkmanArea', 'linkmanAddress', 'certModel']
			};

			const title = {
				CERT_APPLY: '数字证书申请表'
			};
			this.form.validateFieldsAndScroll(fields[type], (err, values) => {
				if (!err) {
					if (type === 'CERT_APPLY') {
						values.certModel = values.certModel.join(',');
						values.linkmanArea = values.linkmanArea.join('/');
						values.contractSealBoo = this.contractSealBoo;
						(values.applyContent = 'CERT_MODEL_ADD_APPLY'),
							API_DownloadCertApplyTemplate({
								...values
							}).then(res => {
								comDownload(res, undefined, `${title[type]}.pdf`);
							});
					}
				}
			});
		},

		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let data = {
						certModel: 'TRUST,UKEY', //签章方式（TRUST-托管；UKEY-ukey）
						signerCompanyUserId: values.companyUserId, //签章员用户ID
						signerName: values.signerName, //签章员姓名
						signerMobile: values.signerMobile, //签章员电话
						signerIdCard: values.signerIdCard, //签章员证件号码
						linkman: values.linkName, //联系人姓名
						linkmanMobile: values.linkPhone, //联系人手机号
						linkmanArea: values.linkmanArea.join('/'), //邮寄地址-省市区
						linkmanAddress: values.linkmanAddress, //邮寄地址-详细地址
						certApplyImg: values.applyWay === 'online' ? this.pdfUrl : values.certApplyImg, //机构证书申请表
						applyWay: values.applyWay,
						contractSealBoo: this.contractSealBoo //是否选中合同专用章
					};
					if (this.$route.query.type == 'edit') {
						data.certModelAddApplyBid = this.$route.query.bid;
					}
					API_CertModelAddApplySubmit(data).then(res => {
						if (res.success) {
							this.$success({
								centered: true,
								title: '电子签章开通申请已提交，等待审核中',
								okText: '确定',
								icon: () => {
									return (
										<a-icon
											type="check-circle"
											theme="filled"
										/>
									);
								},
								onOk: () => {
									this.$router.push('/center/account/company/info');
								}
							});
						} else {
							this.$message.error(res.error.message || '提交失败');
						}
					});
				}
			});
		},
		getPdf(area, address) {
			// 新增证书签章模式-生成证书申请表
			API_GetAddCertModelPdf({
				linkmanArea: area || this.certApplyInfo.linkmanArea,
				linkmanAddress: address || this.certApplyInfo.linkmanAddress
			}).then(res => {
				if (res.success) {
					this.pdfUrl = res.data.certApplyImg;
				}
			});
		},
		handleChange(e) {
			// 上传方式修改
			if (e.target.value === 'online') {
				this.form.validateFieldsAndScroll(['linkmanArea', 'linkmanAddress'], (err, values) => {
					if (!err) {
						this.getPdf(values.linkmanArea?.join('/'), values.linkmanAddress);
					} else {
						this.$message.warning('选择线上盖章前，请先填写邮寄地址');
						this.$nextTick(() => {
							this.form.setFieldsValue({ applyWay: '' });
						});
					}
				});
			}
		},
		seal() {
			API_GetCompanyCertModel().then(res => {
				if (res.success && res.data.length) {
					if (res.data.includes('TRUST')) {
						this.$refs.signModal.showModal(this.autoSignature);
					} else {
						const that = this;
						const isOrderModule = true;
						sign.call(that, that.step1, that.step2, '', isOrderModule);
					}
				}
			});
		},
		// 盖章
		step1(obj) {
			return API_CertModelAddGetToSigList({
				certApplyImg: this.pdfUrl,
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
			API_CertModelAddAutoSignature({
				certApplyImg: this.pdfUrl,
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
	.ant-card-head {
		border-bottom: none;
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
	.a-alert {
		width: 100%;
	}
	.a-alert.special {
		width: 650px;
		margin-left: 40px;
		margin-bottom: 5px;
	}
}
.tc {
	text-align: center;
}
.pd20 {
	padding: 20px;
}
.title {
	font-size: 12px;
	color: #383a3f;
	text-align: left;
	line-height: 32px;
	margin-bottom: 15px;
	font-weight: 600;
}

.wrapper {
	background-color: #f4f5f8;
	margin: -10px -30px;
}
.noauth {
	font-size: 12px;
	color: #f5222d;
	line-height: 22px;
}

.info {
	background: #ffffff;
	margin-top: 8px;
	.row {
		padding-bottom: 5px;
	}
	.flex-box {
		display: flex;
		> div {
			padding-right: 10px;
			font-size: 12px;
			color: #6b6f76;
			line-height: 18px;
		}
		.name {
			width: 130px;
		}
		.value {
			flex: 1;
			color: #383a3f;
		}
	}
}
.signer {
	background: #ffffff;
}
.info,
.recipient,
.signer,
.stuff {
	background: #ffffff;
	margin-bottom: 8px;
}

.agree {
	margin-top: 10px;
	::v-deep {
		.ant-checkbox + span {
			font-size: 12px;
			color: #383a3f;
			letter-spacing: 0;
			line-height: 20px;
		}
	}
	a {
		font-size: 12px;
		color: @primary-color;
	}
}

.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
::v-deep .ant-alert-info .ant-alert-icon {
	color: #0053db;
}

.tipsUl {
	border: 1px solid #c5c4c4;
	background: #f7f8fa;
	padding: 20px;
	color: #666;
	li {
		list-style: disc;
		margin-left: 20px;
		line-height: 26px;
	}
}
.businessSealForm {
	::v-deep.ant-form-item {
		margin-bottom: 0;
	}
	::v-deep.ant-table-tbody > tr > td {
		padding: 8px 16px;
	}
}
::v-deep.ant-checkbox-group {
	display: flex;
	align-items: center;
	height: 40px;
}
</style>
