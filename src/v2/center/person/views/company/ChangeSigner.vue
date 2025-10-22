<template>
	<div class="changeOperator">
		<a-card
			style="position: relative; margin-bottom: 8px"
			title="变更签章员"
			:bordered="false"
		>
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
			<div class="notice-wrap">
				<div>
					<span class="notice-title">更换签章员须知：</span>
					<span class="des">须提供：数字证书用户变更申请表、数字证书申请授权书、新签章员身份证</span>
				</div>
			</div>
		</a-card>
		<div
			class="info"
			style="background: #f4f5f8"
		>
			<a-row
				type="flex"
				:gutter="8"
				justify="space-between"
			>
				<a-col :span="12">
					<div class="item">
						<p class="title">基本信息</p>
						<a-row>
							<a-col class="flex-box">
								<div class="name">企业名称</div>
								<div class="value">
									{{ companyInfo.name }}
								</div>
							</a-col>
							<a-col class="flex-box">
								<div class="name">统一社会信息用代码</div>
								<div class="value">
									{{ companyInfo.uscc }}
								</div>
							</a-col>
							<a-col class="flex-box">
								<div class="name">法定代表人</div>
								<div class="value">
									{{ companyInfo.legalPersonName }}
								</div>
							</a-col>
							<a-col class="flex-box">
								<div class="name">盖章员</div>
								<div class="value">
									{{ certInfo.signerName }}
								</div>
							</a-col>
							<a-col class="flex-box">
								<div class="name">注册地址</div>
								<div class="value ellipsis">
									<a-tooltip placement="top">
										<template slot="title"> {{ companyInfo.area }} {{ companyInfo.address }} </template>
										{{ companyInfo.area }} {{ companyInfo.address }}
									</a-tooltip>
								</div>
							</a-col>
						</a-row>
					</div>
				</a-col>
				<a-col
					class="right"
					:span="12"
					v-for="item in certList"
					:key="item.certDn"
				>
					<div class="item">
						<p class="title">证书信息</p>
						<div class="flex-box">
							<img src="@/v2/assets/imgs/person/cfcaLogo.png" />
							<div>
								<div class="flex-box">
									<div class="name">颁发机构</div>
									<div class="value">中国金融认证中心CFCA</div>
								</div>
								<div class="flex-box">
									<div class="name">证书DN</div>
									<div class="value ellipsis">
										<a-tooltip placement="top">
											<template slot="title">
												{{ item.dn }}
											</template>
											{{ item.dn }}
										</a-tooltip>
									</div>
								</div>
								<div class="flex-box">
									<div class="name">有效时间</div>
									<div class="value">{{ item.startTime }} - {{ item.slEndTime }}</div>
								</div>
							</div>
						</div>
					</div>
				</a-col>
			</a-row>
		</div>
		<a-form
			:form="form"
			v-bind="formLayout"
		>
			<div class="block-wrapper">
				<a-row>
					<a-col
						:span="12"
						align="left"
					>
						<p class="title">变更签章员</p>
						<a-form-item
							label="请选择新的签章员"
							:colon="false"
						>
							<!-- labelInValue -->
							<a-select
								showSearch
								:notFoundContent="companyPersonalUserList.length <= 0 ? '暂无数据' : '加载中...'"
								:filterOption="false"
								:defaultActiveFirstOption="false"
								placeholder="请选择新的签章员"
								@change="operatorChange"
								@dropdownVisibleChange="operatorJudge"
								v-decorator="[
									'signerCompanyUserId',
									{
										rules: [{ required: true, message: `新签章员必填` }, { validator: identityCheck }]
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
			</div>

			<div class="block-wrapper">
				<p class="title">上传相关材料</p>
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col span="12">
						<a-form-item
							class="upload-box"
							label="上传数字证书用户变更申请表（需加盖公章）"
							:colon="false"
							:label-col="{ span: 24 }"
							:wrapper-col="{ span: 24 }"
						>
							<i-upload
								:action="action"
								:accept="accept"
								:showUploadList="true"
								:defaultFileList="fileListcertApplyImg"
								:showDesc="false"
								list-type="picture-card"
								:limit="true"
								v-decorator="[
									uploadKeyList[0],
									{
										rules: [{ required: true, message: '上传数字证书用户变更申请表' }]
									}
								]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a
									class="fl"
									@click="handlePreview('certChangeUserImg')"
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
							label="上传数字证书用户变更授权书（需加盖公章）"
							:colon="false"
							:label-col="{ span: 24 }"
							:wrapper-col="{ span: 24 }"
						>
							<i-upload
								:action="action"
								:accept="accept"
								:showUploadList="true"
								:defaultFileList="fileListlicenseImg"
								:showDesc="false"
								list-type="picture-card"
								:limit="true"
								v-decorator="[
									uploadKeyList[1],
									{
										rules: [{ required: true, message: '上传数字证书用户变更授权书' }]
									}
								]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a
									class="fl"
									@click="handlePreview('changeOperator')"
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
								:showUploadList="true"
								:defaultFileList="fileListoperatorIdcardImg"
								:showDesc="false"
								list-type="picture-card"
								:limit="true"
								v-decorator="[
									uploadKeyList[2],
									{
										rules: [{ required: true, message: '上传数字证书操作员身份证' }]
									}
								]"
							>
								<div>
									<a-icon type="plus" />
								</div>
							</i-upload>
							<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
							<p class="example">
								<a
									class="fl"
									@click="handlePreview('idcardImg')"
									>示例</a
								>
							</p>
						</a-form-item>
					</a-col>
				</a-row>

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
							<!-- <a href="https://www.cfca.com.cn/20150811/101230094.html" target="_blank" >
                《CFCA数字证书服务协议》
              </a> -->
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
						</a-form-item>
					</a-col>

					<a-col span="24">
						<a-row
							type="flex"
							justify="center"
						>
							<a-button
								style="margin-right: 20px"
								@click="$router.go(-1)"
								type="primary"
								ghost
							>
								返回上一步
							</a-button>
							<a-button
								type="primary"
								:disabled="!form.getFieldValue('agree') || loading"
								@click="save"
							>
								提交
							</a-button>
						</a-row>
					</a-col>
				</a-row>
			</div>
		</a-form>
		<image-viewer ref="imageViewer" />
		<AgreeModal ref="agreeModal"></AgreeModal>
		<a-modal
			title="提示"
			:visible="emptyVisible"
			@ok="emptyGo"
			@cancel="emptyVisible = false"
		>
			<p>当前企业仅有一位员工，请前往【企业账号管理】处添加员工</p>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_COMPANYDETAIL,
	API_COMPANYUSERLIST,
	API_ChangeCertOperator,
	API_CertInfo,
	API_ChangeCertOperatorInfo,
	API_CompanyUserRoleInfo,
	API_DownloadSingerModifyTemplateApply,
	API_DownloadSingerModifyTemplateAuthorization,
	API_idCardAuth3Meta
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { beforeUpload } from '@/v2/utils/factory';
import AgreeModal from '@/v2/components/modal/index.vue';
import iUpload from '@/v2/components/upload';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import systemConfig from '@/v2/config/common';

export default {
	name: 'ChangeOperator',

	components: {
		AgreeModal,
		iUpload,
		imageViewer
	},
	data() {
		return {
			idcardImg: systemConfig.accountInfo.idcardImgExample,
			certChangeUserImg: systemConfig.accountInfo.certChangeUserImg,
			changeOperator: systemConfig.accountInfo.changeOperator,
			companyInfo: {},
			maxLength: 200,
			operator: {},
			companyPersonalUserList: [],
			certList: [],
			certApplyId: '',
			loading: false,
			formLayout: {
				labelCol: {
					span: 7
				},
				wrapperCol: {
					span: 15
				}
			},
			uploadKeyList: ['certApplyImg', 'licenseImg', 'operatorIdCardImg'],
			form: this.$form.createForm(this),
			action: API_UPLOAD,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			previewImg: '',
			hasChangeOperatorSelectName: false,
			fileListoperatorIdcardImg: [],
			fileListlicenseImg: [],
			fileListcertApplyImg: [],
			model: {},
			certInfo: {},
			oldSingerModel: {},
			emptyVisible: false,
			systemConfig
		};
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		// 设置上传相关字段及方法
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});

		this.certApplyId = this.$route.query.id;
		this.getSingerInfo();
		this.getCertList();
		this.getCompanyPersonalUserList();
		this.getCompanyInfo();
		this.getApplyInfo();
	},

	methods: {
		getApplyInfo() {
			// 获取申请的信息，获取id
			API_ChangeCertOperatorInfo().then(res => {
				if (res.success && res.data) {
					this.model.id = res.data.id;
				}
			});
		},
		getSingerInfo() {
			//获取签章员个人信息
			API_CompanyUserRoleInfo({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				role: 'SIGNER'
			}).then(res => {
				if (res.success && res.data) {
					this.oldSingerModel = {
						...res.data
					};
				}
			});
		},
		//获取签章员
		getCompanyPersonalUserList() {
			API_COMPANYUSERLIST().then(res => {
				if (res.success) {
					//签章员中要排除当前签章员和管理员(一个账号的时候,管理员和签章员同权)
					// 有多个账号时：变更签章员时只需过滤掉原签章员；
					//只有一个员工时候就是管理员,不用在做其他判断
					let companyPersonalUserList = [];
					if (res.data.length != 1) {
						companyPersonalUserList = res.data.filter(item => {
							let SIGNER = item.roles.some(items => {
								return items.code == 'SIGNER';
							});
							if (!SIGNER) {
								return true;
							}
						});
					}
					this.companyPersonalUserList = companyPersonalUserList.map(item => {
						const { address, area, idCard, mobile, name } = item.personal;
						return {
							address,
							area,
							id: item.id,
							// personalUserId: "fc2dbfb0771bb6feb575faaf7dc74cba"
							personalUserIdcard: idCard,
							personalUserMobile: mobile,
							personalUserName: name
						};
					});
				}
			});
		},
		//选择时提示
		//点击【请选择管理员】/【请选择签章员】位置，出现弹窗提示“当前企业仅有一位员工，请前往【企业账号管理】处添加员工”，
		operatorJudge(open) {
			//如果下拉框打开，没有用户时提示
			if (open && !this.companyPersonalUserList.length) {
				this.emptyVisible = true;
			}
		},
		//前往添加员工
		emptyGo() {
			this.$router.push('/center/account/company/user');
		},

		getCompanyInfo() {
			API_COMPANYDETAIL().then(res => {
				this.companyInfo = res.data;
			});
		},

		getCertList() {
			API_CertInfo().then(res => {
				if (res.success) {
					this.certList = res.data.certList;
					this.certInfo = res.data;
				}
			});
		},

		checkSetpOne() {
			this.current = 1;
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},

		beforeUpload(file) {
			return beforeUpload(file);
		},

		// 实名认证判断
		operatorChange(value) {
			this.operator = {};
			this.form.resetFields(['operatorName', 'operatorPhone', 'idcard']);
			this.companyPersonalUserList.forEach(item => {
				if (value === item.id) {
					this.operator = item;
				}
			});
			const { personalUserName, personalUserMobile, personalUserIdcard } = this.operator;
			this.hasChangeOperatorSelectName = 'hasname';
			this.$nextTick(() => {
				this.form.setFieldsValue({
					operatorName: personalUserName,
					operatorPhone: personalUserMobile,
					idcard: personalUserIdcard
				});
			});
		},
		// 手机号、姓名、身份证号三要素一致校验
		identityCheck(rule, value, callback) {
			if (!this.operator.personalUserName) {
				return callback('');
			}
			// // 手机号、姓名、身份证号三要素校验
			API_idCardAuth3Meta({
				idCard: this.operator.personalUserIdcard,
				mobile: this.operator.personalUserMobile,
				name: this.operator.personalUserName
			}).then(res => {
				if (res.success) {
					if (res.data.result) {
						callback();
					} else {
						callback(res.data.message);
					}
				}
			});
		},
		downloadTemplate(type) {
			this.form.validateFieldsAndScroll(['signerCompanyUserId'], err => {
				if (this.hasChangeOperatorSelectName == 'noauth') {
					return;
				}
				let func = API_DownloadSingerModifyTemplateAuthorization;
				if (!err) {
					let params = {
						signerName: this.operator.personalUserName,
						idCard: this.operator.personalUserIdcard
					};
					if (type === 'CERT_APPLY') {
						(params.oldSignerName = this.oldSingerModel.name),
							(params.oldIdCard = this.oldSingerModel.idCard),
							(params.mobile = this.operator.personalUserMobile);
						func = API_DownloadSingerModifyTemplateApply;
					}
					const title = {
						CERT_APPLY: '数字证书用户变更申请表',
						AUTHORIZATION: '数字证书用户变更授权书'
					};
					func(params).then(res => {
						comDownload(res, undefined, `${title[type]}.pdf`);
					});
				}
			});
		},

		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const { signerCompanyUserId, certApplyImg, licenseImg, operatorIdCardImg } = values;
					const params = {
						signerCompanyUserId,
						certApplyImg,
						licenseImg,
						operatorIdCardImg
					};
					this.loading = true;
					if (this.model.id) {
						params.id = this.model.id;
					}
					API_ChangeCertOperator(params)
						.then(res => {
							if (res.success) {
								this.$success({
									centered: true,
									title: '更换签章员申请已提交，等待审核中',
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
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep {
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
}

.a-alert {
	width: 626px;
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

.changeOperator {
	margin: -10px -30px;
	background-color: rgb(244, 245, 248);

	.title {
		text-align: left;
		font-size: 13px;
		color: #383a3f;
		margin-bottom: 10px;
	}
	.info {
		.item {
			padding: 10px 20px;
			height: 162px;
			background: #ffffff;
			margin-bottom: 8px;
			.title {
				margin-bottom: 0;
				padding-bottom: 0;
			}
			img {
				width: 66px;
				height: 66px;
				margin-right: 20px;
				margin-top: 15px;
			}
		}
		.right .item {
			.name {
				width: 80px;
				text-align: left;
			}
		}
		p {
			font-size: 12px;
			color: #383a3f;
			line-height: 32px;
			padding-bottom: 10px;
			font-weight: 600;
		}
		.right .flex-box {
			margin-top: 11px;
		}
		.flex-box {
			display: flex;
			margin-bottom: 5px;
			> div {
				width: calc(100% - 80px);
				padding-right: 10px;
				font-size: 12px;
				color: #6b6f76;
				line-height: 18px;
			}
			.name {
				width: 160px;
				text-align: left;
			}
			.value {
				color: #383a3f;
				span {
					display: block;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					letter-spacing: 0;
				}
			}
		}
	}

	.block-wrapper {
		margin-bottom: 8px;
		background: #ffffff;
		padding: 20px;
	}

	.noauth {
		font-size: 12px;
		color: #f5222d;
		line-height: 22px;
	}

	.example-str {
		margin-left: -10px;
		font-size: 12px;
	}
	.divider {
		background: #eef0f2;
		height: 1px;
		margin-top: 20px;
		margin-left: -20px;
		margin-right: -20px;
	}
	.notice-wrap {
		color: rgba(0, 0, 0, 0.65);
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		margin-top: 25px;
		> div {
			width: 100%;
		}
		.des {
			font-family: PingFangSC-Regular;
			font-size: 13px;
			color: #383a3f;
		}
		.notice-title {
			font-family: PingFangSC-Regular;
			font-size: 13px;
			color: @primary-color;
		}
	}
	.return-company {
		width: 228px;
		height: 28px;
		margin-top: 25px;
	}
	.shenhe-icon {
		width: 100px;
		height: 76px;
		background-size: cover;
		margin: 0 auto;
		background-image: url('~assets/imgs/person/pic-shenhe.png');
	}
	.shenheing-text {
		margin-top: 25px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #383a3f;
	}
	.row {
		margin-bottom: 16px;
	}
	.steps-tool {
		padding-left: 119px;
		padding-right: 120px;
	}
	.steps-action {
		margin-top: 44px;
	}
}
</style>
