<template>
	<div class="wrapper">
		<a-card
			title="申请开通电子签章服务"
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
						<a-col>
							电子签章服务由中国金融认证中心（CFCA）提供，符合中国法律及其相关法规，电子签章与实体印章具有同等效力
						</a-col>
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
							:getPopupContainer="getPopupContainer"
							showSearch
							:notFoundContent="companyPersonalUserList.length <= 0 ? '暂无数据' : '加载中...'"
							:filterOption="false"
							:defaultActiveFirstOption="false"
							placeholder="请选择签章员"
							@change="operatorChange"
							v-decorator="[
								'companyUserId',
								{
									rules: [{ required: true, message: `签章员必填` }]
								}
							]"
						>
							<a-select-option
								v-for="(item, index) in companyPersonalUserList"
								:key="index"
								:value="item.id"
							>
								{{ item.personalUserName }}
							</a-select-option>
						</a-select>
						<template v-if="hasChangeOperatorSelectName == 'noauth'">
							<p class="noauth">该用户未完成个人实名认证，无法成为签章员</p>
						</template>
					</a-form-item>

					<template v-if="hasChangeOperatorSelectName == 'hasname'">
						<a-form-item
							label="姓名"
							:colon="false"
							style="margin-top: 10px"
						>
							<a-input
								v-decorator="['operatorName']"
								disabled
							/>
						</a-form-item>
						<a-form-item
							label="手机号"
							:colon="false"
						>
							<a-input
								v-decorator="['operatorPhone']"
								disabled
							/>
						</a-form-item>
						<a-form-item
							label="身份证号"
							:colon="false"
						>
							<a-input
								v-decorator="['idcard']"
								disabled
							/>
						</a-form-item>
					</template>
				</a-col>
			</a-row>
			<div class="recipient pd20">
				<a-row
					type="flex"
					justify="space-between"
				>
					<p class="title">电子证书收件人信息</p>
					<a-col span="24">
						<a-row>
							<a-col :span="12">
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
							</a-col>
							<a-col :span="12">
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
						</a-row>
						<a-row>
							<a-col :span="24">
								<a-col :span="12">
									<a-form-item label="邮寄地址">
										<a-cascader
											:getPopupContainer="getPopupContainer"
											:options="residences"
											placeholder="请选择城市"
											v-decorator="[
												'area',
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
												'address',
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
							<a-row>
								<a-checkbox-group v-decorator="['certModel', { rules: [{ required: true, message: '签章方式必填' }] }]">
									<a-checkbox value="TRUST"> 证书托管 </a-checkbox>
									<a-checkbox
										value="UKEY"
										style="margin-left: 100px"
									>
										Ukey
									</a-checkbox>
								</a-checkbox-group>
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
				<a-row>
					<p class="title">印模类型</p>
					<a-alert
						class="a-alert special"
						type="info"
						show-icon
					>
						<template slot="message">
							<a-row>
								<a-col>
									系统默认开通公章和法定代表人印章，如有管理要求，可按需开通其他印模
								</a-col>
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
								<p style="margin-right: 26px;">默认开通印模</p>
								<a-checkbox-group v-model:value="checkedList">
									<a-checkbox
										value="COMPANY"
										disabled
										>公章</a-checkbox
									>
									<a-checkbox
										value="LEGALPERSION"
										disabled
										>法定代表人印章</a-checkbox
									>
								</a-checkbox-group>
							</a-row>
							<a-row type="flex">
								<p style="margin-right: 26px;">开通其他印模</p>
								<a-checkbox v-model:value="contractSealBoo">合同专用章</a-checkbox>
							</a-row>
							<a-row style="margin-left: 110px">
								<a-checkbox-group v-model:value="businessSealChecked">
									<a-checkbox value="PICKUP_GOODS_SEAL">业务专用章</a-checkbox>
								</a-checkbox-group>
								<BusinessSeal
									ref="BusinessSeal"
									:selectedData="businessSealData"
									:editable="true"
								>
								</BusinessSeal>
							</a-row>
							<a-row style="margin-left: 110px">
								<a-checkbox-group v-model:value="authorizationSealChecked">
									<a-checkbox value="AUTHORIZED_PERSON_SEAL">授权代表专用章</a-checkbox>
								</a-checkbox-group>
								<AuthorizationSeal
									:selectedData="authorizationSealData"
									:authorizationSealData="authorizationSealData"
									ref="AuthorizationSeal"
									:editable="true"
								>
								</AuthorizationSeal>
							</a-row>
						</a-form-item>
					</a-col>
				</a-row>
			</div>

			<div class="stuff pd20">
				<p class="title">上传相关材料</p>
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
								v-decorator="[uploadKeyList[1], { rules: [{ required: true, message: '上传数字证书申请表' }] }]"
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

					<a-col span="12">
						<a-form-item
							class="upload-box"
							label="上传数字证书申请和使用授权书（需加盖公章）"
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
								:defaultFileList="fileListlicenseImg"
								v-decorator="[uploadKeyList[2], { rules: [{ required: true, message: '上传数字证书申请和使用授权书' }] }]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a
									class="fl"
									@click="handlePreview('certImgExample')"
									>示例</a
								>
								<a
									class="fr"
									@click="downloadTemplate('AUTHORIZATION')"
									>下载模版</a
								>
							</p>
						</a-form-item>
					</a-col>

					<a-col span="12">
						<a-form-item
							class="upload-box"
							label="上传数字证书操作员身份证（需加盖公章）"
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
								:defaultFileList="fileListoperatorIdcardImg"
								v-decorator="[uploadKeyList[3], { rules: [{ required: true, message: '上传数字证书操作员身份证' }] }]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a @click="handlePreview('idcardImgExample')">示例</a>
							</p>
						</a-form-item>
					</a-col>

					<a-col
						span="12"
						v-if="authorizationSealChecked.length > 0"
					>
						<a-form-item
							class="upload-box"
							label="上传授权代表说明函（需加盖公章）"
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
								:defaultFileList="fileListauthorizedLetterImg"
								v-decorator="[uploadKeyList[4], { rules: [{ required: true, message: '上传授权代表说明函' }] }]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a
									class="fl"
									@click="handlePreview('authorizedLetterImgExample')"
									>示例</a
								>
								<a
									class="fr"
									@click="downloadTemplate('AUTHORIZATIONLETTER')"
									>下载模版</a
								>
							</p>
						</a-form-item>
					</a-col>

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
				>
					<a-button @click="$router.go(-1)"> 返回上一步 </a-button>
					<a-button
						type="primary"
						style="margin-left: 20px"
						:disabled="!form.getFieldValue('agree')"
						@click="save"
						>提交</a-button
					>
				</a-row>
			</div>
		</a-form>
		<image-viewer ref="imageViewer" />
		<AgreeModal ref="agreeModal"></AgreeModal>
	</div>
</template>
<script lang="jsx">
import { API_UPLOAD } from '@/v2/center/person/api';

import {
	API_COMPANYDETAIL,
	API_COMPANYUSERLIST,
	API_CertApply,
	API_CertApplyInfo,
	API_DownloadCertApplyTemplate,
	API_DownloadAuthorizationTemplate,
	API_DownloadAuthorizedLetterTemplate
} from '@/v2/api/account';
import { area } from '@sub/utils/area.js';
import { beforeUpload } from '@/v2/utils/factory';
import { mapMutations, mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import AgreeModal from '@/v2/components/modal/index.vue';
import iUpload from '@/v2/components/upload';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { getPopupContainer } from '@/v2/utils/factory';
import systemConfig from '@/v2/config/common';
import BusinessSeal from '../../components/BusinessSeal.vue';
import AuthorizationSeal from '../../components/AuthorizationSeal.vue';

// 关联企业详情
export default {
	name: 'OpenSignature',
	components: {
		AgreeModal,
		iUpload,
		imageViewer,
		AuthorizationSeal,
		BusinessSeal
	},
	data() {
		return {
			shengmingImgExample: systemConfig.accountInfo.shengmingImgExample,
			applyImgExample: systemConfig.accountInfo.applyImgExample,
			certImgExample: systemConfig.accountInfo.certPreviewImage,
			idcardImgExample: systemConfig.accountInfo.idcardImgExample,
			authorizedLetterImgExample: systemConfig.accountInfo.authorizedLetterImgExample,
			companyInfo: {},
			operator: {},
			previewImg: systemConfig.accountInfo.certPreviewImage,
			companyPersonalUserList: [],
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			hasChangeOperatorSelectName: false,
			uploadKeyList: ['shengmingImg', 'certApplyImg', 'licenseImg', 'operatorIdCardImg', 'authorizedLetterImg'],
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

			defaultBizLicenseImg: null,
			defaultLegalPersonCardImg: null,
			defaultAuthLicenseImg: null,
			isRequire: true, //认证材料是否必须，校验
			fileListcertApplyImg: [],
			fileListlicenseImg: [],
			fileListoperatorIdcardImg: [],
			fileListauthorizedLetterImg: [],
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
			businessSealData: [],
			authorizationSealData: [],
			contractSealBoo: false, // 合同专用章是否被选中
			systemConfig
		};
	},
	watch: {
		businessSealChecked: function (data) {
			if (data.length > 0) {
				this.businessSealChecked = data;
				if (this.businessSealData.length === 0) {
					this.$refs.BusinessSeal.addRow();
				}
			} else {
				this.businessSealData = [];
			}
		},
		authorizationSealChecked: function (data) {
			if (data.length > 0) {
				this.authorizationSealChecked = data;
				if (this.authorizationSealData.length === 0) {
					this.$refs.AuthorizationSeal.addRow();
				}
			} else {
				this.authorizationSealData = [];
			}
		}
	},
	created() {
		// 设置上传相关字段及方法
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});

		this.getCompanyInfo();
		this.getCompanyPersonalUserList();

		if (this.$route.query.type === 'edit') {
			this.getCertApplyInfo();
		}
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
						this.certApplyInfo.businessSealList && this.certApplyInfo.businessSealList.length > 0 ? ['PICKUP_GOODS_SEAL'] : [];
					this.authorizationSealChecked =
						this.certApplyInfo.authorizedRepresentativeSealList && this.certApplyInfo.authorizedRepresentativeSealList.length > 0
							? ['AUTHORIZED_PERSON_SEAL']
							: [];
					this.businessSealData = this.certApplyInfo.businessSealList;
					this.authorizationSealData = this.certApplyInfo.authorizedRepresentativeSealList;
					this.$nextTick(() => {
						setTimeout(() => {
							this.form.setFieldsValue({
								companyUserId: this.certApplyInfo.signerCompanyUserId,
								linkName: this.certApplyInfo.linkman,
								linkPhone: this.certApplyInfo.linkmanMobile,
								certModel: this.certApplyInfo.certModel.split(','),
								certApplyImg: this.certApplyInfo.certApplyImg,
								licenseImg: this.certApplyInfo.licenseImg,
								operatorIdCardImg: this.certApplyInfo.operatorIdCardImg,
								authorizedLetterImg: this.certApplyInfo.authorizedLetterImg
							});
							this.operatorChange(this.certApplyInfo.signerCompanyUserId);
						}, 500);

						setTimeout(() => {
							this.form.setFieldsValue({
								area: this.certApplyInfo.linkmanArea.split('/'),
								address: this.certApplyInfo.linkmanAddress
							});
						}, 1000);
					});
					if (this.certApplyInfo.certApplyImg) {
						this.fileListcertApplyImg = [
							{
								uid: '0',
								name: this.certApplyInfo.certApplyImg.split('/')[this.certApplyInfo.certApplyImg.split('/').length - 1],
								url: this.certApplyInfo.certApplyImg,
								status: 'done'
							}
						];
					}
					if (this.certApplyInfo.licenseImg) {
						this.fileListlicenseImg = [
							{
								uid: '0',
								name: this.certApplyInfo.licenseImg.split('/')[this.certApplyInfo.licenseImg.split('/').length - 1],
								url: this.certApplyInfo.licenseImg,
								status: 'done'
							}
						];
					}
					if (this.certApplyInfo.operatorIdCardImg) {
						this.fileListoperatorIdcardImg = [
							{
								uid: '0',
								name: this.certApplyInfo.operatorIdCardImg.split('/')[this.certApplyInfo.operatorIdCardImg.split('/').length - 1],
								url: this.certApplyInfo.operatorIdCardImg,
								status: 'done'
							}
						];
					}
					if (this.certApplyInfo.authorizedLetterImg) {
						this.fileListauthorizedLetterImg = [
							{
								uid: '0',
								name: this.certApplyInfo.authorizedLetterImg.split('/')[
									this.certApplyInfo.authorizedLetterImg.split('/').length - 1
								],
								url: this.certApplyInfo.authorizedLetterImg,
								status: 'done'
							}
						];
					}
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
		// 实名认证判断
		operatorChange(value) {
			this.form.resetFields(['linkName', 'linkPhone', 'address', 'area']);
			this.operator = {};
			this.hasChangeOperatorSelectName = 'hasname';
			this.companyPersonalUserList.forEach(item => {
				if (value === item.id) {
					this.operator = item;
				}
			});

			const { area, address, personalUserMobile, personalUserName, personalUserIdcard } = this.operator;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					operatorName: personalUserName,
					operatorPhone: personalUserMobile,
					idcard: personalUserIdcard,
					linkName: personalUserName,
					linkPhone: personalUserMobile,
					address: address ? address : '',
					area: area ? area.split('/') : []
				});
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
				CERT_APPLY: ['companyUserId', 'linkName', 'linkPhone', 'area', 'address', 'certModel'],
				AUTHORIZATION: ['companyUserId', 'area', 'address'],
				AUTHORIZATIONLETTER: ['companyUserId', 'linkName', 'linkPhone', 'area', 'address', 'certModel']
			};

			const title = {
				CERT_APPLY: '数字证书申请表',
				AUTHORIZATION: '数字证书申请授权书',
				AUTHORIZATIONLETTER: '授权代表说明函'
			};
			this.form.validateFieldsAndScroll(fields[type], (err, values) => {
				if (!err) {
					if (this.businessSealChecked.includes('PICKUP_GOODS_SEAL')) {
						if (!this.$refs.BusinessSeal.save()) {
							return;
						}
					}
					if (this.authorizationSealChecked.includes('AUTHORIZED_PERSON_SEAL')) {
						if (!this.$refs.AuthorizationSeal.save()) {
							return;
						}
					}
					if (type === 'CERT_APPLY') {
						values.area = values.area.join('/');
						values.certModel = values.certModel.join(',');
						API_DownloadCertApplyTemplate({
							applyContent: 'CERT_APPLY',
							linkmanArea: values.area,
							linkmanAddress: values.address,
							...values,
							businessSealList: this.$refs.BusinessSeal.save(),
							authorizedRepresentativeSealList: this.$refs.AuthorizationSeal.save(),
							contractSealBoo: this.contractSealBoo
						}).then(res => {
							comDownload(res, undefined, `${title[type]}.pdf`);
						});
					}
					const { personalUserMobile, personalUserName, personalUserIdcard } = this.operator;
					if (type === 'AUTHORIZATION') {
						API_DownloadAuthorizationTemplate({
							signerName: personalUserName,
							signerMobile: personalUserMobile,
							signerIdCard: personalUserIdcard
						}).then(res => {
							comDownload(res, undefined, `${title[type]}.pdf`);
						});
					}

					if (type === 'AUTHORIZATIONLETTER') {
						API_DownloadAuthorizedLetterTemplate().then(res => {
							comDownload(res, undefined, `${title[type]}.pdf`);
						});
					}
				}
			});
		},

		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					values.area = values.area.join('/');
					values.certModel = values.certModel.join(',');
					let data = {
						certModel: values.certModel, //签章方式（TRUST-托管；UKEY-ukey）
						signerCompanyUserId: values.companyUserId, //签章员用户ID
						signerName: values.operatorName, //签章员姓名
						signerMobile: values.operatorPhone, //签章员电话
						signerIdCard: values.idcard, //签章员证件号码
						linkman: values.linkName, //联系人姓名
						linkmanMobile: values.linkPhone, //联系人手机号
						linkmanArea: values.area, //邮寄地址-省市区
						linkmanAddress: values.address, //邮寄地址-详细地址
						certApplyImg: values.certApplyImg, //机构证书申请表
						licenseImg: values.licenseImg, //数字证书申请授权书
						operatorIdCardImg: values.operatorIdCardImg, //数字证书操作员身份证
						contractSealBoo: this.contractSealBoo, //是否选中合同专用章
					};
					// 校验是否选择业务专用章、授权代表专用章
					if (this.businessSealChecked.includes('PICKUP_GOODS_SEAL')) {
						if (!this.$refs.BusinessSeal.save()) {
							return;
						}
						data.businessSealList = this.$refs.BusinessSeal.save();
					}

					if (this.authorizationSealChecked.includes('AUTHORIZED_PERSON_SEAL')) {
						if (!this.$refs.AuthorizationSeal.save()) {
							return;
						}
						data.authorizedRepresentativeSealList = this.$refs.AuthorizationSeal.save();
						// data.authorizedRepresentativeSealList.forEach(element => {
						//   delete element.authorizedDate
						// });
						data.authorizedLetterImg = values.authorizedLetterImg; // 授权代表说明函
					}
					API_CertApply(data).then(res => {
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
		user-select: none;
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
