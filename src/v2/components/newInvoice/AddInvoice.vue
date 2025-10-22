<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			class="add-invoice"
			id="invoice"
			:bordered="false"
		>
			<div class="invoice-title">
				{{ invoiceTitle }}
			</div>
			<!-- 上传方式 -->
			<div class="upload-box">
				<div class="top">上传方式</div>
				<div
					class="btn-box-title"
					@mouseenter="clearList"
				>
					<a-upload
						list-type="picture-card"
						name="file"
						:showUploadList="false"
						:accept="accept"
						:headers="headers"
						:multiple="true"
						:fileList="fileListinvoiceImg"
						:before-upload="beforeUploadInvoice"
						@change="handleChange"
					>
						<div class="btn btn1"><i class="iconfont icon icon-tab"></i> 图片上传</div>
					</a-upload>
					<div
						class="btn"
						@click="excelModal = true"
					>
						<i class="iconfont icon icon-exceldaoru1"></i>Excel导入
					</div>
				</div>
				<div class="tip">
					<p>1、「图片上传」支持上传单个附件大小不超过100M的jpg、jpeg、png、pdf、ofd格式发票文件，单张图片上传不可包含多发票</p>
					<p>2、「Excel导入」仅支持上传Excel文件（*.xls、*.xlsx），请下载模板填写后上传</p>
					<p>3、如识别当天的发票，请确保开票方开票时没有采用离线开票的方式，当天开具的发票存在无法识别的情况，建议第二天再上传</p>
					<p>4、每天每张发票可在线查询次数为5次，超过次数后请于次日再进行查验操作</p>
				</div>
			</div>
			<!-- 上传人物列表 -->
			<div class="task">
				<div class="top">上传任务列表</div>
			</div>
			<div class="table-box">
				<a-table
					:columns="uploadTaskColumns"
					class="new-table"
					:rowClassName="(record, index) => `text${index}`"
					bordered
					:rowKey="(record, index) => `${record.id}-${record.randomNum}`"
					:dataSource="specialTaskList"
					v-if="specialTaskList.length"
					:pagination="false"
					:scroll="{ x: 1200 }"
				>
					<div
						slot="ocrFalseCount"
						slot-scope="text, record"
					>
						<span
							class="fail-tip"
							v-if="record.uploadType === 'EXCEL'"
							>-</span
						>
						<span
							class="fail-tip"
							v-else
							>{{ text == undefined || text == null ? '0' : text }}</span
						>
					</div>
					<div
						slot="createDate"
						slot-scope="text, record"
					>
						<img
							src="~/assets/imgs/newInvoice/excel.png"
							alt=""
							v-if="record.uploadType === 'EXCEL'"
							style="height: 16px; margin-right: 8px"
						/>
						<img
							src="~/assets/imgs/newInvoice/picture.png"
							alt=""
							v-if="record.uploadType === 'PICTURE'"
							style="height: 16px; margin-right: 8px"
						/>
						<span>{{ text }}</span>
					</div>

					<div
						slot="uploadProgress"
						slot-scope="text, record"
					>
						<div class="progress">
							<a-progress
								style="flex: 1; margin-right: 5px"
								:showInfo="false"
								:percent="record.uploadProgress2"
								:status="record.status == 1 ? 'success' : 'active'"
								size="small"
							/>
							<span
								class="progress-tip"
								v-if="record.currentStatus == 'UPLOAD' && record.status == 0"
								>{{ record.uploadProgress2 }}% 正在上传</span
							>
							<!-- <span  class="progress-tip" v-if=" && record.status == 0 "> {{record.uploadProgress2}}% 正在拆分</span> -->
							<span
								class="progress-tip"
								v-if="(record.currentStatus == 'SPLIT' || record.currentStatus == 'OCR') && record.status == 0"
							>
								{{ record.uploadProgress2 }}% 正在识别</span
							>
							<span
								class="progress-tip"
								v-if="record.currentStatus == 'CHECK' && record.status == 0"
							>
								{{ record.uploadProgress2 }}% 正在校验</span
							>
							<span
								class="progress-tip"
								v-if="record.status == 1"
							>
								<i
									style="color: #50cd9d; fontsize: 12px"
									class="icon-shangchuanwancheng-renwushangchuan iconfont"
								></i>
								上传完成
							</span>
						</div>
					</div>
					<div
						slot="action"
						slot-scope="text, record, index"
						style="border-right: 0"
					>
						<div class="btn-box">
							<a
								href="javascript:;"
								class="btn"
								v-if="record.status == 1"
								@click="next(record)"
								>下一步</a
							>
							<a
								href="javascript:;"
								@click="cancelTask(record.id, index, record)"
								class="btn"
								v-if="record.status == 0"
								>取消上传</a
							>
							<span
								class="del-box"
								v-if="record.status == 1"
								@click="deleteTask(record, index)"
							>
								<i class="icon-shanchu-caozuo iconfont btn del-btn"></i
							></span>
						</div>
					</div>
				</a-table>
			</div>
			<!-- <i-pagination :pagination="pagination" size="small" @change="getTaskList" /> -->
			<a-empty
				v-if="!specialTaskList.length"
				:image="emptyImg"
				style="margin-top: 100px"
			>
				<span
					slot="description"
					style="color: #8b9db8; fontsize: 12px"
				>
					<p>当前列表暂无任何附件信息哦</p>
					<p>赶快去上传吧</p>
				</span>
			</a-empty>
			<!-- excel上传 -->
			<a-modal
				v-model="excelModal"
				centered
				wrapClassName="invoice-box2"
				:footer="null"
			>
				<div class="title">上传附件</div>
				<div class="excel-box">
					<div class="excel-box-content">
						<div class="excel-box-title">仅支持单选上传Excel文件(*.xls、*xlsx)</div>
						<div class="excel-box-upload">
							<img
								src="~/assets/imgs/newInvoice/upload-file.png"
								style="width: 44px; height: 50px"
								alt=""
							/>
							<a-upload
								list-type="picture-card"
								name="file"
								style="margin-top: 18px"
								:showUploadList="false"
								:accept="accept2"
								:headers="headers"
								@preview="handlePreview(uploadKeyList[1])"
								:multiple="true"
								:fileList="fileListinvoiceExcel"
								:before-upload="beforeUploadInvoice2"
								@change="handleChange"
							>
								<a-button style="color: var(--primary-color); border: 1px solid var(--primary-color)"> 选择文件</a-button>
							</a-upload>
							<p style="margin-top: 13px; fontweight: 400">上传文件大小需小于500KB</p>
						</div>
					</div>
					<div class="tpl">
						<div style="font-weight: 400">导入前请下载模板，按照模板格式导入上传</div>
						<a
							v-if="invoiceType == 'DELIVER'"
							class="download-tpl"
							:href="publicPath + 'files/invoice/运费发票上传模板.xlsx'"
						>
							<i class="iconfont icon3 icon-bianzu"></i>
							<span>下载模板</span>
						</a>
						<!-- 贸易发票 -->
						<a
							v-else
							class="download-tpl"
							:href="publicPath + 'files/invoice/贸易发票上传模板.xlsx'"
						>
							<i class="iconfont icon3 icon-bianzu"></i>
							<span>下载模板</span>
						</a>
					</div>
				</div>
			</a-modal>
			<a-modal
				:visible="taskFinish"
				:footer="null"
				wrapClassName="taskFinish"
				width="460px"
				centered
				@cancel="cancelModal"
				:title="null"
			>
				<div class="title">
					<img
						src="@/v2/assets/imgs/invoicetools/success.png"
						alt=""
					/>发票任务已经完成
				</div>
				<div style="padding: 0 20px">
					<div class="note">
						{{ firstFinishedItem.createDate }}上传的发票任务已完成，点击【下一步】立即跳转【发票与合同关联信息】页面
					</div>
					<div class="footer">
						<a-button @click="cancelModal">取消</a-button>
						<a-button
							type="primary"
							@click="next(firstFinishedItem)"
							>下一步</a-button
						>
					</div>
				</div>
			</a-modal>
			<DelModal
				ref="delModal"
				@confirm="confirmDel"
			>
				<div>
					<p>发票信息已上传完成（{{ firstFinishedItem.invoiceUploadTotal }}张），确认删除？</p>
					<p>确认后上传信息及任务会被删除！</p>
				</div>
			</DelModal>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uploadTaskColumns } from './columns/columns.js';
import emptyImg from '@/assets/imgs/newInvoice/empty.png';
import {
	NEW_FILE_UPLOAD_MULTIPLE,
	NEW_EXCEL_UPLOAD_MULTIPLE,
	getTaskList,
	deleteTask,
	deleteTaskProgress
} from '@/v2/center/steels/api/invoice.js';
import ENV from '@/v2/config/env';
import DelModal from './delModal.vue';
import { invoiceTypeInfo } from './columns/constant.js';
import moment from 'moment';
import breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	props: ['invoiceType', 'industryType'],
	data() {
		return {
			taskList: [],
			uploadTaskColumns,
			emptyImg,
			// 上传完成
			taskFinish: false,
			// 发票上传
			uploadKeyList: ['invoiceImg', 'invoiceExcel'],
			uploadLoading: false,
			accept: '.jpg,.png,.gif,.pdf,.ofd,application/ofd',
			accept2: '.xls,.xlsx',
			previewImg: '',
			/** excel上传 */
			excelModal: false,
			publicPath: process.env.BASE_URL,
			fileListinvoiceImg: [],
			fileListinvoiceExcel: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 100,
			// 第一个上传成功的任务
			firstFinishedItem: {},
			firstFinishedIndex: '',
			timer: null,
			isLoading: false,
			// 点击取消不再弹窗
			isCancel: false,
			// 随机ID
			randomNum: '',
			specialTaskList: []
		};
	},
	created() {},
	mounted() {
		window.onbeforeunload = this.handlerUnload;
		this.getTaskList(1);
		this.circulation();
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		// 发票title
		invoiceTitle() {
			return invoiceTypeInfo[this.invoiceType];
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	watch: {
		fileListinvoiceImg: {
			handler(value) {
				if (value.length) {
					// file.size / 1024 / 1024 <= 100
					let size = 0;
					value.forEach(el => {
						size += el.size;
					});
					if (size / 1024 / 1024 >= 100) {
						this.$message.error(`文件大小不能超过100M`);
						return;
					}
					this.handleUpload();
				}
			},
			deep: true
		},
		fileListinvoiceExcel: {
			handler(value) {
				if (value.length) {
					this.handleUpload2();
				}
			},
			deep: true
		},
		// 判断是否有上传中的任务
		specialTaskList: {
			handler(value) {
				const flag = this.specialTaskList.some(el => el.currentStatus == 'UPLOAD');
				this.$emit('stopSkip', flag);
				/** 判断是否有上传完成的任务 */
				const newTplArr = this.specialTaskList.filter(el => el.status == 1);
				const firstFinishedItem = newTplArr[newTplArr.length - 1];
				if (firstFinishedItem && !flag) {
					this.firstFinishedItem = firstFinishedItem;
					// 用户点击取消 就不再弹窗
					if (!this.isCancel) {
						this.taskFinish = true;
					}
				}
			},
			deep: true
		},
		uploadLoading(value) {
			this.$emit('stopSkip', value);
		}
	},
	methods: {
		getPathinvoiceImg(info, key) {},
		getPathinvoiceExcel(info, key) {},
		handlerUnload(e) {
			e = e || window.event;
			const flag = this.specialTaskList.some(el => el.currentStatus == 'UPLOAD');
			if (flag) {
				if (e) {
					e.returnValue = '系统可能不会保存你所做的更改';
				}
				return '系统可能不会保存你所做的更改';
			}
		},
		// 进入下一步
		next(item) {
			this.taskFinish = false;
			const query = {
				invoiceType: this.invoiceType,
				industryType: this.industryType,
				taskId: item.id,
				// 图片上传
				handleType: item.uploadType == 'PICTURE' ? 'img' : 'excel',
				...this.$route.query
			};
			const invoiceType = this.$route.query.type;
			const path =
				this.industryType == 'STEEL' ? '/center/steels/invoice/LinkContract' : `/center/invoice/${invoiceType}/link/contract`;
			this.$router.replace({
				path,
				query
			});
		},
		clearList() {
			this.fileListinvoiceImg = [];
			this.fileListinvoiceExcel = [];
			this.randomNum = String(Math.random() * 1000 + 1000);
		},
		handleChange(value) {},
		beforeUploadInvoice(file) {
			// this.$message.warning('任务上传中，请稍后...', 0)
			const isLimitFileSize = file.size / 1024 / 1024 <= 100;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过100M`);
				return;
			}
			// 新上传以后 push假的数据

			const flag = this.specialTaskList.some(el => el.randomNum == this.randomNum);
			if (!flag) {
				this.specialTaskList.unshift({
					status: 0,
					currentStatus: 'UPLOAD',
					uploadProgress2: 0,
					createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					randomNum: this.randomNum
				});
			}
			this.fileListinvoiceImg = [...this.fileListinvoiceImg, file];
			return false;
		},
		beforeUploadInvoice2(file) {
			// this.$message.warning('任务上传中，请稍后...', 0)
			const isLimitFileSize = file.size / 1024 <= 600;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过500kb`);
				return;
			}
			this.fileListinvoiceExcel = [...this.fileListinvoiceExcel, file];
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
		// 1.上传
		async handleUpload() {
			this.uploadLoading = true;
			const formData = new FormData();
			this.fileListinvoiceImg.forEach(file => {
				formData.append('files', file);
			});

			formData.append('type', this.invoiceType);
			formData.append('industryType', this.industryType);
			formData.append('randomNum', this.randomNum);

			!this.timer && this.circulation(1);
			try {
				const res = await NEW_FILE_UPLOAD_MULTIPLE(formData);
				// this.$message.success('操作成功')
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileListinvoiceImg = [];
				//  this.$message.destroy()
				this.uploadLoading = false;
			}
		},
		async handleUpload2() {
			this.uploadLoading = true;
			const formData = new FormData();
			this.fileListinvoiceExcel.forEach(file => {
				formData.append('file', file);
			});
			formData.append('type', this.invoiceType);
			formData.append('industryType', this.industryType);
			!this.timer && this.circulation(1);
			try {
				const res = await NEW_EXCEL_UPLOAD_MULTIPLE(formData);
				// this.$message.success('操作成功')
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';

				this.$message.error(tip);
			} finally {
				this.fileListinvoiceExcel = [];
				this.uploadLoading = false;
				this.excelModal = false;
			}
		},
		async getTaskList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pageSize = 100;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				type: this.invoiceType,
				industryType: this.industryType
			};
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			try {
				const res = await getTaskList(params);
				res.data.records.forEach(el => {
					if (el.currentStatus == 'SPLIT' || el.currentStatus == 'OCR') {
						el.uploadProgress2 = el.uploadProgress2 == undefined ? 20 : el.uploadProgress2;
					} else if (el.currentStatus == 'CHECK') {
						el.uploadProgress2 = el.uploadProgress2 == undefined ? 90 : el.uploadProgress2;
					}
					const flag = this.specialTaskList.some(el2 => el2.id == el.id);
					const indexId = this.specialTaskList.findIndex(el2 => el2.id == el.id);

					// 如果当前列表不包含 当前的任务
					if (!flag) {
						// 判断当前 是否有随机Id
						if (el.randomNum) {
							/** 如果有随机id 则替换掉 特殊任务列表的前端生成的假数据 */
							const index = this.specialTaskList.findIndex(el2 => el2.randomNum == el.randomNum);
							if (index != -1) {
								const uploadProgress2 = this.specialTaskList[index].uploadProgress2 || el.uploadProgress2;
								this.$set(this.specialTaskList, index, { ...el, uploadProgress2 });
							} else {
								this.specialTaskList.push(el);
							}
						} else {
							this.specialTaskList.push(el);
						}
					} else {
						//  需要更新数据
						const uploadProgress2 = this.specialTaskList[indexId].uploadProgress2 || el.uploadProgress2;
						this.$set(this.specialTaskList, indexId, { ...el, uploadProgress2 });
					}
				});
				// 随机增加进度 且最大不能超过 99%
				this.specialTaskList.forEach(el => {
					if (el.currentStatus == 'UPLOAD' && el.status == 0) {
						if (el.uploadProgress2 <= 18) {
							el.uploadProgress2 += 1;
						} else {
							el.uploadProgress2 = 19;
						}
					}

					if ((el.currentStatus == 'SPLIT' || el.currentStatus == 'OCR') && el.status == 0) {
						if (el.uploadProgress2 <= 88) {
							el.uploadProgress2 += 1;
						} else {
							el.uploadProgress2 = 89;
						}
					}

					if (el.currentStatus == 'CHECK' && el.status == 0) {
						if (el.uploadProgress2 <= 98) {
							el.uploadProgress2 += 1;
						} else {
							el.uploadProgress2 = 99;
						}
					}
					if (el.status == 1) {
						el.uploadProgress2 = 100;
					}
				});

				this.specialTaskList.sort((el, el2) => moment(el2.createDate).valueOf() - moment(el.createDate).valueOf());
				// this.taskList = res.data.records
				/** 获取前端假的数据 */

				this.pagination.total = res.data.total;
				this.isLoading = false;
				this.$forceUpdate();
			} catch (error) {
				this.isLoading = false;
			}
		},
		// 取消上传
		async cancelTask(taskId, index, item) {
			/** 判断是否有taskId */

			if (!taskId) {
				// 没有任务id 代表是假数据
				this.specialTaskList.splice(index, 1);

				await deleteTaskProgress({ randomNum: item.randomNum });
				this.uploadLoading = false;
				return;
			}
			const params = {
				taskId
			};

			await deleteTask(params);
			this.uploadLoading = false;
			this.specialTaskList.splice(index, 1);
			this.$forceUpdate();
			this.getTaskList(1);
		},
		// 删除任务
		async deleteTask(item, index) {
			this.firstFinishedItem = item;
			this.firstFinishedIndex = index;
			this.$refs.delModal.open();
		},
		// 确认删除
		async confirmDel() {
			const params = {
				taskId: this.firstFinishedItem.id
			};
			const res = await deleteTask(params);
			this.specialTaskList.splice(this.firstFinishedIndex, 1);
			this.$forceUpdate();
			this.$message.success('操作成功');
			this.getTaskList(1);
			this.$refs.delModal.close();
		},
		// 循环
		circulation(pageNo) {
			this.timer = setInterval(async () => {
				// 加载中的不请求
				if (!this.isLoading) {
					await this.getTaskList(pageNo || this.pagination.pageNo, this.pageSize);
					const allFinish = this.specialTaskList.some(el => el.status == 0);

					// 上传中的需要一直循环
					if (!allFinish && !this.uploadLoading) {
						clearInterval(this.timer);
						this.timer = null;
					}
				}
			}, 1000);
		},
		// 取消弹窗
		cancelModal() {
			this.taskFinish = false;
			this.isCancel = true;
		}
	},
	destroyed() {
		window.onbeforeunload = null;
		clearInterval(this.timer);
		this.timer = null;
		this.$message.destroy();
	},
	components: {
		DelModal,
		breadcrumb
	}
};
</script>
<style lang="less" scoped>
/* 发票上传样式优化 */
.invoice-box,
.invoice-box2 {
	.ant-modal-header {
		border-bottom: 0;
		padding-top: 30px;
		padding-bottom: 20px;

		.ant-modal-title {
			font-weight: 600;
			font-size: 20px;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.8);
		}
	}

	.ant-modal-close {
		top: 8px;
	}

	.ant-modal-content {
		border-radius: 6px;
	}

	.ant-modal-body {
		padding: 0;
	}

	.ant-modal-footer {
		padding-top: 20px;
		padding-bottom: 20px !important;
		border-top: 0;
		padding-right: 20px;
	}

	.footer-box {
		display: flex;
		align-items: center;
		justify-content: space-around;

		.footer-btn1 {
			color: @primary-color;
			border: 1px solid @primary-color;
			background: #fff;
			width: 126px;
			height: 44px;
			border-radius: 6px;
			font-size: 14px;
		}

		.footer-btn {
			width: 126px;
			height: 44px;
			background: @primary-color;
			border-radius: 6px;
		}
	}
}

.invoice-box {
	.ant-modal {
		padding-bottom: 0;
	}

	.ant-modal-footer {
		padding-bottom: 30px;
	}
}

.invoice-box2 {
	.title {
		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 58px;
		color: rgba(0, 0, 0, 0.8);
		background: #f3f5f6;
		padding-left: 20px;
		border-radius: 8px 8px 0px 0px;
	}
	.ant-modal-body {
		padding-bottom: 30px;
	}

	.excel-box-title {
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
		color: #8495aa;
	}
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.add-invoice {
	margin-top: 6px;

	.invoice-title {
		padding-bottom: 15px;
		border-bottom: 1px solid #e9effc;
		display: flex;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
		align-items: center;
		justify-content: space-between;
	}

	.upload-box,
	.task {
		margin-top: 30px;

		.top {
			font-family: 'PingFang SC';
			height: 32px;
			font-style: normal;
			font-weight: 500;
			font-size: 16px;
			line-height: 32px;
			color: rgba(0, 0, 0, 0.8);
			position: relative;
			padding-left: 12px;

			&:before {
				content: '';
				top: 7px;
				position: absolute;
				display: block;
				width: 4px;
				height: 18px;
				left: 0;
				background: @primary-color;
			}
		}
	}

	.upload-box {
		/deep/ .ant-upload-select-picture-card {
			height: initial;
		}

		/deep/ .ant-upload-picture-card-wrapper {
			height: initial;
		}

		/deep/ .ant-upload {
			padding: 0;
		}
	}

	.btn-box-title {
		display: flex;
		align-items: center;
		margin-top: 20px;

		.btn {
			width: 106px;
			height: 38px;
			border-radius: 4px;
			border: 1px solid @primary-color;
			display: flex;
			justify-content: center;
			align-items: center;
			color: @primary-color;
			font-size: 14px;
			margin-right: 20px;
			cursor: pointer;

			.icon {
				margin-right: 10px;
			}
		}

		.btn1 {
			background: @primary-color;
			color: #fff;
		}
	}

	.tip {
		font-size: 12px;
		font-weight: 400;
		color: #8495aa;
		line-height: 22px;
		margin-top: 20px;
	}

	.task {
		margin-top: 30px;
	}

	.table-box {
		margin-top: 30px;

		.fail-tip {
			font-size: 14px;
			font-weight: 400;
			color: #e45757;
		}

		.progress {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			// min-width: 300px;
		}

		.progress-tip {
			display: inline-block;
			width: 100px;
			display: flex;
			align-items: center;

			i {
				margin-right: 10px;
				margin-left: 10px;
			}
		}
	}

	.btn-box {
		// min-width: 180px;
		width: 100%;
		display: flex;
		// justify-content: space-around;
		// align-items: left;
		position: relative;
	}

	.del-box {
		width: 22px;
		height: 22px;
		display: none;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		right: 10px;
		border-radius: 4px;
		transform: translateY(-50%);
		cursor: pointer;
	}

	.del-box:hover {
		background: rgba(132, 149, 170, 0.1);
	}

	.del-btn {
		// display:  none;
		font-size: 20px;
		color: #8495aa;

		line-height: inherit;
		line-height: 20px;
	}

	.btn-box:hover {
		.del-box {
			display: flex;
		}

		// .del-btn {
		//   display: inline-block;
		// }
	}
}

/deep/ .ant-progress-inner {
	background-color: rgba(70, 130, 243, 0.2);
}

/deep/ .ant-progress-status-success .ant-progress-bg {
	background: #50cd9d;
}

/deep/ .new-table {
	.ant-table-thead > tr > th {
		border-bottom: 1px solid #e8e8e8;
		border-right: 1px solid #e8e8e8;
		border-left: none;
		//border-top: none;
	}

	.ant-table-thead tr th:nth-child(1) {
		border-radius: 0;
	}

	.ant-table-body > tr {
		td:last-child {
			border-right: 0;
		}
	}
	.ant-table-thead tr:nth-child(2) {
		th {
			border-left: none;
			border-top: none;
		}
	}
}

/deep/ .ant-table-body tr td:last-child {
	border-right: 0;
}

/deep/ .ant-table-row-cell-last {
	border-right: 0 !important;
}

/deep/ .ant-upload.ant-upload-select-picture-card {
	border: 0;
}

/deep/ .ant-upload-select-picture-card {
	background: #fff;
	height: inherit;
	margin: 0;
}

.excel-box {
	&-upload {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: #fff;
		height: 190px;
		background: #ffffff;
		border-radius: 6px;
		border: 1px solid rgba(139, 157, 184, 0.3);
		margin-top: 16px;
	}

	&-content {
		height: 268px;
		background: #f8f9fe;
		border-radius: 6px;
		border: 1px solid rgba(139, 157, 184, 0.3);
		box-sizing: border-box;
		font-weight: 600;
		color: #8495aa;
		padding: 20px;
		margin: 30px 20px;
	}

	.icon2 {
		// height: 44px;
		// width: 50px;
		font-size: 40px;
		// margin-bottom: 22px;
	}

	.tpl {
		height: 108px;
		background: #f8f9fe;
		border-radius: 6px;
		border: 1px solid rgba(139, 157, 184, 0.3);
		padding: 20px;
		margin: 0 20px;
		font-size: 14px;
		color: #8495aa;
	}

	.download-tpl {
		width: 106px;
		height: 30px;
		background: #ffffff;
		border-radius: 4px;
		border: 1px solid @primary-color;
		color: @primary-color;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 16px;
		font-weight: 400;
	}

	.icon3 {
		font-size: 14px;
		margin-right: 4px;
	}

	/deep/ .ant-upload-picture-card-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/deep/ .ant-upload {
		padding: 0 !important;
	}
}
.taskFinish {
	.title {
		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 28px;
		padding-top: 30px;
		margin-left: 30px;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 20px;

		img {
			width: 20px;
			margin-right: 4px;
			margin-bottom: 4px;
		}
	}

	.footer {
		text-align: right;

		.ant-btn {
			margin-left: 20px;
			width: 90px;
			color: rgba(0, 0, 0, 0.8);
			border: 1px solid #c6cdd8;
			height: 34px;
		}

		.ant-btn-primary {
			color: #ffffff;
			border: none;
		}
	}

	.note {
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		padding-left: 10px;
		line-height: 22px;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 26px;
	}
}
/deep/ .ant-modal-body {
	padding: 0 0 20px 0;
}
/deep/ .ant-modal-content {
	border-radius: 10px;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}
</style>
