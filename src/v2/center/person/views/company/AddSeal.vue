<template>
	<div class="wrapper">
		<a-card
			title="新增印模"
			:bordered="false"
		>
			<a-form
				:form="form"
				v-bind="formLayout"
			>
				<div class="stuff">
					<p class="title">选择印模类型</p>
					<a-form-item
						class="upload-box"
						label="印模类型"
						:colon="false"
						:label-col="{ span: 24 }"
						:wrapper-col="{ span: 24 }"
					>
						<a-checkbox-group
							@change="handleChangeSealTypes"
							v-decorator="[
								'sealType',
								{
									rules: [{ required: true, message: ``, type: 'array', message: '请选择签章类型' }]
								}
							]"
						>
							<a-checkbox v-if="!haveContractSeal" value="CONTRACT_SEAL" style="display: block;">合同专用章</a-checkbox>
							<a-checkbox value="PICKUP_GOODS_SEAL">业务专用章</a-checkbox>
							<BusinessSeal
								ref="BusinessSeal"
								:selectedData="businessSealData"
							>
							</BusinessSeal>
							<a-checkbox value="AUTHORIZED_PERSON_SEAL">授权代表专用章</a-checkbox>
							<AuthorizationSeal
								:selectedData="authorizationSealData"
								:authorizationSealData="authorizationSealData"
								ref="AuthorizationSeal"
							>
							</AuthorizationSeal>
						</a-checkbox-group>
					</a-form-item>
				</div>

				<div class="stuff">
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
									v-decorator="[uploadKeyList[0], { rules: [{ required: true, message: '上传数字证书申请授权书' }] }]"
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
										@click="downloadTemplate('CERT_APPLY')"
										>下载模版</a
									>
								</p>
							</a-form-item>
						</a-col>

						<a-col
							span="12"
							v-if="form.getFieldValue('sealType') && form.getFieldValue('sealType').includes('AUTHORIZED_PERSON_SEAL')"
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
									v-decorator="[uploadKeyList[1], { rules: [{ required: true, message: '上传授权代表说明函' }] }]"
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
					</a-row>
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
									type="primary"
									@click="save"
									style="margin-left: 20px"
								>
									提交
								</a-button>
							</a-row>
						</a-form-item>
					</a-col>
				</div>
			</a-form>
		</a-card>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_CertSealChangeApply,
	API_AddDownloadCertApplyTemplate,
	API_DownloadAuthorizedLetterTemplate,
	API_CertSealChangeApplyInfo,
	API_CheckHaveContractSeal
} from '@/v2/api/account';
import comDownload from '@sub/utils/comDownload.js';
import { filePreview } from '@/v2/utils/file';
import iUpload from '@/v2/components/upload';
import imageViewer from '@/v2/components/imageViewer.vue';
import systemConfig from '@/v2/config/common';
import BusinessSeal from '../../components/BusinessSeal.vue';
import AuthorizationSeal from '../../components/AuthorizationSeal.vue';

export default {
	name: 'ConfigSignature',
	data() {
		return {
			certImgExample: systemConfig.accountInfo.applyImgExample,
			authorizedLetterImgExample: systemConfig.accountInfo.authorizedLetterImgExample,
			uploadKeyList: ['certApplyImg', 'authorizedLetterImg'],
			fileListcertApplyImg: [],
			fileListauthorizedLetterImg: [],
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: {
					span: 7
				},
				wrapperCol: {
					span: 15
				}
			},
			action: API_UPLOAD,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			businessSealData: [],
			authorizationSealData: [],
			contractSealBoo: false, // 合同专用章是否被选中
			haveContractSeal: true, // 是否已配置合同专用章
		};
	},
	components: {
		iUpload,
		imageViewer,
		AuthorizationSeal,
		BusinessSeal
	},
	created() {
		if (this.$route.query.type === 'edit') {
			this.getCertSealChangeAInfo();
		}
		this.check();
	},
	methods: {
		check() {
			API_CheckHaveContractSeal().then(res=>{
				this.haveContractSeal = res.success && res.data
			})
		},
		getCertSealChangeAInfo() {
			// 审核驳回后重新申请回显数据
			API_CertSealChangeApplyInfo({
				bid: this.$route.query.bid
			}).then(res => {
				if (res.data) {
					this.certApplyInfo = res.data;
					// 签章类型数据回显
					this.contractSealBoo = this.certApplyInfo.contractSealBoo || false;
					let sealType = [];
					if (this.certApplyInfo.businessSealList?.length > 0) sealType.push('PICKUP_GOODS_SEAL');
					if (this.certApplyInfo.authorizedRepresentativeSealList?.length > 0) sealType.push('AUTHORIZED_PERSON_SEAL');
					this.$nextTick(() => {
						setTimeout(() => {
							this.form.setFieldsValue({
								sealType: sealType
							});
							this.businessSealData = this.certApplyInfo.businessSealList;
							this.authorizationSealData = this.certApplyInfo.authorizedRepresentativeSealList;
						}, 500);
						setTimeout(() => {
							this.form.setFieldsValue({
								authorizedLetterImg: this.certApplyInfo.authorizedLetterImg,
								certApplyImg: this.certApplyInfo.certApplyImg
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
		handleChangeSealTypes(v) {
			if (v.includes('PICKUP_GOODS_SEAL')) {
				if (this.businessSealData.length === 0) {
					this.$refs.BusinessSeal.addRow();
				}
			} else {
				this.businessSealData = [];
			}
			if (v.includes('AUTHORIZED_PERSON_SEAL')) {
				if (this.authorizationSealData.length === 0) {
					this.$refs.AuthorizationSeal.addRow();
				}
			} else {
				this.authorizationSealData = [];
			}
			this.contractSealBoo = v.includes('CONTRACT_SEAL');
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},
		downloadTemplate(type) {
			const title = {
				CERT_APPLY: '数字证书申请表',
				AUTHORIZATIONLETTER: '授权代表说明函'
			};
			if (type === 'CERT_APPLY') {
				API_AddDownloadCertApplyTemplate().then(res => {
					comDownload(res, undefined, `${title[type]}.pdf`);
				});
			}
			if (type === 'AUTHORIZATIONLETTER') {
				API_DownloadAuthorizedLetterTemplate().then(res => {
					comDownload(res, undefined, `${title[type]}.pdf`);
				});
			}
		},
		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let dataObj = Object.assign(values);
					dataObj.certModel = this.$route.query.certModel;
					dataObj.contractSealBoo = this.contractSealBoo;
					if (values.sealType.includes('PICKUP_GOODS_SEAL')) {
						if (!this.$refs.BusinessSeal.save()) {
							return;
						}
						dataObj.businessSealList = this.$refs.BusinessSeal.save();
					}
					if (values.sealType.includes('AUTHORIZED_PERSON_SEAL')) {
						if (!this.$refs.AuthorizationSeal.save()) {
							return;
						}
						dataObj.authorizedRepresentativeSealList = this.$refs.AuthorizationSeal.save();
					}
					if (this.$route.query.type == 'edit') {
						dataObj.changeApplyBid = this.$route.query.bid;
					}
					let that = this;
					that.$confirm({
						centered: true,
						title: '提交后将进入平台审核环节，审核通过后，该印模即可进行印章配置，用于电子单据盖章，确认提交吗？',
						onOk() {
							API_CertSealChangeApply(dataObj).then(res => {
								if (res.success) {
									if (res.data) {
										that.$message.success({
											content: '已提交新增签章申请，进入后台审批流程...',
											duration: 5
										});
										that.$router.push('/center/account/company/info');
									}
								} else {
									that.$message.error(res.error.message || '提交失败');
								}
							});
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
::v-deep.ant-checkbox-wrapper {
	margin-left: 0!important;
}
</style>
