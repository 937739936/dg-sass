<template>
	<div style="position: relative; height: 100%">
		<div>
			<p
				class="title"
				style="font-size: 14px"
			>
				发票附件
			</p>
			<div
				class="des"
				v-if="location != 'detail'"
			>
				<p>
					1.支持上传单个附件大小不超过100M的jpg、jpeg、png、pdf、ofd格式发票文件；
					2.单张图片（jpg、jpeg、png、ofd格式文件）上传不可包含多发票。
				</p>
				<!-- <p>2.单次最大可对10张发票进行识别。</p> -->
			</div>
			<a-divider />
			<!-- 编辑 -->
			<a-row
				type="flex"
				v-if="location != 'detail'"
			>
				<a-col>
					发票总数：{{ passInfo.total }} (通过校验发票数：{{ passInfo.passTotal }}，未通过校验的发票数：{{
						passInfo.noPassTotal
					}})
				</a-col>
				<a-col style="margin-left: 20px"> 识别失败张数：{{ passInfo.failTotal }}</a-col>
			</a-row>
			<div>
				<div class="invoice-img">
					<a-row
						type="flex"
						justify="start"
						:gutter="24"
					>
						<template v-if="!uploadLoading">
							<a-col
								class="img-wrapperX"
								v-for="(item, index) in invoiceImgList"
								:key="index"
								@mouseenter="hoverCurrentItem(index, item, true)"
								@mouseleave="hoverCurrentItem(index, item, false)"
							>
								<div
									class="image-marker"
									v-show="item.active"
								>
									<a-icon
										type="delete"
										style="margin-right: 10px"
										@click="deleteInvoice(index, item)"
										v-if="$route.query.type != 'detail'"
									/>
									<a-icon
										type="eye"
										@click="previewInvoice(item)"
									/>
								</div>
								<a-icon
									v-if="item.status == 'success'"
									class="icon"
									type="check-circle"
									theme="filled"
									:style="{ fontSize: '16px', fontColor: '', color: '#37A193' }"
								/>
								<a-icon
									v-if="item.status == 'pendding'"
									class="icon"
									type="minus-circle"
									theme="filled"
									:style="{ fontSize: '16px', fontColor: '', color: '#004ECD' }"
								/>
								<a-icon
									v-if="item.status == 'error'"
									class="icon"
									type="close-circle"
									theme="filled"
									:style="{ fontSize: '16px', fontColor: '', color: '#E35149' }"
								/>
								<div class="fail-reason">
									<a-tooltip
										placement="top"
										overlayClassName="invoice-fail-reason"
									>
										<template slot="title">
											<span>{{ item.failReason }}</span>
										</template>
										<span v-if="item.status == 'pendding'">
											<a-spin style="font-size: 18px" />
											<span style="color: #0053db">&nbsp;校验中...</span>
										</span>
										<span v-else>
											<span
												class="ellipsis"
												v-if="item.failReason == '通过校验'"
												style="display: block; color: rgb(55, 161, 147)"
												>{{ item.failReason }}</span
											>
											<span
												class="ellipsis"
												v-else
												style="display: block"
												>{{ item.failReason }}</span
											>
										</span>
									</a-tooltip>
								</div>
								<img :src="ENV.BASE_NET + item.url" />
							</a-col>
						</template>
						<!-- 当时编辑 且 有数据的时候重新上传 -->
						<a-col
							class="upload-box"
							v-if="(!exist && location == 'modify') || location == 'add'"
						>
							<div>
								<a-upload
									list-type="picture-card"
									name="file"
									:showUploadList="false"
									:accept="accept"
									:headers="headers"
									:multiple="true"
									@preview="handlePreview(uploadKeyList[0])"
									:fileList="fileListinvoiceImg"
									:before-upload="beforeUploadInvoice"
									@change="handleChange"
									v-decorator="['invoiceImg', { rules: [{ required: true, message: '上传发票' }] }]"
								>
									<div>
										<a-icon type="plus" />
										<div class="ant-upload-text">上传发票</div>
									</div>
								</a-upload>
							</div>
						</a-col>
					</a-row>
					<div
						class="tc"
						style="margin-top: 20px"
						v-if="location == 'add'"
					>
						<a-button
							class="width126px-height44px-button"
							type="primary"
							@click="next"
							>下一步
						</a-button>
					</div>
				</div>
				<img
					:src="previewImg"
					style="display: none"
					ref="viewer"
					v-viewer
				/>
			</div>
		</div>
		<div
			class="progress-bar-bg"
			v-if="uploadLoading"
		>
			<div>
				<div class="progress-state">
					<div>附件已上传：{{ currentUpload.currentUploadSize }}个</div>
					<div>附件总数量：{{ currentUpload.uploadCount ? `${currentUpload.uploadCount}个` : uploadingTip }}</div>
				</div>
				<div class="progress">
					<div
						class="progress-now"
						:style="{
							width: `${(currentUpload.currentUploadSize * 100) / currentUpload.uploadCount}%`
						}"
					></div>
					<div
						class="num"
						:style="{
							left: currentUpload.currentUploadSize
								? `calc(${(currentUpload.currentUploadSize * 100) / currentUpload.uploadCount}%)`
								: 0
						}"
					>
						{{ Math.round((currentUpload.currentUploadSize * 100) / currentUpload.uploadCount) || 0 }}%
					</div>
				</div>
				<div style="text-align: center; margin-top: 32px">
					<span
						v-if="!isAnalysis"
						style="color: #ff4d4f"
					>
						<a-spin
							v-if="isUploading"
							tip="发票上传过程中，请勿退出该页面!"
						></a-spin>
						<span
							v-else
							style="color: #4682f3"
							>发票上传完成，等待识别!</span
						>
					</span>
					<span
						v-else
						style="color: #4682f3"
						>发票上传完成，识别中...</span
					>
				</div>
			</div>
			<div>
				<div class="progress-state">
					<div>发票已识别：{{ invoiceImgListCurrent.length }}张</div>
				</div>
				<div class="progress">
					<div
						class="progress-now"
						:style="{
							width: `${currentAnalysisFile * 100}%`
						}"
					></div>
					<div
						class="num"
						:style="{
							left: currentAnalysisFile ? `calc(${currentAnalysisFile * 100}% - 34px)` : 0
						}"
					>
						{{ Math.round(currentAnalysisFile * 100 || 0) }}%
					</div>
				</div>
				<div style="text-align: center; margin-top: 32px">
					<span
						v-if="!isAnalysis"
						style="color: #ff4d4f"
						>请等待发票上传完成!</span
					>
					<span
						v-else
						style="color: #4682f3"
					>
						<a-spin tip="发票正在识别，请勿退出该页面!"></a-spin>
					</span>
				</div>
			</div>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script lang="jsx">
import { handleUploadChange } from '@/v2/utils/factory.js';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import imageViewer from '@/v2/components/imageViewer.vue';
import {
	FILE_UPLOAD_MULTIPLE,
	GET_INCREMENT_FILE,
	INCREMENT_FILE_PARSE,
	GET_INCREMENTFILE_PATH,
	API_InvoiceImgScan,
	API_BatchDownloadFileByUrls,
	invoiceDetailImgScan,
	deleteSingleImage
} from '@/v2/center/invoiceTools/api';

export default {
	name: 'PictureInvoice',

	props: {
		type: {
			type: String,
			default: ''
		},
		// modify 编辑 detail 详情 和  add 新增
		location: {
			default: 'add'
		},
		// 编辑的时候是否存在关联关系
		exist: {
			default: false
		}
	},

	components: {
		imageViewer
	},
	data() {
		return {
			ENV,
			currentSize: 0,
			invoiceImgList: [],
			dataSource: [],
			accept: '.jpg,.png,.gif,.pdf,.ofd',
			previewImg: '',
			uploadKeyList: ['invoiceImg'],
			fileListinvoiceImg: [],
			setInterval: null,
			currentUpload: {
				//当前上传
				total: 0, //本次上传识别总数
				timeMillis: 0, // 本次上传时间戳
				currentSize: 0, //本地上传当前数
				timeOut: 0, // 超出定义时间后结束请求
				uploadCount: 0,
				currentUploadSize: 0,
				invoiceTotal: 0
			},
			uploadLoading: false, // 上传进度条
			timer: null,
			timerOut: null,
			passInfo: {
				failTotal: 0,
				total: 0,
				passTotal: 0,
				noPassTotal: 0
			},
			uploadFinished: false,
			currentAnalysisFile: 0,
			isAnalysis: false,
			getInvoiceImageHttpStatus: false,
			currentUploadFileCount: {},
			isUploading: false,
			invoiceImgListCurrent: []
		};
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
		uploadingTip() {
			if (this.isUploading) {
				return '计算中...';
			}
			return '0个';
		}
	},
	watch: {
		invoiceImgList: {
			handler(list) {
				this.passInfo = {
					passTotal: list.filter(el => el.result == 'PASS').length,
					noPassTotal: list.filter(el => el.result == 'NO_PASS').length,
					failTotal: list.filter(el => el.result == 'ERROR').length,
					total: list.length - list.filter(el => el.result == 'ERROR').length
				};
			},
			deep: true
		},
		fileListinvoiceImg: {
			handler(value) {
				if (value.length) {
					this.handleUpload();
				}
			},
			deep: true
		}
	},
	created() {
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[`handleChange${item}`] = info => {
				this.uploadLoading = true;
				handleUploadChange.call(this, info, item, this.setInvoiceInfo);
			};
			this[item] = item;
		});
	},
	methods: {
		handleChange() {},
		// 1.上传
		handleUpload() {
			this.uploadLoading = true;
			this.isUploading = true;
			this.invoiceImgListCurrent = [];
			const { fileListinvoiceImg } = this;
			const formData = new FormData();
			fileListinvoiceImg.forEach(file => {
				formData.append('files', file);
			});
			FILE_UPLOAD_MULTIPLE(formData)
				.then(res => {
					if (res.success) {
						this.setInvoiceInfo(res.data);
						this.currentUpload.uploadCount = res.data.count;
					}
				})
				.catch(err => {
					this.$message.error(`上传失败${JSON.stringify(err)},请重试`);
					this.resetCurrentUpload();
				})
				.finally(() => {
					this.fileListinvoiceImg = [];
				});
		},
		// 上传成功后回调
		setInvoiceInfo(v) {
			// 设置本次上传总数、时间戳
			this.currentUpload.total = v.count;
			this.currentUpload.timeMillis = v.timeMillis;
			this.timer = setInterval(() => {
				this.getIncrementFileUpload();
			}, 5 * 1000);
		},
		// 返回已经上传文件数
		getIncrementFileUpload() {
			if (this.currentUpload.currentUploadSize >= this.currentUpload.uploadCount) {
				window.clearInterval(this.timer);
				this.fileUploadParse();
				return;
			}
			GET_INCREMENT_FILE({
				timeMillis: this.currentUpload.timeMillis,
				t: new Date().getTime()
			})
				.then(res => {
					if (res.success) {
						this.currentUpload.currentUploadSize = res.data.length;
						if (this.currentUpload.uploadCount == res.data.length) {
							this.isUploading = false;
						}
					}
				})
				.catch(() => {
					this.$message.error('获取上传进度失败,请重试');
					this.resetCurrentUpload();
					window.clearInterval(this.timer);
				});
		},
		// 开始解析
		fileUploadParse() {
			this.isAnalysis = true;
			INCREMENT_FILE_PARSE({
				timeMillis: this.currentUpload.timeMillis,
				t: new Date().getTime()
			})
				.then(res => {
					if (res.success) {
						this.currentUpload.timeMillis = res.data.timeMillis;
						this.getIncrementFilePathLoop();
					}
				})
				.catch(() => {
					this.resetCurrentUpload();
				});
		},
		// 返回图片地址增量数据轮询
		getIncrementFilePathLoop() {
			for (let i = 1; i <= this.currentUpload.uploadCount; i++) {
				this.currentUploadFileCount[i] = 0;
			}
			this.timer = setInterval(() => {
				this.getIncrementFilePath();
			}, 2 * 1000);
		},
		// 返回图片地址增量数据
		getIncrementFilePath() {
			if (this.currentAnalysisFile >= 1) {
				this.invoiceImgList = this.invoiceImgListCurrent.concat(this.invoiceImgList);
				// 对发票验真
				this.invoiceImgListCurrent.forEach((item, index) => {
					this.timerOut = setTimeout(() => {
						this.toInvoiceImgScan(item.url);
					}, 50 * index);
				});
				window.clearInterval(this.timer);
				this.resetCurrentUpload();
				return;
			}
			if (this.getInvoiceImageHttpStatus) return;
			this.getInvoiceImageHttpStatus = true;
			GET_INCREMENTFILE_PATH({
				currentSize: this.currentUpload.currentSize,
				timeMillis: this.currentUpload.timeMillis,
				t: new Date().getTime()
			})
				.then(res => {
					if (res.success) {
						const tempResult = cloneDeep(res.data);
						const currentArrImageList = this.invoiceImgList.map(item => item.url);
						tempResult.forEach((item, index) => {
							if (currentArrImageList.includes(item.uploadFilePath)) {
								res.data.splice(index, 1);
							}
						});
						this.currentUpload.currentSize += res.data.length; //当前第几张
						if (res.data.length) {
							res.data.forEach(item => {
								this.currentUpload.currentImage = item.currentImage; //当前第几张
								this.currentUpload.totalImage = item.totalImage; //当前第几张
								this.currentUpload.currentUploadFile = item.currentUploadFile; //当前第几张
								this.currentUpload.uploadFileCount = item.uploadFileCount; //当前第几张
								this.currentUploadFileCount[item.currentUploadFile] = item.totalImage;
								this.invoiceImgListCurrent.push({
									url: item.uploadFilePath,
									status: 'pendding'
								});
							});
							let hasAnalysisFile = 0;
							let hasAnalysisFileInvoiceCount = 0;
							for (let key in this.currentUploadFileCount) {
								if (this.currentUploadFileCount[key] != 0) {
									hasAnalysisFileInvoiceCount += this.currentUploadFileCount[key];
									hasAnalysisFile += 1;
								}
							}
							this.currentAnalysisFile =
								(this.invoiceImgListCurrent.length / hasAnalysisFileInvoiceCount) *
								(hasAnalysisFile / this.currentUpload.uploadCount);
						}
					}
				})
				.catch(() => {
					this.$message.error('获取图片途径失败');
					this.resetCurrentUpload();
					window.clearInterval(this.timer);
				})
				.finally(() => {
					this.getInvoiceImageHttpStatus = false;
				});
		},
		deleteInvoice(index, item) {
			if (this.$route.query.type == 'modify') {
				this.invoiceImgList.splice(index, 1);
				return;
			}
			deleteSingleImage({
				attachmentUrl: item.attachment
			}).then(res => {
				if (res.success) {
					this.$message.success('删除成功');
					this.invoiceImgList.splice(index, 1);
				}
			});
		},
		previewInvoice(item) {
			this.$refs.imageViewer.show([item.url]);
		},
		hoverCurrentItem(index, item, flag) {
			this.invoiceImgList.forEach((item, index) => {
				const cloneListItem = cloneDeep(item);
				cloneListItem.active = false;
				this.$set(this.invoiceImgList, index, cloneListItem);
			});
			if (flag) {
				const cloneItem = cloneDeep(item);
				cloneItem.active = true;
				this.$set(this.invoiceImgList, index, cloneItem);
			}
		},
		save() {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确认要保存该发票吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {},
				onCancel() {}
			});
		},
		resetCurrentUpload() {
			this.uploadLoading = false;
			this.uploadFinished = false;
			this.isAnalysis = false;
			this.isUploading = false;
			this.getInvoiceImageHttpStatus = false;
			this.currentUploadFileCount = {};
			this.currentAnalysisFile = 0;
			this.invoiceImgListCurrent = [];
			this.currentUpload = {
				total: 0,
				currentSize: 0,
				timeOut: 0,
				timeMillis: 0
			};
		},
		setInvoiceImgList(v) {
			const invoiceImgList = v.file.response.data;
			if (invoiceImgList.length > 0) {
				invoiceImgList.forEach(item => {
					this.invoiceImgList = [
						...this.invoiceImgList,
						{
							url: item,
							status: 'pendding'
						}
					];
					this.toInvoiceImgScan(item);
				});
			}
		},

		async toInvoiceImgScan(invoiceImg) {
			// 判断 是否是运费发票扫描
			// 判断 编辑 还是新增
			let fn = this.location == 'modify' ? invoiceDetailImgScan : API_InvoiceImgScan;
			const params = {
				filePath: invoiceImg,
				invoiceType: this.type,
				t: new Date().getTime()
			};
			try {
				const res = await fn(params);
				this.invoiceImgList.forEach(item => {
					if (item.url === invoiceImg) {
						item.status = res.data.result == 'PASS' ? 'success' : 'error';
						item.result = res.data.result;
						item.id = res.data.invoice.id;
						item.failReason = res.data.message;
						(item.attachment = item.url), (item.invoiceNo = res.data.invoice.invoiceNo);
					}
				});
			} catch (error) {
				this.invoiceImgList.forEach(item => {
					if (item.url === invoiceImg) {
						item.status = 'error';
						item.result = 'ERROR';
						item.failReason = error?.data?.error?.message || '验真失败';
						item.attachment = item.url;
					}
				});
			} finally {
				this.$forceUpdate();
			}
		},

		downInvoice(v) {
			if (this.invoiceImgList.length <= 0) {
				this.$message.info('请上传发票');
				return;
			}
			if (this.getScanStatus()) {
				return;
			}
			let tempInvoiceImgArr = [...this.invoiceImgList];
			let zipName = '发票清单';
			if (v !== 'all') {
				zipName = '失败发票清单';
				tempInvoiceImgArr = [];
				tempInvoiceImgArr = this.invoiceImgList.filter(item => item.status === 'error');
				if (tempInvoiceImgArr.length <= 0) {
					this.$message.info('没有识别失败的发票');
					return;
				}
			}
			const urls = tempInvoiceImgArr.map(item => {
				return item.url;
			});
			API_BatchDownloadFileByUrls({ urls: urls.join(','), zipName }).then(res => {
				comDownload(res, undefined, `${zipName}.zip`);
			});
		},
		popContractList() {
			this.$refs.contractList.showModal();
		},
		getScanStatus() {
			let isPendding = false;
			this.invoiceImgList.forEach(item => {
				if (item.status === 'pendding') {
					isPendding = true;
				}
			});
			if (isPendding) {
				this.$message.info('有正在识别的发票，请等待识别完毕。');
			}
			return isPendding;
		},
		next() {
			if (!this.invoiceImgList.length || this.failTotal === this.invoiceImgList.length) {
				this.$message.info('没有识别成功的发票');
				return;
			}
			if (this.getScanStatus()) {
				return;
			}
			if (this.$route.query?.type == '2') {
				this.$router.push({
					path: '/center/admin/invoice/transport/add/relation',
					query: {
						type: 'picture'
					}
				});
			} else {
				this.$router.push({
					path: '/center/admin/invoice/in/add/relation',
					query: {
						type: 'picture'
					}
				});
			}
		},
		beforeUploadInvoice(file) {
			const isSupportFileType =
				file.type === 'image/jpeg' ||
				file.type === 'image/jpg' ||
				file.type === 'image/png' ||
				file.type === 'image/bmp' ||
				file.type === 'application/pdf' ||
				file.type === 'application/ofd';
			// if (!isSupportFileType) {
			//   this.$message.error("仅支持jpg，jpeg，png，pdf，ofd的文件格式");
			//   return;
			// }
			const isLimitFileSize = file.size / 1024 / 1024 <= 100;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过100M`);
				return;
			}
			this.fileListinvoiceImg = [...this.fileListinvoiceImg, file];
			return false;
		},

		handlePreview(type, isStaticFile = false) {
			if (isStaticFile || this[type].indexOf('dg-trade-api') != -1) {
				this.previewImg = this[type];
			} else {
				this.previewImg = ENV.BASE_NET + this[type];
			}
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		removeImg(item, index) {
			// 删除上传错误的发片附件
			this.invoiceImgList.splice(index, 1);
		}
	},
	beforeDestroy() {
		clearInterval(this.timer);
		clearTimeout(this.timerOut);
	}
};
</script>
<style lang="less">
.invoice-fail-reason {
	max-width: 218px;
}
</style>
<style lang="less" scoped>
.wrapper {
	background-color: #f4f5f8;
	margin: -10px -20px;
}

.title {
	font-size: 12px;
	color: #383a3f;
	text-align: left;
	line-height: 18px;
}

.label {
	padding-right: 56px;
	font-size: 12px;
	color: #383a3f;
	text-align: left;
}

::v-deep .upload-box {
	.example,
	.ant-upload.ant-upload-select-picture-card,
	.ant-upload-list-picture-card-container,
	.ant-upload-list-item-list-type-picture-card {
		width: 230px;
		height: 150px;
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
		background: #0053db;
		top: 21px;
		left: 0;
	}
}

.des {
	font-size: 12px;
	color: #6b6f76;
	line-height: 20px;
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

.invoice-img {
	.upload-box {
		margin-top: 15px;
	}

	.img-wrapperX {
		margin-top: 15px;
		position: relative;
		text-align: center;
		position: relative;
		overflow: hidden;
		.image-marker {
			width: calc(100% - 26px);
			height: calc(100% - 26px);
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			top: 0;
			left: 13px;
			border-radius: 8px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 20px;
			color: #fff;
			i {
				cursor: pointer;
			}
		}
		.fail-reason {
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			line-height: 30px;
			height: 30px;
			width: calc(100% - 26px);
			position: absolute;
			bottom: 2px;
			left: 50%;
			transform: translateX(-50%);
			background: #ffffff;
			color: #f5222d;
			border-top: 1px solid #dddfe4;
			text-align: center;
			display: block;
			padding: 0 5px;
		}

		.icon {
			position: absolute;
			top: 6px;
			right: 18px;
			z-index: 1;
		}

		img {
			cursor: pointer;
			width: 230px;
			height: 150px;
			border: 1px solid #dddfe4;
			border-radius: 8px;
		}
	}
}

.excels-upload {
	position: relative;

	> .down-file {
		position: absolute;
		top: 6px;
		left: 120px;
	}
}

.progress-bar-bg {
	width: calc(100% + 48px);
	background-color: #ffffff;
	z-index: 888;
	position: absolute;
	top: -200px;
	left: -24px;
	height: calc(100% + 250px);

	.progress-state {
		width: 50%;
		margin: 50px auto 50px;
		color: #333333;
		display: flex;
		justify-content: space-between;
	}

	.progress {
		width: 40%;
		margin: 0 auto;
		height: 18px;
		border-radius: 8px;
		position: relative;
		background-color: rgb(226, 234, 249);
		border: 1px solid rgba(95, 143, 223, 0.1);

		.progress-now {
			width: 0;
			transition: width 0.5s;
			height: 100%;
			border-radius: 8px;
			position: relative;
			background-color: #0053db;

			&:after {
				width: 16px;
				height: 16px;
				background-color: #ffffff;
				right: 0;
				top: 0;
				position: absolute;
				border-radius: 50%;
				display: inline-block;
				content: '';
			}
		}

		.num {
			width: 50px;
			height: 20px;
			background-color: #0053db;
			position: absolute;
			top: -32px;
			left: 0;
			transition: left 0.5s;
			line-height: 20px;
			text-align: center;
			color: #ffffff;
			border-radius: 6px;

			&:after {
				content: '';
				width: 0;
				height: 0;
				position: absolute;
				top: 16px;
				left: 17px;
				border-top: solid 8px #0053db;
				border-right: solid 8px transparent;
				border-left: solid 8px transparent;
			}
		}
	}
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/common.less');
</style>
