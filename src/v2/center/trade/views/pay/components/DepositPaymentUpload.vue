<template>
	<div>
		<a-modal
			:class="handleType != 'detail' ? 'slModal' : 'slModal noFooter'"
			:visible="visible"
			:title="handleType == 'detail' ? '保证金支付凭证信息' : '上传保证金支付凭证'"
			@cancel="visible = false"
			width="690px"
		>
			<a-spin
				tip="上传中..."
				v-if="beginUpload"
				class="loading"
			/>
			<a-form
				:form="form"
				class="slFormDetail"
			>
				<div class="special-label"><label class="ant-form-item-no-colon ant-form-item-required">付款信息</label></div>
				<a-row :gutter="30">
					<a-col :span="12">
						<a-form-item
							label="付款日期"
							:colon="false"
							class="no-require"
						>
							<a-date-picker
								style="width: 100%"
								format="YYYY-MM-DD"
								:disabled="handleType == 'detail'"
								value-format="YYYY-MM-DD"
								placeholder="请选择付款日期"
								v-decorator="[`paymentDate`, { rules: [{ required: true, message: '付款日期必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="付款人户名"
								:colon="false"
								class="no-require"
							>
								<a-input
									disabled
									v-decorator="[
										'paymentCompanyName',
										{
											rules: [{ required: true, message: '请填写付款人户名' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="付款人账号"
								:colon="false"
								class="no-require"
							>
								<a-select
									v-if="payBankInfo && payBankInfo.length"
									:getPopupContainer="getPopupContainer"
									@select="payBankChangeSelect"
									:disabled="handleType == 'detail'"
									v-decorator="[
										'paymentAccountNo',
										{
											rules: [{ required: true, message: '请选择付款账号' }]
										}
									]"
									placeholder="请选择付款账号"
								>
									<a-select-option
										v-for="(items, index) in payBankInfo"
										:key="index"
										:value="items.bankName + '-' + items.accountNo"
									>
										<a-tooltip>
											<template slot="title">{{ items.bankName }}-{{ items.accountNo }}</template>
											<span>{{ items.bankName }}-{{ items.accountNo }}</span>
										</a-tooltip>
									</a-select-option>
								</a-select>
								<template v-else>
									<a-tooltip
										v-if="this.form.getFieldValue('paymentAccountNo') && this.form.getFieldValue('paymentAccountNo').length > 20"
									>
										<template slot="title">{{ this.form.getFieldValue('paymentAccountNo') }}</template>
										<a-input
											:maxLength="200"
											placeholder="请填写付款账号"
											:disabled="handleType == 'detail'"
											v-decorator="[
												'paymentAccountNo',
												{
													rules: [{ required: true, message: '请填写付款账号' }]
												}
											]"
										>
										</a-input>
									</a-tooltip>
									<a-input
										v-else
										:maxLength="200"
										placeholder="请填写付款账号"
										:disabled="handleType == 'detail'"
										v-decorator="[
											'paymentAccountNo',
											{
												rules: [{ required: true, message: '请填写付款账号' }]
											}
										]"
									>
									</a-input>
								</template>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="付款人开户行"
								:colon="false"
								class="no-require"
							>
								<a-tooltip
									v-if="this.form.getFieldValue('paymentBankName') && this.form.getFieldValue('paymentBankName').length > 20"
								>
									<template slot="title">{{ this.form.getFieldValue('paymentBankName') }}</template>
									<a-input
										:maxLength="200"
										:disabled="Boolean(payBankInfo.length) || handleType == 'detail'"
										placeholder="请填写付款人开户行"
										v-decorator="[
											'paymentBankName',
											{
												rules: [{ required: true, message: '请填写付款人开户行' }]
											}
										]"
									>
									</a-input>
								</a-tooltip>
								<a-input
									v-else
									:maxLength="200"
									:disabled="Boolean(payBankInfo.length) || handleType == 'detail'"
									placeholder="请填写付款人开户行"
									v-decorator="[
										'paymentBankName',
										{
											rules: [{ required: true, message: '请填写付款人开户行' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<div class="special-label"><label class="ant-form-item-no-colon ant-form-item-required">收款信息</label></div>
				<a-row :gutter="30">
					<a-col :span="12">
						<a-form-item
							label="收款金额"
							:colon="false"
							class="no-require"
						>
							<img
								src="@/v2/assets/imgs/common/money-icon.png"
								alt=""
								class="moneyIcon"
							/>
							<a-input
								class="moneyInput"
								placeholder="请填写收款金额"
								:disabled="handleType == 'detail'"
								v-decorator="[
									'collectionAmount',
									{
										rules: [
											{ required: true, message: '请填写收款金额' },
											{ validator: validMoney },
											{
												pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
												message: '付款金额为正数，最多两位小数'
											}
										]
									}
								]"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="收款人户名"
								:colon="false"
								class="no-require"
							>
								<a-input
									disabled
									v-decorator="[
										'collectionCompanyName',
										{
											rules: [{ required: true, message: '请输入收款人户名' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="收款人账号"
								:colon="false"
								class="no-require"
							>
								<a-select
									:getPopupContainer="getPopupContainer"
									@select="receiveBankChangeSelect"
									:disabled="handleType == 'detail'"
									v-decorator="[
										'collectionAccountNo',
										{
											rules: [{ required: true, message: '请选择收款人账号' }]
										}
									]"
									placeholder="请选择收款人账号"
								>
									<a-select-option
										v-for="(items, index) in receiveBankInfo"
										:key="index"
										:value="items.bankName + '-' + items.accountNo"
									>
										<a-tooltip>
											<template slot="title">{{ items.bankName }}-{{ items.accountNo }}</template>
											<span>{{ items.bankName }}-{{ items.accountNo }}</span>
										</a-tooltip>
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row>
							<a-form-item
								label="收款人开户行"
								:colon="false"
								class="no-require"
							>
								<a-input
									disabled
									placeholder="请填写收款人开户行"
									v-decorator="[
										'collectionBankName',
										{
											rules: [{ required: true, message: '请填写收款人开户行' }]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-form-item
					label="上传附件"
					class="ant-form-item-required attach ant-form-item-no-colon"
					:colon="false"
				>
					<div
						class="df"
						@mouseenter="clearCache"
					>
						<div
							class="upload-box"
							v-for="(item, index) in realFileList"
							:key="index"
						>
							<img
								class="del"
								@click="del(index)"
								src="@/v2/assets/imgs/storage/steel/del2.png"
								alt=""
								v-if="handleType != 'detail'"
							/>
							<img
								v-if="isPdf(item.url)"
								src="@/assets/imgs/pdf4.jpg"
								:alt="item.text"
								@click="handlePreview(item)"
							/>
							<img
								v-else
								:src="item.url"
								@click="handlePreview(item)"
								alt=""
							/>
						</div>
						<a-upload
							name="file"
							class="picture-card"
							list-type="picture-card"
							:disabled="handleType == 'detail'"
							:headers="headers"
							:accept="accept"
							:fileList="fileList"
							v-decorator="['uploadFiles']"
							:showUploadList="false"
							:beforeUpload="beforeUpload"
						>
							<div
								class="btn btn1"
								v-if="!realFileList || !realFileList.length"
							>
								<img
									src="@/v2/assets/imgs/storage/steel/upload.png"
									alt=""
								/>
							</div>
						</a-upload>
					</div>
				</a-form-item>
				<div class="tip">
					<p>当前附件类型您只能上传一份PDF文件或一张图片(支持图片格式:JPG、JPEG、PNG、BMP)</p>
					<p>单个附件大小不得超过100M</p>
				</div>
			</a-form>
			<template
				slot="footer"
				v-if="handleType != 'detail'"
			>
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
				>
					取消
				</a-button>
				<a-button
					key="submit"
					style="margin-left: 20px"
					type="primary"
					@click="submit"
					:loading="beginUpload"
				>
					提交
				</a-button>
			</template>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { commonUpload } from 'api';
import moment from 'moment';
import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_CYGetPaymentAccountVo } from '@/v2/center/trade/api/pay';
export default {
	props: {
		fileType: {
			//允许文件类型
			default: () => {
				return ['jpg', 'jpeg', 'png', 'pdf', 'bmp', 'BMP', 'PNG', 'JPG', 'JPEG', 'PDF'];
			}
		},
		handleType: {
			default: ''
		},
		//文件列表
		fileData: {
			type: Array,
			default: () => {
				return [];
			}
		},
		//是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		orderDetail: {
			type: [Object],
			default: () => ({})
		},
		businessLineFullId: {
			default: ''
		},
		fileTypeInfo: {
			type: [Object],
			default: () => ({})
		}
	},
	data() {
		return {
			getPopupContainer,
			fileList: [],
			beginUpload: false, //附件上传中,禁止文件操作
			visible: false,
			form: this.$form.createForm(this),
			uploadInfo: {
				fullPath: ''
			},
			previewImg: '',
			uploadFileList: [],
			realFileList: [],
			editIndex: null,
			type: 'add',
			payBankInfo: [],
			receiveBankInfo: [],
			info: {}
		};
	},
	watch: {
		beginUpload(val) {
			// 文件上传状态，如果需要自行控制
			if (this.$listeners['beginUploadChange']) {
				this.$emit('beginUploadChange', val);
			}
		},
		uploadFileList(val) {
			if (val.length) {
				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		accept() {
			const list = this.fileType.map(el => `.${el}`);
			return list.join();
		}
	},
	methods: {
		isPdf(url) {
			return url.includes('.pdf') || url.includes('.PDF');
		},
		payBankChangeSelect(e) {
			this.payBankInfo.forEach(item => {
				if (e.includes(item.accountNo)) {
					this.form.setFieldsValue({
						paymentBankName: item.subbranchName
					});
				}
			});
		},
		receiveBankChangeSelect(e) {
			this.receiveBankInfo.forEach(item => {
				if (e.includes(item.accountNo)) {
					this.form.setFieldsValue({
						collectionBankName: item.subbranchName
					});
				}
			});
		},
		//校验收款金额
		validMoney(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 999999999) {
				callback('金额不超过999999999,最多两位小数');
				return;
			}
			callback();
		},
		getBankInfo() {
			return API_CYGetPaymentAccountVo({
				orderNo: this.orderDetail.serialNo,
				businessLineId: this.businessLineFullId,
				contractNo: this.orderDetail.contractNo
			}).then(res => {
				if (res.success) {
					this.info = res.data;
					this.receiveBankInfo = res.data.collectionAccountInfos || [];
					this.payBankInfo = res.data.paymentAccountInfos || [];
				}
			});
		},
		async open() {
			return new Promise(async resolve => {
				await this.getBankInfo();
				this.visible = true;
				this.uploadFileList = [];
				this.realFileList = [];
				this.type = 'add';
				this.form.resetFields();
				this.$nextTick(() => {
					this.form.setFieldsValue({
						paymentCompanyName: this.info.paymentCompanyName || this.orderDetail.buy,
						collectionCompanyName: this.info.collectionCompanyName || this.orderDetail.sell
					});
					if (this.receiveBankInfo && this.receiveBankInfo.length === 1) {
						this.form.setFieldsValue({
							collectionAccountNo: this.receiveBankInfo[0].bankName + '-' + this.receiveBankInfo[0].accountNo,
							collectionBankName: this.receiveBankInfo[0].subbranchName
						});
						this.receiveBankChangeSelect(this.receiveBankInfo[0].bankName + '-' + this.receiveBankInfo[0].accountNo);
					}
					if (this.payBankInfo && this.payBankInfo.length === 1) {
						this.form.setFieldsValue({
							paymentAccountNo: this.payBankInfo[0].bankName + '-' + this.payBankInfo[0].accountNo,
							paymentBankName: this.payBankInfo[0].subbranchName
						});
						this.payBankChangeSelect(this.payBankInfo[0].bankName + '-' + this.payBankInfo[0].accountNo);
					}
				});
				resolve(true);
			});
		},
		editOpen(item, index) {
			return new Promise(async resolve => {
				await this.getBankInfo();
				this.visible = true;
				this.editIndex = index;
				this.type = 'edit';
				this.uploadFileList = [];
				this.realFileList = item.fileList;
				this.$nextTick(() => {
					this.form.setFieldsValue({
						paymentDate: item.paymentDate,
						paymentCompanyName: item.paymentCompanyName,
						paymentAccountNo: item.paymentAccountNo,
						paymentBankName: item.paymentBankName,
						collectionAmount: item.collectionAmount,
						collectionCompanyName: item.collectionCompanyName,
						collectionAccountNo: item.collectionAccountNo,
						collectionBankName: item.collectionBankName,
						fileInfo: item.fileInfo
					});
				});
				resolve(true);
			});
		},
		clearCache() {
			this.uploadFileList = [];
		},
		//上传前校验
		beforeUpload(file) {
			let fileType = this.fileType;
			const flag = fileType.some(el => file.name.includes(el));
			if (!flag) {
				this.$message.error('当前文件格式不支持');
				return;
			}

			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return true;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return true;
			}
			this.uploadFileList.push(file);
			return false;
		},
		// 1.上传
		async handleUpload(file) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			try {
				const res = await commonUpload(formData);
				const obj = res.data;
				obj.realUrl = `${obj.fileUrl}`;
				obj.url = obj.fileUrl;
				obj.attachId = '';
				obj.ext = file.type;
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
				(obj.name = obj.fileName),
					(obj.key = this.fileTypeInfo.type),
					(obj.type = this.fileTypeInfo.type),
					(obj.typeName = this.fileTypeInfo.typeDesc),
					(obj.dataSource = 1), // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
					this.realFileList.push(obj);
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
				this.beginUpload = false;
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		del(index) {
			this.realFileList.forEach((el, i, arr) => {
				if (index == i) {
					arr.splice(i, 1);
				}
			});
			this.$forceUpdate();
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl;

			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (['rar', 'zip'].includes(fileFormat)) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		//查看附件
		fileLook(data) {
			this.$refs.fileLook.fileLook(data);
		},
		//删除附件
		toDelete(data) {
			let fileData = this.fileData;
			if (data.uid) {
				//表示当前文件为新上传删除
				this.fileList = this.fileList.filter(item => item.uid !== data.uid);
				fileData = fileData.filter(item => item.uid !== data.uid);
			} else if (data.id) {
				fileData = fileData.filter(item => item.id !== data.id);
			}
			this.$emit('fileChange', fileData);
		},
		fileDelte(item) {
			this.fileData.forEach((el, i, arr) => {
				if (el.id == item.id) {
					arr.splice(i, 1);
				}
			});
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					/** 反查类型 */
					if (!this.realFileList.length) {
						this.$message.error('请上传附件');
						return;
					}
					delete values.uploadFiles;
					const obj = {
						...values,
						fileInfo: this.realFileList[0],
						paymentCompanyUscc: this.info.paymentCompanyUscc,
						collectionCompanyUscc: this.info.collectionCompanyUscc
					};
					this.$emit('send', obj, this.type);
					this.visible = false;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slTitleAssisBut {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.tableTip {
	padding: 20px 30px;
	font-size: 12px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #8191a9;
	line-height: 20px;
}
.slModal {
	/deep/ .ant-modal {
		// height: 426px;
	}
}
/deep/ .ant-form-item {
	margin-bottom: 0px;
}
/deep/ .ant-modal-body {
	padding: 30px 20px;
}
.picture-card {
	/deep/ .ant-upload-select-picture-card {
		box-sizing: border-box;
		width: 90px;
		height: 90px;
		/* 元素/BG */
		background: #f3f5f6;
		/* 元素/Line */
		border: 1px dashed #e5e6eb;
		border-radius: 4px;
	}
}
/dee/ .ant-modal-title {
	font-weight: 600;
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 12px;
	margin-top: 8px;
}
/deep/ .ant-form-item-control {
	line-height: 1;
}
/deep/ .ant-upload-picture-card-wrapper {
	width: inherit;
	margin-bottom: 6px;
}
.upload-box {
	width: 90px;
	height: 90px;
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	margin-right: 14px;
	margin-bottom: 14px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	.file {
		color: #4682f3;
		cursor: pointer;
		font-size: 20px;
	}
	.del {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 14px;
		height: 14px;
		background: #6f6f6f;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
}
/deep/ .ant-checkbox-inner {
	border-radius: 6px;
}
/deep/ .ant-checkbox-wrapper {
	margin-left: 0;
	width: 16.666%;
	margin-bottom: 20px;
}
/deep/ .ant-checkbox + span {
	margin-left: 10px;
	padding-left: 0;
	margin-right: 0;
}
/deep/ .ant-form-item-control-wrapper {
	margin-top: 10px;
}
/deep/ .ant-form-item-no-colon {
	font-weight: 600;
	&::before {
		font-weight: 400;
	}
}
.no-require {
	/deep/ .ant-form-item-no-colon {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		&::before {
			content: '';
		}
	}
	/deep/ .ant-form-item-control-wrapper {
		margin-top: 0fr;
	}
}
.calendar,
.select {
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: middle;
	background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
	background-size: contain;
	line-height: 38px !important;
	top: 40%;
}
.df {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.attach::before {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	font-family: SimSun, sans-serif;
	line-height: 1;
	content: '*';
	vertical-align: middle;
	position: relative;
	top: -4px !important;
}
.slModal {
	/deep/ .ant-form-item-no-colon {
		color: rgba(0, 0, 0, 0.8);
	}
	/deep/.ant-modal-body {
		padding: 20px;
	}
	.slFormDetail {
		padding: 0;
		margin: 0;
		/deep/.ant-form-item-control-wrapper {
			margin-top: 0;
		}
	}
	.attach {
		height: auto !important;
		/deep/.ant-form-item-label > label {
			color: rgba(0, 0, 0, 0.8);
		}
	}
	/deep/.ant-form label {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 500;
	}
	.special-label {
		line-height: 22px;
		margin-bottom: 16px;
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
	}
	/deep/.ant-form-item-required {
		&::before {
			position: relative;
			top: 1px;
		}
	}
	.moneyIcon {
		position: absolute;
		width: 8px;
		height: 10px;
		z-index: 2;
		left: 10px;
		top: 5px;
	}
	.moneyInput {
		padding-left: 25px;
		width: 100%;
	}
	/deep/.ant-select-disabled {
		color: rgba(0, 0, 0, 0.8) !important;
	}
}
.slModal.noFooter {
	/deep/.ant-modal-footer {
		display: none !important;
	}
}
.loading {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	z-index: 999;
}
</style>
