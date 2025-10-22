<template>
	<div class="wrapper slMain">
		<a-card
			title="变更企业信息"
			:bordered="false"
		>
			<div class="sub-title">
				<a-icon
					type="exclamation-circle"
					theme="filled"
				/>
				<p>
					变更企业信息须知：<span
						>重新上传营业执照复印件（加盖公章）；重新上传法定代表人身份证复印件（加盖公章）；上传工商变更证明（加盖公章）；上传《企业信息变更申请表》</span
					>
				</p>
			</div>
		</a-card>

		<div class="form">
			<a-steps
				class="steps"
				:current="curStep"
			>
				<a-step
					title="验证身份"
					status="process"
				/>
				<a-step
					title="提交信息"
					:status="curStep >= 1 ? 'process' : 'wait'"
				/>
				<a-step
					title="系统审核"
					:status="curStep >= 2 ? 'process' : 'wait'"
				/>
				<a-step
					title="变更完成"
					:status="curStep >= 3 ? 'process' : 'wait'"
				/>
			</a-steps>
			<MobileCode
				:sendapi="API_COMPANYMODIFYSENDCODEMODIFYCOMPANY"
				:checkapi="API_COMPANYMODIFYCHECKCODEMODIFYCOMPANY"
				v-if="curStep == 0"
				@checksuccess="checksuccess"
			></MobileCode>

			<a-form
				:form="form"
				v-if="curStep == 1"
				labelAlign="left"
				class="slFormDetail"
			>
				<p class="slTitleAssis">
					企业名称变更
					<img
						v-if="companyChangeFlag"
						src="@/v2/assets/imgs/person/edit_icon.png"
						alt=""
						class="edit-icon"
						@click="editCompany"
					/>
					<img
						v-else
						src="@/v2/assets/imgs/person/edit_default_icon.png"
						alt=""
						class="edit-icon"
						@click="editCompany"
					/>
				</p>
				<a-row>
					<a-col :span="8">
						<a-form-item label="原企业名称">
							<a-input
								disabled
								v-model="info.nameBefore"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							required
							label="统一社会信用代码"
						>
							<a-input
								name="bizLicenseNo"
								disabled
								v-decorator="['bizLicenseNo']"
								placeholder="请输入统一社会信用代码"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="新企业名称">
							<a-input
								disabled
								name="name"
								placeholder="请输入企业名称"
								v-decorator="[
									'name',
									{
										rules: [
											{
												required: companyChangeFlag,
												message: '企业名称必填',
												whitespace: true
											}
										],
										initialValue: info.name
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							class="area-item"
							label="注册地址"
						>
							<a-cascader
								:disabled="!companyChangeFlag"
								:getPopupContainer="getPopupContainer"
								:options="residences"
								placeholder="请选择注册地址"
								v-decorator="[
									'area',
									{
										rules: [
											{
												type: 'array',
												required: companyChangeFlag,
												message: '注册地址必填'
											}
										]
									}
								]"
							>
								<i
									slot="suffixIcon"
									class="icon-gengduoshaixuan-xialajiantou1 iconfont"
									style="fontsize: 14px"
								/>
							</a-cascader>
						</a-form-item>
						<a-form-item
							class="address-item"
							label=""
						>
							<a-input
								:disabled="!companyChangeFlag"
								placeholder="请输入注册详细地址"
								v-decorator="[
									'address',
									{
										rules: [{ required: companyChangeFlag, message: `注册详细地址必填` }],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="新企业简称">
							<a-input
								:disabled="!companyChangeFlag"
								placeholder="请输入新企业简称"
								@blur="getAbbrPinYin"
								:maxLength="50"
								v-decorator="[
									'abbreviation',
									{
										rules: [
											{
												required: companyChangeFlag,
												message: '请输入新企业简称',
												whitespace: true
											},
											{ pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/, message: '请输入汉字、数字、字母' }
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="企业简称首字母缩写">
							<a-input
								:disabled="!companyChangeFlag"
								placeholder="请输入企业简称首字母缩写"
								v-decorator="[
									'abbrPinYin',
									{
										rules: [
											{ required: companyChangeFlag, message: `企业简称首字母缩写必填` },
											{
												pattern: /^[A-Z]+$/,
												message: '企业简称首字母缩写只能输入大写字母'
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<p class="slTitleAssis">
					法定代表人身份信息
					<img
						v-if="legalPersonChangeFlag"
						src="@/v2/assets/imgs/person/edit_icon.png"
						alt=""
						class="edit-icon"
						@click="editLegalPerson"
					/>
					<img
						v-else
						src="@/v2/assets/imgs/person/edit_default_icon.png"
						alt=""
						class="edit-icon"
						@click="editLegalPerson"
					/>
				</p>
				<a-row>
					<a-col
						:span="24"
						style="height: 149px"
					>
						<a-form-item class="sl-upload-box legal-person-upload-box">
							<i-upload
								:disabled="!legalPersonChangeFlag"
								:action="action"
								:accept="accept"
								:showDesc="false"
								:limit="true"
								listType="picture-card"
								:defaultFileList="fileListlegalPersonCardImg"
								:showUploadList="true"
								v-decorator="[
									uploadKeyList[0],
									{
										rules: [{ required: legalPersonChangeFlag, message: '上传法定代表人身份证' }]
									}
								]"
							>
								<div class="add-box">
									<img
										src="@/v2/assets/imgs/person/file_add_icon.png"
										class="add-icon"
									/>
									<p :class="legalPersonChangeFlag ? 'required' : ''">法定代表人身份证复印件</p>
									<p>包含正反面，需加盖公章</p>
								</div>
							</i-upload>
						</a-form-item>
						<div class="upload-tips-box">
							<p class="example">
								<a @click="handlePreview('idcardImg')">查看示例</a>
							</p>
							<p class="support">支持bmp、jpg、png、PDF等格式，文件大小不超过100M</p>
						</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="原法定代表人姓名">
							<a-input
								disabled
								v-model="info.legalPersonNameBefore"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="新法定代表人姓名">
							<a-input
								disabled
								placeholder="请输入新法定代表人姓名"
								v-decorator="[
									'legalPersonName',
									{
										rules: [
											{
												required: legalPersonChangeFlag,
												message: '请输入新法定代表人姓名',
												whitespace: true
											},
											{ validator: validIdCard }
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="新法定代表人身份证">
							<a-input
								:disabled="!legalPersonChangeFlag"
								placeholder="请输入新法定代表人身份证号码"
								@blur="form.validateFields(['legalPersonName'], () => {})"
								v-decorator="[
									'legalPersonCardNo',
									{
										rules: [
											{
												required: legalPersonChangeFlag,
												message: '请输入新法定代表人身份证号码',
												whitespace: true
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="法定代表人手机号">
							<a-input
								:disabled="!legalPersonChangeFlag"
								placeholder="请输入法定代表人手机号"
								v-decorator="[
									'legalPersonMobile',
									{
										rules: [
											{
												required: legalPersonChangeFlag,
												message: '请输入正确的法定代表人手机号',
												whitespace: true,
												pattern: /^1[3456789]\d{9}$/
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="身份证有效期（起）">
							<a-date-picker
								:disabled="!legalPersonChangeFlag"
								type="date"
								format="YYYY-MM-DD"
								style="width: 100%"
								valueFormat="YYYY-MM-DD"
								placeholder="请输入身份证有效期"
								:disabledDate="disabledDate"
								v-decorator="[
									`legalPersonCardValidTimeStart`,
									{
										rules: [
											{
												required: legalPersonChangeFlag,
												message: `身份证有效期（起）必填`
											}
										]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							label="身份证有效期（止）"
							class="idCardEnd"
						>
							<a-date-picker
								type="date"
								style="width: 100%"
								format="YYYY-MM-DD"
								valueFormat="YYYY-MM-DD"
								:disabled="form.getFieldValue('legalPersonCardIsLongValid') || !legalPersonChangeFlag"
								placeholder="请输入身份证有效期"
								v-decorator="[
									`legalPersonCardValidTimeEnd`,
									{
										rules: [
											{
												required: !form.getFieldValue('legalPersonCardIsLongValid') && legalPersonChangeFlag,
												message: `身份证有效期（止）必填`
											}
										]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
						</a-form-item>
						<a-form-item
							label=""
							:colon="false"
							class="idCardEndLong"
						>
							<a-checkbox
								:disabled="!legalPersonChangeFlag"
								v-decorator="[
									'legalPersonCardIsLongValid',
									{
										initialValue: false,
										rules: [{ required: false }],
										valuePropName: 'checked'
									}
								]"
								@change="onChangeLegalPersonCardIsLongValid"
							>
								长期有效
							</a-checkbox>
						</a-form-item>
					</a-col>
				</a-row>

				<p class="slTitleAssis">其他材料</p>
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col span="24">
						<a-form-item class="sl-upload-box">
							<i-upload
								:action="action"
								:accept="accept"
								:showDesc="false"
								:limit="true"
								list-type="picture-card"
								:defaultFileList="fileListbizLicenseImg"
								:showUploadList="true"
								v-decorator="[
									uploadKeyList[1],
									{
										rules: [{ required: true, message: '上传营业执照复印件' }]
									}
								]"
							>
								<div class="add-box">
									<img
										src="@/v2/assets/imgs/person/file_add_icon.png"
										class="add-icon"
									/>
									<p class="required">上传营业执照复印件</p>
									<p>需加盖公章</p>
								</div>
							</i-upload>
						</a-form-item>
						<div class="upload-tips-box">
							<p class="example">
								<a @click="handlePreview('bizLicenseImgExample')">查看示例</a>
							</p>
							<p class="support">支持bmp、jpg、png、PDF等格式，文件大小不超过100M</p>
						</div>
					</a-col>

					<a-col span="24">
						<a-form-item class="sl-upload-box">
							<i-upload
								:action="action"
								:accept="accept"
								:showDesc="false"
								:limit="true"
								list-type="picture-card"
								:defaultFileList="fileListmodifyLicenseImg"
								:showUploadList="true"
								v-decorator="[
									uploadKeyList[2],
									{
										rules: [{ required: true, message: '上传工商变更证明' }]
									}
								]"
							>
								<div class="add-box">
									<img
										src="@/v2/assets/imgs/person/file_add_icon.png"
										class="add-icon"
									/>
									<p class="required">上传工商变更证明</p>
									<p>需加盖公章</p>
								</div>
							</i-upload>
						</a-form-item>
						<div class="upload-tips-box single">
							<p class="support">支持bmp、jpg、png、PDF等格式，文件大小不超过100M</p>
						</div>
					</a-col>

					<a-col span="24">
						<a-form-item class="sl-upload-box">
							<i-upload
								:action="action"
								:accept="accept"
								:showDesc="false"
								:limit="true"
								list-type="picture-card"
								:defaultFileList="fileListmodifyApplyImg"
								:showUploadList="true"
								v-decorator="[
									uploadKeyList[3],
									{
										rules: [{ required: true, message: '上传《企业信息变更申请表》' }]
									}
								]"
							>
								<div class="add-box">
									<img
										src="@/v2/assets/imgs/person/file_add_icon.png"
										class="add-icon"
									/>
									<p class="required">企业信息变更申请表</p>
									<p>需加盖公章</p>
								</div>
							</i-upload>
						</a-form-item>
						<div class="upload-tips-box">
							<p class="example">
								<a-space>
									<a @click="handlePreview('modifyApplyImgExample')">查看示例</a>
									<a
										class="fr"
										@click="downloadTemplate()"
										>下载模版</a
									>
								</a-space>
							</p>
							<p class="support">支持bmp、jpg、png、PDF等格式，文件大小不超过100M</p>
						</div>
					</a-col>
				</a-row>
			</a-form>

			<div
				class="wait tc"
				v-if="curStep === 2"
			>
				<img src="@/v2/assets/imgs/person/check.png" />
				<div>
					<span class="wait-tip">您的企业信息变更申请正在审核中，审核期间电子签章不可使用，审核通过后，可正常使用电子签章</span>
				</div>
				<div>
					<a-button
						type="primary"
						style="margin-top: 24px; padding: 0 64px"
						@click="$router.push('/center/account/company/info')"
						>返回我的企业</a-button
					>
				</div>
			</div>
		</div>
		<image-viewer ref="imageViewer" />

		<div
			class="slDetailBottom"
			v-if="curStep == 1"
		>
			<a-space :size="30">
				<a-button
					ghost
					type="primary"
					@click="$router.go(-1)"
				>
					上一步
				</a-button>
				<a-button
					type="primary"
					:disabled="loading || !(legalPersonChangeFlag || companyChangeFlag)"
					@click="save"
					>提交</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_COMPANYMODIFYDETAIL,
	API_COMPANYMODIFYSENDCODEMODIFYCOMPANY,
	API_COMPANYMODIFYCHECKCODEMODIFYCOMPANY,
	API_COMPANYAUTHCHECKCOMPANYNAME,
	API_COMPANYAUTHGETABBREVIATIONSPELL,
	API_CHECKIDCARD,
	API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE,
	API_COMPANYMODIFYAPPLY
} from '@/v2/api/account';
import { down } from '@/v2/utils/factory';
import ENV from '@/v2/config/env';
import { beforeUpload, encryptedData } from '@/v2/utils/factory';
import { mapGetters } from 'vuex';
import mobileCode from '@/v2/components/mobileCode';
import idcardImg from '@/v2/assets/imgs/person/idcard.png'; // 身份证
import iUpload from '@/v2/components/upload.vue';
import moment from 'moment';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { area } from '@sub/utils/area.js';
import { getPopupContainer } from '@/v2/utils/factory';
import { API_TianYanCha } from '@/v2/center/person/api';
import systemConfig from '@/v2/config/common';

export default {
	name: 'ChangeCompanyInfo',

	components: {
		MobileCode: mobileCode,
		iUpload,
		imageViewer
	},
	data() {
		return {
			getPopupContainer,
			action: API_UPLOAD,
			// API_GetModifyCompanyVerifyCode,
			// API_CheckModifyCompanyVerifyCode,
			API_COMPANYMODIFYSENDCODEMODIFYCOMPANY,
			API_COMPANYMODIFYCHECKCODEMODIFYCOMPANY,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			idcardImg,
			bizLicenseImgExample: systemConfig.accountInfo.bizLicenseImgExample,
			modifyApplyImgExample: systemConfig.accountInfo.modifyApplyImgExample,
			loading: false,
			uploadKeyList: ['legalPersonCardImg', 'bizLicenseImg', 'modifyLicenseImg', 'modifyApplyImg'],
			previewImg: '',
			curStep: 0,
			code: '',
			maxLength: 50,
			form: this.$form.createForm(this),
			currentTab: 0,
			companyId: this.$route.params.companyId,
			info: {},
			legal: -1,
			companyWarning: false,
			fileListlegalPersonCardImg: [],
			fileListbizLicenseImg: [],
			fileListmodifyLicenseImg: [],
			fileListmodifyApplyImg: [],
			residences: area,
			legalPersonChangeFlag: false, // 法定代表人信息变更可编辑
			companyChangeFlag: false, // 企业信息变更可编辑
			TianYanChaData: null // 天涯查返回的对象
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_EDITCOMPANYPROFILE: 'VUEX_ST_EDITCOMPANYPROFILE'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	created() {
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});
	},
	methods: {
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		getDetail() {
			API_COMPANYMODIFYDETAIL().then(res => {
				if (res.success) {
					const data = res.data;
					this.setFieldsX({
						...data,
						bizLicenseNo: data.uscc || this.VUEX_ST_COMPANYSUER.companyUscc, //
						abbrPinYin: data.abbreviationSpell, //
						area: data.area && data.area.split('/')
					});
					this.info = res.data;
					if (!this.info.nameBefore) {
						this.info.nameBefore = this.VUEX_ST_COMPANYSUER.companyName;
					}
					if (!this.info.uscc) {
						this.info.uscc = this.VUEX_ST_COMPANYSUER.companyUscc;
					}
					if (!this.info.legalPersonNameBefore) {
						this.info.legalPersonNameBefore = this.VUEX_ST_COMPANYSUER.company.legalPersonName;
					}
				}
			});
		},
		onChangeLegalPersonCardIsLongValid() {
			this.form.resetFields(['legalPersonCardValidTimeEnd']);
		},
		// 请求后端接口判断公司名称
		checkCompanyName(rule, value, callback) {
			if (this.handleNullValue(value)) {
				callback();
				return;
			}
			if (value == this.VUEX_ST_COMPANYSUER.companyName) {
				callback();
				return;
			}
			API_COMPANYAUTHCHECKCOMPANYNAME({ name: value })
				.then(r => {
					if (!r.data.result) {
						callback(r.data.message);
						return;
					}
					callback();
				})
				.catch(() => {
					callback('验证失败');
				});
		},

		setFieldsX(values) {
			// 处理上传组件图片显示
			this.uploadKeyList.forEach((item, index) => {
				let imgUrl = values[item] ? values[item] : '';
				if (imgUrl.indexOf(ENV.BASE_NET) != -1) {
					imgUrl = imgUrl?.replace(ENV.BASE_NET, '');
				}
				if (imgUrl) {
					this[`fileList${item}`] = [
						{
							name: '文件',
							url: imgUrl.indexOf('.pdf') != -1 ? require('@/v2/assets/imgs/common/pdf.jpeg') : imgUrl,
							uid: index,
							type: imgUrl.indexOf('.pdf') != -1 ? 'application/pdf' : '',
							status: 'done',
							response: {
								data: imgUrl
							}
						}
					];
					this[item] = imgUrl;
				}
			});
			this.$nextTick(() => {
				this.form.setFieldsValue(values);
			});
		},

		async validIdCard(rule, value, callback) {
			let name = '';
			let idCard = '';
			if (rule.field == 'legalPersonName' || rule.field == 'legalPersonCardNo') {
				name = this.form.getFieldValue('legalPersonName');
				idCard = this.form.getFieldValue('legalPersonCardNo');
				if (!this.handleNullValue(name) && !this.handleNullValue(idCard)) {
					API_CHECKIDCARD({ name, idCard: await encryptedData(idCard) })
						.then(res => {
							if (!res.data.result) {
								callback(res.data.message);
							} else {
								callback();
							}
						})
						.catch(() => {
							callback('验证不通过');
						});
				} else {
					callback();
				}
			}
		},
		checksuccess(code) {
			this.curStep += 1;
			this.code = code;
			this.$nextTick(() => {
				this.getDetail();
			});
		},

		beforeUpload(file) {
			return beforeUpload(file);
		},

		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},

		changeLegalPersonCardImg(value) {
			this.legalPersonCardImg = value;
			this.legalPersonCardImgTips = '';
		},

		handleNullValue(value) {
			if (!value) {
				return true;
			}
			// 过滤纯空格的情况
			if (value.match(/^[ ]*$/)) {
				return true;
			}
		},

		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// 替换文件地址
					this.uploadKeyList.forEach(item => {
						values[item] = values[item]?.replace(ENV.BASE_NET, '');
					});
					delete values.agree;
					if (values.legalPersonCardValidTimeEnd && values.legalPersonCardValidTimeStart) {
						if (moment(values.legalPersonCardValidTimeEnd).isSameOrBefore(values.legalPersonCardValidTimeStart, 'day')) {
							this.$message.error('法定代表人身份信息日期不合法');
							return;
						}
					}
					this.loading = true;
					const params = {
						name: values.name,
						uscc: values.bizLicenseNo,
						address: values.address,
						area: values.area?.join('/'),
						legalPersonName: values.legalPersonName,
						legalPersonMobile: values.legalPersonMobile,
						legalPersonCardNo: values.legalPersonCardNo,
						legalPersonCardValidTimeEnd: values.legalPersonCardValidTimeEnd,
						legalPersonCardValidTimeStart: values.legalPersonCardValidTimeStart,
						legalPersonCardIsLongValid: values.legalPersonCardIsLongValid,
						legalPersonCardImg: values.legalPersonCardImg,
						abbreviation: values.abbreviation,
						abbreviationSpell: values.abbrPinYin, //
						usccImage: values.bizLicenseImg, //
						modifyApplyImg: values.modifyApplyImg,
						modifyLicenseImg: values.modifyLicenseImg,
						changeType: '' // 1-企业名称变更 2-法人变更 3 -企业和法人变更
					};
					params.changeType =
						this.companyChangeFlag && this.legalPersonChangeFlag
							? 3
							: this.companyChangeFlag && !this.legalPersonChangeFlag
								? 1
								: 2;
					API_COMPANYMODIFYAPPLY(params)
						.then(res => {
							if (res.success) {
								this.$message.success('提交成功');
								this.curStep += 1;
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
		},

		// 企业模版变更模版
		downloadTemplate() {
			// 1-企业名称变更 2-法人变更 3 -企业和法人变更
			let changeType = '';
			if (this.companyChangeFlag && this.legalPersonChangeFlag) {
				changeType = 3;
			} else if (this.companyChangeFlag && !this.legalPersonChangeFlag) {
				changeType = 1;
			} else if (!this.companyChangeFlag && this.legalPersonChangeFlag) {
				changeType = 2;
			} else {
				changeType = '';
			}
			this.form.validateFieldsAndScroll((err, values) => {
				const newObj = {
					name: values.name,
					uscc: values.bizLicenseNo,
					legalPersonName: values.legalPersonName,
					legalPersonCardNo: values.legalPersonCardNo,
					area: values.area?.join('/'),
					address: values.address,
					legalPersonMobile: values.legalPersonMobile,
					legalPersonCardValidTimeEnd: values.legalPersonCardValidTimeEnd,
					legalPersonCardValidTimeStart: values.legalPersonCardValidTimeStart,
					legalPersonCardIsLongValid: values.legalPersonCardIsLongValid,
					abbreviation: values.abbreviation,
					abbreviationSpell: values.abbrPinYin,
					changeType: changeType
				};
				API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE(newObj).then(res => {
					down(`data:application/pdf;base64,${res}`, '企业信息变更申请表.pdf');
				});
			});
		},

		getAbbrPinYin(e) {
			let value = e.target.value;
			if (!value) {
				return;
			}
			// API_GetAbbrPinYin({abbr: value}).then(res => {
			API_COMPANYAUTHGETABBREVIATIONSPELL({ abbreviation: value }).then(res => {
				if (res.success) {
					this.form.setFieldsValue({
						abbrPinYin: res.data
					});
				}
			});
		},

		// 编辑企业信息
		async editCompany() {
			this.companyChangeFlag = !this.companyChangeFlag;
			if (!this.companyChangeFlag) {
				this.setFieldsX({
					name: null, //
					abbreviation: null, //
					address: null,
					area: null,
					abbrPinYin: null
				});
				return;
			}
			if (this.companyChangeFlag && !this.TianYanChaData) {
				API_TianYanCha({ keyword: this.info.uscc, allowDelayDays:0 }).then(res => {
					if (res.success && res.data) {
						this.TianYanChaData = res.data;
						this.setFieldsX({
							name: res.data.name, //
							abbreviation: res.data.alias, //
							address: res.data.regLocation,
							area: res.data.area?.split('/')
						});
						let e = {
							target: {
								value: res.data.alias
							}
						};
						this.getAbbrPinYin(e);
					}
				});
			} else {
				this.setFieldsX({
					name: this.TianYanChaData.name, //
					abbreviation: this.TianYanChaData.alias, //
					address: this.TianYanChaData.regLocation,
					area: this.TianYanChaData.area?.split('/')
				});
				let e = {
					target: {
						value: this.TianYanChaData.alias
					}
				};
				this.getAbbrPinYin(e);
			}
		},
		//  编辑法人信息
		editLegalPerson() {
			this.legalPersonChangeFlag = !this.legalPersonChangeFlag;
			if (!this.legalPersonChangeFlag) {
				this.setFieldsX({
					legalPersonCardNo: null, //
					legalPersonMobile: null,
					legalPersonCardValidTimeEnd: null,
					legalPersonCardValidTimeStart: null,
					legalPersonCardIsLongValid: false,
					legalPersonCardImg: ''
				});
				return;
			}
			if (this.legalPersonChangeFlag && !this.TianYanChaData) {
				API_TianYanCha({ keyword: this.info.uscc, allowDelayDays:0 }).then(res => {
					if (res.success && res.data) {
						this.TianYanChaData = res.data;
						this.setFieldsX({
							legalPersonName: res.data.legalPersonName //
						});
					}
				});
			} else {
				this.setFieldsX({
					legalPersonName: this.TianYanChaData.legalPersonName //
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.tc {
	text-align: center;
}
.wrapper {
	background-color: #f4f5f8;
	margin: -10px -30px -20px -30px;
	.sub-title {
		background: #f3f7ff;
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		width: 100%;
		padding: 10px 12px;
		display: flex;
		::v-deep.anticon-exclamation-circle {
			color: #4682f3;
			display: inline-block;
			margin-right: 12px;
			position: relative;
			top: 2px;
		}
		p {
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			color: rgba(0, 0, 0, 0.8);
			font-family: 'PingFang SC';
		}
		span {
			font-weight: normal;
			font-size: 14px;
			line-height: 20px;
			color: rgba(0, 0, 0, 0.8);
			font-family: 'PingFang SC';
		}
	}
	.form {
		background: #ffffff;
		padding: 0 20px;
		margin-top: 20px;
	}
	.steps {
		padding: 30px 0 20px 0;
		max-width: 940px;
		margin: 0 auto;
	}
}
::v-deep {
	.ant-card {
		padding: 20px 30px;
		font-family: 'PingFang SC' !important;
		.ant-card-head {
			padding: 0;
			.ant-card-head-title {
				font-family: 'PingFang SC' !important;
				font-size: 20px;
				line-height: 28px;
				color: rgba(0, 0, 0, 0.8);
				padding-bottom: 20px;
				border-bottom: 1px solid #e5e6eb;
			}
		}
		.ant-card-body {
			padding: 30px 0 10px 0;
		}
	}
	.ant-steps-item-wait .ant-steps-item-icon {
		border-color: #c3c3c3;
		background: #c3c3c3;
		.ant-steps-icon {
			color: #ffffff;
		}
	}
	.ant-steps-item-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.4);
		padding-right: 60px;
	}
	.ant-steps-item-title::after {
		background-color: #c3c3c3;
		height: 2px;
		width: 105px;
	}
}
.slFormDetail {
	::v-deep {
		.ant-form-item {
			width: 364px;
		}
		.ant-checkbox-inner {
			border-radius: 4px;
		}
		.ant-checkbox-wrapper > span {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 20px;
			color: rgba(0, 0, 0, 0.8);
		}
		.ant-checkbox + span {
			padding-right: 16px;
			padding-left: 5px;
		}
	}
	.area-item,
	.address-item {
		width: 182px;
		float: left;
	}
	.area-item {
		::v-deep.ant-input {
			border-radius: 4px 0 0 4px;
		}
	}
	.address-item {
		margin-top: 30px;
		::v-deep.ant-input {
			border-radius: 0 4px 4px 0;
			border-left: none;
		}
	}
}
.slTitleAssis {
	margin-top: 10px;
	margin-bottom: 30px;
	.edit-icon {
		width: 14px;
		height: 14px;
		display: inline-block;
		margin-left: 16px;
		margin-top: -2px;
		cursor: pointer;
	}
}
.sl-upload-box {
	width: 212px !important;
	float: left;
	::v-deep {
		.ant-upload-list-picture-card .ant-upload-list-item,
		.ant-upload.ant-upload-select-picture-card {
			width: 192px;
			height: 112px;
			background: #f3f5f6;
			border: 1px dashed #e5e6eb;
			border-radius: 4px;
		}
		.ant-upload.ant-upload-select-picture-card {
			padding: 20px 26px 12px 26px;
			.add-box {
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 14px;
				line-height: 20px;
				text-align: center;
				color: rgba(0, 0, 0, 0.4);
				.add-icon {
					width: 32px;
					height: 32px;
					margin-bottom: 8px;
				}
			}
		}
		.ant-upload.ant-upload-select-picture-card > .ant-upload {
			padding: 0;
		}
		.ant-upload-list-picture-card .ant-upload-list-item {
			margin: 0;
		}
		.ant-upload.ant-upload-select-picture-card {
			margin: 0;
		}
		.ant-upload-list-picture-card-container {
			width: 192px;
			height: 112px;
		}
	}
}
.legal-person-upload-box {
	::v-deep.ant-upload.ant-upload-select-picture-card {
		padding: 20px 0 12px 0;
	}
}
.upload-tips-box {
	float: left;
	padding-top: 30px;
	.example {
		margin-bottom: 10px;
	}
	.support {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 20px;
		color: rgba(0, 0, 0, 0.4);
	}
}
.upload-tips-box.single {
	padding-top: 50px;
}
.idCardEnd {
	width: 262px !important;
	float: left;
}
.idCardEndLong {
	width: 116px !important;
	float: left;
	text-align: right;
	padding-top: 35px;
}
.required::before {
	content: '*';
	color: #dd4444;
	position: relative;
	top: 1.5px;
	right: 1.5px;
}
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
.slDetailBottom {
	width: 100%;
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 10;
}
/deep/.ant-cascader-picker-disabled {
	color: rgba(0, 0, 0, 0.8);
}
</style>
