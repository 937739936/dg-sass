<template>
	<div>
		<!-- 附件表格 -->
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table-file"
				:bordered="false"
				:rowKey="(record, index) => String(index)"
				:dataSource="fileData"
				:pagination="false"
				:loading="beginUpload"
				:scroll="{ x: true }"
			>
				<a-space
					slot="typeName"
					slot-scope="action, items"
				>
					{{ action || items.typeDesc }}
				</a-space>
				<a-space
					slot="name"
					slot-scope="action, items"
				>
					<span v-if="disabled">{{ action }}</span>
					<a
						v-if="!disabled"
						href="javascript:void(0)"
						@click="handlePreview(items)"
						>{{ action }}</a
					>
				</a-space>
				<a-space
					slot="action"
					slot-scope="action, items"
				>
					<a
						href="javascript:void(0)"
						v-if="!disabled"
						@click="fileDelte(items)"
					>
						删除
					</a>
					<a
						href="javascript:void(0)"
						v-if="disabled"
						@click="handlePreview(items)"
					>
						查看
					</a>
				</a-space>
			</a-table>
		</div>
		<a-modal
			class="slModal"
			:visible="visible"
			title="上传附件"
			@cancel="visible = false"
			width="424px"
		>
			<a-form :form="form">
				<a-form-item label="附件类型">
					<a-select v-decorator="[`type`, { rules: [{ required: true, message: `请选择附件类型`, type: 'string' }] }]">
						<a-select-option
							v-for="item in optList"
							:key="item.value"
							:value="item.value"
							>{{ item.label }}</a-select-option
						>
					</a-select>
				</a-form-item>

				<a-form-item label="附件">
					<div class="df">
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
							/>
							<a-icon
								class="file"
								v-if="!isImg(item)"
								type="file"
								@click="handlePreview(item)"
							/>
							<img
								v-else
								:src="item.fullPath"
								@click="handlePreview(item)"
								alt=""
							/>
						</div>

						<a-upload
							name="file"
							class="picture-card"
							list-type="picture-card"
							:multiple="multiple"
							v-show="!uploadInfo.fullPath"
							:headers="headers"
							:accept="accept"
							:fileList="fileList"
							v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
							:showUploadList="false"
							:beforeUpload="beforeUpload"
							@change="fileChange"
						>
							<div
								class="btn btn1"
								@click="addFile"
							>
								<img
									src="../../../assets/imgs/storage/steel/upload.png"
									alt=""
								/>
							</div>
						</a-upload>
					</div>
				</a-form-item>
				<div class="tip">
					<p>附件上传要求：</p>
					<p>可支持格式为{{ fileType.join() }}的附件，单个附件大小不得超过100M的文件。</p>
				</div>
			</a-form>
			<template slot="footer">
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
					确定
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
import { commonUpload } from '@/v2/center/steelStorage/api';
import { mapGetters } from 'vuex';

import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';

//不同模块允许不同的类型文件
export default {
	components: {},
	props: {
		multiple: {
			// 同时上传多个文件
			default: false
		},
		fileType: {
			//允许文件类型
			default: () => {
				return ['jpg', 'jpeg', 'png', 'pdf', 'bmp'];
			}
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
		},
		columns: {
			default: () => {
				return [
					{
						title: '附件类型',
						dataIndex: 'typeName',
						scopedSlots: { customRender: 'typeName' }
					},
					{
						title: '附件',
						dataIndex: 'name',
						scopedSlots: { customRender: 'name' }
					},
					{
						title: '操作',
						key: 'action',
						scopedSlots: { customRender: 'action' }
					}
				];
			}
		}
	},
	data() {
		return {
			fileList: [],
			beginUpload: false, //附件上传中,禁止文件操作
			visible: false,
			form: this.$form.createForm(this),
			uploadInfo: {
				fullPath: ''
			},
			previewImg: '',
			realFileList: [],
			uploadFileList: []
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
		/** 判断 是否是图片 */
		isImg(data) {
			const arr = ['jpg', 'jpeg', 'png', 'bmp'];
			if (!data.fullPath) return false;
			const index = data.fullPath.lastIndexOf('.');
			const rext = data.fullPath.substring(index + 1) || '';
			return arr.includes(rext.toLocaleLowerCase());
		},
		addFile() {
			this.uploadFileList = [];
		},
		open() {
			this.visible = true;
			this.uploadInfo = {};
			this.uploadFileList = [];
			this.realFileList = [];
			this.$nextTick(() => {
				this.form.resetFields();
			});
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
			this.handleUpload(file);
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
				obj.fullPath = `${ENV.BASE_NET}${res.data.path}`;
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
		handlePreview(data = this.uploadInfo) {
			let url = data.path;
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
			if (url.indexOf(ENV.BASE_API) == -1) {
				url = ENV.BASE_NET + url;
			}
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
					const item = this.optList.find(el => el.value == values.type);
					this.realFileList.forEach(pro => {
						const obj = {
							typeName: item.label,
							...pro,
							name: pro.name,
							type: item.value
						};
						this.fileData.push(obj);
					});
					this.$emit('fileChange', this.fileData);
					this.visible = false;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');

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
		height: 426px;
	}
}
/deep/ .ant-form-item {
	margin-bottom: 10px;
}
/deep/ .ant-modal-body {
	padding-top: 20px;
}
.picture-card {
	/deep/ .ant-upload-select-picture-card {
		box-sizing: border-box;
		width: 60px;
		height: 60px;
		/* 元素/BG */
		background: #f3f5f6;
		/* 元素/Line */
		border: 1px dashed #e5e6eb;
		border-radius: 4px;
	}
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 12px;
}
/deep/ .ant-form-item-control {
	line-height: 1;
}
.upload-box {
	width: 60px;
	height: 60px;
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 14px;
	margin-bottom: 14px;
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
.df {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
/deep/.ant-upload-picture-card-wrapper {
	width: inherit;
	margin-bottom: 6px;
}
</style>
