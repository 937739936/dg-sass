<template>
	<div
		class="edit"
		:class="{ edit2: !isUpload && !uploadLoading }"
	>
		<div
			class="top"
			style="margin-top: 70px"
		>
			<i
				class="iconfont icon-a-juxingbeifen5"
				style="color: var(--primary-color); position: relative; left: -6px"
			></i>
			发票附件
		</div>
		<div
			class="btn-box-title"
			v-if="!detailData.invoiceVO.attachment"
		>
			<a-upload
				list-type="picture-card"
				name="file"
				:showUploadList="false"
				:accept="accept"
				:headers="headers"
				:disabled="uploadLoading"
				:multiple="true"
				@preview="handlePreview(uploadKeyList[0])"
				:fileList="fileListinvoiceImg"
				:before-upload="beforeUploadInvoice"
				@change="handleChange"
			>
				<a-button
					type="primary"
					class="btn-link"
					@click="uploadTip"
				>
					<i
						style="margin-right: 5px"
						class="iconfont icon-exceldaoru1"
					></i>
					图片上传</a-button
				>
			</a-upload>
			<p
				class="tip"
				v-if="!fold"
			>
				支持上传单个附件100M以内的JPG、JGEG、PNG、PDF、OFD格式，单张图片上传不可包含多张发票
			</p>
			<div
				class="tip"
				v-else
			>
				<p>支持上传单个附件100M以内的JPG、JGEG、PNG、PDF、OFD格式，</p>
				<p>单张图片上传不可包含多张发票</p>
			</div>
			<div
				style="text-align: center"
				class="no-data"
				v-if="!isUpload && !uploadLoading"
			>
				<img
					style="width: 83px"
					src="@/assets/imgs/newInvoice/no_file.png"
					alt=""
				/>
				<p
					class="c8"
					style="color: #8495aa; margin-top: 10px"
				>
					暂无数据
				</p>
			</div>
		</div>

		<div
			class="affix"
			v-if="detailData.invoiceVO.attachment"
			@click="handlePreview2"
		>
			{{ detailData.invoiceVO.attachmentName.split('?')[0] }}
		</div>
		<div
			class="progress-bar-bg"
			v-if="uploadLoading"
		>
			<!-- v-if="isUploading && !isAnalysis" -->
			<div
				class="progress-box"
				v-if="!isAnalysis"
			>
				<div class="progress-box-top">
					<div class="name-box">
						<i
							style="margin-right: 10px; color: #8495aa; fontsize: 12px"
							class="iconfont icon-fujianshangchuan"
						></i>
						<span class="name">{{ fileInfo.name || '' }}</span>
					</div>
					<span style="color: #8495aa"
						>{{ Math.round(((currentUpload.currentUploadSize || 0) * 100) / currentUpload.uploadCount) || 0 }}%正在上传...</span
					>
				</div>
				<div class="progress">
					<div
						class="progress-now"
						:style="{ width: `${((currentUpload.currentUploadSize || 0) * 100) / currentUpload.uploadCount}%` }"
					></div>
				</div>
			</div>
			<!-- v-if='isAnalysis' -->
			<div
				class="progress-box"
				v-if="isAnalysis"
			>
				<div class="progress-box-top">
					<div class="name-box">
						<i
							style="margin-right: 10px; color: #8495aa; fontsize: 12px"
							class="iconfont icon-fujianshangchuan"
						></i>
						<span class="name">{{ fileInfo.name || '' }}</span>
					</div>
					<span style="color: #8495aa"> {{ Math.round(currentAnalysisFile * 100 || 0) }}%正在识别...</span>
				</div>
				<div class="progress">
					<div
						class="progress-now"
						:style="{ width: `${currentAnalysisFile * 100}%` }"
					></div>
				</div>
			</div>
		</div>
		<div v-if="isUpload && !detailData.invoiceVO.attachment">
			<div class="tab-box">
				<div
					v-for="(tab, i) in tabList"
					:key="tab.value"
				>
					<div
						class="tab-box-item"
						:class="{ active: tab.value == tabIndex }"
						@click="changeTab(tab)"
						v-if="tab.total"
					>
						<span>{{ tab.label }}</span>
						<span style="margin-left: 5px">{{ tab.total }}</span>
					</div>
				</div>
			</div>
			<div v-if="tabIndex == 1">
				<p
					class="failed"
					v-if="failList.length"
				>
					<img
						src="~/assets/imgs/newInvoice/fail.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>识别失败发票 {{ failList.length }}</span>
				</p>
				<div class="df">
					<InvoiceImg
						v-for="(item, i) in failList"
						:info="item"
						type="failList"
						:handleIndex="i"
						@del="delInvoice"
						:key="i"
						@again="getNewInvoice"
						@replace="getNewInvoice"
						style="margin-bottom: 32px; margin-right: 28px"
					>
					</InvoiceImg>
				</div>
				<p
					class="failed"
					style="margin-top: 0; margin-bottom: 20px"
					v-if="checkList.length"
				>
					<img
						src="~/assets/imgs/newInvoice/fail.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>未通过校验发票 {{ checkList.length }}</span>
				</p>
				<div class="df">
					<InvoiceImg
						v-for="(item, i) in checkList"
						type="checkList"
						:handleIndex="i"
						:key="i"
						@again="getNewInvoice"
						@replace="getNewInvoice"
						:info="item"
						@del="delInvoice"
						style="margin-bottom: 32px; margin-right: 28px"
					>
					</InvoiceImg>
				</div>
			</div>
			<div v-if="tabIndex == 2">
				<p
					class="failed"
					v-if="successList.length"
				>
					<!-- <i class="icon-fapiaoshibiechenggong iconfont" style="font-size:12px;margin-right:5px"></i>  -->
					<img
						src="~/assets/imgs/newInvoice/success.png"
						style="width: 14px; height: 14px; margin-right: 5px"
						alt=""
					/>
					<span>识别成功发票 {{ successList.length }}</span>
				</p>
				<div class="df">
					<InvoiceImg
						v-for="(item, i) in successList"
						type="successList"
						:handleIndex="i"
						:info="item"
						@del="delInvoice"
						:key="i"
						style="margin-bottom: 32px; margin-right: 28px"
					></InvoiceImg>
				</div>
			</div>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import { API_SteelsUploadFileWaterMark } from '@/v2/api/steels.js';
import InvoiceImg from './InvoiceImg.vue';
import ENV from '@/v2/config/env';
import { handleUploadChange } from '@/v2/utils/factory.js';
import {
	API_UPLOAD_INVOICE,
	API_InvoiceImgScan,
	API_GetListImgScanSuccessData,
	invoiceDetailImgScan,
	deleteSingleImage
} from '@/v2/center/steels/api/invoice.js';

import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import imageViewer from '@/v2/components/imageViewer.vue';
import { FILE_UPLOAD_MULTIPLE, GET_INCREMENT_FILE, INCREMENT_FILE_PARSE, GET_INCREMENTFILE_PATH } from '@/v2/api/uploadMultiple';
export default {
	props: {
		detailData: {
			default: () => {}
		}
	},
	data() {
		return {
			previewImg: '',
			ENV,
			// 发票上传
			failList: [],
			checkList: [],
			successList: [],
			tabList: [
				{
					value: '1',
					label: '验证失败发票',
					total: 0
				},
				{
					value: '2',
					label: '验证成功发票',
					total: 2
				}
			],
			tabIndex: '1',

			isUpload: false,
			currentSize: 0,
			invoiceDataList: [],
			invoiceImgList: [],
			accept: '.jpg,.png,.gif,.pdf,.ofd,application/ofd',
			previewImg: '',
			action: API_UPLOAD_INVOICE,
			uploadKeyList: ['invoiceImg'],
			fileInfo: {},
			fileListinvoiceImg: [],
			setInterval: null,
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
				const newList = cloneDeep(list);
				// 转换状态
				const statusInfo = {
					PASS: 0,
					NO_PASS: 3,
					ERROR: 1
				};
				newList.forEach((el, index) => {
					el.invoiceUrl = el.url;
					el.scanReason = el.failReason || el.scanReason;
					el.scanStatus = el.scanStatus || el.scanStatus === 0 ? el.scanStatus : statusInfo[el.result];
					el.originalIndex = index;
				});
				this.isUpload = !!newList.length;
				this.failList = newList.filter(el => el.result == 'ERROR' || el.scanStatus == 1);
				this.checkList = newList.filter(el => el.result == 'NO_PASS' || el.scanStatus == 3);
				this.successList = newList.filter(el => el.result == 'PASS' || el.scanStatus === 0);
				// 获取总数
				this.tabList[0].total = newList.filter(el => el.scanStatus !== 0).length;
				this.tabList[1].total = this.successList.length;
				if (this.tabList[0].total === 0 && this.tabList[1].total !== 0) {
					this.tabIndex = 2;
				}
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
				handleUploadChange.call(this, info, item, this[`getPath${item}`]);
			};
			this[item] = item;
		});
		this.fold = window.screen.width < 1500;
	},
	methods: {
		handleChange(value) {},
		getPathinvoiceImg(info, key) {},
		handlePreview2() {
			this.previewImg = this.detailData.invoiceVO.attachment;
			this.$refs.viewer.$viewer.show();
		},
		changeTab(tab) {
			this.tabIndex = tab.value;
		},
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
			if (this.currentUpload.currentUploadSize === undefined) {
				this.currentUpload.currentUploadSize = 0;
			}

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
				this.invoiceImgList.forEach((item, index) => {
					this.timerOut = setTimeout(
						() => {
							this.toInvoiceImgScan(item.url);
						},
						2 * 1000 * index
					);
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

					this.currentUpload.currentUploadSize = 0;
					// this.resetCurrentUpload();
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
			this.fileInfo = {};
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
				invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 2 : 1,
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
		// 上传中禁止上传
		uploadTip() {
			if (this.uploadLoading) {
				this.$message.warning('图片上传中，请稍后再试！');
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
			//   this.$message.error('仅支持jpg，jpeg，png，pdf，ofd的文件格式');
			//   return;
			// }
			const isLimitFileSize = file.size / 1024 / 1024 <= 100;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过100M`);
				return;
			}
			this.fileInfo = file;
			// this.fileListinvoiceImg = [file];
			this.fileListinvoiceImg = [...this.fileListinvoiceImg, file];

			return false;
		},

		handlePreview(type) {
			this.previewImg = this[type];
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		removeImg(item, index) {
			// 删除上传错误的发片附件
			this.invoiceImgList.splice(index, 1);
		},
		delInvoice(item, index, key) {
			this.invoiceImgList.forEach((el, i, arr) => {
				if (el.attachment == item.attachment) {
					arr.splice(i, 1);
				}
				if (item.myInvoiceDO && !el.myInvoiceDO && el.attachment == item.myInvoiceDO.attachment) {
					arr.splice(i, 1);
				}
				if (item.myInvoiceDO && el.myInvoiceDO && el.myInvoiceDO.attachment == item.myInvoiceDO.attachment) {
					arr.splice(i, 1);
				}
			});
			// this[key].forEach((el,i,arr) => {
			//   if(i == index) {
			//     arr.splice(i, 1)
			//   }
			// })
			// // 获取总数
			// this.tabList[0].total = this.failList.length + this.checkList.length
			// this.tabList[1].total = this.successList.length
			// if( this.tabList[0].total === 0 &&   this.tabList[1].total !== 0) {
			//   this.tabIndex = 2
			// }
			// this.isUpload = this.tabList[0].total > 0 ||  this.tabList[1].total > 0
		},
		// 获取识别之后的发票
		getNewInvoice(item, oldItem, handleType) {
			/** 判断当前发票是否重新识别成功 */
			if (item.scanStatus == 0) {
				// 当前列表删除
				// this[key].forEach((el,i,arr) => {
				//   if(i == index) {
				//     arr.splice(i, 1)
				//   }
				// })
				// // 成功列表添加
				// this.successList.push(item)
				const index = this.invoiceImgList.findIndex(el => {
					if (el.attachment == oldItem.attachment) {
						return true;
					}
					if (oldItem.myInvoiceDO && !el.myInvoiceDO && el.attachment == oldItem.myInvoiceDO.attachment) {
						return true;
					}
					if (oldItem.myInvoiceDO && el.myInvoiceDO && el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment) {
						return true;
					}
				});
				this.invoiceImgList.splice(index, 1, item);
				this.$message.success(`${item.myInvoiceDO.no}识别成功`);
			} else {
				// this[key][index] = item
				const index = this.invoiceImgList.findIndex(el => {
					if (el.attachment == oldItem.attachment) {
						return true;
					}
					if (oldItem.myInvoiceDO && !el.myInvoiceDO && el.attachment == oldItem.myInvoiceDO.attachment) {
						return true;
					}
					if (oldItem.myInvoiceDO && el.myInvoiceDO && el.myInvoiceDO.attachment == oldItem.myInvoiceDO.attachment) {
						return true;
					}
				});

				this.invoiceImgList.splice(index, 1, item);
				let tip1 = `${handleType == 'replace' ? '替换结果为' : '重试结果为'}${item.scanReason}`;
				let tip = item.myInvoiceDO && item.myInvoiceDO.no ? `${item.myInvoiceDO.no}${tip1}` : tip1;
				this.$message.error(tip);
			}
			// 获取总数
			this.tabList[0].total = this.failList.length + this.checkList.length;
			this.tabList[1].total = this.successList.length;
			if (this.tabList[0].total === 0 && this.tabList[1].total !== 0) {
				this.tabIndex = 2;
			}
			this.isUpload = this.tabList[0].total > 0 || this.tabList[1].total > 0;
			this.$forceUpdate();
		}
	},
	beforeDestroy() {
		clearInterval(this.timer);
		clearTimeout(this.timerOut);
	},
	components: {
		InvoiceImg
	}
};
</script>

<style scoped lang="less">
.edit {
	position: relative;
	padding-bottom: 40px;
	.top {
		margin: 30px 0;
		font-size: 18px;
		font-weight: 700;
		color: rgba(0, 0, 0, 0.8);
	}
	.btn-link {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
	}
	.tip {
		font-size: 12px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: #8495aa;
		margin-top: 10px;
	}
	.affix {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: @primary-color;
		cursor: pointer;
	}
	.no-data {
		position: relative;
		top: 40px;
		left: 50%;
		// transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		transform: translateX(-50%);
		font-weight: 400;
		color: #8495aa;
	}
	.btn-box-title {
	}
}
.edit2 {
	padding-bottom: 110px;
}
.tab-box {
	height: 54px;
	line-height: 54px;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #8495aa;
	border-bottom: 1px solid #e9effc;
	margin-bottom: 20px;

	&-item {
		margin-right: 40px;
		cursor: pointer;
		border-bottom: 1px solid #e9effc;
		&.active {
			border-bottom: 2px solid @primary-color;
			color: @primary-color;
			font-weight: 500;
		}
	}
}
.failed {
	font-size: 12px;
	font-family:
		PingFangSC-Medium,
		PingFang SC;
	font-weight: 500;
	color: #8495aa;
	margin-bottom: 27px;
	display: flex;
	align-items: center;
}
.df {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	/deep/ .invoice-img {
		margin-right: 20px;
	}
}
/deep/ .ant-upload.ant-upload-select-picture-card {
	border: 0;
}
/deep/ .ant-upload-select-picture-card {
	background: #fff;
	height: inherit;
	margin: 0;
}
/deep/ .ant-upload {
	padding: 0 !important;
}

.progress-bar-bg {
	// width: calc(100% + 48px);
	background-color: #ffffff;
	// z-index: 888;
	// position: absolute;
	// top: -200px;
	// left: -24px;
	// height: calc(100% + 250px);

	.progress-state {
		width: 50%;
		margin: 50px auto 50px;
		color: #333333;
		display: flex;
		justify-content: space-between;
	}
	.progress-box {
		border: 1px solid #e9effc;
		width: 430px;
		height: 60px;
		border-radius: 6px;
		padding: 14px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		&-top {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}
	}
	.progress {
		width: 400px;
		height: 4px;
		border-radius: 6px;
		position: relative;
		background-color: rgba(70, 130, 243, 0.2);

		.progress-now {
			width: 0;
			transition: width 0.5s;
			height: 100%;
			border-radius: 6px;
			position: relative;
			background-color: @primary-color;

			// &:after {
			//   width: 16px;
			//   height: 16px;
			//   background-color: #ffffff;
			//   right: 0;
			//   top: 0;
			//   position: absolute;
			//   border-radius: 50%;
			//   display: inline-block;
			//   content: "";
			// }
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
	.name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		width: 200px;
	}
	.name-box {
		display: flex;
		align-items: center;
	}
}
</style>
