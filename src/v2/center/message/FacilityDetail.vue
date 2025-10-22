<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				预警详情
			</span>
			<div class="divider"></div>
			<span class="slTitleAssis">基本信息</span>
			<ul class="grid-wrap">
				<li>
					<span class="label">预警流水号</span>
					<span>{{ detail.riskAlertRecordVO.serialNo }}</span>
				</li>
				<li>
					<span class="label">预警日期</span>
					<span>{{ detail.riskAlertRecordVO.alertDate }}</span>
				</li>
				<li>
					<span class="label">预警状态</span>
					<span>
						<i :class="`warning-status ${detail.riskAlertRecordVO.alertStatus}`">
							{{ detail.riskAlertRecordVO.alertStatusDesc }}</i
						>
					</span>
				</li>
				<li>
					<span class="label">风险等级</span>
					<span class="level-box level-box">
						<img
							src="@/assets/imgs/warning/high.png"
							alt=""
							v-if="detail.riskAlertRecordVO.riskLevel === 'HIGH'"
							style="width: 10px; margin-right: 4px"
						/>
						<img
							src="@/assets/imgs/warning/medium.png"
							alt=""
							v-if="detail.riskAlertRecordVO.riskLevel === 'MEDIUM'"
							style="width: 10px; margin-right: 4px"
						/>
						<img
							src="@/assets/imgs/warning/low.png"
							alt=""
							v-if="detail.riskAlertRecordVO.riskLevel === 'LOW'"
							style="width: 10px; margin-right: 4px"
						/>
						<div :class="detail.riskAlertRecordVO.riskLevel">
							{{ detail.riskAlertRecordVO.riskLevelDesc }}
						</div>
					</span>
				</li>
				<li>
					<span class="label">规则类型</span>
					<span>{{ detail.riskAlertRecordVO.alertTypeDesc }}</span>
				</li>
				<li>
					<span class="label">规则名称</span>
					<span> {{ detail.riskAlertRecordVO.ruleName }}</span>
				</li>
				<li>
					<span class="label">预警内容</span>
					<span>
						<a-tooltip>
							<template slot="title">
								{{ detail.riskAlertRecordVO.alertContent }}
							</template>
							<div class="omit">{{ detail.riskAlertRecordVO.alertContent }}</div>
						</a-tooltip>
					</span>
				</li>
				<li>
					<span class="label">仓库名称</span>
					<span>{{ detail.riskAlertRecordVO.bindingName }}</span>
				</li>
				<li>
					<span class="label">仓库联系人</span>
					<span>{{ detail.riskAlertRecordVO.contacts }}</span>
				</li>
				<li style="width: 100%">
					<span class="label">联系电话</span>
					<span>{{ detail.riskAlertRecordVO.contactPhone }}</span>
				</li>
			</ul>
			<div style="margin-top: 50px">
				<span class="slTitleAssis">预警明细</span>
			</div>
			<div class="rule-detail">
				<img
					src="@/assets/imgs/warning/crame.png"
					alt=""
				/>
				<span>{{ detail.deviceRiskAlertRecordVO.riskDetail }}</span>
				<span style="margin-left: 20px; color: rgba(0, 0, 0, 0.8)">{{ detail.deviceRiskAlertRecordVO.alertTime }}</span>
			</div>
			<div
				style="margin-top: 30px"
				v-if="detail.deviceRiskAlertRecordVO.monitorDeviceInfo"
			>
				<span class="video-title">异常影像</span>
			</div>
			<div
				class="video-box"
				@click="openVideo"
				v-if="detail.deviceRiskAlertRecordVO.monitorDeviceInfo"
				:class="{ active: detail.deviceRiskAlertRecordVO.monitorDeviceInfo.previewPic }"
			>
				<img
					class="video-img"
					style="width: 100%; filter: blur(2px); border-radius: 6px"
					:src="ENV.BASE_NET + detail.deviceRiskAlertRecordVO.monitorDeviceInfo.previewPic"
					alt=""
				/>
				<div class="play-box">
					<img
						class="play-img"
						src="@/assets/imgs/warning/play.png"
						alt=""
					/>
				</div>
			</div>
			<div style="margin-top: 50px">
				<span class="slTitleAssis">预警处理日志</span>
			</div>
			<a-table
				:columns="columns"
				rowKey="id"
				class="new-table"
				style="margin-top: 20px"
				:dataSource="detail.processLogList"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<div
					slot="proposer"
					slot-scope="proposer, record"
				>
					<p>{{ record.proposer }}</p>
					<p>{{ record.proposerMobile }}</p>
				</div>
				<div
					slot="approverName"
					slot-scope="approverName, record"
				>
					<p>{{ record.approverName }}</p>
					<p>{{ record.approverMobile }}</p>
				</div>
				<div
					slot="auditResult"
					slot-scope="auditResult, record"
				>
					<p v-if="record.auditResult && record.auditResult == 1">解除预警</p>
					<p v-if="record.auditResult && record.auditResult == 2">审批驳回</p>
					<p v-if="record.auditResult && record.auditResult == 3">延期预警</p>
				</div>
				<div
					slot="attachmentList"
					slot-scope="files, record"
				>
					<a
						v-for="item in record.attachmentList"
						:key="item.attachmentId"
						@click="handlePreview(item)"
						style="margin-left: 5px"
						>{{ item.fileName }}
					</a>
				</div>
			</a-table>
			<div v-if="detail.riskAlertRecordVO.alertStatus != 'PROCESSED' && detail.riskAlertRecordVO.ruleNo == 'YJSXT0002'">
				<div style="margin-top: 50px">
					<span class="slTitleAssis">解除预警</span>
				</div>
				<div class="tip">
					<img
						src="@/assets/imgs/warning/warning.png"
						alt=""
					/>
					<span>请填写预警解除说明并上传解除后的摄像头照片，提交信息后，即可解除预警</span>
				</div>
				<a-form :form="form">
					<a-form-item label="预警解除说明">
						<div class="remark-box">
							<a-textarea
								:rows="5"
								:autosize="false"
								:maxLength="100"
								class="remark"
								v-decorator="['remark', { rules: [{ required: true, message: '请输入', whitespace: true }] }]"
								placeholder="请输入解除遮挡预警的情况说明"
							/>

							<span class="max">100</span>
						</div>
					</a-form-item>

					<a-form-item label="附件上传">
						<div class="attach-box">
							<div
								class="upload-box"
								v-for="(item, index) in attachList"
								:key="index"
							>
								<img
									class="del"
									@click="del(index)"
									src="@/assets/imgs/warning/del.png"
									alt=""
								/>
								<img
									@click="handlePreview(item)"
									v-if="isPdf(item.url)"
									class="pdf"
									src="@/assets/imgs/warning/pdf.png"
									alt=""
								/>
								<img
									@click="handlePreview(item)"
									v-else
									:src="ENV.BASE_NET + item.url"
									alt=""
								/>
							</div>
							<a-upload
								name="file"
								class="picture-card"
								list-type="picture-card"
								:multiple="false"
								:headers="headers"
								:accept="accept"
								:fileList="fileList"
								:size="100"
								v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
								:showUploadList="false"
								:beforeUpload="beforeUpload"
								@change="fileChange"
							>
								<div class="upload-box-btn">
									<img
										src="@/v2/assets/imgs/storage/steel/upload.png"
										alt=""
									/>
								</div>
							</a-upload>
						</div>
					</a-form-item>
					<div class="tip2">
						<p>支持pdf，jpg，jpeg，png，bmp格式，文件大小不超过100M，请上传站台摄像头</p>
						<p>遮挡解除的照片(请直面摄像头进行拍照)</p>
					</div>
				</a-form>
				<div class="btn-wrapper">
					<a-button
						type="primary"
						style="width: 114px"
						@click="onSubmit"
						>提交</a-button
					>
				</div>
			</div>
		</a-card>
		<image-viewer ref="imageViewer" />
		<VideoMonitorModal ref="videoMonitorModal" />

		<a-modal
			title=""
			:visible="visible"
			:footer="null"
			:closable="false"
			class="off-line"
			:centered="true"
		>
			<div class="off-box">
				<img
					style="width: 100%; height: 100%"
					v-if="detail.deviceRiskAlertRecordVO.monitorDeviceInfo"
					:src="detail.deviceRiskAlertRecordVO.monitorDeviceInfo.previewPic"
					alt=""
				/>
				<div class="off-tip">
					<img
						style="width: 40px"
						src="@/assets/imgs/warning/camera_white.png"
						alt=""
					/>
					<p>设备已离线，请及时处理！</p>
				</div>
				<img
					class="off-del"
					src="@/assets/imgs/warning/close.png"
					alt=""
					@click="visible = false"
				/>
			</div>
		</a-modal>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import VideoMonitorModal from './components/VideoMonitorModal.vue';
import { API_riskAlertDetail, API_saveComplainData, API_GETCURRENTENV } from '@/v2/center/monitoring/api';
import { artificialProcess } from '@/v2/center/message/api';
import { commonUpload } from '@/v2/center/steelStorage/api';
import { contractAttachFilesUpload, commonAttachFilesUpload } from '@/v2/api/upload';
import { mapGetters } from 'vuex';
import ENV from '@/v2/config/env';
import { value } from 'lodash';
export default {
	data() {
		return {
			detail: {
				riskAlertRecordVO: {},
				deviceRiskAlertRecordVO: {
					monitorDeviceInfo: null
				}
			},
			columns: [
				{ title: '操作时间', dataIndex: 'createTime' },
				{ title: '操作人员', dataIndex: 'createName' },
				{ title: '操作类型', dataIndex: 'operationTypeDesc' },
				{ title: '处理意见', dataIndex: 'remark' },
				{ title: '附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' } }
			],
			dataSource: [],
			form: this.$form.createForm(this),
			fileList: [],
			accept: '.pdf,.jpg,.jpeg,.png,.bmp',
			beginUpload: false,
			attachList: [],
			disabled: false,
			visible: false,
			ENV
		};
	},
	watch: {
		$route() {
			this.getDetail();
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
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const res = await API_riskAlertDetail({ id: this.$route.query.id });
			this.detail = res.result;
		},
		handlePreview(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
		},
		handlePreview2(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
			// const url = `${ENV.BASE_NET}${items.url}`
			// filePreview(url, this.$refs.imageViewer.show);
		},
		//上传前校验
		beforeUpload(file) {
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
			formData.append('terminalContractId', '');

			try {
				const res = await contractAttachFilesUpload(formData);
				const obj = res.data;
				obj.name = obj.fileName;
				obj.url = `${obj.fileUrl}`;
				obj.type = 'DESCRIPTION';

				this.attachList.push(obj);
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		fileChange() {},
		del(index) {
			this.attachList.forEach((el, i, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
		},
		isPdf(url) {
			const str = url.split('?')[0].split('.').pop().toLowerCase();
			return str.includes('pdf');
		},
		openVideo(item) {
			if (this.detail.riskAlertRecordVO.ruleNo == 'YJSXT0001') {
				this.visible = true;
				return;
			}
			this.$refs.videoMonitorModal.toControl({
				cameraIndexCode: this.detail.riskAlertRecordVO.deviceIndexCode,
				cameraName: this.detail.riskAlertRecordVO.name,
				control: this.detail.riskAlertRecordVO.control || false,
				videoUrl: this.detail.riskAlertRecordVO.videoUrl
			});
		},
		onSubmit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					const params = {
						remark: values.remark,
						fileInfoList: this.attachList,
						riskAlertNo: this.detail.riskAlertRecordVO.serialNo,
						riskAlertId: this.detail.riskAlertRecordVO.id,
						type: 'PROCESSED',
						id: this.$route.query.id
					};
					if (this.disabled) {
						return;
					}
					this.disabled = true;
					try {
						const res = await artificialProcess(params);
						this.$message.success('操作成功');
						this.disabled = false;
						this.$router.go(-1);
					} catch (error) {
						this.disabled = false;
					}
				}
			});
		}
	},
	components: {
		Breadcrumb,
		imageViewer,
		VideoMonitorModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.divider {
	margin-bottom: 30px;
}
.grid-wrap {
	margin-top: 20px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
.warning-status {
	// display: inline-block;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}
.warning-status.TO_BE_PROCESS {
	background: #c1d7ff;
	color: #4682f3;
}

.warning-status.DELAY_HANDLE {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.TO_BE_APPROVED {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.APPROVED_REJECT {
	background: #f8dde8;
	color: #db81a5;
}

.warning-status.PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}

.warning-status.ARTIFICIAL_PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}
.HIGH {
	color: #f25f56;
}
.MEDIUM {
	color: #f5822e;
}
.LOW {
	color: #147cf6;
}
.level-box {
	display: flex !important;
	align-items: center;
	// justify-content: center;
}
.omit {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.rule-detail {
	display: flex;
	align-items: center;
	margin-top: 20px;
	img {
		width: 16px;
		margin-right: 5px;
	}
	span {
		color: rgba(0, 0, 0, 0.4);
	}
}
.video-title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	/* identical to box height, or 100% */
	color: rgba(0, 0, 0, 0.8);
}
.video-box {
	margin-top: 16px;
	width: 544px;
	height: 306px;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(5px);
	position: relative;
	/* Note: backdrop-filter has minimal browser support */

	border-radius: 6px;
	&.active {
		background: inherit;
	}
	.play-box {
		width: 42px;
		height: 42px;
		position: absolute;
		transform: translateX(-50%) translateY(-50%);
		left: 50%;
		top: 50%;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.play-img {
		width: 18px;
	}
}
.tip {
	background: #e1eafe;
	border: 1px solid #d0dfff;
	border-radius: 4px;
	display: flex;
	align-items: center;
	padding: 10px 14px;
	color: rgba(0, 0, 0, 0.8);
	margin-top: 16px;
	margin-bottom: 5px;
	img {
		width: 16px;
		margin-right: 12px;
	}
}
.tip2 {
	color: rgba(0, 0, 0, 0.4);
	font-size: 12px;
}
.upload-box {
	width: 192px;
	height: 112px;
	margin-right: 14px;
	margin-bottom: 14px;

	border: 1px solid #e5e6eb;
	border-radius: 4px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	.file {
		color: #4682f3;
		cursor: pointer;
		font-size: 20px;
	}
	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
	.del {
		position: absolute;
		width: 16px;
		height: 16px;
		background: #000000;
		right: 14px;
		top: 14px;
		opacity: 0.2;
		border-radius: 61.8333px;
	}

	.pdf {
		width: 36px;
		height: 36px;
	}
}
.remark-box {
	position: relative;
	.max {
		position: absolute;
		right: 12px;
		bottom: 12px;
		color: rgba(119, 136, 157, 0.5);
	}
}
.remark {
	height: 110px;
}
/deep/ .ant-upload.ant-upload-select-picture-card {
	border: 0;
	margin: 0;
	width: 192px;
	height: 112px;
	background: #f3f5f6;
	border: 1px dashed #e5e6eb;
	border-radius: 4px;
}
/deep/ .ant-form-item {
	margin-bottom: 5px;
}
.attach-box {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
/deep/ .ant-upload-picture-card-wrapper {
	width: inherit;
	margin-bottom: 14px;
}
.btn-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 45px 0;
}
.off-line {
	/deep/ .ant-modal {
		width: 850px !important;
	}
	/deep/ .ant-modal-content {
		background: transparent;
		box-shadow: none;
		width: 850px;
		height: 450px;
	}
	/deep/ .ant-modal-body {
		width: 100%;
		height: 100%;
		padding: 0;
	}
	.off-box {
		width: 850px;
		height: 450px;
		background: rgba(23, 24, 26, 0.3);
		backdrop-filter: blur(7px);
		position: relative;
	}
	.off-tip {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		text-align: center;
		color: #fff;
		p {
			margin-top: 20px;
		}
	}
	.off-del {
		position: absolute;
		right: -20px;
		top: -10px;
		width: 20px;
		cursor: pointer;
	}
}
</style>
