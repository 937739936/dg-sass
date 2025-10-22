<template>
	<div class="slMain">
		<div class="slTitleAssis">基本信息</div>
		<div class="form-wrap">
			<a-form
				:form="form"
				formLayout="vertical"
				:colon="false"
				:initialValues="defaultCompanyInfo"
				v-if="$route.query.type !== 'edit'"
			>
				<a-row type="flex">
					<a-col span="24">
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:size="100"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:defaultFileList="fileListbizLicenseImg"
									v-decorator="['usccImg', { rules: [{ required: true, message: '请上传营业执照' }] }]"
									:showDesc="false"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('bizLicenseImgExample')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="企业名称">
								<a-select
									:disabled="isDisabled"
									class="form-item-wrap"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入完整公司名称"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="handleCompanyNameSearch"
									v-decorator="[
										`name`,
										{
											rules: [
												{
													required: true,
													message: `企业名称必填`
												},
												{ validator: getValid('name') },
												{
													max: maxLength,
													message: `企业名称长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in companyNameList"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="统一社会信用代码">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入统一社会信用代码"
									@change="changeCompanyDoubt('bizLicenseNo')"
									autocomplete="off"
									v-decorator="[
										`bizLicenseNo`,
										{
											rules: [
												{
													required: true,
													message: `统一社会信用代码必填`,
													whitespace: true
												},
												{ validator: getValid('bizLicenseNo') },
												{
													max: maxLength,
													message: `统一社会信用代码长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="成立日期">
								<a-date-picker
									class="form-item-wrap"
									type="date"
									format="YYYY-MM-DD"
									placeholder="请选择成立日期"
									v-decorator="[
										`establishDate`,
										{
											rules: [
												{
													required: true,
													message: `成立日期必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="企业简称">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称"
									@blur="getAbbrPinYin"
									autocomplete="off"
									v-decorator="[
										`abbreviation`,
										{
											rules: [{ required: true, message: `企业简称必填` }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="企业简称首字母缩写">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称首字母缩写"
									autocomplete="off"
									v-decorator="[
										`abbreviationSpell`,
										{
											rules: [
												{ required: true, message: `企业简称首字母缩写必填` },
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
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="企业性质">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业性质"
									autocomplete="off"
									v-decorator="[
										`companyOrgType`,
										{
											rules: [
												{
													required: true,
													message: `企业性质必填`,
													whitespace: false
												},
												{ validator: getValid('companyOrgType') },
												{
													max: maxLength,
													message: `label: 企业性质长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8" v-if="['TERMINAL', 'COAL_MINE', 'SUPERVISING'].includes(companyType)">
						<a-row
							type="flex"
							justify="start"
						>
						<a-form-item label="法定代表人">
							<a-input
								:disabled="isDisabled"
								class="form-item-wrap"
								placeholder="请输入法定代表人"
								autocomplete="off"
								v-decorator="[
									`legalRepresentative`,
									{
										rules: [
											{
												required: true,
												message: `法定代表人必填`,
												whitespace: true
											},
											{
												max: 20,
												message: `法定代表人长度不能超过20个字符`
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-row>
					</a-col>
					<a-col span="24">
						<a-form-item label="营业期限（止）">
							<a-row type="flex">
								<a-date-picker
									type="date"
									format="YYYY-MM-DD"
									style="width: 364px"
									placeholder="请选择营业期限"
									:disabled="form.getFieldValue('licenseEndDateIsLongValid')"
									v-decorator="[
										`licenceEndDate`,
										{
											rules: [
												{
													required: false,
													message: `营业期限必填`
												}
											]
										}
									]"
								/>
								<a-checkbox
									style="margin-left: 20px"
									v-decorator="[
										'licenseEndDateIsLongValid',
										{
											initialValue: false,
											rules: [{ required: false }],
											valuePropName: 'checked'
										}
									]"
									@change="onChangeLicenseEndDateIsLongValid"
									>长期有效</a-checkbox
								>
							</a-row>
						</a-form-item>
					</a-col>
					<a-col span="24">
						<a-form-item label="企业注册地址">
							<a-row
								type="flex"
								style="display: flex"
							>
								<a-cascader
									class="form-item-city-select"
									style="width: 182px"
									:getPopupContainer="getPopupContainer"
									:options="residences"
									placeholder="请选择城市"
									:allowClear="false"
									v-decorator="[
										`area`,
										{
											rules: [
												{
													type: 'array',
													required: true,
													message: `企业注册地址必填`
												}
											]
										}
									]"
								/>
								<a-input
									class="form-item-address-input"
									style="width: 646px"
									placeholder="请输入注册详细地址"
									v-decorator="[
										`address`,
										{
											rules: [
												{
													required: true,
													message: `详细地址必填`
												}
											]
										}
									]"
								/>
							</a-row>
						</a-form-item>
					</a-col>
					<a-col span="24">
						<a-form-item label="经营范围">
							<a-textarea
								style="width: 828px"
								placeholder="请输入企业的经营范围"
								:rows="4"
								v-decorator="[
									`scope`,
									{
										rules: [
											{
												required: true,
												message: `企业经营范围必填`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<div class="grid-line"></div>
					<a-col>
						<a-form-item label="申请方式">
							<a-radio-group
								name="radioGroup"
								v-decorator="[
									`agentIsLegalPerson`,
									{
										rules: [
											{
												required: true,
												message: `申请方式必填`
											}
										]
									}
								]"
							>
								<a-radio :value="false"> 代理人申请 </a-radio>
								<a-radio :value="true"> 法定代表人申请 </a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-form
				:form="form"
				formLayout="vertical"
				:colon="false"
				:initialValues="defaultCompanyInfo"
				v-if="['COMPANY_NAME_AND_LEGAL_PERSON_CHANGE', 'COMPANY_NAME_CHANGE', 'NO_CHANGE', null].includes(companyChangeTypeDesc) && $route.query.type === 'edit'"
			>
				<a-row type="flex">
					<a-col span="24">
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:size="100"
									:defaultFileList="fileListbizLicenseImg"
									v-decorator="['usccImg', { rules: [{ required: true, message: '请上传营业执照' }] }]"
									:showDesc="false"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('bizLicenseImgExample')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="原企业名称">
								<a-select
									:disabled="isDisabled"
									class="form-item-wrap"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入企业名称"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="handleCompanyNameSearch"
									v-decorator="[
										`nameOld`,
										{
											rules: [
												{
													required: true,
													message: `企业名称必填`
												},
												{ validator: getValid('name') },
												{
													max: maxLength,
													message: `企业名称长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in companyNameList"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="现企业名称">
								<a-select
									class="form-item-wrap"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入现企业名称"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="handleCompanyNameSearch"
									v-decorator="[
										`name`,
										{
											rules: [
												{
													required: true,
													message: `企业名称必填`
												},
												{ validator: getValid('name') },
												{
													max: maxLength,
													message: `企业名称长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in companyNameList"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="统一社会信用代码">
								<a-input
									:disabled="isDisabled"
									class="form-item-wrap"
									placeholder="请输入统一社会信用代码"
									@change="changeCompanyDoubt('bizLicenseNo')"
									autocomplete="off"
									v-decorator="[
										`bizLicenseNo`,
										{
											rules: [
												{
													required: true,
													message: `统一社会信用代码必填`,
													whitespace: true
												},
												{ validator: getValid('bizLicenseNo') },
												{
													max: maxLength,
													message: `统一社会信用代码长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="企业简称">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称"
									@blur="getAbbrPinYin"
									autocomplete="off"
									v-decorator="[
										`abbreviation`,
										{
											rules: [{ required: true, message: `企业简称必填` }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="企业简称首字母缩写">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称首字母缩写"
									autocomplete="off"
									v-decorator="[
										`abbreviationSpell`,
										{
											rules: [
												{ required: true, message: `企业简称首字母缩写必填` },
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
						</a-row>
					</a-col>
					<a-col span="24">
						<a-form-item label="企业注册地址">
							<a-row
								type="flex"
								style="display: flex"
							>
								<a-cascader
									class="form-item-city-select"
									style="width: 182px"
									:getPopupContainer="getPopupContainer"
									:options="residences"
									placeholder="请选择城市"
									:allowClear="false"
									v-decorator="[
										`area`,
										{
											rules: [
												{
													type: 'array',
													required: true,
													message: `企业注册地址必填`
												}
											]
										}
									]"
								/>
								<a-input
									class="form-item-address-input"
									style="width: 646px"
									placeholder="请输入注册详细地址"
									v-decorator="[
										`address`,
										{
											rules: [
												{
													required: true,
													message: `详细地址必填`
												}
											]
										}
									]"
								/>
							</a-row>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-form
				:form="form"
				formLayout="vertical"
				:colon="false"
				:initialValues="defaultCompanyInfo"
				v-if="['LEGAL_PERSON_CHANGE'].includes(companyChangeTypeDesc) && $route.query.type === 'edit'"
			>
				<a-row type="flex">
					<a-col span="24">
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:size="100"
									:defaultFileList="fileListbizLicenseImg"
									v-decorator="['usccImg', { rules: [{ required: true, message: '请上传营业执照' }] }]"
									:showDesc="false"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('bizLicenseImgExample')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="企业名称">
								<a-select
									class="form-item-wrap"
									:disabled="true"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入企业名称"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									:not-found-content="fetching ? undefined : null"
									@search="handleCompanyNameSearch"
									v-decorator="[
										`name`,
										{
											rules: [
												{
													required: true,
													message: `企业名称必填`
												},
												{ validator: getValid('name') },
												{
													max: maxLength,
													message: `企业名称长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in companyNameList"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="统一社会信用代码">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入统一社会信用代码"
									@change="changeCompanyDoubt('bizLicenseNo')"
									autocomplete="off"
									v-decorator="[
										`bizLicenseNo`,
										{
											rules: [
												{
													required: true,
													message: `统一社会信用代码必填`,
													whitespace: true
												},
												{ validator: getValid('bizLicenseNo') },
												{
													max: maxLength,
													message: `统一社会信用代码长度不能超过${maxLength}个字符`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="企业简称">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称"
									@blur="getAbbrPinYin"
									autocomplete="off"
									v-decorator="[
										`abbreviation`,
										{
											rules: [{ required: true, message: `企业简称必填` }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="企业简称首字母缩写">
								<a-input
									class="form-item-wrap"
									placeholder="请输入企业简称首字母缩写"
									autocomplete="off"
									v-decorator="[
										`abbreviationSpell`,
										{
											rules: [
												{ required: true, message: `企业简称首字母缩写必填` },
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
						</a-row>
					</a-col>
					<a-col span="24">
						<a-form-item label="企业注册地址">
							<a-row
								type="flex"
								style="display: flex"
							>
								<a-cascader
									class="form-item-city-select"
									style="width: 182px"
									:getPopupContainer="getPopupContainer"
									:options="residences"
									placeholder="请选择城市"
									:allowClear="false"
									v-decorator="[
										`area`,
										{
											rules: [
												{
													type: 'array',
													required: true,
													message: `企业注册地址必填`
												}
											]
										}
									]"
								/>
								<a-input
									class="form-item-address-input"
									style="width: 646px"
									placeholder="请输入注册详细地址"
									v-decorator="[
										`address`,
										{
											rules: [
												{
													required: true,
													message: `详细地址必填`
												}
											]
										}
									]"
								/>
							</a-row>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPopupContainer, encryptedData } from '@/v2/utils/factory';
import { API_UPLOAD, API_TianYanChaKeyword } from '@/v2/center/person/api';
import {
	API_USERCENTERGETAPPLYCOMPANYAUTH,
	API_COMPANYAUTHGETABBREVIATIONSPELL,
	API_COMPANTGETCOMPANYINFO,
	API_COMPANYAUTHCHECKCOMPANYNAME,
	API_CHECKIDCARD,
	API_COMPANYAUTHCHECKCOMPANYUSCC
} from '@/v2/api/account';
import { debounce } from 'lodash';
import { area } from '@sub/utils/area.js';
import { formBase } from './formConfig';
import { filePreview } from '@/v2/utils/file';
import iUpload from '@/v2/components/upload.vue';
import imageViewer from '@/v2/components/imageViewer.vue';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		fileListbizLicenseImg: {
			type: Array,
			default: () => []
		},
		companyChangeType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			bizLicenseImgExample: systemConfig.accountInfo.bizLicenseImgExample,
			residences: area,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			formBase,
			action: API_UPLOAD,
			form: this.$form.createForm(this, { name: 'BaseInfoForm', onValuesChange: this.onValuesChange }),
			maxLength: 200,
			fetching: false,
			companyNameList: [],
			isGroup: false,
			isSubmit: false,
			defaultCompanyInfo: {},
			systemConfig
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isDisabled() {
			return this.$route.query.type === 'edit';
		},
		companyType() {
			if (this.$route.query.type === 'edit') {
				return this.VUEX_ST_COMPANYSUER.company.companyType;
			}
			return this.$route.query.type;
		},
		companyChangeTypeDesc() {
			return this.companyChangeType;
		}
	},
	components: {
		iUpload,
		imageViewer
	},
	methods: {
		getPopupContainer,
		getFormValues() {
			return this.form.getFieldsValue();
		},
		initFieldsValue(values) {
			this.defaultCompanyInfo = values;
			console.log('values',values)
			this.$nextTick(() => {
				this.form.setFieldsValue({
					...values
				})
			})
		},
		submit() {
			return new Promise((resolve, reject) => {
				this.isSubmit = true;
				this.form.validateFieldsAndScroll((errors, values) => {
					if (!errors) {
						const cloneValues = cloneDeep(values);
						cloneValues.licenceEndDate = cloneValues.licenceEndDate ? moment(cloneValues.licenceEndDate).format('YYYY-MM-DD') : null;
						cloneValues.establishDate = cloneValues.establishDate ? moment(cloneValues.establishDate).format('YYYY-MM-DD') : null;
						this.isSubmit = false;
						resolve(cloneValues);
					}
					reject(errors);
				});
			});
		},
		initFormValues() {
			this.form.setFieldsValue({
				agentIsLegalPerson: false
			});
		},
		onValuesChange(props, values) {
			if (Object.keys(values).length === 0) {
				return;
			}
			this.$nextTick(() => {
				this.$emit('onValuesBaseInfoChange', this.form.getFieldsValue());
			});
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},
		getAbbrPinYin(e) {
			//根据企业简称获取简称拼音
			let value = typeof e === 'object' ? e.target.value : e;
			if (!value) {
				return;
			}
			API_COMPANYAUTHGETABBREVIATIONSPELL({ abbreviation: value }).then(res => {
				if (res.success) {
					this.form.setFieldsValue({
						abbreviationSpell: res.data
					});
				}
			});
		},
		onChangeLicenseEndDateIsLongValid() {
			this.form.resetFields(['licenceEndDate']);
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
		handleCompanyNameSearch: debounce(function (name) {
			this.companyNameList = [];
			this.fetching = true;
			if (!name) return;
			API_TianYanChaKeyword({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.companyNameList = res.data || [];
				}
			});
		}, 300), //获取企业名称列表
		getValid(v) {
			const valids = {
				bizLicenseNo: this.CheckSocialCreditCode,
				name: this.checkCompanyName
			};
			return valids[v] || '';
		},
		// 校验信用代码 CheckSocialCreditCode
		CheckSocialCreditCode(rule, value, callback) {
			if (this.handleNullValue(value)) {
				callback();
				return;
			}
			const type = this.$route.query.type === 'edit' ? this.defaultCompanyInfo.authCompanyType : this.$route.query.type;
			if (this.$route.query.type === 'edit') {
				callback();
				return;
			}
			API_COMPANYAUTHCHECKCOMPANYUSCC({
				uscc: value,
				authCompanyType: type
			}).then(res => {
				if (res.success) {
					if (!res.data.result && res.data.message) {
						callback(res.data.message);
						return;
					}
				}
				callback();
			});
		},
		// 请求后端接口判断公司名称
		checkCompanyName(rule, value, callback) {
			if (this.handleNullValue(value) || this.isSubmit) {
				callback();
				return;
			}
			const type = this.$route.query.type === 'edit' ? this.defaultCompanyInfo.authCompanyType : this.$route.query.type;
			API_COMPANYAUTHCHECKCOMPANYNAME({
				name: value,
				authCompanyType: type
			})
				.then(r => {
					if (r.data.result) {
						if (r.data.message) {
							this.$message.info(r.data.message);
						}
						// 企业存在
						this.companyDoubt = '';
						if (this.isSave) {
							callback();
							return;
						}
						callback();
						API_COMPANTGETCOMPANYINFO({ name: value }).then(res => {
							if (res.success) {
								if (this.$route.query.type !== 'edit') {
									this.form.resetFields([
										'legalPersonName',
										'bizLicenseNo',
										'establishDate',
										'licenceEndDate',
										'companyOrgType',
										'scope'
									]);
								}
								if (res.data) {
									this.$emit('updateCompanyInfo', res.data);
									if (this.$route.query.type !== 'edit') {
										this.form.resetFields([
											'legalPersonName',
											'bizLicenseNo',
											'establishDate',
											'licenceEndDate',
											'companyOrgType',
											'scope'
										]);
									}
									const { address, operName, area, abbreviation, creditCode, startDate, teamEnd, companyOrgType, scope } =
										res.data;
									this.form.setFieldsValue({
										legalPersonName: operName,
										legalRepresentative: operName,
										address: area ? address : null,
										abbreviation: abbreviation ? abbreviation : this.form.getFieldValue('abbreviation'),
										abbreviationSpell: this.form.getFieldValue('abbreviationSpell'),
										area: area && area.split('/'),
										establishDate: startDate && moment(startDate),
										licenceEndDate: teamEnd && moment(teamEnd),
										licenseEndDateIsLongValid: !teamEnd ? true : false,
										companyOrgType,
										scope
									});
									if (this.$route.query.type !== 'edit') {
										this.form.setFieldsValue({
											bizLicenseNo: creditCode,
										});
									}
									if (abbreviation) {
										this.getAbbrPinYin(abbreviation);
									}
									this.form.validateFieldsAndScroll(['bizLicenseNo'], () => {});
									this.validIdCard('legalPersonName');
								} else {
									this.companyDoubt = '该企业可能不存在，请确认企业名称输入完整';
								}
							}
						});
					} else {
						callback(r.data.message);
					}
				})
				.finally(() => {
					this.isSave = false;
				});
		},
		// 校验真实身份证 blur
		async validIdCard(fieldStr) {
			let name = '';
			let idCard = '';
			if (fieldStr == 'legalPersonCardNo' || fieldStr == 'legalPersonName') {
				name = this.form.getFieldValue('legalPersonName');
				idCard = this.form.getFieldValue('legalPersonCardNo');
				if (!this.handleNullValue(name) && !this.handleNullValue(idCard)) {
					this.legalPersonError = -1;
					API_CHECKIDCARD({ name, idCard: await encryptedData(idCard) }).then(res => {
						if (!res.data.result) {
							this.legalPersonError = res.data.message;
						} else {
							this.legalPersonError = '';
						}
					});
				}
			}

			if (fieldStr == 'agentPersonName' || fieldStr == 'agentPersonCardNo') {
				name = this.form.getFieldValue('agentPersonName');
				idCard = this.form.getFieldValue('agentPersonCardNo');
				if (!this.handleNullValue(name) && !this.handleNullValue(idCard)) {
					this.agentPersonError = -1;
					API_CHECKIDCARD({ name, idCard: await encryptedData(idCard) }).then(res => {
						if (!res.data.result) {
							this.agentPersonError = res.data.message;
						} else {
							this.agentPersonError = '';
						}
					});
				}
			}
		},
		setRequired(v) {
			if (v.value == 'address') {
				return false;
			}
			if (v.value == 'licenceEndDate' && this.form.getFieldValue('licenseEndDateIsLongValid')) {
				return false;
			}
			return true;
		},
		changeCompanyDoubt(v) {
			if (v == 'name') {
				this.companyDoubt = '';
			}
		},
		handleCompanyChange() {
			this.uploadKeyList.forEach(item => {
				this[`fileList${item}`] = [];
				this[item] = item;
			});
			this.isGroup = !!this.$route.query.name;
			this.recertification = !!this.$route.query.recertification;
			if (this.recertification) {
				this.isGroup = false;
			}
			if (this.recertification || this.isGroup) {
				setTimeout(() => {
					this.form.resetFields();
					this.form.setFieldsValue({
						name: this.$route.query.name,
						bizLicenseNo: this.$route.query.uscc
					});
					this.$nextTick(() => {
						this.form.validateFieldsAndScroll(['name', 'bizLicenseNo'], () => {});
					});
					this.getDetail();
				}, 100);
				return;
			}
			this.getDetail();
		},
		getDetail() {
			const uscc = this.$route.query.uscc || this.VUEX_ST_COMPANYSUER.companyUscc;
			if (!uscc) {
				return;
			}
			API_USERCENTERGETAPPLYCOMPANYAUTH({ uscc }).then(res => {
				if (res.success) {
					if (res.data) {
						const data = res.data;
						this.id = data.id;
						this.setFields(data);
						setTimeout(() => {
							if (data.licenseEndDateIsLongValid) {
								this.onChangeLicenseEndDateIsLongValid();
							}
							if (data.legalPersonCardIsLongValid) {
								this.onChangeLegalPersonCardIsLongValid();
							}
							if (data.agentPersonCardIsLongValid) {
								this.onChangeAgentPersonCardIsLongValid();
							}
							// 有回显信息可认为法人、代理人身份真实有效
							this.agentPersonError = '';
							this.legalPersonError = '';
						}, 100);
					}
				}
			});
		}
	},
	mounted() {
		this.initFormValues();
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/form-reset.less');
</style>
<style lang="less" scoped>
.slMain {
	background: #fff;
	margin-top: 30px;
	padding: 0 30px;
	box-sizing: border-box;
	/deep/ .ant-form-explain {
		margin-top: 4px;
	}
}
.grid-line {
	width: 100%;
	height: 1px;
	background: rgba(229, 230, 235, 1);
	margin: 10px 0 30px 0;
}
.form-wrap {
	margin-top: 30px;
	padding-bottom: 10px;
	box-sizing: border-box;

	/deep/ .ant-form-item {
		margin-bottom: 20px;
	}

	/deep/ .ant-form-item-control {
		line-height: 32px;
	}

	/deep/ .ant-form-item-label {
		margin-bottom: 10px;
	}
}

.file-upload-wrap {
	display: flex;
	align-items: center;

	/deep/.upload-file-box {
		height: 112px;
		.ant-upload-select-picture-card {
			margin: 0;
			border: none;
		}

		.ant-upload {
			padding: 0;
		}
		.ant-upload-list-picture-card-container {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-list-type-picture-card {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-thumbnail img {
			object-fit: contain;
		}
	}
}

.card-image {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/business-license.png');
	background-size: contain;
}

.upload-desc {
	margin-left: 20px;
	font-size: 14px;

	div {
		height: 20px;
		line-height: 20px;
	}

	color: rgba(0, 0, 0, 0.4);

	div:nth-child(2) {
		margin-top: 9px;
	}
}

.form-item-wrap {
	width: 364px;
}

.form-item-city-select {
	/deep/ input {
		border-right: 0;
		border-radius: 4px 0 0 4px;
	}
}

.form-item-address-input {
	border-radius: 0 4px 4px 0;
}
</style>