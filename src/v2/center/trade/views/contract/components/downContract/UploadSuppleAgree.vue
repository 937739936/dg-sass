<template>
	<div>
		<a-modal
			class="slModal"
			:visible="visible"
			title="上传补充协议"
			@cancel="visible = false"
			width="920px"
		>
			<a-spin
				tip="上传中..."
				v-if="beginUpload"
				class="loading"
			/>
			<a-form :form="form">
				<a-row>
					<a-form-item
						label="变更项目"
						:colon="false"
					>
						<a-checkbox-group
							v-decorator="['changeItem', { rules: [{ required: true, message: '请选择变更项' }] }]"
							:disabled="handleType == 'detail'"
						>
							<a-checkbox
								v-for="(item, index) in changeItemEnums"
								:key="item.value"
								:value="item.value"
							>
								<span style="color: rgba(0, 0, 0, 0.8)"> {{ item.text }}</span>
							</a-checkbox>
						</a-checkbox-group>
					</a-form-item>
				</a-row>
				<div class="ant-col ant-form-item-label">
					<label class="ant-form-item-no-colon ant-form-item-required ant-form-item-no-colon">补协信息</label>
				</div>
				<a-row style="margin-top: 0px">
					<a-col :span="8">
						<a-form-item
							label="补协编号"
							:colon="false"
							class="no-require"
						>
							<a-input
								placeholder="请填写补协编号"
								v-decorator="[
									`paperSupplementalAgreementNo`,
									{
										rules: [{ required: true, message: `补协编号必填` }]
									}
								]"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							label="补协执行日期"
							:colon="false"
							class="no-require"
						>
							<a-range-picker
								format="YYYY-MM-DD"
								:disabled="handleType == 'detail'"
								value-format="YYYY-MM-DD"
								:placeholder="['开始时间', '结束时间']"
								v-decorator="[`executeDate`, { rules: [{ required: true, message: '执行期必填' }] }]"
							/>
							<span
								slot="extra"
								v-if="execDateDevMax || execDateLengthMax"
							>
								<span v-if="execDateDevMax"> 执行期与当前日期偏差较多，如果实际如此，请忽略提示。 </span>
								<span v-if="execDateLengthMax"> 执行期过长，如果实际如此，请忽略提示。 </span>
							</span>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-item
								label="补协签订日期"
								:colon="false"
								class="no-require"
							>
								<a-date-picker
									:disabled="handleType == 'detail'"
									style="width: 100%"
									placeholder="请选择签订日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`signDate`,
										{
											rules: [{ required: true, message: `签订日期必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>

								<span
									slot="extra"
									v-if="doubleSignTimeDevMax"
								>
									补协签订日期与当前日期偏差较多，如果实际如此，请忽略提示；
								</span>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-item
								label="补协签章状态"
								:colon="false"
								class="no-require"
							>
								<a-select
									:getPopupContainer="getPopupContainer"
									placeholder="请选择合同签订状态"
									:disabled="handleType == 'detail'"
									v-decorator="[
										`signStatus`,
										{
											initialValue: 2,
											rules: [
												{
													required: true,
													message: `合同签订状态必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in signStatus"
										:key="index"
										:value="items.value"
									>
										{{ items.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-form-item
					label="附件"
					style="margin-top: 20px"
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
								:src="item.realUrl"
								@click="handlePreview(item)"
								alt=""
							/>
						</div>
						<a-upload
							name="file"
							class="picture-card"
							list-type="picture-card"
							:multiple="true"
							v-if="handleType != 'detail'"
							:headers="headers"
							:accept="accept"
							:fileList="fileList"
							v-decorator="['uploadFiles']"
							:showUploadList="false"
							:beforeUpload="beforeUpload"
							@change="fileChange"
						>
							<div class="btn btn1">
								<img
									src="@/v2/assets/imgs/storage/steel/upload.png"
									alt=""
								/>
							</div>
						</a-upload>
					</div>
				</a-form-item>
				<div class="tip">
					<p>当前附件类型您只能上传一份PDF文件或多张图片(支持图片格式:JPG、JPEG、PNG、BMP)</p>
					<p>单个附件大小不得超过100M，请上传已签章合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息</p>
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
import { API_UPLOAD_FILE, API_DOWNLPREVIEWTE } from '@/v2/api/upload';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';

import { commonUpload, API_UPLOAD_WATER_MARk } from 'api';
import moment from 'moment';

import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';

import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

//不同模块允许不同的类型文件
export default {
	components: {},
	props: {
		fileType: {
			//允许文件类型
			default: () => {
				return ['jpg', 'jpeg', 'png', 'pdf', 'bmp', 'PNG', 'JPG', 'JPEG', 'PDF'];
			}
		},
		handleType: {
			default: ''
		},
		optList: {
			default: () => {
				return [];
			}
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
		}
	},
	data() {
		return {
			getPopupContainer,
			fileList: [],
			beginUpload: false, //附件上传中,禁止文件操作
			visible: false,
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			uploadInfo: {
				fullPath: ''
			},
			previewImg: '',
			changeItemEnums: filterCodeByKey('changeItemEnums'), // 补充协议变更项
			execDateDevMax: false,
			execDateLengthMax: false,
			doubleSignTimeDevMax: false,
			uploadFileList: [],
			realFileList: [],
			editIndex: null,
			type: 'add'
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
				const list = this.realFileList;
				const rule = '.jpg,.png,.gif,jpeg,.bmp,.JPEG,.PNG,.JPG';

				let flag = true;
				// 如果上传的文件 有 pdf 同时 还有 图片
				if (val.length > 1) {
					flag = val.every(file => {
						const fileFormat = file.name.split('.').pop().toLowerCase();
						return rule.includes(fileFormat);
					});

					if (!flag) {
						this.$message.error('PDF和图片只允许上传一个格式，请重新选择');
						return;
					}

					flag = val.every(file => {
						const fileFormat = file.name.split('.').pop().toLowerCase();
						return fileFormat.includes('pdf');
					});
					if (flag) {
						this.$message.error('只允许上传一张pdf文件，请重新选择');
						return;
					}
					/** 如果已经存在pdf 并且上传的是图片*/
					flag = val.every(file => {
						const fileFormat = file.name.split('.').pop().toLowerCase();
						return rule.includes(fileFormat);
					});

					const isExistPdf = list.some(file => (file.fileName || file.name).includes('pdf'));
					if (isExistPdf && flag) {
						this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
						return;
					}
				}
				if (val.length == 1) {
					const fileName = val[0].name;
					const fileFormat = fileName.split('.').pop().toLowerCase();
					/** 如果已经存在pdf 并且上传的是图片*/
					const isExistPdf = list.some(file => (file.fileName || file.name).includes('pdf'));
					if (isExistPdf && fileFormat.includes('pdf')) {
						this.$message.error('只允许上传一张pdf文件，请重新选择');
						return;
					}

					if (isExistPdf && rule.includes(fileFormat)) {
						this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
						return;
					}
					const isExistPng = list.some(file => {
						const fileFormat = (file.fileName || file.name).split('.').pop().toLowerCase();
						return rule.includes(fileFormat);
					});

					// 如果已有图片 上传pdf
					if (isExistPng && fileFormat.includes('pdf')) {
						this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
						return;
					}
				}

				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	computed: {
		signStatus() {
			if (this.$route.query.type == 'buy') {
				return [{ value: 2, text: '双签' }];
			}
			return [
				{ value: 1, text: '单签' },
				{ value: 2, text: '双签' }
			];
		},
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		allowFormatString() {
			if (this.fileType?.length) {
				return this.fileType.join('，');
			} else {
				return '';
			}
		},
		accept() {
			const list = this.fileType.map(el => `.${el}`);
			return list.join();
		},
		//是否有提示
		requireTipArr() {
			let requireTipArr = [];
			if (this.requireTip) {
				if (typeof this.requireTip == 'string') {
					requireTipArr = [this.requireTip];
				} else {
					requireTipArr = this.requireTip;
				}
			}
			return requireTipArr;
		},
		//是否有默认类型
		hasInitialValue() {
			let initialValue = this.initialValue;
			return initialValue.key && initialValue.label;
		}
	},
	methods: {
		isPdf(url) {
			return url.includes('.pdf') || url.includes('.PDF');
		},
		open() {
			this.visible = true;
			this.uploadFileList = [];
			this.realFileList = [];
			this.type = 'add';
			this.$nextTick(() => {
				this.form.resetFields();
			});
		},
		editOpen(item, index) {
			this.visible = true;
			this.editIndex = index;
			this.type = 'edit';
			this.uploadFileList = [];
			this.realFileList = item.fileList;

			this.$nextTick(() => {
				this.form.setFieldsValue({
					changeItem: item.changeItem.map(el => el.value),
					executeDate: item.executeDate,
					signDate: item.signDate,
					signStatus: item.signStatus,
					uploadFiles: item.uploadFiles
				});
			});
		},
		clearCache() {
			this.uploadFileList = [];
		},
		//上传前校验
		beforeUpload(file) {
			let fileType = this.fileType;
			const flag = fileType.some(el => file.name.includes(el));

			let isAllowFormat = false;
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
				this.realFileList.push(obj);
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
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
		//文件上传
		fileChange({ fileList }) {},
		handlePreview(data) {
			let url = data.url || data.fileUrl;

			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(url, '_blank');
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
					window.open(url, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		onValuesChange(props, values) {
			if (values.hasOwnProperty('executeDate')) {
				//当选择签订日期与当前系统日期偏差大于60天时，提示
				if (Math.abs(moment(values.executeDate[0]).diff(moment(), 'days')) > 30) {
					this.execDateDevMax = true;
				} else {
					this.execDateDevMax = false;
				}

				if (moment(values.executeDate[1]).diff(moment(values.executeDate[0]), 'days') > 60) {
					this.execDateLengthMax = true;
				} else {
					this.execDateLengthMax = false;
				}
			}
			if (values.hasOwnProperty('signDate')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.signDate).diff(moment(), 'days')) > 30) {
					this.doubleSignTimeDevMax = true;
				} else {
					this.doubleSignTimeDevMax = false;
				}
			}
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
		//下载
		download(data) {
			// 下载货转证明附件
			if (data.attachId) {
				API_GetDownloadRAR(data.attachId).then(res => {
					comDownload(res, undefined, data.name);
				});
			}
			let url;
			if (data.response) {
				url = data.response.data.fileUrl;
			} else if (data.url) {
				url = data.url;
			} else if (data.path) {
				url = data.path;
			} else {
				return;
			}
			// if (url.indexOf(ENV.BASE_API) == -1) {
			// 	url = ENV.BASE_NET + url;
			// }
			if (url) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url, data.name);
				});
			}
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					/** 反查类型 */
					if (!this.realFileList.length) {
						this.$message.error('请上传附件');

						return;
					}
					// 反查变更项
					const list = values.changeItem;
					const tpl = [];
					this.changeItemEnums.forEach(el => {
						list.forEach(el2 => {
							if (el2 == el.value) {
								tpl.push(el);
							}
						});
					});
					const obj = {
						...values,
						executionDateStart: values.executeDate[0],
						executionDateEnd: values.executeDate[1],
						fileList: this.realFileList,
						changeItem: tpl
					};
					this.$emit('send', obj, this.type);

					// this.fileData.push(obj)
					// this.$emit("fileChange", this.fileData);
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
		color: @primary-color;
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
	width: 280px;
	/deep/ .ant-form-item-no-colon {
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		&::before {
			content: '';
		}
	}
	/deep/ .ant-form-item-control-wrapper {
		margin-top: 0px;
	}
	/deep/.ant-form-item-control {
		height: 50px;
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
}
.slModal {
	/deep/ .ant-modal-title {
		font-weight: 600;
	}
	/deep/ .ant-modal-header {
		padding-left: 20px;
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
